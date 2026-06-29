import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  ClipboardList,
  Layers,
  Layers3,
  FileText,
  FilePlus,
  FileSearch,
  CheckCircle,
  Clock3,
  ShieldAlert,
  FolderOpen,
  BarChart3,
  Timer,
  BriefcaseBusiness,
  ClipboardCheck,
  AlarmClock,
  Building2,
  History,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth, type AppRole } from "@/hooks/useAuth"; // ตรวจสอบ Path ให้ตรงกับโปรเจกต์ของคุณ

type NavKey = string;

type NavItem = {
  key: NavKey;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }> | React.ElementType;
  group: string;
  allowedRoles?: AppRole[]; // เพิ่มฟิลด์สำหรับจัดการสิทธิ์
};

const NAV: NavItem[] = [
  // Dashboard
  {
    key: "dashboard",
    label: "แดชบอร์ด",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    group: "MAIN",
  },

  // Complaint Management
  {
    key: "complaint_list",
    label: "รายการเรื่องร้องเรียน",
    path: "/admin/complaints",
    icon: ClipboardList,
    group: "COMPLAINTS",
  },
  {
    key: "complaint_intake",
    label: "รับเรื่องร้องเรียน",
    path: "/admin/complaints/intake",
    icon: FilePlus,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "complaint_assignment",
    label: "มอบหมายและประสานงาน",
    path: "/admin/complaints/assignment",
    icon: Users,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "complaint_investigation",
    label: "ตรวจสอบและสอบสวน",
    path: "/admin/complaints/investigation",
    icon: FileSearch,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "complaint_approval",
    label: "อนุมัติผลการสอบสวน",
    path: "/admin/complaints/approval",
    icon: CheckCircle,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "complaint_extension",
    label: "ขยายระยะเวลาดำเนินการ",
    path: "/admin/complaints/extensions",
    icon: Clock3,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "sensitive_cases",
    label: "เรื่องร้องเรียนข้อมูลอ่อนไหว",
    path: "/admin/complaints/sensitive",
    icon: ShieldAlert,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "compliance"], // ตัวอย่างการจำกัดสิทธิ์
  },
  {
    key: "documents_evidence",
    label: "เอกสารและหลักฐาน",
    path: "/admin/complaints/documents",
    icon: FolderOpen,
    group: "COMPLAINTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },

  // Reports
  {
    key: "report_summary",
    label: "รายงานสรุปเรื่องร้องเรียน",
    path: "/admin/reports/summary",
    icon: BarChart3,
    group: "REPORTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "report_sla",
    label: "รายงาน SLA",
    path: "/admin/reports/sla",
    icon: Timer,
    group: "REPORTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "report_investigation",
    label: "รายงานผลการสอบสวน",
    path: "/admin/reports/investigation",
    icon: FileSearch,
    group: "REPORTS",
    allowedRoles: ["super-admin", "admin", "manager"],
  },
  {
    key: "report_executive",
    label: "รายงานสำหรับผู้บริหาร",
    path: "/admin/reports/executive",
    icon: BriefcaseBusiness,
    group: "REPORTS",
    allowedRoles: ["super-admin", "admin", "manager"], // ตัวอย่างการจำกัดสิทธิ์
  },
  {
    key: "report_audit_log",
    label: "รายงาน Audit Log",
    path: "/admin/reports/audit-log",
    icon: ClipboardCheck,
    group: "REPORTS",
    allowedRoles: ["super-admin", "admin", "auditor"], // ตัวอย่างการจำกัดสิทธิ์
  },

  // System Settings
  {
    key: "users",
    label: "ผู้ใช้งาน",
    path: "/admin/settings/users",
    icon: Users,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "roles_permissions",
    label: "สิทธิ์การใช้งาน",
    path: "/admin/settings/roles",
    icon: ShieldCheck,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "categories",
    label: "ประเภทเรื่องร้องเรียน",
    path: "/admin/settings/categories",
    icon: Layers,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "subcategories",
    label: "หัวข้อย่อยเรื่องร้องเรียน",
    path: "/admin/settings/subcategories",
    icon: Layers3,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "forms",
    label: "แบบฟอร์มร้องเรียน",
    path: "/admin/settings/forms",
    icon: FileText,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "termandprivacy",
    label: "เงื่อนไขดำเนินการ",
    path: "/admin/settings/Term-Privacy",
    icon: FileText,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "sla",
    label: "SLA",
    path: "/admin/settings/sla",
    icon: AlarmClock,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "organizations",
    label: "หน่วยงานและโครงสร้างงองค์กร",
    path: "/admin/settings/organizations",
    icon: Building2,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin"],
  },
  {
    key: "audit_logs",
    label: "Audit Log",
    path: "/admin/settings/audit-logs",
    icon: History,
    group: "SETTINGS",
    allowedRoles: ["super-admin", "admin", "auditor"],
  },
];

const GROUPS: Array<{ title: string; keys: NavItem["group"][] }> = [
  { title: "แดชบอร์ด", keys: ["MAIN"] },
  { title: "จัดการเรื่องร้องเรียน", keys: ["COMPLAINTS"] },
  { title: "รายงาน", keys: ["REPORTS"] },
  { title: "ตั้งค่าระบบ", keys: ["SETTINGS"] },
];

type SidebarProps = { activeKey: NavKey | null };

export function Sidebar({ activeKey }: SidebarProps) {
  const router = useRouter();
  const { roles, signOut, loading } = useAuth(); // นำ roles และ signOut มาใช้งาน

  // ถ้าต้องการโหลดข้อมูลให้เสร็จก่อนเรนเดอร์เมนู
  if (loading) {
    return (
      <aside className="hidden h-full w-[320px] shrink-0 border-r border-[var(--border)] bg-white md:flex flex-col items-center justify-center text-slate-400">
        <span className="text-sm">กำลังโหลดเมนู...</span>
      </aside>
    );
  }

  return (
    <aside className="hidden h-full w-[320px] shrink-0 border-r border-[var(--border)] bg-white md:flex flex-col">
      <nav className="flex-1 overflow-auto px-4 py-6 pb-22">
        {GROUPS.map((g) => {
          // กรองเมนูตาม Role
          const items = NAV.filter(
            (n) =>
              g.keys.includes(n.group) &&
              (!n.allowedRoles || n.allowedRoles.some((r) => roles.includes(r)))
          );

          if (!items.length) return null;

          return (
            <div key={g.title}>
              <h3 className="px-6 text-[11px] font-bold tracking-wider text-slate-500">
                {g.title}
              </h3>
              <div className="mt-2 mb-5 space-y-2 px-3">
                {items.map((item) => {
                  const isActive = item.key === activeKey;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      className={
                        isActive
                          ? "relative flex items-center gap-3 rounded-2xl bg-[var(--gold)]/10 px-4 py-3 text-sm font-semibold text-[#111827] shadow-soft ring-1 ring-[rgba(176,141,87,0.35)]"
                          : "flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-[var(--surface-muted)] hover:text-[#111827]"
                      }
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[var(--gold)]"
                          aria-hidden
                        />
                      )}
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="sticky bottom-0 p-2 bg-white border-t border-[var(--border)] z-10">
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-accent-500 transition-colors hover:bg-accent-50 hover:text-accent-600"
          onClick={async () => {
            await signOut(); // ใช้ฟังก์ชันจาก Auth Context
            localStorage.removeItem("auth-token"); // เผื่อมีการใช้งาน token แยก
            router.navigate({ to: "/auth" });
          }}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span className="truncate text-red-500">ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}