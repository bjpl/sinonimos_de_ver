#!/usr/bin/env node

/**
 * GOALIE-X: Enhanced Research Assistant
 * Complete replacement for GOALIE's query generation
 * Based on rUv's approach - full control over the entire pipeline
 */

import { spawn, execSync } from 'child_process';
import axios from 'axios';
import dotenv from 'dotenv';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Perplexity API configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Advanced query generation engine
class IntelligentQueryEngine {
  constructor() {
    this.strategies = {
      etymology: new EtymologyStrategy(),
      cultural: new CulturalStrategy(),
      historical: new HistoricalStrategy(),
      interdisciplinary: new InterdisciplinaryStrategy()
    };
  }

  generateQueries(input, maxQueries = 5) {
    console.log('🧠 Intelligent Query Engine: Analyzing input...');

    const analysis = this.analyzeInput(input);
    const queries = [];

    // Apply all relevant strategies
    for (const [name, strategy] of Object.entries(this.strategies)) {
      if (analysis.relevantStrategies.includes(name)) {
        const strategyQueries = strategy.generate(analysis);
        queries.push(...strategyQueries);
      }
    }

    // Remove duplicates and limit
    const uniqueQueries = [...new Set(queries)];

    console.log(`✨ Generated ${uniqueQueries.length} specialized queries (limiting to ${maxQueries})`);
    return uniqueQueries.slice(0, maxQueries); // Default 5 queries to avoid timeouts
  }

  analyzeInput(input) {
    const lower = input.toLowerCase();
    
    return {
      original: input,
      mainConcept: this.extractMainConcept(input),
      relevantStrategies: this.identifyStrategies(lower),
      languages: this.detectLanguages(lower),
      timeperiods: this.detectTimePeriods(lower),
      domains: this.detectDomains(lower)
    };
  }

  extractMainConcept(input) {
    // Extract the core concept
    const patterns = [
      /(?:etymology|history|cultural|origin|development)\s+(?:of|and)?\s*(?:the)?\s*["']?([^"']+?)["']?\s*(?:learning|tradition|practice)?$/i,
      /\b(autodidact\w*|self-taught|self-direct\w*)\b/i,
      /["']([^"']+)["']/
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1].trim();
    }
    
    // Fallback to key terms
    const words = input.split(' ').filter(w => w.length > 3);
    return words.slice(0, 2).join(' ');
  }

  identifyStrategies(input) {
    const strategies = [];
    
    if (/etymolog|origin|linguistic|derive|root/.test(input)) {
      strategies.push('etymology');
    }
    if (/cultur|tradition|society|civiliz/.test(input)) {
      strategies.push('cultural');
    }
    if (/histor|develop|evolution|archaeolog/.test(input)) {
      strategies.push('historical');
    }
    if (/autodidact|self-taught|self-direct/.test(input)) {
      strategies.push('interdisciplinary');
    }
    
    return strategies.length > 0 ? strategies : ['interdisciplinary'];
  }

  detectLanguages(input) {
    const languages = [];
    const langPatterns = {
      'Greek': /\b(greek|hellenic|ancient greek)\b/i,
      'Latin': /\b(latin|roman|classical latin)\b/i,
      'Sanskrit': /\b(sanskrit|vedic)\b/i,
      'Arabic': /\b(arabic|islamic)\b/i,
      'Chinese': /\b(chinese|mandarin|sino)\b/i,
      'PIE': /\b(proto-indo-european|pie)\b/i
    };
    
    for (const [lang, pattern] of Object.entries(langPatterns)) {
      if (pattern.test(input)) languages.push(lang);
    }
    
    return languages;
  }

  detectTimePeriods(input) {
    const periods = [];
    const periodPatterns = {
      'ancient': /\b(ancient|classical|antiquity)\b/i,
      'medieval': /\b(medieval|middle ages)\b/i,
      'renaissance': /\b(renaissance|early modern)\b/i,
      'enlightenment': /\b(enlightenment|18th century)\b/i,
      'modern': /\b(modern|contemporary|20th|21st)\b/i
    };
    
    for (const [period, pattern] of Object.entries(periodPatterns)) {
      if (pattern.test(input)) periods.push(period);
    }
    
    return periods;
  }

  detectDomains(input) {
    const domains = [];
    const domainPatterns = {
      'education': /\b(education|learning|teaching|pedagogy)\b/i,
      'philosophy': /\b(philosophy|philosophical|epistemology)\b/i,
      'psychology': /\b(psychology|cognitive|neuroscience)\b/i,
      'sociology': /\b(sociology|social|cultural|anthropology)\b/i
    };
    
    for (const [domain, pattern] of Object.entries(domainPatterns)) {
      if (pattern.test(input)) domains.push(domain);
    }
    
    return domains;
  }
}

