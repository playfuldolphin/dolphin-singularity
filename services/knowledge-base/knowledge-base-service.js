/**
 * Dolphin Intelligence Knowledge Base Service
 * Project 3: Comprehensive AI-powered dolphin research database
 * 
 * Features:
 * - Natural language queries about dolphin research
 * - Research paper synthesis and citation
 * - Hypothesis generation
 * - Gap analysis in current knowledge
 */

const ClaudeClient = require('../../packages/ai-core/claude-client');

class DolphinKnowledgeBase {
    constructor(config = {}) {
        this.claude = new ClaudeClient(config);
        
        // Core knowledge domains
        this.domains = {
            communication: 'signature whistles, echolocation, burst-pulse sounds',
            cognition: 'problem-solving, self-awareness, tool use, social learning',
            behavior: 'hunting strategies, social structures, play behavior, migration',
            biology: 'anatomy, physiology, neurology, sensory systems',
            conservation: 'threats, protection measures, population status, policy',
            research: 'methodologies, key researchers, landmark studies, current projects'
        };
        
        // Sample research database (in production, this would be in a vector database)
        this.researchDatabase = this.initializeResearchDatabase();
    }

    /**
     * Main query interface - natural language questions about dolphins
     */
    async query(question, options = {}) {
        const context = await this.getRelevantContext(question);
        const systemPrompt = this.buildSystemPrompt(options.domain);
        
        const messages = [
            {
                role: 'user',
                content: this.buildQueryPrompt(question, context, options)
            }
        ];
        
        const response = await this.claude.sendMessage(messages, {
            model: options.model || 'claude-opus-4-20250514',
            system: systemPrompt,
            maxTokens: options.maxTokens || 3000
        });
        
        return this.formatResponse(response, options.format);
    }

    /**
     * Search research papers by topic
     */
    async searchPapers(topic, filters = {}) {
        const relevantPapers = this.researchDatabase.filter(paper => {
            const matchesTopic = paper.keywords.some(kw => 
                topic.toLowerCase().includes(kw.toLowerCase()) ||
                kw.toLowerCase().includes(topic.toLowerCase())
            );
            
            const matchesYear = !filters.yearFrom || paper.year >= filters.yearFrom;
            const matchesAuthor = !filters.author || paper.authors.includes(filters.author);
            
            return matchesTopic && matchesYear && matchesAuthor;
        });
        
        // Use Claude to synthesize findings across papers
        if (relevantPapers.length > 0) {
            const synthesis = await this.synthesizePapers(topic, relevantPapers);
            return {
                papers: relevantPapers,
                synthesis: synthesis,
                count: relevantPapers.length
            };
        }
        
        return {
            papers: [],
            synthesis: 'No papers found matching your criteria.',
            count: 0
        };
    }

    /**
     * Compare findings across multiple studies
     */
    async compareStudies(studies) {
        const prompt = `Compare and contrast the following dolphin research studies:

${studies.map((study, i) => `
STUDY ${i+1}: ${study.title}
Authors: ${study.authors.join(', ')}
Year: ${study.year}
Key Findings: ${study.findings}
Methodology: ${study.methodology}
`).join('\n')}

Provide:
1. Common themes and converging evidence
2. Contradictions or conflicting results
3. Methodological differences that might explain discrepancies
4. Gaps that future research should address
5. Overall conclusions supported by multiple studies
6. Degree of scientific consensus (high/medium/low)`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.claude.sendMessage(messages, {
            model: 'claude-opus-4-20250514',
            system: this.claude.getDolphinExpertPrompt(),
            maxTokens: 4000
        });
    }

    /**
     * Identify gaps in current research
     */
    async findResearchGaps(topic) {
        const relevantResearch = await this.searchPapers(topic);
        
        const prompt = `Based on current research on "${topic}" in dolphins:

EXISTING RESEARCH:
${relevantResearch.papers.map(p => `- ${p.title} (${p.year}): ${p.findings}`).join('\n')}

Identify:
1. What questions remain unanswered?
2. What methodological approaches haven't been tried?
3. What populations or species are understudied?
4. What interdisciplinary connections could be explored?
5. What technological advances could enable new research directions?
6. Top 5 most important research questions for the next decade

Be specific and actionable for researchers planning future studies.`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.claude.sendMessage(messages, {
            model: 'claude-opus-4-20250514',
            system: this.claude.getDolphinExpertPrompt(),
            maxTokens: 4000
        });
    }

    /**
     * Generate testable hypotheses
     */
    async generateHypotheses(observations) {
        return this.claude.generateHypotheses(observations);
    }

