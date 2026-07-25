import { createServerFn } from "@tanstack/react-start";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { pool } from "./db.server";
import { z } from "zod";
import { scheduleRenewalReminders } from "./renewal-reminders.server";

async function requireAdmin(userId: string) {
  const result = await pool.query("SELECT role FROM users WHERE id=$1 AND is_active=true", [userId]);
  if (result.rows[0]?.role !== "admin") throw new Error("Administrator access required");
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
    const amount = Math.max(0, renewal.amount_minor - renewal.discount_minor - renewal.referral_discount_minor);
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
        accept_partial: false,
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
      `UPDATE customer_renewals SET payment_url=$1,razorpay_payment_link_id=$2,payment_generated_at=now(),status='due',updated_at=now() WHERE id=$3`,
      [link.short_url, link.id, renewal.id],
    );
    await scheduleRenewalReminders(renewal.id);
    return { id: link.id, short_url: link.short_url, status: link.status };
  });

export const listCustomerPayments = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    const account = await pool.query("SELECT id,status FROM customer_accounts WHERE user_id=$1", [context.userId]);
    if (!account.rows[0]) return { transactions: [], invoices: [] };
    const [transactions, invoices] = await Promise.all([
      pool.query("SELECT * FROM payment_transactions WHERE customer_id=$1 ORDER BY COALESCE(paid_at,created_at) DESC", [account.rows[0].id]),
      pool.query("SELECT * FROM customer_invoices WHERE customer_id=$1 ORDER BY issued_at DESC", [account.rows[0].id]),
    ]);
    return {
      transactions: transactions.rows,
      invoices: account.rows[0].status === "active" ? invoices.rows : [],
    };
  });
