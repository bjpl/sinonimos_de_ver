# Quick Start: Narrative Integration Template

**Copy this file** to your new synonym project and follow step-by-step.

---

## Project: _________________ (e.g., sinonimos_de_hablar)

**Date Started**: _____________
**Literary Terms Count**: _____________
**Target Completion**: _____________

---

## ✅ Phase 1: Preparation (5 min)

### 1.1 Identify Literary Terms
```bash
cd /path/to/your-project
grep -A 2 '"context": "literario"' data/synonyms.json | grep '"verb"' > literary-terms.txt
```

**Literary terms found**:
- [ ] _________________
- [ ] _________________
- [ ] _________________
- [ ] _________________
- [ ] _________________
- [ ] _________________

**Total count**: _______

---

### 1.2 Copy Component Files

```bash
# From sinonimos_de_ver reference project
cp ../sinonimos_de_ver/components/NarrativeViewer.js components/
cp ../sinonimos_de_ver/services/narrativeProgress.js services/
cp ../sinonimos_de_ver/styles/narrative.css styles/
```

**Files copied**:
- [ ] components/NarrativeViewer.js
- [ ] services/narrativeProgress.js
- [ ] styles/narrative.css

---

### 1.3 Update LocalStorage Key

**Edit**: `services/narrativeProgress.js` line 6

```javascript
// Change from:
this.storageKey = 'sinonimos_narrative_progress';

// To:
this.storageKey = 'sinonimos_[PROJECT]_narrative_progress';
// Example: 'sinonimos_hablar_narrative_progress'
```

**Updated**: [ ] YES / [ ] NO

---

## ✅ Phase 2: Create Narratives (20 min)

### 2.1 Launch Claude Flow Swarm

**Copy-paste this prompt to Claude**:

```
You are orchestrating a Claude Flow Swarm using Claude Code's Task tool for agent execution.

🎯 OBJECTIVE: For each term marked 'Literary' (context: "literario") in [PROJECT NAME], elegantly integrate a brief but multi-part narrative experience that appropriately and authentically integrates the synonym.

🐝 SWARM CONFIGURATION:
- Strategy: auto
- Mode: centralized
- Max Agents: 4
- Parallel Execution: MANDATORY

📋 EXECUTE IN ONE MESSAGE:

Task("Researcher", "Analyze data/synonyms.json for literary terms. For each, document: meaning, current examples, cultural notes, narrative potential (what story would showcase this verb). Use hooks: npx claude-flow@alpha hooks pre-task", "researcher")

Task("Narrative Writer", "Create elegant 3-part narratives for each literary term in [PROJECT THEME] context. Requirements: (1) Authentically demonstrate verb, (2) 3 connected moments, (3) Latin American Spanish literary style, (4) 60-90 words per part, (5) Literary note explaining usage. Save to docs/literary_narratives.json", "coder")

Task("Quality Reviewer", "Review each narrative: literary quality (1-10), authentic integration, cultural accuracy, semantic precision. Provide detailed scores. Target: 8.5+ average. Save review to docs/", "reviewer")

Task("Architect", "Design integration architecture mirroring sinonimos_de_ver approach. Create docs/narrative_integration_design.md with: data schema, component specs, UI flow, deployment strategy.", "system-architect")

TodoWrite { todos: [
  {content: "Initialize narrative swarm", status: "completed"},
  {content: "Analyze literary terms", status: "in_progress"},
  {content: "Create narratives for term 1", status: "in_progress"},
  {content: "Create narratives for term 2", status: "pending"},
  {content: "Create narratives for term 3", status: "pending"},
  {content: "Create narratives for term 4", status: "pending"},
  {content: "Review narrative quality", status: "pending"},
  {content: "Design integration architecture", status: "pending"},
  {content: "Integrate into data/synonyms.json", status: "pending"},
  {content: "Deploy narrative viewer", status: "pending"}
]}
```

**Swarm launched**: [ ] YES / [ ] NO
**Narratives created**: [ ] _____ / _____ terms
**Average quality score**: _______/10

---

### 2.2 Review Narratives

**File**: `docs/literary_narratives.json`

For each narrative, verify:
- [ ] Has 3 connected parts
- [ ] Each part is 60-90 words
- [ ] Authentically demonstrates verb
- [ ] Latin American Spanish style
- [ ] Literary note explains nuance
- [ ] No didactic tone
- [ ] Quality score 8.5+

