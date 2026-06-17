import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { FormsPage } from "@/components/admin/pages/settings";

export const Route = createFileRoute("/admin/settings/forms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <FormsPage />
    </AdminLayout>
  );
}
