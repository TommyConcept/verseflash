import { Mic } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(245,200,66,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-navy-800 border border-navy-700 rounded-xl flex items-center justify-center">
              <Mic size={18} className="text-gold-400" />
            </div>
            <span className="text-xl font-bold text-white">VerseFlash</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Instantly Detect
              <br />
              <span className="text-gradient-gold">Bible References</span>
              <br />
              From Voice
            </h2>
            <p className="text-blue-200/70 text-lg leading-relaxed max-w-md">
              Built for churches, livestream teams, Bible teachers, and personal devotion. Speak a reference — the verse appears in seconds.
            </p>

            {/* Sample detections */}
            <div className="mt-10 space-y-3">
              {[
                { heard: '"John chapter three verse sixteen"', ref: 'John 3:16' },
                { heard: '"Romans eight twenty eight"', ref: 'Romans 8:28' },
                { heard: '"First Corinthians thirteen four"', ref: '1 Corinthians 13:4' },
              ].map((ex) => (
                <div key={ex.ref} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse shrink-0" />
                  <div>
                    <p className="text-xs text-blue-300/60 italic">{ex.heard}</p>
                    <p className="text-sm font-bold text-white">{ex.ref}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-off-white">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <Mic size={16} className="text-gold-400" />
            </div>
            <span className="font-bold text-navy-900">VerseFlash</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
