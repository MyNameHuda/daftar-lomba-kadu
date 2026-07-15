// =====================================================
// Single source of truth (backend) for age ranges per contest category.
// Frontend mirror lives in src/constants/categories.js — keep in sync.
// =====================================================
//
// Adding a new category? Update BOTH this file AND src/constants/categories.js,
// and add the label to VALID_CATEGORIES below.
// =====================================================

/**
 * Age range per contest category.
 * - ageMin:  lower bound (inclusive). Integer >= 0.
 * - ageMax:  upper bound (inclusive). null = no upper limit.
 */
export const AGE_RANGES = Object.freeze({
  balita: { ageMin: 2, ageMax: 5 },
  anak: { ageMin: 6, ageMax: 13 },
  "ibu-ibu": { ageMin: 18, ageMax: null },
});

export const VALID_CATEGORIES = Object.freeze(Object.keys(AGE_RANGES));

/**
 * Return age range for a category, or null if category is unknown.
 * @param {string} category
 * @returns {{ageMin:number, ageMax:number|null}|null}
 */
export function getAgeRange(category) {
  return AGE_RANGES[category] ?? null;
}

/**
 * Check whether an age is valid for a given category.
 * @param {number} age
 * @param {string} category
 * @returns {boolean}
 */
export function isAgeInRange(age, category) {
  const range = getAgeRange(category);
  if (!range) return false;
  if (!Number.isInteger(age) || age < range.ageMin) return false;
  if (range.ageMax !== null && age > range.ageMax) return false;
  return true;
}

/**
 * Human-readable label for the category's age range.
 *   balita   -> "2-5 tahun"
 *   anak     -> "6-13 tahun"
 *   ibu-ibu  -> "Min. 18 tahun"
 * @param {string} category
 * @returns {string}
 */
export function getAgeRangeLabel(category) {
  const range = getAgeRange(category);
  if (!range) return "";
  if (range.ageMax === null) return `Min. ${range.ageMin} tahun`;
  return `${range.ageMin}-${range.ageMax} tahun`;
}
