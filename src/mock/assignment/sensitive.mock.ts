export type SensitiveRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  category: string;
  priority: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  status: string;
  accessLevel: string;
};

export const mockSensitiveCases: SensitiveRow[] = [
  {
    id: "SEC-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้างระดับสูง",
    category: "การกำกับดูแล",
    priority: "ด่วนมาก",
    reportedBy: "ผู้แจ้งเปิดเผย",
    reportedAt: "19-05-2026 10:30",
    assignedTo: "นางสมหญิง รักสงบ",
    status: "กำลังสืบสวน",
    accessLevel: "จำกัดมาก",
  },
  {
    id: "SEC-002",
    complaintId: "CMP-0008",
    complaintTitle: "ข้อมูลรั่วไหลจากระบบ IT",
    category: "ไอที",
    priority: "ด่วนมาก",
    reportedBy: "ระบบอัตโนมัติ",
    reportedAt: "27-05-2026 16:20",
    assignedTo: "นางนภา สว่างรัศมี",
    status: "รอประเมิน",
    accessLevel: "จำกัด",
  },
  {
    id: "SEC-003",
    complaintId: "CMP-0009",
    complaintTitle: "การทุจริตในโครงการก่อเพิ่ม",
    category: "การกำกับดูแล",
    priority: "ด่วนมาก",
    reportedBy: "ผู้แจ้งไม่ระบุตัวตน",
    reportedAt: "28-05-2026 11:00",
    assignedTo: "นายประเสริฐ ศรีสุข",
    status: "กำลังสืบสวน",
    accessLevel: "จำกัดมาก",
  },
];

export { SENSITIVE_STATUS_OPTIONS } from "@/mock/master-data/statuses";
