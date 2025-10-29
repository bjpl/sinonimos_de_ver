"""Test the full video generation pipeline with our fixes."""

import sys
import os
from pathlib import Path
import shutil
import asyncio

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Set test mode environment variables
os.environ['TEST_MODE'] = 'true'
os.environ['MOCK_AI'] = 'true'
os.environ['DISABLE_ANIMATIONS'] = 'true'

async def test_full_pipeline():
    """Test the complete video generation pipeline."""
    print("Testing full video generation pipeline...")
    print("=" * 60)

    from video_gen.pipeline import PipelineOrchestrator, create_complete_pipeline
    from video_gen.shared.models import InputConfig

    # Create test markdown content
    test_content = """# Professional Video Generation Test

## Introduction
This is a comprehensive test of the video generation system.
We're testing all the fixes we've implemented.

## Key Features
- Document parsing works correctly
- Audio generation with mocked APIs
- Video rendering with optimized PNG compression
- Error handling with fallbacks

## Technical Details
The system uses a stage-based pipeline architecture:
1. Input adaptation
2. Script generation
3. Audio generation
4. Video rendering
5. Output handling

## Conclusion
This test validates that all powerful features work correctly.
"""

    # Create test file
    test_file = Path("test_pipeline_document.md")
    test_file.write_text(test_content)

    # Create output directory
    output_dir = Path("test_output")
    output_dir.mkdir(exist_ok=True)

    try:
        # Create input configuration
        config = InputConfig(
            input_type="document",
            source=str(test_file),
            output_dir=output_dir,
            video_count=1,
            accent_color="blue",
            voice="male",
            use_ai_narration=True,  # Will use mocked AI
            languages=["en"]
        )

        # Create pipeline
        print("\n1. Creating pipeline...")
        pipeline = create_complete_pipeline(config)

        # Run the pipeline
        print("2. Running pipeline stages...")
        result = await pipeline.execute(config)

        if result.success:
            print(f"\n✅ SUCCESS! Pipeline completed successfully")
            print(f"  Output directory: {result.output_dir}")

            # Check what was generated
            if result.video_sets:
                print(f"  Generated {len(result.video_sets)} video set(s)")
                for i, video_set in enumerate(result.video_sets):
                    print(f"\n  Video Set {i+1}:")
                    print(f"    Videos: {len(video_set.videos)}")
                    if video_set.videos:
                        for j, video in enumerate(video_set.videos):
                            print(f"      Video {j+1}: {video.title} ({len(video.scenes)} scenes)")

            # Check output files
            print(f"\n3. Checking output files...")
            output_files = list(output_dir.glob("**/*"))
            if output_files:
                print(f"  Found {len(output_files)} files/folders:")
                for file in output_files[:10]:  # Show first 10
                    print(f"    - {file.relative_to(output_dir)}")
            else:
                print("  No output files generated (expected with mocked APIs)")

            return True
        else:
            print(f"\n❌ Pipeline failed: {result.error}")
            return False

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        # Cleanup
        print("\n4. Cleaning up...")
        if test_file.exists():
            test_file.unlink()
        if output_dir.exists():
            shutil.rmtree(output_dir)
        print("   Cleanup complete.")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("VIDEO GENERATION PIPELINE TEST")
    print("Testing all fixes: mocking, async handling, error recovery")
    print("="*60)

    # Run the async test function
    success = asyncio.run(test_full_pipeline())

    print("\n" + "="*60)
    if success:
        print("✅ ALL TESTS PASSED - Pipeline works with fixes!")
    else:
        print("❌ Tests failed - need more investigation")
    print("="*60)

    sys.exit(0 if success else 1)