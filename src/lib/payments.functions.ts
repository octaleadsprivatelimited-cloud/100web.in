import { createServerFn } from "@tanstack/react-start";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { pool } from "./db.server";
import { z } from "zod";
import { scheduleRenewalReminders } from "./renewal-reminders.server";
import { consumeRateLimit } from "./rate-limit.server";

async function requireAdmin(userId: string) {
  const result = await pool.query("SELECT role FROM users WHERE id=$1 AND is_active=true", [userId]);
  if (result.rows[0]?.role !== "admin") throw new Error("Administrator access required");
}

async function ensureCustomerPaymentInvoices(customerId: string) {
  await pool.query(
    `INSERT INTO customer_invoices(customer_id,renewal_id,transaction_id,invoice_number,item_name,description,amount_minor,currency,status,issued_at,paid_at,provider_payment_id,billing_snapshot)
     SELECT t.customer_id,t.renewal_id,t.id,
       'INV-' || TO_CHAR(COALESCE(t.paid_at,t.created_at),'YYYY') || '-' || UPPER(RIGHT(t.provider_payment_id,8)),
       r.item_name,
       CASE WHEN r.status='paid' THEN COALESCE(r.description,'Verified project payment') ELSE 'Partial payment toward ' || r.item_name END,
       t.amount_minor,t.currency,'paid',COALESCE(t.paid_at,t.created_at),t.paid_at,t.provider_payment_id,
       jsonb_build_object('name',a.billing_name,'email',a.billing_email,'phone',a.billing_phone,'company',a.company,'account_number',a.account_number)
     FROM payment_transactions t
     JOIN customer_renewals r ON r.id=t.renewal_id
     JOIN customer_accounts a ON a.id=t.customer_id
     WHERE t.customer_id=$1 AND t.status='captured' AND t.provider_payment_id IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM customer_invoices i WHERE i.transaction_id=t.id)
     ON CONFLICT (invoice_number) DO NOTHING`,
    [customerId],
  );
}

export const createRazorpayPaymentLink = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => z.object({ renewalId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env, then restart the website.");
    const result = await pool.query(
      `SELECT r.*,a.billing_name,a.billing_email,a.billing_phone,a.company
       FROM customer_renewals r JOIN customer_accounts a ON a.id=r.customer_id WHERE r.id=$1`,
      [data.renewalId],
    );
    const renewal = result.rows[0];
    if (!renewal) throw new Error("Renewal not found");
    const paidResult = await pool.query("SELECT COALESCE(SUM(amount_minor),0)::int AS paid_minor FROM payment_transactions WHERE renewal_id=$1 AND status='captured'", [renewal.id]);
    const amount = Math.max(0, renewal.amount_minor - renewal.discount_minor - renewal.referral_discount_minor - paidResult.rows[0].paid_minor);
    if (!amount) throw new Error("Payment amount must be greater than zero");
    const response = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: renewal.currency,
        accept_partial: true,
        first_min_partial_amount: Math.min(amount, 100),
        reference_id: renewal.id,
        description: renewal.description || renewal.item_name,
        customer: {
          name: renewal.billing_name || renewal.company || undefined,
          email: renewal.billing_email || undefined,
          contact: renewal.billing_phone || undefined,
        },
        notify: { sms: Boolean(renewal.billing_phone), email: Boolean(renewal.billing_email) },
        reminder_enable: true,
        callback_url: `${process.env.PUBLIC_APP_URL || "http://127.0.0.1:8085"}/portal`,
        callback_method: "get",
        notes: { renewal_id: renewal.id, customer_id: renewal.customer_id },
      }),
    });
    const link = await response.json() as any;
    if (!response.ok) throw new Error(link?.error?.description || "Razorpay could not create the payment link");
    await pool.query(
      `UPDATE customer_renewals SET payment_url=$1,razorpay_payment_link_id=$2,payment_generated_at=now(),status=CASE WHEN status='partial' THEN 'partial' ELSE 'due' END,updated_at=now() WHERE id=$3`,
      [link.short_url, link.id, renewal.id],
    );
    await scheduleRenewalReminders(renewal.id);
    return { id: link.id, short_url: link.short_url, status: link.status };
  });

