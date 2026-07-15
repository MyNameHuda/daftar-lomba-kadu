// =====================================================
// AuthContext — admin session state
// =====================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, getAuthToken, setAuthToken } from "@/lib/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("loading"); // 'loading' | 'anon' | 'authed'
  const [error, setError] = useState(null);

  // Bootstrap: if we have a token, verify it with /auth/me
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setStatus("anon");
      return;
    }
    let cancelled = false;
    api
      .me()
      .then((res) => {
        if (cancelled) return;
        setAdmin(res?.admin ?? null);
        setStatus("authed");
      })
      .catch((err) => {
        if (cancelled) return;
        // Token invalid/expired — clear it
        setAuthToken(null);
        setAdmin(null);
        setStatus("anon");
        if (err instanceof ApiError && err.status !== 0) {
          // Silent — not a real error from the user's POV
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const res = await api.login(username, password);
      if (!res?.token || !res?.admin) {
        throw new ApiError("Respons login tidak valid");
      }
      setAuthToken(res.token);
      setAdmin(res.admin);
      setStatus("authed");
      return { ok: true, admin: res.admin };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal";
      setError(message);
      return { ok: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setAdmin(null);
    setStatus("anon");
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      status,
      error,
      isAuthed: status === "authed",
      isLoading: status === "loading",
      login,
      logout,
    }),
    [admin, status, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
