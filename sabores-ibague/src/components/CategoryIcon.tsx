import type { Category } from "@/lib/queries";

// A few of the stored emoji render as the wrong country's version of the
// dish: 🫔 is a Mexican husk-wrapped tamale (pointed at both ends) instead
// of the round, banana-leaf-wrapped Colombian one; 🍟 is plain fast-food
// fries instead of a plate piled with chopped sausage and melted cheese;
// 🥟 is a pale dumpling instead of a golden fried empanada. Those three
// get a small hand-drawn icon instead — every other category still shows
// its emoji straight from the database.

function TamalIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="19" r="9.5" fill="var(--tamal-leaf)" />
      <path
        d="M12.2 9.6c0-2.4 1.7-4.1 3.8-4.1s3.8 1.7 3.8 4.1c0 2.1-1.7 3.4-3.8 3.4s-3.8-1.3-3.8-3.4z"
        fill="var(--tamal-leaf)"
      />
      <path
        d="M14.6 5.6c.5-.9 1.4-1.4 1.4-1.4s.9.5 1.4 1.4"
        fill="none"
        stroke="var(--tamal-tie)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M7.3 16.6c3-1.1 14.4-1.1 17.4 0M7 20.8c3.2-1.2 14.8-1.2 18 0M8.4 24.7c2.6-1 12.2-1 14.8 0"
        fill="none"
        stroke="var(--tamal-leaf-deep)"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function SalchipapasIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      {/* paper tray */}
      <path
        d="M6 15 L26 15 L23.6 27.2c-.16.9-.94 1.5-1.84 1.5H10.24c-.9 0-1.68-.6-1.84-1.5z"
        fill="var(--papas-tray)"
      />
      {/* fries, fanned out of the tray */}
      <rect x="9.5" y="8.5" width="2.5" height="13.5" rx="1.2" fill="var(--papas-gold)" transform="rotate(-11 10.75 15.25)" />
      <rect x="13.1" y="5.5" width="2.5" height="16.5" rx="1.2" fill="var(--papas-gold-deep)" />
      <rect x="16.5" y="5" width="2.5" height="17" rx="1.2" fill="var(--papas-gold)" />
      <rect x="20" y="7.5" width="2.5" height="14.5" rx="1.2" fill="var(--papas-gold-deep)" transform="rotate(11 21.25 14.75)" />
      {/* chopped sausage on top */}
      <circle cx="12.5" cy="17" r="1.6" fill="var(--salchicha)" />
      <circle cx="19" cy="16.2" r="1.6" fill="var(--salchicha)" />
      <circle cx="15.5" cy="20" r="1.6" fill="var(--salchicha)" />
      {/* melted cheese drizzle */}
      <path
        d="M8.3 18.5c3 2.1 12.4 2.1 15.4 0"
        fill="none"
        stroke="var(--queso)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.6 22c2.6 1.5 10 1.5 12.8 0"
        fill="none"
        stroke="var(--queso)"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

function EmpanadaIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      {/* golden fried dough, folded in half — the flat edge is the
          crimped seam, the curve is the fold */}
      <path d="M6 13a10 10 0 0 0 20 0z" fill="var(--empanada-gold)" />
      {/* fork-pressed crimp along the seam */}
      <g stroke="var(--empanada-gold-deep)" strokeWidth="1.1" strokeLinecap="round" fill="none">
        <path d="M7.6 13c.6 1.1 1.5 1.1 2.1 0" />
        <path d="M11.4 13c.6 1.4 1.5 1.4 2.1 0" />
        <path d="M15.2 13c.6 1.6 1.5 1.6 2.1 0" />
        <path d="M19 13c.6 1.4 1.5 1.4 2.1 0" />
        <path d="M22.8 13c.6 1.1 1.5 1.1 2.1 0" />
      </g>
      {/* steam vent for texture */}
      <path
        d="M12.5 18.5c1.6-1.1 5.4-1.1 7 0"
        fill="none"
        stroke="var(--empanada-gold-deep)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function CategoryIcon({
  category,
  iconClassName,
  emojiClassName,
}: {
  category: Category;
  iconClassName: string;
  emojiClassName?: string;
}) {
  switch (category.slug) {
    case "tamales":
      return <TamalIcon className={iconClassName} />;
    case "salchipapas":
      return <SalchipapasIcon className={iconClassName} />;
    case "empanadas":
      return <EmpanadaIcon className={iconClassName} />;
    default:
      return (
        <span className={emojiClassName} aria-hidden="true">
          {category.emoji}
        </span>
      );
  }
}
