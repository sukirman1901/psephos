# PRD — Psephos: AI Electoral Analyst
## Product Requirements Document
**Version:** 1.0  
**Date:** 2026-06-06  
**Status:** Draft  
**Author:** CTO / AI Engineering Lead

---

## 1. Executive Summary

Psephos adalah platform SaaS riset politik bertenaga AI yang menyatukan prediksi elektoral, analisis sentimen publik, dan intelijen kampanye dalam satu dasbor. Target pengguna: tim riset partai politik, lembaga survei, staf kampanye kandidat, media, dan akademisi di Asia Tenggara (fokus awal: Indonesia).

**Visi:** Menjadi *single source of truth* data elektoral di Asia Tenggara, menggantikan spreadsheet dan konsultan manual dengan insight real-time berbasis AI.

**Kondisi saat ini (audit 2026-06-06):** Landing page statis (mockup UI) dengan 0% fitur backend terimplementasi. 45 komponen shadcn/ui sudah tersedia sebagai fondasi design system.

---

## 2. Problem Statement

| Pain Point | Detail |
|---|---|
| **Data terfragmentasi** | Tim riset harus menyatukan data dari BPS, KPU, 1200+ outlet media, 38M akun sosial, survei internal — semuanya manual di spreadsheet |
| **Lambat** | Riset elektoral konvensional memakan 2–4 hari untuk menghasilkan 1 laporan (diklaim Psephos: 4 jam) |
| **Tidak real-time** | Survei tradisional basi dalam 1–2 minggu. Narasi politik bergerak per jam |
| **NLP lokal lemah** | Belum ada tool yang memahami slang politik Indonesia, sarkasme, kode kampanye lokal |
| **Mahal** | Konsultan politik dan lembaga survei mengenakan biaya miliaran rupiah per siklus pemilu |

---

## 3. Target Users & Personas

| Persona | Kebutuhan Utama | Use Case |
|---|---|---|
| **Kepala Riset Partai** | Forecasting per dapil, early warning narasi negatif | Menentukan alokasi sumber daya kampanye |
| **Staf Kampanye Kandidat** | Monitoring sentimen harian, briefing pagi | Briefing juru bicara dan tim digital |
| **Lembaga Survei** | Cross-validasi hasil internal, akses data tambahan | Memvalidasi temuan quick count |
| **Media / Jurnalis** | Data elektoral terstruktur untuk pemberitaan | Menyusun laporan berbasis data |
| **Akademisi** | Akses API, dataset historis, backtesting | Publikasi riset politik |

---

## 4. Product Scope — MVP vs V2

### MVP (Phase 1 — 8 weeks)
| Fitur | Deskripsi |
|---|---|
| **Forecasting per dapil** | Bayesian hierarchical model. 514 kab/kota. Update tiap 6 jam |
| **Sentimen harian** | NLP multibahasa (ID, Jawa, Sunda). Aggregate net sentiment score |
| **Media monitoring dasar** | Scrape 50 outlet prioritas + X API. Dashboard feed narasi |
| **AI Co-pilot (chat)** | RAG-based Q&A atas data yang sudah di-platform. Powered by OpenRouter |
| **Briefing harian email** | Ringkasan prediksi + sentimen + top narasi ke email |
| **Auth & Multi-tenant** | Login, RBAC (Admin, Analyst, Viewer), workspace per organisasi |
| **Dasbor utama** | Single pane: forecast map, sentiment trend, narasi card, alert panel |

### V2 (Phase 2 — 12 weeks after MVP)
| Fitur | Deskripsi |
|---|---|
| **Simulasi skenario** | "What-if" engine: uji dampak isu terhadap elektabilitas |
| **Deteksi serangan + playbook** | ML classifier deteksi narasi negatif + LLM-generated respons |
| **Media monitoring full** | 1200+ outlet, 38M akun, TikTok scraping |
| **Briefing Telegram** | Push notification ke channel Telegram |
| **War room real-time** | Collaborative live dashboard untuk tim kampanye |
| **API publik** | REST API untuk integrasi eksternal |
| **Mobile app (PWA)** | Progressive web app untuk akses mobile |

---

## 5. User Stories (MVP)

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-01 | Kepala Riset | Melihat probabilitas menang per dapil dalam peta interactif | Saya bisa mengalokasikan sumber daya kampanye ke daerah kritis |
| US-02 | Staf Kampanye | Menerima briefing harian via email pukul 06:00 | Saya bisa briefing tim sebelum rapat pagi |
| US-03 | Analis | Bertanya "Bagaimana isu BBM di Jatim minggu ini?" ke AI co-pilot | Saya dapat insight cepat tanpa query manual |
| US-04 | Kepala Riset | Melihat tren sentimen 30 hari untuk 3 kandidat sekaligus | Saya bisa membandingkan performa kampanye |
| US-05 | Admin Partai | Mengelola anggota tim dengan role berbeda | Hanya yang berwenang bisa mengubah data internal |
| US-06 | Staf Kampanye | Mendapatkan alert ketika narasi negatif naik >30% dalam 3 jam | Saya bisa merespons sebelum viral |
| US-07 | Analis | Mengunggah data survei internal (.csv) | Saya bisa mengkombinasikan data internal dengan data platform |

---

## 6. Success Metrics (MVP)

| Metrik | Target | Cara Ukur |
|---|---|---|
| Daily Active Users (DAU) | 100 di bulan ke-3 | Analytics dashboard |
| Akurasi prediksi (backtesting) | >85% di 38 pilkada historis | Holdout testing |
| Time-to-insight | <5 menit dari query ke jawaban | Latency monitoring |
| Email open rate briefing | >40% | Email analytics |
| NPS | >30 | In-app survey |

---

## 7. Competitive Landscape

| Competitor | Strengths | Weaknesses | Psephos Advantage |
|---|---|---|---|
| **Indikator Politik** | Merek kuat, data historis | Tidak real-time, tidak ada AI, mahal | AI + real-time + self-service |
| **PolMark** | Jaringan luas | Manual, tertutup | API + transparansi metodologi |
| **FiveThirtyEight (global)** | Model Bayesian terkenal | Tidak fokus Indonesia, tidak ada NLP lokal | NLP bahasa lokal + data BPS terpadu |
| **YouGov** | Panel global | Tidak granular per dapil | 514 dapil, granular |

---

## 8. Out of Scope (MVP)

- Integrasi quick count real-time (hari-H)
- SSO / OAuth provider enterprise (SAML)
- Multi-bahasa UI (hanya ID + EN)
- On-premise deployment
- Streaming data pipeline (batch cukup untuk MVP)
- Native mobile app

---

## 9. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Data KPU/BPS tidak lengkap / tidak real-time | High | Mulai dengan data historis 2014–2024, fallback ke estimasi |
| Akurasi model rendah | High | Backtesting ketat, ensemble models, human-in-the-loop |
| Scraping diblokir platform | Medium | Rotasi proxy, rate limiting, legal review |
| Pasar tidak mau bayar | High | Freemium model, buktikan value dulu dengan free tier |
| Isu privasi data politik | Critical | Enkripsi at-rest, SOC2 readiness, compliance UU PDP |
