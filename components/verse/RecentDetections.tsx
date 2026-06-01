'use client'

import { Clock, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'
import type { Detection } from '@/types'

interface RecentDetectionsProps {
  detections: Detection[]
  onSelect?: (d: Detection) => void
  onClear?: () => void
  dark?: boolean
  compact?: boolean
  className?: string
}

export function RecentDetections({ detections, onSelect, onClear, dark, compact, className }: RecentDetectionsProps) {
  if (detections.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Clock size={28} className="mx-auto mb-2 text-gray-300" />
        <p className={cn('text-sm', dark ? 'text-blue-200/50' : 'text-gray-400')}>
          No detections yet. Start speaking to detect a Bible reference.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn('text-sm font-semibold flex items-center gap-1.5', dark ? 'text-blue-200' : 'text-gray-500')}>
          <Clock size={14} />
          Recent Detections
        </h3>
        {onClear && detections.length > 0 && (
          <button
            onClick={onClear}
            className={cn('text-xs flex items-center gap-1 transition-colors', dark ? 'text-blue-300/60 hover:text-red-400' : 'text-gray-400 hover:text-red-500')}
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {detections.slice(0, compact ? 5 : 10).map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect?.(d)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all',
              dark
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-gray-50 text-navy-900'
            )}
          >
            <div>
              <span className="text-sm font-semibold">{d.detectedReference}</span>
              {!compact && d.rawTranscript && (
                <p className={cn('text-xs mt-0.5 truncate max-w-48', dark ? 'text-blue-300/60' : 'text-gray-400')}>
                  "{d.rawTranscript}"
                </p>
              )}
            </div>
            <div className="text-right shrink-0 ml-2">
              <span className={cn('text-xs', dark ? 'text-blue-300/60' : 'text-gray-400')}>
                {d.version}
              </span>
              {!compact && (
                <p className={cn('text-xs', dark ? 'text-blue-300/40' : 'text-gray-300')}>
                  {formatTime(d.createdAt)}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
