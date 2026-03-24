'use client'
import Link from 'next/link'
import { Github, ArrowRight, Radar, Terminal } from 'lucide-react'
import { HERO, SITE } from '@/lib/copy'

function SignalQueueMockup() {
  const signals = [
    { type: 'churn_risk', confidence: 0.87, platform: 'Reddit', time: '2m ago', color: 'red', urgent: true },
    { type: 'competitor_weakness', confidence: 0.91, platform: 'Twitter/X', time: '8m ago', color: 'emerald', urgent: false },
    { type: 'lead_opportunity', confidence: 0.79, platform: 'LinkedIn', time: '15m ago', color: 'blue', urgent: false },
    { type: 'support_escalation', confidence: 0.94, platform: 'Twitter/X', time: '23m ago', color: 'orange', urgent: true },
    { type: 'feature_request_pattern', confidence: 0.72, platform: 'Reddit', time: '31m ago', color: 'violet', urgent: false },
  ]
  const colorMap: Record<string, string> = {
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  }
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Glow effects */}
      <div className="absolute -inset-4 bg-gradient-radial from-blue-600/20 via-transparent to-transparent blur-2xl" />
      <div className="absolute -inset-4 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-3xl" />

      {/* Terminal window */}
      <div className="relative glass-light rounded-2xl overflow-hidden gradient-border shadow-[0_24px_80px_rgba(0,102,255,0.15)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex items-center gap-2 mx-auto">
            <Terminal className="w-3.5 h-3.5 text-sie-muted" />
            <span className="text-xs text-sie-muted font-mono">Signal Queue — Live</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">streaming</span>
          </div>
        </div>

        {/* Signal list */}
        <div className="p-3 flex flex-col gap-2">
          {signals.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all duration-200 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {s.urgent && (
                <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-red-400 to-red-600 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border font-mono ${colorMap[s.color]}`}>
                    {s.type}
                  </span>
                  {s.urgent && (
                    <span className="text-xs text-red-400 font-semibold animate-pulse">URGENT</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-sie-muted">
                  <span className="font-mono">{s.platform}</span>
                  <span>·</span>
                  <span>{s.time}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-sm font-bold text-white font-mono">{s.confidence.toFixed(2)}</span>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${s.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-xs text-sie-muted font-mono">5 signals · updated 2s ago</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">SSE active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="flex flex-col gap-6 animate-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-sie-cyan/20 w-fit">
              <Radar className="w-4 h-4 text-sie-cyan" />
              <span className="text-xs font-semibold text-sie-cyan tracking-wider">
                {HERO.badge}
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                <span className="block">{HERO.headline[0]}</span>
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent glow-text-blue">
                  {HERO.headline[1]}
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-sie-muted leading-relaxed max-w-lg">
              {HERO.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href={HERO.ctas.primary.href} className="btn-primary group text-sm">
                {HERO.ctas.primary.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href={HERO.ctas.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <Github className="w-4 h-4" />
                {HERO.ctas.secondary.label}
              </Link>
            </div>

            {/* Inline stats */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-sie-muted">
              {HERO.stats.map((stat, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 && <span className="text-sie-border">·</span>}
                  <span className="font-medium text-white/70">{stat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right — mockup */}
          <div className="relative lg:pl-8 animate-in" style={{ animationDelay: '200ms' }}>
            <SignalQueueMockup />
            <p className="text-center text-xs text-sie-muted mt-4 font-mono">
              Signal queue view — confidence-ranked, with verbatim evidence
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sie-dark to-transparent" />
    </section>
  )
}

