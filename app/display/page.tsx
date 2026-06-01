'use client'

import { useCallback, useEffect, useState } from 'react'
import { Mic, X, Maximize2, Minimize2, Settings } from 'lucide-react'
import { useVoiceDetection } from '@/hooks/useVoiceDetection'
import { useAppStore } from '@/hooks/useAppStore'
import { parseBibleReference, formatReference, validateBibleReference } from '@/lib/parser'
import { fetchVerse } from '@/lib/bible/api'
import { MicButton } from '@/components/voice/MicButton'
import { VersionSelector } from '@/components/ui/VersionSelector'
import type { BibleVersion, VerseResult } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function DisplayPage() {
  const { currentVerse, setCurrentVerse, selectedVersion, setSelectedVersion } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)

  const processTranscript = useCallback(async (transcript: string, isFinal: boolean) => {
    if (!isFinal || !transcript.trim()) return

    const parsed = parseBibleReference(transcript)
    if (!parsed.book || !parsed.chapter) return
    if (!validateBibleReference(parsed.book, parsed.chapter, parsed.verseStart)) return
    if (parsed.confidence < 0.45) return

    const version = (parsed.version ?? selectedVersion) as BibleVersion
    setLoading(true)

    try {
      const result = await fetchVerse({
        book: parsed.book,
        chapter: parsed.chapter,
        verseStart: parsed.verseStart,
        version,
      })

      setCurrentVerse({
        reference: { ...parsed, version } as any,
        text: result.text,
        formattedRef: formatReference(parsed),
      })
      setAnimationKey(k => k + 1)
    } catch {}

    setLoading(false)
  }, [selectedVersion, setCurrentVerse])

  const { listeningState, isSupported, startListening, stopListening } = useVoiceDetection({
    onTranscript: processTranscript,
    continuous: true,
  })

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
      setTimeout(() => setShowControls(false), 3000)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
      setShowControls(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowControls(true)
      if (e.key === 'm' || e.key === 'M') {
        listeningState === 'listening' ? stopListening() : startListening()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [listeningState, startListening, stopListening])

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col cursor-pointer"
      onClick={() => setShowControls(v => !v)}
    >
      {/* Controls overlay */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-500',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center border border-navy-700">
            <Mic size={14} className="text-gold-400" />
          </div>
          <span className="text-white font-bold text-sm">VerseFlash Display Mode</span>
          {listeningState === 'listening' && (
            <div className="flex items-center gap-1.5 bg-red-500/30 border border-red-500/40 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-red-300">Listening</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <VersionSelector value={selectedVersion} onChange={setSelectedVersion} dark />
          <MicButton
            state={listeningState}
            onStart={startListening}
            onStop={stopListening}
            size="md"
          />
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <Link
            href="/live"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={16} />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-12 md:px-24 text-center">
        {loading ? (
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        ) : currentVerse ? (
          <div key={animationKey} className="animate-verse-appear w-full max-w-5xl">
            {/* Reference */}
            <p className="text-gold-400 text-xl md:text-2xl font-bold uppercase tracking-widest mb-6">
              {currentVerse.formattedRef}
            </p>
            {/* Verse text */}
            <p className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight md:leading-tight">
              "{currentVerse.text}"
            </p>
            {/* Version badge */}
            <div className="mt-10 inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 border border-white/20">
              <span className="text-gold-400 font-bold">{currentVerse.reference.version}</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-navy-900 border border-navy-800 flex items-center justify-center mx-auto mb-8">
              <Mic size={40} className="text-navy-700" />
            </div>
            <p className="text-white/40 text-2xl md:text-3xl font-semibold">
              {listeningState === 'listening'
                ? 'Speak a Bible reference...'
                : 'Press M to start listening'}
            </p>
            {!isSupported && (
              <p className="text-white/30 text-base mt-4">
                Voice detection not supported. Click controls to show, then use manual search.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 flex justify-center pb-6 transition-opacity duration-500',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-white/20 text-xs">Click anywhere to toggle controls  ·  M to toggle mic  ·  Esc to show controls</p>
      </div>
    </div>
  )
}
