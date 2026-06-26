import { useMemo, useState, useEffect } from "react";
import {
  mockDashboardComplaints,
  type DashboardComplaintRow,
} from "@/mock/complaints";
import {
  TriangleAlert,
  ClipboardList,
  FileSearchIcon,
  RefreshCcw,
  ClipboardCheck,
  FilePen,
  Hourglass,
  FilePlusIcon,
  ArrowUpFromLine,
  Search as SearchIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// ─── Import เพิ่มเติมสำหรับการจัดการวันที่ (shadcn/ui & date-fns) ────────────
import { format, subMonths, subWeeks, subDays, differenceInMonths, startOfDay, endOfDay, isSameDay } from "date-fns";
import { th } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// ─── Types ────────────────────────────────────────────────────────────────────

type ComplaintStatus =
  | "ใหม่"
  | "กำลังดำเนินการ"
  | "อยู่ระหว่างตรวจสอบ"
  | "รออนุมัติ"
  | "ปิดเรื่องแล้ว"
  | "เกิน SLA";

type Priority = "สูง" | "กลาง" | "ต่ำ";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_BADGE_CLASS: Record<ComplaintStatus, string> = {
  ใหม่: "border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[var(--success)]",
  กำลังดำเนินการ:
    "border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[var(--warning)]",
  อยู่ระหว่างตรวจสอบ:
    "border border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.12)] text-blue-600",
  รออนุมัติ:
    "border border-[rgba(168,85,247,0.25)] bg-[rgba(168,85,247,0.12)] text-purple-600",
  ปิดเรื่องแล้ว:
    "border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]",
  "เกิน SLA":
    "border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-red-600",
};

const PRIORITY_BADGE_CLASS: Record<Priority, string> = {
  สูง: "border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-red-600",
  กลาง: "border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[var(--warning)]",
  ต่ำ: "border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[var(--success)]",
};

const EARTH_COLORS = [
  "#EF4444", // แดง (Bright Red)
  "#3B82F6", // น้ำเงิน (Digital Blue)
  "#10B981", // เขียว (Vibrant Emerald)
  "#F97316", // ส้ม (Energetic Orange)
  "#8B5CF6", // ม่วง (Vibrant Violet)
  "#FACC15", // เหลือง (Golden Yellow)
  "#A16207", // น้ำตาล (Warm Brown)
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [searchQ, setSearchQ] = useState("");
  
  // Default State: เป็นวันปัจจุบันตาม Requirement
  const today = new Date();
  const minAllowedDate = startOfDay(subMonths(today, 6));

  // 🌟 ปรับปรุง: ครอบ startOfDay และ endOfDay ไว้ตั้งแต่แรก
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(today),
    to: endOfDay(today),
  });

  const nowThaiText = useMemo(() => {
    const d = new Date();
    const day = d.getDate();
    const monthIndex = d.getMonth();
    const yearBE = d.getFullYear() + 543;
    const monthsTH = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
    ];

    return `${day} ${monthsTH[monthIndex]} ${yearBE}`;
  }, []);

  // Validation & Console Log สำหรับเตรียมต่อ API
  useEffect(() => {
    if (dateRange?.from) {
      const fromStr = format(dateRange.from, "yyyy-MM-dd");
      const toStr = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : fromStr;
      
      // ตัวอย่างจำลองการยิง Request ในอนาคต
      console.log(`GET /admin/dashboard/ranking?startDate=${fromStr}&endDate=${toStr}`);
    }
  }, [dateRange]);

  const handleDateSelect = (range: DateRange | undefined) => {
    // 🌟 ดักบั๊ก: ถ้าค่ากลายเป็น undefined (เกิดจากกดคลิกซ้ำ) ให้ตั้งกลับเป็นวันปัจจุบัน
    if (!range || !range.from) {
      setDateRange({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      });
      return;
    }

    if (range.from && range.to) {
      // Validate: ช่วงเวลาต้องไม่เกิน 6 เดือน
      if (differenceInMonths(range.to, range.from) > 6) {
        alert("ไม่สามารถเลือกช่วงวันที่เกิน 6 เดือนได้");
        return;
      }
    }
    setDateRange(range);
  };

  const handlePresetClick = (amount: number, unit: "days" | "weeks" | "months") => {
    const toDate = endOfDay(today);
    let fromDate = today;

    if (unit === "days") {
      fromDate = startOfDay(subDays(today, amount)); // <-- เพิ่มเงื่อนไขนี้
    } else if (unit === "weeks") {
      fromDate = startOfDay(subWeeks(today, amount));
    } else if (unit === "months") {
      fromDate = startOfDay(subMonths(today, amount));
    }

    setDateRange({ from: fromDate, to: toDate });
  };

  // 1. ประมวลผลข้อมูลที่ถูก Filter (กรองด้วย Date Range และค้นหา)
  const filtered = useMemo(() => {
    let result = mockDashboardComplaints;

    if (dateRange?.from) {
      const fromDate = startOfDay(dateRange.from);
      const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

      result = result.filter((r: DashboardComplaintRow) => {
        const [datePart] = r.submittedAt.split(" ");
        const [day, month, year] = datePart.split("-").map(Number);
        const itemDate = new Date(year, month - 1, day);

        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    const q = searchQ.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (r) =>
          r.refNo.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.subCategory.toLowerCase().includes(q) ||
          r.assignee.toLowerCase().includes(q),
      );
    }

    return result;
  }, [searchQ, dateRange]);

  // 2. คำนวณ KPI จาก filtered
  const kpis = useMemo(() => {
    return [
      {
        label: "เรื่องร้องเรียนทั้งหมด",
        value: filtered.length,
        icon: ClipboardList,
        iconColor: "bg-blue-100 text-blue-600",
      },
      {
        label: "เรื่องร้องเรียนใหม่",
        value: filtered.filter((c) => c.status === "ใหม่").length,
        icon: FilePlusIcon,
        iconColor: "bg-cyan-100 text-cyan-600",
      },
      {
        label: "เกิน SLA",
        value: filtered.filter((c) => c.status === "เกิน SLA").length,
        icon: TriangleAlert,
        iconColor: "bg-red-100 text-red-600",
      },
      {
        label: "ใกล้ครบ SLA",
        value: filtered.filter(
          (c) =>
            c.status === "กำลังดำเนินการ" || c.status === "อยู่ระหว่างตรวจสอบ",
        ).length,
        icon: Hourglass,
        iconColor: "bg-orange-100 text-orange-600",
      },
      {
        label: "อยู่ระหว่างดำเนินการ",
        value: filtered.filter((c) => c.status === "กำลังดำเนินการ").length,
        icon: RefreshCcw,
        iconColor: "bg-indigo-100 text-indigo-600",
      },
      {
        label: "อยู่ระหว่างตรวจสอบ",
        value: filtered.filter((c) => c.status === "อยู่ระหว่างตรวจสอบ").length,
        icon: FileSearchIcon,
        iconColor: "bg-purple-100 text-purple-600",
      },
      {
        label: "รออนุมัติ",
        value: filtered.filter((c) => c.status === "รออนุมัติ").length,
        icon: FilePen,
        iconColor: "bg-amber-100 text-amber-600",
      },
      {
        label: "ปิดเรื่องแล้ว",
        value: filtered.filter((c) => c.status === "ปิดเรื่องแล้ว").length,
        icon: ClipboardCheck,
        iconColor: "bg-green-100 text-green-600",
      },
    ];
  }, [filtered]);

  // 3. คำนวณกราฟรายเดือน จาก filtered
  const dynamicMonthlyData = useMemo(() => {
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."];
    const counts = [0, 0, 0, 0, 0, 0];
    filtered.forEach((c) => {
      const monthPart = c.submittedAt.split("-")[1];
      if (monthPart) {
        const m = parseInt(monthPart, 10);
        if (m >= 1 && m <= 6) counts[m - 1]++;
      }
    });
    return months.map((month, i) => ({ month, total: counts[i] }));
  }, [filtered]);

  // 4. คำนวณหมวดหมู่ จาก filtered
  const dynamicCategoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([category, total]) => ({
      category,
      total,
    }));
  }, [filtered]);

  // 5. คำนวณสถานะ จาก filtered
  const dynamicStatusData = useMemo(() => {
    const statuses: ComplaintStatus[] = [
      "ใหม่",
      "กำลังดำเนินการ",
      "อยู่ระหว่างตรวจสอบ",
      "รออนุมัติ",
      "ปิดเรื่องแล้ว",
      "เกิน SLA",
    ];
    return statuses.map((status) => ({
      status,
      count: filtered.filter((c) => c.status === status).length,
    }));
  }, [filtered]);

  const maxStatus = Math.max(1, ...dynamicStatusData.map((s) => s.count));

  // 6. คำนวณ SLA จาก filtered
  const dynamicSlaData = useMemo(() => {
    const total = filtered.length || 1;
    const overdue = filtered.filter((c) => c.status === "เกิน SLA").length;
    const near = filtered.filter(
      (c) => c.status === "กำลังดำเนินการ" || c.status === "อยู่ระหว่างตรวจสอบ",
    ).length;
    const onTime = filtered.length - overdue - near;

    return [
      { label: "ตรงเวลา", value: Math.round((onTime / total) * 100) },
      { label: "ใกล้ครบกำหนด", value: Math.round((near / total) * 100) },
      { label: "เกินกำหนด", value: Math.round((overdue / total) * 100) },
    ];
  }, [filtered]);

  // 7. สุ่มหน่วยงานแบบจำลองเพื่อให้กราฟดูสวยงาม
  const dynamicOrgData = useMemo(() => {
    const orgsList = [
      "บริษัท กลุ่มสมอทอง จำกัด (มหาชน)",
      "ท่าชนะ",
      "สระบุรี",
      "พนม",
      "บริษัท เอ แอล ปาล์ม จำกัด",
    ];
    const counts: Record<string, number> = {};
    orgsList.forEach((o) => (counts[o] = 0));

    filtered.forEach((c) => {
      const idx = c.refNo.charCodeAt(c.refNo.length - 1) % orgsList.length;
      counts[orgsList[idx]]++;
    });
    return Object.entries(counts)
      .map(([org, total]) => ({ org, total }))
      .sort((a, b) => b.total - a.total);
  }, [filtered]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
            แดชบอร์ด
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            ภาพรวมระบบบริหารเรื่องร้องเรียน — ข้อมูล ณ วันที่ {nowThaiText}
          </p>
        </div>

        {/* Filter & Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          
          {/* Custom Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              {/* ปุ่ม Trigger เดิม (ไม่ต้องแก้) */}
              <Button
                variant="outline"
                className="gap-2 border-[var(--border)] bg-white text-[#111827] justify-start w-full sm:w-[220px]"
              >
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">
                  {dateRange?.from ? (
                    dateRange.to && !isSameDay(dateRange.from, dateRange.to)
                      ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                      : format(dateRange.from, "dd/MM/yyyy", { locale: th })
                  ) : (
                    "เลือกวันที่" // ถึงแม้จะมีข้อความนี้ไว้ แต่จริงๆ จะไม่แสดงแล้วเพราะเราดักไม่ให้เป็นค่าว่างได้แล้ว
                  )}
                </span>
              </Button>
            </PopoverTrigger>

            {/* 🌟 ปรับแก้ PopoverContent ตรงนี้ */}
            <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row items-stretch" align="end">
              
              {/* แถบด้านซ้าย: ปุ่ม Quick Select */}
              <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-[var(--border)] p-3 w-full sm:w-[160px] bg-slate-50">
                <div className="mb-2 px-2 text-xs font-bold text-slate-500">เลือกช่วงเวลาแบบด่วน</div>
                {/* 🌟 3 ปุ่มที่เพิ่มเข้ามาใหม่ แปะไว้บนสุดเลยครับ */}
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(0, "days")}>
                  วันนี้
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(3, "days")}>
                  ย้อนหลัง 3 วัน
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(5, "days")}>
                  ย้อนหลัง 5 วัน
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(1, "weeks")}>
                  ย้อนหลัง 1 สัปดาห์
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(2, "weeks")}>
                  ย้อนหลัง 2 สัปดาห์
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(1, "months")}>
                  ย้อนหลัง 1 เดือน
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(3, "months")}>
                  ย้อนหลัง 3 เดือน
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-xs font-medium text-slate-700" onClick={() => handlePresetClick(6, "months")}>
                  ย้อนหลัง 6 เดือน
                </Button>
              </div>

              {/* แถบด้านขวา: ปฏิทินเดิม */}
              <div className="p-2">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  disabled={(date) => date > today || date < minAllowedDate}
                />
              </div>

            </PopoverContent>
          </Popover>

          {/* ปุ่มส่งออก */}
          <Button
            variant="outline"
            className="gap-2 border-[var(--border)] bg-white text-[#111827] font-semibold w-full sm:w-auto ml-auto sm:ml-0"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            ส่งออก
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="border-[var(--border)] bg-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold text-slate-600">
                    {kpi.label}
                  </CardTitle>
                  <div className="text-3xl font-bold tracking-tight text-[#111827]">
                    {kpi.value}
                  </div>
                </div>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-[#111827]">
              จำนวนเรื่องร้องเรียนรายเดือน
            </CardTitle>
            <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400">
              มกราคม – มิถุนายน 2569
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dynamicMonthlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D29E0E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D29E0E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    dy={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} เรื่อง`, "จำนวน"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#D29E0E"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    activeDot={{
                      r: 6,
                      fill: "#D29E0E",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-[#111827]">
              จำนวนเรื่องร้องเรียนแยกตามประเภท
            </CardTitle>
            <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400">
              6 เดือนแรก พ.ศ. 2569
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex h-[280px] w-full items-center justify-center">
              {dynamicCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicCategoryData}
                      cx="40%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      dataKey="total"
                      nameKey="category"
                      stroke="none"
                    >
                      {dynamicCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={EARTH_COLORS[index % EARTH_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} เรื่อง`, "จำนวน"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#475569",
                        paddingLeft: "10px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm font-semibold text-slate-400">
                  ไม่มีข้อมูลในช่วงเวลานี้
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-[#111827]">
              แยกตามหน่วยงาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dynamicOrgData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="org"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    dy={10}
                    interval={0}
                    tickFormatter={(val) => val.substring(0, 6) + "..."}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    formatter={(value) => [`${value} เรื่อง`, "จำนวน"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#9A8038"
                    radius={[6, 6, 0, 0]}
                    barSize={25}
                  >
                    {dynamicOrgData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EARTH_COLORS[index % EARTH_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-[#111827]">
              สถานะเรื่องร้องเรียน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[220px] flex-col justify-center space-y-5 px-2">
              {dynamicStatusData.map((s, index) => {
                const pct = (s.count / maxStatus) * 100;
                const color = EARTH_COLORS[(index + 2) % EARTH_COLORS.length];
                return (
                  <div key={s.status} className="flex items-center gap-3">
                    <div className="w-24 truncate text-xs font-semibold text-slate-600">
                      {s.status}
                    </div>
                    <div className="relative flex flex-1 items-center">
                      <div className="absolute h-[3px] w-full rounded-full bg-slate-100" />
                      <div
                        className="absolute h-[3px] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                      <div
                        className="absolute h-3 w-3 rounded-full shadow-sm transition-all duration-500"
                        style={{
                          left: `calc(${pct}% - 6px)`,
                          backgroundColor: color,
                          border: "2.5px solid white",
                        }}
                      />
                    </div>
                    <div className="w-8 text-right text-xs font-bold text-[#111827]">
                      {s.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-base text-[#111827]">
              SLA Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[220px] w-full items-center justify-around gap-2 pt-2">
              {dynamicSlaData.map((s, i) => {
                const color = ["#10B981", "#F59E0B", "#EF4444"][i];
                return (
                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="relative h-[85px] w-[85px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { value: s.value },
                              { value: 100 - s.value },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={40}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill={color} />
                            <Cell fill="#F1F5F9" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-slate-700">
                          {s.value}%
                        </span>
                      </div>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-slate-500">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Complaints Table */}
      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base text-[#111827]">
              เรื่องร้องเรียนล่าสุด
            </CardTitle>
            <p className="mt-1 text-xs font-semibold tracking-wide text-slate-400">
              แสดงรายการเรื่องร้องเรียนตามตัวกรอง
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="ค้นหาเลขที่ ประเภท หรือผู้รับผิดชอบ..."
                className="w-[300px] border-[var(--border)] pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เลขที่อ้างอิง</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>หัวข้อย่อย</TableHead>
                <TableHead>วันที่แจ้ง</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ผู้รับผิดชอบ</TableHead>
                <TableHead>SLA Due</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 10).map((row) => (
                <TableRow key={row.refNo}>
                  <TableCell className="font-semibold text-slate-700">
                    {row.refNo}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {row.subCategory}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {row.submittedAt}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        STATUS_BADGE_CLASS[row.status as ComplaintStatus] ??
                        STATUS_BADGE_CLASS["ใหม่"]
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {row.assignee}
                  </TableCell>
                  <TableCell className="text-slate-600">{row.slaDue}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={PRIORITY_BADGE_CLASS[row.priority]}
                    >
                      {row.priority}
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
                    ไม่พบรายการในช่วงเวลานี้
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
          <div className="mt-4 text-xs font-semibold tracking-wide text-slate-400">
            การแบ่งหน้า (จำลอง)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}