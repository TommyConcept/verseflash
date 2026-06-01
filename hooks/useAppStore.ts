import { create } from 'zustand'
import type { VerseResult, Detection, SavedVerse, Profile, BibleVersion } from '@/types'
import { DEFAULT_VERSION, DEFAULT_LANGUAGE } from '@/constants/bible'

interface AppStore {
  // Current detected verse
  currentVerse: VerseResult | null
  setCurrentVerse: (verse: VerseResult | null) => void

  // Detection history (in-session, also persisted via Supabase)
  detections: Detection[]
  addDetection: (d: Detection) => void
  clearDetections: () => void
  setDetections: (detections: Detection[]) => void

  // Saved verses
  savedVerses: SavedVerse[]
  setSavedVerses: (verses: SavedVerse[]) => void
  addSavedVerse: (v: SavedVerse) => void
  removeSavedVerse: (id: string) => void
  updateSavedVerseNotes: (id: string, notes: string) => void

  // User preferences
  profile: Profile | null
  setProfile: (p: Profile | null) => void
  selectedVersion: BibleVersion
  setSelectedVersion: (v: BibleVersion) => void
  selectedLanguage: string
  setSelectedLanguage: (l: string) => void

  // Display mode
  isDisplayMode: boolean
  setIsDisplayMode: (val: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentVerse: null,
  setCurrentVerse: (verse) => set({ currentVerse: verse }),

  detections: [],
  addDetection: (d) => set((state) => ({ detections: [d, ...state.detections].slice(0, 50) })),
  clearDetections: () => set({ detections: [] }),
  setDetections: (detections) => set({ detections }),

  savedVerses: [],
  setSavedVerses: (verses) => set({ savedVerses: verses }),
  addSavedVerse: (v) => set((state) => ({ savedVerses: [v, ...state.savedVerses] })),
  removeSavedVerse: (id) => set((state) => ({ savedVerses: state.savedVerses.filter(v => v.id !== id) })),
  updateSavedVerseNotes: (id, notes) => set((state) => ({
    savedVerses: state.savedVerses.map(v => v.id === id ? { ...v, notes, updatedAt: new Date().toISOString() } : v),
  })),

  profile: null,
  setProfile: (p) => set({ profile: p }),
  selectedVersion: DEFAULT_VERSION as BibleVersion,
  setSelectedVersion: (v) => set({ selectedVersion: v }),
  selectedLanguage: DEFAULT_LANGUAGE,
  setSelectedLanguage: (l) => set({ selectedLanguage: l }),

  isDisplayMode: false,
  setIsDisplayMode: (val) => set({ isDisplayMode: val }),
}))
