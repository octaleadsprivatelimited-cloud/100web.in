import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listPublishedBlogPosts, type PublicBlogPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>) => ({
    query: typeof search.query === "string" ? search.query : "",
  }),
  loader: () => listPublishedBlogPosts(),
  head: () => ({
    meta: [
      { title: "Technology Insights & Guides | 100 Web Technologies" },
      { name: "description", content: "Practical guides on cloud, AI, data engineering, web and mobile development, CRM, SEO, digital marketing and DevOps." },
      { property: "og:title", content: "Technology Insights & Guides | 100 Web Technologies" },
      { property: "og:description", content: "Actionable technology strategy and implementation guidance for growing businesses." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

const PAGE_SIZE = 18;

function BlogIndex() {
  const posts = Route.useLoaderData() as PublicBlogPost[];
  const { query: initialQuery } = Route.useSearch();
  const featured = posts[0];
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) =>
      (!needle || `${post.title} ${post.excerpt || ""} ${post.keywords?.join(" ") || ""}`.toLowerCase().includes(needle))
    );
  }, [posts, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <div className="min-h-screen bg-background text-foreground">
    <SiteHeader />
    <main>
      <section className="relative overflow-hidden bg-[#061625] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.13),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(56,189,248,0.09),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-brand-orange" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-orange">100 Insights</p>
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Ideas for<br /><span className="text-white/45">what’s next.</span>
            </h1>
            {featured && <div className="mt-9 max-w-lg border-l border-white/15 pl-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Featured · {featured.category}</p>
              <h2 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">{featured.title}</h2>
              <Link to="/blog/$slug" params={{ slug: featured.slug }} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-orange transition hover:gap-3">
                Read featured story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>}
          </div>
          {featured && <Link to="/blog/$slug" params={{ slug: featured.slug }} className="group relative block">
            <div className="absolute -inset-3 rounded-[2rem] border border-white/5 bg-white/[0.03] transition duration-500 group-hover:-rotate-1" />
            <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-2 shadow-2xl shadow-black/40 transition duration-500 group-hover:-translate-y-1">
              <img src={featured.cover_image || `/api/blog-cover/${featured.slug}`} alt={`Illustrated cover for ${featured.title}`} className="aspect-[16/9] w-full rounded-[1rem] object-cover" />
              <div className="flex items-center justify-between gap-4 px-3 py-3 text-xs text-white/55">
                <span>{featured.category}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {featured.reading_minutes} min read</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-3 rounded-full border border-white/10 bg-[#0b2235] px-4 py-2 text-xs font-semibold text-white/70 shadow-xl sm:-left-6">
              {posts.length} expert guides
            </div>
          </Link>}
        </div>
      </section>
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search guides and topics…" className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-brand-navy">Latest articles</h2>
          <span className="text-sm text-muted-foreground">{filtered.length} results</span>
        </div>
        {visible.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => <ArticleCard key={post.id} post={post} />)}
        </div> : <div className="rounded-2xl border border-dashed p-14 text-center text-muted-foreground">No articles match this search.</div>}
        {pageCount > 1 && <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Previous</button>
          <span className="px-3 text-sm text-muted-foreground">Page {page} of {pageCount}</span>
          <button disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Next</button>
        </div>}
      </section>
    </main>
    <SiteFooter />
  </div>;
}

function ArticleCard({ post }: { post: PublicBlogPost }) {
  return <Link to="/blog/$slug" params={{ slug: post.slug }} className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
    <div className="overflow-hidden bg-brand-navy">
      <img src={post.cover_image || `/api/blog-cover/${post.slug}`} alt={`Illustrated cover for ${post.title}`} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wider text-brand-orange"><span>{post.category}</span><span className="inline-flex items-center gap-1 normal-case tracking-normal text-muted-foreground"><Clock className="h-3 w-3" />{post.reading_minutes} min</span></div>
      <h2 className="mt-3 text-lg font-bold leading-snug text-brand-navy group-hover:text-brand-orange">{post.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand-navy">Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
    </div>
  </Link>;
}
