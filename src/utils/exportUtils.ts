export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("ไม่มีข้อมูลสำหรับส่งออก");
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((fieldName) => JSON.stringify(row[fieldName] ?? ""))
        .join(",")
    ),
  ].join("\r\n");

  // Add BOM for Excel utf-8 encoding support
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
