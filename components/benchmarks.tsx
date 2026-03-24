'use client'
import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

const tabs = [
  {
    key: 'bloom',
    label: 'Bloom Filter',
    title: 'BloomFilter.add() — Time vs. Input Size',
    xLabel: 'Items checked (n)',
    yLabel: 'Total time (ms)',
    color: '#0066FF',
    data: [
      { n: '500', time_ms: 6.1 },
      { n: '1k', time_ms: 12.2 },
      { n: '5k', time_ms: 60.9 },
      { n: '10k', time_ms: 122.2 },
      { n: '50k', time_ms: 631.6 },
      { n: '100k', time_ms: 1300.3 },
    ],
    stats: [
      { label: 'Per-operation cost', value: '12–13 µs (constant)' },
      { label: 'Memory model', value: 'O(n) bits' },
      { label: 'False positive rate', value: '1% (configurable)' },
      { label: 'False negative rate', value: '0% (guaranteed)' },
    ],
  },
  {
    key: 'reservoir',
    label: 'Stream Sampling',
    title: 'ReservoirSampler — Throughput vs. Stream Length',
    xLabel: 'Stream length (n)',
    yLabel: 'Time (ms)',
    color: '#00D4FF',
    data: [
      { n: '1k', time_ms: 0.95 },
      { n: '10k', time_ms: 10.1 },
      { n: '50k', time_ms: 50.1 },
      { n: '100k', time_ms: 101.2 },
      { n: '250k', time_ms: 248.3 },
      { n: '500k', time_ms: 503.5 },
    ],
    stats: [
      { label: 'Throughput', value: '~1,000 items/ms (constant)' },
      { label: 'Algorithm', value: "Vitter's Algorithm R" },
      { label: 'Bias', value: 'None — uniform probability' },
      { label: 'Sample size', value: '500 (configurable)' },
    ],
  },
  {
    key: 'calibrator',
    label: 'Calibration',
    title: 'ConfidenceCalibrator.update() — Time vs. Update Count',
    xLabel: 'Update events (m)',
    yLabel: 'Computation time (ms)',
    color: '#7B2FBE',
    data: [
      { n: '100', time_ms: 0.78 },
      { n: '1k', time_ms: 5.6 },
      { n: '10k', time_ms: 66.9 },
      { n: '100k', time_ms: 666.5 },
      { n: '500k', time_ms: 3282.7 },
    ],
    stats: [
      { label: 'Per-update cost', value: '6–8 µs (linear)' },
      { label: 'Storage', value: 'One float per signal type' },
      { label: 'Persistence', value: 'Flush to JSON after each update' },
      { label: 'Restart behaviour', value: 'State loaded from disk' },
    ],
  },
  {
    key: 'action_ranker',
    label: 'Signal Ranking',
    title: 'ActionRanker.rank_batch() — Time vs. Queue Size',
    xLabel: 'Signals ranked (n)',
    yLabel: 'Time (ms)',
    color: '#F59E0B',
    data: [
      { n: '10', time_ms: 0.13 },
      { n: '100', time_ms: 1.33 },
      { n: '1k', time_ms: 14.1 },
      { n: '5k', time_ms: 88.9 },
      { n: '10k', time_ms: 176.5 },
      { n: '50k', time_ms: 887.5 },
    ],
    stats: [
      { label: 'Per-signal cost', value: '14–18 µs (linear)' },
      { label: 'Dimensions', value: 'Opportunity (35%) + Urgency (30%) + Risk (35%)' },
      { label: 'Confidence gate', value: 'Signals below 0.5 not ranked' },
      { label: 'Priority tiers', value: 'CRITICAL / HIGH / MEDIUM / LOW' },
    ],
  },
  {
    key: 'bfs',
    label: 'BFS Traversal',
    title: 'ContextMemoryStore BFS — Time vs. Graph Size',
    xLabel: 'Nodes (n)',
    yLabel: 'Time (ms)',
    color: '#10B981',
    data: [
      { n: '1k', time_ms: 0.23 },
      { n: '5k', time_ms: 1.04 },
      { n: '10k', time_ms: 2.09 },
      { n: '50k', time_ms: 10.3 },
    ],
    stats: [
      { label: 'Complexity', value: 'O(V + E) — linear in nodes and edges' },
      { label: 'Use case', value: 'Related few-shot example retrieval' },
      { label: 'Topology', value: 'Degree-4 ring graph' },
      { label: 'Complement', value: 'pgvector HNSW ANN search' },
    ],
  },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 border border-sie-border/80 shadow-xl">
        <p className="text-xs text-sie-muted mb-1 font-mono">{label}</p>
        <p className="text-sm font-bold text-white font-mono">{payload[0].value} ms</p>
      </div>
    )
  }
  return null
}

export default function Benchmarks() {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060c1a] to-sie-dark" />
      <div className="absolute inset-0 grid-bg opacity-15" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label mb-4">PERFORMANCE</div>
          <h2 className="section-heading mb-4">
            Measured.{' '}
            <span className="text-sie-cyan">Not estimated.</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Every number below comes from running deliverables/benchmark.py with 3 warm-up passes and 7 timed
            repetitions on Apple M-series hardware. No simulations. No projections.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                active === i
                  ? 'text-white shadow-lg'
                  : 'glass text-sie-muted hover:text-white hover:bg-white/5'
              }`}
              style={active === i ? { background: `${t.color}22`, border: `1px solid ${t.color}44`, color: t.color } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Chart + Stats */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-sie-border/60">
            <h3 className="text-base font-bold text-white">{tab.title}</h3>
          </div>
          <div className="p-6">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tab.data} margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,39,68,0.8)" />
                  <XAxis
                    dataKey="n"
                    stroke="#8892A4"
                    tick={{ fill: '#8892A4', fontSize: 11, fontFamily: 'monospace' }}
                    label={{ value: tab.xLabel, position: 'insideBottom', offset: -12, fill: '#8892A4', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#8892A4"
                    tick={{ fill: '#8892A4', fontSize: 11, fontFamily: 'monospace' }}
                    label={{ value: tab.yLabel, angle: -90, position: 'insideLeft', offset: 15, fill: '#8892A4', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="time_ms"
                    stroke={tab.color}
                    strokeWidth={2.5}
                    dot={{ fill: tab.color, strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7, fill: tab.color, strokeWidth: 2, stroke: '#050A14' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-sie-border/40">
            {tab.stats.map((stat, i) => (
              <div key={i} className="p-4 bg-sie-dark hover:bg-sie-surface/40 transition-colors duration-200">
                <div className="text-xs text-sie-muted mb-1">{stat.label}</div>
                <div className="text-sm font-bold text-white font-mono">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

