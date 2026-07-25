import { createFileRoute } from "@tanstack/react-router";
import { AdminMediaPage } from "@/components/admin-media-page";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: () => <AdminMediaPage mode="gallery" />,
});
