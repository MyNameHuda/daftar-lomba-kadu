import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export default function NotFoundPage() {
  return (
    <Card padding="lg" className="text-center">
      <div className="inline-flex h-14 w-14 rounded-2xl bg-amber-50 text-amber-500 items-center justify-center mb-3">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-1">Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-slate-500 mb-5">
        Halaman yang kamu cari tidak ada.
      </p>
      <Link to={ROUTES.HOME}>
        <Button fullWidth icon={<Home className="h-4 w-4" />}>
          Kembali ke Beranda
        </Button>
      </Link>
    </Card>
  );
}
