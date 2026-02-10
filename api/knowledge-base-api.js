/**
 * Knowledge Base API Endpoint
 * Handles requests from the web interface
 * 
 * Usage with Express.js:
 *   const knowledgeBaseAPI = require('./api/knowledge-base-api');
 *   app.use('/api/knowledge', knowledgeBaseAPI);
 * 
 * Or as serverless function (Netlify/Vercel)
 */

const DolphinKnowledgeBase = require('../services/knowledge-base/knowledge-base-service');

// Initialize knowledge base
const kb = new DolphinKnowledgeBase({
    apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Main query endpoint
 * POST /api/knowledge/query
 * Body: { question, options }
 */
async function handleQuery(req, res) {
    try {
        const { question, options = {} } = req.body;
        
        if (!question || typeof question !== 'string') {
            return res.status(400).json({
                error: 'Invalid request: question is required'
            });
        }
        
        // Rate limiting check (implement with Redis in production)
        if (!checkRateLimit(req)) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please try again later.'
            });
        }
        
        // Process query
        const result = await kb.query(question, options);
        
        // Track analytics
        trackQuery(req, question, result);
        
        return res.status(200).json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Query error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Search papers endpoint
 * GET /api/knowledge/papers?topic=...&yearFrom=...
 */
async function handleSearchPapers(req, res) {
    try {
        const { topic, yearFrom, author } = req.query;
        
        if (!topic) {
            return res.status(400).json({
                error: 'Topic parameter is required'
            });
        }
        
        const filters = {
            yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
            author: author
        };
        
        const results = await kb.searchPapers(topic, filters);
        
        return res.status(200).json({
            success: true,
            data: results
        });
        
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            error: 'Search failed'
        });
    }
}

/**
 * Fact check endpoint
 * POST /api/knowledge/fact-check
 * Body: { claim }
 */
async function handleFactCheck(req, res) {
    try {
        const { claim } = req.body;
        
        if (!claim) {
            return res.status(400).json({
                error: 'Claim is required'
            });
        }
        
        const result = await kb.factCheck(claim);
        
        return res.status(200).json({
            success: true,
            data: result
        });
        
    } catch (error) {
        console.error('Fact check error:', error);
        return res.status(500).json({
            error: 'Fact check failed'
        });
    }
}

/**
 * Get research gaps
 * GET /api/knowledge/gaps?topic=...
 */
async function handleResearchGaps(req, res) {
    try {
        const { topic } = req.query;
        
        if (!topic) {
            return res.status(400).json({
                error: 'Topic parameter is required'
            });
        }
        
        const result = await kb.findResearchGaps(topic);
        
        return res.status(200).json({
            success: true,
            data: result
        });
        
    } catch (error) {
        console.error('Research gaps error:', error);
        return res.status(500).json({
            error: 'Analysis failed'
        });
    }
}

/**
 * Get usage statistics
 * GET /api/knowledge/stats
 */
async function handleStats(req, res) {
    try {
        const stats = kb.getStats();
        
        return res.status(200).json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({
            error: 'Failed to retrieve stats'
        });
    }
}

/**
 * Helper: Rate limiting (implement with Redis in production)
 */
function checkRateLimit(req) {
    // Simplified rate limiting - use proper middleware in production
    // e.g., express-rate-limit with Redis store
    return true;
}

/**
 * Helper: Track analytics
 */
function trackQuery(req, question, result) {
    // Log to analytics service
    const logData = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('user-agent'),
        question: question,
        responseTime: result.usage?.latency,
        tokens: result.usage?.total_tokens
    };
    
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (process.env.NODE_ENV === 'production') {
        // Example: sendToAnalytics(logData);
    }
    
    console.log('Query tracked:', logData);
}

/**
 * Express router setup
 */
function createRouter() {
    const express = require('express');
    const router = express.Router();
    
    // Middleware
    router.use(express.json());
    
    // CORS
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });
    
    // Routes
    router.post('/query', handleQuery);
    router.get('/papers', handleSearchPapers);
    router.post('/fact-check', handleFactCheck);
    router.get('/gaps', handleResearchGaps);
    router.get('/stats', handleStats);
    
    return router;
}

/**
 * Serverless function wrapper (Netlify/Vercel)
 */
async function serverlessHandler(event, context) {
    const path = event.path.replace('/api/knowledge', '');
    const method = event.httpMethod;
    
    // Mock Express request/response objects
    const req = {
        body: event.body ? JSON.parse(event.body) : {},
        query: event.queryStringParameters || {},
        ip: event.headers['x-forwarded-for'] || 'unknown',
        get: (header) => event.headers[header.toLowerCase()]
    };
    
    const res = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: '',
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.body = JSON.stringify(data);
            return this;
        }
    };
    
    // Route to appropriate handler
    try {
        if (path === '/query' && method === 'POST') {
            await handleQuery(req, res);
        } else if (path === '/papers' && method === 'GET') {
            await handleSearchPapers(req, res);
        } else if (path === '/fact-check' && method === 'POST') {
            await handleFactCheck(req, res);
        } else if (path === '/gaps' && method === 'GET') {
            await handleResearchGaps(req, res);
        } else if (path === '/stats' && method === 'GET') {
            await handleStats(req, res);
        } else {
            res.status(404).json({ error: 'Not found' });
        }
        
        return {
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.body
        };
        
    } catch (error) {
        console.error('Serverless error:', error);
        return {
            statusCode: 500,
            headers: res.headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}

// Exports
module.exports = {
    createRouter,
    serverlessHandler,
    handleQuery,
    handleSearchPapers,
    handleFactCheck,
    handleResearchGaps,
    handleStats
};

// For Netlify Functions
exports.handler = serverlessHandler;
