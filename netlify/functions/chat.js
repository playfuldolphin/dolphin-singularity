/**
 * Netlify Serverless Function for AI Chatbot
 * Integrates with OpenAI GPT-4 or Claude API
 */

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, history } = JSON.parse(event.body);

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Choose AI provider
        const provider = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'claude'

        let response;
        switch (provider) {
            case 'openai':
                response = await callOpenAI(message, history);
                break;
            case 'claude':
                response = await callClaude(message, history);
                break;
            default:
                throw new Error('Invalid AI provider');
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                response: response
            })
        };

    } catch (error) {
        console.error('Chat API error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to get response',
                message: error.message
            })
        };
    }
};

/**
 * Call OpenAI GPT-4 API
 */
async function callOpenAI(message, history = []) {
    const API_KEY = process.env.OPENAI_API_KEY;
    
    if (!API_KEY) {
        throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a helpful dolphin research assistant for Dolphin Singularity, an organization advancing AI-powered dolphin communication research and conservation.

Your knowledge includes:
- Dolphin communication (signature whistles, echolocation, burst pulses)
- Cetacean intelligence and cognition
- Marine conservation efforts
- AI and machine learning applications in bioacoustics
- The DolphinGemma research project
- Dolphin species, behavior, and biology

Guidelines:
- Be enthusiastic and educational
- Use dolphin/ocean emojis occasionally (🐬🌊)
- Provide accurate scientific information
- Encourage conservation and support
- Keep responses concise (2-3 paragraphs max)
- Suggest relevant pages on dolphinsingularity.org
- Be friendly and engaging

Do not:
- Provide medical advice
- Make false claims
- Discuss unrelated topics extensively`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(h => ({
            role: h.role,
            content: h.content
        })),
        { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
            presence_penalty: 0.6,
            frequency_penalty: 0.3
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API call failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Call Anthropic Claude API
 */
async function callClaude(message, history = []) {
    const API_KEY = process.env.CLAUDE_API_KEY;
    
    if (!API_KEY) {
        throw new Error('Claude API key not configured');
    }

    const systemPrompt = `You are a helpful dolphin research assistant for Dolphin Singularity. Provide accurate, engaging information about dolphins, conservation, and AI research. Keep responses concise and friendly.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            system: systemPrompt,
            messages: [
                ...history,
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Claude API call failed');
    }

    const data = await response.json();
    return data.content[0].text;
}
