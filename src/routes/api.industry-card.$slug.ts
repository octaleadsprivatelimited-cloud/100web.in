import { createFileRoute } from "@tanstack/react-router";
import { getIndustryBySlug } from "@/lib/industries-data";

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export const Route = createFileRoute("/api/industry-card/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const industry = getIndustryBySlug(String(params.slug || "").replace(/\.svg$/i, ""));
        if (!industry) return new Response("Not found", { status: 404 });

        const seed = hash(industry.slug);
        const hue = seed % 360;
        const accent = `hsl(${(hue + 145) % 360} 88% 66%)`;
        const accentTwo = `hsl(${(hue + 285) % 360} 84% 66%)`;
        const title = escapeXml(industry.name);
        const category = escapeXml(industry.category.toUpperCase());
        const art = seed % 3 === 0
          ? `<circle cx="540" cy="150" r="128" fill="${accent}" opacity=".82"/><rect x="300" y="225" width="350" height="190" rx="38" fill="#fff" opacity=".92"/><path d="M345 370c55-85 95 30 150-34 54-62 88 17 119-42" fill="none" stroke="${accentTwo}" stroke-width="18" stroke-linecap="round"/>`
          : seed % 3 === 1
            ? `<path d="M305 100h310l-58 92H363Z" fill="${accent}" opacity=".86"/><path d="M275 395 420 205l145 190Z" fill="#fff" opacity=".92"/><circle cx="595" cy="370" r="74" fill="${accentTwo}" opacity=".9"/>`
            : `<rect x="330" y="108" width="235" height="235" rx="62" fill="${accent}" opacity=".9" transform="rotate(18 447 226)"/><circle cx="585" cy="385" r="92" fill="#fff" opacity=".92"/><path d="M278 422c96-128 189 79 365-85" fill="none" stroke="${accentTwo}" stroke-width="19" stroke-linecap="round"/>`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" role="img" aria-labelledby="title description">
  <title id="title">${title} digital solutions</title><desc id="description">Illustration representing ${title}.</desc>
  <defs><linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 54% 18%)"/><stop offset="1" stop-color="hsl(${(hue + 52) % 360} 52% 28%)"/></linearGradient></defs>
  <rect width="800" height="480" rx="30" fill="url(#background)"/><circle cx="82" cy="405" r="208" fill="${accent}" opacity=".12"/>${art}
  <rect x="38" y="38" width="185" height="34" rx="17" fill="#fff" opacity=".15"/><text x="130" y="60" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" letter-spacing="1.4">${category}</text>
  <text x="42" y="434" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="800">${title}</text>
</svg>`;
        return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
      },
    },
  },
});
