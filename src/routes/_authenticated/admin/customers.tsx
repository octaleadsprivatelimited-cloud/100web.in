import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Building2, CalendarDays, ChevronDown, CreditCard, ExternalLink, Loader2, Mail, Phone, Plus, ReceiptText, ShieldCheck, Trash2, X } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { adminCustomerOverview, createCustomerAccount, deleteCustomerAccount } from "@/lib/customer.functions";
import { createRazorpayPaymentLink } from "@/lib/payments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/customers")({ component: CustomersPage });

function CustomersPage() {
  const list = useServerFn(adminCustomerOverview);
  const createLink = useServerFn(createRazorpayPaymentLink);
  const createCustomer = useServerFn(createCustomerAccount);
  const deleteCustomer = useServerFn(deleteCustomerAccount);
  const qc = useQueryClient();
  const { data: customers = [], isLoading, error } = useQuery<any[]>({ queryKey: ["admin-customer-overview"], queryFn: () => list() as Promise<any[]> });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const generate = useMutation({
    mutationFn: (renewalId: string) => createLink({ data: { renewalId } }),
    onSuccess: (link) => {
      toast.success("Razorpay payment link generated and copied");
      navigator.clipboard?.writeText(link.short_url);
      qc.invalidateQueries({ queryKey: ["admin-customer-overview"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const addCustomer = useMutation({ mutationFn: (value: any) => createCustomer({ data: value }), onSuccess: () => { toast.success("Customer account created"); setAdding(false); qc.invalidateQueries({ queryKey: ["admin-customer-overview"] }); }, onError: (error: Error) => toast.error(error.message) });
  const removeCustomer = useMutation({ mutationFn: (customerId: string) => deleteCustomer({ data: { customerId } }), onSuccess: () => { toast.success("Customer account and linked records deleted"); setExpanded(null); qc.invalidateQueries({ queryKey: ["admin-customer-overview"] }); }, onError: (error: Error) => toast.error(error.message) });
  const pendingPayments = customers.flatMap((customer) =>
    (customer.renewals || [])
      .filter((renewal: any) => ["upcoming", "pending", "due", "overdue"].includes(renewal.status))
      .map((renewal: any) => ({ ...renewal, customer }))
  ).sort((a: any, b: any) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
  const pendingTotal = pendingPayments.reduce((sum: number, payment: any) =>
    sum + Math.max(0, payment.amount_minor - (payment.discount_minor || 0) - (payment.referral_discount_minor || 0)), 0);

  return (
    <AdminShell title="Customer accounts">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">Super admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-navy">Customer accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Projects, renewals, Zoho mailboxes, recovery status, and contact information.</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add customer</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Summary icon={Building2} label="Customer accounts" value={customers.length} />
        <Summary icon={CreditCard} label="Pending payments" value={pendingPayments.length} />
        <Summary icon={ReceiptText} label="Outstanding amount" value={money(pendingTotal, "INR")} />
        <Summary icon={Mail} label="Managed mailboxes" value={customers.flatMap((c) => c.mailboxes || []).length} />
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-amber-200 bg-background shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/60 px-5 py-4">
          <div>
            <h2 className="font-semibold text-brand-navy">Pending customer payments</h2>
            <p className="mt-1 text-xs text-muted-foreground">Automatically ordered by due date. Expired due dates are marked overdue.</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{money(pendingTotal, "INR")} outstanding</span>
        </div>
        {isLoading ? <div className="grid min-h-32 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-brand-orange" /></div>
        : pendingPayments.length === 0 ? <div className="p-8 text-center text-sm text-emerald-700">All customer payments are up to date.</div>
        : <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground"><tr><th className="p-3.5">Customer</th><th className="p-3.5">Renewal / invoice</th><th className="p-3.5">Due date</th><th className="p-3.5">Amount pending</th><th className="p-3.5">Reminders</th><th className="p-3.5">Status</th><th className="p-3.5 text-right">Payment link</th></tr></thead>
            <tbody>{pendingPayments.map((payment: any) => {
              const netAmount = Math.max(0, payment.amount_minor - (payment.discount_minor || 0) - (payment.referral_discount_minor || 0));
              return <tr key={payment.id} className="border-t border-border">
                <td className="p-3.5"><p className="font-semibold text-brand-navy">{payment.customer.billing_name || payment.customer.company || "Unnamed customer"}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{payment.customer.account_number}</p></td>
                <td className="p-3.5"><p className="font-medium">{payment.item_name}</p><p className="mt-0.5 max-w-xs truncate text-[11px] text-muted-foreground">{payment.description || "Customer renewal"}</p></td>
                <td className="p-3.5">{date(payment.due_at)}</td>
                <td className="p-3.5 font-semibold text-brand-navy">{money(netAmount, payment.currency)}</td>
                <td className="p-3.5"><span className="font-semibold text-brand-navy">{payment.reminder_sent_count || 0}/8</span>{payment.last_reminder_at && <p className="mt-0.5 text-[10px] text-muted-foreground">Last {dateTime(payment.last_reminder_at)}</p>}</td>
                <td className="p-3.5"><StatusBadge status={payment.status} /></td>
                <td className="p-3.5"><div className="flex justify-end gap-2">
                  {payment.payment_url && <a href={payment.payment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border px-3 py-2 font-medium"><ExternalLink className="h-3 w-3" /> Open</a>}
                  <button disabled={generate.isPending} onClick={() => generate.mutate(payment.id)} className="inline-flex items-center gap-1 rounded-md bg-brand-navy px-3 py-2 font-semibold text-white disabled:opacity-50"><CreditCard className="h-3 w-3" /> {payment.payment_url ? "Regenerate" : "Generate link"}</button>
                </div></td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
      </section>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        {isLoading ? <div className="grid min-h-64 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-brand-orange" /></div>
        : error ? <div className="p-10 text-center text-sm text-red-600">{error instanceof Error ? error.message : "Unable to load customers"}</div>
        : customers.length === 0 ? <div className="p-14 text-center text-sm text-muted-foreground">No customer accounts have been created yet.</div>
        : <div className="divide-y divide-border">{customers.map((customer) => {
          const open = expanded === customer.id;
          const due = (customer.renewals || []).filter((r: any) => ["upcoming", "pending", "due", "overdue"].includes(r.status));
          return <div key={customer.id}>
            <button onClick={() => setExpanded(open ? null : customer.id)} className="grid w-full gap-4 p-5 text-left hover:bg-muted/20 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-navy/5 text-sm font-bold text-brand-navy">{(customer.billing_name || customer.company || "C").slice(0, 2).toUpperCase()}</span>
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-brand-navy">{customer.billing_name || customer.company || "Unnamed customer"}</p><p className="mt-0.5 text-xs text-muted-foreground">{customer.account_number} · {customer.status}</p></div>
              </div>
              <div className="text-xs text-muted-foreground"><p>{(customer.projects || []).length} projects · {(customer.mailboxes || []).length} mailboxes</p><p className={due.length ? "mt-1 font-semibold text-amber-700" : "mt-1 text-emerald-700"}>{due.length ? `${due.length} pending payment${due.length === 1 ? "" : "s"}` : "No pending payments"}</p></div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <div className="border-t border-border bg-muted/20 p-5">
              <div className="grid gap-5 lg:grid-cols-3">
                <Detail title="Contact details">
                  <Line icon={Building2} text={customer.company || "Company not set"} /><Line icon={Mail} text={customer.billing_email || "Email not set"} /><Line icon={Phone} text={customer.billing_phone || "Phone not set"} />
                </Detail>
                <Detail title="Projects">
                  {(customer.projects || []).length ? customer.projects.map((p: any) => <div key={p.id} className="rounded-lg border border-border bg-background p-3"><div className="flex justify-between gap-2 text-xs"><span className="font-semibold text-brand-navy">{p.status}</span><span>{p.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-brand-orange" style={{ width: `${p.progress}%` }} /></div>{p.due_at && <p className="mt-2 text-[11px] text-muted-foreground">Due {date(p.due_at)}</p>}</div>) : <Empty />}
                </Detail>
                <Detail title="Zoho Mail & recovery">
                  {(customer.mailboxes || []).length ? customer.mailboxes.map((m: any) => <div key={m.id} className="rounded-lg border border-border bg-background p-3"><p className="truncate text-xs font-semibold text-brand-navy">{m.email_address}</p><p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><ShieldCheck className="h-3 w-3" /> {m.recovery_destination_masked || "Recovery not set"} · {m.recovery_verified ? "Verified" : "Pending"}</p></div>) : <Empty />}
                </Detail>
              </div>
              {!!(customer.renewals || []).length && <div className="mt-5"><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Renewals & payment links</h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{customer.renewals.map((r: any) => <div key={r.id} className="rounded-lg border border-border bg-background p-3"><div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-brand-orange" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-brand-navy">{r.item_name}</p><p className="text-[11px] text-muted-foreground">{money(r.amount_minor, r.currency)} · {date(r.due_at)}</p></div><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] capitalize">{r.status}</span></div><div className="mt-3 flex gap-2">{r.payment_url && <a href={r.payment_url} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[11px]"><ExternalLink className="h-3 w-3" /> Open link</a>}{r.status !== "paid" && <button disabled={generate.isPending} onClick={() => generate.mutate(r.id)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-brand-navy px-2 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"><CreditCard className="h-3 w-3" /> Generate link</button>}</div></div>)}</div></div>}
              {!!(customer.transactions || []).length && <div className="mt-5"><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment history</h3><div className="overflow-x-auto rounded-lg border bg-background"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-muted/50 text-muted-foreground"><tr><th className="p-3">Transaction ID</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Date & time</th><th className="p-3">Status</th></tr></thead><tbody>{customer.transactions.map((t: any) => <tr key={t.id} className="border-t"><td className="p-3 font-mono">{t.provider_payment_id || "Pending"}</td><td className="p-3 font-semibold">{money(t.amount_minor,t.currency)}</td><td className="p-3 capitalize">{t.method || "—"}</td><td className="p-3">{dateTime(t.paid_at || t.created_at)}</td><td className="p-3 capitalize">{t.status}</td></tr>)}</tbody></table></div></div>}
              {!!(customer.invoices || []).length && <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ReceiptText className="h-4 w-4" /> {customer.invoices.length} stored invoice{customer.invoices.length === 1 ? "" : "s"}</div>}
              <div className="mt-5 border-t pt-4"><button disabled={removeCustomer.isPending} onClick={() => { if (confirm(`Delete ${customer.billing_name || customer.account_number}? This permanently removes projects, renewals, payments, invoices and portal access.`)) removeCustomer.mutate(customer.id); }} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete customer</button></div>
            </div>}
          </div>;
        })}</div>}
      </div>
      {adding && <CustomerModal saving={addCustomer.isPending} onClose={() => setAdding(false)} onSave={(value) => addCustomer.mutate(value)} />}
    </AdminShell>
  );
}

function Summary({ icon: Icon, label, value }: any) { return <div className="rounded-xl border border-border bg-background p-5"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-navy/5 text-brand-navy"><Icon className="h-4 w-4" /></span><span className="text-2xl font-semibold text-brand-navy">{value}</span></div><p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p></div>; }
function StatusBadge({ status }: { status: string }) {
  const colour = status === "overdue" ? "bg-red-100 text-red-700" : status === "due" || status === "pending" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-700";
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${colour}`}>{status}</span>;
}
function Detail({ title, children }: { title: string; children: React.ReactNode }) { return <section><h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3><div className="space-y-2">{children}</div></section>; }
function Line({ icon: Icon, text }: any) { return <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-2.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" /><span className="truncate">{text}</span></div>; }
function Empty() { return <p className="rounded-lg border border-dashed border-border p-5 text-center text-xs text-muted-foreground">No records</p>; }
function date(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)); }
function money(amount: number, currency: string) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR" }).format(amount / 100); }
function dateTime(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

function CustomerModal({ saving, onClose, onSave }: any) {
  const [value, setValue] = useState({ full_name: "", email: "", phone: "", company: "", password: "" });
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:p-4"><div className="w-full max-w-lg rounded-t-2xl bg-background shadow-xl sm:rounded-2xl"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-semibold text-brand-navy">Add customer</h2><p className="mt-1 text-xs text-muted-foreground">Creates portal access, account number and referral code.</p></div><button onClick={onClose}><X className="h-4 w-4" /></button></div><form onSubmit={(e) => { e.preventDefault(); onSave(value); }} className="space-y-4 p-5"><CustomerField label="Full name"><input required value={value.full_name} onChange={(e) => setValue({...value,full_name:e.target.value})} className="customer-input" /></CustomerField><div className="grid gap-4 sm:grid-cols-2"><CustomerField label="Email"><input required type="email" value={value.email} onChange={(e) => setValue({...value,email:e.target.value})} className="customer-input" /></CustomerField><CustomerField label="Phone"><input value={value.phone} onChange={(e) => setValue({...value,phone:e.target.value})} className="customer-input" /></CustomerField></div><CustomerField label="Company"><input value={value.company} onChange={(e) => setValue({...value,company:e.target.value})} className="customer-input" /></CustomerField><CustomerField label="Temporary password"><input required minLength={8} type="password" value={value.password} onChange={(e) => setValue({...value,password:e.target.value})} className="customer-input" /><span className="mt-1 block text-[10px] text-muted-foreground">Share securely and ask the customer to change it after first login.</span></CustomerField><div className="flex justify-end gap-2 border-t pt-4"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Create customer</button></div></form></div><style>{`.customer-input{width:100%;border:1px solid hsl(var(--border));border-radius:.45rem;background:hsl(var(--background));padding:.6rem .75rem;font-size:.85rem;outline:none}.customer-input:focus{box-shadow:0 0 0 2px oklch(.72 .17 55/.35);border-color:transparent}`}</style></div>;
}
function CustomerField({ label, children }: any) { return <label className="block"><span className="mb-1.5 block text-xs font-medium">{label}</span>{children}</label>; }
