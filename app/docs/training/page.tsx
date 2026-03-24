import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { SITE } from '@/lib/copy'
import calibrationData from '@/data/calibration_state.json'

export const metadata: Metadata = {
  title: 'Training Guide',
  description: 'Calibration training and dataset format for Social Inference Engine. Update temperature scalars with analyst feedback.',
}

const calibratedOn = calibrationData.calibrated_on
const seedExamples = calibrationData.seed_examples
const scalars = calibrationData.scalars as Record<string, { temperature: number; calibrated: boolean; sample_count: number }>

const steps = [
  {
    n: 1, title: 'Prepare the seed dataset',
    bash: `# The seed dataset is in training/seed_examples.jsonl\n# Each line is: {"text": "...", "signal_type": "lead_opportunity", "platform": "reddit"}\n\n# Validate the format\npython training/validate_dataset.py --file training/seed_examples.jsonl`,
    notes: `The seed dataset ships with ${seedExamples} examples across all 10 signal types. Add your own examples to improve calibration for your specific use case.`,
  },
  {
    n: 2, title: 'Run initial calibration',
    bash: 'python training/calibrate.py --epochs 5',
    notes: 'Runs temperature scaling calibration on the seed dataset. Updates training/calibration_state.json. Takes ~30 seconds on 107 examples.',
  },
  {
    n: 3, title: '(Optional) Run fine-tuning for the non-frontier tier',
    bash: `# Prepare training data for OpenAI fine-tuning\npython training/prepare_training_data.py\n\n# Submit fine-tuning job\npython training/fine_tune.py --base-model gpt-4o-mini\n\n# Export the model ID to .env\necho "FINE_TUNED_MODEL_ID=ft:gpt-4o-mini:…" >> .env`,
    notes: 'Fine-tuning targets: Macro F1 ≥ 0.82 · ECE ≤ 0.05 · False-action rate ≤ 0.08 · Abstention rate 5–15%. The job runs on OpenAI infrastructure and takes 20–60 minutes.',
  },
  {
    n: 4, title: 'Submit analyst feedback to trigger online calibration',
    bash: `# Via API\ncurl -X POST http://localhost:8000/api/v1/signals/{id}/feedback \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"predicted_type": "feature_request_pattern", "true_type": "churn_risk"}'`,
    notes: 'Each feedback submission triggers one gradient-descent step on the ConfidenceCalibrator. The temperature scalar for the corrected type is updated in memory immediately and flushed to disk. No restart required.',
  },
]

export default function TrainingPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-2 text-xs text-sie-muted mb-4 font-mono">
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <span>/</span><span className="text-white">Training Guide</span>
            </div>
            <div className="section-label mb-3">TRAINING GUIDE</div>
            <h1 className="text-4xl font-black text-white mb-3">Calibration and Fine-Tuning</h1>
            <p className="text-base text-sie-muted leading-relaxed max-w-2xl">
              Social Inference Engine uses per-signal-type temperature scaling to correct systematic overconfidence
              and underconfidence. Calibration state is updated online — each analyst correction improves the next inference.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Concepts */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-4">How calibration works</h2>
            <div className="space-y-3 text-sm text-sie-muted leading-relaxed">
              <p>LLMs are systematically miscalibrated: they output high confidence on common patterns regardless of actual accuracy. A model that consistently outputs confidence = 0.92 for <code className="text-blue-300">churn_risk</code> does not achieve 92% accuracy on that type.</p>
              <p>Temperature scaling applies a learned scalar <code className="text-blue-300">T</code> to the raw logits before softmax. When <code>T &lt; 1.0</code>, overconfident outputs are dampened. When <code>T &gt; 1.0</code>, underconfident outputs are sharpened.</p>
              <p>The scalar for each signal type is initialised from the seed dataset and updated online via gradient descent after each analyst correction. One update step takes 6–8 µs and requires no service restart.</p>
            </div>
          </div>

          {/* Steps */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Training workflow</h2>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.n} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-400 mt-0.5">{step.n}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white mb-2">{step.title}</div>
                    <pre className="text-xs font-mono text-cyan-200 bg-[#080f1c] border border-sie-border/60 rounded-xl px-4 py-3 overflow-x-auto leading-6 whitespace-pre mb-2">{step.bash}</pre>
                    <p className="text-xs text-sie-muted leading-relaxed">{step.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Accuracy targets */}
          <div className="glass rounded-2xl p-6 border border-purple-500/20 bg-purple-500/5">
            <h2 className="text-base font-bold text-white mb-4">Fine-tuning targets (non-frontier tier)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { metric: 'Macro F1', target: '≥ 0.82' },
                { metric: 'ECE', target: '≤ 0.05' },
                { metric: 'False-action rate', target: '≤ 0.08' },
                { metric: 'Abstention rate', target: '5–15%' },
              ].map((t, i) => (
                <div key={i} className="text-center glass-light rounded-xl p-3">
                  <div className="text-lg font-black text-purple-300 font-mono mb-1">{t.target}</div>
                  <div className="text-xs text-sie-muted">{t.metric}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current calibration state */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Current temperature scalars</h2>
            <p className="text-sm text-sie-muted mb-4">
              Calibrated on {seedExamples} seed examples · State as of {calibratedOn}
            </p>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-sie-border/60">
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold">Signal Type</th>
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold">Temperature Scalar</th>
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold">Calibrated</th>
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold">Samples</th>
                </tr></thead>
                <tbody>
                  {Object.entries(scalars).map(([sig, data], i) => (
                    <tr key={i} className="border-b border-sie-border/20 hover:bg-white/[0.02]">
                      <td className="px-5 py-2.5 font-mono text-xs text-white/80">{sig}</td>
                      <td className="px-5 py-2.5 font-mono text-xs">
                        <span className={data.temperature < 1 ? 'text-blue-400' : data.temperature > 1 ? 'text-orange-400' : 'text-white/50'}>
                          {data.temperature.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-xs">
                        {data.calibrated
                          ? <span className="text-emerald-400 font-semibold">Yes</span>
                          : <span className="text-sie-muted">No</span>}
                      </td>
                      <td className="px-5 py-2.5 text-xs text-sie-muted font-mono">{data.sample_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-sie-border/40 text-xs text-sie-muted italic">
                Temperature = 1.0 means uncalibrated (mathematical identity). Values &lt; 1.0 reduce overconfident outputs.
                Values &gt; 1.0 sharpen underconfident outputs. Scalars reflect calibration on the {seedExamples}-example seed dataset.
              </div>
            </div>
          </section>

          <div className="text-center">
            <Link href={`${SITE.repoUrl}/blob/main/docs/TRAINING.md`} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-sm inline-flex">
              Full Training Guide on GitHub →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

