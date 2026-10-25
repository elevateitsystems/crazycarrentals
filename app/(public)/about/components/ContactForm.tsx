"use client";

import { useState } from "react";
import { CONTACT_EMAIL, openMail } from "@/lib/mailto";
import { Notice } from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FormField, { inputStyles, labelStyles } from "../../book/[id]/components/FormField";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  // There is no enquiry endpoint, so this opens the visitor's email app with the message filled in.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    openMail(`Website enquiry from ${v.firstName} ${v.lastName}`, {
      Name: `${v.firstName} ${v.lastName}`,
      Email: v.email,
      Phone: v.phone,
      Message: v.message,
    });
    setSent(true);
  };

  return (
    <Card className="gap-0 rounded-3xl border-border bg-card py-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <CardContent className="p-7">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Send us a message</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          Sending opens your email app with your message ready to go. We respond within one business day.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="firstName" label="First name" placeholder="e.g. Sarah" required className="h-11" />
            <FormField id="lastName" label="Last name" placeholder="e.g. Mitchell" required className="h-11" />
          </div>

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-11"
          />
          <FormField id="phone" label="Phone" type="tel" placeholder="04XX XXX XXX" className="h-11" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message" className={labelStyles}>
              Message
            </Label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="How can we help?"
              className={cn(inputStyles, "h-32 w-full resize-none border py-3 outline-none")}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-primary text-[13px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
          >
            Send Message
          </Button>
          {sent && <Notice kind="info">Your email app should have opened. If it didn&apos;t, email us at {CONTACT_EMAIL}.</Notice>}
        </form>
      </CardContent>
    </Card>
  );
}