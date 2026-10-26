"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * List filters kept in the URL, so they survive reloads and can be linked to (e.g. from the dashboard).
 * Changing any filter other than `page` resets to page 1. Callers must sit inside a <Suspense> boundary.
 */
export function useQueryState<K extends string>(keys: readonly K[]) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const values = useMemo(() => Object.fromEntries(keys.map((k) => [k, params.get(k) ?? ""])) as Record<K, string>, [keys, params]);
  const page = Math.max(1, Number(params.get("page")) || 1);

  const set = useCallback(
    (patch: Partial<Record<K | "page", string | number>>) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) {
        if (v === "" || v === undefined || v === null || (k === "page" && Number(v) <= 1)) next.delete(k);
        else next.set(k, String(v));
      }
      if (!("page" in patch)) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return { values, page, set };
}
