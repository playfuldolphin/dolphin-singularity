/**
 * Newsletter Subscription Handler
 * Supports multiple backends: Buttondown, ConvertKit, Mailchimp
 */

class NewsletterManager {
    constructor(config) {
        this.provider = config.provider || 'buttondown';
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl;
        this.listId = config.listId;
    }

    /**
     * Subscribe user to newsletter
     * @param {string} email - User email address
     * @param {string} name - Optional user name
     * @returns {Promise} Subscription result
     */
    async subscribe(email, name = '') {
        try {
            switch (this.provider) {
                case 'buttondown':
                    return await this.subscribeButtondown(email);
                case 'convertkit':
                    return await this.subscribeConvertKit(email, name);
                case 'mailchimp':
                    return await this.subscribeMailchimp(email, name);
                default:
                    throw new Error('Unsupported provider');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            throw error;
        }
    }

    /**
     * Subscribe via Buttondown (recommended - simple and free)
     */
    async subscribeButtondown(email) {
        const response = await fetch('https://api.buttondown.email/v1/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.apiKey}`
            },
            body: JSON.stringify({
                email: email,
                tags: ['dolphinsingularity']
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Subscription failed');
        }

        return await response.json();
    }

    /**
     * Subscribe via ConvertKit
     */
    async subscribeConvertKit(email, name) {
        const response = await fetch(`https://api.convertkit.com/v3/forms/${this.listId}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: this.apiKey,
                email: email,
                first_name: name
            })
        });

        if (!response.ok) {
            throw new Error('Subscription failed');
        }

        return await response.json();
    }

    /**
     * Subscribe via Mailchimp
     */
    async subscribeMailchimp(email, name) {
        // Note: Mailchimp requires server-side API calls due to CORS
        // This would need a serverless function or backend endpoint
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                name: name
            })
        });

        if (!response.ok) {
            throw new Error('Subscription failed');
        }

        return await response.json();
    }
}

// Initialize newsletter form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Configure your newsletter provider here
    // TO ENABLE: Sign up at https://buttondown.email (FREE for 1,000 subscribers)
    // Get API key from: Settings → API
    const newsletterConfig = {
        provider: 'buttondown', // Change to 'convertkit' or 'mailchimp' as needed
        apiKey: 'YOUR_BUTTONDOWN_API_KEY', // TODO: Replace with your Buttondown API key!
        // For ConvertKit, add: listId: 'your-form-id'
        // For Mailchimp, this should call a serverless function
    };

    const newsletter = new NewsletterManager(newsletterConfig);

    // Find all newsletter forms
    const forms = document.querySelectorAll('#newsletterForm, .newsletter-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage(this, 'Please enter a valid email address', 'error');
                return;
            }
            
            // Disable form during submission
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading"></span> Subscribing...';
            
            try {
                // Check if API key is configured
                const isConfigured = newsletterConfig.apiKey && 
                                   newsletterConfig.apiKey !== 'YOUR_BUTTONDOWN_API_KEY';
                
                if (!isConfigured) {
                    // Demo mode - store locally and warn
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Store in localStorage for demo
                    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
                    if (!subscribers.includes(email)) {
                        subscribers.push(email);
                        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
                    }
                    
                    showMessage(this, '✅ Demo mode: Email saved locally. Configure Buttondown API to actually subscribe users!', 'success');
                    emailInput.value = '';
                    
                    // Log reminder for developer
                    console.warn('Newsletter API not configured! Sign up at https://buttondown.email and add your API key to js/newsletter.js');
                } else {
                    // Use actual Buttondown API
                    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${newsletterConfig.apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            tags: ['website']
                        })
                    });
                    
                    if (response.ok) {
                        showMessage(this, 'Thank you for subscribing! Check your email for confirmation.', 'success');
                        emailInput.value = '';
                        
                        // Track subscription in analytics if available
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'newsletter_subscribe', {
                                'event_category': 'engagement',
                                'event_label': 'newsletter'
                            });
                        }
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Subscription failed');
                    }
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showMessage(this, error.message || 'Subscription failed. Please try again.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Subscribe';
            }
        });
    });
});

/**
 * Show message to user
 */
function showMessage(form, message, type) {
    let messageEl = form.querySelector('.form-message');
    
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        form.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.className = `form-message ${type}`;
    messageEl.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterManager;
}
