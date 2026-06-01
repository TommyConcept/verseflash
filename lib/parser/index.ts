import Fuse from 'fuse.js'
import { BIBLE_BOOKS, SPOKEN_NUMBER_PREFIXES, VERSION_ALIASES, DEFAULT_VERSION, DEFAULT_LANGUAGE } from '@/constants/bible'
import type { ParseResult, BibleVersion } from '@/types'

// ─── Spoken Numbers ────────────────────────────────────────────────────────────

const SPOKEN_ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
}

const SPOKEN_TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
}

const SPOKEN_HUNDREDS: Record<string, number> = {
  hundred: 100,
}

/**
 * Convert a spoken number phrase to a digit.
 * Handles: "three", "twenty eight", "one hundred and fifty"
 */
export function convertSpokenNumbersToDigits(input: string): string {
  // Replace digit words in sequence
  const words = input.split(/\s+/)
  const result: string[] = []
  let i = 0

  while (i < words.length) {
    const w = words[i].toLowerCase()

    // Check for hundreds: "one hundred"
    if (SPOKEN_ONES[w] !== undefined && words[i + 1]?.toLowerCase() === 'hundred') {
      let val = SPOKEN_ONES[w] * 100
      i += 2
      // Check for "and twenty" or "and thirty-eight" after hundred
      if (words[i]?.toLowerCase() === 'and') i++
      if (SPOKEN_TENS[words[i]?.toLowerCase()]) {
        val += SPOKEN_TENS[words[i].toLowerCase()]
        i++
        if (SPOKEN_ONES[words[i]?.toLowerCase()] !== undefined) {
          val += SPOKEN_ONES[words[i].toLowerCase()]
          i++
        }
      } else if (SPOKEN_ONES[words[i]?.toLowerCase()] !== undefined) {
        val += SPOKEN_ONES[words[i].toLowerCase()]
        i++
      }
      result.push(String(val))
      continue
    }

    // Tens + ones: "twenty eight"
    if (SPOKEN_TENS[w] !== undefined) {
      let val = SPOKEN_TENS[w]
      if (SPOKEN_ONES[words[i + 1]?.toLowerCase()] !== undefined) {
        val += SPOKEN_ONES[words[i + 1].toLowerCase()]
        i += 2
      } else {
        i++
      }
      result.push(String(val))
      continue
    }

    if (SPOKEN_ONES[w] !== undefined) {
      result.push(String(SPOKEN_ONES[w]))
      i++
      continue
    }

    result.push(words[i])
    i++
  }

  return result.join(' ')
}

/**
 * Normalize raw speech transcript for parsing.
 */
