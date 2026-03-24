'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/copy'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-sie-surface/20" />
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label mb-4">FAQ</div>
          <h2 className="section-heading">Frequently asked questions</h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3" role="list">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                open === i ? 'border-sie-cyan/20 shadow-[0_4px_24px_rgba(0,212,255,0.06)]' : ''
              }`}
              role="listitem"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-base font-semibold text-white group-hover:text-sie-cyan transition-colors duration-200 leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-sie-muted flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                    open === i ? 'rotate-180 text-sie-cyan' : ''
                  }`}
                />
              </button>

              {open === i && (
                <div
                  id={`faq-answer-${i}`}
                  className="px-6 pb-5"
                >
                  <div className="pt-1 border-t border-sie-border/40 pt-4">
                    <p className="text-sm text-sie-muted leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

