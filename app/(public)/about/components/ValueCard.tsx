import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
};

export default function ValueCard({ icon: Icon, title, description, index }: Props) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(17,21,18,0.04)] transition duration-300 hover:border-primary/50 hover:shadow-[0_18px_40px_-18px_rgba(17,21,18,0.25)] motion-safe:hover:-translate-y-1 sm:p-7">
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary shadow-[0_8px_18px_-8px_rgba(17,21,18,0.6)]">
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </span>
        {index && (
          <span aria-hidden className="text-sm font-semibold tabular-nums text-foreground/20">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className="mt-6 text-[17px] font-semibold leading-snug tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </li>
  );
}
