import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { SummaryReportPage } from "@/components/admin/pages/reports";

export const Route = createFileRoute("/admin/reports/summary")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <SummaryReportPage />
    </AdminLayout>
  );
}
