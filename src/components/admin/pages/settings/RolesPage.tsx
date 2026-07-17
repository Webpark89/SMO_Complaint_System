import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ShieldCheck, Users, Eye } from "lucide-react";
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
import { mockCombinedRoles, ALL_PERMISSIONS, type RoleStatus, type RoleRow } from "@/mock/roles/roles.mock";

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ปิดใช้งาน", label: "ปิดใช้งาน" },
];

function statusVariant(s: RoleStatus): StatusVariant {
  return s === "เปิดใช้งาน" ? "success" : "danger";
}

function translatePermission(p: string): string {
  const matched = ALL_PERMISSIONS.find((perm) => perm.value === p);
  return matched ? matched.label : p;
}

const DETAIL_FIELDS = [
  { key: "name", label: "ชื่อบทบาท" },
  { key: "description", label: "คำอธิบาย" },
  { key: "userCount", label: "จำนวนผู้ใช้" },
  {
    key: "permissions",
    label: "สิทธิ์การใช้งาน",
    render: (val: any) => {
      const perms = Array.isArray(val) ? val : [];
      return (
        <div className="flex flex-wrap gap-1">
          {perms.map((p) => (
            <Badge
              key={p}
              className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 text-xs hover:bg-[rgba(193,201,214,0.12)]"
            >
              {translatePermission(p)}
            </Badge>
          ))}
          {perms.length === 0 && "—"}
        </div>
      );
    },
  },
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

export function RolesPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [state, actions] = useCRUD<RoleRow>(mockCombinedRoles);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RoleRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});

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
      permissions: ["view_complaints"],
      status: "เปิดใช้งาน",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: RoleRow) => {
    navigate({
      to: `/admin/settings/roles/edit/${row.id}`,
    });
  }, [navigate]);

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

  const columns: Column<RoleRow>[] = [
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
      header: "สิทธิ์การใช้งาน",
      width: "220px",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.permissions.slice(0, 3).map((p) => (
            <Badge
              key={p}
              className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] text-xs"
            >
              {translatePermission(p)}
            </Badge>
          ))}
          {r.permissions.length > 3 && (
            <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] text-xs font-semibold">
              +{r.permissions.length - 3}
            </Badge>
          )}
          {r.permissions.length === 0 && <span className="text-xs text-slate-400">— ไม่มีสิทธิ์ —</span>}
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
    hasPermission("manage_roles") && { label: "แก้ไข", icon: <Edit className="h-4 w-4" />, onClick: handleEdit },
    { label: "ดูรายละเอียด", icon: <Eye className="h-4 w-4 text-[#B8BABF] hover:text-[#8e6c25]" />, onClick: handleView },
    hasPermission("manage_roles") && {
      label: "ลบ",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "danger",
    },
  ].filter((a): a is RowAction<RoleRow> => !!a);

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
            onAddNew={hasPermission("manage_roles") ? handleAddNew : undefined}
            addNewLabel={TABLE_LABELS.addNew}
            exportLabel="ส่งออก"
            isLoading={state.isLoading}
            showAddNew={hasPermission("manage_roles")}
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
