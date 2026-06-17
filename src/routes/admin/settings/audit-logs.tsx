import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/layout";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw,
  Search as SearchIcon,
  User,
  Shield,
  Clock,
} from "lucide-react";
import { mockAuditLogs, AUDIT_STATUS_OPTIONS, type LogRow } from "@/mock/audit";

export const Route = createFileRoute("/admin/settings/audit-logs")({
  component: RouteComponent,
});

function RouteComponent() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | LogRow["status"]>("all");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return mockAuditLogs.filter((r) => {
      const matchesQ =
        !t ||
        r.id.toLowerCase().includes(t) ||
        r.username.toLowerCase().includes(t) ||
        r.action.toLowerCase().includes(t);
      const matchesStatus = status === "all" ? true : r.status === status;
      return matchesQ && matchesStatus;
    });
  }, [q, status]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Audit Log
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              บันทึกการใช้งานระบบ (ข้อมูลจำลอง)
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-[var(--border)] bg-white shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                บันทึกวันนี้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#111827]">1,284</div>
              <p className="text-xs text-slate-400">รายการ</p>
            </CardContent>
          </Card>
          <Card className="border-[var(--border)] bg-white shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                สำเร็จ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--success)]">
                1,267
              </div>
              <p className="text-xs text-slate-400">98.7%</p>
            </CardContent>
          </Card>
          <Card className="border-[var(--border)] bg-white shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                ล้มเหลว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">17</div>
              <p className="text-xs text-slate-400">1.3%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base text-[#111827]">
              รายละเอียด Log
            </CardTitle>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ค้นหาจากผู้ใช้หรือการกระทำ..."
                  className="w-[280px] border-[var(--border)] pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { key: "all" as const, label: "ทั้งหมด" },
                    { key: "สำเร็จ" as const, label: "สำเร็จ" },
                    { key: "ล้มเหลว" as const, label: "ล้มเหลว" },
                  ] as const
                ).map((opt) => (
                  <Button
                    key={opt.key}
                    type="button"
                    variant={status === opt.key ? "default" : "outline"}
                    className={
                      status === opt.key
                        ? "border-[var(--gold)] bg-[var(--gold)] text-[#111827] hover:opacity-95"
                        : "border-[var(--border)] bg-white text-slate-600"
                    }
                    onClick={() => setStatus(opt.key)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัส</TableHead>
                  <TableHead>วันที่/เวลา</TableHead>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>การกระทำ</TableHead>
                  <TableHead>โมดูล</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold text-slate-700">
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{row.timestamp}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{row.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{row.userRole}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {row.action}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {row.module}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {row.ipAddress}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          row.status === "สำเร็จ"
                            ? "border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[var(--success)]"
                            : "border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-red-500"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-sm font-semibold text-slate-500"
                    >
                      ไม่พบรายการ
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
