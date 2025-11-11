# Narrative Integration Design - Sinónimos de Ver

## Executive Summary

This document defines the architecture for integrating multi-part narrative experiences into the existing synonym learning application. The design maintains the app's elegant, zero-dependency philosophy while adding immersive storytelling that contextualizes synonym usage.

**Design Date**: 2025-11-10
**System Architecture Designer**: Claude Code
**Target Implementation**: Phase 2 Enhancement

---

## 1. Architecture Decision Records (ADRs)

### ADR-001: Narrative Data Storage Strategy

**Decision**: Store narratives as structured JSON within the existing synonyms.json file

**Context**:
- Current app has zero external dependencies
- All data stored in local JSON files
- Need to maintain offline-first capability
- Narratives must link directly to verbs

**Options Considered**:
1. Separate narrative.json file with cross-references
2. Embedded narrative object within each synonym entry
3. Hybrid: shared narratives with verb-specific segments

**Decision Rationale**:
- **CHOSEN: Option 2 (Embedded)** - Maintains data locality, simplifies lookups
- Preserves single source of truth per verb
- Enables lazy loading of narrative content
- No additional file requests

**Trade-offs**:
- File size increase (~30-40% for synonyms.json)
- Cannot reuse narratives across verbs (acceptable - each verb deserves unique context)

**Status**: Accepted

---

### ADR-002: Narrative Component Architecture

**Decision**: Create a new `NarrativeViewer` component with progressive disclosure UI

**Context**:
- Current modal system shows all content at once
- Narratives have 3-5 parts requiring sequential revelation
- Need to preserve existing synonym card functionality

**Options Considered**:
1. Extend existing modal with tabs/chapters
2. Create separate full-screen narrative mode
3. Inline expandable sections within cards

**Decision Rationale**:
- **CHOSEN: Option 2 (Separate mode)** - Clean separation of concerns
- Full-screen provides immersive reading experience
- Preserves existing quick-reference modal
- Can include multimedia (images, audio) without cluttering cards

**Trade-offs**:
- Additional component complexity
- Two separate views per verb (quick + narrative)
- Increased navigation paths

**Status**: Accepted

---

### ADR-003: User Experience Entry Points

**Decision**: Dual-entry system - both quick modal and dedicated narrative button

**Context**:
- Users need fast access to definitions (current modal)
- Narratives are deeper learning experiences (5-10 minutes)
- Must not disrupt existing workflow

**Options Considered**:
1. Replace current modal with narrative view
2. Add narrative button to each card
3. Separate "Story Mode" toggle in UI

**Decision Rationale**:
- **CHOSEN: Option 2 (Dual buttons)** - Preserves existing UX
- Clear visual distinction (book icon for narratives)
- Users can choose quick-reference or deep-dive
- Progressive enhancement pattern

**Trade-offs**:
- Slightly more complex card UI
- Need clear visual differentiation
- Potential user confusion (mitigated by clear icons/labels)

**Status**: Accepted

---

### ADR-004: Narrative Progression Mechanism

**Decision**: Chapter-based progression with memory persistence

**Context**:
- Narratives have 3-5 chapters
- Users should resume where they left off
- No backend/user accounts available

**Options Considered**:
1. All chapters visible at once (scrollable)
2. Sequential reveal with next/previous navigation
3. Free navigation with progress tracking

**Decision Rationale**:
- **CHOSEN: Option 3 (Free navigation + tracking)** - Respects user agency
- LocalStorage tracks progress per verb
- Table of contents shows completed chapters
- Can re-read any chapter anytime

**Trade-offs**:
- LocalStorage dependency (cleared on browser reset)
- Additional state management
- No cross-device sync

**Status**: Accepted

---

## 2. Data Structure Design

### Updated Synonym Object Schema

