import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);


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

// Simple function to get blog posts
async function getAllPosts(locale) {
  try {
    const postsDir = path.join(__dirname, '..', 'content', 'blog', locale);
    if (!fs.existsSync(postsDir)) return [];
    
    const files = fs.readdirSync(postsDir);
    return files
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(file => ({
        slug: file.replace(/\.mdx?$/, ''),
        date: new Date().toISOString().split('T')[0]
      }));
  } catch (error) {
    console.error(`Error loading blog posts for ${locale}:`, error);
    return [];
  }
}

const baseUrl = 'https://matbud.net';
const locales = ['pl', 'en'];

async function generateSitemap() {
  const urls = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // Get all cities
  const cities = await getCities();
  
  // Get all blog posts for each locale
  const blogPosts = {};
  for (const locale of locales) {
    blogPosts[locale] = await getAllPosts(locale);
  }

  // Add main pages
  for (const locale of locales) {
    // Home page
    urls.push({
      loc: `${baseUrl}/${locale}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    });

    // Blog listing page
    urls.push({
      loc: `${baseUrl}/${locale}/blog`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });

    // Blog posts
    if (blogPosts[locale]) {
      blogPosts[locale].forEach(post => {
        urls.push({
          loc: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastmod: post.date || currentDate,
          changefreq: 'monthly',
          priority: '0.7'
        });
      });
    }

    // Careers page
    urls.push({
      loc: `${baseUrl}/${locale}/careers`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    });

    // Privacy policy
    // urls.push({
    //   loc: `${baseUrl}/${locale}/privacy-policy`,
    //   lastmod: currentDate,
    //   changefreq: 'yearly',
    //   priority: '0.3'
    // });

    // Terms of service
    urls.push({
      loc: `${baseUrl}/${locale}/terms-of-service`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    });

    // City pages
    if (cities && cities.length > 0) {
      cities.forEach(city => {
        urls.push({
          loc: `${baseUrl}/${locale}/${city.slug}`,
          lastmod: currentDate,
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
