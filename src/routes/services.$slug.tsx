import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, ArrowLeft, Download, AlertTriangle, CalendarCheck, ShieldCheck, Smartphone, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Service } from "../lib/services-data";
import { getPublicService, listPublicServices, listWebsitePortfolio, type ManagedService, type WebsitePortfolioItem } from "../lib/content.functions";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { FaqAccordion } from "../components/faq-accordion";
import { downloadServicePdf } from "../lib/service-pdf";
import { submitWebsiteLead } from "../lib/crm.functions";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const [service, services, portfolio] = await Promise.all([
      getPublicService({ data: { slug: params.slug } }),
      listPublicServices(),
      listWebsitePortfolio(),
    ]);
    if (!service) throw notFound();
    return { service, services, portfolio };
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
      links: [{ rel: "canonical", href: `/services/${service.slug}` }],
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

const serviceBackgrounds = {
  rocket: "/images/service-backgrounds/rocket.webp",
  purple: "/images/service-backgrounds/aurora-purple.webp",
  blue: "/images/service-backgrounds/aurora-blue.webp",
  pink: "/images/service-backgrounds/aurora-pink.webp",
  coral: "/images/service-backgrounds/aurora-coral.webp",
  light: "/images/service-backgrounds/aurora-light.webp",
};

function SectionBackground({ src: _src, overlay = "dark" }: { src: string; overlay?: "dark" | "light" }) {
  return (
    <div
      aria-hidden="true"
      className={overlay === "dark" ? "pointer-events-none absolute inset-0 bg-[var(--brand-navy)]" : "pointer-events-none absolute inset-0 bg-slate-50"}
    />
  );
}

function PanelBackground({ src, overlay = "dark" }: { src: string; overlay?: "dark" | "light" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
      <div className={overlay === "dark" ? "absolute inset-0 bg-[linear-gradient(115deg,rgba(3,14,31,0.94),rgba(5,19,43,0.78))]" : "absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))]"} />
    </div>
  );
}

