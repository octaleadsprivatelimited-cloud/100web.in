import { createServerFn } from "@tanstack/react-start";
import { requirePostgresAuth } from "@/integrations/postgres/auth-middleware";
import { pool } from "./db.server";
import { z } from "zod";

async function requireCrmAccess(userId: string) {
  const { rows } = await pool.query("SELECT role FROM users WHERE id=$1 AND is_active=true", [userId]);
  if (!["admin", "editor"].includes(rows[0]?.role)) throw new Error("CRM access required");
}

export const getCrmWorkspace = createServerFn({ method: "GET" })
  .middleware([requirePostgresAuth])
  .handler(async ({ context }) => {
    await requireCrmAccess(context.userId);
    const [leads, activities, campaigns, rules, logs] = await Promise.all([
      pool.query("SELECT * FROM crm_leads ORDER BY updated_at DESC"),
      pool.query("SELECT * FROM crm_activities ORDER BY created_at DESC LIMIT 100"),
      pool.query("SELECT * FROM crm_campaigns ORDER BY created_at DESC"),
      pool.query("SELECT * FROM crm_automation_rules ORDER BY created_at DESC"),
      pool.query("SELECT * FROM crm_communication_logs ORDER BY created_at DESC LIMIT 100"),
    ]);
    return {
      leads: leads.rows,
      activities: activities.rows,
      campaigns: campaigns.rows,
      rules: rules.rows,
      logs: logs.rows,
      integrations: {
        whatsapp: Boolean(process.env.META_WHATSAPP_TOKEN && process.env.META_WHATSAPP_PHONE_NUMBER_ID),
        voice: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && process.env.TWILIO_TWIML_URL),
        email: Boolean(process.env.RESEND_API_KEY && process.env.CRM_FROM_EMAIL),
      },
    };
  });

const leadSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(2).max(160),
  email: z.string().email().or(z.literal("")).nullish(),
  phone: z.string().max(40).nullish(),
  company: z.string().max(160).nullish(),
  stage: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost"]),
  source: z.string().min(1).max(80),
  value_minor: z.number().int().nonnegative(),
  currency: z.string().length(3).default("INR"),
  tags: z.array(z.string()).default([]),
  next_followup_at: z.string().nullish(),
  notes: z.string().max(5000).nullish(),
});

export const saveCrmLead = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireCrmAccess(context.userId);
    const payload = [data.full_name, data.email || null, data.phone || null, data.company || null, data.stage, data.source, data.value_minor, data.currency, data.tags, data.next_followup_at || null, data.notes || null];
    const result = data.id
      ? await pool.query(`UPDATE crm_leads SET full_name=$1,email=$2,phone=$3,company=$4,stage=$5,source=$6,value_minor=$7,currency=$8,tags=$9,next_followup_at=$10,notes=$11,updated_at=now() WHERE id=$12 RETURNING *`, [...payload, data.id])
      : await pool.query(`INSERT INTO crm_leads(full_name,email,phone,company,stage,source,value_minor,currency,tags,next_followup_at,notes,assigned_to) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`, [...payload, context.userId]);
    return result.rows[0];
  });

export const deleteCrmLead = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireCrmAccess(context.userId);
    await pool.query("DELETE FROM crm_leads WHERE id=$1", [data.id]);
    return { ok: true };
  });

const marketingSchema = z.object({
  kind: z.enum(["campaign", "automation"]),
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(160),
  channel: z.enum(["email", "whatsapp", "voice"]),
  subject: z.string().max(300).nullish(),
  template: z.string().min(1).max(10000),
  status: z.string().optional(),
  target_stage: z.string().nullish(),
  trigger_type: z.string().optional(),
  delay_minutes: z.number().int().nonnegative().optional(),
  is_active: z.boolean().optional(),
  scheduled_at: z.string().nullish(),
});

export const saveCrmMarketing = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => marketingSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireCrmAccess(context.userId);
    if (data.kind === "campaign") {
      const values = [data.name, data.channel, data.status || "draft", data.subject || null, data.template, data.target_stage || null, data.scheduled_at || null];
      const result = data.id
        ? await pool.query("UPDATE crm_campaigns SET name=$1,channel=$2,status=$3,subject=$4,template=$5,target_stage=$6,scheduled_at=$7,updated_at=now() WHERE id=$8 RETURNING *", [...values, data.id])
        : await pool.query("INSERT INTO crm_campaigns(name,channel,status,subject,template,target_stage,scheduled_at,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [...values, context.userId]);
      return result.rows[0];
    }
    const values = [data.name, data.trigger_type || "lead_created", data.channel, data.subject || null, data.template, data.delay_minutes || 0, data.is_active ?? true];
    const result = data.id
      ? await pool.query("UPDATE crm_automation_rules SET name=$1,trigger_type=$2,channel=$3,subject=$4,template=$5,delay_minutes=$6,is_active=$7,updated_at=now() WHERE id=$8 RETURNING *", [...values, data.id])
      : await pool.query("INSERT INTO crm_automation_rules(name,trigger_type,channel,subject,template,delay_minutes,is_active,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", [...values, context.userId]);
    return result.rows[0];
  });

