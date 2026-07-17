import { useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  CheckCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PageHeader,
  ActionToolbar,
  DataTable,
  Column,
  DetailDrawer,
  StatusBadge,
  StatusVariant,
  getSLAReportStatusVariant,
  useCRUD,
  AdvancedFilter,
  AdvancedFilterValues,
  FilterFieldConfig,
} from "@/components/admin/crud";
import { mockSLAReports } from "@/mock/reports";
import { exportToCSV } from "@/utils/exportUtils";

type SLARow = {
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

const MONTHS = [
  { value: "มกราคม", label: "มกราคม" },
  { value: "กุมภาพันธ์", label: "กุมภาพันธ์" },
  { value: "มีนาคม", label: "มีนาคม" },
  { value: "เมษายน", label: "เมษายน" },
  { value: "พฤษภาคม", label: "พฤษภาคม" },
  { value: "มิถุนายน", label: "มิถุนายน" },
  { value: "กรกฎาคม", label: "กรกฎาคม" },
  { value: "สิงหาคม", label: "สิงหาคม" },
  { value: "กันยายน", label: "กันยายน" },
  { value: "ตุลาคม", label: "ตุลาคม" },
  { value: "พฤศจิกายน", label: "พฤศจิกายน" },
  { value: "ธันวาคม", label: "ธันวาคม" },
];

const YEARS = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
];



const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "month", label: "เดือน" },
  { key: "year", label: "ปี" },
  { key: "totalComplaints", label: "จำนวนรวม" },
  { key: "withinSLA", label: "ภายใน SLA" },
  { key: "breachedSLA", label: "เกิน SLA" },
  { key: "complianceRate", label: "อัตราความสอดคล้อง" },
  { key: "avgResponseHours", label: "เฉลี่ยชั่วโมงตอบ" },
  { key: "avgResolutionDays", label: "เฉลี่ยวันแก้ไข" },
];

