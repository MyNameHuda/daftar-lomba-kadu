import { slugify } from "./slugify";

export function generateExportFilename(contestName, category) {
  const contestSlug = slugify(contestName) || "lomba";
  const categorySlug = slugify(category) || "kategori";
  return `${contestSlug}-${categorySlug}.png`;
}
