const fs = require('fs');
const path = require('path');

// Every locale the site has ever published. Locales listed here but not active in
// lib/i18n-config.ts get redirect pages instead of content (see generate-locale-redirects.js).
const KNOWN_LOCALES = ['pl', 'en'];

/**
 * Reads the active locales from lib/i18n-config.ts (can't require .ts files directly).
 * Block comments are stripped first so commented-out locales like ["pl"/*, "en"*\/] don't count.
 */
function getActiveLocales() {
  const configPath = path.join(process.cwd(), 'lib', 'i18n-config.ts');
  const content = fs.readFileSync(configPath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const match = content.match(/locales:\s*\[([^\]]+)\]/);
  const locales = match
    ? match[1].split(',').map(l => l.trim().replace(/['"]/g, '').trim()).filter(Boolean)
    : [];
  return locales.length > 0 ? locales : ['pl'];
}

function getDefaultLocale() {
  const configPath = path.join(process.cwd(), 'lib', 'i18n-config.ts');
  const match = fs.readFileSync(configPath, 'utf8').match(/defaultLocale:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : 'pl';
}

module.exports = { KNOWN_LOCALES, getActiveLocales, getDefaultLocale };
