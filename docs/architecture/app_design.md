# Sinónimos de Ver - Application Architecture Design

## Executive Summary

A visually-driven, educational web application for exploring Spanish synonyms of "ver" through contextual imagery, interactive examples, and cultural insights. Built with modern web standards, emphasizing performance, accessibility, and aesthetic sophistication.

---

## 1. Technical Stack

### Core Technologies
- **Framework**: Vanilla JavaScript with ES6+ modules (progressive enhancement path to React/Vue if needed)
- **Build System**: Vite (fast dev server, optimized production builds)
- **Styling**: CSS Modules + CSS Custom Properties
- **Image Provider**: Unsplash API
- **State Management**: Custom event-driven architecture
- **Storage**: IndexedDB (persistent cache) + SessionStorage (ephemeral state)

### Rationale
- Vanilla JS provides maximum control and minimal bundle size
- Vite enables rapid development with HMR
- CSS Modules prevent style collisions while maintaining readability
- IndexedDB allows offline-capable caching strategies

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Card View   │  │ Detail Panel │  │ Practice Mode │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │State Manager │  │Event Mediator│  │ Router       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                        Service Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Image Service │  │Content Svc   │  │ Cache Svc    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Unsplash API │  │  IndexedDB   │  │ JSON Content │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Component Structure

### 3.1 Core Components

#### SynonymCard Component
```javascript
/**
 * Visual card displaying synonym with contextual image
 *
 * Props:
 * - synonym: { word, definition, examples, formality, regions }
 * - image: { url, alt, photographer, downloadUrl }
 * - layout: 'grid' | 'list' | 'featured'
 *
 * States:
 * - loading | loaded | error | expanded
 *
 * Features:
 * - Lazy image loading with IntersectionObserver
 * - Progressive text reveal on hover/tap
 * - Smooth expand-to-detail transition
 */
```

**Visual Structure**:
```
┌───────────────────────────────┐
│                               │
│     [Contextual Image]        │
│                               │
│  ┌─────────────────────────┐ │
│  │ MIRAR                   │ │
│  │ To look at, watch       │ │
│  │                         │ │
│  │ [Formality: Neutral]    │ │
│  │ [Expand for examples →] │ │
│  └─────────────────────────┘ │
│                               │
│  Photo by [name] on Unsplash  │
└───────────────────────────────┘
```

#### DetailPanel Component
```javascript
/**
 * Expanded view with comprehensive information
 *
 * Sections:
 * - Hero image with semantic overlay
 * - Definition and etymology
 * - Contextual examples (3-5)
 * - Cultural notes panel
 * - Regional variations map
 * - Related synonyms carousel
 * - Practice exercises
 */
```

#### PracticeMode Component
```javascript
/**
 * Interactive learning exercises
 *
 * Exercise Types:
 * - Fill-in-the-blank with context
 * - Formality matching
 * - Regional usage scenarios
 * - Synonym substitution checker
 *
 * Gamification:
 * - Progress tracking
 * - Spaced repetition hints
 * - Visual feedback animations
 */
```

#### FilterBar Component
```javascript
/**
 * Content filtering and sorting
 *
 * Filters:
 * - Formality level (formal → informal)
 * - Regional usage (Spain, Mexico, Argentina, etc.)
 * - Semantic nuance (physical sight, understanding, meeting, etc.)
 * - Practice status (new, learning, mastered)
 */
```

### 3.2 Service Layer Components

#### ImageService
```javascript
class ImageService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.unsplash.com';
    this.cache = new ImageCache();
  }

  /**
   * Fetch contextually appropriate image for synonym
   *
   * Strategy:
   * 1. Check IndexedDB cache (30-day TTL)
   * 2. Query Unsplash with semantic keywords
   * 3. Select highest relevance score
   * 4. Preload next 3 images in background
   * 5. Cache with metadata
   *
   * @param {string} synonym - Target word
   * @param {object} context - Semantic context for search
   * @returns {Promise<ImageData>}
   */
  async fetchForSynonym(synonym, context = {}) {
    // Implementation
  }

  /**
   * Semantic keyword mapping
   *
   * Maps Spanish verbs to visually-rich English search terms
   * Examples:
   * - mirar → "person looking, gazing, watching"
   * - observar → "observation, examining closely, scrutiny"
   * - contemplar → "contemplation, peaceful viewing, meditation"
   */
  buildSearchQuery(synonym, context) {
    // Implementation
  }

  /**
   * Lazy loading with IntersectionObserver
   */
  lazyLoad(elements, options = {}) {
    // Implementation
  }
}
```

