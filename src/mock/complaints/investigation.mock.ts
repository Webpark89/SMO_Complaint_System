export type InvestigationRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  category: string;
  assignedTo: string;
  startedAt: string;
  status: string;
  progress: number;
  dueAt: string;
};

export const mockInvestigations: InvestigationRow[] = [
  {
    id: "INV-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้าง",
    category: "การกำกับดูแล",
    assignedTo: "นางสมหญิง รักสงบ",
    startedAt: "2026-05-20 10:00",
    status: "กำลังสืบสวน",
    progress: 45,
    dueAt: "2026-05-27 17:00",
  },
  {
    id: "INV-002",
    complaintId: "CMP-0002",
    complaintTitle: "คุณภาพบริการไม่เป็นไปตามสัญญา",
    category: "บริการ",
    assignedTo: "นายวิชัย มั่นคง",
    startedAt: "2026-05-21 09:00",
    status: "เรียกดูเอกสาร",
    progress: 30,
    dueAt: "2026-05-28 17:00",
  },
  {
    id: "INV-003",
    complaintId: "CMP-0003",
    complaintTitle: "มลพิษทางน้ำ",
    category: "สิ่งแวดล้อม",
    assignedTo: "นายประเสริฐ ศรีสุข",
    startedAt: "2026-05-23 10:00",
    status: "เก็บหลักฐาน",
    progress: 60,
    dueAt: "2026-05-30 17:00",
  },
  {
    id: "INV-004",
    complaintId: "CMP-0005",
    complaintTitle: "การจัดการของเสียอันตราย",
    category: "สิ่งแวดล้อม",
    assignedTo: "นายสมชาย ใจดี",
    startedAt: "2026-05-25 08:00",
    status: "กำลังสืบสวน",
    progress: 20,
    dueAt: "2026-06-01 17:00",
  },
  {
    id: "INV-005",
    complaintId: "CMP-0008",
    complaintTitle: "ข้อมูลรั่วไหลจากระบบ IT",
    category: "ไอที",
    assignedTo: "นางนภา สว่างรัศมี",
    startedAt: "2026-05-28 09:00",
    status: "รอข้อมูลจาก IT",
    progress: 15,
    dueAt: "2026-06-04 17:00",
  },
];
