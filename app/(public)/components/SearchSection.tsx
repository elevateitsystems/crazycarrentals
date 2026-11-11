"use client";

import { useState } from "react";
import { CornerDownLeft, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RENTAL_LOCATION_LABEL } from "@/lib/locations";
import { cn } from "@/lib/utils";

const fields = [
  { id: "pickupLocation", label: "Pickup Location", type: "text", placeholder: "e.g. Launceston Downtown, Tasmania Australia", defaultValue: RENTAL_LOCATION_LABEL },
  { id: "returnLocation", label: "Return Location", type: "text", placeholder: "e.g. Launceston Downtown, Tasmania Australia" },
  { id: "pickupDate", label: "Pickup Date", type: "date" },
  { id: "pickupTime", label: "Pickup Time", type: "time" },
  { id: "returnDate", label: "Return Date", type: "date" },
  { id: "returnTime", label: "Return Time", type: "time" },
] as const;

// Driver age bands. The value is the minimum age sent to the backend's availability search as `age`.
const AGE_OPTIONS = [
  { value: "21", label: "21+" },
  { value: "25", label: "25+" },
] as const;

const labelStyles = "text-[11px] font-semibold uppercase leading-4 tracking-wider text-neutral-500";

const inputStyles =
  "h-12 rounded-xl border-neutral-200 bg-white px-3.5 text-[15px] shadow-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus-visible:border-primary focus-visible:ring-primary/30 md:text-[15px]";

// Native pickers keep their format hint (dd/mm/yyyy, --:--) and icon visible; the hint is muted while the field is empty.
const pickerStyles =
  "cursor-pointer [&:invalid]:text-neutral-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

type Field = (typeof fields)[number];

export default function SearchSection() {
  const [sameLocation, setSameLocation] = useState(true);
  const [airportShuttle, setAirportShuttle] = useState(false);
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in the visitor's timezone

  // Hands the trip details to /rent-a-car, which queries the backend's availability search.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (typeof value === "string" && value) params.set(key, value);
    }
    if (airportShuttle) params.set("airportShuttle", "1");
    router.push(`/rent-a-car?${params}`);
  };

  const renderField = (f: Field, className?: string) => (
    <div key={f.id} className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={f.id} className={labelStyles}>
        {f.label}
      </Label>
      <Input
        id={f.id}
        name={f.id}
        type={f.type}
        placeholder={"placeholder" in f ? f.placeholder : undefined}
        defaultValue={"defaultValue" in f ? f.defaultValue : undefined}
        required
        min={f.type === "date" ? today : undefined}
        onClick={f.type === "text" ? undefined : (e) => e.currentTarget.showPicker?.()}
        className={`${inputStyles} ${f.type === "text" ? "" : pickerStyles}`}
      />
    </div>
  );
  const byId = (id: Field["id"]) => fields.find((f) => f.id === id)!;

  return (
    <section className="bg-background pb-12 pt-7 sm:pb-16 sm:pt-9 lg:pb-20">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Reservation" title="Ready to hit the road?" description="Enter your details below to find available vehicles." />

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(17,21,18,0.35)] ring-1 ring-black/5 sm:mt-10"
        >
          {/* Options */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-border bg-muted/50 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <Switch id="sameLocation" checked={sameLocation} onCheckedChange={setSameLocation} className="data-[state=checked]:bg-[#86d72f]" />
              <Label htmlFor="sameLocation" className="text-sm font-medium">
                Return to same location
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="airportShuttle" checked={airportShuttle} onCheckedChange={setAirportShuttle} className="data-[state=checked]:bg-[#86d72f]" />
              <Label htmlFor="airportShuttle" className="text-sm font-medium">
                Complimentary Airport Transfers
              </Label>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pick-up */}
              <fieldset className="rounded-2xl border border-border p-4 sm:p-5">
                <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-foreground">
                  <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-primary">
                    <MapPin size={13} aria-hidden />
                  </span>
                  Pick-up
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {renderField(byId("pickupLocation"), "col-span-2")}
                  {renderField(byId("pickupDate"))}
                  {renderField(byId("pickupTime"))}
                </div>
              </fieldset>

              {/* Return */}
              <fieldset className="rounded-2xl border border-border p-4 sm:p-5">
                <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-foreground">
                  <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-primary">
                    <CornerDownLeft size={13} aria-hidden />
                  </span>
                  Return
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {!sameLocation && renderField(byId("returnLocation"), "col-span-2")}
                  {renderField(byId("returnDate"))}
                  {renderField(byId("returnTime"))}
                  {sameLocation && (
                    <p className="flex items-center gap-2 text-[13px] text-muted-foreground col-span-2">
                      <MapPin size={14} className="shrink-0 text-[#4f9a0e]" aria-hidden />
                      You&apos;ll return the vehicle to the pick-up location.
                    </p>
                  )}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <fieldset>
                <legend className={labelStyles}>Driver age</legend>
                <div className="mt-2 inline-flex gap-2 rounded-xl bg-muted p-1">
                  {AGE_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex h-11 min-w-24 cursor-pointer items-center justify-center rounded-lg px-5 text-[15px] font-semibold text-neutral-600 transition-colors hover:text-neutral-900 has-[:checked]:bg-white has-[:checked]:text-neutral-900 has-[:checked]:shadow-sm has-[:checked]:ring-1 has-[:checked]:ring-[#86d72f] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#86d72f]"
                    >
                      <input type="radio" name="age" value={value} required className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Button
                type="submit"
                className="h-13 w-full rounded-xl bg-[#86d72f] px-10 text-base font-semibold text-neutral-900 shadow-[0_12px_26px_-10px_rgba(134,215,47,0.8)] transition hover:bg-[#78c428] motion-safe:hover:-translate-y-0.5 has-[>svg]:px-10 sm:w-auto"
              >
                Search Cars
                <Search />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
