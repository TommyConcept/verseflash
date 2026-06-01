'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { ListeningState } from '@/types'

// Browser SpeechRecognition compatibility
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface UseVoiceDetectionOptions {
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  language?: string
  continuous?: boolean
}

interface UseVoiceDetectionReturn {
  listeningState: ListeningState
  liveTranscript: string
  finalTranscript: string
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useVoiceDetection(options: UseVoiceDetectionOptions = {}): UseVoiceDetectionReturn {
  const { onTranscript, onError, language = 'en-US', continuous = true } = options

  const [listeningState, setListeningState] = useState<ListeningState>('idle')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check support on mount
  useEffect(() => {
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    setIsSupported(supported)
  }, [])

  const initRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return null

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      setListeningState('listening')
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      if (interim) {
        setLiveTranscript(interim)
        onTranscript?.(interim, false)
      }

      if (final) {
        setFinalTranscript(prev => prev + ' ' + final)
        setLiveTranscript('')
        onTranscript?.(final.trim(), true)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = 'An error occurred during voice detection.'
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone permissions and try again.'
          break
        case 'no-speech':
          errorMessage = 'No speech was detected. Please speak clearly and try again.'
          break
        case 'network':
          errorMessage = 'A network error occurred. Please check your connection.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please connect a microphone.'
          break
        case 'aborted':
          errorMessage = ''
          break
      }
      if (errorMessage) {
        setError(errorMessage)
        onError?.(errorMessage)
      }
      setListeningState('idle')
    }

    recognition.onend = () => {
      setListeningState(prev => prev === 'listening' ? 'idle' : prev)
    }

    return recognition
  }, [language, continuous, onTranscript, onError])

  const startListening = useCallback(() => {
    if (listeningState === 'listening') return

    if (!isSupported) {
      const msg = 'Voice detection is not supported on this browser. Please use manual search or try Chrome, Edge, or Safari.'
      setError(msg)
      onError?.(msg)
      return
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      recognitionRef.current = initRecognition()
      recognitionRef.current?.start()
      setListeningState('listening')
      setError(null)
    } catch (err) {
      const msg = 'Failed to start voice detection. Please try again.'
      setError(msg)
      onError?.(msg)
      setListeningState('idle')
    }
  }, [listeningState, isSupported, initRecognition, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListeningState('idle')
    setLiveTranscript('')
  }, [])

  const resetTranscript = useCallback(() => {
    setLiveTranscript('')
    setFinalTranscript('')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  return {
    listeningState,
    liveTranscript,
    finalTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
