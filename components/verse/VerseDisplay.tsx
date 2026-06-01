'use client'

import { Copy, Bookmark, Check } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { copyToClipboard } from '@/lib/utils'
import type { VerseResult } from '@/types'

interface VerseDisplayProps {
  verse: VerseResult
  onSave?: () => void
  isSaved?: boolean
  dark?: boolean
  size?: 'default' | 'large' | 'display'
  className?: string
}

export function VerseDisplay({ verse, onSave, isSaved, dark, size = 'default', className }: VerseDisplayProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyToClipboard(`${verse.formattedRef} — ${verse.text} (${verse.reference.version})`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const textSizes = {
    default: { ref: 'text-2xl md:text-3xl', text: 'text-base md:text-lg leading-relaxed' },
    large: { ref: 'text-3xl md:text-4xl lg:text-5xl', text: 'text-lg md:text-xl lg:text-2xl leading-relaxed' },
    display: { ref: 'text-5xl md:text-7xl lg:text-8xl', text: 'text-2xl md:text-3xl lg:text-4xl leading-relaxed' },
  }

  const ts = textSizes[size]

  return (
    <div className={cn('animate-verse-appear', className)}>
      {/* Reference */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className={cn(
          'font-bold tracking-tight',
          ts.ref,
          dark ? 'text-white' : 'text-navy-900'
        )}>
          {verse.formattedRef}
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="gold">{verse.reference.version}</Badge>
          {verse.reference.language && verse.reference.language !== 'English' && (
            <Badge variant="blue">{verse.reference.language}</Badge>
          )}
        </div>
      </div>

      {/* Verse text */}
      <p className={cn(
        'font-medium',
        ts.text,
        dark ? 'text-blue-100' : 'text-gray-700'
      )}>
        {verse.text}
      </p>

      {/* Actions */}
      {size !== 'display' && (
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              dark
                ? 'text-blue-300 hover:bg-white/10'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                isSaved
                  ? 'text-gold-600 bg-gold-400/10'
                  : dark
                    ? 'text-blue-300 hover:bg-white/10'
                    : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
              {isSaved ? 'Saved' : 'Save verse'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
