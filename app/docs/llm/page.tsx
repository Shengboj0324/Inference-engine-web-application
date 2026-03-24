import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { SITE } from '@/lib/copy'

export const metadata: Metadata = {
  title: 'LLM Configuration',
  description: 'Configure OpenAI, Anthropic, Ollama, or vLLM providers in Social Inference Engine. Set up two-tier routing for cost efficiency.',
}

const providers = [
  {
    name: 'OpenAI', badge: 'Hosted', color: 'emerald',
    envVars: [
      { key: 'OPENAI_API_KEY', val: 'sk-…', required: true },
      { key: 'FRONTIER_MODEL', val: 'gpt-4o', required: false },
      { key: 'NON_FRONTIER_MODEL', val: 'gpt-4o-mini', required: false },
      { key: 'FINE_TUNED_MODEL_ID', val: 'ft:gpt-4o-mini:…', required: false },
    ],
    notes: 'Set FRONTIER_MODEL=gpt-4o for the three critical signal types. Set FINE_TUNED_MODEL_ID to a fine-tuned GPT-4o mini model ID to activate the non-frontier tier. If FINE_TUNED_MODEL_ID is not set, the system falls back to the base NON_FRONTIER_MODEL.',
  },
  {
    name: 'Anthropic', badge: 'Hosted', color: 'violet',
    envVars: [
      { key: 'ANTHROPIC_API_KEY',      val: 'sk-ant-…', required: true },
      { key: 'ANTHROPIC_FRONTIER_MODEL', val: 'claude-3-5-sonnet-20241022', required: false },
      { key: 'ANTHROPIC_NON_FRONTIER_MODEL', val: 'claude-3-5-haiku-20241022', required: false },
    ],
    notes: 'Set OPENAI_API_KEY="" and ANTHROPIC_API_KEY="sk-ant-…" to route all inference to Anthropic. Two-tier routing is available: Sonnet for the frontier tier, Haiku for the non-frontier tier.',
  },
  {
    name: 'Ollama', badge: 'Local · Zero egress', color: 'cyan',
    envVars: [
      { key: 'LOCAL_LLM_URL',   val: 'http://localhost:11434', required: true },
      { key: 'LOCAL_LLM_MODEL', val: 'llama3.1:8b',           required: true },
    ],
    notes: 'With LOCAL_LLM_URL and LOCAL_LLM_MODEL set, all inference routes to Ollama. No observation text ever reaches an external network. Performance: 3–12 s per signal on Apple M-series hardware with llama3.1:8b. Run `ollama pull llama3.1:8b` before starting the API.',
  },
  {
    name: 'vLLM', badge: 'Self-hosted', color: 'amber',
    envVars: [
      { key: 'VLLM_ENDPOINT', val: 'http://your-vllm-host:8000/v1', required: true },
      { key: 'VLLM_MODEL',    val: 'Meta-Llama-3.1-8B-Instruct',    required: false },
    ],
    notes: 'vLLM exposes an OpenAI-compatible API. Set VLLM_ENDPOINT to the base URL of your vLLM server. Ideal for high-throughput self-hosted deployments on A100/H100 GPUs. Latency: 0.2–0.8 s per signal at full GPU utilisation.',
  },
]

