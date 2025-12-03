# Automated Deployment Setup Guide

This guide will help you set up automated deployment using GitHub Actions. Every time you push to the `main` branch, your site will automatically build and deploy to cPanel.

## Step 1: Get Your cPanel FTP Credentials

1. **Log into cPanel**
2. **Go to "FTP Accounts"**
3. **Find or create an FTP account:**
   - Username: Usually `sakechostingacm` or similar
   - Password: Your FTP password
   - Directory: `/home/sakechostingacm/public_html`

4. **Note down:**
   - FTP Server: Usually `sakec.hosting.acm.org` or `ftp.sakec.hosting.acm.org`
   - FTP Username: `sakechostingacm`
   - FTP Password: Your password

## Step 2: Add Secrets to GitHub

1. **Go to your GitHub repository:**
   https://github.com/Nealjain/SAKEC_ACM

2. **Click "Settings"** (top menu)

3. **Click "Secrets and variables"** → **"Actions"** (left sidebar)

4. **Click "New repository secret"** and add these three secrets:

### Secret 1: FTP_SERVER
- Name: `FTP_SERVER`
- Value: `sakec.hosting.acm.org` (or your FTP server address)

### Secret 2: FTP_USERNAME
- Name: `FTP_USERNAME`
- Value: `sakechostingacm` (your FTP username)

### Secret 3: FTP_PASSWORD
- Name: `FTP_PASSWORD`
- Value: Your FTP password

## Step 3: Test the Deployment

1. **Commit and push the workflow file:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add automated deployment workflow"
   git push origin main
   ```

2. **Watch the deployment:**
   - Go to your GitHub repository
   - Click "Actions" tab
   - You'll see the deployment running
   - Wait for it to complete (green checkmark)

3. **Visit your website:**
   - https://sakec.acm.org
   - Your site should be live!

## How It Works

Every time you push to the `main` branch:
1. GitHub Actions automatically runs
2. Installs dependencies
3. Builds your React app
4. Uploads files to cPanel via FTP:
   - `dist/` contents → `public_html/`
   - `api/` folder → `public_html/api/`
   - `.htaccess`, `robots.txt`, `sitemap.xml`, `manifest.json`

## Future Deployments

Just push your changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The deployment happens automatically in 2-3 minutes!

## Troubleshooting

### Deployment fails with "Login incorrect"
- Check your FTP credentials in GitHub Secrets
- Make sure FTP account exists in cPanel

### Files not uploading
- Check FTP server address (might need `ftp.` prefix)
- Verify FTP account has write permissions

### Site not updating
- Check GitHub Actions tab for errors
- Clear browser cache (Ctrl+Shift+R)

## Alternative: Using cPanel Git Deployment

If you prefer cPanel's Git deployment:
1. The `.cpanel.yml` file is already configured
2. Set up repository in cPanel Git Version Control
3. Click "Deploy HEAD Commit" after each push

However, GitHub Actions is more reliable for React apps!

## Support

For issues: neal.18191@sakec.ac.in
