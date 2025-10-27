#!/usr/bin/env node

/**
 * GOALIE Query Optimizer
 * Intelligently decomposes complex queries before passing to GOALIE
 * Prevents the generic "research" and "latest developments" pattern
 */

const { spawn } = require('child_process');
const path = require('path');

// Query decomposition strategies
const DECOMPOSITION_STRATEGIES = {
  etymology: {
    patterns: ['etymology', 'origin', 'linguistic', 'derive', 'root'],
    decompose: (query) => {
      const queries = [];
      
      // Extract the main term
      const mainTerm = extractMainTerm(query);
      
      if (mainTerm) {
        // Linguistic roots
        queries.push(`${mainTerm} Greek Latin etymology roots`);
        
        // Proto-language connections
        queries.push(`${mainTerm} Proto-Indo-European linguistic origin`);
        
        // Semantic evolution
        queries.push(`${mainTerm} meaning evolution historical usage`);
        
        // Cross-linguistic
        queries.push(`${mainTerm} multilingual translation equivalents`);
      }
      
      return queries;
    }
  },
  
  cultural: {
    patterns: ['cultural', 'tradition', 'society', 'civilization'],
    decompose: (query) => {
      const queries = [];
      const mainTerm = extractMainTerm(query);
      
      if (mainTerm) {
        // Historical traditions
        queries.push(`${mainTerm} ancient medieval modern traditions`);
        
        // Geographic variations
        queries.push(`${mainTerm} worldwide cultural practices`);
        
        // Social contexts
        queries.push(`${mainTerm} society education philosophy`);
        
        // Contemporary relevance
        queries.push(`${mainTerm} contemporary digital age transformation`);
      }
      
      return queries;
    }
  },
  
  historical: {
    patterns: ['history', 'historical', 'development', 'evolution', 'archaeology'],
    decompose: (query) => {
      const queries = [];
      const mainTerm = extractMainTerm(query);
      
      if (mainTerm) {
        // Timeline
        queries.push(`${mainTerm} historical timeline chronology`);
        
        // Key periods
        queries.push(`${mainTerm} ancient classical medieval renaissance`);
        
        // Transformations
        queries.push(`${mainTerm} historical transformations developments`);
        
        // Modern developments
        queries.push(`${mainTerm} 20th 21st century contemporary`);
      }
      
      return queries;
    }
  },
  
  autodidactic: {
    patterns: ['autodidact', 'self-taught', 'self-directed', 'self-learning'],
    decompose: (query) => {
      return [
        'autodidact didaktikos Greek etymology teaching self',
        'self-directed learning educational philosophy history',
        'famous autodidacts polymaths self-taught geniuses',
        'autodidactic traditions Renaissance Enlightenment modern',
        'self-education methods techniques cognitive science',
        'unschooling deschooling alternative education movement',
        'digital autodidacticism MOOCs online learning'
      ];
    }
  }
};

/**
 * Extract the main term from a query
 */
function extractMainTerm(query) {
  // Common patterns for finding the main term
  const patterns = [
    /(?:etymology|history|cultural|origin|development)\s+(?:of|and)?\s*(?:the)?\s*["']?([^"']+?)["']?\s*(?:learning|tradition|practice)?$/i,
    /["']([^"']+)["']/,
    /\b(autodidact\w*|self-taught|self-direct\w*)\b/i
  ];
  
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  // Fallback: use the most significant noun phrase
  const words = query.split(' ');
  const significantWords = words.filter(w => 
    !['the', 'of', 'and', 'or', 'in', 'at', 'to', 'for', 'a', 'an'].includes(w.toLowerCase())
  );
  
  return significantWords.slice(0, 2).join(' ');
}

/**
 * Determine which strategy to use
 */
function selectStrategy(query) {
  const lowerQuery = query.toLowerCase();
  const strategies = [];
  
  for (const [name, strategy] of Object.entries(DECOMPOSITION_STRATEGIES)) {
    if (strategy.patterns.some(pattern => lowerQuery.includes(pattern))) {
      strategies.push(name);
    }
  }
  
  return strategies;
}

/**
 * Decompose query into intelligent sub-queries
 */
function decomposeQuery(query) {
  const strategies = selectStrategy(query);
  const allQueries = new Set(); // Use Set to avoid duplicates
  
  if (strategies.length === 0) {
    // No specific strategy matched, use general decomposition
    return [query];
  }
  
  // Apply all matching strategies
  strategies.forEach(strategyName => {
    const strategy = DECOMPOSITION_STRATEGIES[strategyName];
    const queries = strategy.decompose(query);
    queries.forEach(q => allQueries.add(q));
  });
  
  // Limit to 5-7 queries for optimal performance
  return Array.from(allQueries).slice(0, 7);
}

