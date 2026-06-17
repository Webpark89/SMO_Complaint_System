import { useMemo, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";

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
  FilterTabs,
  SearchInput,
  FormField,
  useCRUD,
} from "@/components/admin/crud";

import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

type Workflow = {
  id: string;
  name: string;
  category: string;
  steps: number;
  avgDuration: string;
  version: string;
  isActive: boolean;
};

const mockWorkflows: Workflow[] = [
  {
    id: "WF-001",
    name: "กระบวนการเรื่องร้องเรียนทั่วไป",
    category: "ethics",
    steps: 5,
    avgDuration: "15 วัน",
    version: "v.3.0",
    isActive: true,
  },
  {
    id: "WF-002",
    name: "กระบวนการเรื่องร้องเรียนผู้บริหาร",
    category: "fraud",
    steps: 7,
    avgDuration: "30 วัน",
    version: "v.2.0",
    isActive: true,
  },
  {
    id: "WF-003",
    name: "กระบวนการเรื่องร้องเรียนพนักงาน",
    category: "employee_conduct",
    steps: 3,
    avgDuration: "7 วัน",
    version: "v.1.2",
    isActive: false,
  },
  {
    id: "WF-004",
    name: "กระบวนการเรื่องร้องเรียนสิ่งแวดล้อม",
    category: "environmental",
    steps: 6,
    avgDuration: "20 วัน",
    version: "v.1.0",
    isActive: true,
  },
  {
    id: "WF-005",
    name: "กระบวนการตรวจสอบความปลอดภัย",
    category: "safety",
    steps: 8,
    avgDuration: "45 วัน",
    version: "v.1.0",
    isActive: false,
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "true", label: "เปิดใช้งาน" },
  { value: "false", label: "แบบร่าง" },
];

const DETAIL_FIELDS = [
  { key: "id", label: "รหัส" },
  { key: "name", label: "ชื่อกระบวนการ" },
  { key: "category", label: "หมวดหมู่" },
  { key: "steps", label: "จำนวนขั้นตอน" },
  { key: "avgDuration", label: "วันเฉลี่ย" },
  { key: "version", label: "เวอร์ชัน" },
  {
    key: "isActive",
    label: "สถานะ",
    render: (v: unknown) => (
      <span className={v ? "text-green-600" : "text-amber-500"}>
        {v ? "เปิดใช้งาน" : "แบบร่าง"}
      </span>
    ),
  },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อกระบวนการ",
    type: "text",
    required: true,
  },
  {
    key: "category",
    label: "หมวดหมู่",
    type: "text",
    required: true,
  },
  {
    key: "steps",
    label: "จำนวนขั้นตอน",
    type: "number",
    required: true,
  },
  {
    key: "avgDuration",
    label: "วันเฉลี่ย",
    type: "text",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  ...CREATE_FIELDS,
  {
    key: "isActive",
    label: "สถานะ",
    type: "select",
    required: true,
    options: [
      { value: "true", label: "เปิดใช้งาน" },
      { value: "false", label: "แบบร่าง" },
    ],
  },
];

export const Route = createFileRoute("/admin/settings/workflows")({
  component: RouteComponent,
});

