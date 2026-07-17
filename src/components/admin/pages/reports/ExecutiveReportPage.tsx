import { useMemo, useState, useCallback } from "react";
import { mockExecutiveReports } from "@/mock/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  TrendingUp,
  Users,
  AlertTriangle,
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
  useCRUD,
  AdvancedFilter,
  AdvancedFilterValues,
  FilterFieldConfig,
} from "@/components/admin/crud";
import { exportToCSV } from "@/utils/exportUtils";

type ExecutiveRow = {
  id: string;
  period: string;
  totalComplaints: number;
  closedComplaints: number;
  avgResolutionDays: number;
  customerSatisfaction: number;
  topCategory: string;
  generatedAt: string;
};

const TOP_CATEGORIES = [
  { value: "การกำกับดูแล", label: "การกำกับดูแล" },
  { value: "สิ่งแวดล้อม", label: "สิ่งแวดล้อม" },
];

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "period", label: "ช่วงเวลา" },
  { key: "totalComplaints", label: "เรื่องรวม" },
  { key: "closedComplaints", label: "เรื่องปิดแล้ว" },
  { key: "avgResolutionDays", label: "เฉลี่ยวันแก้ไข" },
  { key: "customerSatisfaction", label: "ความพึงพอใจ" },
  { key: "topCategory", label: "หมวดหมู่สูงสุด" },
  { key: "generatedAt", label: "เพิ่มเมื่อ" },
];

export function ExecutiveReportPage() {
  const [state, actions] = useCRUD<ExecutiveRow>(mockExecutiveReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExecutiveRow | null>(null);
  const [filterValues, setFilterValues] = useState<AdvancedFilterValues>({});
  const [hasSearched, setHasSearched] = useState(false);

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "search",
        label: "ค้นหา",
        type: "text",
        placeholder: "รหัสรายงาน, ช่วงเวลา...",
      },
      {
        key: "topCategory",
        label: "หมวดหมู่สูงสุด",
        type: "select",
        options: TOP_CATEGORIES,
        placeholder: "เลือกหมวดหมู่",
      },
      {
        key: "generatedAt",
        label: "ช่วงวันที่สร้างรายงาน",
        type: "daterange",
      },
    ],
    [],
  );

  const matchRow = useCallback(
    (r: ExecutiveRow, vals: AdvancedFilterValues) => {
      const q = (vals.search ?? "").trim().toLowerCase();
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q);
      const matchCategory =
        !vals.topCategory || vals.topCategory === "all"
          ? true
          : r.topCategory === vals.topCategory;
      const matchDateFrom = !vals.generatedAt_from
        ? true
        : r.generatedAt >= vals.generatedAt_from;
      const matchDateTo = !vals.generatedAt_to
        ? true
        : r.generatedAt <= vals.generatedAt_to + " 23:59";
      return matchQ && matchCategory && matchDateFrom && matchDateTo;
    },
    [],
  );

  const filtered = useMemo(() => {
    return state.items.filter((r: ExecutiveRow) => matchRow(r, filterValues));
  }, [state.items, filterValues, matchRow]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF รายงานผู้บริหาร (จำลอง)"),
    [],
  );

  const handleExportCSV = useCallback(
    (vals: AdvancedFilterValues) => {
      const rows = state.items.filter((r: ExecutiveRow) => matchRow(r, vals));
      exportToCSV(
        rows.map((r) => ({
          รหัสรายงาน: r.id,
          ช่วงเวลา: r.period,
          เรื่องรวม: r.totalComplaints,
          เรื่องปิดแล้ว: r.closedComplaints,
          เฉลี่ยวันแก้ไข: r.avgResolutionDays,
          ความพึงพอใจ: r.customerSatisfaction,
          หมวดหมู่สูงสุด: r.topCategory,
          เพิ่มเมื่อ: r.generatedAt,
        })),
        "รายงานผู้บริหาร",
      );
    },
    [state.items, matchRow],
  );

  const handlePrint = useCallback(
    () => alert("พิมพ์รายงานผู้บริหาร (จำลอง)"),
    [],
  );
  const handleView = useCallback((row: ExecutiveRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<ExecutiveRow>[] = [
    {
      key: "id",
      header: "รหัสรายงาน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "period",
      header: "ช่วงเวลา",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FileText className="h-4 w-4 text-[var(--gold)]" />
          {r.period}
        </span>
      ),
    },
    {
      key: "totalComplaints",
      header: "เรื่องรวม",
      render: (r) => (
        <span className="text-slate-600">{r.totalComplaints} เรื่อง</span>
      ),
    },
    {
      key: "closedComplaints",
      header: "ปิดแล้ว",
      render: (r) => (
        <span className="text-slate-600">{r.closedComplaints} เรื่อง</span>
      ),
    },
    {
      key: "avgResolutionDays",
      header: "เฉลี่ยวัน",
      render: (r) => (
        <span className="text-slate-600">{r.avgResolutionDays} วัน</span>
      ),
    },
    {
      key: "customerSatisfaction",
      header: "ความพึงพอใจ",
      render: (r) => (
        <span className="text-slate-600">{r.customerSatisfaction}%</span>
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
              onClick={() => alert(`ส่งออก PDF ${r.period} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportCSV({ topCategory: r.topCategory })}
            >
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // คำนวณผลรวมสถิติรายงานผู้บริหาร จากข้อมูลที่กรองแล้ว (filtered)
  const summaryStats = useMemo(() => {
    let total = 0;
    let closed = 0;
    let totalDays = 0;
    let totalSat = 0;

    filtered.forEach((r) => {
      total += r.totalComplaints;
      closed += r.closedComplaints;
      totalDays += r.avgResolutionDays;
      totalSat += r.customerSatisfaction;
    });

    return {
      total,
      closed,
      avgDays: filtered.length > 0 ? (totalDays / filtered.length).toFixed(1) : "0",
      avgSat: filtered.length > 0 ? (totalSat / filtered.length).toFixed(1) : "0",
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายงานผู้บริหาร"
        description="รายงานเชิงวิเคราะห์สำหรับผู้บริหาร (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "รายงานผู้บริหาร" }]}
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
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">เฉลี่ยระยะเวลาแก้ไข</div>
                <div className="text-2xl font-bold text-[#b08730] mt-2">{summaryStats.avgDays} วัน</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">ความพึงพอใจเฉลี่ย</div>
                <div className="text-2xl font-bold text-blue-700 mt-2">{summaryStats.avgSat}%</div>
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
        title="รายละเอียดรายงานผู้บริหาร"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
