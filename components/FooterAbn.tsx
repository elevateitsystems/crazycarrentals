"use client";

import { useAsync } from "@/hooks/use-async";
import { bookingsApi } from "@/lib/api/services";

const FALLBACK_ABN = "31 793 813 481";

/** ABN from `GET /bookings/extras` (`data.company.abn`). */
export default function FooterAbn() {
  const { data } = useAsync(async () => (await bookingsApi.extras()).data, "company-abn");
  return <>ABN {data?.company?.abn || FALLBACK_ABN}</>;
}
