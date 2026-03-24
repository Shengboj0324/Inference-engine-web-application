import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Full REST API reference for Social Inference Engine. Includes endpoint signatures, request/response schemas, and authentication details.',
}

const endpoints = [
  {
    section: 'Authentication',
    routes: [
      { method: 'POST', path: '/api/v1/auth/login',   auth: false, desc: 'Exchange email + password for a JWT access token.', body: '{ email, password }',      response: '{ access_token, token_type, expires_in }' },
      { method: 'POST', path: '/api/v1/auth/refresh',  auth: true,  desc: 'Refresh an expiring access token.',                   body: 'Bearer token in header', response: '{ access_token, expires_in }' },
    ],
  },
  {
    section: 'Signal Queue',
    routes: [
      { method: 'GET',  path: '/api/v1/signals/queue',          auth: true, desc: 'Fetch the prioritised signal queue. Supports filtering by signal_type, priority_tier, min_urgency, page, limit.', body: 'Query params',        response: 'SignalQueueResponse' },
      { method: 'GET',  path: '/api/v1/signals/stream',         auth: true, desc: 'Server-Sent Events stream. Pushes new signals as they are classified. Pass token as ?token= query param.', body: 'token query param',   response: 'text/event-stream' },
      { method: 'GET',  path: '/api/v1/signals/{id}',           auth: true, desc: 'Fetch a single signal by ID including evidence spans, scores, and action history.', body: '—',                response: 'SignalDetail' },
      { method: 'POST', path: '/api/v1/signals/{id}/act',       auth: true, desc: 'Record an action on a signal (dm_outreach, reply_public, internal_alert, create_content, monitor, dismiss).', body: 'ActionPayload',      response: 'ActionResponse' },
      { method: 'POST', path: '/api/v1/signals/{id}/feedback',  auth: true, desc: 'Submit a classification correction. Triggers one calibrator gradient-descent step immediately.', body: 'FeedbackPayload',    response: '{ updated: true }' },
      { method: 'POST', path: '/api/v1/signals/{id}/assign',    auth: true, desc: 'Assign a signal to a specific analyst (MANAGER role required).', body: '{ user_id }',         response: 'SignalDetail' },
    ],
  },
  {
    section: 'Platform Connectors',
    routes: [
      { method: 'GET',  path: '/api/v1/connectors',            auth: true, desc: 'List all configured platform connectors and their status.',       body: '—', response: 'ConnectorList' },
      { method: 'POST', path: '/api/v1/connectors/{name}/test', auth: true, desc: 'Trigger a test fetch for a specific connector and return the results.', body: '—', response: 'FetchResult' },
    ],
  },
  {
    section: 'Calibration',
    routes: [
      { method: 'GET',  path: '/api/v1/calibration/state',     auth: true, desc: 'Return the current temperature scalar for each signal type.',    body: '—',             response: 'CalibrationState' },
      { method: 'POST', path: '/api/v1/calibration/reset',     auth: true, desc: 'Reset all scalars to 1.0 (uncalibrated). MANAGER role required.', body: '—',            response: '{ reset: true }' },
    ],
  },
  {
    section: 'Health',
    routes: [
      { method: 'GET', path: '/health', auth: false, desc: 'Returns API, database, and Redis health. Excluded from rate limiting.', body: '—', response: '{ status, database, redis, version }' },
    ],
  },
]

const methodColors: Record<string, string> = {
  GET:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  POST:   'bg-blue-500/10   text-blue-400   border-blue-500/20',
  PUT:    'bg-amber-500/10  text-amber-400  border-amber-500/20',
  DELETE: 'bg-red-500/10    text-red-400    border-red-500/20',
}

export default function ApiPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-2 text-xs text-sie-muted mb-4 font-mono">
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <span>/</span><span className="text-white">API Reference</span>
            </div>
            <div className="section-label mb-3">API REFERENCE</div>
            <h1 className="text-4xl font-black text-white mb-3">REST API</h1>
            <p className="text-base text-sie-muted leading-relaxed max-w-2xl mb-4">
              Social Inference Engine exposes a FastAPI-generated REST API with full OpenAPI 3.1 documentation.
              Browse the interactive Swagger UI at <code className="text-blue-300">http://localhost:8000/docs</code> when your instance is running.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-xl glass border border-sie-border text-white/60">Base URL: http://localhost:8000</span>
              <span className="px-3 py-1.5 rounded-xl glass border border-blue-500/20 text-blue-400">Auth: Bearer JWT</span>
              <span className="px-3 py-1.5 rounded-xl glass border border-amber-500/20 text-amber-400">Rate limit: 60 req/min</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Auth note */}
          <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 text-sm text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-300">Authentication:</span> All endpoints except <code className="text-amber-100">/health</code> and{' '}
            <code className="text-amber-100">POST /api/v1/auth/login</code> require a valid JWT in the{' '}
            <code className="text-amber-100">Authorization: Bearer &lt;token&gt;</code> header.
            Tokens expire after 60 minutes. Use <code className="text-amber-100">POST /api/v1/auth/refresh</code> before expiry.
          </div>

          {/* Endpoint sections */}
          {endpoints.map((section) => (
            <section key={section.section}>
              <h2 className="text-xl font-bold text-white mb-5">{section.section}</h2>
              <div className="flex flex-col gap-4">
                {section.routes.map((route, i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                    <div className="px-5 py-3.5 flex flex-wrap items-center gap-3 bg-white/[0.02]">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border font-mono ${methodColors[route.method]}`}>{route.method}</span>
                      <code className="text-sm font-mono text-white">{route.path}</code>
                      {route.auth
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-auto">JWT required</span>
                        : <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-auto">Public</span>
                      }
                    </div>
                    <div className="px-5 py-3 border-t border-sie-border/30">
                      <p className="text-sm text-sie-muted leading-relaxed mb-3">{route.desc}</p>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="glass-light rounded-lg p-3">
                          <div className="text-sie-muted mb-1 font-sans font-semibold">Request body / params</div>
                          <span className="text-cyan-300">{route.body}</span>
                        </div>
                        <div className="glass-light rounded-lg p-3">
                          <div className="text-sie-muted mb-1 font-sans font-semibold">Response schema</div>
                          <span className="text-emerald-300">{route.response}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Swagger link */}
          <div className="glass rounded-2xl p-6 text-center border border-sie-cyan/10">
            <h3 className="text-base font-bold text-white mb-2">Interactive Swagger UI</h3>
            <p className="text-sm text-sie-muted mb-4">
              When your Social Inference Engine instance is running, browse the full interactive API documentation at:
            </p>
            <code className="block text-sm text-blue-300 font-mono bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3 mb-4">
              http://localhost:8000/docs
            </code>
            <p className="text-xs text-sie-muted">The ReDoc alternative is available at <code className="text-blue-300">http://localhost:8000/redoc</code></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

