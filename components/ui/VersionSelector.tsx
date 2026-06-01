'use client'

import { BookOpen } from 'lucide-react'
import { SUPPORTED_VERSIONS } from '@/constants/bible'
import { isVersionAvailable } from '@/lib/bible/api'
import type { BibleVersion } from '@/types'
import { cn } from '@/lib/utils'

interface VersionSelectorProps {
  value: BibleVersion
  onChange: (version: BibleVersion) => void
  dark?: boolean
  compact?: boolean
  className?: string
}

export function VersionSelector({ value, onChange, dark, compact, className }: VersionSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {!compact && <BookOpen size={14} className={dark ? 'text-blue-300' : 'text-gray-400'} />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BibleVersion)}
        className={cn(
          'text-sm font-semibold rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-2 transition-colors',
          dark
            ? 'bg-navy-800 border-navy-700 text-white focus:ring-gold-400'
            : 'bg-white border-gray-200 text-navy-900 focus:ring-navy-900'
        )}
      >
        {SUPPORTED_VERSIONS.map((v) => {
          const available = isVersionAvailable(v)
          return (
            <option key={v} value={v}>
              {v}{!available ? ' (connect API)' : ''}
            </option>
          )
        })}
      </select>
    </div>
  )
}
