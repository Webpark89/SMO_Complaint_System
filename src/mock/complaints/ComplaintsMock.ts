// FormTypeId is imported from master-data/enums

// ─── Types ─────────────────────────────────────────────────────────────

export type ComplaintRow = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  priority: string; // "ด่วนมาก" | "ด่วน" | "ปกติ" | "ไม่ด่วน"
  location: string;
  submittedBy: string;
  submittedAt: string;
  assignedTo: string;
  status: string; // "ใหม่" | "กำลังดำเนินการ" | "รอตรวจสอบ" | "ปิดเรื่อง"
};

export type ComplaintListRow = {
  id: string;
  title: string;
  category: string;
  submittedAt: string;
  location: string;
  status: string;
  priority: string;
  submittedBy: string;
};

export type DashboardComplaintRow = {
  refNo: string;
  category: string;
  subCategory: string;
  submittedAt: string;
  status: string; // "ใหม่" | "กำลังดำเนินการ" | "อยู่ระหว่างตรวจสอบ" | "รออนุมัติ" | "ปิดเรื่องแล้ว" | "เกิน SLA"
  assignee: string;
  slaDue: string;
  priority: "สูง" | "กลาง" | "ต่ำ";
};

// ─── 1. ข้อมูลสำหรับตารางหน้าจัดการเรื่องร้องเรียน (Complaints Page) ─────────────

