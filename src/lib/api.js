// =====================================================
// API client — talks to the backend via /api/*
// Uses Vite proxy in dev (vite.config.js), same origin in prod.
// =====================================================

const BASE_URL = "/api";

/**
 * Read auth token from localStorage. Returns null if absent.
 */
export function getAuthToken() {
  try {
    return window.localStorage.getItem("dlk_admin_token");
  } catch {
    return null;
  }
}

/**
 * Persist / clear auth token in localStorage.
 */
export function setAuthToken(token) {
  try {
    if (token) {
      window.localStorage.setItem("dlk_admin_token", token);
    } else {
      window.localStorage.removeItem("dlk_admin_token");
    }
  } catch {
    // ignore (private mode, etc.)
  }
}

class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? 0;
    this.payload = payload ?? null;
  }
}

async function request(path, { method = "GET", body, auth = false, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Gagal terhubung ke server. Periksa koneksi Anda.", { status: 0 });
  }

  // Try to parse JSON (some endpoints may return empty body)
  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // Non-JSON response, leave payload null
    }
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      (response.status === 401
        ? "Sesi berakhir, silakan login ulang"
        : response.status === 403
        ? "Akses ditolak"
        : response.status === 404
        ? "Data tidak ditemukan"
        : `Request gagal (${response.status})`);
    throw new ApiError(message, { status: response.status, payload });
  }

  return payload;
}

// =====================================================
// Public endpoints
// =====================================================

export const api = {
  // ---- Auth ----
  login(username, password) {
    return request("/auth/login", { method: "POST", body: { username, password } });
  },
  me() {
    return request("/auth/me", { auth: true });
  },

  // ---- Contests (public read) ----
  listContests(signal) {
    return request("/contests", { signal });
  },
  getContest(id, signal) {
    return request(`/contests/${id}`, { signal });
  },

  // ---- Contests (admin write) ----
  createContest(payload) {
    return request("/contests", { method: "POST", body: payload, auth: true });
  },
  updateContest(id, payload) {
    return request(`/contests/${id}`, { method: "PUT", body: payload, auth: true });
  },
  deleteContest(id) {
    return request(`/contests/${id}`, { method: "DELETE", auth: true });
  },

  // ---- Participants (admin write) ----
  listParticipants(contestId, signal) {
    return request(`/contests/${contestId}/participants`, { signal });
  },
  addParticipant(contestId, payload) {
    return request(`/contests/${contestId}/participants`, {
      method: "POST",
      body: payload,
      auth: true,
    });
  },
  updateParticipant(id, payload) {
    return request(`/participants/${id}`, { method: "PUT", body: payload, auth: true });
  },
  deleteParticipant(id) {
    return request(`/participants/${id}`, { method: "DELETE", auth: true });
  },
};

export { ApiError };
