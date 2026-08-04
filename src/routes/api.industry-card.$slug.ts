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

function industryArtwork(name: string, category: string, accent: string, accentTwo: string, variant: number) {
  const title = name.toLowerCase();
  const alternate = variant === 1;
  const shared = `<circle cx="620" cy="112" r="112" fill="${accent}" opacity=".2"/><circle cx="156" cy="400" r="156" fill="${accentTwo}" opacity=".14"/>`;

  if (category === "Automotive & Transport") {
    if (title.includes("bike wash")) return `${shared}<circle cx="335" cy="328" r="46" fill="#fff" opacity=".95"/><circle cx="556" cy="328" r="46" fill="#fff" opacity=".95"/><path d="m335 328 92-134h92l37 134h-72l-44-80-55 80z" fill="${accent}"/><path d="M520 174h62M600 142l32 38M636 220l38 12" stroke="${accentTwo}" stroke-width="18" stroke-linecap="round"/>`;
    if (title.includes("truck wash")) return `${shared}<path d="M240 222h272v144H240zM512 264h106l48 60v42H512z" fill="#fff" opacity=".95"/><path d="M272 252h206v82H272zM536 290h56l32 38h-88z" fill="${accent}"/><circle cx="320" cy="382" r="36" fill="${accentTwo}"/><circle cx="566" cy="382" r="36" fill="${accentTwo}"/><circle cx="664" cy="168" r="34" fill="${accent}"/>`;
    if (title.includes("bus wash")) return `${shared}<rect x="236" y="174" width="420" height="202" rx="30" fill="#fff" opacity=".95"/><rect x="270" y="212" width="270" height="74" rx="10" fill="${accent}"/><path d="M562 212h58v120h-58z" fill="${accentTwo}"/><circle cx="326" cy="380" r="33" fill="${accent}"/><circle cx="572" cy="380" r="33" fill="${accent}"/><circle cx="672" cy="142" r="30" fill="${accentTwo}"/>`;
    if (title.includes("wash") || title.includes("detailing")) return `${shared}<path d="M280 326h330l-30-96c-9-29-28-43-58-43H368c-30 0-49 14-58 43l-30 96Z" fill="#fff" opacity=".95"/><circle cx="348" cy="340" r="38" fill="${accent}"/><circle cx="540" cy="340" r="38" fill="${accent}"/><circle cx="625" cy="170" r="36" fill="${accentTwo}"/><circle cx="690" cy="236" r="24" fill="${accentTwo}"/><circle cx="610" cy="286" r="17" fill="${accentTwo}"/>`;
    if (title.includes("tyre")) return `${shared}<circle cx="444" cy="254" r="136" fill="#fff" opacity=".95"/><circle cx="444" cy="254" r="94" fill="${accent}"/><circle cx="444" cy="254" r="40" fill="${accentTwo}"/><path d="M444 118v34M444 356v34M308 254h34M546 254h34M348 158l24 24M516 326l24 24M540 158l-24 24M372 326l-24 24" stroke="${accentTwo}" stroke-width="16" stroke-linecap="round"/>`;
    if (title.includes("repair") || title.includes("car service") || title.includes("ev service") || title.includes("denting") || title.includes("painting")) return `${shared}<path d="M295 353 497 151l54 54-202 202-92 28z" fill="#fff" opacity=".95"/><path d="m470 178 54 54-130 130-54-54z" fill="${accent}"/><path d="m570 116 72 72M604 116l38 38" stroke="${accentTwo}" stroke-width="24" stroke-linecap="round"/>`;
    if (title.includes("bike rental")) return `${shared}<circle cx="332" cy="330" r="52" fill="#fff" opacity=".95"/><circle cx="558" cy="330" r="52" fill="#fff" opacity=".95"/><path d="m332 330 92-138h84l50 138h-78l-42-82-54 82z" fill="${accent}"/><path d="M504 170h76M580 142l32 34" stroke="${accentTwo}" stroke-width="20" stroke-linecap="round"/>`;
    if (title.includes("rental") || title.includes("taxi")) return `${shared}<path d="M270 330h350l-30-100c-9-30-30-44-60-44H360c-30 0-51 14-60 44l-30 100Z" fill="#fff" opacity=".95"/><circle cx="345" cy="344" r="38" fill="${accent}"/><circle cx="548" cy="344" r="38" fill="${accent}"/><path d="M424 152h92l28 34H396z" fill="${accentTwo}"/><path d="M656 155v112M620 190h72" stroke="${accentTwo}" stroke-width="18" stroke-linecap="round"/>`;
    if (title.includes("driving")) return `${shared}<circle cx="444" cy="250" r="138" fill="#fff" opacity=".95"/><circle cx="444" cy="250" r="92" fill="none" stroke="${accent}" stroke-width="34"/><circle cx="444" cy="250" r="23" fill="${accentTwo}"/><path d="M378 314 432 270M510 314 456 270M444 158v70" stroke="${accentTwo}" stroke-width="22" stroke-linecap="round"/>`;
    if (title.includes("fuel") || title.includes("lubricant")) return `${shared}<rect x="324" y="120" width="190" height="280" rx="30" fill="#fff" opacity=".95"/><rect x="358" y="156" width="122" height="92" rx="12" fill="${accent}"/><path d="M514 190h54c32 0 32 76 0 76h-26v76" fill="none" stroke="${accentTwo}" stroke-width="20" stroke-linecap="round"/><path d="M378 302h80" stroke="${accentTwo}" stroke-width="26" stroke-linecap="round"/>`;
    if (title.includes("battery")) return `${shared}<rect x="270" y="170" width="350" height="180" rx="28" fill="#fff" opacity=".95"/><rect x="354" y="136" width="44" height="34" rx="8" fill="${accentTwo}"/><rect x="492" y="136" width="44" height="34" rx="8" fill="${accentTwo}"/><path d="M390 216h46v-42h28v42h46v28h-46v46h-28v-46h-46z" fill="${accent}"/>`;
    if (title.includes("inspection")) return `${shared}<circle cx="404" cy="236" r="116" fill="#fff" opacity=".95"/><circle cx="404" cy="236" r="66" fill="none" stroke="${accent}" stroke-width="24"/><path d="m486 318 108 108" stroke="${accentTwo}" stroke-width="30" stroke-linecap="round"/><path d="m372 238 24 24 48-58" fill="none" stroke="${accentTwo}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (title.includes("towing")) return `${shared}<path d="M236 324h278V210h76l76 82v32h-72" fill="#fff" opacity=".95"/><circle cx="316" cy="352" r="38" fill="${accent}"/><circle cx="554" cy="352" r="38" fill="${accent}"/><path d="m476 218 112-78" stroke="${accentTwo}" stroke-width="24" stroke-linecap="round"/><path d="M565 139c36 22 36 60 0 82" fill="none" stroke="${accentTwo}" stroke-width="16" stroke-linecap="round"/>`;
    if (title.includes("accessories")) return `${shared}<circle cx="444" cy="250" r="136" fill="#fff" opacity=".95"/><path d="M444 144v212M338 250h212" stroke="${accent}" stroke-width="30" stroke-linecap="round"/><circle cx="444" cy="250" r="44" fill="${accentTwo}"/><path d="M318 124 570 376M570 124 318 376" stroke="${accent}" stroke-width="18" stroke-linecap="round"/>`;
  }

  if (category === "Real Estate & Construction") {
    return `${shared}<path d="M286 378V${alternate ? 225 : 205}l150-112 150 112v173H286Z" fill="#fff" opacity=".94"/><path d="M410 378v-98h56v98M330 247h45v45h-45zM497 247h45v45h-45z" fill="${accent}"/><path d="M252 205 436 66l184 139" fill="none" stroke="${accentTwo}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (category === "Food & Beverage") {
    return `${shared}<ellipse cx="444" cy="270" rx="154" ry="100" fill="#fff" opacity=".95"/><ellipse cx="444" cy="270" rx="105" ry="63" fill="${accent}" opacity=".88"/><path d="M250 132v118M279 132v118M264 132v236M610 132c-58 34-58 108 0 142v94" fill="none" stroke="${accentTwo}" stroke-width="19" stroke-linecap="round"/>`;
  }
  if (category === "Automotive & Transport") {
    return `${shared}<path d="M266 332h356l-34-116c-8-28-27-42-57-42H357c-30 0-49 14-57 42l-34 116Z" fill="#fff" opacity=".94"/><path d="M326 221h236l24 84H302l24-84Z" fill="${accent}"/><circle cx="338" cy="340" r="42" fill="${accentTwo}"/><circle cx="550" cy="340" r="42" fill="${accentTwo}"/><path d="M314 332h-55M574 332h55" stroke="${accent}" stroke-width="18" stroke-linecap="round"/>`;
  }
  if (category === "Healthcare & Wellness") {
    return `${shared}<rect x="320" y="112" width="248" height="300" rx="52" fill="#fff" opacity=".94"/><path d="M419 168h52v72h72v52h-72v72h-52v-72h-72v-52h72z" fill="${accent}"/><path d="M360 430c44-36 76 24 122-12 45-36 77 24 122-12" fill="none" stroke="${accentTwo}" stroke-width="18" stroke-linecap="round"/>`;
  }
  if (category === "Beauty & Personal Care") {
    return `${shared}<path d="M310 378c18-178 53-254 134-254s116 76 134 254H310Z" fill="#fff" opacity=".95"/><path d="M348 236c32-92 160-92 192 0" fill="none" stroke="${accent}" stroke-width="24" stroke-linecap="round"/><circle cx="396" cy="275" r="15" fill="${accentTwo}"/><circle cx="492" cy="275" r="15" fill="${accentTwo}"/><path d="M404 332c28 20 60 20 80 0" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>`;
  }
  if (category === "Education & Training") {
    return `${shared}<path d="M256 188 444 104l188 84-188 84-188-84Z" fill="#fff" opacity=".95"/><path d="M316 232v92c65 48 147 48 256 0v-92" fill="${accent}" opacity=".92"/><path d="M632 188v137" stroke="${accentTwo}" stroke-width="18" stroke-linecap="round"/><circle cx="632" cy="342" r="18" fill="${accentTwo}"/>`;
  }
  if (category === "Hospitality & Travel") {
    return `${shared}<path d="M290 390V148h308v242H290Z" fill="#fff" opacity=".95"/><path d="M338 194h46v52h-46zM420 194h46v52h-46zM502 194h46v52h-46zM338 276h46v52h-46zM502 276h46v52h-46z" fill="${accent}"/><path d="M420 390v-92h48v92" fill="${accentTwo}"/>`;
  }
  if (category === "Retail & Grocery" || category === "Fashion & Lifestyle" || category === "Home & Interiors") {
    return `${shared}<path d="M278 190h332l-26 72H304l-26-72Z" fill="#fff" opacity=".95"/><path d="M310 262h268l-20 128H330l-20-128Z" fill="${accent}"/><path d="M354 216c0-45 72-45 72 0M462 216c0-45 72-45 72 0" fill="none" stroke="${accentTwo}" stroke-width="17" stroke-linecap="round"/>`;
  }
  if (category === "Energy & Utilities") {
    return `${shared}<circle cx="444" cy="246" r="116" fill="#fff" opacity=".95"/><path d="m456 136-98 132h72l-12 110 98-140h-72z" fill="${accent}"/><path d="M250 396h388" stroke="${accentTwo}" stroke-width="20" stroke-linecap="round"/>`;
  }
  if (category === "Fitness & Sports") {
    return `${shared}<path d="M304 205v130M362 232v76M526 232v76M584 205v130M304 270h280" fill="none" stroke="#fff" stroke-width="28" stroke-linecap="round"/><path d="M332 212h44v116h-44zM512 212h44v116h-44z" fill="${accent}"/>`;
  }
  if (category === "Electronics & Technology" || category === "Telecom") {
    return `${shared}<rect x="270" y="124" width="348" height="230" rx="24" fill="#fff" opacity=".95"/><path d="M314 172h260v134H314z" fill="${accent}"/><path d="M402 402h84M444 354v48" stroke="${accentTwo}" stroke-width="22" stroke-linecap="round"/>`;
  }
  if (category === "Creative & Marketing" || category === "Media & Entertainment") {
    return `${shared}<circle cx="444" cy="246" r="130" fill="#fff" opacity=".95"/><path d="m410 174 126 72-126 72z" fill="${accent}"/><circle cx="350" cy="150" r="18" fill="${accentTwo}"/><circle cx="548" cy="338" r="18" fill="${accentTwo}"/>`;
  }
  if (category === "Logistics & Delivery") {
    return `${shared}<path d="M270 214h236v140H270zM506 258h80l46 52v44H506z" fill="#fff" opacity=".95"/><path d="M300 242h162v84H300zM530 280h43l28 32h-71z" fill="${accent}"/><circle cx="340" cy="370" r="36" fill="${accentTwo}"/><circle cx="560" cy="370" r="36" fill="${accentTwo}"/>`;
  }
  if (category === "Finance & Legal") {
    return `${shared}<path d="m444 100 190 86H254l190-86Z" fill="#fff" opacity=".95"/><path d="M286 202h42v156h-42zM372 202h42v156h-42zM474 202h42v156h-42zM560 202h42v156h-42z" fill="${accent}"/><path d="M248 382h392" stroke="${accentTwo}" stroke-width="20" stroke-linecap="round"/>`;
  }
  if (category === "Agriculture" || category === "Pets & Plants") {
    return `${shared}<path d="M444 386V188" stroke="#fff" stroke-width="28" stroke-linecap="round"/><path d="M430 270c-115-8-134-102-134-102 116 2 134 102 134 102ZM458 236c115-8 134-102 134-102-116 2-134 102-134 102Z" fill="${accent}"/><path d="M310 390h268" stroke="${accentTwo}" stroke-width="20" stroke-linecap="round"/>`;
  }
  if (category === "Local Services" || category === "Business Services") {
    return `${shared}<path d="M438 118c-76 0-130 58-130 130 0 47 25 89 63 112l-34 82 58-22 20 43 60-108c57-16 98-68 98-132 0-72-59-130-135-130Z" fill="#fff" opacity=".95"/><circle cx="438" cy="248" r="43" fill="${accent}"/><path d="m438 205 22 43 48 8-35 34 8 48-43-22-43 22 8-48-35-34 48-8z" fill="${accentTwo}"/>`;
  }
  if (category === "Community & Non-Profit") {
    return `${shared}<circle cx="350" cy="196" r="48" fill="#fff" opacity=".95"/><circle cx="538" cy="196" r="48" fill="#fff" opacity=".95"/><circle cx="444" cy="304" r="56" fill="${accent}"/><path d="M282 400c0-72 136-72 136 0M470 400c0-72 136-72 136 0M370 414c0-84 148-84 148 0" fill="none" stroke="${accentTwo}" stroke-width="22" stroke-linecap="round"/>`;
  }
  if (category === "Manufacturing & Industrial" || category === "Materials & Mining") {
    return `${shared}<path d="M274 388V224l88 58v-58l92 58v-58l128 86v78H274Z" fill="#fff" opacity=".95"/><path d="M318 326h52v62h-52zM410 326h52v62h-52zM502 326h52v62h-52z" fill="${accent}"/><path d="M314 190h84v74h-84z" fill="${accentTwo}"/>`;
  }
  if (category === "Waste & Recycling") {
    return `${shared}<path d="M444 132c82 0 148 66 148 148s-66 148-148 148-148-66-148-148 66-148 148-148Z" fill="#fff" opacity=".95"/><path d="m444 165 44 76h-35c14 17 23 39 23 63h-30c0-30-13-57-35-76l-10 32-44-95 96 0-9 0Zm86 173-66 0 17-29c-20 2-41 11-56 28l-22-20c22-24 53-38 85-37l-16-28 94 0-47 86 11 0Zm-155 12 33-57 17 29c6-19 5-42-5-63l27-14c15 30 16 63 4 93l33 0-50 82-46-80 7 10Z" fill="${accent}"/>`;
  }
  if (category === "Trade & Commerce") {
    return `${shared}<path d="M274 210h340v180H274z" fill="#fff" opacity=".95"/><path d="M310 250h268v104H310z" fill="${accent}"/><path d="M310 196h268" stroke="${accentTwo}" stroke-width="28" stroke-linecap="round"/><path d="M340 306h208" stroke="#fff" stroke-width="15" stroke-linecap="round" opacity=".75"/>`;
  }
  if (category === "Marine & Aviation") {
    return `${shared}<path d="m254 280 184-78 162 78-162 78z" fill="#fff" opacity=".95"/><path d="m438 202 38 78-38 78-38-78z" fill="${accent}"/><path d="M250 402c72-44 132 36 202-8 70-44 128 36 188-8" fill="none" stroke="${accentTwo}" stroke-width="20" stroke-linecap="round"/>`;
  }
  return `${shared}<rect x="292" y="120" width="304" height="270" rx="48" fill="#fff" opacity=".95"/><path d="M350 300c46-86 84 32 126-26 42-59 76 22 110-52" fill="none" stroke="${accent}" stroke-width="20" stroke-linecap="round"/><circle cx="358" cy="210" r="22" fill="${accentTwo}"/><circle cx="528" cy="210" r="22" fill="${accentTwo}"/>`;
}