export const mockComplaints: ComplaintRow[] = [
  {
    id: "CMP-2569-0001",
    title: "ได้รับสินค้าชำรุดจากการผลิต",
    category: "ผลิตภัณฑ์และบริการ",
    subcategory: "สินค้าชำรุดหรือไม่ได้มาตรฐาน",
    priority: "ปกติ",
    location: "สาขาท่าชนะ",
    submittedBy: "นภา สว่างรัศมี",
    submittedAt: "05-01-2026 16:30",
    assignedTo: "สมชาย มั่นคง",
    status: "ปิดเรื่อง",
  },
  {
    id: "CMP-2569-0002",
    title: "ปล่อยน้ำเสียลงแหล่งน้ำสาธารณะ",
    category: "สิ่งแวดล้อม",
    subcategory: "ผลกระทบด้านน้ำเสีย",
    priority: "ด่วนมาก",
    location: "สำนักงานใหญ่",
    submittedBy: "สมชาย ใจดี",
    submittedAt: "10-02-2026 10:00",
    assignedTo: "สมหญิง รักษ์สิ่งแวดล้อม",
    status: "ปิดเรื่อง",
  },
  {
    id: "CMP-2569-0003",
    title: "ผู้จัดการใช้อำนาจเอื้อประโยชน์ให้พวกพ้อง",
    category: "จริยธรรม",
    subcategory: "การใช้อำนาจในทางที่เหมาะสม",
    priority: "ไม่ด่วน",
    location: "สาขาพนม",
    submittedBy: "ประเสริฐ ศรีสุข",
    submittedAt: "15-04-2026 13:10",
    assignedTo: "วิชัย มั่นคง",
    status: "ปิดเรื่อง",
  },
  {
    id: "CMP-2569-0004",
    title: "พบความผิดปกติในการประมูลงาน",
    category: "การทุจริต",
    subcategory: "ทุจริตในการจัดซื้อจัดจ้าง",
    priority: "ด่วนมาก",
    location: "สำนักงานใหญ่",
    submittedBy: "บุคคลไม่ระบุตัวตน",
    submittedAt: "19-05-2026 10:30",
    assignedTo: "สมชาย มั่นคง",
    status: "กำลังดำเนินการ",
  },
  {
    id: "CMP-2569-0005",
    title: "สเปคสินค้าที่ส่งมอบไม่ตรงตามสัญญา",
    category: "ผลิตภัณฑ์และบริการ",
    subcategory:
      "การให้บริการไม่ตรงตามที่ตกลง (ได้รับสินค้าไม่ตรงสเปค ตามสัญญาซื้อขาย)",
    priority: "ด่วน",
    location: "สาขาสระบุรี",
    submittedBy: "นภา สว่างรัศมี",
    submittedAt: "20-05-2026 09:10",
    assignedTo: "—",
    status: "ใหม่",
  },
  {
    id: "CMP-2569-0006",
    title: "ควันดำจากปล่องระบายอากาศโรงงาน",
    category: "สิ่งแวดล้อม",
    subcategory: "ผลกระทบด้านอากาศ / ควัน",
    priority: "ด่วน",
    location: "สาขาท่าชนะ",
    submittedBy: "ชาวบ้านในพื้นที่",
    submittedAt: "22-05-2026 14:45",
    assignedTo: "สมหญิง รักษ์สิ่งแวดล้อม",
    status: "ปิดเรื่อง",
  },
  {
    id: "CMP-2569-0007",
    title: "เจ้าหน้าที่เรียกรับเงินเพื่ออำนวยความสะดวก",
    category: "การทุจริต",
    subcategory: "เรียกรับสินบน",
    priority: "ด่วนมาก",
    location: "สาขาพนม",
    submittedBy: "ลูกค้า A",
    submittedAt: "23-05-2026 08:00",
    assignedTo: "นรินทร์ ตรวจสอบ",
    status: "รอตรวจสอบ",
  },
  {
    id: "CMP-2569-0008",
    title: "บริการล่าช้ากว่ากำหนด 2 สัปดาห์",
    category: "ผลิตภัณฑ์และบริการ",
    subcategory: "ส่งมอบล่าช้า",
    priority: "ปกติ",
    location: "สาขาสระบุรี",
    submittedBy: "ลูกค้า B",
    submittedAt: "24-05-2026 11:20",
    assignedTo: "วิชัย ประสานงาน",
    status: "รอตรวจสอบ",
  },
  {
    id: "CMP-2569-0009",
    title: "พนักงานขายข้อมูลลูกค้าให้คู่แข่ง",
    category: "จริยธรรม",
    subcategory: "การไม่ปฏิบัติตามจรรยาบรรณวิชาชีพ",
    priority: "ด่วน",
    location: "สำนักงานใหญ่",
    submittedBy: "ประเสริฐ สิ่งแวดล้อม",
    submittedAt: "25-05-2026 16:00",
    assignedTo: "สมชาย มั่นคง",
    status: "รอตรวจสอบ",
  },
  {
    id: "CMP-2569-0010",
    title: "กรรมการรับงานซับคอนแทรคบริษัทตัวเอง",
    category: "จริยธรรม",
    subcategory: "การมีผลประโยชน์ทับซ้อน",
    priority: "ด่วนมาก",
    location: "สำนักงานใหญ่",
    submittedBy: "ผู้ถือหุ้น",
    submittedAt: "26-05-2026 09:30",
    assignedTo: "—",
    status: "ใหม่",
  },
  {
    id: "CMP-2569-0011",
    title: "บรรจุภัณฑ์เสียหายระหว่างจัดส่ง",
    category: "ผลิตภัณฑ์และบริการ",
    subcategory: "สินค้าชำรุดหรือไม่ได้มาตรฐาน",
    priority: "ด่วน",
    location: "สาขาท่าชนะ",
    submittedBy: "นภา สว่างรัศมี",
    submittedAt: "27-05-2026 13:45",
    assignedTo: "ชาญชัย บริการ",
    status: "กำลังดำเนินการ",
  },
  {
    id: "CMP-2569-0012",
    title: "เสียงเครื่องจักรดังรบกวนยามวิกาล",
    category: "สิ่งแวดล้อม",
    subcategory: "ผลกระทบด้านเสียง",
    priority: "ปกติ",
    location: "สาขาสระบุรี",
    submittedBy: "ชาวบ้านในพื้นที่",
    submittedAt: "28-05-2026 07:50",
    assignedTo: "พิชญา สิ่งแวดล้อม",
    status: "ปิดเรื่อง",
  },
  {
    id: "CMP-2569-0013",
    title: "สงสัยว่ามีการฮั้วประมูล",
    category: "การทุจริต",
    subcategory: "ทุจริตในการจัดซื้อจัดจ้าง",
    priority: "ด่วนมาก",
    location: "สำนักงานใหญ่",
    submittedBy: "ซัพพลายเออร์",
    submittedAt: "29-05-2026 08:15",
    assignedTo: "—",
    status: "ใหม่",
  },
  {
    id: "CMP-2569-0014",
    title: "พนักงาน Call Center ใช้น้ำเสียงตวาดลูกค้า",
    category: "พฤติกรรมพนักงาน",
    subcategory: "พูดจาไม่สุภาพกับลูกค้า",
    priority: "ปกติ",
    location: "สำนักงานใหญ่",
    submittedBy: "ลูกค้า C",
    submittedAt: "29-05-2026 09:00",
    assignedTo: "นภา สว่างรัศมี",
    status: "รอตรวจสอบ",
  },
  {
    id: "CMP-2569-0015",
    title: "พบการปลอมแปลงลายเซ็นในใบเสนอราคา",
    category: "การทุจริต",
    subcategory: "ปลอมแปลงเอกสารหรือข้อมูล",
    priority: "ด่วนมาก",
    location: "สาขาพนม",
    submittedBy: "วิชัย มั่นคง",
    submittedAt: "01-06-2026 14:20",
    assignedTo: "วิชัย มั่นคง",
    status: "รอตรวจสอบ",
  },
  {
    id: "CMP-2569-0016",
    title: "พบเอกสารลับถูกเผยแพร่ในโซเชียล",
    category: "จริยธรรม",
    subcategory: "การเปิดเผยข้อมูลลับขององค์กรโดยไม่ได้รับอนุญาต",
    priority: "ด่วน",
    location: "สำนักงานใหญ่",
    submittedBy: "สมหญิง รักสงบ",
    submittedAt: "02-06-2026 11:45",
    assignedTo: "สมหญิง รักสงบ",
    status: "กำลังดำเนินการ",
  },
  {
    id: "CMP-2569-0017",
    title: "กลิ่นสารเคมีรุนแรงจากบ่อบำบัด",
    category: "สิ่งแวดล้อม",
    subcategory: "ผลกระทบด้านกลิ่นเหม็น",
    priority: "ด่วน",
    location: "สาขาท่าชนะ",
    submittedBy: "พนักงานในพื้นที่",
    submittedAt: "03-06-2026 08:15",
    assignedTo: "สมชาย ใจดี",
    status: "กำลังดำเนินการ",
  },
  {
    id: "CMP-2569-0018",
    title: "หัวหน้างานมาสายเป็นประจำทุกสัปดาห์",
    category: "พฤติกรรมพนักงาน",
    subcategory: "มาทำงานสาย/ขาดงานบ่อย",
    priority: "ด่วนมาก",
    location: "สาขาสระบุรี",
    submittedBy: "พนักงาน",
    submittedAt: "03-06-2026 10:30",
    assignedTo: "—",
    status: "ใหม่",
  },
  {
    id: "CMP-2568-0001",
    title: "ขับรถฝ่าไฟแดงขณะปฏิบัติงาน",
    category: "ความปลอดภัย",
    subcategory: "ขับรถไม่สุภาพ / ขับรถประมาท",
    priority: "ด่วนมาก",
    location: "สำนักงานใหญ่",
    submittedBy: "พลเมืองดี",
    submittedAt: "05-11-2025 14:00",
    assignedTo: "นภา สว่างรัศมี",
    status: "รอตรวจสอบ",
  },
  {
    id: "CMP-2568-0002",
    title: "เครื่องดับเพลิงหมดอายุไม่ยอมเปลี่ยน",
    category: "ความปลอดภัย",
    subcategory: "อุปกรณ์ชำรุดแต่ยังใช้งาน",
    priority: "ด่วน",
    location: "สาขาพนม",
    submittedBy: "วิชัย มั่นคง",
    submittedAt: "20-12-2025 09:30",
    assignedTo: "วิชัย มั่นคง",
    status: "ปิดเรื่อง",
  },
];

