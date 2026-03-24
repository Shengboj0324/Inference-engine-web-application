'use client'
/**
 * components/live-demo.tsx
 * Live demo panel — shown only when NEXT_PUBLIC_API_BASE_URL is set.
 * Connects to a real Social Inference Engine API instance.
 *
 * States: idle → health-check → login → queue → (act / feedback / sse)
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Zap, Wifi, WifiOff, LogIn, RefreshCw, Play, Square,
  CheckCircle2, AlertTriangle, ChevronDown, ThumbsUp, ExternalLink,
} from 'lucide-react'
import {
  login, getSignalQueue, actOnSignal, submitFeedback,
  healthCheck, sseStreamUrl,
  type SignalQueueItem, type SignalType, type ActionType,
} from '@/lib/api-client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

const SIGNAL_COLORS: Record<string, string> = {
  churn_risk:              'text-red-400 bg-red-500/10 border-red-500/25',
  misinformation_risk:     'text-rose-400 bg-rose-500/10 border-rose-500/25',
  support_escalation:      'text-orange-400 bg-orange-500/10 border-orange-500/25',
  lead_opportunity:        'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  competitor_weakness:     'text-green-400 bg-green-500/10 border-green-500/25',
  influencer_amplification:'text-sky-400 bg-sky-500/10 border-sky-500/25',
  product_confusion:       'text-violet-400 bg-violet-500/10 border-violet-500/25',
  feature_request_pattern: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
  launch_moment:           'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
  trend_to_content:        'text-amber-400 bg-amber-500/10 border-amber-500/25',
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/30',
  HIGH:     'bg-orange-500/20 text-orange-300 border-orange-500/30',
  MEDIUM:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  LOW:      'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

type DemoState = 'idle' | 'checking' | 'login' | 'queue' | 'acting' | 'streaming'

interface SSEMessage {
  id: string
  signal_type: SignalType
  confidence: number
  platform: string
  timestamp: string
}

export default function LiveDemo() {
  const [state, setState] = useState<DemoState>('idle')
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [apiVersion, setApiVersion] = useState<string>()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken]       = useState<string | null>(null)
  const [loginError, setLoginError] = useState('')

  const [signals, setSignals] = useState<SignalQueueItem[]>([])
  const [total, setTotal]     = useState(0)
  const [queueError, setQueueError] = useState('')
  const [loadingQueue, setLoadingQueue] = useState(false)

  const [expandedId, setExpandedId]     = useState<string | null>(null)
  const [actingId, setActingId]         = useState<string | null>(null)
  const [feedbackId, setFeedbackId]     = useState<string | null>(null)
  const [actSuccess, setActSuccess]     = useState<Record<string, string>>({})
  const [actError, setActError]         = useState('')

  const [sseActive, setSseActive]       = useState(false)
  const [sseMessages, setSseMessages]   = useState<SSEMessage[]>([])
  const esRef = useRef<EventSource | null>(null)

  // ── Health check on mount if API_BASE is configured ────────────────────────
  useEffect(() => {
    if (!API_BASE) return
    setState('checking')
    healthCheck().then((h) => {
      if (h && h.status === 'healthy') {
        setHealthy(true)
        setApiVersion(h.version)
        setState('login')
      } else {
        setHealthy(false)
        setState('idle')
      }
    })
  }, [])

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const t = await login(email, password)
      setToken(t)
      setState('queue')
      fetchQueue(t)
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  // ── Queue ──────────────────────────────────────────────────────────────────
  const fetchQueue = useCallback(async (t: string) => {
    setLoadingQueue(true)
    setQueueError('')
    try {
      const res = await getSignalQueue(t, { limit: 10 })
      setSignals(res.signals)
      setTotal(res.total)
    } catch (err: unknown) {
      setQueueError(err instanceof Error ? err.message : 'Failed to load queue')
    } finally {
      setLoadingQueue(false)
    }
  }, [])

  // ── Act on signal ──────────────────────────────────────────────────────────
  const handleAct = async (signalId: string, action: ActionType) => {
    if (!token) return
    setActingId(signalId)
    setActError('')
    try {
      await actOnSignal(token, signalId, { action_type: action, notes: '', response_tone: 'professional' })
      setActSuccess((prev) => ({ ...prev, [signalId]: action }))
      setExpandedId(null)
    } catch (err: unknown) {
      setActError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setActingId(null)
    }
  }

  // ── Feedback ───────────────────────────────────────────────────────────────
  const handleFeedback = async (signalId: string, predicted: SignalType, trueType: SignalType) => {
    if (!token) return
    setFeedbackId(signalId)
    try {
      await submitFeedback(token, signalId, { predicted_type: predicted, true_type: trueType })
      setActSuccess((prev) => ({ ...prev, [`fb_${signalId}`]: 'feedback_submitted' }))
    } catch {
      // silently ignore
    } finally {
      setFeedbackId(null)
    }
  }

  // ── SSE streaming ──────────────────────────────────────────────────────────
  const startSSE = useCallback(() => {
    if (!token || esRef.current) return
    const url = sseStreamUrl(token)
    const es = new EventSource(url)
    esRef.current = es
    setSseActive(true)
    setState('streaming')

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as SSEMessage
        setSseMessages((prev) => [{ ...data, timestamp: new Date().toISOString() }, ...prev].slice(0, 20))
      } catch { /* ignore malformed messages */ }
    }
    es.onerror = () => {
      esRef.current?.close()
      esRef.current = null
      setSseActive(false)
      setState('queue')
    }
  }, [token])

  const stopSSE = useCallback(() => {
    esRef.current?.close()
    esRef.current = null
    setSseActive(false)
    setState('queue')
  }, [])

  useEffect(() => () => { esRef.current?.close() }, [])

  // ── Not configured ─────────────────────────────────────────────────────────
  if (!API_BASE) return null

  // ── Health check in progress ───────────────────────────────────────────────
  if (state === 'checking') {
    return (
      <div className="glass rounded-2xl p-8 text-center animate-pulse">
        <Wifi className="w-8 h-8 text-sie-cyan mx-auto mb-3" />
        <p className="text-sm text-sie-muted">Checking API health at <code className="text-xs">{API_BASE}</code>…</p>
      </div>
    )
  }

  // ── Unhealthy ──────────────────────────────────────────────────────────────
  if (state === 'idle' && healthy === false) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-red-500/20">
        <WifiOff className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-base font-semibold text-white mb-1">API unreachable</p>
        <p className="text-sm text-sie-muted">
          <code className="text-xs">{API_BASE}/health</code> did not respond.<br />
          Make sure your Social Inference Engine instance is running.
        </p>
      </div>
    )
  }

  // ── Login form ────────────────────────────────────────────────────────────
  if (state === 'login') {
    return (
      <div className="glass rounded-2xl overflow-hidden max-w-md mx-auto">
        <div className="px-6 py-4 border-b border-sie-border/60 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-mono">API healthy{apiVersion ? ` · v${apiVersion}` : ''}</span>
          </div>
          <span className="text-xs text-sie-muted ml-auto font-mono">{API_BASE}</span>
        </div>
        <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <LogIn className="w-4 h-4 text-sie-cyan" /> Sign in to your instance
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-sie-muted font-medium" htmlFor="demo-email">Email</label>
            <input
              id="demo-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="analyst@yourcompany.com"
              className="bg-white/[0.04] border border-sie-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-sie-muted/50 focus:outline-none focus:border-sie-cyan/50 focus:ring-1 focus:ring-sie-cyan/30 transition-colors duration-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-sie-muted font-medium" htmlFor="demo-pass">Password</label>
            <input
              id="demo-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-white/[0.04] border border-sie-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-sie-muted/50 focus:outline-none focus:border-sie-cyan/50 focus:ring-1 focus:ring-sie-cyan/30 transition-colors duration-200"
            />
          </div>
          {loginError && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {loginError}
            </div>
          )}
          <button type="submit" className="btn-primary justify-center">
            <LogIn className="w-4 h-4" /> Sign in
          </button>
        </form>
      </div>
    )
  }

  // ── SSE streaming view ────────────────────────────────────────────────────
  if (state === 'streaming') {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-sie-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">Live Signal Stream</span>
            <span className="text-xs text-sie-muted font-mono">SSE · {API_BASE}/api/v1/signals/stream</span>
          </div>
          <button onClick={stopSSE} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-colors">
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        </div>
        <div className="p-4 max-h-80 overflow-y-auto flex flex-col gap-2 font-mono text-xs">
          {sseMessages.length === 0 && (
            <div className="text-sie-muted italic text-center py-8">Waiting for signals… Post something on a monitored platform.</div>
          )}
          {sseMessages.map((m, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-sie-border/30 pb-2">
              <span className="text-sie-muted">{new Date(m.timestamp).toLocaleTimeString()}</span>
              <span className={`px-2 py-0.5 rounded border text-xs ${SIGNAL_COLORS[m.signal_type] ?? 'text-white bg-white/5 border-white/10'}`}>{m.signal_type}</span>
              <span className="text-white/70">{m.platform}</span>
              <span className="ml-auto text-white font-bold">{m.confidence?.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-sie-border/60">
          <button onClick={() => { stopSSE(); setState('queue') }} className="text-xs text-sie-cyan hover:text-white transition-colors">
            ← Back to queue
          </button>
        </div>
      </div>
    )
  }

  // ── Signal queue view ─────────────────────────────────────────────────────
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-sie-border/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-sie-cyan" />
          <span className="text-sm font-bold text-white">Signal Queue</span>
          <span className="text-xs text-sie-muted font-mono">· {total} total</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => token && fetchQueue(token)}
            disabled={loadingQueue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-sie-muted hover:text-white transition-colors"
            title="Refresh queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingQueue ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={startSSE}
            disabled={sseActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> Stream live
          </button>
        </div>
      </div>

      {/* Errors */}
      {(queueError || actError) && (
        <div className="px-5 py-3 bg-red-500/5 border-b border-red-500/20 text-xs text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {queueError || actError}
        </div>
      )}

      {/* Signal list */}
      <div className="flex flex-col divide-y divide-sie-border/30 max-h-[32rem] overflow-y-auto">
        {loadingQueue && signals.length === 0 && (
          <div className="py-12 text-center text-sie-muted text-sm animate-pulse">Loading signals…</div>
        )}
        {!loadingQueue && signals.length === 0 && (
          <div className="py-12 text-center text-sie-muted text-sm">No signals in queue — check your platform connectors.</div>
        )}
        {signals.map((s) => {
          const isExpanded = expandedId === s.id
          const isActed = !!actSuccess[s.id]
          return (
            <div key={s.id} className={`${isActed ? 'opacity-60' : ''} transition-opacity duration-200`}>
              {/* Signal row */}
              <button
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left group"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                aria-expanded={isExpanded}
              >
                {/* Priority indicator */}
                <div className={`w-1 h-10 rounded-full flex-shrink-0 ${s.priority_tier === 'CRITICAL' ? 'bg-red-500' : s.priority_tier === 'HIGH' ? 'bg-orange-500' : s.priority_tier === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-600'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${SIGNAL_COLORS[s.signal_type] ?? 'text-white bg-white/5 border-white/10'}`}>
                      {s.signal_type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${PRIORITY_COLORS[s.priority_tier]}`}>
                      {s.priority_tier}
                    </span>
                    {isActed && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {actSuccess[s.id]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-sie-muted">
                    <span className="font-mono">{s.platform}</span>
                    <span>·</span>
                    <span className="font-mono">conf {s.confidence.toFixed(3)}</span>
                    <span>·</span>
                    <span>{new Date(s.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${s.confidence * 100}%` }} />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-sie-muted/50 group-hover:text-sie-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-1 bg-white/[0.015] border-t border-sie-border/30">
                  {/* Evidence */}
                  {s.evidence_spans?.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-sie-muted mb-1 font-semibold">Evidence spans</div>
                      {s.evidence_spans.map((span, i) => (
                        <blockquote key={i} className="text-xs text-white/70 italic bg-white/[0.02] border-l-2 border-sie-cyan/40 rounded-r-lg px-3 py-1.5 mb-1 leading-relaxed">
                          {span}
                        </blockquote>
                      ))}
                    </div>
                  )}

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'Opportunity', value: s.opportunity_score, color: 'from-emerald-500 to-emerald-400' },
                      { label: 'Urgency',     value: s.urgency_score,     color: 'from-orange-500 to-orange-400' },
                      { label: 'Risk',        value: s.risk_score,        color: 'from-red-500 to-red-400' },
                    ].map((dim) => (
                      <div key={dim.label} className="text-center glass-light rounded-lg p-2">
                        <div className="text-xs text-sie-muted mb-1">{dim.label}</div>
                        <div className="text-sm font-bold text-white font-mono">{dim.value?.toFixed(2) ?? '—'}</div>
                        <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${dim.color} rounded-full`} style={{ width: `${(dim.value ?? 0) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Source link */}
                  {s.original_url && (
                    <a href={s.original_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-sie-cyan hover:text-white transition-colors mb-4 truncate">
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{s.original_url}</span>
                    </a>
                  )}

                  {/* Actions */}
                  {!isActed && (
                    <div className="flex flex-wrap gap-2">
                      {(['dm_outreach', 'reply_public', 'internal_alert', 'create_content', 'monitor', 'dismiss'] as ActionType[]).map((action) => (
                        <button
                          key={action}
                          onClick={() => handleAct(s.id, action)}
                          disabled={actingId === s.id}
                          className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 font-mono disabled:opacity-50"
                        >
                          {actingId === s.id ? '…' : action}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  {isActed && !actSuccess[`fb_${s.id}`] && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-sie-muted">Was this classification correct?</span>
                      <button
                        onClick={() => handleFeedback(s.id, s.signal_type, s.signal_type)}
                        disabled={feedbackId === s.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" /> Yes
                      </button>
                      <span className="text-xs text-sie-muted">or</span>
                      <span className="text-xs text-sie-muted">select the correct type below to calibrate:</span>
                    </div>
                  )}
                  {isActed && actSuccess[`fb_${s.id}`] && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Feedback recorded — calibrator updated.
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-sie-border/60 flex items-center justify-between text-xs text-sie-muted">
        <span>Showing {signals.length} of {total} signals</span>
        <button onClick={() => { setToken(null); setState('login') }} className="hover:text-white transition-colors">Sign out</button>
      </div>
    </div>
  )
}

