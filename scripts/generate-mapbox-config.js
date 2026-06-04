#!/usr/bin/env node
/**
 * Génère js/mapbox-config.js pour Vercel / CI.
 * Variable : MAPBOX_ACCESS_TOKEN (pk.*)
 */
const fs = require('fs');
const path = require('path');

const token = process.env.MAPBOX_ACCESS_TOKEN || '';
const out = path.join(__dirname, '..', 'js', 'mapbox-config.js');

if (!token.startsWith('pk.')) {
  if (fs.existsSync(out)) {
    console.log('mapbox-config.js déjà présent (build local).');
    process.exit(0);
  }
  console.warn('MAPBOX_ACCESS_TOKEN manquant — copiez js/mapbox-config.example.js');
  process.exit(0);
}

fs.writeFileSync(
  out,
  `// Généré au build — token public Mapbox\nwindow.AFROBITE_MAPBOX_TOKEN = '${token.replace(/'/g, "\\'")}';\n`
);
console.log('Écrit', out);