#### CacheService
```javascript
class CacheService {
  constructor() {
    this.db = null;
    this.init();
  }

  /**
   * IndexedDB schema:
   *
   * Store: images
   * - id (primary key)
   * - synonymId (index)
   * - imageData (blob)
   * - metadata (object)
   * - timestamp (index)
   * - expiresAt (index)
   *
   * Store: content
   * - id (primary key)
   * - type (examples, cultural_notes, etc.)
   * - data (object)
   * - timestamp
   *
   * Store: userProgress
   * - synonymId (primary key)
   * - practiceCount
   * - lastPracticed
   * - masteryLevel (0-100)
   */
  async init() {
    // Implementation
  }

  /**
   * Smart cache eviction
   *
   * Strategy:
   * - LRU for images over quota
   * - TTL-based for stale content
   * - User progress never evicted
   */
  async evict() {
    // Implementation
  }
}
```

#### ContentService
```javascript
class ContentService {
  /**
   * Load synonym data with progressive enhancement
   *
   * Data structure:
   * {
   *   id: "mirar",
   *   word: "mirar",
   *   definition: "To look at or watch something/someone",
   *   etymology: "From Latin 'mirari' (to wonder at)",
   *   formality: "neutral",
   *   frequency: "high",
   *   examples: [
   *     {
   *       spanish: "Mira este cuadro",
   *       english: "Look at this painting",
   *       context: "casual",
   *       region: "universal"
   *     }
   *   ],
   *   culturalNotes: {
   *     usage: "Most common synonym, neutral register",
   *     regionalVariations: [...]
   *   },
   *   semanticTags: ["physical-sight", "attention", "observation"],
   *   relatedSynonyms: ["observar", "contemplar", "ver"]
   * }
   */
  async loadSynonyms() {
    // Implementation
  }

  /**
   * Filter and sort synonyms
   */
  filter(synonyms, criteria) {
    // Implementation
  }
}
```

---

## 4. Data Flow Architecture

### 4.1 Application Initialization Flow

```
User Loads App
      ↓
Check Service Worker
      ↓
Load Critical CSS (inline)
      ↓
Initialize State Manager
      ↓
Load Synonym Metadata (JSON)
      ↓
Render Skeleton UI
      ↓
┌─────────────────┐
│ Check Cache     │
│ - Recent images │
│ - User progress │
└─────────────────┘
      ↓
Render Cards (with placeholders)
      ↓
Lazy Load Images (viewport priority)
      ↓
Background: Prefetch next screen
```

### 4.2 Card Interaction Flow

```
User Hovers/Taps Card
      ↓
Emit: card.hover
      ↓
Animate: Reveal overlay
      ↓
Preload: Detail content
      ↓
User Clicks/Taps
      ↓
Emit: card.expand
      ↓
Transition: Card → Detail Panel
      ↓
Load: Full examples, cultural notes
      ↓
Activate: Practice mode button
```

### 4.3 Image Loading Flow

```
Card Enters Viewport
      ↓
Check IndexedDB Cache
      │
      ├─ Cache Hit
      │     ↓
      │  Load from IndexedDB
      │     ↓
      │  Render Image
      │
      └─ Cache Miss
            ↓
      Query Unsplash API
            ↓
      ┌──────────────────────┐
      │ Search Parameters:   │
      │ - Semantic keywords  │
      │ - Orientation: any   │
      │ - Per page: 10       │
      │ - Content filter: high│
      └──────────────────────┘
            ↓
      Select Best Match (relevance score)
            ↓
      Download Image (progressive)
            ↓
      Store in IndexedDB
            ↓
      Render Image
            ↓
      Prefetch Related Images
```

### 4.4 State Management Flow

```javascript
/**
 * Event-Driven State Architecture
 *
 * Central event bus with typed events
 * Unidirectional data flow
 * Immutable state updates
 */

// State shape
const appState = {
  synonyms: Map,           // All synonym data
  displayedCards: Array,   // Currently visible cards
  activeDetail: Object,    // Expanded detail view
  filters: Object,         // Active filters
  practiceMode: Object,    // Practice session state
  userProgress: Map,       // Learning progress
  imageCache: Map,         // Loaded images
  ui: {
    layout: 'grid',        // grid | list | featured
    theme: 'light',        // light | dark | auto
    reducedMotion: false
  }
};

// Event types
const events = {
  // Data events
  'synonyms.loaded': (payload) => {},
  'image.loaded': (payload) => {},

  // UI events
  'card.hover': (cardId) => {},
  'card.expand': (cardId) => {},
  'detail.close': () => {},

  // Filter events
  'filter.apply': (filters) => {},
  'filter.clear': () => {},

  // Practice events
  'practice.start': (synonymId) => {},
  'practice.answer': (answer) => {},
  'practice.complete': (results) => {}
};
```

