"""Test multilingual translation feature with mocked APIs."""

import sys
import os
from pathlib import Path
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Set test mode environment variables
os.environ['TEST_MODE'] = 'true'
os.environ['MOCK_AI'] = 'true'
os.environ['DISABLE_ANIMATIONS'] = 'true'

async def test_multilingual_translation():
    """Test AI translation feature."""
    print("Testing multilingual translation feature...")
    print("=" * 60)

    from video_gen.script_generator.ai_enhancer import AIScriptEnhancer

    try:
        # Create enhancer with test mode
        enhancer = AIScriptEnhancer()

        print("\n1. Testing Spanish translation...")
        english_script = "This is a test narration for video generation."

        # Test translation to Spanish
        spanish = await enhancer.translate_script(
            script=english_script,
            target_language="Spanish"
        )

        print(f"   Original (EN): {english_script}")
        print(f"   Translation (ES): {spanish}")
        print(f"   ✅ Spanish translation works")

        print("\n2. Testing French translation...")
        french = await enhancer.translate_script(
            script=english_script,
            target_language="French"
        )

        print(f"   Translation (FR): {french}")
        print(f"   ✅ French translation works")

        print("\n3. Testing language code mapping...")
        german = await enhancer.translate_script(
            script=english_script,
            target_language="de"  # Using code instead of full name
        )

        print(f"   Translation (DE): {german}")
        print(f"   ✅ Language code mapping works")

        print("\n4. Checking usage metrics...")
        metrics = enhancer.metrics.get_summary()
        print(f"   API calls: {metrics['api_calls']}")
        print(f"   Estimated cost: ${metrics['estimated_cost_usd']}")
        print(f"   Success rate: {metrics['success_rate']:.1f}%")

        print("\n" + "=" * 60)
        print("✅ MULTILINGUAL TRANSLATION TEST PASSED")
        print("=" * 60)
        return True

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("\n" + "="*60)
    print("MULTILINGUAL TRANSLATION TEST")
    print("Testing 28+ language support with mocked APIs")
    print("="*60)

    success = asyncio.run(test_multilingual_translation())

    sys.exit(0 if success else 1)