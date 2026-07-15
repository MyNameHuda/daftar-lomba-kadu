// =====================================================
// Server-side validation
// =====================================================

import {
  VALID_CATEGORIES,
  getAgeRange,
  isAgeInRange,
} from "./ageRange.js";

export { VALID_CATEGORIES };
export const VALID_SUB_CATEGORIES = ["laki_laki", "perempuan"];

const NAME_REGEX =
  /^[a-zA-Z0-9\s\u00C0-\u017F\u2018-\u2019\u201C-\u201D\-'.]+$/;

/**
 * Validate contest input.
 * NOTE: age_min/age_max are intentionally NOT accepted from the client anymore
 * — the system derives the range from `category` via api/_lib/ageRange.js.
 *
 * @param {object} input
 * @returns {{ valid: boolean, error: string | null, data?: object }}
 */
export function validateContestInput(input) {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Body tidak valid" };
  }

  const name = (input.name ?? "").toString().trim();
  if (name.length < 3) {
    return { valid: false, error: "Nama lomba minimal 3 karakter" };
  }
  if (name.length > 100) {
    return { valid: false, error: "Nama lomba maksimal 100 karakter" };
  }

  const category = (input.category ?? "").toString();
  if (!VALID_CATEGORIES.includes(category)) {
    return { valid: false, error: "Kategori tidak valid" };
  }

  let subCategory = null;
  if (category === "anak") {
    subCategory = (input.sub_category ?? "").toString();
    if (!VALID_SUB_CATEGORIES.includes(subCategory)) {
      return { valid: false, error: "Sub-kategori wajib diisi untuk Anak" };
    }
  }

  return {
    valid: true,
    error: null,
    data: {
      name,
      category,
      sub_category: subCategory,
    },
  };
}

/**
 * Validate participant input.
 * NOTE: age bounds are NOT validated here against a category — that is the
 * caller's responsibility (see api/contests/[id]/participants.js), since
 * age rules depend on the contest the participant is being added to.
 *
 * @param {object} input
 * @returns {{ valid: boolean, error: string | null, data?: object }}
 */
export function validateParticipantInput(input) {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Body tidak valid" };
  }

  const name = (input.name ?? "").toString().trim();
  if (name.length < 2) {
    return { valid: false, error: "Nama peserta minimal 2 karakter" };
  }
  if (name.length > 100) {
    return { valid: false, error: "Nama peserta maksimal 100 karakter" };
  }
  if (!NAME_REGEX.test(name)) {
    return { valid: false, error: "Nama mengandung karakter tidak valid" };
  }

  const age = parseIntOrNull(input.age);
  if (age === null) {
    return { valid: false, error: "Umur wajib diisi" };
  }
  if (age < 0 || age > 120) {
    return { valid: false, error: "Umur harus 0-120 tahun" };
  }

  return {
    valid: true,
    error: null,
    data: { name, age },
  };
}

/**
 * Validate that a participant's age is allowed for the given contest category.
 * Returns a badRequest-style error object when invalid, or null when valid.
 *
 * Usage:
 *   const err = validateAgeForCategory(age, category);
 *   if (err) return err;
 *
 * @param {number} age
 * @param {string} category
 * @returns {{valid:false, error:string}|null}
 */
export function validateAgeForCategory(age, category) {
  const range = getAgeRange(category);
  if (!range) {
    return { valid: false, error: "Kategori lomba tidak dikenali" };
  }
  if (!isAgeInRange(age, category)) {
    if (age < range.ageMin) {
      return {
        valid: false,
        error: `Umur minimal untuk lomba ini adalah ${range.ageMin} tahun`,
      };
    }
    return {
      valid: false,
      error:
        range.ageMax === null
          ? "Umur tidak valid"
          : `Umur maksimal untuk lomba ini adalah ${range.ageMax} tahun`,
    };
  }
  return null;
}

function parseIntOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n)) return null;
  return n;
}
