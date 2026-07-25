import { createFileRoute } from "@tanstack/react-router";
import { pool } from "@/lib/db.server";

export const Route = createFileRoute("/api/media/$id")({
  server: { handlers: {
    GET: async ({ params }) => {
      if (!/^[0-9a-f-]{36}$/i.test(params.id)) return new Response("Not found", { status: 404 });
      const result = await pool.query("SELECT filename,mime_type,content FROM media_assets WHERE id=$1", [params.id]);
      const asset = result.rows[0];
      if (!asset) return new Response("Not found", { status: 404 });
      return new Response(asset.content, {
        headers: {
          "Content-Type": asset.mime_type,
          "Content-Length": String(asset.content.length),
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        },
      });
    },
  }},
});