```json
{
  "verb": "observar",
  "pronunciation": "ob-ser-var",
  "quickDefinition": "Examinar atentamente",
  "definition": "...",
  "formality": "neutral",
  "context": "profesional",
  "regions": ["general"],
  "image": "assets/images/synonyms/observar.jpg",
  "examples": [...],
  "culturalNotes": "...",

  // NEW: Narrative experience
  "narrative": {
    "enabled": true,
    "title": "El Ornitólogo Observador",
    "subtitle": "Una historia sobre la observación científica",
    "estimatedTime": "8 min",
    "chapters": [
      {
        "id": "chapter_1",
        "title": "El Despertar del Observador",
        "order": 1,
        "content": {
          "text": "Dr. Elena Vargas llegó al humedal antes del amanecer. Con sus binoculares en mano, **observaba** el horizonte, esperando el primer vuelo de las garzas...",
          "focusVerb": "observar",
          "verbUsages": [
            {
              "sentence": "observaba el horizonte",
              "context": "Acción continua y deliberada",
              "timestamp": "06:45 AM"
            }
          ],
          "annotations": [
            {
              "term": "observaba",
              "type": "verb-usage",
              "note": "Imperfecto - observación continua y habitual"
            }
          ]
        },
        "metadata": {
          "setting": "Humedal costero, amanecer",
          "characters": ["Dr. Elena Vargas"],
          "focusSkills": ["sustained observation", "scientific methodology"]
        }
      },
      {
        "id": "chapter_2",
        "title": "Detalles en el Comportamiento",
        "order": 2,
        "content": {
          "text": "Elena **observó** que una garza en particular repetía un patrón inusual. Mientras las demás buscaban peces en aguas poco profundas, esta **observaba** detenidamente el borde de los manglares...",
          "focusVerb": "observar",
          "verbUsages": [
            {
              "sentence": "Elena observó que una garza",
              "context": "Percepción de un detalle específico",
              "contrastWith": "notar"
            },
            {
              "sentence": "esta observaba detenidamente",
              "context": "Observación sistemática con propósito",
              "contrastWith": "mirar"
            }
          ]
        },
        "metadata": {
          "setting": "Humedal, mediodía",
          "keyTheme": "differentiation-of-perception",
          "contrastVerbs": ["notar", "mirar", "ver"]
        }
      },
      {
        "id": "chapter_3",
        "title": "El Registro Científico",
        "order": 3,
        "content": {
          "text": "De regreso en su laboratorio, Elena revisaba las notas. 'Los científicos **observan** con metodología', pensó, diferenciándose del simple acto de mirar...",
          "focusVerb": "observar",
          "verbUsages": [
            {
              "sentence": "Los científicos observan con metodología",
              "context": "Definición profesional del término",
              "professionalContext": "ciencia"
            }
          ]
        },
        "metadata": {
          "setting": "Laboratorio universitario, tarde",
          "keyTheme": "professional-definition",
          "reflectiveNote": "Observar implica intención, método y registro"
        }
      }
    ],
    "pedagogicalFramework": {
      "learningObjectives": [
        "Distinguir 'observar' de 'ver', 'mirar', 'notar'",
        "Comprender el contexto profesional/científico",
        "Reconocer verbos en diferentes tiempos (observaba/observó)",
        "Aplicar en contextos auténticos"
      ],
      "cognitiveLevel": "analysis/synthesis",
      "bloomsTaxonomy": ["apply", "analyze", "create"]
    },
    "interactiveElements": [
      {
        "type": "reflection-prompt",
        "chapterIds": ["chapter_3"],
        "prompt": "¿Cuándo usas 'observar' en tu vida profesional o académica?",
        "position": "after-chapter"
      },
      {
        "type": "comparison-exercise",
        "chapterIds": ["chapter_2"],
        "question": "¿Cuál es la diferencia entre 'Elena observó' y 'Elena notó'?",
        "correctAnswer": "'Observó' implica examen deliberado; 'notó' es percepción más casual"
      }
    ]
  }
}
```

### Narrative Metadata Schema

```json
{
  "narrativeMetadata": {
    "version": "1.0",
    "totalNarratives": 14,
    "averageChaptersPerNarrative": 3.5,
    "estimatedTimeRange": "6-12 min",
    "lastUpdated": "2025-11-10T00:00:00Z",
    "contentGuidelines": {
      "chapterLength": "300-500 words",
      "verbUsageFrequency": "5-8 per chapter",
      "contrastVerbsRequired": true,
      "culturalContextRequired": true,
      "professionalDomains": [
        "ciencia",
        "literatura",
        "periodismo",
        "negocios",
        "educación"
      ]
    }
  }
}
```

