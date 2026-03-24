'use client'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sie-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/8 rounded-full blur-3xl" />

      <div className="relative text-center max-w-lg">
        <div className="text-[120px] font-black text-white/5 leading-none mb-8 select-none font-mono">
          404
        </div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[80px] font-black leading-none">
          <span className="bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">404</span>
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-base text-sie-muted leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Return to the home page to navigate to the right place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

