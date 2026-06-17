export type AuditRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  auditedBy: string;
  auditedAt: string;
  finding: string;
  status: string;
  action: string;
};

export const mockAuditReports: AuditRow[] = [
  {
    id: "AUD-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้าง",
    auditedBy: "นางสมหญิง รักสงบ",
    auditedAt: "2026-05-25 10:00",
    finding: "พบการทุจริตในขั้นตอนการจัดซื้อ",
    status: "เสร็จสิ้น",
    action: "ส่งเรื่องให้อัยการ",
  },
  {
    id: "AUD-002",
    complaintId: "CMP-0003",
    complaintTitle: "มลพิษทางน้ำ",
    auditedBy: "นายวิชัย มั่นคง",
    auditedAt: "2026-05-28 14:00",
    finding: "พบการปล่อยน้ำเสียโดยไม่ผ่านการบำบัด",
    status: "รอดำเนินการ",
    action: "แจ้งเตือนบริษัท",
  },
  {
    id: "AUD-003",
    complaintId: "CMP-0005",
    complaintTitle: "การจัดการของเสียอันตราย",
    auditedBy: "นายประเสริฐ ศรีสุข",
    auditedAt: "2026-05-30 09:00",
    finding: "การกำจัดขยะไม่เป็นไปตามมาตรฐาน",
    status: "กำลังดำเนินการ",
    action: "ตรวจสอบซ้ำ",
  },
];

export const AUDIT_REPORT_STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "รอดำเนินการ", label: "รอดำเนินการ" },
  { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
];
