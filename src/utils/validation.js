import { FORM_LIMITS } from "@/constants";
import { getCategoryById } from "@/constants/categories";

const NAME_REGEX =
  /^[a-zA-Z0-9\s\u00C0-\u017F\u2018-\u2019\u201C-\u201D\-'.]+$/;

export function validateName(name) {
  if (name === null || name === undefined) {
    return { valid: false, error: "Nama wajib diisi" };
  }
  const trimmed = String(name).trim();
  if (!trimmed) {
    return { valid: false, error: "Nama wajib diisi" };
  }
  if (trimmed.length < FORM_LIMITS.PARTICIPANT_NAME_MIN) {
    return { valid: false, error: `Nama minimal ${FORM_LIMITS.PARTICIPANT_NAME_MIN} karakter` };
  }
  if (trimmed.length > FORM_LIMITS.PARTICIPANT_NAME_MAX) {
    return { valid: false, error: `Nama maksimal ${FORM_LIMITS.PARTICIPANT_NAME_MAX} karakter` };
  }
  if (!NAME_REGEX.test(trimmed)) {
    return { valid: false, error: "Nama mengandung karakter tidak valid" };
  }
  return { valid: true, error: null, value: trimmed };
}

export function validateAge(age) {
  if (age === "" || age === null || age === undefined) {
    return { valid: false, error: "Umur wajib diisi", value: null };
  }
  const num = Number(age);
  if (Number.isNaN(num)) {
    return { valid: false, error: "Umur harus berupa angka", value: null };
  }
  if (!Number.isInteger(num)) {
    return { valid: false, error: "Umur harus bilangan bulat", value: null };
  }
  if (num < FORM_LIMITS.AGE_MIN || num > FORM_LIMITS.AGE_MAX) {
    return {
      valid: false,
      error: `Umur harus ${FORM_LIMITS.AGE_MIN}–${FORM_LIMITS.AGE_MAX} tahun`,
      value: null,
    };
  }
  return { valid: true, error: null, value: num };
}

export function validateAgeByCategory(age, category) {
  const meta = getCategoryById(category);
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

export function validateContestName(name) {
  if (name === null || name === undefined) {
    return { valid: false, error: "Nama lomba wajib diisi" };
  }
  const trimmed = String(name).trim();
  if (!trimmed) {
    return { valid: false, error: "Nama lomba wajib diisi" };
  }
  if (trimmed.length < FORM_LIMITS.CONTEST_NAME_MIN) {
    return { valid: false, error: `Nama lomba minimal ${FORM_LIMITS.CONTEST_NAME_MIN} karakter` };
  }
  if (trimmed.length > FORM_LIMITS.CONTEST_NAME_MAX) {
    return { valid: false, error: `Nama lomba maksimal ${FORM_LIMITS.CONTEST_NAME_MAX} karakter` };
  }
  return { valid: true, error: null, value: trimmed };
}

export function isDuplicate(participants, name, age, excludeId = null) {
  const normalized = String(name).trim().toLowerCase();
  return participants.some(
    (p) =>
      p.id !== excludeId &&
      p.name.toLowerCase() === normalized &&
      p.age === Number(age)
  );
}
