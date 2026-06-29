import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { UsersPage } from "@/components/admin/pages/users";

export const Route = createFileRoute("/admin/settings/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  );
}