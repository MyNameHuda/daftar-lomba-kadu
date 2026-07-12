import { useState } from "react";
import { Pencil, Trash2, Check, X, User } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { CONTEST_ACTIONS } from "@/context/ContestContext";
import { useToast } from "@/hooks/useToast";
import { useConfirm } from "@/hooks/useConfirm";
import { validateName, isDuplicate } from "@/utils/validation";
import { AgePicker } from "./AgePicker";

const DEFAULT_IBU_IBU_AGE = 18;

export function ParticipantRow({ participant, index }) {
  const { state, dispatch } = useContest();
  const toast = useToast();
  const confirm = useConfirm();
  const isIbuIbu = state.category === "ibu-ibu";
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(participant.name);
  const [editAge, setEditAge] = useState(
    String(participant.age ?? DEFAULT_IBU_IBU_AGE)
  );
  const [errors, setErrors] = useState({});

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Hapus Peserta?",
      message: `Yakin ingin menghapus "${participant.name}" dari daftar?`,
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok) {
      dispatch({
        type: CONTEST_ACTIONS.DELETE_PARTICIPANT,
        payload: participant.id,
      });
      toast.success(`${participant.name} dihapus`);
    }
  };

  const handleSave = () => {
    const newErrors = {};

    const nameResult = validateName(editName);
    if (!nameResult.valid) newErrors.name = nameResult.error;

    let finalAge;
    if (isIbuIbu) {
      finalAge = DEFAULT_IBU_IBU_AGE;
    } else {
      const ageNum = Number(editAge);
      if (!editAge || Number.isNaN(ageNum)) {
        newErrors.age = "Pilih umur peserta";
      } else {
        finalAge = ageNum;
      }
    }

    if (!newErrors.name && !newErrors.age) {
      if (
        isDuplicate(
          state.participants,
          nameResult.value,
          finalAge,
          participant.id
        )
      ) {
        newErrors.name = "Peserta dengan nama dan umur yang sama sudah ada";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch({
      type: CONTEST_ACTIONS.EDIT_PARTICIPANT,
      payload: {
        id: participant.id,
        name: nameResult.value,
        age: finalAge,
      },
    });
    toast.success("Data peserta diperbarui");
    setIsEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setEditName(participant.name);
    setEditAge(String(participant.age ?? DEFAULT_IBU_IBU_AGE));
    setErrors({});
    setIsEditing(false);
  };

  const ageDisplay = isIbuIbu ? "18+" : participant.age;

  if (isEditing) {
    return (
      <tr className="bg-brand-50/40 align-top">
        <td className="px-3 py-3 text-center text-sm text-slate-500 font-medium">
          {index + 1}
        </td>
        <td className="px-3 py-3">
          <div className="space-y-1">
            <div className="relative">
              <User className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
                className={`w-full pl-8 pr-2 py-1.5 text-sm border rounded-md outline-none focus:ring-2 ${
                  errors.name
                    ? "border-rose-400 focus:ring-rose-100"
                    : "border-slate-300 focus:border-brand-500 focus:ring-brand-100"
                }`}
                autoFocus
              />
            </div>
            {errors.name ? (
              <p className="text-xs text-rose-600">{errors.name}</p>
            ) : null}
          </div>
        </td>
        <td className="px-3 py-3" colSpan={isIbuIbu ? 2 : 1}>
          {isIbuIbu ? (
            <div className="text-sm text-slate-500 italic">18+ tahun</div>
          ) : (
            <div className="space-y-1">
              <AgePicker
                min={state.ageRange?.min ?? 0}
                max={state.ageRange?.max ?? 0}
                value={editAge}
                onChange={(a) => setEditAge(String(a))}
                error={errors.age}
              />
            </div>
          )}
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={handleSave}
              className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label="Simpan perubahan"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Batal edit"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      <td className="px-3 py-3 text-center text-sm text-slate-500 font-medium tabular-nums">
        {index + 1}
      </td>
      <td className="px-3 py-3 text-sm font-medium text-slate-900">
        {participant.name}
      </td>
      <td className="px-3 py-3 text-sm text-slate-700 tabular-nums">
        {ageDisplay}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors"
            aria-label={`Edit ${participant.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            aria-label={`Hapus ${participant.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
