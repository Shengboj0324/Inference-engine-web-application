import Link from 'next/link'
import { Github, Zap, ExternalLink } from 'lucide-react'
import { SITE } from '@/lib/copy'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#pipeline' },
    { label: 'Benchmarks', href: '/benchmark' },
    { label: 'Signal Taxonomy', href: '/#signal-taxonomy' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Documentation: [
    { label: 'Deployment Guide', href: '/docs/deployment' },
    { label: 'Architecture', href: '/docs/architecture' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'LLM Configuration', href: '/docs/llm' },
    { label: 'Training Guide', href: '/docs/training' },
  ],
  Resources: [
    { label: 'GitHub Repository', href: SITE.repoUrl },
    { label: 'Report an Issue', href: `${SITE.repoUrl}/issues` },
    { label: 'Discussions', href: `${SITE.repoUrl}/discussions` },
    { label: 'Releases / Download', href: `${SITE.repoUrl}/releases` },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-sie-border/60 bg-[#030710] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-900/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 blur-md opacity-30" />
              </div>
              <div>
                <span className="text-sm font-bold text-white leading-none block">Social Inference</span>
                <span className="text-xs text-sie-cyan leading-none font-medium">Engine</span>
              </div>
            </Link>
            <p className="text-sm text-sie-muted leading-relaxed mb-5">
              Open-source social intelligence for B2B teams. Self-hosted. Private. Calibrated.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={SITE.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-xs font-medium text-sie-muted hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Link>
              <span className="text-xs px-3 py-2 rounded-xl glass text-emerald-400 font-semibold">MIT License</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{heading}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-1 text-sm text-sie-muted hover:text-white transition-colors duration-200 group"
                    >
                      {link.label}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-sie-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sie-muted">
            © 2026 Social Inference Engine Contributors. MIT License.
          </p>
          <p className="text-xs text-sie-muted">
            Built with Next.js · Deployed on{' '}
            <Link
              href="https://pages.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sie-cyan hover:text-white transition-colors duration-200"
            >
              Cloudflare Pages
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

