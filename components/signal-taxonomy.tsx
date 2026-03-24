'use client'
import {
  TrendingUp, Target, Megaphone, UserMinus, AlertOctagon,
  PhoneCall, HelpCircle, Lightbulb, Rocket, BarChart2,
} from 'lucide-react'
import { SIGNAL_TYPES } from '@/lib/copy'

const iconMap = {
  TrendingUp, Target, Megaphone, UserMinus, AlertOctagon,
  PhoneCall, HelpCircle, Lightbulb, Rocket, BarChart2,
}

const categoryColors: Record<string, { badge: string; card: string; icon: string; glow: string }> = {
  'REVENUE OPPORTUNITIES': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    card: 'hover:border-emerald-500/20 hover:shadow-[0_8px_32px_rgba(16,185,129,0.1)]',
    icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    glow: 'group-hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]',
  },
  'RISK SIGNALS': {
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    card: 'hover:border-red-500/20 hover:shadow-[0_8px_32px_rgba(239,68,68,0.1)]',
    icon: 'bg-red-500/10 border-red-500/20 text-red-400',
    glow: 'group-hover:shadow-[0_0_16px_rgba(239,68,68,0.3)]',
  },
  'PRODUCT SIGNALS': {
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    card: 'hover:border-violet-500/20 hover:shadow-[0_8px_32px_rgba(139,92,246,0.1)]',
    icon: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    glow: 'group-hover:shadow-[0_0_16px_rgba(139,92,246,0.3)]',
  },
  'CONTENT OPPORTUNITIES': {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    card: 'hover:border-amber-500/20 hover:shadow-[0_8px_32px_rgba(245,158,11,0.1)]',
    icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    glow: 'group-hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]',
  },
}

export default function SignalTaxonomy() {
  return (
    <section id="signal-taxonomy" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sie-dark via-[#060c1a] to-sie-dark" />
      <div className="absolute inset-0 grid-bg opacity-15" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label mb-4">SIGNAL TAXONOMY</div>
          <h2 className="section-heading mb-6">
            10 business-intent signal types.{' '}
            <span className="text-sie-cyan">Not 10,000 sentiment buckets.</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Every classified observation maps to exactly one signal type from the taxonomy below.
            The classifier abstains — and tells you why — when the evidence is insufficient.
          </p>
        </div>

        {/* Categories and signal cards */}
        <div className="flex flex-col gap-12">
          {SIGNAL_TYPES.map((category) => {
            const colors = categoryColors[category.category] || categoryColors['CONTENT OPPORTUNITIES']
            return (
              <div key={category.category}>
                {/* Category header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-xs font-bold tracking-widest px-3 py-1.5 rounded-full border ${colors.badge}`}>
                    {category.category}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-sie-border to-transparent" />
                </div>

                {/* Signal cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.signals.map((signal) => {
                    const Icon = iconMap[signal.icon as keyof typeof iconMap]
                    return (
                      <div
                        key={signal.slug}
                        className={`group relative glass rounded-2xl p-5 transition-all duration-500 ${colors.card}`}
                      >
                        {/* Top accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                        {/* Icon + slug */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${colors.icon} ${colors.glow}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-mono text-sie-muted mb-0.5">{signal.slug}</div>
                            <h3 className="text-base font-bold text-white leading-tight">{signal.name}</h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-sie-muted leading-relaxed mb-4">{signal.description}</p>

                        {/* Action + evidence */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-sie-muted">Action:</span>
                            <span className="text-xs font-semibold text-white">{signal.action}</span>
                          </div>
                          <blockquote className="text-xs text-sie-muted italic bg-white/[0.02] rounded-lg px-3 py-2 border-l-2 border-sie-border leading-relaxed">
                            {signal.evidence}
                          </blockquote>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-sie-muted italic max-w-2xl mx-auto">
            When confidence is insufficient for a reliable classification, the model abstains and returns a
            structured abstention reason (e.g., <code>ambiguous_intent</code>, <code>insufficient_context</code>, <code>out_of_scope</code>).
            Abstentions never surface in the signal queue.
          </p>
        </div>
      </div>
    </section>
  )
}

