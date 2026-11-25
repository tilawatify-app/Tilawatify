import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import {
  DOWNLOAD_COUNTER_KEY,
  DOWNLOAD_COUNTER_STORAGE_KEY,
} from "../data";

const COUNTER_API_BASE = "https://countapi.mileshilliard.com/api/v1";

type DownloadCounterContextValue = {
  count: number;
  loading: boolean;
  recordDownload: () => void;
};

const DownloadCounterContext =
  createContext<DownloadCounterContextValue | null>(null);

function readStoredCount(): number {
  try {
    const raw = window.localStorage.getItem(DOWNLOAD_COUNTER_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeStoredCount(value: number) {
  try {
    window.localStorage.setItem(DOWNLOAD_COUNTER_STORAGE_KEY, String(value));
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
}

export function DownloadCounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number>(() => readStoredCount());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadCount() {
      try {
        const res = await fetch(
          `${COUNTER_API_BASE}/get/${encodeURIComponent(DOWNLOAD_COUNTER_KEY)}`,
          { signal: controller.signal },
        );
        if (!active) return;
        if (res.ok) {
          const data = (await res.json()) as { value?: number | string };
          const remote = Number(data?.value);
          if (Number.isFinite(remote) && remote >= 0) {
            setCount((prev) => {
              const merged = Math.max(prev, remote);
              writeStoredCount(merged);
              return merged;
            });
          }
        }
      } catch {
        /* Graceful fallback to localStorage when offline or blocked. */
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCount();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const recordDownload = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      writeStoredCount(next);
      return next;
    });

    fetch(
      `${COUNTER_API_BASE}/hit/${encodeURIComponent(DOWNLOAD_COUNTER_KEY)}`,
      { keepalive: true },
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { value?: number | string } | null) => {
        const remote = Number(data?.value);
        if (Number.isFinite(remote) && remote >= 0) {
          setCount((prev) => {
            const merged = Math.max(prev, remote);
            writeStoredCount(merged);
            return merged;
          });
        }
      })
      .catch(() => {
        /* Local count already incremented and persisted. */
      });
  }, []);

  return (
    <DownloadCounterContext.Provider value={{ count, loading, recordDownload }}>
      {children}
    </DownloadCounterContext.Provider>
  );
}

export function useDownloadCounter() {
  const context = useContext(DownloadCounterContext);
  if (!context) {
    throw new Error(
      "useDownloadCounter must be used within DownloadCounterProvider",
    );
  }
  return context;
}

export function LiveDownloadBadge({
  className = "",
  label = "downloads so far",
}: {
  className?: string;
  label?: string;
}) {
  const { count, loading } = useDownloadCounter();
  const formatted = count.toLocaleString();

  return (
    <div
      className={`live-download-badge ${className}`}
      aria-live="polite"
      data-testid="live-download-counter"
    >
      <span className="live-download-pulse" aria-hidden="true" />
      <Download size={13} strokeWidth={1.9} aria-hidden="true" />
      <motion.strong
        key={count}
        initial={{ y: -6, opacity: 0.4 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {loading && count === 0 ? "..." : formatted}
      </motion.strong>
      <span>{count === 1 ? "download so far" : label}</span>
    </div>
  );
}
