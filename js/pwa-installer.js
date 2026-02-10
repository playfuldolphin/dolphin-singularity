/**
 * PWA Install Prompt Handler
 * Shows custom install prompt and manages PWA installation
 */

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.isInstalled = false;
        
        this.init();
    }
    
    init() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        // Check if already installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.isInstalled = true;
            this.hideInstallPrompt();
            this.trackInstall();
        });
        
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('Running as PWA');
        }
    }
    
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('Service Worker update found');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdatePrompt();
                    }
                });
            });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
    
    showInstallPrompt() {
        // Create install banner
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="install-banner">
                <div class="install-content">
                    <div class="install-icon">🐬</div>
                    <div class="install-text">
                        <strong>Install Dolphin Singularity</strong>
                        <p>Get quick access and work offline!</p>
                    </div>
                </div>
                <div class="install-actions">
                    <button class="install-btn" id="pwa-install-btn">Install</button>
                    <button class="dismiss-btn" id="pwa-dismiss-btn">✕</button>
                </div>
            </div>
            
            <style>
                #pwa-install-banner {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10000;
                    max-width: 500px;
                    width: calc(100% - 40px);
                    animation: slideUp 0.5s ease;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                
                .install-banner {
                    background: linear-gradient(135deg, #0077be, #00c9ff);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                
                .install-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }
                
                .install-icon {
                    font-size: 2.5rem;
                }
                
                .install-text strong {
                    display: block;
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }
                
                .install-text p {
                    font-size: 0.85rem;
                    opacity: 0.9;
                    margin: 0;
                }
                
                .install-actions {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                
                .install-btn {
                    padding: 0.75rem 1.5rem;
                    background: white;
                    color: #0077be;
                    border: none;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: transform 0.2s ease;
                }
                
                .install-btn:hover {
                    transform: scale(1.05);
                }
                
                .dismiss-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    opacity: 0.7;
                    transition: opacity 0.2s ease;
                }
                
                .dismiss-btn:hover {
                    opacity: 1;
                }
                
                @media (max-width: 600px) {
                    .install-banner {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .install-content {
                        flex-direction: column;
                    }
                    
                    .install-actions {
                        width: 100%;
                    }
                    
                    .install-btn {
                        flex: 1;
                    }
                }
            </style>
        `;
        
        document.body.appendChild(banner);
        
        // Add event listeners
        document.getElementById('pwa-install-btn').addEventListener('click', () => {
            this.install();
        });
        
        document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
            this.hideInstallPrompt();
        });
    }
    
    async install() {
        if (!this.deferredPrompt) {
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User ${outcome} the install prompt`);
        
        if (outcome === 'accepted') {
            this.trackInstall();
        }
        
        // Clear the deferredPrompt
        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }
    
    hideInstallPrompt() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => banner.remove(), 300);
        }
    }
    
    showUpdatePrompt() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 80px; right: 20px; background: #00c9ff; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000; max-width: 300px;">
                <strong>Update Available</strong>
                <p style="margin: 0.5rem 0; font-size: 0.9rem;">A new version is available!</p>
                <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: white; color: #00c9ff; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; width: 100%;">
                    Update Now
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }
    
    trackInstall() {
        // Track with analytics
        if (window.analytics) {
            analytics.trackEvent('pwa_install', {
                event_category: 'engagement',
                event_label: 'installed_pwa'
            });
        }
    }
}

// Initialize PWA installer
if (typeof window !== 'undefined') {
    const pwaInstaller = new PWAInstaller();
    window.pwaInstaller = pwaInstaller;
}
