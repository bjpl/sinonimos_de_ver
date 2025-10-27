# Build Process Checklist - Based on Actual Development

**Step-by-step process we followed to build "Sinónimos de Ver" - use as template for future apps**

---

## Phase 1: Project Setup & Planning (15 minutes)

### 1.1 Initialize Project
```bash
□ mkdir sinonimos_de_[VERB]
□ cd sinonimos_de_[VERB]
□ git init
□ git remote add origin https://github.com/[USER]/sinonimos_de_[VERB].git
```

### 1.2 Create Directory Structure
```bash
□ mkdir -p src/{styles,scripts,data,assets/{images/{synonyms,hero},audio/{verbs,examples}}}
□ mkdir -p docs/{content,architecture,reviews}
□ mkdir -p scripts
```

### 1.3 Create Configuration Files
```bash
□ touch README.md
□ touch .gitignore
□ touch src/index.html
□ touch src/styles/main.css
□ touch src/scripts/app.js
□ touch src/data/synonyms.json
```

---

## Phase 2: SPARC Swarm Planning (30 minutes)

### 2.1 Launch Research Agent
```bash
□ Use Task tool with researcher subagent
□ Research 10-20 sophisticated synonyms
□ Identify formality levels (formal/neutral)
□ Identify contexts (cotidiano/literario/profesional/narrativo)
□ Gather 3 example sentences per synonym
□ Document cultural notes for LATAM usage
□ Save to: docs/content/[verb]_synonyms_research.md
```

### 2.2 Launch System Architect Agent
```bash
□ Use Task tool with system-architect subagent
□ Design app architecture
□ Define color palette (sophisticated, no bright primaries)
□ Choose typography (serif for Spanish, sans-serif for UI)
□ Plan layout (hero, grid, modal, filters)
□ Save to: docs/architecture/app_design.md
```

### 2.3 Launch Coder Agents (Parallel)
```bash
□ Use Task tool with 3 coder subagents in ONE message:
  □ Agent 1: Build HTML structure
  □ Agent 2: Build CSS styling
  □ Agent 3: Build JavaScript application logic
```

### 2.4 Launch Backend Developer Agent
```bash
□ Use Task tool with backend-dev subagent
□ Design Unsplash API integration
□ Create image download script
□ Save to: scripts/download_images.js
```

### 2.5 Launch Reviewer Agent
```bash
□ Use Task tool with reviewer subagent
□ Review UX sophistication
□ Check for generic/cliché elements
□ Save to: docs/reviews/ux_sophistication_review.md
```

---

## Phase 3: Content Creation (1-2 hours)

### 3.1 Create Synonyms Data File
```bash
□ Open: src/data/synonyms.json
□ For EACH synonym, add:
  {
    "verb": "string",
    "pronunciation": "syl-la-bles",
    "quickDefinition": "brief gloss",
    "definition": "nuanced explanation",
    "formality": "formal|neutral",
    "context": "cotidiano|literario|profesional|narrativo",
    "regions": ["general"],
    "image": "assets/images/synonyms/[verb].jpg",
    "examples": ["sentence 1", "sentence 2", "sentence 3"],
    "culturalNotes": "LATAM usage notes"
  }
```

**Quality Checks:**
```bash
□ All verbs are sophisticated (not basic)
□ Definitions show real nuance
□ Examples are authentic (not textbook)
□ Cultural notes add genuine insight
□ No typos or errors
□ Formality levels distributed (not all formal)
□ Contexts varied (not all literario)
```

---

## Phase 4: Image Asset Generation (30-45 minutes)

### 4.1 Get Unsplash API Key
```bash
□ Visit: https://unsplash.com/developers
□ Create free account
□ Create new application
□ Copy Access Key
```

### 4.2 Configure Image Download Script
```bash
□ Open: scripts/download_images.js
□ Add your Unsplash API key
□ For EACH synonym, define search query:
  - Choose keywords that represent SEMANTIC concept
  - Prefer natural scenes over stock photos
  - Example: "observar" → "person observing nature wildlife binoculars"
□ Define hero image search
```

### 4.3 Download Images
```bash
□ cd scripts
□ node download_images.js
□ Wait for all downloads (14+ images)
□ Check output: ls -lh ../src/assets/images/synonyms/
□ Verify all images downloaded
```

### 4.4 Handle Missing Images (if any)
```bash
□ Check which images failed
□ Edit scripts/download_missing.js with better search terms
□ node download_missing.js
□ Verify: ls -lh ../src/assets/images/synonyms/
```

### 4.5 Verify Image Credits Generated
```bash
□ Check: src/data/image_credits.json exists
□ Verify photographer names and URLs present
```

---

## Phase 5: Audio Asset Generation (20-30 minutes)

### 5.1 Install Edge TTS
```bash
□ pip install edge-tts
□ Verify install: edge-tts --version
```

