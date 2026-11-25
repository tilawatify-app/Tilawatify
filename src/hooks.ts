import { useEffect, useState } from "react";

export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return initial;
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(initial) && !Array.isArray(parsed)) return initial;
      return typeof parsed === typeof initial ? (parsed as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}
