# 404 Page Configuration

This directory contains server configuration files to ensure custom 404 pages are shown instead of the hosting provider's default 404 page.

## Files Included

- **`.htaccess`** - For Apache servers
- **`_redirects`** - For Netlify
- **`web.config`** - For IIS/Windows servers
- **`nginx.conf`** - For Nginx servers (include in your nginx config)

## Setup Instructions

### If using Apache
The `.htaccess` file should work automatically. Make sure your server allows `.htaccess` overrides.

### If using Netlify
The `_redirects` file should work automatically.

### If using IIS
Copy the `web.config` file to your server root. It should work automatically.

### If using Nginx
Add the contents of `nginx.conf` to your server block configuration, or include the file:
```nginx
include /path/to/nginx.conf;
```

### If using Cloudflare or other CDN
1. Go to your CDN dashboard
2. Add a Page Rule or Redirect Rule:
   - Pattern: `*matbud.net/*`
   - Action: Redirect to `/404.html` with status code 404
   - Or use Cloudflare Workers to handle 404s

### If using GitHub Pages with Custom Domain
GitHub Pages should automatically use the `404.html` file, but if you're using a CDN in front (like Cloudflare), configure the CDN as described above.

## Testing

After deployment, test by visiting:
- `https://matbud.net/pl/nonexistent-page`
- `https://matbud.net/en/invalid-path`

These should show your custom 404 page instead of the server's default 404.

