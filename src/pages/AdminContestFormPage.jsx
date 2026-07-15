import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Save, AlertCircle, ArrowLeft, Pencil, Plus, Copy } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  CATEGORIES,
  getCategoryById,
  getCategoryAgeLabel,
} from "@/constants/categories";
import { SUB_CATEGORIES, getSubCategoryById } from "@/constants/subCategories";
import { CategoryCard } from "@/components/contest/CategoryCard";
import { validateContestName } from "@/utils/validation";
import { formatDateID } from "@/utils/dateFormat";
import { ROUTES } from "@/constants/routes";

function FieldError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-xs text-rose-600 mt-1.5">
      {children}
    </p>
  );
}

export default function AdminContestFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [searchParams] = useSearchParams();
  const showEditMode = isEdit && searchParams.get("edit") === "1";
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      sub_category: "",
    },
  });

  const watchName = watch("name") ?? "";
  const watchCategory = watch("category") ?? "";
  const watchSubCategory = watch("sub_category") ?? "";

  // Load existing contest if editing
  useEffect(() => {
    if (!isEdit) return;
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    api
      .getContest(id, controller.signal)
      .then((res) => {
        const c = res?.contest;
        if (!c) {
          setLoadError("Lomba tidak ditemukan");
          return;
        }
        setValue("name", c.name, { shouldValidate: true });
        setValue("category", c.category, { shouldValidate: true });
        setValue("sub_category", c.sub_category ?? "", { shouldValidate: true });
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setLoadError(err instanceof ApiError ? err.message : "Gagal memuat lomba");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, isEdit, setValue]);

  const handleCategoryPick = (catId) => {
    setValue("category", catId, { shouldValidate: true, shouldDirty: true });
    if (catId !== "anak") {
      setValue("sub_category", "", { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleSubCategoryPick = (subId) => {
    setValue("sub_category", subId, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data) => {
    setServerError(null);

    // Local validation (mirror server)
    const nameResult = validateContestName(data.name);
    if (!nameResult.valid) {
      setServerError(nameResult.error);
      return;
    }
    if (!data.category || !CATEGORIES.find((c) => c.id === data.category)) {
      setServerError("Kategori wajib dipilih");
      return;
    }
    if (data.category === "anak" && !data.sub_category) {
      setServerError("Sub-kategori wajib dipilih untuk kategori Anak");
      return;
    }

    // age_min/age_max are no longer sent — the system derives the range
    // from the category server-side.
    const payload = {
      name: nameResult.value,
      category: data.category,
      sub_category: data.category === "anak" ? data.sub_category : null,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        const res = await api.updateContest(id, payload);
        toast.success("Lomba diperbarui");
        navigate(ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(res.contest.id)));
      } else {
        const res = await api.createContest(payload);
        const copied = res?.copied_from;
        if (copied && copied.count > 0) {
          toast.success(
            `Lomba dibuat. ${copied.count} peserta otomatis disalin dari "${copied.name}".`
          );
        } else {
          toast.success("Lomba dibuat");
        }
        navigate(ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(res.contest.id)));
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Gagal menyimpan lomba";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Decide mode
  // - New: just show form
  // - Edit with ?edit=1: show form (edit mode)
  // - Edit (participants view, no edit param): show read-only summary
  const isReadOnlyView = isEdit && !showEditMode;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <PageHeader title="Lomba Tidak Ditemukan" backTo={ROUTES.ADMIN_DASHBOARD} />
        <Card padding="md">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{loadError}</p>
              <div className="mt-3">
                <Link to={ROUTES.ADMIN_DASHBOARD}>
                  <Button size="sm" variant="secondary" icon={<ArrowLeft className="h-4 w-4" />}>
                    Kembali ke Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isReadOnlyView) {
    return <ReadOnlySummary id={id} onEdit={() => {
      navigate(`${ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(id))}?edit=1`);
    }} />;
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Lomba" : "Lomba Baru"}
        subtitle={
          isEdit
            ? "Perbarui informasi lomba"
            : "Daftarkan lomba baru untuk mulai mendata peserta"
        }
        backTo={isEdit ? ROUTES.ADMIN_DASHBOARD : ROUTES.ADMIN_DASHBOARD}
      />

      {!isEdit ? (
        <div
          role="note"
          className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-sky-50 border border-sky-200 text-sm text-sky-900"
        >
          <Copy className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Salin peserta otomatis</p>
            <p className="text-xs text-sky-800/80 mt-0.5">
              Kalau ada lomba sebelumnya dengan kategori (dan sub-kategori untuk
              Anak) yang sama dan sudah punya peserta, daftar peserta akan
              otomatis disalin ke lomba baru ini.
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card padding="md">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Informasi Lomba
          </h2>
          <Input
            label="Nama Lomba"
            placeholder="Contoh: Lomba Makan Kerupuk"
            required
            autoFocus={!isEdit}
            maxLength={100}
            error={errors.name?.message}
            icon={isEdit ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {...register("name", {
              validate: (v) => {
                const r = validateContestName(v);
                return r.valid || r.error;
              },
            })}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            {watchName.length}/100 karakter
          </p>
        </Card>

        <Card padding="md">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Kategori
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                selected={watchCategory === cat.id}
                onClick={() => handleCategoryPick(cat.id)}
              />
            ))}
          </div>
          <FieldError>{errors.category?.message}</FieldError>

          {watchCategory === "anak" ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2.5">
                Sub Kategori
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUB_CATEGORIES.map((sub) => (
                  <CategoryCard
                    key={sub.id}
                    category={sub}
                    selected={watchSubCategory === sub.id}
                    onClick={() => handleSubCategoryPick(sub.id)}
                  />
                ))}
              </div>
              <FieldError>{errors.sub_category?.message}</FieldError>
            </div>
          ) : null}
        </Card>

        {serverError ? (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{serverError}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Link to={ROUTES.ADMIN_DASHBOARD}>
            <Button type="button" variant="secondary" disabled={submitting}>
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isValid || submitting}
            loading={submitting}
            icon={<Save className="h-4 w-4" />}
          >
            {isEdit ? "Simpan Perubahan" : "Buat Lomba"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// =====================================================
// Read-only summary (default view when admin opens an existing contest)
// =====================================================

function ReadOnlySummary({ id, onEdit }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    api
      .getContest(id, controller.signal)
      .then((res) => {
        setContest(res?.contest ?? null);
        setStatus("ok");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        toast.error(err instanceof ApiError ? err.message : "Gagal memuat lomba");
        setStatus("error");
      });
    return () => controller.abort();
  }, [id, toast]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div>
        <PageHeader title="Lomba Tidak Ditemukan" backTo={ROUTES.ADMIN_DASHBOARD} />
      </div>
    );
  }

  const meta = getCategoryById(contest.category);
  const subMeta = contest.sub_category ? getSubCategoryById(contest.sub_category) : null;

  return (
    <div>
      <PageHeader
        title={contest.name}
        subtitle={[meta?.label, subMeta?.label].filter(Boolean).join(" — ")}
        backTo={ROUTES.ADMIN_DASHBOARD}
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={onEdit}
              icon={<Pencil className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.ADMIN_CONTEST_EDIT.replace(":id", String(id)) + "/peserta")}
            >
              Kelola Peserta
            </Button>
          </>
        }
      />
      <Card padding="md">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-slate-400 uppercase tracking-wider">Kategori</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">
              {meta?.label ?? "-"}
              {subMeta ? ` · ${subMeta.label}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 uppercase tracking-wider">Umur</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">
              {getCategoryAgeLabel(contest.category)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 uppercase tracking-wider">Peserta</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">
              {contest.participant_count ?? 0} orang
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400 uppercase tracking-wider">Dibuat</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">
              {formatDateID(contest.created_at)}
            </dd>
          </div>
        </dl>
      </Card>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate(`/lomba/${id}`)}
          variant="secondary"
        >
          Lihat Tampilan Publik
        </Button>
      </div>
    </div>
  );
}
