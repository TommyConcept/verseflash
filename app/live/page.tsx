'use client'

import { useCallback, useEffect, useState } from 'react'
import { Monitor, AlertCircle, WifiOff } from 'lucide-react'
import Link from 'next/link'
import { useVoiceDetection } from '@/hooks/useVoiceDetection'
import { useAppStore } from '@/hooks/useAppStore'
import { parseBibleReference, formatReference, validateBibleReference } from '@/lib/parser'
import { fetchVerse } from '@/lib/bible/api'
import { createClient } from '@/lib/supabase/client'
import { MicButton } from '@/components/voice/MicButton'
import { VerseDisplay } from '@/components/verse/VerseDisplay'
import { ManualSearch } from '@/components/verse/ManualSearch'
import { RecentDetections } from '@/components/verse/RecentDetections'
import { VersionSelector } from '@/components/ui/VersionSelector'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { Badge } from '@/components/ui/Badge'
import type { BibleVersion, VerseResult, Detection } from '@/types'
import { generateId } from '@/lib/utils'

// ─── Live Detection Page ────────────────────────────────────────────────────

export default function LivePage() {
  const {
    currentVerse, setCurrentVerse,
    detections, addDetection, clearDetections,
    selectedVersion, setSelectedVersion,
    selectedLanguage,
  } = useAppStore()

  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [pendingSuggestion, setPendingSuggestion] = useState<string | null>(null)
  const [lastTranscript, setLastTranscript] = useState('')
  const [lastConfidence, setLastConfidence] = useState<number | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const processTranscript = useCallback(async (transcript: string, isFinal: boolean) => {
    if (!transcript.trim()) return
    setLastTranscript(transcript)

    const parsed = parseBibleReference(transcript)

    if (!parsed.book || !parsed.chapter) return

    const version = (parsed.version ?? selectedVersion) as BibleVersion
    const isValid = validateBibleReference(parsed.book, parsed.chapter, parsed.verseStart)

    if (!isValid) {
      setFetchError('Reference not found. Please try again.')
      return
    }

    setLastConfidence(parsed.confidence)

    // Low confidence → show suggestion only
    if (parsed.confidence < 0.45) {
      setPendingSuggestion(formatReference(parsed))
      return
    }

    if (!isFinal) return // Don't fetch on interim results

    setLoading(true)
    setFetchError(null)
    setPendingSuggestion(null)

    try {
      const result = await fetchVerse({
        book: parsed.book,
        chapter: parsed.chapter,
        verseStart: parsed.verseStart,
        version,
      })

      const formattedRef = formatReference(parsed)
      const verse: VerseResult = {
        reference: { ...parsed, version } as any,
        text: result.text,
        formattedRef,
      }

      setCurrentVerse(verse)
      setIsSaved(false)

      // Save detection to Supabase
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const detection: Detection = {
        id: generateId(),
        userId: user?.id ?? '',
        book: parsed.book,
        chapter: parsed.chapter!,
        verseStart: parsed.verseStart,
        verseEnd: parsed.verseEnd,
        version,
        language: parsed.language ?? selectedLanguage,
        detectedReference: formattedRef,
        rawTranscript: transcript,
        confidence: parsed.confidence,
        verseText: result.text,
        createdAt: new Date().toISOString(),
      }

      addDetection(detection)

      if (user) {
        await supabase.from('verse_detections').insert({
          user_id: user.id,
          book: parsed.book,
          chapter: parsed.chapter,
          verse_start: parsed.verseStart,
          verse_end: parsed.verseEnd,
          version,
          language: parsed.language ?? selectedLanguage,
          detected_reference: formattedRef,
          raw_transcript: transcript,
          confidence: parsed.confidence,
        })
      }
    } catch (err: any) {
      setFetchError(err.message ?? 'Failed to fetch verse.')
    } finally {
      setLoading(false)
    }
  }, [selectedVersion, selectedLanguage, setCurrentVerse, addDetection])

  const { listeningState, liveTranscript, isSupported, error: voiceError, startListening, stopListening } = useVoiceDetection({
    onTranscript: processTranscript,
    continuous: true,
  })

  async function handleSaveVerse() {
    if (!currentVerse) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('saved_verses').insert({
      user_id: user.id,
      book: currentVerse.reference.book,
      chapter: currentVerse.reference.chapter,
      verse_start: currentVerse.reference.verseStart,
      version: currentVerse.reference.version,
      language: currentVerse.reference.language ?? selectedLanguage,
      verse_text: currentVerse.text,
    })
    setIsSaved(true)
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Top bar */}
      <div className="border-b border-navy-800 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">Live Detection</h1>
          {listeningState === 'listening' && (
            <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-red-300">Listening</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <VersionSelector
            value={selectedVersion}
            onChange={setSelectedVersion}
            dark
          />
          <Link
            href="/display"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Monitor size={13} />
            Display Mode
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Verse display */}
            <div className="bg-navy-800 rounded-3xl border border-navy-700 p-8 min-h-64">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-blue-200/60 text-sm">Fetching verse...</p>
                  </div>
                </div>
              ) : currentVerse ? (
                <VerseDisplay
                  verse={currentVerse}
                  onSave={handleSaveVerse}
                  isSaved={isSaved}
                  dark
                  size="large"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl text-navy-600 font-black">V</span>
                  </div>
                  <p className="text-blue-200/50 text-lg font-medium">
                    {listeningState === 'listening'
                      ? 'Speak a Bible reference...'
                      : 'Press the microphone to start detecting'}
                  </p>
                  <p className="text-blue-300/30 text-sm mt-2">
                    Try: "John chapter three verse sixteen"
                  </p>
                </div>
              )}
            </div>

            {/* Errors / suggestions */}
            {(voiceError || fetchError) && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{voiceError || fetchError}</p>
              </div>
            )}

            {pendingSuggestion && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                <p className="text-sm text-yellow-300">
                  Did you mean <strong>{pendingSuggestion}</strong>?
                </p>
              </div>
            )}

            {!isSupported && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-start gap-3">
                <WifiOff size={16} className="text-orange-400 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-300">
                  Voice detection is not supported on this browser. Please use manual search or try Chrome, Edge, or Safari.
                </p>
              </div>
            )}

            {/* Live transcript */}
            {(liveTranscript || lastTranscript) && (
              <div className="bg-navy-800/60 rounded-2xl p-4 border border-navy-700">
                <p className="text-xs text-blue-300/50 font-semibold uppercase tracking-widest mb-2">Detected speech</p>
                <p className="text-blue-100 text-sm italic">"{liveTranscript || lastTranscript}"</p>
                {lastConfidence !== null && (
                  <div className="mt-3">
                    <ConfidenceBar score={lastConfidence} />
                  </div>
                )}
              </div>
            )}

            {/* Manual search */}
            <div>
              <p className="text-xs text-blue-300/50 font-semibold uppercase tracking-widest mb-3">Manual Search</p>
              <ManualSearch
                selectedVersion={selectedVersion}
                onVerseFound={(verse) => {
                  setCurrentVerse(verse)
                  setIsSaved(false)
                }}
                dark
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Mic button */}
            <div className="bg-navy-800 rounded-3xl border border-navy-700 p-8 flex flex-col items-center gap-4">
              <MicButton
                state={listeningState}
                onStart={startListening}
                onStop={stopListening}
                size="xl"
              />
              <p className="text-sm font-semibold text-blue-200/60">
                {listeningState === 'listening' ? 'Tap to stop' : 'Tap to start'}
              </p>
              <Badge variant="gold">{selectedVersion}</Badge>
            </div>

            {/* Recent detections */}
            <div className="bg-navy-800 rounded-3xl border border-navy-700 p-5">
              <RecentDetections
                detections={detections}
                onSelect={(d) => {
                  if (d.verseText) {
                    setCurrentVerse({
                      reference: {
                        book: d.book,
                        chapter: d.chapter,
                        verseStart: d.verseStart,
                        verseEnd: d.verseEnd,
                        version: d.version,
                        language: d.language,
                        confidence: d.confidence,
                        rawTranscript: d.rawTranscript,
                      },
                      text: d.verseText,
                      formattedRef: d.detectedReference,
                    })
                  }
                }}
                onClear={clearDetections}
                dark
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
