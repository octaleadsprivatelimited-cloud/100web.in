import { createFileRoute } from "@tanstack/react-router";
import { AdminManagedPages } from "@/components/admin-managed-pages";

export const Route = createFileRoute("/_authenticated/admin/industries")({
  component: () => <AdminManagedPages kind="industry" />,
});
