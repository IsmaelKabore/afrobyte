# AfroBite Website

Official website for AfroBite - A food delivery platform operating in Burkina Faso.

## Overview

This is a static, production-ready website for AfroBite, designed for deployment on GitHub Pages. The website serves as the official company presence and includes all necessary legal pages for payment API verification.

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

## Deployment to GitHub Pages

### Method 1: Using GitHub Web Interface

1. Push all files to your GitHub repository
2. Go to repository Settings → Pages
3. Under "Source", select the branch containing your files (usually `main`)
4. Select `/ (root)` as the folder
5. Click Save
6. Your site will be available at `https://[username].github.io/afrobyte/`

### Method 2: Using GitHub CLI

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: AfroBite website"

# Add remote repository
git remote add origin https://github.com/[username]/afrobyte.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow Method 1 steps 2-6 to enable GitHub Pages.

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
