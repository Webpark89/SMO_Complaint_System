export type InvestigationReportRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  investigator: string;
  investigationStart: string;
  investigationEnd: string;
  status: string;
  result: string;
};

export const mockInvestigationReports: InvestigationReportRow[] = [
  {
    id: "INV-RPT-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้าง",
    investigator: "นางสมหญิง รักสงบ",
    investigationStart: "2026-05-20",
    investigationEnd: "2026-05-25",
    status: "เสร็จสิ้น",
    result: "พบหลักฐานการทุจริต",
  },
  {
    id: "INV-RPT-002",
    complaintId: "CMP-0003",
    complaintTitle: "มลพิษทางน้ำ",
    investigator: "นายวิชัย มั่นคง",
    investigationStart: "2026-05-23",
    investigationEnd: "2026-05-28",
    status: "เสร็จสิ้น",
    result: "พบการปล่อยน้ำเสีย",
  },
  {
    id: "INV-RPT-003",
    complaintId: "CMP-0008",
    complaintTitle: "ข้อมูลรั่วไหลจากระบบ IT",
    investigator: "นายประเสริฐ ศรีสุข",
    investigationStart: "2026-05-28",
    investigationEnd: "—",
    status: "กำลังดำเนินการ",
    result: "—",
  },
];
