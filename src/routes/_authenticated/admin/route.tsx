import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminGate });
function AdminGate() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  if (user.role !== "admin" && user.role !== "editor") return <div className="grid min-h-screen place-items-center px-6 text-center"><div><h1 className="text-xl font-semibold text-brand-navy">Access denied</h1><p className="mt-2 text-sm text-muted-foreground">Your account does not have administrator access.</p><button onClick={() => navigate({ to: "/portal" })} className="mt-4 rounded-lg bg-brand-navy px-4 py-2 text-sm text-white">Customer portal</button></div></div>;
  return <Outlet />;
}
