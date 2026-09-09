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
        d="M5 16.5 L27 16.5 L24 29c-.2 1-1 1.7-2 1.7H10c-1 0-1.8-.7-2-1.7z"
        fill="var(--papas-tray)"
      />
      {/* a bold mound of fries — three wide wedges instead of thin
          strips, so the shape still reads clearly this small */}
      <path d="M8.5 17 L11 4.5 L13.5 17 Z" fill="var(--papas-gold)" />
      <path d="M13 17 L15.8 3 L18.5 17 Z" fill="var(--papas-gold-deep)" />
      <path d="M18 17 L20.5 5 L23 17 Z" fill="var(--papas-gold)" />
      {/* chopped sausage on top */}
      <circle cx="12" cy="19" r="2.3" fill="var(--salchicha)" />
      <circle cx="19" cy="18.3" r="2.3" fill="var(--salchicha)" />
      <circle cx="15.3" cy="22.3" r="2.3" fill="var(--salchicha)" />
      {/* melted cheese drizzle */}
      <path
        d="M7.5 20c3.6 2.7 14.8 2.7 18 0"
        fill="none"
        stroke="var(--queso)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmpanadaIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      {/* golden fried dough, folded in half — drawn resting flat-side
          down like a pastry on a plate: a tall dome on top, the
          crimped seam along the bottom edge */}
      <path d="M4 27 Q4 7 16 7 Q28 7 28 27 Z" fill="var(--empanada-gold)" />
      {/* fork-pressed crimp along the seam */}
      <g stroke="var(--empanada-gold-deep)" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M5.8 27c.7 1.7 1.9 1.7 2.6 0" />
        <path d="M11 27c.7 1.9 1.9 1.9 2.6 0" />
        <path d="M16.2 27c.7 2.1 1.9 2.1 2.6 0" />
        <path d="M21.4 27c.7 1.9 1.9 1.9 2.6 0" />
        <path d="M26 27c.5 1.2 1.3 1.2 1.8 0" />
      </g>
      {/* steam vent for texture */}
      <path
        d="M10.5 16c3-2 8-2 11 0"
        fill="none"
        stroke="var(--empanada-gold-deep)"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.5"
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
