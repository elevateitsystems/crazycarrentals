// A tiny parser for the plain-text markup used by the legal pages and FAQs:
//   "## " heading, "### " sub-heading, "> " notice, "- " / "1. " list items (2 spaces per nesting level),
//   "**bold**" and "*italic*" inline. Any other non-empty line is a paragraph.

export type ListItem = { text: string; children: ListBlock[] };
export type ListBlock = { kind: "list"; ordered: boolean; items: ListItem[] };
export type Block =
  | { kind: "h2" | "h3"; id: string; text: string }
  | { kind: "p"; text: string }
  | { kind: "quote"; lines: string[] }
  | ListBlock;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ITEM = /^(\s*)(-|\d+\.)\s+(.*)$/;

export function parseRichText(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      blocks.push({ kind: "h3", id: slugify(text), text });
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      blocks.push({ kind: "h2", id: slugify(text), text });
    } else if (line.startsWith("> ")) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "quote") last.lines.push(line.slice(2));
      else blocks.push({ kind: "quote", lines: [line.slice(2)] });
    } else if (ITEM.test(line)) {
      // Collect the whole run of list lines and build the nested structure.
      const run: string[] = [];
      while (i < lines.length && ITEM.test(lines[i])) run.push(lines[i++]);
      i--;
      blocks.push(buildList(run));
    } else {
      blocks.push({ kind: "p", text: line.trim() });
    }
  }
  return blocks;
}

function buildList(run: string[]): ListBlock {
  const root: ListBlock = { kind: "list", ordered: false, items: [] };
  const stack: { level: number; list: ListBlock }[] = [{ level: 0, list: root }];

  run.forEach((line, index) => {
    const [, indent, marker, text] = line.match(ITEM)!;
    const level = Math.floor(indent.length / 2);
    const ordered = marker !== "-";

    if (index === 0) root.ordered = ordered;
    while (stack.length > 1 && stack[stack.length - 1].level > level) stack.pop();

    let top = stack[stack.length - 1];
    if (level > top.level) {
      const parent = top.list.items[top.list.items.length - 1];
      if (parent) {
        const child: ListBlock = { kind: "list", ordered, items: [] };
        parent.children.push(child);
        stack.push({ level, list: child });
        top = stack[stack.length - 1];
      }
    }
    top.list.items.push({ text, children: [] });
  });
  return root;
}

type HeadingBlock = Extract<Block, { kind: "h2" | "h3" }>;

export const sectionHeadings = (source: string) =>
  parseRichText(source).filter((b): b is HeadingBlock => b.kind === "h2");