// Strategy implementations
class EtymologyStrategy {
  generate(analysis) {
    const queries = [];
    const concept = analysis.mainConcept;
    
    // Core etymology
    queries.push(`${concept} etymology linguistic origin Proto-Indo-European roots`);
    
    // Greek/Latin analysis
    if (concept.includes('autodidact')) {
      queries.push('autodidact didaktikos Greek didaskein teaching autos self etymology');
      queries.push('autodidactus Latin medieval scholarly tradition etymology');
    }
    
    // Cross-linguistic
    queries.push(`${concept} multilingual etymology comparative linguistics`);
    
    // Morphological
    queries.push(`${concept} morphology prefix suffix word formation etymology`);
    
    // Semantic evolution
    queries.push(`${concept} semantic shift historical meaning evolution etymology`);
    
    return queries;
  }
}

class CulturalStrategy {
  generate(analysis) {
    const queries = [];
    const concept = analysis.mainConcept;
    
    // Ancient traditions
    queries.push(`${concept} ancient Greek paideia Roman education cultural history`);
    
    // Medieval traditions
    queries.push(`${concept} medieval monasteries Islamic madrasah Jewish yeshiva learning`);
    
    // Renaissance & Enlightenment
    queries.push(`${concept} Renaissance humanism Enlightenment Bildung cultural history`);
    
    // Eastern traditions
    queries.push(`${concept} Confucian self-cultivation Buddhist autodidactic traditions`);
    
    // Indigenous & oral traditions
    queries.push(`${concept} indigenous knowledge systems oral traditions cultural transmission`);
    
    // Modern movements
    queries.push(`${concept} unschooling deschooling alternative education movements`);
    
    return queries;
  }
}

class HistoricalStrategy {
  generate(analysis) {
    const queries = [];
    const concept = analysis.mainConcept;
    
    // Historical timeline
    queries.push(`${concept} historical timeline chronology ancient to modern`);
    
    // Key transitions
    queries.push(`${concept} printing press literacy democratization knowledge history`);
    
    // Industrial revolution impact
    queries.push(`${concept} industrial revolution public education self-improvement history`);
    
    // Digital transformation
    queries.push(`${concept} internet MOOCs online learning digital age transformation`);
    
    // Famous examples
    queries.push(`famous autodidacts polymaths self-taught geniuses historical examples`);
    
    return queries;
  }
}

class InterdisciplinaryStrategy {
  generate(analysis) {
    const queries = [];
    const concept = analysis.mainConcept;
    
    // Cognitive science
    queries.push(`${concept} cognitive science metacognition self-regulated learning`);
    
    // Neuroscience
    queries.push(`${concept} neuroscience brain plasticity autonomous learning`);
    
    // Psychology
    queries.push(`${concept} psychology motivation intrinsic learning self-efficacy`);
    
    // Sociology
    queries.push(`${concept} sociology social capital cultural reproduction education`);
    
    // Philosophy
    queries.push(`${concept} epistemology knowledge acquisition philosophical foundations`);
    
    // Comparative analysis
    queries.push(`${concept} formal vs informal education comparative analysis benefits`);
    
    return queries;
  }
}

