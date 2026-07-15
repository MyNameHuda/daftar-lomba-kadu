import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useConfirm } from "@/hooks/useConfirm";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { GlobalConfirmDialog } from "@/components/common/GlobalConfirmDialog";
import { ROUTES } from "@/constants/routes";
import logoIpeka from "@/assets/logo.png";

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Logout?",
      message: "Anda akan keluar dari panel admin dan perlu login ulang untuk kembali.",
      confirmText: "Ya, Logout",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok) {
      logout();
      navigate(ROUTES.ADMIN_LOGIN, { replace: true });
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link
            to={ROUTES.ADMIN_DASHBOARD}
            className="flex items-center gap-2.5 text-slate-900 hover:text-slate-700 transition-colors"
          >
            <img
              src={logoIpeka}
              alt="Logo IPEKA"
              className="h-9 w-9 sm:h-10 sm:h-10 object-contain shrink-0"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-semibold text-sm sm:text-base truncate">
                Admin Panel
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 -mt-0.5">
                Daftar Lomba Kadu
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link to={ROUTES.HOME} className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">
                Lihat Publik
              </Button>
            </Link>
            <Link to={ROUTES.ADMIN_DASHBOARD}>
              <Button
                variant="ghost"
                size="sm"
                icon={<LayoutDashboard className="h-4 w-4" />}
                className="hidden sm:inline-flex"
              >
                Dashboard
              </Button>
            </Link>
            {admin ? (
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                <Settings className="h-3.5 w-3.5" />
                {admin.username}
              </div>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="h-4 w-4" />}
              aria-label="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <Outlet />
      </main>

      <footer className="py-3 text-center text-xs text-slate-400">
        <p>Daftar Lomba Kadu · Admin Panel · {new Date().getFullYear()}</p>
      </footer>

      <ToastContainer />
      <GlobalConfirmDialog />
    </div>
  );
}
