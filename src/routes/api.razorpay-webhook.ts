import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { pool } from "@/lib/db.server";

export const Route = createFileRoute("/api/razorpay-webhook")({
  server: { handlers: {
  POST: async ({ request }) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return new Response("Webhook is not configured", { status: 503 });
    const raw = await request.text();
    const received = request.headers.get("x-razorpay-signature") || "";
    const expected = createHmac("sha256", secret).update(raw).digest("hex");
    const valid = received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));
    if (!valid) return new Response("Invalid signature", { status: 401 });
    const eventId = request.headers.get("x-razorpay-event-id");
    const body = JSON.parse(raw);
    const payment = body?.payload?.payment?.entity;
    const link = body?.payload?.payment_link?.entity;
    if (!payment) return Response.json({ ok: true });
    const renewalId = payment.notes?.renewal_id || link?.reference_id;
    if (!renewalId) return Response.json({ ok: true });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const renewalResult = await client.query(
        "SELECT r.*,a.billing_name,a.billing_email,a.billing_phone,a.company,a.account_number FROM customer_renewals r JOIN customer_accounts a ON a.id=r.customer_id WHERE r.id=$1 FOR UPDATE",
        [renewalId],
      );
      const renewal = renewalResult.rows[0];
      if (!renewal) { await client.query("ROLLBACK"); return Response.json({ ok: true }); }
      if (!link?.id || link.id !== renewal.razorpay_payment_link_id || link.reference_id !== renewal.id) {
        await client.query("ROLLBACK");
        return new Response("Payment link does not match the renewal", { status: 400 });
      }
      if (payment.currency !== renewal.currency || !Number.isInteger(payment.amount) || payment.amount <= 0 || payment.amount > link.amount) {
        await client.query("ROLLBACK");
        return new Response("Invalid payment amount or currency", { status: 400 });
      }
      const paymentCaptured = payment.status === "captured";
      const paid = link?.status === "paid" || ["payment_link.paid", "invoice.paid"].includes(body.event);
      const tx = await client.query(
        `INSERT INTO payment_transactions(customer_id,renewal_id,provider_payment_id,provider_payment_link_id,provider_event_id,amount_minor,currency,status,method,email,contact,paid_at,raw_payload)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT(provider_payment_id) DO UPDATE SET status=EXCLUDED.status,method=EXCLUDED.method,paid_at=EXCLUDED.paid_at,raw_payload=EXCLUDED.raw_payload,updated_at=now()
         RETURNING id`,
        [renewal.customer_id, renewal.id, payment.id, link?.id || renewal.razorpay_payment_link_id, eventId, payment.amount, payment.currency, payment.status, payment.method, payment.email, payment.contact, paymentCaptured ? new Date((payment.created_at || Date.now()/1000)*1000) : null, body],
      );
      if (paymentCaptured) {
        const paidAt = new Date((payment.created_at || Date.now()/1000)*1000);
        await client.query("UPDATE customer_renewals SET status=$1,paid_at=CASE WHEN $1='paid' THEN $2 ELSE paid_at END,razorpay_payment_id=$3,provider_reference=$3,updated_at=now() WHERE id=$4", [paid ? "paid" : "partial", paidAt, payment.id, renewal.id]);
        const number = `INV-${new Date().getUTCFullYear()}-${payment.id.slice(-8).toUpperCase()}`;
        await client.query(
          `INSERT INTO customer_invoices(customer_id,renewal_id,transaction_id,invoice_number,item_name,description,amount_minor,currency,status,paid_at,provider_payment_id,billing_snapshot)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,'paid',$9,$10,$11) ON CONFLICT(invoice_number) DO NOTHING`,
          [renewal.customer_id, renewal.id, tx.rows[0].id, number, renewal.item_name, paid ? renewal.description : `Partial payment toward ${renewal.item_name}`, payment.amount, payment.currency, paidAt, payment.id, { name: renewal.billing_name, email: renewal.billing_email, phone: renewal.billing_phone, company: renewal.company, account_number: renewal.account_number }],
        );
        if (paid && renewal.project_id) {
          await client.query(
            "UPDATE customer_projects SET status='active',started_at=COALESCE(started_at,current_date),progress=GREATEST(progress,5),updated_at=now() WHERE id=$1",
            [renewal.project_id],
          );
        }
        if (paid) await client.query("UPDATE renewal_reminders SET status='cancelled',updated_at=now() WHERE renewal_id=$1 AND status IN ('scheduled','failed')", [renewal.id]);
      } else if (payment.status === "refunded") {
        const totals = await client.query("SELECT COALESCE(SUM(amount_minor),0)::int AS paid_minor FROM payment_transactions WHERE renewal_id=$1 AND status='captured'", [renewal.id]);
        const totalMinor = Math.max(0, renewal.amount_minor - renewal.discount_minor - renewal.referral_discount_minor);
        const status = totals.rows[0].paid_minor >= totalMinor ? "paid" : totals.rows[0].paid_minor > 0 ? "partial" : "due";
        await client.query("UPDATE customer_renewals SET status=$1,paid_at=CASE WHEN $1='paid' THEN paid_at ELSE NULL END,updated_at=now() WHERE id=$2", [status, renewal.id]);
        if (status !== "paid" && renewal.project_id) await client.query("UPDATE customer_projects SET status='awaiting_payment',updated_at=now() WHERE id=$1", [renewal.project_id]);
      }
      await client.query("COMMIT");
      return Response.json({ ok: true });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Razorpay webhook failed", error);
      return new Response("Webhook processing failed", { status: 500 });
    } finally {
      client.release();
    }
  }}},
});
