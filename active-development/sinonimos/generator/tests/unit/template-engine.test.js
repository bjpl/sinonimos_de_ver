/**
 * TemplateEngine Tests
 * Comprehensive test coverage for HTML and README template generation
 */

import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { TemplateEngine } from '../../src/core/TemplateEngine.js';

describe('TemplateEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new TemplateEngine();
  });

  describe('Constructor', () => {
    it('should initialize with empty templates object', () => {
      expect(engine.templates).toBeDefined();
      expect(typeof engine.templates).toBe('object');
      expect(Object.keys(engine.templates)).toHaveLength(0);
    });
  });

  describe('generateIndex()', () => {
    const mockData = {
      verb: 'ver',
      synonyms: [
        {
          verb: 'observar',
          definition: 'Mirar con atención',
          formality: 'formal',
          context: ['profesional']
        }
      ],
      metadata: {
        title: 'Sinónimos de Ver',
        description: 'Explora sinónimos del verbo ver'
      }
    };

    it('should generate valid HTML5 structure', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="es">');
      expect(html).toContain('</html>');
      expect(html).toContain('<head>');
      expect(html).toContain('</head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');
    });

    it('should inject metadata into head', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain(`<title>${mockData.metadata.title}</title>`);
      expect(html).toContain(`<meta name="description" content="${mockData.metadata.description}">`);
      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    });

    it('should include security headers', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('http-equiv="Content-Security-Policy"');
      expect(html).toContain('http-equiv="X-Content-Type-Options"');
      expect(html).toContain('http-equiv="X-Frame-Options"');
      expect(html).toContain('name="referrer"');
      expect(html).toContain('content="nosniff"');
      expect(html).toContain('content="DENY"');
      expect(html).toContain('strict-origin-when-cross-origin');
    });

    it('should include CSP with proper directives', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain("default-src 'self'");
      expect(html).toContain("script-src 'self' 'unsafe-inline'");
      expect(html).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
      expect(html).toContain("img-src 'self' https://images.unsplash.com");
      expect(html).toContain("frame-ancestors 'none'");
    });

    it('should include Google Fonts preconnect', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('<link rel="preconnect" href="https://fonts.googleapis.com">');
      expect(html).toContain('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
      expect(html).toContain('family=Cormorant+Garamond');
      expect(html).toContain('family=Inter');
    });

    it('should include stylesheet links', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('<link rel="stylesheet" href="styles/main.css">');
      expect(html).toContain('<link rel="stylesheet" href="styles/narrative.css">');
    });

    it('should render hero section with capitalized verb', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('Sinónimos de Ver');
      expect(html).toContain('class="hero-title"');
      expect(html).toContain('Descubre la riqueza del lenguaje en español');
      expect(html).toContain('class="hero-subtitle"');
    });

    it('should include search and filter controls', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('id="search-input"');
      expect(html).toContain('Buscar sinónimo...');
      expect(html).toContain('id="formality-filter"');
      expect(html).toContain('id="context-filter"');
      expect(html).toContain('id="reset-filters"');
    });

    it('should include all formality filter options', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('<option value="all">Todas</option>');
      expect(html).toContain('<option value="formal">Formal</option>');
      expect(html).toContain('<option value="neutral">Neutral</option>');
      expect(html).toContain('<option value="informal">Informal</option>');
    });

    it('should include all context filter options', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('<option value="all">Todos los contextos</option>');
      expect(html).toContain('<option value="cotidiano">Cotidiano</option>');
      expect(html).toContain('<option value="literario">Literario</option>');
      expect(html).toContain('<option value="narrativo">Narrativo</option>');
      expect(html).toContain('<option value="profesional">Profesional</option>');
    });

    it('should include detail modal structure', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('id="detail-modal"');
      expect(html).toContain('class="modal-backdrop"');
      expect(html).toContain('class="modal-content"');
      expect(html).toContain('id="modal-verb"');
      expect(html).toContain('id="modal-definition"');
      expect(html).toContain('id="modal-examples"');
    });

    it('should include footer with current year', async () => {
      const html = await engine.generateIndex(mockData);
      const currentYear = new Date().getFullYear();

      expect(html).toContain(`&copy; ${currentYear}`);
      expect(html).toContain('Sinónimos de Ver');
      expect(html).toContain('Generado con ❤️');
      expect(html).toContain('href="https://unsplash.com"');
    });

    it('should include app.js script', async () => {
      const html = await engine.generateIndex(mockData);

      expect(html).toContain('<script src="scripts/app.js"></script>');
    });

    it('should handle special characters in metadata', async () => {
      const dataWithSpecialChars = {
        ...mockData,
        metadata: {
          title: 'Sinónimos "especiales" & otros',
          description: 'Descripción con <tags> y & ampersand'
        }
      };

      const html = await engine.generateIndex(dataWithSpecialChars);

      // Should inject as-is (browser handles escaping)
      expect(html).toContain('Sinónimos "especiales" & otros');
    });

    it('should handle long verb names', async () => {
      const dataWithLongVerb = {
        ...mockData,
        verb: 'contemplar'
      };

      const html = await engine.generateIndex(dataWithLongVerb);

      expect(html).toContain('Sinónimos de Contemplar');
      expect(html).toContain(`${new Date().getFullYear()} Sinónimos de Contemplar`);
    });
  });

  describe('generateReadme()', () => {
    const mockReadmeData = {
      verb: 'ver',
      synonymCount: 25,
      generatedDate: '2025-01-16T00:00:00.000Z'
    };

    it('should generate valid Markdown structure', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('# Sinónimos de Ver');
      expect(readme).toContain('## 📊 Estadísticas');
      expect(readme).toContain('## 🚀 Características');
      expect(readme).toContain('## 📁 Estructura');
      expect(readme).toContain('## 🌐 Uso');
      expect(readme).toContain('## 📝 Licencia');
      expect(readme).toContain('## 🙏 Créditos');
    });

    it('should include synonym count in statistics', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('- **Sinónimos**: 25');
    });

    it('should format generation date correctly', () => {
      const readme = engine.generateReadme(mockReadmeData);
      const expectedDate = new Date(mockReadmeData.generatedDate).toLocaleDateString('es-ES');

      expect(readme).toContain(`- **Generado**: ${expectedDate}`);
    });

    it('should include project description', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('Una colección elegante e interactiva');
      expect(readme).toContain('español latinoamericano');
    });

    it('should list all features', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('Interfaz elegante');
      expect(readme).toContain('Búsqueda y filtros');
      expect(readme).toContain('Audio de pronunciación');
      expect(readme).toContain('Imágenes contextuales');
      expect(readme).toContain('Narrativas literarias');
      expect(readme).toContain('Notas culturales');
      expect(readme).toContain('Diseño responsive');
    });

    it('should include directory structure', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('index.html');
      expect(readme).toContain('assets/');
      expect(readme).toContain('data/');
      expect(readme).toContain('scripts/');
      expect(readme).toContain('styles/');
      expect(readme).toContain('components/');
      expect(readme).toContain('synonyms.json');
      expect(readme).toContain('image_credits.json');
    });

    it('should include usage instructions', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('Simplemente abre `index.html`');
      expect(readme).toContain('python -m http.server 8000');
      expect(readme).toContain('npx serve');
      expect(readme).toContain('php -S localhost:8000');
    });

    it('should include credits section', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('[Unsplash](https://unsplash.com)');
      expect(readme).toContain('Microsoft Edge TTS');
      expect(readme).toContain('Sinónimos Site Generator');
    });

    it('should capitalize verb in title', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('# Sinónimos de Ver');
    });

    it('should handle different synonym counts', () => {
      const dataWithManyVerbs = { ...mockReadmeData, synonymCount: 150 };
      const readme = engine.generateReadme(dataWithManyVerbs);

      expect(readme).toContain('- **Sinónimos**: 150');
    });

    it('should handle recent dates', () => {
      const recentData = {
        ...mockReadmeData,
        generatedDate: new Date().toISOString()
      };
      const readme = engine.generateReadme(recentData);
      const today = new Date().toLocaleDateString('es-ES');

      expect(readme).toContain(`- **Generado**: ${today}`);
    });

    it('should include footer message', () => {
      const readme = engine.generateReadme(mockReadmeData);

      expect(readme).toContain('Generado automáticamente con ❤️');
    });

    it('should handle different verbs correctly', () => {
      const observarData = { ...mockReadmeData, verb: 'observar' };
      const readme = engine.generateReadme(observarData);

      expect(readme).toContain('# Sinónimos de Observar');
      expect(readme).toContain('del verbo "observar"');
    });
  });

  describe('capitalizeFirst()', () => {
    it('should capitalize first letter of lowercase word', () => {
      expect(engine.capitalizeFirst('ver')).toBe('Ver');
      expect(engine.capitalizeFirst('observar')).toBe('Observar');
      expect(engine.capitalizeFirst('contemplar')).toBe('Contemplar');
    });

    it('should handle already capitalized words', () => {
      expect(engine.capitalizeFirst('Ver')).toBe('Ver');
      expect(engine.capitalizeFirst('OBSERVAR')).toBe('OBSERVAR');
    });

    it('should handle single character strings', () => {
      expect(engine.capitalizeFirst('v')).toBe('V');
      expect(engine.capitalizeFirst('a')).toBe('A');
    });

    it('should handle empty strings', () => {
      expect(engine.capitalizeFirst('')).toBe('');
    });

    it('should handle strings with special characters', () => {
      expect(engine.capitalizeFirst('mirar-atentamente')).toBe('Mirar-atentamente');
      expect(engine.capitalizeFirst('ver_todo')).toBe('Ver_todo');
    });

    it('should handle accented characters', () => {
      expect(engine.capitalizeFirst('árbol')).toBe('Árbol');
      expect(engine.capitalizeFirst('observación')).toBe('Observación');
    });

    it('should only capitalize first character', () => {
      expect(engine.capitalizeFirst('ver el mundo')).toBe('Ver el mundo');
      expect(engine.capitalizeFirst('observar atentamente')).toBe('Observar atentamente');
    });

    it('should handle numbers at start', () => {
      expect(engine.capitalizeFirst('123abc')).toBe('123abc');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing metadata gracefully', async () => {
      const dataWithoutMetadata = {
        verb: 'ver',
        synonyms: [],
        metadata: {
          title: undefined,
          description: undefined
        }
      };

      const html = await engine.generateIndex(dataWithoutMetadata);

      expect(html).toContain('<title>undefined</title>');
      expect(html).toContain('content="undefined"');
    });

    it('should handle empty synonyms array', async () => {
      const emptyData = {
        verb: 'ver',
        synonyms: [],
        metadata: {
          title: 'Test',
          description: 'Test'
        }
      };

      const html = await engine.generateIndex(emptyData);

      expect(html).toContain('id="cards-grid"');
      expect(html).toContain('id="no-results"');
    });

    it('should handle zero synonym count in README', () => {
      const zeroData = {
        verb: 'ver',
        synonymCount: 0,
        generatedDate: new Date().toISOString()
      };

      const readme = engine.generateReadme(zeroData);

      expect(readme).toContain('- **Sinónimos**: 0');
    });

    it('should handle very long metadata values', async () => {
      const longData = {
        verb: 'ver',
        synonyms: [],
        metadata: {
          title: 'A'.repeat(500),
          description: 'B'.repeat(1000)
        }
      };

      const html = await engine.generateIndex(longData);

      expect(html).toContain('A'.repeat(500));
      expect(html).toContain('B'.repeat(1000));
    });

    it('should handle special date formats in README', () => {
      const invalidDateData = {
        verb: 'ver',
        synonymCount: 10,
        generatedDate: 'invalid-date'
      };

      const readme = engine.generateReadme(invalidDateData);

      expect(readme).toContain('**Generado**:');
    });

    it('should handle single-character verbs', async () => {
      const singleCharData = {
        verb: 'a',
        synonyms: [],
        metadata: {
          title: 'Test',
          description: 'Test'
        }
      };

      const html = await engine.generateIndex(singleCharData);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
      expect(html).toContain('Sinónimos de A');
    });
  });

  describe('HTML Structure Validation', () => {
    it('should have properly nested modal structure', async () => {
      const data = {
        verb: 'ver',
        synonyms: [],
        metadata: { title: 'Test', description: 'Test' }
      };

      const html = await engine.generateIndex(data);

      // Check modal has backdrop and content
      const modalStart = html.indexOf('id="detail-modal"');
      const backdropPos = html.indexOf('class="modal-backdrop"', modalStart);
      const contentPos = html.indexOf('class="modal-content"', modalStart);

      expect(modalStart).toBeGreaterThan(-1);
      expect(backdropPos).toBeGreaterThan(modalStart);
      expect(contentPos).toBeGreaterThan(backdropPos);
    });

    it('should include all required SVG icons', async () => {
      const data = {
        verb: 'ver',
        synonyms: [],
        metadata: { title: 'Test', description: 'Test' }
      };

      const html = await engine.generateIndex(data);

      // Search icon
      expect(html).toContain('class="search-icon"');
      // Reset button icon
      expect(html).toContain('viewBox="0 0 24 24"');
      // Modal close icon
      expect(html).toContain('M18 6L6 18M6 6l12 12');
      // Hero CTA icon
      expect(html).toContain('M7 13l5 5 5-5M7 6l5 5 5-5');
    });

    it('should have proper onclick handlers', async () => {
      const data = {
        verb: 'ver',
        synonyms: [],
        metadata: { title: 'Test', description: 'Test' }
      };

      const html = await engine.generateIndex(data);

      expect(html).toContain('onclick="scrollToContent()"');
      expect(html).toContain('onclick="closeModal()"');
    });
  });
});