export const syncRazorpayPaymentLink = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => z.object({ renewalId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const keyId = process.env.RAZORPAY_KEY_ID; const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Razorpay keys are not configured.");
    const renewalResult = await pool.query("SELECT * FROM customer_renewals WHERE id=$1", [data.renewalId]);
    const renewal = renewalResult.rows[0];
    if (!renewal?.razorpay_payment_link_id) throw new Error("Generate a Razorpay payment link first.");
    // Razorpay returns captured payment details in the Payment Link resource.
    // There is no /payment_links/:id/payments API endpoint for Standard Payment Links.
    const response = await fetch(`https://api.razorpay.com/v1/payment_links/${renewal.razorpay_payment_link_id}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
    });
    const result = await response.json() as any;
    if (!response.ok) throw new Error(result?.error?.description || "Razorpay payment check failed");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const payment of result.payments || []) {
        if (payment.status !== "captured") continue;
        if (payment.currency && payment.currency !== renewal.currency) continue;
        if (!Number.isInteger(payment.amount) || payment.amount <= 0) continue;
        await client.query(
          `INSERT INTO payment_transactions(customer_id,renewal_id,provider_payment_id,provider_payment_link_id,amount_minor,currency,status,method,email,contact,paid_at,raw_payload)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT(provider_payment_id) DO UPDATE SET status=EXCLUDED.status,method=EXCLUDED.method,paid_at=EXCLUDED.paid_at,raw_payload=EXCLUDED.raw_payload,updated_at=now()`,
          [renewal.customer_id, renewal.id, payment.payment_id || payment.id, renewal.razorpay_payment_link_id, payment.amount, payment.currency || result.currency || renewal.currency, payment.status, payment.method, payment.email, payment.contact, new Date(payment.created_at * 1000), payment],
        );
      }
      const totals = await client.query("SELECT COALESCE(SUM(amount_minor),0)::int AS paid_minor FROM payment_transactions WHERE renewal_id=$1 AND status='captured'", [renewal.id]);
      const totalMinor = Math.max(0, renewal.amount_minor - renewal.discount_minor - renewal.referral_discount_minor);
      const paidMinor = totals.rows[0].paid_minor;
      const isPaid = paidMinor >= totalMinor;
      await client.query("UPDATE customer_renewals SET status=$1,paid_at=CASE WHEN $1='paid' THEN COALESCE(paid_at,now()) ELSE paid_at END,updated_at=now() WHERE id=$2", [isPaid ? "paid" : paidMinor > 0 ? "partial" : "due", renewal.id]);
      if (isPaid && renewal.project_id) await client.query("UPDATE customer_projects SET status='active',started_at=COALESCE(started_at,current_date),progress=GREATEST(progress,5),updated_at=now() WHERE id=$1", [renewal.project_id]);
      await client.query("COMMIT");
      return { paid_minor: paidMinor, pending_minor: Math.max(0, totalMinor - paidMinor), status: isPaid ? "paid" : paidMinor > 0 ? "partial" : "due" };
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  });

/** Lets a signed-in customer refresh only their own Razorpay payment links. */
export const syncMyRazorpayPayments = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    const attempt = consumeRateLimit(`payment-sync:${context.userId}`, 10, 60 * 1000);
    if (!attempt.allowed) return { synced: 0, throttled: true };
    const keyId = process.env.RAZORPAY_KEY_ID; const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return { synced: 0 };
    const account = await pool.query("SELECT id FROM customer_accounts WHERE user_id=$1", [context.userId]);
    const customerId = account.rows[0]?.id;
    if (!customerId) return { synced: 0 };
    const renewals = await pool.query("SELECT * FROM customer_renewals WHERE customer_id=$1 AND razorpay_payment_link_id IS NOT NULL AND status <> 'paid'", [customerId]);
    let synced = 0;
    for (const renewal of renewals.rows) {
      const response = await fetch(`https://api.razorpay.com/v1/payment_links/${renewal.razorpay_payment_link_id}`, {
        headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
      });
      if (!response.ok) continue;
      const link = await response.json() as any;
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const payment of link.payments || []) {
          if (payment.status !== "captured") continue;
          if (payment.currency && payment.currency !== renewal.currency) continue;
          if (!Number.isInteger(payment.amount) || payment.amount <= 0) continue;
          await client.query(
            `INSERT INTO payment_transactions(customer_id,renewal_id,provider_payment_id,provider_payment_link_id,amount_minor,currency,status,method,email,contact,paid_at,raw_payload)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT(provider_payment_id) DO UPDATE SET status=EXCLUDED.status,method=EXCLUDED.method,paid_at=EXCLUDED.paid_at,raw_payload=EXCLUDED.raw_payload,updated_at=now()`,
            [renewal.customer_id, renewal.id, payment.payment_id || payment.id, renewal.razorpay_payment_link_id, payment.amount, payment.currency || link.currency || renewal.currency, payment.status, payment.method, payment.email, payment.contact, new Date(payment.created_at * 1000), payment],
          );
        }
        const total = await client.query("SELECT COALESCE(SUM(amount_minor),0)::int AS paid_minor FROM payment_transactions WHERE renewal_id=$1 AND status='captured'", [renewal.id]);
        const totalMinor = Math.max(0, renewal.amount_minor - renewal.discount_minor - renewal.referral_discount_minor);
        const paidMinor = total.rows[0].paid_minor;
        const status = paidMinor >= totalMinor ? "paid" : paidMinor > 0 ? "partial" : "due";
        await client.query("UPDATE customer_renewals SET status=$1,paid_at=CASE WHEN $1='paid' THEN COALESCE(paid_at,now()) ELSE paid_at END,updated_at=now() WHERE id=$2", [status, renewal.id]);
        if (status === "paid" && renewal.project_id) await client.query("UPDATE customer_projects SET status='active',started_at=COALESCE(started_at,current_date),progress=GREATEST(progress,5),updated_at=now() WHERE id=$1", [renewal.project_id]);
        await client.query("COMMIT"); synced++;
      } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    }
    return { synced };
  });

export const listCustomerPayments = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    const account = await pool.query("SELECT id,status FROM customer_accounts WHERE user_id=$1", [context.userId]);
    if (!account.rows[0]) return { transactions: [], invoices: [] };
    await ensureCustomerPaymentInvoices(account.rows[0].id);
    const [transactions, invoices] = await Promise.all([
      pool.query("SELECT * FROM payment_transactions WHERE customer_id=$1 ORDER BY COALESCE(paid_at,created_at) DESC", [account.rows[0].id]),
      pool.query("SELECT * FROM customer_invoices WHERE customer_id=$1 ORDER BY issued_at DESC", [account.rows[0].id]),
    ]);
    return {
      transactions: transactions.rows,
      invoices: invoices.rows,
    };
  });
