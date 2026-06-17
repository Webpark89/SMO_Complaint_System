import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { DocumentsPage } from "@/components/admin/pages/complaints";

export const Route = createFileRoute("/admin/complaints/documents")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <DocumentsPage />
    </AdminLayout>
  );
}
