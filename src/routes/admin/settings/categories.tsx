import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { CategoriesPage } from "@/components/admin/pages/settings";

export const Route = createFileRoute("/admin/settings/categories")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <CategoriesPage />
    </AdminLayout>
  );
}