---

## 3. Component Architecture

### 3.1 NarrativeViewer Component

**File**: `/src/components/NarrativeViewer.js`

```javascript
/**
 * NarrativeViewer Component
 * Full-screen immersive narrative experience for deep vocabulary learning
 */
export class NarrativeViewer {
  constructor(synonymData, options = {}) {
    this.data = synonymData;
    this.narrative = synonymData.narrative;
    this.options = {
      showProgress: true,
      enableAnnotations: true,
      trackCompletion: true,
      autoSave: true,
      ...options
    };

    this.currentChapter = 0;
    this.completedChapters = new Set();
    this.element = null;
    this.progressState = this._loadProgress();
  }

  // Core methods:
  render() { /* Create full-screen narrative UI */ }
  navigateToChapter(index) { /* Chapter navigation */ }
  renderChapter(chapter) { /* Individual chapter rendering */ }
  highlightVerbUsages(text) { /* Interactive verb highlighting */ }
  showAnnotation(term) { /* Popup annotations */ }
  trackProgress() { /* LocalStorage persistence */ }
  generateTableOfContents() { /* Chapter navigation UI */ }
  renderInteractiveElement(element) { /* Reflection prompts, quizzes */ }
  close() { /* Exit to synonym cards */ }
}
```

**Key Features**:
- Full-screen overlay (similar to modal but distinct styling)
- Chapter navigation sidebar (TOC with progress indicators)
- Main content area with progressive text reveal
- Verb usage highlighting (on hover shows annotation)
- Bottom progress bar (chapters completed)
- Exit button returns to synonym grid

**Interaction Flow**:
1. User clicks "Read Story" button on synonym card
2. NarrativeViewer opens in full-screen mode
3. Chapter 1 auto-loads, TOC shows all chapters
4. User reads, clicks verbs for annotations
5. "Next Chapter" button appears at end
6. Progress saved to LocalStorage on each chapter completion
7. "Return to Overview" button exits to grid

---

### 3.2 Updated SynonymCard Component

**Changes to**: `/src/components/SynonymCard.js`

```javascript
/**
 * Add narrative button to Layer 1 (always visible)
 */
_createLayer1() {
  // ... existing code ...

  // NEW: Narrative indicator
  if (this.data.narrative && this.data.narrative.enabled) {
    const narrativeBtn = document.createElement('button');
    narrativeBtn.className = 'card-narrative-btn';
    narrativeBtn.innerHTML = `
      <span class="narrative-icon">📖</span>
      <span class="narrative-label">Story</span>
      <span class="narrative-time">${this.data.narrative.estimatedTime}</span>
    `;
    narrativeBtn.onclick = (e) => {
      e.stopPropagation();
      this._openNarrative();
    };

    header.appendChild(narrativeBtn);
  }

  // ... existing code ...
}

/**
 * NEW: Launch narrative viewer
 */
_openNarrative() {
  const viewer = new NarrativeViewer(this.data, {
    showProgress: true,
    enableAnnotations: true,
    onClose: () => {
      // Return focus to card
      this.element.focus();
    }
  });

  document.body.appendChild(viewer.render());
}
```

**Visual Design Changes**:
- Add small "Story" button with book icon to card corner
- Shows estimated reading time (e.g., "8 min")
- Distinct from existing "Show more" expand button
- Only appears on cards with narratives enabled

---

### 3.3 ProgressTracker Service

**File**: `/src/services/narrativeProgress.js`

