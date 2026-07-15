import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Download, ArrowLeft, FileSpreadsheet, AlertCircle, Users, Trophy } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { useExportPNG } from "@/hooks/useExportPNG";
import { useExportXLSX } from "@/hooks/useExportXLSX";
import { generateExportFilename } from "@/utils/filename";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryById } from "@/constants/subCategories";
import { ResultCard } from "@/components/contest/ResultCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function ContestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const resultRef = useRef(null);
  const { exportToPng, isExporting: isExportingPng } = useExportPNG();
  const { exportToXlsx, isExporting: isExportingXlsx } = useExportXLSX();

  const [contest, setContest] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const isBusy = isExportingPng || isExportingXlsx;

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setError(null);

    api
      .getContest(id, controller.signal)
      .then((res) => {
        setContest(res?.contest ?? null);
        setParticipants(res?.participants ?? []);
        setStatus("ok");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        const message =
          err instanceof ApiError ? err.message : "Gagal memuat lomba";
        setError(message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [id]);

  const handleDownloadPng = async () => {
    if (!resultRef.current) {
      toast.error("Element tidak ditemukan, coba refresh halaman");
      return;
    }
    const filename = generateExportFilename(
      contest?.name,
      contest?.category,
      "png"
    );
    const result = await exportToPng(resultRef.current, filename);
    if (result.ok) {
      toast.success(`Berhasil didownload: ${filename}`);
    } else {
      const message = result.error?.message || "Terjadi kesalahan tidak dikenal";
      toast.error(`Gagal export PNG: ${message.slice(0, 80)}`);
    }
  };

  const handleDownloadXlsx = async () => {
    const filename = generateExportFilename(
      contest?.name,
      contest?.category,
      "xlsx"
    );
    const result = await exportToXlsx(
      {
        contestName: contest?.name,
        category: contest?.category,
        subCategory: contest?.sub_category,
        participants,
      },
      filename
    );
    if (result.ok) {
      toast.success(`Berhasil didownload: ${filename}`);
    } else {
      const message = result.error?.message || "Terjadi kesalahan tidak dikenal";
      toast.error(`Gagal export XLSX: ${message.slice(0, 80)}`);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <PageHeader title="Lomba Tidak Ditemukan" backTo={ROUTES.HOME} />
        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Gagal memuat lomba
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{error}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => window.location.reload()}>
                  Coba lagi
                </Button>
                <Link to={ROUTES.HOME}>
                  <Button size="sm" variant="secondary">
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const meta = getCategoryById(contest?.category);
  const subMeta = contest?.sub_category
    ? getSubCategoryById(contest.sub_category)
    : null;
  const subtitle = [meta?.label, subMeta?.label, getCategoryAgeLabel(contest?.category)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <PageHeader title={contest?.name ?? "Detail Lomba"} subtitle={subtitle} backTo={ROUTES.HOME} />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-lg bg-gradient-to-br ${meta?.gradient ?? "from-slate-400 to-slate-500"} text-white flex items-center justify-center shrink-0`}
            >
              <Trophy className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Kategori
              </p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {meta?.label ?? "-"}
                {subMeta ? ` · ${subMeta.label}` : ""}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Peserta
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {participants.length} orang
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Result card (for export) */}
      <Card padding="sm" className="mb-4 overflow-hidden">
        <div className="bg-slate-50 -m-2 md:-m-3 p-3 md:p-4 rounded-xl">
          <ResultCard ref={resultRef} contest={contest} participants={participants} />
        </div>
      </Card>

      {/* Export buttons */}
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
          onClick={() => navigate(ROUTES.HOME)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Kembali ke Daftar Lomba
        </Button>
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        File akan disimpan dengan nama{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
          {generateExportFilename(contest?.name, contest?.category, "png")}
        </code>{" "}
        atau{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
          {generateExportFilename(contest?.name, contest?.category, "xlsx")}
        </code>
      </p>
    </div>
  );
}
