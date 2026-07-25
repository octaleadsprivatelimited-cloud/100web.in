import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LineChart, Globe2, Lock, Users, ArrowRight, Check,
} from "lucide-react";
import { services } from "../lib/services-data";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/")({
  component: Index,
});

const industries = [
  "Financial Services", "Healthcare", "Retail & E-commerce", "Manufacturing",
  "Education", "Media & Entertainment", "Logistics", "Government",
];

const stats = [
  { k: "250+", v: "Enterprise clients" },
  { k: "40+", v: "Countries served" },
  { k: "1B+", v: "Requests handled monthly" },
  { k: "99.99%", v: "Platform uptime" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "#5468FF" }}>
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          {/* Left: lavender content card */}
          <div className="hero-float relative z-10 rounded-[2rem] bg-[#DDE2FF] p-8 shadow-[0_30px_60px_-20px_rgba(10,31,68,0.45)] ring-1 ring-white/40 sm:p-10 md:p-12">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#0A1F44] sm:text-5xl lg:text-[3.25rem]">
              Scale globally with cloud built for enterprise
            </h1>
            <p className="mt-5 max-w-lg text-base text-[#0A1F44]/75 sm:text-lg">
              Get industry-leading security, reliability and performance for every workload — engineered by 100 Web Technologies.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A1F44] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0A1F44]/90"
            >
              Start your project
            </Link>
          </div>

          {/* Right: abstract geometric graphic */}
          <div className="relative hidden h-[420px] md:block">
            <svg viewBox="0 0 600 460" className="hero-drift absolute inset-0 h-full w-full drop-shadow-[0_20px_30px_rgba(10,31,68,0.35)]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="blk1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5E9B8" />
                  <stop offset="100%" stopColor="#E9EEF9" />
                </linearGradient>
                <linearGradient id="blk2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E9EEF9" />
                  <stop offset="100%" stopColor="#C9D3EE" />
                </linearGradient>
                <linearGradient id="blk3" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0E4A8" />
                  <stop offset="100%" stopColor="#DDE2FF" />
                </linearGradient>
              </defs>
              {/* Shapes */}
              <rect className="hero-shape-a" x="330" y="20" width="180" height="180" rx="28" fill="url(#blk1)" />
              <rect className="hero-shape-b" x="230" y="150" width="120" height="200" rx="28" fill="url(#blk2)" />
              <rect className="hero-shape-c" x="380" y="220" width="200" height="160" rx="28" fill="url(#blk3)" />
              <rect className="hero-shape-a" x="140" y="300" width="110" height="110" rx="24" fill="url(#blk1)" opacity="0.9" />
              {/* Cyan cable */}
              <path d="M 40 120 C 200 80, 340 260, 560 200" stroke="#3BC9F5" strokeWidth="10" fill="none" strokeLinecap="round" />
              {/* Thin black line */}
              <path d="M 60 140 C 220 100, 360 280, 580 220" stroke="#0A1F44" strokeWidth="1.5" fill="none" />
              {/* Second cable */}
              <path d="M 100 380 C 260 340, 400 440, 590 360" stroke="#3BC9F5" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
              <path d="M 100 380 C 260 340, 400 440, 590 360" stroke="#0A1F44" strokeWidth="1.5" fill="none" />
              {/* Green dots */}
              <circle cx="300" cy="152" r="6" fill="#38E17A" />
              <circle cx="315" cy="158" r="5" fill="#38E17A" />
              <circle cx="430" cy="248" r="6" fill="#38E17A" />
              <circle cx="445" cy="252" r="5" fill="#38E17A" />
              <circle cx="380" cy="405" r="6" fill="#38E17A" />
            </svg>
          </div>
        </div>

        {/* Stats strip on hero bottom */}
        <div className="relative border-t border-white/15">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
            {stats.map(s => (
              <div key={s.v}>
                <div className="text-2xl font-bold text-white sm:text-3xl">{s.k}</div>
                <div className="mt-1 text-xs text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS STRIP */}
      <section id="solutions" className="border-b bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground">Trusted technology partners</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-foreground/70">
              <span>AWS</span><span>Microsoft Azure</span><span>Google Cloud</span><span>Kubernetes</span><span>Snowflake</span><span>OpenAI</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">What we do</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Catch up on the latest launches, solutions, and success stories across cloud, AI, and enterprise engineering.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((card) => (
            <Link
              key={card.slug}
              to="/services/$slug"
              params={{ slug: card.slug }}
              className="group block overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <span className="absolute left-4 top-4 z-10 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-[var(--brand-navy)] shadow-sm">
                  {card.badge}
                </span>
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  width={1024}
                  height={576}
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)]">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SHORTS */}
      <section id="shorts" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Social</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">From our YouTube</h2>
            <p className="mt-4 text-lg text-muted-foreground">Quick takes on cloud, AI and engineering — straight from our team.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {["tCDvOQI3pco", "9bZkp7q19f0", "ZbZSe6N_BXs", "3JZ_D3ELwOQ"].map((id) => (
              <div key={id} className="overflow-hidden rounded-2xl border bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="YouTube short"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Industries</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Solutions tailored to your industry</h2>
            </div>
            <p className="text-muted-foreground md:text-right">Deep domain expertise across regulated and high-scale sectors, delivered by engineers who understand your business.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {industries.map(i => (
              <div key={i} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-4 text-sm font-medium transition hover:border-[var(--brand-orange)]/60 hover:shadow-md">
                <Check className="h-4 w-4 text-[var(--brand-orange)]" />
                {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL */}
      <section id="global" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Global reach</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Delivering across 40+ countries</h2>
            <p className="mt-4 text-muted-foreground">Our distributed engineering teams operate around the clock across the Americas, Europe, Middle East, Africa and Asia-Pacific — so your platforms never sleep.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Follow-the-sun engineering & support", "Data residency in 15+ regions", "Compliance: SOC 2, ISO 27001, GDPR, HIPAA", "Local partners in every major market"].map(x => (
                <li key={x} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 text-[var(--brand-orange)]" />{x}</li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-[var(--brand-navy)]" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="absolute inset-0 grid place-items-center">
              <Globe2 className="h-64 w-64 text-white/10" strokeWidth={0.6} />
            </div>
            <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6 text-white">
              {[
                { r: "Americas", c: "12 cities" },
                { r: "EMEA", c: "18 cities" },
                { r: "APAC", c: "14 cities" },
                { r: "India HQ", c: "Hyderabad" },
                { r: "Uptime", c: "99.99%" },
                { r: "Support", c: "24×7×365" },
              ].map(x => (
                <div key={x.r} className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs backdrop-blur">
                  <div className="text-white/70">{x.r}</div>
                  <div className="mt-1 font-semibold text-[var(--brand-orange)]">{x.c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-[var(--brand-navy)] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Why teams choose 100 Web Technologies</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: LineChart, t: "Outcomes, not hours", d: "We commit to measurable business outcomes — faster releases, lower cost, higher uptime." },
              { icon: Lock, t: "Security by default", d: "Every architecture starts with least-privilege, encryption and continuous compliance." },
              { icon: Users, t: "Senior engineers", d: "You work directly with architects and lead engineers — no handoffs to junior teams." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <I className="h-6 w-6 text-[var(--brand-orange)]" />
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-white/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Testimonials</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">What our clients say</h2>
          <p className="mt-4 text-lg text-muted-foreground">Real stories from leaders who scaled with 100 Web Technologies.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[
            { id: "L_LUpnjgPso", name: "Anita Rao", role: "CTO, FinEdge" },
            { id: "M7lc1UVf-VE", name: "David Chen", role: "VP Engineering, RetailOne" },
          ].map((t) => (
            <div key={t.id} className="overflow-hidden rounded-2xl border bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${t.id}`}
                  title={`Testimonial from ${t.name}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="p-6">
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border bg-card p-8 md:p-14" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let's build what's next.</h2>
              <p className="mt-4 text-muted-foreground">Tell us about your project — a solutions architect will get back within one business day.</p>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-[var(--brand-navy)] hover:brightness-110">
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/services" className="rounded-xl border bg-background p-5 text-sm font-semibold hover:border-[var(--brand-orange)]">Browse services →</Link>
              <Link to="/industries" className="rounded-xl border bg-background p-5 text-sm font-semibold hover:border-[var(--brand-orange)]">See industries →</Link>
              <Link to="/about" className="rounded-xl border bg-background p-5 text-sm font-semibold hover:border-[var(--brand-orange)]">About us →</Link>
              <Link to="/contact" className="rounded-xl border bg-background p-5 text-sm font-semibold hover:border-[var(--brand-orange)]">Contact →</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
