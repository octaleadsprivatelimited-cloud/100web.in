import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = (process.env.PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
        const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /customer
Disallow: /api

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Enables discovery of publicly available pages for ChatGPT Search.
User-agent: OAI-SearchBot
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
