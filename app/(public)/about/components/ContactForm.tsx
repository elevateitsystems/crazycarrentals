"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import FormField, { inputStyles, labelStyles } from "../../book/[slug]/components/FormField";

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    // TODO: send `values` to your API
    console.log(values);
    e.currentTarget.reset();
  };

  return (
    <Card className="gap-0 rounded-3xl border-border bg-card py-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <CardContent className="p-7">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Send us a message</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          We&apos;ll get back to you within one business day.
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
        </form>
      </CardContent>
    </Card>
  );
}