import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { ComplaintsPage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <ComplaintsPage />
    </AdminLayout>
  );
}