/**
 * Run GOALIE with optimized queries
 */
function runOptimizedGoalie(originalQuery, command = 'search') {
  console.log('🎯 GOALIE Query Optimizer');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📝 Original Query: ${originalQuery}\n`);
  
  if (command === 'raw' || command === 'direct') {
    // For raw command, decompose and run directly
    const queries = decomposeQuery(originalQuery);
    
    console.log(`🔬 Generated ${queries.length} Optimized Queries:`);
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q}`);
    });
    console.log('');
    
    // Run goalie raw with all queries
    const args = ['raw', ...queries, '--max-results', '20', '--mode', 'academic'];
    
    console.log('🚀 Executing: goalie', args.join(' '), '\n');
    
    const goalie = spawn('goalie', args, {
      stdio: 'inherit',
      env: process.env
    });
    
    goalie.on('close', (code) => {
      process.exit(code);
    });
    
  } else if (command === 'multi') {
    // Run multiple separate searches
    const queries = decomposeQuery(originalQuery);
    
    console.log(`🔬 Running ${queries.length} Separate Searches:`);
    queries.forEach((q, i) => {
      console.log(`  ${i + 1}. ${q}`);
    });
    console.log('');
    
    // Run searches sequentially
    runSequentialSearches(queries, 0);
    
  } else {
    // Standard search with simplified query
    const simplifiedQuery = simplifyQuery(originalQuery);
    
    console.log(`✨ Simplified Query: ${simplifiedQuery}\n`);
    
    const args = ['search', simplifiedQuery, '--max-results', '15', '--model', 'sonar-pro'];
    
    console.log('🚀 Executing: goalie', args.join(' '), '\n');
    
    const goalie = spawn('goalie', args, {
      stdio: 'inherit',
      env: process.env
    });
    
    goalie.on('close', (code) => {
      process.exit(code);
    });
  }
}

/**
 * Simplify complex query for better GOAP handling
 */
function simplifyQuery(query) {
  // Remove unnecessary words
  const stopWords = ['the', 'of', 'and', 'in', 'at', 'to', 'for', 'a', 'an', 'is', 'are', 'was', 'were'];
  
  let simplified = query.toLowerCase();
  stopWords.forEach(word => {
    simplified = simplified.replace(new RegExp(`\\b${word}\\b`, 'g'), ' ');
  });
  
  // Clean up multiple spaces
  simplified = simplified.replace(/\s+/g, ' ').trim();
  
  // Limit to key terms
  const words = simplified.split(' ');
  if (words.length > 5) {
    // Keep only the most important words
    const importantWords = words.filter(w => 
      w.length > 3 && !stopWords.includes(w)
    ).slice(0, 5);
    simplified = importantWords.join(' ');
  }
  
  return simplified;
}

/**
 * Run searches sequentially
 */
function runSequentialSearches(queries, index) {
  if (index >= queries.length) {
    console.log('\n✅ All searches complete!');
    return;
  }
  
  console.log(`\n🔍 Search ${index + 1}/${queries.length}: ${queries[index]}`);
  console.log('━'.repeat(50));
  
  const goalie = spawn('goalie', [
    'search',
    queries[index],
    '--max-results', '10',
    '--model', 'sonar',
    '--output', `.research/search-${index + 1}`,
    '--format', 'markdown'
  ], {
    stdio: 'inherit',
    env: process.env
  });
  
  goalie.on('close', (code) => {
    if (code === 0) {
      // Run next search
      setTimeout(() => {
        runSequentialSearches(queries, index + 1);
      }, 2000); // 2 second delay between searches
    } else {
      console.error(`❌ Search ${index + 1} failed with code ${code}`);
      process.exit(code);
    }
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: goalie-optimize <query> [command]');
  console.log('');
  console.log('Commands:');
  console.log('  search  - Run optimized search (default)');
  console.log('  raw     - Run raw search with decomposed queries');
  console.log('  multi   - Run multiple sequential searches');
  console.log('  direct  - Same as raw');
  console.log('');
  console.log('Examples:');
  console.log('  goalie-optimize "etymology and cultural history of autodidactic learning"');
  console.log('  goalie-optimize "autodidactic learning history" raw');
  console.log('  goalie-optimize "self-taught traditions" multi');
  process.exit(0);
}

const query = args[0];
const command = args[1] || 'search';

// Check for API key
if (!process.env.PERPLEXITY_API_KEY) {
  console.error('❌ Error: PERPLEXITY_API_KEY not set');
  console.error('Please run: export PERPLEXITY_API_KEY="your-key-here"');
  process.exit(1);
}

runOptimizedGoalie(query, command);
