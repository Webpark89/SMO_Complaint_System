import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { ExecutiveReportPage } from "@/components/admin/pages/reports";

export const Route = createFileRoute("/admin/reports/executive")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <ExecutiveReportPage />
    </AdminLayout>
  );
}
