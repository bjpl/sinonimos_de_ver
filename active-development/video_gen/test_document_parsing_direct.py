"""Direct test of document parsing with our fixes."""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Set test mode environment variables
os.environ['TEST_MODE'] = 'true'
os.environ['MOCK_AI'] = 'true'
os.environ['DISABLE_ANIMATIONS'] = 'true'

def test_document_parsing():
    """Test document parsing directly."""
    print("Testing document parsing with our fixes...")

    # Import the regular DocumentAdapter - now has parse method from base class
    from video_gen.input_adapters import DocumentAdapter
    print("Using standard DocumentAdapter with fixed parse method")

    # Create simple markdown content
    test_content = """# Test Video

## Introduction
This is a test document for video generation.

## Main Content
- Point 1: Testing document parsing
- Point 2: Verifying adapter functionality
- Point 3: Checking our fixes work

## Conclusion
The document parsing should work correctly with our mocked APIs.
"""

    # Create a temporary file
    test_file = Path("test_document.md")
    test_file.write_text(test_content)

    try:
        # Create adapter
        adapter = DocumentAdapter(test_mode=True)

        # Parse the document
        print(f"Parsing {test_file}...")
        result = adapter.parse(str(test_file))

        if hasattr(result, 'videos'):
            print(f"✅ Success! Generated {len(result.videos)} videos")
            for i, video in enumerate(result.videos):
                print(f"  Video {i+1}: {video.title} with {len(video.scenes)} scenes")
        else:
            print(f"✅ Success! Result type: {type(result)}")
            if hasattr(result, '__dict__'):
                print(f"  Attributes: {list(result.__dict__.keys())}")

        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        # Cleanup
        if test_file.exists():
            test_file.unlink()

if __name__ == "__main__":
    success = test_document_parsing()
    sys.exit(0 if success else 1)