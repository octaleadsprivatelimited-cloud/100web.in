import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, ChevronDown, Globe, Smartphone, Users, Building2, Stethoscope, GraduationCap, Car, Utensils, Dumbbell, Scissors, ShoppingCart, Pill, Hotel, Home, BriefcaseBusiness, Phone, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "../lib/services-data";
import { industries } from "../lib/industries-data";
import { MobileNavigationDock } from "./mobile-navigation-dock";
import whatsappLogo from "../assets/whatsapp.svg";
import siteLogo from "../assets/100web-logo.png";

const bySlug = (slug: string) => services.find((s) => s.slug === slug)!;
type GroupItem = ReturnType<typeof bySlug> & { icon?: LucideIcon; blurb?: string };
const withMeta = (slug: string, icon?: LucideIcon, blurb?: string): GroupItem => ({ ...bySlug(slug), icon, blurb });

const serviceGroups: { heading: string; items: GroupItem[]; featuredSlug?: string }[] = [
  {
    heading: "Build & Launch",
    items: [
      withMeta("website-development", Globe, "Fast, responsive marketing sites and web platforms."),
      withMeta("mobile-app-development", Smartphone, "Native and cross-platform iOS & Android apps."),
      withMeta("crm-solutions", Users, "Custom CRM to unify sales, service, and support."),
    ],
    featuredSlug: "website-development",
  },
  {
    heading: "Grow & Reach",
    items: [withMeta("seo"), withMeta("digital-marketing"), withMeta("ai-ml")],
    featuredSlug: "digital-marketing",
  },
  {
    heading: "Scale & Operate",
    items: [withMeta("cloud-infrastructure"), withMeta("cloud-devops"), withMeta("data-engineering")],
  },
];

// Featured industries surfaced in the header mega menu.
const TOP_INDUSTRY_SLUGS = [
  "real-estate",
  "pharmacy",
  "construction-company",
  "fitness-center",
  "school",
  "hotel",
  "e-commerce-seller",
  "travel-agency",
  "tour-operator",
];

const topIndustries = TOP_INDUSTRY_SLUGS.map((slug) => {
  const found = industries.find((i) => i.slug === slug);
  if (!found) throw new Error(`Missing top industry slug: ${slug}`);
  return found;
});

const industryIcons: Record<string, LucideIcon> = {
  "real-estate": Building2,
  "pharmacy": Pill,
  "construction-company": Building2,
  "fitness-center": Dumbbell,
  "school": GraduationCap,
  "hotel": Hotel,
  "e-commerce-seller": ShoppingCart,
  "travel-agency": Car,
  "tour-operator": Car,
};

