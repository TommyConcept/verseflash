import Link from 'next/link'
import {
  Mic, BookOpen, Monitor, Bookmark, Search, Globe,
  Zap, Users, Radio, PlayCircle, ChevronRight, Star,
  CheckCircle, ArrowRight, Wifi
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-off-white font-poppins">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <Mic size={16} className="text-gold-400" />
            </div>
            <span className="text-lg font-bold text-navy-900">VerseFlash</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-navy-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-navy-900 transition-colors">How It Works</a>
            <a href="#use-cases" className="hover:text-navy-900 transition-colors">Use Cases</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-navy-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy-800 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-navy-950 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(245,200,66,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 opacity-90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/30 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                <Zap size={12} />
                Voice-Powered Bible Reference Detection
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6">
                Instantly Detect
                <br />
                <span className="text-gradient-gold">Bible References</span>
                <br />
                From Voice
              </h1>
              <p className="text-xl text-blue-200/80 font-medium leading-relaxed mb-10 max-w-lg">
                Speak a Bible reference and VerseFlash displays the scripture in seconds. Built for churches, livestream teams, and Bible teachers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 bg-gold-400 text-navy-900 font-bold text-base px-7 py-4 rounded-xl hover:bg-gold-500 transition-colors shadow-xl shadow-gold-400/20"
                >
                  <Mic size={18} />
                  Start Detecting
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold text-base px-7 py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  Create Free Account
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex items-center gap-1.5 text-blue-200/60 text-sm">
                  <CheckCircle size={14} className="text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5 text-blue-200/60 text-sm">
                  <CheckCircle size={14} className="text-green-400" />
                  Free forever plan
                </div>
              </div>
            </div>

            {/* Right — App mockup */}
            <div className="relative">
              <div className="relative mx-auto max-w-sm">
                {/* Outer glow */}
                <div className="absolute -inset-4 bg-gold-400/10 rounded-3xl blur-2xl" />

                {/* App card mockup */}
                <div className="relative bg-navy-800 rounded-3xl border border-navy-700 p-6 shadow-2xl">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-red-300">Listening...</span>
                    </div>
                    <div className="text-xs text-blue-300 font-semibold">NKJV</div>
                  </div>

                  {/* Transcript */}
                  <div className="bg-navy-700/50 rounded-xl p-3 mb-4 border border-navy-600">
                    <p className="text-xs text-blue-300/60 mb-1 font-medium">Detected speech</p>
                    <p className="text-sm text-blue-200 font-medium italic">"John chapter three verse sixteen"</p>
                  </div>

                  {/* Detected reference */}
                  <div className="mb-4">
                    <p className="text-xs text-gold-400 font-bold mb-1 uppercase tracking-widest">Detected Reference</p>
                    <h2 className="text-4xl font-black text-white">John 3:16</h2>
                  </div>

                  {/* Verse */}
                  <div className="bg-navy-700/30 rounded-xl p-4 border border-navy-600/50">
                    <p className="text-sm text-blue-100 leading-relaxed font-medium">
                      "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life."
                    </p>
                  </div>

                  {/* Bottom actions */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-xs text-green-300 font-semibold">High confidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-blue-300 hover:text-white bg-navy-700/50 px-2.5 py-1.5 rounded-lg transition-colors">
                        Copy
                      </button>
                      <button className="text-xs text-gold-400 bg-gold-400/10 px-2.5 py-1.5 rounded-lg">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Case Strip ── */}
      <section id="use-cases" className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Built for every Christian context
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Users, label: 'Churches', desc: 'Live projection' },
              { icon: BookOpen, label: 'Bible Study', desc: 'Groups & personal' },
              { icon: Radio, label: 'Livestream', desc: 'Teams & creators' },
              { icon: PlayCircle, label: 'Content Creators', desc: 'Christian media' },
              { icon: Mic, label: 'Bible Teachers', desc: 'Sermons & lessons' },
              { icon: Star, label: 'Devotion', desc: 'Personal study' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                  <Icon size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-gold-600 font-bold text-sm uppercase tracking-widest mb-3">Simple as speaking</p>
            <h2 className="text-4xl md:text-5xl font-black text-navy-900">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Mic,
                title: 'Turn on Microphone',
                desc: 'Tap the microphone button to start voice detection. VerseFlash listens in real time through your browser.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Speak a Reference',
                desc: 'Say any Bible reference naturally. "John three sixteen", "Romans eight twenty-eight", or "Psalm twenty-three" all work.',
              },
              {
                step: '03',
                icon: BookOpen,
                title: 'Verse Appears Instantly',
                desc: 'VerseFlash detects the reference, fetches the verse from your chosen Bible version, and displays it on screen.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                  <div className="flex items-start gap-4 mb-5">
                    <span className="text-6xl font-black text-gray-100 leading-none">{item.step}</span>
                    <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                      <item.icon size={22} className="text-gold-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10">
                    <ArrowRight size={20} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-gold-600 font-bold text-sm uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-black text-navy-900">
              Powerful Features,<br />Clean Interface
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mic,
                title: 'Voice Reference Detection',
                desc: 'Detects all 66 Bible books, chapters, and verses from natural speech. Handles "First Corinthians", "Psalm twenty-three", and more.',
                accent: 'bg-red-50 border-red-100',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
              },
              {
                icon: BookOpen,
                title: 'Bible Version Switching',
                desc: 'Switch between KJV, NKJV, NIV, ESV, NLT, AMP, and WEB. Connect licensed Bible APIs for premium versions.',
                accent: 'bg-blue-50 border-blue-100',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
              },
              {
                icon: Monitor,
                title: 'Church Display Mode',
                desc: 'Full-screen projection mode with large, bold text. Clean, distraction-free layout designed for projectors and livestreams.',
                accent: 'bg-purple-50 border-purple-100',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
              },
              {
                icon: Bookmark,
                title: 'Saved Verses',
                desc: 'Save any detected verse to your personal library. Add notes, copy text, and build your reference collection.',
                accent: 'bg-yellow-50 border-yellow-100',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
              },
              {
                icon: Search,
                title: 'Manual Search',
                desc: 'Type any Bible reference directly. The same smart parser handles typed and spoken references equally.',
                accent: 'bg-green-50 border-green-100',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
              },
              {
                icon: Globe,
                title: 'Language Preference',
                desc: 'Set your preferred language for Bible text display. Supports English, French, Spanish, Portuguese, and African languages.',
                accent: 'bg-orange-50 border-orange-100',
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-600',
              },
            ].map((f) => (
              <div key={f.title} className={`rounded-3xl border p-7 ${f.accent}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${f.iconBg}`}>
                  <f.icon size={22} className={f.iconColor} />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Church Display Mode Preview ── */}
      <section className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-400 font-bold text-sm uppercase tracking-widest mb-4">Church Display Mode</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Projection-Ready<br />Scripture Display
              </h2>
              <p className="text-blue-200/70 text-lg leading-relaxed mb-8">
                One click to full-screen mode. Large, bold Poppins text with smooth verse transitions. Designed for projectors, confidence monitors, and livestream overlays.
              </p>
              <ul className="space-y-3">
                {[
                  'Full-screen, distraction-free layout',
                  'Smooth animated verse transitions',
                  'Optimized for projectors and monitors',
                  'Suitable for church, livestream, and Bible class',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-blue-200/80 text-sm font-medium">
                    <CheckCircle size={16} className="text-gold-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Display mockup */}
            <div className="bg-black rounded-3xl border border-navy-700 shadow-2xl overflow-hidden aspect-video flex items-center justify-center p-10">
              <div className="text-center">
                <p className="text-gold-400/80 text-sm font-bold uppercase tracking-widest mb-4">John 3:16</p>
                <p className="text-white text-2xl md:text-3xl font-bold leading-relaxed">
                  "For God so loved the world that He gave His only begotten Son..."
                </p>
                <div className="mt-8 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <span className="text-gold-400 text-xs font-bold">NKJV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Mic size={28} className="text-gold-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6">
            Start Detecting Scripture<br />From Voice Today
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Free to use. No credit card needed. Works in your browser instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-navy-800 transition-colors shadow-xl"
            >
              <Mic size={18} />
              Start Detecting Free
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-navy-900 font-bold text-base px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center border border-navy-700">
                <Mic size={16} className="text-gold-400" />
              </div>
              <span className="font-bold text-lg">VerseFlash</span>
            </div>
            <p className="text-blue-200/40 text-sm text-center">
              Bible verse text availability depends on the connected Bible API and licensing.
              Public domain versions (KJV, WEB) are available in demo mode.
            </p>
            <p className="text-blue-200/40 text-sm">
              &copy; {new Date().getFullYear()} VerseFlash
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
