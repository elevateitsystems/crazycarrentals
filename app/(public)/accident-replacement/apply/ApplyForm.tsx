"use client";

import { useState } from "react";
import { Notice } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CONTACT_EMAIL, openMail } from "@/lib/mailto";
import { cn } from "@/lib/utils";
import FormField, { inputStyles, labelStyles } from "../../book/[id]/components/FormField";

const CHOICES = ["Yes", "No", "Unsure"] as const;

/** Accessible Yes / No / Unsure radio group (native radios, so keyboard and screen readers work as expected). */
function ChoiceGroup({ name, legend }: { name: string; legend: string }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {CHOICES.map((choice) => (
          <label
            key={choice}
            className="flex h-11 min-w-24 cursor-pointer items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-medium transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/15 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <input type="radio" name={name} value={choice} required className="sr-only" />
            {choice}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ApplyForm() {
  const [sent, setSent] = useState(false);
  // The not-at-fault questions only apply when the applicant says they were not at fault.
  const [atFault, setAtFault] = useState("");

  // No application endpoint exists in the API; the application is composed as an email to the team.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    openMail(`Accident replacement application — ${v.name}`, {
      Name: v.name,
      Phone: v.phone,
      Email: v.email,
      "Accident date": v.accidentDate,
      "At fault?": v.atFault,
      ...(v.atFault === "No"
        ? { "Has the other driver's details?": v.otherDriverDetails, "Other driver has car insurance?": v.otherDriverInsured }
        : {}),
      "Vehicle being repaired": v.vehicle,
      Details: v.details,
    });
    setSent(true);
  };

  return (
    <Card className="gap-0 rounded-3xl border-border py-0 shadow-sm">
      <CardContent className="p-7">
        <h2 className="text-lg font-bold tracking-tight">Your application</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Submitting opens your email app with this application ready to send to our team.
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <FormField id="name" label="Full name" required className="h-11" />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="phone" label="Phone" type="tel" required className="h-11" />
            <FormField id="email" label="Email" type="email" required className="h-11" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="accidentDate" label="Accident date" type="date" required max={new Date().toISOString().slice(0, 10)} className="h-11" />
            <FormField id="vehicle" label="Your vehicle (make / model)" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="atFault" className={labelStyles}>Were you at fault?</Label>
            <select id="atFault" name="atFault" required value={atFault} onChange={(e) => setAtFault(e.target.value)} className={cn(inputStyles, "h-11 w-full border outline-none")}>
              <option value="" disabled>Select…</option>
              <option>No</option>
              <option>Yes</option>
              <option>Not sure</option>
            </select>
          </div>
          {atFault === "No" && (
            <section aria-labelledby="not-at-fault-heading" className="grid gap-5 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <h3 id="not-at-fault-heading" className="text-base font-bold tracking-tight">Not at Fault Accident</h3>
              <ChoiceGroup name="otherDriverDetails" legend="Do you have the other driver's details?" />
              <ChoiceGroup name="otherDriverInsured" legend="Do they have car insurance?" />
            </section>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="details" className={labelStyles}>What happened?</Label>
            <textarea id="details" name="details" required className={cn(inputStyles, "h-32 w-full resize-none border py-3 outline-none")} />
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl text-[13px] font-semibold">Submit application</Button>
          {sent && <Notice kind="info">Your email app should have opened. If it didn&apos;t, send the details to {CONTACT_EMAIL}.</Notice>}
        </form>
      </CardContent>
    </Card>
  );
}
