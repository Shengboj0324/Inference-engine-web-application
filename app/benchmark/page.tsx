import type { Metadata } from 'next'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import Benchmarks from '@/components/benchmarks'

export const metadata: Metadata = {
  title: 'Benchmarks',
  description:
    'Interactive benchmark charts for Social Inference Engine — Bloom filter deduplication, reservoir sampling, confidence calibration, signal ranking, and BFS traversal. Measured on Apple M-series hardware.',
}

export default function BenchmarkPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        {/* Page hero */}
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-900/10 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="section-label mb-4">PERFORMANCE BENCHMARKS</div>
              <h1 className="text-5xl font-black text-white mb-4">
                Measured.{' '}
                <span className="text-sie-cyan">Not estimated.</span>
              </h1>
              <p className="text-lg text-sie-muted leading-relaxed">
                Every number below comes from running <code>deliverables/benchmark.py</code> with 3 warm-up passes
                and 7 timed repetitions on Apple M-series hardware. No simulations. No projections.
              </p>
            </div>
          </div>
        </div>

        {/* Benchmark charts (reuses the same component from the home page) */}
        <Benchmarks />

        {/* Methodology note */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="glass rounded-2xl p-6 text-sm text-sie-muted leading-relaxed space-y-3">
            <h2 className="text-base font-bold text-white">Benchmark methodology</h2>
            <p>
              All benchmarks were run using <code>deliverables/benchmark.py</code> on an Apple M-series chip
              (exact model redacted to avoid hardware anchoring). Each benchmark uses 3 warm-up passes followed
              by 7 timed repetitions. The median of the 7 timed repetitions is reported.
            </p>
            <p>
              The <code>_save()</code> disk write is patched out of the ConfidenceCalibrator benchmark to isolate
              mathematical computation cost from I/O variance. All other benchmarks reflect end-to-end wall time.
            </p>
            <p>
              The BFS graph benchmark uses a degree-4 ring graph as a representative topology. Real-world context
              memory stores may have different topologies; O(V+E) complexity holds regardless.
            </p>
            <p>
              LLM inference latency is not benchmarked here — it is network- and provider-dependent.
              See the LLM Routing section on the home page for observed figures.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

