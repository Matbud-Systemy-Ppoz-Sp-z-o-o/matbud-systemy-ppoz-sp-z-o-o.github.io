const fs = require('fs');
const path = require('path');
const ghpages = require('gh-pages');

// Create .nojekyll file
const outDir = path.join(process.cwd(), 'out');
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

// Deploy to GitHub Pages
ghpages.publish(outDir, {
  branch: 'gh-pages',
  dotfiles: true,
  message: 'Auto-deploy from Next.js build',
}, (err) => {
  if (err) {
    console.error('Deployment error:', err);
    process.exit(1);
  } else {
    console.log('Deployed successfully!');
  }
});
