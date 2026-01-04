const fs = require('fs');
const path = require('path');

/**
 * Generates 404.html files in nested directories for static hosting
 * This ensures that unknown paths like /pl/rfhqfehfr show the custom 404 page
 * instead of the hosting provider's default 404
 */
function generate404Pages() {
  const outDir = path.join(process.cwd(), 'out');
  const locales = ['pl', 'en'];
  
  // Read the root 404.html to use as a template
  const root404Path = path.join(outDir, '404.html');
  if (!fs.existsSync(root404Path)) {
    console.log('Warning: 404.html not found in out directory. Skipping 404 page generation.');
    return;
  }
  
  let root404Content = fs.readFileSync(root404Path, 'utf8');
  
  // Add a client-side script to handle 404s for paths that bypass server config
  const clientSide404Script = `
<script>
  // Client-side 404 handler as fallback
  // This runs if the server doesn't properly redirect to 404.html
  (function() {
    // Only run if we're actually on a 404 page (not if we navigated here from the app)
    if (window.location.pathname !== '/404.html' && 
        window.location.pathname !== '/404/' &&
        !document.querySelector('[data-404-content]')) {
      // Check if this looks like a 404 by checking if the page content is minimal
      // or if we're getting a server 404 response
      const bodyText = document.body ? document.body.innerText : '';
      const isServer404 = bodyText.includes('404') || 
                         bodyText.includes('Not Found') ||
                         bodyText.length < 100; // Very short content likely means 404
      
      if (isServer404 && !sessionStorage.getItem('404-handled')) {
        sessionStorage.setItem('404-handled', 'true');
        // Redirect to the proper 404 page
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const locale = pathParts[0] && ['pl', 'en'].includes(pathParts[0]) ? pathParts[0] : 'pl';
        window.location.href = '/' + locale + '/?notFound=true';
      }
    }
  })();
</script>`;
  
  // Inject the script before closing body tag
  if (root404Content.includes('</body>')) {
    root404Content = root404Content.replace('</body>', clientSide404Script + '\n</body>');
  } else {
    root404Content += clientSide404Script;
  }
  
  // For each locale, create a 404.html file
  locales.forEach(locale => {
    const localeDir = path.join(outDir, locale);
    
    // Create locale directory if it doesn't exist
    if (!fs.existsSync(localeDir)) {
      fs.mkdirSync(localeDir, { recursive: true });
    }
    
    // Create 404.html in the locale directory
    const locale404Path = path.join(localeDir, '404.html');
    fs.writeFileSync(locale404Path, root404Content);
    console.log(`Created ${locale}/404.html`);
  });
  
  // Also update the root 404.html with the script
  fs.writeFileSync(root404Path, root404Content);
  console.log('Updated root 404.html with client-side fallback');
  
  console.log('404 pages generated successfully for nested paths');
}

generate404Pages();

