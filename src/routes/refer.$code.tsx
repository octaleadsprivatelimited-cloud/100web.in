import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CheckCircle2, Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitReferral } from "@/lib/referral.functions";

export const Route = createFileRoute("/refer/$code")({ component: ReferralLanding });

function ReferralLanding() {
  const { code } = Route.useParams();
  const submit = useServerFn(submitReferral);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", company: "", message: "" });
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { await submit({ data: { code, ...form } }); setSent(true); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Unable to submit referral"); }
    finally { setBusy(false); }
  }
  return <div className="grid min-h-screen place-items-center bg-brand-navy px-5 py-12">
    <div className="w-full max-w-lg rounded-3xl bg-background p-7 shadow-2xl sm:p-9">
      {sent ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h1 className="mt-5 text-2xl font-semibold text-brand-navy">Thank you</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Your details were sent successfully. Our team will contact you; no customer login has been created yet.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white">Visit website</Link></div> :
      <><span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-orange/20 text-brand-navy"><Gift className="h-6 w-6" /></span><h1 className="mt-5 text-3xl font-semibold tracking-tight text-brand-navy">You’ve been referred</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Share your details to receive ₹1,000 off your first eligible payment. Customer access is created later by an administrator.</p>
      <form onSubmit={save} className="mt-6 space-y-4"><Input label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} /><Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} /><div className="grid gap-4 sm:grid-cols-2"><Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} /><Input label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} /></div><label className="block"><span className="mb-1.5 block text-xs font-medium">What do you need?</span><textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30" /></label><button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-3 text-sm font-bold text-brand-navy disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Claim referral offer</button></form></>}
    </div>
  </div>;
}
function Input({ label, value, onChange, type = "text" }: any) { return <label className="block"><span className="mb-1.5 block text-xs font-medium">{label}</span><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30" /></label>; }
