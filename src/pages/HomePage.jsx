import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryById } from "@/constants/subCategories";
import { formatDateID } from "@/utils/dateFormat";
import { ROUTES } from "@/constants/routes";
import logoIpeka from "@/assets/logo.png";

function ContestRow({ contest }) {
  const meta = getCategoryById(contest.category);
  const subMeta = contest.sub_category
    ? getSubCategoryById(contest.sub_category)
    : null;

  return (
    <Link
      to={ROUTES.CONTEST_DETAIL.replace(":id", String(contest.id))}
      className="block group"
    >
      <Card
        hoverable
        padding="md"
        className="group-hover:border-brand-300 group-hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <div
            className={`h-11 w-11 rounded-xl bg-gradient-to-br ${meta?.gradient ?? "from-slate-400 to-slate-500"} text-white flex items-center justify-center shrink-0 shadow-sm`}
            aria-hidden="true"
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
              <span>{formatDateID(contest.created_at)}</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const [contests, setContests] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
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
        err instanceof ApiError ? err.message : "Gagal memuat daftar lomba";
      setError(message);
      setStatus("error");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div>
      {/* Hero logo */}
      <div className="flex flex-col items-center text-center mb-6 md:mb-8 animate-fadeIn">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-lg ring-1 ring-slate-200/70 p-3 flex items-center justify-center mb-3">
          <img
            src={logoIpeka}
            alt="Logo IPEKA - Ikatan Pemuda Kadu Jaya"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-700 uppercase">
          Ikatan Pemuda Kadu Jaya
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
          Panitia Lomba · Aplikasi Pendataan Peserta
        </p>
      </div>

      <PageHeader
        title="Daftar Lomba"
        subtitle="Lihat dan export hasil lomba yang sudah disusun"
        backTo={null}
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
            description="Lomba yang didaftarkan oleh panitia akan muncul di sini."
          />
        </Card>
      ) : (
        <div className="space-y-2.5">
          {contests.map((c) => (
            <ContestRow key={c.id} contest={c} />
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-xs text-slate-400">
        <p>Klik lomba untuk melihat daftar peserta dan export hasil</p>
      </div>
    </div>
  );
}
