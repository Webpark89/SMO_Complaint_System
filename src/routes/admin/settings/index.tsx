import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";

const SETTINGS_ITEMS = [
  {
    label: "ผู้ใช้งาน",
    path: "/admin/settings/users",
    description: "จัดการผู้ใช้งานระบบ",
  },
  {
    label: "สิทธิ์การใช้งาน",
    path: "/admin/settings/roles",
    description: "กำหนดบทบาทและสิทธิ์",
  },
  {
    label: "ประเภทเรื่องร้องเรียน",
    path: "/admin/settings/categories",
    description: "จัดการประเภทหลัก",
  },
  {
    label: "หัวข้อย่อยเรื่องร้องเรียน",
    path: "/admin/settings/subcategories",
    description: "จัดการหัวข้อย่อย",
  },
  {
    label: "แบบฟอร์มร้องเรียน",
    path: "/admin/settings/forms",
    description: "กำหนดฟอร์มและช่องข้อมูล",
  },
  {
    label: "ขั้นตอนการดำเนินงาน",
    path: "/admin/settings/workflows",
    description: "ตั้งค่าขั้นตอนการทำงาน",
  },
  {
    label: "SLA",
    path: "/admin/settings/sla",
    description: "กำหนดระยะเวลามาตรฐาน",
  },
  {
    label: "การแจ้งเตือน",
    path: "/admin/settings/notifications",
    description: "ตั้งค่าการแจ้งเตือน",
  },
  {
    label: "หน่วยงานและโครงเพิ่มองค์กร",
    path: "/admin/settings/organizations",
    description: "จัดการโครงเพิ่มองค์กร",
  },
  {
    label: "Audit Log",
    path: "/admin/settings/audit-logs",
    description: "บันทึกการใช้งานระบบ",
  },
  {
    label: "เงื่อนไขและความเป็นส่วนตัว",
    path: "/admin/settings/Term-Privacy",
    description: "จัดการเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว",
  },
];

export const Route = createFileRoute("/admin/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              ตั้งค่าระบบ
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              จัดการการตั้งค่าทั้งหมดของระบบ
            </p>
          </div>
          <div className="flex gap-2"></div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SETTINGS_ITEMS.map((item) => (
            <div
              key={item.path}
              className="border-[var(--border)] bg-white shadow-soft transition-shadow hover:shadow-elegant cursor-pointer rounded-xl p-4"
            >
              <div className="text-base text-[#111827] font-semibold">
                {item.label}
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
