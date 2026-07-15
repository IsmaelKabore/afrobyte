"use client";

import { useState } from "react";
import { PhoneAppDemo } from "./phone-app-demo";
import { DELIVERY_DEMO, RESTAURANT_DEMO } from "@/lib/demos";

type Kind = "restaurant" | "livreur";

/** Sélecteur Restaurant / Livreur au-dessus de la démo téléphone. */
export function PartnerDemos() {
  const [kind, setKind] = useState<Kind>("restaurant");

  return (
    <div className="partner-demos">
      <div className="demo-switch" role="tablist" aria-label="Choisir la démo">
        <button
          type="button"
          role="tab"
          aria-selected={kind === "restaurant"}
          className={kind === "restaurant" ? "demo-switch-btn active" : "demo-switch-btn"}
          onClick={() => setKind("restaurant")}
        >
          Restaurant
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={kind === "livreur"}
          className={kind === "livreur" ? "demo-switch-btn active" : "demo-switch-btn"}
          onClick={() => setKind("livreur")}
        >
          Livreur
        </button>
      </div>

      <PhoneAppDemo key={kind} steps={kind === "restaurant" ? RESTAURANT_DEMO : DELIVERY_DEMO} />
    </div>
  );
}
