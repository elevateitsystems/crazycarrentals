"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const fields = [
  { id: "pickupLocation", label: "Pickup Location", type: "text", placeholder: "e.g. Hobart Airport", className: "text-center" },
  { id: "pickupDate", label: "Pickup Date", type: "date" },
  { id: "pickupTime", label: "Pickup Time", type: "time" },
  { id: "returnDate", label: "Return Date", type: "date" },
  { id: "returnTime", label: "Return Time", type: "time" },
];

const labelStyles = "text-[11px] font-medium uppercase leading-4 tracking-wide text-neutral-500";

const inputStyles =
  "h-[42px] rounded-lg border-[#ececE8] bg-[#fafaf8] px-3 text-[13.5px] shadow-none placeholder:text-neutral-400 md:text-[13.5px]";

// hides the native mm/dd/yyyy text and calendar icon until the field is focused or filled
const pickerStyles =
  "[&::-webkit-calendar-picker-indicator]:hidden [&:invalid:not(:focus)::-webkit-datetime-edit]:opacity-0";

export default function SearchSection() {
  const [sameLocation, setSameLocation] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle search
  };

  return (
    <section className="bg-[#f5f5f1] pb-14 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-0">
        <div className="text-center">
          <h2 className="text-[2.4rem] font-bold leading-[1.15] tracking-tight text-neutral-900">
            Ready to hit the road?
          </h2>
          <p className="mt-4 text-[15px] text-neutral-500">
            Enter your details below to find available vehicles.
          </p>
        </div>

        <Card className="mt-8.5 gap-0 rounded-2xl border-0 py-0 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <CardContent className="p-6.5">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-4">
                <Switch
                  id="sameLocation"
                  checked={sameLocation}
                  onCheckedChange={setSameLocation}
                  className="origin-left scale-[1.2] data-[state=checked]:bg-[#86d72f]"
                />
                <Label htmlFor="sameLocation" className="text-[12.5px] font-medium">
                  Return to same location
                </Label>
              </div>

              <div className="mt-[18px] grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {fields.map(({ id, label, type, placeholder, className }) => (
                  <div key={id} className="flex flex-col gap-1.5">
                    <Label htmlFor={id} className={labelStyles}>
                      {label}
                    </Label>
                    <Input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={placeholder}
                      required
                      onClick={type === "text" ? undefined : (e) => e.currentTarget.showPicker?.()}
                      className={`${inputStyles} ${type === "text" ? "" : pickerStyles} ${className ?? ""}`}
                    />
                  </div>
                ))}
              </div>

              {!sameLocation && (
                <div className="mt-3 flex max-w-xs flex-col gap-1.5">
                  <Label htmlFor="returnLocation" className={labelStyles}>
                    Return Location
                  </Label>
                  <Input
                    id="returnLocation"
                    name="returnLocation"
                    placeholder="e.g. Launceston Airport"
                    required
                    className={`${inputStyles} text-center`}
                  />
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <Button
                  type="submit"
                  className="h-[46px] rounded-xl bg-[#86d72f] px-8 text-sm font-semibold text-neutral-900 hover:bg-[#78c428] has-[>svg]:px-8"
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