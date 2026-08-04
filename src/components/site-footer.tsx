import { Link } from "@tanstack/react-router";
import siteLogo from "../assets/100web-logo.png";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t bg-[var(--brand-navy)] text-white/80">
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-[url('/images/service-backgrounds/aurora-pink.webp')] bg-cover bg-center opacity-70" />
      <div aria-hidden="true" className="absolute inset-0 z-0 bg-[linear-gradient(110deg,rgba(4,17,40,0.9),rgba(8,22,51,0.66),rgba(4,17,40,0.86))]" />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white px-2 py-1"><img src={siteLogo} alt="100 Web" className="h-9 w-auto object-contain" /></span>
            <span className="font-semibold text-white">100 Web Technologies</span>
          </div>
          <p className="mt-4 text-sm text-white/60">Cloud, AI and enterprise engineering — delivered globally.</p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Services</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services/$slug" params={{ slug: "website-development" }} className="hover:text-[var(--brand-orange)]">Web Development</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "mobile-app-development" }} className="hover:text-[var(--brand-orange)]">App Development</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "seo" }} className="hover:text-[var(--brand-orange)]">SEO</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "digital-marketing" }} className="hover:text-[var(--brand-orange)]">Digital Marketing</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Company</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[var(--brand-orange)]">About</Link></li>
            <li><Link to="/industries" className="hover:text-[var(--brand-orange)]">Industries</Link></li>
            <li><Link to="/blog" className="hover:text-[var(--brand-orange)]">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--brand-orange)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Get in touch</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="mailto:hello@100web.in" className="hover:text-[var(--brand-orange)]">hello@100web.in</a></li>
            <li><span className="text-white/60">100web.in</span></li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-3 px-4 py-6 text-xs text-white/60 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} 100 Web Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
