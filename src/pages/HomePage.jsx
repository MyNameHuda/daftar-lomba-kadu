import { ContestNameForm } from "@/components/contest/ContestNameForm";
import { PageHeader } from "@/components/layout/PageHeader";
import logoIpeka from "@/assets/logo.png";

export default function HomePage() {
  return (
    <div>
      {/* Hero logo */}
      <div className="flex flex-col items-center text-center mb-6 md:mb-8 animate-fadeIn">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-lg ring-1 ring-slate-200/70 p-3 flex items-center justify-center mb-3">
          <img
            src={logoIpeka}
            alt="Logo IPEKA - Ikatan Pemuda Kadu Jaya"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-700 uppercase">
          Ikatan Pemuda Kadu Jaya
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
          Panitia Lomba · Aplikasi Pendataan Peserta
        </p>
      </div>

      <PageHeader
        title="Selamat Datang"
        subtitle="Buat daftar peserta lomba dalam hitungan menit"
        backTo={null}
      />
      <ContestNameForm />

      <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
        <p>Data tersimpan otomatis di perangkat ini</p>
        <p>Export hasil ke PNG atau XLSX siap cetak</p>
      </div>
    </div>
  );
}
