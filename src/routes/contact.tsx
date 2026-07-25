import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — 100 Web Technologies" },
      { name: "description", content: "Contact 100 Web Technologies about your next project." },
      { property: "og:title", content: "Contact — 100 Web Technologies" },
      { property: "og:description", content: "Get in touch with our engineering team." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <section className="bg-[var(--brand-navy)] text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 md:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Contact</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Let&apos;s talk.</h1>
          <p className="mt-4 text-base text-white/75 sm:text-lg">Share your details and our team will get in touch.</p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <form onSubmit={(event) => event.preventDefault()} className="rounded-2xl border bg-card p-6 sm:p-8" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="space-y-5">
            <label className="block text-sm font-medium text-foreground">
              Name
              <input required autoComplete="name" placeholder="Your full name" className="mt-2 w-full rounded-md border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-[var(--brand-orange)]/15" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Email
              <input required type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-md border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-[var(--brand-orange)]/15" />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Mobile number
              <input required type="tel" autoComplete="tel" inputMode="tel" placeholder="Your mobile number" className="mt-2 w-full rounded-md border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-[var(--brand-orange)]/15" />
            </label>
          </div>
          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--brand-orange)] px-5 py-3 text-sm font-semibold text-[var(--brand-navy)] hover:brightness-110">
            Submit details <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>

      <SiteFooter />
    </div>
  );
}
