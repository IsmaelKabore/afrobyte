"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/icon";

type FaqItem = { q: string; a: ReactNode; plain: string };

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Comment passer une commande ?",
    a: "Téléchargez l'application AfroBite, parcourez les restaurants, ajoutez vos plats au panier, choisissez livraison ou retrait, payez via Orange Money, Wave ou un autre moyen disponible, puis confirmez. Vous recevrez des notifications à chaque étape.",
    plain:
      "commander commande passer téléchargez application parcourez restaurants panier livraison retrait payer orange money wave",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "AfroBite accepte Orange Money, Wave et d'autres services de paiement mobile autorisés. Les transactions sont sécurisées par nos partenaires de paiement ; nous ne stockons pas vos codes PIN.",
    plain: "paiement moyens orange money wave mobile pin sécurisé transaction",
  },
  {
    q: "Combien de temps dure une livraison ?",
    a: "Le délai dépend du restaurant, de la distance et du volume de commandes. Une estimation est affichée au moment de la commande. Comptez généralement 30 à 60 minutes, parfois plus aux heures de pointe ou en cas d'intempéries.",
    plain: "livraison temps délai durée estimation minutes heures pointe",
  },
  {
    q: "Puis-je annuler ma commande ?",
    a: "L'annulation est possible tant que le restaurant n'a pas commencé la préparation. Contactez-nous rapidement ou utilisez l'option d'annulation dans l'application si elle est disponible.",
    plain: "annuler annulation commande préparation option",
  },
  {
    q: "Ma commande est incorrecte ou incomplète",
    a: (
      <>
        Contactez-nous immédiatement à{" "}
        <a href="mailto:afrobyteapp@gmail.com">afrobyteapp@gmail.com</a> avec votre numéro de
        commande. Nous travaillerons avec le restaurant pour trouver une solution (remboursement ou
        correction selon le cas).
      </>
    ),
    plain: "commande incorrecte incomplète erreur remboursement correction problème",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Dans l'application, ouvrez l'onglet Activité ou le suivi de commande. Vous verrez les étapes : acceptation, préparation, en route et confirmation de réception. Des notifications push vous tiennent informé.",
    plain: "suivre suivi commande activité étapes notifications",
  },
  {
    q: "Où la livraison est-elle disponible ?",
    a: (
      <>
        La livraison AfroBite est proposée jusqu'à <strong>25 km</strong> du restaurant choisi.
        Saisissez votre adresse dans l'application : seuls les restaurants qui peuvent vous livrer
        s'affichent, avec le tarif au kilomètre.
      </>
    ),
    plain: "livraison disponible zone 25 km adresse tarif kilomètre",
  },
  {
    q: "Mes paiements sont-ils sécurisés ?",
    a: "Oui. Les paiements passent par des prestataires de confiance (Orange Money, Wave, etc.). AfroBite ne conserve pas vos identifiants de paiement complets. Toutes les transactions sont chiffrées.",
    plain: "paiement sécurisé chiffré prestataires confiance identifiants",
  },
  {
    q: "Devenir restaurant partenaire",
    a: (
      <>
        Consultez la page <a href="/partenaire">Partenaire</a> ou écrivez à{" "}
        <a href="mailto:afrobyteapp@gmail.com">afrobyteapp@gmail.com</a> avec l'objet « Partenariat
        restaurant ».
      </>
    ),
    plain: "partenaire restaurant devenir partenariat inscription",
  },
  {
    q: "J'ai une réclamation",
    a: (
      <>
        Chaque réclamation est prise au sérieux. Envoyez les détails (numéro de commande, date,
        description) à <a href="mailto:afrobyteapp@gmail.com">afrobyteapp@gmail.com</a>. Nous vous
        répondrons dans les meilleurs délais.
      </>
    ),
    plain: "réclamation plainte problème détails",
  },
];

export function Faq() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const q = query.toLowerCase().trim();

  return (
    <div className="faq-section">
      <h2>Questions fréquentes</h2>
      <input
        type="search"
        className="faq-search"
        placeholder="Rechercher dans la FAQ…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Rechercher dans la FAQ"
      />
      {FAQ_ITEMS.map((item, i) => {
        const match = !q || (item.q + " " + item.plain).toLowerCase().includes(q);
        if (!match) return null;
        const isOpen = openIndex === i;
        return (
          <div className={isOpen ? "faq-accordion is-open" : "faq-accordion"} key={item.q}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {item.q}
              <Icon icon={ChevronDown} size={18} className="faq-chevron" />
            </button>
            {isOpen ? <div className="faq-answer">{item.a}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
