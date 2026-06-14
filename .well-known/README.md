# Deep Links — fichiers de propriété

Ces 2 fichiers permettent aux apps iOS et Android d'AfroBite d'intercepter
les liens `https://afrobite.app/video/{id}` au lieu d'ouvrir le navigateur
(comportement "comme Instagram/TikTok").

Tant que les valeurs `REPLACE_ME_*` ne sont pas remplies, **les liens
partagés ouvriront le navigateur** (qui redirige ensuite vers le scheme
custom `afrobite://` via `video.html` — fonctionne mais friction).

---

## 1. assetlinks.json (Android)

**Valeur à remplir** : `REPLACE_ME_WITH_RELEASE_KEY_SHA256_FINGERPRINT`

Format attendu : SHA-256 en majuscules, paires hex séparées par `:`
Exemple : `14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5`

### Où récupérer le SHA-256

#### Si tu utilises Google Play App Signing (recommandé)

1. https://play.google.com/console → ton app
2. **Setup** → **App Integrity** → **App signing**
3. Copie la valeur sous **SHA-256 certificate fingerprint** (sous "App signing key certificate")

⚠️ Si tu fais du **test interne** où l'app est signée avec ta clé d'upload
au lieu de celle de Play (download direct depuis Play Console), mets aussi
le SHA-256 de la clé d'upload dans le tableau :

```json
"sha256_cert_fingerprints": [
  "SHA256_DE_PLAY_SIGNING_KEY",
  "SHA256_DE_TA_CLE_UPLOAD"
]
```

#### Si tu signes l'app toi-même (pas via Play Signing)

```bash
keytool -list -v -keystore <chemin_vers_keystore.jks> -alias <alias_clé>
```

Cherche la ligne `SHA256:` dans la sortie.

---

## 2. apple-app-site-association (iOS)

**Valeur à remplir** : `REPLACE_ME_WITH_APPLE_TEAM_ID`

Format attendu : 10 caractères alphanumériques
Exemple : `AB12CD34EF`

### Où récupérer le Team ID

1. https://developer.apple.com/account → **Membership details**
2. Copie la valeur sous **Team ID**

Le Bundle ID `com.ismael.afrobyte` est déjà correct (extrait de
`ios/Runner/Runner.entitlements` côté app).

⚠️ Ce fichier n'a **pas d'extension** (pas de `.json`). Apple est strict
là-dessus. Le vercel.json le sert quand même avec le bon Content-Type.

---

## Vérification après déploiement

```bash
curl -i https://afrobite.app/.well-known/assetlinks.json
curl -i https://afrobite.app/.well-known/apple-app-site-association
```

Les deux doivent retourner :
- HTTP 200
- `Content-Type: application/json`
- Le JSON attendu

### Test live Android

Avec un device Android où AfroBite est installée :

```bash
adb shell pm get-app-links apps.artcom.foodtok
```

La ligne pour `afrobite.app` doit afficher `verified`. Si elle affiche
`legacy_failure`, c'est que le SHA-256 du fichier ne match pas celui
de l'APK installée — vérifie que tu as bien pris la bonne clé.

### Test live iOS

Sur un iPhone avec AfroBite installée :
1. Ouvre **Notes**
2. Tape `https://afrobite.app/video/test123`
3. Tap sur le lien
4. iOS doit ouvrir l'app sans passer par Safari

Si Safari s'ouvre, vérifier qu'Apple a bien indexé l'AASA (peut prendre
quelques heures après le déploiement) :

```bash
# Outil officiel Apple de validation
https://branch.io/resources/aasa-validator/?domain=afrobite.app
```

---

## Pourquoi tout ça

Voir la documentation détaillée côté app :
[../foodtok/docs/DEEPLINKS_SETUP.md](../foodtok/docs/DEEPLINKS_SETUP.md)
