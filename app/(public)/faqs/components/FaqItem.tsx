import { Minus, Plus } from "lucide-react";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
};

export default function FaqItem({ id, question, answer, open, onToggle }: Props) {
  const Icon = open ? Minus : Plus;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white transition duration-200",
        open ? "border-primary/60 shadow-[0_18px_40px_-26px_rgba(17,21,18,0.35)]" : "border-border hover:border-foreground/25"
      )}
    >
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-[15px] font-semibold leading-snug text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-6"
        >
          {question}
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
              open ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}
          >
            <Icon size={15} aria-hidden />
          </span>
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mx-5 border-t border-border pt-4 sm:mx-6">
            <RichText source={answer} headings={false} className="pb-5 text-[14.5px] leading-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
