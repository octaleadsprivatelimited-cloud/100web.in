import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { postgres } from "@/lib/db.server";
import { consumeRateLimit } from "@/lib/rate-limit.server";

async function ensureAdmin(context: { db: any; userId: string }) {
  const { data, error } = await context.db.from("user_roles").select("role").eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  if (!(data ?? []).some((row: any) => row.role === "admin")) throw new Error("Forbidden");
}

const leadSchema = z.object({
  code: z.string().min(3).max(40),
  full_name: z.string().min(2).max(160),
  email: z.string().email(),
  phone: z.string().max(40).nullish(),
  company: z.string().max(160).nullish(),
  message: z.string().max(2000).nullish(),
});

export const submitReferral = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const attempt = consumeRateLimit(`referral:${data.email.toLowerCase()}`, 3, 60 * 60 * 1000);
    if (!attempt.allowed) throw new Error("Too many referral submissions. Please try again later.");
    const { data: id, error } = await postgres.rpc("submit_referral_lead", {
      _code: data.code, _full_name: data.full_name, _email: data.email,
      _phone: data.phone || null, _company: data.company || null, _message: data.message || null,
    });
    if (error) throw new Error(error.message);
    return { id };
  });

export const listReferralAdmin = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const sb = context.db as any;
    const [leads, codes, invites, accounts] = await Promise.all([
      sb.from("referral_leads").select("*, referrer:customer_accounts!referrer_customer_id(account_number,billing_name,company), referred:customer_accounts!referred_customer_id(account_number,billing_name)").order("created_at", { ascending: false }),
      sb.from("referral_codes").select("*, customer:customer_accounts(account_number,billing_name,company)").order("created_at", { ascending: false }),
      sb.from("customer_invites").select("*").order("created_at", { ascending: false }).limit(50),
      sb.from("customer_accounts").select("id,account_number,billing_name,billing_email,company").order("created_at", { ascending: false }),
    ]);
    for (const result of [leads, codes, invites, accounts]) if (result.error) throw new Error(result.error.message);
    return { leads: leads.data ?? [], codes: codes.data ?? [], invites: invites.data ?? [], accounts: accounts.data ?? [] };
  });

export const createCustomerInvite = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((input: unknown) => z.object({
    email: z.string().email(), full_name: z.string().min(1), company: z.string().nullish(),
    referral_lead_id: z.string().uuid().nullish(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: invite, error } = await (context.db as any).from("customer_invites").insert({
      ...data, company: data.company || null, referral_lead_id: data.referral_lead_id || null, created_by: context.userId,
    }).select().single();
    if (error) throw new Error(error.message);
    if (data.referral_lead_id) await (context.db as any).from("referral_leads").update({ status: "invited" }).eq("id", data.referral_lead_id);
    return invite;
  });

export const createReferralCode = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((input: unknown) => z.object({ customer_id: z.string().uuid(), code: z.string().min(3).max(40).regex(/^[A-Za-z0-9-]+$/) }).parse(input))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: row, error } = await (context.db as any).from("referral_codes").upsert({ customer_id: data.customer_id, code: data.code.toUpperCase(), is_active: true }, { onConflict: "customer_id" }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const setReferralPaid = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .inputValidator((input: unknown) => z.object({ lead_id: z.string().uuid(), referred_customer_id: z.string().uuid(), payment_minor: z.number().int().positive() }).parse(input))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await (context.db as any).rpc("mark_referral_paid", {
      _lead_id: data.lead_id, _referred_customer_id: data.referred_customer_id, _payment_minor: data.payment_minor,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyReferrals = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    const sb = context.db as any;
    const { data: account } = await sb.from("customer_accounts").select("id").eq("user_id", context.userId).maybeSingle();
    if (!account) return { code: null, leads: [], credits: [] };
    const [code, leads, credits] = await Promise.all([
      sb.from("referral_codes").select("*").eq("customer_id", account.id).maybeSingle(),
      sb.from("referral_leads").select("id,full_name,company,status,created_at,paid_at").eq("referrer_customer_id", account.id).order("created_at", { ascending: false }),
      sb.from("referral_credits").select("*").eq("customer_id", account.id).order("created_at", { ascending: false }),
    ]);
    return { code: code.data, leads: leads.data ?? [], credits: credits.data ?? [] };
  });
