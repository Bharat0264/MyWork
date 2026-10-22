# Garuda · Web Design & Development Studio

Production URL: [https://my-work-umber.vercel.app](https://my-work-umber.vercel.app)

A high-performance portfolio and studio website for Garuda Web Design & Development Studio. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. Designed with a custom frosted glass Navy Mirage aesthetic.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Site Generation & Dynamic API Routes)
- **UI Library**: React 19 with bespoke frosted glass Navy Mirage components
- **Styling**: Tailwind CSS v4, custom CSS variables, zero runtime CSS-in-JS overhead
- **Icons**: Lucide React
- **Typography**: Next.js self-hosted Google Fonts (`Inter` & `Poppins`) with zero render-blocking requests
- **Animations**: Framer Motion (GPU transform & opacity only, auto-paused when out of view)
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js `>=22.13.0`
- npm `>=10.0.0`

### Installation

```bash
git clone https://github.com/Bharat0264/MyWork.git
cd MyWork
npm install
```

### Development Server

```bash
npm run dev
```

Runs the local development server at `http://localhost:3000` (or `http://localhost:5173` if running vinext).

---

## Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `next dev` | Start the local Next.js development server with HMR |
| `npm run build` | `next build --webpack` | Compile production build and statically render all routes |
| `npm run start` | `next start` | Run the built production application locally |
| `npm run lint` | `eslint . --ignore-pattern dist --ignore-pattern .next` | Lint codebase for style, unused variables, and React rules |
| `npm run typecheck` | `tsc --noEmit` | Validate TypeScript types in strict mode |
| `npm run screenshots` | `node scripts/capture-screenshots.mjs` | Capture and compress mockups for showcase projects |

---

## Environment Variables

Copy `.env.example` to `.env.local` to configure local variables:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Optional | Resend API key for contact enquiry email delivery |
| `WEB3FORMS_ACCESS_KEY` | Optional | Fallback email provider access key |
| `CONTACT_FROM_EMAIL` | Optional | Sender email address for contact notifications |
| `OPENAI_API_KEY` | Optional | API key for the contact form's "Improve my message" AI assistant |
| `GROQ_API_KEY` | Optional | Alternative Fast AI provider key |
| `GEMINI_API_KEY` | Optional | Alternative Google Gemini AI key |
| `AI_MODEL` | Optional | Model identifier (defaults to `gpt-4o-mini`) |
| `AI_BASE_URL` | Optional | Custom base endpoint URL for OpenAI-compatible proxies |

*Note: If AI keys are not configured, the contact form hides the "Improve my message" button and functions as a standard enquiry form.*

---

## How to Add or Edit Content

### 1. Projects Portfolio

Projects are stored in a single source of truth at `data/projects.ts`. Each project object supports:

- `slug`: URL slug (e.g. `/work/rainbow-digi-school`)
- `title`, `titlePrefix`, `titleSuffix`: Name and showcase branding
- `client`, `category`, `categories`: Filtering and taxonomies
- `year`: Project creation year (all projects currently set to `"2026"`)
- `shortDescription`, `fullDescription`: Overview copy
- `services`, `technologies`: Chips and deliverables
- `liveUrl`: Live deployment URL
- `displayDomain`: Domain shown in device mockup address pill (e.g. `printbee.co.in`)
- `previewImage`: Screenshot path in `/public/projects/`

### 2. Services

Services are configured in `data/services.ts`. The Services Showcase (`components/services-glass-showcase.tsx`) automatically indexes and maps services by number:

- `01 Website Design`
- `02 Website Redesign`
- `03 Full-Stack Development`
- `04 E-commerce`
- `05 SEO & Performance`
- `06 Digital Marketing`
- `07 AI Integration`
- `08 Social Media Management` (links to `/services/social-media`)

### 3. Social Media Packages

Packages, custom builder rates, FAQs, and comparison table items are managed in `data/social-packages.ts`:

- Plans: `Starter`, `Growth` (Most popular), and `Pro`
- Deliverable auto-multipliers (weekly × 4 weeks)
- Pricing configuration (defaulting to `"Custom quote"` if price is null)

---

## Multi-Agent Collaboration Protocol

See [`AGENTS.md`](./AGENTS.md) for collaboration rules between Codex and Antigravity:

- Always run `git pull --rebase origin main` before starting work.
- Commit and push incrementally with conventional commit messages tagged by agent.
- Never force push or rewrite history.
- The live production site is the source of truth specification.
