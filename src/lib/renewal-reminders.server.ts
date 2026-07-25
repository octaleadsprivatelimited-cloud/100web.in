import { pool } from "./db.server";

const reminderOffsets = [-30, -14, -7, -3, -1, 0, 3, 7];

export async function scheduleRenewalReminders(renewalId: string) {
  const { rows } = await pool.query("SELECT due_at,status,payment_url FROM customer_renewals WHERE id=$1", [renewalId]);
  const renewal = rows[0];
  if (!renewal || renewal.status === "paid" || !renewal.payment_url) return;

  const now = new Date();
  let previous = new Date(now.getTime() - 86_400_000);
  for (let index = 0; index < reminderOffsets.length; index += 1) {
    const scheduled = new Date(`${renewal.due_at}T09:00:00+05:30`);
    scheduled.setUTCDate(scheduled.getUTCDate() + reminderOffsets[index]);
    const earliest = new Date(previous.getTime() + 86_400_000);
    const normalised = scheduled < earliest ? earliest : scheduled;
    const finalDate = normalised < now ? now : normalised;
    previous = finalDate;
    await pool.query(
      `INSERT INTO renewal_reminders(renewal_id,sequence_no,scheduled_at)
       VALUES($1,$2,$3)
       ON CONFLICT(renewal_id,sequence_no) DO UPDATE
       SET scheduled_at=EXCLUDED.scheduled_at,status=CASE WHEN renewal_reminders.status='sent' THEN 'sent' ELSE 'scheduled' END,updated_at=now()`,
      [renewalId, index + 1, finalDate],
    );
  }
}

async function sendEmail(to: string, subject: string, text: string, paymentUrl: string) {
  if (!process.env.RESEND_API_KEY || !process.env.CRM_FROM_EMAIL) throw new Error("Resend is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CRM_FROM_EMAIL,
      to: [to],
      subject,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><p>${text}</p><p><a href="${paymentUrl}" style="display:inline-block;padding:12px 18px;background:#14213d;color:#fff;text-decoration:none;border-radius:6px">Pay renewal</a></p></div>`,
    }),
  });
  const result = await response.json() as any;
  if (!response.ok) throw new Error(result?.message || "Email delivery failed");
  return result.id;
}

async function sendWhatsApp(to: string, name: string, item: string, amount: string, dueDate: string, paymentUrl: string) {
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const template = process.env.META_WHATSAPP_PAYMENT_TEMPLATE;
  if (!token || !phoneId || !template) throw new Error("WhatsApp payment template is not configured");
  const response = await fetch(`https://graph.facebook.com/${process.env.META_GRAPH_VERSION || "v23.0"}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "template",
      template: {
        name: template,
        language: { code: process.env.META_WHATSAPP_TEMPLATE_LANGUAGE || "en" },
        components: [{ type: "body", parameters: [name, item, amount, dueDate, paymentUrl].map((text) => ({ type: "text", text })) }],
      },
    }),
  });
  const result = await response.json() as any;
  if (!response.ok) throw new Error(result?.error?.message || "WhatsApp delivery failed");
  return result.messages?.[0]?.id;
}

async function sendSms(to: string, text: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM || process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) throw new Error("Twilio SMS is not configured");
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: text }),
  });
  const result = await response.json() as any;
  if (!response.ok) throw new Error(result?.message || "SMS delivery failed");
  return result.sid;
}

export async function processDueRenewalReminders(limit = 25) {
  const due = await pool.query(
    `SELECT n.*,r.item_name,r.amount_minor,r.discount_minor,r.referral_discount_minor,r.currency,r.due_at,r.payment_url,r.status AS renewal_status,
            a.billing_name,a.billing_email,a.billing_phone,a.company,a.account_number
     FROM renewal_reminders n
     JOIN customer_renewals r ON r.id=n.renewal_id
     JOIN customer_accounts a ON a.id=r.customer_id
     WHERE n.status='scheduled' AND n.scheduled_at<=now()
     ORDER BY n.scheduled_at
     LIMIT $1`,
    [limit],
  );
  const results = [];
  for (const reminder of due.rows) {
    if (reminder.renewal_status === "paid") {
      await pool.query("UPDATE renewal_reminders SET status='cancelled',updated_at=now() WHERE renewal_id=$1 AND status='scheduled'", [reminder.renewal_id]);
      continue;
    }
    const netMinor = Math.max(0, reminder.amount_minor - reminder.discount_minor - reminder.referral_discount_minor);
    const amount = new Intl.NumberFormat("en-IN", { style: "currency", currency: reminder.currency }).format(netMinor / 100);
    const dueDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${reminder.due_at}T00:00:00`));
    const name = reminder.billing_name || reminder.company || "Customer";
    const text = `Hello ${name}, reminder ${reminder.sequence_no}/8: ${reminder.item_name} renewal of ${amount} is due on ${dueDate}. Pay securely: ${reminder.payment_url}`;
    const delivery: Record<string, any> = {};
    if (reminder.billing_email) {
      try { delivery.email = { status: "sent", id: await sendEmail(reminder.billing_email, `Renewal payment reminder ${reminder.sequence_no}/8`, text, reminder.payment_url) }; }
      catch (error) { delivery.email = { status: "failed", error: error instanceof Error ? error.message : "Failed" }; }
    }
    if (reminder.billing_phone) {
      try { delivery.whatsapp = { status: "sent", id: await sendWhatsApp(reminder.billing_phone, name, reminder.item_name, amount, dueDate, reminder.payment_url) }; }
      catch (error) { delivery.whatsapp = { status: "failed", error: error instanceof Error ? error.message : "Failed" }; }
      try { delivery.sms = { status: "sent", id: await sendSms(reminder.billing_phone, text) }; }
      catch (error) { delivery.sms = { status: "failed", error: error instanceof Error ? error.message : "Failed" }; }
    }
    const delivered = Object.values(delivery).some((item: any) => item.status === "sent");
    await pool.query(
      `UPDATE renewal_reminders
       SET status=$1,delivery_results=$2,
           sent_at=CASE WHEN $1='sent' THEN now() ELSE NULL END,
           scheduled_at=CASE WHEN $1='sent' THEN scheduled_at ELSE now()+interval '6 hours' END,
           updated_at=now()
       WHERE id=$3`,
      [delivered ? "sent" : "scheduled", delivery, reminder.id],
    );
    if (delivered) await pool.query("UPDATE customer_renewals SET reminder_sent_count=reminder_sent_count+1,last_reminder_at=now(),updated_at=now() WHERE id=$1", [reminder.renewal_id]);
    results.push({ id: reminder.id, sequence: reminder.sequence_no, delivered, delivery });
  }
  return results;
}
