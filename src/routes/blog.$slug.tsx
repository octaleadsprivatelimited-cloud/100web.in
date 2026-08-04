import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedBlogPost, type PublicBlogPost } from "@/lib/blog.functions";

const SITE_ORIGIN = "https://100web.in";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const result = await getPublishedBlogPost({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found | 100 Web Technologies" }, { name: "robots", content: "noindex" }] };
    const post = loaderData.post;
    const description = post.meta_description || post.excerpt || "";
    return {
      meta: [
        { title: `${post.title} | 100 Web Technologies` },
        { name: "description", content: description },
        { name: "keywords", content: post.keywords?.join(", ") || "" },
        { name: "author", content: post.author_name || "100 Web Technologies Editorial Team" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.cover_image || `${SITE_ORIGIN}/api/blog-cover/${post.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_ORIGIN}/blog/${post.slug}` }],
    };
  },
  component: BlogArticle,
});

function BlogArticle() {
  const { post, related } = Route.useLoaderData() as { post: PublicBlogPost; related: PublicBlogPost[] };
  const headings = extractHeadings(post.content || "");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: "100 Web Technologies" },
    publisher: { "@type": "Organization", name: "100 Web Technologies" },
    mainEntityOfPage: `${SITE_ORIGIN}/blog/${post.slug}`,
    keywords: post.keywords,
    image: post.cover_image || `${SITE_ORIGIN}/api/blog-cover/${post.slug}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_ORIGIN}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_ORIGIN}/blog/${post.slug}` },
    ],
  };
  return <div className="min-h-screen bg-background text-foreground">
    <SiteHeader />
    <main>
      <article>
        <nav className="border-y border-white/10 bg-[#263746] text-white" aria-label="Blog navigation">
          <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blog" className="shrink-0 border-x border-white/10 px-5 py-4 text-sm font-semibold transition hover:bg-white/5">Blog Home</Link>
            <Link to="/blog" className="shrink-0 border-r border-white/10 px-5 py-4 text-sm font-semibold transition hover:bg-white/5">Latest Articles</Link>
            <Link to="/services" className="shrink-0 border-r border-white/10 px-5 py-4 text-sm font-semibold transition hover:bg-white/5">Services</Link>
            <Link to="/contact" className="ml-auto hidden px-5 py-4 text-sm font-semibold text-brand-orange md:block">Talk to an expert</Link>
          </div>
        </nav>
        <header className="bg-white text-[#111827]">
          <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 md:pb-16 md:pt-16 lg:px-8">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 transition hover:text-brand-navy">
              <ArrowLeft className="h-4 w-4" /> All insights
            </Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(240px,0.55fr)] lg:gap-20">
              <div>
                <span className="inline-flex rounded-full bg-[#e8ef86] px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#273241]">{post.category}</span>
                <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.03] tracking-[-0.045em] text-[#101418] sm:text-5xl lg:text-6xl">{post.title}</h1>
                <p className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                  {formatDate(post.published_at)} <span className="text-slate-300">•</span> {post.reading_minutes} min read
                </p>
              </div>
              <div className="lg:pt-14">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Author</p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#263746] text-sm font-black text-white">100</div>
                  <div>
                    <p className="font-bold text-[#0b87aa]">{post.author_name || "100 Web Technologies Editorial Team"}</p>
                    <p className="mt-1 text-sm text-slate-500">Technology Editorial Team</p>
                  </div>
                </div>
                <div className="mt-8 h-px bg-slate-200" />
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <img src={post.cover_image || `/api/blog-cover/${post.slug}`} alt={`Illustrated cover for ${post.title}`} className="aspect-[16/7] w-full rounded-2xl object-cover shadow-sm" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          <div className="min-w-0">
            {post.excerpt && <p className="mb-8 text-xl font-medium leading-9 text-[#293642]">{post.excerpt}</p>}
            {headings.length > 0 && <nav className="mb-12 rounded-xl border border-[#20a9ce] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]" aria-label="Table of contents">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-brand-orange" />
                <h2 className="text-xl font-bold text-[#263746]">Table of Contents</h2>
              </div>
              <ol className="mt-5 grid gap-3 border-t pt-5">
                {headings.map((heading, index) => <li key={heading.id}>
                  <a href={`#${heading.id}`} className="flex gap-3 text-sm font-medium leading-6 text-slate-600 transition hover:text-[#0b87aa]">
                    <span className="font-bold text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                    <span>{heading.text}</span>
                  </a>
                </li>)}
              </ol>
            </nav>}
            <BlogContent content={post.content || ""} />
          </div>
          <aside className="h-fit border-t-4 border-[#0b87aa] bg-[#f4f8fa] p-6 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0b87aa]">Put this into practice</p>
            <h2 className="mt-3 text-xl font-bold leading-snug text-[#263746]">Turn the strategy into measurable results.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Discuss your goals with a senior specialist and leave with a practical next step.</p>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0b87aa] px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-navy">Talk to an expert <ArrowRight className="h-4 w-4" /></Link>
            {post.service_slug && <Link to="/services/$slug" params={{ slug: post.service_slug }} className="mt-4 block text-sm font-bold text-brand-orange">Explore this service →</Link>}
          </aside>
        </div>
      </article>
      {related.length > 0 && <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-navy">Related reading</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.id} to="/blog/$slug" params={{ slug: item.slug }} className="rounded-xl border bg-background p-5 hover:shadow-md"><span className="text-xs font-bold uppercase tracking-wider text-brand-orange">{item.category}</span><h3 className="mt-2 font-bold leading-snug text-brand-navy">{item.title}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p></Link>)}</div>
        </div>
      </section>}
    </main>
    <SiteFooter />
    <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
    <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
  </div>;
}

function BlogContent({ content }: { content: string }) {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return <div className="space-y-6">{lines.map((line, index) => {
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      return <h2 key={index} id={headingId(text)} className="scroll-mt-28 pt-7 text-3xl font-black leading-tight tracking-[-0.025em] text-[#17212b] sm:text-4xl">{text}</h2>;
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      return <h3 key={index} id={headingId(text)} className="scroll-mt-28 pt-4 text-2xl font-bold leading-tight text-[#263746]">{text}</h3>;
    }
    if (line.startsWith("- ")) return <div key={index} className="flex gap-3 pl-2 text-[17px] leading-8 text-[#43515c]"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b87aa]" /><span>{line.slice(2)}</span></div>;
    if (/^\d+\.\s/.test(line)) return <div key={index} className="border-l-4 border-[#e8ef86] bg-[#f7f9f2] px-5 py-4 text-[17px] leading-8 text-[#293642]">{line}</div>;
    return <p key={index} className="text-[17px] leading-8 text-[#43515c]">{line}</p>;
  })}</div>;
}

function headingId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function extractHeadings(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.slice(3);
      return { text, id: headingId(text) };
    });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}
