import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Lock, User, LogIn, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import logoIpeka from "@/assets/logo.png";

export default function LoginPage() {
  const { login, isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.ADMIN_DASHBOARD;

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: { username: "", password: "" } });

  // If already authed, redirect immediately
  if (isAuthed) {
    navigate(from, { replace: true });
    return null;
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg(null);
    const result = await login(data.username.trim(), data.password);
    setSubmitting(false);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="h-20 w-20 rounded-full bg-white shadow-lg ring-1 ring-slate-200/70 p-2.5 flex items-center justify-center mb-3">
            <img
              src={logoIpeka}
              alt="Logo IPEKA"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-[11px] font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" />
            Admin Panel
          </div>
        </div>

        <Card padding="lg">
          <h1 className="text-lg font-semibold text-slate-900 text-center">
            Masuk Admin
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1 mb-5">
            Login untuk mengelola lomba dan peserta
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              placeholder="admin"
              required
              autoFocus
              autoComplete="username"
              icon={<User className="h-4 w-4" />}
              error={errors.username?.message}
              {...register("username", {
                required: "Username wajib diisi",
                minLength: { value: 2, message: "Minimal 2 karakter" },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password", {
                required: "Password wajib diisi",
                minLength: { value: 4, message: "Minimal 4 karakter" },
              })}
            />

            {errorMsg ? (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
              icon={<LogIn className="h-4 w-4" />}
            >
              {submitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </Card>

        <div className="mt-4 text-center text-xs text-slate-400">
          <Link
            to={ROUTES.HOME}
            className="hover:text-slate-600 underline-offset-2 hover:underline"
          >
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LoginPageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}