```javascript
/**
 * NarrativeProgressTracker
 * Manages user progress through narratives using LocalStorage
 */
export class NarrativeProgressTracker {
  constructor() {
    this.storageKey = 'sinonimos_narrative_progress';
    this.data = this._load();
  }

  // Track chapter completion
  markChapterComplete(verb, chapterId) {
    if (!this.data[verb]) {
      this.data[verb] = {
        startedAt: Date.now(),
        completedChapters: [],
        lastVisited: null,
        totalTime: 0
      };
    }

    if (!this.data[verb].completedChapters.includes(chapterId)) {
      this.data[verb].completedChapters.push(chapterId);
    }

    this.data[verb].lastVisited = Date.now();
    this._save();
  }

  // Get progress for verb
  getProgress(verb) {
    return this.data[verb] || null;
  }

  // Calculate completion percentage
  getCompletionPercentage(verb) {
    const progress = this.data[verb];
    if (!progress) return 0;

    // Assume narrative has 3-5 chapters
    return (progress.completedChapters.length / progress.totalChapters) * 100;
  }

  // Get all progress (for analytics)
  getAllProgress() {
    return this.data;
  }

  // Reset progress for verb
  resetProgress(verb) {
    delete this.data[verb];
    this._save();
  }

  // Private methods
  _load() { /* Load from localStorage */ }
  _save() { /* Save to localStorage */ }
}
```

---

## 4. UI/UX Design Specifications

### 4.1 Narrative Viewer Visual Design

**Layout Structure**:
```
┌─────────────────────────────────────────────────────┐
│  [← Back]              El Ornitólogo               │
│                     Observador                      │
│                    Capítulo 1 de 3                  │
├─────────────┬───────────────────────────────────────┤
│             │                                       │
│  TOC        │  Dr. Elena Vargas llegó al humedal  │
│             │  antes del amanecer. Con sus         │
│  ○ Cap 1    │  binoculares en mano, **observaba**  │
│  ○ Cap 2    │  el horizonte...                     │
│  ○ Cap 3    │                                       │
│             │  [Annotation popup shows on hover]    │
│  Progress:  │                                       │
│  33%        │                                       │
│             │                                       │
│             │                          [Next →]    │
├─────────────┴───────────────────────────────────────┤
│  ▓▓▓▓▓░░░░░░  33% Complete                         │
└─────────────────────────────────────────────────────┘
```

