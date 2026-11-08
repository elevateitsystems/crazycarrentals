"use client";

import { useState } from "react";
import { Notice } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QUESTIONS, type EligibilityAnswers } from "@/lib/eligibility";
import { CONTACT_EMAIL, openMail } from "@/lib/mailto";
import { cn } from "@/lib/utils";
import FormField, { inputStyles, labelStyles } from "../../book/[id]/components/FormField";

const label = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

export default function ApplyForm({ eligibility }: { eligibility: EligibilityAnswers }) {
  const [sent, setSent] = useState(false);

  // No application endpoint exists in the API; the application is composed as an email to the team.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    openMail(`Accident replacement application — ${v.name}`, {
      Name: v.name,
      Phone: v.phone,
      Email: v.email,
      "Accident date": v.accidentDate,
      [QUESTIONS.atFault]: label(eligibility.atFault),
      [QUESTIONS.hasDriverDetails]: label(eligibility.hasDriverDetails),
      [QUESTIONS.driverInsured]: label(eligibility.driverInsured),
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
