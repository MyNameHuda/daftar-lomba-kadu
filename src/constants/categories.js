export const CATEGORIES = [
  {
    id: "balita",
    label: "Balita",
    description: "Untuk usia 2-5 tahun",
    ageMin: 2,
    ageMax: 5,
    iconName: "Baby",
    gradient: "from-rose-400 to-pink-500",
    accent: "text-rose-600",
    bgAccent: "bg-rose-50",
    borderAccent: "border-rose-200",
    ringAccent: "ring-rose-300",
  },
  {
    id: "anak",
    label: "Anak",
    description: "Untuk usia 6-13 tahun",
    ageMin: 6,
    ageMax: 13,
    iconName: "Smile",
    gradient: "from-amber-400 to-orange-500",
    accent: "text-amber-600",
    bgAccent: "bg-amber-50",
    borderAccent: "border-amber-200",
    ringAccent: "ring-amber-300",
  },
  {
    id: "ibu-ibu",
    label: "Ibu-Ibu",
    description: "Minimal 18 tahun ke atas",
    ageMin: 18,
    ageMax: undefined,
    iconName: "Users",
    gradient: "from-emerald-400 to-teal-500",
    accent: "text-emerald-600",
    bgAccent: "bg-emerald-50",
    borderAccent: "border-emerald-200",
    ringAccent: "ring-emerald-300",
  },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export function getCategoryById(id) {
  return CATEGORY_MAP[id] || null;
}

export function getCategoryAgeLabel(category) {
  const meta = getCategoryById(category);
  if (!meta) return "";
  if (meta.ageMax === undefined) {
    return `Min. ${meta.ageMin} tahun`;
  }
  return `${meta.ageMin}–${meta.ageMax} tahun`;
}
