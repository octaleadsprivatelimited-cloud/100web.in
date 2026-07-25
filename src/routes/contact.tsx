import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail, Globe, MapPin } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — 100 Web Technologies" },
      { name: "description", content: "Talk to 100 Web Technologies about your cloud, AI, web or mobile project. A solutions architect replies within one business day." },
      { property: "og:title", content: "Contact — 100 Web Technologies" },
      { property: "og:description", content: "Get in touch with our engineering team." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader />
      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Contact</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Let's build what's next.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">Tell us about your project — a solutions architect will get back within one business day.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <Mail className="h-5 w-5 text-[var(--brand-orange)]" />
              <h3 className="mt-3 font-semibold">Email</h3>
              <a className="mt-1 block text-sm text-muted-foreground hover:text-[var(--brand-orange)]" href="mailto:hello@100web.in">hello@100web.in</a>
            </div>
            <div className="rounded-xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <Globe className="h-5 w-5 text-[var(--brand-orange)]" />
              <h3 className="mt-3 font-semibold">Web</h3>
              <p className="mt-1 text-sm text-muted-foreground">100web.in</p>
            </div>
            <div className="rounded-xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <MapPin className="h-5 w-5 text-[var(--brand-orange)]" />
              <h3 className="mt-3 font-semibold">Headquarters</h3>
              <p className="mt-1 text-sm text-muted-foreground">Hyderabad, India — with teams across Americas, EMEA and APAC.</p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-3 rounded-2xl border bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Full name" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
              <input required type="email" placeholder="Work email" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
            </div>
            <input placeholder="Company" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
            <textarea rows={5} placeholder="How can we help?" className="w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--brand-orange)]" />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] hover:brightness-110 sm:w-auto">
              Contact sales <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}