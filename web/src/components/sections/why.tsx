import type { LucideIcon } from "lucide-react";
import { Eye, Gem, LifeBuoy, Zap } from "lucide-react";
import { Reveal, RevealItem } from "@/components/reveal";
import { Icon } from "@/components/icon";

const PILLARS: { icon: LucideIcon; title: string; text: string; num: string }[] = [
  {
    icon: Zap,
    title: "Incroyablement rapide.",
    text: "18 minutes en moyenne entre le geste et la porte. Notre IA choisit en temps réel la meilleure combinaison cuisine + coursier.",
    num: "— 01 —",
  },
  {
    icon: Eye,
    title: "Simple, enfin.",
    text: "Plus de menus à lire. Plus de décisions à prendre. Scrolle, et laisse tes yeux choisir.",
    num: "— 02 —",
  },
  {
    icon: Gem,
    title: "Discrètement premium.",
    text: "Chaque cuisine sélectionnée à la main. Chaque coursier formé. Chaque plat suivi du feu à la fourchette.",
    num: "— 03 —",
  },
  {
    icon: LifeBuoy,
    title: "Toujours présent.",
    text: "Si c'est en retard, c'est offert. Si c'est une erreur, on la corrige. Support en direct en moins de 60 secondes.",
    num: "— 04 —",
  },
];

export function Why() {
  return (
    <section className="why" data-nav-dark>
      <div className="container">
        <Reveal className="head">
          <div className="section-head" style={{ justifyContent: "center" }}>
            <span className="num">05</span> Pourquoi AfroBite
          </div>
          <h2 className="display">
            Conçu pour <em>notre façon de manger aujourd&apos;hui.</em>
          </h2>
        </Reveal>

        <Reveal stagger className="pillars">
          {PILLARS.map((p) => (
            <RevealItem key={p.num} className="pillar">
              <div className="icon">
                <Icon icon={p.icon} size={24} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="num">{p.num}</div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
