import { useMemo, useState, useCallback } from "react";
import { mockSubcategories } from "@/mock/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FolderOpen, Copy } from "lucide-react";
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

type SubStatus = "เปิดใช้งาน" | "ระงับ";

type SubcategoryRow = {
  id: string;
  category: string;
  name: string;
  description: string;
  status: SubStatus;
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
  { value: "ระงับ", label: "ระงับ" },
];

function statusVariant(s: SubStatus): StatusVariant {
  return s === "เปิดใช้งาน" ? "success" : "danger";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสหมวดย่อย" },
  { key: "category", label: "หมวดหมู่หลัก" },
  { key: "name", label: "ชื่อหมวดย่อย" },
  { key: "description", label: "คำอธิบาย" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "category",
    label: "หมวดหมู่หลัก",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "name",
    label: "ชื่อหมวดย่อย",
    type: "text",
    placeholder: "กรอกชื่อหมวดย่อย",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายหมวดย่อย",
    required: false,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "category",
    label: "หมวดหมู่หลัก",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "name",
    label: "ชื่อหมวดย่อย",
    type: "text",
    placeholder: "กรอกชื่อหมวดย่อย",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายหมวดย่อย",
    required: false,
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function SubcategoriesPage() {
  const [state, actions] = useCRUD<SubcategoryRow>(mockSubcategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubcategoryRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: SubcategoryRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
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
    setCreateValues({ category: "", name: "", description: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้าหมวดย่อย (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออกหมวดย่อย (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: SubcategoryRow = {
      id: `SUB-${String(state.items.length + 1).padStart(3, "0")}`,
      category: createValues.category as string,
      name: createValues.name as string,
      description: (createValues.description as string) || "",
      status: "เปิดใช้งาน",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: SubcategoryRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      category: editValues.category as string,
      name: editValues.name as string,
      description: editValues.description as string,
      status: editValues.status as SubStatus,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: SubcategoryRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: SubcategoryRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: SubcategoryRow) => {
      const clone: SubcategoryRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<SubcategoryRow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "category",
      header: "หมวดหมู่หลัก",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <FolderOpen className="h-3 w-3 text-[var(--gold)]" />
          {r.category}
        </span>
      ),
    },
    {
      key: "name",
      header: "ชื่อหมวดย่อย",
      render: (r) => (
        <span className="font-medium text-slate-800">{r.name}</span>
      ),
    },
    {
      key: "description",
      header: "คำอธิบาย",
      render: (r) => (
        <span className="text-slate-600">{r.description || "—"}</span>
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

  const rowActions: RowAction<SubcategoryRow>[] = [
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
        title="หมวดย่อยเรื่องร้องเรียน"
        description="จัดการหมวดย่อยและประเภทเรื่องรอง (ข้อมูลจำลอง)"
        breadcrumbs={[
          { label: "ตั้งค่าระบบ" },
          { label: "หมวดหมู่" },
          { label: "หมวดย่อย" },
        ]}
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
              placeholder="ค้นหาหมวดย่อย..."
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
            emptyMessage="ไม่พบหมวดย่อย"
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
        title="เพิ่มหมวดย่อยใหม่"
        description="กำหนดหมวดหมู่หลัก ชื่อ และคำอธิบายสำหรับหมวดย่อยใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มหมวดย่อย"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขหมวดย่อย"
        description={`แก้ไขหมวดย่อย: ${selectedItem?.name ?? ""}`}
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
        title="ยืนยันการลบหมวดย่อย"
        description="หมวดย่อยที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดหมวดย่อย"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