// ─── 2. ข้อมูลสำหรับรายการหน้าแรกแบบย่อ (List View) ──────────────────────────

export const mockComplaintList: ComplaintListRow[] = mockComplaints.map(
  (c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    submittedAt: c.submittedAt,
    location: c.location,
    status: c.status,
    priority: c.priority,
    submittedBy: c.submittedBy,
  }),
);

// ─── 3. ข้อมูลสำหรับหน้า Dashboard (ตรงตาม Type ที่มี SLA และ assignee) ─────────

export const mockDashboardComplaints: DashboardComplaintRow[] = [
  {
    refNo: "CMP-2569-0001",
    category: "ผลิตภัณฑ์และบริการ",
    subCategory: "สินค้าชำรุดหรือไม่ได้มาตรฐาน",
    submittedAt: "05-01-2026 16:30",
    status: "ปิดเรื่องแล้ว",
    assignee: "สมชาย มั่นคง",
    slaDue: "12-01-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0002",
    category: "สิ่งแวดล้อม",
    subCategory: "ผลกระทบด้านน้ำเสีย",
    submittedAt: "10-02-2026 10:00",
    status: "ปิดเรื่องแล้ว",
    assignee: "สมหญิง รักษ์สิ่งแวดล้อม",
    slaDue: "20-02-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2569-0003",
    category: "จริยธรรม",
    subCategory: "การใช้อำนาจในทางที่เหมาะสม",
    submittedAt: "15-04-2026 13:10",
    status: "ปิดเรื่องแล้ว",
    assignee: "วิชัย มั่นคง",
    slaDue: "30-04-2026 17:00",
    priority: "ต่ำ",
  },
  {
    refNo: "CMP-2569-0004",
    category: "การทุจริต",
    subCategory: "ทุจริตในการจัดซื้อจัดจ้าง",
    submittedAt: "19-05-2026 10:30",
    status: "กำลังดำเนินการ",
    assignee: "สมชาย มั่นคง",
    slaDue: "26-05-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2569-0005",
    category: "ผลิตภัณฑ์และบริการ",
    subCategory:
      "การให้บริการไม่ตรงตามที่ตกลง (ได้รับสินค้าไม่ตรงสเปค ตามสัญญาซื้อขาย)",
    submittedAt: "20-05-2026 09:10",
    status: "ใหม่",
    assignee: "—",
    slaDue: "27-05-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0006",
    category: "สิ่งแวดล้อม",
    subCategory: "ผลกระทบด้านอากาศ / ควัน",
    submittedAt: "22-05-2026 14:45",
    status: "ปิดเรื่องแล้ว",
    assignee: "สมหญิง รักษ์สิ่งแวดล้อม",
    slaDue: "29-05-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0007",
    category: "การทุจริต",
    subCategory: "เรียกรับสินบน",
    submittedAt: "23-05-2026 08:00",
    status: "อยู่ระหว่างตรวจสอบ",
    assignee: "นรินทร์ ตรวจสอบ",
    slaDue: "30-05-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2569-0008",
    category: "ผลิตภัณฑ์และบริการ",
    subCategory: "ส่งมอบล่าช้า",
    submittedAt: "24-05-2026 11:20",
    status: "รออนุมัติ",
    assignee: "วิชัย ประสานงาน",
    slaDue: "31-05-2026 17:00",
    priority: "ต่ำ",
  },
  {
    refNo: "CMP-2569-0009",
    category: "จริยธรรม",
    subCategory: "การไม่ปฏิบัติตามจรรยาบรรณวิชาชีพ",
    submittedAt: "25-05-2026 16:00",
    status: "เกิน SLA",
    assignee: "สมชาย มั่นคง",
    slaDue: "25-05-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0010",
    category: "จริยธรรม",
    subCategory: "การมีผลประโยชน์ทับซ้อน",
    submittedAt: "26-05-2026 09:30",
    status: "ใหม่",
    assignee: "—",
    slaDue: "02-06-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2569-0011",
    category: "ผลิตภัณฑ์และบริการ",
    subCategory: "สินค้าชำรุดหรือไม่ได้มาตรฐาน",
    submittedAt: "27-05-2026 13:45",
    status: "กำลังดำเนินการ",
    assignee: "ชาญชัย บริการ",
    slaDue: "03-06-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0012",
    category: "สิ่งแวดล้อม",
    subCategory: "ผลกระทบด้านเสียง",
    submittedAt: "28-05-2026 07:50",
    status: "ปิดเรื่องแล้ว",
    assignee: "พิชญา สิ่งแวดล้อม",
    slaDue: "04-06-2026 17:00",
    priority: "ต่ำ",
  },
  {
    refNo: "CMP-2569-0013",
    category: "การทุจริต",
    subCategory: "ทุจริตในการจัดซื้อจัดจ้าง",
    submittedAt: "29-05-2026 08:15",
    status: "ใหม่",
    assignee: "—",
    slaDue: "05-06-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2569-0014",
    category: "พฤติกรรมพนักงาน",
    subCategory: "พูดจาไม่สุภาพกับลูกค้า",
    submittedAt: "29-05-2026 09:00",
    status: "รออนุมัติ",
    assignee: "นภา สว่างรัศมี",
    slaDue: "02-06-2026 17:00",
    priority: "ต่ำ",
  },
  {
    refNo: "CMP-2569-0015",
    category: "การทุจริต",
    subCategory: "ปลอมแปลงเอกสารหรือข้อมูล",
    submittedAt: "01-06-2026 14:20",
    status: "อยู่ระหว่างตรวจสอบ",
    assignee: "วิชัย มั่นคง",
    slaDue: "15-06-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2569-0016",
    category: "จริยธรรม",
    subCategory: "การเปิดเผยข้อมูลลับขององค์กรโดยไม่ได้รับอนุญาต",
    submittedAt: "02-06-2026 11:45",
    status: "กำลังดำเนินการ",
    assignee: "สมหญิง รักสงบ",
    slaDue: "09-06-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0017",
    category: "สิ่งแวดล้อม",
    subCategory: "ผลกระทบด้านกลิ่นเหม็น",
    submittedAt: "03-06-2026 08:15",
    status: "กำลังดำเนินการ",
    assignee: "สมชาย ใจดี",
    slaDue: "05-06-2026 17:00",
    priority: "กลาง",
  },
  {
    refNo: "CMP-2569-0018",
    category: "พฤติกรรมพนักงาน",
    subCategory: "มาทำงานสาย/ขาดงานบ่อย",
    submittedAt: "03-06-2026 10:30",
    status: "ใหม่",
    assignee: "—",
    slaDue: "10-06-2026 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2568-0001",
    category: "ความปลอดภัย",
    subCategory: "ขับรถไม่สุภาพ / ขับรถประมาท",
    submittedAt: "05-11-2025 14:00",
    status: "เกิน SLA",
    assignee: "นภา สว่างรัศมี",
    slaDue: "12-11-2025 17:00",
    priority: "สูง",
  },
  {
    refNo: "CMP-2568-0002",
    category: "ความปลอดภัย",
    subCategory: "อุปกรณ์ชำรุดแต่ยังใช้งาน",
    submittedAt: "20-12-2025 09:30",
    status: "ปิดเรื่องแล้ว",
    assignee: "วิชัย มั่นคง",
    slaDue: "27-12-2025 17:00",
    priority: "กลาง",
  },
];

