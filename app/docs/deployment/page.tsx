import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { SITE } from '@/lib/copy'
import { CheckCircle, Terminal, Server, AlertTriangle, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Deployment Guide',
  description: 'Step-by-step guide to deploying Social Inference Engine locally with Docker Compose or bare-metal on macOS, Ubuntu, or Windows WSL2.',
}

const sysReqs = [
  { component: 'CPU',    min: '4 cores',                     rec: '8+ cores' },
  { component: 'RAM',    min: '8 GB',                        rec: '16 GB' },
  { component: 'Disk',   min: '10 GB',                       rec: '30 GB (model weights + data)' },
  { component: 'Python', min: '3.9',                         rec: '3.11' },
  { component: 'Docker', min: '24.0+ (Compose v2)',          rec: 'Docker Desktop 4.28+' },
  { component: 'OS',     min: 'macOS 12, Ubuntu 20.04, WSL2',rec: 'macOS 14 / Ubuntu 22.04' },
]

const dockerSteps = [
  {
    n: 1, title: 'Clone the repository',
    bash: `git clone ${SITE.repoUrl}.git\ncd Inference-Engine`,
  },
  {
    n: 2, title: 'Generate secrets and configure',
    bash: `cp .env.example .env\n# Generate a random secret key\npython3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"\n# Generate an encryption key\npython3 -c "import secrets; print('ENCRYPTION_KEY=' + secrets.token_urlsafe(32))"\n# Paste both values into .env, then add your OPENAI_API_KEY`,
  },
  { n: 3, title: 'Start the full stack', bash: 'docker compose up' },
  {
    n: 4, title: 'Run initial calibration (separate terminal)',
    bash: 'docker compose exec api python training/calibrate.py --epochs 5',
  },
  { n: 5, title: 'Verify health', bash: 'curl http://localhost:8000/health' },
]

const expectedOutput = '{"status": "healthy", "database": "ok", "redis": "ok"}'

const envVars = [
  { key: 'SECRET_KEY',             req: true,  desc: 'JWT signing secret (min 32 chars, generated above)' },
  { key: 'ENCRYPTION_KEY',         req: true,  desc: 'AES encryption key for stored credentials (min 32 chars)' },
  { key: 'DATABASE_URL',           req: true,  desc: 'Async PostgreSQL 15+ DSN (asyncpg driver)' },
  { key: 'DATABASE_SYNC_URL',      req: true,  desc: 'Sync PostgreSQL DSN (psycopg2 driver, used by Alembic)' },
  { key: 'REDIS_URL',              req: true,  desc: 'Redis DSN for Celery broker and cache' },
  { key: 'OPENAI_API_KEY',         req: false, desc: 'Required if using GPT-4o or GPT-4o mini' },
  { key: 'ANTHROPIC_API_KEY',      req: false, desc: 'Required if using Claude 3.5 Sonnet or Haiku' },
  { key: 'LOCAL_LLM_URL',          req: false, desc: 'Ollama base URL (e.g. http://localhost:11434)' },
  { key: 'LOCAL_LLM_MODEL',        req: false, desc: 'Ollama model name (e.g. llama3.1:8b)' },
  { key: 'VLLM_ENDPOINT',          req: false, desc: 'vLLM OpenAI-compatible endpoint URL' },
  { key: 'RATE_LIMIT_PER_MINUTE',  req: false, desc: 'API rate limit per user (default: 60)' },
  { key: 'MAX_ITEMS_PER_FETCH',    req: false, desc: 'Max items per platform fetch cycle (default: 500)' },
]

