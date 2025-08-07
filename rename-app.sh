#!/bin/bash

# Update all SocialHub references to UpsellCreatorsHub
echo "🔄 Renaming SocialHub to UpsellCreatorsHub..."

# Frontend files
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/SocialHub/UpsellCreatorsHub/g' {} \;

# Backend files  
find backend -type f \( -name "*.js" -o -name "*.ts" \) -exec sed -i '' 's/SocialHub/UpsellCreatorsHub/g' {} \;
find backend -type f \( -name "*.js" -o -name "*.ts" \) -exec sed -i '' 's/socialhub/upsellcreatorshub/g' {} \;

# HTML files
find frontend/public -type f -name "*.html" -exec sed -i '' 's/SocialHub/UpsellCreatorsHub/g' {} \;
find frontend/public -type f -name "*.html" -exec sed -i '' 's/socialhub\.app/upsellcreatorshub.upsellbusinessagency.com/g' {} \;

# Package.json
sed -i '' 's/"name": "socialhub"/"name": "upsellcreatorshub"/g' frontend/package.json 2>/dev/null || true
sed -i '' 's/"name": "socialhub"/"name": "upsellcreatorshub"/g' backend/package.json 2>/dev/null || true

# Update MongoDB database name
sed -i '' 's/socialhub-database/upsellcreatorshub/g' backend/.env* 2>/dev/null || true
sed -i '' 's/utm_source=socialhub/utm_source=upsellcreatorshub/g' backend/.env* 2>/dev/null || true

# Update domain references
sed -i '' 's/socialhub\.app/upsellcreatorshub.upsellbusinessagency.com/g' backend/.env* 2>/dev/null || true

echo "✅ Renaming complete!"