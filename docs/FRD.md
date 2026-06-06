# FRD — Psephos: Functional Requirements Document
**Version:** 1.0  
**Date:** 2026-06-06  
**Status:** Draft  
**Depends on:** PRD v1.0

---

## 1. System Overview

Psephos consists of 4 subsystems:
1. **Data Ingestion Pipeline** — Scraping, ETL, storage
2. **AI/ML Engine** — Bayesian forecasting, NLP sentiment, RAG co-pilot
3. **Backend API** — REST + WebSocket, auth, business logic
4. **Frontend SPA** — TanStack Start dashboard

---

## 2. Detailed Functional Requirements

### 2.1 Data Ingestion Pipeline

#### FR-01: Media Scraping
| Field | Value |
|---|---|
| **Sources** | 50 priority outlets (Kompas, Detik, Tribun, Tempo, etc.) + X (Twitter) API + TikTok (phase 2) |
| **Frequency** | Every 30 minutes (configurable: `SCRAPER_INTERVAL`) |
| **Data points** | Title, URL, publish timestamp, body text, author, outlet |
| **Storage** | PostgreSQL `articles` table + full-text search index |
| **Deduplication** | URL hash + content similarity (MinHash LSH) |

#### FR-02: Social Media Ingestion
| Field | Value |
|---|---|
| **X (Twitter)** | Search API: keyword-based (candidate names, party hashtags). Rate: 10K tweets/day |
| **TikTok** | Phase 2: Puppeteer + rotating proxy |
| **Processing** | Store raw JSON in PostgreSQL JSONB, then normalize |

#### FR-03: Electoral Data Import
| Field | Value |
|---|---|
| **Sources** | KPU, BPS, CSV uploads from users |
| **Granularity** | Province → Regency/City (kabupaten/kota) → District (kecamatan) |
| **Historical** | 2014, 2019, 2024 election results |
| **Update** | Initial bulk import, then user-triggered re-import |

#### FR-04: ETL Pipeline
```
[Scrapers] → [Raw DB] → [Normalizer] → [Enrichment] → [Feature Store]
```
- **Normalizer**: Clean HTML, extract text, standardize timestamps
- **Enrichment**: NER (named entities: candidate names, locations, parties), language detection
- **Feature Store**: PostgreSQL materialized views for ML models

---

### 2.2 AI/ML Engine

#### FR-05: Bayesian Forecasting Model
| Field | Value |
|---|---|
| **Algorithm** | Hierarchical Bayesian (Stan/PyMC or NumPyro). Partial pooling across regions |
| **Features** | Historical vote share, demographic (BPS), polling data, sentiment signals, incumbency |
| **Output** | Win probability (0–100%), vote share estimate with confidence interval |
| **Update** | Every 6 hours (cron trigger) |
| **Granularity** | Per candidate per dapil (kab/kota) |
| **Backtesting** | Automated backtesting pipeline against 2014, 2019, 2024 results |

#### FR-06: Sentiment Analysis (NLP)
| Field | Value |
|---|---|
| **Model** | Fine-tuned IndoBERT / RoBERTa for Indonesian political domain |
| **Languages** | Indonesian (primary), Javanese, Sundanese, English |
| **Granularity** | Per article, per tweet, aggregated per 6-hour window |
| **Output** | Positive / Negative / Neutral score + confidence |
| **Slang handling** | Custom dictionary + few-shot LLM annotation loop |
| **Net Sentiment** | (Positive - Negative) / Total * 100 |

#### FR-07: Narrative Detection
| Field | Value |
|---|---|
| **Method** | Unsupervised clustering (HDBSCAN on embeddings) + LLM labeling |
| **Embedding model** | text-embedding-3-small (OpenAI) or local BGE-M3 |
| **Output** | 5–10 top narrative clusters with % share, trend +/-, sample tweets |
| **Update** | Every 3 hours |
| **Alert** | Flag narrative if growth > 30% in 3 hours |

#### FR-08: AI Co-pilot (RAG Chat)
| Field | Value |
|---|---|
| **LLM** | OpenRouter → Claude 3.5 Haiku / GPT-4o-mini |
| **RAG** | Retrieve from: articles, tweets, forecasts, sentiment data |
| **Vector DB** | pgvector in PostgreSQL |
| **Embeddings** | text-embedding-3-small stored alongside documents |
| **Context window** | Last 7 days of data + last 2 forecasts |
| **Fallback** | If no relevant docs → respond "Data belum tersedia" with suggestion |

