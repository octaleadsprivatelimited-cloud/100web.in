import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Megaphone, Users, FileText, Building2, Wrench, UserCircle, Menu, X, LogOut, Images, Youtube, Gift, ContactRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useServerFn } from "@tanstack/react-start";
import { logout } from "@/lib/auth.functions";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  disabled?: boolean;
};

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/banners", label: "Popup banners", icon: Megaphone },
  { to: "/admin/team", label: "Employees", icon: Users },
  { to: "/admin/blog", label: "Blogs & articles", icon: FileText },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/videos", label: "YouTube videos", icon: Youtube },
  { to: "/admin/industries", label: "Industries", icon: Building2 },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/crm", label: "CRM & automation", icon: ContactRound },
  { to: "/admin/customers", label: "Customers", icon: UserCircle },
  { to: "/admin/referrals", label: "Invites & referrals", icon: Gift },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const signOutFn = useServerFn(logout);
  const { user } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await signOutFn();
    navigate({ to: "/auth", replace: true });
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  useEffect(() => {
    const refreshActiveData = () => queryClient.invalidateQueries({ refetchType: "active" });
    const interval = window.setInterval(refreshActiveData, 8_000);
    window.addEventListener("focus", refreshActiveData);
    window.addEventListener("online", refreshActiveData);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshActiveData);
      window.removeEventListener("online", refreshActiveData);
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-[hsl(220,14%,97%)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded bg-brand-orange text-xs font-black text-brand-navy">100</span>
            <span className="hidden text-sm font-semibold text-brand-navy sm:block">Admin</span>
          </Link>
          <span className="ml-2 hidden text-sm text-muted-foreground sm:block">/ {title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live sync
          </span>
          <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground sm:block">{user?.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-border bg-background lg:block">
          <SidebarNav pathname={pathname} isActive={isActive} onNav={() => {}} />
        </aside>

        {/* Sidebar - mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-64 bg-background shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <span className="text-sm font-semibold text-brand-navy">Menu</span>
                <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarNav pathname={pathname} isActive={isActive} onNav={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname: _p,
  isActive,
  onNav,
}: {
  pathname: string;
  isActive: (to: string, exact?: boolean) => boolean;
  onNav: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to, item.exact);
        const disabled = item.disabled;
        if (disabled) {
          return (
            <div
              key={item.to}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground/60"
              title="Coming soon"
            >
              <Icon className="h-4 w-4" />
              {item.label}
              <span className="ml-auto text-[10px] uppercase tracking-wider">soon</span>
            </div>
          );
        }
        return (
          <Link
            key={item.to}
            to={item.to as any}
            onClick={onNav}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
              active
                ? "bg-brand-navy text-white"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
