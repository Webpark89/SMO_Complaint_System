import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { ReportsPage } from "@/components/admin/pages/reports";

export const Route = createFileRoute("/admin/reports/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <ReportsPage />
    </AdminLayout>
  );
}
