/**
 * Test Data Fixtures
 * Provides consistent test data for all test suites
 */

// === Synonym Test Data ===

export const mockSynonym = {
  verb: 'observar',
  pronunciation: 'ob-ser-var',
  quickDefinition: 'Mirar atentamente',
  definition: 'Examinar algo con atención y detenimiento, estudiando sus detalles y características para comprenderlo mejor.',
  formality: 'neutral',
  context: 'profesional',
  regions: ['general'],
  examples: [
    'El científico observa las células bajo el microscopio.',
    'Observamos el comportamiento de los animales en su hábitat natural.',
    'Es importante observar las señales de tráfico.'
  ],
  culturalNotes: 'Término común en contextos científicos y educativos en toda Latinoamérica.',
  image: 'assets/images/synonyms/observar.jpg'
};

export const mockLiterarySynonym = {
  verb: 'contemplar',
  pronunciation: 'con-tem-plar',
  quickDefinition: 'Mirar con admiración',
  definition: 'Observar algo o a alguien con atención, admiración o pensamiento profundo, a menudo en un estado de reflexión.',
  formality: 'formal',
  context: 'literario',
  regions: ['general'],
  examples: [
    'Contemplaba el atardecer desde la ventana.',
    'Se quedó contemplando la obra de arte durante horas.',
    'Contempló las estrellas en silencio.'
  ],
  culturalNotes: 'Palabra frecuente en literatura y poesía, con connotaciones filosóficas y espirituales.',
  image: 'assets/images/synonyms/contemplar.jpg',
  narrativeExperience: {
    title: 'El Contemplador de Horizontes',
    parts: [
      'En la quietud del amanecer, el viejo pescador contemplaba el mar infinito. Sus ojos, curtidos por años de observar el océano, buscaban en el horizonte las señales que solo él sabía interpretar.',
      'La contemplación se había convertido en su forma de entender el mundo. No era solo mirar, era absorber la esencia misma de lo que sus ojos capturaban, dejando que el paisaje penetrara en su alma.',
      'Y así, contemplando las olas que venían y se iban, comprendió que la verdadera sabiduría no estaba en buscar respuestas, sino en saber observar las preguntas que el universo susurraba.'
    ],
    literaryNote: 'La palabra "contemplar" es fundamental en la literatura contemplativa española y latinoamericana, utilizada por autores como Octavio Paz y Pablo Neruda para expresar una forma profunda de observación que trasciende lo físico.'
  }
};

export const mockSynonymSet = [
  mockSynonym,
  mockLiterarySynonym,
  {
    verb: 'mirar',
    pronunciation: 'mi-rar',
    quickDefinition: 'Dirigir la vista',
    definition: 'Fijar la vista en algo o alguien con intención de verlo.',
    formality: 'neutral',
    context: 'cotidiano',
    regions: ['general'],
    examples: [
      'Mira ese hermoso paisaje.',
      '¿Miraste la película ayer?',
      'No mires hacia atrás.'
    ],
    culturalNotes: 'Verbo básico y universal en español, usado en todo tipo de contextos.',
    image: 'assets/images/synonyms/mirar.jpg'
  }
];

// === Unsplash Test Data ===

export const mockUnsplashPhoto = {
  id: 'test-photo-123',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  width: 4000,
  height: 3000,
  color: '#2C3E50',
  description: 'A beautiful landscape photograph',
  alt_description: 'Mountain landscape at sunset',
  urls: {
    raw: 'https://images.unsplash.com/test-photo?raw',
    full: 'https://images.unsplash.com/test-photo?full',
    regular: 'https://images.unsplash.com/test-photo?w=1080',
    small: 'https://images.unsplash.com/test-photo?w=400',
    thumb: 'https://images.unsplash.com/test-photo?w=200'
  },
  links: {
    self: 'https://api.unsplash.com/photos/test-photo-123',
    html: 'https://unsplash.com/photos/test-photo-123',
    download: 'https://unsplash.com/photos/test-photo-123/download',
    download_location: 'https://api.unsplash.com/photos/test-photo-123/download'
  },
  user: {
    id: 'photographer-1',
    username: 'testphotographer',
    name: 'Test Photographer',
    first_name: 'Test',
    last_name: 'Photographer',
    portfolio_url: 'https://unsplash.com/@testphotographer',
    bio: 'Professional photographer',
    links: {
      self: 'https://api.unsplash.com/users/testphotographer',
      html: 'https://unsplash.com/@testphotographer',
      photos: 'https://api.unsplash.com/users/testphotographer/photos'
    }
  }
};

export const mockImageMetadata = {
  filename: 'observar.jpg',
  photographer: 'Test Photographer',
  photographerUrl: 'https://unsplash.com/@testphotographer',
  unsplashUrl: 'https://unsplash.com/photos/test-photo-123',
  description: 'A beautiful landscape photograph',
  color: '#2C3E50',
  width: 4000,
  height: 3000,
  query: 'observing studying examining science',
  attemptNumber: 1,
  downloadedAt: '2025-01-01T00:00:00.000Z'
};

// === Audio Test Data ===

export const mockAudioMetadata = {
  verbs: {
    observar: {
      file: 'assets/audio/verbs/observar.mp3',
      voice: 'mx_female_1',
      text: 'observar'
    }
  },
  examples: {
    observar: [
      {
        file: 'assets/audio/examples/observar_example_1.mp3',
        voice: 'mx_female_1',
        text: 'El científico observa las células bajo el microscopio.'
      }
    ]
  },
  narratives: {
    contemplar: [
      {
        file: 'assets/audio/narratives/contemplar_narrativa_1.mp3',
        voice: 'co_male_1',
        text: 'En la quietud del amanecer...',
        partNumber: 1
      }
    ]
  },
  voices: {
    mx_female_1: {
      name: 'es-MX-DaliaNeural',
      region: 'MX',
      gender: 'female_1'
    }
  },
  generatedAt: '2025-01-01T00:00:00.000Z'
};

