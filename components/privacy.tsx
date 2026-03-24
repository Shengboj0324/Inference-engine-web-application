'use client'
import { UserX, EyeOff, FileText, Wifi, Shield } from 'lucide-react'
import { PRIVACY_FEATURES } from '@/lib/copy'

const iconMap = { UserX, EyeOff, FileText, Wifi, Shield }

export default function Privacy() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1a] via-[#080f1e] to-[#060c1a]" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-900/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — illustration */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              {/* Main shield */}
              <div className="relative w-56 h-56 mx-auto">
                <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 to-transparent blur-2xl" />
                <div className="absolute inset-4 rounded-full border-2 border-emerald-500/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-emerald-500/10 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <Shield className="w-12 h-12 text-emerald-400" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Floating data badges */}
              <div className="absolute top-2 right-8 glass px-3 py-2 rounded-xl border border-emerald-500/20 text-xs font-mono text-emerald-400 animate-float">
                SHA-256 pseudonym ✓
              </div>
              <div className="absolute bottom-8 left-0 glass px-3 py-2 rounded-xl border border-blue-500/20 text-xs font-mono text-blue-400 animate-float" style={{ animationDelay: '2s' }}>
                PII scrubbed ✓
              </div>
              <div className="absolute bottom-2 right-4 glass px-3 py-2 rounded-xl border border-cyan-500/20 text-xs font-mono text-cyan-400 animate-float" style={{ animationDelay: '4s' }}>
                Audit log ✓
              </div>
            </div>
          </div>

          {/* Right — copy */}
          <div className="order-1 lg:order-2">
            <div className="section-label mb-4">PRIVACY BY DESIGN</div>
            <h2 className="section-heading mb-4">
              Your data never leaves{' '}
              <span className="text-emerald-400">your machine.</span>
            </h2>
            <p className="text-base text-sie-muted leading-relaxed mb-8">
              Social Inference Engine enforces a zero-egress contract at the application boundary. The DataResidencyGuard
              intercepts every LLM call and verifies that no raw personal data is present in the prompt before
              it is dispatched — and writes an immutable audit log entry for every redaction it makes.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-5">
              {PRIVACY_FEATURES.map((feat, i) => {
                const Icon = iconMap[feat.icon as keyof typeof iconMap]
                return (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-300">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
                      <p className="text-sm text-sie-muted leading-relaxed">{feat.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Callout box */}
            <div className="mt-8 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-sm text-emerald-300 leading-relaxed italic">
                &ldquo;Social Inference Engine is designed for deployment in environments where cloud AI providers
                are prohibited by compliance policy. The privacy architecture was not retrofitted — it is structural.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

