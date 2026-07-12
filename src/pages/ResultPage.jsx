import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, ArrowLeft, FileSpreadsheet } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { useExportPNG } from "@/hooks/useExportPNG";
import { useExportXLSX } from "@/hooks/useExportXLSX";
import { useToast } from "@/hooks/useToast";
import { generateExportFilename } from "@/utils/filename";
import { ResultCard } from "@/components/contest/ResultCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants/routes";

export default function ResultPage() {
  const { state } = useContest();
  const navigate = useNavigate();
  const resultRef = useRef(null);
  const { exportToPng, isExporting: isExportingPng } = useExportPNG();
  const { exportToXlsx, isExporting: isExportingXlsx } = useExportXLSX();
  const toast = useToast();

  const isBusy = isExportingPng || isExportingXlsx;

  const handleDownloadPng = async () => {
    if (!resultRef.current) {
      toast.error("Element tidak ditemukan, coba refresh halaman");
      return;
    }
    const filename = generateExportFilename(
      state.contestName,
      state.category,
      "png"
    );
    const result = await exportToPng(resultRef.current, filename);
    if (result.ok) {
      toast.success(`Berhasil didownload: ${filename}`);
    } else {
      const message =
        result.error?.message || "Terjadi kesalahan tidak dikenal";
      toast.error(`Gagal export PNG: ${message.slice(0, 80)}`);
    }
  };

  const handleDownloadXlsx = async () => {
    const filename = generateExportFilename(
      state.contestName,
      state.category,
      "xlsx"
    );
    const result = await exportToXlsx(
      state.participants,
      state.contestName,
      state.category,
      filename
    );
    if (result.ok) {
      toast.success(`Berhasil didownload: ${filename}`);
    } else {
      const message =
        result.error?.message || "Terjadi kesalahan tidak dikenal";
      toast.error(`Gagal export XLSX: ${message.slice(0, 80)}`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hasil"
        subtitle="Daftar peserta yang sudah diurutkan"
        backTo={ROUTES.PARTICIPANTS}
      />

      <Card padding="sm" className="mb-4 overflow-hidden">
        <div className="bg-slate-50 -m-2 md:-m-3 p-3 md:p-4 rounded-xl">
          <ResultCard ref={resultRef} />
        </div>
      </Card>

      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            size="lg"
            onClick={handleDownloadPng}
            loading={isExportingPng}
            disabled={isBusy && !isExportingPng}
            icon={<Download className="h-4 w-4" />}
          >
            {isExportingPng ? "Memproses..." : "Download PNG"}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleDownloadXlsx}
            loading={isExportingXlsx}
            disabled={isBusy && !isExportingXlsx}
            icon={<FileSpreadsheet className="h-4 w-4" />}
          >
            {isExportingXlsx ? "Memproses..." : "Download XLSX"}
          </Button>
        </div>

        <Button
          fullWidth
          size="md"
          variant="ghost"
          onClick={() => navigate(ROUTES.PARTICIPANTS)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Kembali Input Peserta
        </Button>
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        File akan disimpan dengan nama{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
          {generateExportFilename(state.contestName, state.category, "png")}
        </code>{" "}
        atau{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
          {generateExportFilename(state.contestName, state.category, "xlsx")}
        </code>
      </p>
    </div>
  );
}
