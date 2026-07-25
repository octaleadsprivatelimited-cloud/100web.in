import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Building2, CalendarDays, CheckCircle2, Clock3, Copy, CreditCard, Download, ExternalLink, Gift, Loader2, LogOut, Mail, Phone, ReceiptText, Save, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { logout } from "@/lib/auth.functions";
import { getCustomerPortal, updateCustomerContact } from "@/lib/customer.functions";
import { getMyReferrals } from "@/lib/referral.functions";
import { listCustomerPayments } from "@/lib/payments.functions";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";

export const Route = createFileRoute("/_authenticated/portal")({ component: CustomerPortal });

type PortalData = {
  account: any;
  projects: any[];
  renewals: any[];
  mailboxes: any[];
};

function CustomerPortal() {
  const navigate = useNavigate();
  const logoutFn = useServerFn(logout);
  const qc = useQueryClient();
  const load = useServerFn(getCustomerPortal);
  const loadReferrals = useServerFn(getMyReferrals);
  const loadPayments = useServerFn(listCustomerPayments);
  const saveContact = useServerFn(updateCustomerContact);
  const { data, isLoading, error } = useQuery<PortalData>({ queryKey: ["customer-portal"], queryFn: () => load() as Promise<PortalData> });
  const { data: referrals } = useQuery<any>({ queryKey: ["my-referrals"], queryFn: () => loadReferrals() });
  const { data: payments } = useQuery<any>({ queryKey: ["my-payments"], queryFn: () => loadPayments(), refetchInterval: 15000 });
  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState<any>(null);
  const save = useMutation({
    mutationFn: (payload: any) => saveContact({ data: payload }),
    onSuccess: () => { toast.success("Contact details updated"); qc.invalidateQueries({ queryKey: ["customer-portal"] }); setEditing(false); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  async function signOut() {
    await logoutFn();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-7 w-7 animate-spin text-brand-orange" /></div>;
  if (error) return <PortalMessage title="Unable to load your portal" body={error instanceof Error ? error.message : "Please try again."} />;
  if (!data?.account) return <PortalMessage title="Your customer account is being prepared" body="Your login is active, but no customer account has been linked yet. Please contact support." />;

  const account = data.account;
  const dueRenewals = data.renewals.filter((r) => r.status === "due" || r.status === "overdue");
  const form = contact ?? account;

  return (
    <div className="min-h-screen bg-[hsl(220,14%,97%)]">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-orange text-xs font-black text-brand-navy">100</span>
            <div><p className="text-sm font-semibold text-brand-navy">Customer Portal</p><p className="text-[11px] text-muted-foreground">{account.account_number}</p></div>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-medium text-brand-orange">Welcome back</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-brand-navy">{account.billing_name || account.company || "Your account"}</h1><p className="mt-1 text-sm text-muted-foreground">Projects, renewals, mailboxes, and account details in one place.</p></div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">{account.status} account</span>
        </div>

        <section className="relative mb-8 overflow-hidden rounded-3xl bg-brand-navy p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-orange/20 blur-2xl" />
          <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-navy">
                <Sparkles className="h-3.5 w-3.5" /> Referral rewards
              </span>
              <h2 className="mt-4 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">Refer a business. Earn ₹1,000 toward your next renewal.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Your referral receives ₹1,000 off their first eligible payment. Once their payment is confirmed, your ₹1,000 credit unlocks automatically—and every successful referral adds another ₹1,000.</p>
              {referrals?.code ? (
                <div className="mt-5 flex max-w-xl flex-col gap-2 rounded-xl border border-white/15 bg-white/10 p-2 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1 px-2">
                    <p className="text-[10px] uppercase tracking-wide text-white/50">Your referral link</p>
                    <p className="mt-0.5 truncate text-xs font-semibold">{typeof window !== "undefined" ? `${window.location.origin}/refer/${referrals.code.code}` : `/refer/${referrals.code.code}`}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/refer/${referrals.code.code}`).then(() => toast.success("Referral link copied"))}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-xs font-bold text-brand-navy"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy link
                  </button>
                </div>
              ) : (
                <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-white/75">
                  <Gift className="h-4 w-4 text-brand-orange" /> Ask your account manager to activate your referral link.
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-semibold text-brand-orange">{referrals?.leads?.filter((lead: any) => lead.status === "paid").length || 0}</p>
                <p className="mt-2 text-xs font-medium text-white">Successful referrals</p>
                <p className="mt-1 text-[11px] text-white/50">Confirmed payments</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-semibold text-brand-orange">{money((referrals?.credits?.filter((credit: any) => credit.status === "available").length || 0) * 100000, "INR")}</p>
                <p className="mt-2 text-xs font-medium text-white">Available credit</p>
                <p className="mt-1 text-[11px] text-white/50">For upcoming renewals</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Building2} label="Projects" value={data.projects.length} hint={`${data.projects.filter((p) => p.status === "active").length} active`} />
          <Metric icon={CreditCard} label="Renewals due" value={dueRenewals.length} hint={dueRenewals.length ? "Action required" : "All clear"} />
          <Metric icon={Mail} label="Zoho mailboxes" value={data.mailboxes.length} hint={`${data.mailboxes.filter((m) => m.status === "active").length} active`} />
          <Metric icon={ShieldCheck} label="Recovery verified" value={data.mailboxes.filter((m) => m.recovery_verified).length} hint={`of ${data.mailboxes.length} mailboxes`} />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
          <div className="space-y-6">
            <Panel title="Projects" description="Current progress, timing, and the next milestone.">
              {data.projects.length ? <div className="divide-y divide-border">{data.projects.map((project) => (
                <div key={project.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><h3 className="font-semibold text-brand-navy">{project.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{project.service_type} · {project.project_manager || "Project team"}</p></div>
                    <Status value={project.status} />
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-brand-orange" style={{ width: `${project.progress}%` }} /></div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{project.progress}% complete</span><span>{project.due_at ? `Due ${formatDate(project.due_at)}` : "Ongoing"}</span></div>
                  {project.next_milestone && <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-navy/5 px-3 py-2 text-xs text-brand-navy"><Clock3 className="h-4 w-4" /><span className="font-medium">Next:</span> {project.next_milestone}{project.next_milestone_at ? ` · ${formatDate(project.next_milestone_at)}` : ""}</div>}
                </div>
              ))}</div> : <Empty text="No projects have been linked yet." />}
            </Panel>

            <Panel title="Renewals & payments" description="Secure payment links open directly with the configured payment provider.">
              {data.renewals.length ? <div className="space-y-3">{data.renewals.map((renewal) => (
                <div key={renewal.id} className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-orange/15 text-brand-navy"><CalendarDays className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1"><p className="font-semibold text-brand-navy">{renewal.item_name}</p><p className="mt-0.5 text-xs text-muted-foreground">Due {formatDate(renewal.due_at)} · {renewal.description || "Service renewal"}</p></div>
                  <div className="sm:text-right"><p className="font-semibold text-brand-navy">{money(Math.max(0, renewal.amount_minor - (renewal.discount_minor || 0) - (renewal.referral_discount_minor || 0)), renewal.currency)}</p>{(renewal.discount_minor || renewal.referral_discount_minor) > 0 && <p className="text-[10px] text-emerald-700">Referral savings {money((renewal.discount_minor || 0) + (renewal.referral_discount_minor || 0), renewal.currency)}</p>}<Status value={renewal.status} /></div>
                  {(renewal.status === "due" || renewal.status === "overdue") && renewal.payment_url && <a href={renewal.payment_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2.5 text-xs font-semibold text-white">Pay renewal <ExternalLink className="h-3.5 w-3.5" /></a>}
                </div>
              ))}</div> : <Empty text="No renewals are scheduled." />}
            </Panel>
            <Panel title="Invoices & transaction history" description="Verified Razorpay payments and downloadable invoices are retained while your account is active.">
              {payments?.transactions?.length ? <div className="space-y-3">{payments.transactions.map((transaction: any) => <div key={transaction.id} className="flex flex-wrap items-center gap-3 rounded-xl border p-4"><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><ReceiptText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate font-mono text-xs font-semibold text-brand-navy">{transaction.provider_payment_id || "Payment pending"}</p><p className="mt-1 text-[11px] text-muted-foreground">{dateTime(transaction.paid_at || transaction.created_at)} · {transaction.method || "Razorpay"}</p></div><div className="text-right"><p className="text-sm font-semibold text-brand-navy">{money(transaction.amount_minor,transaction.currency)}</p><Status value={transaction.status} /></div></div>)}</div> : <Empty text="No payment transactions recorded yet." />}
              {!!payments?.invoices?.length && <div className="mt-5 border-t pt-5"><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Download invoices</h3><div className="space-y-2">{payments.invoices.map((invoice: any) => <button key={invoice.id} onClick={() => downloadInvoicePdf(invoice)} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/30"><Download className="h-4 w-4 text-brand-orange" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-brand-navy">{invoice.invoice_number}</p><p className="text-[11px] text-muted-foreground">{invoice.item_name} · {money(invoice.amount_minor,invoice.currency)}</p></div><span className="text-[11px] font-semibold text-brand-navy">PDF</span></button>)}</div></div>}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Zoho Mail" description="Mailbox status and masked recovery destinations.">
              {data.mailboxes.length ? <div className="space-y-3">{data.mailboxes.map((mailbox) => (
                <div key={mailbox.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-brand-navy">{mailbox.email_address}</p><p className="mt-0.5 text-xs text-muted-foreground">{mailbox.display_name || mailbox.plan_name || "Zoho Mail"}</p></div><Status value={mailbox.status} /></div>
                  <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                    <p>Renews: {mailbox.renewal_at ? formatDate(mailbox.renewal_at) : "Not scheduled"}</p>
                    <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Recovery: {mailbox.recovery_destination_masked || "Not configured"} {mailbox.recovery_verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}</p>
                  </div>
                </div>
              ))}</div> : <Empty text="No mailboxes have been linked." />}
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800">For security, OTP codes are never stored or displayed. Only the masked recovery destination and verification history are available.</p>
            </Panel>

            <Panel title="Contact details" description="Used for billing and project communication.">
              {editing ? <form onSubmit={(e) => { e.preventDefault(); save.mutate({ billing_name: form.billing_name, billing_email: form.billing_email, billing_phone: form.billing_phone, company: form.company }); }} className="space-y-3">
                <Input label="Contact name" value={form.billing_name || ""} onChange={(v) => setContact({ ...form, billing_name: v })} />
                <Input label="Company" value={form.company || ""} onChange={(v) => setContact({ ...form, company: v })} />
                <Input label="Billing email" type="email" value={form.billing_email || ""} onChange={(v) => setContact({ ...form, billing_email: v })} />
                <Input label="Phone" value={form.billing_phone || ""} onChange={(v) => setContact({ ...form, billing_phone: v })} />
                <div className="flex gap-2 pt-2"><button type="button" onClick={() => { setEditing(false); setContact(null); }} className="flex-1 rounded-lg border border-border px-3 py-2 text-xs">Cancel</button><button disabled={save.isPending} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white">{save.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save</button></div>
              </form> : <div className="space-y-3 text-sm"><Contact icon={Building2} label={account.company || "Company not set"} /><Contact icon={Mail} label={account.billing_email || "Email not set"} /><Contact icon={Phone} label={account.billing_phone || "Phone not set"} /><button onClick={() => { setContact(account); setEditing(true); }} className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">Edit contact details</button></div>}
            </Panel>

          </div>
        </div>
      </main>
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-semibold text-brand-navy">{title}</h2><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>{children}</section>; }
function Metric({ icon: Icon, label, value, hint }: any) { return <div className="rounded-2xl border border-border bg-background p-5 shadow-sm"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-navy/5 text-brand-navy"><Icon className="h-4 w-4" /></span><span className="text-2xl font-semibold text-brand-navy">{value}</span></div><p className="mt-4 text-xs font-semibold text-brand-navy">{label}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p></div>; }
function Status({ value }: { value: string }) { const good = ["active", "paid", "completed"].includes(value); const warn = ["due", "overdue", "on_hold"].includes(value); return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${good ? "bg-emerald-50 text-emerald-700" : warn ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{value.replace("_", " ")}</span>; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-border py-10 text-center text-xs text-muted-foreground">{text}</div>; }
function Contact({ icon: Icon, label }: any) { return <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5 text-muted-foreground"><Icon className="h-4 w-4" /><span className="truncate">{label}</span></div>; }
function Input({ label, value, onChange, type = "text" }: any) { return <label className="block"><span className="mb-1 block text-xs font-medium">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30" /></label>; }
function PortalMessage({ title, body }: { title: string; body: string }) { return <div className="grid min-h-screen place-items-center bg-[hsl(220,14%,97%)] px-6 text-center"><div className="max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm"><h1 className="text-xl font-semibold text-brand-navy">{title}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p><Link to="/" className="mt-5 inline-block rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white">Back to website</Link></div></div>; }
function formatDate(value: string) {
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime())
    ? "Not scheduled"
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
function money(amountMinor: number, currency: string) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(amountMinor / 100); }
function dateTime(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
