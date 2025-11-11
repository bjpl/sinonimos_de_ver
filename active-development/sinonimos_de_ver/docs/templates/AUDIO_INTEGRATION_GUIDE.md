# Audio Integration Guide for Narrative Experiences

**Add elegant audio narration to multi-part narratives using LATAM Spanish TTS voices**

---

## 🎯 Overview

This guide shows how to add audio narration to narrative experiences using the **same voice system** as the main app (Microsoft Edge TTS with LATAM Spanish voices).

### What You'll Add

- **Audio button** on each narrative part
- **Play/pause functionality** with visual feedback
- **Voice consistency** (same voice for verb + narrative)
- **Elegant styling** matching existing audio buttons

---

## 📋 Prerequisites

### Already Have:
- ✅ NarrativeViewer component with 3-part narratives
- ✅ Existing audio system (Edge TTS + audio_metadata.json)
- ✅ Voice assignments per verb in audio_metadata.json

### You'll Add:
- 🎙️ Audio files for each narrative part (18 files for 6 narratives)
- 🎙️ Narrative audio metadata
- 🎙️ Audio buttons in NarrativeViewer
- 🎙️ Audio playback integration

---

## Step 1: Generate Narrative Audio (5 min)

### 1.1 Create Audio Generation Script

**File**: `scripts/generate_narrative_audio.py`

```python
#!/usr/bin/env python3
import asyncio
import json
from pathlib import Path
import edge_tts

# Directories
AUDIO_DIR = Path(__file__).parent.parent / "assets" / "audio"
NARRATIVES_DIR = AUDIO_DIR / "narratives"
DATA_DIR = Path(__file__).parent.parent / "data"

NARRATIVES_DIR.mkdir(parents=True, exist_ok=True)

# Voices (matches existing system)
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

# Verb voice mapping (CRITICAL: Use same voices as verbs!)
VERB_VOICES = {
    # Get from existing audio_metadata.json
    "contemplar": "co_male_1",
    "vislumbrar": "mx_female_1",
    "atisbar": "co_male_1",
    "otear": "ar_female_1",
    "columbrar": "us_male_1",
    "entrever": "ar_male_1",
}

async def generate_audio(text, output_path, voice):
    communicate = edge_tts.Communicate(text, VOICES[voice])
    await communicate.save(output_path)
    print(f"✅ Generated: {output_path.name} ({voice})")

async def generate_narrative_audio():
    # Load synonyms
    synonyms_path = DATA_DIR / "synonyms.json"
    with open(synonyms_path, 'r', encoding='utf-8') as f:
        synonyms = json.load(f)

    # Load existing metadata
    metadata_path = DATA_DIR / "audio_metadata.json"
    with open(metadata_path, 'r', encoding='utf-8') as f:
        audio_metadata = json.load(f)

    # Add narratives section
    if "narratives" not in audio_metadata:
        audio_metadata["narratives"] = {}

    tasks = []

    for synonym in synonyms:
        verb = synonym["verb"]

        # Only process if has narrative
        if "narrativeExperience" not in synonym:
            continue

        narrative = synonym["narrativeExperience"]
        voice_id = VERB_VOICES.get(verb, "us_female_1")

        print(f"📖 {verb} - {narrative['title']} (Voice: {voice_id})")

        audio_metadata["narratives"][verb] = {
            "title": narrative["title"],
            "voice": voice_id,
            "parts": []
        }

        # Generate audio for each part
        for i, part_text in enumerate(narrative["parts"], 1):
            output_file = NARRATIVES_DIR / f"{verb}_part_{i}.mp3"
            tasks.append(generate_audio(part_text, output_file, voice_id))

            audio_metadata["narratives"][verb]["parts"].append({
                "partNumber": i,
                "file": f"assets/audio/narratives/{verb}_part_{i}.mp3",
                "voice": voice_id,
                "text": part_text,
                "duration": None
            })

    # Execute all in parallel
    await asyncio.gather(*tasks)

    # Save metadata
    from datetime import datetime
    audio_metadata["generatedAt"] = datetime.now().isoformat()

    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(audio_metadata, f, indent=2, ensure_ascii=False)

    print(f"\n✨ Narrative audio complete! {len(tasks)} files generated")

if __name__ == "__main__":
    asyncio.run(generate_narrative_audio())
```

