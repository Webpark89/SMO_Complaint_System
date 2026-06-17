export type OrgRow = {
  id: string;
  name: string;
  type: string;
  parent: string | null;
  location: string;
  employees: number;
  isActive: boolean;
};

export const mockOrganizations: OrgRow[] = [
  {
    id: "ORG-000",
    name: "บริษัท เอ แอล ปาล์ม จำกัด",
    type: "บริษัท",
    parent: null,
    location: "กรุงเทพมหานคร",
    employees: 500,
    isActive: true,
  },
  {
    id: "ORG-001",
    name: "สำนักงานใหญ่",
    type: "สำนักงานใหญ่",
    parent: "บริษัท เอ แอล ปาล์ม จำกัด",
    location: "กรุงเทพมหานคร",
    employees: 245,
    isActive: true,
  },
  {
    id: "ORG-002",
    name: "สาขาท่าชนะ",
    type: "สาขา",
    parent: "บริษัท เอ แอล ปาล์ม จำกัด",
    location: "สุราษฎร์ธานี",
    employees: 60,
    isActive: true,
  },
  {
    id: "ORG-003",
    name: "สาขาพนม",
    type: "สาขา",
    parent: "บริษัท เอ แอล ปาล์ม จำกัด",
    location: "สุราษฎร์ธานี",
    employees: 45,
    isActive: true,
  },
  {
    id: "ORG-004",
    name: "สาขาสระบุรี",
    type: "สาขา",
    parent: "บริษัท เอ แอล ปาล์ม จำกัด",
    location: "สระบุรี",
    employees: 55,
    isActive: true,
  },
];

export const PARENT_OPTIONS = [
  { value: "", label: "ไม่มี (หน่วยงานหลัก)" },
  { value: "บริษัท เอ แอล ปาล์ม จำกัด", label: "บริษัท เอ แอล ปาล์ม จำกัด" },
  { value: "สำนักงานใหญ่", label: "สำนักงานใหญ่" },
];
