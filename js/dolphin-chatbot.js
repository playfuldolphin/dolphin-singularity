/**
 * Dolphin Research AI Chatbot
 * Powered by OpenAI GPT or Claude API
 * Answers questions about dolphins, research, and conservation
 */

class DolphinChatbot {
    constructor(config = {}) {
        this.apiEndpoint = config.apiEndpoint || '/api/chat';
        this.model = config.model || 'gpt-4';
        this.conversationHistory = [];
        this.isOpen = false;
        this.isTyping = false;
        
        // Predefined knowledge base for fallback/demo mode
        this.knowledgeBase = {
            'signature whistle': 'Signature whistles are unique identification sounds that each dolphin develops. Like a name, dolphins use these whistles to identify themselves and call to each other.',
            'echolocation': 'Dolphins use echolocation by emitting high-frequency clicks and listening to the echoes to navigate and hunt. They can detect objects as small as a golf ball from 50 meters away!',
            'intelligence': 'Dolphins have large, complex brains and demonstrate advanced cognitive abilities including self-awareness, problem-solving, tool use, and complex social behaviors.',
            'communication': 'Dolphins communicate through whistles, clicks, burst pulses, and body language. We\'re using AI to decode these complex communication patterns.',
            'conservation': 'Major threats include fishing nets, pollution, habitat loss, and noise pollution. Supporting research and marine protected areas helps protect dolphin populations.',
            'research': 'Our DolphinGemma AI project analyzes thousands of hours of dolphin vocalizations to understand their communication structure and potentially enable interspecies dialogue.',
           'species': 'There are about 40 species of dolphins, including bottlenose dolphins, orcas (killer whales), spinner dolphins, and spotted dolphins.',
            'lifespan': 'Dolphins typically live 20-45 years in the wild, depending on the species. Orcas can live up to 80-90 years!',
            'social': 'Dolphins live in complex social groups called pods. They form strong bonds, cooperate in hunting, and even help injured pod members.'
        };
        
        this.init();
    }
    
    init() {
        this.createChatInterface();
        this.addEventListeners();
    }
    
