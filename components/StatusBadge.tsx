import { enumLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const tone = (s: string) => {
  if (/(cancel|reject|fail|expire)/i.test(s)) return "bg-red-50 text-red-700 ring-red-600/20";
  if (/(confirm|complete|paid|active|available|success)/i.test(s)) return "bg-green-50 text-green-700 ring-green-600/20";
  if (/(pending|hold|await)/i.test(s)) return "bg-amber-50 text-amber-700 ring-amber-600/20";
  return "bg-neutral-50 text-neutral-600 ring-neutral-500/20";
};

export default function StatusBadge({ status, className }: { status?: unknown; className?: string }) {
  if (typeof status !== "string" || !status) return null;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset", tone(status), className)}>
      {enumLabel(status)}
    </span>
  );
}
