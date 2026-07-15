import { MARQUEE_ITEMS } from "@/lib/site";

/** Bandeau défilant des plats — doublé pour une boucle sans couture. */
export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee" data-nav-dark aria-hidden="true">
      <div className="marquee-track">
        {items.map((word, i) => (
          <span className="item" key={`${word}-${i}`}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