**Color Scheme**:
- Background: Soft cream (#FAF8F5) - easy on eyes for reading
- Text: Deep charcoal (#2d3748)
- Verb highlights: Muted gold (#D4A574) with subtle underline
- Progress bar: Terracotta (#B8734D)
- TOC active chapter: Bold + accent color

**Typography**:
- Body text: Cormorant Garamond 18px/1.8 (optimized for reading)
- Chapter titles: Cormorant Garamond 32px/1.2 (elegant)
- Annotations: Inter 14px/1.5 (UI text)
- TOC: Inter 16px/1.4

**Responsive Design**:
- Desktop (>1024px): TOC sidebar + main content
- Tablet (768-1024px): Collapsible TOC, full-width content
- Mobile (<768px): Bottom sheet TOC, stacked layout

---

### 4.2 Interaction Patterns

#### Verb Highlighting
```javascript
// On hover over highlighted verb
{
  "display": "popup annotation",
  "position": "above cursor",
  "content": {
    "verb": "observaba",
    "conjugation": "Imperfecto, 3ra persona singular",
    "context": "Acción continua y habitual",
    "synonymComparison": "vs. 'miraba' (menos deliberado)"
  },
  "animation": "fade-in 200ms"
}
```

#### Chapter Navigation
- Click TOC chapter → Smooth scroll to chapter
- "Next Chapter" button → Fade transition
- Progress auto-saves on chapter scroll completion (80% scrolled)
- Breadcrumbs show current position

#### Reflection Prompts
```html
<div class="interactive-prompt reflection">
  <h4>Reflexión</h4>
  <p>¿Cuándo usas 'observar' en tu vida profesional?</p>
  <textarea placeholder="Escribe tu respuesta..."></textarea>
  <button>Guardar reflexión</button>
</div>
```

---

### 4.3 Accessibility Considerations

**WCAG 2.1 AA Compliance**:
- Text contrast ratio: 7:1 (AAA level for body text)
- Focus indicators on all interactive elements
- Keyboard navigation:
  - `Tab`: Navigate through verbs and buttons
  - `Enter`: Show annotation
  - `Arrow keys`: Previous/Next chapter
  - `Escape`: Close viewer
- Screen reader support:
  - Semantic HTML (article, section, aside)
  - ARIA labels on buttons
  - Alt text for chapter images (if added)

**Font Size Controls**:
- Default: 18px
- User-adjustable: 16px, 18px, 20px, 22px
- LocalStorage persistence

---

## 5. Implementation Strategy

### Phase 1: Data Preparation (Week 1)
1. ✅ Design narrative schema (this document)
2. ⏱️ Write 14 narratives (3-5 chapters each)
3. ⏱️ Add narrative objects to synonyms.json
4. ⏱️ Validate JSON structure

**Deliverables**:
- Updated synonyms.json with 14 narratives
- Content guidelines document
- Sample narrative for testing

---

### Phase 2: Core Component Development (Week 2)
1. ⏱️ Build NarrativeViewer component
2. ⏱️ Implement chapter navigation
3. ⏱️ Add verb highlighting system
4. ⏱️ Create annotation popups
5. ⏱️ Build progress tracking service

**Deliverables**:
- `/src/components/NarrativeViewer.js`
- `/src/services/narrativeProgress.js`
- `/src/styles/narrative.css`

---

### Phase 3: Integration (Week 3)
1. ⏱️ Update SynonymCard component
2. ⏱️ Add "Story" button to cards
3. ⏱️ Wire up event handlers
4. ⏱️ Test narrative launch flow
5. ⏱️ Implement progress persistence

**Deliverables**:
- Updated `/src/components/SynonymCard.js`
- Integration tests
- User flow documentation

---

### Phase 4: Polish & Testing (Week 4)
1. ⏱️ Responsive design testing (mobile/tablet/desktop)
2. ⏱️ Accessibility audit (keyboard nav, screen readers)
3. ⏱️ Performance optimization (lazy load chapters)
4. ⏱️ Cross-browser testing
5. ⏱️ User acceptance testing

**Deliverables**:
- Responsive CSS for narrative viewer
- Accessibility report
- Performance metrics
- Browser compatibility matrix

---

## 6. Technical Considerations

### 6.1 Performance Optimization

**Lazy Loading Narratives**:
```javascript
// Only load narrative when user clicks "Story" button
async loadNarrative(verb) {
  // Check if narrative already in memory
  if (this.narrativeCache[verb]) {
    return this.narrativeCache[verb];
  }

  // Load from synonyms.json (already cached by browser)
  const synonymData = await this.getSynonymData(verb);
  this.narrativeCache[verb] = synonymData.narrative;

  return synonymData.narrative;
}
```

**Estimated Impact**:
- Initial page load: No change (narratives in same JSON file)
- Narrative open: <100ms (data already in memory)
- Chapter transition: Instant (no additional requests)

---

### 6.2 LocalStorage Management

**Storage Structure**:
```javascript
{
  "sinonimos_narrative_progress": {
    "observar": {
      "startedAt": 1699564800000,
      "completedChapters": ["chapter_1", "chapter_2"],
      "lastVisited": 1699565400000,
      "totalTime": 420000, // 7 minutes
      "reflections": {
        "chapter_3": "Uso 'observar' cuando analizo datos en mi trabajo..."
      }
    },
    // ... other verbs ...
  }
}
```

**Size Estimate**:
- Per verb: ~500 bytes
- 14 verbs: ~7KB
- User reflections: ~2KB per verb (if saved)
- Total: <50KB (well within 5MB LocalStorage limit)

---

### 6.3 Browser Compatibility

**Required Features**:
- LocalStorage API (supported all modern browsers)
- CSS Grid & Flexbox (IE11+)
- ES6 features (const, let, arrow functions)
- Fetch API (IE11 needs polyfill)

**Fallback Strategy**:
- No LocalStorage → Progress resets each session (graceful degradation)
- No ES6 → Transpile with Babel (optional, for legacy support)
- No CSS Grid → Fallback to Flexbox layout

---

## 7. Content Strategy

### 7.1 Narrative Writing Guidelines

**Character Development**:
- Each narrative features 1-3 recurring characters
- Characters represent the verb's typical context:
  - **observar**: Dr. Elena (scientist)
  - **contemplar**: Marco (poet/philosopher)
  - **avistar**: Capitán Rodríguez (ship captain)
  - **acechar**: Detective Morales (investigator)

**Story Structure** (3-Act Format):
```
Chapter 1: Setup (300 words)
- Introduce character and setting
- Establish verb's basic meaning
- 3-5 verb usages in context

Chapter 2: Conflict/Development (400 words)
- Character uses verb in challenging situation
- Contrast with similar verbs (mirar, ver, notar)
- Show nuanced differences through story

Chapter 3: Resolution/Reflection (350 words)
- Character reflects on meaning of verb
- Professional or cultural significance
- Pedagogical summary without being didactic
```

---

### 7.2 Pedagogical Framework

**Learning Objectives per Narrative**:
1. **Recognition**: Identify verb in various contexts (6-8 examples)
2. **Differentiation**: Distinguish from near-synonyms (3-4 contrasts)
3. **Production**: Apply in reflective writing (1-2 prompts)
4. **Cultural awareness**: Understand professional/regional usage

**Bloom's Taxonomy Alignment**:
- Remember: Recognize verb in text (passive)
- Understand: Explain difference from synonyms (annotation)
- Apply: Use in reflection prompt (active production)
- Analyze: Compare verb usage across chapters

---

### 7.3 Example Narrative Outline

**Verb**: `contemplar`

**Title**: "El Poeta en el Parque"

**Chapters**:
1. **La Banca del Atardecer** (300 words)
   - Marco, un poeta, visita el parque cada tarde
   - **Contempla** el lago al atardecer
   - Verb usage: contemplative, aesthetic observation
   - Setting: Urban park, golden hour

2. **Más Allá de Mirar** (400 words)
   - Marco's friend asks: "¿Por qué no solo *miras* el lago?"
   - Marco explains: "*Contemplar* no es solo ver, es reflexionar"
   - Contrast verbs: mirar, observar, ver
   - Philosophy: contemplation vs. observation

3. **La Belleza en el Detalle** (350 words)
   - Marco writes poem about contemplation
   - Cultural note: Latin American poetic tradition
   - Reflection prompt: "¿Qué contemplas cuando necesitas paz?"
   - Closes with definition summary

---

## 8. Success Metrics

### 8.1 User Engagement Metrics

**Track via LocalStorage Analytics**:
- Narratives opened per session
- Average chapters completed per narrative
- Time spent in narrative mode
- Reflection prompts completed
- Verbs with completed narratives

**Target KPIs**:
- 40% of users open at least one narrative
- 60% complete rate for started narratives
- Average 7-10 minutes per narrative
- 30% complete reflection prompts

---

### 8.2 Learning Effectiveness Indicators

**Proxy Metrics** (without backend):
- Repeat views of same narrative (indicates value)
- Completion of multiple narratives (engagement)
- Time spent on annotation hovers (active learning)

**Qualitative Assessment**:
- User testing sessions (5-10 participants)
- Pre/post vocabulary quizzes
- Think-aloud protocols during narrative reading

---

### 8.3 Technical Performance Targets

**Load Times**:
- Narrative open: <200ms
- Chapter transition: <100ms
- Annotation popup: <50ms

**Accessibility**:
- 100% keyboard navigable
- WCAG 2.1 AA compliant
- Screen reader compatible

**Browser Support**:
- Chrome/Edge 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Full support
- IE11: Graceful degradation (no narratives)

---

## 9. Risk Mitigation

### Risk Matrix

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| File size too large | Medium | High | Lazy load chapters individually |
| User confusion (2 buttons) | Medium | Medium | Clear visual design, onboarding tooltip |
| LocalStorage cleared | High | Low | Graceful degradation, no error state |
| Narratives too long | Low | Medium | Content guidelines (300-500 words/chapter) |
| Poor mobile experience | Medium | High | Mobile-first design, responsive testing |

---

## 10. Future Enhancements

### Phase 2+ Ideas
1. **Audio Narration**: Add text-to-speech or recorded audio
2. **Interactive Quizzes**: Multiple-choice questions between chapters
3. **Spaced Repetition**: Schedule narrative review based on progress
4. **Shared Narratives**: QR codes to share favorite stories
5. **User-Generated Content**: Allow users to submit their own narratives
6. **Cross-Verb Narratives**: Stories using multiple synonyms
7. **Regional Variants**: Location-specific narratives (Mexico, Argentina, etc.)
8. **Difficulty Levels**: Beginner/Intermediate/Advanced narratives

---

## 11. Architecture Diagrams

### Component Interaction Flow

```
┌─────────────────┐
│  SynonymCard    │
│  (Layer 1)      │
│                 │
│  [Story Button] │◄─── Narrative enabled check
└────────┬────────┘
         │ onClick
         ▼
┌─────────────────────────┐
│  NarrativeViewer        │
│  (Full-screen overlay)  │
│                         │
│  ┌───────────┐          │
│  │    TOC    │          │
│  │  Chapter  │          │
│  │  List     │          │
│  └───────────┘          │
│                         │
│  ┌────────────────────┐ │
│  │  Chapter Content   │ │
│  │  + Annotations     │ │
│  └────────────────────┘ │
│                         │
│  ┌────────────────────┐ │
│  │  Progress Bar      │ │
│  └────────────────────┘ │
└────────┬────────────────┘
         │ save progress
         ▼
┌─────────────────────────┐
│ NarrativeProgressTracker│
│  (LocalStorage)         │
│                         │
│  {                      │
│    verb: "observar",    │
│    chapters: [...],     │
│    lastVisited: ...     │
│  }                      │
└─────────────────────────┘
```

---

### Data Flow Diagram

```
[synonyms.json]
       │
       │ App init → Load all data
       ▼
[App State / Memory]
       │
       │ User clicks "Story"
       ▼
[NarrativeViewer]
       │
       ├─→ [Chapter Renderer] → Display content
       │         │
       │         └─→ [VerbHighlighter] → Annotate verbs
       │
       ├─→ [TOC Generator] → Show navigation
       │
       └─→ [ProgressTracker]
                 │
                 └─→ [LocalStorage] → Persist progress
```

---

## 12. Deployment Checklist

### Pre-Launch
- [ ] All 14 narratives written and reviewed
- [ ] JSON schema validated
- [ ] NarrativeViewer component tested on all devices
- [ ] Accessibility audit passed
- [ ] Performance targets met (<200ms narrative open)
- [ ] Browser compatibility confirmed
- [ ] LocalStorage fallback tested
- [ ] User testing completed (5+ participants)

### Launch
- [ ] Update synonyms.json with narratives
- [ ] Deploy new JS/CSS files
- [ ] Update documentation
- [ ] Add onboarding tooltip for "Story" button
- [ ] Monitor analytics (if available)

### Post-Launch
- [ ] Gather user feedback
- [ ] Fix critical bugs within 48 hours
- [ ] Plan Phase 2 enhancements
- [ ] Write case study / blog post

---

## 13. Conclusion

This architecture integrates narrative experiences seamlessly into the existing synonym application while maintaining its core principles:

**Preserved Values**:
- Zero external dependencies
- Offline-first capability
- Elegant, minimalist design
- Performance-focused implementation

**Added Value**:
- Deep contextual learning through storytelling
- Progressive disclosure of complex concepts
- Immersive reading experience
- Persistent learning progress

**Next Steps**:
1. Review and approve this design document
2. Begin narrative writing (14 stories, ~50-60 pages total)
3. Implement NarrativeViewer component (2-3 weeks)
4. User testing and iteration
5. Launch Phase 2 with narratives

---

**Document Status**: ✅ Complete
**Approval Required**: Product Owner, Lead Developer
**Estimated Implementation**: 4 weeks
**Files to Create**: 3 new components, 1 service, 1 CSS file
**Lines of Code**: ~1,200 LOC (JavaScript + CSS)

---

*This architecture design was created following the SPARC methodology and system architecture best practices. All decisions are documented in ADRs for future reference and modification.*
