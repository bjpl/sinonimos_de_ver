# Spanish Verb Synonyms App - Reusable Template

**Complete specification for building elegant, visual Spanish vocabulary learning apps with multiple LATAM voices and curated imagery.**

---

## Quick Start Configuration

### Step 1: Define Your Verb

```json
{
  "targetVerb": "ver",              // Change this to your verb
  "appTitle": "Sinónimos de Ver",   // Update app title
  "description": "Learning visual synonyms in LATAM Spanish",
  "targetAudience": "Intermediate/Advanced learners",
  "synonymCount": 14                // How many synonyms you want
}
```

### Step 2: Project Setup

```bash
# Create project structure
mkdir sinonimos_de_[VERB]
cd sinonimos_de_[VERB]

# Create directory structure
mkdir -p src/{styles,scripts,data,assets/{images/{synonyms,hero},audio/{verbs,examples}}}
mkdir -p docs/{content,architecture,reviews}
mkdir -p scripts
mkdir -p tests

# Initialize git
git init
git remote add origin https://github.com/[USERNAME]/sinonimos_de_[VERB].git
```

---

## File Structure Template

```
sinonimos_de_[VERB]/
├── src/
│   ├── index.html                      # Main application (copy from template)
│   ├── styles/
│   │   └── main.css                    # Complete styling (~700 lines)
│   ├── scripts/
│   │   └── app.js                      # Application logic (~350 lines)
│   ├── data/
│   │   ├── synonyms.json               # YOUR CONTENT HERE
│   │   ├── image_credits.json          # Auto-generated
│   │   └── audio_metadata.json         # Auto-generated
│   └── assets/
│       ├── images/
│       │   ├── hero/hero.jpg           # Downloaded via script
│       │   └── synonyms/*.jpg          # Downloaded via script
│       └── audio/
│           ├── verbs/*.mp3             # Generated via script
│           └── examples/*.mp3          # Generated via script
├── scripts/
│   ├── download_images.js              # Unsplash image downloader
│   ├── generate_audio.py               # Edge TTS audio generator
│   └── download_missing.js             # Fallback image download
├── docs/
│   ├── content/
│   │   └── [verb]_synonyms_research.md # Your research notes
│   ├── architecture/
│   │   └── app_design.md               # Architecture docs
│   └── PROJECT_SPECIFICATION.md        # Complete spec
├── README.md                           # Project documentation
└── .gitignore                          # Git ignore file
```

---

## Step-by-Step Build Process

### Phase 1: Research & Content Creation (1-2 hours)

#### 1.1 Research Synonyms

Create `docs/content/[verb]_synonyms_research.md`:

```markdown
# Synonyms of [VERB] - Research

## Criteria
- Target: 10-20 sophisticated synonyms
- Audience: Intermediate/Advanced LATAM Spanish learners
- Focus: Nuanced meanings, not basic equivalents

## Synonyms List

### [Synonym 1]
- **Definition**: [Detailed explanation]
- **Formality**: formal/neutral
- **Context**: cotidiano/literario/profesional/narrativo
- **Regions**: general (or specific: mexico, colombia, argentina)
- **Examples** (3):
  1. [Example sentence 1]
  2. [Example sentence 2]
  3. [Example sentence 3]
- **Cultural Notes**: [LATAM usage patterns, connotations]
- **Visual Search**: [Keywords for Unsplash image search]

[Repeat for all synonyms]
```

#### 1.2 Create synonyms.json

Create `src/data/synonyms.json`:

```json
[
  {
    "verb": "synonym1",
    "pronunciation": "sy-no-nym",
    "quickDefinition": "Brief gloss (5-10 words)",
    "definition": "Complete nuanced definition (20-50 words)",
    "formality": "formal|neutral",
    "context": "cotidiano|literario|profesional|narrativo",
    "regions": ["general"],
    "image": "assets/images/synonyms/synonym1.jpg",
    "examples": [
      "Example sentence 1 using the verb naturally.",
      "Example sentence 2 in different context.",
      "Example sentence 3 with different subject."
    ],
    "culturalNotes": "LATAM usage notes, connotations, register info."
  }
]
```

