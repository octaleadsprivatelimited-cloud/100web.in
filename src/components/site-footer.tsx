import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t bg-[var(--brand-navy)] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--brand-orange)] font-black text-[var(--brand-navy)]">100</span>
            <span className="font-semibold text-white">100 Web Technologies</span>
          </div>
          <p className="mt-4 text-sm text-white/60">Cloud, AI and enterprise engineering — delivered globally.</p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Services</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-[var(--brand-orange)]">All services</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "cloud-infrastructure" }} className="hover:text-[var(--brand-orange)]">Cloud Infrastructure</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "ai-ml" }} className="hover:text-[var(--brand-orange)]">AI & ML</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "cloud-devops" }} className="hover:text-[var(--brand-orange)]">Cloud DevOps</Link></li>
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
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
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
