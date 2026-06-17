import { useMemo, useState, useCallback } from "react";
import { mockReports } from "@/mock/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  Filter,
} from "lucide-react";
import {
  PageHeader,
  ActionToolbar,
  DataTable,
  Column,
  DetailDrawer,
  StatusBadge,
  StatusVariant,
  FilterTabs,
  SearchInput,
  useCRUD,
  getReportStatusVariant,
} from "@/components/admin/crud";

type ReportFormat = "PDF" | "XLSX" | "CSV";

type ReportRow = {
  id: string;
  name: string;
  description: string;
  range: string;
  createdAt: string;
  createdBy: string;
  format: ReportFormat;
  status: string;
  downloads: number;
};

const FORMAT_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "PDF", label: "PDF" },
  { value: "XLSX", label: "XLSX" },
  { value: "CSV", label: "CSV" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "พร้อมดาวน์โหลด", label: "พร้อมดาวน์โหลด" },
  { value: "กำลังเพิ่ม", label: "กำลังเพิ่ม" },
  { value: "รอดำเนินการ", label: "รอดำเนินการ" },
];

const statusVariant = (s: string): StatusVariant => getReportStatusVariant(s);

function formatVariant(f: ReportFormat): string {
  if (f === "PDF")
    return "border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-red-500";
  if (f === "XLSX")
    return "border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[var(--success)]";
  return "border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "name", label: "ชื่อรายงาน" },
  { key: "description", label: "คำอธิบาย" },
  { key: "range", label: "ช่วงเวลา" },
  { key: "createdAt", label: "สร้างเมื่อ" },
  { key: "createdBy", label: "ผู้สร้าง" },
  { key: "format", label: "รูปแบบ" },
  { key: "status", label: "สถานะ" },
  { key: "downloads", label: "จำนวนดาวน์โหลด" },
];

export function ReportsPage() {
  const [state, actions] = useCRUD<ReportRow>(mockReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportRow | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: ReportRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.range.toLowerCase().includes(q);
      const matchFormat =
        state.filterStatus === "all"
          ? true
          : state.filterStatus === "PDF" ||
              state.filterStatus === "XLSX" ||
              state.filterStatus === "CSV"
            ? r.format === state.filterStatus
            : r.status === state.filterStatus;
      return matchQ && matchFormat;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);
  const handleExportCSV = useCallback(() => alert("ส่งออก CSV (จำลอง)"), []);
  const handleExportXLSX = useCallback(() => alert("ส่งออก XLSX (จำลอง)"), []);
  const handlePrint = useCallback(() => alert("พิมพ์รายงาน (จำลอง)"), []);

  const handleView = useCallback((row: ReportRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<ReportRow>[] = [
    {
      key: "id",
      header: "รหัสรายงาน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อรายงาน",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FileText className="h-4 w-4 text-[var(--gold)]" />
          {r.name}
        </span>
      ),
    },
    {
      key: "range",
      header: "ช่วงเวลา",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Calendar className="h-3 w-3 text-slate-400" />
          {r.range}
        </span>
      ),
    },
    {
      key: "format",
      header: "รูปแบบ",
      render: (r) => (
        <Badge className={formatVariant(r.format)}>{r.format}</Badge>
      ),
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
    {
      key: "downloads",
      header: "ดาวน์โหลด",
      render: (r) => (
        <span className="text-slate-600">{r.downloads} ครั้ง</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายงาน"
        description="จัดการและส่งออกรายงาน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            exportLabel="ส่งออก"
            showAddNew
            showImport
            showExport
            isLoading={state.isLoading}
          />
        }
      />

      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={state.searchQuery}
              onChange={actions.setSearchQuery}
              placeholder="ค้นหารายงาน..."
            />
            <FilterTabs
              options={STATUS_OPTIONS}
              value={state.filterStatus}
              onChange={actions.setFilterStatus}
            />
          </div>

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

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดรายงาน"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