**Key Decisions:**
- Formality: Only use `formal` or `neutral` (avoid informal unless you have many)
- Context: Choose from `cotidiano`, `literario`, `profesional`, `narrativo`
- Regions: Use `general` unless you have specific regional variations
- Examples: 3 authentic sentences per synonym (not textbook-y)

---

### Phase 2: Image Curation (30-60 minutes)

#### 2.1 Configure Image Download Script

Edit `scripts/download_images.js`:

```javascript
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_API_KEY';

const SYNONYM_IMAGES = {
  hero: {
    query: '[YOUR HERO IMAGE SEARCH]',  // e.g., 'spanish colonial architecture'
    filename: 'hero.jpg',
    dir: HERO_DIR
  },

  // For each synonym, define contextual search
  synonym1: {
    query: '[CONTEXTUAL SEARCH TERMS]',  // e.g., 'person walking sunset'
    filename: 'synonym1.jpg'
  },
  // Repeat for all synonyms...
};
```

**Image Search Strategy:**
- Choose images that represent the **semantic concept**, not literal translation
- Prefer natural, authentic scenes over stock photos
- Use landscape orientation
- Avoid text-heavy images

#### 2.2 Download Images

```bash
cd scripts
node download_images.js

# Check results
ls -lh ../src/assets/images/synonyms/
ls -lh ../src/assets/images/hero/

# If any failed, edit download_missing.js and re-run
node download_missing.js
```

**Output:**
- 15+ high-quality JPG files (~1.5MB total)
- `src/data/image_credits.json` with photographer attribution

---

### Phase 3: Audio Generation (15-30 minutes)

#### 3.1 Configure Voice Mapping

Edit `scripts/generate_audio.py`:

```python
# Available voices (Microsoft Edge TTS)
VOICES = {
    "mx_female_1": "es-MX-DaliaNeural",
    "mx_male_1": "es-MX-JorgeNeural",
    "co_female_1": "es-CO-SalomeNeural",
    "co_male_1": "es-CO-GonzaloNeural",
    "ar_female_1": "es-AR-ElenaNeural",
    "ar_male_1": "es-AR-TomasNeural",
    "us_female_1": "es-US-PalomaNeural",
    "us_male_1": "es-US-AlonsoNeural",
}

# Map each synonym to a voice (vary gender and region)
VERB_VOICE_MAPPING = {
    "synonym1": "mx_female_1",   # Mexican female
    "synonym2": "co_male_1",     # Colombian male
    "synonym3": "ar_female_1",   # Argentine female
    "synonym4": "mx_male_1",     # Mexican male
    # ... alternate voices for variety
}
```

**Voice Selection Strategy:**
- **Alternate genders** for variety
- **Mix regions** (Mexico, Colombia, Argentina, Neutral)
- **Same voice** for verb + its examples (consistency)
- **Avoid repetition** across consecutive verbs

#### 3.2 Generate Audio

```bash
# Install dependency
pip install edge-tts

# Generate all audio files
cd scripts
python generate_audio.py

# Verify output
ls -lh ../src/assets/audio/verbs/      # 14 verb pronunciations
ls -lh ../src/assets/audio/examples/   # 42 example pronunciations
```

**Output:**
- 56 MP3 files (~1MB total)
- `src/data/audio_metadata.json` with voice mapping

---

### Phase 4: Frontend Implementation (Copy & Customize)

#### 4.1 HTML (src/index.html)

**Customization Points:**

```html
<title>Sinónimos de [VERB] | Explorando el Lenguaje [SEMANTIC_FIELD]</title>
<meta name="description" content="Una colección elegante de sinónimos del verbo '[VERB]' en español latinoamericano">

<h1 class="hero-title">Sinónimos de [VERB]</h1>
<p class="hero-subtitle">Descubre la riqueza del [SEMANTIC_DESCRIPTION] en español</p>
```

**No other changes needed** - HTML is fully template-ready.

