import Link from "next/link";
import type { ReactNode } from "react";

// Renders the lightweight markup used in src/lib/guides.ts:
//   [link text](/path)  -> an internal <Link>
//   lines starting "- " -> a bulleted list (when every line of a block does)
// Anything else is a plain paragraph.

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      <Link key={`${start}-${href}`} href={href}>
        {label}
      </Link>
    );
    last = start + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function GuideBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul>
        {lines.map((line, i) => (
          <li key={i}>{inline(line.slice(2))}</li>
        ))}
      </ul>
    );
  }
  return <p>{inline(text)}</p>;
}
