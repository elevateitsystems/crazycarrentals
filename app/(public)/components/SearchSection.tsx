"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RENTAL_ADDRESS } from "@/lib/locations";
import { cn } from "@/lib/utils";

const fields = [
  { id: "pickupLocation", label: "Pickup Location", type: "text", placeholder: "e.g. 201 Wellington Street, Launceston", defaultValue: RENTAL_ADDRESS },
  { id: "returnLocation", label: "Return Location", type: "text", placeholder: "e.g. 201 Wellington Street, Launceston" },
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

const labelStyles = "text-xs font-semibold uppercase leading-4 tracking-wide text-neutral-600";

const inputStyles =
  "h-12 rounded-xl border-[#e3e3de] bg-[#fafaf8] px-3.5 text-[15px] shadow-none placeholder:text-neutral-400 md:text-[15px]";

// Native pickers keep their format hint (mm/dd/yyyy, --:-- --) and icon visible; the hint is muted while the field is empty.
const pickerStyles =
  "cursor-pointer [&:invalid]:text-neutral-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100";

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

  return (
    <section className="bg-[#f5f5f1] pb-16 pt-16 sm:pt-20">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-neutral-900 sm:text-[2.8rem]">
            Ready to hit the road?
          </h2>
          <p className="mt-4 text-base text-neutral-500 sm:text-lg">
            Enter your details below to find available vehicles.
          </p>
        </div>

        <Card className="mt-10 gap-0 rounded-3xl border-0 py-0 shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4">
                  <Switch
                    id="sameLocation"
                    checked={sameLocation}
                    onCheckedChange={setSameLocation}
                    className="origin-left scale-[1.2] data-[state=checked]:bg-[#86d72f]"
                  />
                  <Label htmlFor="sameLocation" className="text-sm font-medium">
                    Return to same location
                  </Label>
                </div>

                <div className="flex items-center gap-4">
                  <Switch
                    id="airportShuttle"
                    checked={airportShuttle}
                    onCheckedChange={setAirportShuttle}
                    className="origin-left scale-[1.2] data-[state=checked]:bg-[#86d72f]"
                  />
                  <Label htmlFor="airportShuttle" className="text-sm font-medium">
                    Airport Shuttle
                  </Label>
                </div>
              </div>

              <div className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {fields.filter((f) => f.id !== "returnLocation" || !sameLocation).map((f) => (
                  <div key={f.id} className={cn("flex flex-col gap-2", f.type === "text" && "xl:col-span-2")}>
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
                ))}
              </div>

              <fieldset className="mt-6">
                <legend className={labelStyles}>Driver age</legend>
                <div className="mt-2 flex gap-3">
                  {AGE_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex h-12 min-w-28 cursor-pointer items-center justify-center rounded-xl border border-[#e3e3de] bg-[#fafaf8] px-6 text-[15px] font-semibold text-neutral-700 transition-colors hover:border-[#86d72f] has-[:checked]:border-[#86d72f] has-[:checked]:bg-[#86d72f]/15 has-[:checked]:text-neutral-900 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#86d72f]"
                    >
                      <input type="radio" name="age" value={value} required className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="h-13 w-full rounded-xl bg-[#86d72f] px-10 text-base font-semibold text-neutral-900 hover:bg-[#78c428] has-[>svg]:px-10 sm:w-auto"
                >
                  Search Cars
                  <Search />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}