import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { type TeamMember } from "@/lib/team-data";
import { Mail, MapPin, ArrowLeft, Briefcase, GraduationCap, Award, Play } from "lucide-react";

export const Route = createFileRoute("/team/$slug")({
  head: ({ loaderData }) => {
    const m = (loaderData as { member?: TeamMember } | undefined)?.member;
    if (!m) return { meta: [{ title: "Team member not found" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${m.name} — ${m.role} | 100 Web Technologies` },
        { name: "description", content: m.bio },
        { property: "og:title", content: `${m.name} — ${m.role}` },
        { property: "og:description", content: m.bio },
      ],
    };
  },
  loader: async ({ params }) => {
    const { publicListTeamMembers } = await import("@/lib/admin.functions");
    const members = await publicListTeamMembers();
    const member = members.find((m) => m.slug === params.slug);
    if (!member) throw notFound();
    return { member, members };
  },
  notFoundComponent: NotFound,
  component: TeamMemberPage,
});

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-black text-brand-navy sm:text-4xl">Team member not found</h1>
        <p className="mt-3 text-muted-foreground">The profile you're looking for doesn't exist.</p>
        <Link to="/team" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to team
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function TeamMemberPage() {
  const { member, members } = Route.useLoaderData() as { member: TeamMember; members: TeamMember[] };
  const m = member;
  const others = members.filter((t) => t.slug !== m.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12">
          <Link to="/team" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-brand-navy">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All team
          </Link>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:gap-8 lg:grid-cols-[320px_1fr]">
            <div className={`relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br ${m.accent} shadow-lg`}>
              <div className="absolute inset-0 grid place-items-center">
                {m.avatarUrl ? <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" /> : <span className="text-7xl font-black text-white/95 drop-shadow-md sm:text-8xl">{m.avatarInitials}</span>}
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <span className="inline-flex w-fit rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange">
                {m.department}
              </span>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-navy sm:text-4xl md:text-5xl">{m.name}</h1>
              <p className="mt-2 text-lg font-semibold text-brand-orange sm:text-xl">{m.role}</p>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{m.longBio}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" />{m.location}</span>
                <span className="hidden text-border sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" aria-hidden="true" />{m.experienceYears}+ years experience</span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-muted"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> {m.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills & expertise</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {m.skills.map((s) => (
              <span key={s} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-brand-navy">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Video placeholder */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Introduction video</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-brand-navy">
            {m.videoUrl ? (
              <div className="relative aspect-video w-full">
                <iframe
                  src={m.videoUrl}
                  title={`${m.name} introduction video`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className={`relative grid aspect-video w-full place-items-center bg-gradient-to-br ${m.accent}`}>
                <button
                  type="button"
                  className="group flex flex-col items-center gap-3 text-white"
                  aria-label="Video coming soon"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur transition group-hover:scale-105 group-hover:bg-white/30 sm:h-20 sm:w-20">
                    <Play className="h-7 w-7 fill-white sm:h-8 sm:w-8" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold sm:text-base">Video coming soon</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Experience */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
          <h2 className="text-2xl font-black text-brand-navy sm:text-3xl">Experience</h2>
          <ol className="mt-6 space-y-4">
            {m.experience.map((e, i) => (
              <li key={i} className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-brand-navy sm:text-lg">{e.title}</h3>
                  <span className="text-xs font-medium text-muted-foreground sm:text-sm">{e.period}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-brand-orange">{e.company}</p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{e.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Education & achievements */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2 text-brand-navy">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-lg font-bold">Education</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {m.education.map((ed, i) => (
                  <li key={i}>
                    <p className="text-sm font-semibold text-brand-navy sm:text-base">{ed.degree}</p>
                    <p className="text-sm text-muted-foreground">{ed.school} • {ed.period}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2 text-brand-navy">
                <Award className="h-5 w-5" aria-hidden="true" />
                <h3 className="text-lg font-bold">Achievements</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {m.achievements.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Others */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-black text-brand-navy sm:text-3xl">More from the team</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  to="/team/$slug"
                  params={{ slug: o.slug }}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {o.avatarUrl ? <img src={o.avatarUrl} alt={o.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" /> : <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${o.accent} text-lg font-black text-white`}>{o.avatarInitials}</span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-brand-navy">{o.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{o.role}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