const colorMap: Record<string, { border: string; badge: string; req: string }> = {
  emerald: { border: 'border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', req: 'text-red-400' },
  violet:  { border: 'border-violet-500/20',  badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',   req: 'text-red-400' },
  cyan:    { border: 'border-cyan-500/20',     badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',         req: 'text-red-400' },
  amber:   { border: 'border-amber-500/20',    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',      req: 'text-red-400' },
}

export default function LLMPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-2 text-xs text-sie-muted mb-4 font-mono">
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <span>/</span><span className="text-white">LLM Configuration</span>
            </div>
            <div className="section-label mb-3">LLM CONFIGURATION</div>
            <h1 className="text-4xl font-black text-white mb-3">Configuring Your Inference Provider</h1>
            <p className="text-base text-sie-muted leading-relaxed max-w-2xl">
              Social Inference Engine supports four LLM providers: OpenAI, Anthropic, Ollama, and vLLM.
              All are configured via environment variables. The two-tier routing system applies regardless of provider.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Routing overview */}
          <div className="glass rounded-2xl p-6 border border-sie-border/60">
            <h2 className="text-base font-bold text-white mb-4">Two-Tier Routing</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="glass-light rounded-xl p-4 border border-red-500/20">
                <div className="text-xs text-red-400 font-bold mb-2">TIER 1 — FRONTIER</div>
                <div className="text-sm text-white/80 mb-3">churn_risk · misinformation_risk · support_escalation</div>
                <div className="text-xs text-sie-muted">Highest cost-of-error signal types. Routes to GPT-4o or Claude 3.5 Sonnet. Latency: 1.5–4 s.</div>
              </div>
              <div className="glass-light rounded-xl p-4 border border-cyan-500/20">
                <div className="text-xs text-cyan-400 font-bold mb-2">TIER 2 — NON-FRONTIER</div>
                <div className="text-sm text-white/80 mb-3">All 7 remaining signal types</div>
                <div className="text-xs text-sie-muted">Routes to fine-tuned GPT-4o mini or Ollama local model. 70–80% cost reduction. Latency: 0.4–12 s.</div>
              </div>
            </div>
            <p className="text-xs text-sie-muted">The routing decision is deterministic — set by the signal type, not by sampling or probability.</p>
          </div>

          {/* Provider configs */}
          {providers.map((provider) => {
            const c = colorMap[provider.color]
            return (
              <div key={provider.name} className={`glass rounded-2xl overflow-hidden border ${c.border}`}>
                <div className="px-5 py-4 border-b border-sie-border/50 flex items-center gap-3">
                  <h2 className="text-base font-bold text-white">{provider.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${c.badge}`}>{provider.badge}</span>
                </div>
                <div className="p-5 space-y-4">
                  {/* Env vars */}
                  <div>
                    <div className="text-xs text-sie-muted font-semibold mb-2">Environment variables</div>
                    <div className="glass-light rounded-xl overflow-hidden">
                      {provider.envVars.map((v, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-2.5 ${i < provider.envVars.length - 1 ? 'border-b border-white/5' : ''}`}>
                          <code className="text-xs font-mono text-blue-300 flex-shrink-0">{v.key}</code>
                          <span className="text-xs text-sie-muted flex-1 font-mono">=</span>
                          <code className="text-xs font-mono text-cyan-300 flex-1">{v.val}</code>
                          <span className={`text-xs font-semibold flex-shrink-0 ${v.required ? c.req : 'text-sie-muted'}`}>
                            {v.required ? 'required' : 'optional'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-sie-muted leading-relaxed">{provider.notes}</p>
                </div>
              </div>
            )
          })}

          {/* Fine-tuning note */}
          <div className="glass rounded-2xl p-6 border border-purple-500/20 bg-purple-500/5">
            <h2 className="text-base font-bold text-white mb-3">Fine-tuning the non-frontier tier</h2>
            <p className="text-sm text-sie-muted leading-relaxed mb-4">
              The training directory contains a full fine-tuning pipeline for GPT-4o mini.
              Running the fine-tuning pipeline produces a model ID that you set as <code className="text-blue-300">FINE_TUNED_MODEL_ID</code>.
            </p>
            <pre className="text-xs font-mono text-cyan-200 bg-[#080f1c] border border-sie-border/60 rounded-xl px-4 py-3 overflow-x-auto leading-6">
{`# Prepare training data
python training/prepare_training_data.py

# Run fine-tuning job (requires OPENAI_API_KEY)
python training/fine_tune.py --base-model gpt-4o-mini

# The script prints: FINE_TUNED_MODEL_ID=ft:gpt-4o-mini:org:...
# Add that value to your .env`}
            </pre>
            <Link href="/docs/training" className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-white transition-colors mt-4">
              Full training guide →
            </Link>
          </div>

          <div className="text-center">
            <Link href={`${SITE.repoUrl}/blob/main/docs/LLM_DEPLOYMENT_GUIDE.md`} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex">
              Full LLM Deployment Guide on GitHub →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

