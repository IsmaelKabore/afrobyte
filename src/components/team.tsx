"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Équipe AfroBite (page « À propos »), en tête de page.
 * Disposition : le président sur toute la largeur, puis deux cartes par ligne.
 * Titre en français, titre anglais en gris dessous ; bouton « English » par
 * carte pour lire la présentation en anglais.
 * Photo : déposer `public/team/<slug>.jpg` puis passer `photo: true` ; sans
 * photo, la carte affiche les initiales.
 */
export type TeamMember = {
  slug: string;
  name: string;
  roleFr: string;
  roleEn: string;
  bioFr: string;
  bioEn: string;
  photo?: boolean;
};

export const TEAM: TeamMember[] = [
  {
    slug: "sada-kabore",
    name: "Sada Kaboré",
    roleFr: "Président du conseil",
    roleEn: "Chairman of the Board",
    bioFr:
      "Fondateur et directeur général d’EKF (Établissement Kaboré et Frères) depuis 2007 : partenaire Gold HP et Canon au Burkina Faso, agréé HPE, Lenovo et Eaton, et partenaire de l’État pour le programme « Un étudiant, un ordinateur ». Il apporte à AfroBite près de vingt ans d’expérience à la tête d’une entreprise.",
    bioEn:
      "Founder and CEO of EKF (Établissement Kaboré et Frères) since 2007: HP and Canon Gold Partner in Burkina Faso, authorized HPE, Lenovo and Eaton partner, and government partner for the “One Student, One Computer” program. He brings nearly twenty years of business leadership to AfroBite.",
  },
  {
    slug: "ismael-kabore",
    name: "Ismaël Kaboré",
    photo: true,
    roleFr: "Fondateur & CEO",
    roleEn: "Founder & Chief Executive Officer",
    bioFr:
      "Diplômé d’un Bachelor of Arts en informatique (Computer Science) de l’Université de Californie à Berkeley, Ismaël a fondé AfroBite pour rendre la commande de repas simple et fiable au Burkina Faso. Il porte la vision, le produit et la technologie de l’entreprise.",
    bioEn:
      "With a Bachelor of Arts in Computer Science from UC Berkeley, Ismaël founded AfroBite to make ordering food simple and reliable in Burkina Faso. He leads the company’s vision, product and technology.",
  },
  {
    slug: "haphiz-ouarma",
    name: "Haphiz Ouarma",
    photo: true,
    roleFr: "Directeur technique",
    roleEn: "Chief Technology Officer (CTO)",
    bioFr:
      "Diplômé d’une licence en science des données et intelligence artificielle obtenue au Maroc, Haphiz dirige le développement et la mise en œuvre des applications AfroBite : client, restaurant, livreur et tableau de bord.",
    bioEn:
      "With a bachelor’s degree in data science and artificial intelligence from Morocco, Haphiz leads the development and delivery of AfroBite’s apps: customer, restaurant, driver and dashboard.",
  },
  {
    slug: "alan-ouele",
    name: "Alan Ouele",
    photo: true,
    roleFr: "Coordinateur général & cybersécurité",
    roleEn: "Chief of Staff & Cybersecurity Engineer",
    bioFr:
      "Diplômé d’une licence en génie informatique, spécialisé en cybersécurité et en master au Sénégal, Alan coordonne l’équipe et les projets, veille à la sécurité de la plateforme et participe au développement.",
    bioEn:
      "With a bachelor’s degree in computer engineering and a specialization in cybersecurity, now completing his master’s in Senegal, Alan coordinates the team and projects, safeguards the platform’s security and contributes to development.",
  },
  {
    slug: "khalil-sanou",
    name: "Khalil Sanou",
    roleFr: "Directeur des opérations & ingénierie terrain",
    roleEn: "Head of Operations & Field Engineering",
    bioFr:
      "Diplômé d’un master en informatique, Khalil représente AfroBite à Ouagadougou et dirige toute l’équipe terrain : installation et suivi des tablettes des restaurants, assistance technique aux partenaires et résolution des incidents.",
    bioEn:
      "With a master’s degree in computer science, Khalil represents AfroBite in Ouagadougou and leads the entire field team: restaurant tablet setup and monitoring, technical support for partners and incident resolution.",
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TeamCard({ m, featured }: { m: TeamMember; featured?: boolean }) {
  const [english, setEnglish] = useState(false);
  return (
    <article className={featured ? "team-card team-card--featured" : "team-card"}>
      <div className="team-photo">
        {m.photo ? (
          <Image src={`/team/${m.slug}.jpg`} alt={m.name} width={240} height={240} />
        ) : (
          <span aria-hidden="true">{initials(m.name)}</span>
        )}
      </div>
      <div className="team-body">
        <h3>{m.name}</h3>
        <p className="team-role">{m.roleFr}</p>
        <p className="team-role-en">{m.roleEn}</p>
        <p className="team-bio" lang={english ? "en" : "fr"}>
          {english ? m.bioEn : m.bioFr}
        </p>
        <button
          type="button"
          className="team-lang"
          onClick={() => setEnglish((v) => !v)}
          aria-pressed={english}
        >
          {english ? "Voir en français" : "See in English"}
        </button>
      </div>
    </article>
  );
}

export function TeamGrid({ members = TEAM }: { members?: TeamMember[] }) {
  return (
    <div className="team-grid">
      {members.map((m, i) => (
        <TeamCard key={m.slug} m={m} featured={i === 0} />
      ))}
    </div>
  );
}
