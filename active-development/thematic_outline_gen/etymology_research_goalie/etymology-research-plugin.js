/**
 * Etymology & Cultural History Research Plugin for GOALIE
 * Generates intelligent, specialized queries for autodidactic learning research
 * Based on rUv's plugin architecture
 */

export default {
  name: "etymology-cultural-research",
  version: "1.0.0",
  description: "Intelligent query decomposition for etymology and cultural history research",
  
  hooks: {
    /**
     * Pre-process queries before GOAP planning
     * This intercepts and transforms queries into specialized research paths
     */
    beforeSearch: (context) => {
      const query = context.query.toLowerCase();
      console.log('🔬 Etymology Research Plugin: Analyzing query...');
      
      // Detect etymology/cultural history queries
      if (query.includes('etymology') || query.includes('cultural') || 
          query.includes('autodidact') || query.includes('history')) {
        
        console.log('📚 Generating specialized research queries...');
        
        // Extract key concepts
        const concepts = extractConcepts(query);
        
        // Generate intelligent query variants
        context.queries = generateSpecializedQueries(concepts);
        
        console.log(`✨ Generated ${context.queries.length} specialized queries`);
        context.queries.forEach((q, i) => {
          console.log(`  ${i + 1}. ${q}`);
        });
      }
      
      return context;
    },
    
    /**
     * Post-process results to add etymology-specific analysis
     */
    afterSynthesize: (result) => {
      // Add linguistic analysis metadata
      if (result.answer) {
        result.metadata = result.metadata || {};
        result.metadata.linguisticAnalysis = {
          languages: detectLanguages(result.answer),
          etymologyDepth: calculateEtymologyDepth(result.answer),
          culturalReferences: extractCulturalReferences(result.answer)
        };
      }
      return result;
    },
    
    /**
     * Customize planning strategy for etymology research
     */
    beforePlanning: (state) => {
      // Override default GOAP goals for etymology research
      if (state.query && isEtymologyQuery(state.query)) {
        state.goals = [
          {
            name: 'find_linguistic_roots',
            priority: 10,
            conditions: ['has_etymology_data']
          },
          {
            name: 'trace_cultural_evolution',
            priority: 8,
            conditions: ['has_cultural_context']
          },
          {
            name: 'identify_cross_linguistic_patterns',
            priority: 6,
            conditions: ['has_multilingual_data']
          },
          {
            name: 'map_historical_timeline',
            priority: 5,
            conditions: ['has_historical_references']
          }
        ];
      }
      return state;
    }
  }
};

/**
 * Extract key concepts from query
 */
function extractConcepts(query) {
  const concepts = {
    primary: '',
    linguistic: [],
    cultural: [],
    temporal: [],
    geographic: []
  };
  
  // Primary term extraction
  if (query.includes('autodidact')) {
    concepts.primary = 'autodidact';
    concepts.linguistic.push('didaktikos', 'didaskein', 'self-taught');
  }
  
  // Linguistic markers
  const linguisticTerms = ['etymology', 'origin', 'root', 'derive', 'linguistic'];
  linguisticTerms.forEach(term => {
    if (query.includes(term)) {
      concepts.linguistic.push(term);
    }
  });
  
  // Cultural markers
  const culturalTerms = ['cultural', 'tradition', 'society', 'civilization', 'heritage'];
  culturalTerms.forEach(term => {
    if (query.includes(term)) {
      concepts.cultural.push(term);
    }
  });
  
  // Temporal markers
  const temporalTerms = ['history', 'ancient', 'medieval', 'renaissance', 'modern', 'contemporary'];
  temporalTerms.forEach(term => {
    if (query.includes(term)) {
      concepts.temporal.push(term);
    }
  });
  
  // Geographic/cultural regions
  const geographicTerms = ['global', 'greek', 'latin', 'arabic', 'chinese', 'indian', 'european', 'african'];
  geographicTerms.forEach(term => {
    if (query.includes(term)) {
      concepts.geographic.push(term);
    }
  });
  
  return concepts;
}

/**
 * Generate specialized queries based on extracted concepts
 */
