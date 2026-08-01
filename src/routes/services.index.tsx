import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { listPublicServices, type ManagedService } from "../lib/content.functions";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/services/")({
  loader: () => listPublicServices(),
  head: () => ({
    meta: [
      { title: "Services — 100 Web Technologies" },
      { name: "description", content: "Explore cloud, AI, data, web, mobile, CRM, SEO, marketing and DevOps services from 100 Web Technologies." },
      { property: "og:title", content: "Services — 100 Web Technologies" },
      { property: "og:description", content: "Enterprise engineering services delivered globally." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const services = Route.useLoaderData() as ManagedService[];
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Services</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Everything you need to build, run and grow.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">From cloud infrastructure and AI to web, mobile, CRM and digital marketing — one senior team, end-to-end.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((card) => (
            <Link
              key={card.slug}
              to="/services/$slug"
              params={{ slug: card.slug }}
              className="group block overflow-hidden rounded-xl bg-[#f3f4f8] transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" width={1024} height={576} />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-base font-semibold leading-snug">{card.badge}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)]">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
