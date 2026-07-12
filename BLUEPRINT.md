# 🏗️ BLUEPRINT TEKNIS — DAFTAR LOMBA KADU

> **Versi:** 1.0
> **Tanggal:** 13 Juli 2026
> **Tipe Dokumen:** Technical Design Document (TDD)
> **Tujuan:** Acuan tunggal untuk implementasi, review, dan pengembangan lanjutan.

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Tech Stack & Rationale](#2-tech-stack--rationale)
3. [Struktur Folder](#3-struktur-folder)
4. [Data Model & Type System](#4-data-model--type-system)
5. [State Management Architecture](#5-state-management-architecture)
6. [Routing Plan](#6-routing-plan)
7. [Component Specification](#7-component-specification)
8. [Business Logic Layer](#8-business-logic-layer)
9. [LocalStorage Persistence Strategy](#9-localstorage-persistence-strategy)
10. [Export PNG Strategy](#10-export-png-strategy)
11. [Design System](#11-design-system)
12. [ESLint & Code Quality Rules](#12-eslint--code-quality-rules)
13. [Error Handling](#13-error-handling)
14. [Performance Optimization](#14-performance-optimization)
15. [Accessibility (a11y)](#15-accessibility-a11y)
16. [Vercel Deployment Plan](#16-vercel-deployment-plan)
17. [Implementation Order](#17-implementation-order)
18. [Testing Strategy](#18-testing-strategy)
19. [Future Roadmap](#19-future-roadmap)
20. [Acceptance Criteria](#20-acceptance-criteria)

---

## 1. Gambaran Umum

### 1.1 Deskripsi Produk

**Daftar Lomba Kadu** adalah aplikasi web *single-page* (SPA) yang membantu panitia lomba 17 Agustus (atau lomba apa pun) untuk:

1. **Mendata peserta** berdasarkan nama lomba dan kategori usia.
2. **Mengurutkan otomatis** peserta berdasarkan umur (ascending) lalu nama (A-Z).
3. **Mengekspor hasil** ke gambar PNG siap cetak / share ke grup WhatsApp.

### 1.2 Karakteristik Teknis

| Aspek | Keputusan |
|---|---|
| Arsitektur | Pure frontend SPA |
| Backend | ❌ Tidak ada |
| Database | ❌ Tidak ada |
| Auth | ❌ Tidak ada |
| State persistence | LocalStorage (versioned) |
| Build tool | Vite 5+ |
| Framework | React 19 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Form | React Hook Form |
| Icons | Lucide React |
| Export | html2canvas |
| Deploy | Vercel |

### 1.3 Non-Goals (Sengaja Tidak Dibuat)

- Login / multi-user
- Sync antar device (perangkat)
- Multi-lomba dalam satu sesi
- Cetak langsung ke printer (cukup export PNG)
- Edit lomba setelah finalisasi
- Riwayat / audit log

---

## 2. Tech Stack & Rationale

### 2.1 Dependency Utama

| Package | Versi | Fungsi | Alasan Pilihan |
|---|---|---|---|
| `react` | ^19.0.0 | UI library | Standar industri, ekosistem besar |
| `react-dom` | ^19.0.0 | Renderer ke DOM | Pasangan React |
| `vite` | ^5.4.0 | Build tool | Cepat, HMR instan, default modern |
| `@vitejs/plugin-react` | ^4.3.0 | Plugin React untuk Vite | Wajib untuk JSX/TSX |
| `tailwindcss` | ^4.0.0 | Utility CSS | Cepat, konsisten, mobile-first |
| `@tailwindcss/vite` | ^4.0.0 | Plugin Vite untuk Tailwind v4 | Cara baru integrasi Tailwind v4 |
| `react-router-dom` | ^7.0.0 | Routing | Standar routing di React |
| `react-hook-form` | ^7.53.0 | Form state | Performant, minim re-render |
| `html2canvas` | ^1.4.1 | DOM → canvas | Untuk export PNG |
| `lucide-react` | ^0.460.0 | Icon set | Tree-shakable, modern, lengkap |

### 2.2 Dependency Dev

| Package | Versi | Fungsi |
|---|---|---|
| `eslint` | ^9.0.0 | Linter |
| `eslint-plugin-react` | ^7.35.0 | Aturan spesifik React |
| `eslint-plugin-react-hooks` | ^5.0.0 | Aturan hooks |
| `eslint-plugin-react-refresh` | ^0.4.0 | HMR safety |
| `globals` | ^15.0.0 | Definisi variabel global untuk ESLint |

### 2.3 Browser Support

- Chrome / Edge 100+
- Firefox 100+
- Safari 16+
- Mobile Safari (iOS 16+)
- Chrome Android 100+

Tidak ada polyfill karena target browser modern.

---

## 3. Struktur Folder

```
daftar-lomba-kadu/
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Spinner.jsx
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx
│   │   │   └── PageHeader.jsx
│   │   ├── contest/
│   │   │   ├── ContestNameForm.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── CategorySelector.jsx
│   │   │   ├── ParticipantForm.jsx
│   │   │   ├── ParticipantRow.jsx
│   │   │   ├── ParticipantTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ResultCard.jsx
│   │   └── common/
│   │       ├── ConfirmDialog.jsx
│   │       ├── RouteGuard.jsx
│   │       └── ToastContainer.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── ParticipantsPage.jsx
│   │   └── ResultPage.jsx
│   ├── hooks/
│   │   ├── useContest.js
│   │   ├── useToast.js
│   │   ├── useConfirm.js
│   │   ├── useExportPNG.js
│   │   ├── useLocalStorage.js
│   │   └── usePersistentReducer.js
│   ├── context/
│   │   ├── ContestContext.jsx
│   │   └── ToastContext.jsx
│   ├── utils/
│   │   ├── slugify.js
│   │   ├── validation.js
│   │   ├── sortParticipants.js
│   │   ├── dateFormat.js
│   │   ├── filename.js
│   │   ├── id.js
│   │   └── storage.js
│   ├── constants/
│   │   ├── categories.js
│   │   ├── routes.js
│   │   └── storageKeys.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js (jika pakai v3) — di v4 tidak perlu
├── README.md
├── tailwind.config.js (jika pakai v3) — di v4 pakai CSS config
├── vercel.json
└── vite.config.js
```

### 3.1 Konvensi Penamaan File

| Tipe | Konvensi | Contoh |
|---|---|---|
| Komponen | PascalCase + `.jsx` | `ParticipantForm.jsx` |
| Hook | camelCase + `use` prefix + `.js` | `useExportPNG.js` |
| Util | camelCase + `.js` | `slugify.js` |
| Konstanta | camelCase + `.js` (export const) | `categories.js` |
| Style | `kebab-case.css` atau `index.css` | `index.css` |

### 3.2 Aturan Import

- Absolute import via `@/` alias yang didefinisikan di `vite.config.js`
- Urutan: external → internal absolute → relative
- Alphabetical dalam grup

```js
// External
import { useState } from "react";
import { User } from "lucide-react";

// Internal absolute
import { Button } from "@/components/ui/Button";
import { useContest } from "@/hooks/useContest";

// Relative (jarang, hanya untuk sibling component)
import { ChildComponent } from "./ChildComponent";
```

---

## 4. Data Model & Type System

### 4.1 Types (JSDoc, tanpa TypeScript untuk simplicity)

```js
/**
 * @typedef {'balita' | 'anak' | 'remaja' | 'ibu-ibu'} ContestCategory
 */

/**
 * @typedef {Object} CategoryMeta
 * @property {ContestCategory} id
 * @property {string} label         - Label tampil
 * @property {string} description   - Deskripsi singkat
 * @property {number} ageMin        - Umur minimum (inklusif)
 * @property {number} [ageMax]      - Umur maksimum (inklusif, undefined = tak terhingga)
 * @property {string} iconName      - Nama icon Lucide
 * @property {string} gradient      - Tailwind gradient class
 * @property {string} accent        - Tailwind color class untuk aksen
 */

/**
 * @typedef {Object} Participant
 * @property {string} id            - UUID v4
 * @property {string} name          - Nama peserta (trim, non-empty)
 * @property {number} age           - Umur (integer, 0-120)
 */

/**
 * @typedef {Object} ContestState
 * @property {string | null} contestName
 * @property {ContestCategory | null} category
 * @property {Participant[]} participants
 */

/**
 * @typedef {Object} Toast
 * @property {string} id
 * @property {'success' | 'error' | 'info' | 'warning'} type
 * @property {string} message
 */

/**
 * @typedef {Object} ConfirmState
 * @property {boolean} isOpen
 * @property {string} title
 * @property {string} message
 * @property {string} confirmText
 * @property {string} cancelText
 * @property {'primary' | 'danger'} variant
 * @property {() => void} onConfirm
 */
```

### 4.2 Invariants (Aturan yang Tidak Boleh Dilanggar)

1. `contestName` selalu `string` non-empty atau `null`. Tidak boleh whitespace.
2. `category` harus salah satu dari `ContestCategory` atau `null`.
3. `participants` selalu array (boleh kosong).
4. Setiap `Participant.id` unik dalam array.
5. Setiap `Participant.age` adalah integer 0–120.
6. Setiap `Participant.name` minimal 2 karakter setelah trim.
7. Array `participants` SELALU terurut: `age ASC`, lalu `name ASC` (case-insensitive).

Reducer harus **menjamin invariant 7** setiap kali ada mutasi.

---

## 5. State Management Architecture

### 5.1 Mengapa Context + useReducer, Bukan Zustand/Redux?

| Aspek | Context + useReducer | Zustand | Redux Toolkit |
|---|---|---|---|
| Bundle size | 0 KB (built-in) | ~1 KB | ~10 KB |
| Boilerplate | Sedang | Rendah | Tinggi |
| DevTools | Tidak | Ya | Ya |
| Learning curve | Mudah | Mudah | Tinggi |
| Untuk app ini | ✅ Cocok | Overkill | Overkill |

### 5.2 Dua Context Terpisah

**`ContestContext`** — data lomba, jarang berubah:

```jsx
<ContestProvider>
  {/* children */}
</ContestProvider>
```

API:
```js
const {
  state,           // ContestState
  dispatch,        // Dispatch
  // helper actions
  setContestName,  // (name: string) => void
  setCategory,     // (category: ContestCategory) => void
  addParticipant,  // (data: { name, age }) => void
  editParticipant, // (id: string, data: { name, age }) => void
  deleteParticipant, // (id: string) => void
  resetAll,        // () => void
  // computed
  categoryMeta,    // CategoryMeta | null
  ageRange,        // { min, max? } | null
  totalParticipants, // number
} = useContest();
```

**`ToastContext`** — notifikasi, sering berubah:

```jsx
<ToastProvider>
  {/* children */}
</ToastProvider>
```

API:
```js
const { toasts, showToast, dismissToast } = useToast();
// atau shorthand:
const toast = useToast();
toast.success("Peserta ditambahkan");
toast.error("Umur tidak valid");
toast.info("Data tersimpan");
toast.warning("Perhatian!");
```

### 5.3 Actions (Contest Reducer)

| Action Type | Payload | Efek |
|---|---|---|
| `HYDRATE` | `ContestState` | Set state dari LocalStorage saat mount |
| `SET_CONTEST_NAME` | `string` | Set nama, reset participants (opsional) |
| `SET_CATEGORY` | `ContestCategory` | Set kategori |
| `ADD_PARTICIPANT` | `{ name, age }` | Generate id, sort ulang |
| `EDIT_PARTICIPANT` | `{ id, name, age }` | Update by id, sort ulang |
| `DELETE_PARTICIPANT` | `string` (id) | Remove by id, re-number |
| `RESET` | — | Kembalikan ke initial state |
| `CLEAR_PARTICIPANTS` | — | Reset participants saja, contest & category tetap |

### 5.4 Reducer Implementation Skeleton

```js
function contestReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.payload };

    case "SET_CONTEST_NAME":
      return { ...state, contestName: action.payload };

    case "SET_CATEGORY":
      return { ...state, category: action.payload };

    case "ADD_PARTICIPANT": {
      const newParticipant = {
        id: generateId(),
        name: action.payload.name.trim(),
        age: action.payload.age,
      };
      return {
        ...state,
        participants: sortParticipants([
          ...state.participants,
          newParticipant,
        ]),
      };
    }

    case "EDIT_PARTICIPANT": {
      const updated = state.participants.map((p) =>
        p.id === action.payload.id
          ? { ...p, name: action.payload.name.trim(), age: action.payload.age }
          : p
      );
      return { ...state, participants: sortParticipants(updated) };
    }

    case "DELETE_PARTICIPANT":
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
      };

    case "RESET":
      return INITIAL_STATE;

    case "CLEAR_PARTICIPANTS":
      return { ...state, participants: [] };

    default:
      return state;
  }
}
```

### 5.5 INITIAL_STATE

```js
const INITIAL_STATE = {
  contestName: null,
  category: null,
  participants: [],
};
```

---

## 6. Routing Plan

### 6.1 Route Table

| Path | Component | Guard | Title |
|---|---|---|---|
| `/` | `HomePage` | None | "Mulai Lomba" |
| `/kategori` | `CategoryPage` | `contestName` required | "Pilih Kategori" |
| `/peserta` | `ParticipantsPage` | `contestName` + `category` required | "Input Peserta" |
| `/hasil` | `ResultPage` | `contestName` + `category` required | "Hasil" |
| `*` | `NotFoundPage` | None | "404" |

### 6.2 RouteGuard Component

```jsx
<RouteGuard
  require={["contestName", "category"]}
  redirectTo="/"
>
  <ParticipantsPage />
</RouteGuard>
```

Logic: cek `useContest()`, kalau ada requirement yang null → `<Navigate to={redirectTo} replace />`.

### 6.3 BrowserRouter Setup

```jsx
// main.jsx
import { BrowserRouter } from "react-router-dom";

<BrowserRouter>
  <ToastProvider>
    <ContestProvider>
      <App />
    </ContestProvider>
  </ToastProvider>
</BrowserRouter>
```

---

## 7. Component Specification

### 7.1 UI Primitives

#### `<Button />`

```jsx
<Button
  variant="primary" | "secondary" | "danger" | "ghost"  // default: "primary"
  size="sm" | "md" | "lg"                                // default: "md"
  fullWidth={false}                                       // default: false
  loading={false}                                         // default: false
  disabled={false}
  icon={<Plus />}                                         // optional, kiri text
  iconRight={<ArrowRight />}                              // optional, kanan text
  type="button" | "submit" | "reset"                      // default: "button"
  onClick={() => {}}
>
  Tambah Peserta
</Button>
```

Styling: gradient untuk primary (sesuai tema), border + bg untuk secondary, red untuk danger, transparent untuk ghost.

Loading state: spinner menggantikan icon, text tetap visible dengan opacity 0.7, button disabled.

#### `<Input />`

```jsx
<Input
  label="Nama Peserta"
  name="name"
  type="text" | "number" | "email"   // default: "text"
  placeholder="..."
  value={value}
  onChange={onChange}
  onBlur={onBlur}
  error="Nama wajib diisi"           // string | null
  hint="Minimal 2 karakter"          // string | null
  icon={<User />}                    // optional, di kiri input
  disabled={false}
  required={false}
  autoComplete="off"
  maxLength={50}
/>
```

Real-time error: error muncul di bawah input, border merah. Hint: text slate-400.

#### `<Card />`

```jsx
<Card
  variant="default" | "elevated"     // default: "default"
  padding="sm" | "md" | "lg"         // default: "md"
  hoverable={false}                  // default: false
  onClick={() => {}}
  className=""
>
  {children}
</Card>
```

#### `<Modal />`

```jsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Konfirmasi"
  size="sm" | "md" | "lg"            // default: "md"
  closeOnOverlayClick={true}         // default: true
  closeOnEsc={true}                  // default: true
>
  {children}
</Modal>
```

A11y: `role="dialog"`, `aria-modal="true"`, focus trap, restore focus on close.

#### `<ConfirmDialog />`

Wrap Modal dengan title + body + 2 button (cancel & confirm). Variant `danger` bikin tombol confirm merah.

```jsx
const confirm = useConfirm();

confirm({
  title: "Hapus Peserta?",
  message: `Yakin ingin menghapus "${name}"?`,
  confirmText: "Hapus",
  variant: "danger",
  onConfirm: () => deleteParticipant(id),
});
```

#### `<Toast />` & `<ToastContainer />`

Posisi: top-right (mobile: top-center). Auto-dismiss 3 detik. Stacking max 5.

### 7.2 Layout

#### `<AppLayout />`

```jsx
<AppLayout>
  {/* page content */}
</AppLayout>
```

- Header: logo + judul kecil + tombol reset (icon only)
- Main: max-w-3xl mx-auto px-4 py-6
- Footer: copyright kecil
- Background: gradient halus dari slate-50 ke sky-50

#### `<PageHeader />`

```jsx
<PageHeader
  title="Pilih Kategori"
  subtitle="Pilih kategori peserta lomba"
  backTo="/"                           // optional
  actions={[{ label: "Reset", onClick: ... }]} // optional
/>
```

### 7.3 Contest-Specific

#### `<ContestNameForm />`

- Input nama lomba dengan icon `<Trophy />`
- Validasi: minimal 3 karakter
- Submit → `setContestName` → navigate ke `/kategori`

#### `<CategoryCard />`

```jsx
<CategoryCard
  category={categoryMeta}
  selected={true}
  onClick={() => {}}
/>
```

- Icon besar (sesuai kategori)
- Label + deskripsi
- Range umur
- Checkmark saat selected
- Hover effect (scale + shadow)

#### `<CategorySelector />`

- Grid 2x2 (mobile) / 4 kolom (desktop)
- Render 4 `<CategoryCard />` dari `CATEGORIES` constant

#### `<ParticipantForm />`

- 2 field inline: nama + umur
- Validasi realtime via React Hook Form
- Show hint range umur sesuai kategori aktif
- Button "Tambah Peserta" disabled kalau invalid
- Submit → `addParticipant` → reset form → toast success

#### `<ParticipantTable />`

- Table responsive: di mobile jadi stacked card
- Header: No | Nama | Umur | Aksi
- Body: render `<ParticipantRow />` per peserta
- Jika kosong: `<EmptyState />`

#### `<ParticipantRow />`

- Inline edit mode (toggle) vs display mode
- Action: Edit (toggle), Hapus (dengan ConfirmDialog)
- Tampil dalam 2 mode:
  - Display: text + 2 icon button
  - Edit: 2 input + 2 button (simpan/batal)

#### `<ResultCard />`

- Komponen yang di-render untuk dilihat user DAN di-screenshot html2canvas
- Background putih bersih
- Header: nama lomba, kategori, tanggal
- Body: tabel peserta
- Footer: total peserta
- Print-style: padding lebar, font besar, tanpa animasi

#### `<EmptyState />`

```jsx
<EmptyState
  icon={<Users />}
  title="Belum ada peserta"
  description="Tambahkan peserta pertama Anda menggunakan form di atas"
/>
```

---

## 8. Business Logic Layer

### 8.1 Validation (`utils/validation.js`)

```js
/**
 * Validasi nama peserta
 * @param {string} name
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Nama wajib diisi" };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Nama minimal 2 karakter" };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: "Nama maksimal 50 karakter" };
  }
  if (!/^[a-zA-Z0-9\s\u00C0-\u017F\u2018-\u2019\u201C-\u201D\-'.]+$/.test(trimmed)) {
    return { valid: false, error: "Nama mengandung karakter tidak valid" };
  }
  return { valid: true, error: null };
}

/**
 * Validasi umur
 * @param {number|string} age
 * @returns {{ valid: boolean, error: string | null, value: number | null }}
 */
export function validateAge(age) {
  const num = Number(age);
  if (age === "" || age === null || age === undefined || Number.isNaN(num)) {
    return { valid: false, error: "Umur wajib diisi", value: null };
  }
  if (!Number.isInteger(num)) {
    return { valid: false, error: "Umur harus bilangan bulat", value: null };
  }
  if (num < 0 || num > 120) {
    return { valid: false, error: "Umur harus 0-120 tahun", value: null };
  }
  return { valid: true, error: null, value: num };
}

/**
 * Validasi umur terhadap kategori
 * @param {number} age
 * @param {ContestCategory} category
 * @param {CategoryMeta[]} categories
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateAgeByCategory(age, category, categories) {
  const meta = categories.find((c) => c.id === category);
  if (!meta) {
    return { valid: false, error: "Kategori tidak valid" };
  }

  if (age < meta.ageMin) {
    return {
      valid: false,
      error: `Kategori ${meta.label} minimal umur ${meta.ageMin} tahun`,
    };
  }

  if (meta.ageMax !== undefined && age > meta.ageMax) {
    return {
      valid: false,
      error: `Kategori ${meta.label} maksimal umur ${meta.ageMax} tahun`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Validasi nama lomba
 * @param {string} name
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateContestName(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Nama lomba wajib diisi" };
  }
  if (trimmed.length < 3) {
    return { valid: false, error: "Nama lomba minimal 3 karakter" };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Nama lomba maksimal 100 karakter" };
  }
  return { valid: true, error: null };
}

/**
 * Cek duplikat peserta (nama + umur sama)
 * @param {Participant[]} participants
 * @param {string} name
 * @param {number} age
 * @param {string} [excludeId] - id yang dikecualikan (untuk edit)
 * @returns {boolean}
 */
export function isDuplicate(participants, name, age, excludeId = null) {
  const normalized = name.trim().toLowerCase();
  return participants.some(
    (p) =>
      p.id !== excludeId &&
      p.name.toLowerCase() === normalized &&
      p.age === age
  );
}
```

### 8.2 Sorting (`utils/sortParticipants.js`)

```js
/**
 * Sort peserta: umur ASC, lalu nama ASC (case-insensitive, locale ID)
 * @param {Participant[]} participants
 * @returns {Participant[]}
 */
export function sortParticipants(participants) {
  return [...participants].sort((a, b) => {
    if (a.age !== b.age) {
      return a.age - b.age;
    }
    return a.name.localeCompare(b.name, "id", { sensitivity: "base" });
  });
}
```

`localeCompare(b, "id", { sensitivity: "base" })`:
- `"id"` → locale Indonesia (handle "ñ", "é", dll)
- `sensitivity: "base"` → case-insensitive ("andi" == "Andi")

### 8.3 Slugify (`utils/slugify.js`)

```js
/**
 * Convert string jadi slug untuk filename
 * "Lomba Makan Kerupuk" → "lomba-makan-kerupuk"
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFKD")                  // pisahkan aksen
    .replace(/[\u0300-\u036f]/g, "")   // hapus diakritik
    .replace(/[^a-z0-9\s-]/g, "")      // hapus karakter non-alfanumerik
    .replace(/\s+/g, "-")              // spasi → dash
    .replace(/-+/g, "-")               // gabung multiple dash
    .replace(/^-+|-+$/g, "");          // trim dash
}
```

### 8.4 Date Format (`utils/dateFormat.js`)

```js
const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Format tanggal ke bahasa Indonesia
 * 13 Juli 2026
 * @param {Date} [date]
 * @returns {string}
 */
export function formatDateID(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format tanggal + jam
 * 13 Juli 2026, 00:30 WIB
 * @param {Date} [date]
 * @returns {string}
 */
export function formatDateTimeID(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${formatDateID(d)}, ${hours}:${minutes} WIB`;
}
```

### 8.5 ID Generator (`utils/id.js`)

```js
/**
 * Generate unique ID
 * Prefer crypto.randomUUID() (modern), fallback ke Math.random
 * @returns {string}
 */
export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
```

### 8.6 Filename (`utils/filename.js`)

```js
import { slugify } from "./slugify";

/**
 * Generate filename untuk export
 * "Lomba Makan Kerupuk" + "anak" → "lomba-makan-kerupuk-anak.png"
 * @param {string} contestName
 * @param {string} category
 * @returns {string}
 */
export function generateExportFilename(contestName, category) {
  const contestSlug = slugify(contestName) || "lomba";
  const categorySlug = slugify(category);
  return `${contestSlug}-${categorySlug}.png`;
}
```

### 8.7 Categories Constant (`constants/categories.js`)

```js
import { Baby, Child, User, Users } from "lucide-react";

/** @type {CategoryMeta[]} */
export const CATEGORIES = [
  {
    id: "balita",
    label: "Balita",
    description: "Untuk usia di bawah 5 tahun",
    ageMin: 0,
    ageMax: 4,
    iconName: "Baby",
    gradient: "from-rose-400 to-pink-500",
    accent: "text-rose-600",
    bgAccent: "bg-rose-50",
    borderAccent: "border-rose-200",
  },
  {
    id: "anak",
    label: "Anak",
    description: "Untuk usia sekolah dasar",
    ageMin: 5,
    ageMax: 13,
    iconName: "Child",
    gradient: "from-amber-400 to-orange-500",
    accent: "text-amber-600",
    bgAccent: "bg-amber-50",
    borderAccent: "border-amber-200",
  },
  {
    id: "remaja",
    label: "Remaja",
    description: "Untuk usia sekolah menengah",
    ageMin: 13,
    ageMax: 18,
    iconName: "User",
    gradient: "from-sky-400 to-blue-500",
    accent: "text-sky-600",
    bgAccent: "bg-sky-50",
    borderAccent: "border-sky-200",
  },
  {
    id: "ibu-ibu",
    label: "Ibu-Ibu",
    description: "Untuk ibu-ibu (minimal 18 tahun)",
    ageMin: 18,
    ageMax: undefined,
    iconName: "Users",
    gradient: "from-emerald-400 to-teal-500",
    accent: "text-emerald-600",
    bgAccent: "bg-emerald-50",
    borderAccent: "border-emerald-200",
  },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export function getCategoryById(id) {
  return CATEGORY_MAP[id] || null;
}
```

---

## 9. LocalStorage Persistence Strategy

### 9.1 Storage Key

```
"daftar-lomba-kadu:state:v1"
```

Format: `<app-name>:<purpose>:<version>` — memudahkan debugging, migration, dan cleanup.

### 9.2 Storage Shape

```json
{
  "version": 1,
  "savedAt": "2026-07-13T00:30:50.000Z",
  "data": {
    "contestName": "Lomba Makan Kerupuk",
    "category": "anak",
    "participants": [
      { "id": "uuid-1", "name": "Andi", "age": 5 },
      { "id": "uuid-2", "name": "Budi", "age": 7 }
    ]
  }
}
```

### 9.3 Storage Utility (`utils/storage.js`)

```js
const STORAGE_KEY = "daftar-lomba-kadu:state:v1";
const CURRENT_VERSION = 1;

export const storage = {
  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);

      // Validasi minimal
      if (typeof parsed !== "object" || parsed === null) return null;
      if (typeof parsed.version !== "number") return null;
      if (parsed.version > CURRENT_VERSION) return null;
      if (typeof parsed.data !== "object" || parsed.data === null) return null;

      return parsed;
    } catch (err) {
      console.warn("Storage read failed:", err);
      return null;
    }
  },

  set(state) {
    try {
      const payload = {
        version: CURRENT_VERSION,
        savedAt: new Date().toISOString(),
        data: state,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.warn("Storage write failed:", err);
      return false;
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.warn("Storage clear failed:", err);
      return false;
    }
  },
};
```

### 9.4 `usePersistentReducer` Hook

```js
import { useEffect, useReducer } from "react";
import { storage } from "@/utils/storage";

/**
 * useReducer + auto sync ke LocalStorage
 * @param {Function} reducer
 * @param {Object} initialState
 * @param {Object} [options]
 * @param {boolean} [options.persist=true]
 * @returns {[Object, Function]}
 */
export function usePersistentReducer(reducer, initialState, options = {}) {
  const { persist = true } = options;

  // Lazy init: baca dari storage saat pertama kali render
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (!persist) return init;
    const stored = storage.get();
    return stored?.data ?? init;
  });

  // Auto-save saat state berubah
  useEffect(() => {
    if (!persist) return;
    storage.set(state);
  }, [state, persist]);

  return [state, dispatch];
}
```

### 9.5 `useLocalStorage` Hook (untuk kasus sederhana)

```js
import { useEffect, useState } from "react";
import { storage as namespaceStorage } from "./storage"; // opsional, atau langsung localStorage

/**
 * useState + sync ke LocalStorage (key manual)
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, Function]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("useLocalStorage write failed:", err);
    }
  }, [key, value]);

  return [value, setValue];
}
```

### 9.6 Reset Behavior

Saat user klik **"Reset"**:
1. Tampilkan `<ConfirmDialog />` dengan `variant: "danger"`
2. Kalau confirm → dispatch `RESET` + `storage.clear()`
3. Tampilkan toast info "Data telah direset"
4. Navigate ke `/`

### 9.7 SSR Safety

App ini SPA murni, tidak SSR, tapi defensive code tetap bagus (untuk testing di jsdom).

---

## 10. Export PNG Strategy

### 10.1 Approach

Gunakan `html2canvas` untuk capture DOM node sebagai canvas, lalu convert ke PNG dan trigger download.

### 10.2 `useExportPNG` Hook

```js
import { useState, useCallback } from "react";
import html2canvas from "html2canvas";

/**
 * Hook untuk export DOM node jadi PNG
 * @returns {{
 *   exportToPng: (element: HTMLElement, filename: string) => Promise<boolean>,
 *   isExporting: boolean,
 *   error: Error | null,
 * }}
 */
export function useExportPNG() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportToPng = useCallback(async (element, filename) => {
    if (!element) {
      setError(new Error("Element tidak ditemukan"));
      return false;
    }

    setIsExporting(true);
    setError(null);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,                    // HiDPI
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        // Optional: windowWidth/Height untuk konsistensi
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // Convert ke blob untuk handle file besar
      canvas.toBlob((blob) => {
        if (!blob) {
          setError(new Error("Gagal membuat blob"));
          setIsExporting(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
      }, "image/png");
      return true;
    } catch (err) {
      console.error("Export failed:", err);
      setError(err);
      setIsExporting(false);
      return false;
    }
  }, []);

  return { exportToPng, isExporting, error };
}
```

### 10.3 PNG Layout

`ResultCard` di-render dengan style **print-ready**:

```
┌────────────────────────────────────────────────┐
│  🏆 Lomba Makan Kerupuk                        │
│  Kategori: Anak • 5-13 tahun                   │
│  13 Juli 2026                                  │
├────────────────────────────────────────────────┤
│  No │ Nama Peserta      │ Umur                │
├─────┼───────────────────┼─────────────────────┤
│  1  │ Andi              │  5                  │
│  2  │ Caca              │  5                  │
│  3  │ Budi              │  8                  │
│  4  │ Deni              │ 10                  │
├────────────────────────────────────────────────┤
│  Total Peserta: 4                              │
└────────────────────────────────────────────────┘
```

CSS khusus (saat di dalam `.export-mode` class):
- `background: white`
- `box-shadow: none`
- `padding: 24px`
- `font-family: system-ui, sans-serif`
- `font-size: 14-16px`
- Border dan warna solid (no gradient untuk print)

### 10.4 Edge Cases

| Situasi | Handling |
|---|---|
| Image tidak muncul di PNG | Pastikan semua asset inline (tidak depend on external CDN) |
| Font tidak sesuai | Pakai system font saja di `ResultCard` |
| Element off-screen | Pakai `position: absolute` + `left: -9999px` saat capture, atau scroll into view dulu |
| html2canvas error | Catch + tampilkan toast error |
| User close tab saat exporting | AbortController (advanced, optional) |

---

## 11. Design System

### 11.1 Color Palette

```js
// constants/colors.js
export const COLORS = {
  // Brand
  primary: {
    50:  "#eef2ff",
    100: "#e0e7ff",
    500: "#6366f1",  // indigo-500
    600: "#4f46e5",  // indigo-600
    700: "#4338ca",  // indigo-700
  },

  // Semantic
  success: { 500: "#10b981", 600: "#059669" },   // emerald
  warning: { 500: "#f59e0b", 600: "#d97706" },   // amber
  error:   { 500: "#ef4444", 600: "#dc2626" },   // red
  info:    { 500: "#3b82f6", 600: "#2563eb" },   // blue

  // Neutral
  slate: { /* default Tailwind palette */ },
};
```

### 11.2 Spacing

Mengikuti Tailwind default scale. Prefer:
- Card padding: `p-4` (mobile) → `p-6` (desktop)
- Section gap: `space-y-6` atau `gap-6`
- Form gap: `space-y-4` atau `gap-4`

### 11.3 Typography

| Use | Class |
|---|---|
| H1 (page title) | `text-2xl md:text-3xl font-bold text-slate-900` |
| H2 (section) | `text-xl md:text-2xl font-semibold text-slate-800` |
| Body | `text-base text-slate-700` |
| Small | `text-sm text-slate-500` |
| Label | `text-sm font-medium text-slate-700` |

### 11.4 Shadow

| Use | Class |
|---|---|
| Card default | `shadow-sm` |
| Card hover | `shadow-md` |
| Modal | `shadow-2xl` |
| Button | `shadow-sm` |

### 11.5 Border Radius

| Use | Class |
|---|---|
| Button | `rounded-lg` |
| Card | `rounded-xl` |
| Input | `rounded-lg` |
| Modal | `rounded-2xl` |
| Badge/Chip | `rounded-full` |

### 11.6 Animation

```css
/* index.css */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(120%); }
  to   { transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.animate-fadeIn  { animation: fadeIn 0.3s ease-out; }
.animate-slideIn { animation: slideIn 0.3s ease-out; }
.animate-scaleIn { animation: scaleIn 0.2s ease-out; }
```

### 11.7 Responsive Breakpoint

Default Tailwind. Strategi:
- Base = mobile
- `sm:` = 640px+ (large phone)
- `md:` = 768px+ (tablet)
- `lg:` = 1024px+ (desktop)

Form: stack di mobile, inline di desktop.
Table: stack jadi card di mobile.
Modal: full-width di mobile, max-w-md di desktop.

---

## 12. ESLint & Code Quality Rules

### 12.1 `.eslintrc.cjs` (atau `eslint.config.js` untuk ESLint v9)

```js
// eslint.config.js (flat config untuk ESLint 9)
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "19.0" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      "react/jsx-no-target-blank": "warn",
      "react/prop-types": "off",  // kita pakai JSDoc, bukan propTypes
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
```

### 12.2 Aturan Tambahan (Code Review Checklist)

- [ ] Tidak ada duplikasi kode
- [ ] Komponen fokus, 1 tanggung jawab
- [ ] Props didokumentasikan via JSDoc
- [ ] Hooks ada di file `use*.js`/`.jsx`
- [ ] Bisnis logic di `utils/`, bukan di komponen
- [ ] Konstanta di `constants/`, bukan hard-coded
- [ ] Naming konsisten (camelCase untuk variabel/fungsi, PascalCase untuk komponen)
- [ ] Tidak ada magic number/string
- [ ] Komentar hanya untuk "kenapa", bukan "apa"

---

## 13. Error Handling

### 13.1 Validation Errors (Form)

- Real-time: tampil di bawah input (warna merah)
- Submit: tampilkan toast error + scroll ke field error

### 13.2 Business Logic Errors

- Sort: asumsi reducer benar, kalau ada bug → tampil toast error "Terjadi kesalahan"
- ID generation: fallback ke Math.random jika crypto.randomUUID tidak ada

### 13.3 Storage Errors

- Try-catch di setiap read/write
- Log warning, tidak throw ke user
- Kalau storage penuh → tampilkan toast "Penyimpanan penuh, silakan reset data"

### 13.4 Export Errors

- Catch html2canvas error
- Tampilkan toast error dengan pesan
- Button tetap bisa diklik untuk retry

### 13.5 Global Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

Wrap seluruh `<App />` dengan `ErrorBoundary`.

### 13.6 Network Errors

Tidak ada network call, jadi tidak applicable. Tapi defensive code untuk `html2canvas` (kalau ada CORS issue).

---

## 14. Performance Optimization

### 14.1 Code Splitting

Default tidak perlu (app kecil). Tapi bisa tambahkan `React.lazy` untuk `ResultPage` (komponen berat karena html2canvas).

```jsx
const ResultPage = React.lazy(() => import("./pages/ResultPage"));

<Suspense fallback={<Spinner />}>
  <ResultPage />
</Suspense>
```

### 14.2 Memoization

- `useMemo` untuk `sortedParticipants` (sebenarnya sudah di-sort di reducer, jadi tidak perlu)
- `useCallback` untuk handler yang di-pass ke child component
- `React.memo` untuk komponen yang sering re-render (mis. `ParticipantRow`)

### 14.3 Re-render Optimization

Context dipisah: `ContestStateContext` (value) + `ContestDispatchContext` (dispatch) supaya komponen yang cuma butuh dispatch tidak re-render saat state berubah.

```jsx
const StateContext = createContext(null);
const DispatchContext = createContext(null);

// Di provider:
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    {children}
  </DispatchContext.Provider>
</StateContext.Provider>

// Hook:
export function useContestState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useContestState must be inside ContestProvider");
  return ctx;
}

export function useContestDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useContestDispatch must be inside ContestProvider");
  return ctx;
}
```

### 14.4 List Virtualization

Tidak perlu untuk app ini (max ratusan peserta, masih manageable untuk DOM).

### 14.5 Bundle Size

Cek dengan `vite build` → lihat `dist/assets/*.js`. Target: < 200KB gzipped (excluding html2canvas).

### 14.6 Image Optimization

Tidak ada image asset. Icon dari Lucide (SVG inline, tree-shakable).

---

## 15. Accessibility (a11y)

### 15.1 Semantic HTML

- `<button>` untuk aksi, `<a>` untuk navigasi
- `<form>` untuk form, dengan `<label>` untuk setiap input
- `<table>` untuk tabel data (bukan div)
- `<nav>`, `<main>`, `<header>`, `<footer>` untuk layout

### 15.2 ARIA

- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Toast: `role="status"`, `aria-live="polite"`
- Loading: `aria-busy="true"`
- Error: `aria-invalid="true"`, `aria-describedby` untuk pesan error

### 15.3 Keyboard Navigation

- Tab order logis
- Enter untuk submit form
- Esc untuk close modal
- Arrow keys untuk navigasi tabel (opsional)

### 15.4 Focus Management

- Focus visible ring (Tailwind: `focus-visible:ring-2 focus-visible:ring-indigo-500`)
- Restore focus ke element sebelumnya setelah modal close
- Skip focus ke main content (opsional, bisa pakai `<a href="#main">`)

### 15.5 Color Contrast

Pastikan semua text kontras >= 4.5:1 (WCAG AA). Hindari text abu-abu terang di atas background putih.

### 15.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 16. Vercel Deployment Plan

### 16.1 `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

`rewrites` penting karena Vercel default ke static, dan React Router butuh semua path resolve ke `index.html`.

### 16.2 `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          forms: ["react-hook-form"],
        },
      },
    },
  },
});
```

### 16.3 Deploy Steps

1. Push ke GitHub
2. Buka Vercel dashboard
3. Import project dari GitHub
4. Framework preset: Vite (auto-detected)
5. Build command: `npm run build`
6. Output directory: `dist`
7. Klik Deploy

Setiap push ke branch `main` → auto deploy.

### 16.4 Environment Variables

Tidak ada (pure frontend). Tapi sediakan `.env.example` untuk dokumentasi.

### 16.5 Preview Deployment

Setiap PR otomatis dapat preview URL (Vercel feature).

---

## 17. Implementation Order

Ini urutan eksekusi. **Setiap tahap akan saya jelaskan dulu sebelum nulis kode.**

| # | Tahap | Output | Estimasi |
|---|---|---|---|
| 1 | Setup project | Vite + React + Tailwind + ESLint jalan | 15 menit |
| 2 | Folder structure & constants | `src/` lengkap + `categories.js`, `routes.js`, `storageKeys.js` | 10 menit |
| 3 | Utils layer | `slugify`, `validation`, `sortParticipants`, `dateFormat`, `id`, `filename`, `storage` | 20 menit |
| 4 | Custom hooks | `useLocalStorage`, `usePersistentReducer`, `useToast`, `useConfirm`, `useExportPNG`, `useContest` | 30 menit |
| 5 | Context & Provider | `ContestContext`, `ToastContext` | 20 menit |
| 6 | UI primitives | `Button`, `Input`, `Card`, `Modal`, `ConfirmDialog`, `Toast`, `Spinner`, `EmptyState` | 45 menit |
| 7 | Layout | `AppLayout`, `PageHeader` | 15 menit |
| 8 | Routing & guards | `App.jsx` dengan routes + `RouteGuard` | 15 menit |
| 9 | Pages | `HomePage`, `CategoryPage`, `ParticipantsPage`, `ResultPage` | 60 menit |
| 10 | Contest components | `ContestNameForm`, `CategoryCard`, `ParticipantForm`, `ParticipantTable`, `ParticipantRow`, `ResultCard` | 60 menit |
| 11 | Integrasi + testing manual | end-to-end test semua flow | 30 menit |
| 12 | Build & deploy prep | `vercel.json`, README, optimize | 15 menit |

**Total estimasi: ~5-6 jam**

---

## 18. Testing Strategy

### 18.1 Manual Testing Checklist

#### Flow 1: Happy Path
- [ ] Buka `/`, input "Lomba Makan Kerupuk", klik Lanjut
- [ ] Di `/kategori`, pilih "Anak", klik Mulai Input
- [ ] Di `/peserta`, tambah Andi (5), Budi (8), Caca (5), Deni (10)
- [ ] Cek tabel: Andi, Caca, Budi, Deni (sorted)
- [ ] Klik Selesai → `/hasil`
- [ ] Cek tabel: 1. Andi 5, 2. Caca 5, 3. Budi 8, 4. Deni 10
- [ ] Klik Download PNG → file terdownload dengan nama `lomba-makan-kerupuk-anak.png`

#### Flow 2: Validasi
- [ ] Input nama kosong → error "Nama wajib diisi"
- [ ] Input nama 1 karakter → error "Nama minimal 2 karakter"
- [ ] Input umur kosong → error "Umur wajib diisi"
- [ ] Input umur -1 → error "Umur harus 0-120 tahun"
- [ ] Di kategori Balita, tambah peserta umur 10 → error
- [ ] Di kategori Ibu-Ibu, tambah peserta umur 15 → error

#### Flow 3: Edit & Hapus
- [ ] Edit Andi jadi umur 6 → tabel reorder otomatis
- [ ] Hapus peserta → muncul ConfirmDialog
- [ ] Cancel → data tidak berubah
- [ ] Confirm → data hilang, nomor urut update

#### Flow 4: Persistence
- [ ] Input 5 peserta, refresh halaman → data masih ada
- [ ] Close tab, buka lagi → data masih ada
- [ ] Klik Reset → confirm → data hilang

#### Flow 5: Edge Cases
- [ ] Submit form dengan spasi aja "  " → error
- [ ] Input nama dengan karakter aneh "<script>" → error karakter tidak valid
- [ ] Tambah 100 peserta → app masih responsive
- [ ] Buka di mobile (DevTools) → layout responsive
- [ ] Buka di Safari iOS → jalan

### 18.2 Unit Testing (Opsional, scope tambahan)

Kalau mau tambahkan unit test (Vitest):

- `validation.test.js` — semua validator
- `sortParticipants.test.js` — sort logic
- `slugify.test.js` — slug generation
- `contestReducer.test.js` — semua action

---

## 19. Future Roadmap

Fitur yang **tidak dibuat sekarang** tapi bisa ditambahkan nanti:

- [ ] Dark mode
- [ ] Multi-lomba (save beberapa lomba, switch)
- [ ] Import peserta dari CSV
- [ ] Export ke Excel/PDF
- [ ] Print langsung (window.print() + print CSS)
- [ ] PWA (installable, offline-first)
- [ ] Internationalization (English/Bahasa)
- [ ] Statistik per kategori (chart)
- [ ] QR code untuk share daftar
- [ ] Backup ke cloud (Supabase/Firebase) — tapi kamu nggak mau pake sekarang

---

## 20. Acceptance Criteria

Aplikasi dianggap **selesai** kalau:

### Fungsional
- [ ] User bisa input nama lomba di `/`
- [ ] User bisa pilih salah satu dari 4 kategori di `/kategori`
- [ ] User bisa tambah peserta di `/peserta` dengan validasi nama & umur
- [ ] User bisa edit peserta (inline)
- [ ] User bisa hapus peserta dengan konfirmasi
- [ ] User bisa reset seluruh data dengan konfirmasi
- [ ] User bisa kembali ke halaman sebelumnya (back button)
- [ ] User bisa download PNG di `/hasil` dengan nama sesuai format
- [ ] Sorting otomatis bekerja (umur ASC, nama ASC)
- [ ] Data persist setelah refresh (LocalStorage)
- [ ] Toast notification muncul saat aksi sukses/gagal
- [ ] Empty state muncul saat belum ada peserta
- [ ] Route guard mengarahkan user ke halaman yang benar
- [ ] Tombol disabled saat form invalid
- [ ] Real-time validation (error muncul saat user mengetik)

### Non-Fungsional
- [ ] Mobile responsive (test di 375px, 768px, 1280px)
- [ ] Load time < 2 detik di 3G (target Lighthouse score > 80)
- [ ] Tidak ada console error saat flow normal
- [ ] ESLint pass tanpa warning
- [ ] Build success tanpa warning
- [ ] Bundle size < 300KB gzipped
- [ ] A11y: bisa navigasi pakai keyboard saja
- [ ] A11y: contrast ratio >= 4.5:1
- [ ] Deploy sukses ke Vercel

### Code Quality
- [ ] Tidak ada duplikasi kode
- [ ] Komponen reusable (Button, Input, Card dipakai di >1 tempat)
- [ ] Business logic terpisah dari komponen
- [ ] Custom hooks untuk logic yang dipakai >1 tempat
- [ ] Konstanta di `constants/`, bukan hard-coded
- [ ] JSDoc untuk fungsi publik
- [ ] Naming konsisten

---

## Lampiran A: Referensi Library

- [React 19 Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/using-vite)
- [React Router v7](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [html2canvas](https://html2canvas.hertzen.com)
- [Lucide React](https://lucide.dev)

## Lampiran B: Inspirasi UI

- Tailwind UI (component patterns)
- shadcn/ui (composition style)
- Vercel Geist (minimalis modern)

---

**Akhir Dokumen**

> Blueprint ini jadi acuan untuk setiap tahap. Kalau ada bagian yang kurang/kurang detail, kasih tahu sebelum kita mulai coding.
