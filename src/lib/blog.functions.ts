import { createServerFn } from "@tanstack/react-start";
import { pool } from "./db.server";
import { z } from "zod";

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  content?: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  service_slug: string | null;
  meta_description: string | null;
  keywords: string[];
  reading_minutes: number;
  published_at: string;
  updated_at: string;
  author_name: string | null;
};

export const listPublishedBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { rows } = await pool.query(
    `SELECT b.id,b.slug,b.title,b.excerpt,b.cover_image,b.category,b.service_slug,
            b.meta_description,b.keywords,b.reading_minutes,b.published_at,b.updated_at,
            u.full_name AS author_name
     FROM blog_posts b
     LEFT JOIN users u ON u.id=b.author_id
     WHERE b.published_at IS NOT NULL AND b.published_at<=now()
     ORDER BY b.published_at DESC`,
  );
  return rows as PublicBlogPost[];
});

export const getPublishedBlogPost = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().min(1).max(240) }).parse(input))
  .handler(async ({ data }) => {
    const { rows } = await pool.query(
      `SELECT b.*,u.full_name AS author_name
       FROM blog_posts b
       LEFT JOIN users u ON u.id=b.author_id
       WHERE b.slug=$1 AND b.published_at IS NOT NULL AND b.published_at<=now()
       LIMIT 1`,
      [data.slug],
    );
    if (!rows[0]) return null;
    const related = await pool.query(
      `SELECT id,slug,title,excerpt,cover_image,category,service_slug,reading_minutes,published_at
       FROM blog_posts
       WHERE published_at IS NOT NULL AND published_at<=now() AND id<>$1
       ORDER BY (service_slug=$2) DESC,published_at DESC
       LIMIT 3`,
      [rows[0].id, rows[0].service_slug],
    );
    return { post: rows[0] as PublicBlogPost, related: related.rows as PublicBlogPost[] };
  });
