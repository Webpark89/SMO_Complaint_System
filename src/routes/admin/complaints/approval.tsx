import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { ApprovalPage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/approval")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <ApprovalPage />
    </AdminLayout>
  );
}
