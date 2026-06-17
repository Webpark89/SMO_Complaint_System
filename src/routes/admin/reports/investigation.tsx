import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { InvestigationReportPage } from "@/components/admin/pages/reports";

export const Route = createFileRoute("/admin/reports/investigation")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <InvestigationReportPage />
    </AdminLayout>
  );
}
