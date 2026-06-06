# TDD — Psephos: Technical Design Document
**Version:** 1.0  
**Date:** 2026-06-06  
**Status:** Draft  
**Author:** CTO / AI Engineering Lead

---

## 1. Current State Audit

### 1.1 What Exists

| Component | Status | Details |
|---|---|---|
| **Frontend framework** | ✅ Done | TanStack Start (SSR), React 19, Tailwind CSS 4, Vite 7 |
| **Design system** | ✅ Done | Custom tokens (lime, ink, cream, parchment, stone, graphite), Space Grotesk font |
| **UI components** | ✅ 45/45 | Full shadcn/ui library (Radix-based) |
| **Landing page** | 🟡 Mockup | Static HTML/CSS, zero live data, all hardcoded values |
| **Auth** | ❌ None | No login, no registration, no session management |
| **Database** | ❌ None | No connection, no schema, no migrations |
| **API** | ❌ None | Only 1 example `getGreeting` server function |
| **AI/ML** | ❌ None | No models, no inference, no RAG |
| **Data pipeline** | ❌ None | No scraping, no ingestion |
| **Infrastructure** | 🟡 Partial | Error capture, SSR error handling, server entry point (Nitro) |

### 1.2 Existing API Keys in .env
- ✅ OpenRouter (LLM access) — active key
- ✅ Tavily (search API) — active key
- ✅ PostgreSQL connection string (but no DB schema)
- ✅ Redis connection string (but unused)

### 1.3 Tech Stack Available (package.json)
**Frontend:** React 19, TanStack Start/Router/Query, Tailwind 4, Radix UI, Recharts, Lucide, Sonner, react-hook-form, zod, date-fns  
**Missing:** No backend framework, no ORM, no migration tool, no ML library

---

## 2. Architecture Decision Records (ADR)

### ADR-01: Backend Language & Framework
**Decision:** Python (FastAPI) + Celery for async tasks  
**Rationale:**
- ML/AI ecosystem (PyMC/NumPyro, transformers, scikit-learn) all Python-native
- FastAPI has excellent async support, auto-generated OpenAPI docs
- Celery for scraping/ETL jobs with Redis as broker (Redis already in stack)
- Avoids duplicating ML logic in TypeScript
- Existing .env references `REACT_APP_API_URL=http://localhost:8000/api` — consistent with a Python backend

**Alternative considered:** Everything in TypeScript/Node.js (TanStack Start server functions)  
**Rejected because:** No mature Bayesian inference library in JS. Python sklearn/transformers ecosystem irreplaceable for NLP.

### ADR-02: Database
**Decision:** PostgreSQL + pgvector + Redis  
**Rationale:**
- Postgres handles relational data (users, forecasts, articles, dapil)
- pgvector extension for embedding storage (RAG), no separate vector DB
- Redis for Celery broker + caching + rate limiting + real-time pub/sub
- Connection string already configured

### ADR-03: Forecasting Engine
**Decision:** Bayesian hierarchical model with PyMC or NumPyro  
**Rationale:** Hierarchical partial pooling handles small-sample dapil gracefully. Industry standard (The Economist, FiveThirtyEight).  
**Alternative:** XGBoost/LightGBM only — rejected because cannot produce principled uncertainty intervals.

### ADR-04: NLP Pipeline
**Decision:** Fine-tuned IndoBERT-base-p1 for sentiment + BGE-M3 for embeddings  
**Rationale:** IndoBERT is best Indonesian LM; BGE-M3 multilingual SOTA for retrieval. OpenRouter (Claude/GPT) for LLM chat, not for batch NLP (cost).

### ADR-05: Deployment
**Decision:** Docker Compose (dev) → Kubernetes (prod) on AWS/GCP Singapore  
**Rationale:** Multi-service (FastAPI, Celery workers, Celery beat, PostgreSQL, Redis, frontend). K8s for scaling. SG for latency <50ms to Indonesia.

---

