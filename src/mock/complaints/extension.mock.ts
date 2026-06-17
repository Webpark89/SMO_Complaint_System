export type ExtensionRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  originalDueDate: string;
  extendedDueDate: string;
  requestedBy: string;
  requestedAt: string;
  reason: string;
  status: string;
};

export const mockExtensions: ExtensionRow[] = [
  {
    id: "EXT-001",
    complaintId: "CMP-0001",
    complaintTitle: "ทุจริตจัดซื้อจัดจ้าง",
    originalDueDate: "2026-05-26",
    extendedDueDate: "2026-06-02",
    requestedBy: "นางสมหญิง รักสงบ",
    requestedAt: "2026-05-25 10:00",
    reason: "ต้องการเอกสารเพิ่มเติม",
    status: "อนุมัติแล้ว",
  },
  {
    id: "EXT-002",
    complaintId: "CMP-0002",
    complaintTitle: "คุณภาพบริการไม่เป็นไปตามสัญญา",
    originalDueDate: "2026-05-27",
    extendedDueDate: "2026-06-03",
    requestedBy: "นายวิชัย มั่นคง",
    requestedAt: "2026-05-26 14:00",
    reason: "รอผลวิเคราะห์จากห้องแล็บ",
    status: "รออนุมัติ",
  },
  {
    id: "EXT-003",
    complaintId: "CMP-0003",
    complaintTitle: "มลพิษทางน้ำ",
    originalDueDate: "2026-05-29",
    extendedDueDate: "2026-06-05",
    requestedBy: "นายประเสริฐ ศรีสุข",
    requestedAt: "2026-05-28 09:00",
    reason: "ต้องสำรวจพื้นที่เพิ่มเติม",
    status: "อนุมัติแล้ว",
  },
  {
    id: "EXT-004",
    complaintId: "CMP-0005",
    complaintTitle: "การจัดการของเสียอันตราย",
    originalDueDate: "2026-05-31",
    extendedDueDate: "2026-06-07",
    requestedBy: "นายสมชาย ใจดี",
    requestedAt: "2026-05-30 11:00",
    reason: "รอผลตรวจสอบจากหน่วยงานภายนอก",
    status: "ปฏิเสธ",
  },
  {
    id: "EXT-005",
    complaintId: "CMP-0008",
    complaintTitle: "ข้อมูลรั่วไหลจากระบบ IT",
    originalDueDate: "2026-06-03",
    extendedDueDate: "2026-06-10",
    requestedBy: "นางนภา สว่างรัศมี",
    requestedAt: "2026-06-01 10:00",
    reason: "ต้องประสานงานกับผู้เชี่ยวชาญด้าน IT",
    status: "รออนุมัติ",
  },
];
