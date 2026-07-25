import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { acceptInvite } from "@/lib/auth.functions";

export const Route = createFileRoute("/invite")({
  validateSearch: (search: Record<string, unknown>) => ({ token: typeof search.token === "string" ? search.token : "" }),
  component: InviteSignup,
});

function InviteSignup() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const accept = useServerFn(acceptInvite);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return toast.error("This invitation link is incomplete.");
    setBusy(true);
    try {
      await accept({ data: { token, email, password, full_name: name } });
      toast.success("Customer account created.");
      navigate({ to: "/portal" });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to accept invitation"); }
    finally { setBusy(false); }
  }
  return <div className="grid min-h-screen place-items-center bg-[hsl(220,14%,97%)] px-5 py-10"><div className="w-full max-w-md rounded-2xl border border-border bg-background p-7 shadow-xl">
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-orange/15 text-brand-navy"><ShieldCheck className="h-5 w-5" /></span>
    <h1 className="mt-5 text-2xl font-semibold text-brand-navy">Accept customer invitation</h1>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">Create your customer portal login. This invitation can be used once.</p>
    {!token ? <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">Invalid invitation link. Ask the administrator for a new link.</div> :
    <form onSubmit={submit} className="mt-6 space-y-4"><Input label="Full name" value={name} onChange={setName} /><Input label="Invited email" type="email" value={email} onChange={setEmail} /><Input label="Create password" type="password" value={password} onChange={setPassword} minLength={8} /><button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Create customer account</button></form>}
    <Link to="/auth" className="mt-5 block text-center text-xs font-medium text-brand-navy hover:underline">Already have access? Sign in</Link>
  </div></div>;
}
function Input({ label, value, onChange, type = "text", minLength }: any) { return <label className="block"><span className="mb-1.5 block text-xs font-medium">{label}</span><input required type={type} minLength={minLength} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30" /></label>; }
