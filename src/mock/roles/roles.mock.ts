export type RoleStatus = "เปิดใช้งาน" | "ปิดใช้งาน";

export type RoleRow = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: RoleStatus;
};

export const ROLE_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ปิดใช้งาน", label: "ปิดใช้งาน" },
];

export const ALL_PERMISSIONS = [
  { value: "view_complaints", label: "ดูเรื่องร้องเรียน", category: "จัดการเรื่องร้องเรียน" },
  { value: "create_complaints", label: "เพิ่มเรื่องร้องเรียน", category: "จัดการเรื่องร้องเรียน" },
  { value: "edit_complaints", label: "แก้ไขเรื่องร้องเรียน", category: "จัดการเรื่องร้องเรียน" },
  { value: "delete_complaints", label: "ลบเรื่องร้องเรียน", category: "จัดการเรื่องร้องเรียน" },
  { value: "investigate_complaints", label: "ตรวจสอบและสอบสวน", category: "จัดการเรื่องร้องเรียน" },
  { value: "approve_complaints", label: "อนุมัติผลการสอบสวน", category: "จัดการเรื่องร้องเรียน" },
  
  { value: "view_reports", label: "ดูรายงาน", category: "รายงาน" },
  { value: "export_reports", label: "ส่งออกรายงาน", category: "รายงาน" },
  
  { value: "manage_users", label: "จัดการผู้ใช้งาน", category: "ตั้งค่าระบบ" },
  { value: "manage_roles", label: "จัดการสิทธิ์การใช้งาน", category: "ตั้งค่าระบบ" },
  { value: "manage_settings", label: "จัดการตั้งค่าทั่วไป", category: "ตั้งค่าระบบ" },
] as const;

export const initialRoles: RoleRow[] = [
  {
    id: "ROLE-001",
    name: "ผู้ดูแลระบบ (Super Admin)",
    description: "ดูแลและจัดการตั้งค่าระบบทั้งหมด",
    userCount: 2,
    permissions: [
      "view_complaints",
      "create_complaints",
      "edit_complaints",
      "delete_complaints",
      "investigate_complaints",
      "approve_complaints",
      "view_reports",
      "export_reports",
      "manage_users",
      "manage_roles",
      "manage_settings",
    ],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-CS",
    name: "กลยุทธ์องค์กร",
    description: "ฝ่าย/แผนก: Corporate Strategy",
    userCount: 0,
    permissions: ["view_complaints", "create_complaints", "view_reports"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-SC",
    name: "เลขานุการบริษัท",
    description: "ฝ่าย/แผนก: Corporate Secretary",
    userCount: 0,
    permissions: ["view_complaints", "view_reports"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-RP",
    name: "จัดซื้อวัตถุดิบ",
    description: "ฝ่าย/แผนก: Raw Material Procurement",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-HR",
    name: "ทรัพยากรบุคคล",
    description: "ฝ่าย/แผนก: Human Resources",
    userCount: 0,
    permissions: ["view_complaints", "manage_users"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-DSM",
    name: "ขายและการตลาดในประเทศ",
    description: "ฝ่าย/แผนก: Domestic Sales & Marketing",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-ISM",
    name: "ขายและการตลาดต่างประเทศ",
    description: "ฝ่าย/แผนก: International Sales & Marketing",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-GP",
    name: "จัดซื้อทั่วไป",
    description: "ฝ่าย/แผนก: General Procurement",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-OS",
    name: "สำนักงานเลขานุการบริหาร",
    description: "ฝ่าย/แผนก: Board Secretariat",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-LG",
    name: "โลจิสติกส์",
    description: "ฝ่าย/แผนก: Logistics",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-QE",
    name: "บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม",
    description: "ฝ่าย/แผนก: Quality, Safety, Occupational Health & Environment",
    userCount: 0,
    permissions: ["view_complaints", "investigate_complaints"],
    status: "เปิดใช้งาน",
  },
  {
    id: "DEPT-FN",
    name: "การเงิน",
    description: "ฝ่าย/แผนก: Finance",
    userCount: 0,
    permissions: ["view_complaints"],
    status: "ปิดใช้งาน",
  },
];

export const mockCombinedRoles: RoleRow[] = [...initialRoles];

export const getUserPermissions = (userRoles: string[]): string[] => {
  if (userRoles.includes("super-admin") || userRoles.includes("admin")) {
    const adminRole = mockCombinedRoles.find((r) => r.id === "ROLE-001");
    return adminRole ? adminRole.permissions : [];
  }

  const perms = new Set<string>();
  userRoles.forEach((r) => {
    // เช่น หา DEPT-HR ถ้าบทบาทคือ hr
    const matchId = mockCombinedRoles.find(
      (role) => role.id.toLowerCase() === `dept-${r.toLowerCase()}`
    );
    if (matchId) {
      matchId.permissions.forEach((p) => perms.add(p));
    } else {
      const generalRole = mockCombinedRoles.find((role) =>
        role.name.toLowerCase().includes(r.toLowerCase())
      );
      if (generalRole) {
        generalRole.permissions.forEach((p) => perms.add(p));
      }
    }
  });

  return Array.from(perms);
};
