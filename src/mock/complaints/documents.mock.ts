export type DocumentRow = {
  id: string;
  complaintId: string;
  documentName: string;
  documentType: string;
  submittedBy: string;
  submittedAt: string;
  fileSize: string;
  pageCount: number;
  status: string;
  verifiedBy: string;
  verifiedAt: string;
};

// เชื่อมโยงรหัส complaintId ให้ตรงกับ mockComplaints (อิงตามปี 2569)
export const mockDocuments: DocumentRow[] = [
  {
    id: "DOC-001",
    complaintId: "CMP-2569-0004", // พบความผิดปกติในการประมูลงาน (ทุจริตจัดซื้อจัดจ้าง)
    documentName: "สำเนาใบเสร็จจ่ายค่าจัดซื้อ",
    documentType: "เอกสารทางการเงิน",
    submittedBy: "นายสมชาย ใจดี",
    submittedAt: "20-05-2026 10:00",
    fileSize: "2.4 MB",
    pageCount: 5,
    status: "ตรวจแล้ว",
    verifiedBy: "นางสมหญิง รักสงบ",
    verifiedAt: "21-05-2026 14:00",
  },
  {
    id: "DOC-002",
    complaintId: "CMP-2569-0015", // พบการปลอมแปลงลายเซ็นในใบเสนอราคา
    documentName: "ภาพถ่ายหลักฐานการทุจริต (ลายเซ็นปลอม)",
    documentType: "ภาพถ่าย/หลักฐาน",
    submittedBy: "บุคคลไม่ระบุตัวตน",
    submittedAt: "22-05-2026 11:00",
    fileSize: "15.6 MB",
    pageCount: 1,
    status: "รอตรวจสอบ",
    verifiedBy: "—",
    verifiedAt: "—",
  },
  {
    id: "DOC-003",
    complaintId: "CMP-2569-0005", // สเปคสินค้าที่ส่งมอบไม่ตรงตามสัญญา
    documentName: "สัญญาซื้อขายสินค้า",
    documentType: "สัญญา",
    submittedBy: "นางนภา สว่างรัศมี",
    submittedAt: "23-05-2026 09:00",
    fileSize: "1.2 MB",
    pageCount: 12,
    status: "ตรวจแล้ว",
    verifiedBy: "นายวิชัย มั่นคง",
    verifiedAt: "24-05-2026 10:00",
  },
  {
    id: "DOC-004",
    complaintId: "CMP-2569-0013", // สงสัยว่ามีการฮั้วประมูล
    documentName: "หนังสือราชการแจ้งผลประมูล",
    documentType: "หนังสือราชการ",
    submittedBy: "นายประเสริฐ ศรีสุข",
    submittedAt: "24-05-2026 14:00",
    fileSize: "0.8 MB",
    pageCount: 3,
    status: "ขาดหาย",
    verifiedBy: "นายสมชาย ใจดี",
    verifiedAt: "25-05-2026 09:00",
  },
  {
    id: "DOC-005",
    complaintId: "CMP-2569-0003", // ผู้จัดการใช้อำนาจเอื้อประโยชน์ให้พวกพ้อง
    documentName: "รายงานการตรวจสอบภายใน (เบื้องต้น)",
    documentType: "รายงาน",
    submittedBy: "นางสมหญิง รักสงบ",
    submittedAt: "25-05-2026 08:00",
    fileSize: "3.5 MB",
    pageCount: 28,
    status: "ตรวจแล้ว",
    verifiedBy: "นางนภา สว่างรัศมี",
    verifiedAt: "26-05-2026 11:00",
  },
  {
    id: "DOC-006",
    complaintId: "CMP-2569-0016", // พบเอกสารลับถูกเผยแพร่ในโซเชียล
    documentName: "ภาพบันทึกหน้าจอโซเชียลมีเดีย",
    documentType: "ภาพถ่าย/หลักฐาน",
    submittedBy: "นายวิชัย มั่นคง",
    submittedAt: "28-05-2026 10:00",
    fileSize: "0.5 MB",
    pageCount: 2,
    status: "รอตรวจสอบ",
    verifiedBy: "—",
    verifiedAt: "—",
  },
  {
    id: "DOC-007",
    complaintId: "CMP-2569-0010", // กรรมการรับงานซับคอนแทรคบริษัทตัวเอง
    documentName: "หนังสือรับรองการจดทะเบียนบริษัท",
    documentType: "หนังสือราชการ",
    submittedBy: "นายสมชาย ใจดี",
    submittedAt: "29-05-2026 15:00",
    fileSize: "8.2 MB",
    pageCount: 1,
    status: "ไม่เกี่ยวข้อง",
    verifiedBy: "นางสมหญิง รักสงบ",
    verifiedAt: "30-05-2026 09:00",
  },
  {
    id: "DOC-008",
    complaintId: "CMP-2569-0007", // เจ้าหน้าที่เรียกรับเงินเพื่ออำนวยความสะดวก
    documentName: "สลิปโอนเงินเข้าบัญชีส่วนตัว",
    documentType: "เอกสารทางการเงิน",
    submittedBy: "นางนภา สว่างรัศมี",
    submittedAt: "30-05-2026 11:00",
    fileSize: "1.1 MB",
    pageCount: 1,
    status: "ตรวจแล้ว",
    verifiedBy: "นายประเสริฐ ศรีสุข",
    verifiedAt: "31-05-2026 14:00",
  },
  {
    id: "DOC-009",
    complaintId: "CMP-2569-0002", // ปล่อยน้ำเสียลงแหล่งน้ำสาธารณะ
    documentName: "ภาพถ่ายพื้นที่บ่อน้ำเสีย",
    documentType: "ภาพถ่าย/หลักฐาน",
    submittedBy: "นายประเสริฐ ศรีสุข",
    submittedAt: "01-06-2026 09:00",
    fileSize: "22.3 MB",
    pageCount: 1,
    status: "รอตรวจสอบ",
    verifiedBy: "—",
    verifiedAt: "—",
  },
  {
    id: "DOC-010",
    complaintId: "CMP-2568-0002", // เครื่องดับเพลิงหมดอายุไม่ยอมเปลี่ยน
    documentName: "รายงานตรวจสอบสินทรัพย์ (ถังดับเพลิง)",
    documentType: "รายงาน",
    submittedBy: "นายสมชาย ใจดี",
    submittedAt: "02-06-2026 10:00",
    fileSize: "4.7 MB",
    pageCount: 15,
    status: "ตรวจแล้ว",
    verifiedBy: "นางสมหญิง รักสงบ",
    verifiedAt: "02-06-2026 16:00",
  },
];
