import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { IntakePage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/intake")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <IntakePage />
    </AdminLayout>
  );
}
