import { useState, useRef, useEffect, memo, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import {
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Search,
  Users,
  ClipboardList,
  Layers,
  Layers3,
  Image as ImageIcon,
  FilePlus,
  FileText,
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
} from "lucide-react";

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
    icon: Search,
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
    key: "workflows",
    label: "ขั้นตอนการดำเนินงาน",
    path: "/admin/settings/workflows",
    icon: GitBranch,
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
    key: "notifications",
    label: "การแจ้งเตือน",
    path: "/admin/settings/notifications",
    icon: Bell,
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
  {
    key: "termandprivacy",
    label: "เงื่อนไขดำเนินการ",
    path: "/admin/settings/Term-Privacy",
    icon: FileText,
    group: "SETTINGS",
  },
];

const GROUPS: Array<{ title: string; keys: NavItem["group"][] }> = [
  {
    title: "แดชบอร์ด",
    keys: ["MAIN"],
  },
  {
    title: "จัดการเรื่องร้องเรียน",
    keys: ["COMPLAINTS"],
  },
  {
    title: "รายงาน",
    keys: ["REPORTS"],
  },
  {
    title: "ตั้งค่าระบบ",
    keys: ["SETTINGS"],
  },
];

function getActiveKeyFromPath(pathname: string): NavKey | null {
  // กรองเอาเฉพาะอันที่ขึ้นต้นตรงกันก่อน
  const matches = NAV.filter(
    (n) => pathname === n.path || pathname.startsWith(`${n.path}/`),
  );

  // ถ้าไม่เจอเลย
  if (matches.length === 0) return null;

  // เรียงตามความยาวของ path เพื่อเอาอันที่เจาะจงที่สุด (ยาวที่สุด) ไว้เป็นอันดับแรก
  matches.sort((a, b) => b.path.length - a.path.length);

  return matches[0].key;
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef(router.state.location.pathname);

  // Preserve scroll position per route in sessionStorage
  useEffect(() => {
    const currentPath = router.state.location.pathname;
    // Restore scroll on mount for this path
    const savedScroll = sessionStorage.getItem(`main-scroll-${currentPath}`);
    if (savedScroll && mainRef.current) {
      mainRef.current.scrollTop = parseInt(savedScroll, 10);
    }
    // Save scroll when leaving this path
    if (lastPathRef.current && lastPathRef.current !== currentPath) {
      if (mainRef.current) {
        sessionStorage.setItem(
          `main-scroll-${lastPathRef.current}`,
          mainRef.current.scrollTop.toString(),
        );
      }
    }
    lastPathRef.current = currentPath;
  }, [router.state.location.pathname]);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const activeKey = getActiveKeyFromPath(router.state.location.pathname);

  return (
    <div className="h-screen overflow-hidden bg-[var(--background)] font-sans text-[#111827]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-white/95 px-6 backdrop-blur">
        <div className="flex items-center gap-5">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold-soft)] shadow-soft ring-1 ring-[rgba(176,141,87,0.25)]">
              <ShieldCheck className="h-5 w-5 text-[#111827]" />
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-bold tracking-wide text-[#111827]">
                Complaint Management
              </div>
              <div className="text-[12px] font-medium text-slate-500">
                ผู้ดูแลระบบ (Admin)
              </div>
            </div>
          </Link>

          <div className="hidden h-5 w-px bg-[rgba(176,141,87,0.25)] sm:block" />

          <div className="hidden flex-col sm:flex">
            <div className="text-[13px] font-semibold text-[#111827]">
              {activeKey
                ? NAV.find((n) => n.key === activeKey)?.label || "Dashboard"
                : "Dashboard"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-[48px] items-center gap-3 rounded-full border border-[var(--border)] bg-white pl-4 pr-1.5 shadow-soft">
            <div className="flex flex-col justify-center leading-tight">
              <div className="text-[11px] font-bold tracking-wider text-slate-500">
                ADMIN
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--gold-soft)] text-[#111827]">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        <Sidebar activeKey={activeKey} />
        <main
          ref={mainRef}
          className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="mx-auto max-w-[1500px]">{children}</div>
          <footer className="mt-10 border-t border-[var(--border)] py-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-medium text-slate-500">
                © {new Date().getFullYear()} Complaint Management — ผู้ดูแลระบบ
                (Admin)
              </div>
              <div className="text-xs font-semibold tracking-wide text-slate-400">
                SMO
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
