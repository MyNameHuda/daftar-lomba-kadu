import { Hash } from "lucide-react";

function buildAges(min, max) {
  if (max === undefined || max === null) {
    return [];
  }
  const ages = [];
  for (let i = min; i <= max; i++) ages.push(i);
  return ages;
}

export function AgePicker({
  min,
  max,
  value,
  onChange,
  disabled = false,
  error = null,
}) {
  const ages = buildAges(min, max);

  if (ages.length === 0) {
    return (
      <div className="text-sm text-slate-500 italic">
        Kategori ini tidak memerlukan pemilihan umur.
      </div>
    );
  }

  const useWideGrid = ages.length > 6;
  const gridCols = useWideGrid
    ? "grid-cols-5 sm:grid-cols-9"
    : "grid-cols-5 sm:grid-cols-6";

  return (
    <div className="w-full">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
        <Hash className="h-3.5 w-3.5" />
        <span>
          Umur <span className="text-rose-500">*</span>
        </span>
        <span className="text-xs text-slate-400 font-normal ml-auto">
          {min}
          {max !== undefined ? `–${max}` : "+"} tahun
        </span>
      </label>
      <div
        className={`grid ${gridCols} gap-1.5`}
        role="radiogroup"
        aria-label="Pilih umur"
      >
        {ages.map((age) => {
          const isSelected =
            value !== undefined && value !== null && String(value) === String(age);
          return (
            <button
              key={age}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange?.(age)}
              className={`h-11 rounded-lg font-semibold text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${
                isSelected
                  ? "bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-md scale-105 ring-2 ring-brand-200"
                  : error
                  ? "bg-white border border-rose-300 text-slate-700 hover:border-rose-400 hover:bg-rose-50"
                  : "bg-white border border-slate-300 text-slate-700 hover:border-brand-400 hover:bg-brand-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {age}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
