import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowRight } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { CONTEST_ACTIONS } from "@/context/ContestContext";
import { useToast } from "@/hooks/useToast";
import { validateContestName } from "@/utils/validation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants/routes";

export function ContestNameForm() {
  const { dispatch, state } = useContest();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: { name: state.contestName ?? "" },
  });

  const nameValue = watch("name") ?? "";

  const onSubmit = (data) => {
    const result = validateContestName(data.name);
    if (!result.valid) {
      toast.error(result.error);
      return;
    }
    dispatch({ type: CONTEST_ACTIONS.SET_CONTEST_NAME, payload: result.value });
    toast.success("Nama lomba disimpan");
    navigate(ROUTES.CATEGORY);
  };

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="text-center mb-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white items-center justify-center mb-3 shadow-md">
            <Trophy className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            Mulai Lomba Baru
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Masukkan nama lomba untuk memulai pendataan peserta
          </p>
        </div>

        <Input
          label="Nama Lomba"
          placeholder="Contoh: Lomba Makan Kerupuk"
          required
          autoFocus
          maxLength={100}
          error={errors.name?.message}
          icon={<Trophy className="h-4 w-4" />}
          {...register("name", {
            validate: (value) => {
              const result = validateContestName(value);
              return result.valid || result.error;
            },
          })}
        />

        <div className="text-xs text-slate-400 text-center">
          {nameValue.length}/100 karakter
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!isValid}
          iconRight={<ArrowRight className="h-4 w-4" />}
        >
          Lanjut
        </Button>
      </form>
    </Card>
  );
}
