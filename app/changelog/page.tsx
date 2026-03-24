import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { SITE } from '@/lib/copy'
import { Tag, GitCommit, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Release history and changelog for Social Inference Engine.',
}

const releases = [
  {
    version: '1.0.0',
    date: '2026-03-24',
    label: 'Initial Release',
    labelColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    highlights: [
      '593 tests passing (20 additional LLM integration tests skipped by default)',
      '13 platform connectors: Reddit, YouTube, TikTok, Facebook, Instagram, WeChat, RSS, NYT, WSJ, ABC News (US), ABC News (AU), Google News, Apple News',
      '10-type signal taxonomy with calibrated confidence and structured abstentions',
      'Two-tier LLM routing: GPT-4o (frontier) + GPT-4o mini fine-tune / Ollama (non-frontier)',
      'ConfidenceCalibrator with online gradient-descent updates (6–8 µs per update)',
      'BloomFilter deduplication at 12–13 µs per URL check',
      'ReservoirSampler with ~1,000 items/ms throughput (Vitter\'s Algorithm R)',
      'ActionRanker composite priority scoring (Opportunity 35% + Urgency 30% + Risk 35%)',
      'DataResidencyGuard with SHA-256 pseudonymisation and PII scrubbing',
      'Server-Sent Events streaming for real-time signal delivery',
      'Role-based access control: VIEWER, ANALYST, MANAGER',
      'pgvector semantic similarity retrieval with HNSW indexing',
      'Full offline operation via Ollama with bag-of-words fallback embeddings',
      'Docker Compose full-stack deployment (Postgres, Redis, MinIO, API, Celery)',
    ],
    breaking: [],
    fixes: [],
  },
]

export default function ChangelogPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        {/* Page hero */}
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-900/8 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="section-label mb-4">CHANGELOG</div>
              <h1 className="text-5xl font-black text-white mb-4">Release History</h1>
              <p className="text-lg text-sie-muted leading-relaxed">
                What changed, when, and why. Complete release notes for every version of Social Inference Engine.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* GitHub releases link */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-lg font-bold text-white">All releases</h2>
            <Link
              href={`${SITE.repoUrl}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-sie-cyan hover:text-white transition-colors duration-200"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Release entries */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-sie-cyan/40 to-transparent" />

            {releases.map((release, i) => (
              <div key={i} className="relative pl-14 pb-12">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-sie-dark border-2 border-sie-cyan/40 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-sie-cyan" />
                </div>

                {/* Release header */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <h3 className="text-2xl font-black text-white font-mono">v{release.version}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${release.labelColor}`}>
                    {release.label}
                  </span>
                  <span className="text-xs text-sie-muted font-mono ml-auto">{release.date}</span>
                </div>

                {/* Highlights */}
                {release.highlights.length > 0 && (
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-sie-border/60 flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-white">What&apos;s new</span>
                    </div>
                    <ul className="p-5 space-y-3">
                      {release.highlights.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-sie-muted">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* GitHub link */}
                <div className="mt-4">
                  <Link
                    href={`${SITE.repoUrl}/releases/tag/v${release.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sie-muted hover:text-sie-cyan transition-colors duration-200 font-mono"
                  >
                    View release on GitHub
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

