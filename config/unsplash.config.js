/**
 * Unsplash API Configuration
 * Configuration for image search and retrieval
 */

export const UNSPLASH_CONFIG = {
  // API Configuration
  accessKey: 'DPM5yTFbvoZW0imPQWe5pAXAxbEMhhBZE1GllByUPzY',
  apiBaseUrl: 'https://api.unsplash.com',

  // Image Quality Settings
  imageQuality: {
    default: 'regular', // raw, full, regular, small, thumb
    thumbnail: 'small',
    highRes: 'regular'
  },

  // Dimensions
  dimensions: {
    width: 1200,
    height: 800,
    thumbnailWidth: 400,
    thumbnailHeight: 300
  },

  // Rate Limiting
  rateLimit: {
    requestsPerHour: 50,
    requestDelay: 100 // ms between requests
  },

  // Cache Settings
  cache: {
    enabled: true,
    ttl: 3600000, // 1 hour in milliseconds
    maxSize: 50 // maximum cached items
  },

  // Search Settings
  search: {
    perPage: 10,
    orientation: 'landscape',
    contentFilter: 'high'
  },

  // Contextual search terms for each synonym
  synonymSearchTerms: {
    // Base verb
    'ver': 'person seeing beautiful view nature',

    // Observation and attention
    'observar': 'person observing nature wildlife contemplation',
    'mirar': 'person looking horizon landscape scenic',
    'contemplar': 'meditation contemplation peaceful nature',
    'examinar': 'examination study close inspection detail',
    'inspeccionar': 'inspection detailed analysis examination',
    'escudriñar': 'searching intense focus investigation',
    'otear': 'looking distance horizon scanning landscape',
    'atisbar': 'peeking glimpse window door',
    'avistar': 'spotting discovery distant view',
    'divisar': 'distant horizon landscape mountains vista',
    'vislumbrar': 'glimpse fog mist mysterious light',

    // Quick/brief looks
    'ojear': 'quick glance skimming browsing',
    'echar un vistazo': 'casual look browsing overview',
    'dar un vistazo': 'quick peek glance',
    'echar un ojo': 'casual checking monitoring',

    // Watching/monitoring
    'vigilar': 'watching guard security monitoring',
    'custodiar': 'guarding protecting surveillance',
    'acechar': 'watching waiting predator nature',
    'espiar': 'secret observation privacy investigation',

    // Visual experience
    'presenciar': 'witnessing event moment experience',
    'asistir': 'attending witnessing ceremony event',
    'percibir': 'perception awareness sensory experience',
    'advertir': 'noticing awareness discovery',
    'notar': 'noticing detail observation awareness',
    'distinguir': 'distinction clarity detail recognition',
    'discernir': 'discernment clarity understanding wisdom',
    'apreciar': 'appreciation beauty art nature',
    'reconocer': 'recognition familiar discovery',
    'identificar': 'identification recognition analysis',

    // Media/visual content
    'visualizar': 'visualization data graphics technology',
    'visionar': 'viewing screening cinema presentation',
    'proyectar': 'projection cinema screen presentation',

    // Meeting/encounter
    'encontrarse con': 'meeting encounter people connection',
    'reunirse con': 'gathering meeting collaboration teamwork',
    'entrevistarse': 'interview meeting professional discussion',

    // Visit
    'visitar': 'tourism travel exploration adventure',

    // Understanding
    'comprender': 'understanding learning knowledge enlightenment',
    'entender': 'comprehension clarity insight understanding',

    // Optics/vision
    'enfocar': 'focus lens clarity precision photography',
    'desenfocar': 'blur soft focus bokeh artistic',

    // Appearance
    'parecer': 'appearance perception impression reflection',
    'aparentar': 'seeming appearance facade',
    'asemejarse': 'resemblance similarity comparison',

    // States of seeing
    'cegar': 'blindness light darkness contrast',
    'deslumbrar': 'dazzling brilliant light stunning beauty',
    'alucinar': 'hallucination surreal dreamlike vision',

    // Perspective
    'perspectiva': 'perspective vanishing point architecture geometry',
    'punto de vista': 'viewpoint overlook scenic vista panorama',

    // Types of vision
    'visión periférica': 'peripheral wide angle broad view',
    'visión nocturna': 'night vision darkness stars moonlight',
    'visión borrosa': 'blurry unclear fog mist atmospheric'
  },

  // Fallback images (placeholder gradient colors)
  fallbackColors: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ],

  // Error messages
  errorMessages: {
    rateLimitExceeded: 'Rate limit exceeded. Using cached images.',
    networkError: 'Network error. Using placeholder images.',
    noResults: 'No images found. Using placeholder.',
    invalidResponse: 'Invalid API response. Using fallback.'
  }
};

// Attribution template
export const ATTRIBUTION_TEMPLATE = {
  text: 'Photo by {photographer} on Unsplash',
  link: '{photographerUrl}?utm_source=sinonimos_de_ver&utm_medium=referral'
};
