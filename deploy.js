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
  const worktreePath = path.join(process.cwd(), '.gh-pages-checkout');
  
  try {
    console.log('Security: Checking gh-pages branch for .git directory...');
    
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
    
    // Use worktree to check the branch without switching
    // Clean up any existing worktree first
    try {
      if (fs.existsSync(worktreePath)) {
        execSync(`git worktree remove -f .gh-pages-checkout`, { stdio: 'pipe' });
      }
    } catch (error) {
      // Worktree doesn't exist or couldn't be removed, that's okay
    }
    
    // Create a worktree for the gh-pages branch
    try {
      execSync(`git worktree add .gh-pages-checkout origin/gh-pages`, { stdio: 'pipe' });
    } catch (error) {
      console.log('Could not create worktree for gh-pages branch. Skipping cleanup.');
      return;
    }

    // Check if .git directory is tracked in the branch (not the repo root .git)
    try {
      // Check if .git directory or any file inside it is tracked
      const trackedFiles = execSync('git ls-files .git/', { 
        encoding: 'utf8',
        cwd: worktreePath 
      }).trim();
      
      if (trackedFiles) {
        console.log('Found tracked .git directory in gh-pages branch. Removing it...');
        execSync('git rm -rf .git', { 
          stdio: 'pipe',
          cwd: worktreePath 
        });
        console.log('Removed .git directory');
        
        // Commit the removal
        const timestamp = new Date().toISOString();
        execSync(`git commit -m "Remove .git directory from deployment [${timestamp}]"`, { 
          stdio: 'pipe',
          cwd: worktreePath 
        });
        console.log('Committed removal of .git directory');
        
        execSync('git push origin gh-pages', { 
          stdio: 'pipe',
          cwd: worktreePath 
        });
        console.log('Pushed cleanup to remote');
      } else {
        console.log('No tracked .git directory found in gh-pages branch. Already clean.');
      }
    } catch (error) {
      // git ls-files returns error if .git is not tracked, which is good
      console.log('No tracked .git directory found in gh-pages branch. Already clean.');
    }

    // Clean up worktree
    try {
      execSync(`git worktree remove -f .gh-pages-checkout`, { stdio: 'pipe' });
    } catch (error) {
      // Try to remove directory manually if worktree remove fails
      try {
        fs.rmSync(worktreePath, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    
    console.log('Security check completed!');
  } catch (error) {
    console.error('Warning: Could not clean .git from gh-pages branch:', error.message);
    // Clean up worktree on error
    try {
      if (fs.existsSync(worktreePath)) {
        execSync(`git worktree remove -f .gh-pages-checkout`, { stdio: 'pipe' });
      }
    } catch (e) {
      try {
        fs.rmSync(worktreePath, { recursive: true, force: true });
      } catch (e2) {
        // Ignore cleanup errors
      }
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
