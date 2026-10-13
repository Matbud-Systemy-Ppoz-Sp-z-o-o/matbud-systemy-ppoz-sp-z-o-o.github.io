const fs = require('fs');
const path = require('path');
const { KNOWN_LOCALES, getActiveLocales, getDefaultLocale } = require('./active-locales');

/**
 * Generates redirect pages for locales that are not currently active (e.g. /en/ while
 * only Polish is enabled), so old URLs search engines already know about point to the
 * matching page in the default locale instead of serving duplicate content or a 404.
 *
 * Static hosting can't send real 301s, so each page uses an instant meta refresh
 * (which Google treats as a permanent redirect), plus noindex, a canonical link and
 * a JS fallback. Enabling the locale in lib/i18n-config.ts turns this off automatically.
 */
function generateLocaleRedirects() {
  const outDir = path.join(process.cwd(), 'out');
  const baseUrl = 'https://matbud.net';
  const activeLocales = getActiveLocales();
  const defaultLocale = getDefaultLocale();
  const inactiveLocales = KNOWN_LOCALES.filter(l => !activeLocales.includes(l));

  const sourceDir = path.join(outDir, defaultLocale);
  if (!fs.existsSync(sourceDir)) {
    console.log(`Warning: ${sourceDir} not found. Skipping locale redirects.`);
    return;
  }

  // Every page in the default locale (directories with an index.html), relative to it
  const pages = [];
  (function walk(dir) {
    if (fs.existsSync(path.join(dir, 'index.html'))) pages.push(path.relative(sourceDir, dir));
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
    }
  })(sourceDir);

  for (const locale of inactiveLocales) {
    for (const page of pages) {
      const target = `/${defaultLocale}/${page ? page.split(path.sep).join('/') + '/' : ''}`;
      const html = `<!DOCTYPE html>
<html lang="${defaultLocale}">
<head>
<meta charset="utf-8">
<title>Przekierowanie…</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${baseUrl}${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script>
</head>
<body><a href="${target}">${baseUrl}${target}</a></body>
</html>
`;
      const destDir = path.join(outDir, locale, page);
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(path.join(destDir, 'index.html'), html);
    }
    console.log(`Generated ${pages.length} redirect pages: /${locale}/ → /${defaultLocale}/`);
  }
}

generateLocaleRedirects();
