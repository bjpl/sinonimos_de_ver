# Sinónimos de Ver - Project Specification

## Overview

A sophisticated, visual web application for learning Spanish synonyms of the verb "ver" (to see), designed for intermediate/advanced LATAM Spanish learners. The app features curated high-quality images, elegant typography, and interactive learning features with zero external API dependencies.

---

## Core Features

### 1. Visual Synonym Cards (14 Total)
- **Grid layout** with contextual high-quality images
- **Hover interaction** reveals quick definition overlay
- **Click to expand** opens detailed modal view
- **Lazy loading** for optimized performance
- **Photographer credits** visible on cards

### 2. Advanced Filtering System
- **Formality filter**: Formal (9 verbs), Neutral (5 verbs)
- **Context filter**: Cotidiano (2), Literario (6), Profesional (5), Narrativo (1)
- **Search**: Real-time text search across verb names and definitions
- **Reset button**: Clear all filters instantly
- **Combinable filters**: Multiple filters work together

### 3. Detailed Modal View
Each synonym shows:
- Large contextual image with photographer credit
- Verb with pronunciation guide
- Formality and context tags with icons
- Complete nuanced definition
- 3 authentic usage examples (with verb highlighting)
- Cultural notes explaining LATAM usage patterns
- Unsplash attribution links

### 4. Interactive Elements
- Smooth scroll to content from hero
- Keyboard shortcuts (Escape to close modal)
- Animated card entrance (staggered)
- Hover zoom effects on images
- Responsive design (mobile-first)

---

## Data Structure

### Synonym Object Schema
```json
{
  "verb": "string",              // Spanish infinitive
  "pronunciation": "string",      // Syllable breakdown (e.g., "ob-ser-var")
  "quickDefinition": "string",    // Brief gloss
  "definition": "string",         // Detailed explanation
  "formality": "formal|neutral",  // Only 2 values
  "context": "cotidiano|literario|profesional|narrativo",
  "regions": ["general"],         // All entries use "general"
  "image": "string",              // Relative path to local JPG
  "examples": ["string"],         // Array of 3 sentences
  "culturalNotes": "string"       // LATAM usage notes
}
```

### Image Credits Schema
```json
{
  "images": {
    "verb_name": {
      "filename": "string",
      "photographer": "string",
      "photographerUrl": "string",
      "unsplashUrl": "string",
      "description": "string",
      "color": "string",
      "width": number,
      "height": number
    }
  },
  "downloadedAt": "ISO8601 timestamp",
  "attribution": "string"
}
```

---

## Technical Architecture

### Frontend Stack
- **HTML5**: Semantic structure, accessibility-focused
- **CSS3**: Custom styling, no frameworks
- **Vanilla JavaScript**: No external libraries, ES6+
- **Local assets**: All images stored locally (no API calls)

### File Structure
```
sinonimos_de_ver/
├── src/
│   ├── index.html                  # Main application
│   ├── styles/
│   │   └── main.css               # Complete styling (~600 lines)
│   ├── scripts/
│   │   └── app.js                 # Application logic (~320 lines)
│   ├── data/
│   │   ├── synonyms.json          # 14 synonym entries
│   │   └── image_credits.json     # Photographer metadata
│   └── assets/
│       └── images/
│           ├── hero/
│           │   └── hero.jpg       # Landing page image
│           └── synonyms/
│               └── *.jpg          # 14 synonym images
├── scripts/
│   ├── download_images.js         # Unsplash download script
│   └── download_missing.js        # Fallback download
├── docs/
│   ├── content/
│   │   └── ver_synonyms_research.md
│   ├── architecture/
│   │   └── app_design.md
│   └── reviews/
│       └── ux_sophistication_review.md
└── README.md
```

### Key Design Decisions
1. **No external dependencies**: Works completely offline
2. **Local images**: 15 curated JPGs (~1.5MB total)
3. **Simple data model**: JSON files (no database needed)
4. **Progressive enhancement**: Works without JavaScript for basic content
5. **Semantic HTML**: Screen reader friendly

---

## Visual Design System

### Typography
- **Serif (Spanish text)**: Cormorant Garamond (300, 400, 500, 600, 700)
- **Sans-serif (UI/English)**: Inter (300, 400, 500, 600)
- **Hierarchy**: Clear distinction between headings, body, and meta text

