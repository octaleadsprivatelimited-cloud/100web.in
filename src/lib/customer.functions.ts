import { createServerFn } from "@tanstack/react-start";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { z } from "zod";
import { pool } from "./db.server";
import bcrypt from "bcryptjs";

async function requireAdmin(context: { db: any; userId: string }) {
  const { data, error } = await context.db.from("user_roles").select("role").eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  if (!(data ?? []).some((row: { role: string }) => row.role === "admin")) throw new Error("Forbidden");
}

function hydrateProject(project: any) {
  if (!project?.notes) return project;
  try {
    const packageData = JSON.parse(project.notes);
    return packageData?.kind === "customer-project-package" ? { ...project, ...packageData } : project;
  } catch { return project; }
}

function withRenewalBalances(renewals: any[], transactions: any[]) {
  return renewals.map((renewal) => {
    const paid_minor = transactions.filter((transaction) => transaction.renewal_id === renewal.id && transaction.status === "captured").reduce((sum, transaction) => sum + Number(transaction.amount_minor || 0), 0);
    const total_minor = Math.max(0, Number(renewal.amount_minor || 0) - Number(renewal.discount_minor || 0) - Number(renewal.referral_discount_minor || 0));
    return { ...renewal, paid_minor, pending_minor: Math.max(0, total_minor - paid_minor) };
  });
}

export const getCustomerPortal = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    const sb = context.db as any;
    const { data: account, error } = await sb.from("customer_accounts").select("*").eq("user_id", context.userId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!account) return { account: null, projects: [], renewals: [], mailboxes: [] };
    const [projects, renewals, mailboxes, transactions] = await Promise.all([
      sb.from("customer_projects").select("*").eq("customer_id", account.id).order("created_at", { ascending: false }),
      sb.from("customer_renewals").select("*").eq("customer_id", account.id).order("due_at", { ascending: true }),
      sb.from("customer_mailboxes").select("*").eq("customer_id", account.id).order("email_address", { ascending: true }),
      pool.query("SELECT renewal_id,amount_minor,status FROM payment_transactions WHERE customer_id=$1", [account.id]),
    ]);
    if (projects.error) throw new Error(projects.error.message);
    if (renewals.error) throw new Error(renewals.error.message);
    if (mailboxes.error) throw new Error(mailboxes.error.message);
    return { account, projects: (projects.data ?? []).map(hydrateProject), renewals: withRenewalBalances(renewals.data ?? [], transactions.rows), mailboxes: mailboxes.data ?? [] };
  });

const contactSchema = z.object({
  billing_name: z.string().max(160).nullish(),
  billing_email: z.string().email().or(z.literal("")).nullish(),
  billing_phone: z.string().max(40).nullish(),
  company: z.string().max(160).nullish(),
});

export const updateCustomerContact = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await (context.db as any)
      .from("customer_accounts")
      .update({
        billing_name: data.billing_name || null,
        billing_email: data.billing_email || null,
        billing_phone: data.billing_phone || null,
        company: data.company || null,
      })
      .eq("user_id", context.userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminCustomerOverview = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    await pool.query(`
      UPDATE customer_renewals
      SET status='overdue', updated_at=now()
      WHERE due_at < current_date
        AND status IN ('upcoming','pending','due')
    `);
    const { rows } = await pool.query(`
      SELECT a.*,
        COALESCE((SELECT jsonb_agg(p ORDER BY p.created_at DESC) FROM customer_projects p WHERE p.customer_id=a.id),'[]') AS projects,
        COALESCE((SELECT jsonb_agg(r ORDER BY r.due_at) FROM customer_renewals r WHERE r.customer_id=a.id),'[]') AS renewals,
        COALESCE((SELECT jsonb_agg(m ORDER BY m.email_address) FROM customer_mailboxes m WHERE m.customer_id=a.id),'[]') AS mailboxes,
        COALESCE((SELECT jsonb_agg(t ORDER BY COALESCE(t.paid_at,t.created_at) DESC) FROM payment_transactions t WHERE t.customer_id=a.id),'[]') AS transactions,
        COALESCE((SELECT jsonb_agg(i ORDER BY i.issued_at DESC) FROM customer_invoices i WHERE i.customer_id=a.id),'[]') AS invoices
      FROM customer_accounts a ORDER BY a.created_at DESC
    `);
    return rows.map((row) => ({ ...row, projects: (row.projects ?? []).map(hydrateProject), renewals: withRenewalBalances(row.renewals ?? [], row.transactions ?? []) }));
  });

