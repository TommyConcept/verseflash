'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { parseBibleReference, formatReference, validateBibleReference } from '@/lib/parser'
import { fetchVerse } from '@/lib/bible/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { VerseResult, BibleVersion } from '@/types'
import { cn } from '@/lib/utils'

interface ManualSearchProps {
  selectedVersion: BibleVersion
  onVerseFound: (verse: VerseResult) => void
  dark?: boolean
  className?: string
}

export function ManualSearch({ selectedVersion, onVerseFound, dark, className }: ManualSearchProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const parsed = parseBibleReference(query)

      if (!parsed.book || !parsed.chapter) {
        setError('Could not detect a Bible reference. Try "John 3:16" or "Romans 8:28".')
        return
      }

      const isValid = validateBibleReference(parsed.book, parsed.chapter, parsed.verseStart)
      if (!isValid) {
        setError('Invalid Bible reference. Please check the book, chapter, and verse.')
        return
      }

      const version = (parsed.version ?? selectedVersion) as BibleVersion
      const result = await fetchVerse({
        book: parsed.book,
        chapter: parsed.chapter,
        verseStart: parsed.verseStart,
        version,
      })

      const formattedRef = formatReference(parsed)

      onVerseFound({
        reference: { ...parsed, version } as any,
        text: result.text,
        formattedRef,
      })
      setQuery('')
    } catch (err: any) {
      setError(err.message ?? 'Failed to fetch verse. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={15}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              dark ? 'text-blue-300' : 'text-gray-400'
            )}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="John 3:16, Romans 8:28, Psalm 23..."
            className={cn(
              'w-full h-11 rounded-xl pl-9 pr-4 text-sm font-medium border transition-all',
              'focus:outline-none focus:ring-2',
              dark
                ? 'bg-navy-800 border-navy-700 text-white placeholder:text-blue-300/50 focus:ring-gold-400'
                : 'bg-white border-gray-200 text-navy-900 placeholder:text-gray-400 focus:ring-navy-900'
            )}
          />
        </div>
        <Button
          onClick={() => handleSearch()}
          loading={loading}
          variant={dark ? 'gold' : 'primary'}
          className="shrink-0"
        >
          {!loading && <Search size={15} />}
          Search
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