#### FR-09: Scenario Simulation (Phase 2)
| Field | Value |
|---|---|
| **Input** | User selects candidate + issue + magnitude (±5% vote shift) + region |
| **Method** | Monte Carlo simulation on Bayesian posterior |
| **Output** | New win probability distribution, waterfall chart of affected dapil |
| **Time** | <30 seconds compute time |

#### FR-10: Attack Detection (Phase 2)
| Field | Value |
|---|---|
| **Method** | Binary classifier (fine-tuned BERT) detecting negative campaign content |
| **Target** | Content specifically targeting a candidate/party |
| **Alert threshold** | Spike > 40% in negative content over rolling 6-hour baseline |
| **Response playbook** | LLM generates suggested counter-narrative with data-backed messaging |

---

### 2.3 Backend API

#### FR-11: Authentication & Authorization
| Field | Value |
|---|---|
| **Method** | JWT (access + refresh tokens). Magic link email login |
| **Roles** | Admin (full access), Analyst (read + upload data), Viewer (read-only) |
| **Workspace** | Multi-tenant per organization. Data isolation at DB row level |
| **Session** | 24h access token, 7d refresh token |

#### FR-12: REST API Endpoints (MVP)

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Magic link request | No |
| `POST` | `/api/auth/verify` | Verify magic link token | No |
| `GET` | `/api/forecast/:dapil_id` | Forecast for specific dapil | Viewer+ |
| `GET` | `/api/forecast/map` | GeoJSON forecast map (all dapil) | Viewer+ |
| `GET` | `/api/sentiment/timeline` | Sentiment time series | Viewer+ |
| `GET` | `/api/sentiment/top-narratives` | Current narrative clusters | Viewer+ |
| `GET` | `/api/monitoring/articles` | Paginated article feed | Viewer+ |
| `POST` | `/api/copilot/chat` | RAG chat message | Viewer+ |
| `POST` | `/api/data/upload` | CSV upload (survey internal) | Analyst+ |
| `GET` | `/api/alerts` | Active alerts/warnings | Viewer+ |
| `GET` | `/api/briefing/latest` | Latest briefing for user | Viewer+ |

#### FR-13: WebSocket Events
| Event | Description |
|---|---|
| `forecast.update` | New forecast available |
| `alert.new` | New early warning alert |
| `narrative.spike` | Narrative growth exceeds threshold |

#### FR-14: Briefing Engine
| Field | Value |
|---|---|
| **Schedule** | Daily, 06:00 user timezone |
| **Content** | 1. Top 5 forecast changes. 2. Sentiment summary. 3. Top narratives. 4. Active alerts |
| **Delivery** | Email (Resend/SES) + Telegram Bot (Phase 2) |
| **Personalization** | Per dapil yang di-watch user |

---

### 2.4 Frontend (SPA)

#### FR-15: Dashboard Pages (MVP)

| Page | Route | Components |
|---|---|---|
| **Landing** | `/` | Hero, capabilities, features, CTA (already built as mockup) |
| **Login** | `/login` | Magic link form |
| **Dashboard** | `/app` | Forecast map, sentiment card, narrative feed, alert panel |
| **Forecast Detail** | `/app/forecast/:dapilId` | Full forecast with charts, history, contributing factors |
| **Sentiment** | `/app/sentiment` | Timeline, word cloud, narrative clusters |
| **Media Monitor** | `/app/monitor` | Article feed with filters (region, sentiment, outlet) |
| **AI Co-pilot** | `/app/copilot` | Chat interface with suggested prompts |
| **Settings** | `/app/settings` | Profile, team management, notification prefs |

#### FR-16: UI Components Required
Current: 45 shadcn/ui components exist. Additional needed:
- Forecast map (Leaflet/MapLibre for tile map + GeoJSON overlay)
- Time series chart (Recharts — already in deps)
- Chat interface (custom)
- CSV upload dropzone
- Alert notification panel (Sonner — already in deps)

#### FR-17: Client-Side State
- **TanStack Query**: Server state (forecasts, sentiment, articles)
- **Zustand**: UI state (active tab, map viewport, selected filters)
- **URL search params**: Shareable filter state (region, date range, candidate)

---

### 2.5 Non-Functional Requirements

| NFR | Requirement |
|---|---|
| **Performance** | Dashboard LCP < 2.5s, API p95 < 500ms |
| **Availability** | 99.5% uptime (excludes scheduled maintenance) |
| **Scalability** | Support 500 concurrent users MVP, 5K V2 |
| **Security** | HTTPS only, JWT with rotation, SQL injection prevention, rate limiting |
| **Data residency** | Indonesia region (or Singapore if infra not ready) |
| **Accessibility** | WCAG 2.1 AA |
| **Browser support** | Chrome, Firefox, Safari — last 2 versions |
