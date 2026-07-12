import { useEffect, useReducer, useRef } from "react";
import { storage } from "@/utils/storage";

export function usePersistentReducer(reducer, initialState, options = {}) {
  const { persist = true } = options;

  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (!persist) return init;
    const stored = storage.get();
    return stored?.data ?? init;
  });

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!persist) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    storage.set(state);
  }, [state, persist]);

  return [state, dispatch];
}