**All narratives approved**: [ ] YES / [ ] NO

---

## ✅ Phase 3: Data Integration (10 min)

### 3.1 Add narrativeExperience to synonyms.json

For **each** literary term, add this structure:

```json
{
  "verb": "VERB_HERE",
  "pronunciation": "...",
  "definition": "...",
  "context": "literario",
  "examples": ["..."],
  "culturalNotes": "...",

  "narrativeExperience": {
    "title": "NARRATIVE_TITLE",
    "parts": [
      "Part 1 text from literary_narratives.json",
      "Part 2 text from literary_narratives.json",
      "Part 3 text from literary_narratives.json"
    ],
    "literaryNote": "Literary note from literary_narratives.json"
  }
}
```

**Terms updated**:
- [ ] Term 1: _________________
- [ ] Term 2: _________________
- [ ] Term 3: _________________
- [ ] Term 4: _________________
- [ ] Term 5: _________________
- [ ] Term 6: _________________

**Validation**:
```bash
# Count narrativeExperience occurrences
grep -c "narrativeExperience" data/synonyms.json
```

**Expected count**: ______
**Actual count**: ______
**Match**: [ ] YES / [ ] NO

---

## ✅ Phase 4: UI Integration (10 min)

### 4.1 Update scripts/app.js - createCard()

Find the `createCard()` function and replace with:

```javascript
function createCard(synonym, index) {
    const card = document.createElement('div');
    card.className = 'synonym-card';
    card.style.animationDelay = `${index * 0.05}s`;

    // IMPORTANT: Prevent modal when clicking story button
    card.onclick = (e) => {
        if (!e.target.closest('.story-button')) {
            openModal(synonym);
        }
    };

    const verbKey = synonym.verb;
    const credit = imageCredits?.images?.[verbKey];
    const hasNarrative = synonym.narrativeExperience && synonym.narrativeExperience.title;

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${synonym.image}" alt="${synonym.verb}" class="card-image" loading="lazy">
            ${credit ? `<div class="image-credit">Foto: ${credit.photographer}</div>` : ''}

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

            <!-- rest of your existing card HTML -->
        </div>
    `;

    return card;
}
```

**Updated**: [ ] YES / [ ] NO

---

### 4.2 Add openNarrative Function

At the **bottom** of `scripts/app.js`, add:

```javascript
// Open narrative viewer
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

