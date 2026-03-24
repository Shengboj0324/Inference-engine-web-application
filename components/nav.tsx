'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Menu, X, Zap } from 'lucide-react'
import { NAV } from '@/lib/copy'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-sie-border/60 shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none tracking-tight">
                Social Inference
              </span>
              <span className="text-xs text-sie-cyan leading-none font-medium mt-0.5">
                Engine
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-sie-muted hover:text-white font-medium transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={NAV.cta.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-sie-muted hover:text-white font-medium transition-colors duration-200 rounded-lg hover:bg-white/5"
            >
              <Github className="w-4 h-4" />
              {NAV.cta.github.label}
            </Link>
            <Link
              href="/docs"
              className="btn-primary text-sm px-5 py-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-sie-muted hover:text-white hover:bg-white/5 transition-colors duration-200"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden glass border-t border-sie-border/60">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm text-sie-muted hover:text-white font-medium transition-colors duration-200 rounded-xl hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-sie-border/60 flex flex-col gap-2">
              <Link
                href={NAV.cta.github.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn-secondary w-full justify-center"
              >
                <Github className="w-4 h-4" />
                {NAV.cta.github.label}
              </Link>
              <Link
                href="/docs"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

