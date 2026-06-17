import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { SensitiveComplaintsPage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/sensitive")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <SensitiveComplaintsPage />
    </AdminLayout>
  );
}
