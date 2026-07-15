"use client";

import type { FormEvent } from "react";
import { BRAND } from "@/lib/site";

const SUBJECTS = [
  { value: "", label: "Choisir un sujet" },
  { value: "order", label: "Question sur une commande" },
  { value: "account", label: "Problème de compte" },
  { value: "payment", label: "Question de paiement" },
  { value: "delivery", label: "Problème de livraison" },
  { value: "technical", label: "Problème technique" },
  { value: "other", label: "Autre" },
];

/** Formulaire de contact — ouvre le client mail avec un message prérempli (comme le site d'origine). */
export function SupportForm() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const orderNum = String(fd.get("order-number") || "");
    const message = String(fd.get("message") || "");
    const subjectEl = form.elements.namedItem("subject") as HTMLSelectElement | null;
    const subjectLabel = subjectEl?.options[subjectEl.selectedIndex]?.text || "";

    const body = [
      "Message depuis le centre d'aide AfroBite",
      "",
      "Nom : " + name,
      "E-mail : " + email,
      orderNum ? "N° commande : " + orderNum : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href =
      `mailto:${BRAND.contactEmail}?subject=` +
      encodeURIComponent("[AfroBite] " + subjectLabel) +
      "&body=" +
      encodeURIComponent(body);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom complet *</label>
        <input type="text" id="name" name="name" required placeholder="Votre nom" />
      </div>
      <div className="form-group">
        <label htmlFor="email">E-mail *</label>
        <input type="email" id="email" name="email" required placeholder="votre.email@exemple.com" />
      </div>
      <div className="form-group">
        <label htmlFor="subject">Sujet *</label>
        <select id="subject" name="subject" required defaultValue="">
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="order-number">N° de commande (facultatif)</label>
        <input type="text" id="order-number" name="order-number" placeholder="Ex. #12345" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea id="message" name="message" required placeholder="Décrivez votre demande en détail…" />
      </div>
      <button type="submit" className="btn btn-primary btn-block">
        Envoyer le message
      </button>
      <p className="form-note">
        Vous pouvez aussi nous écrire directement à {BRAND.contactEmail}.
      </p>
    </form>
  );
}
