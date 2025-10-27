/**
 * Synonym Data Management
 * Sample data and utilities for managing synonym information
 */

/**
 * Sample synonym data
 */
export const SYNONYM_DATA = [
  {
    word: 'observar',
    definition: 'Mirar con atención algo o a alguien',
    examples: [
      'Observar las estrellas en la noche',
      'El científico observa el comportamiento de los animales',
      'Observar detenidamente un cuadro en el museo'
    ],
    category: 'attention',
    next: 'contemplar'
  },
  {
    word: 'contemplar',
    definition: 'Mirar algo con atención y detenimiento, especialmente algo bello o que inspira admiración',
    examples: [
      'Contemplar la puesta de sol',
      'Sentarse a contemplar el paisaje',
      'Contemplar una obra de arte'
    ],
    category: 'appreciation',
    next: 'divisar'
  },
  {
    word: 'divisar',
    definition: 'Ver o percibir algo desde lejos',
    examples: [
      'Divisar las montañas en el horizonte',
      'Desde la torre se puede divisar toda la ciudad',
      'Los marineros divisaron tierra'
    ],
    category: 'distance',
    next: 'vislumbrar'
  },
  {
    word: 'vislumbrar',
    definition: 'Ver algo de manera imprecisa o confusa',
    examples: [
      'Vislumbrar una figura entre la niebla',
      'Vislumbrar una solución al problema',
      'Se vislumbra un futuro prometedor'
    ],
    category: 'glimpse',
    next: 'avistar'
  },
  {
    word: 'avistar',
    definition: 'Ver o descubrir algo, especialmente desde lejos',
    examples: [
      'Avistar ballenas desde el barco',
      'Los exploradores avistaron una isla desconocida',
      'Avistar aves migratorias'
    ],
    category: 'discovery',
    next: 'otear'
  },
  {
    word: 'otear',
    definition: 'Mirar desde un lugar alto observando el horizonte',
    examples: [
      'Otear el horizonte en busca de señales',
      'Desde la colina se puede otear el valle',
      'El vigía otea el mar'
    ],
    category: 'scanning',
    next: 'vigilar'
  },
  {
    word: 'vigilar',
    definition: 'Observar o cuidar con atención algo o a alguien',
    examples: [
      'Vigilar a los niños en el parque',
      'Las cámaras vigilan el edificio',
      'Vigilar el proceso de cocción'
    ],
    category: 'monitoring',
    next: 'examinar'
  },
  {
    word: 'examinar',
    definition: 'Observar y analizar algo con cuidado y atención',
    examples: [
      'El médico examina al paciente',
      'Examinar un documento con lupa',
      'Examinar las pruebas del caso'
    ],
    category: 'analysis',
    next: 'inspeccionar'
  },
  {
    word: 'inspeccionar',
    definition: 'Examinar o reconocer atentamente algo',
    examples: [
      'Inspeccionar la calidad del producto',
      'El inspector inspecciona las instalaciones',
      'Inspeccionar el estado del vehículo'
    ],
    category: 'examination',
    next: 'escudriñar'
  },
  {
    word: 'escudriñar',
    definition: 'Examinar algo con mucho cuidado y atención para conocerlo bien',
    examples: [
      'Escudriñar cada detalle del contrato',
      'Escudriñar en los archivos antiguos',
      'El detective escudriña la escena del crimen'
    ],
    category: 'investigation',
    next: 'atisbar'
  }
];

/**
 * Get synonym by word
 * @param {string} word - Synonym word
 * @returns {Object|null}
 */
export function getSynonymByWord(word) {
  return SYNONYM_DATA.find(s => s.word === word) || null;
}

/**
 * Get next synonym
 * @param {string} currentWord - Current synonym word
 * @returns {Object|null}
 */
export function getNextSynonym(currentWord) {
  const current = getSynonymByWord(currentWord);
  if (!current || !current.next) return null;
  return getSynonymByWord(current.next);
}

/**
 * Get previous synonym
 * @param {string} currentWord - Current synonym word
 * @returns {Object|null}
 */
export function getPreviousSynonym(currentWord) {
  const currentIndex = SYNONYM_DATA.findIndex(s => s.word === currentWord);
  if (currentIndex <= 0) return null;
  return SYNONYM_DATA[currentIndex - 1];
}

/**
 * Get synonyms by category
 * @param {string} category - Category name
 * @returns {Array<Object>}
 */
export function getSynonymsByCategory(category) {
  return SYNONYM_DATA.filter(s => s.category === category);
}

/**
 * Get all categories
 * @returns {Array<string>}
 */
export function getAllCategories() {
  return [...new Set(SYNONYM_DATA.map(s => s.category))];
}

/**
 * Get random synonym
 * @returns {Object}
 */
export function getRandomSynonym() {
  const index = Math.floor(Math.random() * SYNONYM_DATA.length);
  return SYNONYM_DATA[index];
}

/**
 * Search synonyms by term
 * @param {string} term - Search term
 * @returns {Array<Object>}
 */
export function searchSynonyms(term) {
  const lowerTerm = term.toLowerCase();
  return SYNONYM_DATA.filter(s =>
    s.word.toLowerCase().includes(lowerTerm) ||
    s.definition.toLowerCase().includes(lowerTerm) ||
    s.examples.some(ex => ex.toLowerCase().includes(lowerTerm))
  );
}

export default {
  SYNONYM_DATA,
  getSynonymByWord,
  getNextSynonym,
  getPreviousSynonym,
  getSynonymsByCategory,
  getAllCategories,
  getRandomSynonym,
  searchSynonyms
};
