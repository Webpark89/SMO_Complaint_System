import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { NotificationsPage } from "@/components/admin/pages/settings";

export const Route = createFileRoute("/admin/settings/notifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <NotificationsPage />
    </AdminLayout>
  );
}
