import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "outline" | "ghost" | "danger";
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyAccessor: (row: T) => string;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  rowActions?: RowAction<T>[];
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  isLoading?: boolean;
  showRowNumbers?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  bulkActions?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
  rowActions,
  onSort,
  sortKey,
  sortDirection,
  emptyMessage = "ไม่พบรายการ",
  emptyIcon,
  isLoading = false,
  showRowNumbers = false,
  onRowClick,
  pagination,
  bulkActions,
}: DataTableProps<T>) {
  const allSelected =
    data.length > 0 && data.every((row) => selectedIds.has(keyAccessor(row)));
  const someSelected =
    data.some((row) => selectedIds.has(keyAccessor(row))) && !allSelected;

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  return (
    <div className="space-y-4">
      {bulkActions && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-soft)] px-4 py-3">
          <span className="text-sm font-semibold text-[#111827]">
            เลือกแล้ว {selectedIds.size} รายการ
          </span>
          {bulkActions}
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                {onToggleSelect && (
                  <TableHead className="w-[48px]">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el && someSelected) {
                          (el as unknown as HTMLInputElement).indeterminate =
                            someSelected;
                        }
                      }}
                      onCheckedChange={() => {
                        if (allSelected) {
                          onSelectAll?.([]);
                        } else {
                          onSelectAll?.(data.map(keyAccessor));
                        }
                      }}
                      aria-label="เลือกทั้งหมด"
                    />
                  </TableHead>
                )}
                {showRowNumbers && (
                  <TableHead className="w-[48px] text-center">#</TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={col.width ? `w-[${col.width}]` : undefined}
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        className="flex items-center gap-1 font-semibold hover:text-[var(--gold)] transition-colors"
                        onClick={() => {
                          const newDir =
                            sortKey === col.key
                              ? sortDirection === "asc"
                                ? "desc"
                                : "asc"
                              : "asc";
                          onSort(col.key, newDir);
                        }}
                      >
                        {col.header}
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span className="font-semibold">{col.header}</span>
                    )}
                  </TableHead>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <TableHead className="w-[120px] text-right">จัดการ</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {onToggleSelect && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                    {showRowNumbers && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton />
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (onToggleSelect ? 1 : 0) +
                      (showRowNumbers ? 1 : 0) +
                      (rowActions ? 1 : 0)
                    }
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {emptyIcon && (
                        <span className="text-slate-400">{emptyIcon}</span>
                      )}
                      <span className="text-sm font-semibold text-slate-500">
                        {emptyMessage}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => {
                  const id = keyAccessor(row);
                  const isSelected = selectedIds.has(id);
                  return (
                    <TableRow
                      key={id}
                      className={[
                        isSelected ? "bg-[var(--gold-soft)]/30" : "",
                        onRowClick
                          ? "cursor-pointer hover:bg-slate-50 transition-colors"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {onToggleSelect && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleSelect(id)}
                            aria-label={`เลือก ${id}`}
                          />
                        </TableCell>
                      )}
                      {showRowNumbers && (
                        <TableCell className="text-center text-sm text-slate-500">
                          {index + 1}
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render
                            ? col.render(row)
                            : ((row as Record<string, unknown>)[
                                col.key
                              ] as ReactNode)}
                        </TableCell>
                      ))}
                      {rowActions && rowActions.length > 0 && (
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {rowActions.map((action, i) => (
                              <Button
                                key={i}
                                type="button"
                                variant={
                                  (action.variant as
                                    | "default"
                                    | "outline"
                                    | "ghost"
                                    | "destructive") || "ghost"
                                }
                                size="sm"
                                className={
                                  action.variant === "danger"
                                    ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                                    : "text-slate-600 hover:text-[#111827]"
                                }
                                disabled={action.disabled?.(row)}
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon || action.label}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-500">
            แสดง {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            จาก {pagination.total} รายการ
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-semibold text-[#111827]">
              {pagination.page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return <div className="h-5 w-full animate-pulse rounded bg-slate-200" />;
}
