#!/bin/bash

# Update HTML files to use WebP images with JPG fallbacks
# Run this AFTER running OPTIMIZE_IMAGES.sh

echo "🔄 Updating HTML files for WebP images..."
echo "=========================================="
echo ""

cd "$(dirname "$0")" || exit 1

# Backup originals
echo "📦 Creating backups..."
mkdir -p backups_html
cp *.html backups_html/ 2>/dev/null
echo "  ✅ Backups created in backups_html/"
echo ""

# Function to update a single file
update_file() {
    local file="$1"
    echo "Updating $file..."
    
    # Update hero background
    sed -i '' 's|<img src="images/hero-background.png"|<picture><source srcset="images/hero-background.webp" type="image/webp"><source srcset="images/hero-background.jpg" type="image/jpeg"><img src="images/hero-background.jpg"|g' "$file"
    sed -i '' 's|</picture>"></picture>|</picture>|g' "$file" # Fix double closing
    
    # Update logo references
    sed -i '' 's|images/logo5.png"|images/logo5.webp" type="image/webp"><img src="images/logo5.png"|g' "$file"
    
    # Update brain logo in cards
    sed -i '' 's|<img src="images/brainlogo.png"|<picture><source srcset="images/brainlogo.webp" type="image/webp"><img src="images/brainlogo.png"|g' "$file"
}

# Update main HTML files
for file in index.html about.html research.html blog.html conservation.html; do
    if [ -f "$file" ]; then
        update_file "$file"
        echo "  ✅ $file updated"
    fi
done

echo ""
echo "✅ HTML files updated for WebP!"
echo ""
echo "💡 To revert changes, restore from backups_html/"
echo ""
echo "Next: Test your site locally to ensure images load correctly"
echo "  python3 -m http.server 8000"
echo "  Then visit: http://localhost:8000"