export const deleteCrmMarketing = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => z.object({ kind: z.enum(["campaign", "automation"]), id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireCrmAccess(context.userId);
    await pool.query(`DELETE FROM ${data.kind === "campaign" ? "crm_campaigns" : "crm_automation_rules"} WHERE id=$1`, [data.id]);
    return { ok: true };
  });

const sendSchema = z.object({
  leadId: z.string().uuid(),
  channel: z.enum(["email", "whatsapp", "voice"]),
  subject: z.string().max(300).nullish(),
  content: z.string().min(1).max(10000),
});

export const sendCrmCommunication = createServerFn({ method: "POST" })
  .middleware([requirePostgresAuth])
  .validator((input: unknown) => sendSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireCrmAccess(context.userId);
    const { rows } = await pool.query("SELECT * FROM crm_leads WHERE id=$1", [data.leadId]);
    const lead = rows[0];
    if (!lead) throw new Error("Lead not found");
    let recipient = "";
    let providerId = "";
    try {
      if (data.channel === "email") {
        recipient = lead.email;
        if (!recipient || !process.env.RESEND_API_KEY || !process.env.CRM_FROM_EMAIL) throw new Error("Resend email integration or lead email is missing");
        const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.CRM_FROM_EMAIL, to: [recipient], subject: data.subject || "Message from 100 Web Technologies", html: data.content }) });
        const result = await response.json() as any;
        if (!response.ok) throw new Error(result?.message || "Email delivery failed");
        providerId = result.id;
      } else if (data.channel === "whatsapp") {
        recipient = (lead.phone || "").replace(/\D/g, "");
        if (!recipient || !process.env.META_WHATSAPP_TOKEN || !process.env.META_WHATSAPP_PHONE_NUMBER_ID) throw new Error("Meta WhatsApp integration or lead phone is missing");
        const version = process.env.META_GRAPH_VERSION || "v23.0";
        const response = await fetch(`https://graph.facebook.com/${version}/${process.env.META_WHATSAPP_PHONE_NUMBER_ID}/messages`, { method: "POST", headers: { Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: recipient, type: "text", text: { preview_url: false, body: data.content } }) });
        const result = await response.json() as any;
        if (!response.ok) throw new Error(result?.error?.message || "WhatsApp delivery failed");
        providerId = result.messages?.[0]?.id || "";
      } else {
        recipient = lead.phone;
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        if (!recipient || !sid || !token || !process.env.TWILIO_PHONE_NUMBER || !process.env.TWILIO_TWIML_URL) throw new Error("Twilio voice integration or lead phone is missing");
        const form = new URLSearchParams({ To: recipient, From: process.env.TWILIO_PHONE_NUMBER, Url: process.env.TWILIO_TWIML_URL });
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, { method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
        const result = await response.json() as any;
        if (!response.ok) throw new Error(result?.message || "Voice call failed");
        providerId = result.sid;
      }
      const log = await pool.query("INSERT INTO crm_communication_logs(lead_id,channel,recipient,subject,content,status,provider_message_id,sent_at,created_by) VALUES($1,$2,$3,$4,$5,'sent',$6,now(),$7) RETURNING *", [lead.id, data.channel, recipient, data.subject || null, data.content, providerId, context.userId]);
      await pool.query("UPDATE crm_leads SET stage=CASE WHEN stage='new' THEN 'contacted' ELSE stage END,updated_at=now() WHERE id=$1", [lead.id]);
      return log.rows[0];
    } catch (error) {
      await pool.query("INSERT INTO crm_communication_logs(lead_id,channel,recipient,subject,content,status,error_message,created_by) VALUES($1,$2,$3,$4,$5,'failed',$6,$7)", [lead.id, data.channel, recipient || lead.email || lead.phone || "unknown", data.subject || null, data.content, error instanceof Error ? error.message : "Delivery failed", context.userId]);
      throw error;
    }
  });