## 3. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (TanStack Start)                  │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │ Landing │  │ Dashboard│  │ Forecast │  │ AI Co-pilot Chat  │ │
│  │ (SSR)   │  │ (CSR)    │  │ Detail   │  │                   │ │
│  └─────────┘  └──────────┘  └──────────┘  └───────────────────┘ │
│                       ↕ REST + WebSocket                         │
└──────────────────────────────────────────────────────────────────┘
                           │
                  ┌────────┴────────┐
                  │   API Gateway    │  (Nginx / Cloudflare)
                  └────────┬────────┘
                           │
┌──────────────────────────┴──────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │ Auth     │ │ Forecast  │ │ Copilot  │ │ Briefing Service  │ │
│  │ Service  │ │ Service   │ │ Service  │ │                   │ │
│  └──────────┘ └───────────┘ └──────────┘ └───────────────────┘ │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │ Sentiment│ │ Monitoring│ │ Alerts   │ │ Data Upload       │ │
│  │ Service  │ │ Service   │ │ Service  │ │ Service           │ │
│  └──────────┘ └───────────┘ └──────────┘ └───────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL   │ │    Redis     │ │   Celery     │
│  + pgvector   │ │  (broker +   │ │   Workers    │
│               │ │   cache)     │ │              │
└───────────────┘ └──────────────┘ └──────┬───────┘
                                           │
                          ┌────────────────┼────────────────┐
                          ▼                ▼                ▼
                   ┌────────────┐ ┌────────────┐ ┌──────────────┐
                   │  Scraper   │ │  Sentiment │ │ Forecasting  │
                   │  Worker    │ │  Worker    │ │ Worker       │
                   │ (Beats)    │ │ (Batch)    │ │ (Scheduled)  │
                   └────────────┘ └────────────┘ └──────────────┘
                          │                │                │
                          ▼                ▼                ▼
                   ┌─────────────────────────────────────────────────┐
                   │              EXTERNAL SERVICES                   │
                   │  X API · News APIs · Tavily · OpenRouter · BPS  │
                   └─────────────────────────────────────────────────┘
```

---

## 4. Database Schema (PostgreSQL)

### 4.1 Core Tables

```sql
-- ============ AUTH ============
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin','analyst','viewer')),
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(20) DEFAULT 'starter',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE magic_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE
);

-- ============ ELECTORAL DATA ============
CREATE TABLE regions (
    id VARCHAR(10) PRIMARY KEY, -- KPU code, e.g., "3171" for Jakarta Pusat
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('province','regency','district')),
    parent_id VARCHAR(10) REFERENCES regions(id),
    population INTEGER,
    registered_voters INTEGER,
    geom GEOGRAPHY(MULTIPOLYGON, 4326) -- for PostGIS map
);

CREATE TABLE election_results (
    id BIGSERIAL PRIMARY KEY,
    election_year INTEGER NOT NULL,
    region_id VARCHAR(10) REFERENCES regions(id),
    candidate_name VARCHAR(255) NOT NULL,
    party VARCHAR(100),
    vote_count INTEGER NOT NULL,
    vote_percentage NUMERIC(5,2),
    source VARCHAR(100) -- 'KPU', 'user_upload'
);

CREATE TABLE demographic_data (
    id BIGSERIAL PRIMARY KEY,
    region_id VARCHAR(10) REFERENCES regions(id),
    year INTEGER NOT NULL,
    indicator VARCHAR(100), -- 'poverty_rate', 'literacy_rate', 'urban_pct'
    value NUMERIC(10,3),
    source VARCHAR(100)
);

-- ============ FORECASTS ============
CREATE TABLE forecasts (
    id BIGSERIAL PRIMARY KEY,
    region_id VARCHAR(10) REFERENCES regions(id),
    candidate_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    win_probability NUMERIC(5,2),
    vote_share_estimate NUMERIC(5,2),
    vote_share_ci_lower NUMERIC(5,2),
    vote_share_ci_upper NUMERIC(5,2),
    parameters JSONB -- model parameters snapshot for reproducibility
);

