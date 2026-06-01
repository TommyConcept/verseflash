import type { FetchVerseParams, FetchVerseResult, BibleVersion } from '@/types'

// ─── API.Bible Bible IDs ────────────────────────────────────────────────────
// Register at https://scripture.api.bible to get your own API key
// These IDs are from the api.bible database for public-domain versions

const BIBLE_IDS: Partial<Record<BibleVersion, string>> = {
  KJV: process.env.NEXT_PUBLIC_BIBLE_ID_KJV ?? 'de4e12af7f28f599-02',
  WEB: process.env.NEXT_PUBLIC_BIBLE_ID_WEB ?? '9879dbb7cfe39e4d-04',
  // NKJV, NIV, ESV, NLT, AMP require licensed API keys — add IDs here when available
}

const API_BASE = process.env.NEXT_PUBLIC_BIBLE_API_BASE_URL ?? 'https://api.scripture.api.bible/v1'
const API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY ?? ''

// ─── Book name → api.bible book ID map ─────────────────────────────────────
// api.bible uses USFM book IDs (e.g. JHN for John)
const BOOK_ID_MAP: Record<string, string> = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
  'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
  'Esther': 'EST', 'Job': 'JOB', 'Psalm': 'PSA', 'Psalms': 'PSA', 'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
  'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
  'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA',
  'Jonah': 'JON', 'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP', 'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
  'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT',
  'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
  'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP',
  'Colossians': 'COL', '1 Thessalonians': '1TH', '2 Thessalonians': '2TH',
  '1 Timothy': '1TI', '2 Timothy': '2TI', 'Titus': 'TIT', 'Philemon': 'PHM',
  'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE', '2 Peter': '2PE',
  '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
  'Revelation': 'REV',
}

// ─── API.Bible fetcher ───────────────────────────────────────────────────────

async function fetchFromApiBible(params: FetchVerseParams): Promise<FetchVerseResult | null> {
  const bibleId = BIBLE_IDS[params.version]
  if (!bibleId || !API_KEY) return null

  const bookId = BOOK_ID_MAP[params.book]
  if (!bookId) return null

  if (!params.verseStart) {
    // Fetch whole chapter
    const url = `${API_BASE}/bibles/${bibleId}/chapters/${bookId}.${params.chapter}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`
    const res = await fetch(url, { headers: { 'api-key': API_KEY } })
    if (!res.ok) return null
    const data = await res.json()
    const text = data.data?.content?.replace(/<[^>]+>/g, '').trim() ?? ''
    return { text, reference: `${params.book} ${params.chapter}`, version: params.version }
  }

  // Fetch specific verse
  const verseId = `${bookId}.${params.chapter}.${params.verseStart}`
  const url = `${API_BASE}/bibles/${bibleId}/verses/${verseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`
  const res = await fetch(url, { headers: { 'api-key': API_KEY } })
  if (!res.ok) return null
  const data = await res.json()
  const text = data.data?.content?.replace(/<[^>]+>/g, '').trim() ?? ''
  const copyright = data.data?.copyright ?? ''
  return {
    text,
    reference: `${params.book} ${params.chapter}:${params.verseStart}`,
    version: params.version,
    copyright,
  }
}

// ─── Fallback: public KJV JSON ───────────────────────────────────────────────
// Uses labs.bible.org free API — no key required, KJV only
async function fetchFromLabsBible(params: FetchVerseParams): Promise<FetchVerseResult | null> {
  if (!params.verseStart) return null
  const bookName = encodeURIComponent(params.book)
  const url = `https://labs.bible.org/api/?passage=${bookName}+${params.chapter}:${params.verseStart}&type=json`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || !data[0]) return null
    const text = data[0].text?.replace(/<[^>]+>/g, '').trim() ?? ''
    return { text, reference: `${params.book} ${params.chapter}:${params.verseStart}`, version: 'KJV' }
  } catch {
    return null
  }
}

// ─── Version availability check ──────────────────────────────────────────────
export function isVersionAvailable(version: BibleVersion): boolean {
  if (!API_KEY) {
    // Fallback mode: KJV always available via labs.bible.org
    return version === 'KJV'
  }
  return !!BIBLE_IDS[version]
}

// ─── Main Fetch Function ─────────────────────────────────────────────────────

export async function fetchVerse(params: FetchVerseParams): Promise<FetchVerseResult> {
  // Try configured API first
  const apiResult = await fetchFromApiBible(params)
  if (apiResult && apiResult.text) return apiResult

  // Fallback to labs.bible.org for KJV
  const fallbackResult = await fetchFromLabsBible(params)
  if (fallbackResult && fallbackResult.text) return fallbackResult

  throw new Error(`Unable to fetch verse. The ${params.version} version may not be available in demo mode. Please connect a licensed Bible API.`)
}

// ─── Version label helpers ──────────────────────────────────────────────────
export function getVersionLabel(version: BibleVersion): string {
  const labels: Record<BibleVersion, string> = {
    NKJV: 'New King James Version',
    KJV: 'King James Version',
    NIV: 'New International Version',
    ESV: 'English Standard Version',
    NLT: 'New Living Translation',
    AMP: 'Amplified Bible',
    WEB: 'World English Bible',
  }
  return labels[version] ?? version
}
