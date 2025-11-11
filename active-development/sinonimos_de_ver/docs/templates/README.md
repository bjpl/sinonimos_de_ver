# Narrative Integration Templates

**Reusable templates for adding literary narrative experiences to synonym learning projects.**

---

## 📁 Files in This Directory

### 1. QUICK_START_TEMPLATE.md (686 lines)
**Use for**: Step-by-step checklist when integrating narratives into a new project

**How to use**:
1. Copy to your new project's docs/ folder
2. Fill in project name and literary terms
3. Check off items as you complete each phase
4. Track time and issues for future optimization

**Contains**:
- 6-phase integration checklist
- Code snippets for each modification
- Verification commands
- Troubleshooting steps
- Success metrics

---

### 2. SWARM_PROMPT_TEMPLATE.txt (372 lines)
**Use for**: Launching Claude Flow swarm to create narratives

**How to use**:
1. Open the file and customize:
   - Replace `[PROJECT_NAME]` with your project
   - Replace `[PROJECT_THEME]` (e.g., "speech", "movement")
   - List your literary terms
   - Adjust paths if needed
2. Copy entire contents
3. Paste to Claude Code
4. Swarm will create narratives in ~20 minutes

**Generates**:
- docs/research/literary_synonyms_analysis.json
- docs/literary_narratives.json
- docs/narrative_integration_design.md
- docs/narrative_quality_review.md

---

## 🚀 Quick Application Guide

### For sinonimos_de_hablar:

```bash
# 1. Copy templates to new project
cp templates/QUICK_START_TEMPLATE.md ../../sinonimos_de_hablar/docs/

# 2. Navigate to new project
cd ../../sinonimos_de_hablar

# 3. Find literary terms
grep '"context": "literario"' data/synonyms.json

# 4. Customize and run swarm prompt from SWARM_PROMPT_TEMPLATE.txt

# 5. Follow QUICK_START_TEMPLATE.md checklist

# 6. Deploy when complete
```

**Time estimate**: 35-40 minutes per project

---

### For sinonimos_de_caminar:

Same process, just:
- Update project name
- Focus on movement/walking verb themes
- Narrative settings: Streets, paths, journeys
- Character types: Wanderers, travelers, pedestrians

---

## 📚 What Gets Created

### Swarm Output (20 min):
```
docs/
├── research/
│   └── literary_synonyms_analysis.json    # Research findings
├── literary_narratives.json               # Complete narratives
├── narrative_integration_design.md        # Architecture (900 lines)
└── narrative_quality_review.md            # Quality assessment
```

### Integration Output (15 min):
```
components/
└── NarrativeViewer.js                     # Viewer component (450 lines)

services/
└── narrativeProgress.js                   # Progress tracking (250 lines)

styles/
└── narrative.css                          # Narrative styles (600 lines)

MODIFIED:
├── data/synonyms.json                     # Added narrativeExperience
├── scripts/app.js                         # Added openNarrative + story buttons
├── styles/main.css                        # Added .story-button styles
└── index.html                             # Linked narrative.css
```

---

## 🎯 Quality Standards

### Narrative Quality:
- **Minimum**: 8.0/10 per narrative
- **Target**: 8.5+/10 average
- **Excellence**: 9.0+/10 for most narratives

### Code Quality:
- **Component**: Production-ready, no TODOs
- **Performance**: <200ms narrative open time
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser support**: Chrome 90+, Firefox 88+, Safari 14+

### Integration Quality:
- **Zero breaking changes**: Existing app still works
- **Graceful enhancement**: Story buttons only on literary terms
- **Progressive disclosure**: Quick modal still available
- **Persistent state**: LocalStorage tracks progress

---

## 🔧 Customization Options

### Adjust Narrative Length:

**Current**: 60-90 words per part (180-270 words total)

**Shorter** (40-60 words per part):
- Faster reading
- Mobile-friendly
- Less literary depth

**Longer** (90-120 words per part):
- More character development
- Richer descriptions
- Greater immersion