### 5.2 List Available Voices
```bash
□ python scripts/generate_audio.py --list-voices
□ Review Spanish voices available:
  - es-MX-DaliaNeural (Mexican female)
  - es-MX-JorgeNeural (Mexican male)
  - es-CO-SalomeNeural (Colombian female)
  - es-CO-GonzaloNeural (Colombian male)
  - es-AR-ElenaNeural (Argentine female)
  - es-AR-TomasNeural (Argentine male)
  - es-US-PalomaNeural (US/Neutral female)
  - es-US-AlonsoNeural (US/Neutral male)
```

### 5.3 Configure Voice Mapping
```bash
□ Open: scripts/generate_audio.py
□ In VERB_VOICE_MAPPING, assign each synonym to a voice
□ Strategy:
  - Alternate male/female
  - Mix regions (MX, CO, AR, US)
  - Use same voice for verb + its examples
  - Avoid consecutive duplicates
```

### 5.4 Generate Audio Files
```bash
□ cd scripts
□ python generate_audio.py
□ Wait for generation (56 files for 14 verbs)
□ Verify: ls -lh ../src/assets/audio/verbs/
□ Verify: ls -lh ../src/assets/audio/examples/
□ Check: src/data/audio_metadata.json created
```

### 5.5 Test Audio Quality
```bash
□ Play sample verb audio
□ Play sample example audio
□ Check volume levels consistent
□ Verify pronunciation is clear
□ Ensure no glitches or artifacts
```

---

## Phase 6: Frontend Implementation (1-2 hours)

### 6.1 Build HTML Structure
```bash
□ Open: src/index.html
□ Add sections:
  □ Hero section with background image
  □ Search and filter controls
  □ Cards grid container
  □ Detail modal
  □ Footer with attribution
□ Customize text:
  □ Title: "Sinónimos de [VERB]"
  □ Subtitle: "Descubre la riqueza del [semantic field] en español"
```

### 6.2 Build CSS Styling
```bash
□ Open: src/styles/main.css
□ Define CSS variables:
  □ Colors (sophisticated palette)
  □ Typography (serif + sans-serif)
  □ Spacing (8px grid)
□ Style components:
  □ Hero section (full-screen, overlay)
  □ Cards (grid layout, hover effects)
  □ Modal (full-screen overlay)
  □ Filters (dropdowns, reset button)
  □ Audio buttons (speaker icons, playing animation)
□ Add animations:
  □ Card fade-in (staggered)
  □ Image zoom on hover
  □ Audio pulse animation
```

### 6.3 Build JavaScript Logic
```bash
□ Open: src/scripts/app.js
□ Implement functions:
  □ loadData() - fetch JSON files
  □ setupEventListeners() - filters, search, audio
  □ renderCards() - display synonym cards
  □ createCard() - generate card HTML
  □ applyFilters() - filter by formality/context
  □ openModal() - show detail view
  □ playAudio() - handle audio playback
  □ highlightVerb() - highlight in examples
```

### 6.4 Add Audio Integration
```bash
□ Add speaker icons (SVG)
□ Add audio buttons to cards
□ Add audio buttons to examples
□ Implement playback controls
□ Add playing animation (pulse effect)
□ Handle audio stopping (one at a time)
```

---

## Phase 7: Data Accuracy & Filter Sync (30 minutes)

### 7.1 Analyze Actual Data
```bash
□ Run: cat src/data/synonyms.json | grep -E '"formality"|"context"|"regions"' | sort | uniq
□ Document ACTUAL values present:
  - Formality: formal, neutral (remove informal if not used)
  - Context: cotidiano, literario, profesional, narrativo
  - Regions: general (remove specific regions if not used)
```

### 7.2 Update HTML Filters
```bash
□ Open: src/index.html
□ Update formality <select>:
  - Only include options that exist in data
  - Remove "informal" if not used
□ Update context <select>:
  - Only include contexts that exist in data
  - Remove "coloquial" if not used
□ Remove region filter if all are "general"
```

### 7.3 Update JavaScript Filter Logic
```bash
□ Open: src/scripts/app.js
□ Remove region filter references if not used
□ Update applyFilters() to match HTML
□ Update resetFilters() to match HTML
□ Remove unused filter event listeners
```

### 7.4 Verify Filters Work
```bash
□ Test formality filter (formal/neutral)
□ Test context filter (all 4 contexts)
□ Test search (real-time filtering)
□ Test reset button
□ Test combining filters
□ Check "no results" state displays correctly
```

---

## Phase 8: Testing & Quality Assurance (30-60 minutes)

### 8.1 Start Local Server
```bash
□ python -m http.server 8000
□ Open: http://localhost:8000/src/index.html
```

### 8.2 Visual Testing
```bash
□ Hero image loads correctly
□ All 14 synonym cards display
□ Images load (check browser network tab)
□ Cards layout in grid (responsive)
□ Hover effects work (zoom, overlay)
□ Modal opens and closes
□ Typography looks elegant
□ Colors are sophisticated
□ Spacing is generous
□ Mobile responsive (resize browser)
```

