export type UserStatus = "เปิดใช้งาน" | "ระงับ" | "รอยืนยัน";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: UserStatus;
};

export const mockUsers: UserRow[] = [
  {
    id: "USR-001",
    name: "สมชาย ใจดี",
    email: "somchai@company.com",
    role: "ผู้ดูแลระบบ",
    department: "ไอที",
    lastLogin: "2026-06-01 09:00",
    status: "เปิดใช้งาน",
  },
  {
    id: "USR-002",
    name: "สมหญิง รักสงบ",
    email: "somying@company.com",
    role: "ผู้ตรวจสอบ",
    department: "ตรวจสอบภายใน",
    lastLogin: "2026-05-31 14:30",
    status: "เปิดใช้งาน",
  },
  {
    id: "USR-003",
    name: "วิชัย มั่นคง",
    email: "wichai@company.com",
    role: "ผู้ดูแลเรื่อง",
    department: "กฎหมาย",
    lastLogin: "2026-05-30 11:15",
    status: "ระงับ",
  },
  {
    id: "USR-004",
    name: "นภา สว่างรัศมี",
    email: "napasawad@company.com",
    role: "ผู้รับเรื่อง",
    department: "บริการลูกค้า",
    lastLogin: "2026-05-29 16:45",
    status: "รอยืนยัน",
  },
  {
    id: "USR-005",
    name: "ประเสริฐ ศรีสุข",
    email: "prasoet@company.com",
    role: "ผู้ตรวจสอบ",
    department: "ตรวจสอบภายใน",
    lastLogin: "2026-05-28 10:20",
    status: "เปิดใช้งาน",
  },
];

export const ROLES = [
  { value: "ผู้ดูแลระบบ", label: "ผู้ดูแลระบบ" },
  { value: "ผู้ตรวจสอบ", label: "ผู้ตรวจสอบ" },
  { value: "ผู้ดูแลเรื่อง", label: "ผู้ดูแลเรื่อง" },
  { value: "ผู้รับเรื่อง", label: "ผู้รับเรื่อง" },
  { value: "ผู้ใช้ทั่วไป", label: "ผู้ใช้ทั่วไป" },
];

export const DEPARTMENTS = [
  { value: "ไอที", label: "ไอที" },
  { value: "ตรวจสอบภายใน", label: "ตรวจสอบภายใน" },
  { value: "กฎหมาย", label: "กฎหมาย" },
  { value: "บริการลูกค้า", label: "บริการลูกค้า" },
  { value: "ทรัพยากรบุคคล", label: "ทรัพยากรบุคคล" },
  { value: "การเงิน", label: "การเงิน" },
];

export const USER_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
  { value: "รอยืนยัน", label: "รอยืนยัน" },
];