### 1.2 Run Audio Generation

```bash
# Install edge-tts if needed
pip install edge-tts

# Generate audio (takes ~30 seconds)
python3 scripts/generate_narrative_audio.py
```

**Expected output**:
```
🎙️  Generating narrative audio with LATAM voices...

📖 contemplar - La Quietud del Amanecer (Voice: co_male_1)
📖 vislumbrar - Entre la Niebla y el Presentimiento (Voice: mx_female_1)
...
✅ Generated: contemplar_part_1.mp3 (co_male_1)
✅ Generated: contemplar_part_2.mp3 (co_male_1)
...

✨ Narrative audio complete! 18 files generated
```

### 1.3 Verify Audio Files

```bash
ls -la assets/audio/narratives/*.mp3
# Should show 18 files (6 narratives × 3 parts)
```

**Checklist**:
- [ ] 18 MP3 files created
- [ ] Files named: `{verb}_part_{1-3}.mp3`
- [ ] audio_metadata.json updated with `narratives` section

---

## Step 2: Add Audio Buttons to NarrativeViewer (10 min)

### 2.1 Update _renderParts() Method

**File**: `components/NarrativeViewer.js`

**Find**:
```javascript
_renderParts() {
  return this.narrative.parts.map((part, index) => {
    const isActive = index === this.currentPart;
    const highlightedText = this.options.enableHighlighting
      ? this._highlightVerb(part)
      : part;

    return `
      <div class="narrative-part ${isActive ? 'active' : ''}" data-part="${index}">
        <div class="part-number">Parte ${index + 1}</div>
        <p class="part-text">${highlightedText}</p>
      </div>
    `;
  }).join('');
}
```

**Replace with**:
```javascript
_renderParts() {
  return this.narrative.parts.map((part, index) => {
    const isActive = index === this.currentPart;
    const highlightedText = this.options.enableHighlighting
      ? this._highlightVerb(part)
      : part;

    // Get audio file for this part
    const audioFile = this._getPartAudioFile(index);

    return `
      <div class="narrative-part ${isActive ? 'active' : ''}" data-part="${index}">
        <div class="part-header">
          <div class="part-number">Parte ${index + 1}</div>
          ${audioFile ? `
            <button class="part-audio-button"
                    data-audio="${audioFile}"
                    data-part="${index}"
                    aria-label="Escuchar Parte ${index + 1}"
                    title="Escuchar narración">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
          ` : ''}
        </div>
        <p class="part-text">${highlightedText}</p>
      </div>
    `;
  }).join('');
}
```

### 2.2 Add Helper Method

**Add this method to NarrativeViewer class**:

```javascript
/**
 * Get audio file path for narrative part
 * @private
 */
_getPartAudioFile(partIndex) {
  // Check if audio metadata is loaded globally
  if (typeof window.audioMetadata === 'undefined') return null;

  const narrativeAudio = window.audioMetadata.narratives?.[this.data.verb];
  if (!narrativeAudio) return null;

  const partAudio = narrativeAudio.parts?.[partIndex];
  return partAudio ? partAudio.file : null;
}
```

### 2.3 Add Audio Event Handlers

**In _attachEventHandlers() method, add**:

```javascript
// Audio buttons for narrative parts
const audioButtons = this.element.querySelectorAll('.part-audio-button');
audioButtons.forEach(btn => {
  btn.onclick = (e) => {
    e.stopPropagation();
    const audioFile = btn.dataset.audio;
    this._playPartAudio(audioFile, btn);
  };
});
```

### 2.4 Add Audio Playback Methods

**Add these methods to NarrativeViewer class**:

```javascript
/**
 * Play narrative part audio
 * @private
 */
_playPartAudio(audioFile, buttonElement) {
  // Use global playAudio function if available
  if (typeof window.playAudio === 'function') {
    window.playAudio(audioFile, buttonElement);
  } else {
    // Fallback: play audio directly
    this._playAudioFallback(audioFile, buttonElement);
  }
}

/**
 * Fallback audio player
 * @private
 */
_playAudioFallback(audioFile, buttonElement) {
  if (this.currentAudio) {
    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
  }

  this.currentAudio = new Audio(audioFile);
  buttonElement.classList.add('playing');

  this.currentAudio.onended = () => {
    buttonElement.classList.remove('playing');
    this.currentAudio = null;
  };

  this.currentAudio.play().catch(err => {
    console.error('Audio playback failed:', err);
    buttonElement.classList.remove('playing');
  });
}
```