// Perplexity API client
class PerplexityClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.results = [];
  }

  async search(queries, options = {}) {
    const model = options.model || 'sonar-pro';
    const mode = options.mode || 'academic';
    
    console.log(`\n🔍 Executing ${queries.length} searches with Perplexity ${model}...`);
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`\n  [${i + 1}/${queries.length}] ${query.substring(0, 60)}...`);
      
      try {
        const response = await axios.post(
          PERPLEXITY_API_URL,
          {
            model: model,
            messages: [
              {
                role: 'system',
                content: mode === 'academic' 
                  ? 'You are an academic researcher. Provide scholarly, well-cited responses focusing on primary sources, peer-reviewed research, and authoritative academic texts.'
                  : 'You are a helpful assistant providing comprehensive, accurate information.'
              },
              {
                role: 'user',
                content: query
              }
            ],
            max_tokens: 2000,
            temperature: 0.2,
            top_p: 0.9
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        
        if (response.data && response.data.choices && response.data.choices[0]) {
          this.results.push({
            query: query,
            response: response.data.choices[0].message.content,
            citations: response.data.citations || [],
            model: model,
            timestamp: new Date().toISOString()
          });
          console.log(`    ✅ Success (${response.data.usage?.total_tokens || 'N/A'} tokens)`);
        }
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        this.results.push({
          query: query,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      // Rate limiting - wait between requests
      if (i < queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return this.results;
  }

  synthesize() {
    console.log('\n📊 Synthesizing results...');
    
    const synthesis = {
      totalQueries: this.results.length,
      successfulQueries: this.results.filter(r => !r.error).length,
      content: {},
      citations: [],
      summary: ''
    };
    
    // Organize content by topic
    const topics = {
      etymology: [],
      cultural: [],
      historical: [],
      modern: [],
      interdisciplinary: []
    };
    
    for (const result of this.results) {
      if (result.response) {
        // Categorize based on query content
        if (/etymolog|linguistic|origin/.test(result.query)) {
          topics.etymology.push(result.response);
        } else if (/cultur|tradition|society/.test(result.query)) {
          topics.cultural.push(result.response);
        } else if (/histor|chronolog|timeline/.test(result.query)) {
          topics.historical.push(result.response);
        } else if (/modern|digital|contemporary/.test(result.query)) {
          topics.modern.push(result.response);
        } else {
          topics.interdisciplinary.push(result.response);
        }
        
        // Collect citations
        if (result.citations) {
          synthesis.citations.push(...result.citations);
        }
      }
    }
    
    synthesis.content = topics;
    
    // Create summary
    synthesis.summary = this.createSummary(topics);
    
    return synthesis;
  }
  
  createSummary(topics) {
    let summary = '# Research Synthesis: Etymology and Cultural History of Autodidactic Learning\n\n';
    
    if (topics.etymology.length > 0) {
      summary += '## Etymology and Linguistic Origins\n';
      summary += topics.etymology[0].substring(0, 500) + '...\n\n';
    }
    
    if (topics.cultural.length > 0) {
      summary += '## Cultural Traditions and Practices\n';
      summary += topics.cultural[0].substring(0, 500) + '...\n\n';
    }
    
    if (topics.historical.length > 0) {
      summary += '## Historical Development\n';
      summary += topics.historical[0].substring(0, 500) + '...\n\n';
    }
    
    if (topics.modern.length > 0) {
      summary += '## Modern and Contemporary Context\n';
      summary += topics.modern[0].substring(0, 500) + '...\n\n';
    }
    
    return summary;
  }
}

// Output manager
class OutputManager {
  constructor(outputDir = 'docs/research') {
    this.outputDir = outputDir;
    this.ensureDirectory();
  }
  
  ensureDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  saveResults(synthesis, format = 'both') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `research-${timestamp}`;
    
    const files = [];
    
    if (format === 'json' || format === 'both') {
      const jsonPath = path.join(this.outputDir, `${baseFilename}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(synthesis, null, 2));
      files.push(jsonPath);
      console.log(`  💾 JSON: ${jsonPath}`);
    }
    
    if (format === 'markdown' || format === 'both') {
      const mdPath = path.join(this.outputDir, `${baseFilename}.md`);
      fs.writeFileSync(mdPath, this.formatMarkdown(synthesis));
      files.push(mdPath);
      console.log(`  💾 Markdown: ${mdPath}`);
    }
    
    return files;
  }
  
  formatMarkdown(synthesis) {
    let md = '# Etymology and Cultural History Research Results\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `## Summary\n\n${synthesis.summary}\n\n`;
    
    md += '## Detailed Results by Category\n\n';
    
    for (const [category, contents] of Object.entries(synthesis.content)) {
      if (contents.length > 0) {
        md += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        contents.forEach((content, i) => {
          md += `#### Result ${i + 1}\n\n${content}\n\n---\n\n`;
        });
      }
    }
    
    if (synthesis.citations.length > 0) {
      md += '## Citations\n\n';
      synthesis.citations.forEach((citation, i) => {
        md += `${i + 1}. ${citation}\n`;
      });
    }
    
    return md;
  }
}

// Main CLI
class GoalieX {
  constructor() {
    this.program = new Command();
    this.setupCommands();
  }
  
  setupCommands() {
    this.program
      .name('goalie-x')
      .description('Enhanced GOALIE with intelligent query generation')
      .version('2.0.0');
    
    // Main intelligent search command
    this.program
      .command('search <query>')
      .description('Execute intelligent multi-query search')
      .option('-m, --model <model>', 'Perplexity model', 'sonar-pro')
      .option('--mode <mode>', 'Search mode (academic/web)', 'academic')
      .option('-o, --output <dir>', 'Output directory', 'docs/research')
      .option('-f, --format <format>', 'Output format (json/markdown/both)', 'both')
      .option('-n, --num-queries <number>', 'Maximum number of queries', '5')
      .action(async (query, options) => {
        await this.executeSearch(query, options);
      });
    
    // Direct query command
    this.program
      .command('direct <queries...>')
      .description('Execute direct queries without processing')
      .option('-m, --model <model>', 'Perplexity model', 'sonar-pro')
      .option('--mode <mode>', 'Search mode', 'academic')
      .action(async (queries, options) => {
        await this.executeDirect(queries, options);
      });
    
    // Analyze command
    this.program
      .command('analyze <query>')
      .description('Analyze query and show generated searches without executing')
      .action(async (query) => {
        await this.analyzeQuery(query);
      });
  }
  
  async executeSearch(query, options) {
    console.log('🚀 GOALIE-X: Enhanced Research Engine');
    console.log('=====================================\n');

    // Check API key
    if (!PERPLEXITY_API_KEY) {
      console.error('❌ Error: PERPLEXITY_API_KEY not set');
      console.error('   Please set PERPLEXITY_API_KEY in .env file');
      process.exit(1);
    }

    // Generate intelligent queries
    const maxQueries = parseInt(options.numQueries) || 5;
    const engine = new IntelligentQueryEngine();
    const queries = engine.generateQueries(query, maxQueries);

    console.log('\n📋 Generated Queries:');
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q}`);
    });

    // Execute searches
    const client = new PerplexityClient(PERPLEXITY_API_KEY);

    try {
      const results = await client.search(queries, options);

      // Synthesize results
      const synthesis = client.synthesize();

      // Save output
      const outputManager = new OutputManager(options.output);
      const files = outputManager.saveResults(synthesis, options.format);

      console.log('\n✅ Research Complete!');
      console.log(`📁 Results saved to: ${options.output}/`);

      // Display summary
      console.log('\n📊 Summary:');
      console.log(`  • Queries executed: ${synthesis.totalQueries}`);
      console.log(`  • Successful: ${synthesis.successfulQueries}`);
      console.log(`  • Citations collected: ${synthesis.citations.length}`);

      files.forEach(file => console.log(`  • ${file}`));
    } catch (error) {
      console.error('\n❌ Error during search:', error.message);

      // Try to save partial results if available
      if (client.results.length > 0) {
        console.log('\n💾 Saving partial results...');
        const synthesis = client.synthesize();
        const outputManager = new OutputManager(options.output);
        outputManager.saveResults(synthesis, options.format);
        console.log('✅ Partial results saved');
      }
    }
  }
  
  async executeDirect(queries, options) {
    console.log('🚀 GOALIE-X: Direct Query Mode');
    console.log('==============================\n');

    if (!PERPLEXITY_API_KEY) {
      console.error('❌ Error: PERPLEXITY_API_KEY not set');
      process.exit(1);
    }

    const client = new PerplexityClient(PERPLEXITY_API_KEY);
    const results = await client.search(queries, options);

    const synthesis = client.synthesize();

    const outputManager = new OutputManager('docs/research');
    outputManager.saveResults(synthesis, 'both');

    console.log('\n✅ Direct search complete!');
  }
  
  async analyzeQuery(query) {
    console.log('🔬 Query Analysis');
    console.log('=================\n');
    
    const engine = new IntelligentQueryEngine();
    const analysis = engine.analyzeInput(query);
    const queries = engine.generateQueries(query);
    
    console.log('📊 Analysis Results:');
    console.log(JSON.stringify(analysis, null, 2));
    
    console.log('\n📋 Generated Queries:');
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q}`);
    });
  }
  
  run() {
    this.program.parse(process.argv);
  }
}

// Run if executed directly
// Fix Windows path handling
const normalizedArgv = process.argv[1]?.replace(/\\/g, '/');
const normalizedUrl = fileURLToPath(import.meta.url).replace(/\\/g, '/');

if (normalizedUrl === normalizedArgv || process.argv[1]?.endsWith('goalie-x.mjs')) {
  const app = new GoalieX();
  app.run();
}

export { GoalieX, IntelligentQueryEngine, PerplexityClient };
