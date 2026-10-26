"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { enumLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Search box that only applies the term on submit, so typing doesn't fire a request per keystroke. */
export function SearchBox({ value, onSearch, placeholder }: { value: string; onSearch: (term: string) => void; placeholder: string }) {
  // Remount (via `key`) when the applied value changes from outside, e.g. back/forward navigation.
  return <SearchForm key={value} initial={value} onSearch={onSearch} placeholder={placeholder} />;
}

function SearchForm({ initial, onSearch, placeholder }: { initial: string; onSearch: (term: string) => void; placeholder: string }) {
  const [term, setTerm] = useState(initial);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(term.trim());
      }}
      className="flex min-w-56 flex-1 gap-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder={placeholder} className="pl-9" aria-label={placeholder} />
      </div>
      <Button type="submit" variant="outline">Search</Button>
    </form>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel,
  className,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  allLabel: string;
  className?: string;
}) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cn(selectClass, "w-48", className)}>
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o} value={o}>{enumLabel(o)}</option>
      ))}
    </select>
  );
}

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export const PAYMENT_OPTIONS = ["PAY_NOW", "PAY_AT_DESK"] as const;
// Values observed from the live backend. Unknown filter values aren't rejected (they just match nothing).
export const PAYMENT_STATUSES = ["PENDING", "PENDING_AT_DESK", "COMPLETED", "REFUNDED"] as const;