export const Route = createFileRoute("/api/industry-card/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const industry = getIndustryBySlug(String(params.slug || "").replace(/\.svg$/i, ""));
        if (!industry) return new Response("Not found", { status: 404 });

        const requestedVariant = Number.parseInt(new URL(request.url).searchParams.get("variant") || "0", 10);
        const variant = Number.isFinite(requestedVariant) ? Math.abs(requestedVariant) % 3 : 0;
        const seed = hash(`${industry.slug}:${variant}`);
        const hue = seed % 360;
        const accent = `hsl(${(hue + 145) % 360} 88% 66%)`;
        const accentTwo = `hsl(${(hue + 285) % 360} 84% 66%)`;
        const title = escapeXml(industry.name);
        const category = escapeXml(industry.category.toUpperCase());
        const art = industryArtwork(industry.name, industry.category, accent, accentTwo, variant);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" role="img" aria-labelledby="title description">
  <title id="title">${title} digital solutions</title><desc id="description">Illustration representing ${title}.</desc>
  <defs><linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue} 54% 18%)"/><stop offset="1" stop-color="hsl(${(hue + 52) % 360} 52% 28%)"/></linearGradient></defs>
  <rect width="800" height="480" rx="30" fill="url(#background)"/><circle cx="82" cy="405" r="208" fill="${accent}" opacity=".12"/>${art}
  <rect x="38" y="38" width="185" height="34" rx="17" fill="#fff" opacity=".15"/><text x="130" y="60" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" letter-spacing="1.4">${category}</text>
  <text x="42" y="434" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="800">${title}</text>
</svg>`;
        return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
      },
    },
  },
});