---

## 5. Visual Design System

### 5.1 Color Palette

**Primary Colors** (Sophisticated, Cultural)
```css
:root {
  /* Primary - Deep Terracotta (Spanish tile inspiration) */
  --color-primary-50: #fef5f3;
  --color-primary-100: #fde8e3;
  --color-primary-500: #c44d2c;
  --color-primary-700: #8b3520;
  --color-primary-900: #4a1d11;

  /* Secondary - Azul Añil (Indigo, traditional Spanish dye) */
  --color-secondary-50: #f0f4f8;
  --color-secondary-100: #d9e2ec;
  --color-secondary-500: #3e4c59;
  --color-secondary-700: #243141;
  --color-secondary-900: #102a43;

  /* Accent - Saffron Gold (warmth, learning) */
  --color-accent-50: #fffbea;
  --color-accent-100: #fff3c4;
  --color-accent-500: #f7c948;
  --color-accent-700: #d4a927;
  --color-accent-900: #8c6a1c;

  /* Neutrals - Warm grays */
  --color-neutral-50: #fafaf9;
  --color-neutral-100: #f5f5f4;
  --color-neutral-300: #d6d3d1;
  --color-neutral-500: #78716c;
  --color-neutral-700: #44403c;
  --color-neutral-900: #1c1917;

  /* Semantic colors */
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #0284c7;
}
```

**Dark Mode Palette**
```css
[data-theme="dark"] {
  --color-bg-primary: var(--color-neutral-900);
  --color-bg-secondary: #292524;
  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-300);
  --color-border: var(--color-neutral-700);
}
```

### 5.2 Typography System

```css
/**
 * Typography Scale - Modular (1.250 - Major Third)
 *
 * Optimized for readability and visual hierarchy
 * System font stack for performance
 */

:root {
  /* Font families */
  --font-display: 'Playfair Display', 'Georgia', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* Type scale */
  --text-xs: 0.64rem;      /* 10.24px */
  --text-sm: 0.8rem;       /* 12.8px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.25rem;      /* 20px */
  --text-xl: 1.563rem;     /* 25px */
  --text-2xl: 1.953rem;    /* 31.25px */
  --text-3xl: 2.441rem;    /* 39px */
  --text-4xl: 3.052rem;    /* 48.8px */

  /* Line heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Letter spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;

  /* Font weights */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}

/* Typography components */
.type-display {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.type-heading-1 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
}

.type-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-normal);
  line-height: var(--leading-relaxed);
}

.type-caption {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}
```

### 5.3 Spacing System

```css
/**
 * Spacing Scale - 8px base grid
 * Consistent rhythm throughout the interface
 */

:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.5rem;    /* 24px */
  --space-6: 2rem;      /* 32px */
  --space-8: 3rem;      /* 48px */
  --space-10: 4rem;     /* 64px */
  --space-12: 6rem;     /* 96px */
  --space-16: 8rem;     /* 128px */

  /* Layout spacing */
  --container-padding: var(--space-4);
  --card-padding: var(--space-5);
  --section-gap: var(--space-8);
}

@media (min-width: 768px) {
  :root {
    --container-padding: var(--space-6);
    --card-padding: var(--space-6);
    --section-gap: var(--space-12);
  }
}
```

### 5.4 Layout Grid System

```css
/**
 * Responsive Grid - Mobile-first
 *
 * Breakpoints:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 */

.grid-container {
  display: grid;
  gap: var(--space-4);
  padding: var(--container-padding);

  /* Mobile: 1 column */
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-container {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    /* Desktop: 3-4 columns */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-6);
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### 5.5 Image Overlay Treatments

```css
/**
 * Text-over-image techniques
 * Ensures readability while maintaining visual appeal
 */

.card-image-overlay {
  position: relative;
  overflow: hidden;
}

