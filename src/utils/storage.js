import { STORAGE_KEYS, STORAGE_VERSION } from "@/constants/storageKeys";

function isStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const probe = "__storage_probe__";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const AVAILABLE = isStorageAvailable();

export const storage = {
  get() {
    if (!AVAILABLE) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.CONTEST_STATE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return null;
      if (typeof parsed.version !== "number") return null;
      if (parsed.version > STORAGE_VERSION) return null;
      if (typeof parsed.data !== "object" || parsed.data === null) return null;
      return parsed;
    } catch (err) {
      console.warn("Storage read failed:", err);
      return null;
    }
  },

  set(state) {
    if (!AVAILABLE) return false;
    try {
      const payload = {
        version: STORAGE_VERSION,
        savedAt: new Date().toISOString(),
        data: state,
      };
      window.localStorage.setItem(
        STORAGE_KEYS.CONTEST_STATE,
        JSON.stringify(payload)
      );
      return true;
    } catch (err) {
      console.warn("Storage write failed:", err);
      return false;
    }
  },

  clear() {
    if (!AVAILABLE) return false;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.CONTEST_STATE);
      return true;
    } catch (err) {
      console.warn("Storage clear failed:", err);
      return false;
    }
  },

  isAvailable() {
    return AVAILABLE;
  },
};
