import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ArrowLeft, Download, AlertTriangle } from "lucide-react";
import type { Service } from "../lib/services-data";
import { getPublicService, listPublicServices, type ManagedService } from "../lib/content.functions";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { FaqAccordion } from "../components/faq-accordion";
import { downloadServicePdf } from "../lib/service-pdf";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const [service, services] = await Promise.all([
      getPublicService({ data: { slug: params.slug } }),
      listPublicServices(),
    ]);
    if (!service) throw notFound();
    return { service, services };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found — 100 Web Technologies" }, { name: "robots", content: "noindex" }] };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.badge} — 100 Web Technologies` },
        { name: "description", content: service.desc },
        { property: "og:title", content: `${service.badge} — 100 Web Technologies` },
        { property: "og:description", content: service.desc },
        { property: "og:type", content: "website" },
        { property: "og:image", content: service.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: service.image },
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-foreground">Service not found</h1>
        <p className="mt-3 text-muted-foreground">The service you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)]">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  );
}

function ServiceDetail() {
  const { service, services } = Route.useLoaderData() as { service: ManagedService; services: ManagedService[] };
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b bg-[var(--brand-navy)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16 md:grid-cols-2 md:py-20 lg:px-8">
          <div className="min-w-0">
            <span className="inline-block rounded-md bg-[var(--brand-orange)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-navy)] sm:text-xs">
              {service.badge}
            </span>
            <h1 className="mt-4 text-[2rem] font-bold leading-[1.08] tracking-tight sm:mt-5 sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:mt-5 sm:text-lg">{service.tagline}</p>
            <div className="mt-6 grid gap-2.5 min-[380px]:grid-cols-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
              <a href="#contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:brightness-110 sm:px-7 sm:py-3.5">
                Talk to an expert <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => service.pdf_url ? window.open(service.pdf_url, "_blank", "noopener,noreferrer") : downloadServicePdf(service as Service)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-7 sm:py-3.5"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl">
            <img src={service.image} alt={service.title} className="h-full w-full object-cover" width={1024} height={576} />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="grid gap-6 sm:gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Overview</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Why it matters</h2>
          </div>
          <div className="md:col-span-2">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{service.overview}</p>
            {service.idealFor?.length ? (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-navy)]/60">Ideal for</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.idealFor.map((i) => (
                    <span key={i} className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)]">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Stats */}
      {service.stats?.length ? (
        <section className="border-y bg-[var(--brand-navy)] text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-7 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-4 lg:px-8">
            {service.stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-[var(--brand-orange)] sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Benefits */}
      <section className="bg-muted/40 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Key benefits</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">What you get</h2>
          </div>
          <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b) => (
              <div key={b.title} className="rounded-xl border bg-card p-5 sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      {service.challenges?.length ? (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Challenges we solve</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Sound familiar?</h2>
          </div>
          <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-5 sm:grid-cols-2">
            {service.challenges.map((c) => (
              <div key={c.title} className="rounded-xl border bg-card p-5 sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-red-500/10 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Process */}
      {service.process?.length ? (
        <section className="bg-muted/40 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Our process</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">How we deliver</h2>
            </div>
            <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((p) => (
                <div key={p.step} className="relative rounded-xl border bg-card p-5 sm:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="text-sm font-bold text-[var(--brand-orange)]">{p.step}</div>
                  <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Offerings */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="grid gap-7 sm:gap-10 md:grid-cols-2 md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">What we deliver</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Our {service.badge} services</h2>
            <p className="mt-4 text-muted-foreground">
              End-to-end delivery from strategy and architecture to build, launch and ongoing support — by senior engineers who own outcomes.
            </p>
            {service.deliverables?.length ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-navy)]/60">You'll receive</p>
                <ul className="mt-3 space-y-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-orange)]" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <ul className="space-y-3">
            {service.offerings.map((o) => (
              <li key={o} className="flex items-start gap-3 rounded-lg border bg-card px-4 py-4 text-sm font-medium">
                <Check className="mt-0.5 h-4 w-4 text-[var(--brand-orange)]" /> {o}
              </li>
            ))}
          </ul>
        </div>
        {service.techStack?.length ? (
          <div className="mt-10 rounded-xl border bg-card p-5 sm:mt-14 sm:rounded-2xl sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-navy)]/60">Technology stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.techStack.map((t) => (
                <span key={t} className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* FAQ */}
      {service.faqs?.length ? (
        <section className="bg-gradient-to-b from-[var(--brand-orange)]/10 via-white to-white py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Questions we hear a lot</h2>
            </div>
            <div className="mt-8">
              <FaqAccordion items={service.faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Related */}
      <section className="bg-muted/40 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore other services</h2>
          <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/services/$slug"
                params={{ slug: r.slug }}
                className="group block overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <span className="absolute left-4 top-4 z-10 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-[var(--brand-navy)] shadow-sm">
                    {r.badge}
                  </span>
                  <img src={r.image} alt={r.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" width={1024} height={576} />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)]">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-xl border bg-card p-5 sm:rounded-2xl sm:p-8 md:p-14" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="grid gap-7 sm:gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Ready to start with {service.badge}?</h2>
              <p className="mt-4 text-muted-foreground">Tell us about your project — a solutions architect will get back within one business day.</p>
              <div className="mt-6 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <a className="font-medium hover:text-[var(--brand-orange)]" href="mailto:hello@100web.in">hello@100web.in</a></div>
                <div><span className="text-muted-foreground">Web:</span> <span className="font-medium">100web.in</span></div>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Full name" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
                <input required type="email" placeholder="Work email" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
              </div>
              <input placeholder="Company" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
              <textarea rows={4} defaultValue={`I'd like to discuss ${service.badge}.`} className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:brightness-110 sm:w-auto">
                Contact sales <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
