# Daftar Lomba Kadu

Aplikasi web untuk panitia lomba **IPEKA - Ikatan Pemuda Kadu Jaya** untuk mendata peserta lomba berdasarkan kategori usia. Versi 2.0 menggunakan **Postgres (Neon)** sebagai database dan panel admin untuk mengelola lomba serta peserta.

> **v2.0.0** — Multi-lomba, admin login, server-side storage.

## ✨ Fitur

### Publik (tanpa login)
- ✅ Lihat daftar lomba yang sudah didaftarkan panitia
- ✅ Lihat detail lomba (nama, kategori, umur, peserta)
- ✅ Auto-sort peserta: umur ASC, lalu nama A–Z
- ✅ Export hasil ke **PNG** (siap share ke grup WhatsApp)
- ✅ Export hasil ke **XLSX** (siap cetak / rekap)

### Admin (perlu login)
- ✅ Login dengan username & password (JWT, 7 hari)
- ✅ Dashboard: daftar semua lomba + jumlah peserta
- ✅ Buat lomba baru (nama, kategori, sub-kategori, rentang umur)
- ✅ Edit lomba yang sudah ada
- ✅ Hapus lomba (otomatis hapus semua peserta di dalamnya)
- ✅ Kelola peserta per lomba: tambah, edit, hapus
- ✅ Validasi realtime (client + server)
- ✅ Peserta duplikat terdeteksi otomatis

## 🛠️ Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS v4, React Router v7, React Hook Form |
| Backend | Node.js (ESM), Vercel Serverless Functions |
| Database | PostgreSQL via Neon (serverless driver) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Export | html-to-image + xlsx |

## 🚀 Cara Pakai (Development)

### 1. Setup environment
```bash
# Copy .env.example → .env, lalu isi DATABASE_URL dari Neon console
cp .env.example .env
```

### 2. Setup database
```bash
npm run db:migrate   # bikin tabel admins, contests, participants
npm run db:seed      # bikin akun admin default (admin / admin123)
```

### 3. Jalankan dua server (butuh 2 terminal)
```bash
# Terminal 1: API server (port 3001)
npm run dev:api

# Terminal 2: Vite dev server (port 5173, proxy /api → 3001)
npm run dev
```

Buka `http://localhost:5173`. Login admin di `/admin/login` dengan credential `admin / admin123`.

### Reset database (DEV ONLY)
```bash
npm run db:reset     # drop semua + migrate ulang + seed admin
```

## 📁 Struktur Project

```
daftar-lomba-kadu/
├── api/                          # Backend (Vercel serverless + local dev)
│   ├── _lib/                     # Shared helpers (db, auth, response, validation)
│   │   ├── auth.js               # JWT + bcrypt
│   │   ├── db.js                 # Neon connection
│   │   ├── middleware.js         # requireAdmin()
│   │   ├── response.js           # JSON / CORS helpers
│   │   ├── validation.js         # Server-side input validation
│   │   └── sql/schema.sql        # DDL untuk migrate
│   ├── auth/                     # /api/auth/login, /api/auth/me
│   ├── contests/                 # /api/contests, /api/contests/:id
│   │   └── [id]/participants.js  # /api/contests/:id/participants
│   ├── participants/[id].js      # /api/participants/:id
│   ├── scripts/                  # migrate, seed, reset, debug
│   └── dev-server.mjs            # Local router (Vite proxies /api/* ke sini)
├── src/                          # Frontend (React SPA)
│   ├── components/
│   │   ├── ui/                   # Button, Input, Card, Modal, Toast, dll
│   │   ├── layout/               # AppLayout, AdminLayout, Header, Footer
│   │   ├── contest/              # ParticipantForm/Row/Table, ResultCard, AgePicker
│   │   └── common/               # RequireAuth, GlobalConfirmDialog
│   ├── pages/                    # HomePage, ContestDetailPage, LoginPage, AdminDashboardPage, dll
│   ├── hooks/                    # useToast, useConfirm, useExportPNG, useExportXLSX
│   ├── context/                  # AuthContext, ToastContext, ConfirmContext
│   ├── lib/api.js                # API client (fetch wrapper + auth header)
│   ├── constants/                # routes, categories, subCategories, storageKeys
│   ├── utils/                    # validation, sortParticipants, slugify, dll
│   └── styles/index.css          # Tailwind v4 + design tokens
├── vercel.json                   # Rewrites (SPA) + cache headers
└── vite.config.js                # Vite + proxy /api → localhost:3001
```

