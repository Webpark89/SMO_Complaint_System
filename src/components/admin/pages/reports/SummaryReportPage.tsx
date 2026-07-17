import { useMemo, useState, useCallback } from "react";
import { mockSummaryReports } from "@/mock/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown } from "lucide-react";
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
  useCRUD,
  AdvancedFilter,
  AdvancedFilterValues,
  FilterFieldConfig,
} from "@/components/admin/crud";
import { exportToCSV } from "@/utils/exportUtils";
import {
  complaintTypes,
  getFormTypeName,
  getSubcategoryName,
  type FormTypeId,
} from "@/mock/complaints/complaintTypes";
import { mockSubcategories } from "@/mock/organization";

type SummaryRow = {
  id: string;
  month: string;
  year: string;
  category?: FormTypeId;
  issue?: string; // subcategory id
  totalComplaints: number;
  closedComplaints: number;
  pendingComplaints: number;
  avgDaysToClose: number;
  slaCompliance: number;
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

// จัดกลุ่มประเด็นที่เกี่ยวข้องตามหมวดหมู่การแจ้งเรื่องหลัก
const GROUPED_ISSUE_OPTIONS = complaintTypes.map((c: any) => ({
  groupLabel: c.name,
  items: mockSubcategories
    .filter((s: any) => s.formTypeId === c.id)
    .map((s: any) => ({ value: s.id, label: s.name })),
}));

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "month", label: "เดือน" },
  { key: "year", label: "ปี" },
  { key: "categoryLabel", label: "หมวดหมู่การแจ้งเรื่อง" },
  { key: "issueLabel", label: "ประเด็นที่เกี่ยวข้อง" },
  { key: "totalComplaints", label: "จำนวนเรื่องร้องเรียน" },
  { key: "closedComplaints", label: "เรื่องที่ปิดแล้ว" },
  { key: "pendingComplaints", label: "เรื่องที่รอดำเนินการ" },
  { key: "avgDaysToClose", label: "เฉลี่ยวันที่ปิดเรื่อง" },
  { key: "slaCompliance", label: "ความสอดคล้อง SLA" },
];

