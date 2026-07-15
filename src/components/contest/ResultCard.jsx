import { forwardRef } from "react";
import { Trophy, Users, Calendar } from "lucide-react";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryById } from "@/constants/subCategories";
import { formatDateID } from "@/utils/dateFormat";

/**
 * Read-only result card used for public viewing & PNG export.
 * @param {object} props
 * @param {object} props.contest - { id, name, category, sub_category, age_min, age_max }
 * @param {Array} props.participants - [{ id, name, age }]
 */
export const ResultCard = forwardRef(function ResultCard({ contest, participants }, ref) {
  const meta = getCategoryById(contest?.category);
  const subMeta = contest?.sub_category ? getSubCategoryById(contest.sub_category) : null;
  const isIbuIbu = contest?.category === "ibu-ibu";

  return (
    <div
      ref={ref}
      className="bg-white p-8 md:p-10 rounded-2xl"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="border-b-2 border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-2 text-brand-600 mb-2">
          <Trophy className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Daftar Peserta
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {contest?.name ?? "Lomba"}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-400" />
            <span>
              Kategori{" "}
              <strong className="text-slate-900">
                {meta?.label ?? "-"}
                {subMeta ? ` — ${subMeta.label}` : ""}
              </strong>{" "}
              ({getCategoryAgeLabel(contest?.category)})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{formatDateID()}</span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-3 py-2 text-center text-xs font-bold text-slate-700 uppercase w-14">
              No
            </th>
            <th className="border border-slate-300 px-3 py-2 text-left text-xs font-bold text-slate-700 uppercase">
              Nama
            </th>
            <th className="border border-slate-300 px-3 py-2 text-center text-xs font-bold text-slate-700 uppercase w-20">
              Umur
            </th>
          </tr>
        </thead>
        <tbody>
          {(participants ?? []).map((p, i) => (
            <tr key={p.id}>
              <td className="border border-slate-300 px-3 py-2 text-center text-sm text-slate-700">
                {i + 1}
              </td>
              <td className="border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900">
                {p.name}
              </td>
              <td className="border border-slate-300 px-3 py-2 text-center text-sm text-slate-700">
                {isIbuIbu ? "18+" : p.age}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 pt-5 border-t-2 border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Total Peserta:{" "}
          <strong className="text-slate-900 text-base">
            {participants?.length ?? 0}
          </strong>{" "}
          orang
        </div>
        <div className="text-xs text-slate-400">Daftar Lomba Kadu</div>
      </div>
    </div>
  );
});
