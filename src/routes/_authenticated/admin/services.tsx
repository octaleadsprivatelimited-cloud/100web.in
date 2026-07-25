import { createFileRoute } from "@tanstack/react-router";
import { AdminManagedPages } from "@/components/admin-managed-pages";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => <AdminManagedPages kind="service" />,
});
