import { useMemo, useState, useCallback } from "react";
import {
  mockUsers,
  DEPARTMENTS as DEPARTMENTS_CANONICAL,
  ROLES as ROLES_CANONICAL,
} from "@/mock/users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  Search as SearchIcon,
  Upload,
  Download,
  Edit,
  Trash2,
  UserCog,
  Mail,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
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

type UserStatus = "เปิดใช้งาน" | "ระงับ" | "รอยืนยัน";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: UserStatus;
};

const ROLES = ROLES_CANONICAL;

const DEPARTMENTS = DEPARTMENTS_CANONICAL;

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
  { value: "รอยืนยัน", label: "รอยืนยัน" },
];

function statusVariant(s: UserStatus): StatusVariant {
  if (s === "เปิดใช้งาน") return "success";
  if (s === "ระงับ") return "danger";
  return "warning";
}

const USER_DETAIL_FIELDS = [
  { key: "id", label: "รหัสผู้ใช้" },
  { key: "name", label: "ชื่อ-นามสกุล" },
  { key: "email", label: "อีเมล" },
  { key: "role", label: "บทบาท" },
  { key: "department", label: "แผนก" },
  { key: "lastLogin", label: "เข้าใช้ล่าสุด" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อ-นามสกุล",
    type: "text",
    placeholder: "กรอกชื่อ-นามสกุล",
    required: true,
  },
  {
    key: "email",
    label: "อีเมล",
    type: "email",
    placeholder: "กรอกอีเมล",
    required: true,
  },
  {
    key: "role",
    label: "บทบาท",
    type: "select",
    placeholder: "เลือกบทบาท",
    required: true,
    options: ROLES,
  },
  {
    key: "department",
    label: "แผนก",
    type: "select",
    placeholder: "เลือกแผนก",
    required: true,
    options: DEPARTMENTS,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อ-นามสกุล",
    type: "text",
    placeholder: "กรอกชื่อ-นามสกุล",
    required: true,
  },
  {
    key: "email",
    label: "อีเมล",
    type: "email",
    placeholder: "กรอกอีเมล",
    required: true,
  },
  {
    key: "role",
    label: "บทบาท",
    type: "select",
    placeholder: "เลือกบทบาท",
    required: true,
    options: ROLES,
  },
  {
    key: "department",
    label: "แผนก",
    type: "select",
    placeholder: "เลือกแผนก",
    required: true,
    options: DEPARTMENTS,
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function UsersPage() {
  const [state, actions] = useCRUD<UserRow>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});
  const [detailAction, setDetailAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: UserRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
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
      name: "",
      email: "",
      role: "",
      department: "",
      status: "รอยืนยัน",
    });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => {
    alert("นำเข้าข้อมูลผู้ใช้ (จำลอง)");
  }, []);

  const handleExport = useCallback(() => {
    alert("ส่งออกข้อมูลผู้ใช้ (จำลอง)");
  }, []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: UserRow = {
      id: `USR-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      email: createValues.email as string,
      role: createValues.role as string,
      department: createValues.department as string,
      lastLogin: "—",
      status: "รอยืนยัน",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: UserRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      email: editValues.email as string,
      role: editValues.role as string,
      department: editValues.department as string,
      status: editValues.status as UserStatus,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: UserRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) {
      actions.deleteItem(selectedItem.id);
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: UserRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleResetPassword = useCallback((row: UserRow) => {
    setSelectedItem(row);
    setDetailAction("reset-password");
    setTimeout(() => setDetailAction(null), 1500);
  }, []);

  const handleLock = useCallback(
    (row: UserRow) => {
      actions.updateItem(row.id, { status: "ระงับ" });
    },
    [actions],
  );

  const handleUnlock = useCallback(
    (row: UserRow) => {
      actions.updateItem(row.id, { status: "เปิดใช้งาน" });
    },
    [actions],
  );

  const handleActivate = useCallback(
    (row: UserRow) => {
      actions.updateItem(row.id, { status: "เปิดใช้งาน" });
    },
    [actions],
  );

  const handleAssignRole = useCallback((row: UserRow) => {
    alert(`มอบหมายบทบาทให้ ${row.name} (จำลอง)`);
  }, []);

  const columns: Column<UserRow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อ-นามสกุล",
      render: (r) => <span className="text-slate-600">{r.name}</span>,
    },
    {
      key: "email",
      header: "อีเมล",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Mail className="h-3 w-3 text-slate-400" />
          {r.email}
        </span>
      ),
    },
    {
      key: "role",
      header: "บทบาท",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <UserCog className="h-3 w-3 text-slate-400" />
          {r.role}
        </span>
      ),
    },
    {
      key: "department",
      header: "แผนก",
      render: (r) => <span className="text-slate-600">{r.department}</span>,
    },
    {
      key: "lastLogin",
      header: "เข้าใช้ล่าสุด",
      render: (r) => <span className="text-slate-600">{r.lastLogin}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];

  const rowActions: RowAction<UserRow>[] = [
    {
      label: "แก้ไข",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
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
        title="ผู้ใช้งาน"
        description="จัดการผู้ใช้งานระบบ (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "ผู้ใช้งาน" }]}
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
              placeholder="ค้นหาชื่อหรืออีเมล..."
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
            emptyMessage="ไม่พบผู้ใช้งาน"
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
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[var(--border)] bg-white"
                  onClick={() =>
                    alert(`ส่งออก ${state.selectedIds.size} รายการ (จำลอง)`)
                  }
                >
                  <Download className="mr-1 h-3 w-3" /> ส่งออก
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่มผู้ใช้ใหม่"
        description="กรอกข้อมูลผู้ใช้เพื่อเพิ่มบัญชีใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มผู้ใช้"
      />

      {/* Edit Modal */}
      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขผู้ใช้"
        description={`แก้ไขข้อมูลผู้ใช้: ${selectedItem?.name ?? ""}`}
        fields={EDIT_FIELDS}
        values={editValues}
        onValuesChange={setEditValues}
        onSubmit={handleSubmitEdit}
        mode="edit"
        submitLabel="บันทึก"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="ยืนยันการลบผู้ใช้"
        description="การดำเนินการนี้ไม่สามารถย้อนกลับได้ ผู้ใช้จะถูกลบออกจากระบบถาวร"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดผู้ใช้"
        item={selectedItem as Record<string, unknown> | null}
        fields={USER_DETAIL_FIELDS}
        size="md"
        actions={
          selectedItem && (
            <div className="flex flex-wrap gap-2">
              {selectedItem.status === "ระงับ" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 border-[var(--border)]"
                  onClick={() => handleUnlock(selectedItem)}
                >
                  <Unlock className="h-3 w-3" /> ปลดล็อก
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 border-[var(--border)]"
                  onClick={() => handleLock(selectedItem)}
                >
                  <Lock className="h-3 w-3" /> ล็อก
                </Button>
              )}
            </div>
          )
        }
      />
    </div>
  );
}
