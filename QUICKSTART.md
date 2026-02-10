# 🚀 Dolphin Singularity - Quick Start Guide

Welcome! This guide will get you up and running with the Dolphin Singularity platform in minutes.

## 📋 Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))
- **Git** (optional, for version control)

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd /Users/noahwilson/dolphinsingularity.org
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
nano .env  # or use your preferred editor
```

**Required:** Set your `ANTHROPIC_API_KEY` in the `.env` file:

```bash
ANTHROPIC_API_KEY=your_actual_key_here
```

### Step 3: Start the Server

```bash
npm start
```

You should see:

```
╔══════════════════════════════════════════════════════╗
║     🐬 Dolphin Singularity Platform Server 🐬       ║
╠══════════════════════════════════════════════════════╣
║  Status: Running                                     ║
║  Port: 3000                                          ║
║  Environment: development                            ║
║  API Documentation: http://localhost:3000/api        ║
╠══════════════════════════════════════════════════════╣
║  Active Projects:                                    ║
║  ✓ Project 3: Knowledge Base                         ║
║  ⏳ Project 1: DolphinGemma 2.0 (in development)     ║
║  ⏳ Project 7: Learning Platform (in development)    ║
╚══════════════════════════════════════════════════════╝
```

### Step 4: Open the Knowledge Explorer

Open your browser and go to:

```
http://localhost:3000/knowledge-explorer.html
```

Try asking a question like:
- "How do dolphins communicate with each other?"
- "What are signature whistles?"
- "How intelligent are dolphins?"

🎉 **Congratulations!** Your AI-powered dolphin research platform is running!

---

## 🔍 What's Included

### Active Features

✅ **Project 3: Knowledge Base** (`/knowledge-explorer.html`)
- Natural language queries about dolphin research
- AI-powered answers from Claude Opus
- Research citations and synthesis

### In Development

⏳ **Project 1: DolphinGemma 2.0**
- Audio analysis engine
- Pattern recognition
- Multi-agent system

⏳ **Project 7: Learning Platform**
- Interactive courses
- Citizen science portal
- Gamification

### Planned

📋 **8 More Projects** - See `MASTER_IMPLEMENTATION_PLAN.md` for details

---

## 📡 API Endpoints

### Knowledge Base

**Query the knowledge base:**
```bash
curl -X POST http://localhost:3000/api/knowledge/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How do dolphins use echolocation?"}'
```

**Search research papers:**
```bash
curl "http://localhost:3000/api/knowledge/papers?topic=signature%20whistles"
```

**Fact check a claim:**
```bash
curl -X POST http://localhost:3000/api/knowledge/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "Dolphins have names for each other"}'
```

**View API statistics:**
```bash
curl http://localhost:3000/api/knowledge/stats
```

---

## 💡 Common Tasks

### Run in Development Mode (Auto-reload)

```bash
npm run dev
```

### Test the Claude Integration

Create a test file `test-claude.js`:

```javascript
const ClaudeClient = require('./packages/ai-core/claude-client');

const claude = new ClaudeClient({
    apiKey: process.env.ANTHROPIC_API_KEY
});

async function test() {
    const response = await claude.queryKnowledgeBase(
        'What are signature whistles?'
    );
    console.log(response.content[0].text);
}

test();
```

Run it:
```bash
node test-claude.js
```

### Check Server Health

```bash
curl http://localhost:3000/health
```

### View All Projects Status

```bash
curl http://localhost:3000/api/projects
```

---

## 📂 Project Structure

```
dolphinsingularity.org/
├── packages/
│   ├── ai-core/                # Claude AI integration
│   │   └── claude-client.js    # Main AI client
│   └── audio-processing/       # Audio analysis (coming soon)
├── services/
│   ├── knowledge-base/         # Project 3: Knowledge Base
│   ├── dolphin-gemma/          # Project 1: DolphinGemma
│   └── ...                     # Other projects
├── api/
│   ├── server.js               # Express server
│   └── knowledge-base-api.js   # Knowledge Base endpoints
├── knowledge-explorer.html     # Web UI for knowledge base
├── package.json                # Dependencies
├── .env.example                # Environment template
└── MASTER_IMPLEMENTATION_PLAN.md  # Full roadmap
```

---

## 🎯 Next Steps

### 1. Explore the Knowledge Base

Visit `http://localhost:3000/knowledge-explorer.html` and try:
- Different types of questions (what, how, why)
- Specific topics (communication, intelligence, conservation)
- Fact-checking claims about dolphins