/* Gradient scrim */
.card-image-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(28, 25, 23, 0.95) 0%,
    rgba(28, 25, 23, 0.6) 40%,
    rgba(28, 25, 23, 0) 70%
  );
  transition: opacity 0.3s ease;
}

/* Text content */
.card-image-overlay .card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--card-padding);
  z-index: 1;
  color: var(--color-neutral-50);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Glassmorphism variant */
.card-glass {
  backdrop-filter: blur(12px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .card-glass {
  background-color: rgba(41, 37, 36, 0.85);
  border-color: rgba(68, 64, 60, 0.3);
}
```

---

## 6. Animation and Interaction Design

### 6.1 Motion Principles

```css
/**
 * Animation system
 *
 * Principles:
 * - Purposeful motion (guides attention)
 * - Respects prefers-reduced-motion
 * - Performant (GPU-accelerated properties only)
 * - Consistent easing curves
 */

:root {
  /* Durations */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;

  /* Easing curves */
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.2 Key Animations

```css
/* Card hover effect */
.synonym-card {
  transition: transform var(--duration-base) var(--ease-out-quad),
              box-shadow var(--duration-base) var(--ease-out-quad);
  will-change: transform;
}

.synonym-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Card expand animation */
@keyframes expandCard {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.95);
    opacity: 0;
  }
}

/* Skeleton loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 0%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 100%
  );
  background-size: 2000px 100%;
  animation: shimmer 2s infinite linear;
}

/* Stagger fade-in for cards */
.card-enter {
  animation: fadeInUp var(--duration-slow) var(--ease-out-expo) backwards;
}

.card-enter:nth-child(1) { animation-delay: 0ms; }
.card-enter:nth-child(2) { animation-delay: 50ms; }
.card-enter:nth-child(3) { animation-delay: 100ms; }
.card-enter:nth-child(4) { animation-delay: 150ms; }
/* etc. */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 7. API Integration Patterns

### 7.1 Unsplash API Service

```javascript
/**
 * Unsplash API Integration
 *
 * API Key: DPM5yTFbvoZW0imPQWe5pAXAxbEMhhBZE1GllByUPzY
 * Rate Limit: 50 requests/hour (demo apps)
 *
 * Endpoints used:
 * - GET /search/photos (contextual images)
 * - GET /photos/:id (high-res download)
 * - GET /photos/random (fallback)
 */

class UnsplashAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.unsplash.com';
    this.rateLimiter = new RateLimiter(50, 3600000); // 50 per hour
  }

  /**
   * Search photos with semantic context
   *
   * @param {string} query - Search term
   * @param {object} options - Search parameters
   * @returns {Promise<Array>} Photo results
   */
  async searchPhotos(query, options = {}) {
    await this.rateLimiter.acquire();

    const params = new URLSearchParams({
      query,
      page: options.page || 1,
      per_page: options.perPage || 10,
      orientation: options.orientation || 'landscape',
      content_filter: 'high',
      order_by: options.orderBy || 'relevant'
    });

    const response = await fetch(
      `${this.baseUrl}/search/photos?${params}`,
      {
        headers: {
          'Authorization': `Client-ID ${this.apiKey}`,
          'Accept-Version': 'v1'
        }
      }
    );

    if (!response.ok) {
      throw new UnsplashAPIError(response.status, await response.text());
    }

    const data = await response.json();
    return this.transformResults(data.results);
  }

  /**
   * Transform API results to app format
   */
  transformResults(results) {
    return results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      urlSmall: photo.urls.small,
      urlThumb: photo.urls.thumb,
      urlFull: photo.urls.full,
      alt: photo.alt_description || photo.description || '',
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profileUrl: photo.user.links.html
      },
      color: photo.color,
      width: photo.width,
      height: photo.height,
      likes: photo.likes,
      downloadUrl: photo.links.download_location,
      unsplashUrl: photo.links.html
    }));
  }

  /**
   * Download photo (trigger download tracking)
   * Required by Unsplash API guidelines
   */
  async triggerDownload(downloadUrl) {
    await fetch(downloadUrl, {
      headers: {
        'Authorization': `Client-ID ${this.apiKey}`
      }
    });
  }

  /**
   * Semantic query builder for synonyms
   *
   * Maps Spanish verbs to visually-rich English concepts
   */
  buildSemanticQuery(synonym) {
    const queryMap = {
      'mirar': 'person looking gazing watching scene',
      'observar': 'observation examining scrutiny analysis',
      'contemplar': 'contemplation peaceful meditation scenic vista',
      'divisar': 'distant view horizon perspective landscape',
      'ojear': 'glancing browsing casual looking',
      'avistar': 'spotting sighting discovering nature wildlife',
      'vislumbrar': 'glimpse partial view mysterious shadow light',
      'inspeccionar': 'inspection detailed examination professional',
      'vigilar': 'surveillance watching guard security monitoring',
      'otear': 'scanning horizon searching wide view',
      'espiar': 'spying peeking covert watching hidden',
      'atisbar': 'peeking through window door crack curtain',
      'percibir': 'perception sensing awareness consciousness',
      'presenciar': 'witnessing event ceremony gathering crowd',
      'asistir': 'attending event performance audience',
      'visitar': 'visiting traveling tourism destination culture',
      'examinar': 'examination studying research laboratory',
      'revisar': 'reviewing checking documents paperwork',
      'chequear': 'checking verification inspection quality',
      'consultar': 'consultation advice professional expert meeting'
    };

    return queryMap[synonym] || `${synonym} visual concept`;
  }
}

