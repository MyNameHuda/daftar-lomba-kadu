import { Link } from "react-router-dom";
import { Trophy, RotateCcw } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { useConfirm } from "@/hooks/useConfirm";
import { CONTEST_ACTIONS } from "@/context/ContestContext";
import { Button } from "@/components/ui/Button";
import { storage } from "@/utils/storage";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { state, dispatch } = useContest();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const hasData = !!state.contestName;

  const handleReset = async () => {
    const ok = await confirm({
      title: "Reset Semua Data?",
      message:
        "Nama lomba, kategori, dan semua peserta akan dihapus. Tindakan ini tidak bisa dibatalkan.",
      confirmText: "Ya, Reset",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok) {
      dispatch({ type: CONTEST_ACTIONS.RESET });
      storage.clear();
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-900 hover:text-brand-600 transition-colors"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm sm:text-base">
            Daftar Lomba
          </span>
        </Link>

        {hasData ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="h-4 w-4" />}
            aria-label="Reset semua data"
          >
            <span className="hidden sm:inline">Reset</span>
          </Button>
        ) : null}
      </div>
    </header>
  );
}
