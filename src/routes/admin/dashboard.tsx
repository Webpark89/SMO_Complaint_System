import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { DashboardPage } from "@/components/admin/pages/dashboard";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}
