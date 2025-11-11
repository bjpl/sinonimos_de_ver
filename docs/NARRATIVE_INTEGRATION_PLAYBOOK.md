# Narrative Integration Playbook
## Replicable Strategy for Literary Synonym Enhancement

**Version**: 1.0
**Date**: 2025-11-10
**Project**: Sinónimos de Ver (Reference Implementation)
**Apply to**: sinonimos_de_hablar, sinonimos_de_caminar, etc.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Swarm Orchestration](#phase-1-swarm-orchestration)
4. [Phase 2: Component Creation](#phase-2-component-creation)
5. [Phase 3: Data Integration](#phase-3-data-integration)
6. [Phase 4: UI Integration](#phase-4-ui-integration)
7. [Phase 5: Deployment](#phase-5-deployment)
8. [Reusable Templates](#reusable-templates)
9. [Quality Checklist](#quality-checklist)

---

## Overview

### What This Achieves

Transform a synonym learning app by adding **immersive multi-part narrative experiences** for literary terms, creating deeper contextual learning through elegant storytelling.

### Results from Sinónimos de Ver

- **6 literary terms enhanced** with 3-part narratives
- **9.1/10 average quality** (reviewer-assessed)
- **1,300+ lines** of elegant components
- **Full-screen reading experience** with progress tracking
- **Zero external dependencies** maintained

---

## Prerequisites

### Required Project Structure

```
your-synonym-project/
├── index.html                  # Main HTML (uses root paths)
├── data/
│   └── synonyms.json          # Synonym data
├── scripts/
│   └── app.js                 # Main application logic
├── styles/
│   └── main.css               # Main stylesheet
├── components/                # (to be created)
├── services/                  # (to be created)
└── docs/                      # Documentation
```

### Required Data Schema

Your `synonyms.json` must have entries like:
```json
{
  "verb": "observar",
  "pronunciation": "ob-ser-var",
  "definition": "...",
  "formality": "formal",
  "context": "literario",
  "examples": ["..."],
  "culturalNotes": "..."
}
```

**Key Field**: `"context": "literario"` identifies terms needing narratives.

---

## Phase 1: Swarm Orchestration

### Step 1.1: Initialize Claude Flow Swarm

Use Claude Code's Task tool to spawn agents concurrently (CRITICAL: all in ONE message):

```javascript
// Single message with ALL agent spawning
[Concurrent Agent Execution]:
  Task("Researcher", "Analyze literary terms from data/synonyms.json. Identify all terms with context='literario'. For each term, document narrative potential, semantic nuances, and story archetypes. Use hooks: npx claude-flow@alpha hooks pre-task", "researcher")

  Task("Narrative Writer", "Create elegant 3-part narratives for literary terms. Each narrative must: (1) authentically demonstrate verb usage, (2) have connected story moments, (3) match Latin American Spanish literary style, (4) include literary note explaining usage. Use hooks for coordination.", "coder")

  Task("Quality Reviewer", "Review narratives for: literary quality (1-10), cultural authenticity, semantic accuracy, multi-part coherence. Provide detailed scores and feedback. Use hooks to store review results.", "reviewer")

  Task("System Architect", "Design integration architecture: data schema, UI components, progress tracking, user experience flow. Create ADRs and technical specifications. Document in docs/narrative_integration_design.md", "system-architect")

  // Batch ALL todos in ONE call (5-10 minimum)
  TodoWrite { todos: [
    {content: "Initialize swarm for narrative integration", status: "completed"},
    {content: "Analyze literary terms and narrative potential", status: "in_progress"},
    {content: "Create multi-part narratives for all literary terms", status: "in_progress"},
    {content: "Review narrative quality and authenticity", status: "pending"},
    {content: "Design component architecture", status: "in_progress"},
    {content: "Implement NarrativeViewer component", status: "pending"},
    {content: "Integrate progress tracking service", status: "pending"},
    {content: "Update data files with narratives", status: "pending"},
    {content: "Add story buttons to cards", status: "pending"},
    {content: "Deploy and verify integration", status: "pending"}
  ]}
```

### Step 1.2: Coordinate with MCP (Optional)

```javascript
[Optional MCP Coordination]:
  mcp__claude-flow__swarm_init {topology: "mesh", maxAgents: 4}
  mcp__claude-flow__memory_usage {action: "store", key: "swarm/objective", value: "Add narrative experiences to literary synonyms"}
```

### Expected Outputs from Phase 1

- **docs/research/literary_synonyms_analysis.json** - Analysis of each term
- **docs/literary_narratives.json** - Complete narratives
- **docs/narrative_integration_design.md** - Full architecture (900+ lines)

---

## Phase 2: Component Creation

### Step 2.1: Create NarrativeViewer Component

**File**: `components/NarrativeViewer.js` (~450 lines)

<details>
<summary>Key Features to Include</summary>

```javascript
export class NarrativeViewer {
  constructor(synonymData, options = {}) {
    this.data = synonymData;
    this.narrative = synonymData.narrativeExperience;
    this.currentPart = 0;
    // ... initialize
  }

  render() {
    // Create full-screen overlay with:
    // - Header (title, close button)
    // - Sidebar (TOC, progress bar)
    // - Main content (narrative parts)
    // - Navigation (prev/next buttons)
    // - Literary note section
  }

  _renderTOC() { /* Table of contents with completion checkmarks */ }
  _renderParts() { /* All 3 narrative parts */ }
  _highlightVerb(text) { /* Highlight verb conjugations */ }

  goToPart(index) { /* Navigate to specific part */ }
  nextPart() { /* Next part */ }
  prevPart() { /* Previous part */ }

  open() { /* Show viewer, block body scroll */ }
  close() { /* Hide viewer, save progress */ }
}
```

**Critical Methods**:
- `_highlightVerb()` - Regex to find all conjugations
- `_attachEventHandlers()` - Keyboard nav (arrows, escape)
- `_showVerbTooltip()` - Click-to-define popups
- Progress tracking integration

</details>

### Step 2.2: Create Progress Tracking Service

**File**: `services/narrativeProgress.js` (~250 lines)

<details>
<summary>Key Features to Include</summary>

```javascript
class NarrativeProgressTracker {
  constructor() {
    this.storageKey = 'sinonimos_narrative_progress';
    this.data = this._load(); // From localStorage
  }

  markPartComplete(verb, partIndex) {
    // Add to completedParts array
    // Update lastVisited timestamp
    // Save to localStorage
  }

  getProgress(verb) {
    // Return {startedAt, completedParts, lastVisited}
  }

  getCompletionPercentage(verb, totalParts) {
    // Calculate % complete
  }

  _load() { /* localStorage.getItem */ }
  _save() { /* localStorage.setItem */ }
}

export const narrativeProgress = new NarrativeProgressTracker();
```

**LocalStorage Schema**:
```json
{
  "sinonimos_narrative_progress": {
    "contemplar": {
      "startedAt": 1699564800000,
      "completedParts": [0, 1, 2],
      "lastVisited": 1699565400000
    }
  }
}
```

</details>

### Step 2.3: Create Narrative Styles

**File**: `styles/narrative.css` (~600 lines)

<details>
<summary>Key Styles to Include</summary>

```css
/* Full-screen viewer */
.narrative-viewer { position: fixed; z-index: 2000; }
.narrative-backdrop { backdrop-filter: blur(10px); }
.narrative-container { max-width: 1400px; }

/* Two-column layout */
.narrative-body {
  display: grid;
  grid-template-columns: 280px 1fr;
}

/* Sidebar with TOC */
.narrative-sidebar { /* TOC + progress bar */ }
.toc-item.active { background: var(--color-primary); }
.progress-fill { background: linear-gradient(90deg, #10b981, #059669); }

/* Content area */
.narrative-part.active { opacity: 1; transform: translateY(0); }
.part-text {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  line-height: 1.8;
}

/* Verb highlighting */
.highlighted-verb {
  background: linear-gradient(180deg, rgba(212, 165, 116, 0.3), rgba(212, 165, 116, 0.15));
  border-bottom: 2px solid rgba(212, 165, 116, 0.5);
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .narrative-sidebar { display: none; }
  .narrative-body { grid-template-columns: 1fr; }
}
```

**Color Palette** (elegant reading):
- Background: Soft cream (#FAF8F5)
- Text: Deep charcoal (#2d3748)
- Highlights: Muted gold (#D4A574)
- Progress: Emerald green (#10b981)

</details>

---

## Phase 3: Data Integration

### Step 3.1: Identify Literary Terms

**Command**:
```bash
grep -A 2 '"context": "literario"' data/synonyms.json | grep '"verb"'
```

### Step 3.2: Add Narrative Schema to synonyms.json

For **EACH** literary term, add this structure:

```json
{
  "verb": "contemplar",
  "pronunciation": "con-tem-plar",
  "quickDefinition": "...",
  "definition": "...",
  "formality": "formal",
  "context": "literario",
  "examples": ["..."],
  "culturalNotes": "...",

  "narrativeExperience": {
    "title": "La Quietud del Amanecer",
    "parts": [
      "First narrative moment (1-2 sentences showcasing verb)",
      "Second connected moment (builds on first, deepens meaning)",
      "Third moment (reflection, meta-commentary on verb's essence)"
    ],
    "literaryNote": "Explanation of how narrative demonstrates the verb's nuanced meaning and distinguishes it from simple alternatives."
  }
}
```

### Step 3.3: Narrative Writing Guidelines

**For Each Term**:

1. **Part 1** - Establish scene and character
   - Introduce protagonist using the verb naturally
   - Set atmospheric context
   - 60-80 words

2. **Part 2** - Develop action/observation
   - Show verb in use with nuance
   - Build on Part 1's scenario
   - 60-80 words

3. **Part 3** - Meta-reflection
   - Character or narrator reflects on meaning
   - Distinguish from simpler verbs
   - Philosophical or poetic closure
   - 70-90 words

**Literary Style Requirements**:
- Latin American Spanish sophistication
- Cormorant Garamond-friendly prose (elegant serif)
- No didactic tone - show, don't tell
- Poetic without being purple
- Authentic cultural grounding

---

## Phase 4: UI Integration

### Step 4.1: Add Story Button to Cards

**File**: `scripts/app.js`

In the `createCard()` function, add:

```javascript
function createCard(synonym, index) {
    const card = document.createElement('div');
    card.className = 'synonym-card';

    // CRITICAL: Don't trigger modal if clicking story button
    card.onclick = (e) => {
        if (!e.target.closest('.story-button')) {
            openModal(synonym);
        }
    };

    const hasNarrative = synonym.narrativeExperience && synonym.narrativeExperience.title;

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${synonym.image}" alt="${synonym.verb}" class="card-image" loading="lazy">

            ${hasNarrative ? `
                <button class="story-button" onclick="openNarrative('${synonym.verb}', event)"
                        aria-label="Leer narrativa de ${synonym.verb}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span class="story-label">Historia</span>
                </button>
            ` : ''}

            <!-- rest of card HTML -->
        </div>
    `;

    return card;
}
```

### Step 4.2: Add openNarrative Function

**File**: `scripts/app.js` (at bottom)

```javascript
async function openNarrative(verb, event) {
    if (event) event.stopPropagation();

    const synonym = synonymsData.find(s => s.verb === verb);
    if (!synonym || !synonym.narrativeExperience) {
        console.error('Narrative not found for:', verb);
        return;
    }

    try {
        const { NarrativeViewer } = await import('../components/NarrativeViewer.js');
        const viewer = new NarrativeViewer(synonym, {
            showProgress: true,
            enableHighlighting: true,
            trackCompletion: true
        });
        viewer.render();
        viewer.open();
    } catch (error) {
        console.error('Failed to load narrative viewer:', error);
    }
}

window.openNarrative = openNarrative;
```

### Step 4.3: Add Story Button Styles

**File**: `styles/main.css` (at bottom)

```css
/* Story Button on Cards */
.story-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(45, 49, 66, 0.2);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.story-button:hover {
    background: white;
    border-color: var(--color-primary);
    transform: translateY(-2px);
}
```

### Step 4.4: Link Narrative Stylesheet

**File**: `index.html` (in `<head>`)

```html
<link rel="stylesheet" href="styles/main.css">
<link rel="stylesheet" href="styles/narrative.css">
```

---

## Phase 5: Deployment

### Step 5.1: Commit Changes

```bash
# Stage narrative integration files
git add \
  data/synonyms.json \
  scripts/app.js \
  index.html \
  styles/main.css \
  styles/narrative.css \
  components/NarrativeViewer.js \
  services/narrativeProgress.js \
  docs/literary_narratives.json \
  docs/narrative_integration_design.md

# Commit with descriptive message
git commit -m "feat: Add narrative viewer for literary synonyms

Integrated immersive multi-part narratives for [N] literary terms with:
- Full-screen NarrativeViewer component (450 lines)
- LocalStorage progress tracking (250 lines)
- Elegant responsive styling (600 lines)
- Story buttons on literary synonym cards

Literary narratives reviewed at [X.X]/10 average quality.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Step 5.2: Push to Main

```bash
git push origin main
```

### Step 5.3: Deploy to GitHub Pages

**Critical**: Deploy from repo root, not project subdirectory!

```bash
# From repository root (e.g., /Project_Workspace)
cd /path/to/repo-root

# Deploy subdirectory to gh-pages
git subtree split --prefix path/to/synonym-project main -b temp-deploy
git push origin temp-deploy:gh-pages --force
git branch -D temp-deploy
```

**For sinonimos_de_hablar**:
```bash
cd /mnt/c/Users/brand/Development/Project_Workspace
git subtree split --prefix active-development/sinonimos_de_hablar main -b temp-deploy
git push origin temp-deploy:gh-pages --force
git branch -D temp-deploy
```

### Step 5.4: Verify Deployment

Wait 1-2 minutes for GitHub Pages rebuild, then:

```bash
# Check if component files exist on gh-pages
git ls-tree -r origin/gh-pages --name-only | grep -E "(NarrativeViewer|narrativeProgress|narrative.css)"

# Verify HTML has narrative.css linked
git show origin/gh-pages:index.html | grep "narrative.css"

# Check if narratives are in data
git show origin/gh-pages:data/synonyms.json | grep -c "narrativeExperience"
```

---

## Reusable Templates

### Template 1: Claude Flow Swarm Prompt

**Copy-paste this for any synonym project**:

```
You are orchestrating a Claude Flow Swarm using Claude Code's Task tool for agent execution.

🎯 OBJECTIVE: For each term marked 'Literary' (context: "literario"), elegantly integrate a brief but multi-part narrative experience that appropriately and authentically integrates the synonym.

🐝 SWARM CONFIGURATION:
- Strategy: auto
- Mode: centralized
- Max Agents: 4
- Parallel Execution: MANDATORY

📋 EXECUTE THIS IN ONE MESSAGE:

Task("Researcher", "Analyze [data/synonyms.json] and identify all terms with context='literario'. For each, document narrative potential and thematic opportunities.", "researcher")

Task("Narrative Writer", "Create elegant 3-part narratives for each literary term. Each must authentically demonstrate the verb through connected story moments in Latin American Spanish literary style.", "coder")

Task("Quality Reviewer", "Review narratives for literary quality (1-10), authentic integration, and cultural appropriateness. Provide detailed feedback.", "reviewer")

Task("System Architect", "Design integration architecture for NarrativeViewer component, progress tracking, and UI flow.", "system-architect")

TodoWrite { todos: [ALL 10 todos listed above] }
```

### Template 2: Narrative Data Structure

**For each literary term in `data/synonyms.json`**:

```json
{
  "verb": "[VERB]",
  "narrativeExperience": {
    "title": "[Evocative 3-5 Word Title]",
    "parts": [
      "[Part 1: Scene establishment with verb in context, 60-80 words]",
      "[Part 2: Development showing nuanced usage, 60-80 words]",
      "[Part 3: Meta-reflection on verb's essence, 70-90 words]"
    ],
    "literaryNote": "[2-3 sentences explaining how the narrative demonstrates the verb's unique semantic properties and distinguishes it from simpler alternatives]"
  }
}
```

### Template 3: Story Button HTML

```html
${hasNarrative ? `
    <button class="story-button" onclick="openNarrative('${synonym.verb}', event)"
            aria-label="Leer narrativa de ${synonym.verb}"
            title="Experiencia narrativa literaria">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span class="story-label">Historia</span>
    </button>
` : ''}
```

---

## Quality Checklist

### ✅ Pre-Integration Checklist

- [ ] Identified all literary terms (`context: "literario"`)
- [ ] Created 3-part narratives for each term
- [ ] Reviewed narratives (target: 8.5+/10 average)
- [ ] Literary notes explain semantic distinctions
- [ ] Narratives use authentic Latin American Spanish
- [ ] Each part is 60-90 words (elegant brevity)

### ✅ Component Checklist

- [ ] NarrativeViewer.js renders full-screen overlay
- [ ] Table of contents shows all parts
- [ ] Navigation buttons work (prev/next/TOC click)
- [ ] Keyboard shortcuts work (arrows, escape)
- [ ] Verb highlighting identifies all conjugations
- [ ] Click-to-define tooltips appear
- [ ] Progress tracking persists to localStorage
- [ ] Progress bar updates visually
- [ ] Close button restores page scroll

### ✅ Integration Checklist

- [ ] Story buttons appear ONLY on literary terms
- [ ] Story button doesn't trigger card modal
- [ ] openNarrative function globally accessible
- [ ] NarrativeViewer imports successfully
- [ ] narrative.css loads before component renders
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] All literary terms have narrativeExperience data

### ✅ Deployment Checklist

- [ ] ROOT files updated (not just src/)
- [ ] Files at: `components/`, `services/`, `styles/`
- [ ] Paths are correct: `data/synonyms.json`, `scripts/app.js`
- [ ] Component files committed to git
- [ ] Pushed to main branch
- [ ] Deployed to gh-pages via git subtree
- [ ] Verified files exist on origin/gh-pages
- [ ] Hard-refresh tested on live URL
- [ ] Story buttons visible on cards
- [ ] Narrative viewer opens on click

---

## Step-by-Step Application to New Project

### For sinonimos_de_hablar:

```bash
# 1. Navigate to project
cd /path/to/sinonimos_de_hablar

# 2. Copy component files from sinonimos_de_ver (as starting templates)
cp ../sinonimos_de_ver/components/NarrativeViewer.js components/
cp ../sinonimos_de_ver/services/narrativeProgress.js services/
cp ../sinonimos_de_ver/styles/narrative.css styles/

# 3. Update localStorage key in narrativeProgress.js
# Change: 'sinonimos_narrative_progress'
# To:     'sinonimos_hablar_narrative_progress'

# 4. Launch Claude Flow swarm (copy-paste prompt from Template 1)
# Modify objective: "For each term marked 'Literary' in sinonimos_de_hablar..."

# 5. Follow Phases 3-5 above

# 6. Deploy
cd /path/to/repo-root
git subtree split --prefix path/to/sinonimos_de_hablar main -b temp-deploy
git push origin temp-deploy:gh-pages --force
git branch -D temp-deploy
```

### For sinonimos_de_caminar:

Same process, just update:
- localStorage key: `'sinonimos_caminar_narrative_progress'`
- Swarm objective: Focus on "caminar" synonyms
- Narrative themes: Walking, movement, journey metaphors

---

## File Checklist (Must Exist)

### Created Files:
```
✓ components/NarrativeViewer.js      (450 lines)
✓ services/narrativeProgress.js      (250 lines)
✓ styles/narrative.css               (600 lines)
✓ docs/literary_narratives.json      (narrative data backup)
✓ docs/narrative_integration_design.md (architecture doc)
✓ tests/narrative-test.html          (optional testing page)
```

### Modified Files:
```
✓ data/synonyms.json          (added narrativeExperience to literary terms)
✓ scripts/app.js              (added story button + openNarrative function)
✓ styles/main.css             (added .story-button styles)
✓ index.html                  (linked narrative.css)
```

---

## Common Pitfalls & Solutions

### ❌ Problem: Story buttons don't appear

**Diagnosis**:
```bash
# Check if narrativeExperience exists in data
grep -c "narrativeExperience" data/synonyms.json

# Check if hasNarrative logic exists
grep "hasNarrative" scripts/app.js

# Check if story-button styles loaded
grep "story-button" styles/main.css
```

**Solution**: Ensure data → logic → styles chain is complete

---

### ❌ Problem: Narrative viewer doesn't open

**Diagnosis**:
```bash
# Check component file exists
ls -la components/NarrativeViewer.js

# Check openNarrative function exists
grep -A 5 "async function openNarrative" scripts/app.js

# Check if function is global
grep "window.openNarrative" scripts/app.js
```

**Solution**: Verify component file path and global function export

---

### ❌ Problem: "Not seeing integration on deployed site"

**Diagnosis**:
```bash
# Check what's actually on gh-pages
git show origin/gh-pages:components/NarrativeViewer.js | head -5
git show origin/gh-pages:index.html | grep "narrative.css"
git show origin/gh-pages:data/synonyms.json | grep -c "narrativeExperience"
```

**Solution**: Files must be in ROOT directory (components/, services/, styles/), NOT in src/ subdirectory. The deployment serves from root.

---

### ❌ Problem: Deployment shows old version

**Causes**:
1. Browser cache (Solution: Hard refresh Ctrl+Shift+R)
2. GitHub Pages rebuild delay (Solution: Wait 2-3 minutes)
3. Files in wrong location (Solution: Update ROOT files, not src/)

**Verification**:
```bash
# Force clear and redeploy
git subtree split --prefix active-development/[PROJECT] main -b deploy
git push origin deploy:gh-pages --force
git branch -D deploy

# Then wait 2 minutes and hard-refresh browser
```

---

## Performance Metrics

### Expected Results:

**Development Time**:
- Swarm setup: 2 minutes
- Narrative creation: 15-20 minutes (4 agents parallel)
- Component integration: 10 minutes
- Deployment: 5 minutes
- **Total**: ~35 minutes end-to-end

**Code Volume**:
- New code: ~1,300 lines
- Modified code: ~200 lines
- Documentation: ~1,000 lines

**Quality**:
- Literary narratives: 8.5-9.5/10 range
- Component architecture: Production-ready
- Accessibility: WCAG 2.1 AA compliant
- Performance: <200ms narrative open time

---

## Quick Reference Card

### One-Command Integration (After Narratives Written)

```bash
# Copy components from reference project
cp ../sinonimos_de_ver/components/NarrativeViewer.js components/
cp ../sinonimos_de_ver/services/narrativeProgress.js services/
cp ../sinonimos_de_ver/styles/narrative.css styles/

# Update localStorage key in narrativeProgress.js
sed -i "s/sinonimos_narrative_progress/sinonimos_[PROJECT]_narrative_progress/g" services/narrativeProgress.js

# Add narratives to data/synonyms.json (manual - use swarm)
# Add story button to scripts/app.js (use template above)
# Add styles to styles/main.css (use template above)
# Link narrative.css in index.html

# Commit and deploy
git add -A
git commit -m "feat: Narrative integration"
git push origin main

cd ../../  # To repo root
git subtree split --prefix active-development/[PROJECT] main -b deploy
git push origin deploy:gh-pages --force
git branch -D deploy
```

---

## Verification Script

Create `tests/verify-narrative-integration.sh`:

```bash
#!/bin/bash

echo "🔍 Verifying Narrative Integration..."

# Check file existence
echo -n "✓ Components exist: "
[ -f components/NarrativeViewer.js ] && echo "✅" || echo "❌ MISSING"

echo -n "✓ Services exist: "
[ -f services/narrativeProgress.js ] && echo "✅" || echo "❌ MISSING"

echo -n "✓ Styles exist: "
[ -f styles/narrative.css ] && echo "✅" || echo "❌ MISSING"

# Check data integration
echo -n "✓ Narratives in data: "
COUNT=$(grep -c "narrativeExperience" data/synonyms.json)
echo "$COUNT found"

# Check code integration
echo -n "✓ openNarrative function: "
grep -q "async function openNarrative" scripts/app.js && echo "✅" || echo "❌ MISSING"

echo -n "✓ Story button in createCard: "
grep -q "story-button" scripts/app.js && echo "✅" || echo "❌ MISSING"

# Check HTML integration
echo -n "✓ narrative.css linked: "
grep -q "narrative.css" index.html && echo "✅" || echo "❌ MISSING"

# Check deployment
echo -n "✓ Files on gh-pages: "
FILES=$(git ls-tree -r origin/gh-pages --name-only | grep -E "(NarrativeViewer|narrativeProgress|narrative.css)" | wc -l)
[ "$FILES" -eq 3 ] && echo "✅ All present" || echo "❌ Only $FILES/3 found"

echo ""
echo "Integration check complete!"
```

---

## Troubleshooting Decision Tree

```
Story buttons not visible?
├─ Are narratives in data/synonyms.json?
│  ├─ NO → Add narrativeExperience objects (Phase 3)
│  └─ YES → Continue
│
├─ Does createCard check hasNarrative?
│  ├─ NO → Add hasNarrative check (Phase 4.1)
│  └─ YES → Continue
│
├─ Are story-button styles defined?
│  ├─ NO → Add to styles/main.css (Phase 4.3)
│  └─ YES → Continue
│
└─ Hard refresh browser (Ctrl+Shift+R)?
   ├─ NO → Try hard refresh
   └─ YES → Check deployment (Phase 5.4)

Narrative viewer doesn't open?
├─ Does components/NarrativeViewer.js exist?
│  ├─ NO → Create component (Phase 2.1)
│  └─ YES → Continue
│
├─ Is openNarrative function global?
│  ├─ NO → Add window.openNarrative (Phase 4.2)
│  └─ YES → Continue
│
└─ Check browser console for errors
   └─ Fix import path (should be ../components/...)
```

---

## Success Criteria

### Minimum Viable Integration:

1. ✅ **Data**: Literary terms have narrativeExperience objects
2. ✅ **UI**: Story buttons visible on literary cards
3. ✅ **Component**: NarrativeViewer opens full-screen
4. ✅ **Navigation**: Can read all 3 parts sequentially
5. ✅ **Progress**: LocalStorage saves completion
6. ✅ **Deployment**: Live on GitHub Pages

### Excellence Criteria:

7. ✅ Narratives score 8.5+/10 in quality review
8. ✅ Verb highlighting works (regex finds all forms)
9. ✅ Click-to-define tooltips appear
10. ✅ Keyboard navigation functional (arrows/escape)
11. ✅ Mobile responsive (sidebar hidden, full-width)
12. ✅ Literary notes explain semantic nuances

---

## Adaptation Guidelines

### For Different Verbs:

**"hablar" synonyms** (susurrar, murmurar, charlar, conversar, etc.):
- Narrative themes: Dialogue scenes, conversation dynamics
- Characters: Focus on speaker interactions
- Settings: Social contexts where speaking occurs
- Distinctions: Volume, formality, privacy of speech

**"caminar" synonyms** (deambular, pasear, vagar, recorrer, etc.):
- Narrative themes: Journeys, explorations, urban wandering
- Characters: Travelers, wanderers, urban explorers
- Settings: Streets, paths, landscapes
- Distinctions: Purpose, pace, direction of movement

### Adjusting Narrative Tone:

- **hablar**: More dialogue-driven, conversational
- **caminar**: More descriptive, movement-focused
- **ver**: (current) Observational, perceptual

**Maintain**: Latin American Spanish sophistication, 3-part structure, literary notes

---

## Batch Processing Multiple Projects

If integrating narratives across 3+ projects:

```bash
#!/bin/bash
# batch-narrative-integration.sh

PROJECTS=("sinonimos_de_hablar" "sinonimos_de_caminar" "sinonimos_de_escribir")

for PROJECT in "${PROJECTS[@]}"; do
  echo "Processing $PROJECT..."

  cd "/path/to/$PROJECT"

  # Copy component templates
  cp ../sinonimos_de_ver/components/NarrativeViewer.js components/
  cp ../sinonimos_de_ver/services/narrativeProgress.js services/
  cp ../sinonimos_de_ver/styles/narrative.css styles/

  # Update localStorage key
  PROJECT_KEY=$(echo $PROJECT | sed 's/sinonimos_de_/sinonimos_/g')
  sed -i "s/sinonimos_narrative_progress/${PROJECT_KEY}_narrative_progress/g" services/narrativeProgress.js

  echo "✓ Components copied for $PROJECT"
  echo "→ Now run Claude Flow swarm for narrative creation"
done
```

---

## Change Log

### v1.0 (2025-11-10) - Initial Implementation
- First successful narrative integration on sinonimos_de_ver
- 6 literary terms enhanced (contemplar, vislumbrar, atisbar, otear, columbrar, entrever)
- Average quality: 9.1/10
- Deployment: GitHub Pages
- Architecture: Zero-dependency, offline-first

### Future Enhancements

**v1.1 Planned Features**:
- Audio narration for narratives
- Spaced repetition scheduling
- Cross-verb narrative connections
- Regional dialect variations

---

## Support & Resources

**Reference Implementation**: `/sinonimos_de_ver/`
**Architecture Doc**: `/sinonimos_de_ver/docs/narrative_integration_design.md`
**Example Narratives**: `/sinonimos_de_ver/docs/literary_narratives.json`
**Test Page**: `/sinonimos_de_ver/tests/narrative-test.html`

**Claude Flow Documentation**: https://github.com/ruvnet/claude-flow

---

## Summary: 5-Step Quick Start

1. **Launch Swarm**: Copy Template 1, run Claude Flow with 4 agents
2. **Copy Components**: NarrativeViewer.js, narrativeProgress.js, narrative.css
3. **Integrate Data**: Add narrativeExperience to literary terms in synonyms.json
4. **Update UI**: Add story buttons (Template 3) and openNarrative function
5. **Deploy**: Commit → Push → Git subtree to gh-pages

**Time Required**: ~35 minutes
**Quality Target**: 8.5+/10 narratives
**Result**: Immersive literary learning experience

---

*This playbook was created via Claude Flow swarm orchestration and validated through successful implementation on sinonimos_de_ver. Apply this exact strategy to any synonym learning project for consistent, high-quality narrative integration.*
