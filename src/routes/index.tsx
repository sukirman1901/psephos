import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  X,
  Globe,
  Menu,
  User,
  Play,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Radar,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Sparkles,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Psephos — AI Electoral Analyst untuk Riset Politik" },
      {
        name: "description",
        content:
          "Platform riset politik bertenaga AI: prediksi elektoral real-time, sentimen publik, dan intelijen kampanye dalam satu dasbor.",
      },
      { property: "og:title", content: "Psephos — AI Electoral Analyst" },
      {
        property: "og:description",
        content:
          "Prediksi elektoral, analisis sentimen, dan intelijen kampanye di satu tempat.",
      },
    ],
  }),
  component: Index,
});

/* -------------------------- shared atoms -------------------------- */

function PrimaryCTA({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-[26px] border border-ink bg-lime px-5 py-3 text-[16px] font-medium text-ink transition hover:translate-y-[-1px]">
      {children}
    </button>
  );
}

function GhostDark({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-[26px] border border-ink bg-transparent px-5 py-3 text-[16px] font-normal text-ink transition hover:bg-ink hover:text-cream">
      {children}
    </button>
  );
}

function GhostLight({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-[26px] border border-white bg-transparent px-5 py-3 text-[16px] font-normal text-white transition hover:bg-white hover:text-ink">
      {children}
    </button>
  );
}

