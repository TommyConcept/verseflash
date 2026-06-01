import { cn } from '@/lib/utils'
import { getConfidenceIndicator } from '@/lib/utils'

interface ConfidenceBarProps {
  score: number
  showLabel?: boolean
  className?: string
}

export function ConfidenceBar({ score, showLabel = true, className }: ConfidenceBarProps) {
  const indicator = getConfidenceIndicator(score)

  const colors = {
    high: 'bg-green-500',
    medium: 'bg-yellow-500',
    low: 'bg-red-400',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors[indicator.level])}
          style={{ width: `${score * 100}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 shrink-0">{indicator.label}</span>
      )}
    </div>
  )
}
