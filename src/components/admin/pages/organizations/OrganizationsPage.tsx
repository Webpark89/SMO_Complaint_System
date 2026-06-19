import { useMemo, useState, useCallback } from "react";
import { mockOrganizations } from "@/mock/organization";
import { ORG_TYPES } from "@/mock/shared/file-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  MapPin,
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

type OrgRow = {
  id: string;
  name: string;
  type: string;
  parent: string | null;
  location: string;
  employees: number;
  isActive: boolean;
};

const PARENT_OPTIONS = [
  { value: "", label: "ไม่มี (หน่วยงานหลัก)" },
  { value: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) ", label: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน) " },
];

const TYPES = [...ORG_TYPES];

const IS_ACTIVE_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "true", label: "เปิดใช้งาน" },
  { value: "false", label: "ปิดใช้งาน" },
];

const DETAIL_FIELDS = [
  { key: "id", label: "รหัส" },
  { key: "name", label: "ชื่อหน่วยงาน" },
  { key: "type", label: "ประเภท" },
  { key: "parent", label: "หน่วยงานแม่" },
  { key: "location", label: "ที่ตั้ง" },
  { key: "employees", label: "จำนวนพนักงาน" },
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
    key: "name",
    label: "ชื่อหน่วยงาน",
    type: "text",
    placeholder: "กรอกชื่อหน่วยงาน",
    required: true,
  },
  {
    key: "type",
    label: "ประเภท",
    type: "select",
    placeholder: "เลือกประเภท",
    required: true,
    options: TYPES,
  },
  {
    key: "parent",
    label: "หน่วยงานแม่",
    type: "select",
    placeholder: "เลือกหน่วยงานแม่",
    required: false,
    options: PARENT_OPTIONS,
  },
  {
    key: "location",
    label: "ที่ตั้ง",
    type: "text",
    placeholder: "กรอกที่ตั้ง",
    required: true,
  },
  {
    key: "employees",
    label: "จำนวนพนักงาน",
    type: "number",
    placeholder: "0",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อหน่วยงาน",
    type: "text",
    placeholder: "กรอกชื่อหน่วยงาน",
    required: true,
  },
  {
    key: "type",
    label: "ประเภท",
    type: "select",
    placeholder: "เลือกประเภท",
    required: true,
    options: TYPES,
  },
  {
    key: "parent",
    label: "หน่วยงานแม่",
    type: "select",
    placeholder: "เลือกหน่วยงานแม่",
    required: false,
    options: PARENT_OPTIONS,
  },
  {
    key: "location",
    label: "ที่ตั้ง",
    type: "text",
    placeholder: "กรอกที่ตั้ง",
    required: true,
  },
  {
    key: "employees",
    label: "จำนวนพนักงาน",
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

export function OrganizationsPage() {
  const [state, actions] = useCRUD<OrgRow>(mockOrganizations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrgRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: OrgRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);
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
      name: "",
      type: "",
      parent: "",
      location: "",
      employees: 0,
    });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้าหน่วยงาน (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออกหน่วยงาน (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: OrgRow = {
      id: `ORG-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      type: createValues.type as string,
      parent: (createValues.parent as string) || null,
      location: createValues.location as string,
      employees: Number(createValues.employees) || 0,
      isActive: true,
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: OrgRow) => {
    setSelectedItem(row);
    setEditValues({ ...row, isActive: row.isActive ? "true" : "false" });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      type: editValues.type as string,
      parent: (editValues.parent as string) || null,
      location: editValues.location as string,
      employees: Number(editValues.employees) || 0,
      isActive: editValues.isActive === "true",
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: OrgRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: OrgRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: OrgRow) => {
      const clone: OrgRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<OrgRow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อหน่วยงาน",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <Building2 className="h-4 w-4 text-[var(--gold)]" />
          {r.name}
        </span>
      ),
    },
    {
      key: "type",
      header: "ประเภท",
      render: (r) => (
        <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]">
          {r.type}
        </Badge>
      ),
    },
    {
      key: "parent",
      header: "หน่วยงานแม่",
      render: (r) => <span className="text-slate-600">{r.parent ?? "-"}</span>,
    },
    {
      key: "location",
      header: "ที่ตั้ง",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <MapPin className="h-3 w-3 text-slate-400" />
          {r.location}
        </span>
      ),
    },
    {
      key: "employees",
      header: "จำนวนพนักงาน",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Users className="h-3 w-3 text-slate-400" />
          {r.employees}
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

  const rowActions: RowAction<OrgRow>[] = [
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
        title="หน่วยงานและโครงเพิ่มองค์กร"
        description="จัดการโครงเพิ่มองค์กร (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "หน่วยงาน" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
            onExport={handleExport}
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
              placeholder="ค้นหาหน่วยงาน..."
            />
            <FilterTabs
              options={IS_ACTIVE_OPTIONS}
              value={state.filterStatus}
              onChange={actions.setFilterStatus}
            />
          </div>

          <DataTable
            data={filtered}
            columns={columns}
            rowActions={rowActions}
            isLoading={state.isLoading}
            keyAccessor={(row) => row.id}
          />
        </CardContent>
      </Card>

      <CreateEditModal
        open={modalOpen}
        onOpenChange={(open) => setModalOpen(open)}
        title="เพิ่มหน่วยงานใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={(open) => setEditModalOpen(open)}
        title="แก้ไขหน่วยงาน"
        fields={EDIT_FIELDS}
        values={editValues}
        onValuesChange={setEditValues}
        onSubmit={handleSubmitEdit}
        mode="edit"
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={(open) => setDetailDrawerOpen(open)}
        title="รายละเอียดหน่วยงาน"
        fields={DETAIL_FIELDS}
        item={selectedItem}
      />
    </div>
  );
}
