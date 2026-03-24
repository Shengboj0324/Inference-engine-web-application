import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { SITE } from '@/lib/copy'

export const metadata: Metadata = {
  title: 'Architecture',
  description: 'System architecture of Social Inference Engine — Bloom filter deduplication, reservoir sampling, LLM routing, pgvector retrieval, and confidence calibration.',
}

const layers = [
  {
    layer: 'Ingestion Layer',
    components: [
      { name: 'Platform Connectors (×13)', detail: 'Celery workers; 15-min fetch schedule; BaseConnector ABC: authenticate(), fetch(), validate_credentials()' },
      { name: 'BloomFilter', detail: 'O(1) deduplication; 12–13 µs per URL; false-positive rate 1% (configurable); false-negative rate 0%' },
      { name: 'ReservoirSampler', detail: "Vitter's Algorithm R; O(n); ~1,000 items/ms; statistically unbiased even at 500k-item streams" },
    ],
    color: 'blue',
  },
  {
    layer: 'Normalisation Layer',
    components: [
      { name: 'NormalizationEngine', detail: 'Unified NormalizedObservation schema; handles JSON, HTML, plain text, and truncated UTF-8' },
      { name: 'DataResidencyGuard', detail: 'PII scrubbing (email, phone, URLs with identifying params); SHA-256 author pseudonymisation; immutable audit log' },
    ],
    color: 'cyan',
  },
  {
    layer: 'Retrieval Layer',
    components: [
      { name: 'pgvector / HNSW', detail: '1,536-dim embeddings; approximate nearest-neighbour search; top-k few-shot context assembly' },
      { name: 'ContextMemoryStore', detail: 'BFS graph traversal O(V+E); degree-4 ring topology in benchmark; complements ANN with structural similarity' },
    ],
    color: 'violet',
  },
  {
    layer: 'Classification Layer',
    components: [
      { name: 'LLMRouter', detail: 'Deterministic two-tier routing: churn_risk / misinformation_risk / support_escalation → Tier 1 (frontier); remaining 7 types → Tier 2 (fine-tuned / local)' },
      { name: 'LLMAdjudicator', detail: 'Structured output with evidence spans, signal_type, confidence float, and abstention reason code' },
      { name: 'ConfidenceCalibrator', detail: 'Per-type temperature scaling; online gradient-descent; 6–8 µs per update; state persisted to calibration_state.json' },
    ],
    color: 'purple',
  },
  {
    layer: 'Action Layer',
    components: [
      { name: 'ActionRanker', detail: 'Composite score: Opportunity 35% + Urgency 30% + Risk 35%; 14–18 µs per signal; confidence gate at 0.5; CRITICAL / HIGH / MEDIUM / LOW tiers' },
      { name: 'SSE Stream', detail: 'GET /api/v1/signals/stream; push on classify; no polling; no third-party push service required' },
      { name: 'REST API', detail: 'FastAPI; OpenAPI 3.1 spec; JWT auth; RBAC (VIEWER / ANALYST / MANAGER); 60 req/min rate limit' },
    ],
    color: 'amber',
  },
]

const colorMap: Record<string, { border: string; badge: string; dot: string }> = {
  blue:   { border: 'border-blue-500/20',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   dot: 'bg-blue-400' },
  cyan:   { border: 'border-cyan-500/20',   badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',   dot: 'bg-cyan-400' },
  violet: { border: 'border-violet-500/20', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dot: 'bg-violet-400' },
  purple: { border: 'border-purple-500/20', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dot: 'bg-purple-400' },
  amber:  { border: 'border-amber-500/20',  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',  dot: 'bg-amber-400' },
}

export default function ArchitecturePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-2 text-xs text-sie-muted mb-4 font-mono">
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <span>/</span><span className="text-white">Architecture</span>
            </div>
            <div className="section-label mb-3">ARCHITECTURE</div>
            <h1 className="text-4xl font-black text-white mb-3">System Design</h1>
            <p className="text-base text-sie-muted leading-relaxed max-w-2xl">
              Social Inference Engine is a layered pipeline. Every observation passes through five stages:
              Ingestion → Normalisation → Retrieval → Classification → Action.
              Each stage is independently testable and has documented performance characteristics.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {/* Data flow summary */}
          <div className="glass rounded-2xl p-6 border border-sie-border/60">
            <h2 className="text-base font-bold text-white mb-4">Data flow (top-level)</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-sie-muted">
              {['Platform API', 'BloomFilter', 'ReservoirSampler', 'NormalizationEngine', 'DataResidencyGuard', 'pgvector / BFS', 'LLMRouter', 'LLMAdjudicator', 'ConfidenceCalibrator', 'ActionRanker', 'SSE / REST'].map((step, i, arr) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-sie-border text-white/70 text-xs">{step}</span>
                  {i < arr.length - 1 && <span className="text-sie-cyan text-xs">→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Layer breakdown */}
          {layers.map((layer) => {
            const c = colorMap[layer.color]
            return (
              <div key={layer.layer} className={`glass rounded-2xl overflow-hidden border ${c.border}`}>
                <div className="px-5 py-3.5 border-b border-sie-border/40 flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                  <h2 className="text-sm font-bold text-white">{layer.layer}</h2>
                </div>
                <div className="divide-y divide-sie-border/30">
                  {layer.components.map((comp) => (
                    <div key={comp.name} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-start gap-3 hover:bg-white/[0.015] transition-colors">
                      <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${c.badge}`}>{comp.name}</span>
                      <span className="text-sm text-sie-muted leading-relaxed">{comp.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Stack */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">Technology stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              {[
                ['Language', 'Python 3.11'],
                ['Web framework', 'FastAPI'],
                ['Task queue', 'Celery + Redis'],
                ['Database', 'PostgreSQL 15 + pgvector'],
                ['Object storage', 'MinIO (S3-compatible)'],
                ['Containerisation', 'Docker Compose'],
                ['Auth', 'JWT (python-jose)'],
                ['Migrations', 'Alembic'],
                ['LLM abstraction', 'Custom LLMRouter'],
                ['Testing', 'pytest + pytest-asyncio'],
              ].map(([label, value], i) => (
                <div key={i} className="glass-light rounded-lg p-3">
                  <div className="text-sie-muted mb-1">{label}</div>
                  <div className="text-white font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href={`${SITE.repoUrl}/blob/main/docs/architecture.md`} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex">
              Full architecture doc on GitHub →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

