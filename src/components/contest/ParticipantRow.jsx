import { useState } from "react";
import { Pencil, Trash2, Check, X, User } from "lucide-react";
import { validateName } from "@/utils/validation";
import { getCategoryById } from "@/constants/categories";
import { AgePicker } from "./AgePicker";

const DEFAULT_IBU_IBU_AGE = 18;

/**
 * Editable row for one participant.
 * @param {object} props
 * @param {object} props.participant - { id, name, age }
 * @param {number} props.index
 * @param {object} props.contest - { category } (age range is derived from category via CATEGORIES)
 * @param {Array} props.participants - all participants (for duplicate check on edit)
 * @param {(id, payload) => Promise<{ok: boolean, error?: string}>} props.onUpdate
 * @param {(id) => Promise<{ok: boolean, error?: string}>} props.onDelete
 */
export function ParticipantRow({
  participant,
  index,
  contest,
  participants = [],
  onUpdate,
  onDelete,
}) {
  const isIbuIbu = contest?.category === "ibu-ibu";
  // Age bounds are derived from the contest's category — single source of truth
  // (mirrored on the backend in api/_lib/ageRange.js).
  const categoryMeta = getCategoryById(contest?.category);
  const ageMin = categoryMeta?.ageMin ?? 0;
  const ageMax = categoryMeta?.ageMax ?? null;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(participant.name);
  const [editAge, setEditAge] = useState(
    String(participant.age ?? DEFAULT_IBU_IBU_AGE)
  );
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm(`Hapus "${participant.name}" dari daftar?`)) return;
    setBusy(true);
    try {
      await onDelete(participant.id);
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
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
      const normalized = nameResult.value.trim().toLowerCase();
      const duplicate = participants.some(
        (p) =>
          p.id !== participant.id &&
          p.name.toLowerCase() === normalized &&
          Number(p.age) === finalAge
      );
      if (duplicate) {
        newErrors.name = "Peserta dengan nama dan umur yang sama sudah ada";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBusy(true);
    try {
      const result = await onUpdate?.(participant.id, {
        name: nameResult.value,
        age: finalAge,
      });
      if (result?.ok) {
        setIsEditing(false);
        setErrors({});
      } else if (result?.error) {
        setErrors({ name: result.error });
      }
    } finally {
      setBusy(false);
    }
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
                disabled={busy}
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
                min={ageMin}
                max={ageMax}
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
              disabled={busy}
              className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
              aria-label="Simpan perubahan"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={busy}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
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
            disabled={busy}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-brand-600 transition-colors disabled:opacity-50"
            aria-label={`Edit ${participant.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
            aria-label={`Hapus ${participant.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
