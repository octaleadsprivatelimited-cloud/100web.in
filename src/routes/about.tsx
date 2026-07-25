import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users, LineChart, Lock } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — 100 Web Technologies" },
      { name: "description", content: "Meet 100 Web Technologies — a global engineering team building cloud, AI and enterprise products for ambitious companies." },
      { property: "og:title", content: "About — 100 Web Technologies" },
      { property: "og:description", content: "Senior engineers, outcome-driven delivery, worldwide." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { k: "250+", v: "Enterprise clients" },
  { k: "40+", v: "Countries served" },
  { k: "1B+", v: "Requests handled monthly" },
  { k: "99.99%", v: "Platform uptime" },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">About us</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Engineering partners for the next decade of software.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">We help ambitious teams design, build and operate modern cloud, AI and product platforms — with senior engineers who own outcomes.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Our story</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Built by engineers, for engineering-led companies.</h2>
            <p className="mt-4 text-muted-foreground">We started 100 Web Technologies to bridge the gap between strategy and shipped software. Today we run a distributed team across the Americas, EMEA and APAC — delivering platforms that scale to millions of users.</p>
            <p className="mt-4 text-muted-foreground">Every engagement is led by architects who have been in the trenches: designing multi-region cloud systems, training and deploying models, and shipping mobile and web products that customers actually love.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.v} className="rounded-xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="text-3xl font-bold text-[var(--brand-navy)]">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">What we value</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: LineChart, t: "Outcomes, not hours", d: "We commit to measurable business outcomes — faster releases, lower cost, higher uptime." },
              { icon: Lock, t: "Security by default", d: "Every architecture starts with least-privilege, encryption and continuous compliance." },
              { icon: Users, t: "Senior engineers", d: "You work directly with architects and lead engineers — no handoffs to junior teams." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <I className="h-6 w-6 text-[var(--brand-orange)]" />
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 md:p-14" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let's build what's next.</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Tell us about your project — a solutions architect will get back within one business day.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-[var(--brand-navy)] hover:brightness-110">
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}