import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  Users,
  Calendar,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryById } from "@/constants/subCategories";
import { formatDateID } from "@/utils/dateFormat";
import { ROUTES } from "@/constants/routes";

function ContestRowAdmin({ contest, onDelete }) {
  const meta = getCategoryById(contest.category);
  const subMeta = contest.sub_category
    ? getSubCategoryById(contest.sub_category)
    : null;

  return (
    <Card padding="md">
      <div className="flex items-start gap-3">
        <div
          className={`h-11 w-11 rounded-xl bg-gradient-to-br ${meta?.gradient ?? "from-slate-400 to-slate-500"} text-white flex items-center justify-center shrink-0 shadow-sm`}
        >
          <Trophy className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 truncate">
            {contest.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {meta?.label ?? "-"}
            {subMeta ? ` — ${subMeta.label}` : ""} ·{" "}
            {getCategoryAgeLabel(contest.category)}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {contest.participant_count ?? 0} peserta
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateID(contest.created_at)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(contest.id))}
            aria-label={`Kelola peserta ${contest.name}`}
            className="p-2 rounded-md text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <Users className="h-4 w-4" />
          </Link>
          <Link
            to={`${ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(contest.id))}?edit=1`}
            aria-label={`Edit ${contest.name}`}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(contest)}
            aria-label={`Hapus ${contest.name}`}
            className="p-2 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const load = async (signal) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.listContests(signal);
      setContests(res?.contests ?? []);
      setStatus("ok");
    } catch (err) {
      if (err?.name === "AbortError") return;
      const message =
        err instanceof ApiError ? err.message : "Gagal memuat lomba";
      setError(message);
      setStatus("error");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  const handleDelete = async (contest) => {
    const ok = await confirm({
      title: "Hapus Lomba?",
      message: `"${contest.name}" dan semua peserta di dalamnya akan dihapus. Tindakan ini tidak bisa dibatalkan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger",
    });
    if (!ok) return;
    try {
      await api.deleteContest(contest.id);
      toast.success(`"${contest.name}" dihapus`);
      load();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Gagal menghapus lomba";
      toast.error(message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard Admin"
        subtitle={
          admin ? `Login sebagai ${admin.username} · Kelola lomba & peserta` : "Dashboard"
        }
        backTo={null}
        actions={
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_CONTEST_NEW)}
            icon={<Plus className="h-4 w-4" />}
          >
            Lomba Baru
          </Button>
        }
      />

      {status === "loading" ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : status === "error" ? (
        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Gagal memuat lomba
              </p>
              <p className="text-sm text-slate-500 mt-0.5">{error}</p>
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => load()}
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Coba lagi
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : contests.length === 0 ? (
        <Card padding="md">
          <EmptyState
            icon={<Trophy className="h-7 w-7" />}
            title="Belum ada lomba"
            description="Mulai dengan mendaftarkan lomba pertama."
            action={
              <Button
                size="md"
                onClick={() => navigate(ROUTES.ADMIN_CONTEST_NEW)}
                icon={<Plus className="h-4 w-4" />}
              >
                Buat Lomba
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {contests.map((c) => (
            <ContestRowAdmin
              key={c.id}
              contest={c}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
        <Link
          to={ROUTES.HOME}
          className="hover:text-slate-600 underline-offset-2 hover:underline"
        >
          Lihat tampilan publik
        </Link>
      </div>
    </div>
  );
}
