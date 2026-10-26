"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Runs one async action at a time. A ref (not state) blocks re-entry, so a double click or a second
 * Enter in the same tick can't start a duplicate request before React has re-rendered the disabled button.
 */
export function useBusy() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);

  const run = useCallback(async <T,>(action: () => Promise<T>): Promise<T | undefined> => {
    if (running.current) return undefined;
    running.current = true;
    setBusy(true);
    try {
      return await action();
    } finally {
      running.current = false;
      setBusy(false);
    }
  }, []);

  return [run, busy] as const;
}
