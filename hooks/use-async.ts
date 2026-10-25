"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Settled<T> = { requestId: string; data: T | null; error: string | null };

/** Runs `fetcher` on mount and whenever `key` changes; `reload` re-runs it. */
export function useAsync<T>(fetcher: () => Promise<T>, key: string = "") {
  const [tick, setTick] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const fetcherRef = useRef(fetcher);
  const requestId = `${key}#${tick}`;

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    fetcherRef.current().then(
      (data) => !cancelled && setSettled({ requestId, data, error: null }),
      (err: unknown) =>
        !cancelled && setSettled({ requestId, data: null, error: err instanceof Error ? err.message : "Something went wrong" }),
    );
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  // Loading until the response for the *current* request has arrived; `data` is from the latest settled request.
  const loading = settled?.requestId !== requestId;
  return { data: settled?.data ?? null, error: loading ? null : settled?.error ?? null, loading, reload };
}