export function SummaryReportPage() {
  const [state, actions] = useCRUD<SummaryRow>(mockSummaryReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SummaryRow | null>(null);
  const [filterValues, setFilterValues] = useState<AdvancedFilterValues>({});
  const [hasSearched, setHasSearched] = useState(false);

  // fields ของ AdvancedFilter — ใช้ Popover แบบมี Checkbox จัดกลุ่มตามหมวดหมู่หลัก
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
      {
        key: "issue",
        label: "ประเด็นที่เกี่ยวข้อง (แบ่งตามหมวดหมู่)",
        type: "grouped-multi-select",
        groupedOptions: GROUPED_ISSUE_OPTIONS,
        placeholder: "เลือกประเด็นที่เกี่ยวข้อง...",
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
    (r: SummaryRow, vals: AdvancedFilterValues) => {
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

      const matchIssue =
        !vals.issue || vals.issue === ""
          ? true
          : r.issue && vals.issue.split(",").includes(r.issue);

      return matchQ && matchMonth && matchYear && matchIssue;
    },
    [MONTH_MAP],
  );

  const filtered = useMemo(() => {
    return state.items.filter((r: SummaryRow) => matchRow(r, filterValues));
  }, [state.items, filterValues, matchRow]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);
  const handleExportXLSX = useCallback(() => alert("ส่งออก XLSX (จำลอง)"), []);
  const handlePrint = useCallback(() => alert("พิมพ์รายงาน (จำลอง)"), []);

  const handleExportCSV = useCallback(
    (vals: AdvancedFilterValues) => {
      const rows = state.items.filter((r: SummaryRow) => matchRow(r, vals));
      exportToCSV(
        rows.map((r) => ({
          รหัสรายงาน: r.id,
          เดือน: r.month,
          ปี: r.year,
          หมวดหมู่การแจ้งเรื่อง: r.category ? getFormTypeName(r.category) : "—",
          ประเด็นที่เกี่ยวข้อง: r.category && r.issue ? getSubcategoryName(r.category, r.issue) : "—",
          จำนวนเรื่องร้องเรียน: r.totalComplaints,
          เรื่องที่ปิดแล้ว: r.closedComplaints,
          เรื่องที่รอดำเนินการ: r.pendingComplaints,
          เฉลี่ยวันที่ปิดเรื่อง: r.avgDaysToClose,
          ความสอดคล้องSLA: r.slaCompliance,
        })),
        "รายงานสรุปเรื่องร้องเรียน",
      );
    },
    [state.items, matchRow],
  );

  const handleView = useCallback((row: SummaryRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<SummaryRow>[] = [
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
          <Calendar className="h-3 w-3 text-slate-400" />
          {r.month}
        </span>
      ),
    },
    {
      key: "year",
      header: "ปี",
      render: (r) => <span className="text-slate-600">{r.year}</span>,
    },

    {
      key: "totalComplaints",
      header: "จำนวนเรื่อง",
      render: (r) => (
        <span className="text-slate-600">{r.totalComplaints} เรื่อง</span>
      ),
    },
    {
      key: "closedComplaints",
      header: "ปิดแล้ว",
      render: (r) => (
        <Badge variant="default" className="bg-green-100 text-green-700">
          {r.closedComplaints}
        </Badge>
      ),
    },
    {
      key: "pendingComplaints",
      header: "รอดำเนินการ",
      render: (r) => (
        <Badge variant="default" className="bg-amber-100 text-amber-700">
          {r.pendingComplaints}
        </Badge>
      ),
    },
    {
      key: "avgDaysToClose",
      header: "เฉลี่ยวัน",
      render: (r) => (
        <span className="text-slate-600">{r.avgDaysToClose} วัน</span>
      ),
    },
    {
      key: "slaCompliance",
      header: "SLA %",
      render: (r) => <span className="text-slate-600">{r.slaCompliance}%</span>,
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
              onClick={() =>
                handleExportCSV({
                  month: r.month,
                  year: r.year,
                  issue: r.issue,
                })
              }
            >
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // เตรียมข้อมูลสำหรับ DetailDrawer ให้มี label ของหมวดหมู่/ประเด็นแบบอ่านง่าย
  const selectedItemForDrawer = selectedItem
    ? {
      ...selectedItem,
      categoryLabel: selectedItem.category ? getFormTypeName(selectedItem.category) : "—",
      issueLabel: selectedItem.category && selectedItem.issue ? getSubcategoryName(selectedItem.category, selectedItem.issue) : "—",
    }
    : null;

  // คำนวณผลรวมสถิติดึงตามแถวที่ผ่านการกรอง (filtered)
  const summaryStats = useMemo(() => {
    let total = 0;
    let closed = 0;
    let pending = 0;
    let totalSla = 0;
    
    filtered.forEach((r) => {
      total += r.totalComplaints;
      closed += r.closedComplaints;
      pending += r.pendingComplaints;
      totalSla += r.slaCompliance;
    });

    return {
      total,
      closed,
      pending,
      avgSla: filtered.length > 0 ? (totalSla / filtered.length).toFixed(1) : "0",
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายงานสรุปเรื่องร้องเรียน"
        description="รายงานสรุปและวิเคราะห์เรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "สรุปเรื่องร้องเรียน" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            onExportCSV={() => handleExportCSV(filterValues)}
            exportLabel="ส่งออก"
            showAddNew
            showImport
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
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wider">ปิดเสร็จสิ้นแล้ว</div>
                <div className="text-2xl font-bold text-green-700 mt-2">{summaryStats.closed} เรื่อง</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">รอดำเนินการ</div>
                <div className="text-2xl font-bold text-[#b08730] mt-2">{summaryStats.pending} เรื่อง</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">ความสอดคล้อง SLA เฉลี่ย</div>
                <div className="text-2xl font-bold text-blue-700 mt-2">{summaryStats.avgSla}%</div>
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
        title="รายละเอียดรายงาน"
        item={selectedItemForDrawer as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
