'use client'
import { Download, Filter, Wand2, Search, Brain, Sparkles } from 'lucide-react'
import { PIPELINE_STEPS } from '@/lib/copy'

const iconMap = {
  Download, Filter, Wand2, Search, Brain, Sparkles,
}

const stepColors = [
  'from-blue-600 to-blue-400',
  'from-cyan-600 to-cyan-400',
  'from-violet-600 to-violet-400',
  'from-indigo-600 to-indigo-400',
  'from-purple-600 to-purple-400',
  'from-pink-600 to-pink-400',
]

const glowColors = [
  'shadow-[0_0_20px_rgba(37,99,235,0.3)]',
  'shadow-[0_0_20px_rgba(8,145,178,0.3)]',
  'shadow-[0_0_20px_rgba(124,58,237,0.3)]',
  'shadow-[0_0_20px_rgba(79,70,229,0.3)]',
  'shadow-[0_0_20px_rgba(147,51,234,0.3)]',
  'shadow-[0_0_20px_rgba(219,39,119,0.3)]',
]

export default function Pipeline() {
  return (
    <section id="pipeline" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sie-surface/30" />
      <div className="absolute inset-0 grid-bg opacity-15" />

      {/* Large decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="section-label mb-4">HOW IT WORKS</div>
          <h2 className="section-heading mb-6">
            From raw post to structured action{' '}
            <span className="text-sie-cyan">in six steps</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Every observation that enters the system passes through a deterministic, auditable pipeline.
            No black boxes. Every classification decision comes with a structured rationale and verbatim evidence spans.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-pink-500/40" />

          <div className="flex flex-col gap-6">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap]
              return (
                <div
                  key={i}
                  className="relative group flex gap-6 items-start"
                >
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stepColors[i]} flex items-center justify-center ${glowColors[i]} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-sie-surface border border-sie-border flex items-center justify-center">
                      <span className="text-xs font-bold text-sie-cyan">{i + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 glass rounded-2xl p-6 group-hover:border-white/10 transition-all duration-300 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sie-cyan transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-sm text-sie-muted leading-relaxed mb-3">
                          {step.body}
                        </p>
                        <code className="inline-flex items-center gap-1 text-xs text-blue-300 font-mono bg-blue-500/8 border border-blue-500/15 px-3 py-1.5 rounded-lg">
                          {step.tech}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

