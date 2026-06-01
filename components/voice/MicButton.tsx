'use client'

import { Mic, MicOff, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ListeningState } from '@/types'

interface MicButtonProps {
  state: ListeningState
  onStart: () => void
  onStop: () => void
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

export function MicButton({ state, onStart, onStop, size = 'lg', className }: MicButtonProps) {
  const isListening = state === 'listening'

  const sizes = {
    md: { button: 'w-14 h-14', icon: 16, ring: 'w-20 h-20' },
    lg: { button: 'w-20 h-20', icon: 24, ring: 'w-28 h-28' },
    xl: { button: 'w-28 h-28', icon: 36, ring: 'w-40 h-40' },
  }

  const s = sizes[size]

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Pulse ring when listening */}
      {isListening && (
        <>
          <div className={cn('absolute rounded-full bg-red-400/20 animate-ping', s.ring)} />
          <div className={cn('absolute rounded-full bg-red-400/10', s.ring)} style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
        </>
      )}

      <button
        onClick={isListening ? onStop : onStart}
        className={cn(
          'relative z-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl focus:outline-none focus-visible:ring-4',
          s.button,
          isListening
            ? 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-300 animate-mic-pulse'
            : 'bg-navy-900 hover:bg-navy-800 focus-visible:ring-navy-300',
        )}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? (
          <Square size={s.icon} className="text-white fill-white" />
        ) : (
          <Mic size={s.icon} className="text-gold-400" />
        )}
      </button>
    </div>
  )
}
