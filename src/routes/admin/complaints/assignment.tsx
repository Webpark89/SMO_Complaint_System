import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { AssignmentPage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/assignment")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <AssignmentPage />
    </AdminLayout>
  );
}
