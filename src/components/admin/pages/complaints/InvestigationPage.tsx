import { useMemo, useState, useCallback } from "react";
import { mockInvestigations } from "@/mock/investigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Clock, ChevronDown } from "lucide-react";
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
  RowAction,
  CreateEditModal,
  DeleteDialog,
  DetailDrawer,
  StatusBadge,
  StatusVariant,
  AdvancedFilter,
  AdvancedFilterValues,
  FilterFieldConfig,
  FormField,
  getInvestigationStatusVariant,
  useCRUD,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";
import { createStandardRowActions } from "@/components/admin/layout/tableActions";
import { exportToCSV } from "@/utils/exportUtils";

type InvestigationRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  category: string;
  assignedTo: string;
  startedAt: string;
  status: string;
  progress: number;
  dueAt: string;
};

const TEAMS = [
  { value: "ทีมตรวจสอบ A", label: "ทีมตรวจสอบ A" },
  { value: "ทีมตรวจสอบ B", label: "ทีมตรวจสอบ B" },
  { value: "ทีมสืบสวนพิเศษ", label: "ทีมสืบสวนพิเศษ" },
  { value: "ทีมบริการลูกค้า", label: "ทีมบริการลูกค้า" },
  { value: "ทีมสิ่งแวดล้อม", label: "ทีมสิ่งแวดล้อม" },
  { value: "ทีมกำกับดูแล", label: "ทีมกำกับดูแล" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "กำลังสืบสวน", label: "กำลังสืบสวน" },
  { value: "เรียกดูเอกสาร", label: "เรียกดูเอกสาร" },
  { value: "เก็บหลักฐาน", label: "เก็บหลักฐาน" },
  { value: "รอข้อมูลจาก IT", label: "รอข้อมูลจาก IT" },
  { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
];

const statusVariant = (s: string): StatusVariant =>
  getInvestigationStatusVariant(s);

const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "search",
    label: "ค้นหา",
    type: "text",
    placeholder: "รหัสงาน, รหัสเรื่อง, หัวข้อ, ผู้สืบสวน...",
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    options: STATUS_OPTIONS.slice(1),
    placeholder: "เลือกสถานะ",
  },
  {
    key: "assignedTo",
    label: "ผู้สืบสวน",
    type: "select",
    options: TEAMS,
    placeholder: "เลือกทีม",
  },
  {
    key: "startedAt",
    label: "ช่วงวันที่เริ่ม",
    type: "daterange",
  },
];

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสงานสืบสวน" },
  { key: "complaintId", label: "รหัสเรื่อง" },
  { key: "complaintTitle", label: "หัวข้อ" },
  { key: "category", label: "ประเภท" },
  { key: "assignedTo", label: "ผู้สืบสวน" },
  { key: "startedAt", label: "เริ่มเมื่อ" },
  { key: "dueAt", label: "กำหนดเสร็จ" },
  { key: "progress", label: "ความคืบหน้า" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "complaintId",
    label: "รหัสเรื่องร้องเรียน",
    type: "text",
    placeholder: "กรอกรหัสเรื่อง",
    required: true,
  },
  {
    key: "complaintTitle",
    label: "หัวข้อ",
    type: "text",
    placeholder: "กรอกหัวข้อ",
    required: true,
  },
  {
    key: "assignedTo",
    label: "ผู้สืบสวน",
    type: "select",
    placeholder: "เลือกทีมงาน",
    required: true,
    options: TEAMS,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "complaintId",
    label: "รหัสเรื่องร้องเรียน",
    type: "text",
    placeholder: "กรอกรหัสเรื่อง",
    required: true,
  },
  {
    key: "complaintTitle",
    label: "หัวข้อ",
    type: "text",
    placeholder: "กรอกหัวข้อ",
    required: true,
  },
  {
    key: "assignedTo",
    label: "ผู้สืบสวน",
    type: "select",
    placeholder: "เลือกทีมงาน",
    required: true,
    options: TEAMS,
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    placeholder: "เลือกสถานะ",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function InvestigationPage() {
  const [state, actions] = useCRUD<InvestigationRow>(mockInvestigations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvestigationRow | null>(
    null,
  );
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});
  const [filterValues, setFilterValues] = useState<AdvancedFilterValues>({});
  const [hasSearched, setHasSearched] = useState(false);

  const filtered = useMemo(() => {
    const q = (filterValues.search ?? "").trim().toLowerCase();
    return state.items.filter((r: InvestigationRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.assignedTo.toLowerCase().includes(q);
      const matchStatus =
        !filterValues.status || filterValues.status === "all"
          ? true
          : r.status === filterValues.status;
      const matchAssignee =
        !filterValues.assignedTo || filterValues.assignedTo === "all"
          ? true
          : r.assignedTo === filterValues.assignedTo;
      const matchDateFrom = !filterValues.startedAt_from ? true : r.startedAt >= filterValues.startedAt_from;
      const matchDateTo = !filterValues.startedAt_to ? true : r.startedAt <= filterValues.startedAt_to + " 23:59";
      return matchQ && matchStatus && matchAssignee && matchDateFrom && matchDateTo;
    });
  }, [state.items, filterValues]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleAddNew = useCallback(() => {
    setCreateValues({ complaintId: "", complaintTitle: "", assignedTo: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้างานสืบสวน (จำลอง)"), []);
  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF งานสืบสวน (จำลอง)"),
    [],
  );

  const handleExportCSV = useCallback((vals: AdvancedFilterValues) => {
    const q = (vals.search ?? "").trim().toLowerCase();
    const rows = state.items.filter((r: InvestigationRow) => {
      const matchQ = !q || r.id.toLowerCase().includes(q) || r.complaintId.toLowerCase().includes(q) || r.assignedTo.toLowerCase().includes(q);
      const matchStatus = !vals.status || vals.status === "all" ? true : r.status === vals.status;
      const matchAssignee = !vals.assignedTo || vals.assignedTo === "all" ? true : r.assignedTo === vals.assignedTo;
      const matchDateFrom = !vals.startedAt_from ? true : r.startedAt >= vals.startedAt_from;
      const matchDateTo = !vals.startedAt_to ? true : r.startedAt <= vals.startedAt_to + " 23:59";
      return matchQ && matchStatus && matchAssignee && matchDateFrom && matchDateTo;
    });
    exportToCSV(
      rows.map(r => ({ รหัสงานสืบสวน: r.id, รหัสเรื่อง: r.complaintId, หัวข้อ: r.complaintTitle, ประเภท: r.category, ผู้สืบสวน: r.assignedTo, เริ่มเมื่อ: r.startedAt, กำหนดเสร็จ: r.dueAt, ความคืบหน้า: r.progress, สถานะ: r.status })),
      "รายการตรวจสอบสอบสวน",
    );
  }, [state.items]);

  const handleSubmitCreate = useCallback(() => {
    const newItem: InvestigationRow = {
      id: `INV-${String(state.items.length + 1).padStart(4, "0")}`,
      complaintId: createValues.complaintId as string,
      complaintTitle: createValues.complaintTitle as string,
      category: "",
      assignedTo: createValues.assignedTo as string,
      startedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "กำลังสืบสวน",
      progress: 0,
      dueAt: "",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: InvestigationRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      complaintId: editValues.complaintId as string,
      complaintTitle: editValues.complaintTitle as string,
      assignedTo: editValues.assignedTo as string,
      status: editValues.status as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: InvestigationRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: InvestigationRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: InvestigationRow) => {
      const clone: InvestigationRow = {
        ...row,
        id: `${row.id}-clone`,
        complaintId: `${row.complaintId}-clone`,
        status: "กำลังสืบสวน",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<InvestigationRow>[] = [
    {
      key: "id",
      header: "รหัสงาน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "complaintId",
      header: "รหัสเรื่อง",
      render: (r) => (
        <span className="font-medium text-slate-800">{r.complaintId}</span>
      ),
    },
    {
      key: "complaintTitle",
      header: "หัวข้อ",
      render: (r) => (
        <span className="text-slate-600 line-clamp-1">{r.complaintTitle}</span>
      ),
    },
    {
      key: "category",
      header: "ประเภท",
      render: (r) => (
        <Badge
          variant="outline"
          className="border-[var(--border)] text-slate-600"
        >
          {r.category}
        </Badge>
      ),
    },
    {
      key: "assignedTo",
      header: "ผู้สืบสวน",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Search className="h-3 w-3 text-slate-400" />
          {r.assignedTo}
        </span>
      ),
    },
    {
      key: "progress",
      header: "ความคืบหน้า",
      render: (r) => (
        <div className="w-20">
          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--gold)]"
              style={{ width: `${r.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 mt-0.5">{r.progress}%</span>
        </div>
      ),
    },
    {
      key: "dueAt",
      header: "กำหนดเสร็จ",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.dueAt}
        </span>
      ),
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];

  const rowActions = createStandardRowActions<InvestigationRow>({
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
  });
    
  return (
    <div className="space-y-6">
      <PageHeader
        title="การสืบสวนและตรวจสอบ"
        description="จัดการงานสืบสวนเรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "การสืบสวน" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
            onExportPDF={handleExportPDF}
            exportLabel="ส่งออก"
            onAddNew={handleAddNew}
            addNewLabel={TABLE_LABELS.addNew}
            isLoading={state.isLoading}
            showAddNew
            showImport
            showExport
          />
        }
      />

      <AdvancedFilter
        fields={FILTER_FIELDS}
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
            rowActions={rowActions}
            emptyMessage="ไม่พบรายการ"
            isLoading={state.isLoading}
            showRowNumbers
            pagination={{
              page: state.page,
              pageSize: state.pageSize,
              total: filtered.length,
              onPageChange: actions.setPage,
            }}
            bulkActions={
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[var(--border)] bg-white"
                    >
                      ส่งออกที่เลือก
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        alert(
                          `ส่งออก PDF ${state.selectedIds.size} รายการ (จำลอง)`,
                        )
                      }
                    >
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        alert(
                          `ส่งออก CSV ${state.selectedIds.size} รายการ (จำลอง)`,
                        )
                      }
                    >
                      CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[var(--border)] bg-white"
                  onClick={() =>
                    alert(`ลบ ${state.selectedIds.size} รายการ (จำลอง)`)
                  }
                >
                  <Trash2 className="mr-1 h-3 w-3" /> ลบที่เลือก
                </Button>
              </div>
            }
            onRowClick={handleView}
          />
        </CardContent>
      </Card>
      )}

      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่มสืบสวนใหม่"
        description="กำหนดรายละเอียดการสืบสวน"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่ม"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขงานสืบสวน"
        description={`แก้ไขงาน: ${selectedItem?.id ?? ""}`}
        fields={EDIT_FIELDS}
        values={editValues}
        onValuesChange={setEditValues}
        onSubmit={handleSubmitEdit}
        mode="edit"
        submitLabel="บันทึก"
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="ยืนยันการลบงานสืบสวน"
        description="งานที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.id}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดงานสืบสวน"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
