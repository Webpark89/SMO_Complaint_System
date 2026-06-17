import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { SLAReportPage } from "@/components/admin/pages/reports";

export const Route = createFileRoute("/admin/reports/sla")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <SLAReportPage />
    </AdminLayout>
  );
}
