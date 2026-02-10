# Image Optimization Guide for DolphinSingularity.org

## Current Images That Need Optimization

### Large Images to Compress:
1. **hero-background.png** - Hero section background
2. **logo.png, logo2.png, logo3.png, logo4.png, logo5.png** - Multiple logo versions
3. **brainlogo.png** - AI brain icon

## Optimization Steps

### 1. For PNG Images (logos, icons):
```bash
# Install pngquant (lossy compression)
brew install pngquant

# Compress PNG files (up to 70% reduction)
pngquant --quality=65-80 images/*.png --output images/compressed/
```

### 2. For JPG Images (photos):
```bash
# Install jpegoptim
brew install jpegoptim

# Compress JPG files
jpegoptim --size=200k images/*.jpg
```

### 3. Convert to WebP (modern format):
```bash
# Install cwebp
brew install webp

# Convert images to WebP
for file in images/*.{png,jpg}; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

### 4. Implement Responsive Images in HTML:
```html
<picture>
  <source srcset="images/hero-background.webp" type="image/webp">
  <source srcset="images/hero-background-small.jpg" media="(max-width: 768px)">
  <img src="images/hero-background.png" alt="Dolphin hero image">
</picture>
```

### 5. Add Lazy Loading:
```html
<img src="image.jpg" loading="lazy" alt="Description">
```

## Recommended Sizes:
- Hero images: 1920x1080 max, compressed to <300KB
- Logos: 200x200 for nav, retain transparency
- Blog images: 800x600 max, <150KB
- Thumbnails: 300x200, <50KB

## Tools:
- Online: TinyPNG, Squoosh.app
- CLI: imagemin, sharp
- GUI: ImageOptim (Mac), FileOptimizer (Windows)

## Performance Goals:
- Total page weight under 2MB
- Hero image under 300KB
- Logo files under 20KB each
- Achieve 90+ Google PageSpeed score