function generateSpecializedQueries(concepts) {
  const queries = [];
  
  // Core etymology query
  if (concepts.primary === 'autodidact') {
    // Greek/Latin roots
    queries.push('autodidact didaktikos Greek etymology didaskein teaching self');
    
    // Proto-Indo-European connections
    queries.push('autodidact Proto-Indo-European roots dek receive self-education');
    
    // Latin evolution
    queries.push('autodidactus Latin medieval scholarly tradition self-taught');
  }
  
  // Linguistic depth queries
  if (concepts.linguistic.length > 0) {
    // Cross-linguistic analysis
    queries.push('self-taught learner multilingual equivalents autodidacte Selbstbildung zixue');
    
    // Semantic evolution
    queries.push('autodidact semantic shift historical usage evolution meaning');
    
    // Morphological analysis
    queries.push('auto- prefix didact suffix morphology word formation patterns');
  }
  
  // Cultural history queries
  if (concepts.cultural.length > 0) {
    // Ancient traditions
    queries.push('ancient Greek paideia self-education Socratic method autodidactic');
    
    // Islamic tradition
    queries.push('Islamic ijazah self-study tradition mutalim ilm autodidactic scholarship');
    
    // East Asian concepts
    queries.push('Confucian self-cultivation zixue Japanese dokugaku autodidactic');
    
    // Renaissance humanism
    queries.push('Renaissance polymaths autodidacts Leonardo da Vinci self-education');
    
    // Enlightenment philosophy
    queries.push('Enlightenment self-improvement autodidactic Bildung education philosophy');
  }
  
  // Historical development queries
  if (concepts.temporal.length > 0) {
    // Historical timeline
    queries.push('autodidactic learning historical timeline ancient modern development');
    
    // Educational revolutions
    queries.push('printing press autodidactic learning democratization knowledge self-education');
    
    // Digital age transformation
    queries.push('internet MOOCs autodidactic learning digital transformation self-directed');
  }
  
  // Geographic/cultural variations
  if (concepts.geographic.length > 0 || concepts.geographic.length === 0) {
    // Global survey
    queries.push('autodidactic traditions worldwide cultural comparison self-learning methods');
    
    // Indigenous knowledge systems
    queries.push('indigenous knowledge transmission autodidactic oral traditions self-learning');
    
    // Modern global movements
    queries.push('unschooling movement autodidactic education alternative learning worldwide');
  }
  
  // Interdisciplinary connections
  queries.push('autodidacticism psychology neuroscience learning theory self-directed');
  queries.push('famous autodidacts history science art literature self-taught geniuses');
  queries.push('autodidactic learning cognitive science metacognition self-regulation');
  
  // Remove duplicates and limit to reasonable number
  const uniqueQueries = [...new Set(queries)];
  
  // Return top 5-7 most relevant queries (GOAP can handle this many)
  return uniqueQueries.slice(0, 7);
}

/**
 * Check if query is etymology-related
 */
function isEtymologyQuery(query) {
  const keywords = ['etymology', 'origin', 'linguistic', 'cultural history', 
                    'autodidact', 'root', 'derive', 'language'];
  return keywords.some(keyword => query.toLowerCase().includes(keyword));
}

/**
 * Detect languages mentioned in results
 */
function detectLanguages(text) {
  const languages = [];
  const languagePatterns = {
    'Greek': /\b(Greek|Hellenic|Ancient Greek)\b/gi,
    'Latin': /\b(Latin|Roman|Classical Latin)\b/gi,
    'Proto-Indo-European': /\b(Proto-Indo-European|PIE)\b/gi,
    'Sanskrit': /\b(Sanskrit|Vedic)\b/gi,
    'Arabic': /\b(Arabic|Classical Arabic)\b/gi,
    'Chinese': /\b(Chinese|Mandarin|Classical Chinese)\b/gi,
    'Germanic': /\b(Germanic|German|Anglo-Saxon)\b/gi,
    'Romance': /\b(Romance|French|Spanish|Italian)\b/gi
  };
  
  for (const [language, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(text)) {
      languages.push(language);
    }
  }
  
  return languages;
}

/**
 * Calculate etymology depth score
 */
function calculateEtymologyDepth(text) {
  let depth = 0;
  
  // Check for proto-language references
  if (/Proto-Indo-European|PIE/i.test(text)) depth += 3;
  
  // Check for ancient language references
  if (/Ancient Greek|Classical Latin|Sanskrit/i.test(text)) depth += 2;
  
  // Check for medieval references
  if (/Medieval|Middle Ages|Byzantine/i.test(text)) depth += 1;
  
  // Check for multiple language families
  const families = text.match(/\b(Indo-European|Semitic|Sino-Tibetan|Dravidian)\b/gi);
  if (families) depth += families.length;
  
  return Math.min(depth, 10); // Cap at 10
}

/**
 * Extract cultural references
 */
function extractCulturalReferences(text) {
  const references = [];
  
  const culturalPatterns = [
    { pattern: /\b(Socrat\w+|Plato\w+|Aristotel\w+)\b/gi, category: 'Greek Philosophy' },
    { pattern: /\b(Renaissance|Humanis\w+|Enlightenment)\b/gi, category: 'European Movements' },
    { pattern: /\b(Confuci\w+|Taois\w+|Buddhis\w+)\b/gi, category: 'Eastern Philosophy' },
    { pattern: /\b(Islamic|Muslim|Arabic)\s+\w*learning\b/gi, category: 'Islamic Scholarship' },
    { pattern: /\b(monastic|monastery|scriptori\w+)\b/gi, category: 'Medieval Learning' },
    { pattern: /\b(guild|apprentice\w+|master\w+)\b/gi, category: 'Craft Traditions' }
  ];
  
  culturalPatterns.forEach(({ pattern, category }) => {
    const matches = text.match(pattern);
    if (matches) {
      references.push({
        category,
        mentions: matches.length,
        examples: [...new Set(matches)].slice(0, 3)
      });
    }
  });
  
  return references;
}

console.log('📚 Etymology & Cultural Research Plugin Loaded Successfully!');
