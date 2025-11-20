# Agent Guidelines for DolphinSingularity.org

## Project Type
Static website with HTML, CSS, and vanilla JavaScript. No build process or package manager.

## Development Commands
- **Local Server**: Use any static server (e.g., `python -m http.server 8000` or VS Code Live Server)
- **Validation**: Use W3C validators for HTML/CSS, ESLint for JavaScript
- **Testing**: Manual testing in Chrome, Firefox, Safari (no automated tests)

## Code Style Guidelines
- **HTML**: Semantic HTML5, consistent 4-space indentation, lowercase tags/attributes
- **CSS**: Use CSS variables in :root, BEM-style naming for components, mobile-first responsive design
- **JavaScript**: ES6+ features, camelCase variables/functions, UPPERCASE for constants
- **File Naming**: Lowercase with hyphens (e.g., `about-page.html`, `dolphin-styles.css`)
- **Images**: Store in `/images/` with descriptive names, optimize for web (<200KB), include alt text

## Key Patterns
- Product links stored in `PRODUCT_LINKS` object in script.js
- Modal/overlay pattern for blog posts using JavaScript
- Form submissions handled client-side with preventDefault
- Intersection Observer for scroll animations
- No external JS libraries - pure vanilla implementation

## Important Notes
- AdSense integration requires substantial content (300+ words per page)
- All pages must include privacy policy and terms links in footer
- Maintain accessibility: semantic HTML, ARIA labels, keyboard navigation
- Conservation focus: avoid trivializing dolphins or using excessive emojis