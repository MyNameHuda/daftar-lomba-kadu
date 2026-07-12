import { Baby, Smile, Users, Check } from "lucide-react";

const ICONS = { Baby, Smile, Users };

export function CategoryCard({ category, selected = false, onClick }) {
  const Icon = ICONS[category.iconName] ?? Users;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 bg-white hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        selected
          ? `${category.borderAccent} ring-2 ${category.ringAccent} shadow-md`
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {selected ? (
        <div
          className={`absolute top-3 right-3 h-6 w-6 rounded-full ${category.bgAccent} ${category.accent} flex items-center justify-center`}
          aria-hidden="true"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </div>
      ) : null}

      <div
        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.gradient} text-white flex items-center justify-center mb-4 shadow-sm`}
        aria-hidden="true"
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">
        {category.label}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {category.description}
      </p>
      <p className={`mt-3 text-xs font-semibold ${category.accent}`}>
        Umur {category.ageMin}
        {category.ageMax !== undefined ? `–${category.ageMax}` : "+"} tahun
      </p>
    </button>
  );
}
