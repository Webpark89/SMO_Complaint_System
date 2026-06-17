export type SLAReportRow = {
  id: string;
  month: string;
  year: string;
  totalComplaints: number;
  withinSLA: number;
  breachedSLA: number;
  complianceRate: number;
  avgResponseHours: number;
  avgResolutionDays: number;
};

export const mockSLAReports: SLAReportRow[] = [
  {
    id: "SLA-RPT-001",
    month: "มกราคม",
    year: "2026",
    totalComplaints: 45,
    withinSLA: 42,
    breachedSLA: 3,
    complianceRate: 93.3,
    avgResponseHours: 4.2,
    avgResolutionDays: 12.5,
  },
  {
    id: "SLA-RPT-002",
    month: "กุมภาพันธ์",
    year: "2026",
    totalComplaints: 52,
    withinSLA: 48,
    breachedSLA: 4,
    complianceRate: 92.3,
    avgResponseHours: 4.8,
    avgResolutionDays: 14.2,
  },
  {
    id: "SLA-RPT-003",
    month: "มีนาคม",
    year: "2026",
    totalComplaints: 38,
    withinSLA: 36,
    breachedSLA: 2,
    complianceRate: 94.7,
    avgResponseHours: 3.9,
    avgResolutionDays: 11.8,
  },
  {
    id: "SLA-RPT-004",
    month: "เมษายน",
    year: "2026",
    totalComplaints: 61,
    withinSLA: 55,
    breachedSLA: 6,
    complianceRate: 90.2,
    avgResponseHours: 5.5,
    avgResolutionDays: 15.3,
  },
  {
    id: "SLA-RPT-005",
    month: "พฤษภาคม",
    year: "2026",
    totalComplaints: 73,
    withinSLA: 65,
    breachedSLA: 8,
    complianceRate: 89.0,
    avgResponseHours: 6.1,
    avgResolutionDays: 16.1,
  },
];