CREATE INDEX idx_forecasts_region_time ON forecasts(region_id, generated_at DESC);

-- ============ MEDIA & SENTIMENT ============
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    source_url TEXT UNIQUE NOT NULL,
    source_name VARCHAR(255),
    title TEXT NOT NULL,
    body_text TEXT,
    published_at TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT NOW(),
    url_hash VARCHAR(64) UNIQUE -- SHA-256 for dedup
);

CREATE TABLE social_posts (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(20) -- 'twitter', 'tiktok'
    post_id VARCHAR(100) UNIQUE,
    author_username VARCHAR(255),
    body_text TEXT NOT NULL,
    posted_at TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB -- likes, retweets, location, etc.
);

CREATE TABLE sentiment_results (
    id BIGSERIAL PRIMARY KEY,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('article','social_post')),
    source_id BIGINT NOT NULL,
    model_version VARCHAR(50),
    sentiment VARCHAR(10) CHECK (sentiment IN ('positive','negative','neutral')),
    confidence NUMERIC(4,3),
    processed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sentiment_source_time ON sentiment_results(source_type, processed_at DESC);

-- ============ NARRATIVES ============
CREATE TABLE narrative_clusters (
    id BIGSERIAL PRIMARY KEY,
    generated_at TIMESTAMP NOT NULL,
    label VARCHAR(255), -- LLM-generated label e.g., "Subsidi BBM dicabut"
    document_count INTEGER,
    sentiment_net NUMERIC(5,2),
    growth_rate NUMERIC(5,2), -- % change vs previous period
    top_terms TEXT[], -- representative keywords
    region_ids TEXT[] -- affected regions
);

-- ============ VECTOR EMBEDDINGS (pgvector) ============
CREATE EXTENSION vector;

CREATE TABLE document_embeddings (
    id BIGSERIAL PRIMARY KEY,
    source_type VARCHAR(20) NOT NULL,
    source_id BIGINT NOT NULL,
    chunk_index INTEGER DEFAULT 0,
    chunk_text TEXT NOT NULL,
    embedding vector(1024), -- BGE-M3 dimension
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_embeddings_vector ON document_embeddings 
    USING ivfflat (embedding vector_cosine_ops);

-- ============ ALERTS ============
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    alert_type VARCHAR(50), -- 'narrative_spike', 'sentiment_drop', 'forecast_change'
    severity VARCHAR(10) CHECK (severity IN ('info','warning','critical')),
    title VARCHAR(255),
    body TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============ USER WATCHLIST ============
CREATE TABLE user_watchlist (
    user_id UUID REFERENCES users(id),
    region_id VARCHAR(10) REFERENCES regions(id),
    PRIMARY KEY (user_id, region_id)
);

-- ============ BRIEFINGS ============
CREATE TABLE briefings (
    id BIGSERIAL PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    generated_at TIMESTAMP NOT NULL,
    content JSONB -- structured briefing data
);
```

---

## 5. API Design (FastAPI)

### 5.1 Project Structure (Backend)
```
backend/
├── app/
│   ├── main.py              # FastAPI app, middleware, routers
│   ├── config.py             # Pydantic settings from env
│   ├── database.py           # SQLAlchemy async engine + session
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── region.py
│   │   ├── forecast.py
│   │   ├── article.py
│   │   └── ...
│   ├── schemas/              # Pydantic request/response schemas
│   ├── api/                  # Route handlers
│   │   ├── auth.py
│   │   ├── forecast.py
│   │   ├── sentiment.py
│   │   ├── copilot.py
│   │   ├── monitoring.py
│   │   ├── alerts.py
│   │   └── briefing.py
│   ├── services/             # Business logic
│   │   ├── forecast_service.py
│   │   ├── sentiment_service.py
│   │   ├── copilot_service.py
│   │   ├── rag_service.py
│   │   └── briefing_service.py
│   ├── ml/                   # ML models
│   │   ├── bayesian_model.py
│   │   ├── sentiment_model.py
│   │   ├── narrative_clustering.py
│   │   └── embeddings.py
│   └── tasks/                # Celery tasks
│       ├── scraper.py
│       ├── sentiment_pipeline.py
│       └── forecast_pipeline.py
├── alembic/                  # Database migrations
├── tests/
├── Dockerfile
├── requirements.txt
└── pyproject.toml
```

### 5.2 Key API Contracts

**Forecast Endpoint:**
```
GET /api/forecast/map?candidate=all&confidence=90
Response: {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "region_id": "3171",
      "region_name": "Jakarta Pusat",
      "leading_candidate": "Kandidat A",
      "win_probability": 62.4,
      "vote_share": 48.2,
      "ci_lower": 44.1,
      "ci_upper": 52.3
    },
    "geometry": { ... }
  }]
}
```

**AI Copilot Chat:**
```
POST /api/copilot/chat
Body: { "query": "Bagaimana isu BBM di Jatim minggu ini?" }
Response: {
  "answer": "3 narasi dominan: harga beras (38%), distribusi pupuk (29%), impor gula (22%)...",
  "sources": [
    { "title": "...", "url": "...", "date": "2026-06-05" }
  ],
  "narratives": [
    { "label": "Harga beras naik", "sentiment": -0.6, "count": 245 }
  ]
}
```

**Briefing:**
```
GET /api/briefing/latest
Response: {
  "date": "2026-06-06",
  "top_forecast_changes": [
    { "region": "Jawa Timur", "candidate": "Kandidat A", "change": "+3.2%", "direction": "up" }
  ],
  "sentiment_summary": { "net": 18.2, "trend": "improving" },
  "top_narratives": [ ... ],
  "active_alerts": [ ... ]
}
```

---

## 6. ML Pipeline Design

### 6.1 Forecasting Pipeline
```
[Cron: every 6 hours] → Celery Beat → forecast_pipeline.py
  1. Load latest polling + sentiment + demographic features
  2. Fit hierarchical Bayesian model (PyMC)
  3. Generate posterior samples per dapil per candidate
  4. Compute win_probability, vote_share, CI
  5. Upsert forecasts table
  6. Emit Redis pub/sub "forecast.update"
  7. Check for significant changes → create alerts
