import { useMemo, useState, useCallback } from "react";
import { mockSLAs } from "@/mock/sla";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  Upload,
  Download,
  Edit,
  Trash2,
  AlarmClock,
  Clock,
  Copy,
} from "lucide-react";
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

import type { SLARow } from "@/mock/sla/sla.mock";
import type { FormTypeId, ComplaintPriority } from "@/mock/master-data/enums";

const CATEGORIES: { value: FormTypeId; label: string }[] = [
  { value: "ethics", label: "จริยธรรม" },
  { value: "fraud", label: "การทุจริต" },
  { value: "employee_conduct", label: "พฤติกรรมพนักงาน" },
  { value: "product_service", label: "ผลิตภัณฑ์และบริการ" },
  { value: "safety", label: "ความปลอดภัย" },
  { value: "environmental", label: "ด้านสิ่งแวดล้อม" },
];

const PRIORITIES: { value: ComplaintPriority; label: string }[] = [
  { value: "critical", label: "ด่วนมาก" },
  { value: "high", label: "ด่วน" },
  { value: "medium", label: "ปกติ" },
  { value: "low", label: "ไม่ด่วน" },
];

const IS_ACTIVE_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "true", label: "เปิดใช้งาน" },
  { value: "false", label: "ปิดใช้งาน" },
];

function priorityVariant(p: string): string {
  if (p === "critical")
    return "border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-red-500";
  if (p === "high")
    return "border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[var(--warning)]";
  return "border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัส SLA" },
  { key: "category", label: "หมวดหมู่" },
  { key: "priority", label: "ระดับความสำคัญ" },
  { key: "responseHours", label: "เวลาตอบรับ" },
  { key: "resolutionHours", label: "เวลาแก้ไข" },
  {
    key: "isActive",
    label: "สถานะ",
    render: (v: unknown) => (
      <span className={v ? "text-[var(--success)]" : "text-red-500"}>
        {v ? "เปิดใช้งาน" : "ปิดใช้งาน"}
      </span>
    ),
  },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "category",
    label: "หมวดหมู่",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "priority",
    label: "ระดับความสำคัญ",
    type: "select",
    placeholder: "เลือกระดับความสำคัญ",
    required: true,
    options: PRIORITIES,
  },
  {
    key: "responseHours",
    label: "เวลาตอบรับ (ชม.)",
    type: "number",
    placeholder: "0",
    required: true,
  },
  {
    key: "resolutionHours",
    label: "เวลาแก้ไข (ชม.)",
    type: "number",
    placeholder: "0",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "category",
    label: "หมวดหมู่",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "priority",
    label: "ระดับความสำคัญ",
    type: "select",
    placeholder: "เลือกระดับความสำคัญ",
    required: true,
    options: PRIORITIES,
  },
  {
    key: "responseHours",
    label: "เวลาตอบรับ (ชม.)",
    type: "number",
    placeholder: "0",
    required: true,
  },
  {
    key: "resolutionHours",
    label: "เวลาแก้ไข (ชม.)",
    type: "number",
    placeholder: "0",
    required: true,
  },
  {
    key: "isActive",
    label: "สถานะ",
    type: "select",
    required: true,
    options: [
      { value: "true", label: "เปิดใช้งาน" },
      { value: "false", label: "ปิดใช้งาน" },
    ],
  },
];

export function SLASettingsPage() {
  const [state, actions] = useCRUD<SLARow>(mockSLAs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SLARow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: SLARow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.priority.toLowerCase().includes(q);
      const matchStatus =
        state.filterStatus === "all"
          ? true
          : state.filterStatus === "true"
            ? r.isActive === true
            : state.filterStatus === "false"
              ? r.isActive === false
              : true;
      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleAddNew = useCallback(() => {
    setCreateValues({
      category: "",
      priority: "",
      responseHours: 0,
      resolutionHours: 0,
    });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้า SLA (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออก SLA (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: SLARow = {
      id: `SLA-${String(state.items.length + 1).padStart(3, "0")}`,
      category: createValues.category as FormTypeId,
      priority: createValues.priority as ComplaintPriority,
      responseHours: Number(createValues.responseHours) || 0,
      resolutionHours: Number(createValues.resolutionHours) || 0,
      isActive: true,
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: SLARow) => {
    setSelectedItem(row);
    setEditValues({ ...row, isActive: row.isActive ? "true" : "false" });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      category: editValues.category as FormTypeId,
      priority: editValues.priority as ComplaintPriority,
      responseHours: Number(editValues.responseHours) || 0,
      resolutionHours: Number(editValues.resolutionHours) || 0,
      isActive: editValues.isActive === "true",
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: SLARow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: SLARow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: SLARow) => {
      const clone: SLARow = { ...row, id: `${row.id}-clone` };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<SLARow>[] = [
    {
      key: "id",
      header: "รหัส SLA",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "category",
      header: "หมวดหมู่",
      render: (r) => <span className="text-slate-600">{r.category}</span>,
    },
    {
      key: "priority",
      header: "ระดับความสำคัญ",
      render: (r) => (
        <Badge className={priorityVariant(r.priority)}>{r.priority}</Badge>
      ),
    },
    {
      key: "responseHours",
      header: "เวลาตอบรับ",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.responseHours} ชม.
        </span>
      ),
    },
    {
      key: "resolutionHours",
      header: "เวลาแก้ไข",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <AlarmClock className="h-3 w-3 text-slate-400" />
          {r.resolutionHours} ชม.
        </span>
      ),
    },
    {
      key: "isActive",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge
          status={r.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          variant={r.isActive ? "success" : "danger"}
        />
      ),
    },
  ];

  const rowActions: RowAction<SLARow>[] = [
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
        title="SLA"
        description="กำหนดระยะเวลามาตรฐานการตอบสนอง (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "SLA" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
            onAddNew={handleAddNew}
            addNewLabel={TABLE_LABELS.addNew}
            exportLabel="ส่งออก"
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
              placeholder="ค้นหาหมวดหมู่..."
            />
            <FilterTabs
              options={IS_ACTIVE_OPTIONS}
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
            emptyMessage="ไม่พบ SLA"
            isLoading={state.isLoading}
            showRowNumbers
            onRowClick={handleView}
            pagination={{
              page: state.page,
              pageSize: state.pageSize,
              total: filtered.length,
              onPageChange: actions.setPage,
            }}
            bulkActions={
              <div className="flex gap-2">
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
          />
        </CardContent>
      </Card>

      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่ม SLA ใหม่"
        description="กำหนดหมวดหมู่ ระดับความสำคัญ และเวลาสำหรับ SLA ใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่ม SLA"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไข SLA"
        description={`แก้ไข SLA: ${selectedItem?.id ?? ""}`}
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
        title="ยืนยันการลบ SLA"
        description="SLA ที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.id}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียด SLA"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
