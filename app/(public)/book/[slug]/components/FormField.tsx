import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const inputStyles =
  "h-10 rounded-lg border-border bg-muted/50 px-3.5 text-xs shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/30";

export const labelStyles = "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground";

type FormFieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  wrapperClassName?: string;
};

export default function FormField({
  id,
  label,
  wrapperClassName,
  className,
  type = "text",
  children,
  ...props
}: FormFieldProps) {
  const isPicker = type === "date" || type === "time";

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      <Label htmlFor={id} className={labelStyles}>
        {label}
      </Label>
      {children ?? (
        <Input
          id={id}
          name={id}
          type={type}
          onClick={isPicker ? (e) => e.currentTarget.showPicker?.() : undefined}
          className={cn(inputStyles, className)}
          {...props}
        />
      )}
    </div>
  );
}