```

**Model Specification (Stan-like pseudocode):**
```stan
data {
  int N;                    // number of region-candidate pairs
  int R;                    // number of regions
  vector[N] vote_share;     // historical vote share
  matrix[N, K] features;    // demographic + polling features
  int region_idx[N];        // region index mapping
}
parameters {
  vector[K] beta;           // global effects
  vector[R] alpha;          // region random effects
  real<lower=0> sigma_region;
  real<lower=0> sigma;
}
model {
  alpha ~ normal(0, sigma_region);
  vote_share ~ normal(alpha[region_idx] + features * beta, sigma);
}
```

### 6.2 Sentiment Pipeline
```
[Cron: every 30 minutes] → Celery Beat → sentiment_pipeline.py
  1. Fetch unscored articles + social posts
  2. Preprocess text (clean, normalize slang)
  3. Batch inference with IndoBERT sentiment classifier
  4. Store results in sentiment_results
  5. Aggregate → materialized view for dashboard
```

**Model:** `indobenchmark/indobert-base-p1` fine-tuned on:
- 10K hand-labeled Indonesian political tweets
- Augmented with GPT-4 labeled data (few-shot)
- Slang dictionary mapping (e.g., "cak" → positive in Jatim context, "gabener" → negative)

### 6.3 Narrative Clustering Pipeline
```
[Cron: every 3 hours]
  1. Fetch last 3 hours of articles + posts
  2. Generate embeddings with BGE-M3
  3. Reduce dimensionality (UMAP)
  4. HDBSCAN clustering
  5. For each cluster: extract top terms, generate label with LLM (OpenRouter)
  6. Compare with previous period for growth rate
  7. If growth > 30% → create alert
  8. Store in narrative_clusters
