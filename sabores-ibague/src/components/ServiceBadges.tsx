const SERVICES = [
  { key: "has_dine_in", icon: "🍽️", label: "Comer en el sitio" },
  { key: "has_takeout", icon: "🥡", label: "Para llevar" },
  { key: "has_delivery", icon: "🛵", label: "Domicilio" },
] as const;

/**
 * A small row of pills showing what a restaurant offers — dine-in,
 * takeout, delivery — so a shopper knows before they ever click WhatsApp,
 * not after. Renders nothing if somehow none apply.
 */
export function ServiceBadges({
  restaurant,
}: {
  restaurant: {
    has_dine_in: boolean;
    has_takeout: boolean;
    has_delivery: boolean;
  };
}) {
  const active = SERVICES.filter((s) => restaurant[s.key]);
  if (active.length === 0) return null;

  return (
    <div className="service-badges">
      {active.map((s) => (
        <span className="service-badge" key={s.key}>
          <span aria-hidden="true">{s.icon}</span> {s.label}
        </span>
      ))}
    </div>
  );
}
