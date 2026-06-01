export interface BookInfo {
  name: string
  shortName: string
  aliases: string[]
  chapters: number
  versesPerChapter: number[]
}

// Key: canonical book name
// aliases: spoken/written variations the parser should recognize
export const BIBLE_BOOKS: BookInfo[] = [
  {
    name: 'Genesis', shortName: 'Gen', aliases: ['gen', 'genesis'],
    chapters: 50,
    versesPerChapter: [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
  },
  {
    name: 'Exodus', shortName: 'Exo', aliases: ['exo', 'exod', 'exodus'],
    chapters: 40,
    versesPerChapter: [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
  },
  {
    name: 'Leviticus', shortName: 'Lev', aliases: ['lev', 'leviticus'],
    chapters: 27,
    versesPerChapter: [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,24,16,30,24,16,30,24,16,18],
  },
  {
    name: 'Numbers', shortName: 'Num', aliases: ['num', 'numbers'],
    chapters: 36,
    versesPerChapter: [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
  },
  {
    name: 'Deuteronomy', shortName: 'Deu', aliases: ['deu', 'deut', 'deuteronomy'],
    chapters: 34,
    versesPerChapter: [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
  },
  {
    name: 'Joshua', shortName: 'Jos', aliases: ['jos', 'josh', 'joshua'],
    chapters: 24,
    versesPerChapter: [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  },
  {
    name: 'Judges', shortName: 'Jdg', aliases: ['jdg', 'judg', 'judges'],
    chapters: 21,
    versesPerChapter: [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  },
  {
    name: 'Ruth', shortName: 'Rut', aliases: ['rut', 'ruth'],
    chapters: 4,
    versesPerChapter: [22,23,18,22],
  },
  {
    name: '1 Samuel', shortName: '1Sa', aliases: ['1sa', '1 samuel', '1samuel', 'first samuel', 'one samuel', '1st samuel'],
    chapters: 31,
    versesPerChapter: [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
  },
  {
    name: '2 Samuel', shortName: '2Sa', aliases: ['2sa', '2 samuel', '2samuel', 'second samuel', 'two samuel', '2nd samuel'],
    chapters: 24,
    versesPerChapter: [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
  },
  {
    name: '1 Kings', shortName: '1Ki', aliases: ['1ki', '1 kings', '1kings', 'first kings', 'one kings', '1st kings'],
    chapters: 22,
    versesPerChapter: [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
  },
  {
    name: '2 Kings', shortName: '2Ki', aliases: ['2ki', '2 kings', '2kings', 'second kings', 'two kings', '2nd kings'],
    chapters: 25,
    versesPerChapter: [18,37,29,19,19,57,35,14,46,47,10,23,26,16,33,24,39,13,14,30,19,37,23,19,10],
  },
  {
    name: '1 Chronicles', shortName: '1Ch', aliases: ['1ch', '1 chronicles', '1chronicles', 'first chronicles', 'one chronicles', '1st chronicles'],
    chapters: 29,
    versesPerChapter: [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
  },
  {
    name: '2 Chronicles', shortName: '2Ch', aliases: ['2ch', '2 chronicles', '2chronicles', 'second chronicles', 'two chronicles', '2nd chronicles'],
    chapters: 36,
    versesPerChapter: [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
  },
  {
    name: 'Ezra', shortName: 'Ezr', aliases: ['ezr', 'ezra'],
    chapters: 10,
    versesPerChapter: [11,70,13,24,17,22,28,36,15,44],
  },
  {
    name: 'Nehemiah', shortName: 'Neh', aliases: ['neh', 'nehemiah'],
    chapters: 13,
    versesPerChapter: [11,20,32,23,19,19,73,18,38,39,36,47,31],
  },
  {
    name: 'Esther', shortName: 'Est', aliases: ['est', 'esther'],
    chapters: 10,
    versesPerChapter: [22,23,15,17,14,14,10,17,32,3],
  },
  {
    name: 'Job', shortName: 'Job', aliases: ['job'],
    chapters: 42,
    versesPerChapter: [22,17,16,21,26,14,17,34,19,20,38,24,22,19,25,11,22,32,18,16,22,13,30,5,28,7,47,39,46,64,34,9,48,31,52,21,26,33,22,15,3,22],
  },
  {
    name: 'Psalm', shortName: 'Psa', aliases: ['psa', 'psalm', 'psalms', 'ps'],
    chapters: 150,
    versesPerChapter: [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,20,28,14,9,35,9,13,21,12,19,9,21,22,34,20,15,4,57,25,19,20,6,11,7,25,8,9,6,9,15,21,25,26,7,20,14,23,20,22,21,22,11,14,17,8,9,42,5,6,11,15,14,21,19,20,5,14,12,12,8,36,11,9,11,13,17,20,4,23,11,21,21,36,8,20,21,14,15,9,14,18,21,14,9,30],
  },
  {
    name: 'Proverbs', shortName: 'Pro', aliases: ['pro', 'prov', 'proverbs'],
    chapters: 31,
    versesPerChapter: [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,62,44,33],
  },
  {
    name: 'Ecclesiastes', shortName: 'Ecc', aliases: ['ecc', 'eccl', 'ecclesiastes', 'eccles'],
    chapters: 12,
    versesPerChapter: [18,26,22,16,20,12,29,17,18,20,10,14],
  },
  {
    name: 'Song of Solomon', shortName: 'Sng', aliases: ['sng', 'song', 'song of solomon', 'song of songs', 'songs', 'sos'],
    chapters: 8,
    versesPerChapter: [17,17,11,16,16,13,13,14],
  },
  {
    name: 'Isaiah', shortName: 'Isa', aliases: ['isa', 'isaiah'],
    chapters: 66,
    versesPerChapter: [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
  },
  {
    name: 'Jeremiah', shortName: 'Jer', aliases: ['jer', 'jeremiah'],
    chapters: 52,
    versesPerChapter: [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
  },
  {
    name: 'Lamentations', shortName: 'Lam', aliases: ['lam', 'lamentations'],
    chapters: 5,
    versesPerChapter: [22,22,66,22,22],
  },
  {
    name: 'Ezekiel', shortName: 'Eze', aliases: ['eze', 'ezek', 'ezekiel'],
    chapters: 48,
    versesPerChapter: [28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
  },
  {
    name: 'Daniel', shortName: 'Dan', aliases: ['dan', 'daniel'],
    chapters: 12,
    versesPerChapter: [21,49,30,37,31,28,28,27,27,21,45,13],
  },
  {
    name: 'Hosea', shortName: 'Hos', aliases: ['hos', 'hosea'],
    chapters: 14,
    versesPerChapter: [11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  },
  {
    name: 'Joel', shortName: 'Joe', aliases: ['joe', 'joel'],
    chapters: 3,
    versesPerChapter: [20,32,21],
  },
  {
    name: 'Amos', shortName: 'Amo', aliases: ['amo', 'amos'],
    chapters: 9,
    versesPerChapter: [15,16,15,13,27,14,17,14,15],
  },
  {
    name: 'Obadiah', shortName: 'Oba', aliases: ['oba', 'obadiah'],
    chapters: 1,
    versesPerChapter: [21],
  },
  {
    name: 'Jonah', shortName: 'Jon', aliases: ['jon', 'jonah'],
    chapters: 4,
    versesPerChapter: [17,10,10,11],
  },
  {
    name: 'Micah', shortName: 'Mic', aliases: ['mic', 'micah'],
    chapters: 7,
    versesPerChapter: [16,13,12,13,15,16,20],
  },
  {
    name: 'Nahum', shortName: 'Nah', aliases: ['nah', 'nahum'],
    chapters: 3,
    versesPerChapter: [15,13,19],
  },
  {
    name: 'Habakkuk', shortName: 'Hab', aliases: ['hab', 'habakkuk', 'habakuk'],
    chapters: 3,
    versesPerChapter: [17,20,19],
  },
  {
    name: 'Zephaniah', shortName: 'Zep', aliases: ['zep', 'zeph', 'zephaniah'],
    chapters: 3,
    versesPerChapter: [18,15,20],
  },
  {
    name: 'Haggai', shortName: 'Hag', aliases: ['hag', 'haggai'],
    chapters: 2,
    versesPerChapter: [15,23],
  },
  {
    name: 'Zechariah', shortName: 'Zec', aliases: ['zec', 'zech', 'zechariah'],
    chapters: 14,
    versesPerChapter: [21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  },
  {
    name: 'Malachi', shortName: 'Mal', aliases: ['mal', 'malachi'],
    chapters: 4,
    versesPerChapter: [14,17,18,6],
  },
  // New Testament
  {
    name: 'Matthew', shortName: 'Mat', aliases: ['mat', 'matt', 'matthew'],
    chapters: 28,
    versesPerChapter: [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
  },
  {
    name: 'Mark', shortName: 'Mar', aliases: ['mar', 'mark', 'mrk'],
    chapters: 16,
    versesPerChapter: [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
  },
  {
    name: 'Luke', shortName: 'Luk', aliases: ['luk', 'luke'],
    chapters: 24,
    versesPerChapter: [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
  },
  {
    name: 'John', shortName: 'Jhn', aliases: ['jhn', 'john', 'jn'],
    chapters: 21,
    versesPerChapter: [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
  },
  {
    name: 'Acts', shortName: 'Act', aliases: ['act', 'acts'],
    chapters: 28,
    versesPerChapter: [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
  },
  {
    name: 'Romans', shortName: 'Rom', aliases: ['rom', 'romans'],
    chapters: 16,
    versesPerChapter: [32,29,31,25,21,23,25,39,33,21,36,21,14,26,33,24],
  },
  {
    name: '1 Corinthians', shortName: '1Co', aliases: ['1co', '1 corinthians', '1corinthians', 'first corinthians', 'one corinthians', '1st corinthians'],
    chapters: 16,
    versesPerChapter: [31,16,23,21,13,20,40,34,28,38,40,29,42,50,26,16],
  },
  {
    name: '2 Corinthians', shortName: '2Co', aliases: ['2co', '2 corinthians', '2corinthians', 'second corinthians', 'two corinthians', '2nd corinthians'],
    chapters: 13,
    versesPerChapter: [24,17,18,18,21,18,16,24,15,18,33,21,14],
  },
  {
    name: 'Galatians', shortName: 'Gal', aliases: ['gal', 'galatians'],
    chapters: 6,
    versesPerChapter: [24,21,29,31,26,18],
  },
  {
    name: 'Ephesians', shortName: 'Eph', aliases: ['eph', 'ephesians', 'ephe'],
    chapters: 6,
    versesPerChapter: [23,21,25,21,32,27],
  },
  {
    name: 'Philippians', shortName: 'Php', aliases: ['php', 'philippians', 'philipians', 'phillipians', 'phil'],
    chapters: 4,
    versesPerChapter: [30,30,21,23],
  },
  {
    name: 'Colossians', shortName: 'Col', aliases: ['col', 'colossians'],
    chapters: 4,
    versesPerChapter: [29,23,25,6],
  },
  {
    name: '1 Thessalonians', shortName: '1Th', aliases: ['1th', '1 thessalonians', '1thessalonians', 'first thessalonians', 'one thessalonians', '1st thessalonians', 'thessalonians'],
    chapters: 5,
    versesPerChapter: [10,20,13,18,28],
  },
  {
    name: '2 Thessalonians', shortName: '2Th', aliases: ['2th', '2 thessalonians', '2thessalonians', 'second thessalonians', 'two thessalonians', '2nd thessalonians'],
    chapters: 3,
    versesPerChapter: [12,17,18],
  },
  {
    name: '1 Timothy', shortName: '1Ti', aliases: ['1ti', '1 timothy', '1timothy', 'first timothy', 'one timothy', '1st timothy'],
    chapters: 6,
    versesPerChapter: [20,15,16,16,25,21],
  },
  {
    name: '2 Timothy', shortName: '2Ti', aliases: ['2ti', '2 timothy', '2timothy', 'second timothy', 'two timothy', '2nd timothy'],
    chapters: 4,
    versesPerChapter: [18,26,17,22],
  },
  {
    name: 'Titus', shortName: 'Tit', aliases: ['tit', 'titus'],
    chapters: 3,
    versesPerChapter: [16,15,15],
  },
  {
    name: 'Philemon', shortName: 'Phm', aliases: ['phm', 'philemon'],
    chapters: 1,
    versesPerChapter: [25],
  },
  {
    name: 'Hebrews', shortName: 'Heb', aliases: ['heb', 'hebrews'],
    chapters: 13,
    versesPerChapter: [14,18,19,16,14,20,28,13,28,39,40,29,25],
  },
  {
    name: 'James', shortName: 'Jas', aliases: ['jas', 'james'],
    chapters: 5,
    versesPerChapter: [27,26,18,17,20],
  },
  {
    name: '1 Peter', shortName: '1Pe', aliases: ['1pe', '1 peter', '1peter', 'first peter', 'one peter', '1st peter'],
    chapters: 5,
    versesPerChapter: [25,25,22,19,14],
  },
  {
    name: '2 Peter', shortName: '2Pe', aliases: ['2pe', '2 peter', '2peter', 'second peter', 'two peter', '2nd peter'],
    chapters: 3,
    versesPerChapter: [21,22,18],
  },
  {
    name: '1 John', shortName: '1Jn', aliases: ['1jn', '1 john', '1john', 'first john', 'one john', '1st john'],
    chapters: 5,
    versesPerChapter: [10,29,24,21,21],
  },
  {
    name: '2 John', shortName: '2Jn', aliases: ['2jn', '2 john', '2john', 'second john', 'two john', '2nd john'],
    chapters: 1,
    versesPerChapter: [13],
  },
  {
    name: '3 John', shortName: '3Jn', aliases: ['3jn', '3 john', '3john', 'third john', 'three john', '3rd john'],
    chapters: 1,
    versesPerChapter: [14],
  },
  {
    name: 'Jude', shortName: 'Jud', aliases: ['jud', 'jude'],
    chapters: 1,
    versesPerChapter: [25],
  },
  {
    name: 'Revelation', shortName: 'Rev', aliases: ['rev', 'revelation', 'revelations', 'revilation'],
    chapters: 22,
    versesPerChapter: [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21],
  },
]

// Spoken ordinals to number prefix
export const SPOKEN_NUMBER_PREFIXES: Record<string, string> = {
  'first': '1',
  'one': '1',
  '1st': '1',
  'second': '2',
  'two': '2',
  '2nd': '2',
  'third': '3',
  'three': '3',
  '3rd': '3',
}

export const VERSION_ALIASES: Record<string, string> = {
  'king james version': 'KJV',
  'king james': 'KJV',
  'new king james version': 'NKJV',
  'new king james': 'NKJV',
  'new international version': 'NIV',
  'english standard version': 'ESV',
  'new living translation': 'NLT',
  'amplified bible': 'AMP',
  'amplified': 'AMP',
  'world english bible': 'WEB',
  'kjv': 'KJV',
  'nkjv': 'NKJV',
  'niv': 'NIV',
  'esv': 'ESV',
  'nlt': 'NLT',
  'amp': 'AMP',
  'web': 'WEB',
}

export const SUPPORTED_VERSIONS = ['NKJV', 'KJV', 'NIV', 'ESV', 'NLT', 'AMP', 'WEB'] as const

export const SUPPORTED_LANGUAGES = [
  'English', 'French', 'Spanish', 'Portuguese',
  'Yoruba', 'Igbo', 'Hausa', 'Swahili',
] as const

export const DEFAULT_VERSION = 'NKJV'
export const DEFAULT_LANGUAGE = 'English'

// API-available versions for development (public domain)
export const API_AVAILABLE_VERSIONS = ['KJV', 'WEB'] as const
