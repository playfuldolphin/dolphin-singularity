/**
 * Unified Claude AI Client for Dolphin Singularity Projects
 * Supports all Claude models with optimized prompt management
 * 
 * @author Dolphin Singularity Research Team
 * @version 1.0.0
 */

class ClaudeClient {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
        this.baseURL = 'https://api.anthropic.com/v1/messages';
        this.defaultModel = config.model || 'claude-sonnet-4-20250514';
        this.maxRetries = config.maxRetries || 3;
        this.timeout = config.timeout || 60000;
        
        // Token usage tracking
        this.usage = {
            inputTokens: 0,
            outputTokens: 0,
            requests: 0,
            errors: 0
        };
        
        // Cache for repeated queries (in-memory, can be replaced with Redis)
        this.cache = new Map();
        this.cacheEnabled = config.cacheEnabled !== false;
        this.cacheTTL = config.cacheTTL || 3600000; // 1 hour default
        
        if (!this.apiKey) {
            console.warn('⚠️  No Anthropic API key provided. Set ANTHROPIC_API_KEY environment variable.');
        }
    }

    /**
     * Main method to send messages to Claude
     */
    async sendMessage(messages, options = {}) {
        const model = options.model || this.defaultModel;
        const maxTokens = options.maxTokens || 4096;
        const temperature = options.temperature || 1.0;
        const systemPrompt = options.system || '';
        
        // Check cache if enabled
        if (this.cacheEnabled) {
            const cacheKey = this.getCacheKey(messages, model);
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
                console.log('✓ Cache hit');
                return cached.response;
            }
        }
        
        const payload = {
            model: model,
            max_tokens: maxTokens,
            temperature: temperature,
            messages: this.formatMessages(messages)
        };
        
        if (systemPrompt) {
            payload.system = systemPrompt;
        }
        
        // Streaming support
        if (options.stream) {
            return this.streamMessage(payload);
        }
        
        // Standard request with retries
        return this.makeRequest(payload, messages, model);
    }

    /**
     * Make API request with retry logic
     */
    async makeRequest(payload, originalMessages, model) {
        let lastError;
        
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(this.baseURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`API Error: ${error.error?.message || response.statusText}`);
                }
                
                const data = await response.json();
                
                // Track usage
                this.trackUsage(data.usage);
                
                // Cache successful response
                if (this.cacheEnabled) {
                    const cacheKey = this.getCacheKey(originalMessages, model);
                    this.cache.set(cacheKey, {
                        response: data,
                        timestamp: Date.now()
                    });
                }
                
                return data;
                
            } catch (error) {
                lastError = error;
                this.usage.errors++;
                
                if (attempt < this.maxRetries - 1) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    console.log(`⚠️  Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                    await this.sleep(delay);
                } else {
                    console.error('❌ All retry attempts failed');
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Streaming support for real-time applications
     */
    async *streamMessage(payload) {
        payload.stream = true;
        
        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Stream error: ${response.statusText}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') break;
                    
                    try {
                        const parsed = JSON.parse(data);
                        yield parsed;
                    } catch (e) {
                        console.warn('Failed to parse stream chunk:', e);
                    }
                }
            }
        }
    }

    /**
     * Dolphin Research Expert System Prompt
     */
    getDolphinExpertPrompt() {
        return `You are Dr. Marina Cetacea, a world-leading expert in dolphin communication and cetacean intelligence with 30 years of field experience.

Your expertise includes:
- PhD in Marine Biology from Stanford University
- 150+ peer-reviewed publications on cetacean communication
- Pioneering work on signature whistles and echolocation
- Field research with bottlenose, spinner, and spotted dolphins worldwide
- Deep knowledge of bioacoustics, animal cognition, and marine ecology
- Experience with both wild and captive dolphin populations

When analyzing dolphin-related queries:
1. Cite relevant research and scientists (e.g., Janik, Tyack, Herman, Herzing)
2. Distinguish clearly between established facts and ongoing hypotheses
3. Acknowledge uncertainty and alternative explanations
4. Consider ecological and evolutionary context
5. Connect findings to conservation implications
6. Use precise scientific terminology while remaining accessible
7. Flag novel patterns that warrant further investigation
8. Think critically about AI/technology applications to dolphin research

Your analysis should be:
- Scientifically rigorous and evidence-based
- Creative in hypothesis generation
- Cautious in interpretation to avoid anthropomorphism
- Practical for field researchers and students
- Inspiring for the general public

Always prioritize dolphin welfare and ethical research practices.`;
    }

    /**
     * Analyze dolphin vocalization with multimodal input
     */
    async analyzeDolphinVocalization(spectrogramImage, context = {}) {
        const messages = [
            {
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: 'image/png',
                            data: spectrogramImage
                        }
                    },
                    {
                        type: 'text',
                        text: `Analyze this dolphin vocalization spectrogram.

Context:
- Location: ${context.location || 'Unknown'}
- Pod size: ${context.podSize || 'Unknown'} individuals
- Observed behavior: ${context.behavior || 'Not specified'}
- Time of day: ${context.time || 'Not specified'}
- Environmental conditions: ${context.environment || 'Not specified'}

Please provide:
1. Vocalization type classification (whistle, click, burst-pulse, etc.)
2. Frequency characteristics and patterns
3. Potential meaning or behavioral context
4. Comparison to known signature whistle patterns
5. Notable features or anomalies
6. Confidence level with reasoning
7. Suggestions for further analysis`
                    }
                ]
            }
        ];
        
        return this.sendMessage(messages, {
            model: 'claude-opus-4-20250514',
            system: this.getDolphinExpertPrompt(),
            maxTokens: 4096
        });
    }

    /**
     * Query the dolphin knowledge base
     */
    async queryKnowledgeBase(question, context = '') {
        const messages = [
            {
                role: 'user',
                content: `${context ? `Context: ${context}\n\n` : ''}Question: ${question}`
            }
        ];
        
        return this.sendMessage(messages, {
            model: 'claude-opus-4-20250514',
            system: this.getDolphinExpertPrompt(),
            maxTokens: 3000
        });
    }

    /**
     * Generate research hypotheses from patterns
     */
    async generateHypotheses(patterns, historicalData = '') {
        const prompt = `Based on the following dolphin communication patterns and data:

OBSERVED PATTERNS:
${JSON.stringify(patterns, null, 2)}

${historicalData ? `HISTORICAL RESEARCH:\n${historicalData}\n\n` : ''}

Generate 3 novel, testable hypotheses about dolphin communication. For each:
1. State the hypothesis clearly
2. Explain reasoning from the data
3. Propose experimental methodology to test it
4. Predict expected outcomes if hypothesis is correct
5. Discuss potential implications for dolphin research and conservation

Be creative but scientifically rigorous.`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.sendMessage(messages, {
            model: 'claude-opus-4-20250514',
            system: this.getDolphinExpertPrompt(),
            maxTokens: 6000,
            temperature: 0.8
        });
    }

    /**
     * Compare communication patterns across dolphin pods
     */
    async comparePods(pod1, pod2) {
        const prompt = `Compare dolphin communication patterns between two pods:

POD A - ${pod1.name}:
- Location: ${pod1.location}
- Population: ${pod1.population} individuals
- Recordings analyzed: ${pod1.recordings}
- Primary behaviors: ${pod1.behaviors.join(', ')}
- Notable patterns: ${pod1.patterns}

POD B - ${pod2.name}:
- Location: ${pod2.location}
- Population: ${pod2.population} individuals
- Recordings analyzed: ${pod2.recordings}
- Primary behaviors: ${pod2.behaviors.join(', ')}
- Notable patterns: ${pod2.patterns}

Analyze:
1. Similarities in communication structure and usage
2. Significant differences (potential "dialects")
3. Possible explanations (environmental, cultural, genetic factors)
4. Evolutionary and ecological implications
5. Recommendations for further comparative research
6. Conservation considerations`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.sendMessage(messages, {
            model: 'claude-sonnet-4-20250514',
            system: this.getDolphinExpertPrompt(),
            maxTokens: 5000
        });
    }

    /**
     * Educational content generation
     */
    async generateEducationalContent(topic, targetAudience = 'general public', format = 'article') {
        const prompt = `Create educational content about: ${topic}

Target audience: ${targetAudience}
Format: ${format}

Requirements:
- Scientifically accurate and up-to-date
- Engaging and accessible for the target audience
- Include fascinating facts and recent discoveries
- Cite key researchers and studies
- Connect to conservation awareness
- Inspire curiosity and respect for dolphins
- ${format === 'interactive' ? 'Include quiz questions or discussion prompts' : ''}

Length: ${format === 'article' ? '800-1200 words' : 'appropriate for format'}`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.sendMessage(messages, {
            model: 'claude-sonnet-4-20250514',
            system: this.getDolphinExpertPrompt(),
            maxTokens: 4000
        });
    }

    /**
     * Real-time interpretation for streaming audio
     */
    async interpretRealTimeVocalization(vocalizationSequence, recentContext) {
        const prompt = `You are analyzing a live dolphin vocalization stream.

RECENT VOCALIZATIONS (last 30 seconds):
${vocalizationSequence.map((v, i) => `${i+1}. ${v.type} at ${v.frequency}Hz, duration ${v.duration}ms`).join('\n')}

BEHAVIORAL CONTEXT:
${recentContext}

Provide a real-time interpretation:
1. What behavior is likely occurring? (feeding, socializing, traveling, etc.)
2. Are specific individuals identifiable by signature whistles?
3. Is this routine behavior or something unusual?
4. Any immediate concerns or noteworthy patterns?
5. Confidence level (low/medium/high)

Keep response concise for real-time display (under 200 words).`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.sendMessage(messages, {
            model: 'claude-haiku-4-20250514', // Fast model for real-time
            system: 'You are a dolphin communication expert providing real-time analysis.',
            maxTokens: 500,
            temperature: 0.3 // Lower temperature for consistent real-time interpretation
        });
    }

    /**
     * Helper methods
     */
    formatMessages(messages) {
        if (!Array.isArray(messages)) {
            messages = [{ role: 'user', content: messages }];
        }
        return messages;
    }

    getCacheKey(messages, model) {
        return `${model}:${JSON.stringify(messages)}`;
    }

    trackUsage(usage) {
        this.usage.inputTokens += usage.input_tokens || 0;
        this.usage.outputTokens += usage.output_tokens || 0;
        this.usage.requests++;
    }

    getUsageStats() {
        const totalTokens = this.usage.inputTokens + this.usage.outputTokens;
        const estimatedCost = this.estimateCost(totalTokens);
        
        return {
            requests: this.usage.requests,
            inputTokens: this.usage.inputTokens,
            outputTokens: this.usage.outputTokens,
            totalTokens: totalTokens,
            errors: this.usage.errors,
            estimatedCost: estimatedCost,
            successRate: this.usage.requests > 0 
                ? ((this.usage.requests - this.usage.errors) / this.usage.requests * 100).toFixed(2) + '%'
                : '0%'
        };
    }

    estimateCost(totalTokens) {
        // Rough estimates per 1M tokens
        const modelCosts = {
            'claude-opus-4': { input: 15, output: 75 },
            'claude-sonnet-4': { input: 3, output: 15 },
            'claude-haiku-4': { input: 0.8, output: 4 }
        };
        
        // Use average cost
        const avgInputCost = 6;
        const avgOutputCost = 30;
        
        const inputCost = (this.usage.inputTokens / 1000000) * avgInputCost;
        const outputCost = (this.usage.outputTokens / 1000000) * avgOutputCost;
        
        return `$${(inputCost + outputCost).toFixed(2)}`;
    }

    clearCache() {
        this.cache.clear();
        console.log('✓ Cache cleared');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeClient;
}

if (typeof window !== 'undefined') {
    window.ClaudeClient = ClaudeClient;
}
