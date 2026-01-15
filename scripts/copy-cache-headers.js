const fs = require('fs');
const path = require('path');

/**
 * Copies cache header files to the out directory after build
 * This ensures cache headers are available for static hosting
 */
function copyCacheHeaders() {
  const outDir = path.join(process.cwd(), 'out');
  const publicDir = path.join(process.cwd(), 'public');
  
  // Files to copy
  const filesToCopy = [
    '.htaccess',
    'nginx.conf',
    'web.config',
    '_headers',
  ];
  
  if (!fs.existsSync(outDir)) {
    console.log('Warning: out directory not found. Skipping cache headers copy.');
    return;
  }
  
  filesToCopy.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(outDir, file);
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to out directory`);
      } catch (error) {
        console.error(`Error copying ${file}:`, error);
      }
    } else {
      console.log(`Warning: ${file} not found in public directory`);
    }
  });
  
  console.log('Cache headers copied successfully');
}

copyCacheHeaders();
