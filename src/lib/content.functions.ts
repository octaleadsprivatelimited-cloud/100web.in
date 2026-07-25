import { createServerFn } from "@tanstack/react-start";
import { pool } from "./db.server";
import { services, type Service } from "./services-data";
import { industries, type Industry } from "./industries-data";

export type ManagedService = Service & { pdf_url?: string | null; is_active?: boolean };
export type ManagedIndustry = Industry & {
  description?: string;
  hero_title?: string;
  image_url?: string;
  pdf_url?: string | null;
  is_active?: boolean;
};

async function overrides(table: "service_pages" | "industry_pages") {
  try {
    const { rows } = await pool.query(`SELECT slug,content,pdf_url,is_active FROM ${table}`);
    return new Map(rows.map((row) => [row.slug, row]));
  } catch {
    return new Map<string, any>();
  }
}

export const listPublicServices = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await overrides("service_pages");
  return services
    .map((item) => {
      const row = rows.get(item.slug);
      return { ...item, ...(row?.content ?? {}), pdf_url: row?.pdf_url ?? null, is_active: row?.is_active ?? true };
    })
    .filter((item) => item.is_active);
});

export const getPublicService = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const all = await listPublicServices();
    return (all as ManagedService[]).find((item) => item.slug === data.slug) ?? null;
  });

export const listPublicIndustries = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await overrides("industry_pages");
  return industries
    .map((item) => {
      const row = rows.get(item.slug);
      return { ...item, ...(row?.content ?? {}), pdf_url: row?.pdf_url ?? null, is_active: row?.is_active ?? true };
    })
    .filter((item) => item.is_active);
});

export const getPublicIndustry = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const all = await listPublicIndustries();
    return (all as ManagedIndustry[]).find((item) => item.slug === data.slug) ?? null;
  });
