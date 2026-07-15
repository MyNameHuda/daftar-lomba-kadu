import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Download, FileSpreadsheet, Pencil, RefreshCw } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { useExportXLSX } from "@/hooks/useExportXLSX";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { ParticipantForm } from "@/components/contest/ParticipantForm";
import { ParticipantTable } from "@/components/contest/ParticipantTable";
import { generateExportFilename } from "@/utils/filename";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryById } from "@/constants/subCategories";
import { ROUTES } from "@/constants/routes";

export default function AdminParticipantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { exportToXlsx, isExporting: isExportingXlsx } = useExportXLSX();

  const [contest, setContest] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const isBusy = isExportingXlsx;

  const load = useCallback(async (signal) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.getContest(id, signal);
      setContest(res?.contest ?? null);
      setParticipants(res?.participants ?? []);
      setStatus("ok");
    } catch (err) {
      if (err?.name === "AbortError") return;
      const message =
        err instanceof ApiError ? err.message : "Gagal memuat peserta";
      setError(message);
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const handleAdd = async (payload) => {
    try {
      const res = await api.addParticipant(id, payload);
      toast.success(`${res.participant.name} ditambahkan`);
      await load();
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Gagal menambah peserta";
      toast.error(message);
      return { ok: false, error: message };
    }
  };

  const handleUpdate = async (participantId, payload) => {
    try {
      await api.updateParticipant(participantId, payload);
      toast.success("Data peserta diperbarui");
      await load();
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Gagal memperbarui peserta";
      toast.error(message);
      return { ok: false, error: message };
    }
  };

  const handleDelete = async (participantId) => {
    try {
      await api.deleteParticipant(participantId);
      toast.success("Peserta dihapus");
      await load();
      return { ok: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Gagal menghapus peserta";
      toast.error(message);
      return { ok: false, error: message };
    }
  };

  const handleDownloadXlsx = async () => {
    if (!contest) return;
    const filename = generateExportFilename(contest.name, contest.category, "xlsx");
    const result = await exportToXlsx(
      {
        contestName: contest.name,
        category: contest.category,
        subCategory: contest.sub_category,
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
        <PageHeader title="Gagal Memuat" backTo={ROUTES.ADMIN_DASHBOARD} />
        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{error}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => load()}
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Coba lagi
                </Button>
                <Link to={ROUTES.ADMIN_DASHBOARD}>
                  <Button size="sm" variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>
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
  const subMeta = contest?.sub_category ? getSubCategoryById(contest.sub_category) : null;
  const subtitle = [contest?.name, meta?.label, subMeta?.label, getCategoryAgeLabel(contest?.category)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <PageHeader
        title="Kelola Peserta"
        subtitle={subtitle}
        backTo={ROUTES.ADMIN_DASHBOARD}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`${ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(id))}?edit=1`)}
            icon={<Pencil className="h-4 w-4" />}
          >
            Edit Lomba
          </Button>
        }
      />

      <ParticipantForm
        contest={contest}
        participants={participants}
        onAdd={handleAdd}
      />

      <div className="mt-4">
        <ParticipantTable
          contest={contest}
          participants={participants}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>

      {participants.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleDownloadXlsx}
            loading={isExportingXlsx}
            disabled={isBusy && !isExportingXlsx}
            icon={<FileSpreadsheet className="h-4 w-4" />}
          >
            Download XLSX
          </Button>
          <Link to={`/lomba/${id}`} target="_blank" rel="noopener">
            <Button
              size="md"
              fullWidth
              icon={<Download className="h-4 w-4" />}
            >
              Lihat & Export PNG
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