#### 4.2 CSS (src/styles/main.css)

**Optional Customization:**

```css
/* Color palette (if you want different branding) */
:root {
    --color-primary: #2d3142;      /* Main text color */
    --color-secondary: #4f5d75;    /* Secondary text */
    --color-accent: #bfc0c0;       /* Accent color */
    /* Keep other variables as-is */
}
```

**No other changes needed** - CSS is fully reusable.

#### 4.3 JavaScript (src/scripts/app.js)

**No changes needed** - Script automatically:
- Loads `synonyms.json`
- Loads `image_credits.json`
- Loads `audio_metadata.json`
- Renders cards dynamically
- Handles filters based on data
- Manages audio playback

---

### Phase 5: Testing & Refinement (30 minutes)

#### 5.1 Local Testing

```bash
# Start local server
python -m http.server 8000

# Open in browser
http://localhost:8000/src/index.html
```

#### 5.2 Test Checklist

**Visual:**
- [ ] All images load correctly
- [ ] Hero image appears
- [ ] Cards display in grid layout
- [ ] Hover effects work smoothly
- [ ] Modal opens/closes correctly

**Audio:**
- [ ] Speaker icons appear next to verbs
- [ ] Click plays audio
- [ ] Audio stops when clicking new one
- [ ] Playing animation (blue pulse) works
- [ ] Example audio works in modal

**Filters:**
- [ ] Formality filter shows correct count
- [ ] Context filter shows correct count
- [ ] Search works in real-time
- [ ] Reset button clears all filters
- [ ] Combining filters works

**Content:**
- [ ] All synonyms display
- [ ] Definitions are clear
- [ ] Examples are authentic
- [ ] Cultural notes are informative
- [ ] No typos or errors

#### 5.3 Browser Compatibility

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

---

## Customization Guide

### Change Color Scheme

Edit `src/styles/main.css`:

```css
:root {
    /* Your custom colors */
    --color-primary: #[HEX];
    --color-secondary: #[HEX];
    --color-accent: #[HEX];
    --color-light: #[HEX];
}
```

### Change Typography

Edit `src/index.html` (Google Fonts import):

```html
<link href="https://fonts.googleapis.com/css2?family=[YOUR_SERIF]&family=[YOUR_SANS]&display=swap" rel="stylesheet">
```

Edit `src/styles/main.css`:

```css
:root {
    --font-serif: '[YOUR_SERIF]', serif;
    --font-sans: '[YOUR_SANS]', sans-serif;
}
```

### Add More Synonyms

1. Research and add to `src/data/synonyms.json`
2. Add image search term to `scripts/download_images.js`
3. Add voice mapping to `scripts/generate_audio.py`
4. Re-run scripts:
   ```bash
   node scripts/download_images.js
   python scripts/generate_audio.py
   ```

### Change Regions/Filters

If you have regional variations:

1. Update `synonyms.json` with specific regions:
   ```json
   "regions": ["mexico", "argentina", "colombia"]
   ```

2. Update filter in `src/index.html`:
   ```html
   <select id="region-filter">
       <option value="all">Todas</option>
       <option value="mexico">México</option>
       <option value="argentina">Argentina</option>
       <option value="colombia">Colombia</option>
   </select>
   ```

3. Update JavaScript in `src/scripts/app.js` to handle region filter (uncomment region filter code)

---

## Scripts Reference

### Download Images (Node.js)

```bash
node scripts/download_images.js
```