// ─── 4. ข้อมูลสรุปสำหรับกราฟ (Charts & Analytics) ──────────────────────────

export type MonthlyData = { month: string; total: number };
export type CategoryData = { category: string; total: number };
export type OrgData = { org: string; total: number };

export const mockMonthlyData: MonthlyData[] = [
  { month: "ม.ค.", total: 45 },
  { month: "ก.พ.", total: 52 },
  { month: "มี.ค.", total: 38 },
  { month: "เม.ย.", total: 61 },
  { month: "พ.ค.", total: 73 },
  { month: "มิ.ย.", total: 58 },
];

export const mockCategoryData: CategoryData[] = [
  { category: "จริยธรรม", total: 128 },
  { category: "การทุจริต", total: 89 },
  { category: "ผลิตภัณฑ์และบริการ", total: 67 },
  { category: "พฤติกรรมพนักงาน", total: 45 },
  { category: "ความปลอดภัย", total: 30 },
  { category: "สิ่งแวดล้อม", total: 23 },
];

export const mockOrgData: OrgData[] = [
  { org: "สำนักงานใหญ่", total: 245 },
  { org: "สาขาท่าชนะ", total: 60 },
  { org: "สาขาพนม", total: 45 },
  { org: "สาขาสระบุรี", total: 55 },
];