/**
 * Rate limiter implementation
 */
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquire(); // Retry
    }

    this.requests.push(now);
  }
}
```

### 7.2 Caching Strategy

```javascript
/**
 * Three-tier caching strategy
 *
 * Tier 1: Memory cache (runtime)
 * Tier 2: IndexedDB (persistent, 30-day TTL)
 * Tier 3: Unsplash API (network)
 */

class ImageCacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.dbCache = new IndexedDBCache('images');
    this.maxMemorySize = 50 * 1024 * 1024; // 50MB
    this.ttl = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  /**
   * Get image with multi-tier fallback
   */
  async get(key, fetcher) {
    // Tier 1: Memory
    if (this.memoryCache.has(key)) {
      console.log('[Cache] Memory hit:', key);
      return this.memoryCache.get(key);
    }

    // Tier 2: IndexedDB
    const cached = await this.dbCache.get(key);
    if (cached && !this.isExpired(cached.timestamp)) {
      console.log('[Cache] DB hit:', key);
      this.memoryCache.set(key, cached.data);
      return cached.data;
    }

    // Tier 3: Network
    console.log('[Cache] Network fetch:', key);
    const data = await fetcher();

    // Store in both caches
    this.memoryCache.set(key, data);
    await this.dbCache.set(key, {
      data,
      timestamp: Date.now()
    });

    this.enforceMemoryLimit();
    return data;
  }

  isExpired(timestamp) {
    return Date.now() - timestamp > this.ttl;
  }

  enforceMemoryLimit() {
    // LRU eviction if over limit
    const currentSize = this.calculateMemorySize();
    if (currentSize > this.maxMemorySize) {
      const toRemove = Math.floor(this.memoryCache.size * 0.2);
      const keys = Array.from(this.memoryCache.keys());
      keys.slice(0, toRemove).forEach(key => {
        this.memoryCache.delete(key);
      });
    }
  }
}
```

---

## 8. Performance Optimization

### 8.1 Loading Strategy

```javascript
/**
 * Prioritized resource loading
 *
 * Critical path:
 * 1. HTML shell
 * 2. Critical CSS (inline)
 * 3. App bundle (deferred)
 * 4. Synonym data (preload)
 *
 * Progressive enhancement:
 * 5. Hero images (high priority)
 * 6. Below-fold images (lazy)
 * 7. Detail content (on-demand)
 * 8. Practice assets (prefetch)
 */

// Resource hints in HTML
/*
<link rel="preconnect" href="https://api.unsplash.com">
<link rel="dns-prefetch" href="https://images.unsplash.com">
<link rel="preload" href="/data/synonyms.json" as="fetch">
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
*/

// Image lazy loading
const imageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  },
  {
    rootMargin: '50px 0px', // Start loading 50px before viewport
    threshold: 0.01
  }
);
```

### 8.2 Performance Metrics

```javascript
/**
 * Target metrics (mobile 3G)
 *
 * - First Contentful Paint: < 1.8s
 * - Largest Contentful Paint: < 2.5s
 * - Time to Interactive: < 3.8s
 * - Total Blocking Time: < 200ms
 * - Cumulative Layout Shift: < 0.1
 *
 * Strategies:
 * - Code splitting (route-based)
 * - Tree shaking (unused code elimination)
 * - Image optimization (WebP, AVIF with fallbacks)
 * - Font subsetting (Latin + Latin Extended)
 * - Service Worker (offline capability)
 */

