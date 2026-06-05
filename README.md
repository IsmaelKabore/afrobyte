# AfroBite Website

Official website for AfroBite - A food delivery platform operating in Burkina Faso.

## Overview

This is a static, production-ready website for AfroBite, designed for deployment on Vercel. The website serves as the official company presence and includes the external restaurant onboarding page used for iOS App Store compliance.

## Features

- **Home Page**: Company introduction and how it works section
- **About Page**: Mission, vision, and company information
- **Privacy Policy**: Comprehensive privacy policy for payment verification
- **Terms & Conditions**: Full terms of service
- **Support Page**: Contact information, FAQ, and support form
- **Refund Page**: Orange Money refund request form (`refund.html`) with Vercel serverless API

## Refund flow (Orange Money only)

1. User chooses cash refund in the AfroBite app → Cloud Function `requestCashRefund` opens `https://afrobite.app/refund/{token}`.
2. Static page `refund.html` decodes the JWT for display and submits to Cloud Function `submitRefundRequest`.
3. Firestore collection `refund_requests` stores the ticket; confirmation shows `REF-2026-XXXXXX`.

### Secret (Firebase only — never commit)

```bash
firebase functions:secrets:set AFROBITE_REFUND_JWT_SECRET
```

Same secret is used by foodtok Cloud Functions and verified on submit.

## Deployment to Vercel

1. Import this repository in Vercel.
2. Keep root directory as project root (`afrobyte` repository root).
3. Framework preset: **Other** (static site).
4. Build command: empty.
5. Output directory: empty.
6. Deploy.

After this initial setup, every push to GitHub triggers automatic redeployment on Vercel.

### Partenariat

Navigation **Partenaire → Restaurant | Livraison** :

| Page | Parcours |
|------|----------|
| `partenaire-restaurant.html` | Étape 1 candidature restaurant → Étape 2 compte (Auth + `setupPartnerAccount`, statut pending) |
| `partenaire-livraison.html` | Toggle société (candidature seule, sans Auth) ou livreur (compte Auth pending) |
| `partenaire.html` | Hub de choix + redirections depuis anciennes URLs Vercel (`/partner/restaurant`, etc.) |

Leads publics → `submitPartnerLead` → `partner_applications`. Comptes → `setupPartnerAccount`.

Les fichiers `partner*.html` redirigent vers les pages dédiées. `vercel.json` n'est pas modifié.

Déploiement : push GitHub → le projet Vercel **afrobyte** existant redéploie automatiquement. Ne pas créer de second projet Vercel.

## Local Development

To view the website locally:

1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
4. Navigate to `http://localhost:8000` in your browser

## Contact Information

- **Support Email**: afrobyteapp@gmail.com
- **Based in**: Burkina Faso

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2026 AfroBite. All rights reserved.
