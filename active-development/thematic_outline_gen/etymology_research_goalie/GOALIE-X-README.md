# GOALIE-X: Complete GOALIE Replacement
## The Full rUv-Style Implementation

This is a **complete replacement** for GOALIE's query generation system, implementing the same architecture that rUv used in his advanced research tools. Instead of trying to patch GOALIE's limitations with plugins, we've built a new system from scratch that gives you total control.

## 🚀 What Makes This Different

### Standard GOALIE Problems:
- Generates only 3 queries: `[query]`, `[query] research`, `[query] latest developments`
- 30-second timeout kills complex searches
- No control over query decomposition
- Generic, unfocused searches
- Plugin system doesn't override core behavior

### GOALIE-X Solutions:
- Generates 5-10+ specialized, academic queries
- No timeout issues - handles long searches gracefully  
- Intelligent domain-aware decomposition
- Focused, scholarly search strategies
- Complete control over entire pipeline

## 📦 Installation (Windows)

### Quick Start (5 minutes)
```powershell
# 1. Navigate to your project directory
cd C:\Users\brand\Development\Project_Workspace\active-development\thematic_outline_gen\etymology_research_goalie

# 2. Run the installer
.\goalie-x.bat install
# OR for PowerShell
.\goalie-x.ps1 install

# 3. Enter your Perplexity API key when prompted
```

### Manual Installation
```powershell
# 1. Install dependencies
npm install

# 2. Create .env file with your API key
echo "PERPLEXITY_API_KEY=your-pplx-key-here" > .env

# 3. Test installation
node goalie-x.mjs analyze "autodidactic learning"
```

## 🎯 Usage Examples

### 1. Intelligent Search (Recommended)
This is the main feature - it automatically generates specialized queries:

```powershell
# PowerShell
.\goalie-x.ps1 search "etymology and cultural history of autodidactic learning"

# Command Prompt
goalie-x.bat search "etymology and cultural history of autodidactic learning"

# Direct Node.js
node goalie-x.mjs search "etymology and cultural history of autodidactic learning"
```

**What happens:**
1. Analyzes your query to identify domains (etymology, cultural, historical)
2. Generates 5-10 specialized academic queries
3. Executes each query through Perplexity API
4. Synthesizes results into organized categories
5. Saves both JSON and Markdown reports

### 2. Direct Queries (Full Control)
When you want to specify exact queries:

```powershell
# PowerShell
.\goalie-x.ps1 direct "autodidact etymology;self-taught traditions;learning history"

# Batch file with multiple queries
goalie-x.bat direct "query1" "query2" "query3"

# Node.js
node goalie-x.mjs direct "autodidact etymology" "cultural traditions" "historical development"
```

### 3. Query Analysis (See What It Does)
Understand how your queries are decomposed:

```powershell
.\goalie-x.ps1 analyze "etymology and cultural history of autodidactic learning"
```

**Output:**
```json
{
  "mainConcept": "autodidactic learning",
  "relevantStrategies": ["etymology", "cultural", "historical"],
  "languages": ["Greek", "Latin"],
  "timeperiods": ["ancient", "medieval", "modern"],
  "domains": ["education", "philosophy"]
}

Generated Queries:
1. autodidact didaktikos Greek didaskein teaching autos self etymology
2. autodidactus Latin medieval scholarly tradition etymology  
3. autodidact Proto-Indo-European dek receive linguistic roots
4. autodidactic ancient Greek paideia Roman education cultural history
5. autodidactic Renaissance humanism Enlightenment Bildung
[...more queries...]
```

### 4. Pre-Built Research Suites

#### Etymology Research
```powershell
.\goalie-x.ps1 etymology
# OR
goalie-x.bat etymology
```

Runs specialized etymology queries:
- Greek/Latin roots
- Proto-Indo-European connections
- Semantic evolution
- Cross-linguistic analysis
- Morphological structure

#### Cultural History Research  
```powershell
.\goalie-x.ps1 cultural
# OR
goalie-x.bat cultural
```

Runs cultural/historical queries:
- Ancient traditions (Greek, Roman, etc.)
- Medieval learning systems
- Renaissance/Enlightenment
- Eastern philosophies
- Modern movements

#### Full Research Suite
```powershell
.\goalie-x.ps1 full
# OR
goalie-x.bat full
```

Runs complete intelligent analysis with all strategies.

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```bash
PERPLEXITY_API_KEY=pplx-your-key-here
PERPLEXITY_MODEL=sonar-pro        # Options: sonar, sonar-pro, sonar-deep-research
SEARCH_MODE=academic              # Options: academic, web
OUTPUT_DIR=.research             # Where to save results
```

