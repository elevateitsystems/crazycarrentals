import { Loader2 } from "lucide-react"
import { cn } from "cn"

/** Compact inline spinner for buttons and small actions. Decorative: pair it with text or aria-busy. */
function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn("size-4 animate-spin motion-reduce:animate-none", className)} />
}

export { Spinner }