function StatusChip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "confirm" | "alert";
  children: React.ReactNode;
}) {
  const cls =
    tone === "confirm"
      ? "bg-white text-mint"
      : tone === "alert"
      ? "bg-white text-coral"
      : "bg-white text-ink";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[8px] ${cls} px-2 py-[2px] text-[12px] font-medium`}
    >
      {tone === "confirm" && <CheckCircle2 className="h-3 w-3" />}
      {tone === "alert" && <AlertTriangle className="h-3 w-3" />}
      {children}
    </span>
  );
}

/* -------------------------- page -------------------------- */

function Index() {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <AnnouncementBanner />
      <Nav />
      <Hero />
      <LogoStrip />
      <CapabilitiesTabs />
      <FeatureGrid />
      <DataModuleSection />
      <PullQuote />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

/* -------------------------- banner -------------------------- */

function AnnouncementBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="w-full bg-lime text-ink">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-2.5 text-[14px]">
        <p className="flex-1 text-center">
          <span className="font-medium">Pemilu 2029 Outlook:</span> laporan
          prediksi awal kini tersedia.{" "}
          <a className="underline underline-offset-2" href="#">
            Pelajari selengkapnya
          </a>
        </p>
        <button
          aria-label="Dismiss"
          onClick={() => setOpen(false)}
          className="rounded p-1 hover:bg-ink/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------- nav -------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-ink">
            <div className="h-2.5 w-2.5 rounded-full bg-lime" />
          </div>
          <span className="text-[20px] font-medium tracking-tight">Psephos</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {["Platform", "Solusi", "Riset", "Pelanggan", "Harga"].map((l) => (
            <a key={l} href="#" className="text-[16px] text-ink hover:text-graphite">
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-full p-2 text-ink hover:bg-stone md:inline-flex">
            <Globe className="h-4 w-4" />
          </button>
          <div className="hidden md:block">
            <GhostDark>Book a demo</GhostDark>
          </div>
          <PrimaryCTA>Get started</PrimaryCTA>
          <button className="ml-1 hidden rounded-full border border-ink p-2 md:inline-flex">
            <User className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------- hero -------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-[980px] text-center">
          <span className="label-wide text-[12px] font-medium text-graphite">
            AI Electoral Analyst · v2.5
          </span>
          <h1 className="display-tight mt-6 text-[56px] font-medium md:text-[90px]">
            Riset politik,
            <br />
            <span className="italic">dipercepat AI.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-[620px] text-[18px] leading-[1.5] text-graphite">
            Psephos menyatukan prediksi elektoral, sentimen publik, dan intelijen
            kampanye dalam satu dasbor — tanpa konsultan, tanpa spreadsheet.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PrimaryCTA>
              Coba gratis 14 hari <ArrowRight className="h-4 w-4" />
            </PrimaryCTA>
            <GhostDark>Book a demo</GhostDark>
          </div>
        </div>

        {/* Floating UI cards composition */}
        <div className="relative mx-auto mt-16 grid max-w-[1100px] grid-cols-12 gap-4 md:mt-24">
          {/* Left top: probability card */}
          <div className="col-span-12 md:col-span-4 md:mt-8">
            <ProbabilityCard />
          </div>

          {/* Center: phone mockup */}
          <div className="col-span-12 md:col-span-4 flex items-center justify-center">
            <PhoneMock />
          </div>

          {/* Right top: sentiment */}
          <div className="col-span-12 md:col-span-4 md:-mt-4">
            <SentimentCard />
          </div>

          {/* Bottom row */}
          <div className="col-span-12 md:col-span-5 md:-mt-8">
            <LimeInsightCard />
          </div>
          <div className="col-span-12 md:col-span-7 md:mt-4">
            <MapCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProbabilityCard() {
  return (
    <div className="rounded-[26px] bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="label-wide text-[10px] text-graphite">Probabilitas Menang</span>
        <StatusChip tone="confirm">Live</StatusChip>
      </div>
      <div className="mt-4 heading-tight text-[64px] font-medium">62.4%</div>
      <p className="mt-2 text-[14px] text-graphite">
        Kandidat A — DKI Jakarta · 12 jam terakhir
      </p>
      <div className="mt-5 space-y-3">
        {[
          { name: "Kandidat A", v: 62, tone: "bg-lime" },
          { name: "Kandidat B", v: 24, tone: "bg-ink" },
          { name: "Kandidat C", v: 14, tone: "bg-stone" },
        ].map((r) => (
          <div key={r.name}>
            <div className="mb-1 flex justify-between text-[13px]">
              <span>{r.name}</span>
              <span className="font-medium">{r.v}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
              <div
                className={`h-full ${r.tone}`}
                style={{ width: `${r.v}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentCard() {
  return (
    <div className="rounded-[26px] bg-ink p-6 text-white">
      <div className="flex items-center justify-between">
        <span className="label-wide text-[10px] text-stone">Sentimen 24j</span>
        <Activity className="h-4 w-4 text-lime" />
      </div>
      <div className="mt-4 heading-tight text-[40px] font-medium">
        +18<span className="text-lime">.2</span>
      </div>
      <p className="mt-1 text-[14px] text-stone">Net sentiment score</p>

      <div className="mt-5 flex h-16 items-end gap-1.5">
        {[20, 28, 22, 40, 35, 52, 44, 60, 55, 72, 68, 84].map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${i === 11 ? "bg-lime" : "bg-white/15"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {["#KebijakanPangan", "#Subsidi", "#KampanyeHijau"].map((t) => (
          <span
            key={t}
            className="rounded-[8px] border border-white/20 px-2 py-[2px] text-[12px] text-stone"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="relative mx-auto h-[480px] w-[240px] rounded-[40px] border-[6px] border-ink bg-ink p-2">
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink" />
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-cream">
        <div className="flex items-center justify-between px-4 pt-7 text-[11px]">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div className="px-4 pt-4">
          <span className="label-wide text-[10px] text-graphite">Briefing harian</span>
          <h3 className="mt-2 heading-tight text-[22px] font-medium">
            Pergerakan elektoral
          </h3>
        </div>
        <div className="m-4 rounded-[20px] bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-graphite">Swing voters</span>
            <span className="rounded-[8px] bg-lime px-1.5 py-[1px] text-[11px] font-medium text-ink">
              +4.1%
            </span>
          </div>
          <div className="mt-3 heading-tight text-[28px] font-medium">31.7%</div>
          <div className="mt-3 flex gap-1">
            {[40, 60, 35, 80, 55, 70, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded bg-ink/10"
                style={{ height: 32 * (h / 100) + "px" }}
              />
            ))}
          </div>
        </div>
        <div className="mx-4 rounded-[20px] bg-ink p-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-lime" />
            <span className="text-[11px] text-stone">AI summary</span>
          </div>
          <p className="mt-2 text-[12px] leading-[1.4]">
            Narasi "subsidi pangan" naik 38% di Jawa Tengah. Pertimbangkan
            respons cepat.
          </p>
        </div>
        <div className="mt-auto flex items-center justify-around border-t border-stone px-4 py-3">
          <div className="h-1.5 w-12 rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

function LimeInsightCard() {
  return (
    <div className="rounded-[26px] bg-lime p-6 text-ink">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ink">
          <Radar className="h-4 w-4" />
        </div>
        <span className="label-wide text-[10px]">Visibility real-time</span>
      </div>
      <p className="mt-5 heading-tight text-[28px] font-medium">
        Pantau 540+ narasi politik per jam di seluruh kanal sosial dan media.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <GhostDark>
          Lihat sumber data <ArrowUpRight className="h-4 w-4" />
        </GhostDark>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <div className="rounded-[26px] bg-parchment p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="label-wide text-[10px] text-graphite">
            Peta keterpilihan
          </span>
          <h4 className="mt-1 text-[20px] font-medium">Provinsi prioritas</h4>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-ink p-2">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-ink bg-stone p-2">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 36 }).map((_, i) => {
          const v = (i * 37) % 100;
          const bg =
            v > 70
              ? "bg-lime"
              : v > 45
              ? "bg-ink"
              : v > 25
              ? "bg-stone"
              : "bg-white";
          return <div key={i} className={`aspect-square rounded-[8px] ${bg}`} />;
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] text-graphite">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-lime" /> Aman
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-ink" /> Kompetitif
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-stone" /> Berisiko
        </span>
      </div>
    </div>
  );
}

/* -------------------------- logo strip -------------------------- */

function LogoStrip() {
  const logos = [
    "Tirto",
    "KIC",
    "PolMark",
    "Indikator",
    "LSI",
    "SaifulMujani",
    "CSIS",
  ];
  return (
    <section className="border-y border-stone bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <p className="text-center text-[13px] text-graphite">
          Dipercaya oleh tim riset, lembaga survei, dan staf kampanye di seluruh
          Asia Tenggara
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-80">
          {logos.map((l) => (
            <span
              key={l}
              className="text-[22px] font-medium tracking-tight text-ink/70"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- capabilities tabs -------------------------- */

function CapabilitiesTabs() {
  const tabs = ["Prediksi", "Sentimen", "Kampanye"] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>("Prediksi");

  const content: Record<
    (typeof tabs)[number],
    { title: string; sub: string; items: { t: string; d: string }[] }
  > = {
    Prediksi: {
      title: "Model prediksi yang terbukti di lapangan.",
      sub: "Gabungkan data survei, registrasi pemilih, dan sinyal real-time menjadi probabilitas elektoral per daerah pemilihan.",
      items: [
        { t: "Forecast Bayesian", d: "Pembaruan tiap 6 jam dengan margin error per dapil." },
        { t: "Simulasi skenario", d: "Uji dampak isu kampanye terhadap suara dalam hitungan detik." },
        { t: "Backtesting 2014–2024", d: "Akurasi rata-rata 94% di 38 pemilihan regional." },
      ],
    },
    Sentimen: {
      title: "Dengar suara publik tanpa kebisingan.",
      sub: "AI bahasa Indonesia memahami slang, sarkasme, dan kode politik di X, TikTok, dan media massa.",
      items: [
        { t: "NLP multibahasa", d: "Bahasa Indonesia, Jawa, Sunda, dan Inggris." },
        { t: "Deteksi narasi", d: "Identifikasi narasi yang naik 24 jam sebelum viral." },
        { t: "Cluster isu", d: "Kelompokkan ribuan percakapan menjadi 5–10 narasi inti." },
      ],
    },
    Kampanye: {
      title: "Intelijen untuk tim kampanye, bukan akademisi.",
      sub: "Briefing harian, deteksi serangan, dan rekomendasi respons untuk juru bicara dan tim digital.",
      items: [
        { t: "War room dashboard", d: "Satu layar untuk semua kanal dan semua dapil." },
        { t: "Deteksi serangan", d: "Peringatan dini ketika narasi negatif menargetkan kandidat Anda." },
        { t: "Playbook respons", d: "Saran narasi balasan berdasarkan data pemilih." },
      ],
    },
  };

  const c = content[active];

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="mb-12 text-center">
          <span className="label-wide text-[12px] text-graphite">Platform</span>
          <h2 className="mt-4 heading-tight text-[40px] font-medium md:text-[64px]">
            Tiga kemampuan inti.
            <br />
            <span className="text-graphite">Satu sumber kebenaran.</span>
          </h2>
        </div>

        {/* Pill tabs */}
        <div className="mx-auto mb-12 flex w-fit items-center gap-1 rounded-[26px] bg-stone p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-[26px] px-5 py-2 text-[14px] font-medium transition ${
                active === t ? "bg-ink text-white" : "text-ink hover:text-graphite"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid items-start gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="heading-tight text-[32px] font-medium md:text-[40px]">
              {c.title}
            </h3>
            <p className="mt-5 text-[18px] leading-[1.5] text-graphite">{c.sub}</p>
            <div className="mt-8">
              <GhostDark>
                Lihat dokumentasi <ArrowUpRight className="h-4 w-4" />
              </GhostDark>
            </div>
          </div>

          <div className="grid gap-4 md:col-span-7 md:grid-cols-3">
            {c.items.map((it, i) => (
              <div
                key={it.t}
                className={`rounded-[26px] p-6 ${
                  i === 1 ? "bg-ink text-white" : "bg-white text-ink"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    i === 1 ? "border-white" : "border-ink"
                  }`}
                >
                  {i === 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : i === 1 ? (
                    <Sparkles className="h-4 w-4 text-lime" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                </div>
                <h4 className="mt-6 text-[20px] font-medium">{it.t}</h4>
                <p
                  className={`mt-2 text-[14px] leading-[1.5] ${
                    i === 1 ? "text-stone" : "text-graphite"
                  }`}
                >
                  {it.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- feature grid -------------------------- */

function FeatureGrid() {
  const items = [
    {
      t: "Forecasting per dapil",
      d: "Probabilitas menang real-time untuk 514 kabupaten/kota.",
      icon: BarChart3,
    },
    {
      t: "Media monitoring 24/7",
      d: "Liputan dari 1.200+ outlet, 38 juta akun sosial.",
      icon: Radar,
    },
    {
      t: "AI co-pilot",
      d: "Tanya 'Bagaimana isu BBM di Jatim minggu ini?' dapatkan jawaban.",
      icon: Sparkles,
    },
    {
      t: "Briefing otomatis",
      d: "Ringkasan harian dikirim ke email atau Telegram tim.",
      icon: MessageSquare,
    },
  ];

  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <span className="label-wide text-[12px] text-graphite">Fitur</span>
            <h2 className="mt-4 heading-tight text-[40px] font-medium md:text-[64px]">
              Semua yang dibutuhkan tim riset modern.
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full border border-ink p-3">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-ink bg-stone p-3">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {items.map(({ t, d, icon: Icon }) => (
            <div
              key={t}
              className="flex flex-col rounded-[26px] bg-white p-6 transition hover:bg-cream"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ink">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-10 text-[22px] font-medium leading-[1.2]">{t}</h3>
              <p className="mt-3 text-[14px] leading-[1.5] text-graphite">{d}</p>
              <a
                href="#"
                className="mt-8 inline-flex items-center gap-1 text-[14px] font-medium underline-offset-4 hover:underline"
              >
                Pelajari <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- data module section -------------------------- */

function DataModuleSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="grid items-stretch gap-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="flex h-full flex-col rounded-[26px] bg-ink p-8 text-white md:p-12">
              <span className="label-wide text-[12px] text-stone">
                War room
              </span>
              <h2 className="mt-6 heading-tight text-[40px] font-medium md:text-[64px]">
                Satu dasbor.
                <br />
                <span className="text-lime">Setiap dapil.</span>
                <br />
                Setiap jam.
              </h2>
              <p className="mt-8 max-w-[460px] text-[16px] leading-[1.5] text-stone">
                Gabungkan polling internal, data BPS, riwayat pemilu, dan sinyal
                sosial dalam satu antarmuka yang bisa dibagikan ke seluruh tim
                kampanye.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <PrimaryCTA>Mulai uji coba</PrimaryCTA>
                <GhostLight>Tonton video tur</GhostLight>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  { k: "94%", v: "Akurasi prediksi" },
                  { k: "514", v: "Kabupaten/kota" },
                  { k: "38jt", v: "Akun dimonitor" },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="heading-tight text-[40px] font-medium text-lime">
                      {s.k}
                    </div>
                    <div className="mt-1 text-[13px] text-stone">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:col-span-5">
            <div className="rounded-[26px] bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="label-wide text-[10px] text-graphite">
                  Peringatan dini
                </span>
                <StatusChip tone="alert">Perlu respons</StatusChip>
              </div>
              <p className="mt-4 text-[18px] font-medium leading-[1.3]">
                Narasi "subsidi BBM dicabut" naik 41% dalam 3 jam terakhir di
                Jawa Timur.
              </p>
              <div className="mt-5 flex items-center gap-2 text-[13px] text-graphite">
                <MapPin className="h-3.5 w-3.5" />
                <span>Surabaya, Malang, Sidoarjo</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-[26px] bg-lime p-6">
              <div className="flex items-center justify-between">
                <span className="label-wide text-[10px]">AI Co-pilot</span>
                <div className="rounded-full border border-ink bg-cream p-1.5">
                  <Play className="h-3 w-3 fill-ink" />
                </div>
              </div>
              <div className="mt-5 rounded-[20px] border border-ink bg-cream p-4">
                <p className="text-[14px] font-medium">
                  "Ringkas isu pangan di Sumatera minggu ini."
                </p>
              </div>
              <div className="mt-3 rounded-[20px] bg-ink p-4 text-white">
                <p className="text-[13px] leading-[1.5]">
                  3 narasi dominan: harga beras (38%), distribusi pupuk (29%),
                  impor gula (22%). Sentimen menurun 6 poin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- pull quote -------------------------- */

function PullQuote() {
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="label-wide text-[12px] text-graphite">
              Testimoni
            </span>
            <blockquote className="mt-6 heading-tight text-[32px] font-medium md:text-[48px]">
              "Psephos memangkas waktu riset kami dari empat hari menjadi empat
              jam. Briefing harian AI-nya akurat dan langsung bisa dipakai di
              war room."
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-ink" />
              <div>
                <div className="text-[14px] font-medium">Rifka Hartanto</div>
                <div className="text-[13px] text-graphite">
                  Head of Research · Kompas Strategic
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-[26px] bg-ink p-6 text-white">
              <div className="heading-tight text-[64px] font-medium text-lime">
                4×
              </div>
              <p className="mt-2 text-[14px] text-stone">
                Riset lebih cepat dibanding metode konvensional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- closing CTA -------------------------- */

function ClosingCTA() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 pb-20 md:pb-28">
        <div className="rounded-[26px] bg-lime p-10 md:p-16">
          <div className="grid items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <span className="label-wide text-[12px]">Mulai hari ini</span>
              <h2 className="mt-6 display-tight text-[48px] font-medium md:text-[90px]">
                Pemilu berikutnya tidak menunggu.
              </h2>
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
              <p className="max-w-[320px] text-[16px] text-ink/80 md:text-right">
                Uji coba 14 hari. Tanpa kartu kredit. Setup dalam 10 menit.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-[26px] border border-ink bg-ink px-5 py-3 text-[16px] font-medium text-white">
                  Mulai gratis <ArrowRight className="h-4 w-4" />
                </button>
                <GhostDark>Hubungi tim</GhostDark>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- footer -------------------------- */

function Footer() {
  const cols = [
    {
      h: "Platform",
      l: ["Prediksi", "Sentimen", "Kampanye", "API", "Integrasi"],
    },
    { h: "Solusi", l: ["Partai", "Kandidat", "Media", "Akademisi"] },
    { h: "Riset", l: ["Laporan", "Blog", "Webinar", "Pers"] },
    { h: "Perusahaan", l: ["Tentang", "Karir", "Kontak", "Keamanan"] },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-lime">
                <div className="h-2.5 w-2.5 rounded-full bg-ink" />
              </div>
              <span className="text-[20px] font-medium tracking-tight">
                Psephos
              </span>
            </div>
            <p className="mt-6 max-w-[320px] text-[14px] text-stone">
              AI Electoral Analyst untuk tim riset politik, lembaga survei, dan
              kampanye di Asia Tenggara.
            </p>
            <div className="mt-8 flex gap-2">
              <PrimaryCTA>Mulai gratis</PrimaryCTA>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {cols.map((c) => (
              <div key={c.h}>
                <h4 className="label-wide text-[11px] text-stone">{c.h}</h4>
                <ul className="mt-4 space-y-3">
                  {c.l.map((i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-[14px] text-white/90 hover:text-lime"
                      >
                        {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-[13px] text-stone">
          <span>© 2026 Psephos Labs. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#">Privasi</a>
            <a href="#">Ketentuan</a>
            <a href="#">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