const primaryNav = [
  { label: "Solutions", to: "/services" as const, hasDropdown: true, dropdown: "services" as const },
  { label: "Industries", to: "/industries" as const, hasDropdown: true, dropdown: "industries" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "Team", to: "/team" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesWrapRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLAnchorElement>(null);
  const industriesWrapRef = useRef<HTMLDivElement>(null);
  const industriesTriggerRef = useRef<HTMLAnchorElement>(null);
  const pageMatch = pathname.match(/^\/(services|industries)\/([^/]+)$/);
  const dockWhatsAppMessage = (() => {
    if (!pageMatch) return "Hello 100 Web Technologies, I would like to discuss my project.";

    const [, pageType, slug] = pageMatch;
    if (pageType === "services") {
      const service = services.find((item) => item.slug === slug);
      const name = service?.badge || slug.replaceAll("-", " ");
      return `Hello 100 Web Technologies, I need ${name.toLowerCase()} for my business. Please share the next steps, timeline and a suitable quote.`;
    }

    const industry = industries.find((item) => item.slug === slug);
    const name = industry?.name || slug.replaceAll("-", " ");
    return `Hello 100 Web Technologies, I need digital growth support for my ${name} business. Please share the best solution and next steps.`;
  })();

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
    setIndustriesOpen(false);
  };
  const openIndustries = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIndustriesOpen(true);
    setServicesOpen(false);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };
  const scheduleCloseIndustries = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIndustriesOpen(false), 120);
  };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  // Keyboard: Escape closes menu; click-outside closes menu
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        servicesTriggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!servicesWrapRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  useEffect(() => {
    if (!industriesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIndustriesOpen(false);
        industriesTriggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!industriesWrapRef.current?.contains(e.target as Node)) setIndustriesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [industriesOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white" role="banner">
      <div className="hidden bg-[#232f3e] text-white lg:block"><div className="mx-auto flex h-10 max-w-7xl items-center justify-end gap-7 px-6 text-xs font-semibold lg:px-8"><span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> English <ChevronDown className="h-3 w-3" /></span><Link to="/contact" className="hover:text-brand-orange">Contact us</Link><Link to="/services" className="hover:text-brand-orange">Services</Link><Link to="/blog" className="hover:text-brand-orange">Resources</Link><Link to="/auth" className="inline-flex items-center gap-1 hover:text-brand-orange">My account <ChevronDown className="h-3 w-3" /></Link></div></div>
      <div data-main-header className="mx-auto flex max-w-7xl items-center justify-between gap-4 bg-white px-4 py-4 text-brand-navy sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="100 Web Technologies — Home">
          <img src={siteLogo} alt="100 Web" className="h-10 w-auto object-contain sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((n) => {
            if (n.dropdown === "services") {
              return (
                <div
                  key={n.label}
                  ref={servicesWrapRef}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <Link
                    ref={servicesTriggerRef}
                    to={n.to}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-navy transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                    activeProps={{ className: "flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy" }}
                    onClick={() => setServicesOpen(false)}
                    onFocus={openServices}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || (e.key === "Enter" && !servicesOpen)) {
                        e.preventDefault();
                        openServices();
                        requestAnimationFrame(() => {
                          servicesWrapRef.current
                            ?.querySelector<HTMLAnchorElement>('[data-mega-item="services"]')
                            ?.focus();
                        });
                      }
                    }}
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    aria-controls="solutions-mega-menu"
                  >
                    {n.label}
                    <ChevronDown className={`h-4 w-4 transition ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </Link>
                  <div
                    id="solutions-mega-menu"
                    role="menu"
                    aria-label="Solutions"
                    aria-hidden={!servicesOpen}
                    className={`fixed left-1/2 top-[4.75rem] z-50 w-[min(960px,calc(100vw-2rem))] max-h-[calc(100vh-5.5rem)] -translate-x-1/2 overflow-x-hidden overflow-y-auto rounded-b-xl border border-slate-200 bg-white text-foreground shadow-[0_20px_50px_rgba(15,23,42,0.2)] transition-all duration-200 ease-out ${servicesOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleCloseServices}
                  >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-3 lg:p-8">
                        {serviceGroups.map((group) => (
                          <div key={group.heading} className="flex flex-col gap-4">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                              {group.heading}
                            </h3>
                            <div className="flex flex-col gap-1">
                              {group.items.map((s) => {
                                const featured = group.featuredSlug === s.slug;
                                const Icon = s.icon;
                                return (
                                  <Link
                                    key={s.slug}
                                    to="/services/$slug"
                                    params={{ slug: s.slug }}
                                    onClick={() => setServicesOpen(false)}
                                    role="menuitem"
                                    data-mega-item="services"
                                    className="group -mx-2 flex items-start gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                                  >
                                    {Icon && (
                                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-orange/10 text-brand-orange transition-colors duration-150 group-hover:bg-brand-orange group-hover:text-white">
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                      </span>
                                    )}
                                    <span className="min-w-0 flex flex-col gap-1">
                                      <span className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">{s.badge}</span>
                                        {featured && <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />}
                                      </span>
                                      <span className="break-words text-[13px] leading-relaxed text-muted-foreground">
                                        {s.blurb ?? s.tagline}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-4 sm:px-8">
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                          <Link to="/industries" onClick={() => setServicesOpen(false)} className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Industries
                          </Link>
                          <Link to="/about" onClick={() => setServicesOpen(false)} className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                            About us
                          </Link>
                          <Link to="/contact" onClick={() => setServicesOpen(false)} className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Talk to sales
                          </Link>
                        </div>
                        <Link
                          to="/services"
                          onClick={() => setServicesOpen(false)}
                          className="group flex items-center gap-1 text-[13px] font-bold text-brand-navy transition-all hover:gap-2"
                        >
                          View all services
                          <span aria-hidden>→</span>
                        </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (n.dropdown === "industries") {
              return (
                <div
                  key={n.label}
                  ref={industriesWrapRef}
                  className="relative"
                  onMouseEnter={openIndustries}
                  onMouseLeave={scheduleCloseIndustries}
                >
                  <Link
                    ref={industriesTriggerRef}
                    to={n.to}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-navy transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                    activeProps={{ className: "flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy" }}
                    onClick={() => setIndustriesOpen(false)}
                    onFocus={openIndustries}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || (e.key === "Enter" && !industriesOpen)) {
                        e.preventDefault();
                        openIndustries();
                        requestAnimationFrame(() => {
                          industriesWrapRef.current
                            ?.querySelector<HTMLAnchorElement>('[data-mega-item="industries"]')
                            ?.focus();
                        });
                      }
                    }}
                    aria-haspopup="menu"
                    aria-expanded={industriesOpen}
                    aria-controls="industries-mega-menu"
                  >
                    {n.label}
                    <ChevronDown className={`h-4 w-4 transition ${industriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </Link>
                  <div
                    id="industries-mega-menu"
                    role="menu"
                    aria-label="Industries"
                    aria-hidden={!industriesOpen}
                    className={`fixed left-1/2 top-[4.75rem] z-50 w-[min(760px,calc(100vw-2rem))] max-h-[calc(100vh-5.5rem)] -translate-x-1/2 overflow-x-hidden overflow-y-auto rounded-b-xl border border-slate-200 bg-white text-foreground shadow-[0_20px_50px_rgba(15,23,42,0.2)] transition-all duration-200 ease-out ${industriesOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
                    onMouseEnter={openIndustries}
                    onMouseLeave={scheduleCloseIndustries}
                  >
                    <div className="p-6 sm:p-7">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Top industries</h3>
                      <div className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {topIndustries.map((ind) => {
                          const Icon = industryIcons[ind.slug] ?? Building2;
                          return (
                            <Link
                              key={ind.slug}
                              to="/industries/$slug"
                              params={{ slug: ind.slug }}
                              onClick={() => setIndustriesOpen(false)}
                              role="menuitem"
                              data-mega-item="industries"
                              className="group -mx-2 flex items-start gap-3 rounded-lg p-3 transition-colors duration-150 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                            >
                              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-orange/10 text-brand-orange transition-colors duration-150 group-hover:bg-brand-orange group-hover:text-white">
                                <Icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span className="min-w-0 flex flex-col gap-1 break-words">
                                <span className="text-sm font-semibold text-foreground">{ind.name}</span>
                                <span className="text-[13px] leading-relaxed text-muted-foreground">{ind.category}</span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-4 sm:px-8">
                      <Link
                        to="/industries"
                        onClick={() => setIndustriesOpen(false)}
                        className="group flex items-center gap-1 text-[13px] font-bold text-brand-navy transition-all hover:gap-2"
                      >
                        View all industries
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={n.label}
                to={n.to}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-navy transition hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50"
                activeProps={{ className: "flex items-center gap-1 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy" }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/55" />
            <input
              type="text"
              placeholder="Search"
              className="h-9 w-48 rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-brand-navy placeholder:text-brand-navy/50 focus:border-brand-orange focus:outline-none lg:w-56"
            />
          </div>
          <Link to="/auth" className="text-sm font-medium text-brand-navy transition hover:text-brand-orange">
            Sign in
          </Link>
          <Link
            to="/contact"
            className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-navy transition hover:brightness-110"
          >
            Get started
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-brand-navy hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu — overlay so it doesn't push page content */}
      <AnimatePresence>
        {open && (
          <motion.div
              key="mobile-menu-backdrop"
              className="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
              key="mobile-menu-panel"
              id="mobile-menu"
              className="absolute inset-x-0 top-full z-[60] flex max-h-[calc(100svh-4.5rem)] flex-col overflow-y-auto border-b border-border bg-white lg:hidden"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="hidden">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-1 px-4 py-4">
            {primaryNav.map((n) => {
              if (n.dropdown === "services") {
                return (
                  <div key={n.label} className="rounded-xl border border-border bg-muted/30">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      aria-expanded={mobileServicesOpen}
                      aria-controls="mobile-solutions-panel"
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      {n.label}
                      <ChevronDown className={`h-4 w-4 transition ${mobileServicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileServicesOpen && (
                        <motion.div
                          id="mobile-solutions-panel"
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
                        {serviceGroups.map((group) => (
                          <div key={group.heading}>
                            <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                              {group.heading}
                            </div>
                            <ul className="space-y-1">
                              {group.items.map((s) => {
                                const Icon = s.icon;
                                return (
                                  <li key={s.slug}>
                                    <Link
                                      to="/services/$slug"
                                      params={{ slug: s.slug }}
                                      onClick={() => { setOpen(false); setMobileServicesOpen(false); }}
                                      className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 hover:bg-background"
                                    >
                                      {Icon ? (
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-orange/10 text-brand-orange">
                                          <Icon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                      ) : (
                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                                      )}
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-xs font-semibold text-foreground">{s.badge}</span>
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                        <Link
                          to="/services"
                          onClick={() => { setOpen(false); setMobileServicesOpen(false); }}
                          className="mt-2 block rounded-lg bg-background px-4 py-2.5 text-center text-sm font-semibold text-foreground"
                        >
                          View all services →
                        </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              if (n.dropdown === "industries") {
                return (
                  <div key={n.label} className="rounded-xl border border-border bg-muted/30">
                    <button
                      type="button"
                      onClick={() => setMobileIndustriesOpen((v) => !v)}
                      aria-expanded={mobileIndustriesOpen}
                      aria-controls="mobile-industries-panel"
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      {n.label}
                      <ChevronDown className={`h-4 w-4 transition ${mobileIndustriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileIndustriesOpen && (
                        <motion.div
                          id="mobile-industries-panel"
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="border-t border-border px-3 pb-3 pt-2">
                        <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Top industries
                        </div>
                        <ul className="space-y-1">
                          {topIndustries.map((ind) => {
                            const Icon = industryIcons[ind.slug] ?? Building2;
                            return (
                              <li key={ind.slug}>
                                <Link
                                  to="/industries/$slug"
                                  params={{ slug: ind.slug }}
                                  onClick={() => { setOpen(false); setMobileIndustriesOpen(false); }}
                                  className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 hover:bg-background"
                                >
                                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-orange/10 text-brand-orange">
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-xs font-semibold text-foreground">{ind.name}</span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <Link
                          to="/industries"
                          onClick={() => { setOpen(false); setMobileIndustriesOpen(false); }}
                          className="mt-2 block rounded-lg bg-background px-4 py-2.5 text-center text-sm font-semibold text-foreground"
                        >
                          View all industries →
                        </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  {n.label}
                </Link>
              );
            })}
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-brand-orange px-4 py-3 text-center text-sm font-semibold text-brand-navy"
              >
                Get started
              </Link>
            </div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
      <MobileNavigationDock
        items={[
          { label: "Home", icon: <Home className="h-5 w-5" />, onClick: () => { setOpen(false); navigate({ to: "/" }); } },
          { label: "Services", icon: <BriefcaseBusiness className="h-5 w-5" />, onClick: () => { setOpen(false); navigate({ to: "/services" }); } },
          { label: "Call +91 77802 73879", icon: <Phone className="h-5 w-5" />, onClick: () => { window.location.href = "tel:+917780273879"; } },
          { label: "WhatsApp", icon: <img src={whatsappLogo} alt="" className="h-5 w-5" />, onClick: () => { setOpen(false); window.open(`https://wa.me/917780273879?text=${encodeURIComponent(dockWhatsAppMessage)}`, "_blank", "noopener,noreferrer"); } },
          { label: open ? "Close menu" : "Open menu", icon: open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />, active: open, onClick: () => setOpen((value) => !value) },
        ]}
      />
      <style>{`[data-main-header] nav a{color:#172033!important}[data-main-header] nav a:hover{background:#f1f5f9!important;color:#172033!important}[data-main-header] input{border-color:#cbd5e1!important;background:#fff!important;color:#172033!important}[data-main-header] input::placeholder{color:#64748b!important}[data-main-header] .lucide-search{color:#172033!important}`}</style>
    </header>
  );
}
