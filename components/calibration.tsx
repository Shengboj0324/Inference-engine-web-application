'use client'
import calibrationData from '@/data/calibration_state.json'

const scalars = calibrationData.scalars as Record<string, { temperature: number; calibrated: boolean; sample_count: number }>

const accuracyTargets = [
  { label: 'Macro F1', value: '≥ 0.82' },
  { label: 'Expected Calibration Error', value: '≤ 0.05' },
  { label: 'False-action rate', value: '≤ 0.08' },
  { label: 'Abstention rate', value: '5–15%' },
]

function TempBar({ value }: { value: number }) {
  // 0.75 to 1.25 range, center at 1.0
  const pct = ((value - 0.75) / 0.5) * 100
  const isBelow = value < 1.0
  const color = isBelow ? 'bg-blue-400' : 'bg-orange-400'
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
        <div
          className={`absolute top-0 bottom-0 ${color} rounded-full transition-all duration-500`}
          style={{
            left: isBelow ? `${pct}%` : '50%',
            right: isBelow ? '50%' : `${100 - pct}%`,
          }}
        />
      </div>
      <span className="text-xs font-mono text-white w-8 text-right">{value.toFixed(2)}</span>
    </div>
  )
}

export default function Calibration() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sie-surface/20" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[300px] bg-purple-900/8 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — explanation */}
          <div>
            <div className="section-label mb-4">CONFIDENCE CALIBRATION</div>
            <h2 className="section-heading mb-6">
              The system gets{' '}
              <span className="text-purple-400">more accurate</span>{' '}
              the more you use it.
            </h2>
            <div className="space-y-4 text-base text-sie-muted leading-relaxed mb-8">
              <p>
                LLMs are systematically miscalibrated: they tend toward overconfidence on common signal types
                and underconfidence on rare ones. A model that outputs confidence = 0.91 for every churn_risk
                does not have 91% accuracy.
              </p>
              <p>
                Social Inference Engine applies per-signal-type temperature scaling, calibrated on the 107-example
                seed dataset and updated online after every analyst feedback event. A confidence score of 0.87 means:
                in the training distribution, 87% of signals classified at this confidence level were correct.
              </p>
              <p>
                Temperature scalars are updated in-process in 6–8 microseconds per feedback event. There is no
                retraining cycle. The first correction improves subsequent classifications immediately.
              </p>
            </div>

            {/* Accuracy targets */}
            <div className="glass rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5">
              <h3 className="text-sm font-bold text-white mb-4">Fine-tuning targets (non-frontier tier)</h3>
              <div className="grid grid-cols-2 gap-3">
                {accuracyTargets.map((t, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-xl font-black text-purple-300 font-mono mb-1">{t.value}</div>
                    <div className="text-xs text-sie-muted">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — temperature scalar table */}
          <div>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-sie-border/60 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Temperature Scalars</h3>
                <span className="text-xs text-sie-muted font-mono">calibrated on {calibrationData.seed_examples} examples</span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {Object.entries(scalars).map(([signal, data]) => (
                  <div key={signal} className="flex flex-col gap-1.5 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/80">{signal}</span>
                        {data.calibrated && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                            calibrated
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-sie-muted font-mono">{data.sample_count} samples</span>
                    </div>
                    <TempBar value={data.temperature} />
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-sie-border/60 bg-white/[0.01]">
                <p className="text-xs text-sie-muted italic leading-relaxed">
                  Temperature = 1.0 means uncalibrated. Values &lt; 1.0 reduce overconfident outputs.
                  Values &gt; 1.0 sharpen underconfident outputs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

