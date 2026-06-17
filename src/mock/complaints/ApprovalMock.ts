export type ApprovalRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  submittedBy: string;
  submittedAt: string;
  assignedTo: string;
  status: string;
  priority: string;
  dueAt: string;
  topic: string;
  submitter: string;
  approver: string;
  approvedAt: string;
  level: string;
};

export const mockApprovals: ApprovalRow[] = [
  {
    id: "APR-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้าง",
    submittedBy: "นายสมชาย ใจดี",
    submittedAt: "19-05-2026 10:30",
    assignedTo: "นางสมหญิง รักสงบ",
    status: "รออนุมัติ",
    priority: "ด่วนมาก",
    dueAt: "26-05-2026 17:00",
    topic: "ขออนุมัติรายงานผลการสืบสวนข้อเท็จจริง",
    submitter: "นางสมหญิง รักสงบ",
    approver: "ผู้อำนวยการสำนักงาน",
    approvedAt: "-",
    level: "ผู้บริหารระดับสูง",
  },
  {
    id: "APR-002",
    complaintId: "CMP-0003",
    complaintTitle: "มลพิษทางน้ำ",
    submittedBy: "นายประเสริฐ ศรีสุข",
    submittedAt: "22-05-2026 14:45",
    assignedTo: "นายวิชัย มั่นคง",
    status: "อนุมัติแล้ว",
    priority: "ด่วน",
    dueAt: "29-05-2026 17:00",
    topic: "ขออนุมัติแผนแก้ไขปัญหาสิ่งแวดล้อมฉุกเฉิน",
    submitter: "นายวิชัย มั่นคง",
    approver: "ผู้จัดการฝ่ายสิ่งแวดล้อม",
    approvedAt: "25-05-2026 10:00",
    level: "ผู้จัดการฝ่าย",
  },
  {
    id: "APR-003",
    complaintId: "CMP-0005",
    complaintTitle: "การจัดการของเสียอันตราย",
    submittedBy: "นางนภา สว่างรัศมี",
    submittedAt: "24-05-2026 08:00",
    assignedTo: "นายสมชาย ใจดี",
    status: "ปฏิเสธ",
    priority: "ด่วน",
    dueAt: "31-05-2026 17:00",
    topic: "ขออนุมัติขยายระยะเวลาดำเนินการ (ครั้งที่ 1)",
    submitter: "นายสมชาย ใจดี",
    approver: "หัวหน้าแผนกความปลอดภัย",
    approvedAt: "26-05-2026 15:30",
    level: "หัวหน้าแผนก",
  },
  {
    id: "APR-004",
    complaintId: "CMP-0008",
    complaintTitle: "ข้อมูลรั่วไหลจากระบบ IT",
    submittedBy: "นายวิชัย มั่นคง",
    submittedAt: "27-05-2026 16:20",
    assignedTo: "นางสมหญิง รักสงบ",
    status: "รออนุมัติ",
    priority: "ด่วนมาก",
    dueAt: "03-06-2026 17:00",
    topic: "ขออนุมัติมาตรการระงับระบบชั่วคราว",
    submitter: "นางสมหญิง รักสงบ",
    approver: "ประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (CTO)",
    approvedAt: "-",
    level: "C-Level",
  },
  {
    id: "APR-005",
    complaintId: "CMP-0009",
    complaintTitle: "การทุจริตในโครงการ",
    submittedBy: "นางนภา สว่างรัศมี",
    submittedAt: "28-05-2026 11:00",
    assignedTo: "นายประเสริฐ ศรีสุข",
    status: "รออนุมัติ",
    priority: "ด่วนมาก",
    dueAt: "04-06-2026 17:00",
    topic: "ขออนุมัติตั้งคณะกรรมการสอบสวนพิเศษ",
    submitter: "นายประเสริฐ ศรีสุข",
    approver: "คณะกรรมการบริหาร (Board of Directors)",
    approvedAt: "-",
    level: "คณะกรรมการ",
  },
];