### Color Palette
- **Primary**: Deep blue-grays (#2d3748, #4a5568)
- **Backgrounds**: White (#ffffff) with subtle grays
- **Accents**: Muted terracotta/saffron tones
- **No bright primaries**: Sophisticated, elegant palette

### Layout
- **Hero section**: Full-screen with overlay text
- **Grid**: Responsive masonry (1-3 columns)
- **Cards**: 400px max width, 16:9 images
- **Modal**: Full-screen overlay with centered content
- **Spacing**: 8px base grid system

### Interactive States
- **Hover**: Image zoom (1.05x), overlay fade-in
- **Active**: Subtle shadow and transform
- **Focus**: Visible outline for accessibility
- **Loading**: Lazy loading with native browser support

---

## Performance Specifications

### Target Metrics
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Total Bundle Size**: ~1.5MB (images) + ~50KB (code)
- **Time to Interactive**: < 3.8s

### Optimization Techniques
- Lazy loading for off-screen images
- Staggered card animations (50ms delay)
- No external fonts (Google Fonts CDN)
- Minimal JavaScript (~320 lines)
- Single CSS file (no preprocessor)

---

## Content Specifications

### 14 Synonyms Included

**Neutral Formality:**
1. observar (profesional) - Examinar atentamente
2. divisar (cotidiano) - Ver con dificultad o a distancia
3. notar (cotidiano) - Darse cuenta de algo
4. acechar (narrativo) - Vigilar con intención oculta

**Formal Formality:**
5. contemplar (literario) - Mirar con atención y detenimiento
6. avistar (profesional) - Ver algo desde lejos
7. percibir (profesional) - Captar a través de los sentidos
8. advertir (profesional) - Notar algo importante
9. vislumbrar (literario) - Ver de manera imprecisa o anticipar
10. atisbar (literario) - Mirar con cuidado o disimulo
11. otear (literario) - Escudriñar desde un lugar alto
12. columbrar (literario) - Divisar imprecisamente o deducir
13. constatar (profesional) - Verificar con certeza
14. entrever (literario) - Ver incompletamente o sospechar

### Image Curation Strategy
Each image contextually represents the verb's semantic meaning:
- **observar**: Wildlife observation with binoculars
- **contemplar**: Person meditating peacefully
- **divisar**: Distant mountain landscape
- **avistar**: Whale watching scene
- **otear**: Observation tower/lookout
- **acechar**: Surveillance/stalking imagery
- **vislumbrar**: Glimpse through fog
- etc.

---

## User Experience Flow

### 1. Landing (Hero Section)
- User sees elegant hero image with title
- "Explorar" button scrolls to content
- Scroll indicator encourages interaction

### 2. Browsing
- User sees 14 synonym cards in grid
- Hover reveals quick definition
- Visual tags indicate formality/context

### 3. Filtering
- User selects formality or context
- Cards filter in real-time
- "No results" state if no matches
- Reset button clears all filters

### 4. Learning
- User clicks card to open modal
- Reads full definition and examples
- Sees verb conjugations highlighted
- Reads cultural usage notes
- Views photographer credit

### 5. Searching
- User types in search box
- Cards filter by verb name or definition
- Combines with formality/context filters

---

## Browser Support

### Tested & Supported
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

### Required Features
- CSS Grid
- Flexbox
- Fetch API
- ES6 (arrow functions, template literals, const/let)
- Lazy loading (native `loading="lazy"`)

---

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML5 elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators visible
- Alt text on all images
- Color contrast ratios meet standards
- Screen reader friendly structure

### Keyboard Shortcuts
- **Tab**: Navigate through cards
- **Enter**: Open card modal
- **Escape**: Close modal
- **Space**: Scroll page

---

## Setup & Deployment

### Local Development
```bash
# Start local server
python -m http.server 8000

# Or with Node.js
npx http-server -p 8000

# Access at
http://localhost:8000/src/index.html
```

### Production Requirements
- Static file server (no backend needed)
- HTTPS recommended (for best practices)
- Gzip compression enabled
- Cache headers for images (1 year)
- Cache headers for JSON (1 hour)

### No Build Process Needed
- No compilation
- No bundling
- No transpilation
- Direct file serving

---

## Limitations & Future Enhancements

### Current Limitations
1. All synonyms marked as "general" region (no specific LATAM variations)
2. Only 14 synonyms (could expand to 30+)
3. No audio pronunciation
4. No spaced repetition/quiz mode
5. No user progress tracking

### Potential Enhancements
1. Add specific regional variants (Mexico, Argentina, Colombia, etc.)
2. Audio pronunciation with native speakers
3. Interactive quiz mode
4. Spaced repetition system (SRS)
5. User accounts with progress tracking
6. Export to Anki flashcards
7. More verbs (mirar, observar variations)
8. Verb conjugation tables
9. Comparison mode (side-by-side synonyms)
10. Dark mode toggle

---

## License & Attribution

### Images
- Source: Unsplash
- License: Unsplash License (free to use)
- Attribution: Required (implemented in UI)
- 15 photographers credited

### Code
- Original work
- No external libraries
- Open for educational use

### Fonts
- Cormorant Garamond: SIL Open Font License
- Inter: SIL Open Font License
- Served via Google Fonts CDN

---

## Success Metrics

### Educational Effectiveness
- Clear visual associations
- Authentic usage examples
- Cultural context provided
- Formality awareness built-in

### User Engagement
- Average 2-3 minutes per session expected
- 5-7 cards explored per session
- Modal views indicate deep learning

### Technical Performance
- 100% offline capable
- <2s initial load
- 60fps animations
- Zero runtime errors

---

**Version**: 1.0.0
**Date**: October 2025
**Target Audience**: Intermediate/Advanced LATAM Spanish learners
**Deployment**: Static web application
