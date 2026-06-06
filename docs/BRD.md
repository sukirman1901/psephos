# BRD — Psephos: Business Requirements Document
**Version:** 1.0  
**Date:** 2026-06-06  
**Status:** Draft  
**Audience:** Stakeholders, Investors, Leadership

---

## 1. Business Opportunity

### 1.1 Market Overview
Indonesia adalah demokrasi terbesar ketiga dunia dengan:
- **204 juta** pemilih (Pemilu 2024)
- **38 provinsi**, **514 kabupaten/kota**
- **18 partai politik nasional**
- **Siklus pemilu 5 tahunan** (Pileg, Pilpres, Pilkada serentak)
- **Belanja kampanye** Pemilu 2024: estimasi **Rp 50–70 triliun** (termasuk informal)

### 1.2 Addressable Market
| Segment | Total Entities | Estimated TAM | SAM (Year 1) |
|---|---|---|---|
| Partai politik nasional | 18 | Rp 180B/year | Rp 27B |
| Kandidat pilkada (per siklus) | ~2,500 | Rp 500B/siklus | Rp 25B |
| Lembaga survei | ~50 | Rp 50B/year | Rp 5B |
| Media nasional + lokal | ~500 | Rp 25B/year | Rp 2.5B |
| Akademisi / universitas | ~100 | Rp 10B/year | Rp 1B |
| **Total** | | **~Rp 765B** | **~Rp 60B** |

*TAM = Total Addressable Market. SAM = Serviceable Addressable Market (Year 1).*

### 1.3 Timing
**Pemilu 2029** adalah target utama. Siklus dimulai:
- 2027: Pendaftaran partai, koalisi mulai terbentuk
- 2028: Kampanye resmi
- 2029: Hari-H (Februari)

**Window of opportunity:** Build 2026–2027, capture market 2027–2029, establish as essential tool.

---

## 2. Value Proposition

> Psephos memangkas waktu riset elektoral dari **4 hari menjadi 4 jam**, menghemat biaya konsultan hingga **70%**, dengan akurasi prediksi **94%**.

### Differentiation
| Factor | Konvensional | Psephos |
|---|---|---|
| Waktu riset per laporan | 2–4 hari | 5 menit |
| Update data | Mingguan | Setiap 6 jam |
| Biaya per laporan (outsource) | Rp 10–50M | Rp 0 (included) |
| Coverage | 5–10 dapil prioritas | 514 dapil |
| NLP bahasa lokal | Tidak ada | IndoBERT fine-tuned |
| AI copilot | Tidak ada | RAG + LLM |

---

## 3. Business Model

### 3.1 Pricing Tiers (SaaS)

| Tier | Harga/Bulan | Users | Fitur Kunci |
|---|---|---|---|
| **Starter** | Free | 1 | 3 dapil, 1 briefing/minggu, AI co-pilot 10 query/hari |
| **Pro** | Rp 4.9M | 5 | Semua dapil, briefing harian, upload CSV, API access |
| **Team** | Rp 14.9M | 20 | War room collaborative, Telegram briefing, scenario sim |
| **Enterprise** | Custom | Unlimited | SSO, on-prem option, dedicated data pipeline, SLA |

### 3.2 Revenue Projections (Conservative)

| Year | Customers | ARPU/Bulan | ARR |
|---|---|---|---|
| Year 1 (2027) | 30 (Pro+) | Rp 8M | Rp 2.9B |
| Year 2 (2028) | 150 | Rp 10M | Rp 18B |
| Year 3 (2029 - peak) | 400 | Rp 12M | Rp 57.6B |

### 3.3 Additional Revenue Streams
- **Data licensing** ke media (API bulk access): Rp 500M–2B/tahun
- **Custom model training** untuk partai besar: Rp 1–5B/proyek
- **Election day real-time dashboard** add-on: Rp 100M/paket

---

## 4. Go-to-Market Strategy

### 4.1 Phase 1: Beta (Q3 2026)
- 5 design partners (partai, lembaga survei)
- Gratis selama beta, exchange for testimonial + feedback
- Target: 50 DAU

### 4.2 Phase 2: Launch (Q1 2027)
- Conference/demo di acara politik (KPU, Perludem, CSIS events)
- Content marketing: publikasi model akurasi backtesting
- Partnership dengan 2 lembaga survei besar (co-branding)
- Target: 30 paying customers

### 4.3 Phase 3: Scale (Q3 2027–2029)
- Direct sales team (5 orang) targeting 18 partai + 500+ kandidat
- Integrasi ke ekosistem partai (SMS blast, WhatsApp broadcast)
- API marketplace untuk developer
- Target: 150–400 customers

---

## 5. Key Stakeholders

| Role | Responsibility |
|---|---|
| **CEO/Founder** | Fundraising, partnerships, PR |
| **CTO** | Architecture, ML models, data pipeline, team |
| **Head of Product** | PRD execution, UX, user research |
| **Head of Sales** | Enterprise deals, government relations |
| **Data Scientist (2)** | Bayesian modeling, NLP sentiment, backtesting |
| **Backend Engineer (2)** | API, scraping pipeline, infra |
| **Frontend Engineer (1)** | Dashboard, data viz, PWA |
| **DevOps (1)** | CI/CD, monitoring, security |

---

## 6. Investment Required

### 6.1 Seed Round: $1.5M (18 months runway)

| Allocation | Amount |
|---|---|
| Engineering (7 FTE × 18mo) | $840K |
| Data acquisition (APIs, scraping infra) | $120K |
| Cloud infrastructure | $180K |
| Legal & compliance | $60K |
| Sales & marketing | $200K |
| Operations & buffer | $100K |

### 6.2 Key Milestones (18 months)

| Month | Milestone |
|---|---|
| M1–M2 | Data pipeline MVP (50 sources), forecast model prototipe |
| M3–M4 | Beta dashboard, 5 design partners onboarded |
| M5–M6 | Backtesting report (akurasi >85%), AI co-pilot beta |
| M7–M9 | Public launch, 30 paying customers |
| M10–M12 | Scenario simulation, enterprise features |
| M13–M18 | 150 customers, Series A ready |

---

## 7. Risks & Contingencies

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Partai besar tidak adopsi tech | Medium | High | Target kandidat individual + media dulu; land-and-expand |
| Regulasi data politik ketat | Low | High | Legal counsel from day 1, compliance-first architecture |
| Model akurasi di bawah klaim | Medium | High | Transparent methodology, under-promise/over-deliver |
| Copycat cepat (resource besar) | High | Medium | Data moat (historical + proprietary), switching cost via workflow integration |
| Team retention | Medium | High | Equity, remote-friendly, mission-driven culture |
