import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { publicListTeamMembers } from "@/lib/admin.functions";
import { MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/team/")({
  head: () => ({
    meta: [
      { title: "Team — 100 Web Technologies" },
      { name: "description", content: "Meet the leaders at 100 Web Technologies — engineering, design, cloud, growth and AI experts building for global brands." },
      { property: "og:title", content: "Team — 100 Web Technologies" },
      { property: "og:description", content: "Meet the leaders at 100 Web Technologies." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const getTeam = useServerFn(publicListTeamMembers);
  const { data: members = [] } = useQuery({
    queryKey: ["public-team"],
    queryFn: () => getTeam(),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <motion.section
          className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Our team</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl md:text-5xl">
            The people building 100 Web Technologies
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Engineers, designers, cloud architects and growth strategists partnering with founders and enterprises around the world.
          </p>
        </motion.section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {members.map((m, i) => (
              <motion.li
                key={m.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3), ease: "easeOut" }}
              >
                <Link
                  to="/team/$slug"
                  params={{ slug: m.slug }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${m.accent}`}>
                    <div className="pointer-events-none absolute -inset-16 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 bg-white" aria-hidden="true" />
                    <div className="absolute inset-0 grid place-items-center">
                      {m.avatarUrl ? <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="text-3xl font-black text-white/90 drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-110 sm:text-5xl lg:text-6xl">{m.avatarInitials}</span>}
                    </div>
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-navy shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 sm:left-3 sm:top-3 sm:text-[11px]">
                      {m.department}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
                    <h2 className="text-sm font-bold text-brand-navy transition-colors duration-300 group-hover:text-brand-orange sm:text-base lg:text-lg">{m.name}</h2>
                    <p className="text-xs font-medium text-brand-orange sm:text-sm">{m.role}</p>
                    <p className="line-clamp-2 hidden text-xs text-muted-foreground sm:text-sm sm:block">{m.bio}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      <span className="truncate">{m.location}</span>
                    </div>
                    <div className="mt-auto flex items-center gap-1 pt-2 text-xs font-semibold text-brand-navy transition-all duration-300 group-hover:gap-2 group-hover:text-brand-orange sm:pt-3">
                      View <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
