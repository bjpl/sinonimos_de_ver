#!/usr/bin/env python3
"""
Generate audio files for narrative experiences
Uses same voice as verb for consistency
"""

import asyncio
import json
import os
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Installing edge-tts...")
    os.system("pip install edge-tts")
    import edge_tts

# Directories
AUDIO_DIR = Path(__file__).parent.parent / "assets" / "audio"
NARRATIVES_DIR = AUDIO_DIR / "narratives"
DATA_DIR = Path(__file__).parent.parent / "data"

NARRATIVES_DIR.mkdir(parents=True, exist_ok=True)

# Voice mapping (matches existing system)
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

# Verb voice mapping (from existing audio_metadata.json)
VERB_VOICES = {
    "contemplar": "co_male_1",
    "vislumbrar": "mx_female_1",
    "atisbar": "co_male_1",
    "otear": "ar_female_1",
    "columbrar": "us_male_1",
    "entrever": "ar_male_1",
}

async def generate_audio(text, output_path, voice):
    """Generate audio file using Edge TTS"""
    communicate = edge_tts.Communicate(text, VOICES[voice])
    await communicate.save(output_path)
    print(f"✅ Generated: {output_path.name} ({voice})")

async def generate_narrative_audio():
    """Generate audio for all narrative parts"""

    # Load synonyms data
    synonyms_path = DATA_DIR / "synonyms.json"
    with open(synonyms_path, 'r', encoding='utf-8') as f:
        synonyms = json.load(f)

    # Load existing metadata
    metadata_path = DATA_DIR / "audio_metadata.json"
    with open(metadata_path, 'r', encoding='utf-8') as f:
        audio_metadata = json.load(f)

    # Add narratives section if not exists
    if "narratives" not in audio_metadata:
        audio_metadata["narratives"] = {}

    tasks = []
    narrative_count = 0

    print("🎙️  Generating narrative audio with LATAM voices...\n")

    for synonym in synonyms:
        verb = synonym["verb"]

        # Only process if has narrative
        if "narrativeExperience" not in synonym:
            continue

        narrative = synonym["narrativeExperience"]
        voice_id = VERB_VOICES.get(verb, "us_female_1")  # Use same voice as verb

        print(f"\n📖 {verb} - {narrative['title']}")
        print(f"   Voice: {voice_id} ({VOICES[voice_id]})")

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
                "duration": None  # To be calculated after generation
            })

        narrative_count += 1

    # Execute all audio generation tasks in parallel
    await asyncio.gather(*tasks)

    # Update metadata timestamp
    from datetime import datetime
    audio_metadata["generatedAt"] = datetime.utcnow().isoformat()

    # Save updated metadata
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(audio_metadata, f, indent=2, ensure_ascii=False)

    print(f"\n✨ Narrative audio generation complete!")
    print(f"   - {narrative_count} narratives processed")
    print(f"   - {len(tasks)} audio files generated")
    print(f"   - {len(set(VERB_VOICES.values()))} different voices used")
    print(f"\n📝 Metadata updated: {metadata_path}")

if __name__ == "__main__":
    asyncio.run(generate_narrative_audio())