**Requirements:**
- Node.js installed
- Unsplash API key (free: https://unsplash.com/developers)

**Outputs:**
- `src/assets/images/synonyms/*.jpg`
- `src/assets/images/hero/hero.jpg`
- `src/data/image_credits.json`

### Generate Audio (Python)

```bash
python scripts/generate_audio.py
```

**Requirements:**
- Python 3.7+
- `pip install edge-tts`

**Outputs:**
- `src/assets/audio/verbs/*.mp3`
- `src/assets/audio/examples/*.mp3`
- `src/data/audio_metadata.json`

**List Available Voices:**
```bash
python scripts/generate_audio.py --list-voices
```

---

## Deployment

### Option 1: GitHub Pages

```bash
# Create gh-pages branch
git checkout -b gh-pages

# Push src folder as root
git subtree push --prefix src origin gh-pages

# Access at: https://[username].github.io/sinonimos_de_[verb]
```

### Option 2: Netlify

1. Create `netlify.toml`:
   ```toml
   [build]
     publish = "src"
   ```

2. Connect GitHub repo to Netlify
3. Deploy automatically on push

### Option 3: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Point to src directory when prompted
```

---

## Data Requirements Summary

### For Each Synonym You Need:

1. **Verb** (Spanish infinitive)
2. **Pronunciation** (syllable breakdown)
3. **Quick Definition** (5-10 words)
4. **Full Definition** (20-50 words with nuance)
5. **Formality** (`formal` or `neutral`)
6. **Context** (`cotidiano`, `literario`, `profesional`, `narrativo`)
7. **Regions** (usually `["general"]`)
8. **3 Example Sentences** (authentic, varied contexts)
9. **Cultural Notes** (LATAM usage patterns)
10. **Image Search Terms** (for Unsplash)
11. **Voice Assignment** (which LATAM voice to use)

---

## Common Verbs to Build Apps For

### Movement Verbs
- **caminar** (walk) - andar, pasear, deambular, vagar, etc.
- **correr** (run) - trotar, apresurarse, precipitarse, etc.
- **ir** (go) - dirigirse, acudir, trasladarse, etc.

### Communication Verbs
- **decir** (say) - afirmar, declarar, manifestar, expresar, etc.
- **hablar** (speak) - conversar, charlar, platicar, dialogar, etc.
- **preguntar** (ask) - interrogar, indagar, averiguar, etc.

### Cognitive Verbs
- **pensar** (think) - reflexionar, meditar, considerar, cavilar, etc.
- **saber** (know) - conocer, dominar, entender, etc.
- **entender** (understand) - comprender, captar, asimilar, etc.

### Emotional Verbs
- **querer** (want/love) - desear, anhelar, amar, adorar, etc.
- **sentir** (feel) - percibir, experimentar, notar, etc.

### Action Verbs
- **hacer** (do/make) - realizar, efectuar, ejecutar, fabricar, etc.
- **tomar** (take) - coger, agarrar, asir, capturar, etc.
- **poner** (put) - colocar, situar, ubicar, depositar, etc.

---

## Time Estimates

### Research & Content
- Research synonyms: 1-2 hours
- Write definitions & examples: 1-2 hours
- Create synonyms.json: 30 minutes
- **Total: 2.5-4.5 hours**

### Asset Generation
- Configure image searches: 30 minutes
- Download images: 15 minutes
- Configure voice mapping: 15 minutes
- Generate audio: 15 minutes
- **Total: 1-1.5 hours**

### Implementation
- Copy template files: 5 minutes
- Customize HTML/CSS: 15 minutes
- Test and refine: 30 minutes
- **Total: 50 minutes**

### **Grand Total: 4-6 hours for complete app**

---

## Quality Checklist

### Content Quality
- [ ] 10+ sophisticated synonyms (not basic)
- [ ] Nuanced definitions (not dictionary copypaste)
- [ ] Authentic example sentences (not textbook)
- [ ] Cultural notes add genuine insight
- [ ] No typos or grammatical errors

### Visual Quality
- [ ] High-quality, contextual images
- [ ] Images represent semantic concepts
- [ ] Consistent landscape orientation
- [ ] Proper photographer attribution
- [ ] No stock photo clichés

### Audio Quality
- [ ] Clear pronunciation
- [ ] Multiple voices (gender/region variety)
- [ ] Natural intonation
- [ ] Consistent volume levels
- [ ] All files play correctly

### Technical Quality
- [ ] Fast loading (< 3s)
- [ ] Smooth animations (60fps)
- [ ] Mobile responsive
- [ ] Filters work correctly
- [ ] Search works in real-time
- [ ] Audio playback reliable
- [ ] No console errors

### UX Quality
- [ ] Intuitive navigation
- [ ] Clear information hierarchy
- [ ] Accessible (keyboard, screen readers)
- [ ] Helpful hover states
- [ ] Graceful error handling
- [ ] Works offline (after first load)

---

## Pro Tips

### Content Creation
1. **Use authentic sources** - Read LATAM literature, news, blogs
2. **Consult native speakers** - Verify regional usage
3. **Focus on nuance** - What makes each synonym unique?
4. **Vary formality** - Mix formal and neutral (avoid too many formal)
5. **Real examples** - Use examples from actual Spanish texts

### Image Selection
1. **Semantic not literal** - Represent the concept, not the word
2. **Natural scenes** - Avoid staged stock photos
3. **Cultural relevance** - Use LATAM imagery when possible
4. **Quality over quantity** - One perfect image > 3 mediocre
5. **Test on mobile** - Images should work on small screens

### Audio Generation
1. **Alternate voices** - Don't use same voice for consecutive verbs
2. **Mix genders** - Balance male and female voices
3. **Regional variety** - Use Mexican, Colombian, Argentine, Neutral
4. **Test playback** - Listen to every audio file
5. **Consistent verb/examples** - Use same voice for verb + its examples

### Performance
1. **Optimize images** - Use JPG, not PNG
2. **Lazy loading** - Let browser handle it
3. **Minimal JavaScript** - Keep under 500 lines
4. **No frameworks** - Vanilla JS is fast
5. **Cache assets** - Use service workers for offline

---

## Support Resources

### Unsplash API
- Signup: https://unsplash.com/developers
- Rate limit: 50 requests/hour (free tier)
- License: Free to use with attribution

### Microsoft Edge TTS
- Install: `pip install edge-tts`
- Free to use
- No API key needed
- 16 Spanish voices available

### Spanish Resources
- WordReference: https://www.wordreference.com
- RAE Dictionary: https://dle.rae.es
- LATAM Spanish forums: https://www.spanishdict.com/answers

---

## License Template

```markdown
# License

## Code
Original code - MIT License
Free for educational and commercial use

## Images
Source: Unsplash
License: Unsplash License (free to use)
Attribution: See src/data/image_credits.json

## Audio
Generated with: Microsoft Edge TTS
Free for personal and educational use
Voice credits: See src/data/audio_metadata.json

## Content
Definitions, examples, cultural notes: Original work
Free for educational use with attribution
```

---

## Version Control

### .gitignore Template

```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# Optional: Don't commit audio/images (re-generate from scripts)
# src/assets/audio/
# src/assets/images/
```

### Commit Message Template

```
feat: Add [feature description]
fix: Fix [bug description]
content: Add/update [content description]
assets: Update images/audio
docs: Update documentation
style: Update styling
refactor: Refactor [component]
```

---

## Quick Clone & Customize

```bash
# 1. Clone template
git clone https://github.com/bjpl/sinonimos_de_ver.git sinonimos_de_[NEW_VERB]
cd sinonimos_de_[NEW_VERB]

# 2. Remove old content
rm -rf src/data/* src/assets/images/* src/assets/audio/*

# 3. Update package info
# Edit HTML title, hero text
# Edit README.md

# 4. Add your content
# Create src/data/synonyms.json with your research

# 5. Configure scripts
# Edit scripts/download_images.js (search terms)
# Edit scripts/generate_audio.py (voice mapping)

# 6. Generate assets
node scripts/download_images.js
python scripts/generate_audio.py

# 7. Test
python -m http.server 8000
# Open http://localhost:8000/src/index.html

# 8. Deploy
git remote set-url origin https://github.com/[YOU]/sinonimos_de_[NEW_VERB].git
git add .
git commit -m "Initial commit for sinonimos_de_[NEW_VERB]"
git push -u origin main
```

---

**You now have a complete, production-ready template for creating elegant Spanish vocabulary apps with multi-voice audio and curated imagery!** 🎯🇪🇸
