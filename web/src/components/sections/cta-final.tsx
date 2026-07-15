import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { StoreBadges } from "@/components/store-badges";

export function CtaFinal() {
  return (
    <section className="cta-final" id="cta" data-nav-dark>
      <div className="inner">
        <Reveal>
          <div className="eyebrow">Disponible maintenant</div>
          <h2>
            Le futur du repas <em>tient dans ta poche.</em>
          </h2>
          <p>
            Télécharge AfroBite et profite de ta première livraison offerte. Ou inscris ton
            restaurant et commence à recevoir des commandes dès aujourd&apos;hui.
          </p>
          <div className="actions">
            <StoreBadges apps="client" />
            <Link
              href="/partenaire"
              className="btn btn-ghost"
              style={{ borderColor: "rgba(255,255,255,.3)", color: "#fff" }}
            >
              Devenir partenaire
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
