export type RoleStatus = "เปิดใช้งาน" | "ระงับ";

export type RoleRow = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: RoleStatus;
};

export const mockRoles: RoleRow[] = [
  {
    id: "ROLE-001",
    name: "ผู้ดูแลระบบ",
    description: "สิทธิ์การจัดการระบบทั้งหมด",
    userCount: 3,
    permissions: ["จัดการผู้ใช้", "จัดการเรื่อง", "จัดการตั้งค่า", "ดูรายงาน"],
    status: "เปิดใช้งาน",
  },
  {
    id: "ROLE-002",
    name: "ผู้ตรวจสอบ",
    description: "สิทธิ์ตรวจสอบและอนุมัติเรื่อง",
    userCount: 12,
    permissions: ["ดูเรื่อง", "ตรวจสอบเรื่อง", "อนุมัติผล", "ดูรายงาน"],
    status: "เปิดใช้งาน",
  },
  {
    id: "ROLE-003",
    name: "ผู้ดูแลเรื่อง",
    description: "สิทธิ์รับเรื่องและติดตาม",
    userCount: 28,
    permissions: ["รับเรื่อง", "แก้ไขเรื่อง", "ติดตามเรื่อง"],
    status: "เปิดใช้งาน",
  },
  {
    id: "ROLE-004",
    name: "ผู้ใช้ทั่วไป",
    description: "สิทธิ์เฉพาะดูและแจ้งเรื่อง",
    userCount: 156,
    permissions: ["แจ้งเรื่อง", "ดูสถานะเรื่องของตน"],
    status: "ระงับ",
  },
];

export const ROLE_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
];
