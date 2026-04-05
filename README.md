# re·frame

A CBT coaching MVP web app for reframing unhelpful thoughts through brief, structured conversations.

## Tech Stack

- **Next.js 14** (App Router) — Full-stack framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Gemini 2.0 Flash** — AI-powered CBT coaching via `@google/generative-ai`
- **Resend** — Email delivery for session recaps
- **localStorage** — Client-side session history (stateless by design)

## Architecture

This is a Next.js monorepo that deploys to Vercel:
- Frontend pages → CDN
- API routes (`/api/*`) → Serverless Functions
- No separate backend repo needed for MVP

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/reframe-my-mind.git
cd reframe-my-mind
pnpm install
```

### 2. Set Up Environment Variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Then fill in your keys:

- **GEMINI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/apikey)
- **RESEND_API_KEY**: Get from [Resend](https://resend.com/api-keys)
- **RESEND_SENDER_EMAIL**: Verified sender email in your Resend account

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import it in [Vercel](https://vercel.com/new)
3. Add environment variables in project settings:
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY`
   - `RESEND_SENDER_EMAIL`
4. Deploy

## Features

- **4 CBT Coaches**: Sage (calm), Frank (direct), Nova (warm), Mirror (adaptive)
- **Real-time Chat**: Streaming responses via Gemini 2.0 Flash
- **Structured Sessions**: Welcome → Coach Select → Emotion Check → Chat → Summary
- **Session Recaps**: Email delivery with branded HTML template
- **History**: localStorage-based session history (reverse chronological)
- **Coach Switching**: Mid-session coach switching

## Project Structure

```
app/
├── page.tsx              # Main app orchestration
├── layout.tsx            # Root layout with fonts
├── globals.css           # Design tokens + animations
└── api/
    ├── chat/route.ts     # Streaming chat endpoint
    └── send-recap/route.ts  # Email delivery endpoint

components/
├── screens/              # Full-screen views
│   ├── WelcomeScreen.tsx
│   ├── CoachSelectScreen.tsx
│   ├── EmotionCheckScreen.tsx
│   ├── ChatScreen.tsx
│   ├── SummaryScreen.tsx
│   └── HistoryScreen.tsx
└── ui/                   # Reusable UI components
    ├── CoachCard.tsx
    ├── EmotionButton.tsx
    ├── MessageBubble.tsx
    ├── TypingIndicator.tsx
    └── CoachSwitcherModal.tsx

lib/
├── coaches.ts            # Coach configs + system prompts
├── types.ts              # TypeScript definitions
└── utils.ts              # Helper functions

hooks/
└── useChat.ts            # Chat logic + streaming handler
```

## Design Tokens

See `app/globals.css` for full design system:

- **Dark theme**: `--bg: #0e0f13`
- **Accent**: `--accent: #7c6af7`
- **Fonts**: DM Serif Display (headings/reframes) + DM Sans 300/400/500 (body)
- **Coach colors**: Sage 🌿 #4ecb8d, Frank 🔥 #f97b4a, Nova ☀️ #f97bbc, Mirror 🌊 #7cc8f9

## License

MIT
