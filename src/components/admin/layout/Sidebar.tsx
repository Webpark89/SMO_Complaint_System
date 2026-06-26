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
  GitBranch,
  AlarmClock,
  Building2,
  History,
  LogOut,
  Shield,
} from "lucide-react";
import type { ReactNode } from "react";

type NavKey = string;

type NavItem = {
  key: NavKey;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }> | React.ElementType;
  group: string;
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
  },
  {
    key: "complaint_assignment",
    label: "มอบหมายและประสานงาน",
    path: "/admin/complaints/assignment",
    icon: Users,
    group: "COMPLAINTS",
  },
  {
    key: "complaint_investigation",
    label: "ตรวจสอบและสอบสวน",
    path: "/admin/complaints/investigation",
    icon: FileSearch,
    group: "COMPLAINTS",
  },
  {
    key: "complaint_approval",
    label: "อนุมัติผลการสอบสวน",
    path: "/admin/complaints/approval",
    icon: CheckCircle,
    group: "COMPLAINTS",
  },
  {
    key: "complaint_extension",
    label: "ขยายระยะเวลาดำเนินการ",
    path: "/admin/complaints/extensions",
    icon: Clock3,
    group: "COMPLAINTS",
  },
  {
    key: "sensitive_cases",
    label: "เรื่องร้องเรียนข้อมูลอ่อนไหว",
    path: "/admin/complaints/sensitive",
    icon: ShieldAlert,
    group: "COMPLAINTS",
  },
  {
    key: "documents_evidence",
    label: "เอกสารและหลักฐาน",
    path: "/admin/complaints/documents",
    icon: FolderOpen,
    group: "COMPLAINTS",
  },

  // Reports
  {
    key: "report_summary",
    label: "รายงานสรุปเรื่องร้องเรียน",
    path: "/admin/reports/summary",
    icon: BarChart3,
    group: "REPORTS",
  },
  {
    key: "report_sla",
    label: "รายงาน SLA",
    path: "/admin/reports/sla",
    icon: Timer,
    group: "REPORTS",
  },
  {
    key: "report_investigation",
    label: "รายงานผลการสอบสวน",
    path: "/admin/reports/investigation",
    icon: FileSearch,
    group: "REPORTS",
  },
  {
    key: "report_executive",
    label: "รายงานสำหรับผู้บริหาร",
    path: "/admin/reports/executive",
    icon: BriefcaseBusiness,
    group: "REPORTS",
  },
  {
    key: "report_audit_log",
    label: "รายงาน Audit Log",
    path: "/admin/reports/audit-log",
    icon: ClipboardCheck,
    group: "REPORTS",
  },

  // System Settings
  {
    key: "users",
    label: "ผู้ใช้งาน",
    path: "/admin/settings/users",
    icon: Users,
    group: "SETTINGS",
  },
  {
    key: "roles_permissions",
    label: "สิทธิ์การใช้งาน",
    path: "/admin/settings/roles",
    icon: ShieldCheck,
    group: "SETTINGS",
  },
  {
    key: "categories",
    label: "ประเภทเรื่องร้องเรียน",
    path: "/admin/settings/categories",
    icon: Layers,
    group: "SETTINGS",
  },
  {
    key: "subcategories",
    label: "หัวข้อย่อยเรื่องร้องเรียน",
    path: "/admin/settings/subcategories",
    icon: Layers3,
    group: "SETTINGS",
  },
  {
    key: "forms",
    label: "แบบฟอร์มร้องเรียน",
    path: "/admin/settings/forms",
    icon: FileText,
    group: "SETTINGS",
  },
  {
    key: "termandprivacy",
    label: "เงื่อนไขดำเนินการ",
    path: "/admin/settings/Term-Privacy",
    icon: FileText,
    group: "SETTINGS",
  },
  {
    key: "sla",
    label: "SLA",
    path: "/admin/settings/sla",
    icon: AlarmClock,
    group: "SETTINGS",
  },
  {
    key: "organizations",
    label: "หน่วยงานและโครงสร้างงองค์กร",
    path: "/admin/settings/organizations",
    icon: Building2,
    group: "SETTINGS",
  },
  {
    key: "audit_logs",
    label: "Audit Log",
    path: "/admin/settings/audit-logs",
    icon: History,
    group: "SETTINGS",
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

  return (
    <aside className="hidden h-full w-[320px] shrink-0 border-r border-[var(--border)] bg-white md:flex flex-col">
      {/* Scrollable nav items */}
      <nav className="flex-1 overflow-auto px-4 py-6 pb-22">
        {GROUPS.map((g) => {
          const items = NAV.filter((n) => g.keys.includes(n.group));
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
      {/* Logout button fixed at bottom with some margin */}
      <div className="sticky bottom-0 p-2  bg-white border-t border-[var(--border)] z-10">
        <button
          type="button"
          className="flex w-full items-center  gap-3 px-4 py-3 text-sm font-medium text-accent-500 transition-colors hover:bg-accent-50 hover:text-accent-600"
          onClick={() => {
            localStorage.removeItem("auth-token");
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
