import { useForm } from "react-hook-form";
import { User, Plus, Info } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { CONTEST_ACTIONS } from "@/context/ContestContext";
import { useToast } from "@/hooks/useToast";
import { validateName, isDuplicate } from "@/utils/validation";
import { generateId } from "@/utils/id";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AgePicker } from "./AgePicker";

const DEFAULT_IBU_IBU_AGE = 18;

export function ParticipantForm() {
  const { state, dispatch } = useContest();
  const toast = useToast();
  const isIbuIbu = state.category === "ibu-ibu";

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

  const handleAgeSelect = (age) => {
    setValue("age", String(age), { shouldValidate: true, shouldDirty: true });
    clearErrors("age");
  };

  const onSubmit = async (data) => {
    const nameResult = validateName(data.name);
    if (!nameResult.valid) {
      setError("name", { type: "manual", message: nameResult.error });
      toast.error(nameResult.error);
      return;
    }

    let finalAge;
    if (isIbuIbu) {
      finalAge = DEFAULT_IBU_IBU_AGE;
    } else {
      if (!data.age || data.age === "") {
        setError("age", { type: "manual", message: "Pilih umur peserta" });
        toast.error("Pilih umur peserta");
        return;
      }
      const ageNum = Number(data.age);
      if (Number.isNaN(ageNum)) {
        setError("age", { type: "manual", message: "Umur tidak valid" });
        toast.error("Umur tidak valid");
        return;
      }
      finalAge = ageNum;
    }

    if (isDuplicate(state.participants, nameResult.value, finalAge)) {
      setError("name", {
        type: "manual",
        message: "Peserta dengan nama dan umur yang sama sudah ada",
      });
      toast.error("Peserta duplikat");
      return;
    }

    dispatch({
      type: CONTEST_ACTIONS.ADD_PARTICIPANT,
      payload: {
        id: generateId(),
        name: nameResult.value,
        age: finalAge,
      },
    });
    toast.success(`${nameResult.value} ditambahkan`);
    reset({
      name: "",
      age: isIbuIbu ? String(DEFAULT_IBU_IBU_AGE) : "",
    });
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
            min={state.ageRange?.min ?? 0}
            max={state.ageRange?.max ?? 0}
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
            disabled={!isValid}
            icon={<Plus className="h-4 w-4" />}
          >
            Tambah
          </Button>
        </div>
      </form>
    </Card>
  );
}
