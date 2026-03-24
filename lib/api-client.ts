/**
 * lib/api-client.ts
 * Typed API client for the Social Inference Engine backend.
 * Source of truth for endpoint paths: app/api/main.py router prefixes.
 *
 * All functions throw on non-2xx responses so callers can catch and display
 * user-facing errors without checking status codes themselves.
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

// ── Types ─────────────────────────────────────────────────────────────────────

export type SignalType =
  | 'lead_opportunity'
  | 'competitor_weakness'
  | 'influencer_amplification'
  | 'churn_risk'
  | 'misinformation_risk'
  | 'support_escalation'
  | 'product_confusion'
  | 'feature_request_pattern'
  | 'launch_moment'
  | 'trend_to_content'

export type PriorityTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type ActionType = 'dm_outreach' | 'reply_public' | 'internal_alert' | 'create_content' | 'monitor' | 'dismiss'
export type ResponseTone = 'professional' | 'empathetic' | 'informational' | 'assertive'

export interface SignalQueueItem {
  id: string
  signal_type: SignalType
  platform: string
  original_url: string
  evidence_spans: string[]
  confidence: number
  priority_tier: PriorityTier
  priority_score: number
  urgency_score: number
  opportunity_score: number
  risk_score: number
  created_at: string
  assigned_to?: string | null
  action_taken?: ActionType | null
  action_taken_at?: string | null
}

export interface SignalQueueResponse {
  signals: SignalQueueItem[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}

export interface ActionPayload {
  action_type: ActionType
  notes: string
  response_tone: ResponseTone
}

export interface ActionResponse {
  signal_id: string
  action_type: ActionType
  acting_user: string
  performed_at: string
}

export interface FeedbackPayload {
  predicted_type: SignalType
  true_type: SignalType
  notes?: string
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  database: 'ok' | 'error'
  redis: 'ok' | 'error'
  version?: string
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Returns a JWT access token on success.
 */
export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail?.detail ?? `Login failed (${res.status})`)
  }
  const data = await res.json()
  return data.access_token as string
}

// ── Signal Queue ──────────────────────────────────────────────────────────────

export interface QueueParams {
  signal_types?: SignalType[]
  min_urgency?: number
  priority_tier?: PriorityTier
  limit?: number
  page?: number
  assigned_to?: string
}

/**
 * GET /api/v1/signals/queue
 * Returns the prioritised signal queue for the authenticated user.
 */
export async function getSignalQueue(
  token: string,
  params: QueueParams = {},
): Promise<SignalQueueResponse> {
  const q = new URLSearchParams()
  if (params.signal_types?.length)  q.set('signal_types', params.signal_types.join(','))
  if (params.min_urgency != null)   q.set('min_urgency',  String(params.min_urgency))
  if (params.priority_tier)         q.set('priority_tier', params.priority_tier)
  if (params.limit != null)         q.set('limit', String(params.limit))
  if (params.page != null)          q.set('page', String(params.page))
  if (params.assigned_to)           q.set('assigned_to', params.assigned_to)

  const res = await fetch(`${BASE}/api/v1/signals/queue?${q}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Queue fetch failed (${res.status})`)
  return res.json()
}

// ── Act on Signal ─────────────────────────────────────────────────────────────

/**
 * POST /api/v1/signals/{id}/act
 * Record that the analyst has taken an action on a signal.
 */
export async function actOnSignal(
  token: string,
  signalId: string,
  payload: ActionPayload,
): Promise<ActionResponse> {
  const res = await fetch(`${BASE}/api/v1/signals/${signalId}/act`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Act failed (${res.status})`)
  return res.json()
}

// ── Feedback (calibration) ───────────────────────────────────────────────────

/**
 * POST /api/v1/signals/{id}/feedback
 * Submit a classification correction that triggers one calibrator update step.
 */
export async function submitFeedback(
  token: string,
  signalId: string,
  payload: FeedbackPayload,
): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/signals/${signalId}/feedback`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Feedback submission failed (${res.status})`)
}

// ── Health ────────────────────────────────────────────────────────────────────

/**
 * GET /health
 * Returns true if the API is reachable and healthy.
 * Times out after 3 seconds to avoid blocking the UI.
 */
export async function healthCheck(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${BASE}/health`, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ── SSE stream helper ─────────────────────────────────────────────────────────

/**
 * Returns the full URL for the SSE signals stream.
 * The caller is responsible for creating and managing the EventSource.
 *
 * Usage:
 *   const es = new EventSource(sseStreamUrl(token))
 *   es.onmessage = (e) => { const signal = JSON.parse(e.data) }
 */
export function sseStreamUrl(token: string): string {
  return `${BASE}/api/v1/signals/stream?token=${encodeURIComponent(token)}`
}