// === Generator Test Data ===

export const mockGeneratorConfig = {
  verb: 'ver',
  synonymCount: 10,
  outputDir: '/test/output',
  options: {
    generateImages: true,
    generateAudio: true,
    templateName: 'modern'
  }
};

export const mockTemplateConfig = {
  name: 'modern',
  htmlTemplate: 'templates/modern.html',
  cssTemplate: 'templates/modern.css',
  jsTemplate: 'templates/modern.js',
  assets: {
    fonts: ['fonts/Inter.woff2'],
    images: ['images/logo.svg']
  }
};

// === Error Scenarios ===

export const errorScenarios = {
  unsplash: {
    rateLimit: {
      message: 'Unsplash API error: Rate limit exceeded',
      statusCode: 429
    },
    unauthorized: {
      message: 'Unsplash API error: Invalid access token',
      statusCode: 401
    },
    notFound: {
      message: 'No results found for query: nonexistent',
      statusCode: 404
    },
    network: {
      message: 'Network error: ECONNREFUSED',
      code: 'ECONNREFUSED'
    }
  },
  anthropic: {
    auth: {
      message: 'Claude API error: Authentication failed',
      statusCode: 401
    },
    rateLimit: {
      message: 'Claude API error: Rate limit exceeded',
      statusCode: 429
    },
    invalidJson: {
      message: 'Failed to parse Claude response: Invalid JSON',
      code: 'INVALID_JSON'
    }
  },
  audio: {
    pythonNotFound: {
      message: 'Failed to spawn edge-tts: Python not installed',
      code: 'ENOENT'
    },
    invalidVoice: {
      message: 'edge-tts failed: Invalid voice',
      code: 'INVALID_VOICE'
    },
    installFailed: {
      message: 'Failed to install edge-tts: pip not found',
      code: 'INSTALL_ERROR'
    }
  },
  filesystem: {
    permission: {
      message: 'EACCES: permission denied',
      code: 'EACCES'
    },
    notFound: {
      message: 'ENOENT: no such file or directory',
      code: 'ENOENT'
    },
    diskFull: {
      message: 'ENOSPC: no space left on device',
      code: 'ENOSPC'
    }
  }
};

// === File Structure Fixtures ===

export const mockFileStructure = {
  files: {
    '/output/index.html': '<html>Test HTML</html>',
    '/output/styles.css': 'body { margin: 0; }',
    '/output/data/synonyms.json': JSON.stringify(mockSynonymSet),
    '/output/assets/images/synonyms/observar.jpg': 'binary-image-data',
    '/output/assets/audio/verbs/observar.mp3': 'binary-audio-data'
  },
  directories: [
    '/output',
    '/output/assets',
    '/output/assets/images',
    '/output/assets/images/synonyms',
    '/output/assets/audio',
    '/output/assets/audio/verbs',
    '/output/assets/audio/examples',
    '/output/data'
  ]
};

// === Helper Functions for Fixtures ===

/**
 * Create a custom synonym with overrides
 */
export function createSynonym(overrides = {}) {
  return {
    ...mockSynonym,
    ...overrides
  };
}

/**
 * Create a literary synonym with narrative
 */
export function createLiterarySynonym(overrides = {}) {
  return {
    ...mockLiterarySynonym,
    ...overrides
  };
}

/**
 * Create a set of synonyms
 */
export function createSynonymSet(count = 3, options = {}) {
  const synonyms = [];
  const literaryCount = options.literaryCount || 2;

  for (let i = 0; i < count; i++) {
    const base = i < literaryCount ? mockLiterarySynonym : mockSynonym;
    synonyms.push({
      ...base,
      verb: `${base.verb}_${i + 1}`,
      image: `assets/images/synonyms/${base.verb}_${i + 1}.jpg`,
      ...(options.overrides || {})
    });
  }

  return synonyms;
}

/**
 * Create Unsplash photo data
 */
export function createUnsplashPhoto(overrides = {}) {
  return {
    ...mockUnsplashPhoto,
    ...overrides
  };
}

/**
 * Create image metadata
 */
export function createImageMetadata(overrides = {}) {
  return {
    ...mockImageMetadata,
    ...overrides
  };
}

/**
 * Create audio metadata
 */
export function createAudioMetadata(overrides = {}) {
  return {
    ...mockAudioMetadata,
    ...overrides
  };
}

/**
 * Create file structure for seeding
 */
export function createFileStructure(overrides = {}) {
  return {
    files: {
      ...mockFileStructure.files,
      ...(overrides.files || {})
    },
    directories: [
      ...mockFileStructure.directories,
      ...(overrides.directories || [])
    ]
  };
}

export default {
  mockSynonym,
  mockLiterarySynonym,
  mockSynonymSet,
  mockUnsplashPhoto,
  mockImageMetadata,
  mockAudioMetadata,
  mockGeneratorConfig,
  mockTemplateConfig,
  errorScenarios,
  mockFileStructure,
  createSynonym,
  createLiterarySynonym,
  createSynonymSet,
  createUnsplashPhoto,
  createImageMetadata,
  createAudioMetadata,
  createFileStructure
};
