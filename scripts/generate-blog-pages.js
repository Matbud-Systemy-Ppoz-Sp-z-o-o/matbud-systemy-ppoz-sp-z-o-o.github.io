const fs = require('fs');
const path = require('path');

/**
 * Generates static HTML pages for blog posts
 * This bypasses Next.js's generateStaticParams requirement by creating
 * the pages directly as static HTML files
 */
async function generateBlogPages() {
  const outDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outDir)) {
    console.log('Warning: out directory not found. Run "npm run build" first.');
    return;
  }
  
  // Read i18n config from TypeScript file (can't require .ts files directly)
  const i18nConfigPath = path.join(process.cwd(), 'lib', 'i18n-config.ts');
  const i18nConfigContent = fs.readFileSync(i18nConfigPath, 'utf8');
  
  // Extract locales array from the TypeScript file
  const localesMatch = i18nConfigContent.match(/locales:\s*\[([^\]]+)\]/);
  const locales = localesMatch 
    ? localesMatch[1]
        .split(',')
        .map(l => l.trim().replace(/['"]/g, '').replace(/\/\*.*?\*\//g, '').trim())
        .filter(l => l.length > 0)
    : ['pl']; // fallback to ['pl'] if parsing fails
  
  const i18n = { locales };
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const baseUrl = 'https://matbud.net';
  
  // For markdown rendering, we'll use react-markdown via a simple approach
  // Actually, let's use a template that will be hydrated by Next.js
  let totalPages = 0;
  
  // Read locale directories
  for (const locale of i18n.locales) {
    const localeDir = path.join(postsDirectory, locale);
    
    if (!fs.existsSync(localeDir)) {
      continue;
    }
    
    const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    
    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, '');
      const filePath = path.join(localeDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter (simple approach)
      const matter = require('gray-matter');
      const { data, content: markdownContent } = matter(content);
      
      const post = {
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        coverImage: data.coverImage || '',
        content: markdownContent
      };
      
      // Read dictionary
      const dictPath = path.join(process.cwd(), 'lib', 'dictionaries', `${locale}.json`);
      const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
      
      // Generate HTML
      const html = generatePostHTML(post, locale, dict, baseUrl);
      
      // Create directory
      const postDir = path.join(outDir, locale, 'blog', post.slug);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }
      
      // Write index.html
      const indexPath = path.join(postDir, 'index.html');
      fs.writeFileSync(indexPath, html);
      totalPages++;
      console.log(`Generated: ${locale}/blog/${post.slug}/index.html`);
    }
  }
  
  console.log(`\n✅ Generated ${totalPages} blog post pages`);
}

function generatePostHTML(post, locale, dict, baseUrl) {
  const postUrl = `${baseUrl}/${locale}/blog/${post.slug}`;
  const postImage = post.coverImage || `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`;
  
  // Format date
  const date = new Date(post.date);
  const localeMap = { pl: 'pl-PL', en: 'en-US' };
  const intlLocale = localeMap[locale] || 'pl-PL';
  const formattedDate = date.toLocaleDateString(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Convert markdown to HTML using a simple approach
  // Try to use marked if available, otherwise use basic conversion
  let htmlContent = '';
  try {
    const marked = require('marked');
    marked.setOptions({ breaks: true });
    htmlContent = marked.parse(post.content);
  } catch (e) {
    // Fallback: simple markdown-like conversion
    htmlContent = post.content
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }
  
  // Generate structured data JSON
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": postImage,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": dict.common.companyName
    },
    "publisher": {
      "@type": "Organization",
      "name": dict.common.companyName
    }
  };
  
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": dict.breadcrumbs.home,
        "item": `${baseUrl}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": dict.breadcrumbs.blog,
        "item": `${baseUrl}/${locale}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": postUrl
      }
    ]
  };
  
  // Create HTML template that will redirect to a client-side rendered page
  // Or we can create a full static page. Let's create a redirect page that
  // loads the content via JavaScript, or better yet, create a proper static page
  // that uses the Next.js app structure
  
  // Actually, the best approach is to create a page that uses Next.js routing
  // but since we can't use dynamic routes, we'll create a static HTML page
  // that includes the content and uses Next.js for styling/hydration
  
  // Read a template from the out directory if it exists, or create a minimal one
  const templatePath = path.join(outDir, locale, 'index.html');
  let baseHTML = '';
  
  if (fs.existsSync(templatePath)) {
    baseHTML = fs.readFileSync(templatePath, 'utf8');
  } else {
    // Fallback minimal template
    baseHTML = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)}</title>
</head>
<body>
  <div id="__next"></div>
</body>
</html>`;
  }
  
  // Inject post data as JSON for client-side rendering
  const postData = JSON.stringify({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    content: post.content,
    locale,
    dict: {
      blog: dict.blog,
      breadcrumbs: dict.breadcrumbs,
      common: dict.common
    }
  });
  
  // For now, create a simple redirect page that will be handled by Next.js
  // Or create a full static page. Let's create a minimal working version:
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)} | ${escapeHtml(dict.common.companyName)}</title>
  <meta name="description" content="${escapeHtml(post.excerpt)}">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(post.excerpt)}">
  <meta property="og:image" content="${postImage}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="article:published_time" content="${post.date}">
  <link rel="canonical" href="${postUrl}">
  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbData)}</script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; }
    .prose { line-height: 1.7; color: #333; }
    .prose p { margin: 1em 0; }
    .prose h1, .prose h2, .prose h3, .prose h4 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
    .prose h1 { font-size: 2em; }
    .prose h2 { font-size: 1.5em; }
    .prose h3 { font-size: 1.25em; }
    .prose img { max-width: 100%; height: auto; border-radius: 0.5rem; }
    .prose code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 0.25rem; font-family: monospace; }
    .prose pre { background: #f4f4f4; padding: 1em; border-radius: 0.5rem; overflow-x: auto; }
    .prose a { color: #0066cc; text-decoration: underline; }
    .prose ul, .prose ol { margin: 1em 0; padding-left: 2em; }
    .prose li { margin: 0.5em 0; }
  </style>
</head>
<body>
  <div class="container">
    <article style="padding: 2rem 0; max-width: 4xl;">
      <a href="/${locale}/blog/" style="display: inline-flex; align-items: center; color: #666; text-decoration: none; margin-bottom: 2rem;">
        <svg style="margin-right: 0.5rem; width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        ${escapeHtml(dict.blog.backToBlog)}
      </a>
      <div style="margin-bottom: 2rem;">
        <h1 style="font-size: 2.25rem; font-weight: bold; margin-bottom: 1rem;">${escapeHtml(post.title)}</h1>
        <div style="color: #666; margin-bottom: 1.5rem;">
          <time datetime="${post.date}">${formattedDate}</time>
        </div>
        ${post.coverImage ? `
        <div style="position: relative; height: 400px; width: 100%; margin-bottom: 2rem;">
          <img src="${post.coverImage}" alt="${escapeHtml(post.title)}" style="object-fit: cover; border-radius: 0.5rem; width: 100%; height: 100%;">
        </div>
        ` : ''}
      </div>
      <div class="prose" style="max-width: none; line-height: 1.7;">
        ${htmlContent}
      </div>
    </article>
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

generateBlogPages().catch(console.error);
