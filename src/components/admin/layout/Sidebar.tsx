import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
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
import { useAuth, type AppRole } from "@/hooks/useAuth";
import { mockCombinedRoles, getUserPermissions } from "@/mock/roles/roles.mock";

type NavKey = string;

type NavItem = {
  key: NavKey;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }> | React.ElementType;
  group: string;
  requiredPermission?: string; // เปลี่ยนจาก allowedRoles เป็น requiredPermission
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
    requiredPermission: "view_complaints",
  },
  {
    key: "complaint_intake",
    label: "รับเรื่องร้องเรียน",
    path: "/admin/complaints/intake",
    icon: FilePlus,
    group: "COMPLAINTS",
    requiredPermission: "create_complaints",
  },
  {
    key: "complaint_assignment",
    label: "มอบหมายและประสานงาน",
    path: "/admin/complaints/assignment",
    icon: Users,
    group: "COMPLAINTS",
    requiredPermission: "edit_complaints",
  },
  {
    key: "complaint_investigation",
    label: "ตรวจสอบและสอบสวน",
    path: "/admin/complaints/investigation",
    icon: FileSearch,
    group: "COMPLAINTS",
    requiredPermission: "investigate_complaints",
  },
  {
    key: "complaint_approval",
    label: "อนุมัติผลการสอบสวน",
    path: "/admin/complaints/approval",
    icon: CheckCircle,
    group: "COMPLAINTS",
    requiredPermission: "approve_complaints",
  },
  {
    key: "complaint_extension",
    label: "ขยายระยะเวลาดำเนินการ",
    path: "/admin/complaints/extensions",
    icon: Clock3,
    group: "COMPLAINTS",
    requiredPermission: "investigate_complaints",
  },
  {
    key: "sensitive_cases",
    label: "เรื่องร้องเรียนข้อมูลอ่อนไหว",
    path: "/admin/complaints/sensitive",
    icon: ShieldAlert,
    group: "COMPLAINTS",
    requiredPermission: "view_complaints",
  },
  {
    key: "documents_evidence",
    label: "เอกสารและหลักฐาน",
    path: "/admin/complaints/documents",
    icon: FolderOpen,
    group: "COMPLAINTS",
    requiredPermission: "view_complaints",
  },

  // Reports
  {
    key: "report_summary",
    label: "รายงานสรุปเรื่องร้องเรียน",
    path: "/admin/reports/summary",
    icon: BarChart3,
    group: "REPORTS",
    requiredPermission: "view_reports",
  },
  {
    key: "report_sla",
    label: "รายงาน SLA",
    path: "/admin/reports/sla",
    icon: Timer,
    group: "REPORTS",
    requiredPermission: "view_reports",
  },
  {
    key: "report_investigation",
    label: "รายงานผลการสอบสวน",
    path: "/admin/reports/investigation",
    icon: FileSearch,
    group: "REPORTS",
    requiredPermission: "view_reports",
  },
  {
    key: "report_executive",
    label: "รายงานสำหรับผู้บริหาร",
    path: "/admin/reports/executive",
    icon: BriefcaseBusiness,
    group: "REPORTS",
    requiredPermission: "view_reports",
  },
  {
    key: "report_audit_log",
    label: "รายงาน Audit Log",
    path: "/admin/reports/audit-log",
    icon: ClipboardCheck,
    group: "REPORTS",
    requiredPermission: "view_reports",
  },

  // System Settings
  {
    key: "users",
    label: "ผู้ใช้งาน",
    path: "/admin/settings/users",
    icon: Users,
    group: "SETTINGS",
    requiredPermission: "manage_users",
  },
  {
    key: "roles_permissions",
    label: "สิทธิ์การใช้งาน",
    path: "/admin/settings/roles",
    icon: ShieldCheck,
    group: "SETTINGS",
    requiredPermission: "manage_roles",
  },
  {
    key: "categories",
    label: "หัวข้อหลักเรื่องร้องเรียน",
    path: "/admin/settings/categories",
    icon: Layers,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
  {
    key: "subcategories",
    label: "หัวข้อย่อยเรื่องร้องเรียน",
    path: "/admin/settings/subcategories",
    icon: Layers3,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
  {
    key: "forms",
    label: "แบบฟอร์มร้องเรียน",
    path: "/admin/settings/forms",
    icon: FileText,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
  {
    key: "termandprivacy",
    label: "เงื่อนไขดำเนินการ",
    path: "/admin/settings/Term-Privacy",
    icon: FileText,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
  {
    key: "sla",
    label: "SLA",
    path: "/admin/settings/sla",
    icon: AlarmClock,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
  {
    key: "organizations",
    label: "หน่วยงานและโครงสร้างองค์กร",
    path: "/admin/settings/organizations",
    icon: Building2,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
  {
    key: "audit_logs",
    label: "Audit Log",
    path: "/admin/settings/audit-logs",
    icon: History,
    group: "SETTINGS",
    requiredPermission: "manage_settings",
  },
];

const GROUPS: Array<{ title: string; keys: NavItem["group"][] }> = [
  { title: "แดชบอร์ด", keys: ["MAIN"] },
  { title: "จัดการเรื่องร้องเรียน", keys: ["COMPLAINTS"] },
  { title: "รายงาน", keys: ["REPORTS"] },
  { title: "ตั้งค่าระบบ", keys: ["SETTINGS"] },
];

// ดึงรายการ Permissions ทั้งหมดของผู้ใช้ตาม AppRole ถูกย้ายไปที่ roles.mock.ts แล้ว

type SidebarProps = {
  activeKey: NavKey | null;
  isCollapsed: boolean;
};

export function Sidebar({ activeKey, isCollapsed }: SidebarProps) {
  const router = useRouter();
  const { roles, signOut, loading } = useAuth();

  if (loading) {
    return (
      <aside
        className={cn(
          "hidden h-full shrink-0 border-r border-[var(--border)] bg-white md:flex flex-col items-center justify-center text-slate-400 transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[320px]"
        )}
      >
        <span className="text-sm">{isCollapsed ? "..." : "กำลังโหลดเมนู..."}</span>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 border-r border-[var(--border)] bg-white md:flex flex-col transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[320px]"
      )}
    >
      <nav
        className={cn(
          "flex-1 overflow-auto py-6 pb-22",
          isCollapsed ? "px-2" : "px-4"
        )}
      >
        {GROUPS.map((g) => {
          // กรองเมนูตามสิทธิ์การดำเนินการโดยละเอียด
          const items = NAV.filter((n) => {
            const matchesGroup = g.keys.includes(n.group);
            if (!matchesGroup) return false;

            if (!n.requiredPermission) return true;

            const userPermissions = getUserPermissions(roles);
            return userPermissions.includes(n.requiredPermission);
          });

          if (!items.length) return null;

          return (
            <div key={g.title}>
              {!isCollapsed && (
                <h3 className="px-6 text-[11px] font-bold tracking-wider text-slate-500">
                  {g.title}
                </h3>
              )}
              <div
                className={cn(
                  "mt-2 mb-5 space-y-2",
                  isCollapsed ? "px-1" : "px-3"
                )}
              >
                {items.map((item) => {
                  const isActive = item.key === activeKey;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      className={cn(
                        isActive
                          ? "relative flex items-center rounded-2xl bg-[var(--gold)]/10 py-3 text-sm font-semibold text-[#111827] shadow-soft ring-1 ring-[rgba(176,141,87,0.35)]"
                          : "flex items-center rounded-2xl bg-white py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-[var(--surface-muted)] hover:text-[#111827]",
                        isCollapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "gap-3 px-4"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {isActive && !isCollapsed && (
                        <span
                          className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[var(--gold)]"
                          aria-hidden
                        />
                      )}
                      <Icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
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
          className={cn(
            "flex items-center text-sm font-medium text-[#EF4444] transition-colors hover:bg-red-50 rounded-2xl py-3 w-full",
            isCollapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "gap-3 px-4"
          )}
          onClick={async () => {
            await signOut();
            localStorage.removeItem("auth-token");
            router.navigate({ to: "/auth" });
          }}
          title="ออกจากระบบ"
        >
          <LogOut className="h-5 w-5 text-red-500 shrink-0" />
          {!isCollapsed && <span className="truncate text-red-500">ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
}