```

### 6.4 RAG Pipeline (AI Co-pilot)
```
[On-demand, per user query]
  1. Embed user query with BGE-M3
  2. pgvector similarity search (cosine) → top 20 chunks
  3. Re-rank with cross-encoder (BGE-reranker-v2-m3)
  4. Fetch latest forecast + sentiment data for queried regions
  5. Construct prompt with system message + context
  6. OpenRouter call (Claude 3.5 Haiku, streaming)
  7. Return answer + source citations
```

---

## 7. Data Ingestion Pipeline

### 7.1 Scraper Architecture
```
Celery Beat (scheduling)
  │
  ├── news_scraper (every 30 min)
  │     └── 50 outlet RSS feeds + homepage scrapers
  │           ├── Newspaper4k / Trafilatura for extraction
  │           └── Dedup via URL hash (SHA-256)
  │
  ├── twitter_scraper (every 15 min)
  │     └── X API v2 search/recent
  │           ├── Keywords: candidate names, party names, policy terms
  │           └── Rate-limited: 10K tweets/day
  │
  └── tiktok_scraper (Phase 2)
        └── Puppeteer + rotating residential proxies
```

### 7.2 Proxy Infrastructure (Phase 2)
- Rotating proxy pool (BrightData / Oxylabs)
- Rate limiting per domain (polite scraping)
- robots.txt compliance check
- User-agent rotation

---

## 8. Frontend Architecture

### 8.1 Route Tree
```
routes/
├── __root.tsx                 # Shell: nav, auth guard, error boundary
├── index.tsx                  # Landing page (already built, needs auth-aware variant)
├── login.tsx                  # Magic link login page
├── _app/                      # Authenticated layout
│   ├── _app.tsx               # Layout: sidebar nav + header
│   ├── dashboard.tsx          # Main dashboard (forecast map, sentiment, alerts)
│   ├── forecast.$dapilId.tsx  # Forecast detail
│   ├── sentiment.tsx          # Sentiment analysis page
│   ├── monitor.tsx            # Media monitoring feed
│   ├── copilot.tsx            # AI co-pilot chat
│   └── settings.tsx           # User/org settings
```

### 8.2 Component Tree (Dashboard)
```
Dashboard Page
├── ForecastMap (MapLibre GL + GeoJSON overlay)
│   ├── RegionTooltip
│   └── LayerControls
├── SentimentCard
│   ├── SentimentSparkline (Recharts)
│   └── NarrativeTags
├── MediaFeed
│   ├── ArticleCard (source, title, sentiment badge)
│   └── FilterBar (region, sentiment, date range)
├── AlertsPanel
│   └── AlertCard (severity icon, title, body)
└── AI Copilot (collapsible sidebar)
    ├── ChatMessages
    └── SuggestedPrompts
```

### 8.3 State Management Plan
```typescript
// TanStack Query: server state
useQuery('forecast-map', fetchForecastMap)
useQuery('sentiment-timeline', fetchSentimentTimeline)
useQuery('narratives', fetchNarratives)
useQuery('alerts', fetchAlerts)
useInfiniteQuery('articles', fetchArticles)

// Zustand: UI state
interface UIState {
  activeTab: string
  mapViewport: { center, zoom }
  filters: { regionId?, dateRange?, candidate?, sentiment? }
  sidebarOpen: boolean
}

// URL search params: shareable state
/search?region=jatim&candidate=A&sentiment=negative
```

---

## 9. Infrastructure & Deployment

### 9.1 Docker Compose (Local Dev)
```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: tripol
      POSTGRES_USER: tripol_user
      POSTGRES_PASSWORD: tripol_pass
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  backend:
    build: ./backend
    command: uvicorn app.main:app --reload --host 0.0.0.0
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [postgres, redis]
    volumes: ["./backend:/app"]

  celery-worker:
    build: ./backend
    command: celery -A app.tasks worker -l info -c 4
    env_file: .env
    depends_on: [redis, postgres]

  celery-beat:
    build: ./backend
    command: celery -A app.tasks beat -l info
    env_file: .env
    depends_on: [redis]

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports: ["8080:8080"]
    depends_on: [backend]
