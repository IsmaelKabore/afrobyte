"use client";

import { useEffect, useState, type FormEvent } from "react";

/**
 * Candidatures AfroBite. Le formulaire envoie directement à l'API Carrières du
 * dashboard (mêmes collections que la page Recrutement) : la candidature y apparaît
 * aussitôt, CV compris. L'API n'accepte ces envois que depuis afrobite.app.
 */
const API = process.env.NEXT_PUBLIC_CAREERS_API_URL || "https://dashboard.afrobite.app/api/careers";

type Job = { id: string; title: string; contractType: string; location: string; workTime: string; missions: string; profile: string; offer: string };

const FALLBACK_ROLES: Record<string, string> = {
  agent_terrain: "Agent terrain (inscriptions, restaurants)",
  livreur: "Livreur",
  call_center: "Call center et service client",
  commercial_restaurants: "Commercial restaurants",
  createur_contenu: "Créateur de contenu vidéo",
  marketing: "Marketing et réseaux sociaux",
  developpeur: "Développeur",
  autre: "Autre",
};

export function CareersForm() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>(FALLBACK_ROLES);
  const [jobId, setJobId] = useState("spontaneous");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [state, setState] = useState<{ sending: boolean; ok: boolean; message: string }>({ sending: false, ok: false, message: "" });

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.jobs)) setJobs(d.jobs);
        if (d.spontaneousRoles && typeof d.spontaneousRoles === "object") setRoles(d.spontaneousRoles);
      })
      .catch(() => undefined);
    try {
      const wanted = new URLSearchParams(window.location.search).get("poste");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- poste présélectionné par le lien, lu côté client
      if (wanted) setJobId(wanted);
    } catch {
      /* pas de poste présélectionné */
    }
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("startedAt", String(startedAt));
    setState({ sending: true, ok: false, message: "" });
    try {
      const res = await fetch(API, { method: "POST", body: data });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || "Envoi impossible. Réessayez dans un instant.");
      form.reset();
      setJobId("spontaneous");
      setStartedAt(Date.now());
      setState({ sending: false, ok: true, message: "Candidature reçue. L'équipe AfroBite vous contactera par téléphone ou WhatsApp." });
    } catch (err) {
      setState({ sending: false, ok: false, message: err instanceof Error ? err.message : "Envoi impossible." });
    }
  };

  return (
    <>
      {jobs.length > 0 && (
        <>
          <h2>Postes ouverts</h2>
          <div className="card-grid">
            {jobs.map((j) => (
              <div key={j.id} className="info-card">
                <h3>{j.title}</h3>
                <p>{[j.contractType, j.location, j.workTime === "temps_partiel" ? "Temps partiel" : "Temps plein"].filter(Boolean).join(" · ")}</p>
                {j.missions && <p style={{ marginTop: "0.75rem", whiteSpace: "pre-line" }}>{j.missions}</p>}
                <p style={{ marginTop: "0.75rem" }}>
                  <a href="#candidature" onClick={() => setJobId(j.id)}>Postuler à ce poste →</a>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 id="candidature">Votre candidature</h2>
      <p>Le téléphone est notre moyen de contact principal. Le CV est facultatif : votre expérience et votre disponibilité comptent.</p>
      <form className="contact-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="cr-job">Poste *</label>
          <select id="cr-job" name="jobId" value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="spontaneous">Candidature spontanée</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
        {jobId === "spontaneous" && (
          <div className="form-group">
            <label htmlFor="cr-role">Rôle qui vous intéresse *</label>
            <select id="cr-role" name="desiredRole" required defaultValue="">
              <option value="" disabled>Choisir un rôle</option>
              {Object.entries(roles).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="cr-name">Nom et prénoms *</label>
          <input id="cr-name" name="fullName" required autoComplete="name" />
        </div>
        <div className="form-group">
          <label htmlFor="cr-phone">Téléphone / WhatsApp *</label>
          <input id="cr-phone" name="phone" type="tel" required autoComplete="tel" placeholder="Ex. 70 00 00 00" />
        </div>
        <div className="form-group">
          <label htmlFor="cr-email">E-mail (facultatif)</label>
          <input id="cr-email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="cr-district">Quartier *</label>
          <input id="cr-district" name="district" required placeholder="Ex. Ouaga 2000, Pissy, Tampouy" />
        </div>
        <div className="form-group">
          <label htmlFor="cr-worktime">Temps de travail *</label>
          <select id="cr-worktime" name="workTime" required defaultValue="temps_plein">
            <option value="temps_plein">Temps plein</option>
            <option value="temps_partiel">Temps partiel</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cr-days">Jours et heures de disponibilité *</label>
          <input id="cr-days" name="availabilityDays" required placeholder="Ex. du lundi au samedi, de 10 h à 18 h" />
        </div>
        <div className="form-group">
          <label htmlFor="cr-exp">Votre expérience</label>
          <textarea id="cr-exp" name="experience" placeholder="Obligatoire si vous n'envoyez pas de CV (au moins une phrase)." />
        </div>
        <div className="form-group">
          <label htmlFor="cr-cv">CV (facultatif · PDF, DOC ou DOCX · 5 Mo maximum)</label>
          <input id="cr-cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
        </div>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
        <button type="submit" className="btn btn-primary btn-block" disabled={state.sending}>
          {state.sending ? "Envoi…" : "Envoyer ma candidature"}
        </button>
        {state.message && (
          <p className="form-note" role="status" style={{ color: state.ok ? "var(--ink)" : "#b42318", fontWeight: 600 }}>{state.message}</p>
        )}
      </form>
    </>
  );
}