export function normalizeSpeechText(input: string): string {
  let text = input.toLowerCase().trim()

  // Remove filler words
  text = text.replace(/\b(um|uh|like|you know|so|and then|now|let me|let's|please|just|okay|ok|well)\b/g, ' ')

  // Normalize "chapter X verse Y" phrasing
  text = text.replace(/\bchapter\b/g, 'chapter')
  text = text.replace(/\bverse\b/g, 'verse')
  text = text.replace(/\bverses\b/g, 'verse')

  // Normalize "in [version]" → just keep version detection in version parser
  // Convert spoken number prefixes for numbered books
  for (const [spoken, digit] of Object.entries(SPOKEN_NUMBER_PREFIXES)) {
    // "first corinthians" → "1 corinthians"
    text = text.replace(new RegExp(`\\b${spoken}\\s+`, 'g'), `${digit} `)
  }

  // Convert spoken numbers to digits
  text = convertSpokenNumbersToDigits(text)

  // Normalize multiple spaces
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

// ─── Book Detection ─────────────────────────────────────────────────────────

// Build a flat alias → canonical name map
const ALIAS_MAP: Record<string, string> = {}
for (const book of BIBLE_BOOKS) {
  for (const alias of book.aliases) {
    ALIAS_MAP[alias.toLowerCase()] = book.name
  }
}

// Fuse.js for fuzzy matching of book aliases
const fuseItems = Object.entries(ALIAS_MAP).map(([alias, name]) => ({ alias, name }))
const fuse = new Fuse(fuseItems, { keys: ['alias'], threshold: 0.35, includeScore: true })

/**
 * Detect the Bible book from normalized text.
 * Returns { bookName, rest, confidence }
 */
export function detectBibleBook(text: string): { bookName: string | null; rest: string; confidence: number } {
  // Try numbered books first: "1 corinthians", "2 timothy"
  const numberedMatch = text.match(/^(1|2|3)\s+([a-z]+(?:\s+[a-z]+)?)/)
  if (numberedMatch) {
    const candidate = `${numberedMatch[1]} ${numberedMatch[2]}`
    const canonical = ALIAS_MAP[candidate]
    if (canonical) {
      const rest = text.slice(numberedMatch[0].length).trim()
      return { bookName: canonical, rest, confidence: 1.0 }
    }
  }

  // Try exact match by progressively checking multi-word book names (longest first)
  const words = text.split(' ')
  for (let len = 4; len >= 1; len--) {
    const candidate = words.slice(0, len).join(' ')
    if (ALIAS_MAP[candidate]) {
      const rest = words.slice(len).join(' ').trim()
      return { bookName: ALIAS_MAP[candidate], rest, confidence: 1.0 }
    }
  }

  // Fuzzy match
  const results = fuse.search(words.slice(0, 3).join(' '))
  if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.4) {
    const match = results[0].item
    const aliasWords = match.alias.split(' ').length
    const rest = words.slice(aliasWords).join(' ').trim()
    return { bookName: match.name, rest, confidence: 1 - (results[0].score ?? 0.3) }
  }

  return { bookName: null, rest: text, confidence: 0 }
}

// ─── Version Detection ──────────────────────────────────────────────────────

export function detectBibleVersion(text: string): BibleVersion | null {
  const lower = text.toLowerCase()

  // Longest match first
  const sortedAliases = Object.keys(VERSION_ALIASES).sort((a, b) => b.length - a.length)
  for (const alias of sortedAliases) {
    if (lower.includes(alias)) {
      return VERSION_ALIASES[alias] as BibleVersion
    }
  }
  return null
}

// ─── Language Detection ─────────────────────────────────────────────────────

export function detectLanguageCommand(text: string): string | null {
  const patterns = [
    { regex: /\bin (french|español|spanish|portuguese|yoruba|igbo|hausa|swahili)\b/i, extract: 1 },
    { regex: /\bswitch to (french|spanish|portuguese|yoruba|igbo|hausa|swahili)\b/i, extract: 1 },
  ]
  for (const p of patterns) {
    const m = text.match(p.regex)
    if (m) {
      const lang = m[p.extract].toLowerCase()
      const langMap: Record<string, string> = {
        french: 'French', spanish: 'Spanish', español: 'Spanish',
        portuguese: 'Portuguese', yoruba: 'Yoruba', igbo: 'Igbo',
        hausa: 'Hausa', swahili: 'Swahili',
      }
      return langMap[lang] ?? null
    }
  }
  return null
}

// ─── Chapter + Verse Extraction ─────────────────────────────────────────────

/**
 * Extract chapter and verse numbers from the "rest" string after book detection.
 * Handles: "3:16", "3 16", "chapter 3 verse 16", "3", "twenty three"
 */
function extractChapterVerse(rest: string): { chapter: number | null; verseStart: number | null; verseEnd: number | null } {
  // Strip version references from rest
  rest = rest.replace(/\b(in\s+)?(kjv|nkjv|niv|esv|nlt|amp|web|king james.*?version?|new king james.*?version?|new international version|english standard version|new living translation|amplified bible?)\b/gi, '').trim()

  // Format: "3:16" or "3:16-18"
  const colonMatch = rest.match(/^(\d+):(\d+)(?:-(\d+))?/)
  if (colonMatch) {
    return {
      chapter: parseInt(colonMatch[1]),
      verseStart: parseInt(colonMatch[2]),
      verseEnd: colonMatch[3] ? parseInt(colonMatch[3]) : null,
    }
  }

  // Format: "chapter 3 verse 16"
  const chapterVerseMatch = rest.match(/chapter\s+(\d+)\s+verse\s+(\d+)(?:-(\d+))?/)
  if (chapterVerseMatch) {
    return {
      chapter: parseInt(chapterVerseMatch[1]),
      verseStart: parseInt(chapterVerseMatch[2]),
      verseEnd: chapterVerseMatch[3] ? parseInt(chapterVerseMatch[3]) : null,
    }
  }

  // Format: "chapter 3" only
  const chapterOnlyMatch = rest.match(/chapter\s+(\d+)/)
  if (chapterOnlyMatch) {
    return { chapter: parseInt(chapterOnlyMatch[1]), verseStart: null, verseEnd: null }
  }

  // Format: "verse 16" only (assume chapter already determined or default 1)
  const verseOnlyMatch = rest.match(/verse\s+(\d+)/)
  if (verseOnlyMatch) {
    return { chapter: null, verseStart: parseInt(verseOnlyMatch[1]), verseEnd: null }
  }

  // Format: two bare numbers "3 16"
  const twoNumbers = rest.match(/^(\d+)\s+(\d+)$/)
  if (twoNumbers) {
    return {
      chapter: parseInt(twoNumbers[1]),
      verseStart: parseInt(twoNumbers[2]),
      verseEnd: null,
    }
  }

  // Format: single bare number "23"
  const oneNumber = rest.match(/^(\d+)$/)
  if (oneNumber) {
    return { chapter: parseInt(oneNumber[1]), verseStart: null, verseEnd: null }
  }

  // Mixed: "3 verse 16"
  const mixedMatch = rest.match(/^(\d+)\s+verse\s+(\d+)/)
  if (mixedMatch) {
    return {
      chapter: parseInt(mixedMatch[1]),
      verseStart: parseInt(mixedMatch[2]),
      verseEnd: null,
    }
  }

  return { chapter: null, verseStart: null, verseEnd: null }
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateBibleReference(book: string, chapter: number | null, verse: number | null): boolean {
  const bookInfo = BIBLE_BOOKS.find(b => b.name === book)
  if (!bookInfo) return false
  if (chapter === null) return false
  if (chapter < 1 || chapter > bookInfo.chapters) return false
  if (verse !== null) {
    const maxVerse = bookInfo.versesPerChapter[chapter - 1]
    if (!maxVerse) return false
    if (verse < 1 || verse > maxVerse) return false
  }
  return true
}

// ─── Main Parser ─────────────────────────────────────────────────────────────

export function parseBibleReference(input: string): ParseResult {
  const rawTranscript = input

  // 1. Detect version before normalization
  const detectedVersion = detectBibleVersion(input) as BibleVersion | null

  // 2. Detect language
  const detectedLanguage = detectLanguageCommand(input)

  // 3. Normalize
  const normalized = normalizeSpeechText(input)

  // 4. Detect book
  const { bookName, rest, confidence: bookConfidence } = detectBibleBook(normalized)

  if (!bookName) {
    return {
      book: null,
      chapter: null,
      verseStart: null,
      verseEnd: null,
      version: detectedVersion,
      language: detectedLanguage,
      confidence: 0,
      rawTranscript,
    }
  }

  // 5. Extract chapter + verse
  const { chapter, verseStart, verseEnd } = extractChapterVerse(rest)

  // 6. Calculate confidence
  let confidence = bookConfidence
  if (chapter !== null) confidence = Math.min(confidence + 0.2, 1.0)
  if (verseStart !== null) confidence = Math.min(confidence + 0.1, 1.0)

  // Validate
  const isValid = validateBibleReference(bookName, chapter, verseStart)
  if (!isValid && chapter !== null) {
    confidence = Math.max(confidence - 0.3, 0.1)
  }

  return {
    book: bookName,
    chapter,
    verseStart,
    verseEnd,
    version: detectedVersion,
    language: detectedLanguage,
    confidence: Math.round(confidence * 100) / 100,
    rawTranscript,
  }
}

/**
 * Format a parsed reference into readable string like "John 3:16"
 */
export function formatReference(result: ParseResult): string {
  if (!result.book || !result.chapter) return ''
  let ref = `${result.book} ${result.chapter}`
  if (result.verseStart) {
    ref += `:${result.verseStart}`
    if (result.verseEnd) ref += `-${result.verseEnd}`
  }
  return ref
}
