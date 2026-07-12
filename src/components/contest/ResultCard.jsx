import { forwardRef } from "react";
import { Trophy, Users, Calendar } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { formatDateID } from "@/utils/dateFormat";

export const ResultCard = forwardRef(function ResultCard(_, ref) {
  const { state } = useContest();
  const meta = getCategoryById(state.category);
  const isIbuIbu = state.category === "ibu-ibu";
  const ageColumnLabel = isIbuIbu ? "Umur" : "Umur";

  return (
    <div
      ref={ref}
      className="bg-white p-8 md:p-10 rounded-2xl"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Header */}
      <div className="border-b-2 border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-2 text-brand-600 mb-2">
          <Trophy className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Daftar Peserta
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {state.contestName}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-400" />
            <span>
              Kategori <strong className="text-slate-900">{meta?.label}</strong> (
              {getCategoryAgeLabel(state.category)})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{formatDateID()}</span>
          </div>
        </div>
      </div>

      {/* Table */}
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
              {ageColumnLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {state.participants.map((p, i) => (
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

      {/* Footer */}
      <div className="mt-6 pt-5 border-t-2 border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Total Peserta:{" "}
          <strong className="text-slate-900 text-base">
            {state.participants.length}
          </strong>{" "}
          orang
        </div>
        <div className="text-xs text-slate-400">Daftar Lomba Kadu</div>
      </div>
    </div>
  );
});
