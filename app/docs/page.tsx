import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { SITE } from '@/lib/copy'
import {
  BookOpen, Rocket, Server, Code2, Settings, FlaskConical,
  ExternalLink, ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for Social Inference Engine — deployment, API reference, architecture, and more.',
}

const docSections = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Deploy Social Inference Engine locally in under 5 minutes with Docker Compose. No cloud account required.',
    href: `${SITE.repoUrl}/blob/main/README.md`,
    external: true,
    badge: 'Start here',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    icon: BookOpen,
    title: 'Architecture',
    description: 'System design and component relationships — Bloom filter deduplication, reservoir sampling, LLM routing, and pgvector retrieval.',
    href: `${SITE.repoUrl}/blob/main/docs/architecture.md`,
    external: true,
    badge: 'Deep dive',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    icon: Server,
    title: 'Deployment Guide',
    description: 'Step-by-step instructions for Docker Compose, bare-metal (macOS/Ubuntu), and Windows WSL2 installations.',
    href: `${SITE.repoUrl}/blob/main/README.md#local-deployment`,
    external: true,
    badge: 'Setup',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    icon: Code2,
    title: 'API Reference',
    description: 'Full OpenAPI 3.1 reference for all endpoints. Browse interactively at http://localhost:8000/docs when the server is running.',
    href: `${SITE.repoUrl}/blob/main/docs/api.md`,
    external: true,
    badge: 'API',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
  {
    icon: Settings,
    title: 'LLM Configuration',
    description: 'Configure OpenAI, Anthropic, Ollama, or vLLM providers. Set up two-tier routing for cost efficiency.',
    href: `${SITE.repoUrl}/blob/main/docs/LLM_DEPLOYMENT_GUIDE.md`,
    external: true,
    badge: 'Config',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    icon: FlaskConical,
    title: 'Training Guide',
    description: 'Calibration training and dataset format. How to update temperature scalars with your own analyst feedback data.',
    href: `${SITE.repoUrl}/blob/main/docs/TRAINING.md`,
    external: true,
    badge: 'ML',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
]

const quickstartSteps = [
  { step: 1, label: 'Clone the repository', code: `git clone ${SITE.repoUrl}.git && cd Inference-Engine` },
  { step: 2, label: 'Configure environment', code: 'cp .env.example .env && nano .env  # add your API key' },
  { step: 3, label: 'Start the stack', code: 'docker compose up' },
  { step: 4, label: 'Verify health', code: 'curl http://localhost:8000/health' },
]

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-sie-dark pt-16">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-sie-border/60">
          <div className="absolute inset-0 grid-bg opacity-15" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-900/10 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="section-label mb-4">DOCUMENTATION</div>
              <h1 className="text-5xl font-black text-white mb-4">
                Everything you need to{' '}
                <span className="text-sie-cyan">ship</span>
              </h1>
              <p className="text-lg text-sie-muted leading-relaxed">
                Social Inference Engine ships with comprehensive documentation covering every aspect of deployment,
                configuration, and customisation. All docs live in the GitHub repository.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Quick start */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Quick Start</h2>
            <div className="glass rounded-2xl overflow-hidden">
              {quickstartSteps.map((s, i) => (
                <div key={i} className={`flex gap-6 p-5 ${i < quickstartSteps.length - 1 ? 'border-b border-sie-border/40' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-400">
                    {s.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white mb-2">{s.label}</div>
                    <pre className="text-xs font-mono text-cyan-300 bg-[#0a0f1a] rounded-lg px-4 py-2.5 overflow-x-auto whitespace-pre-wrap break-all">
                      {s.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doc sections grid */}
          <h2 className="text-2xl font-bold text-white mb-8">Reference Documentation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {docSections.map((doc, i) => (
              <Link
                key={i}
                href={doc.href}
                target={doc.external ? '_blank' : undefined}
                rel={doc.external ? 'noopener noreferrer' : undefined}
                className="group glass rounded-2xl p-6 hover:border-sie-cyan/20 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,212,255,0.08)]"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-sie-border flex items-center justify-center group-hover:border-sie-cyan/30 transition-colors duration-300">
                    <doc.icon className="w-5 h-5 text-sie-muted group-hover:text-sie-cyan transition-colors duration-300" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${doc.badgeColor}`}>{doc.badge}</span>
                    {doc.external && <ExternalLink className="w-3.5 h-3.5 text-sie-muted/50" />}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-sie-cyan transition-colors duration-200">{doc.title}</h3>
                <p className="text-sm text-sie-muted leading-relaxed">{doc.description}</p>
              </Link>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="glass rounded-2xl p-8 text-center border border-sie-cyan/10">
            <h2 className="text-xl font-bold text-white mb-3">All documentation lives in the repository</h2>
            <p className="text-sm text-sie-muted leading-relaxed mb-6 max-w-lg mx-auto">
              Docs are maintained alongside the source code. Open a pull request to improve them.
            </p>
            <Link
              href={SITE.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              View on GitHub
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

