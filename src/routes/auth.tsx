import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { getSessionUser, login } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — 100 Web Technologies" },
    { name: "description", content: "Sign in to your administrator or customer portal." },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const loginFn = useServerFn(login);
  const sessionFn = useServerFn(getSessionUser);

  useEffect(() => {
    sessionFn().then((user) => { if (user) navigate({ to: user.role === "customer" ? "/portal" : "/admin", replace: true }); });
  }, [navigate, sessionFn]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await loginFn({ data: { email, password } });
      navigate({ to: user.role === "customer" ? "/portal" : "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally { setBusy(false); }
  }

  return <div className="grid min-h-screen bg-background lg:grid-cols-2">
    <div className="hidden flex-col justify-between bg-brand-navy p-12 text-white lg:flex">
      <Link to="/" className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-orange font-black text-brand-navy">100</span><span className="text-lg font-semibold">100 Web Technologies</span></Link>
      <div><h2 className="text-3xl font-bold leading-tight">Your projects, renewals and services in one secure workspace.</h2><p className="mt-4 text-white/70">Customer access is provisioned and managed by the website administrator.</p></div>
      <p className="text-xs text-white/50">© {new Date().getFullYear()} 100 Web Technologies</p>
    </div>
    <div className="flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-orange/15 text-brand-navy"><ShieldCheck className="h-5 w-5" /></span>
        <h1 className="mt-5 text-2xl font-semibold text-brand-navy">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Access is available by administrator invitation only.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" /></Field>
          <Field label="Password"><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" /></Field>
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in</button>
        </form>
        <p className="mt-6 rounded-lg bg-muted/60 px-4 py-3 text-center text-xs leading-5 text-muted-foreground">New customer accounts can only be created from a single-use invitation sent by the website administrator.</p>
      </div>
      <style>{`.auth-input{width:100%;border:1px solid hsl(var(--border));border-radius:.5rem;padding:.65rem .75rem;font-size:.875rem;outline:none}.auth-input:focus{box-shadow:0 0 0 2px oklch(.72 .17 55 / .35);border-color:transparent}`}</style>
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-medium">{label}</span>{children}</label>; }
