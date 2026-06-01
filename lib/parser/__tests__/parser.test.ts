/**
 * VerseFlash — Bible Reference Parser Tests
 *
 * Run with: npx ts-node --project tsconfig.json lib/parser/__tests__/parser.test.ts
 * Or integrate with Jest: npx jest lib/parser/__tests__
 */

import { parseBibleReference } from "../index";

interface TestCase {
  input: string;
  expected: {
    book?: string;
    chapter?: number;
    verseStart?: number;
    version?: string;
    valid: boolean;
  };
}

const testCases: TestCase[] = [
  // --- Spoken chapter/verse formats ---
  {
    input: "john chapter three verse sixteen",
    expected: { book: "John", chapter: 3, verseStart: 16, valid: true },
  },
  {
    input: "John 3:16",
    expected: { book: "John", chapter: 3, verseStart: 16, valid: true },
  },
  {
    input: "john three sixteen",
    expected: { book: "John", chapter: 3, verseStart: 16, valid: true },
  },
  {
    input: "romans eight twenty eight",
    expected: { book: "Romans", chapter: 8, verseStart: 28, valid: true },
  },
  {
    input: "romans chapter eight verse twenty eight",
    expected: { book: "Romans", chapter: 8, verseStart: 28, valid: true },
  },
  // --- Psalm (chapter only) ---
  {
    input: "psalm twenty three",
    expected: { book: "Psalms", chapter: 23, verseStart: undefined, valid: true },
  },
  {
    input: "psalm chapter twenty three",
    expected: { book: "Psalms", chapter: 23, verseStart: undefined, valid: true },
  },
  // --- Numbered books ---
  {
    input: "first corinthians thirteen four",
    expected: { book: "1 Corinthians", chapter: 13, verseStart: 4, valid: true },
  },
  {
    input: "first corinthians chapter thirteen verse four",
    expected: { book: "1 Corinthians", chapter: 13, verseStart: 4, valid: true },
  },
  {
    input: "second timothy one seven",
    expected: { book: "2 Timothy", chapter: 1, verseStart: 7, valid: true },
  },
  {
    input: "second timothy chapter one verse seven",
    expected: { book: "2 Timothy", chapter: 1, verseStart: 7, valid: true },
  },
  // --- Genesis ---
  {
    input: "genesis one one",
    expected: { book: "Genesis", chapter: 1, verseStart: 1, valid: true },
  },
  // --- Revelation ---
  {
    input: "revelation twenty one verse four",
    expected: { book: "Revelation", chapter: 21, verseStart: 4, valid: true },
  },
  // --- Various books ---
  {
    input: "matthew five nine",
    expected: { book: "Matthew", chapter: 5, verseStart: 9, valid: true },
  },
  {
    input: "isaiah forty one ten",
    expected: { book: "Isaiah", chapter: 41, verseStart: 10, valid: true },
  },
  {
    input: "philippians four thirteen",
    expected: { book: "Philippians", chapter: 4, verseStart: 13, valid: true },
  },
  {
    input: "proverbs three five",
    expected: { book: "Proverbs", chapter: 3, verseStart: 5, valid: true },
  },
  {
    input: "first john one nine",
    expected: { book: "1 John", chapter: 1, verseStart: 9, valid: true },
  },
  {
    input: "third john one two",
    expected: { book: "3 John", chapter: 1, verseStart: 2, valid: true },
  },
  {
    input: "second corinthians five seventeen",
    expected: { book: "2 Corinthians", chapter: 5, verseStart: 17, valid: true },
  },
  // --- Version detection ---
  {
    input: "john 3:16 in kjv",
    expected: { book: "John", chapter: 3, verseStart: 16, version: "KJV", valid: true },
  },
  {
    input: "romans 8:28 nkjv",
    expected: { book: "Romans", chapter: 8, verseStart: 28, version: "NKJV", valid: true },
  },
  {
    input: "psalm 23 in niv",
    expected: { book: "Psalms", chapter: 23, version: "NIV", valid: true },
  },
  {
    input: "use esv",
    expected: { version: "ESV", valid: false }, // no reference, but version detected
  },
  {
    input: "switch to king james version",
    expected: { version: "KJV", valid: false },
  },
  {
    input: "display john 14:6 in new king james version",
    expected: { book: "John", chapter: 14, verseStart: 6, version: "NKJV", valid: true },
  },
  // --- More books ---
  {
    input: "luke 1:37",
    expected: { book: "Luke", chapter: 1, verseStart: 37, valid: true },
  },
  {
    input: "jeremiah 29:11",
    expected: { book: "Jeremiah", chapter: 29, verseStart: 11, valid: true },
  },
  {
    input: "hebrews 11:1",
    expected: { book: "Hebrews", chapter: 11, verseStart: 1, valid: true },
  },
  {
    input: "ephesians 3:20",
    expected: { book: "Ephesians", chapter: 3, verseStart: 20, valid: true },
  },
];

// ─── Simple test runner ─────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

console.log("\n=== VerseFlash Parser Tests ===\n");

testCases.forEach((tc, i) => {
  const result = parseBibleReference(tc.input);
  const num = String(i + 1).padStart(2, "0");

  const checks: boolean[] = [];

  if (tc.expected.book !== undefined) {
    checks.push(result?.book === tc.expected.book);
  }
  if (tc.expected.chapter !== undefined) {
    checks.push(result?.chapter === tc.expected.chapter);
  }
  if (tc.expected.verseStart !== undefined) {
    checks.push(result?.verseStart === tc.expected.verseStart);
  }
  if (tc.expected.version !== undefined) {
    checks.push(result?.version === tc.expected.version);
  }
  // valid = result exists with all required fields
  if (tc.expected.valid) {
    checks.push(
      result !== null &&
        result.book !== undefined &&
        result.chapter !== undefined
    );
  }

  const allPassed = checks.length > 0 && checks.every(Boolean);

  if (allPassed) {
    passed++;
    console.log(`  [PASS] ${num}. "${tc.input}"`);
    if (result) {
      const ref = result.verseStart
        ? `${result.book} ${result.chapter}:${result.verseStart}`
        : `${result.book} ${result.chapter}`;
      const ver = result.version ? ` (${result.version})` : "";
      console.log(`         → ${ref}${ver} | confidence: ${result.confidence.toFixed(2)}`);
    }
  } else {
    failed++;
    console.log(`  [FAIL] ${num}. "${tc.input}"`);
    console.log(`         Expected: ${JSON.stringify(tc.expected)}`);
    console.log(`         Got:      ${JSON.stringify(result)}`);
  }
});

console.log(`\n=== Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests ===\n`);