// Performance monitoring
class PerformanceMonitor {
  static measure() {
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('[Perf] LCP:', lastEntry.renderTime || lastEntry.loadTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('[Perf] FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      let clsScore = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            console.log('[Perf] CLS:', clsScore);
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
}
```

---

## 9. Accessibility

### 9.1 ARIA Implementation

```html
<!-- Card component with full ARIA support -->
<article
  class="synonym-card"
  role="article"
  aria-labelledby="card-title-mirar"
  aria-describedby="card-desc-mirar"
>
  <div class="card-image" role="img" aria-label="Person gazing at a scenic vista">
    <img
      src="..."
      alt=""
      loading="lazy"
      decoding="async"
    >
  </div>

  <div class="card-content">
    <h2 id="card-title-mirar" class="card-title">Mirar</h2>
    <p id="card-desc-mirar" class="card-definition">
      To look at or watch something or someone
    </p>

    <button
      class="card-expand"
      aria-expanded="false"
      aria-controls="detail-mirar"
      aria-label="Show detailed information about mirar"
    >
      Learn more
      <span aria-hidden="true">→</span>
    </button>
  </div>

  <div class="card-metadata">
    <span class="sr-only">Formality level:</span>
    <span aria-label="Neutral formality">Neutral</span>
  </div>
</article>
```

### 9.2 Keyboard Navigation

```javascript
/**
 * Comprehensive keyboard support
 *
 * Card grid:
 * - Arrow keys: Navigate cards
 * - Enter/Space: Expand card
 * - Escape: Close detail view
 *
 * Detail panel:
 * - Tab: Navigate interactive elements
 * - Escape: Close and return focus
 *
 * Practice mode:
 * - Number keys: Quick answer selection
 * - Enter: Submit answer
 */

class KeyboardNavigationManager {
  constructor(gridElement) {
    this.grid = gridElement;
    this.cards = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.grid.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowRight':
          e.preventDefault();
          this.moveNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.movePrevious();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.moveUp();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.activateCurrent();
          break;
        case 'Home':
          e.preventDefault();
          this.moveToFirst();
          break;
        case 'End':
          e.preventDefault();
          this.moveToLast();
          break;
      }
    });
  }