### 8.3 Audio Testing
```bash
□ Speaker icons appear next to verbs
□ Click plays audio (check console for errors)
□ Audio stops when clicking new button
□ Playing animation (blue pulse) appears
□ Example audio buttons work in modal
□ Volume is consistent across files
□ Different voices are noticeable
```

### 8.4 Functionality Testing
```bash
□ Search filters in real-time
□ Formality filter works (shows correct count)
□ Context filter works (shows correct count)
□ Combining filters works
□ Reset button clears everything
□ Escape key closes modal
□ Click outside modal closes it
□ Verb highlighting in examples works
```

### 8.5 Content Quality Review
```bash
□ All definitions are accurate
□ Examples are natural and authentic
□ Cultural notes add insight
□ No typos or grammatical errors
□ Pronunciation guides are correct
□ Image credits display
□ Photographer links work
```

### 8.6 Performance Testing
```bash
□ Check browser console (no errors)
□ Network tab shows all assets load
□ Page loads in < 3 seconds
□ Animations are smooth (60fps)
□ Audio plays without delay
□ No memory leaks (long session test)
```

### 8.7 Browser Compatibility
```bash
□ Test in Chrome/Edge
□ Test in Firefox
□ Test in Safari (if available)
□ Test on mobile device (iOS or Android)
□ Test with JavaScript disabled (graceful degradation)
```

### 8.8 Accessibility Testing
```bash
□ Tab navigation works
□ Focus indicators visible
□ Screen reader friendly (test with NVDA/VoiceOver)
□ Alt text on all images
□ Aria labels on buttons
□ Color contrast meets WCAG AA
□ Keyboard shortcuts work (Escape, Enter)
```

---

## Phase 9: Documentation (30 minutes)

### 9.1 Create README.md
```bash
□ Project title and description
□ Features list
□ Synonyms included (full list)
□ How to use (local server instructions)
□ File structure
□ Image credits summary
□ License information
```

### 9.2 Create PROJECT_SPECIFICATION.md
```bash
□ Overview and goals
□ Core features
□ Data structure
□ Technical architecture
□ Visual design system
□ Performance specs
□ Browser support
□ Accessibility compliance
```

### 9.3 Document Build Process
```bash
□ Save this checklist as: docs/BUILD_PROCESS_CHECKLIST.md
□ Create reusable template: docs/REUSABLE_TEMPLATE.md
```

---

## Phase 10: Git & Deployment (15 minutes)

### 10.1 Create .gitignore
```bash
□ Add:
  node_modules/
  __pycache__/
  .env
  .DS_Store
  .vscode/
```

### 10.2 Initial Commit
```bash
□ git add .
□ git commit -m "feat: Initial commit - Complete sinonimos_de_[VERB] app with audio and images"
□ git branch -M main
□ git push -u origin main
```

### 10.3 Deploy (Optional)
```bash
□ GitHub Pages:
  - Settings → Pages → Source: main branch → /src folder
□ Netlify:
  - Connect repo → publish directory: src
□ Vercel:
  - Import repo → set root directory: src
```

---

## Summary Checklist

**Content (3-4 hours):**
- [ ] Research 10-20 sophisticated synonyms
- [ ] Write nuanced definitions
- [ ] Create 3 authentic examples per synonym
- [ ] Add cultural notes
- [ ] Create synonyms.json

**Assets (1-1.5 hours):**
- [ ] Download 15+ contextual images via Unsplash
- [ ] Generate 56 audio files with 8 LATAM voices
- [ ] Verify all credits/metadata generated

**Implementation (1-2 hours):**
- [ ] Build HTML structure
- [ ] Style with elegant CSS
- [ ] Implement JavaScript logic
- [ ] Integrate audio playback
- [ ] Sync filters with actual data

**Testing (1 hour):**
- [ ] Visual testing (all browsers)
- [ ] Audio testing (all files play)
- [ ] Functionality testing (filters, search)
- [ ] Performance testing (< 3s load)
- [ ] Accessibility testing (keyboard, screen reader)

**Documentation (30 minutes):**
- [ ] README.md
- [ ] PROJECT_SPECIFICATION.md
- [ ] BUILD_PROCESS_CHECKLIST.md

**Deployment (15 minutes):**
- [ ] Git commit and push
- [ ] Deploy to hosting platform

---

## Total Time: 6-9 hours (for first app)

**Subsequent apps: 4-6 hours** (reuse template, faster workflow)

---

## Quick Reference: Commands Used

```bash
# Project setup
git init
git remote add origin [URL]
mkdir -p src/{styles,scripts,data,assets/{images/{synonyms,hero},audio/{verbs,examples}}}

# Image download
node scripts/download_images.js
node scripts/download_missing.js

# Audio generation
pip install edge-tts
python scripts/generate_audio.py
python scripts/generate_audio.py --list-voices

# Local testing
python -m http.server 8000
# Open: http://localhost:8000/src/index.html

# Deployment
git add .
git commit -m "feat: Complete app with audio and images"
git push -u origin main
```

---

**This checklist documents our ACTUAL build process - use it as your template for future Spanish vocabulary apps!** ✅
