'use client'
import { Clock, AlertTriangle, Lock } from 'lucide-react'
import { PROBLEM } from '@/lib/copy'

const iconMap = {
  Clock: Clock,
  AlertTriangle: AlertTriangle,
  Lock: Lock,
}

export default function Problem() {
  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sie-dark via-[#070f1f] to-sie-dark" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-900/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label mb-4">{PROBLEM.label}</div>
          <h2 className="section-heading mb-6 text-balance">
            {PROBLEM.heading.split('\n').map((line, i) => (
              <span key={i} className={`block ${i === 1 ? 'text-red-400' : 'text-white'}`}>
                {line}
              </span>
            ))}
          </h2>
          <div className="space-y-4">
            {PROBLEM.body.split('\n\n').map((para, i) => (
              <p key={i} className="text-base text-sie-muted leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Pain-point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEM.cards.map((card, i) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap]
            return (
              <div
                key={i}
                className="relative group glass rounded-2xl p-6 hover:border-red-500/20 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(239,68,68,0.1)]"
              >
                {/* Gradient top bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 group-hover:bg-red-500/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                <p className="text-sm text-sie-muted leading-relaxed">{card.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

