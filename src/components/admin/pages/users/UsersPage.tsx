import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { mockUsers } from "@/mock/users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Eye,
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
import { createStandardRowActions } from "@/components/admin/layout/tableActions";
import { mockCombinedRoles } from "@/mock/roles/roles.mock";

type UserStatus = "เปิดใช้งาน" | "ปิดใช้งาน" | "รอยืนยัน";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: UserStatus;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ปิดใช้งาน", label: "ปิดใช้งาน" },
  { value: "รอยืนยัน", label: "รอยืนยัน" },
];

function statusVariant(s: string): StatusVariant {
  if (s === "เปิดใช้งาน") return "success";
  if (s === "ปิดใช้งาน" || s === "ระงับ") return "danger";
  return "warning";
}

const USER_DETAIL_FIELDS = [
  { key: "name", label: "ชื่อ-นามสกุล" },
  { key: "email", label: "อีเมล" },
  { key: "role", label: "บทบาท/แผนก" },
  { key: "lastLogin", label: "เข้าใช้ล่าสุด" },
  { key: "status", label: "สถานะ" },
];

export function UsersPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const [state, actions] = useCRUD<UserRow>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [, setDetailAction] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: UserRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q);
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
    navigate({ to: "/admin/settings/users/new" });
  }, [navigate]);

  const handleImport = useCallback(() => {
    alert("นำเข้าข้อมูลผู้ใช้ (จำลอง)");
  }, []);

  const handleExport = useCallback(() => {
    alert("ส่งออกข้อมูลผู้ใช้ (จำลอง)");
  }, []);

  const handleEdit = useCallback((row: UserRow) => {
    navigate({ 
      to: `/admin/settings/users/edit/${row.id}` 
    });
  }, [navigate]);

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

  const handleLock = useCallback(
    (row: UserRow) => {
      actions.updateItem(row.id, { status: "ปิดใช้งาน" });
    },
    [actions],
  );

  const handleUnlock = useCallback(
    (row: UserRow) => {
      actions.updateItem(row.id, { status: "เปิดใช้งาน" });
    },
    [actions],
  );

  const columns: Column<UserRow>[] = [
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
      header: "บทบาท/แผนก",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <UserCog className="h-3 w-3 text-slate-400" />
          {r.role}
        </span>
      ),
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

  const rowActions = createStandardRowActions<UserRow>({
    onEdit: hasPermission("manage_users") ? handleEdit : undefined,
    onView: handleView,
    onDelete: hasPermission("manage_users") ? handleDelete : undefined,
  });

  const createFields = useMemo<FormField[]>(() => [
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
      label: "บทบาท/แผนก",
      type: "select",
      placeholder: "เลือกบทบาท/แผนก",
      required: true,
      options: mockCombinedRoles.map(r => ({ value: r.name, label: r.name })),
    },
  ], []);

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
            onAddNew={hasPermission("manage_users") ? handleAddNew : undefined}
            addNewLabel={TABLE_LABELS.addNew}
            exportLabel="ส่งออก"
            isLoading={state.isLoading}
            showAddNew={hasPermission("manage_users")}
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
            <div className="flex flex-col w-full gap-4 mt-2">
              <div className="flex w-full justify-between items-center bg-slate-50 p-3 rounded-md border border-slate-200">
                <span className="text-sm font-medium text-slate-700">การกำหนดสิทธิ์ผู้ใช้งาน</span>
                <Button 
                  size="sm" 
                  className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-1"
                  onClick={() => {
                    const roleMatch = mockCombinedRoles.find(r => r.name === selectedItem.role);
                    if (roleMatch) {
                      navigate({ to: `/admin/settings/roles/edit/${roleMatch.id}` });
                    } else {
                      alert('ไม่พบบทบาท/แผนกที่สอดคล้องกับผู้ใช้งานรายนี้');
                    }
                  }}
                >
                  <Key className="h-4 w-4" /> จัดการสิทธิ์
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-slate-100">
                {selectedItem.status === "ปิดใช้งาน" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 border-[var(--border)]"
                    onClick={() => handleUnlock(selectedItem)}
                  >
                    <Unlock className="h-4 w-4" /> ปลดล็อกผู้ใช้
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleLock(selectedItem)}
                  >
                    <Lock className="h-4 w-4" /> ล็อกผู้ใช้
                  </Button>
                )}
              </div>
            </div>
          )
        }
      />
    </div>
  );
}