### Command Options
```powershell
.\goalie-x.ps1 search "query" -Model sonar-pro -Mode academic -Output .research -Debug
```

## 📊 Output Format

Results are saved in `.research/` directory:
- `research-[timestamp].json` - Structured data
- `research-[timestamp].md` - Formatted report

### Markdown Report Structure:
```markdown
# Etymology and Cultural History Research Results

## Summary
[Executive summary of findings]

## Etymology and Linguistic Origins
[Detailed etymology findings]

## Cultural Traditions and Practices
[Cultural history findings]

## Historical Development
[Historical timeline and evolution]

## Modern and Contemporary Context
[Current relevance and applications]

## Citations
[All sources and references]
```

## 🎭 How This Implements rUv's Approach

### 1. **Complete Pipeline Control**
Instead of fighting with GOALIE's hardcoded behavior, we control the entire flow:
- Query analysis → Strategy selection → Query generation → Execution → Synthesis

### 2. **Domain-Aware Intelligence**
The system understands different research domains and applies appropriate strategies:
- Etymology → Linguistic analysis queries
- Cultural → Comparative tradition queries
- Historical → Timeline and development queries

### 3. **Multi-Strategy Synthesis**
Results are intelligently organized by category, not just concatenated.

### 4. **No Platform Limitations**
- No 30-second timeout
- No hardcoded query templates
- No GOAP planning failures
- Direct API access for efficiency

## 🔥 Performance Comparison

| Metric | Standard GOALIE | GOALIE-X |
|--------|----------------|----------|
| Queries Generated | 3 (generic) | 5-10+ (specialized) |
| Query Quality | Template-based | Domain-intelligent |
| Timeout Issues | 30 seconds | None |
| Control | Limited | Complete |
| Output Format | Basic | JSON + Markdown |
| Academic Focus | No | Yes |
| Synthesis | Simple concat | Categorized |

## 🛠️ Troubleshooting

### "Node.js not found"
Install Node.js 18+ from https://nodejs.org

### "PERPLEXITY_API_KEY not set"
1. Get key from https://perplexity.ai/settings/api
2. Add to `.env` file or run `.\goalie-x.ps1 install`

### "Module not found"
Run `npm install` in the project directory

### Results not academic enough
Use `--mode academic` flag or set in `.env`:
```bash
SEARCH_MODE=academic
```

## 🚀 Advanced Usage

### Custom Query Strategies
Edit `goalie-x.mjs` to add new strategies:

```javascript
class YourStrategy {
  generate(analysis) {
    return [
      // Your specialized queries
    ];
  }
}
```

### API Integration
Use as a library in your own code:

```javascript
import { GoalieX, IntelligentQueryEngine } from './goalie-x.mjs';

const engine = new IntelligentQueryEngine();
const queries = engine.generateQueries('your research topic');
```

## 📈 Why This Works Better

### The rUv Insight
rUv realized that trying to patch GOALIE's behavior through plugins was fighting against its core architecture. Instead, he built complete replacements that:

1. **Own the pipeline** - Control everything from query to output
2. **Understand domains** - Different topics need different strategies
3. **Generate intelligently** - Not templates, but reasoned queries
4. **Synthesize properly** - Organize results, don't just dump them

### Your Specific Use Case
For "etymology and cultural history of autodidactic learning", GOALIE-X:
- Recognizes THREE domains (etymology, cultural, historical)
- Generates queries for EACH domain (3-4 queries per domain)
- Includes scholarly terms (didaktikos, paideia, Bildung)
- Searches in academic mode for peer-reviewed sources
- Organizes results by category for easy analysis

## 🎯 Quick Command Reference

```powershell
# See what queries will be generated
.\goalie-x.ps1 analyze "your topic"

# Run intelligent multi-query search
.\goalie-x.ps1 search "your topic"

# Run your exact queries
.\goalie-x.ps1 direct "query1;query2;query3"

# Run etymology research suite
.\goalie-x.ps1 etymology

# Run cultural history suite
.\goalie-x.ps1 cultural

# Run complete research
.\goalie-x.ps1 full

# Compare with standard GOALIE
.\goalie-x.ps1 compare
```

## 📝 Summary

This is what rUv did - he didn't try to fix GOALIE, he **replaced** it. GOALIE-X gives you:

✅ **Intelligent query generation** - Not templates, but domain-aware strategies
✅ **No timeouts** - Handles long research sessions
✅ **Academic focus** - Scholarly sources and terminology
✅ **Complete control** - Every aspect configurable
✅ **Better results** - Focused, relevant, organized

Start with:
```powershell
.\goalie-x.ps1 search "etymology and cultural history of autodidactic learning"
```

And see the difference immediately!
