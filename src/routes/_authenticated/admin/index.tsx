import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminStats } from "@/lib/admin.functions";
import { AdminShell } from "@/components/admin-shell";
import { Megaphone, Users, FileText, UserCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const fetchStats = useServerFn(adminStats);
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fetchStats() });

  const cards: Array<{ label: string; value: string | number; total?: number; icon: typeof Megaphone; to: "/admin/banners" | "/admin/team" | "/admin/blog" | "/admin/customers"; soon?: boolean }> = [
    { label: "Active banners", value: data?.activeBanners ?? "—", total: data?.banners, icon: Megaphone, to: "/admin/banners" as const },
    { label: "Team members", value: data?.teamMembers ?? "—", icon: Users, to: "/admin/team" as const },
    { label: "Blog posts", value: data?.blogPosts ?? "—", icon: FileText, to: "/admin/blog" as const },
    { label: "Customers", value: data?.customers ?? "—", icon: UserCircle, to: "/admin/customers" as const },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-navy">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quick overview of your site content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const inner = (
            <div className="group rounded-xl border border-border bg-background p-5 transition hover:border-brand-navy/30 hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-brand-navy/5 text-brand-navy">
                  <Icon className="h-4 w-4" />
                </div>
                {c.soon && <span className="text-[10px] font-semibold uppercase text-muted-foreground">Soon</span>}
              </div>
              <div className="mt-4 text-2xl font-semibold text-brand-navy">
                {c.value}
                {c.total !== undefined && <span className="text-sm text-muted-foreground"> / {c.total}</span>}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                {c.label}
                {!c.soon && <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />}
              </div>
            </div>
          );
          return c.soon ? (
            <div key={c.label}>{inner}</div>
          ) : (
            <Link key={c.label} to={c.to}>{inner}</Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-background p-6">
        <h2 className="text-base font-semibold text-brand-navy">Getting started</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Create a site-wide popup banner from <Link to="/admin/banners" className="font-medium text-brand-navy hover:underline">Popup banners</Link>.</li>
          <li>• Manage your <Link to="/admin/team" className="font-medium text-brand-navy hover:underline">Team members</Link> list, bio details and skill tags.</li>
          <li>• Write and publish <Link to="/admin/blog" className="font-medium text-brand-navy hover:underline">Blog posts</Link> to your audience.</li>
          <li>• View registered client profiles under <Link to="/admin/customers" className="font-medium text-brand-navy hover:underline">Customers</Link>.</li>
        </ul>
      </div>
    </AdminShell>
  );
}