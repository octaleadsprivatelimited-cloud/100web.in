import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { industryCategories } from "../lib/industries-data";
import { listPublicIndustries, type ManagedIndustry } from "../lib/content.functions";

export const Route = createFileRoute("/industries/")({
  loader: () => listPublicIndustries(),
  head: () => ({
    meta: [
      { title: "Industries — 100 Web Technologies" },
      { name: "description", content: "Solutions tailored to financial services, healthcare, retail, manufacturing, education, media, logistics and government." },
      { property: "og:title", content: "Industries — 100 Web Technologies" },
      { property: "og:description", content: "Deep domain expertise across regulated and high-scale sectors." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  const industries = Route.useLoaderData() as ManagedIndustry[];
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Industries</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Websites &amp; digital growth for 250+ industries.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">Pick your industry — every page has a tailored solution, real results, and a free proposal built for your business.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="space-y-12">
          {industryCategories.map((cat) => {
            const items = industries.filter((i) => i.category === cat);
            return (
              <div key={cat}>
                <div className="flex items-end justify-between gap-4 border-b pb-3">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{cat}</h2>
                  <span className="text-xs text-muted-foreground">{items.length} industries</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((i) => (
                    <Link
                      key={i.slug}
                      to="/industries/$slug"
                      params={{ slug: i.slug }}
                      className="group flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm font-medium transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)]"
                    >
                      <span className="truncate">{i.name}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-[var(--brand-navy)] p-8 text-white">
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">Don't see your industry?</h3>
            <p className="mt-1 text-sm text-white/70">We work with every kind of business. Tell us what you do.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 py-3 text-sm font-semibold text-[var(--brand-navy)] hover:brightness-110">
            Talk to an expert <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
