export type LogStatus = "สำเร็จ" | "ล้มเหลว" | "กำลังดำเนินการ" | "ระงับ";

export type LogRow = {
  id: string;
  timestamp: string;
  username: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: LogStatus;
  description: string;
};

export const mockAuditLogs: LogRow[] = [
  {
    id: "LOG-001",
    timestamp: "2026-06-02 09:15:23",
    username: "admin",
    userRole: "admin",
    action: "เข้าสู่ระบบ",
    module: "ระบบยืนยันตัวตน",
    ipAddress: "192.168.1.101",
    status: "สำเร็จ",
    description: "เข้าสู่ระบบสำเร็จ",
  },

  {
    id: "LOG-002",
    timestamp: "2026-06-02 09:16:05",
    username: "สมชาย ใจดี",
    userRole: "officer",
    action: "เพิ่มเรื่องร้องเรียน",
    module: "จัดการเรื่องร้องเรียน",
    ipAddress: "192.168.1.102",
    status: "สำเร็จ",
    description: "เพิ่มเรื่องร้องเรียน C-2026-156",
  },

  {
    id: "LOG-003",
    timestamp: "2026-06-02 09:18:33",
    username: "สมหญิง รักสงบ",
    userRole: "manager",
    action: "อนุมัติเรื่อง",
    module: "การอนุมัติ",
    ipAddress: "192.168.1.103",
    status: "สำเร็จ",
    description: "อนุมัติเรื่อง APR-001",
  },

  {
    id: "LOG-004",
    timestamp: "2026-06-02 09:20:11",
    username: "วิชัย มั่นคง",
    userRole: "auditor",
    action: "ดูรายงาน",
    module: "รายงาน SLA",
    ipAddress: "192.168.1.104",
    status: "สำเร็จ",
    description: "เรียกดูรายงาน SLA ประจำเดือน",
  },

  {
    id: "LOG-005",
    timestamp: "2026-06-02 09:22:45",
    username: "unknown",
    userRole: "unknown",
    action: "พยายามเข้าสู่ระบบ",
    module: "ระบบยืนยันตัวตน",
    ipAddress: "203.0.113.50",
    status: "ล้มเหลว",
    description: "ใช้รหัสผ่านไม่ถูกต้อง",
  },

  {
    id: "LOG-006",
    timestamp: "2026-06-02 09:25:00",
    username: "นภา สว่างรัศมี",
    userRole: "investigator",
    action: "ปรับปรุงสถานะ",
    module: "งานสืบสวน",
    ipAddress: "192.168.1.105",
    status: "สำเร็จ",
    description: "ปรับปรุงสถานะเป็น กำลังสืบสวน",
  },

  {
    id: "LOG-007",
    timestamp: "2026-06-02 09:28:17",
    username: "ประเสริฐ ศรีสุข",
    userRole: "auditor",
    action: "ส่งออกรายงาน",
    module: "รายงานตรวจสอบ",
    ipAddress: "192.168.1.106",
    status: "สำเร็จ",
    description: "ส่งออกรายงาน AUD-001 เป็น PDF",
  },

  {
    id: "LOG-008",
    timestamp: "2026-06-02 09:30:42",
    username: "admin",
    userRole: "admin",
    action: "ตั้งค่าระบบ",
    module: "การตั้งค่า",
    ipAddress: "192.168.1.101",
    status: "สำเร็จ",
    description: "ปรับปรุงค่า SLA threshold",
  },

  {
    id: "LOG-009",
    timestamp: "2026-06-02 09:33:08",
    username: "มานะ มั่นคง",
    userRole: "officer",
    action: "ปฏิเสธเรื่อง",
    module: "การอนุมัติ",
    ipAddress: "192.168.1.107",
    status: "สำเร็จ",
    description: "ปฏิเสธเรื่อง APR-005 ขาดเอกสาร",
  },

  {
    id: "LOG-010",
    timestamp: "2026-06-02 09:35:55",
    username: "สมชาย ใจดี",
    userRole: "officer",
    action: "ขยายเวลา",
    module: "การขยายเวลา",
    ipAddress: "192.168.1.102",
    status: "สำเร็จ",
    description: "ขยายเวลา EXT-003 ออกไป 7 วัน",
  },

  {
    id: "LOG-011",
    timestamp: "2026-06-02 09:40:12",
    username: "unknown",
    userRole: "unknown",
    action: "พยายามเข้าถึงข้อมูล",
    module: "ระบบความปลอดภัย",
    ipAddress: "203.0.113.51",
    status: "ล้มเหลว",
    description: "เข้าถึงข้อมูลโดยไม่ได้รับอนุญาต",
  },

  {
    id: "LOG-012",
    timestamp: "2026-06-02 09:45:30",
    username: "สมหญิง รักสงบ",
    userRole: "manager",
    action: "อนุมัติเรื่องลับ",
    module: "เรื่องลับ",
    ipAddress: "192.168.1.103",
    status: "สำเร็จ",
    description: "อนุมัติเรื่องลับ SEC-002",
  },
];
export const AUDIT_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "สำเร็จ", label: "สำเร็จ" },
  { value: "ล้มเหลว", label: "ล้มเหลว" },
  { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { value: "ระงับ", label: "ระงับ" },
];
