const PRODUCT_LINKS = {
    tshirt: 'https://dolphin-singularity.printful.me/product/signature-whistle-tshirt',
    hoodie: 'https://dolphin-singularity.printful.me/product/ocean-guardian-hoodie',
    tote: 'https://dolphin-singularity.printful.me/product/eco-warrior-tote',
    bundle: 'https://dolphin-singularity.printful.me/product/conservation-bundle',
    mug: 'https://dolphin-singularity.printful.me/product/morning-waves-mug',
    print: 'https://dolphin-singularity.printful.me/product/acoustic-art-print'
};

// Page loader
window.addEventListener('load', function() {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hide');
        }, 1000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    let currentTheme = 'light';
    try {
        if (themeToggle) currentTheme = localStorage.getItem('theme') || 'light';
    } catch (_) { /* Storage can be unavailable in private browsing. */ }
    htmlElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const theme = htmlElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            try { localStorage.setItem('theme', newTheme); } catch (_) { /* Optional preference. */ }
            
            // Announce to screen readers
            const announcement = newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled';
            const srAnnouncement = document.createElement('div');
            srAnnouncement.setAttribute('role', 'status');
            srAnnouncement.setAttribute('aria-live', 'polite');
            srAnnouncement.className = 'sr-only';
            srAnnouncement.textContent = announcement;
            document.body.appendChild(srAnnouncement);
            setTimeout(() => srAnnouncement.remove(), 1000);
        });
    }
    
    // Social Share Bar functionality
    const shareBar = document.getElementById('shareBar');
    if (shareBar) {
        // Hide share bar on mobile
        function updateShareBarVisibility() {
            if (window.innerWidth <= 768) {
                shareBar.style.display = 'none';
            } else {
                shareBar.style.display = 'flex';
            }
        }
        
        updateShareBarVisibility();
        window.addEventListener('resize', updateShareBarVisibility);
        
        // Animate share bar on scroll
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) {
                if (window.scrollY > 200) {
                    shareBar.style.opacity = '1';
                    shareBar.style.transform = 'translateY(-50%) translateX(0)';
                } else {
                    shareBar.style.opacity = '0';
                    shareBar.style.transform = 'translateY(-50%) translateX(-100px)';
                }
            }
        });
    }
    
    const productButtons = document.querySelectorAll('[data-product]');
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product');
            const productUrl = PRODUCT_LINKS[productId];
            
            if (productUrl && !productUrl.includes('YOUR-STORE')) {
                window.open(productUrl, '_blank');
            } else {
                alert('Store coming soon! Email dolphinsingularity@gmail.com for early access and updates.');
            }
        });
    });
    
    const paperCategories = document.querySelectorAll('.paper-category h4');
    paperCategories.forEach(heading => {
        heading.addEventListener('click', function() {
            this.parentElement.classList.toggle('collapsed');
        });
    });
    
    // Web Share API for mobile sharing
    const shareButtons = document.querySelectorAll('.share-bar a, .social-links a[href*="twitter"], .social-links a[href*="facebook"]');
    shareButtons.forEach(button => {
        // Only add Web Share to social share buttons, not all links
        if (button.getAttribute('aria-label')?.includes('Share') || button.closest('.share-bar')) {
            button.addEventListener('click', async function(e) {
                // Only use Web Share API on mobile devices
                if (navigator.share && window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    const pageTitle = document.title;
                    const pageUrl = window.location.href;
                    const pageDescription = document.querySelector('meta[name="description"]')?.content || 
                                          'Discover AI-powered dolphin communication research';
                    
                    try {
                        await navigator.share({
                            title: pageTitle,
                            text: pageDescription,
                            url: pageUrl
                        });
                        console.log('Successfully shared via Web Share API');
                    } catch (err) {
                        // User cancelled or error occurred, let default behavior happen
                        if (err.name !== 'AbortError') {
                            console.log('Web Share failed, using default sharing:', err);
                        }
                    }
                }
                // On desktop, let the default link behavior work (open Twitter/Facebook/etc)
            });
        }
    });
    
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    });
});
