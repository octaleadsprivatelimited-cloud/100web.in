import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LineChart, Globe2, Lock, Users, ArrowRight, Check,
} from "lucide-react";
import { services } from "../lib/services-data";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { FaqAccordion } from "../components/faq-accordion";
import awsLogo from "../assets/partners/aws.svg";
import azureLogo from "../assets/partners/azure.svg";
import googleCloudLogo from "../assets/partners/google-cloud.svg";
import kubernetesLogo from "../assets/partners/kubernetes.svg";
import snowflakeLogo from "../assets/partners/snowflake.svg";
import openaiLogo from "../assets/partners/openai.svg";
import postgresqlLogo from "../assets/partners/postgresql.svg";
import mongodbLogo from "../assets/partners/mongodb.svg";
import laravelLogo from "../assets/partners/laravel.svg";
import shopifyLogo from "../assets/partners/shopify.svg";
import wordpressLogo from "../assets/partners/wordpress.svg";
import reactLogo from "../assets/partners/react.svg";
import nodejsLogo from "../assets/partners/nodejs.svg";
import tanstackLogo from "../assets/partners/tanstack.svg";
import viteLogo from "../assets/partners/vite.svg";
import pythonLogo from "../assets/partners/python.svg";
import javascriptLogo from "../assets/partners/javascript.svg";
import cplusplusLogo from "../assets/partners/cplusplus.svg";
import sqlLogo from "../assets/partners/sql.svg";
import javaLogo from "../assets/partners/java.svg";
import geminiLogo from "../assets/partners/gemini.svg";
import claudeLogo from "../assets/partners/claude.svg";
import vercelLogo from "../assets/partners/vercel.svg";
import andhraTelanganaMap from "../assets/andhra-telangana-map.png";
import industryHighlights from "../assets/industry-highlights.png";
import websiteDevelopmentCard from "../assets/website-development-card.png";
import mobileAppGradientCard from "../assets/mobile-app-gradient-card.png";
import digitalMarketingGradientCard from "../assets/digital-marketing-gradient-card.png";
import seoGradientCard from "../assets/seo-gradient-card.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Web Development, Apps, SEO & Digital Marketing in Andhra Pradesh & Telangana | 100 Web Technologies" },
      { name: "description", content: "100 Web Technologies provides website development, mobile app development, SEO and digital marketing for businesses across Andhra Pradesh and Telangana, including Hyderabad, Vijayawada, Visakhapatnam and Tirupati." },
      { name: "keywords", content: "web development Andhra Pradesh, website development Telangana, mobile app development Hyderabad, SEO services Andhra Pradesh, digital marketing Telangana, web development Vijayawada, app development Visakhapatnam" },
      { property: "og:title", content: "Web Development, Apps, SEO & Digital Marketing in Andhra Pradesh & Telangana" },
      { property: "og:description", content: "Website, app, SEO and digital marketing services for growth-focused businesses across Andhra Pradesh and Telangana." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const industries = [
  { name: "Financial Services", slug: "bank" },
  { name: "Healthcare", slug: "hospital" },
  { name: "Retail & E-commerce", slug: "e-commerce-seller" },
  { name: "Manufacturing", slug: "manufacturing-unit" },
  { name: "Education", slug: "school" },
  { name: "Media & Entertainment", slug: "media-house" },
  { name: "Logistics", slug: "logistics-company" },
  { name: "Community & Public Sector", slug: "ngo" },
];

const industryImagePositions = ["0% 0%", "33.333% 0%", "66.667% 0%", "100% 0%", "0% 100%", "33.333% 100%", "66.667% 100%", "100% 100%"];

const stats = [
  { k: "250+", v: "Enterprise clients" },
  { k: "40+", v: "Countries served" },
  { k: "1B+", v: "Requests handled monthly" },
  { k: "99.99%", v: "Platform uptime" },
];

const technologyPartners = [
  { name: "AWS", logo: awsLogo, logoClass: "h-11 w-20" },
  { name: "Microsoft Azure", logo: azureLogo, logoClass: "h-12 w-24" },
  { name: "Google Cloud", logo: googleCloudLogo, logoClass: "h-12 w-28" },
  { name: "Kubernetes", logo: kubernetesLogo, logoClass: "h-12 w-24" },
  { name: "Snowflake", logo: snowflakeLogo, logoClass: "h-8 w-8", showName: true },
  { name: "OpenAI", logo: openaiLogo, logoClass: "h-8 w-8", showName: true },
  { name: "PostgreSQL", logo: postgresqlLogo, logoClass: "h-11 w-24" },
  { name: "MongoDB", logo: mongodbLogo, logoClass: "h-11 w-24" },
  { name: "Laravel", logo: laravelLogo, logoClass: "h-10 w-24" },
  { name: "Shopify", logo: shopifyLogo, logoClass: "h-8 w-8", showName: true },
  { name: "WordPress", logo: wordpressLogo, logoClass: "h-8 w-8", showName: true },
  { name: "React JS", logo: reactLogo, logoClass: "h-11 w-24" },
  { name: "Node.js", logo: nodejsLogo, logoClass: "h-11 w-24" },
  { name: "TanStack", logo: tanstackLogo, logoClass: "h-8 w-8", showName: true },
  { name: "Vite", logo: viteLogo, logoClass: "h-8 w-8", showName: true },
  { name: "Python", logo: pythonLogo, logoClass: "h-11 w-24" },
  { name: "JavaScript", logo: javascriptLogo, logoClass: "h-8 w-8", showName: true },
  { name: "C++", logo: cplusplusLogo, logoClass: "h-8 w-8", showName: true },
  { name: "SQL", logo: sqlLogo, logoClass: "h-11 w-24" },
  { name: "Java", logo: javaLogo, logoClass: "h-11 w-20" },
  { name: "Gemini", logo: geminiLogo, logoClass: "h-8 w-8", showName: true },
  { name: "Claude", logo: claudeLogo, logoClass: "h-8 w-8", showName: true },
  { name: "Vercel", logo: vercelLogo, logoClass: "h-7 w-7", showName: true },
];

const homepageServiceOrder = ["website-development", "mobile-app-development", "digital-marketing", "seo"];
const homepageServices = [...services].sort((first, second) => {
  const firstPosition = homepageServiceOrder.indexOf(first.slug);
  const secondPosition = homepageServiceOrder.indexOf(second.slug);
  return (firstPosition === -1 ? homepageServiceOrder.length : firstPosition) - (secondPosition === -1 ? homepageServiceOrder.length : secondPosition);
});

const primaryServiceCardDetails: Record<string, { eyebrow: string; description: string; overlay: string }> = {
  "website-development": { eyebrow: "Digital experiences", description: "Fast, conversion-ready websites designed to grow your business.", overlay: "from-black/80 via-[#30133f]/35 to-transparent" },
  "mobile-app-development": { eyebrow: "Mobile products", description: "iOS and Android apps built for seamless customer experiences.", overlay: "from-[#071c3d]/90 via-[#0d6f9c]/40 to-transparent" },
  "digital-marketing": { eyebrow: "Growth marketing", description: "Campaigns that turn attention into qualified business opportunities.", overlay: "from-[#3f1020]/90 via-[#d1435c]/35 to-transparent" },
  seo: { eyebrow: "Search visibility", description: "SEO strategies that help the right customers find your business.", overlay: "from-[#08373f]/90 via-[#159577]/35 to-transparent" },
};

const primaryServiceCardImages: Record<string, string> = {
  "website-development": websiteDevelopmentCard,
  "mobile-app-development": mobileAppGradientCard,
  "digital-marketing": digitalMarketingGradientCard,
  seo: seoGradientCard,
};

const localSeoFaqs = [
  { question: "What services does 100 Web Technologies provide in Andhra Pradesh and Telangana?", answer: "We provide website development, mobile app development, SEO, digital marketing, e-commerce and custom software services for businesses across Andhra Pradesh and Telangana." },
  { question: "Do you work with businesses in Hyderabad, Vijayawada and Visakhapatnam?", answer: "Yes. We work remotely and collaboratively with businesses across Hyderabad, Vijayawada, Visakhapatnam, Tirupati, Guntur, Warangal and surrounding cities." },
  { question: "Can you help a local business improve Google and AI-search visibility?", answer: "Yes. We combine technically sound websites, location-relevant service content, structured data, helpful FAQs, accurate business information and SEO strategy to improve discoverability in traditional and AI-powered search experiences." },
];

function Index() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: "100 Web Technologies",
        url: "https://100web.in",
        description: "Website development, mobile app development, SEO and digital marketing services for businesses in Andhra Pradesh and Telangana.",
        areaServed: [
          { "@type": "State", name: "Andhra Pradesh" },
          { "@type": "State", name: "Telangana" },
        ],
        knowsAbout: ["Website Development", "Mobile App Development", "Search Engine Optimization", "Digital Marketing", "E-commerce Development"],
      },
      {
        "@type": "FAQPage",
        mainEntity: localSeoFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
      },
    ],
  };
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="hidden md:block">
        <SiteHeader />
      </div>
      <main className="flex flex-col [&>section]:order-5 md:[&>section]:order-none">

      {/* HERO */}
      <section className="relative isolate order-3 hidden min-h-[620px] overflow-hidden bg-[#b9caf9] bg-[url('/images/service-backgrounds/aurora-light.webp')] bg-cover bg-center pt-8 sm:min-h-[650px] sm:pt-16 md:block md:order-none">
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-48 sm:px-6 md:grid-cols-2 lg:px-8">
          {/* Left: lavender content card */}
          <div className="hero-float relative z-10 max-w-xl rounded-xl bg-[#f4f2fa]/95 p-8 shadow-[0_30px_60px_-20px_rgba(10,31,68,0.35)] ring-1 ring-white/60 sm:p-10 md:p-11">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#0A1F44] sm:text-5xl lg:text-[3.25rem]">
              Get the greatest choice of web, mobile and AI capabilities
            </h1>
            <p className="mt-5 max-w-lg text-base text-[#0A1F44]/75 sm:text-lg">
              Modernize faster and grow more efficiently with one experienced team for websites, apps, SEO and digital marketing.
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
        <div className="absolute inset-x-0 bottom-0 rounded-t-[4rem] bg-white pt-4 sm:rounded-t-[5rem] sm:pt-6">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4 sm:px-10 lg:px-12">
            {stats.map(s => (
              <div key={s.v}>
                <div className="text-2xl font-bold text-[#0A1F44] sm:text-3xl">{s.k}</div>
                <div className="mt-1 text-xs text-slate-600">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS STRIP */}
      <section id="solutions" className="!order-2 border-b bg-white md:order-none">
        <div className="technology-marquee overflow-hidden border-y border-slate-100 py-3 sm:py-4" aria-label="Technology logos">
          <div className="technology-marquee-track flex w-max flex-nowrap gap-2.5 sm:gap-3">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex flex-nowrap gap-2.5 sm:gap-3" aria-hidden={copy === 1}>
                {technologyPartners.map((partner) => (
                  <li key={`${copy}-${partner.name}`} className="flex h-16 w-32 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-sm transition hover:border-brand-orange/40 hover:shadow-md sm:h-20 sm:w-40 sm:rounded-xl sm:px-4">
                    <img src={partner.logo} alt={copy === 0 ? `${partner.name} logo` : ""} className={`${partner.logoClass} max-h-10 max-w-[5.5rem] object-contain sm:max-h-12 sm:max-w-[6.5rem]`} loading="lazy" />
                    {partner.showName && <span className="whitespace-nowrap text-xs font-bold tracking-tight text-[#263746] sm:text-sm">{partner.name}</span>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="!order-1 flex min-h-[calc(100svh-5.75rem)] w-full bg-black px-3 py-3 sm:px-6 sm:py-20 lg:px-8 md:block md:min-h-0 md:order-none">
        <div className="mx-auto hidden max-w-7xl md:block">
          <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">What we do</h2>
          <p className="mt-5 text-lg text-white/70">
            Catch up on the latest launches, solutions, and success stories across cloud, AI, and enterprise engineering.
          </p>
          </div>
        </div>
        <div className="mx-auto grid min-h-0 max-w-7xl flex-1 grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 md:mt-10 md:flex-none md:grid-rows-none md:gap-5 lg:grid-cols-3">
          {homepageServices.map((card) => {
            const primaryService = primaryServiceCardDetails[card.slug];
            return (
            <Link
              key={card.slug}
              to="/services/$slug"
              params={{ slug: card.slug }}
              className={`group relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-[#f3f4f8] transition duration-300 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-lg ${homepageServiceOrder.includes(card.slug) ? "" : "hidden md:block"}`}
            >
              <div className={`relative shrink-0 overflow-hidden bg-slate-100 ${primaryService ? "absolute inset-0 h-full" : "h-[44%] md:h-auto md:aspect-[16/10]"}`}>
                <img
                  src={primaryServiceCardImages[card.slug] ?? card.image}
                  alt={`${card.badge} gradient artwork`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                  width={1024}
                  height={576}
                />
              </div>
              {primaryService && <div aria-hidden className={`absolute inset-0 bg-gradient-to-t ${primaryService.overlay}`} />}
              <div className={`flex flex-1 flex-col justify-between p-3 sm:p-6 ${primaryService ? "absolute inset-x-0 bottom-0 z-10" : ""}`}>
                {primaryService ? (
                  <div className="max-w-[14rem] text-white md:max-w-sm" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                    <p className="inline-flex rounded-full border border-white/30 bg-black/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm md:text-[10px]">{primaryService.eyebrow}</p>
                    <h3 className="mt-2 max-w-[12.5rem] text-[1.45rem] font-black leading-[0.94] tracking-[-0.045em] text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] md:mt-3 md:max-w-xs md:text-[2.25rem]" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>{card.badge}</h3>
                    <span aria-hidden className="mt-2 block h-1 w-10 rounded-full bg-brand-orange shadow-[0_2px_10px_rgba(249,115,22,0.7)] md:mt-3 md:w-14" />
                    <p className="mt-2 max-w-[12.5rem] text-[11px] font-normal leading-[1.45] text-white md:max-w-xs md:text-sm">{primaryService.description}</p>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#10213a] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition duration-200 group-hover:-translate-y-0.5 group-hover:bg-brand-orange group-hover:text-white md:mt-5 md:px-4 md:py-2 md:text-sm">View more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 md:h-4 md:w-4" /></span>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold leading-snug text-foreground sm:text-base">{card.badge}</h3>
                      <p className="mt-1 text-[11px] leading-[1.45] text-slate-600 sm:mt-2 sm:text-xs">{card.desc}</p>
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] group-hover:text-[var(--brand-orange)] sm:mt-6"><ArrowRight className="h-4 w-4" /></div>
                  </>
                )}
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      <div className="sticky top-0 z-50 order-3 md:hidden">
        <SiteHeader />
      </div>

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
      <section id="industries" className="bg-muted/40 py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Industries</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Solutions tailored to your industry</h2>
            </div>
            <p className="text-muted-foreground md:text-right">Deep domain expertise across regulated and high-scale sectors, delivered by engineers who understand your business.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <Link key={industry.slug} to="/industries/$slug" params={{ slug: industry.slug }} className="group overflow-hidden rounded-xl border border-slate-200 bg-card transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]/60 hover:shadow-md">
                <div role="img" aria-label={`${industry.name} digital solutions`} className="aspect-[16/9] overflow-hidden bg-slate-100 transition duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${industryHighlights})`, backgroundPosition: industryImagePositions[index], backgroundSize: "400% 200%" }} />
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3"><span className="text-xs font-semibold leading-snug text-brand-navy sm:text-sm">{industry.name}</span><ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-orange" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL FOCUS */}
      <section id="local" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-orange)]">Local expertise</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Built for businesses in Andhra Pradesh &amp; Telangana</h2>
            {/*
            <p className="mt-4 text-muted-foreground">Our distributed engineering teams operate around the clock across the Americas, Europe, Middle East, Africa and Asia-Pacific — so your platforms never sleep.</p>
            */}
            <p className="mt-4 text-muted-foreground">100 Web Technologies helps local businesses turn ideas into practical websites, apps and growth campaigns — with a team that understands your market, customers and pace.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Clear, local-language project communication", "Online and on-site discovery sessions when needed", "Solutions sized for growing businesses, not enterprise overhead", "Ongoing support after your website or app goes live"].map(x => (
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
                { r: "Andhra Pradesh", c: "Local focus" },
                { r: "Telangana", c: "Local focus" },
                { r: "Vijayawada", c: "Business support" },
                { r: "Hyderabad", c: "Business support" },
                { r: "Consultations", c: "Online + phone" },
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
      <section className="relative isolate overflow-hidden border-y bg-slate-50 py-10 sm:py-16">
        <img
          src={andhraTelanganaMap}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-contain object-center opacity-25 mix-blend-multiply md:hidden"
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Andhra Pradesh and Telangana</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">Digital growth support for businesses across both states</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">From Hyderabad and Warangal to Vijayawada, Visakhapatnam, Tirupati and Guntur, we help businesses build useful digital products and earn visibility with clear service information, reliable websites and search-ready content.</p>
          <div className="mt-5 space-y-2 md:hidden">
            <FaqAccordion items={localSeoFaqs.map((faq) => ({ q: faq.question, a: faq.answer }))} defaultOpenIndex={null} />
          </div>
          <div className="mt-8 hidden gap-4 md:grid md:grid-cols-3">{localSeoFaqs.map((faq) => <article key={faq.question} className="rounded-xl border bg-white p-5 shadow-sm"><h3 className="text-base font-semibold text-brand-navy">{faq.question}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p></article>)}</div>
        </div>
      </section>

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

      </main>
      <SiteFooter />
    </div>
  );
}
