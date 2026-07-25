import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Copy, Gift, Link2, Loader2, Mail, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { createCustomerInvite, createReferralCode, listReferralAdmin, setReferralPaid } from "@/lib/referral.functions";

export const Route = createFileRoute("/_authenticated/admin/referrals")({ component: ReferralAdmin });

function ReferralAdmin() {
  const qc = useQueryClient();
  const load = useServerFn(listReferralAdmin);
  const inviteFn = useServerFn(createCustomerInvite);
  const codeFn = useServerFn(createReferralCode);
  const paidFn = useServerFn(setReferralPaid);
  const { data, isLoading } = useQuery<any>({ queryKey: ["referral-admin"], queryFn: () => load() });
  const [invite, setInvite] = useState({ email: "", full_name: "", company: "", referral_lead_id: "" });
  const [code, setCode] = useState({ customer_id: "", code: "" });
  const [lastInvite, setLastInvite] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["referral-admin"] });
  const inviteMutation = useMutation({
    mutationFn: () => inviteFn({ data: { ...invite, referral_lead_id: invite.referral_lead_id || null } }),
    onSuccess: (row: any) => { setLastInvite(`${window.location.origin}/invite?token=${row.token}`); setInvite({ email: "", full_name: "", company: "", referral_lead_id: "" }); refresh(); toast.success("Invitation created"); },
    onError: showError,
  });
  const codeMutation = useMutation({
    mutationFn: () => codeFn({ data: code }),
    onSuccess: () => { setCode({ customer_id: "", code: "" }); refresh(); toast.success("Referral link created"); },
    onError: showError,
  });
  const paidMutation = useMutation({
    mutationFn: ({ lead, customerId }: { lead: any; customerId: string }) => paidFn({ data: { lead_id: lead.id, referred_customer_id: customerId, payment_minor: 100000 } }),
    onSuccess: () => { refresh(); toast.success("Referral marked paid and ₹1,000 reward unlocked"); },
    onError: showError,
  });

  return <AdminShell title="Invites & referrals">
    <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">Super admin</p><h1 className="mt-2 text-2xl font-semibold text-brand-navy">Customer invitations & referrals</h1><p className="mt-1 text-sm text-muted-foreground">Control account access, referral leads, and payment-triggered ₹1,000 rewards.</p></div>
    <div className="grid gap-5 xl:grid-cols-2">
      <Card icon={UserPlus} title="Create customer invitation" description="Single-use link; public signup remains disabled.">
        <form onSubmit={(e) => { e.preventDefault(); inviteMutation.mutate(); }} className="space-y-3">
          <Input label="Full name" value={invite.full_name} onChange={(v) => setInvite({ ...invite, full_name: v })} />
          <div className="grid gap-3 sm:grid-cols-2"><Input label="Email" type="email" value={invite.email} onChange={(v) => setInvite({ ...invite, email: v })} /><Input label="Company" value={invite.company} onChange={(v) => setInvite({ ...invite, company: v })} /></div>
          <label className="block"><span className="mb-1 block text-xs font-medium">Referral lead (optional)</span><select value={invite.referral_lead_id} onChange={(e) => { const lead = data?.leads?.find((l: any) => l.id === e.target.value); setInvite({ ...invite, referral_lead_id: e.target.value, email: lead?.email || invite.email, full_name: lead?.full_name || invite.full_name, company: lead?.company || invite.company }); }} className="admin-field"><option value="">Not linked to a referral</option>{data?.leads?.filter((l: any) => !["paid","rejected"].includes(l.status)).map((l: any) => <option key={l.id} value={l.id}>{l.full_name} — {l.email}</option>)}</select></label>
          <button disabled={inviteMutation.isPending} className="primary-button">{inviteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create invite</button>
        </form>
        {lastInvite && <div className="mt-4 rounded-lg bg-emerald-50 p-3"><p className="text-xs font-semibold text-emerald-800">Invitation link</p><div className="mt-1 flex items-center gap-2"><code className="min-w-0 flex-1 truncate text-[11px] text-emerald-700">{lastInvite}</code><button onClick={() => navigator.clipboard.writeText(lastInvite)} className="grid h-7 w-7 place-items-center rounded bg-white text-emerald-700"><Copy className="h-3.5 w-3.5" /></button></div></div>}
      </Card>
      <Card icon={Link2} title="Create referral link" description="Assign one reusable referral code to a customer.">
        <form onSubmit={(e) => { e.preventDefault(); codeMutation.mutate(); }} className="space-y-3">
          <label className="block"><span className="mb-1 block text-xs font-medium">Customer</span><select required value={code.customer_id} onChange={(e) => setCode({ ...code, customer_id: e.target.value })} className="admin-field"><option value="">Select customer</option>{data?.accounts?.map((a: any) => <option key={a.id} value={a.id}>{a.billing_name || a.company || a.account_number}</option>)}</select></label>
          <Input label="Referral code" value={code.code} onChange={(v) => setCode({ ...code, code: v.toUpperCase().replace(/[^A-Z0-9-]/g, "") })} placeholder="e.g. ACME100" />
          <button disabled={codeMutation.isPending} className="primary-button">{codeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />} Create referral link</button>
        </form>
        <div className="mt-4 space-y-2">{data?.codes?.map((item: any) => <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-3"><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-brand-navy">{item.customer?.billing_name || item.customer?.company || item.customer?.account_number}</p><p className="truncate text-[11px] text-muted-foreground">{window.location.origin}/refer/{item.code}</p></div><button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/refer/${item.code}`)}><Copy className="h-4 w-4 text-muted-foreground" /></button></div>)}</div>
      </Card>
    </div>

    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="border-b border-border p-5"><h2 className="font-semibold text-brand-navy">Referral leads</h2><p className="mt-1 text-xs text-muted-foreground">The referrer reward unlocks only after a referred customer payment is confirmed.</p></div>
      {isLoading ? <div className="grid min-h-48 place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div> : !data?.leads?.length ? <div className="p-12 text-center text-sm text-muted-foreground">No referral leads yet.</div> :
      <div className="divide-y divide-border">{data.leads.map((lead: any) => <Lead key={lead.id} lead={lead} accounts={data.accounts} onPaid={(customerId) => paidMutation.mutate({ lead, customerId })} />)}</div>}
    </div>
    <style>{`.admin-field{width:100%;border:1px solid hsl(var(--border));border-radius:.5rem;padding:.58rem .7rem;font-size:.8rem;background:hsl(var(--background));outline:none}.primary-button{display:flex;width:100%;align-items:center;justify-content:center;gap:.5rem;border-radius:.5rem;background:hsl(var(--brand-navy));padding:.65rem 1rem;font-size:.8rem;font-weight:600;color:white}.primary-button:disabled{opacity:.6}`}</style>
  </AdminShell>;
}

function Lead({ lead, accounts, onPaid }: any) {
  const [customerId, setCustomerId] = useState(lead.referred_customer_id || "");
  return <div className="grid gap-4 p-5 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center"><div><p className="text-sm font-semibold text-brand-navy">{lead.full_name}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {lead.email} · {lead.company || "No company"}</p></div><div className="text-xs text-muted-foreground"><p>Referred by</p><p className="mt-1 font-semibold text-brand-navy">{lead.referrer?.billing_name || lead.referrer?.company || lead.referrer?.account_number}</p></div><div><span className={`rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${lead.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{lead.status}</span></div>{lead.status !== "paid" ? <div className="flex gap-2"><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="admin-field"><option value="">Referred customer</option>{accounts.map((a: any) => <option key={a.id} value={a.id}>{a.billing_name || a.company || a.account_number}</option>)}</select><button disabled={!customerId} onClick={() => onPaid(customerId)} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"><CheckCircle2 className="h-3.5 w-3.5" /> Paid</button></div> : <span className="text-xs font-semibold text-emerald-700">₹1,000 reward issued</span>}</div>;
}
function Card({ icon: Icon, title, description, children }: any) { return <section className="rounded-xl border border-border bg-background p-5 shadow-sm"><div className="mb-5 flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-orange/15 text-brand-navy"><Icon className="h-4 w-4" /></span><div><h2 className="text-sm font-semibold text-brand-navy">{title}</h2><p className="mt-0.5 text-xs text-muted-foreground">{description}</p></div></div>{children}</section>; }
function Input({ label, value, onChange, type = "text", placeholder }: any) { return <label className="block"><span className="mb-1 block text-xs font-medium">{label}</span><input required type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="admin-field" /></label>; }
function showError(error: unknown) { toast.error(error instanceof Error ? error.message : "Action failed"); }