---

## Step 3: Add Audio Button Styles (5 min)

### 3.1 Update narrative.css

**File**: `styles/narrative.css`

**Replace**:
```css
.part-number {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}
```

**With**:
```css
.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.part-number {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.part-audio-button {
  background: rgba(79, 93, 117, 0.1);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

.part-audio-button:hover {
  background: rgba(79, 93, 117, 0.2);
  color: var(--color-primary);
  transform: scale(1.1);
}

.part-audio-button.playing {
  background: rgba(49, 130, 206, 0.2);
  color: #3182ce;
  animation: audioPulse 1s ease-in-out infinite;
}

@keyframes audioPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.part-audio-button svg {
  width: 18px;
  height: 18px;
}
```

---

## Step 4: Updated audio_metadata.json Schema

### New Structure

```json
{
  "verbs": {
    "contemplar": {
      "file": "assets/audio/verbs/contemplar.mp3",
      "voice": "co_male_1",
      "text": "contemplar"
    }
  },
  "examples": {
    "contemplar": [
      { "file": "...", "voice": "co_male_1", "text": "..." }
    ]
  },
  "narratives": {
    "contemplar": {
      "title": "La Quietud del Amanecer",
      "voice": "co_male_1",
      "parts": [
        {
          "partNumber": 1,
          "file": "assets/audio/narratives/contemplar_part_1.mp3",
          "voice": "co_male_1",
          "text": "Desde el balcón de su estudio...",
          "duration": null
        },
        {
          "partNumber": 2,
          "file": "assets/audio/narratives/contemplar_part_2.mp3",
          "voice": "co_male_1",
          "text": "Cada matiz del cielo...",
          "duration": null
        },
        {
          "partNumber": 3,
          "file": "assets/audio/narratives/contemplar_part_3.mp3",
          "voice": "co_male_1",
          "text": "No era simplemente mirar...",
          "duration": null
        }
      ]
    }
  },
  "voices": {
    "co_male_1": {
      "name": "es-CO-GonzaloNeural",
      "region": "CO",
      "gender": "male"
    }
  }
}
```

**Key Points**:
- Each narrative uses **same voice** as its verb
- 3 parts per narrative
- File naming: `{verb}_part_{1-3}.mp3`
- Stored in `assets/audio/narratives/`

---

## Step 5: Voice Consistency Mapping

### Get Voice Assignments from Existing Metadata

```bash
# Extract verb voice mappings
cat data/audio_metadata.json | jq '.verbs | to_entries | map({verb: .key, voice: .value.voice})'
```

**Example output**:
```json
[
  {"verb": "contemplar", "voice": "co_male_1"},
  {"verb": "vislumbrar", "voice": "mx_female_1"},
  {"verb": "atisbar", "voice": "co_male_1"},
  {"verb": "otear", "voice": "ar_female_1"},
  {"verb": "columbrar", "voice": "us_male_1"},
  {"verb": "entrever", "voice": "ar_male_1"}
]
```

**Use these EXACT voice assignments** in `VERB_VOICES` dict in generate_narrative_audio.py

---

## Step 6: Visual Design of Audio Buttons

### Placement & Style

```
┌─────────────────────────────────────────┐
│  PARTE 1                          [🔊]  │  ← Audio button here
│                                         │
│  Desde el balcón de su estudio,        │
│  el poeta contemplaba las primeras     │
│  luces del alba...                     │
└─────────────────────────────────────────┘
```

**Design Specifications**:
- **Position**: Top-right of each part
- **Size**: 36px × 36px circular button
- **Color**: Gray when idle, blue when playing
- **Icon**: Speaker with sound waves (SVG)
- **Animation**: Pulse effect during playback
- **Hover**: Scale 1.1× + darker background

---

