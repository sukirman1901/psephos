# AGENT.md — Psephos Project Context for Coding Agents

## Project Identity

**Psephos** — SaaS platform riset politik bertenaga AI. Prediksi elektoral, analisis sentimen, intelijen kampanye. Fokus awal: Indonesia (514 dapil).

## Tech Stack

| Layer | Tech | Notes |
|---|---|---|
| Framework | TanStack Start (React SSR) | File-based routes in `src/routes/` |
| Router | TanStack Router | Route tree auto-generated: `src/routeTree.gen.ts` |
| Data | TanStack Query | Server-side data fetching |
| UI | shadcn/ui + Radix UI | 45+ components in `src/components/ui/` |
| Styling | Tailwind CSS v4 | `src/styles.css` |
| Forms | React Hook Form + Zod | Validation schemas |
| Charts | Recharts | Dashboard visualizations |
| Icons | Lucide React | `lucide-react` |
| Server | Nitro (beta) | `src/server.ts` |
| Runtime | Bun | `bunfig.toml` for config |
| Language | TypeScript 5.8 | Strict mode on |
| Linting | ESLint + Prettier | `eslint.config.js`, `.prettierrc` |

## Project Structure

```
src/
├── components/ui/     # shadcn/ui components (accordion, button, dialog, etc.)
├── hooks/             # Custom hooks (use-mobile.tsx)
├── routes/            # TanStack Router file-based routes
│   ├── __root.tsx     # Root layout
│   └── index.tsx      # Home page
├── routeTree.gen.ts   # Auto-generated — do not edit manually
├── router.tsx          # Router config
├── server.ts           # Nitro server entry
├── start.ts            # App bootstrap
└── styles.css          # Tailwind imports + globals
docs/                   # PRD, FRD, BRD, TDD
```

## Path Aliases

- `@/*` → `./src/*` (configured in `tsconfig.json`)

## Commands

```bash
bun dev           # Dev server (port 3000)
bun run build     # Production build
bun run lint      # ESLint
bun run format    # Prettier
```

## Conventions

- **Bahasa**: Kode & komentar dalam bahasa Inggris. Dokumentasi (PRD/FRD/BRD/TDD/README) dalam bahasa Indonesia.
- **Komponen**: Gunakan shadcn/ui components yang sudah ada di `src/components/ui/`. Jangan buat komponen UI dari scratch.
- **Styling**: Tailwind utility classes. `tw-animate-css` untuk animasi.
- **Forms**: React Hook Form + Zod resolver. Schema validasi Zod didefinisikan terpisah.
- **Data fetching**: TanStack Query. Query keys mengikuti struktur `[domain, action, params]`.
- **Routing**: TanStack Router file-based. Jangan edit `routeTree.gen.ts` — file itu auto-generated.
- **TypeScript**: Strict mode. Hindari `any`. Gunakan `type` over `interface` kecuali perlu declaration merging.
- **No classes**: Functional components hanya. No class components.
- **Git**: Commit messages bahasa Inggris, singkat dan deskriptif.

## MVP Scope (Phase 1 — 8 weeks)

- Forecasting per dapil (514 kab/kota)
- Sentimen harian NLP (ID, Jawa, Sunda)
- Media monitoring (50 outlet)
- AI Co-pilot chat (RAG via OpenRouter)
- Briefing harian email
- Auth RBAC (Admin, Analyst, Viewer)
- Dasbor utama

## Subsystems (from FRD)

1. **Data Ingestion Pipeline** — Scraping, ETL, PostgreSQL
2. **AI/ML Engine** — Bayesian, NLP sentiment, RAG
3. **Backend API** — REST + WebSocket, auth
4. **Frontend SPA** — TanStack Start dashboard

## Out of Scope (MVP)

- Quick count real-time, SSO/SAML, multi-bahasa UI, on-premise, native mobile app, streaming pipeline
