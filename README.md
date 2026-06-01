# VerseFlash

**Voice-powered Bible reference detection for churches, livestream teams, and personal Bible study.**

VerseFlash listens to your voice, detects when you mention a Bible reference (e.g. "John 3:16"), and instantly displays the verse text. Built for church production teams, livestream ministries, Bible teachers, and personal devotion.

---

## Features

- Voice-activated Bible reference detection
- Supports all 66 Bible books and common spoken variations
- Church Display Mode — full-screen projection view
- Manual reference search
- Save verses with personal notes
- Recent detection history
- Bible version switching (KJV, WEB, NKJV, NIV, ESV, NLT, AMP)
- Language preference support
- Supabase Auth + Row Level Security
- Mobile-first, fully responsive

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Poppins font |
| Auth + DB | Supabase |
| Voice Input | Browser SpeechRecognition API |
| Bible API | api.scripture.api.bible (primary), labs.bible.org (fallback) |
| State | Zustand |
| Icons | Lucide React |
| Fuzzy Match | Fuse.js |

---

## Project Structure

```
/app
  /(auth)/login          Login page
  /(auth)/signup         Signup page
  /(auth)/forgot-password  Password reset
  /dashboard             Main dashboard
  /live                  Live voice detection screen
  /display               Church Display Mode (full-screen)
  /saved                 Saved verses
  /recent                Detection history
  /profile               User profile & settings
/components
  /ui                    Button, Card, Input, Badge, ConfidenceBar, VersionSelector
  /layout                Navbar
  /voice                 MicButton
  /verse                 VerseDisplay, ManualSearch, RecentDetections
/lib
  /supabase              Browser + server Supabase clients
  /bible                 Bible API abstraction layer
  /parser                Reference parser + spoken number converter
  /utils                 Shared utility functions
/hooks
  useVoiceDetection      SpeechRecognition hook
  useAppStore            Zustand global store
/types                   Shared TypeScript types
/constants               Bible book data, version aliases
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BIBLE_API_KEY=your_api_bible_key
NEXT_PUBLIC_BIBLE_API_KJV_ID=de4e12af7f28f599-01
NEXT_PUBLIC_BIBLE_API_WEB_ID=9879dbb7cfe39e4d-04
```

### Getting Your Keys

#### Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to **Settings → API**
3. Copy the **Project URL** and **anon public** key

#### API.Bible
1. Go to [scripture.api.bible](https://scripture.api.bible) and create a free account
2. Create an application to get your API key
3. The KJV Bible ID is `de4e12af7f28f599-01` and the WEB ID is `9879dbb7cfe39e4d-04`
4. Browse available Bible IDs at: `https://api.scripture.api.bible/v1/bibles`

> **Note:** The free fallback API (labs.bible.org) works without a key and serves KJV text. The app will use it automatically if the primary Bible API is unavailable.

---

## Database Setup

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Paste the contents of `supabase-schema.sql` and run it

This creates:
- `profiles` table (auto-created on signup via trigger)
- `verse_detections` table
- `saved_verses` table
- Row Level Security policies for all tables

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourname/verseflash.git
cd verseflash

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Bible API keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Bible Version Licensing

> **Important:** This app does not bundle copyrighted Bible text.

| Version | Status | Notes |
|---|---|---|
| KJV | Free / Public Domain | Available via labs.bible.org and API.Bible |
| WEB | Free / Public Domain | World English Bible, no restrictions |
| NKJV | Licensed | Requires a license from Thomas Nelson / HarperCollins |
| NIV | Licensed | Requires a license from Biblica |
| ESV | Licensed | Available via ESV API with attribution |
| NLT | Licensed | Requires a license from Tyndale |
| AMP | Licensed | Requires a license from The Lockman Foundation |

**For production use with licensed versions**, connect the appropriate licensed Bible API and ensure your usage complies with the provider's terms. Common options:

- [API.Bible](https://scripture.api.bible) — hosts many versions including some licensed ones
- [ESV API](https://api.esv.org) — free for apps with attribution
- [YouVersion API](https://developer.youversion.com) — requires partnership application

The Bible API service layer in `/lib/bible/api.ts` is designed so that any Bible provider can be swapped in by implementing the `fetchVerse` interface.

---

## Parser Tests

Run the built-in parser test suite:

```bash
npx ts-node --project tsconfig.json lib/parser/__tests__/parser.test.ts
```

Tests cover 30 spoken and typed reference formats including:
- All spoken number variants (first/second/third, twenty-eight, etc.)
- Chapter-only references (Psalm 23)
- Numbered books (1 Corinthians, 2 Timothy, 3 John)
- Version detection from speech (KJV, NKJV, King James Version, etc.)
- Colon-format references (John 3:16)
- Bare number references (Romans 8 28)

---

## Voice Detection

Voice detection uses the **Browser SpeechRecognition API** (Chrome, Edge, Safari). If a user's browser does not support it, the app shows a clear message and falls back to manual search.

### Future Speech Provider Support

The `useVoiceDetection` hook is architected to support pluggable speech-to-text providers. To add a new provider (e.g. Deepgram, Whisper):
1. Create a new service file in `/services/speech/`
2. Implement the same interface (`onTranscript`, `start`, `stop`, `isListening`)
3. Swap the provider in `useVoiceDetection`

---

## Church Display Mode

Navigate to `/display` for a full-screen projection-ready view.

- Shows only the Bible reference, verse text, and version badge
- Large Poppins bold typography suitable for projectors and livestreams
- Animated verse transitions
- Keyboard shortcuts:
  - `M` — toggle microphone
  - `Esc` — show/hide controls
- Fullscreen API support (click fullscreen button)

---

## Roadmap (Post-MVP)

- [ ] Unlimited detection history
- [ ] More licensed Bible versions
- [ ] Church / team accounts
- [ ] Livestream lower-third overlay
- [ ] Verse history export (PDF, CSV)
- [ ] Sermon mode (batch reference tracking)
- [ ] Custom church branding
- [ ] Multi-screen display support
- [ ] Deepgram / Whisper integration for improved accuracy
- [ ] Stripe billing for premium plans

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## License

MIT — see `LICENSE` file.

---

Built with care for churches, ministers, and Bible students everywhere.