## Step 7: Audio Playback Integration

### Uses Existing playAudio() Function

The NarrativeViewer reuses the global `window.playAudio()` function from your main app, ensuring:

✅ **Consistent behavior** with verb/example audio
✅ **Stops previous audio** before playing new
✅ **Visual feedback** with `.playing` class
✅ **Error handling** for failed playback

**Fallback**: If `window.playAudio` not available, component has built-in audio player

---

## Step 8: Testing Checklist

### Local Testing

```bash
python3 -m http.server 8000
# Open: http://localhost:8000/
```

**Test**:
- [ ] Audio buttons visible on each narrative part
- [ ] Clicking audio button plays narration
- [ ] Button shows pulse animation while playing
- [ ] Audio stops when switching parts
- [ ] Same voice for all 3 parts of same narrative
- [ ] Voice matches verb pronunciation
- [ ] Mobile: Audio buttons still accessible

### Browser Console Check

```javascript
// Check audio metadata loaded
console.log(window.audioMetadata.narratives);

// Should show: { contemplar: {...}, vislumbrar: {...}, ... }
```

---

## Step 9: File Sizes & Performance

### Expected Audio Sizes

**Per narrative part**: 40-75 KB
**Per complete narrative** (3 parts): 120-225 KB
**Total for 6 narratives**: ~1.2 MB

**Performance Impact**:
- Lazy loading: Audio only loads when button clicked
- No initial page load impact
- Uses browser's native Audio API (fast)

### Optimization

Audio files are **MP3 format** with:
- Bitrate: Auto (Edge TTS default ~64kbps)
- Sample rate: 24kHz
- Mono channel
- Optimized for speech

---

## Step 10: Deployment

### 10.1 Commit Audio Files

```bash
git add \
  assets/audio/narratives/*.mp3 \
  data/audio_metadata.json \
  components/NarrativeViewer.js \
  styles/narrative.css \
  scripts/generate_narrative_audio.py

git commit -m "feat: Add audio narration for narrative experiences

- 18 MP3 files (3 parts × 6 narratives)
- 5 LATAM voices (MX, CO, AR, US)
- Audio buttons on each part
- Voice consistency with verbs

🤖 Generated with Claude Code"

git push origin main
```

### 10.2 Deploy to GitHub Pages

```bash
cd /path/to/repo-root
git subtree split --prefix path/to/project main -b deploy
git push origin deploy:gh-pages --force
git branch -D deploy
```

### 10.3 Verify Deployment

```bash
# Check audio files on gh-pages
git ls-tree -r origin/gh-pages --name-only | grep "narratives.*mp3" | wc -l
# Should output: 18

# Check metadata updated
git show origin/gh-pages:data/audio_metadata.json | grep -c '"narratives"'
# Should output: 1
```

---

## Troubleshooting

### ❌ Audio buttons don't appear

**Check**:
```bash
# 1. Metadata loaded?
grep -c '"narratives"' data/audio_metadata.json
# Should output: 1

# 2. Component has _getPartAudioFile method?
grep "_getPartAudioFile" components/NarrativeViewer.js
# Should find the method

# 3. window.audioMetadata available?
# Open browser console: console.log(window.audioMetadata)
```

**Solution**: Ensure audio_metadata.json loads in app.js before opening narratives

---

### ❌ Audio doesn't play

**Check**:
```javascript
// Browser console:
window.audioMetadata.narratives.contemplar
// Should show object with parts array

// Check file path:
window.audioMetadata.narratives.contemplar.parts[0].file
// Should be: "assets/audio/narratives/contemplar_part_1.mp3"
```

**Solution**: Verify audio files exist at correct paths

---

### ❌ Wrong voice used

**Check**:
```bash
# Verify VERB_VOICES matches audio_metadata.json
cat scripts/generate_narrative_audio.py | grep -A 10 "VERB_VOICES ="
```

**Solution**: Use EXACT same voice as verb (check audio_metadata.json verbs section)

---

## Voice Assignment Convention

### Principle: Voice Consistency

**Rule**: Same verb = same voice across ALL contexts

```
contemplar:
├─ Verb pronunciation → co_male_1
├─ Example sentences → co_male_1
└─ Narrative parts → co_male_1  ✅ Consistent!
```

