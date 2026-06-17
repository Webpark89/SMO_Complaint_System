import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { TermPrivacyPage } from "@/components/admin/pages/settings/Term-Privacy";

export const Route = createFileRoute("/admin/settings/Term-Privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <TermPrivacyPage />
    </AdminLayout>
  );
}
