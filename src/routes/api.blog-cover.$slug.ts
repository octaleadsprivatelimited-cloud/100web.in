import { createFileRoute } from "@tanstack/react-router";
import { pool } from "@/lib/db.server";

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

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function wrapTitle(title: string, max = 34) {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= 3) return lines;
  return [lines[0], lines[1], `${lines.slice(2).join(" ").slice(0, max - 1).trim()}…`];
}

function motif(service: string, accent: string) {
  const common = `fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"`;
  if (service.includes("cloud")) {
    return `<path ${common} d="M795 337h172c55 0 87-31 87-73 0-41-31-72-73-73-15-52-57-83-106-83-55 0-100 39-109 92-40 7-68 33-68 69 0 40 35 68 97 68Z"/>
      <path ${common} d="M782 404h224M821 456h146"/><circle cx="760" cy="404" r="8" fill="${accent}"/>`;
  }
  if (service.includes("ai")) {
    return `<rect ${common} x="752" y="124" width="226" height="226" rx="48"/>
      <path ${common} d="M810 272v-69m0 0 38-29m-38 29 42 31m68 38v-69m0 0-38-29m38 29-42 31"/>
      <circle cx="810" cy="203" r="16" fill="${accent}"/><circle cx="920" cy="203" r="16" fill="${accent}"/><circle cx="865" cy="274" r="16" fill="${accent}"/>`;
  }
  if (service.includes("data")) {
    return `<ellipse ${common} cx="865" cy="161" rx="118" ry="48"/><path ${common} d="M747 161v168c0 27 53 49 118 49s118-22 118-49V161M747 245c0 27 53 49 118 49s118-22 118-49"/>
      <path ${common} d="M821 436h88m-44-58v58"/><circle cx="865" cy="436" r="12" fill="${accent}"/>`;
  }
  if (service.includes("website")) {
    return `<rect ${common} x="724" y="126" width="282" height="230" rx="20"/><path ${common} d="M724 185h282M775 151h1m45 0h1m45 0h1"/>
      <path ${common} d="M774 231h82v76h-82zm122 0h60m-60 39h60m-191 141h200"/><path ${common} d="M865 356v55"/>`;
  }
  if (service.includes("mobile")) {
    return `<rect ${common} x="782" y="97" width="166" height="326" rx="30"/><path ${common} d="M837 130h56m-73 238h90"/>
      <rect x="816" y="178" width="98" height="130" rx="18" fill="${accent}" opacity=".16"/><path ${common} d="m839 244 20 20 37-48"/>`;
  }
  if (service.includes("crm")) {
    return `<circle ${common} cx="865" cy="190" r="55"/><path ${common} d="M759 347c12-66 53-101 106-101s94 35 106 101"/>
      <circle ${common} cx="748" cy="239" r="36"/><circle ${common} cx="982" cy="239" r="36"/><path ${common} d="M692 347c7-42 31-68 66-75m280 75c-7-42-31-68-66-75"/>`;
  }
  if (service === "seo") {
    return `<circle ${common} cx="847" cy="232" r="105"/><path ${common} d="m923 308 94 94"/>
      <path ${common} d="m787 247 39-42 39 25 51-67"/><circle cx="916" cy="163" r="12" fill="${accent}"/>`;
  }
  if (service.includes("marketing")) {
    return `<path ${common} d="m749 253 188-82v164l-188-82Z"/><path ${common} d="M749 253v103c0 22 18 40 40 40h24V281"/>
      <path ${common} d="M980 204c24 15 39 34 39 49s-15 34-39 49"/><circle cx="937" cy="253" r="12" fill="${accent}"/>`;
  }
  return `<path ${common} d="M746 330h238M775 330V207l90-68 90 68v123M825 330v-87h80v87"/>
    <path ${common} d="m816 143 49-38 49 38"/><circle cx="865" cy="190" r="13" fill="${accent}"/>`;
}

export const Route = createFileRoute("/api/blog-cover/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const rawSlug = String(params.slug || Object.values(params)[0] || "");
        const slug = rawSlug.replace(/\.svg$/i, "");
        const result = await pool.query(
          `SELECT title, category, service_slug
           FROM blog_posts
           WHERE slug = $1 AND published_at IS NOT NULL AND published_at <= now()
           LIMIT 1`,
          [slug],
        );
        const post = result.rows[0];
        if (!post) return new Response("Not found", { status: 404 });

        const seed = hash(`${slug}:${post.title}`);
        const hue = seed % 360;
        const secondHue = (hue + 38 + (seed % 67)) % 360;
        const accentHue = (hue + 165) % 360;
        const background = `hsl(${hue} 72% 34%)`;
        const background2 = `hsl(${secondHue} 76% 24%)`;
        const accent = `hsl(${accentHue} 88% 73%)`;
        const lines = wrapTitle(post.title);
        const service = String(post.service_slug || post.category || "technology").toLowerCase();
        const titleLines = lines
          .map((line, index) => `<tspan x="76" dy="${index === 0 ? 0 : 55}">${escapeXml(line)}</tspan>`)
          .join("");

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(post.title)}</title>
  <desc id="description">A clean illustrated cover for ${escapeXml(post.category)}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${background}"/><stop offset="1" stop-color="${background2}"/>
    </linearGradient>
    <radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".32"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <rect width="1200" height="675" rx="32" fill="url(#bg)"/>
  <circle cx="985" cy="86" r="250" fill="url(#glow)"><animate attributeName="r" values="235;265;235" dur="9s" repeatCount="indefinite"/></circle>
  <circle cx="112" cy="640" r="210" fill="url(#glow)" opacity=".55"><animate attributeName="cx" values="112;145;112" dur="11s" repeatCount="indefinite"/></circle>
  <g opacity=".16" stroke="${accent}" fill="none"><path d="M640 0v675M690 0v675M740 0v675M790 0v675M840 0v675M890 0v675M940 0v675M990 0v675M1040 0v675M1090 0v675M1140 0v675M1190 0v675"/><path d="M620 75h580M620 125h580M620 175h580M620 225h580M620 275h580M620 325h580M620 375h580M620 425h580M620 475h580M620 525h580M620 575h580M620 625h580"/></g>
  <g><circle cx="865" cy="265" r="196" fill="#fff" opacity=".08"/><circle cx="865" cy="265" r="154" fill="#fff" opacity=".06"/>
    ${motif(service, accent)}
    <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="6s" repeatCount="indefinite"/>
  </g>
  <rect x="76" y="68" width="210" height="40" rx="20" fill="#fff" opacity=".13"/>
  <text x="181" y="94" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700" text-anchor="middle" letter-spacing="1.6">${escapeXml(String(post.category).toUpperCase())}</text>
  <text x="76" y="232" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="43" font-weight="800" letter-spacing="-.7">${titleLines}</text>
  <rect x="76" y="486" width="74" height="7" rx="3.5" fill="${accent}"/>
  <text x="76" y="542" fill="#fff" opacity=".72" font-family="Arial,Helvetica,sans-serif" font-size="19" font-weight="600">100 WEB TECHNOLOGIES · INSIGHTS</text>
  <circle cx="${160 + (seed % 240)}" cy="610" r="5" fill="${accent}" opacity=".8"><animate attributeName="opacity" values=".35;1;.35" dur="3.5s" repeatCount="indefinite"/></circle>
</svg>`;

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
