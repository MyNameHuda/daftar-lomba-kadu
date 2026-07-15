import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Plus, Info } from "lucide-react";
import { validateName } from "@/utils/validation";
import { getCategoryById } from "@/constants/categories";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AgePicker } from "./AgePicker";

const DEFAULT_IBU_IBU_AGE = 18;

/**
 * Form to add a participant.
 * @param {object} props
 * @param {object} props.contest - { id, category } (age range is derived from category via CATEGORIES)
 * @param {Array} props.participants - current participants (for duplicate check)
 * @param {(payload: {name: string, age: number}) => Promise<boolean>} props.onAdd
 */
export function ParticipantForm({ contest, participants = [], onAdd }) {
  const isIbuIbu = contest?.category === "ibu-ibu";
  // Age bounds are derived from the contest's category — single source of truth
  // (mirrored on the backend in api/_lib/ageRange.js).
  const categoryMeta = getCategoryById(contest?.category);
  const ageMin = categoryMeta?.ageMin ?? 0;
  const ageMax = categoryMeta?.ageMax ?? null;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: { name: "", age: isIbuIbu ? String(DEFAULT_IBU_IBU_AGE) : "" },
  });

  const nameValue = watch("name") ?? "";
  const ageValue = watch("age") ?? "";
  const [submitting, setSubmitting] = useState(false);

  const handleAgeSelect = (age) => {
    setValue("age", String(age), { shouldValidate: true, shouldDirty: true });
    clearErrors("age");
  };

  const onSubmit = async (data) => {
    const nameResult = validateName(data.name);
    if (!nameResult.valid) {
      setError("name", { type: "manual", message: nameResult.error });
      return { ok: false, error: nameResult.error };
    }

    let finalAge;
    if (isIbuIbu) {
      finalAge = DEFAULT_IBU_IBU_AGE;
    } else {
      if (!data.age || data.age === "") {
        setError("age", { type: "manual", message: "Pilih umur peserta" });
        return { ok: false, error: "Pilih umur peserta" };
      }
      const ageNum = Number(data.age);
      if (Number.isNaN(ageNum)) {
        setError("age", { type: "manual", message: "Umur tidak valid" });
        return { ok: false, error: "Umur tidak valid" };
      }
      finalAge = ageNum;
    }

    // Local duplicate check
    const normalized = nameResult.value.trim().toLowerCase();
    const duplicate = participants.some(
      (p) => p.name.toLowerCase() === normalized && Number(p.age) === finalAge
    );
    if (duplicate) {
      setError("name", {
        type: "manual",
        message: "Peserta dengan nama dan umur yang sama sudah ada",
      });
      return { ok: false, error: "Peserta duplikat" };
    }

    setSubmitting(true);
    try {
      const result = await onAdd({ name: nameResult.value, age: finalAge });
      if (result?.ok) {
        reset({ name: "", age: isIbuIbu ? String(DEFAULT_IBU_IBU_AGE) : "" });
      } else if (result?.error) {
        setError("name", { type: "manual", message: result.error });
      }
      return result;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card padding="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            Tambah Peserta
          </h2>
        </div>

        <Input
          label="Nama Peserta"
          placeholder="Nama peserta"
          required
          maxLength={50}
          icon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name", {
            validate: (value) => {
              const result = validateName(value);
              return result.valid || result.error;
            },
            onChange: () => clearErrors("name"),
          })}
        />

        {isIbuIbu ? (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-800">
              Kategori <strong>Ibu-Ibu</strong> tidak memerlukan pemilihan
              umur. Peserta akan otomatis tercatat sebagai usia{" "}
              <strong>{DEFAULT_IBU_IBU_AGE}+ tahun</strong>.
            </p>
          </div>
        ) : (
          <AgePicker
            min={ageMin}
            max={ageMax}
            value={ageValue}
            onChange={handleAgeSelect}
            error={errors.age?.message}
          />
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="text-xs text-slate-400">
            {nameValue.length > 0 ? 1 : 0}/1 field nama terisi
          </div>
          <Button
            type="submit"
            disabled={!isValid || submitting}
            loading={submitting}
            icon={<Plus className="h-4 w-4" />}
          >
            Tambah
          </Button>
        </div>
      </form>
    </Card>
  );
}
