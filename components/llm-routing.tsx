'use client'
import { Cpu, Zap, DollarSign } from 'lucide-react'

const tiers = [
  {
    tier: 'Tier 1 — Frontier',
    models: ['GPT-4o', 'Claude 3.5 Sonnet'],
    signals: ['churn_risk', 'misinformation_risk', 'support_escalation'],
    rationale: 'These three types carry the highest cost of a false negative. Frontier accuracy is non-negotiable.',
    latency: '1.5 – 4 s per signal',
    color: 'blue',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    iconColor: 'text-blue-400',
    glow: 'shadow-[0_0_40px_rgba(37,99,235,0.1)]',
  },
  {
    tier: 'Tier 2 — Non-Frontier',
    models: ['GPT-4o mini (fine-tuned)', 'Ollama llama3.1:8b (local)'],
    signals: ['lead_opportunity', 'competitor_weakness', 'influencer_amplification', 'product_confusion', 'feature_request_pattern', 'launch_moment', 'trend_to_content'],
    rationale: '7 types with lower cost of error respond well to fine-tuning. 70–80% cost reduction with no measurable accuracy regression.',
    latency: '0.4 – 1.2 s (fine-tuned) · 3 – 12 s (local)',
    color: 'cyan',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/5',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    glow: 'shadow-[0_0_40px_rgba(8,145,178,0.1)]',
  },
]

const providers = [
  { name: 'OpenAI GPT-4o', key: 'OPENAI_API_KEY', note: 'Frontier tier (required)' },
  { name: 'OpenAI fine-tune', key: 'FINE_TUNED_MODEL_ID', note: 'Non-frontier tier (recommended)' },
  { name: 'Anthropic Claude', key: 'ANTHROPIC_API_KEY', note: 'Alternative frontier tier' },
  { name: 'Ollama (local)', key: 'LOCAL_LLM_URL + LOCAL_LLM_MODEL', note: 'Zero-cost, zero-egress' },
  { name: 'vLLM (self-host)', key: 'VLLM_ENDPOINT', note: 'High-throughput self-hosted' },
]

export default function LLMRouting() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sie-dark to-[#060c1a]" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label mb-4">LLM ROUTING</div>
          <h2 className="section-heading mb-4">
            Two-tier inference.{' '}
            <span className="text-blue-400">Frontier accuracy</span> where it matters.
            <span className="block text-sie-cyan mt-1">Fine-tuned efficiency everywhere else.</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Social Inference Engine routes each observation to one of two LLM tiers based on the signal type being
            evaluated. The routing decision is deterministic — no sampling, no probabilistic routing.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative glass rounded-2xl p-6 border ${tier.borderColor} ${tier.bgColor} ${tier.glow} transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl bg-white/5 border border-current/20 flex items-center justify-center ${tier.iconColor}`}>
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{tier.tier}</h3>
              </div>

              {/* Models */}
              <div className="mb-4">
                <div className="text-xs text-sie-muted mb-2 font-semibold tracking-wider uppercase">Models</div>
                <div className="flex flex-wrap gap-2">
                  {tier.models.map((m) => (
                    <span key={m} className={`text-xs px-2 py-1 rounded-lg border font-mono ${tier.badgeColor}`}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Signal types */}
              <div className="mb-4">
                <div className="text-xs text-sie-muted mb-2 font-semibold tracking-wider uppercase">Signal Types</div>
                <div className="flex flex-wrap gap-1.5">
                  {tier.signals.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-white/60">{s}</span>
                  ))}
                </div>
              </div>

              {/* Rationale */}
              <p className="text-sm text-sie-muted leading-relaxed mb-3">{tier.rationale}</p>

              {/* Latency */}
              <div className="flex items-center gap-2 text-xs text-sie-muted">
                <Zap className={`w-3.5 h-3.5 ${tier.iconColor}`} />
                <span className="font-mono">{tier.latency}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cost callout */}
        <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5 mb-12 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-300 mb-1">85–90% cost reduction on non-frontier volume</h3>
            <p className="text-sm text-sie-muted leading-relaxed">
              At 1,000 signals per day, routing 70% to Tier 2 at GPT-4o mini pricing versus routing all to GPT-4o
              represents a cost reduction of approximately 85–90%. The exact saving depends on your provider pricing
              at the time of deployment.
            </p>
          </div>
        </div>

        {/* Provider table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-sie-border/60">
            <h3 className="text-base font-bold text-white">Provider Configuration</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sie-border/40">
                  <th className="text-left px-6 py-3 text-xs text-sie-muted font-semibold tracking-wider">Provider</th>
                  <th className="text-left px-6 py-3 text-xs text-sie-muted font-semibold tracking-wider">Config Key</th>
                  <th className="text-left px-6 py-3 text-xs text-sie-muted font-semibold tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p, i) => (
                  <tr key={i} className="border-b border-sie-border/30 hover:bg-white/[0.02] transition-colors duration-200">
                    <td className="px-6 py-3 text-white font-medium">{p.name}</td>
                    <td className="px-6 py-3 font-mono text-blue-300 text-xs">{p.key}</td>
                    <td className="px-6 py-3 text-sie-muted">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