// Add to window object
window.openNarrative = openNarrative;
```

**Added**: [ ] YES / [ ] NO

---

### 4.3 Add Story Button Styles

At the **bottom** of `styles/main.css`, add:

```css
/* ==========================================
   STORY BUTTON ON CARDS
   ========================================== */

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
    transition: all 0.2s ease;
    font-family: var(--font-sans);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.story-button:hover {
    background: white;
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.story-button svg { flex-shrink: 0; }
.story-label { font-size: 0.85rem; letter-spacing: 0.02em; }

@media (max-width: 480px) {
    .story-button { padding: 0.5rem 0.75rem; font-size: 0.85rem; }
    .story-button svg { width: 16px; height: 16px; }
    .story-label { font-size: 0.75rem; }
}
```

**Added**: [ ] YES / [ ] NO

---

### 4.4 Link Narrative Stylesheet

In `index.html` `<head>` section, add after main.css:

```html
<link rel="stylesheet" href="styles/main.css">
<link rel="stylesheet" href="styles/narrative.css">
```

**Added**: [ ] YES / [ ] NO

---

## ✅ Phase 5: Testing (5 min)

### 5.1 Local Testing

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000/

# Test checklist:
```

- [ ] Story buttons appear on literary cards
- [ ] Story button has book icon + "Historia" label
- [ ] Clicking story button opens full-screen viewer
- [ ] Can see all 3 narrative parts
- [ ] Can navigate with prev/next buttons
- [ ] Can click TOC to jump to parts
- [ ] Highlighted verbs are clickable
- [ ] Progress bar shows completion
- [ ] Escape key closes viewer
- [ ] Arrow keys navigate parts
- [ ] Mobile view works (no sidebar)

**All tests passing**: [ ] YES / [ ] NO

---

### 5.2 Browser Console Check

Open browser DevTools (F12), check for errors:

**Errors found**: _______________
**Errors fixed**: [ ] YES / [ ] NO

---

## ✅ Phase 6: Deployment (10 min)

### 6.1 Verify File Locations

**CRITICAL**: Files must be in ROOT directory, not src/!

```bash
# Check files exist at root level
ls components/NarrativeViewer.js        # Should exist
ls services/narrativeProgress.js        # Should exist
ls styles/narrative.css                 # Should exist
ls data/synonyms.json                   # Should have narratives
ls scripts/app.js                       # Should have openNarrative
```

**All files in root**: [ ] YES / [ ] NO

---

### 6.2 Commit Changes

```bash
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

git commit -m "feat: Add narrative viewer for literary synonyms

Integrated immersive multi-part narratives for [N] literary terms with:
- Full-screen NarrativeViewer component
- LocalStorage progress tracking
- Elegant responsive styling
- Story buttons on literary synonym cards

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

**Committed**: [ ] YES / [ ] NO
**Commit hash**: ______________

---

### 6.3 Deploy to GitHub Pages

**CRITICAL**: Run from repository ROOT, not project directory!

```bash
# Navigate to repo root
cd /mnt/c/Users/brand/Development/Project_Workspace

# Deploy (adjust path to your project)
git subtree split --prefix active-development/[YOUR-PROJECT] main -b temp-deploy
git push origin temp-deploy:gh-pages --force
git branch -D temp-deploy
```

**Deployed**: [ ] YES / [ ] NO
**Deployment time**: ______________

---

### 6.4 Verify Deployment

```bash
# Check component files on gh-pages
git ls-tree -r origin/gh-pages --name-only | grep -E "(NarrativeViewer|narrativeProgress|narrative.css)"

# Expected output:
# components/NarrativeViewer.js
# services/narrativeProgress.js
# styles/narrative.css
```

**Files on gh-pages**:
- [ ] components/NarrativeViewer.js
- [ ] services/narrativeProgress.js
- [ ] styles/narrative.css

**All present**: [ ] YES / [ ] NO

---

### 6.5 Test Live Deployment

**URL**: https://[USERNAME].github.io/[PROJECT]/

Wait 2-3 minutes for GitHub Pages rebuild, then:

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Look for**: "Historia" buttons on literary cards
3. **Click button**: Verify full-screen viewer opens
4. **Test features**: Navigation, highlighting, progress

**Story buttons visible**: [ ] YES / [ ] NO
**Viewer opens correctly**: [ ] YES / [ ] NO
**All features working**: [ ] YES / [ ] NO

---

## 🎯 Success Metrics

### Quality Targets

- [ ] Narratives: 8.5+/10 average score
- [ ] Component: <200ms open time
- [ ] Progress tracking: LocalStorage persists
- [ ] Accessibility: Keyboard navigable
- [ ] Mobile: Fully responsive

### Completion Checklist

- [ ] All literary terms have narratives
- [ ] Story buttons appear on correct cards
- [ ] NarrativeViewer opens full-screen
- [ ] Can navigate all 3 parts
- [ ] Verb highlighting works
- [ ] Progress saves to LocalStorage
- [ ] Deployed to GitHub Pages
- [ ] Hard-refresh tested on live URL

---

## 📝 Notes & Issues

**Problems encountered**:
________________________________
________________________________
________________________________

**Solutions applied**:
________________________________
________________________________
________________________________

**Time spent**:
- Swarm: ______ minutes
- Integration: ______ minutes
- Deployment: ______ minutes
- **Total**: ______ minutes

---

## 🔄 Next Projects

After completing this project, apply same strategy to:

- [ ] sinonimos_de_hablar (speech/communication verbs)
- [ ] sinonimos_de_caminar (movement/walking verbs)
- [ ] sinonimos_de_escribir (writing verbs)
- [ ] sinonimos_de_pensar (thinking verbs)

**Estimated time per project**: 35-40 minutes

---

## 📚 Reference Materials

- **Playbook**: docs/NARRATIVE_INTEGRATION_PLAYBOOK.md
- **Architecture**: docs/narrative_integration_design.md
- **Example Narratives**: docs/literary_narratives.json
- **Reference Project**: sinonimos_de_ver/

---

*Copy this template for each new project and check off items as you complete them.*
