import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/reveal";
import { Icon } from "@/components/icon";

const PRINCIPLES: { num: string; heading: ReactNode; text: string }[] = [
  {
    num: "— 01",
    heading: (
      <>
        Que des <em>commandes payées.</em>
      </>
    ),
    text: "Chaque commande arrive en cuisine déjà payée, déjà confirmée. Pas de fausses commandes, pas de paiements échoués, pas de préparation gâchée.",
  },
  {
    num: "— 02",
    heading: (
      <>
        Zéro <em>commande fantôme.</em>
      </>
    ),
    text: "Clients vérifiés, adresses vérifiées, paiement vérifié. Si la commande est sur ton écran, elle est réelle, et elle est à toi.",
  },
  {
    num: "— 03",
    heading: (
      <>
        Contrôle <em>total.</em>
      </>
    ),
    text: "Accepte ou refuse d'un geste. Mets en pause quand c'est le rush. Reprends quand tu es prêt. Tu diriges ta cuisine — on s'occupe du reste.",
  },
];

export function Restaurants() {
  return (
    <section className="restaurant" id="restaurants">
      <div className="inner">
        <Reveal className="head">
          <div>
            <div className="section-head">
              <span className="num">04</span> Pour les restaurants
            </div>
            <h2 className="display">
              Fait pour <em>la cuisine,</em> pas pour le manuel.
            </h2>
          </div>
          <div className="lede">
            Calme. Simple. Construit autour de trois promesses qui comptent vraiment pour les
            restaurateurs.
          </div>
        </Reveal>

        <Reveal stagger className="principles">
          {PRINCIPLES.map((p) => (
            <RevealItem key={p.num} className="principle">
              <div className="p-num">{p.num}</div>
              <h3>{p.heading}</h3>
              <p>{p.text}</p>
              <div className="rule" />
            </RevealItem>
          ))}
        </Reveal>

        <div className="outro">
          <div className="quote">
            Le seul partenaire qui te laisse te concentrer sur la cuisine.
          </div>
          <a href="#cta" className="btn btn-dark">
            Devenir partenaire <Icon icon={ArrowRight} size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
