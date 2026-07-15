import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/contest/ResultCard";
import { getCategoryById, getCategoryAgeLabel } from "@/constants/categories";
import { getSubCategoryById } from "@/constants/subCategories";
import { Trophy, Users, Eye, Smartphone, X } from "lucide-react";
import logoIpeka from "@/assets/logo.png";

export function PublicPreviewModal({ isOpen, onClose, contest, participants = [] }) {
  if (!isOpen) return null;

  const meta = getCategoryById(contest?.category);
  const subMeta = contest?.sub_category
    ? getSubCategoryById(contest.sub_category)
    : null;
  const subtitle = [meta?.label, subMeta?.label, getCategoryAgeLabel(contest?.category)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnEsc closeOnOverlayClick>
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Eye className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 truncate">
              Pratinjau Tampilan Publik
            </h2>
            <p className="text-xs text-slate-500">
              Tampilan persis seperti yang dilihat pengunjung
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Tutup pratinjau"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Phone-framed preview */}
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="mx-auto max-w-[360px]">
          {/* Device frame */}
          <div className="rounded-[28px] bg-slate-900 p-2 shadow-2xl">
            <div className="rounded-[22px] overflow-hidden bg-white">
              {/* Status bar simulation */}
              <div className="h-6 bg-slate-900 flex items-center justify-center">
                <div className="h-1.5 w-16 rounded-full bg-slate-700" />
              </div>

              {/* Public page content (no admin controls) */}
              <div className="bg-slate-50">
                {/* App header */}
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
                  <div className="px-4 h-12 flex items-center gap-2.5">
                    <img
                      src={logoIpeka}
                      alt="Logo IPEKA"
                      className="h-8 w-8 object-contain shrink-0"
                    />
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="font-semibold text-sm truncate">Daftar Lomba</span>
                      <span className="text-[10px] text-slate-500 -mt-0.5">
                        IPEKA · Kadu Jaya
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-5">
                  {/* Hero logo */}
                  <div className="flex flex-col items-center text-center mb-5">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md ring-1 ring-slate-200/70 p-2 flex items-center justify-center mb-2">
                      <img
                        src={logoIpeka}
                        alt="Logo IPEKA"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[10px] font-semibold tracking-wider text-slate-700 uppercase">
                      Ikatan Pemuda Kadu Jaya
                    </p>
                  </div>

                  {/* Page title */}
                  <div className="mb-4">
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">
                      {contest?.name ?? "Detail Lomba"}
                    </h1>
                    {subtitle ? (
                      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                    ) : null}
                  </div>

                  {/* Summary stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-7 w-7 rounded-md bg-gradient-to-br ${meta?.gradient ?? "from-slate-400 to-slate-500"} text-white flex items-center justify-center shrink-0`}
                        >
                          <Trophy className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                            Kategori
                          </p>
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {meta?.label ?? "-"}
                            {subMeta ? ` · ${subMeta.label}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                            Peserta
                          </p>
                          <p className="text-xs font-semibold text-slate-900">
                            {participants.length} orang
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result card */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden">
                    <ResultCard contest={contest} participants={participants} />
                  </div>

                  {/* Footer hint */}
                  <p className="text-[10px] text-slate-400 text-center mt-3">
                    Klik lomba untuk melihat daftar peserta dan export hasil
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Caption below device */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Simulasi tampilan di perangkat mobile</span>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </Modal>
  );
}
