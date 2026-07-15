import { SiApple, SiGoogleplay } from "@icons-pack/react-simple-icons";
import { STORE_LINKS, type StoreKey } from "@/lib/site";

type Apps = "client" | "restaurant" | "delivery";

function Badge({
  storeKey,
  small,
  label,
  brand,
}: {
  storeKey: StoreKey;
  small: string;
  label: string;
  brand: "apple" | "play";
}) {
  const url = STORE_LINKS[storeKey];
  const inner = (
    <>
      {brand === "apple" ? (
        <SiApple color="currentColor" aria-hidden />
      ) : (
        <SiGoogleplay color="currentColor" aria-hidden />
      )}
      <span>
        <small>{small}</small>
        <strong>{label}</strong>
      </span>
    </>
  );

  if (url) {
    return (
      <a className="store-badge" href={url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <span className="store-badge store-soon" role="link" aria-disabled="true" title="Bientôt disponible">
      {inner}
    </span>
  );
}

/** Badges App Store / Google Play réutilisables — logos de marque via simple-icons. */
export function StoreBadges({ apps = "client", className }: { apps?: Apps; className?: string }) {
  return (
    <div className={className ? `store-badges ${className}` : "store-badges"}>
      <Badge storeKey={`${apps}-ios`} small="Télécharger sur" label="App Store" brand="apple" />
      <Badge storeKey={`${apps}-android`} small="Disponible sur" label="Google Play" brand="play" />
    </div>
  );
}
