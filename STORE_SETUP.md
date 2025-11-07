# Store Setup Guide

## Quick Start: Setting Up Your Merch Store

### Option 1: Printful (Recommended)

**Why Printful:**
- Free to set up, no monthly fees
- Print-on-demand (no inventory)
- High quality products
- Automatic fulfillment

**Setup Steps:**

1. **Create Account**: Go to [printful.com](https://www.printful.com) and sign up

2. **Create Products**:
   - Click "Add Product" 
   - Choose product type (t-shirt, hoodie, mug, etc.)
   - Upload your designs
   - Set your retail prices

3. **Get Product Links**:
   - For each product, click "Store" → "Direct Link"
   - Copy the product URL

4. **Update Your Website**:
   - Open `script.js`
   - Find the `PRODUCT_LINKS` section at the top
   - Replace the placeholder URLs with your actual Printful product links:

```javascript
const PRODUCT_LINKS = {
    tshirt: 'https://dolphin-singularity.printful.me/product/1',
    hoodie: 'https://dolphin-singularity.printful.me/product/2',
    tote: 'https://dolphin-singularity.printful.me/product/3',
    bundle: 'https://dolphin-singularity.printful.me/product/4',
    mug: 'https://dolphin-singularity.printful.me/product/5',
    print: 'https://dolphin-singularity.printful.me/product/6'
};
```

5. **Test**: Click the "View Product" buttons on your website to verify the links work

### Option 2: Spring (Teespring)

**Why Spring:**
- Completely free
- No setup fees
- Built-in storefront

**Setup Steps:**

1. Go to [spring.com](https://spring.com)
2. Create account and products
3. Get your storefront URL or individual product URLs
4. Update `PRODUCT_LINKS` in `script.js` with your Spring URLs

### Option 3: Embed Full Storefront

If you want to embed an entire store page instead of individual products:

1. **In index.html**, replace the store section with an iframe:

```html
<section id="store" class="section">
    <div class="container">
        <h2 class="section-title">Support Through Merchandise</h2>
        <p class="section-subtitle">Every purchase supports dolphin research and conservation efforts</p>
        
        <iframe 
            src="https://YOUR-STORE.printful.me" 
            width="100%" 
            height="1200px" 
            frameborder="0"
            style="border-radius: 10px;">
        </iframe>
    </div>
</section>
```

## Adding Product Images

To add real product images instead of emoji placeholders:

1. Create product mockups in Printful/Spring
2. Download the product images
3. Create an `images` folder in your project
4. Update the `product-image` divs in index.html:

```html
<div class="product-image">
    <img src="images/tshirt.jpg" alt="Dolphin Singularity T-Shirt">
</div>
```

## Testing

After setup:
1. Visit your website
2. Click "View Product" buttons
3. Verify they open your store products in a new tab

## Support

Questions? Email dolphinsingularity@gmail.com
