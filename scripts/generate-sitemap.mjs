import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const matter = require('gray-matter');

const repoRoot = path.join(__dirname, '..');
const today = new Date().toISOString().split('T')[0];
const lastModCache = new Map();

// Most recent git commit date that touched a file, falling back to its
// filesystem mtime (untracked file) or today (file missing/no git history).
// Keeps lastmod stable across builds instead of always stamping "today".
function getLastModified(relativePath) {
  if (lastModCache.has(relativePath)) {
    return lastModCache.get(relativePath);
  }

  const absolutePath = path.join(repoRoot, relativePath);
  let result = null;

  try {
    const output = execFileSync(
      'git',
      ['log', '-1', '--format=%cd', '--date=short', '--', relativePath],
      { cwd: repoRoot, encoding: 'utf8' }
    ).trim();
    if (output) {
      result = output;
    }
  } catch {
    // git not available or path not tracked - fall through to mtime
  }

  if (!result && fs.existsSync(absolutePath)) {
    result = fs.statSync(absolutePath).mtime.toISOString().split('T')[0];
  }

  result = result || today;
  lastModCache.set(relativePath, result);
  return result;
}

// Most recent date among several files (e.g. a page plus its dictionary).
function getLastModifiedOf(relativePaths) {
  return relativePaths
    .map(getLastModified)
    .sort()
    .pop();
}

// Simple function to get cities (reading from the exported array)
async function getCities() {
  try {
    // Read the cities file and extract the array
    const citiesPath = path.join(__dirname, '..', 'lib', 'cities.ts');
    const citiesContent = fs.readFileSync(citiesPath, 'utf8');

    // Extract the polishCities array using regex
    const arrayMatch = citiesContent.match(/const polishCities = \[([\s\S]*?)\];/);
    if (!arrayMatch) return [];

    const arrayContent = arrayMatch[1];
    // Parse the array (simplified - just extract slugs)
    const cityMatches = [...arrayContent.matchAll(/"slug":\s*"([^"]+)"/g)];
    const cities = [];
    for (const match of cityMatches) {
      cities.push({ slug: match[1] });
    }
    return cities;
  } catch (error) {
    console.error('Error loading cities:', error);
    return [];
  }
}

// Simple function to get blog posts, using each post's frontmatter date
// (falling back to the file's last git commit date) instead of "today".
async function getAllPosts(locale) {
  try {
    const postsDir = path.join(__dirname, '..', 'content', 'blog', locale);
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir);
    return files
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(file => {
        const relativePath = path.join('content', 'blog', locale, file);
        const fileContents = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
        const { data } = matter(fileContents);

        let date = data.date ? String(data.date).split('T')[0] : null;
        if (!date || Number.isNaN(Date.parse(date))) {
          date = getLastModified(relativePath);
        }

        return {
          slug: file.replace(/\.mdx?$/, ''),
          date,
        };
      });
  } catch (error) {
    console.error(`Error loading blog posts for ${locale}:`, error);
    return [];
  }
}

const baseUrl = 'https://matbud.net';
const locales = ['pl', 'en'];

async function generateSitemap() {
  const urls = [];

  // Get all cities
  const cities = await getCities();

  // Get all blog posts for each locale
  const blogPosts = {};
  for (const locale of locales) {
    blogPosts[locale] = await getAllPosts(locale);
  }

  // City pages share the same source data, so compute their lastmod once.
  const cityPagesLastmod = getLastModifiedOf([
    path.join('lib', 'cities.ts'),
    path.join('app', '[locale]', '[city]', 'page.tsx'),
  ]);

  // Add main pages
  for (const locale of locales) {
    const dictionaryPath = path.join('lib', 'dictionaries', `${locale}.json`);

    // Home page
    urls.push({
      loc: `${baseUrl}/${locale}`,
      lastmod: getLastModifiedOf([path.join('app', '[locale]', 'page.tsx'), dictionaryPath]),
      changefreq: 'weekly',
      priority: '1.0'
    });

    // Blog listing page
    urls.push({
      loc: `${baseUrl}/${locale}/blog`,
      lastmod: getLastModifiedOf([path.join('app', '[locale]', 'blog', 'page.tsx'), dictionaryPath]),
      changefreq: 'weekly',
      priority: '0.8'
    });

    // Blog posts
    if (blogPosts[locale]) {
      blogPosts[locale].forEach(post => {
        urls.push({
          loc: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastmod: post.date,
          changefreq: 'monthly',
          priority: '0.7'
        });
      });
    }

    // Careers page
    urls.push({
      loc: `${baseUrl}/${locale}/careers`,
      lastmod: getLastModifiedOf([path.join('app', '[locale]', 'careers', 'page.tsx'), dictionaryPath]),
      changefreq: 'monthly',
      priority: '0.6'
    });

    // Privacy policy
    // urls.push({
    //   loc: `${baseUrl}/${locale}/privacy-policy`,
    //   lastmod: getLastModifiedOf([path.join('app', '[locale]', 'privacy-policy', 'page.tsx'), dictionaryPath]),
    //   changefreq: 'yearly',
    //   priority: '0.3'
    // });

    // Terms of service
    urls.push({
      loc: `${baseUrl}/${locale}/terms-of-service`,
      lastmod: getLastModifiedOf([path.join('app', '[locale]', 'terms-of-service', 'page.tsx'), dictionaryPath]),
      changefreq: 'yearly',
      priority: '0.3'
    });

    // City pages
    if (cities && cities.length > 0) {
      cities.forEach(city => {
        urls.push({
          loc: `${baseUrl}/${locale}/${city.slug}`,
          lastmod: cityPagesLastmod,
          changefreq: 'monthly',
          priority: '0.8'
        });
      });
    }
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public directory
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`Sitemap generated successfully with ${urls.length} URLs`);
  console.log(`Location: ${sitemapPath}`);
}

// Run the generator
generateSitemap().catch(error => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});
