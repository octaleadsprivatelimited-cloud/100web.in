import { createFileRoute } from "@tanstack/react-router";
import { pool } from "@/lib/db.server";

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function wrapTitle(title: string, max = 31) {
  const lines: string[] = [];
  let current = "";
  for (const word of title.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) { lines.push(current); current = word; } else current = next;
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function workScene(seed: number, accent: string, secondary: string, detail: string) {
  const flip = seed % 2 === 0;
  const personX = flip ? 800 : 940;
  const personTwoX = flip ? 1010 : 770;
  const hair = seed % 3 === 0 ? "#1d2939" : seed % 3 === 1 ? "#55342f" : "#20262f";
  const skin = seed % 3 === 0 ? "#a96345" : seed % 3 === 1 ? "#d98d68" : "#8b513d";
  return `<g>
    <ellipse cx="900" cy="570" rx="285" ry="34" fill="#071827" opacity=".2"/>
    <path d="M640 515h500l-30 48H670Z" fill="#f5f7fb" opacity=".94"/>
    <path d="M694 562h373l-28 43H722Z" fill="#b9c7d8" opacity=".62"/>
    <g transform="translate(${personX} 0)">
      <circle cx="0" cy="267" r="45" fill="${skin}"/>
      <path d="M-44 262c2-48 83-62 90 3-18-20-57-27-90-3Z" fill="${hair}"/>
      <path d="M-74 347c15-44 45-67 74-67s59 23 74 67l-9 172H-65Z" fill="${accent}"/>
      <path d="M-63 355 0 424l63-69" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="10"/>
      <path d="M-58 506-102 574M56 506l44 68" fill="none" stroke="#1f2937" stroke-width="19" stroke-linecap="round"/>
      <path d="M-60 346-126 426M60 346l77 40" fill="none" stroke="${skin}" stroke-width="18" stroke-linecap="round"/>
      <rect x="88" y="358" width="115" height="72" rx="12" fill="#eff5f8" transform="rotate(14 88 358)"/>
      <path d="M106 385h72m-72 17h47" stroke="${detail}" stroke-width="7" stroke-linecap="round"/>
    </g>
    <g transform="translate(${personTwoX} 50) scale(.82)">
      <circle cx="0" cy="271" r="43" fill="#c27656"/>
      <path d="M-48 266c10-64 90-56 94 6-22-21-71-26-94-6Z" fill="#263645"/>
      <path d="M-78 350c20-44 51-62 78-62s58 18 78 62l-8 150H-70Z" fill="${secondary}"/>
      <path d="M-54 500-98 582M54 500l45 82" fill="none" stroke="#1f2937" stroke-width="20" stroke-linecap="round"/>
      <path d="M-60 356-142 422M63 355l72 42" fill="none" stroke="#c27656" stroke-width="18" stroke-linecap="round"/>
    </g>
    <g transform="translate(688 125)">
      <rect width="365" height="218" rx="24" fill="#f8fbff"/>
      <rect x="18" y="18" width="329" height="182" rx="15" fill="#182d3e"/>
      <circle cx="46" cy="43" r="7" fill="${accent}"/><circle cx="69" cy="43" r="7" fill="${secondary}"/><circle cx="92" cy="43" r="7" fill="#fff" opacity=".65"/>
      <path d="M48 159c47-66 88 26 127-35 34-53 78 14 128-55" fill="none" stroke="${accent}" stroke-width="11" stroke-linecap="round"/>
      <rect x="49" y="78" width="108" height="18" rx="9" fill="#fff" opacity=".16"/>
      <rect x="49" y="106" width="190" height="10" rx="5" fill="#fff" opacity=".1"/>
      <circle cx="303" cy="80" r="24" fill="${secondary}" opacity=".9"><animate attributeName="cy" values="80;68;80" dur="4.5s" repeatCount="indefinite"/></circle>
    </g>
    <g transform="translate(635 80)"><rect width="155" height="55" rx="27" fill="#fff" opacity=".13"/><circle cx="30" cy="28" r="9" fill="${accent}"/><path d="M52 28h70" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".75"/></g>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" dur="7s" repeatCount="indefinite"/>
  </g>`;
}

export const Route = createFileRoute("/api/blog-cover/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = String(params.slug || Object.values(params)[0] || "").replace(/\.svg$/i, "");
        const result = await pool.query(
          `SELECT title, category, service_slug FROM blog_posts WHERE slug=$1 AND published_at IS NOT NULL AND published_at<=now() LIMIT 1`,
          [slug],
        );
        const post = result.rows[0];
        if (!post) return new Response("Not found", { status: 404 });

        const seed = hash(`${slug}:${post.title}`);
        const hue = seed % 360;
        const background = `hsl(${hue} 54% 22%)`;
        const background2 = `hsl(${(hue + 46 + (seed % 42)) % 360} 60% 15%)`;
        const accent = `hsl(${(hue + 155) % 360} 88% 70%)`;
        const secondary = `hsl(${(hue + 285) % 360} 86% 68%)`;
        const titleLines = wrapTitle(post.title).map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`).join("");
        const category = escapeXml(String(post.category || "Technology").toUpperCase());

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(post.title)}</title><desc id="description">Human-centred illustrated cover for ${category}.</desc>
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${background}"/><stop offset="1" stop-color="${background2}"/></linearGradient><radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".3"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="675" rx="32" fill="url(#bg)"/><circle cx="990" cy="95" r="300" fill="url(#glow)"/><path d="M0 552C180 480 340 630 520 552s305-90 680-4v127H0Z" fill="#fff" opacity=".045"/>
  ${workScene(seed, accent, secondary, `hsl(${(hue + 210) % 360} 86% 72%)`)}
  <rect x="76" y="70" width="210" height="40" rx="20" fill="#fff" opacity=".13"/><text x="181" y="96" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" text-anchor="middle" letter-spacing="1.5">${category}</text>
  <text x="76" y="228" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="43" font-weight="800" letter-spacing="-.7">${titleLines}</text><rect x="76" y="470" width="75" height="7" rx="3.5" fill="${accent}"/><text x="76" y="524" fill="#fff" opacity=".72" font-family="Arial,Helvetica,sans-serif" font-size="19" font-weight="600">100 WEB TECHNOLOGIES · INSIGHTS</text>
</svg>`;
        return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
      },
    },
  },
});
