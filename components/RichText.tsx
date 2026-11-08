import { Fragment } from "react";
import { parseRichText, type ListBlock } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|\*[^*\s][^*]*?\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function List({ block, depth = 0 }: { block: ListBlock; depth?: number }) {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag className={cn("space-y-2 pl-5", block.ordered ? "list-decimal" : depth === 0 ? "list-disc" : "list-[circle]", depth > 0 && "mt-2")}>
      {block.items.map((item, i) => (
        <li key={i} className="pl-1 marker:text-primary">
          <Inline text={item.text} />
          {item.children.map((child, j) => (
            <List key={j} block={child} depth={depth + 1} />
          ))}
        </li>
      ))}
    </Tag>
  );
}

/** Renders the plain-text markup from `lib/rich-text`. Headings get ids so sections can be linked to. */
export default function RichText({ source, className, headings = true }: { source: string; className?: string; headings?: boolean }) {
  const blocks = parseRichText(source);
  return (
    <div className={cn("space-y-4 text-[14.5px] leading-7 text-muted-foreground", className)}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return headings ? (
              <h2 key={i} id={block.id} className="scroll-mt-28 border-b border-border pb-3 pt-8 text-2xl font-bold tracking-tight text-foreground first:pt-0">
                {block.text}
              </h2>
            ) : null;
          case "h3":
            return (
              <h3 key={i} id={block.id} className="scroll-mt-28 pt-3 text-base font-semibold text-foreground">
                {block.text}
              </h3>
            );
          case "quote":
            return (
              <div key={i} role="note" className="rounded-xl border border-primary/40 bg-primary/10 px-5 py-4 text-foreground">
                {block.lines.map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1.5" : undefined}>
                    <Inline text={line} />
                  </p>
                ))}
              </div>
            );
          case "list":
            return <List key={i} block={block} />;
          default:
            return (
              <p key={i}>
                <Inline text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
