import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { AuditReportPage } from "@/components/admin/pages/reports";

export const Route = createFileRoute("/admin/reports/audit-log")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <AuditReportPage />
    </AdminLayout>
  );
}
