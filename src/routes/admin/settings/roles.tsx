import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { RolesPage } from "@/components/admin/pages/settings";

export const Route = createFileRoute("/admin/settings/roles")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <RolesPage />
    </AdminLayout>
  );
}
