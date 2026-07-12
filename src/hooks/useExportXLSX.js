import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { formatDateID } from "@/utils/dateFormat";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";

const HEADER_STYLE = { font: { bold: true }, fill: { fgColor: { rgb: "EEF2FF" } } };
const TITLE_STYLE = { font: { bold: true, sz: 14 } };
const META_STYLE = { font: { italic: true, color: { rgb: "64748B" } } };
const TOTAL_STYLE = { font: { bold: true } };

function setCellStyle(ws, row, col, style) {
  const ref = XLSX.utils.encode_cell({ r: row, c: col });
  if (!ws[ref]) ws[ref] = { v: "", t: "s" };
  ws[ref].s = style;
}

export function useExportXLSX() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportToXlsx = useCallback(
    async (participants, contestName, category, filename) => {
      if (!participants || participants.length === 0) {
        const err = new Error("Tidak ada peserta untuk diekspor");
        setError(err);
        return { ok: false, error: err };
      }

      setIsExporting(true);
      setError(null);

      try {
        const meta = getCategoryById(category);
        const isIbuIbu = category === "ibu-ibu";

        const aoa = [
          [contestName ?? "Lomba"],
          [`Kategori: ${meta?.label ?? "-"} (${getCategoryAgeLabel(category)})`],
          [`Tanggal Generate: ${formatDateID()}`],
          [],
          ["No", "Nama", isIbuIbu ? "Kategori Umur" : "Umur"],
        ];

        participants.forEach((p, i) => {
          aoa.push([i + 1, p.name, isIbuIbu ? "18+" : p.age]);
        });

        aoa.push([]);
        aoa.push([`Total Peserta: ${participants.length} orang`]);

        const ws = XLSX.utils.aoa_to_sheet(aoa);

        ws["!cols"] = [
          { wch: 5 },
          { wch: 32 },
          { wch: isIbuIbu ? 16 : 10 },
        ];

        ws["!merges"] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
          { s: { r: aoa.length - 1, c: 0 }, e: { r: aoa.length - 1, c: 2 } },
        ];

        setCellStyle(ws, 0, 0, TITLE_STYLE);
        setCellStyle(ws, 1, 0, META_STYLE);
        setCellStyle(ws, 2, 0, META_STYLE);
        setCellStyle(ws, 4, 0, HEADER_STYLE);
        setCellStyle(ws, 4, 1, HEADER_STYLE);
        setCellStyle(ws, 4, 2, HEADER_STYLE);
        setCellStyle(ws, aoa.length - 1, 0, TOTAL_STYLE);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Peserta");

        XLSX.writeFile(wb, filename);

        setIsExporting(false);
        return { ok: true, error: null };
      } catch (err) {
        console.error("Export XLSX failed:", err);
        setError(err);
        setIsExporting(false);
        return { ok: false, error: err };
      }
    },
    []
  );

  return { exportToXlsx, isExporting, error };
}
