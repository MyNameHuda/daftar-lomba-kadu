export const SUB_CATEGORIES = [
  {
    id: "laki-laki",
    label: "Anak Laki-laki",
    description: "Untuk peserta laki-laki",
    iconName: "User",
    gradient: "from-sky-400 to-blue-500",
    accent: "text-sky-600",
    bgAccent: "bg-sky-50",
    borderAccent: "border-sky-200",
    ringAccent: "ring-sky-300",
  },
  {
    id: "perempuan",
    label: "Anak Perempuan",
    description: "Untuk peserta perempuan",
    iconName: "User",
    gradient: "from-pink-400 to-rose-500",
    accent: "text-pink-600",
    bgAccent: "bg-pink-50",
    borderAccent: "border-pink-200",
    ringAccent: "ring-pink-300",
  },
];

export const SUB_CATEGORY_MAP = SUB_CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export function getSubCategoryById(id) {
  return SUB_CATEGORY_MAP[id] || null;
}

export function getSubCategoryLabel(subCategory) {
  if (!subCategory) return "";
  const meta = getSubCategoryById(subCategory);
  return meta ? meta.label : subCategory;
}
