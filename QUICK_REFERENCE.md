# 🐬 Quick Reference Guide

## New Files Created

### HTML Pages (5)
```
/story.html                 - Interactive sci-fi script
/visualizer.html            - Audio visualization tool
/team.html                  - Researcher profiles
/share-encounter.html       - Community submission form
```

### JavaScript (3)
```
/js/newsletter.js           - Newsletter subscription handler
/js/sound-visualizer.js     - Audio visualization engine
/js/analytics.js            - Tracking and conversion analytics
```

### CSS Modules (5)
```
/css/variables.css          - Design tokens & theme
/css/base.css               - Reset & typography
/css/components.css         - Reusable UI components
/css/navigation.css         - Nav & menu styles
/css/animations.css         - Transitions & keyframes
/styles-optimized.css       - Main import file
```

### Serverless Functions (1)
```
/netlify/functions/subscribe.js  - Newsletter backend
```

### Documentation (3)
```
/IMPLEMENTATION_GUIDE.md    - Detailed implementation steps
/DEPLOYMENT_SUMMARY.md      - Complete feature overview
/QUICK_REFERENCE.md         - This file
/.env.example               - Environment variables template
```

---

## Quick Commands

### Start Local Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

### Convert Images to WebP
```bash
# Install cwebp first
brew install webp  # macOS
apt-get install webp  # Linux

# Convert images
cwebp input.png -o output.webp
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## Essential Links

### Your New Pages
- Story: `https://dolphinsingularity.org/story.html`
- Visualizer: `https://dolphinsingularity.org/visualizer.html`
- Team: `https://dolphinsingularity.org/team.html`
- Share Encounter: `https://dolphinsingularity.org/share-encounter.html`

### Setup Tools
- Giscus (Comments): https://giscus.app
- Buttondown (Newsletter): https://buttondown.email
- Google Analytics: https://analytics.google.com
- Netlify: https://netlify.com

---

## Code Snippets

### Add Newsletter to Page
```html
<script src="js/newsletter.js"></script>
```

### Add Analytics to Page
```html
<meta name="google-analytics" content="G-XXXXXXXXXX">
<script src="js/analytics.js"></script>
```

### Track Custom Event
```javascript
analytics.trackEvent('event_name', {
  category: 'engagement',
  label: 'button_click'
});
```

### Track Donation
```javascript
analytics.trackDonation(50.00, 'USD', 'paypal');
```

---

## Navigation Update Template

```html
<li><a href="index.html">Home</a></li>
<li><a href="research.html">Research</a></li>
<li><a href="blog.html">Blog</a></li>
<li><a href="story.html">Story</a></li>        <!-- NEW -->
<li><a href="visualizer.html">Visualizer</a></li>  <!-- NEW -->
<li><a href="team.html">Team</a></li>          <!-- NEW -->
<li><a href="conservation.html">Conservation</a></li>
<li><a href="contact.html">Contact</a></li>
```

---

## Testing Checklist

```
□ Story page loads and auto-scroll works
□ Visualizer displays and plays sounds
□ Team page shows all 6 researchers
□ Encounter form submits successfully
□ Newsletter signup works
□ Analytics tracking fires
□ Mobile navigation works
□ All internal links work
□ Images load correctly
□ Forms have validation
```

---

## Troubleshooting

### Newsletter Not Working
- Check API key in `.env`
- Verify provider configured in `newsletter.js`
- Check browser console for errors
- Test with curl/Postman first

### Visualizer No Sound
- Check browser audio permissions
- Verify Web Audio API supported
- Look for console errors
- Try different browser

### Analytics Not Tracking
- Verify GA4 ID correct
- Check meta tag present
- Use GA Debugger extension
- Wait 24-48 hours for data

### Forms Not Submitting
- Verify Netlify Forms enabled
- Check form name attribute
- Look for honeypot field
- Test on live site (not localhost)

---

## Performance Tips

### Images
- Use WebP with JPG/PNG fallback
- Compress images to <200KB
- Use lazy loading: `loading="lazy"`
- Optimize with: https://squoosh.app

### CSS
- Use `styles-optimized.css` for production
- Remove unused styles
- Minify for production
- Use CSS custom properties

### JavaScript
- Load scripts at end of body
- Use `defer` or `async` attributes
- Minify for production
- Bundle common dependencies

---

## Feature Flags

### Enable Features
```javascript
// In newsletter.js
const config = {
  provider: 'buttondown',  // 'convertkit' or 'mailchimp'
  apiKey: 'YOUR_KEY'
};

// In analytics.js
analytics.initGA4('G-XXXXXXXXXX');
```

---

## Quick Fixes

### Update All Navigation
```bash
# Find all nav sections
grep -r "nav-links" *.html

# Update each file manually or use sed
```

### Add Script to All Pages
```bash
# Add before </body> in all HTML files
for file in *.html; do
  sed -i '' 's|</body>|<script src="js/newsletter.js"></script>\n</body>|' "$file"
done
```

---

## Support

**Questions?** Check:
1. IMPLEMENTATION_GUIDE.md
2. DEPLOYMENT_SUMMARY.md
3. Code comments in files
4. GitHub issues
5. dolphinsingularity@gmail.com

---

## Version History

- **v2.0** (Nov 2025) - Major upgrade with 10 new features
- **v1.0** (Earlier) - Original launch

**Current Version**: 2.0  
**Last Updated**: November 26, 2025
