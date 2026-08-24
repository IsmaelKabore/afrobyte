# 🔴 Panne afrobite.app — le domaine ne répond plus (deep links vidéo cassés)

> **Pour :** l'équipe web/infra AfroBite
> **Priorité :** haute — bloque le partage de vidéos ET l'association des apps
> **Nature :** configuration **domaine / Vercel** — **PAS un bug de code**

---

## 🧭 TL;DR

`afrobite.app` **ne sert plus rien** : le DNS résout vers une IP Vercel qui **ne répond à aucune connexion** (timeout total, HTTPS et HTTP), depuis plusieurs réseaux. Conséquence : la page de partage `/v/`, les fichiers d'association (`apple-app-site-association`, `assetlinks.json`) et donc **les deep links vidéo** sont tous injoignables.

**Le code est bon.** Le domaine est simplement **mal rattaché côté Vercel** (probablement resté sur l'ancien projet après la migration Next 16). **Fix ≈ 10 min** : rattacher le domaine au bon projet Vercel + poser les enregistrements DNS que Vercel affiche + attendre le certificat.

---

## 🩺 Symptômes observés

- Safari : **« Safari couldn't open the page because the server stopped responding »**.
- Un lien vidéo partagé ouvre l'app une fraction de seconde puis retombe sur le web → erreur.
- **Aucune** page de `https://afrobite.app` ne charge (même l'accueil).

## 🔬 Diagnostic (preuve)

```bash
$ nslookup afrobite.app
afrobite.app  ->  216.198.79.1          # apex ET www pointent là

$ curl -v https://afrobite.app
*  Trying 216.198.79.1:443...
*  Connection timed out after 12000 ms  # aucune réponse TCP (443 ET 80)
```

Le domaine **résout**, mais l'IP **n'accepte aucune connexion**. `216.198.79.1` est une IP **Vercel** → le DNS pointe vers Vercel, mais **Vercel ne sert pas ce domaine** (non rattaché/vérifié sur le bon projet, ou enregistrement DNS incorrect).

> ⚠️ **Piège `.app`** : le TLD `.app` est **HSTS-preload → HTTPS obligatoire**. Sans certificat SSL valide émis par Vercel, aucun navigateur n'accède au site. Le certificat n'est émis **que** si le domaine est correctement vérifié dans Vercel.

## ✅ Ce qui N'EST PAS en cause (ne perds pas de temps dessus)

| Élément | État |
|---|---|
| Page web `/v/[videoId]` + `.well-known/*` (branche `main`) | ✅ correct et à jour |
| App Flutter (intent-filters `autoVerify`, entitlement iOS, routing `_handleUri`) | ✅ correct |
| Identifiants (Android `com.afrobite.android`, iOS `346NS37T4Z.com.ismael.afrobyte`) | ✅ cohérents |

👉 **Tant que le domaine ne répond pas, rien de tout ça ne peut fonctionner.** On répare le domaine d'abord, le reste suit.

---

## 🛠️ La correction — pas à pas

### Étape 1 — Trouver sur quel projet Vercel le domaine est rattaché
1. Vercel → **regarde tous les projets** (il peut y en avoir un ancien « site statique » + le nouveau **Next 16**).
2. Ouvre chaque projet → **Settings → Domains** et repère lequel possède `afrobite.app`.
3. **Le domaine doit être sur le projet qui déploie la branche `main` du repo Next actuel** (celui avec la page `/v/`). S'il est resté sur l'**ancien** projet (migration Next 16) → c'est LA cause. Retire-le de l'ancien, ajoute-le au bon.

### Étape 2 — (Ré)ajouter / vérifier le domaine sur le BON projet
1. Bon projet → **Settings → Domains → Add** → `afrobite.app` **et** `www.afrobite.app`.
2. Vercel affiche alors le **statut** et **les enregistrements DNS exacts** à poser :
   - **« Valid Configuration »** → passe à l'Étape 4.
   - **« Invalid Configuration » / « Misconfigured »** → note les valeurs affichées (Étape 3).

### Étape 3 — Poser les enregistrements DNS (chez le registrar / gestionnaire DNS)
**Mets EXACTEMENT ce que le dashboard Vercel affiche.** Config typique Vercel :

| Type | Nom | Valeur (⚠️ utilise celle du dashboard Vercel) |
|---|---|---|
| `A` | `@` (apex `afrobite.app`) | l'IP indiquée par Vercel |
| `CNAME` | `www` | `cname.vercel-dns.com` |

- **Supprime** tout ancien enregistrement `A`/`CNAME` du apex qui ne correspond pas (l'actuel `216.198.79.1` ne répond pas → à remplacer par la valeur Vercel).
- Ne touche pas aux `MX` (emails) ni aux autres enregistrements non liés.

### Étape 4 — Attendre propagation + certificat
- Propagation DNS : quelques minutes à ~1 h.
- Vercel **émet automatiquement** le certificat SSL. Attends que le statut du domaine passe **« Valid Configuration »** avec le cert **Issued**.

### Étape 5 — Si le domaine est déjà « Valid » mais ça timeout encore
- **Deployments** : vérifie qu'un déploiement de `main` est bien en **« Ready »** (pas un build en **Error**). Si le dernier a échoué → corrige/​**Redeploy**.
- Vérifie que la **Production Branch = `main`** (Settings → Git).

---

## 🔎 Vérifier que c'est réparé

```bash
# 1) le domaine répond enfin (plus de timeout)
curl -sI https://afrobite.app
# attendu : HTTP/2 200

# 2) le fichier d'association iOS est bien servi (JSON, appID complet)
curl -s https://afrobite.app/.well-known/apple-app-site-association
# attendu : contient  "346NS37T4Z.com.ismael.afrobyte"  et les chemins /v/*, /video/*, /plat/*

# 3) l'association Android
curl -s https://afrobite.app/.well-known/assetlinks.json
# attendu : package "com.afrobite.android" + un SHA-256

# 4) la page de partage joue bien une vraie vidéo
#    (remplace VIDEO_ID par un vrai id de la collection Firestore `videos`)
curl -s -o /dev/null -w "%{http_code}\n" https://afrobite.app/v/VIDEO_ID
# attendu : 200
```

Puis, **sur un iPhone avec un build User à jour réinstallé** (iOS met l'AASA en cache **à l'installation** — un vieux build donnera un faux négatif) : ouvre un lien `https://afrobite.app/v/{id}` depuis Messages/Notes → doit ouvrir la **vidéo exacte dans l'app AfroBite**, jamais Resto/Livreur.

---

## 📌 Récap des couches (pour situer)

| Couche | État | Action |
|---|---|---|
| Domaine **afrobite.app** | 🔴 ne répond pas | **← À RÉPARER (ce doc)** |
| Web `/v/` + AASA/assetlinks (`main`) | ✅ ok | rien |
| App Flutter (deep links) | ✅ ok | rebuild + réinstall pour tester |

Une fois `https://afrobite.app` de retour en **200** et un build app frais installé, le deep-link fonctionne de bout en bout. Ensuite on construira la **couche data** (tracking partages/clics → base de recommandation) — elle n'existe pas encore.

---

*Questions ? Le diagnostic complet (DNS, curl, comparaison des branches, identifiants app/web) est disponible ; ping l'équipe.*