### 2. Read the Master Plan

Check out `MASTER_IMPLEMENTATION_PLAN.md` to see:
- All 10 projects and their features
- 18-month implementation roadmap
- Technical architecture details
- Funding and partnership strategies

### 3. Integrate into Your Website

Add the knowledge base to any page:

```html
<!-- Add to any .html file -->
<script src="packages/ai-core/claude-client.js"></script>
<script>
const claude = new ClaudeClient({ 
    apiKey: 'your_api_key' 
});

async function askQuestion(question) {
    const response = await claude.queryKnowledgeBase(question);
    console.log(response.content[0].text);
}
</script>
```

### 4. Start Building Project 1 (DolphinGemma 2.0)

See `CLAUDE_DOLPHIN_PROJECTS.md` for detailed specs on building the audio analysis system.

### 5. Contribute Research Data

Have dolphin vocalization recordings? Contact us about adding them to the database.

---

## 🐛 Troubleshooting

### "No Anthropic API key found"

**Solution:** Make sure you:
1. Created a `.env` file (copy from `.env.example`)
2. Added your actual API key
3. Restarted the server after adding the key

### "Port 3000 already in use"

**Solution:** Change the port in `.env`:
```bash
PORT=3001
```

### API returns "Rate limit exceeded"

**Solution:** This is normal during development. Wait a few minutes or increase limits in `api/server.js`.

### "Cannot find module..."

**Solution:** Run `npm install` again to ensure all dependencies are installed.

---

## 💰 API Costs

Claude API usage is metered. Typical costs:

- **Single query**: $0.01 - $0.05
- **100 queries/day**: ~$2-5/day
- **1000 queries/day**: ~$20-50/day

**Cost Optimization Tips:**
- Caching is enabled by default (saves ~70%)
- Use Sonnet for most queries (cheaper than Opus)
- Batch multiple questions together
- Use Haiku for simple queries

Current usage stats available at: `http://localhost:3000/api/knowledge/stats`

---

## 📚 Documentation

- **Full Project Details**: `CLAUDE_DOLPHIN_PROJECTS.md`
- **Implementation Roadmap**: `MASTER_IMPLEMENTATION_PLAN.md`
- **Agent Guidelines**: `AGENTS.md`
- **API Reference**: `docs/api/` (coming soon)

---

## 🤝 Getting Help

### Community
- GitHub Issues: Report bugs or request features
- Discord: Join our community (coming soon)
- Email: dolphinsingularity@gmail.com

### Professional Support
For enterprise deployments, custom integrations, or research partnerships:
- Email: partnerships@dolphinsingularity.org

---

## 🌟 What's Next?

You're now running the world's most advanced AI-powered dolphin research platform! 

**Immediate Actions:**
1. ✅ Test the Knowledge Base
2. ✅ Read the master implementation plan
3. ✅ Decide which project to build next
4. ✅ Share with researchers and educators

**Long-term Goals:**
- Complete all 10 projects
- Publish research findings
- Build partnerships with marine research institutions
- Launch mobile app
- Create global dolphin communication database

**Ready to dive deeper?** Check out `CLAUDE_DOLPHIN_PROJECTS.md` for the complete project specifications!

---

🐬 **Welcome to the Dolphin Singularity!** 🤖
