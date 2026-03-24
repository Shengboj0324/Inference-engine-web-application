'use client'
import { Globe, Zap, CheckCircle2, Timer, Shield } from 'lucide-react'
import { TRUST_BAR } from '@/lib/copy'

const iconMap = {
  Globe: Globe,
  Zap: Zap,
  CheckCircle2: CheckCircle2,
  Timer: Timer,
  Shield: Shield,
}

export default function TrustBar() {
  return (
    <section className="relative border-y border-sie-border/60 bg-sie-surface/40 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 grid-bg-dense opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-sie-border/40">
          {TRUST_BAR.map((stat, i) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap]
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-6 bg-sie-dark hover:bg-sie-surface/60 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/10 border border-sie-border/60 flex items-center justify-center group-hover:border-sie-cyan/30 group-hover:shadow-glow-cyan transition-all duration-300">
                  <Icon className="w-5 h-5 text-sie-cyan" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white font-mono mb-0.5 group-hover:text-sie-cyan transition-colors duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs text-sie-muted leading-tight text-center max-w-[120px]">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