**Update in swarm prompt**: Specify word count per part

---

### Adjust Part Count:

**Current**: 3 parts per narrative

**2 parts**:
- Setup + Reflection
- Faster completion
- Less progressive disclosure

**4-5 parts**:
- Chapter-like experience
- Deeper storytelling
- Longer engagement time

**Update in**: narrativeExperience.parts array

---

### Adjust Visual Design:

**Current colors**:
- Background: Cream (#FAF8F5)
- Text: Charcoal (#2d3748)
- Highlight: Gold (#D4A574)

**To customize**: Edit `styles/narrative.css` color variables

**Alternative palettes**:
- **Dark mode**: Dark gray bg + cream text
- **High contrast**: White bg + pure black text
- **Warm**: Sepia tones throughout

---

## 📊 Expected Results

### From sinonimos_de_ver (Reference):

**Input**:
- 14 total synonyms
- 6 literary terms identified
- ~35 minutes integration time

**Output**:
- 6 elegant 3-part narratives
- 9.1/10 average quality score
- 1,300 lines of production code
- Fully deployed and functional
- Zero external dependencies added

**User Experience**:
- Story buttons on 6/14 cards
- Full-screen immersive reading
- Progress tracking per user
- Keyboard + mouse navigation
- Mobile-responsive design

---

## 🎓 Learning from sinonimos_de_ver

### What Worked Well:

1. ✅ **Parallel agent execution** - 4 agents working concurrently
2. ✅ **Quality review phase** - Caught issues before integration
3. ✅ **Component reusability** - Same components work for all projects
4. ✅ **Progressive enhancement** - Doesn't break existing functionality
5. ✅ **Elegant prose** - Narratives match literary sophistication target

### What to Improve:

1. ⚠️ **Deployment confusion** - Initially updated src/ instead of root/
2. ⚠️ **File location clarity** - Document ROOT vs src/ more clearly
3. ⚠️ **Testing earlier** - Create test page before deployment

### Applied Improvements in Templates:

- ✅ Explicit "ROOT directory" warnings throughout
- ✅ File location verification commands
- ✅ Test page creation in checklist
- ✅ Deployment from repo root emphasized

---

## 🔄 Iteration Strategy

### After First Project (sinonimos_de_ver):
- [x] Document full process
- [x] Create reusable templates
- [x] Note pitfalls and solutions
- [x] Extract component patterns

### For Second Project (sinonimos_de_hablar):
- [ ] Use QUICK_START_TEMPLATE.md
- [ ] Copy components verbatim
- [ ] Only create new narratives
- [ ] Deploy with confidence
- [ ] Time the process

### For Third Project (sinonimos_de_caminar):
- [ ] Refine based on second project learnings
- [ ] Consider batching narrative creation
- [ ] Potentially automate deployment
- [ ] Measure improvements

**Goal**: Reduce time from 35 min → 20 min by third project

---

## 📝 Template Usage Tracking

| Project | Status | Time | Quality | Notes |
|---------|--------|------|---------|-------|
| sinonimos_de_ver | ✅ Complete | 35 min | 9.1/10 | Reference implementation |
| sinonimos_de_hablar | ⏳ Pending | - | - | Use templates |
| sinonimos_de_caminar | ⏳ Pending | - | - | Use templates |

---

## 🆘 Getting Help

**If stuck**:
1. Check NARRATIVE_INTEGRATION_PLAYBOOK.md (1,045 lines - comprehensive)
2. Review sinonimos_de_ver implementation as reference
3. Run verification script from playbook
4. Check troubleshooting decision tree in playbook

**Common issues**:
- Story buttons not appearing → Check file locations (ROOT not src/)
- Viewer not opening → Verify component exists at components/NarrativeViewer.js
- Deployment shows old version → Hard refresh (Ctrl+Shift+R) and wait 2 min

---

*These templates encapsulate the successful strategy from sinonimos_de_ver and enable rapid replication across similar projects with consistent quality.*
