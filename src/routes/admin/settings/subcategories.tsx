import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { SubcategoriesPage } from "@/components/admin/pages/settings";

export const Route = createFileRoute("/admin/settings/subcategories")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <SubcategoriesPage />
    </AdminLayout>
  );
}
