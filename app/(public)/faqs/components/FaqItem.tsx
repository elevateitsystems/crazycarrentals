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
    <div className="rounded-lg border border-border bg-card">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex min-h-12.5 w-full items-center py-3 justify-between gap-4 rounded-xl px-5 text-left text-[13.5px] font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {question}
          <Icon size={14} className="shrink-0 text-primary" />
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
          <RichText source={answer} headings={false} className="px-5 pb-5 text-[13.5px] leading-6" />
        </div>
      </div>
    </div>
  );
}