function ServiceDetail() {
  const { service, services, portfolio } = Route.useLoaderData() as { service: ManagedService; services: ManagedService[]; portfolio: WebsitePortfolioItem[] };
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const isMobileAppService = service.slug === "mobile-app-development";
  // The dedicated Website Development reference layout has been retired; all services share the established service-page design.
  const isReferenceStyle = false;
  const submitLead = useServerFn(submitWebsiteLead);
  const [leadSent, setLeadSent] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ fullName: "", email: "", company: "", phone: "", message: `I'd like to discuss ${service.badge}.` });

  async function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingLead(true);
    try {
      await submitLead({ data: { ...leadForm, page: `/services/${service.slug}` } });
      setLeadSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send your details. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />

      {isReferenceStyle ? <WebsiteDevelopmentHero service={service} /> : <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-[#b9caf9] bg-[url('/images/service-backgrounds/aurora-light.webp')] bg-cover bg-center py-8 text-[var(--brand-navy)] sm:py-12">
        {isReferenceStyle && <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[52%] bg-[url('/images/service-backgrounds/aurora-light.webp')] bg-cover bg-center" />}
        <div className="relative mx-auto grid max-w-7xl items-center gap-7 px-4 py-3 sm:gap-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="min-w-0 rounded-xl bg-[#f4f2fa]/95 p-6 shadow-[0_30px_60px_-20px_rgba(10,31,68,0.35)] ring-1 ring-white/60 sm:p-10">
            {isReferenceStyle && (
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                <Link to="/" className="hover:text-[#067ebd]">Home</Link><span className="text-slate-400">›</span><Link to="/services" className="hover:text-[#067ebd]">Services</Link><span className="text-slate-400">›</span><span>Website development</span>
              </div>
            )}
            <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-xs ${isReferenceStyle ? "bg-slate-100 text-slate-600" : "bg-[var(--brand-orange)] text-[var(--brand-navy)]"}`}>
              {service.badge}
            </span>
            <h1 className="mt-4 max-w-2xl text-[2.25rem] font-bold leading-[1.04] tracking-tight text-[#0A1F44] sm:mt-5 sm:text-5xl">
              {isReferenceStyle ? "Build a website that turns attention into real business." : isMobileAppService ? "Turn your app idea into a product people use." : service.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#0A1F44]/75 sm:mt-5 sm:text-lg">
              {isReferenceStyle
                ? "We design, build and optimise fast, secure websites that make your brand credible, guide visitors clearly and create more enquiries for your business."
                : isMobileAppService
                ? "From your first concept to a confident launch, our product team designs and builds fast, reliable iOS and Android apps that are ready for real customers."
                : service.tagline}
            </p>
            <div className={`mt-6 grid gap-2.5 min-[380px]:grid-cols-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3`}>
              {isReferenceStyle ? <Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#067ebd] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#056a9f] sm:px-7 sm:py-3.5">Talk to a web expert <ArrowRight className="h-4 w-4" /></Link> : <a href="#contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:brightness-110 sm:px-7 sm:py-3.5">
                {isReferenceStyle ? "Talk to a web expert" : isMobileAppService ? "Plan my app" : "Talk to an expert"} <ArrowRight className="h-4 w-4" />
              </a>}
              <button
                type="button"
                onClick={() => service.pdf_url ? window.open(service.pdf_url, "_blank", "noopener,noreferrer") : downloadServicePdf(service as Service)}
                className={`min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition sm:px-7 sm:py-3.5 ${isReferenceStyle ? "hidden" : "inline-flex border border-slate-300 bg-white/70 text-[var(--brand-navy)] hover:bg-white"}`}
              >
                <Download className="h-4 w-4" /> {isMobileAppService ? "Get service guide" : "Download PDF"}
              </button>
            </div>
            {isMobileAppService ? (
              <div className="mt-6 grid max-w-xl grid-cols-3 gap-2 border-t border-slate-300 pt-5 sm:mt-8 sm:gap-4">
                <div className="min-w-0">
                  <Smartphone className="h-4 w-4 text-[var(--brand-orange)]" />
                  <p className="mt-2 text-xs font-semibold text-[#0A1F44] sm:text-sm">iOS + Android</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">One product experience</p>
                </div>
                <div className="min-w-0 border-l border-slate-300 pl-3 sm:pl-4">
                  <CalendarCheck className="h-4 w-4 text-[var(--brand-orange)]" />
                  <p className="mt-2 text-xs font-semibold text-[#0A1F44] sm:text-sm">Clear delivery plan</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">Milestones you can follow</p>
                </div>
                <div className="min-w-0 border-l border-slate-300 pl-3 sm:pl-4">
                  <ShieldCheck className="h-4 w-4 text-[var(--brand-orange)]" />
                  <p className="mt-2 text-xs font-semibold text-[#0A1F44] sm:text-sm">Built to scale</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">Secure, maintainable code</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-white/60 bg-white shadow-[0_24px_60px_rgba(10,31,68,0.22)]">
              <img src={service.image} alt={`${service.badge} services by 100 Web Technologies`} className="h-full w-full object-cover" width={1024} height={576} />
            </div>
            {isMobileAppService ? (
              <div className="relative mx-3 -mt-5 rounded-xl border border-white/20 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md sm:absolute sm:-bottom-7 sm:-left-7 sm:mx-0 sm:w-[min(100%,19rem)] sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">Your next step</p>
                <p className="mt-2 text-sm font-semibold leading-snug text-white">Share your idea. We’ll return with a practical build path.</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/65">No jargon — just scope, timeline and the best route to launch.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      </>}

      {isReferenceStyle ? <WebsiteDevelopmentFlow service={service} portfolio={portfolio} /> : <>
      {/* Overview */}
      <section className="relative isolate overflow-hidden py-6 sm:py-8 md:py-10">
        <SectionBackground src={serviceBackgrounds.light} overlay="light" />
        <div className="relative isolate mx-4 grid max-w-7xl gap-6 overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-white/60 bg-white/35 px-5 py-8 shadow-[0_20px_70px_rgba(16,24,40,0.08)] backdrop-blur-sm sm:mx-auto sm:my-4 sm:gap-10 sm:px-10 sm:py-12 md:grid-cols-3 lg:px-14">
          <PanelBackground src={serviceBackgrounds.light} overlay="light" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Overview</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Why it matters</h2>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-[1.25rem_3rem_1.25rem_3rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(16,24,40,0.08)] backdrop-blur-sm sm:p-7">
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
        </div>
      </section>

      {/* Stats */}
      {service.stats?.length ? (
        <section className="relative py-6 sm:py-8">
          <div className="relative isolate mx-4 grid max-w-7xl grid-cols-2 gap-x-5 gap-y-7 overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-white/15 bg-[var(--brand-navy)] px-5 py-9 text-white shadow-[0_20px_70px_rgba(0,0,0,0.2)] sm:mx-auto sm:gap-8 sm:px-10 sm:py-12 lg:grid-cols-4 lg:px-14">
            <PanelBackground src={serviceBackgrounds.blue} />
            {service.stats.map((s) => (
              <div key={s.label} className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0 sm:pl-6">
                <div className="text-3xl font-bold text-[var(--brand-orange)] sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Benefits */}
      <section className="relative py-6 sm:py-8 md:py-10">
        <div className="relative isolate mx-4 max-w-7xl overflow-hidden rounded-[1.5rem_3rem_1.5rem_3rem] border border-white/15 bg-[var(--brand-navy)] px-4 py-5 text-white shadow-[0_20px_70px_rgba(0,0,0,0.2)] sm:mx-auto sm:rounded-[2rem_5rem_2rem_5rem] sm:px-8 sm:py-12 lg:px-12">
          <PanelBackground src={serviceBackgrounds.purple} />
          <div className="hidden max-w-2xl md:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-300 sm:text-sm">Key benefits</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:mt-2 sm:text-4xl">What you get</h2>
          </div>
          <div className="md:hidden rounded-[1.25rem_2.75rem_1.25rem_2.75rem] bg-white p-3.5 text-[var(--brand-navy)] shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-orange)]">Key benefits</p>
                <h2 className="mt-0.5 text-lg font-bold tracking-tight">What you get</h2>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-[var(--brand-orange)]"><Check className="h-4 w-4" /></span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {service.benefits.map((b) => (
                <div key={b.title} className="flex min-h-[4.5rem] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 shadow-sm">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[var(--brand-navy)] text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <h3 className="text-[11px] font-semibold leading-snug text-[var(--brand-navy)]">{b.title}</h3>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b) => (
              <div key={b.title} className="rounded-[1.25rem_2.5rem_1.25rem_2.5rem] border border-white/15 bg-white/10 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-md">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-400/15 text-orange-300">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      {service.challenges?.length ? (
        <section className="relative isolate overflow-hidden py-6 sm:py-8 md:py-10">
          <SectionBackground src={serviceBackgrounds.light} overlay="light" />
          <div className="relative isolate mx-4 max-w-7xl overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_20px_70px_rgba(16,24,40,0.08)] sm:mx-auto sm:px-8 sm:py-12 lg:px-12">
            <PanelBackground src={serviceBackgrounds.light} overlay="light" />
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Challenges we solve</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Sound familiar?</h2>
          </div>
          <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-5 sm:grid-cols-2">
            {service.challenges.map((c) => (
              <div key={c.title} className="rounded-[1.25rem_2.5rem_1.25rem_2.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(16,24,40,0.08)] backdrop-blur-sm sm:p-6">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-red-500/10 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
          </div>
        </section>
      ) : null}

      {/* Process */}
      {service.process?.length ? (
        <section className="relative py-6 sm:py-8 md:py-10">
          <div className="relative isolate mx-4 max-w-7xl overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-white/15 bg-[var(--brand-navy)] px-5 py-8 text-white shadow-[0_20px_70px_rgba(0,0,0,0.2)] sm:mx-auto sm:px-8 sm:py-12 lg:px-12">
            <PanelBackground src={serviceBackgrounds.pink} />
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">Our process</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">How we deliver</h2>
            </div>
            <div className="mt-7 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.process.map((p) => (
                <div key={p.step} className="relative rounded-[1.25rem_2.5rem_1.25rem_2.5rem] border border-white/15 bg-slate-950/25 p-5 backdrop-blur-md sm:p-6">
                  <div className="text-sm font-bold text-orange-300">{p.step}</div>
                  <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Offerings */}
      <section className="relative isolate overflow-hidden py-6 sm:py-8 md:py-10">
        <SectionBackground src={serviceBackgrounds.coral} overlay="light" />
        <div className="relative isolate mx-4 max-w-7xl overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_20px_70px_rgba(16,24,40,0.08)] sm:mx-auto sm:px-8 sm:py-12 lg:px-12">
          <PanelBackground src={serviceBackgrounds.coral} overlay="light" />
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
              <li key={o} className="flex items-start gap-3 rounded-xl border border-white/75 bg-white/80 px-4 py-4 text-sm font-medium shadow-sm backdrop-blur-sm">
                <Check className="mt-0.5 h-4 w-4 text-[var(--brand-orange)]" /> {o}
              </li>
            ))}
          </ul>
        </div>
        {service.techStack?.length ? (
          <div className="mt-10 rounded-2xl border border-white/75 bg-white/80 p-5 shadow-[0_18px_45px_rgba(16,24,40,0.08)] backdrop-blur-sm sm:mt-14 sm:p-8">
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
        </div>
      </section>

      {/* FAQ */}
      {service.faqs?.length ? (
        <section className="relative py-6 sm:py-8 md:py-10">
          <div className="relative isolate mx-4 max-w-4xl overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-white/15 bg-[var(--brand-navy)] px-5 py-8 text-white shadow-[0_20px_70px_rgba(0,0,0,0.2)] sm:mx-auto sm:px-8 sm:py-12 lg:px-12">
            <PanelBackground src={serviceBackgrounds.purple} />
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Questions we hear a lot</h2>
            </div>
            <div className="mt-8">
              <FaqAccordion items={service.faqs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Related */}
      <section className="relative hidden py-6 sm:py-8 md:block md:py-10">
        <div className="relative isolate mx-4 max-w-7xl overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-white/15 bg-[var(--brand-navy)] px-5 py-8 text-white shadow-[0_20px_70px_rgba(0,0,0,0.2)] sm:mx-auto sm:px-8 sm:py-12 lg:px-12">
          <PanelBackground src={serviceBackgrounds.blue} />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore other services</h2>
          <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/services/$slug"
                params={{ slug: r.slug }}
                className="group block overflow-hidden rounded-2xl border border-white/15 bg-white/10 transition hover:-translate-y-1 hover:bg-white/15 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <span className="absolute left-4 top-4 z-10 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-[var(--brand-navy)] shadow-sm">
                    {r.badge}
                  </span>
                  <img src={r.image} alt={`${r.badge} services by 100 Web Technologies`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" width={1024} height={576} />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{r.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 group-hover:text-white">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative py-6 sm:py-10">
        <div className="relative mx-4 max-w-7xl sm:mx-auto">
        <div className="relative isolate overflow-hidden rounded-[2rem_5rem_2rem_5rem] border border-white/15 bg-[var(--brand-navy)] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8 md:p-14">
          <PanelBackground src={serviceBackgrounds.rocket} />
          <div className="relative z-10 grid gap-7 sm:gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Ready to start with {service.badge}?</h2>
              <p className="mt-4 text-white/70">Tell us about your project — a solutions architect will get back within one business day.</p>
              <div className="mt-6 space-y-2 text-sm">
                <div><span className="text-white/60">Email:</span> <a className="font-medium text-white hover:text-orange-300" href="mailto:hello@100web.in">hello@100web.in</a></div>
                <div><span className="text-white/60">Web:</span> <span className="font-medium">100web.in</span></div>
              </div>
            </div>
            <form onSubmit={handleLeadSubmit} className="rounded-[1.25rem_2.5rem_1.25rem_2.5rem] border border-white/20 bg-slate-950/65 p-4 shadow-xl backdrop-blur-md sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-medium text-white/85">
                  <span className="sr-only">Full name</span>
                  <input value={leadForm.fullName} onChange={(event) => setLeadForm({ ...leadForm, fullName: event.target.value })} placeholder="Your name" className="mt-1.5 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-slate-500 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-orange-300/40" />
                </label>
                <label className="block text-xs font-medium text-white/85">
                  <span className="sr-only">Work email</span>
                  <input type="email" value={leadForm.email} onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })} placeholder="you@company.com" className="mt-1.5 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-slate-500 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-orange-300/40" />
                </label>
              </div>
              <label className="block text-xs font-medium text-white/85">
                <span className="sr-only">Company</span>
                <input value={leadForm.company} onChange={(event) => setLeadForm({ ...leadForm, company: event.target.value })} placeholder="Company name" className="mt-1.5 w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-slate-500 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-orange-300/40" />
              </label>
              <label className="block text-xs font-medium text-white">
                <span className="sr-only">Mobile number</span>
                <div className="mt-1.5 flex overflow-hidden rounded-xl border border-white/20 bg-white focus-within:border-[var(--brand-orange)] focus-within:ring-2 focus-within:ring-orange-300/40">
                  <span className="flex items-center border-r border-slate-200 bg-slate-100 px-3 text-sm font-semibold text-[var(--brand-navy)]">+91</span>
                  <input required type="tel" inputMode="numeric" autoComplete="tel-national" value={leadForm.phone} onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} pattern="[6-9][0-9]{9}" minLength={10} maxLength={10} placeholder="10-digit mobile number" className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-slate-500" />
                </div>
              </label>
              <label className="block text-xs font-medium text-white/85">
                <span className="sr-only">Tell us about your project</span>
                <textarea rows={4} value={leadForm.message} onChange={(event) => setLeadForm({ ...leadForm, message: event.target.value })} className="mt-1.5 w-full resize-y rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-slate-500 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-orange-300/40" />
              </label>
              {leadSent ? <p className="rounded-xl bg-emerald-400/15 px-4 py-3 text-sm font-medium text-emerald-100">Thanks — your details have been sent to our team.</p> : <button disabled={submittingLead} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
                {submittingLead ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Contact sales
              </button>
              }
            </form>
          </div>
        </div>
        </div>
      </section>
      </>}

      <SiteFooter />
    </div>
  );
}

function WebsiteDevelopmentHero({ service }: { service: ManagedService }) {
  const videoId = youtubeId(service.hero_video_url);
  return (
    <section className="relative isolate overflow-hidden bg-[#020407] text-white">
      <div className="absolute inset-0 bg-black">
        {videoId ? <iframe className="absolute inset-0 h-full w-full scale-[1.4] opacity-45" src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0`} title="100 Web Technologies website development showreel" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" /> : <img src={service.image} alt="" className="ml-auto h-full w-full max-w-5xl object-cover object-center opacity-55" />}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.91)_38%,rgba(0,0,0,0.35)_75%,rgba(0,0,0,0.58)_100%)]" />
      <div className="relative mx-auto flex min-h-[575px] max-w-7xl flex-col px-5 pb-0 pt-12 sm:min-h-[610px] sm:px-8 sm:pt-16 lg:px-12">
        <div className="max-w-xl"><p className="text-[11px] font-bold uppercase tracking-[0.26em] text-sky-300">100 Web Technologies · Website Development</p><h1 className="mt-5 text-5xl font-bold leading-[0.94] tracking-tight sm:text-7xl">A website built to win your next customer.</h1><p className="mt-7 max-w-md text-base leading-7 text-white/85 sm:text-lg">We turn your brand, services and proof into a fast digital experience that earns trust, creates enquiries and helps your business grow.</p><div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Now taking new projects</div><div className="mt-8 flex flex-wrap gap-3"><Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#f15048] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#dd4038]">Get a website proposal <ArrowRight className="h-4 w-4" /></Link><a href="#portfolio" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">View our work</a></div></div>
        <div className="mt-auto grid border-t border-white/20 sm:grid-cols-3"><Link to="/contact" className="group flex min-h-24 flex-col justify-center border-b border-white/20 py-5 sm:border-b-0 sm:pr-6"><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">Start a project</span><span className="mt-2 flex items-center gap-2 text-lg font-bold">Book a discovery call <ArrowRight className="h-4 w-4 text-[#f15048] transition group-hover:translate-x-1" /></span></Link><a href="#portfolio" className="group flex min-h-24 flex-col justify-center border-b border-white/20 py-5 sm:border-b-0 sm:border-l sm:px-6"><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">Explore</span><span className="mt-2 flex items-center gap-2 text-lg font-bold">Selected websites <ArrowRight className="h-4 w-4 text-[#f15048] transition group-hover:translate-x-1" /></span></a><Link to="/services" className="group flex min-h-24 flex-col justify-center py-5 sm:border-l sm:pl-6"><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">More services</span><span className="mt-2 flex items-center gap-2 text-lg font-bold">Grow your digital stack <ArrowRight className="h-4 w-4 text-[#f15048] transition group-hover:translate-x-1" /></span></Link></div>
      </div>
    </section>
  );
}

function youtubeId(url?: string | null) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return match?.[1] && /^[A-Za-z0-9_-]{6,}$/.test(match[1]) ? match[1] : null;
}

function WebsiteDevelopmentFlow({ service, portfolio }: { service: ManagedService; portfolio: WebsitePortfolioItem[] }) {
  const [active, setActive] = useState(0);
  const features = [
    { label: "Conversion-led design", title: "Make every visit easier to understand and act on", text: "We turn your positioning, services and proof into a clear journey that helps the right customer take the next step.", items: service.benefits.slice(0, 3) },
    { label: "Performance foundation", title: "Build for speed, search visibility and long-term growth", text: "Every website is planned around fast loading, responsive layouts, structured content and a technical foundation your team can rely on.", items: service.deliverables?.slice(0, 3).map((title) => ({ title, desc: "Delivered as part of your website project." })) || [] },
    { label: "Launch support", title: "Move from a finished website to measurable progress", text: "We support a focused launch with clear handover, analytics-ready pages and a practical roadmap for the next improvements.", items: service.process?.slice(0, 3).map((step) => ({ title: step.title, desc: step.desc })) || [] },
  ];
  const feature = features[active];
  return <>
    <section className="border-y border-slate-100 bg-white py-7 sm:py-9">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Built for ambitious businesses across Andhra Pradesh, Telangana and beyond</p>
    </section>
    <section className="bg-[#f7f8f6] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.12em] text-[#067ebd]">Website development</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-[#171717] sm:text-5xl">A better website experience for your customers and your team.</h2><p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">From first impression to lead capture, we create a website system that feels polished, works quickly and gives your business a stronger digital home.</p></div>
        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(22,28,45,0.08)]">
          <div className="flex overflow-x-auto border-b border-slate-200 px-3 sm:justify-center"><div className="flex min-w-max gap-1 py-3">{features.map((item, index) => <button key={item.label} onClick={() => setActive(index)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active === index ? "bg-[#067ebd] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item.label}</button>)}</div></div>
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div><p className="text-sm font-bold text-[#067ebd]">{String(active + 1).padStart(2, "0")}</p><h3 className="mt-3 text-2xl font-bold leading-tight text-[#171717] sm:text-3xl">{feature.title}</h3><p className="mt-4 leading-7 text-slate-600">{feature.text}</p><ul className="mt-6 space-y-3">{feature.items.map((item: any) => <li key={item.title} className="flex gap-3 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#067ebd]" /><span><strong>{item.title}</strong>{item.desc ? ` — ${item.desc}` : ""}</span></li>)}</ul></div>
            <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50"><img src={service.image} alt="Website development interface by 100 Web Technologies" className="aspect-[16/10] h-full w-full object-cover" /></div>
          </div>
        </div>
      </div>
    </section>
    <section id="portfolio" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.12em] text-[#067ebd]">Selected work</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">Websites designed to do more than look good.</h2></div><Link to="/contact" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#067ebd] hover:text-[#056a9f]">Start a similar project <ArrowRight className="h-4 w-4" /></Link></div>
        {portfolio.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{portfolio.map((project) => <article key={project.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="aspect-[16/10] overflow-hidden bg-slate-100"><img src={project.image_url} alt={project.alt_text} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" /></div><div className="p-5"><h3 className="text-lg font-bold text-[#171717]">{project.title}</h3>{project.caption && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{project.caption}</p>}{project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#067ebd] hover:text-[#056a9f]">View website <ArrowRight className="h-3.5 w-3.5" /></a>}</div></article>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center"><p className="font-semibold text-slate-800">New client websites will appear here.</p><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Our team is preparing selected website launches and case studies. Tell us what you want to achieve and we’ll show you the most relevant examples.</p><Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#067ebd] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#056a9f]">See relevant work <ArrowRight className="h-4 w-4" /></Link></div>}
      </div>
    </section>
    <section className="bg-white py-14 sm:py-20"><div className="mx-auto max-w-6xl px-4 sm:px-6"><div className="rounded-[1.75rem] bg-[#0a1f44] px-6 py-10 text-center text-white shadow-[0_22px_60px_rgba(10,31,68,0.25)] sm:px-12 sm:py-14"><p className="text-sm font-bold uppercase tracking-[0.14em] text-cyan-200">Ready when you are</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Let’s build the website your next customers expect.</h2><p className="mx-auto mt-5 max-w-2xl text-white/70">Share your goal and our web team will outline the right approach, scope and next step.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#18a9de] px-6 py-3 text-sm font-bold text-white hover:bg-[#0c95c7]">Talk to a web expert <ArrowRight className="h-4 w-4" /></Link></div></div></section>
  </>;
}
