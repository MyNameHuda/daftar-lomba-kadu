import { ContestNameForm } from "@/components/contest/ContestNameForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Selamat Datang"
        subtitle="Buat daftar peserta lomba dalam hitungan menit"
        backTo={null}
      />
      <ContestNameForm />

      <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
        <p>Data tersimpan otomatis di perangkat ini</p>
        <p>Export hasil ke PNG siap cetak</p>
      </div>
    </div>
  );
}
