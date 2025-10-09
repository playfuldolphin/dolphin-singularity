# Dolphin Singularity

A website exploring the convergence of AI technology and dolphin communication to advance conservation and understanding of cetacean intelligence.

## About

This website focuses on:
- AI-powered dolphin communication research (DolphinGemma project)
- Conservation efforts (The Dolphin Project)
- The future of human-dolphin interaction
- Protecting dolphin populations worldwide

## Features

- Responsive modern design
- Smooth scroll navigation
- Interactive animations
- Mobile-friendly interface
- Fast loading static site

## Local Development

Simply open `index.html` in your web browser to view the site locally.

### Using a Local Server

For better performance and to avoid CORS issues, you can use a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

## Deployment

This is a static website that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

### Example: Deploy to GitHub Pages

1. Create a repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/dolphinsingularity.org.git
git push -u origin main
```
3. Enable GitHub Pages in repository settings (use `main` branch)

## File Structure

```
dolphinsingularity.org/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # Interactive features
└── README.md          # This file
```

## Content Sources

- **The Dolphin Project**: https://www.dolphinproject.com
- **DolphinGemma**: AI research in dolphin communication
- Conservation research and marine biology studies

## Future Enhancements

- Add blog section for research updates
- Include video content
- Interactive dolphin sound visualizations
- Newsletter signup
- Donation integration
- Multi-language support

## License

© 2025 DolphinSingularity.org. All rights reserved.

## Contact

For questions or collaboration opportunities, visit the website.
