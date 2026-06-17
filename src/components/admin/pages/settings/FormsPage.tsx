import { useMemo, useState, useCallback } from "react";
import { mockForms } from "@/mock/forms";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, LayoutList, Copy } from "lucide-react";
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
  getFormStatusVariant,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";
import type { FormTypeId } from "@/mock/category-taxonomy";

type FormRow = {
  id: string;
  name: string;
  formTypeId: FormTypeId;
  fields: number;
  version: string;
  updatedAt: string;
  status: string;
};

const CATEGORIES = [
  { value: "ethics", label: "จริยธรรม", code: "1.1" },
  { value: "fraud", label: "การทุจริต", code: "1.2" },
  { value: "employee_conduct", label: "พฤติกรรมพนักงาน", code: "1.3" },
  { value: "product_service", label: "ผลิตภัณฑ์และบริการ", code: "1.4" },
  { value: "safety", label: "ความปลอดภัย", code: "1.5" },
  { value: "environmental", label: "ด้านสิ่งแวดล้อม", code: "1.6" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "แบบร่าง", label: "แบบร่าง" },
  { value: "ปิดใช้งาน", label: "ปิดใช้งาน" },
];

const statusVariant = (s: string): StatusVariant => getFormStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสฟอร์ม" },
  { key: "name", label: "ชื่อฟอร์ม" },
  { key: "formTypeId", label: "หมวดหมู่" },
  { key: "fields", label: "จำนวนช่อง" },
  { key: "version", label: "เวอร์ชัน" },
  { key: "updatedAt", label: "อัปเดตล่าสุด" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อฟอร์ม",
    type: "text",
    placeholder: "กรอกชื่อฟอร์ม",
    required: true,
  },
  {
    key: "formTypeId",
    label: "หมวดหมู่",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "fields",
    label: "จำนวนช่อง",
    type: "number",
    placeholder: "0",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อฟอร์ม",
    type: "text",
    placeholder: "กรอกชื่อฟอร์ม",
    required: true,
  },
  {
    key: "formTypeId",
    label: "หมวดหมู่",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "fields",
    label: "จำนวนช่อง",
    type: "number",
    placeholder: "0",
    required: true,
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function FormsPage() {
  const [state, actions] = useCRUD<FormRow>(mockForms);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FormRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: FormRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.formTypeId.toLowerCase().includes(q);
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
    setCreateValues({ name: "", formTypeId: "", fields: 0 });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้าฟอร์ม (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออกฟอร์ม (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: FormRow = {
      id: `FORM-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      formTypeId: createValues.formTypeId as FormTypeId,
      fields: Number(createValues.fields) || 0,
      version: "v1.0",
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "แบบร่าง",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: FormRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      formTypeId: editValues.formTypeId as FormTypeId,
      fields: Number(editValues.fields) || 0,
      status: editValues.status as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: FormRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: FormRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: FormRow) => {
      const clone: FormRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
        version: "v1.0",
        updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "แบบร่าง",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<FormRow>[] = [
    {
      key: "id",
      header: "รหัสฟอร์ม",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อฟอร์ม",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <LayoutList className="h-4 w-4 text-[var(--gold)]" />
          {r.name}
        </span>
      ),
    },
    {
      key: "formTypeId",
      header: "หมวดหมู่",
      render: (r) => <span className="text-slate-600">{r.formTypeId}</span>,
    },
    {
      key: "fields",
      header: "จำนวนช่อง",
      render: (r) => <span className="text-slate-600">{r.fields} ช่อง</span>,
    },
    {
      key: "version",
      header: "เวอร์ชัน",
      render: (r) => <span className="text-slate-600">{r.version}</span>,
    },
    {
      key: "updatedAt",
      header: "อัปเดตล่าสุด",
      render: (r) => <span className="text-slate-600">{r.updatedAt}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];

  const rowActions: RowAction<FormRow>[] = [
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
        title="แบบฟอร์มร้องเรียน"
        description="กำหนดฟอร์มและช่องข้อมูล (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "แบบฟอร์ม" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
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
              placeholder="ค้นหาฟอร์ม..."
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
            emptyMessage="ไม่พบฟอร์ม"
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
        title="เพิ่มฟอร์มใหม่"
        description="กำหนดชื่อและหมวดหมู่สำหรับฟอร์มใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มฟอร์ม"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขฟอร์ม"
        description={`แก้ไขฟอร์ม: ${selectedItem?.name ?? ""}`}
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
        title="ยืนยันการลบฟอร์ม"
        description="ฟอร์มที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดฟอร์ม"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
