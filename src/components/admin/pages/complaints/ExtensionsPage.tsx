import { useMemo, useState, useCallback } from "react";
import { mockExtensions } from "@/mock/complaints/extension.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Clock, Copy, ChevronDown } from "lucide-react";
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
  FilterTabs,
  SearchInput,
  FormField,
  useCRUD,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type ExtensionStatus = string;

type ExtensionRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  originalDueDate: string;
  extendedDueDate: string;
  requestedBy: string;
  requestedAt: string;
  reason: string;
  status: string;
};
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "รออนุมัติ", label: "รออนุมัติ" },
  { value: "อนุมัติแล้ว", label: "อนุมัติแล้ว" },
  { value: "ปฏิเสธ", label: "ปฏิเสธ" },
];

function statusVariant(s: ExtensionStatus): StatusVariant {
  if (s === "อนุมัติแล้ว") return "success";
  if (s === "ปฏิเสธ") return "danger";
  return "warning";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสขยายเวลา" },
  { key: "complaintId", label: "รหัสเรื่อง" },
  { key: "complaintTitle", label: "หัวข้อ" },
  { key: "requestedBy", label: "ผู้ขอ" },
  { key: "requestedAt", label: "วันที่ขอ" },
  { key: "originalDueDate", label: "กำหนดเดิม" },
  { key: "extendedDueDate", label: "กำหนดใหม่" },
  { key: "reason", label: "เหตุผล" },
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
    placeholder: "กรอกหัวข้อการขยายเวลา",
    required: true,
  },
  {
    key: "extendedDueDate",
    label: "กำหนดส่งใหม่",
    type: "text",
    placeholder: "เช่น 2026-06-15",
    required: true,
  },
  {
    key: "reason",
    label: "เหตุผล",
    type: "text",
    placeholder: "กรอกเหตุผลการขยายเวลา",
    required: true,
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
    placeholder: "กรอกหัวข้อการขยายเวลา",
    required: true,
  },
  {
    key: "extendedDueDate",
    label: "กำหนดส่งใหม่",
    type: "text",
    placeholder: "เช่น 2026-06-15",
    required: true,
  },
  {
    key: "reason",
    label: "เหตุผล",
    type: "text",
    placeholder: "กรอกเหตุผลการขยายเวลา",
    required: true,
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

export function ExtensionsPage() {
  const [state, actions] = useCRUD<ExtensionRow>(mockExtensions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExtensionRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: ExtensionRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q);
      const matchStatus =
        state.filterStatus === "all" ? true : r.status === state.filterStatus;
      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleAddNew = useCallback(() => {
    setCreateValues({
      complaintId: "",
      complaintTitle: "",
      extendedDueDate: "",
      reason: "",
    });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(
    () => alert("นำเข้างานขยายเวลา (จำลอง)"),
    [],
  );
  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: ExtensionRow = {
      id: `EXT-${String(state.items.length + 1).padStart(3, "0")}`,
      complaintId: createValues.complaintId as string,
      complaintTitle: createValues.complaintTitle as string,
      requestedBy: "ระบบ",
      requestedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      originalDueDate: "—",
      extendedDueDate: createValues.extendedDueDate as string,
      reason: createValues.reason as string,
      status: "รออนุมัติ",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: ExtensionRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      complaintId: editValues.complaintId as string,
      complaintTitle: editValues.complaintTitle as string,
      extendedDueDate: editValues.extendedDueDate as string,
      reason: editValues.reason as string,
      status: editValues.status as ExtensionStatus,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: ExtensionRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: ExtensionRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: ExtensionRow) => {
      const clone: ExtensionRow = {
        ...row,
        id: `${row.id}-clone`,
        complaintId: `${row.complaintId}-clone`,
        status: "รออนุมัติ",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<ExtensionRow>[] = [
    {
      key: "id",
      header: "รหัสขยายเวลา",
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
      key: "requestedBy",
      header: "ผู้ขอ",
      render: (r) => <span className="text-slate-600">{r.requestedBy}</span>,
    },
    {
      key: "extendedDueDate",
      header: "กำหนดใหม่",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.extendedDueDate}
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

  const rowActions: RowAction<ExtensionRow>[] = [
    { label: "แก้ไข", icon: <Edit className="h-4 w-4" />, onClick: handleEdit },
    {
      label: "ลบ",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="การขยายเวลาดำเนินงาน"
        description="จัดการคำขอขยายเวลาดำเนินงานเรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "การขยายเวลา" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
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

      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={state.searchQuery}
              onChange={actions.setSearchQuery}
              placeholder="ค้นหางานขยายเวลา..."
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

      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่มคำขอขยายเวลาใหม่"
        description="กำหนดรายละเอียดการขยายเวลาดำเนินงาน"
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
        title="แก้ไขคำขอขยายเวลา"
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
        title="ยืนยันการลบคำขอขยายเวลา"
        description="คำขอที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.id}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดคำขอขยายเวลา"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
