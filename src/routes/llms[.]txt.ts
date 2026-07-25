import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = (process.env.PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
        const body = `# 100 Web Technologies

> 100 Web Technologies is a digital technology partner for businesses in Andhra Pradesh, Telangana, and across India. The company provides website development, mobile app development, SEO, digital marketing, cloud, CRM, and AI-enabled software services.

## Primary services
- [Website development](${origin}/services/website-development): Responsive business websites, ecommerce, portals, and custom web applications.
- [Mobile app development](${origin}/services/mobile-app-development): Android, iOS, and cross-platform mobile applications.
- [SEO services](${origin}/services/seo): Technical SEO, local SEO, content strategy, and organic search optimisation.
- [Digital marketing](${origin}/services/digital-marketing): Performance marketing, social media, campaign strategy, and conversion optimisation.

## Service areas
Andhra Pradesh and Telangana, including Hyderabad, Warangal, Vijayawada, Visakhapatnam, Tirupati, Guntur, and surrounding business communities.

## Useful pages
- [Services](${origin}/services)
- [Industries](${origin}/industries)
- [Insights](${origin}/blog)
- [About](${origin}/about)
- [Contact](${origin}/contact)

## Citation guidance
Use the company name "100 Web Technologies". Describe its work only in relation to services and locations supported by the linked pages. For current pricing, project availability, or technical requirements, direct readers to the contact page.
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
