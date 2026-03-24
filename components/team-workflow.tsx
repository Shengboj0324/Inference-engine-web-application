'use client'
import { Users, Radio, RefreshCw } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Role-based queue management',
    body: 'Three roles — VIEWER, ANALYST, MANAGER — control what each team member sees and can do. Managers see all signals including those assigned to other analysts. Viewers see the queue but cannot act. Analysts can act, dismiss, and submit feedback.',
    visual: (
      <div className="flex flex-col gap-2">
        {[
          { role: 'MANAGER', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', signals: 5, badge: 'All signals' },
          { role: 'ANALYST', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', signals: 3, badge: 'Assigned' },
          { role: 'VIEWER', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', signals: 0, badge: 'Read only' },
        ].map((r) => (
          <div key={r.role} className="flex items-center gap-3 glass-light rounded-xl p-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${r.color}`}>{r.role}</span>
            <span className="text-xs text-sie-muted flex-1">{r.badge}</span>
            {r.signals > 0 && (
              <span className="text-xs font-mono text-white bg-white/10 px-2 py-0.5 rounded-full">{r.signals} signals</span>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Radio,
    title: 'Real-time signal delivery via SSE',
    body: 'New signals are pushed to connected clients over a persistent Server-Sent Events connection as soon as they are classified — no polling, no webhook setup, no third-party push service. Connect with a single curl command.',
    visual: (
      <div className="glass-light rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/60" /><div className="w-2 h-2 rounded-full bg-yellow-500/60" /><div className="w-2 h-2 rounded-full bg-green-500/60" /></div>
          <span className="text-xs text-sie-muted font-mono">Terminal</span>
        </div>
        <div className="p-4 font-mono text-xs text-green-400 space-y-1">
          <div className="text-sie-muted">$ curl -N -H &quot;Authorization: Bearer $TOKEN&quot; \</div>
          <div className="text-sie-muted pl-5">-H &quot;Accept: text/event-stream&quot; \</div>
          <div className="text-sie-muted pl-5">http://localhost:8000/api/v1/signals/stream</div>
          <div className="mt-2 text-cyan-400">data: {`{"type":"churn_risk","confidence":0.87}`}</div>
          <div className="text-cyan-400">data: {`{"type":"lead_opportunity","confidence":0.79}`}</div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400">streaming...</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: RefreshCw,
    title: 'Online calibration — the queue gets better with every correction',
    body: "When the model misclassifies a signal, submit a correction via the API or the web UI. The ConfidenceCalibrator performs one gradient-descent step immediately — adjusting the temperature scalar for the corrected signal type without any service restart. Calibration improvements are visible in subsequent inferences within the same session.",
    visual: (
      <div className="flex flex-col gap-3">
        <div className="glass-light rounded-xl p-4">
          <div className="text-xs text-sie-muted mb-2">Feedback submission</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">feature_request</span>
            <span className="text-xs text-sie-muted">→</span>
            <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-mono">churn_risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full">
              <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
            </div>
            <span className="text-xs text-sie-muted font-mono">1 update · 6 µs</span>
          </div>
        </div>
        <div className="text-xs text-center text-emerald-400 font-mono animate-pulse">
          ✓ Temperature scalar adjusted immediately
        </div>
      </div>
    ),
  },
]

export default function TeamWorkflow() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sie-surface/30" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/6 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="section-label mb-4">TEAM WORKFLOW</div>
          <h2 className="section-heading mb-4">
            Built for teams.{' '}
            <span className="text-sie-cyan">Not inboxes.</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Social Inference Engine&apos;s signal queue is a shared workspace. Every action, assignment, and
            dismissal is timestamped, attributed to the acting user, and available to the whole team.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-16">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
            >
              {/* Copy */}
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                  <feat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feat.title}</h3>
                <p className="text-base text-sie-muted leading-relaxed">{feat.body}</p>
              </div>

              {/* Visual */}
              <div className="glass rounded-2xl p-6">
                {feat.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

