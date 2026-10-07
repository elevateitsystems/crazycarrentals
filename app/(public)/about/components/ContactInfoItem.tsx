import type { ContactInfo } from "@/lib/contact";

export default function ContactInfoItem({ icon: Icon, label, value, caption, href }: ContactInfo) {
  const valueClass = "mt-1 block text-[15px] font-semibold leading-5 text-foreground";

  return (
    <li className="flex gap-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={17} strokeWidth={1.5} />
      </span>

      <div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {href ? (
          <a href={href} className={`${valueClass} transition hover:text-primary`}>
            {value}
          </a>
        ) : (
          <span className={valueClass}>{value}</span>
        )}
        <p className="mt-1 text-xs text-muted-foreground/70">{caption}</p>
      </div>
    </li>
  );
}