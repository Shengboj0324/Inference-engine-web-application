'use client'
import { ExternalLink, Globe } from 'lucide-react'
import Link from 'next/link'
import { PLATFORMS } from '@/lib/copy'
import { SITE } from '@/lib/copy'

const typeBadgeColors: Record<string, string> = {
  Social: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Generic: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  News: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const platformEmoji: Record<string, string> = {
  Reddit: '🟠',
  YouTube: '🔴',
  TikTok: '⚫',
  Facebook: '🔵',
  Instagram: '🟣',
  WeChat: '🟢',
  RSS: '🟡',
  'New York Times': '⬛',
  'Wall Street Journal': '📰',
  'ABC News (US)': '🔵',
  'ABC News Australia': '🔵',
  'Google News': '🔴',
  'Apple News': '⚫',
}

export default function Platforms() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sie-surface/20" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-900/8 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-label mb-4">PLATFORM COVERAGE</div>
          <h2 className="section-heading mb-6">
            13 connectors.{' '}
            <span className="text-sie-cyan">Social, news, and community</span>{' '}
            — all in one queue.
          </h2>
          <p className="section-subheading mx-auto text-center">
            Every platform connector implements the same interface. Adding a new source takes one API credential
            and one configuration object. No custom ETL pipeline required.
          </p>
        </div>

        {/* Platform grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
          {PLATFORMS.map((platform, i) => (
            <div
              key={i}
              className="group glass rounded-2xl p-4 flex flex-col gap-3 hover:border-sie-cyan/20 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,212,255,0.08)]"
            >
              {/* Emoji + name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-sie-border flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                  {platformEmoji[platform.name] || '🌐'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white leading-tight truncate">{platform.name}</div>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-medium ${typeBadgeColors[platform.type]}`}>
                    {platform.type}
                  </span>
                </div>
              </div>

              {/* Coverage */}
              <div>
                <div className="text-xs text-sie-muted leading-snug">{platform.coverage}</div>
              </div>

              {/* Credential */}
              <div className="pt-2 border-t border-sie-border/50">
                <div className="text-xs text-sie-muted/70 font-mono truncate">{platform.credential}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <Globe className="w-10 h-10 text-sie-cyan mx-auto mb-4 opacity-80" />
          <h3 className="text-lg font-bold text-white mb-2">Need a platform that isn&apos;t listed?</h3>
          <p className="text-sm text-sie-muted mb-5 leading-relaxed">
            The connector interface is documented. Adding a new connector requires implementing one abstract class
            with three methods: <code>authenticate()</code>, <code>fetch()</code>, and <code>validate_credentials()</code>.
          </p>
          <Link
            href={`${SITE.repoUrl}/blob/main/docs/connectors.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-sie-cyan font-semibold hover:text-white transition-colors duration-200"
          >
            Read the connector guide
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

