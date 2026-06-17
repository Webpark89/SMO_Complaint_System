export type AssignmentRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  category: string;
  priority: string;
  submittedAt: string;
  assignedTo: string;
  status: string;
  dueAt: string;
};

export const mockAssignments: AssignmentRow[] = [
  {
    id: "ASN-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้าง",
    category: "การกำกับดูแล",
    priority: "ด่วนมาก",
    submittedAt: "19-05-2026 10:30",
    assignedTo: "นางสมหญิง รักสงบ",
    status: "รอมอบหมาย",
    dueAt: "26-05-2026 17:00",
  },
  {
    id: "ASN-002",
    complaintId: "CMP-0002",
    complaintTitle: "คุณภาพบริการไม่เป็นไปตามสัญญา",
    category: "บริการ",
    priority: "ด่วน",
    submittedAt: "20-05-2026 09:10",
    assignedTo: "นายวิชัย มั่นคง",
    status: "มอบหมายแล้ว",
    dueAt: "27-05-2026 17:00",
  },
  {
    id: "ASN-003",
    complaintId: "CMP-0003",
    complaintTitle: "มลพิษทางน้ำ",
    category: "สิ่งแวดล้อม",
    priority: "ด่วนมาก",
    submittedAt: "22-05-2026 14:45",
    assignedTo: "—",
    status: "รอมอบหมาย",
    dueAt: "29-05-2026 17:00",
  },
  {
    id: "ASN-004",
    complaintId: "CMP-0004",
    complaintTitle: "ละเว้นการปฏิบัติหน้าที่",
    category: "การกำกับดูแล",
    priority: "ด่วนมาก",
    submittedAt: "23-05-2026 11:20",
    assignedTo: "นายประเสริฐ ศรีสุข",
    status: "มอบหมายแล้ว",
    dueAt: "30-05-2026 17:00",
  },
  {
    id: "ASN-005",
    complaintId: "CMP-0005",
    complaintTitle: "การจัดการของเสียอันตราย",
    category: "สิ่งแวดล้อม",
    priority: "ด่วน",
    submittedAt: "24-05-2026 08:00",
    assignedTo: "นายสมชาย ใจดี",
    status: "มอบหมายแล้ว",
    dueAt: "31-05-2026 17:00",
  },
];

export { ASSIGNMENT_STATUS_OPTIONS } from "@/mock/master-data/statuses";