    /**
     * Explain complex concepts at different levels
     */
    async explainConcept(concept, audience = 'general public') {
        const audiencePrompts = {
            'child': 'Explain for a curious 8-year-old',
            'student': 'Explain for a high school biology student',
            'general public': 'Explain for an interested adult with no science background',
            'undergraduate': 'Explain for a university biology undergraduate',
            'researcher': 'Provide detailed technical explanation for researchers'
        };
        
        const prompt = `${audiencePrompts[audience]}: ${concept}

Include:
- Clear, accessible explanation
- Real-world examples or analogies
- Why this matters for dolphins
- Connection to broader themes
- Fascinating recent discoveries
${audience === 'researcher' ? '- Technical details and citations' : '- Fun facts'}`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.claude.sendMessage(messages, {
            model: 'claude-sonnet-4-20250514',
            system: this.claude.getDolphinExpertPrompt(),
            maxTokens: 2000
        });
    }

    /**
     * Fact-check claims about dolphins
     */
    async factCheck(claim) {
        const prompt = `Fact-check this claim about dolphins: "${claim}"

Provide:
1. Verdict: TRUE / PARTIALLY TRUE / FALSE / UNPROVEN
2. Evidence supporting or refuting the claim
3. Relevant research citations
4. Nuances or context needed to understand the claim
5. Common misconceptions related to this topic
6. Confidence level in the verdict

Be thorough and cite specific studies where possible.`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.claude.sendMessage(messages, {
            model: 'claude-opus-4-20250514',
            system: this.claude.getDolphinExpertPrompt(),
            maxTokens: 2500
        });
    }

    /**
     * Get timeline of discoveries
     */
    async getDiscoveryTimeline(topic) {
        const prompt = `Create a timeline of major discoveries about ${topic} in dolphin research.

Format as:
YEAR: Discovery/Study
- Key finding
- Researcher(s)
- Impact on field

Start from earliest relevant research to present day. Highlight paradigm shifts.`;

        const messages = [{ role: 'user', content: prompt }];
        
        return this.claude.sendMessage(messages, {
            model: 'claude-sonnet-4-20250514',
            system: this.claude.getDolphinExpertPrompt(),
            maxTokens: 3000
        });
    }

    /**
     * Helper: Build system prompt based on query domain
     */
    buildSystemPrompt(domain) {
        let basePrompt = this.claude.getDolphinExpertPrompt();
        
        if (domain && this.domains[domain]) {
            basePrompt += `\n\nFocus particularly on: ${this.domains[domain]}`;
        }
        
        return basePrompt;
    }

    /**
     * Helper: Build comprehensive query prompt with context
     */
    buildQueryPrompt(question, context, options) {
        let prompt = `Question: ${question}\n\n`;
        
        if (context && context.length > 0) {
            prompt += `RELEVANT RESEARCH:\n${context.map(c => 
                `- ${c.title} (${c.year}): ${c.findings}`
            ).join('\n')}\n\n`;
        }
        
        prompt += `Please provide a comprehensive answer that:
1. Directly addresses the question
2. Cites relevant research (use [Author Year] format)
3. Distinguishes between established facts and ongoing research
4. Mentions alternative viewpoints if they exist
5. Explains implications for dolphin conservation
6. Suggests what future research might reveal
${options.includeExamples ? '7. Includes concrete examples from field observations\n' : ''}
${options.includeCitations ? '8. Provides full citations for key papers\n' : ''}

${options.depth === 'brief' ? 'Keep response concise (under 300 words).' : ''}
${options.depth === 'detailed' ? 'Provide an in-depth analysis.' : ''}`;

        return prompt;
    }

    /**
     * Helper: Get relevant context for a query
     */
    async getRelevantContext(question) {
        // In production, this would use vector similarity search
        // For now, simple keyword matching
        const keywords = this.extractKeywords(question.toLowerCase());
        
        return this.researchDatabase.filter(paper => {
            return paper.keywords.some(kw => 
                keywords.includes(kw.toLowerCase())
            );
        }).slice(0, 5); // Top 5 most relevant
    }

    /**
     * Helper: Extract keywords from query
     */
    extractKeywords(text) {
        const keywords = [
            'communication', 'whistle', 'echolocation', 'click', 'vocalization',
            'intelligence', 'cognition', 'brain', 'problem-solving', 'tool',
            'social', 'pod', 'behavior', 'hunting', 'feeding',
            'conservation', 'threat', 'pollution', 'protection',
            'bottlenose', 'spinner', 'spotted', 'orca', 'species'
        ];
        
        return keywords.filter(kw => text.includes(kw));
    }

    /**
     * Helper: Synthesize findings across papers
     */
    async synthesizePapers(topic, papers) {
        const prompt = `Synthesize findings from these research papers on "${topic}":

${papers.map((p, i) => `
${i+1}. ${p.title} (${p.authors[0]} et al., ${p.year})
   Key Finding: ${p.findings}
   Method: ${p.methodology}
`).join('\n')}

Provide:
- Overall consensus in the field
- Key discoveries and their significance
- Evolution of understanding over time
- Remaining questions
- Practical applications for conservation

Keep synthesis concise but comprehensive (400-500 words).`;

        const messages = [{ role: 'user', content: prompt }];
        
        const response = await this.claude.sendMessage(messages, {
            model: 'claude-sonnet-4-20250514',
            system: this.claude.getDolphinExpertPrompt(),
            maxTokens: 2000
        });
        
        return response.content[0].text;
    }

