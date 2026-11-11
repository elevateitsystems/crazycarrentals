import type { ContactInfo } from "@/lib/contact";

export default function ContactInfoItem({ icon: Icon, label, value, caption, href }: ContactInfo) {
  const valueClass = "mt-1 block text-[15px] font-semibold leading-5 text-foreground";

  return (
    <li className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-[0_1px_2px_rgba(17,21,18,0.04)]">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon size={18} strokeWidth={1.75} aria-hidden />
      </span>

      <div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {href ? (
          <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${valueClass} transition hover:text-[#4f9a0e]`}>
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