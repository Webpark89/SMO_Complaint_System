import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { OrganizationsPage } from "@/components/admin/pages/organizations";

export const Route = createFileRoute("/admin/settings/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <OrganizationsPage />
    </AdminLayout>
  );
}
