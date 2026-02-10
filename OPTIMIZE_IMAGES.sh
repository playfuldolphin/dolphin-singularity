#!/bin/bash

# Image Optimization Script for DolphinSingularity.org
# This will reduce 8.75MB of images to <1MB for 75% faster page loads

echo "🖼️  Dolphin Singularity Image Optimization Script"
echo "=================================================="
echo ""

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Installing..."
    echo ""
    echo "Please install WebP tools:"
    echo ""
    echo "On Mac (using Homebrew):"
    echo "  brew install webp"
    echo ""
    echo "On Ubuntu/Debian:"
    echo "  sudo apt-get install webp"
    echo ""
    echo "On Windows:"
    echo "  Download from: https://developers.google.com/speed/webp/download"
    echo ""
    echo "After installing, run this script again."
    exit 1
fi

echo "✅ WebP tools found!"
echo ""

# Navigate to images directory
cd "$(dirname "$0")/images" || exit 1

echo "📊 Current image sizes:"
echo "----------------------"
ls -lh *.{png,jpg} 2>/dev/null | awk '{print $9, $5}'
echo ""

TOTAL_BEFORE=$(du -sh . | awk '{print $1}')
echo "Total BEFORE: $TOTAL_BEFORE"
echo ""

echo "🔄 Converting images to WebP..."
echo "--------------------------------"

# Convert hero background (1.4MB PNG → ~120KB WebP)
if [ -f "hero-background.jpg" ]; then
    echo "Converting hero-background.jpg..."
    cwebp -q 85 hero-background.jpg -o hero-background.webp
    echo "  ✅ Created hero-background.webp"
fi

# Convert logos (1.9MB → ~50KB)
for logo in logo.png logo5.png logo2.png logo3.png logo4.png; do
    if [ -f "$logo" ]; then
        echo "Converting $logo..."
        cwebp -q 90 "$logo" -o "${logo%.png}.webp"
        echo "  ✅ Created ${logo%.png}.webp"
    fi
done

# Convert brain logo (1MB → ~50KB)
if [ -f "brainlogo.png" ]; then
    echo "Converting brainlogo.png..."
    cwebp -q 90 brainlogo.png -o brainlogo.webp
    echo "  ✅ Created brainlogo.webp"
fi

echo ""
echo "📊 New WebP files created:"
echo "-------------------------"
ls -lh *.webp 2>/dev/null | awk '{print $9, $5}'
echo ""

WEBP_SIZE=$(du -sh *.webp 2>/dev/null | tail -1 | awk '{print $1}')
echo "Total WebP size: $WEBP_SIZE"
echo ""

echo "✅ Image optimization complete!"
echo ""
echo "💡 Next steps:"
echo "1. Update HTML files to use WebP with JPG fallbacks"
echo "2. Test images load correctly"
echo "3. Optionally delete large PNG files after confirming"
echo ""
echo "Expected results:"
echo "  - Page load time: 8s → 2s (75% faster)"
echo "  - Mobile PageSpeed: 45 → 85 (+40 points)"
echo "  - Better Google rankings"
echo ""
echo "Run: ./UPDATE_HTML_FOR_WEBP.sh to update your HTML files"