Lihat [`BLUEPRINT.md`](./BLUEPRINT.md) untuk dokumentasi teknis lengkap (v1 + v2 changelog).

## 🌐 Deploy ke Vercel

1. Push project ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → pilih repo
3. Set environment variables di Vercel project settings:
   - `DATABASE_URL` — connection string Neon
   - `JWT_SECRET` — random string ≥32 char (pake `openssl rand -hex 32`)
   - `ADMIN_USERNAME` — default admin (optional, default: `admin`)
   - `ADMIN_PASSWORD` — default admin password (optional, default: `admin123`)
   - `FRONTEND_ORIGIN` — URL production lo (untuk CORS)
4. Klik **Deploy**

Vercel otomatis:
- Detect `api/*.js` → serverless functions
- Build frontend (Vite)
- Apply `vercel.json` rewrites & headers

### One-time: setup database production
Setelah deploy, jalankan di local (dengan `.env` pointing ke production DB):
```bash
npm run db:migrate
npm run db:seed
```

Atau pakai Neon SQL Editor untuk paste `api/_lib/sql/schema.sql` + `INSERT INTO admins`.

## 🔌 API Reference

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Login admin, return JWT |
| `GET` | `/api/auth/me` | admin | Validasi token + return admin info |
| `GET` | `/api/contests` | — | List semua lomba + jumlah peserta |
| `POST` | `/api/contests` | admin | Buat lomba baru |
| `GET` | `/api/contests/:id` | — | Detail lomba + peserta (sorted) |
| `PUT` | `/api/contests/:id` | admin | Update lomba |
| `DELETE` | `/api/contests/:id` | admin | Hapus lomba (+ semua peserta) |
| `GET` | `/api/contests/:id/participants` | — | List peserta lomba (sorted) |
| `POST` | `/api/contests/:id/participants` | admin | Tambah peserta |
| `PUT` | `/api/participants/:id` | admin | Update peserta |
| `DELETE` | `/api/participants/:id` | admin | Hapus peserta |

Semua response JSON. Error: `{ "error": "pesan" }` dengan HTTP status yang sesuai.

## 📦 Bundle Size (v2)

| Chunk | Size (gzip) |
|---|---|
| vendor (React + Router) | 17.8 kB |
| forms (React Hook Form) | 10.1 kB |
| export (html-to-image + xlsx) | 100.1 kB |
| app (semua kode) | 65.0 kB |
| CSS | 8.1 kB |
| **Total** | **~201 kB gzipped** |

PNG export + XLSX adalah chunk terbesar; di-split terpisah biar gak ke-load di halaman yang gak butuh.

## 🔒 Keamanan

- **Password**: di-hash pakai `bcrypt` (10 rounds), gak pernah disimpan plain-text
- **JWT**: expire 7 hari, secret di env var, payload include `role: "admin"`
- **CORS**: origin dibatasi via `FRONTEND_ORIGIN` (default `*` di dev)
- **SQL injection**: semua query pakai parameterized queries via `@neondatabase/serverless`
- **Validasi ganda**: client + server (sama rules di `src/utils/validation.js` & `api/_lib/validation.js`)
- **Auth middleware**: pakai `requireAdmin()` helper, route admin dilindungi

## ⚠️ Catatan v1 → v2

v2 adalah **rewrite besar**:
- v1: pure frontend, LocalStorage, single-session, no login
- v2: full-stack, Postgres, multi-lomba, admin panel dengan auth

v1 tidak bisa migrasi langsung ke v2 — data di LocalStorage harus di-input ulang via admin panel.

## 📄 Lisensi

Free to use. Buat panitia lomba di mana saja. 🇮🇩

---

Dibuat dengan ❤️ untuk HUT RI ke-80 (atau lomba apa pun).
