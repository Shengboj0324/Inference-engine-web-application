import LiveDemo from '@/components/live-demo'

/**
 * components/live-demo-section.tsx
 * Server Component wrapper for the Live Demo section.
 * Renders LiveDemo (Client Component) only when NEXT_PUBLIC_API_BASE_URL is set.
 * When it is not set, renders a "set up your instance" call-to-action instead.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export default function LiveDemoSection() {
  return (
    <section id="live-demo" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1a] to-sie-dark" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-900/8 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="section-label mb-4">LIVE DEMO</div>
          <h2 className="section-heading mb-4">
            Connect to your{' '}
            <span className="text-sie-cyan">own instance</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            {API_BASE
              ? 'Sign in below to browse your live signal queue, act on signals, and watch the SSE stream in real time.'
              : 'Deploy Social Inference Engine locally, then set NEXT_PUBLIC_API_BASE_URL to connect this page to your running instance.'}
          </p>
        </div>

        {API_BASE ? (
          /* Live demo panel */
          <LiveDemo />
        ) : (
          /* Setup CTA */
          <div className="glass rounded-2xl p-8 text-center border border-sie-border/60 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-5">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Set up your instance to enable the demo</h3>
            <p className="text-sm text-sie-muted leading-relaxed mb-5">
              This demo panel connects to a real Social Inference Engine API. Deploy your instance using Docker Compose (5 minutes),
              then set <code className="text-blue-300">NEXT_PUBLIC_API_BASE_URL=http://localhost:8000</code> in your <code className="text-blue-300">.env.local</code> and restart the dev server.
            </p>
            <div className="bg-[#080f1c] border border-sie-border/60 rounded-xl p-4 text-left mb-5">
              <pre className="text-xs font-mono text-cyan-200 leading-6 overflow-x-auto">{`# .env.local (website root)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Then restart the dev server
npm run dev`}</pre>
            </div>
            <a
              href="/docs/deployment"
              className="btn-primary inline-flex text-sm"
            >
              Deployment Guide →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

