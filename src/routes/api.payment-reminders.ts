import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";
import { processDueRenewalReminders } from "@/lib/renewal-reminders.server";

function authorised(request: Request) {
  const expected = process.env.CRON_SECRET || "";
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return Boolean(expected && received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected)));
}

export const Route = createFileRoute("/api/payment-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!authorised(request)) return new Response("Unauthorized", { status: 401 });
        const results = await processDueRenewalReminders();
        return Response.json({ ok: true, processed: results.length, results });
      },
    },
  },
});
