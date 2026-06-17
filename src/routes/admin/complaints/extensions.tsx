import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { ExtensionsPage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/extensions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <ExtensionsPage />
    </AdminLayout>
  );
}
