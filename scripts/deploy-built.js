#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting safe deployment to built branch...');

// Safety checks
function runSafetyChecks() {
  console.log('Running safety checks...');
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('Not in a git repository. Please run this script from the root of your git project.');
  }
  
  // Check if there are uncommitted changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.warn('Warning: You have uncommitted changes in your working directory.');
      console.warn('   Consider committing them before deployment.');
    }
  } catch (error) {
    console.warn('Could not check git status');
  }
  
  // Check if we have a remote origin
  try {
    execSync('git remote get-url origin', { stdio: 'ignore' });
  } catch (error) {
    throw new Error('No remote origin found. Please add a remote origin to your repository.');
  }
  
  console.log('Safety checks passed');
}

function buildProject() {
  console.log('Building Next.js project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    throw new Error('Build failed. Please fix build errors before deploying.');
  }
  
  // Verify build output exists
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('Build output directory "out" not found. Make sure Next.js is configured for static export.');
  }
  
  console.log('Build completed successfully');
}

function deployToBuiltBranch() {
  console.log('Preparing built branch...');
  
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`Current branch: ${currentBranch}`);
  
  // Create a temporary directory for the built branch content
  const tempDir = path.join(process.cwd(), '.temp-built');
  const outDir = path.join(process.cwd(), 'out');
  
  try {
    // Clean up any existing temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    // Create temp directory and copy build output
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('Copying build output to temporary directory...');
    
    // Copy all files from out directory to temp directory
    const copyRecursive = (src, dest) => {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        // Skip .git directory
        if (path.basename(src) === '.git') {
          console.log('Skipping .git directory');
          return;
        }
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(child => {
          copyRecursive(path.join(src, child), path.join(dest, child));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    
    copyRecursive(outDir, tempDir);
    
    // Add .nojekyll file for GitHub Pages compatibility
    fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
    
    // Check if built branch exists
    let builtBranchExists = false;
    try {
      execSync('git show-ref --verify --quiet refs/heads/built', { stdio: 'ignore' });
      builtBranchExists = true;
      console.log('Built branch exists');
    } catch (error) {
      console.log('Built branch does not exist, will create it');
    }
    
    // Create or checkout built branch
    if (!builtBranchExists) {
      console.log('Creating built branch...');
      execSync('git checkout --orphan built', { stdio: 'inherit' });
      // Remove all files from the new branch
      execSync('git rm -rf .', { stdio: 'inherit' });
    } else {
      console.log('Switching to built branch...');
      execSync('git checkout built', { stdio: 'inherit' });
      // Remove all files from built branch (but keep .git)
      const files = fs.readdirSync('.');
      files.forEach(file => {
        if (file !== '.git' && file !== '.temp-built') {
          const filePath = path.join('.', file);
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
        }
      });
    }
    
    // Copy files from temp directory to current directory
    console.log('Copying files to built branch...');
    const files = fs.readdirSync(tempDir);
    files.forEach(file => {
      if (file === '.git') {
        console.log('Skipping .git directory');
        return;
      }
      const srcPath = path.join(tempDir, file);
      const destPath = path.join('.', file);
      if (fs.statSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
    
    
    // Add all files to git
    console.log('Adding files to git...');
    execSync('git add .', { stdio: 'inherit' });
    
    // Check if there are changes to commit
    try {
      execSync('git diff --cached --quiet', { stdio: 'ignore' });
      console.log('No changes to commit');
    } catch (error) {
      // There are changes, proceed with commit
      const timestamp = new Date().toISOString();
      const commitMessage = `Deploy: ${timestamp}`;
      
      console.log('Committing changes...');
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      console.log('Pushing to built branch...');
      execSync('git push origin built --force', { stdio: 'inherit' });
      
      console.log('Successfully deployed to built branch!');
    }
    
    // Switch back to original branch
    console.log(`Switching back to ${currentBranch} branch...`);
    execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' });
    
  } finally {
    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      console.log('Cleaning up temporary files...');
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

// Main execution
try {
  runSafetyChecks();
  buildProject();
  deployToBuiltBranch();
  
  console.log('Build completed successfully!');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  console.error('Please fix the issue and try again.');
  process.exit(1);
}
