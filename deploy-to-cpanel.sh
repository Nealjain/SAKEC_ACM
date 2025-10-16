#!/bin/bash

# Build the static site
npm run build

# Create .htaccess file for proper routing
cat > ./out/.htaccess << 'EOL'
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html !-f
RewriteRule ^(.*)$ /$1.html [L]
</IfModule>

# For 404 errors, redirect to 404.html
ErrorDocument 404 /404.html
EOL

# Create a zip file for easy upload to cPanel
zip -r cpanel-deploy.zip ./out/*

echo "=================================================="
echo "Build completed! Upload cpanel-deploy.zip to your"
echo "cPanel account and extract it to your public_html"
echo "or desired directory."
echo "=================================================="