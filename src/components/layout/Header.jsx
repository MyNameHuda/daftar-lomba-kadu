import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import logoIpeka from "@/assets/logo.png";
import { ROUTES } from "@/constants/routes";

export function Header() {
  const { isAuthed, isLoading, admin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2.5 text-slate-900 hover:text-slate-700 transition-colors"
        >
          <img
            src={logoIpeka}
            alt="Logo IPEKA - Ikatan Pemuda Kadu Jaya"
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain shrink-0"
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-semibold text-sm sm:text-base truncate">
              Daftar Lomba
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 -mt-0.5">
              IPEKA · Kadu Jaya
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {!isLoading ? (
            isAuthed ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                icon={<ShieldCheck className="h-4 w-4" />}
                aria-label={admin ? `Admin (${admin.username})` : "Admin"}
              >
                <span className="hidden sm:inline">Admin</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.ADMIN_LOGIN)}
                icon={<ShieldCheck className="h-4 w-4" />}
                aria-label="Login admin"
              >
                <span className="hidden sm:inline">Login Admin</span>
              </Button>
            )
          ) : null}
        </div>
      </div>
    </header>
  );
}
