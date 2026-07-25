import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Play, Star, Sparkles, AlertCircle, Package, Target, Cog, TrendingUp, Award, Download } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { FaqAccordion } from "../components/faq-accordion";
import {
  gradientFor,
  buildFaqs,
  buildResults,
  buildTagline,
  buildOverview,
  getContentFor,
  deliveryProcess,
  buildPackage,
  buildStrategy,
  buildApproach,
  buildStats,
  buildReasons,
  type Industry,
} from "../lib/industries-data";
import { getPublicIndustry, listPublicIndustries, type ManagedIndustry } from "../lib/content.functions";
import overviewBg from "../assets/overview-bg.webp";
import aboutBg from "../assets/about-bg.jpg";
import featuresBg from "../assets/features-bg.webp";
import aidaBg from "../assets/aida-bg.webp";
import reasonsBg from "../assets/reasons-bg.webp";
import packageBg from "../assets/package-bg.webp";

export const Route = createFileRoute("/industries/$slug")({
  loader: async ({ params }) => {
    const [industry, industries] = await Promise.all([
      getPublicIndustry({ data: { slug: params.slug } }),
      listPublicIndustries(),
    ]);
    if (!industry) throw notFound();
    return { industry, industries };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Industry not found — 100 Web Technologies" }, { name: "robots", content: "noindex" }] };
    }
    const { industry } = loaderData;
    const title = `${industry.name} Website & Digital Solutions — 100 Web Technologies`;
    const desc = `Websites, apps, SEO and digital marketing built for ${industry.name} businesses. Get more customers, bookings and revenue.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: IndustryDetail,
  notFoundComponent: IndustryNotFound,
});

function IndustryNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold">Industry not found</h1>
        <p className="mt-3 text-muted-foreground">The industry you're looking for doesn't exist.</p>
        <Link to="/industries" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-brand-navy">
          Browse all industries <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function IndustryDetail() {
  const { industry, industries } = Route.useLoaderData() as { industry: ManagedIndustry; industries: ManagedIndustry[] };
  const faqs = buildFaqs(industry.name);
  const results = buildResults(industry.name);
  const content = getContentFor(industry);
  const gradient = gradientFor(industry.slug);
  const pkg = buildPackage(industry.name);
  const strategy = buildStrategy(industry.name);
  const approach = buildApproach();
  const stats = buildStats(industry.name);
  const reasons = buildReasons(industry.name);
  const related = industries.filter((i) => i.category === industry.category && i.slug !== industry.slug).slice(0, 6);

  const TOTAL = 11;
  const pad = (n: number) => String(n).padStart(2, "0");
  const Counter = ({ n, tone = "light" }: { n: number; tone?: "light" | "dark" }) => (
    <div className="mb-5 flex items-center gap-3 sm:mb-8">
      <span
        className={
          "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-widest sm:text-xs " +
          (tone === "dark"
            ? "border-white/25 bg-white/5 text-white/80"
            : "border-brand-navy/20 bg-white/70 text-brand-navy/80 backdrop-blur")
        }
      >
        {pad(n)} <span className="mx-1.5 opacity-50">/</span> {pad(TOTAL)}
      </span>
      <span
        className={
          "h-px flex-1 " + (tone === "dark" ? "bg-white/15" : "bg-brand-navy/15")
        }
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-brand-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">{industry.category}</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              {industry.hero_title || <>Grow your <span className="text-brand-orange">{industry.name}</span> business online.</>}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">{buildTagline(industry.name)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:brightness-110">
                Get a free proposal <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#results" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                See the results
              </a>
              {industry.pdf_url && <a href={industry.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"><Download className="h-4 w-4" /> Download PDF</a>}
            </div>
          </div>

          {/* Video placeholder */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03]">
            {industry.image_url && <img src={industry.image_url} alt={industry.name} className="absolute inset-0 h-full w-full object-cover opacity-70" />}
            <div className="absolute inset-0 grid place-items-center">
              <button
                type="button"
                aria-label={`Play ${industry.name} showreel`}
                className="group grid h-20 w-20 place-items-center rounded-full bg-brand-orange text-brand-navy shadow-xl transition hover:scale-105"
              >
                <Play className="ml-1 h-8 w-8 fill-current" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/10 bg-black/30 px-4 py-3 text-xs text-white/70 backdrop-blur">
              <span>Case study · {industry.name}</span>
              <span>0:00 / 1:20</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + images */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={1} tone="light" />
        <div
          className="relative overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-8"
          style={{
            backgroundImage: `url(${overviewBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="relative">
        <div className="grid gap-6 md:grid-cols-3 md:items-start md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">Overview</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">Built for {industry.name.toLowerCase()} owners</h2>
            <p className="mt-2 text-xs text-white/70 sm:mt-3 sm:text-sm">Trusted by {content.audience} across India and abroad.</p>
          </div>
          <p className="text-sm text-white/85 sm:text-base md:col-span-2 md:text-lg">{buildOverview(industry.name)}</p>
        </div>

        <div className="mt-6 sm:mt-12">
          {/* Mobile: swipeable snap slider */}
          <div className="-mx-4 sm:hidden">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=70",
                "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=70",
                "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=70",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-xl border border-white/15 bg-white/5"
                >
                  <img
                    src={src}
                    alt={`${industry.name} example ${i + 1}`}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 px-4 text-center text-[11px] font-medium uppercase tracking-wider text-white/60">
              Swipe to see more →
            </p>
          </div>

          {/* Desktop: 3-up grid */}
          <div className="hidden gap-4 sm:grid sm:grid-cols-3">
            {[
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=70",
              "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=70",
              "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=70",
            ].map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-white/5">
                <img
                  src={src}
                  alt={`${industry.name} example ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
        </div>
        </div>
      </section>

      {/* About the industry */}
      <section className="relative border-y py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Counter n={2} />
          <div
            className="relative overflow-hidden rounded-2xl border border-brand-navy/15 p-5 sm:p-8"
            style={{
              backgroundImage: `url(${aboutBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
          <div aria-hidden className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />
          <div className="relative">
          <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">About the industry</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl md:text-4xl">The {industry.name} landscape today</h2>
              <p className="mt-3 text-sm text-brand-navy/80 sm:mt-4 sm:text-base">{content.about}</p>
              <p className="mt-2 text-sm text-brand-navy/80 sm:mt-3 sm:text-base">We've worked with dozens of {industry.name.toLowerCase()} businesses — so we skip the learning curve and start with what actually moves the needle for you.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-brand-navy sm:text-lg">Common challenges we solve</h3>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                {content.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 rounded-lg border border-white/60 bg-white/80 px-3 py-2.5 text-[13px] text-brand-navy backdrop-blur sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="bg-muted/40 py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Counter n={3} />
          <div className="rounded-2xl border bg-card/60 p-5 sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">Results you'll see</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Real outcomes for {industry.name} businesses</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">Averages across our {industry.category.toLowerCase()} clients within the first 6 months.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4">
            {results.map((r) => (
              <div key={r.label} className="rounded-xl border bg-card p-4 sm:rounded-2xl sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="text-2xl font-black text-brand-orange sm:text-4xl">{r.metric}</div>
                <p className="mt-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">{r.label}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Offerings / What you get */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={4} />
        <div
          className="relative overflow-hidden rounded-2xl border border-brand-navy/15 p-5 sm:p-8"
          style={{
            backgroundImage: `url(${featuresBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div aria-hidden className="absolute inset-0 bg-black/50" />
        <div className="relative">
        <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">Features included</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">Everything a modern {industry.name.toLowerCase()} needs</h2>
            <p className="mt-3 text-sm text-white/80 sm:mt-4 sm:text-base">Purpose-built modules for {industry.category.toLowerCase()} — not a generic template.</p>
            <a href="#contact" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 sm:mt-6 sm:px-6 sm:py-3">
              Start my project <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {content.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 rounded-lg border bg-card px-3 py-3 text-[13px] font-medium sm:gap-3 sm:rounded-xl sm:px-4 sm:py-4 sm:text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" /> {f}
              </li>
            ))}
          </ul>
        </div>
        </div>
        </div>
      </section>

      {/* Delivery process */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={5} />
        <div className="rounded-2xl border border-brand-navy/15 bg-brand-navy p-5 sm:p-8 text-white">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">Our process</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">From first call to live site in 2–4 weeks</h2>
          <p className="mt-2 text-sm text-white/70 sm:mt-3 sm:text-base">A calm, weekly cadence — no surprises, no jargon, no chasing.</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4">
          {deliveryProcess.map((p) => (
            <div key={p.step} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-2xl sm:p-6">
              <div className="text-2xl font-black text-brand-orange sm:text-3xl">{p.step}</div>
              <h3 className="mt-2 text-sm font-semibold sm:mt-3 sm:text-lg">{p.title}</h3>
              <p className="mt-1.5 text-xs text-white/70 sm:mt-2 sm:text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Package Includes */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={6} />
        <div
          className="relative overflow-hidden rounded-2xl border border-brand-navy/15 p-5 sm:p-8"
          style={{
            backgroundImage: `url(${packageBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div aria-hidden className="absolute inset-0 bg-black/50" />
        <div className="relative">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">
            <Package className="h-4 w-4" /> Package includes
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Our {industry.name} growth package
          </h2>
          <p className="mt-2 text-sm text-white/80 sm:mt-3 sm:text-base">
            Everything you need to launch, capture leads and start converting — bundled in a single, transparent engagement.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {pkg.map((item) => (
            <div key={item.title} className="rounded-xl border bg-card p-4 sm:rounded-2xl sm:p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold sm:text-base">{item.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        </div>
        </div>
      </section>

      {/* AIDA Strategy */}
      <section className="border-y bg-muted/30 py-10 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Counter n={7} />
          <div
            className="relative overflow-hidden rounded-2xl border border-brand-navy/15 p-5 sm:p-8"
            style={{
              backgroundImage: `url(${aidaBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
          <div aria-hidden className="absolute inset-0 bg-black/50" />
          <div className="relative">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">
              <Target className="h-4 w-4" /> AIDA strategy
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              How we turn strangers into {industry.name.toLowerCase()} customers
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:mt-3 sm:text-base">
              A time-tested marketing framework — Attention, Interest, Desire, Action — applied to every campaign we run.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {strategy.map((s, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border bg-card p-5 sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-navy text-xl font-black text-brand-orange">
                  {s.key}
                </div>
                <h3 className="mt-3 text-base font-semibold sm:text-lg">{s.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          </div>
          </div>
        </div>
      </section>

      {/* Regular Approach */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={8} />
        <div className="rounded-2xl border bg-card/40 p-5 sm:p-8">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">
            <Cog className="h-4 w-4" /> Our regular approach
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            The playbook we run month after month
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            A repeatable operating rhythm behind every growth campaign — no guesswork, no ad-hoc experiments.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {approach.map((a) => (
            <div key={a.title} className="rounded-xl border bg-card p-4 sm:rounded-2xl sm:p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-orange text-brand-navy">
                <Cog className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold sm:text-base">{a.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{a.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={9} />
        <div className="rounded-2xl border border-brand-navy/15 bg-brand-navy p-5 sm:p-8 text-white">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">
              <TrendingUp className="h-4 w-4" /> Impact you can expect
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Numbers from real {industry.name} campaigns
            </h2>
            <p className="mt-2 text-sm text-white/70 sm:mt-3 sm:text-base">
              Indicative results from a 90-day engagement — actual numbers depend on budget, market and offer.
            </p>
          </div>
          <a href="#contact" className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-navy transition hover:brightness-110">
            Get my forecast <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-2xl sm:p-6">
              <div className="text-2xl font-black text-brand-orange sm:text-3xl">{s.metric}</div>
              <p className="mt-2 text-xs text-white/70 sm:mt-3 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Reasons to Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={10} />
        <div
          className="relative overflow-hidden rounded-2xl border border-brand-navy/15 p-5 sm:p-8"
          style={{
            backgroundImage: `url(${reasonsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
        <div aria-hidden className="absolute inset-0 bg-black/50" />
        <div className="relative">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start md:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-orange sm:text-sm">
              <Award className="h-4 w-4" /> Reasons to choose us
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Why {industry.name} businesses pick 100 Web Technologies
            </h2>
            <p className="mt-3 text-sm text-white/80 sm:mt-4 sm:text-base">
              We're not a generic agency running the same template on every client. We ship {industry.name.toLowerCase()}-specific playbooks that consistently move leads, revenue and repeat customers.
            </p>
            <a href="#contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">
              Talk to a specialist <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-2 sm:space-y-3">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-2.5 rounded-lg border bg-card px-3 py-3 text-[13px] sm:gap-3 sm:rounded-xl sm:px-4 sm:py-4 sm:text-sm">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-16 overflow-hidden rounded-3xl bg-brand-navy px-6 py-12 text-white sm:px-12 sm:py-14">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-brand-orange">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Limited slots this month</span>
              </div>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">Ready to bring more customers to your {industry.name.toLowerCase()}?</h3>
              <p className="mt-2 text-white/70">Free 20-minute strategy call. No obligation, no pushy sales.</p>
            </div>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-brand-navy transition hover:brightness-110">
              Book my free call <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <Counter n={11} />
        <div className={`rounded-2xl border border-brand-navy/15 ${gradient} p-5 sm:p-8`}>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy/70">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Questions {industry.name} owners ask us
          </h2>
        </div>
        <div className="mt-8 sm:mt-10">
          <FaqAccordion items={faqs} />
        </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border bg-card p-8 md:p-14" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Contact us</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Tell us about your {industry.name.toLowerCase()}</h2>
              <p className="mt-4 text-muted-foreground">
                Share a few details — a specialist who has worked with {industry.category.toLowerCase()} businesses will reply within one business day.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2"><Star className="h-4 w-4 text-brand-orange" /> 500+ small-business clients globally</div>
                <div className="flex items-center gap-2"><Star className="h-4 w-4 text-brand-orange" /> Transparent pricing, no lock-ins</div>
                <div className="flex items-center gap-2"><Star className="h-4 w-4 text-brand-orange" /> Ongoing support &amp; growth partner</div>
              </div>
              <div className="mt-6 space-y-1 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <a className="font-medium hover:text-brand-orange" href="mailto:hello@100web.in">hello@100web.in</a></div>
                <div><span className="text-muted-foreground">Web:</span> <span className="font-medium">100web.in</span></div>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Full name" maxLength={100} className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange" />
                <input required type="tel" placeholder="Phone / WhatsApp" maxLength={20} className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange" />
              </div>
              <input required type="email" placeholder="Work email" maxLength={255} className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange" />
              <input placeholder="Business name" maxLength={120} className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange" />
              <textarea
                rows={4}
                maxLength={1000}
                defaultValue={`I run a ${industry.name} and want help with my website & marketing.`}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-brand-orange"
              />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-brand-navy transition hover:brightness-110 sm:w-auto">
                Send enquiry <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related in same category */}
      {related.length > 0 && (
        <section className="bg-muted/40 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">More in {industry.category}</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/industries/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-full border bg-card px-4 py-2 text-sm font-medium transition hover:border-brand-orange hover:text-brand-orange"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
