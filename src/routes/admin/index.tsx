import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            ยินดีต้อนรับสู่ระบบจัดการเรื่องร้องเรียน
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