function RouteComponent() {
  const [state, actions] = useCRUD<Workflow>(mockWorkflows);

  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [selected, setSelected] = useState<Workflow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.toLowerCase();

    return state.items.filter((w) => {
      const matchQ =
        !q ||
        w.id.toLowerCase().includes(q) ||
        w.name.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q);

      const matchStatus =
        state.filterStatus === "all"
          ? true
          : state.filterStatus === "true"
            ? w.isActive
            : !w.isActive;

      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleCreate = useCallback(() => {
    setCreateValues({});
    setModalOpen(true);
  }, []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: Workflow = {
      id: `WF-${String(state.items.length + 1).padStart(3, "0")}`,
      name: String(createValues.name),
      category: String(createValues.category),
      steps: Number(createValues.steps),
      avgDuration: String(createValues.avgDuration),
      version: "v1.0",
      isActive: true,
    };

    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: Workflow) => {
    setSelected(row);
    setEditValues({
      ...row,
      isActive: row.isActive ? "true" : "false",
    });
    setEditOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selected) return;

    actions.updateItem(selected.id, {
      name: String(editValues.name),
      category: String(editValues.category),
      steps: Number(editValues.steps),
      avgDuration: String(editValues.avgDuration),
      isActive: editValues.isActive === "true",
    });

    setEditOpen(false);
    setSelected(null);
  }, [actions, selected, editValues]);

  const handleDelete = useCallback((row: Workflow) => {
    setSelected(row);
    setDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selected) actions.deleteItem(selected.id);
    setDeleteOpen(false);
    setSelected(null);
  }, [actions, selected]);

  const handleView = useCallback((row: Workflow) => {
    setSelected(row);
    setDetailOpen(true);
  }, []);

  const columns: Column<Workflow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => <span className="font-medium">{r.id}</span>,
    },
    {
      key: "name",
      header: "ชื่อกระบวนการ",
    },
    {
      key: "category",
      header: "หมวดหมู่",
    },
    {
      key: "steps",
      header: "จำนวนขั้นตอน",
      render: (r) => `${r.steps} ขั้นตอน`,
    },
    {
      key: "avgDuration",
      header: "วันเฉลี่ย",
    },
    {
      key: "version",
      header: "เวอร์ชัน",
    },
    {
      key: "isActive",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge
          status={r.isActive ? "เปิดใช้งาน" : "แบบร่าง"}
          variant={r.isActive ? "success" : "warning"}
        />
      ),
    },
  ];

  const rowActions: RowAction<Workflow>[] = [
    { label: "แก้ไข", icon: <Edit />, onClick: handleEdit },
    { label: "ลบ", icon: <Trash2 />, onClick: handleDelete, variant: "danger" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="ขั้นตอนการดำเนินงาน"
          description="ตั้งค่าขั้นตอนการทำงาน (เปิด/ปิดตามสายงาน)"
          breadcrumbs={[
            { label: "ตั้งค่าระบบ" },
            { label: "ขั้นตอนการดำเนินงาน" },
          ]}
          actionButtons={
            <ActionToolbar
              onAddNew={handleCreate}
              addNewLabel="เพิ่มรายการใหม่"
              onRefresh={() => actions.setLoading(false)}
              isLoading={state.isLoading}
            />
          }
        />

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex gap-3">
              <SearchInput
                value={state.searchQuery}
                onChange={actions.setSearchQuery}
                placeholder="ค้นหากระบวนการ..."
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
              onRowClick={handleView}
              emptyMessage="ไม่พบกระบวนการ"
              isLoading={state.isLoading}
              pagination={{
                page: state.page,
                pageSize: state.pageSize,
                total: filtered.length,
                onPageChange: actions.setPage,
              }}
            />
          </CardContent>
        </Card>

        {/* CREATE */}
        <CreateEditModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="เพิ่มกระบวนการ"
          fields={CREATE_FIELDS}
          values={createValues}
          onValuesChange={setCreateValues}
          onSubmit={handleSubmitCreate}
          mode="create"
        />

        {/* EDIT */}
        <CreateEditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          title="แก้ไขกระบวนการ"
          fields={EDIT_FIELDS}
          values={editValues}
          onValuesChange={setEditValues}
          onSubmit={handleSubmitEdit}
          mode="edit"
        />

        {/* DELETE */}
        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="ลบกระบวนการ"
          itemName={selected?.id}
          onConfirm={handleConfirmDelete}
        />

        {/* DETAIL */}
        <DetailDrawer
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title="รายละเอียดกระบวนการ"
          item={selected as any}
          fields={DETAIL_FIELDS}
          size="md"
        />
      </div>
    </AdminLayout>
  );
}