export default function DeploymentPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-2 text-xs text-sie-muted mb-4 font-mono">
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <span>/</span><span className="text-white">Deployment Guide</span>
            </div>
            <div className="section-label mb-3">DEPLOYMENT GUIDE</div>
            <h1 className="text-4xl font-black text-white mb-3">Running in 5 minutes on any machine</h1>
            <p className="text-base text-sie-muted leading-relaxed">
              Social Inference Engine runs on macOS, Ubuntu, and Windows WSL2.
              No cloud account required. No data ever leaves your machine unless you configure an external LLM provider.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          {/* System requirements */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Server className="w-6 h-6 text-sie-cyan" /> System Requirements
            </h2>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-sie-border/60">
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold tracking-wider">Component</th>
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold tracking-wider">Minimum</th>
                  <th className="text-left px-5 py-3 text-xs text-sie-muted font-semibold tracking-wider">Recommended</th>
                </tr></thead>
                <tbody>
                  {sysReqs.map((r, i) => (
                    <tr key={i} className="border-b border-sie-border/30 hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-semibold text-white/80">{r.component}</td>
                      <td className="px-5 py-3 text-sie-muted font-mono text-xs">{r.min}</td>
                      <td className="px-5 py-3 text-sie-cyan font-mono text-xs">{r.rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Option A — Docker Compose */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-blue-400" /> Option A — Docker Compose <span className="text-sm font-normal text-emerald-400 ml-2">Recommended</span>
            </h2>
            <p className="text-sm text-sie-muted mb-6">
              Starts the full stack — Postgres, Redis, MinIO, API, Celery — in one command. Requires Docker 24.0+ with Compose v2.
            </p>
            <div className="space-y-5">
              {dockerSteps.map((step) => (
                <div key={step.n} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-400 mt-0.5">{step.n}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white mb-2">{step.title}</div>
                    <pre className="text-xs font-mono text-cyan-200 bg-[#080f1c] border border-sie-border/60 rounded-xl px-4 py-3 overflow-x-auto leading-6 whitespace-pre">{step.bash}</pre>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-300 mb-1">Expected health response</div>
                <pre className="text-xs font-mono text-emerald-200">{expectedOutput}</pre>
              </div>
            </div>
          </section>

          {/* Option B */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Option B — Bare-metal (macOS / Ubuntu)</h2>
            <p className="text-sm text-sie-muted mb-4">
              Run the API process directly — useful for debugging and IDE integration. Requires PostgreSQL 15+ with pgvector and Redis already running on your machine.
            </p>
            <pre className="text-xs font-mono text-cyan-200 bg-[#080f1c] border border-sie-border/60 rounded-xl px-4 py-4 overflow-x-auto leading-6 whitespace-pre">{`# Create and activate a Python virtual environment
python3.11 -m venv .venv && source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialise the database
python scripts/init_db.py
alembic upgrade head

# Start the API
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Start a Celery worker (separate terminal)
celery -A app.worker.celery_app worker --loglevel=info`}</pre>
          </section>

          {/* Windows WSL2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Windows — WSL2</h2>
            <div className="flex gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">
                Docker Desktop for Windows with the WSL2 backend is the simplest path on Windows. After installing Docker Desktop, use the Docker Compose steps above from your WSL2 Ubuntu terminal.
              </p>
            </div>
            <pre className="text-xs font-mono text-cyan-200 bg-[#080f1c] border border-sie-border/60 rounded-xl px-4 py-3 overflow-x-auto leading-6 whitespace-pre">{`# In PowerShell (as Administrator)
wsl --install -d Ubuntu-22.04
# After restart, open Ubuntu from Start menu and follow Option A above`}</pre>
          </section>

          {/* Environment variables */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Environment Variables</h2>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-sie-border/60">
                  <th className="text-left px-5 py-3 text-sie-muted font-semibold">Variable</th>
                  <th className="text-left px-5 py-3 text-sie-muted font-semibold">Required</th>
                  <th className="text-left px-5 py-3 text-sie-muted font-semibold">Description</th>
                </tr></thead>
                <tbody>
                  {envVars.map((v, i) => (
                    <tr key={i} className="border-b border-sie-border/20 hover:bg-white/[0.02]">
                      <td className="px-5 py-2.5 font-mono text-blue-300">{v.key}</td>
                      <td className="px-5 py-2.5">
                        {v.req
                          ? <span className="text-red-400 font-semibold">Required</span>
                          : <span className="text-sie-muted">Optional</span>}
                      </td>
                      <td className="px-5 py-2.5 text-sie-muted">{v.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-sie-muted mt-3 italic">
              Full environment reference: see <code className="text-blue-300">.env.example</code> in the repository.
            </p>
          </section>

          {/* Next steps */}
          <section className="glass rounded-2xl p-6 border border-sie-cyan/10">
            <h3 className="text-base font-bold text-white mb-4">Next steps</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'Architecture overview', href: '/docs/architecture' },
                { label: 'LLM configuration guide', href: '/docs/llm' },
                { label: 'Training and calibration', href: '/docs/training' },
                { label: 'API reference', href: '/docs/api' },
                { label: 'Full .env.example', href: `${SITE.repoUrl}/blob/main/.env.example`, ext: true },
                { label: 'GitHub repository', href: SITE.repoUrl, ext: true },
              ].map((l, i) => (
                <Link key={i} href={l.href} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 text-sm text-sie-cyan hover:text-white transition-colors">
                  → {l.label}
                  {l.ext && <ExternalLink className="w-3.5 h-3.5" />}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