export function SLAReportPage() {
  const [state, actions] = useCRUD<SLARow>(mockSLAReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SLARow | null>(null);
  const [filterValues, setFilterValues] = useState<AdvancedFilterValues>({});
  const [hasSearched, setHasSearched] = useState(false);

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "search",
        label: "ค้นหา",
        type: "text",
        placeholder: "รหัสรายงาน, เดือน, ปี...",
      },
      {
        key: "month",
        label: "ช่วงเดือน",
        type: "selectrange",
        options: MONTHS,
      },
      {
        key: "year",
        label: "ช่วงปี",
        type: "selectrange",
        options: YEARS,
      },
    ],
    [],
  );



  const MONTH_MAP: Record<string, number> = useMemo(
    () => ({
      "มกราคม": 1,
      "กุมภาพันธ์": 2,
      "มีนาคม": 3,
      "เมษายน": 4,
      "พฤษภาคม": 5,
      "มิถุนายน": 6,
      "กรกฎาคม": 7,
      "สิงหาคม": 8,
      "กันยายน": 9,
      "ตุลาคม": 10,
      "พฤศจิกายน": 11,
      "ธันวาคม": 12,
    }),
    [],
  );

  const matchRow = useCallback(
    (r: SLARow, vals: AdvancedFilterValues) => {
      const q = (vals.search ?? "").trim().toLowerCase();
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.month.toLowerCase().includes(q) ||
        r.year.toLowerCase().includes(q);

      // กรองช่วงเดือน (Month Range)
      const monthVal = MONTH_MAP[r.month] ?? 0;
      const fromMonth = vals.month_from && vals.month_from !== "all" ? MONTH_MAP[vals.month_from] : 1;
      const toMonth = vals.month_to && vals.month_to !== "all" ? MONTH_MAP[vals.month_to] : 12;
      const matchMonth = monthVal >= fromMonth && monthVal <= toMonth;

      // กรองช่วงปี (Year Range)
      const yearVal = parseInt(r.year, 10) || 0;
      const fromYear = vals.year_from && vals.year_from !== "all" ? parseInt(vals.year_from, 10) : 2023;
      const toYear = vals.year_to && vals.year_to !== "all" ? parseInt(vals.year_to, 10) : 2026;
      const matchYear = yearVal >= fromYear && yearVal <= toYear;

      return matchQ && matchMonth && matchYear;
    },
    [MONTH_MAP],
  );

  const filtered = useMemo(() => {
    return state.items.filter((r: SLARow) => matchRow(r, filterValues));
  }, [state.items, filterValues, matchRow]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF รายงาน SLA (จำลอง)"),
    [],
  );

  const handleExportCSV = useCallback((vals: AdvancedFilterValues) => {
    const rows = state.items.filter((r: SLARow) => matchRow(r, vals));
    exportToCSV(
      rows.map(r => ({ รหัสรายงาน: r.id, เดือน: r.month, ปี: r.year, จำนวนรวม: r.totalComplaints, ภายในSLA: r.withinSLA, เกินSLA: r.breachedSLA, อัตราความสอดคล้อง: r.complianceRate, เฉลี่ยชั่วโมงตอบ: r.avgResponseHours, เฉลี่ยวันแก้ไข: r.avgResolutionDays })),
      "รายงานSLA",
    );
  }, [state.items, matchRow]);

  const handlePrint = useCallback(() => alert("พิมพ์รายงาน SLA (จำลอง)"), []);
  const handleView = useCallback((row: SLARow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<SLARow>[] = [
    {
      key: "id",
      header: "รหัสรายงาน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "month",
      header: "เดือน",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FileText className="h-4 w-4 text-[var(--gold)]" />
          {r.month} {r.year}
        </span>
      ),
    },
    {
      key: "complianceRate",
      header: "อัตราความสอดคล้อง",
      render: (r) => (
        <span className="font-semibold text-slate-700">
          {r.complianceRate}%
        </span>
      ),
    },
    {
      key: "withinSLA",
      header: "ภายใน SLA",
      render: (r) => <span className="text-slate-600">{r.withinSLA} ราย</span>,
    },
    {
      key: "breachedSLA",
      header: "เกิน SLA",
      render: (r) => (
        <span className="text-slate-600">{r.breachedSLA} ราย</span>
      ),
    },
    {
      key: "actions",
      header: "จัดการ",
      render: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 border-[var(--border)] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              ส่งออก
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => alert(`ส่งออก PDF ${r.month} ${r.year} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportCSV({ month: r.month, year: r.year })}
            >
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // คำนวณผลรวมสถิติ SLA จากข้อมูลที่กรองแล้ว (filtered)
  const summaryStats = useMemo(() => {
    let total = 0;
    let within = 0;
    let breached = 0;
    let totalRate = 0;

    filtered.forEach((r) => {
      total += r.totalComplaints;
      within += r.withinSLA;
      breached += r.breachedSLA;
      totalRate += r.complianceRate;
    });

    return {
      total,
      within,
      breached,
      avgRate: filtered.length > 0 ? (totalRate / filtered.length).toFixed(1) : "0",
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายงาน SLA"
        description="รายงานการปฏิบัติตาม SLA (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "SLA" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            onExportCSV={() => handleExportCSV(filterValues)}
            exportLabel="ส่งออก"
            showExport
            isLoading={state.isLoading}
          />
        }
      />

      <AdvancedFilter
        fields={filterFields}
        onApply={(vals) => {
          setFilterValues(vals);
          setHasSearched(true);
        }}
        onReset={() => setHasSearched(false)}
        onExport={handleExportCSV}
        resultCount={filtered.length}
        totalCount={state.items.length}
        isLoading={state.isLoading}
      />

      {hasSearched && (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">เรื่องร้องเรียนทั้งหมด</div>
                <div className="text-2xl font-bold text-slate-800 mt-2">{summaryStats.total} เรื่อง</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wider">ภายใน SLA</div>
                <div className="text-2xl font-bold text-green-700 mt-2">{summaryStats.within} ราย</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">เกิน SLA</div>
                <div className="text-2xl font-bold text-red-600 mt-2">{summaryStats.breached} ราย</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">อัตราความสอดคล้องเฉลี่ย</div>
                <div className="text-2xl font-bold text-blue-700 mt-2">{summaryStats.avgRate}%</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[var(--border)] bg-white shadow-soft">
            <CardContent className="p-6 space-y-4">
              <DataTable
                columns={columns}
                data={filtered}
                keyAccessor={(r) => r.id}
                selectedIds={state.selectedIds}
                onToggleSelect={actions.toggleSelect}
                onSelectAll={actions.selectAll}
                onRowClick={handleView}
                emptyMessage="ไม่พบรายงาน"
                isLoading={state.isLoading}
                showRowNumbers
                pagination={{
                  page: state.page,
                  pageSize: state.pageSize,
                  total: filtered.length,
                  onPageChange: actions.setPage,
                }}
              />
            </CardContent>
          </Card>
        </>
      )}

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดรายงาน SLA"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
