import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { SLASettingsPage } from "@/components/admin/pages/settings";

export const Route = createFileRoute("/admin/settings/sla")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <SLASettingsPage />
    </AdminLayout>
  );
}
