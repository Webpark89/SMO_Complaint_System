import { useMemo, useState, useCallback } from "react";
import { PERMISSIONS_LIST } from "@/mock/master-data/roles";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ShieldCheck, Users } from "lucide-react";
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

export type DepartmentCode =
  | "CS" // กลยุทธ์องค์กร
  | "SC" // เลขานุการบริษัท
  | "RP" // จัดซื้อวัตถุดิบ
  | "HR" // ทรัพยากรบุคคล
  | "DSM" // ขายและการตลาดในประเทศ
  | "ISM" // ขายและการตลาดต่างประเทศ
  | "GP" // จัดซื้อทั่วไป
  | "OS" // สำนักงานเลขานุการบริหาร
  | "LG" // โลจิสติกส์
  | "QE" // บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม
  | "FN"; // การเงิน

export type Department = {
  code: DepartmentCode;
  name: string;
  nameEn: string;
};

export const departments: Department[] = [
  { code: "CS", name: "กลยุทธ์องค์กร", nameEn: "Corporate Strategy" },
  { code: "SC", name: "เลขานุการบริษัท", nameEn: "Corporate Secretary" },
  { code: "RP", name: "จัดซื้อวัตถุดิบ", nameEn: "Raw Material Procurement" },
  { code: "HR", name: "ทรัพยากรบุคคล", nameEn: "Human Resources" },
  {
    code: "DSM",
    name: "ขายและการตลาดในประเทศ",
    nameEn: "Domestic Sales & Marketing",
  },
  {
    code: "ISM",
    name: "ขายและการตลาดต่างประเทศ",
    nameEn: "International Sales & Marketing",
  },
  { code: "GP", name: "จัดซื้อทั่วไป", nameEn: "General Procurement" },
  { code: "OS", name: "สำนักงานเลขานุการบริหาร", nameEn: "Board Secretariat" },
  { code: "LG", name: "โลจิสติกส์", nameEn: "Logistics" },
  {
    code: "QE",
    name: "บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม",
    nameEn: "Quality, Safety, Occupational Health & Environment",
  },
  { code: "FN", name: "การเงิน", nameEn: "Finance" },
];

type RoleStatus = "เปิดใช้งาน" | "ระงับ";

type RoleRow = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: RoleStatus;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
];

function statusVariant(s: RoleStatus): StatusVariant {
  return s === "เปิดใช้งาน" ? "success" : "danger";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสบทบาท" },
  { key: "name", label: "ชื่อบทบาท" },
  { key: "description", label: "คำอธิบาย" },
  { key: "userCount", label: "จำนวนผู้ใช้" },
  { key: "permissions", label: "สิทธิ์" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อบทบาท",
    type: "text",
    placeholder: "กรอกชื่อบทบาท",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายบทบาท",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อบทบาท",
    type: "text",
    placeholder: "กรอกชื่อบทบาท",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายบทบาท",
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

const mockRoles: RoleRow[] = [
  {
    id: "ROLE-001",
    name: "ผู้ดูแลระบบ (Super Admin)",
    description: "ดูแลและจัดการตั้งค่าระบบทั้งหมด",
    userCount: 2,
    permissions: ["all_access"],
    status: "เปิดใช้งาน",
  },
];

const departmentRoles: RoleRow[] = departments.map((dept) => ({
  id: `DEPT-${dept.code}`,
  name: dept.name,
  description: `ฝ่าย/แผนก: ${dept.nameEn}`,
  userCount: 0,
  permissions: ["view_complaints", "reply_complaints"],
  status: "เปิดใช้งาน",
}));

const combinedRoles: RoleRow[] = [...mockRoles, ...departmentRoles];

export function RolesPage() {
  const [state, actions] = useCRUD<RoleRow>(combinedRoles);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoleRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: RoleRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
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
    setCreateValues({ name: "", description: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้าบทบาท (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออกบทบาท (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: RoleRow = {
      id: `ROLE-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      description: createValues.description as string,
      userCount: 0,
      permissions: [],
      status: "เปิดใช้งาน",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: RoleRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      description: editValues.description as string,
      status: editValues.status as RoleStatus,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: RoleRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: RoleRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: RoleRow) => {
      const clone: RoleRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
        userCount: 0,
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<RoleRow>[] = [
    {
      key: "id",
      header: "รหัส",
      width: "100px",
      render: (r) => (
        <span className="font-semibold text-slate-700 whitespace-nowrap">
          {r.id}
        </span>
      ),
    },
    {
      key: "name",
      header: "ชื่อบทบาท/แผนก",
      width: "250px",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
          {r.name}
        </span>
      ),
    },
    {
      key: "description",
      header: "คำอธิบาย",
      width: "280px",
      render: (r) => <span className="text-slate-600">{r.description}</span>,
    },
    {
      key: "userCount",
      header: "จำนวนผู้ใช้",
      width: "120px",
      render: (r) => (
        <span className="flex items-center justify-center gap-1 text-slate-600 whitespace-nowrap">
          <Users className="h-3 w-3 text-slate-400" />
          {r.userCount}
        </span>
      ),
    },
    {
      key: "permissions",
      header: "สิทธิ์",
      width: "200px",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.permissions.slice(0, 2).map((p) => (
            <Badge
              key={p}
              className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] text-xs"
            >
              {p}
            </Badge>
          ))}
          {r.permissions.length > 2 && (
            <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] text-xs">
              +{r.permissions.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "สถานะ",
      width: "140px",
      render: (r) => (
        <span className="whitespace-nowrap">
          <StatusBadge status={r.status} variant={statusVariant(r.status)} />
        </span>
      ),
    },
  ];

  const rowActions: RowAction<RoleRow>[] = [
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
        title="สิทธิ์การใช้งาน (Roles & Departments)"
        description="กำหนดบทบาท สิทธิ์การเข้าถึง และฝ่าย/แผนกที่รับผิดชอบเรื่องร้องเรียน"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "สิทธิ์การใช้งาน" }]}
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
              placeholder="ค้นหาบทบาทหรือแผนก..."
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
            emptyMessage="ไม่พบบทบาทหรือแผนก"
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
        title="เพิ่มบทบาทใหม่"
        description="กำหนดชื่อและคำอธิบายสำหรับบทบาทใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มบทบาท"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขบทบาท"
        description={`แก้ไขบทบาท: ${selectedItem?.name ?? ""}`}
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
        title="ยืนยันการลบบทบาท"
        description="บทบาทที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดบทบาท/แผนก"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
