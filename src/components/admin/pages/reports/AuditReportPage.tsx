import { useMemo, useState, useCallback } from "react";
import { mockAuditLogs } from "@/mock/audit";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  User,
  Shield,
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
  useCRUD,
  AdvancedFilter,
  AdvancedFilterValues,
  FilterFieldConfig,
} from "@/components/admin/crud";
import { exportToCSV } from "@/utils/exportUtils";

type LogStatus = "สำเร็จ" | "ล้มเหลว" | "กำลังดำเนินการ" | "ระงับ";

type LogRow = {
  id: string;
  timestamp: string;
  username: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: LogStatus;
  description: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "สำเร็จ", label: "สำเร็จ" },
  { value: "ล้มเหลว", label: "ล้มเหลว" },
  { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { value: "ระงับ", label: "ระงับ" },
];

const MODULES = [
  { value: "ระบบยืนยันตัวตน", label: "ระบบยืนยันตัวตน" },
  { value: "จัดการเรื่องร้องเรียน", label: "จัดการเรื่องร้องเรียน" },
  { value: "การอนุมัติ", label: "การอนุมัติ" },
  { value: "รายงาน SLA", label: "รายงาน SLA" },
  { value: "งานสืบสวน", label: "งานสืบสวน" },
  { value: "รายงานตรวจสอบ", label: "รายงานตรวจสอบ" },
  { value: "การตั้งค่า", label: "การตั้งค่า" },
  { value: "การขยายเวลา", label: "การขยายเวลา" },
  { value: "ระบบความปลอดภัย", label: "ระบบความปลอดภัย" },
  { value: "เรื่องลับ", label: "เรื่องลับ" },
];



function statusVariant(s: LogStatus): StatusVariant {
  if (s === "สำเร็จ") return "success";
  if (s === "ล้มเหลว") return "danger";
  if (s === "ระงับ") return "warning";
  return "neutral";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสบันทึก" },
  { key: "timestamp", label: "วันที่/เวลา" },
  { key: "username", label: "ชื่อผู้ใช้" },
  { key: "userRole", label: "บทบาท" },
  { key: "action", label: "การดำเนินการ" },
  { key: "module", label: "โมดูล" },
  { key: "ipAddress", label: "IP Address" },
  { key: "status", label: "สถานะ" },
  { key: "description", label: "รายละเอียด" },
];

export function AuditReportPage() {
  const [state, actions] = useCRUD<LogRow>(mockAuditLogs);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LogRow | null>(null);
  const [filterValues, setFilterValues] = useState<AdvancedFilterValues>({});
  const [hasSearched, setHasSearched] = useState(false);

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "search",
        label: "ค้นหา",
        type: "text",
        placeholder: "รหัสบันทึก, ผู้ใช้, การดำเนินการ...",
      },
      {
        key: "status",
        label: "สถานะ",
        type: "select",
        options: STATUS_OPTIONS.slice(1),
        placeholder: "เลือกสถานะ",
      },
      {
        key: "module",
        label: "โมดูล",
        type: "select",
        options: MODULES,
        placeholder: "เลือกโมดูล",
      },
      {
        key: "timestamp",
        label: "ช่วงวันที่บันทึก",
        type: "daterange",
      },
    ],
    [],
  );

  const matchRow = useCallback(
    (r: LogRow, vals: AdvancedFilterValues) => {
      const q = (vals.search ?? "").trim().toLowerCase();
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.module.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      const matchStatus =
        !vals.status || vals.status === "all"
          ? true
          : r.status === vals.status;
      const matchModule =
        !vals.module || vals.module === "all"
          ? true
          : r.module === vals.module;
      const matchDateFrom = !vals.timestamp_from
        ? true
        : r.timestamp >= vals.timestamp_from;
      const matchDateTo = !vals.timestamp_to
        ? true
        : r.timestamp <= vals.timestamp_to + " 23:59";
      return matchQ && matchStatus && matchModule && matchDateFrom && matchDateTo;
    },
    [],
  );

  const filtered = useMemo(() => {
    return state.items.filter((r: LogRow) => matchRow(r, filterValues));
  }, [state.items, filterValues, matchRow]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF บันทึกตรวจสอบ (จำลอง)"),
    [],
  );

  const handleExportCSV = useCallback(
    (vals: AdvancedFilterValues) => {
      const rows = state.items.filter((r: LogRow) => matchRow(r, vals));
      exportToCSV(
        rows.map((r) => ({
          รหัสบันทึก: r.id,
          วันที่_เวลา: r.timestamp,
          ผู้ใช้: r.username,
          บทบาท: r.userRole,
          การดำเนินการ: r.action,
          โมดูล: r.module,
          IP_Address: r.ipAddress,
          สถานะ: r.status,
          รายละเอียด: r.description,
        })),
        "บันทึกตรวจสอบระบบ",
      );
    },
    [state.items, matchRow],
  );

  const handlePrint = useCallback(
    () => alert("พิมพ์บันทึกตรวจสอบ (จำลอง)"),
    [],
  );
  const handleView = useCallback((row: LogRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<LogRow>[] = [
    {
      key: "id",
      header: "รหัสบันทึก",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "timestamp",
      header: "วันที่/เวลา",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.timestamp}
        </span>
      ),
    },
    {
      key: "username",
      header: "ผู้ใช้",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <User className="h-3 w-3 text-slate-400" />
          {r.username}
        </span>
      ),
    },
    {
      key: "action",
      header: "การดำเนินการ",
      render: (r) => (
        <span className="font-medium text-slate-700">{r.action}</span>
      ),
    },
    {
      key: "module",
      header: "โมดูล",
      render: (r) => (
        <Badge
          variant="outline"
          className="border-[var(--border)] text-slate-600"
        >
          {r.module}
        </Badge>
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
              onClick={() => alert(`ส่งออก PDF ${r.id} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExportCSV({ id: r.id })}
            >
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="บันทึกตรวจสอบระบบ"
        description="บันทึกการใช้งานระบบและการเปลี่ยนแปลงต่างๆ (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "บันทึกตรวจสอบ" }]}
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
              emptyMessage="ไม่พบบันทึก"
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
      )}

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดบันทึกตรวจสอบ"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