    /**
     * Helper: Format response based on requested format
     */
    formatResponse(response, format = 'full') {
        const text = response.content[0].text;
        
        switch (format) {
            case 'brief':
                // Extract first paragraph or summary
                return {
                    answer: text.split('\n\n')[0],
                    full: text,
                    usage: response.usage
                };
            
            case 'structured':
                // Parse into structured sections
                return {
                    answer: text,
                    sections: this.parseIntoSections(text),
                    usage: response.usage
                };
            
            case 'json':
                return {
                    answer: text,
                    metadata: {
                        model: response.model,
                        tokens: response.usage,
                        timestamp: new Date().toISOString()
                    }
                };
            
            default:
                return {
                    answer: text,
                    usage: response.usage
                };
        }
    }

    /**
     * Helper: Parse text into sections
     */
    parseIntoSections(text) {
        const sections = [];
        const lines = text.split('\n');
        let currentSection = null;
        
        for (const line of lines) {
            if (line.match(/^\d+\./)) {
                if (currentSection) sections.push(currentSection);
                currentSection = { title: line, content: [] };
            } else if (currentSection) {
                currentSection.content.push(line);
            }
        }
        
        if (currentSection) sections.push(currentSection);
        return sections;
    }

    /**
     * Initialize sample research database
     * In production, this would load from a vector database
     */
    initializeResearchDatabase() {
        return [
            {
                title: "Context-specific use suggests that bottlenose dolphin signature whistles are cohesion calls",
                authors: ["Janik, V.M.", "Slater, P.J.B."],
                year: 1998,
                journal: "Animal Behaviour",
                keywords: ["signature whistle", "communication", "cohesion", "bottlenose"],
                findings: "Signature whistles function as cohesion calls to maintain contact between separated individuals",
                methodology: "Field observations and playback experiments"
            },
            {
                title: "Bottlenose dolphins can use learned vocal labels to address each other",
                authors: ["King, S.L.", "Janik, V.M."],
                year: 2013,
                journal: "Proceedings of the National Academy of Sciences",
                keywords: ["signature whistle", "names", "individual recognition", "social"],
                findings: "Dolphins use signature whistles as 'names' to call to specific individuals",
                methodology: "Whistle copying experiments in wild populations"
            },
            {
                title: "Comprehension of sentences by bottlenose dolphins",
                authors: ["Herman, L.M.", "Richards, D.G.", "Wolz, J.P."],
                year: 1984,
                journal: "Cognition",
                keywords: ["language", "comprehension", "intelligence", "cognition"],
                findings: "Dolphins can understand artificial language with semantic and syntactic components",
                methodology: "Controlled experiments with artificial gestural language"
            },
            {
                title: "Convergence of calls as animals form social bonds, active compensation for noisy communication channels, and the evolution of vocal learning in mammals",
                authors: ["Tyack, P.L."],
                year: 2008,
                journal: "Journal of Comparative Psychology",
                keywords: ["vocal learning", "social bonds", "evolution", "communication"],
                findings: "Vocal convergence in dolphins reflects social bonding and requires vocal learning",
                methodology: "Long-term acoustic monitoring and social network analysis"
            },
            {
                title: "Tool use in wild bottlenose dolphins",
                authors: ["Krützen, M.", "Mann, J.", "Heithaus, M.R."],
                year: 2005,
                journal: "Proceedings of the Royal Society B",
                keywords: ["tool use", "culture", "sponging", "cognition"],
                findings: "Dolphins in Shark Bay use marine sponges as tools for foraging, transmitted culturally",
                methodology: "Behavioral observations and genetic analysis"
            },
            {
                title: "Self-recognition in an Asian elephant",
                authors: ["Plotnik, J.M.", "de Waal, F.B.M.", "Reiss, D."],
                year: 2006,
                journal: "Proceedings of the National Academy of Sciences",
                keywords: ["self-awareness", "mirror test", "cognition", "consciousness"],
                findings: "Dolphins pass mirror self-recognition test, indicating self-awareness",
                methodology: "Mirror mark test with captive dolphins"
            },
            {
                title: "Dolphin continuous auditory vigilance for five days",
                authors: ["Ridgway, S.H.", "et al."],
                year: 2006,
                journal: "Journal of Experimental Biology",
                keywords: ["sleep", "cognition", "neurobiology", "vigilance"],
                findings: "Dolphins can maintain auditory vigilance for extended periods through unihemispheric sleep",
                methodology: "Continuous EEG and behavioral monitoring"
            },
            {
                title: "Acoustic communication in dolphins and whales",
                authors: ["Au, W.W.L.", "Hastings, M.C."],
                year: 2008,
                journal: "Bioacoustics",
                keywords: ["acoustics", "echolocation", "communication", "bioacoustics"],
                findings: "Comprehensive review of dolphin acoustic systems and their functions",
                methodology: "Literature review and synthesis"
            }
        ];
    }

    /**
     * Get usage statistics
     */
    getStats() {
        return this.claude.getUsageStats();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DolphinKnowledgeBase;
}
