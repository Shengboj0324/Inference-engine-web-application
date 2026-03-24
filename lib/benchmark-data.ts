/**
 * lib/benchmark-data.ts
 * Parses all benchmark CSV files at build time via Node.js fs.readFileSync.
 * Called from Server Components only — never imported by Client Components.
 *
 * CSV format: two columns, first row is header, e.g.:  n,time_ms
 * Per §12.11 and §16 of the developer guide.
 */

import fs from 'fs'
import path from 'path'

export interface DataPoint {
  /** Raw x-axis value as a display string (e.g. "1,000" or "100k") */
  n: string
  /** Y-axis value in milliseconds */
  time_ms: number
}

export interface BenchmarkStat {
  label: string
  value: string
}

export interface BenchmarkTab {
  key: string
  label: string
  title: string
  xLabel: string
  yLabel: string
  color: string
  data: DataPoint[]
  stats: BenchmarkStat[]
}

/** Read a CSV from data/ and return rows as {n, time_ms} */
function parseCSV(filename: string): DataPoint[] {
  const filePath = path.join(process.cwd(), 'data', filename)
  const text = fs.readFileSync(filePath, 'utf8')
  const lines = text.trim().split('\n').slice(1) // skip header
  return lines.map((line) => {
    const [rawN, rawMs] = line.split(',')
    const n = Number(rawN.trim())
    const time_ms = parseFloat(rawMs.trim())
    // Format n for display
    let nLabel: string
    if (n >= 1_000_000) nLabel = `${(n / 1_000_000).toFixed(0)}M`
    else if (n >= 1_000) nLabel = `${(n / 1_000).toFixed(0)}k`
    else nLabel = String(n)
    return { n: nLabel, time_ms }
  })
}

/** Build the full tabs config from CSV files + static metadata. */
export function getBenchmarkTabs(): BenchmarkTab[] {
  return [
    {
      key: 'bloom',
      label: 'Deduplication (Bloom Filter)',
      title: 'BloomFilter.add() — Time vs. Input Size',
      xLabel: 'Items checked (n)',
      yLabel: 'Total time (ms)',
      color: '#0066FF',
      data: parseCSV('bloom.csv'),
      stats: [
        { label: 'Per-operation cost', value: '12–13 µs (constant)' },
        { label: 'Memory model', value: 'O(n) bits' },
        { label: 'False positive rate', value: '1% (configurable)' },
        { label: 'False negative rate', value: '0% (guaranteed)' },
      ],
    },
    {
      key: 'reservoir',
      label: 'Stream Sampling (Reservoir)',
      title: 'ReservoirSampler — Throughput vs. Stream Length',
      xLabel: 'Stream length (n)',
      yLabel: 'Time (ms)',
      color: '#00D4FF',
      data: parseCSV('reservoir.csv'),
      stats: [
        { label: 'Throughput', value: '~1,000 items/ms (constant)' },
        { label: 'Algorithm', value: "Vitter's Algorithm R" },
        { label: 'Bias', value: 'None — uniform probability for every item' },
        { label: 'Sample size', value: '500 (configurable via MAX_ITEMS_PER_FETCH)' },
      ],
    },
    {
      key: 'calibrator',
      label: 'Confidence Calibration (Calibrator)',
      title: 'ConfidenceCalibrator.update() — Time vs. Update Count',
      xLabel: 'Update events (m)',
      yLabel: 'Computation time (ms)',
      color: '#7B2FBE',
      data: parseCSV('calibrator.csv'),
      stats: [
        { label: 'Per-update cost', value: '6–8 µs (linear)' },
        { label: 'Storage', value: 'One float (temperature scalar) per signal type' },
        { label: 'Persistence', value: 'Flush to calibration_state.json after each update' },
        { label: 'Restart behaviour', value: 'State loaded from disk — updates survive restarts' },
      ],
    },
    {
      key: 'action_ranker',
      label: 'Signal Ranking (ActionRanker)',
      title: 'ActionRanker.rank_batch() — Time vs. Queue Size',
      xLabel: 'Signals ranked (n)',
      yLabel: 'Time (ms)',
      color: '#F59E0B',
      data: parseCSV('action_ranker.csv'),
      stats: [
        { label: 'Per-signal cost', value: '14–18 µs (linear)' },
        { label: 'Dimensions', value: 'Opportunity (35%) + Urgency (30%) + Risk (35%)' },
        { label: 'Confidence gate', value: 'Signals below 0.5 confidence are not ranked' },
        { label: 'Priority tiers', value: 'CRITICAL / HIGH / MEDIUM / LOW' },
      ],
    },
    {
      key: 'bfs',
      label: 'Context Memory (BFS Traversal)',
      title: 'ContextMemoryStore BFS — Time vs. Graph Size',
      xLabel: 'Nodes (n)',
      yLabel: 'Time (ms)',
      color: '#10B981',
      data: parseCSV('bfs.csv'),
      stats: [
        { label: 'Complexity', value: 'O(V + E) — linear in nodes and edges' },
        { label: 'Use case', value: 'Related few-shot example retrieval for LLM context' },
        { label: 'Topology used in benchmark', value: 'Degree-4 ring graph' },
        { label: 'Complement', value: 'pgvector HNSW ANN search for semantic similarity' },
      ],
    },
  ]
}

