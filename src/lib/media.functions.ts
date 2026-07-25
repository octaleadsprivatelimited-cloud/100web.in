import { createServerFn } from "@tanstack/react-start";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { pool } from "./db.server";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().regex(/^image\//),
  base64: z.string().min(1),
  purpose: z.enum(["banner", "team", "gallery", "blog", "general"]),
});

export const uploadImage = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => uploadSchema.parse(input))
  .handler(async ({ data, context }) => {
    const role = await pool.query("SELECT role FROM users WHERE id=$1 AND is_active=true", [context.userId]);
    if (!["admin", "editor"].includes(role.rows[0]?.role)) throw new Error("Upload access required");
    const content = Buffer.from(data.base64, "base64");
    if (!content.length || content.length > 12 * 1024 * 1024) throw new Error("Images must be smaller than 12 MB");
    const result = await pool.query(
      "INSERT INTO media_assets(filename,mime_type,byte_size,content,purpose,uploaded_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING id",
      [data.filename, data.mimeType, content.length, content, data.purpose, context.userId],
    );
    return { id: result.rows[0].id, url: `/api/media/${result.rows[0].id}` };
  });
