import { createFileRoute } from "@tanstack/react-router";
import { pool } from "@/lib/db.server";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = (process.env.PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
        const [blogs, services, industries] = await Promise.all([
          pool.query(
            `SELECT slug, updated_at
             FROM blog_posts
             WHERE published_at IS NOT NULL AND published_at <= now()
             ORDER BY updated_at DESC`,
          ),
          pool.query(
            `SELECT slug, updated_at
             FROM service_pages
             WHERE is_active = TRUE
             ORDER BY updated_at DESC`,
          ),
          pool.query(
            `SELECT slug, updated_at
             FROM industry_pages
             WHERE is_active = TRUE
             ORDER BY updated_at DESC`,
          ),
        ]);

        const entries: SitemapEntry[] = [
          { loc: `${origin}/`, changefreq: "weekly", priority: "1.0" },
          { loc: `${origin}/services`, changefreq: "weekly", priority: "0.9" },
          { loc: `${origin}/industries`, changefreq: "weekly", priority: "0.9" },
          { loc: `${origin}/blog`, changefreq: "daily", priority: "0.9" },
          { loc: `${origin}/about`, changefreq: "monthly", priority: "0.7" },
          { loc: `${origin}/team`, changefreq: "monthly", priority: "0.7" },
          { loc: `${origin}/contact`, changefreq: "monthly", priority: "0.7" },
          ...services.rows.map((row) => ({
            loc: `${origin}/services/${row.slug}`,
            lastmod: new Date(row.updated_at).toISOString(),
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...industries.rows.map((row) => ({
            loc: `${origin}/industries/${row.slug}`,
            lastmod: new Date(row.updated_at).toISOString(),
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...blogs.rows.map((row) => ({
            loc: `${origin}/blog/${row.slug}`,
            lastmod: new Date(row.updated_at).toISOString(),
            changefreq: "monthly",
            priority: "0.7",
          })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
          },
        });
      },
    },
  },
});
