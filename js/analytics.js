/**
 * Analytics and Conversion Tracking
 * Handles Google Analytics, Facebook Pixel, and custom events
 */

class AnalyticsManager {
    constructor() {
        this.initialized = false;
        this.gaId = null;
        this.fbPixelId = null;
    }

    /**
     * Initialize Google Analytics 4
     */
    initGA4(measurementId) {
        this.gaId = measurementId;
        
        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', measurementId);
        
        window.gtag = gtag;
        this.initialized = true;
    }

    /**
     * Initialize Facebook Pixel
     */
    initFacebookPixel(pixelId) {
        this.fbPixelId = pixelId;
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', pixelId);
        fbq('track', 'PageView');
    }

    /**
     * Track donation conversion
     */
    trackDonation(amount, currency = 'USD', method = 'unknown') {
        // Google Analytics
        if (window.gtag) {
            gtag('event', 'purchase', {
                transaction_id: Date.now().toString(),
                value: amount,
                currency: currency,
                items: [{
                    item_name: 'Donation',
                    item_category: 'Support',
                    price: amount,
                    quantity: 1
                }]
            });
            
            // Custom donation event
            gtag('event', 'donation', {
                event_category: 'engagement',
                event_label: `donation_${method}`,
                value: amount,
                currency: currency
            });
        }
        
        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Donate', {
                value: amount,
                currency: currency
            });
        }
        
        console.log(`Donation tracked: ${currency} ${amount}`);
    }

    /**
     * Track newsletter signup
     */
    trackNewsletterSignup(email) {
        if (window.gtag) {
            gtag('event', 'sign_up', {
                method: 'newsletter'
            });
            
            gtag('event', 'generate_lead', {
                event_category: 'engagement',
                event_label: 'newsletter_signup'
            });
        }
        
        if (window.fbq) {
            fbq('track', 'Lead');
        }
        
        console.log('Newsletter signup tracked');
    }

    /**
     * Track page view
     */
    trackPageView(page_path, page_title) {
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_path: page_path,
                page_title: page_title
            });
        }
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, params = {}) {
        if (window.gtag) {
            gtag('event', eventName, params);
        }
        
        console.log(`Event tracked: ${eventName}`, params);
    }

    /**
     * Track sound player interactions
     */
    trackSoundPlay(soundType) {
        this.trackEvent('sound_play', {
            event_category: 'engagement',
            event_label: soundType
        });
    }

    /**
     * Track visualizer interactions
     */
    trackVisualizerChange(visualizationType) {
        this.trackEvent('visualizer_change', {
            event_category: 'engagement',
            event_label: visualizationType
        });
    }

    /**
     * Track story reading progress
     */
    trackStoryProgress(sceneNumber, totalScenes) {
        const progress = Math.round((sceneNumber / totalScenes) * 100);
        
        if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
            this.trackEvent('story_progress', {
                event_category: 'engagement',
                event_label: `${progress}%_complete`
            });
        }
    }

    /**
     * Track research page engagement
     */
    trackResearchEngagement(action, label) {
        this.trackEvent('research_engagement', {
            event_category: 'research',
            event_label: label,
            action: action
        });
    }

    /**
     * Track social shares
     */
    trackSocialShare(platform, url) {
        this.trackEvent('share', {
            method: platform,
            content_type: 'website',
            item_id: url
        });
    }

    /**
     * Track form submissions
     */
    trackFormSubmission(formName) {
        this.trackEvent('form_submit', {
            event_category: 'engagement',
            event_label: formName
        });
    }

    /**
     * Track outbound links
     */
    trackOutboundLink(url, label) {
        this.trackEvent('click', {
            event_category: 'outbound',
            event_label: label,
            url: url
        });
    }

    /**
     * Track downloads
     */
    trackDownload(fileName) {
        this.trackEvent('file_download', {
            event_category: 'engagement',
            event_label: fileName
        });
    }
}

// Initialize and expose globally
const analytics = new AnalyticsManager();

// Auto-init if GA ID is in environment or meta tag
document.addEventListener('DOMContentLoaded', function() {
    const gaMeta = document.querySelector('meta[name="google-analytics"]');
    const fbMeta = document.querySelector('meta[name="facebook-pixel"]');
    
    if (gaMeta && gaMeta.content) {
        analytics.initGA4(gaMeta.content);
    }
    
    if (fbMeta && fbMeta.content) {
        analytics.initFacebookPixel(fbMeta.content);
    }

    // Track outbound links automatically
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                analytics.trackOutboundLink(this.href, this.textContent || 'Link');
            });
        }
    });

    // Track download links
    document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".zip"]').forEach(link => {
        link.addEventListener('click', function() {
            const fileName = this.href.split('/').pop();
            analytics.trackDownload(fileName);
        });
    });

    // Track social share buttons
    document.querySelectorAll('[data-share]').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.getAttribute('data-share');
            analytics.trackSocialShare(platform, window.location.href);
        });
    });
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.analytics = analytics;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
}
