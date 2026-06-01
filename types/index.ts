// Bible Reference Types
export interface BibleReference {
  book: string
  chapter: number
  verseStart: number | null
  verseEnd: number | null
  version: BibleVersion
  language: string
  confidence: number
  rawTranscript: string
}

export type BibleVersion = 'NKJV' | 'KJV' | 'NIV' | 'ESV' | 'NLT' | 'AMP' | 'WEB'

export interface VerseResult {
  reference: BibleReference
  text: string
  formattedRef: string // e.g. "John 3:16"
}

// Detection Types
export interface Detection {
  id: string
  userId: string
  book: string
  chapter: number
  verseStart: number | null
  verseEnd: number | null
  version: BibleVersion
  language: string
  detectedReference: string
  rawTranscript: string
  confidence: number
  verseText?: string
  createdAt: string
}

// Saved Verse Types
export interface SavedVerse {
  id: string
  userId: string
  book: string
  chapter: number
  verseStart: number | null
  verseEnd: number | null
  version: BibleVersion
  language: string
  verseText: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

// User Profile
export interface Profile {
  id: string
  userId: string
  fullName: string
  email: string
  preferredVersion: BibleVersion
  preferredLanguage: string
  plan: 'free' | 'premium'
  createdAt: string
  updatedAt: string
}

// Voice Detection State
export type ListeningState = 'idle' | 'listening' | 'processing' | 'error'

export interface VoiceDetectionState {
  listeningState: ListeningState
  liveTranscript: string
  finalTranscript: string
  error: string | null
  isSupported: boolean
}

// Bible API
export interface BibleAPIConfig {
  name: string
  baseUrl: string
  apiKey?: string
  supportedVersions: BibleVersion[]
  supportedLanguages: string[]
}

export interface FetchVerseParams {
  book: string
  chapter: number
  verseStart: number | null
  verseEnd?: number | null
  version: BibleVersion
  language?: string
}

export interface FetchVerseResult {
  text: string
  reference: string
  version: BibleVersion
  copyright?: string
}

// Parser result before validation
export interface ParseResult {
  book: string | null
  chapter: number | null
  verseStart: number | null
  verseEnd: number | null
  version: BibleVersion | null
  language: string | null
  confidence: number
  rawTranscript: string
}

// Confidence levels
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface ConfidenceIndicator {
  level: ConfidenceLevel
  score: number
  label: string
}

// UI State
export interface AppState {
  currentVerse: VerseResult | null
  pendingReference: ParseResult | null
  detections: Detection[]
  savedVerses: SavedVerse[]
  profile: Profile | null
  selectedVersion: BibleVersion
  selectedLanguage: string
  isDisplayMode: boolean
}