### Available LATAM Voices

**Mexican**:
- `mx_female_1`: Dalia (warm, clear)
- `mx_male_1`: Jorge (professional)

**Colombian**:
- `co_female_1`: Salome (gentle, poetic)
- `co_male_1`: Gonzalo (literary, sophisticated)

**Argentine**:
- `ar_female_1`: Elena (expressive)
- `ar_male_1`: Tomas (dramatic, literary)

**US Spanish** (Neutral LATAM):
- `us_female_1`: Paloma (neutral)
- `us_male_1`: Alonso (neutral)

### Recommended Assignments for Literary Terms

**Contemplative verbs** (contemplar, vislumbrar):
- Use: `co_male_1` or `ar_female_1` (more poetic delivery)

**Action verbs** (atisbar, otear, acechar):
- Use: `mx_male_1` or `ar_male_1` (more dynamic)

**Analytical verbs** (columbrar, entrever):
- Use: `us_male_1` or `co_female_1` (neutral, thoughtful)

---

## Complete Audio Integration Summary

### What Gets Added:

**Files** (18 audio + 1 script):
- `assets/audio/narratives/{verb}_part_{1-3}.mp3` (18 files)
- `scripts/generate_narrative_audio.py` (1 file)

**Code Changes** (~150 lines):
- `components/NarrativeViewer.js` (+80 lines)
- `styles/narrative.css` (+50 lines)
- `data/audio_metadata.json` (+170 lines metadata)

**Total Size**: ~1.2 MB audio + 20 KB code

### User Experience Enhancement:

- 🎧 **Audiobook experience**: Listen while reading
- 🌎 **Authentic accents**: Real LATAM Spanish voices
- 🎯 **Voice consistency**: Same narrator throughout verb's journey
- 🎨 **Elegant controls**: Subtle, non-intrusive buttons
- 📱 **Mobile-friendly**: Touch-optimized audio controls

---

## Replication for Other Projects

### For sinonimos_de_hablar:

```bash
# 1. Copy script
cp ../sinonimos_de_ver/scripts/generate_narrative_audio.py scripts/

# 2. Update VERB_VOICES dict with YOUR verb→voice mappings from audio_metadata.json

# 3. Run generation
python3 scripts/generate_narrative_audio.py

# 4. Copy updated component code (Steps 2-3 above)

# 5. Deploy
```

**Time**: ~10 minutes (after narratives exist)

---

## Advanced: Custom Voice Selection

### Override Default Voice

```python
# In generate_narrative_audio.py

# Option 1: Different voice per narrative
NARRATIVE_VOICE_OVERRIDE = {
    "contemplar": "co_male_1",      # Keep default
    "vislumbrar": "ar_female_1",    # Override: Use Argentine instead of Mexican
}

voice_id = NARRATIVE_VOICE_OVERRIDE.get(verb, VERB_VOICES.get(verb, "us_female_1"))
```

**Use cases**:
- Character voices (narrator vs. protagonist)
- Emotional tone (somber vs. cheerful narrator)
- Regional variation (Andean vs. Caribbean setting)

---

## Success Criteria

✅ **Generation**: 18 audio files created (3 parts × 6 narratives)
✅ **Metadata**: narratives section in audio_metadata.json
✅ **Component**: Audio buttons visible on each part
✅ **Playback**: Clicking button plays correct audio
✅ **Visual**: Pulse animation during playback
✅ **Consistency**: Same voice for verb + examples + narrative
✅ **Performance**: <100ms audio start time
✅ **Deployment**: Audio files on GitHub Pages

---

## Quick Reference: Audio Button HTML

```html
<button class="part-audio-button"
        data-audio="assets/audio/narratives/contemplar_part_1.mp3"
        data-part="0"
        aria-label="Escuchar Parte 1"
        title="Escuchar narración">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
</button>
```

**CSS Class States**:
- Default: `.part-audio-button`
- Hover: `:hover` state (scale 1.1)
- Playing: `.part-audio-button.playing` (pulse animation)

---

*Audio integration adds immersive audiobook experience to narratives while maintaining elegant design conventions and voice consistency.*
