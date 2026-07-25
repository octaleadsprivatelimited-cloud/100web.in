import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) console.warn("[PostgreSQL] DATABASE_URL is not configured.");

export const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10,
});

const allowedTables = new Set([
  "users", "sessions", "profiles", "user_roles", "popup_banners", "team_members", "blog_posts",
  "gallery_items", "youtube_videos", "customer_accounts", "customer_projects", "customer_renewals",
  "customer_mailboxes", "customer_invites", "referral_codes", "referral_leads", "referral_credits",
  "service_pages", "industry_pages",
  "payment_transactions", "customer_invoices",
  "renewal_reminders",
  "crm_leads", "crm_activities", "crm_campaigns", "crm_automation_rules", "crm_communication_logs",
  "media_assets",
]);
const ident = (value: string) => {
  if (!/^[a-z_][a-z0-9_]*$/i.test(value)) throw new Error("Invalid database identifier");
  return `"${value}"`;
};
const jsonColumns = new Set([
  "team_members.experience",
  "team_members.education",
  "service_pages.content",
  "industry_pages.content",
  "customer_accounts.address",
  "payment_transactions.raw_payload",
  "customer_invoices.billing_snapshot",
  "crm_campaigns.stats",
  "renewal_reminders.channels",
  "renewal_reminders.delivery_results",
]);

type Operation = "select" | "insert" | "update" | "delete" | "upsert";
type Filter = { column: string; value: unknown };

class QueryBuilder implements PromiseLike<any> {
  private operation: Operation = "select";
  private filters: Filter[] = [];
  private orders: Array<{ column: string; ascending: boolean }> = [];
  private take?: number;
  private one: "single" | "maybe" | null = null;
  private payload: any;
  private countOnly = false;
  private conflict?: string;
  constructor(private table: string) {
    if (!allowedTables.has(table)) throw new Error(`Unknown table: ${table}`);
  }
  private value(column: string, value: unknown) {
    if (value !== null && value !== undefined && jsonColumns.has(`${this.table}.${column}`) && typeof value !== "string") {
      return JSON.stringify(value);
    }
    return value;
  }
  select(_columns = "*", options?: { count?: string; head?: boolean }) { this.countOnly = Boolean(options?.head); return this; }
  insert(payload: any) { this.operation = "insert"; this.payload = payload; return this; }
  update(payload: any) { this.operation = "update"; this.payload = payload; return this; }
  delete() { this.operation = "delete"; return this; }
  upsert(payload: any, options?: { onConflict?: string }) { this.operation = "upsert"; this.payload = payload; this.conflict = options?.onConflict; return this; }
  eq(column: string, value: unknown) { this.filters.push({ column, value }); return this; }
  order(column: string, options?: { ascending?: boolean }) { this.orders.push({ column, ascending: options?.ascending !== false }); return this; }
  limit(value: number) { this.take = value; return this; }
  single() { this.one = "single"; return this; }
  maybeSingle() { this.one = "maybe"; return this; }
  then<TResult1 = any, TResult2 = never>(resolve?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null, reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null) {
    return this.execute().then(resolve, reject);
  }
  private where(params: unknown[]) {
    if (!this.filters.length) return "";
    return " WHERE " + this.filters.map((filter) => {
      params.push(filter.value);
      return `${ident(filter.column)} = $${params.length}`;
    }).join(" AND ");
  }
  private async execute() {
    try {
      const params: unknown[] = [];
      let sql = "";
      if (this.operation === "select") {
        sql = this.countOnly ? `SELECT count(*)::int AS count FROM ${ident(this.table)}` : `SELECT * FROM ${ident(this.table)}`;
        sql += this.where(params);
        if (!this.countOnly && this.orders.length) sql += " ORDER BY " + this.orders.map((order) => `${ident(order.column)} ${order.ascending ? "ASC" : "DESC"}`).join(", ");
        if (!this.countOnly && this.take) { params.push(this.take); sql += ` LIMIT $${params.length}`; }
      } else if (this.operation === "insert" || this.operation === "upsert") {
        const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
        const columns = Object.keys(rows[0]).filter((column) =>
          rows.some((row) => row[column] !== undefined)
        );
        if (!columns.length) throw new Error("Insert payload has no defined values");
        const groups = rows.map((row) => "(" + columns.map((column) => { params.push(this.value(column, row[column])); return `$${params.length}`; }).join(",") + ")");
        sql = `INSERT INTO ${ident(this.table)} (${columns.map(ident).join(",")}) VALUES ${groups.join(",")}`;
        if (this.operation === "upsert" && this.conflict) {
          const conflict = this.conflict.split(",").map((v) => ident(v.trim())).join(",");
          sql += ` ON CONFLICT (${conflict}) DO UPDATE SET ` + columns.map((column) => `${ident(column)}=EXCLUDED.${ident(column)}`).join(",");
        }
        sql += " RETURNING *";
      } else if (this.operation === "update") {
        const columns = Object.keys(this.payload).filter((key) => this.payload[key] !== undefined);
        sql = `UPDATE ${ident(this.table)} SET ` + columns.map((column) => { params.push(this.value(column, this.payload[column])); return `${ident(column)}=$${params.length}`; }).join(",");
        sql += this.where(params) + " RETURNING *";
      } else {
        sql = `DELETE FROM ${ident(this.table)}` + this.where(params) + " RETURNING *";
      }
      const result = await pool.query(sql, params);
      if (this.countOnly) return { data: null, error: null, count: result.rows[0]?.count ?? 0 };
      const data = this.one ? (result.rows[0] ?? null) : result.rows;
      if (this.one === "single" && !data) return { data: null, error: { message: "Record not found" } };
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : "Database error" } };
    }
  }
}

export const postgres = {
  from(table: string) { return new QueryBuilder(table); },
  async rpc(name: string, args: Record<string, unknown>) {
    try {
      if (!["mark_referral_paid", "apply_referral_credits", "submit_referral_lead"].includes(name)) throw new Error("Unknown database function");
      const values = Object.values(args);
      const sql = `SELECT ${ident(name)}(${values.map((_, index) => `$${index + 1}`).join(",")}) AS result`;
      const result = await pool.query(sql, values);
      return { data: result.rows[0]?.result, error: null };
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : "Database function failed" } };
    }
  },
};
