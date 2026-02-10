/**
 * Dolphin Singularity Platform - Express API Server
 * Serves all 10 projects through unified API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const knowledgeBaseAPI = require('./knowledge-base-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: require('../package.json').version
    });
});

// API Routes
app.use('/api/knowledge', knowledgeBaseAPI.createRouter());

// Project status endpoint
app.get('/api/projects', (req, res) => {
    res.json({
        projects: [
            {
                id: 1,
                name: 'DolphinGemma 2.0',
                status: 'in_development',
                description: 'Advanced communication pattern analysis',
                endpoint: '/api/gemma'
            },
            {
                id: 2,
                name: 'Real-time Translator',
                status: 'planned',
                description: 'Live dolphin vocalization interpretation',
                endpoint: '/api/translator'
            },
            {
                id: 3,
                name: 'Knowledge Base',
                status: 'active',
                description: 'Comprehensive research database',
                endpoint: '/api/knowledge'
            },
            {
                id: 4,
                name: 'Dolphin-AI Interaction',
                status: 'research_phase',
                description: 'Two-way communication experiment',
                endpoint: '/api/interaction'
            },
            {
                id: 5,
                name: 'Evolution Simulator',
                status: 'planned',
                description: 'Communication evolution modeling',
                endpoint: '/api/simulator'
            },
            {
                id: 6,
                name: 'Collective Intelligence',
                status: 'planned',
                description: 'Pod network analysis',
                endpoint: '/api/collective'
            },
            {
                id: 7,
                name: 'Learning Platform',
                status: 'in_development',
                description: 'Educational citizen science',
                endpoint: '/api/learn'
            },
            {
                id: 8,
                name: 'Multi-modal Analysis',
                status: 'planned',
                description: 'Audio+video+environment integration',
                endpoint: '/api/multimodal'
            },
            {
                id: 9,
                name: 'Mobile App',
                status: 'planned',
                description: 'Consumer dolphin research tools',
                endpoint: '/api/mobile'
            },
            {
                id: 10,
                name: 'Turing Test',
                status: 'planned',
                description: 'Public AI challenge',
                endpoint: '/api/turing-test'
            }
        ]
    });
});

// Serve static files
app.use(express.static('../'));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════════════════╗
║     🐬 Dolphin Singularity Platform Server 🐬       ║
╠══════════════════════════════════════════════════════╣
║  Status: Running                                     ║
║  Port: ${PORT.toString().padEnd(46)}║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(39)}║
║  API Documentation: http://localhost:${PORT}/api${' '.repeat(17)}║
╠══════════════════════════════════════════════════════╣
║  Active Projects:                                    ║
║  ✓ Project 3: Knowledge Base                         ║
║  ⏳ Project 1: DolphinGemma 2.0 (in development)     ║
║  ⏳ Project 7: Learning Platform (in development)    ║
╚══════════════════════════════════════════════════════╝
        `);
        
        if (!process.env.ANTHROPIC_API_KEY) {
            console.warn(`
⚠️  WARNING: ANTHROPIC_API_KEY not found in environment variables
   AI features will not work. Please add it to your .env file.
            `);
        }
    });
}

module.exports = app;
