#!/usr/bin/env python3
"""
Generate high-quality Spanish audio files using Microsoft Edge TTS
with multiple LATAM voices (male/female) for variety and authenticity
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

# Output directories
AUDIO_DIR = Path(__file__).parent.parent / "src" / "assets" / "audio"
VERBS_DIR = AUDIO_DIR / "verbs"
EXAMPLES_DIR = AUDIO_DIR / "examples"
METADATA_FILE = Path(__file__).parent.parent / "src" / "data" / "audio_metadata.json"

# Create directories
VERBS_DIR.mkdir(parents=True, exist_ok=True)
EXAMPLES_DIR.mkdir(parents=True, exist_ok=True)

# LATAM Spanish voices (Microsoft Edge TTS)
# Using variety of voices from different regions and genders
VOICES = {
    # Mexican voices
    "mx_female_1": "es-MX-DaliaNeural",      # Mexican female (warm)
    "mx_male_1": "es-MX-JorgeNeural",        # Mexican male (clear)

    # Colombian voices
    "co_female_1": "es-CO-SalomeNeural",     # Colombian female (gentle)
    "co_male_1": "es-CO-GonzaloNeural",      # Colombian male (professional)

    # Argentine voices
    "ar_female_1": "es-AR-ElenaNeural",      # Argentine female (expressive)
    "ar_male_1": "es-AR-TomasNeural",        # Argentine male (sophisticated)

    # US Spanish (neutral LATAM)
    "us_female_1": "es-US-PalomaNeural",     # US Spanish female (neutral)
    "us_male_1": "es-US-AlonsoNeural",       # US Spanish male (neutral)
}

# Map each verb to a specific voice for variety
# Using different voices and genders throughout
VERB_VOICE_MAPPING = {
    "observar": "mx_female_1",      # Mexican female
    "contemplar": "co_male_1",      # Colombian male
    "avistar": "ar_female_1",       # Argentine female
    "divisar": "mx_male_1",         # Mexican male
    "percibir": "co_female_1",      # Colombian female
    "advertir": "ar_male_1",        # Argentine male
    "notar": "us_female_1",         # Neutral female
    "vislumbrar": "mx_female_1",    # Mexican female
    "atisbar": "co_male_1",         # Colombian male
    "otear": "ar_female_1",         # Argentine female
    "acechar": "mx_male_1",         # Mexican male
    "columbrar": "us_male_1",       # Neutral male
    "constatar": "co_female_1",     # Colombian female
    "entrever": "ar_male_1",        # Argentine male
}

async def generate_audio(text, output_path, voice):
    """Generate audio file using Edge TTS"""
    communicate = edge_tts.Communicate(text, VOICES[voice])
    await communicate.save(output_path)
    print(f"✅ Generated: {output_path.name} ({voice})")

async def generate_all_audio():
    """Generate all audio files for verbs and examples"""

    # Load synonyms data
    synonyms_path = Path(__file__).parent.parent / "src" / "data" / "synonyms.json"
    with open(synonyms_path, 'r', encoding='utf-8') as f:
        synonyms = json.load(f)

    audio_metadata = {
        "verbs": {},
        "examples": {},
        "voices": {},
        "generatedAt": None
    }

    # Add voice metadata
    for voice_id, voice_name in VOICES.items():
        region = voice_id.split('_')[0].upper()
        gender = voice_id.split('_')[1]
        audio_metadata["voices"][voice_id] = {
            "name": voice_name,
            "region": region,
            "gender": gender
        }

    tasks = []

    print("🎙️  Generating audio files with multiple LATAM voices...\n")

    for synonym in synonyms:
        verb = synonym["verb"]
        voice_id = VERB_VOICE_MAPPING.get(verb, "us_female_1")

        # Generate verb pronunciation
        verb_file = VERBS_DIR / f"{verb}.mp3"
        tasks.append(generate_audio(verb, verb_file, voice_id))

        # Store metadata
        audio_metadata["verbs"][verb] = {
            "file": f"assets/audio/verbs/{verb}.mp3",
            "voice": voice_id,
            "text": verb
        }

        # Generate example pronunciations (use same voice as verb for consistency)
        audio_metadata["examples"][verb] = []

        for i, example in enumerate(synonym["examples"], 1):
            example_file = EXAMPLES_DIR / f"{verb}_example_{i}.mp3"
            tasks.append(generate_audio(example, example_file, voice_id))

            audio_metadata["examples"][verb].append({
                "file": f"assets/audio/examples/{verb}_example_{i}.mp3",
                "voice": voice_id,
                "text": example
            })

    # Execute all audio generation tasks
    await asyncio.gather(*tasks)

    # Save metadata
    from datetime import datetime
    audio_metadata["generatedAt"] = datetime.utcnow().isoformat()

    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(audio_metadata, f, indent=2, ensure_ascii=False)

    print(f"\n📝 Audio metadata saved to: {METADATA_FILE}")
    print(f"\n✨ Audio generation complete!")
    print(f"   - {len(synonyms)} verb pronunciations")
    print(f"   - {sum(len(s['examples']) for s in synonyms)} example pronunciations")
    print(f"   - {len(set(VERB_VOICE_MAPPING.values()))} different voices used")
    print(f"   - Multiple LATAM accents (Mexican, Colombian, Argentine, Neutral)")
    print(f"   - Both male and female voices")

async def list_available_voices():
    """List all available Spanish voices for reference"""
    print("\n🎤 Available Spanish voices in Edge TTS:\n")
    voices = await edge_tts.list_voices()
    spanish_voices = [v for v in voices if v['Locale'].startswith('es-')]

    for voice in spanish_voices:
        locale = voice['Locale']
        name = voice['ShortName']
        gender = voice['Gender']
        print(f"   {locale:8} | {gender:6} | {name}")
    print()

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--list-voices":
        asyncio.run(list_available_voices())
    else:
        asyncio.run(generate_all_audio())