    createChatInterface() {
        const chatHTML = `
            <div id="dolphin-chatbot" class="chatbot-container ${this.isOpen ? 'open' : ''}">
                <!-- Chat Button -->
                <button class="chat-toggle-btn" id="chatToggleBtn" title="Ask a Dolphin Researcher">
                    <span class="chat-icon">💬</span>
                    <span class="dolphin-icon">🐬</span>
                </button>
                
                <!-- Chat Window -->
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <div class="bot-avatar">🐬</div>
                            <div>
                                <div class="bot-name">Dolphin Research Assistant</div>
                                <div class="bot-status">
                                    <span class="status-dot"></span> Online
                                </div>
                            </div>
                        </div>
                        <button class="chat-close-btn" id="chatCloseBtn">✕</button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="message bot-message">
                            <div class="message-avatar">🐬</div>
                            <div class="message-content">
                                <p>Hi! I'm your dolphin research assistant. Ask me anything about:</p>
                                <div class="quick-topics">
                                    <button class="topic-btn" data-question="How do dolphins communicate?">🎵 Communication</button>
                                    <button class="topic-btn" data-question="What is echolocation?">📡 Echolocation</button>
                                    <button class="topic-btn" data-question="How intelligent are dolphins?">🧠 Intelligence</button>
                                    <button class="topic-btn" data-question="How can I help dolphins?">💚 Conservation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="chatInput" 
                            class="chat-input" 
                            placeholder="Ask about dolphins..."
                            autocomplete="off"
                        >
                        <button class="chat-send-btn" id="chatSendBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }
                
                .chat-toggle-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0077be, #00c9ff);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 201, 255, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .chat-toggle-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0, 201, 255, 0.6);
                }
                
                .chat-icon, .dolphin-icon {
                    position: absolute;
                    transition: all 0.3s ease;
                }
                
                .chatbot-container:not(.open) .dolphin-icon {
                    opacity: 0;
                    transform: scale(0);
                }
                
                .chatbot-container.open .chat-icon {
                    opacity: 0;
                    transform: scale(0);
                }
                
                .chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    max-width: calc(100vw - 40px);
                    height: 600px;
                    max-height: calc(100vh - 140px);
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .chatbot-container.open .chat-window {
                    display: flex;
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .chat-header {
                    background: linear-gradient(135deg, #0077be, #00c9ff);
                    color: white;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .bot-avatar {
                    font-size: 2rem;
                }
                
                .bot-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                
                .bot-status {
                    font-size: 0.75rem;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .chat-close-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                
                .chat-close-btn:hover {
                    opacity: 1;
                }
                
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    background: #f5f9ff;
                }
                
                .message {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    animation: messageIn 0.3s ease;
                }
                
                @keyframes messageIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .message-avatar {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }
                
                .message-content {
                    background: white;
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    max-width: 80%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                
                .user-message {
                    flex-direction: row-reverse;
                }
                
                .user-message .message-content {
                    background: linear-gradient(135deg, #0077be, #00c9ff);
                    color: white;
                }
                
                .user-message .message-avatar {
                    content: '👤';
                }
                
                .quick-topics {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }
                
                .topic-btn {
                    padding: 0.5rem 0.75rem;
                    background: #f0f9ff;
                    border: 1px solid #00c9ff;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .topic-btn:hover {
                    background: #00c9ff;
                    color: white;
                }
                
                .typing-indicator {
                    display: flex;
                    gap: 0.25rem;
                    padding: 0.5rem;
                }
                
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #94a3b8;
                    border-radius: 50%;
                    animation: typingBounce 1.4s ease-in-out infinite;
                }
                
                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }
                
                .chat-input-container {
                    display: flex;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                }
                
                .chat-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 24px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                
                .chat-input:focus {
                    border-color: #00c9ff;
                }
                
                .chat-send-btn {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #0077be, #00c9ff);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .chat-send-btn:hover {
                    transform: scale(1.1);
                }
                
                .chat-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                @media (max-width: 480px) {
                    .chatbot-container {
                        bottom: 10px;
                        right: 10px;
                    }
                    
                    .chat-window {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 100px);
                        bottom: 70px;
                        right: -10px;
                    }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }
    
    addEventListeners() {
        // Toggle chat
        document.getElementById('chatToggleBtn').addEventListener('click', () => {
            this.toggleChat();
        });
        
        document.getElementById('chatCloseBtn').addEventListener('click', () => {
            this.closeChat();
        });
        
        // Send message
        document.getElementById('chatSendBtn').addEventListener('click', () => {
            this.sendMessage();
        });
        
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Quick topic buttons
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.askQuestion(question);
            });
        });
    }
    
    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('dolphin-chatbot');
        container.classList.toggle('open');
        
        if (this.isOpen) {
            document.getElementById('chatInput').focus();
            this.trackChatOpen();
        }
    }
    
    closeChat() {
        this.isOpen = false;
        document.getElementById('dolphin-chatbot').classList.remove('open');
    }
    
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Get bot response
        await this.getBotResponse(message);
    }
    
    async askQuestion(question) {
        this.addMessage(question, 'user');
        await this.getBotResponse(question);
    }
    
    addMessage(text, sender = 'bot') {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'bot' ? '🐬' : '👤'}</div>
            <div class="message-content">
                <p>${this.formatMessage(text)}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Track message
        if (window.analytics) {
            analytics.trackEvent('chatbot_message', {
                sender: sender,
                message_length: text.length
            });
        }
    }
    
    async getBotResponse(userMessage) {
        this.isTyping = true;
        this.showTypingIndicator();
        
        try {
            // Try API first
            const response = await this.callAPI(userMessage);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.log('API unavailable, using knowledge base');
            // Fallback to knowledge base
            const response = this.searchKnowledgeBase(userMessage);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        }
        
        this.isTyping = false;
    }
    
    async callAPI(message) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: this.conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error('API call failed');
        }
        
        const data = await response.json();
        return data.response;
    }
    
    searchKnowledgeBase(message) {
        const lowerMessage = message.toLowerCase();
        
        // Search for keywords
        for (const [keyword, answer] of Object.entries(this.knowledgeBase)) {
            if (lowerMessage.includes(keyword)) {
                return answer;
            }
        }
        
        // Default response with suggestions
        return `I'd love to help you learn about dolphins! Try asking me about:
        
• Signature whistles and communication
• Echolocation and how it works
• Dolphin intelligence and behavior
• Conservation efforts
• Our research projects

Or check out our <a href="/research.html">Research page</a> for in-depth information!`;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'message bot-message';
        indicator.innerHTML = `
            <div class="message-avatar">🐬</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    formatMessage(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        // Convert markdown-style links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        return text;
    }
    
    trackChatOpen() {
        if (window.analytics) {
            analytics.trackEvent('chatbot_open', {
                event_category: 'engagement',
                event_label: 'opened_chatbot'
            });
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new DolphinChatbot({
        // Configure your API endpoint here
        apiEndpoint: '/api/chat',
        model: 'gpt-4'
    });
    
    window.dolphinChatbot = chatbot;
});
