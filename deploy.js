const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ghpages = require('gh-pages');

// Create .nojekyll file
const outDir = path.join(process.cwd(), 'out');

const gitDir = path.join(outDir, '.git');
if (fs.existsSync(gitDir)) {
  console.log('WARNING: .git directory found in out directory. Removing it...');
  fs.rmSync(gitDir, { recursive: true, force: true });
}

// Create .nojekyll file
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

// Create .gitignore in out directory to prevent .git from being added
const gitignoreContent = `# Prevent .git directory from being deployed
.git/
.gitignore
.gitattributes
`;
fs.writeFileSync(path.join(outDir, '.gitignore'), gitignoreContent);

// Function to remove .git from gh-pages branch
function removeGitFromGhPages() {
  try {
    console.log('Security: Checking gh-pages branch for .git directory...');
    
    // Get current branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    
    // Fetch latest from remote (fetch all refs to ensure we have the latest)
    try {
      execSync('git fetch origin', { stdio: 'pipe' });
    } catch (error) {
      console.log('Could not fetch from origin. Skipping cleanup.');
      return;
    }
    
    // Check if gh-pages branch exists using ls-remote (most reliable)
    let branchExists = false;
    try {
      const remoteRefs = execSync('git ls-remote --heads origin gh-pages', { encoding: 'utf8' }).trim();
      if (remoteRefs) {
        branchExists = true;
      }
    } catch (error) {
      // ls-remote failed, try alternative check
    }
    
    // If ls-remote didn't work, try checking local refs
    if (!branchExists) {
      try {
        execSync('git show-ref --verify --quiet refs/remotes/origin/gh-pages', { stdio: 'ignore' });
        branchExists = true;
      } catch (error) {
        // Branch doesn't exist
      }
    }
    
    if (!branchExists) {
      console.log('gh-pages branch does not exist. Skipping cleanup.');
      return;
    }
    
    // Check if gh-pages branch exists locally
    let hasLocalBranch = false;
    try {
      execSync('git show-ref --verify --quiet refs/heads/gh-pages', { stdio: 'ignore' });
      hasLocalBranch = true;
    } catch (error) {
      // Local branch doesn't exist, create local tracking branch
      try {
        execSync('git checkout -b gh-pages origin/gh-pages', { stdio: 'pipe' });
        hasLocalBranch = true;
      } catch (e) {
        console.log('Could not create local gh-pages branch. Skipping cleanup.');
        return;
      }
    }

    // Checkout gh-pages branch if not already on it
    if (!hasLocalBranch || currentBranch !== 'gh-pages') {
      execSync('git checkout gh-pages', { stdio: 'pipe' });
    }

    // Check if .git directory is tracked in the branch (not the repo root .git)
    // We check if .git/config or any .git file is tracked in the index
    try {
      // Check if .git directory or any file inside it is tracked
      const trackedFiles = execSync('git ls-files .git/', { encoding: 'utf8' }).trim();
      if (trackedFiles) {
        console.log('Found tracked .git directory in gh-pages branch. Removing it...');
        execSync('git rm -rf .git', { stdio: 'pipe' });
        console.log('Removed .git directory');
        
        // Commit the removal
        const timestamp = new Date().toISOString();
        execSync(`git commit -m "Remove .git directory from deployment [${timestamp}]"`, { stdio: 'pipe' });
        console.log('Committed removal of .git directory');
        
        execSync('git push origin gh-pages', { stdio: 'pipe' });
        console.log('Pushed cleanup to remote');
      } else {
        console.log('No tracked .git directory found in gh-pages branch. Already clean.');
      }
    } catch (error) {
      // git ls-files returns error if .git is not tracked, which is good
      console.log('No tracked .git directory found in gh-pages branch. Already clean.');
    }

    // Switch back to original branch
    if (currentBranch !== 'gh-pages') {
      execSync(`git checkout ${currentBranch}`, { stdio: 'pipe' });
    }
    console.log('✅ Security check completed!');
  } catch (error) {
    console.error('Warning: Could not clean .git from gh-pages branch:', error.message);
    // Try to switch back to original branch if we're stuck
    try {
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (currentBranch === 'gh-pages') {
        // Try to find main or master branch
        try {
          execSync('git checkout main', { stdio: 'pipe' });
        } catch (e) {
          try {
            execSync('git checkout master', { stdio: 'pipe' });
          } catch (e2) {
            // Can't switch back, but that's okay
          }
        }
      }
    } catch (e) {
      // Ignore errors here
    }
  }
}

// Deploy to GitHub Pages
ghpages.publish(outDir, {
  branch: 'gh-pages',
  dotfiles: true, // Important to include .nojekyll
  message: 'Auto-deploy from Next.js build',
}, (err) => {
  if (err) {
    console.error('Deployment error:', err);
    process.exit(1);
  } else {
    console.log('Deployed successfully!');
    removeGitFromGhPages();
  }
});
