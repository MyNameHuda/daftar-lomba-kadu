import { Users } from "lucide-react";
import { ParticipantRow } from "./ParticipantRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";

/**
 * Table of participants with edit/delete actions (used in admin view).
 * @param {object} props
 * @param {object} props.contest - { category, age_min, age_max }
 * @param {Array} props.participants
 * @param {Function} props.onUpdate - (id, payload) => Promise
 * @param {Function} props.onDelete - (id) => Promise
 */
export function ParticipantTable({ contest, participants = [], onUpdate, onDelete }) {
  if (participants.length === 0) {
    return (
      <Card padding="md">
        <EmptyState
          icon={<Users className="h-7 w-7" />}
          title="Belum ada peserta"
          description="Tambahkan peserta pertama menggunakan form di atas"
        />
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">
            Daftar Peserta
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {participants.length} orang
        </span>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <th className="px-3 py-2 text-center font-semibold w-12">No</th>
              <th className="px-3 py-2 text-left font-semibold">Nama</th>
              <th className="px-3 py-2 text-left font-semibold w-20">Umur</th>
              <th className="px-3 py-2 text-right font-semibold w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {participants.map((p, i) => (
              <ParticipantRow
                key={p.id}
                participant={p}
                index={i}
                contest={contest}
                participants={participants}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
