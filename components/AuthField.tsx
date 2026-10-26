"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = Omit<React.ComponentProps<"input">, "id" | "name"> & {
  id: string;
  label: string;
  icon: LucideIcon;
};

/** Labelled input with a leading icon; password fields get a show/hide toggle. Name defaults to the id. */
export default function AuthField({ id, label, icon: Icon, type = "text", required = true, ...props }: Props) {
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Icon aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          name={id}
          type={isPassword && shown ? "text" : type}
          required={required}
          className={`h-12 rounded-xl border-border bg-muted/30 pl-10 text-[15px] shadow-none focus-visible:bg-background ${isPassword ? "pr-11" : "pr-3"}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
