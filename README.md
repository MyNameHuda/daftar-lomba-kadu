# Daftar Lomba Kadu

Aplikasi web sederhana untuk panitia lomba dalam mendata peserta berdasarkan kategori usia. Data tersimpan di LocalStorage (aman saat refresh), dan hasil bisa di-export ke PNG siap cetak.

> **Tanpa backend, tanpa login, tanpa database.** 100% frontend.

## ✨ Fitur

- ✅ Input nama lomba
- ✅ Pilih kategori (Balita / Anak / Remaja / Ibu-Ibu)
- ✅ Input peserta dengan validasi realtime
- ✅ Auto-sort: umur ASC, lalu nama A–Z
- ✅ Edit & hapus peserta (dengan konfirmasi)
- ✅ Export hasil ke PNG (filename otomatis: `nama-lomba-kategori.png`)
- ✅ Data persist di LocalStorage (anti hilang saat refresh)
- ✅ Notifikasi toast untuk setiap aksi
- ✅ Konfirmasi sebelum hapus/reset
- ✅ Route guard (anti nyasar ke halaman yang belum siap)
- ✅ Mobile-first responsive design
- ✅ Aksesibilitas (keyboard nav, ARIA, focus management)
- ✅ Reduced motion support

## 🛠️ Tech Stack

- **React 19** + **Vite 6**
- **Tailwind CSS v4** (CSS-first config)
- **React Router v7** dengan lazy loading
- **React Hook Form** untuk form
- **html2canvas** untuk export PNG
- **Lucide React** untuk icon

## 🚀 Cara Pakai (Development)

```bash
npm install      # install dependencies
npm run dev      # jalanin dev server (default: http://localhost:5173)
npm run build    # build production
npm run preview  # preview hasil build
npm run lint     # cek code quality
```

## 📁 Struktur Project

```
src/
├── components/        # reusable components
│   ├── ui/            # primitive (Button, Input, Card, Modal, dll)
│   ├── layout/        # layout components (Header, Footer, AppLayout)
│   ├── contest/       # fitur-specific (ParticipantForm, dll)
│   └── common/        # shared (RouteGuard, GlobalConfirmDialog)
├── pages/             # page components (lazy-loaded)
├── hooks/             # custom hooks
├── context/           # React Context + Provider
├── utils/             # pure functions
├── constants/         # data statis
└── styles/            # global CSS
```

Lihat [`BLUEPRINT.md`](./BLUEPRINT.md) untuk dokumentasi teknis lengkap.

## 🌐 Deploy ke Vercel

### Cara 1: Via Dashboard (Paling Gampang)

1. Push project ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → login pakai akun GitHub
3. Klik **"Add New Project"**
4. Pilih repo `daftar-lomba-kadu`
5. Vercel akan auto-detect Vite, klik **Deploy**
6. Selesai! URL production langsung jadi

### Cara 2: Via CLI

```bash
npm i -g vercel
vercel              # untuk preview deploy
vercel --prod       # untuk production deploy
```

### Konfigurasi

File `vercel.json` sudah disiapkan dengan:
- **rewrites** → semua route resolve ke `index.html` (untuk SPA routing)
- **headers** → cache 1 tahun untuk asset `/assets/*`

Tidak perlu set environment variable apapun (pure frontend).

## 📦 Bundle Size

| Chunk | Size (gzip) |
|---|---|
| index.html | 0.41 kB |
| CSS | 7.21 kB |
| vendor (React + Router) | 17.40 kB |
| forms (React Hook Form) | 10.08 kB |
| export (html2canvas) | 48.04 kB |
| app (semua kode) | 64.40 kB |
| **Total** | **~148 kB gzipped** |

Target < 300KB gzipped → ✅ tercapai.

## 🎨 Design System

Warna brand: **Indigo** (ceria & profesional). Setiap kategori punya warna aksen:
- 🩷 **Balita** — rose
- 🟠 **Anak** — amber
- 🔵 **Remaja** — sky
- 🟢 **Ibu-Ibu** — emerald

## ♿ Aksesibilitas

- Tab navigation lengkap
- Focus management (kembali ke trigger setelah modal close)
- ARIA labels untuk icon-only button
- `aria-live` untuk toast notifications
- `prefers-reduced-motion` support
- Color contrast AA compliant

## 📄 Lisensi

Free to use. Buat panitia lomba di mana saja. 🇮🇩

---

Dibuat dengan ❤️ untuk HUT RI ke-80 (atau lomba apa pun).