  // Implementation methods...
}
```

---

## 10. File Structure

```
sinonimos-de-ver/
├── src/
│   ├── index.html
│   ├── main.js
│   ├── styles/
│   │   ├── tokens.css              # Design tokens
│   │   ├── reset.css               # CSS reset
│   │   ├── typography.css          # Type system
│   │   ├── layout.css              # Grid & spacing
│   │   ├── components/
│   │   │   ├── card.css
│   │   │   ├── detail-panel.css
│   │   │   ├── filter-bar.css
│   │   │   └── practice-mode.css
│   │   └── utilities.css           # Utility classes
│   │
│   ├── scripts/
│   │   ├── components/
│   │   │   ├── SynonymCard.js
│   │   │   ├── DetailPanel.js
│   │   │   ├── FilterBar.js
│   │   │   └── PracticeMode.js
│   │   │
│   │   ├── services/
│   │   │   ├── UnsplashAPI.js
│   │   │   ├── ImageService.js
│   │   │   ├── CacheService.js
│   │   │   └── ContentService.js
│   │   │
│   │   ├── state/
│   │   │   ├── StateManager.js
│   │   │   ├── EventBus.js
│   │   │   └── store.js
│   │   │
│   │   └── utils/
│   │       ├── dom.js
│   │       ├── animation.js
│   │       └── accessibility.js
│   │
│   ├── data/
│   │   ├── synonyms.json           # Core synonym data
│   │   ├── examples.json           # Example sentences
│   │   └── cultural-notes.json     # Regional info
│   │
│   └── assets/
│       ├── fonts/
│       └── icons/
│
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── service-worker.js
│   └── robots.txt
│
├── docs/
│   └── architecture/
│       └── app_design.md           # This document
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── vite.config.js
├── package.json
└── README.md
```

---

## 11. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup Vite project structure
- [ ] Implement design system (tokens, typography, colors)
- [ ] Create SynonymCard component
- [ ] Integrate Unsplash API
- [ ] Implement basic caching (IndexedDB)

### Phase 2: Core Features (Week 2)
- [ ] Build DetailPanel component
- [ ] Implement FilterBar
- [ ] Add state management
- [ ] Create lazy loading system
- [ ] Build responsive layouts

### Phase 3: Learning Features (Week 3)
- [ ] Develop PracticeMode component
- [ ] Add progress tracking
- [ ] Implement spaced repetition hints
- [ ] Create cultural notes display
- [ ] Add regional variation toggles

### Phase 4: Polish & Performance (Week 4)
- [ ] Optimize image loading
- [ ] Add animations and transitions
- [ ] Implement accessibility features
- [ ] Add PWA capabilities
- [ ] Performance audit and optimization
- [ ] Cross-browser testing

### Phase 5: Enhancement (Ongoing)
- [ ] A/B test different layouts
- [ ] Gather user feedback
- [ ] Add more synonyms
- [ ] Expand practice exercises
- [ ] Consider gamification features

---

## 12. Success Metrics

### Technical Metrics
- Lighthouse score: 95+ (all categories)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Bundle size: < 100KB (gzipped)
- Image cache hit rate: > 80%

### User Experience Metrics
- Task completion rate: > 90%
- Average session duration: > 3 minutes
- Practice mode engagement: > 60%
- Return user rate: > 40%
- Mobile usage: > 50%

### Educational Metrics
- Synonym retention rate: > 70% (7 days)
- Practice completion rate: > 75%
- Cultural note engagement: > 40%
- Average synonyms learned per session: > 5

---

## 13. Future Enhancements

1. **Audio Pronunciation**
   - Native speaker recordings
   - Regional accent variations
   - Pronunciation practice mode

2. **Community Features**
   - User-submitted example sentences
   - Voting on best examples
   - Discussion forums per synonym

3. **Advanced Learning**
   - AI-powered example generation
   - Contextual usage recommendations
   - Writing assistant integration

4. **Personalization**
   - Learning path based on proficiency
   - Favorite synonyms collection
   - Custom practice sets

5. **Expansion**
   - More verb families (hacer, decir, etc.)
   - Adjective and noun synonyms
   - Multilingual support (English, French, etc.)

---

## Appendix A: Synonym Data Schema

```javascript
{
  "id": "mirar",
  "word": "mirar",
  "definition": {
    "es": "Dirigir la vista hacia algo o alguien",
    "en": "To look at or watch something or someone"
  },
  "etymology": "From Latin 'mirari' (to wonder at, admire)",
  "ipa": "mi.ˈɾaɾ",

  "classification": {
    "formality": "neutral",        // formal | neutral | informal
    "frequency": "very_high",       // very_high | high | medium | low | rare
    "register": "general",          // general | literary | colloquial | technical
    "semantic_field": "vision"      // vision | perception | understanding
  },

  "usage": {
    "transitivity": "transitive",
    "commonPrepositions": ["a", "hacia", "por"],
    "commonContexts": ["physical sight", "attention", "watching"]
  },

  "examples": [
    {
      "spanish": "Mira este cuadro impresionante",
      "english": "Look at this impressive painting",
      "context": "art appreciation",
      "formality": "neutral",
      "region": "universal",
      "audioUrl": "/audio/examples/mirar_001.mp3"
    }
  ],

  "culturalNotes": {
    "usage": "Most common and neutral synonym for 'ver'...",
    "regionalVariations": [
      {
        "region": "Spain",
        "notes": "Used universally across all regions"
      },
      {
        "region": "Mexico",
        "notes": "Often paired with 'no más' for emphasis"
      }
    ],
    "expressions": [
      {
        "phrase": "¡Mira que...!",
        "meaning": "Look how/what...!",
        "usage": "Expressing surprise or admiration"
      }
    ]
  },

  "relations": {
    "synonyms": ["observar", "contemplar", "ver"],
    "antonyms": ["ignorar", "desatender"],
    "related": ["mirada", "mirón", "mirador"]
  },

  "imageQuery": {
    "primary": "person looking gazing watching",
    "alternative": "eyes vision sight perspective",
    "exclude": "blind blindness closed-eyes"
  },

  "practiceExercises": [
    {
      "type": "fill_blank",
      "prompt": "_____ el atardecer desde la ventana",
      "correctAnswer": "Mira",
      "distractors": ["Observa", "Contempla", "Ve"],
      "explanation": "Mirar is the most natural choice for casual observation"
    }
  ]
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-26
**Author**: System Architecture Designer
**Status**: Ready for Implementation
