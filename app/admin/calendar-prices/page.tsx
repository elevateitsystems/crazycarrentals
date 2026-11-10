"use client";

import { useMemo, useState } from "react";
import { CalendarRange, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { ErrorState, Notice, Spinner } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAsync } from "@/hooks/use-async";
import { useBusy } from "@/hooks/use-busy";
import { useConfirm } from "@/hooks/use-confirm";
import { toList } from "@/lib/api/client";
import { adminApi } from "@/lib/api/services";
import type { Car, DailyRate } from "@/lib/api/types";
import { buildDailyRatesInput, dateRange, daysInMonth, firstWeekday, longDate, monthLabel, toYmd, todayYmd } from "@/lib/calendar";
import { carName, money } from "@/lib/format";
import { shortDate } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { selectClass } from "../components/ListControls";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Unsaved edits: a price, or null for "back to the car's normal rate". */
type Edits = Record<string, number | null>;

export default function CalendarPricesPage() {
  const today = todayYmd();
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month0, setMonth0] = useState(() => Number(today.slice(5, 7)) - 1);
  const [carId, setCarId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [rangeMode, setRangeMode] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [edits, setEdits] = useState<Edits>({});
  const [flash, setFlash] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirm, confirmDialog] = useConfirm();
  const [run, busy] = useBusy();

  const cars = useAsync(async () => toList<Car>((await adminApi.cars({ page: 1, limit: 100 })).data), "calendar-cars");
  const activeCarId = carId || cars.data?.[0]?.id || "";
  const car = cars.data?.find((c) => c.id === activeCarId);

  const from = toYmd(year, month0, 1);
  const to = toYmd(year, month0, daysInMonth(year, month0));
  const rates = useAsync(
    async () => (activeCarId ? (await adminApi.dailyRates(activeCarId, { from, to })).data : null),
    `${activeCarId}|${from}`,
  );

  const base = rates.data?.basePricePerDay ?? Number(car?.pricePerDay ?? 0);
  const server = useMemo(() => {
    const m = new Map<string, DailyRate>();
    for (const d of rates.data?.days ?? []) m.set(d.date, d);
    return m;
  }, [rates.data]);

  const editCount = Object.keys(edits).length;
  const thisMonth = toYmd(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1, 1);
  const canGoBack = from > thisMonth;

  const goMonth = (delta: number) => {
    const d = new Date(Date.UTC(year, month0 + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth0(d.getUTCMonth());
  };

  const changeCar = async (id: string) => {
    if (id === activeCarId) return;
    if (editCount && !(await confirm({ title: "Discard unsaved prices?", description: `You have ${editCount} unsaved change${editCount === 1 ? "" : "s"} for ${car ? carName(car) : "this car"}.`, confirmLabel: "Discard", destructive: true }))) return;
    setCarId(id);
    setEdits({});
    setSelected([]);
    setAnchor(null);
    setFlash(null);
    setFormError(null);
  };

  const pick = (date: string, shift: boolean) => {
    setFormError(null);
    if ((rangeMode || shift) && anchor) {
      const span = dateRange(anchor, date).filter((d) => d >= today);
      setSelected((s) => [...new Set([...s, ...span])]);
      setAnchor(date);
      return;
    }
    setSelected((s) => (s.includes(date) ? s.filter((d) => d !== date) : [...s, date]));
    setAnchor(date);
  };

  const selectMonth = () => {
    const days = dateRange(from, to).filter((d) => d >= today);
    setSelected((s) => [...new Set([...s, ...days])]);
  };

  const applyPrice = () => {
    const price = Number(priceInput);
    if (!selected.length) return setFormError("Select at least one date first.");
    if (priceInput.trim() === "" || !Number.isFinite(price) || price <= 0) return setFormError("Enter a price per day above $0.");
    if (Math.round(price * 100) !== price * 100) return setFormError("Use at most two decimal places.");
    setEdits((e) => ({ ...e, ...Object.fromEntries(selected.map((d) => [d, price])) }));
    setSelected([]);
    setAnchor(null);
    setFormError(null);
  };

  const resetSelected = () => {
    if (!selected.length) return setFormError("Select at least one date first.");
    setEdits((e) => ({ ...e, ...Object.fromEntries(selected.map((d) => [d, null])) }));
    setSelected([]);
    setAnchor(null);
    setFormError(null);
  };

  const discard = () => {
    setEdits({});
    setSelected([]);
    setAnchor(null);
    setFormError(null);
  };

  const save = () =>
    run(async () => {
      if (!activeCarId || !editCount) return;
      setFlash(null);
      try {
        await adminApi.saveDailyRates(activeCarId, buildDailyRatesInput(edits));
        setEdits({});
        setFlash({ kind: "success", text: `Saved ${editCount} date price${editCount === 1 ? "" : "s"} for ${car ? carName(car) : "the car"}. Bookings now use them.` });
        rates.reload();
      } catch (err) {
        setFlash({ kind: "error", text: err instanceof Error ? err.message : "Could not save the prices." });
      }
    });

  // Effective price shown in a cell: unsaved edit, else the saved date price, else the car's normal rate.
  const cell = (date: string) => {
    const edit = edits[date];
    if (edit !== undefined) return { price: edit ?? base, state: edit === null ? ("reset" as const) : ("edited" as const) };
    const s = server.get(date);
    return { price: s?.price ?? base, state: s?.isCustom ? ("custom" as const) : ("normal" as const) };
  };

  const blanks = firstWeekday(year, month0);
  const dayCount = daysInMonth(year, month0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Date Prices</h1>
        <p className="mt-2 text-muted-foreground">
          Set a different daily price for specific dates, for example peak days or holidays. Bookings are charged the price of each date they cover.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="cp-car">Vehicle</Label>
          {cars.loading ? (
            <Spinner label="Loading vehicles…" />
          ) : cars.error ? (
            <ErrorState message={cars.error} onRetry={cars.reload} />
          ) : (
            <select id="cp-car" className={selectClass} value={activeCarId} onChange={(e) => void changeCar(e.target.value)} disabled={busy}>
              {(cars.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {carName(c)} · {c.plate ?? "no plate"}
                </option>
              ))}
            </select>
          )}
        </div>
        {car && (
          <p className="text-sm text-muted-foreground">
            Normal rate: <span className="font-semibold text-foreground">{money(base)}</span> / day. Change it in Fleet Management.
          </p>
        )}
      </div>

      {flash && <Notice kind={flash.kind}>{flash.text}</Notice>}

      {!cars.loading && !cars.error && !cars.data?.length ? (
        <p className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">No vehicles yet. Add one in Fleet Management first.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          {/* Calendar */}
          <section aria-label="Price calendar" className="rounded-xl border bg-card p-3 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <Button type="button" variant="outline" size="icon" aria-label="Previous month" disabled={!canGoBack} onClick={() => goMonth(-1)}>
                <ChevronLeft className="size-4" />
              </Button>
              <h2 className="text-center text-base font-semibold sm:text-lg" aria-live="polite">{monthLabel(year, month0)}</h2>
              <Button type="button" variant="outline" size="icon" aria-label="Next month" onClick={() => goMonth(1)}>
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                <Legend className="border-border bg-background" label="Normal rate" />
                <Legend className="border-primary bg-primary/20" label="Date price" />
                <Legend className="border-amber-500 bg-amber-100" label="Unsaved" />
              </ul>
              <div className="flex items-center gap-2">
                <Switch id="cp-range" checked={rangeMode} onCheckedChange={setRangeMode} />
                <Label htmlFor="cp-range" className="text-xs font-medium">Select a range</Label>
              </div>
            </div>

            <div className="relative mt-3" aria-busy={rates.loading}>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:gap-1.5">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="py-1">{w}</div>
                ))}
              </div>
              <div className={cn("mt-1 grid grid-cols-7 gap-1 sm:gap-1.5", rates.loading && "opacity-50")}>
                {Array.from({ length: blanks }, (_, i) => (
                  <div key={`b${i}`} aria-hidden />
                ))}
                {Array.from({ length: dayCount }, (_, i) => {
                  const date = toYmd(year, month0, i + 1);
                  const past = date < today;
                  const { price, state } = cell(date);
                  const isSel = selected.includes(date);
                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={past || rates.loading || Boolean(rates.error)}
                      aria-pressed={isSel}
                      aria-label={`${longDate(date)}, ${money(price)} per day${state === "custom" ? ", date price" : state === "edited" ? ", unsaved change" : state === "reset" ? ", will return to normal rate" : ""}`}
                      onClick={(e) => pick(date, e.shiftKey)}
                      className={cn(
                        "flex min-h-14 flex-col items-center justify-center rounded-lg border px-0.5 py-1 text-center transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary sm:min-h-16",
                        "disabled:cursor-not-allowed disabled:opacity-40",
                        state === "normal" && "border-border bg-background hover:bg-muted",
                        state === "custom" && "border-primary bg-primary/20 hover:bg-primary/30",
                        (state === "edited" || state === "reset") && "border-amber-500 bg-amber-100 text-amber-950 hover:bg-amber-200",
                        isSel && "ring-2 ring-foreground ring-offset-1"
                      )}
                    >
                      <span className="text-sm font-semibold leading-none">{i + 1}</span>
                      <span className="mt-1 text-[11px] leading-none sm:text-xs">{money(price).replace(/\.00$/, "")}</span>
                    </button>
                  );
                })}
              </div>
              {rates.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner label="Loading prices…" />
                </div>
              )}
            </div>
            {rates.error && <div className="mt-3"><ErrorState message={rates.error} onRetry={rates.reload} /></div>}
            <p className="mt-3 text-xs text-muted-foreground">Tap dates to select them. Past dates can&apos;t be changed. Hold Shift and click, or switch on &ldquo;Select a range&rdquo;, to select a stretch of days.</p>
          </section>

          {/* Editor */}
          <aside className="space-y-4 rounded-xl border bg-card p-4 sm:p-5 lg:sticky lg:top-6">
            <div className="flex items-center gap-2">
              <CalendarRange className="size-5 text-muted-foreground" aria-hidden />
              <h2 className="text-base font-semibold">Set prices</h2>
            </div>

            <p className="text-sm text-muted-foreground" aria-live="polite">
              {selected.length === 0
                ? "No dates selected."
                : `${selected.length} date${selected.length === 1 ? "" : "s"} selected${selected.length > 1 ? `: ${shortDate([...selected].sort()[0])} – ${shortDate([...selected].sort()[selected.length - 1])}` : `: ${shortDate(selected[0])}`}.`}
            </p>

            {formError && <Notice>{formError}</Notice>}

            <div className="space-y-2">
              <Label htmlFor="cp-price">Price per day ($)</Label>
              <Input
                id="cp-price"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPrice();
                  }
                }}
                placeholder={base ? String(base) : "e.g. 150"}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Button type="button" onClick={applyPrice} disabled={busy}>Apply to selected</Button>
              <Button type="button" variant="outline" onClick={resetSelected} disabled={busy} className="gap-1.5">
                <RotateCcw className="size-4" /> Normal rate
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <button type="button" onClick={selectMonth} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">Select whole month</button>
              <button type="button" onClick={() => { setSelected([]); setAnchor(null); }} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">Clear selection</button>
            </div>

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm">
                {editCount === 0 ? <span className="text-muted-foreground">No unsaved changes.</span> : <span className="font-medium">{editCount} unsaved change{editCount === 1 ? "" : "s"}.</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void save()} loading={busy} disabled={!editCount || busy}>{busy ? "Saving…" : "Save changes"}</Button>
                <Button type="button" variant="outline" onClick={discard} disabled={!editCount || busy}>Discard</Button>
              </div>
            </div>
          </aside>
        </div>
      )}
      {confirmDialog}
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden className={cn("size-3.5 rounded border", className)} />
      {label}
    </li>
  );
}
