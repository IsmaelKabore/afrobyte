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

## Design

- Clean, modern, mobile-first design
- Professional fintech-style layout
- Warm orange (#FF6B35) primary color
- Deep green (#2D5016) accent color
- Fully responsive across all devices

## File Structure

```
afrobyte/
├── index.html          # Home page
├── about.html          # About page
├── privacy-policy.html # Privacy Policy
├── terms.html          # Terms & Conditions
├── support.html        # Support page
├── css/
│   └── styles.css      # Main stylesheet
└── README.md           # This file
```

## Deployment to Vercel

1. Import this repository in Vercel.
2. Keep root directory as project root (`afrobyte` repository root).
3. Framework preset: **Other** (static site).
4. Build command: empty.
5. Output directory: empty.
6. Deploy.

After this initial setup, every push to GitHub triggers automatic redeployment on Vercel.

### Important path for restaurant onboarding

- Production: `https://afrobite.app/partenaire.html`
- After connecting your GoDaddy domain to Vercel, point `afrobite.app` DNS to Vercel and set the custom domain in the Vercel project settings.

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
