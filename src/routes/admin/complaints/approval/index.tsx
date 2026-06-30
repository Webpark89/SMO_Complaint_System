import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { ApprovalPage } from "@/components/admin/pages/complaints/ApprovalPage";

export const Route = createFileRoute("/admin/complaints/approval/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      {/* 2. เปลี่ยนเป็น ApprovalPage */}
      <ApprovalPage />
    </AdminLayout>
  );
}