export const createCustomerAccount = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => z.object({
    full_name: z.string().min(2).max(160),
    email: z.string().email(),
    phone: z.string().max(40).nullish(),
    company: z.string().max(160).nullish(),
    password: z.string().min(8).max(128),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const exists = await client.query("SELECT 1 FROM users WHERE lower(email)=lower($1)", [data.email]);
      if (exists.rowCount) throw new Error("A user with this email already exists");
      const hash = await bcrypt.hash(data.password, 12);
      const user = await client.query("INSERT INTO users(email,password_hash,full_name,company,phone,role) VALUES(lower($1),$2,$3,$4,$5,'customer') RETURNING id", [data.email, hash, data.full_name, data.company || null, data.phone || null]);
      const accountNumber = `CUST-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
      const account = await client.query("INSERT INTO customer_accounts(user_id,account_number,billing_name,billing_email,billing_phone,company) VALUES($1,$2,$3,lower($4),$5,$6) RETURNING *", [user.rows[0].id, accountNumber, data.full_name, data.email, data.phone || null, data.company || null]);
      await client.query("INSERT INTO referral_codes(customer_id,code) VALUES($1,$2)", [account.rows[0].id, accountNumber.replace("CUST-", "")]);
      await client.query("COMMIT");
      return account.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

const customerProjectPackageSchema = z.object({
  customerId: z.string().uuid(),
  name: z.string().min(2).max(180),
  serviceTypes: z.array(z.string().min(2).max(100)).min(1).max(8),
  amount: z.coerce.number().positive().max(10_000_000),
  dueAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceFilesUrl: z.string().trim().url().or(z.literal("")),
  agreementTerms: z.string().trim().max(12000).optional(),
});

export const createCustomerProjectPackage = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => customerProjectPackageSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const account = await client.query("SELECT * FROM customer_accounts WHERE id=$1 FOR UPDATE", [data.customerId]);
      if (!account.rows[0]) throw new Error("Customer not found");
      const amountMinor = Math.round(data.amount * 100);
      const agreementNumber = `AGR-${new Date().getUTCFullYear()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
      const terms = data.agreementTerms || "";
      const serviceType = data.serviceTypes.join(" + ");
      const packageData = JSON.stringify({ kind: "customer-project-package", services: data.serviceTypes, quoted_amount_minor: amountMinor, currency: "INR", agreement_number: agreementNumber, agreement_terms: terms, source_files_url: data.sourceFilesUrl || null, proposal_sent_at: new Date().toISOString() });
      const project = await client.query(
        `INSERT INTO customer_projects(customer_id,name,service_type,status,progress,due_at,notes)
         VALUES($1,$2,$3,'awaiting_payment',0,$4,$5) RETURNING *`,
        [data.customerId, data.name, serviceType, data.dueAt, packageData],
      );
      const renewal = await client.query(
        `INSERT INTO customer_renewals(customer_id,project_id,item_name,description,amount_minor,currency,due_at,status)
         VALUES($1,$2,$3,$4,$5,'INR',$6,'due') RETURNING *`,
        [data.customerId, project.rows[0].id, `${serviceType}: ${data.name}`, `Project proposal ${agreementNumber}`, amountMinor, data.dueAt],
      );
      const customer = account.rows[0];
      if (customer.billing_email) {
        await client.query(
          `INSERT INTO crm_communication_logs(channel,direction,recipient,subject,content,status,created_by)
           VALUES('email','outbound',$1,$2,$3,'queued',$4)`,
          [customer.billing_email, `Your ${serviceType} proposal from 100 Web Technologies`, `Your project agreement ${agreementNumber} and payment request are ready in your customer portal.`, context.userId],
        );
      }
      await client.query("COMMIT");
      return { project: hydrateProject(project.rows[0]), renewal: renewal.rows[0] };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });

export const deleteCustomerAccount = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => z.object({ customerId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const result = await pool.query("SELECT user_id FROM customer_accounts WHERE id=$1", [data.customerId]);
    if (!result.rows[0]) throw new Error("Customer not found");
    await pool.query("DELETE FROM users WHERE id=$1", [result.rows[0].user_id]);
    return { ok: true };
  });
