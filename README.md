# Sinónimos de Ver

An elegant, visual Spanish language learning tool exploring synonyms of "ver" (to see) in Latin American Spanish.

## Live Demo

**Deployed Application:** https://bjpl.github.io/sinonimos_de_ver/

This project demonstrates interactive language learning through synonym exploration, featuring locally-cached high-quality imagery, nuanced definitions, and cultural context for intermediate to advanced Spanish learners.

## Technical Overview

**Key Technologies:**
- Vanilla JavaScript (ES6+)
- HTML5 / CSS3 with modern features
- Unsplash imagery (locally cached)
- Static site deployment
- No external dependencies

**Implementation Highlights:**
- 14 sophisticated synonyms with nuanced definitions
- Fully offline-capable (all assets local)
- Search and filter functionality
- Cultural notes and regional variations
- Responsive masonry grid layout
- Complete photographer attribution system

## Features

**Language Learning:**
- 14 curated synonyms: observar, contemplar, avistar, divisar, percibir, advertir, notar, vislumbrar, atisbar, otear, acechar, columbrar, constatar, entrever
- Detailed definitions with formality indicators
- Authentic usage examples
- Regional variations across Latin America
- Cultural and contextual notes

**Interactive Interface:**
- Real-time search functionality
- Filter by formality level
- Filter by region
- Filter by usage context
- Refined typography and spacing
- High-quality contextual photography

**Offline Architecture:**
- All images stored locally in assets/images/
- No API dependencies at runtime
- Complete photographer credits in data/image_credits.json
- Fast, reliable performance

## Exploring the Code

```
sinonimos_de_ver/
├── src/
│   ├── index.html         # Main application
│   ├── scripts/
│   │   └── app.js        # Application logic
│   ├── styles/
│   │   └── main.css      # Elegant styling
│   ├── data/
│   │   ├── synonyms.json # Complete synonym dataset
│   │   └── image_credits.json # Photographer attributions
│   └── assets/
│       └── images/       # Locally cached images
│           ├── hero/     # Hero image
│           └── synonyms/ # Per-synonym images
├── docs/                 # Documentation
├── scripts/              # Asset download utilities
└── README.md
```

## Local Development

<details>
<summary>Click to expand setup instructions</summary>

```bash
# Clone repository
git clone https://github.com/bjpl/sinonimos_de_ver.git
cd sinonimos_de_ver

# Option 1: Open directly in browser
start src/index.html     # Works offline

# Option 2: Run local server (recommended)
python -m http.server 8000
# Visit http://localhost:8000/src/index.html

# Node.js alternative
npx http-server -p 8000
```

**No Build Required:**
Pure HTML/CSS/JS implementation with no build tools or package managers needed.
</details>

## Design System

**Typography:**
- Cormorant Garamond (elegant serif)
- Inter (clean sans-serif)
- Sophisticated pairing for Spanish content

**Color Palette:**
- Sophisticated neutrals
- No bright primary colors
- Earth-tones aesthetic
- Refined, professional appearance

**Layout:**
- Responsive masonry grid
- Generous whitespace
- Smooth, subtle animations
- Mobile-first responsive design

## Target Audience

Designed for intermediate to advanced Spanish learners seeking:
- Nuanced vocabulary expansion
- Cultural context understanding
- Professional and literary expression
- Latin American Spanish variations

## Attribution

**Images:**
- Source: Unsplash
- License: Unsplash License
- Photographers: Gunnar Ridderström, Vicky Sim, Robin Jonathan Deutsch, John Apps, Stefan Pagacik, DL314 Lin, Charlotte Kirkland, GLADYSTONE FONSECA, Abby Lim, Tima Ilyasov, Y S, Ludovico Ceroseis, Kaspars Eglitis, Pedro J Conesa, wtrsnvc
- Full credits: See src/data/image_credits.json

**Content:**
- Original educational content
- Linguistic research on Latin American Spanish usage
- License: Educational use with attribution

## Related Projects

Part of the Spanish Verb Synonyms Series:
- [Sinónimos de Caminar](https://bjpl.github.io/sinonimos_de_caminar) - Movement verbs
- [Sinónimos de Hablar](https://bjpl.github.io/sinonimos_de_hablar) - Speaking verbs
- [Sinónimos de Comer](https://bjpl.github.io/sinonimos_de_comer) - Eating verbs

---

An educational tool for learning Spanish with elegance and depth