// ─── 5. โครงสร้างฟอร์ม และ Subcategories (อ้างอิงตารางที่ 1 อย่างเป๊ะ) ─────────
// These types are now imported from master-data/enums.ts via complaintTypes.ts
// complaintTypes, getFormTypeName, etc. are exported from complaintTypes.ts

// ─── 6. ข้อมูลเอกสาร (Documents) ─────────────────────────────────────────────

export type DocumentStatus =
  | "รอตรวจสอบ"
  | "ตรวจแล้ว"
  | "ขาดหาย"
  | "ไม่เกี่ยวข้อง";

export type DocumentRow = {
  id: string;
  complaintId: string;
  documentName: string;
  documentType: string;
  submittedBy: string;
  submittedAt: string;
  fileSize: string;
  pageCount: number;
  status: DocumentStatus;
  verifiedBy: string;
  verifiedAt: string;
};

// เชื่อมโยงรหัส CMP- ให้ตรงกับฐานข้อมูลด้านบน
export const mockDocuments: DocumentRow[] = [
  {
    id: "DOC-001",
    complaintId: "CMP-2569-0004",
    documentName: "สำเนาใบเสร็จจ่ายค่าจัดซื้อ",
    documentType: "เอกสารทางการเงิน",
    submittedBy: "บุคคลไม่ระบุตัวตน",
    submittedAt: "19-05-2026 10:45",
    fileSize: "2.4 MB",
    pageCount: 5,
    status: "ตรวจแล้ว",
    verifiedBy: "นางสมหญิง รักสงบ",
    verifiedAt: "21-05-2026 14:00",
  },
  {
    id: "DOC-002",
    complaintId: "CMP-2569-0007",
    documentName: "ภาพถ่ายแชทไลน์หลักฐาน",
    documentType: "ภาพถ่าย/หลักฐาน",
    submittedBy: "ลูกค้า A",
    submittedAt: "23-05-2026 08:30",
    fileSize: "1.2 MB",
    pageCount: 1,
    status: "รอตรวจสอบ",
    verifiedBy: "—",
    verifiedAt: "—",
  },
  {
    id: "DOC-003",
    complaintId: "CMP-2569-0005",
    documentName: "สัญญาซื้อขายสินค้า",
    documentType: "สัญญา",
    submittedBy: "นางนภา สว่างรัศมี",
    submittedAt: "20-05-2026 09:15",
    fileSize: "1.2 MB",
    pageCount: 12,
    status: "ตรวจแล้ว",
    verifiedBy: "นายวิชัย มั่นคง",
    verifiedAt: "21-05-2026 10:00",
  },
  {
    id: "DOC-004",
    complaintId: "CMP-2569-0015",
    documentName: "ใบเสนอราคาฉบับแก้ไข",
    documentType: "หนังสือราชการ/เอกสารบริษัท",
    submittedBy: "นายวิชัย มั่นคง",
    submittedAt: "01-06-2026 14:30",
    fileSize: "0.8 MB",
    pageCount: 3,
    status: "ขาดหาย",
    verifiedBy: "นายสมชาย ใจดี",
    verifiedAt: "02-06-2026 09:00",
  },
];

export { DOCUMENT_STATUS_OPTIONS } from "@/mock/master-data/statuses";
