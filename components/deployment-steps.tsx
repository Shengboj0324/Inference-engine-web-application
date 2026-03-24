'use client'
import Link from 'next/link'
import { ArrowRight, Terminal, Server, CheckCircle } from 'lucide-react'
import { SITE } from '@/lib/copy'

const sysReqs = [
  { component: 'CPU', minimum: '4 cores', recommended: '8+ cores' },
  { component: 'RAM', minimum: '8 GB', recommended: '16 GB' },
  { component: 'Disk', minimum: '10 GB', recommended: '30 GB (model weights + data)' },
  { component: 'Python', minimum: '3.9', recommended: '3.11' },
  { component: 'Docker', minimum: '24.0+ (Compose v2)', recommended: 'Docker Desktop 4.28+' },
  { component: 'OS', minimum: 'macOS 12, Ubuntu 20.04, WSL2', recommended: 'macOS 14 / Ubuntu 22.04' },
]

const dockerSteps = [
  { comment: '# Step 1: Clone', code: `git clone ${SITE.repoUrl}.git\ncd Inference-Engine` },
  { comment: '# Step 2: Generate secrets and configure', code: 'cp .env.example .env\npython3 -c "import secrets; print(\'SECRET_KEY=\' + secrets.token_urlsafe(32))"\n# Paste values into .env, then add your OPENAI_API_KEY' },
  { comment: '# Step 3: Start everything', code: 'docker compose up' },
  { comment: '# Step 4: Run initial calibration', code: 'docker compose exec api python training/calibrate.py --epochs 5' },
  { comment: '# Step 5: Verify', code: 'curl http://localhost:8000/health' },
]

export default function DeploymentSteps() {
  return (
    <section id="get-started" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1a] via-[#0a1220] to-sie-dark" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Large center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label mb-4">GET STARTED</div>
          <h2 className="section-heading mb-6">
            Running in{' '}
            <span className="text-sie-cyan">5 minutes</span>{' '}
            on any machine.
          </h2>
          <p className="section-subheading mx-auto text-center">
            Social Inference Engine runs on macOS, Ubuntu, and Windows WSL2.
            No cloud account required. No SaaS sign-up. No data ever leaves your machine unless you configure
            an external LLM provider.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Option A — Docker Compose */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-sie-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Option A — Docker Compose</h3>
                  <p className="text-xs text-sie-muted">Starts the full stack in one command. Recommended.</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {dockerSteps.map((step, i) => (
                  <div key={i}>
                    <div className="text-xs text-emerald-400/70 font-mono mb-1">{step.comment}</div>
                    <div className="bg-[#0a0f1a] rounded-xl border border-sie-border/60 overflow-hidden">
                      <pre className="p-4 text-xs font-mono text-cyan-200 leading-6 overflow-x-auto whitespace-pre">
                        {step.code}
                      </pre>
                    </div>
                  </div>
                ))}

                {/* Expected output */}
                <div className="mt-4">
                  <div className="text-xs text-sie-muted mb-1 font-mono">Expected output:</div>
                  <div className="bg-[#0a1a0f] rounded-xl border border-emerald-500/20 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-semibold">Health check passed</span>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300/80 leading-5">
                      {`{"status": "healthy", "database": "ok", "redis": "ok"}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Option B + System requirements */}
          <div className="flex flex-col gap-6">
            {/* Option B */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Server className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Option B — Bare-metal</h3>
                  <p className="text-xs text-sie-muted">macOS / Ubuntu</p>
                </div>
              </div>
              <p className="text-sm text-sie-muted leading-relaxed mb-4">
                Run the application process directly — useful for debugging and IDE integration.
              </p>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-sm text-sie-cyan font-semibold hover:text-white transition-colors duration-200"
              >
                Full installation guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* System requirements */}
            <div className="glass rounded-2xl overflow-hidden flex-1">
              <div className="px-4 py-3 border-b border-sie-border/60">
                <h3 className="text-sm font-bold text-white">System Requirements</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-sie-border/40">
                      <th className="text-left px-4 py-2 text-sie-muted font-semibold"></th>
                      <th className="text-left px-4 py-2 text-sie-muted font-semibold">Min</th>
                      <th className="text-left px-4 py-2 text-sie-muted font-semibold">Recommended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sysReqs.map((r, i) => (
                      <tr key={i} className="border-b border-sie-border/20 hover:bg-white/[0.02]">
                        <td className="px-4 py-2 font-semibold text-white/70">{r.component}</td>
                        <td className="px-4 py-2 text-sie-muted font-mono">{r.minimum}</td>
                        <td className="px-4 py-2 text-sie-cyan font-mono">{r.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

