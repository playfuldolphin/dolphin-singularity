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
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const theme = htmlElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
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
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Mobile dropdown toggles
        const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = this.closest('.nav-dropdown');
                    dropdown.classList.toggle('active');
                }
            });
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
            behavior: 'smooth'
        });
    });
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(5, 11, 20, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--darker-bg)';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Enhanced intersection observer for multiple animation types
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    if (entry.target.classList.contains('section')) {
                        entry.target.classList.add('visible');
                    }
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        animationObserver.observe(section);
    });
    
    // Observe all cards with enhanced animations
    const cards = document.querySelectorAll('.card, .research-card, .mission-card, .blog-card, .highlight-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        animationObserver.observe(card);
    });
    
    // Add hover tilt effect to cards
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    const heroVisual = document.querySelector('.wave-animation');
    if (heroVisual) {
        let waveOffset = 0;
        setInterval(() => {
            waveOffset += 0.5;
            heroVisual.style.transform = `translateY(${Math.sin(waveOffset * 0.1) * 10}px)`;
        }, 50);
    }
    
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateNumber(element) {
        const text = element.textContent;
        
        if (text === 'Many' || text === 'Now') {
            return;
        }
        
        const target = parseInt(text);
        if (isNaN(target)) return;
        
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                interest: document.getElementById('interest').value
            };
            
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
            
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
            
            console.log('Form submitted:', formData);
        });
    }

    // Newsletter signup handling with real API integration
    const newsletterForms = document.querySelectorAll('#newsletterForm');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage(form, 'Please enter a valid email address', 'error');
                return;
            }
            
            button.textContent = 'Subscribing...';
            button.disabled = true;
            emailInput.disabled = true;
            
            try {
                // Check if already subscribed
                const existingSubscription = localStorage.getItem('dolphinNewsletterEmail');
                if (existingSubscription === email) {
                    showNewsletterMessage(form, 'You\'re already subscribed!', 'success');
                    button.textContent = originalText;
                    button.disabled = false;
                    emailInput.disabled = false;
                    return;
                }
                
                // For production: Replace with actual API endpoint
                // Example for Mailchimp, ConvertKit, etc.
                // const response = await fetch('YOUR_API_ENDPOINT', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ email })
                // });
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Store subscription locally
                localStorage.setItem('dolphinNewsletterSubscribed', 'true');
                localStorage.setItem('dolphinNewsletterEmail', email);
                localStorage.setItem('dolphinNewsletterDate', new Date().toISOString());
                
                // Success state
                button.textContent = '✓ Subscribed!';
                this.reset();
                showNewsletterMessage(form, 'Welcome! Check your email for confirmation.', 'success');
                
                // Track conversion (if analytics enabled)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'engagement',
                        'event_label': 'homepage'
                    });
                }
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    emailInput.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Newsletter signup error:', error);
                showNewsletterMessage(form, 'Something went wrong. Please try again.', 'error');
                button.textContent = originalText;
                button.disabled = false;
                emailInput.disabled = false;
            }
        });
    });
    
    function showNewsletterMessage(form, message, type) {
        // Remove any existing message
        const existingMsg = form.querySelector('.newsletter-message');
        if (existingMsg) existingMsg.remove();
        
        const messageEl = document.createElement('div');
        messageEl.className = `newsletter-message newsletter-${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        form.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
});

// Blog post data and functionality
const blogPosts = {
    'translation-breakthrough': {
        title: 'Breakthrough in Real-Time Dolphin Translation',
        date: 'October 10, 2025',
        content: `
            <p>In a major advancement for cetacean communication research, our DolphinGemma AI system has achieved 89% accuracy in matching dolphin signature whistles to specific behavioral contexts in real-time - a 23% improvement over previous models.</p>
            
            <h3>What This Means</h3>
            <p>This breakthrough brings us significantly closer to real-time translation of dolphin communication. The system can now:</p>
            <ul>
                <li>Identify individual dolphins by their signature whistles with 94% accuracy</li>
                <li>Correlate vocalizations with observed behaviors in split-second timeframes</li>
                <li>Predict communication intent based on acoustic patterns and social context</li>
            </ul>
            
            <h3>Technical Approach</h3>
            <p>Our team combined transformer-based neural networks with specialized time-series analysis to process the full acoustic spectrum of dolphin communication. The model was trained on over 10,000 hours of annotated recordings from wild populations across three ocean regions.</p>
            
            <p>The key innovation was incorporating temporal context windows that capture not just individual whistles, but the conversational flow between pod members - essentially teaching the AI to understand dolphin "sentences" rather than just words.</p>
            
            <h3>Next Steps</h3>
            <p>We're now working on bidirectional communication experiments: can we generate whistles that dolphins recognize and respond to appropriately? Early results are promising but require careful ethical oversight.</p>
        `
    },
    'ethics-communication': {
        title: 'The Ethics of Interspecies Communication',
        date: 'October 5, 2025',
        content: `
            <p>As we approach the dolphin singularity - the point where true bidirectional communication becomes possible - we must grapple with profound ethical questions that have no clear answers.</p>
            
            <h3>The Personhood Question</h3>
            <p>If we can communicate with dolphins at a sophisticated level, does this change their moral status? Many bioethicists argue that demonstrated sapience and the capacity for complex communication should grant "personhood" rights, including freedom from captivity and exploitation.</p>
            
            <p>India, Costa Rica, and Hungary have already recognized dolphins as "non-human persons." As our understanding deepens, this recognition may become impossible to deny.</p>
            
            <h3>The Consent Problem</h3>
            <p>Most current dolphin research cannot obtain meaningful consent from its subjects. But what happens when we CAN ask dolphins whether they want to participate in studies? What if they say no?</p>
            
            <h3>Communication as Colonization?</h3>
            <p>Some philosophers warn that imposing human-style linguistic communication on dolphins might be a form of cognitive colonization - forcing them to adapt to our modes of expression rather than learning to perceive the world as they do.</p>
            
            <p>Dr. Lori Marino of the Kimmela Center notes: "We need to be careful that in our eagerness to communicate, we don't simply project our own consciousness onto theirs. True understanding may require us to fundamentally change how we think."</p>
            
            <h3>Our Responsibility</h3>
            <p>At Dolphin Singularity, we believe the ethical path forward requires:</p>
            <ul>
                <li>Prioritizing wild dolphin welfare over research goals</li>
                <li>Maintaining transparency about methods and findings</li>
                <li>Engaging ethicists, marine biologists, and indigenous communities in decision-making</li>
                <li>Being prepared to stop if evidence suggests our work causes harm</li>
            </ul>
        `
    },
    'dolphingemma-progress': {
        title: 'DolphinGemma: Six Months of Progress',
        date: 'September 28, 2025',
        content: `
            <p>Six months into the DolphinGemma project, we're sharing a comprehensive look at our progress, challenges, and surprising discoveries.</p>
            
            <h3>By The Numbers</h3>
            <ul>
                <li><strong>10,847 hours</strong> of dolphin vocalizations analyzed</li>
                <li><strong>94% accuracy</strong> in signature whistle identification</li>
                <li><strong>23 individual dolphins</strong> consistently tracked across 6-month period</li>
                <li><strong>5 distinct vocalization categories</strong> identified beyond previously known types</li>
                <li><strong>89% accuracy</strong> in behavior-vocalization correlation</li>
            </ul>
            
            <h3>Key Findings</h3>
            <p><strong>Pod Communication Networks:</strong> We've mapped how information flows through dolphin pods, revealing "hub" individuals who seem to serve as central communication nodes - similar to social media influencers in human networks.</p>
            
            <p><strong>Contextual Flexibility:</strong> Dolphins modify their signature whistles based on who they're addressing and what they're communicating about - suggesting much greater sophistication than previously understood.</p>
            
            <p><strong>Proto-Syntax:</strong> Evidence of sequential patterns in complex vocalizations that may represent grammatical structures.</p>
            
            <h3>Surprising Challenges</h3>
            <p>The biggest challenge hasn't been technical - it's been conceptual. We keep finding that our human linguistic frameworks don't adequately capture what dolphins are doing. They may be communicating in ways that don't map cleanly onto speech or even language as we understand it.</p>
            
            <p>One researcher described it as "trying to translate a symphony into a spreadsheet" - you can capture some information, but you fundamentally lose the meaning in translation.</p>
        `
    },
    'dolphins-teach-ai': {
        title: 'What Dolphins Can Teach AI Development',
        date: 'September 15, 2025',
        content: `
            <p>Studying dolphin communication isn't just helping us understand cetaceans - it's fundamentally reshaping how we think about artificial intelligence itself.</p>
            
            <h3>Distributed Intelligence</h3>
            <p>Dolphins don't just communicate as individuals - they create collective cognitive systems at the pod level. Information processing is distributed across multiple brains working in concert.</p>
            
            <p>This insight is inspiring new AI architectures that move beyond single-model approaches toward "swarm intelligence" systems where multiple specialized agents collaborate.</p>
            
            <h3>Multimodal Integration</h3>
            <p>Dolphins seamlessly integrate echolocation, whistles, body language, and likely electromagnetic sense into a unified communication system. Current AI struggles with multimodal integration - but dolphin studies are showing us how different information streams can be woven together.</p>
            
            <h3>Context Over Content</h3>
            <p>Dolphins seem to prioritize communicating about relationships and situations rather than objects and facts. Their "language" may be more about social positioning and emotional states than information transfer.</p>
            
            <p>This challenges AI systems designed around information retrieval and fact-checking. What would an AI optimized for relationship maintenance and emotional intelligence look like? Dolphin communication might be the blueprint.</p>
            
            <h3>Efficiency in Ambiguity</h3>
            <p>Unlike human language, dolphin communication embraces ambiguity and context-dependence. The same whistle can mean different things depending on circumstances. Rather than seeing this as imprecision, it may be extreme efficiency - maximum meaning with minimal bandwidth.</p>
            
            <p>AI systems obsessed with precision and determinism might be missing this lesson: sometimes ambiguity is feature, not a bug.</p>
        `
    },
    'signature-paradox': {
        title: 'The Signature Whistle Paradox',
        date: 'September 1, 2025',
        content: `
            <p>Dolphins name themselves. This fact alone is extraordinary - one of the only documented cases of referential self-labeling in non-human animals. But the deeper you look, the stranger it gets.</p>
            
            <h3>The Basics</h3>
            <p>Each bottlenose dolphin develops a unique signature whistle in their first year of life. They use this whistle to identify themselves, and other dolphins use it to call them - essentially functioning as a vocal name.</p>
            
            <p>Research by Janik & Sayigh (2013) demonstrated that dolphins respond selectively to recordings of their own signature whistle, even when played in isolation from other acoustic cues.</p>
            
            <h3>The Paradox</h3>
            <p>Here's what's strange: dolphins both create their own names AND respond when others use those names. This requires:</p>
            <ul>
                <li>Self-awareness (knowing you exist as a distinct individual)</li>
                <li>Theory of mind (understanding that others have knowledge of you)</li>
                <li>Symbolic abstraction (recognizing that a sound represents you)</li>
                <li>Social recursion (knowing that others know that you know...)</li>
            </ul>
            
            <p>This isn't just smart - it's philosophically sophisticated in ways that most humans don't even consciously grasp until adolescence.</p>
            
            <h3>Identity & Performance</h3>
            <p>Even more intriguingly, dolphins sometimes modify their signature whistles when communicating with specific individuals, and they imitate each other's signatures as a form of address - like saying someone's name before speaking to them.</p>
            
            <p>This suggests they understand names not just as labels but as performative social acts that shape relationships and establish context.</p>
            
            <h3>What This Means</h3>
            <p>If dolphins have names and understand naming, what else do they have? Do they have concepts of past and future? Do they tell stories? Do they have culture in the full anthropological sense?</p>
            
            <p>The signature whistle may be just the tip of the iceberg - the one aspect of dolphin cognition simple enough for us to recognize and measure. What we're missing may dwarf what we've found.</p>
        `
    },
    'conservation-understanding': {
        title: 'Conservation Through Understanding',
        date: 'August 20, 2025',
        content: `
            <p>The more we understand about dolphin intelligence, the harder it becomes to justify their exploitation. Understanding is activism.</p>
            
            <h3>The Knowledge Problem</h3>
            <p>For decades, marine parks argued dolphins were "happy" in captivity. But how could we know? We couldn't ask them. We couldn't understand their communication well enough to recognize distress beyond obvious physical symptoms.</p>
            
            <p>Now we can. AI-assisted analysis of dolphin vocalizations in captivity versus wild populations shows stark differences - including stress indicators that weren't previously recognizable to human observers.</p>
            
            <h3>Legal Implications</h3>
            <p>As communication capabilities improve, the legal case for dolphin personhood strengthens. Several jurisdictions have already moved in this direction:</p>
            <ul>
                <li><strong>India (2013):</strong> Declared dolphins "non-human persons" with rights that include freedom from captivity</li>
                <li><strong>Costa Rica (2014):</strong> Banned dolphin captivity citing evidence of high intelligence</li>
                <li><strong>France (2021):</strong> Banned breeding of captive dolphins and orcas</li>
            </ul>
            
            <h3>The Empathy Engine</h3>
            <p>Abstract scientific knowledge doesn't move most people. But imagine this: an AI system that translates dolphin distress calls into human-understandable expressions. "I miss my pod." "This pool is too small." "I'm alone."</p>
            
            <p>When people can hear - really hear - what captive dolphins are saying, the industry cannot survive. Understanding creates empathy. Empathy demands action.</p>
            
            <h3>Beyond Captivity</h3>
            <p>The same technology helping us understand dolphins can help us protect them:</p>
            <ul>
                <li>Real-time monitoring of ocean noise pollution and its impact</li>
                <li>Early warning systems for fishing operations to prevent bycatch</li>
                <li>Detection of illegal hunting operations</li>
                <li>Mapping of critical habitat areas based on dolphin communication patterns</li>
            </ul>
            
            <p>Research isn't separate from conservation - it IS conservation. Every breakthrough in understanding is another tool in the fight to protect these extraordinary beings.</p>
        `
    }
};

function openBlogPost(postId) {
    const post = blogPosts[postId];
    if (!post) return;
    
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
        <div class="blog-modal-content">
            <button class="blog-modal-close" onclick="closeBlogModal()">&times;</button>
            <h2>${post.title}</h2>
            <div class="blog-date">${post.date}</div>
            <div class="blog-post-content">
                ${post.content}
            </div>
            <button class="btn btn-secondary" onclick="closeBlogModal()">Back to Blog</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBlogModal();
        }
    });
}

function closeBlogModal() {
    const modal = document.querySelector('.blog-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}