```

### 9.2 Production (Kubernetes — Phase 2)

```
Cluster (GKE / EKS, Singapore)
├── namespace: psephos
│   ├── Deployment: backend-api (3 replicas, HPA)
│   ├── Deployment: celery-worker-{scraper,sentiment,forecast}
│   ├── Deployment: celery-beat (1 replica)
│   ├── StatefulSet: postgres (with pgvector)
│   ├── StatefulSet: redis
│   ├── CronJob: db-backup (daily)
│   ├── Service: backend-api (ClusterIP)
│   ├── Ingress: nginx → backend-api, frontend
│   └── ConfigMap + Secret: env vars
├── namespace: monitoring
│   ├── Prometheus + Grafana
│   └── Loki (logs)
```

### 9.3 CI/CD (GitHub Actions)
```yaml
# .github/workflows/ci.yml
on: push
jobs:
  backend:
    - lint (ruff)
    - test (pytest + coverage)
    - build & push Docker image
  frontend:
    - lint (eslint)
    - typecheck (tsc)
    - build & push Docker image
  deploy:
    needs: [backend, frontend]
    - kubectl apply (staging → production with approval)
```

---

## 10. Project Timeline (MVP: 8 Weeks)

| Week | Backend | ML/AI | Frontend | Infra |
|---|---|---|---|---|
| **W1** | FastAPI scaffold, DB schema + migrations, auth (magic link) | Data collection: KPU 2014–2024 CSV import | Login page, auth guard, app shell | Docker Compose, CI pipeline |
| **W2** | Region CRUD, forecast API skeleton | Bayesian model prototipe (PyMC) | Dashboard layout, forecast map (static GeoJSON) | Staging env |
| **W3** | News scraper (Celery), article API | Sentiment model (IndoBERT fine-tune start) | Sentiment card (static), media feed | Scraping proxy setup |
| **W4** | Sentiment API, narrative API | Sentiment model training complete | Real sentiment data wired, narrative cards | Celery production config |
| **W5** | AI copilot API (RAG scaffold), alerts API | Embedding pipeline (BGE-M3), pgvector setup | AI copilot chat UI, alerts panel | Redis pub/sub |
| **W6** | Briefing engine (email), CSV upload | Forecast model backtesting + tuning | Forecast detail page, briefing email template | Email service (Resend) |
| **W7** | WebSocket for real-time alerts | Narrative clustering pipeline | Real-time alert toasts, polish | Load testing |
| **W8** | Bug fixes, rate limiting, API docs | Model evaluation report | Final polish, PWA manifest | Penetration test, go-live checklist |

---

## 11. Testing Strategy

| Layer | Tool | What |
|---|---|---|
| **Unit (Backend)** | pytest | Service logic, model inference |
| **Unit (Frontend)** | Vitest + Testing Library | Component rendering |
| **Integration** | pytest + testcontainers | API → DB → Redis flow |
| **ML** | pytest + numpy | Model accuracy (holdout), pipeline integrity |
| **E2E** | Playwright | Critical paths: login → dashboard → copilot |
| **Performance** | Locust | API under load (500 concurrent) |
| **Backtesting** | Custom harness | Re-run forecast model on historical data, measure accuracy |

---

## 12. Security Checklist

- [ ] HTTPS enforced (HSTS)
- [ ] JWT with short TTL + refresh token rotation
- [ ] Rate limiting per IP + per user (Redis sliding window)
- [ ] SQL injection prevention (SQLAlchemy ORM with parameterized queries)
- [ ] Input validation (Pydantic schemas on all endpoints)
- [ ] CORS restricted to known origins
- [ ] API keys stored in secrets manager (not .env in prod)
- [ ] Database encryption at rest (AWS RDS / GCP Cloud SQL)
- [ ] Regular dependency vulnerability scanning (Dependabot / Snyk)
- [ ] UU PDP compliance (data localization, user consent, data deletion API)
