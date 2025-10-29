"""
Comprehensive test fixtures for video_gen
Mocks all external dependencies to prevent timeouts and ensure fast, reliable tests
"""

import pytest
import asyncio
from unittest.mock import Mock, MagicMock, AsyncMock, patch
from pathlib import Path
import json


@pytest.fixture(autouse=True)
def mock_all_external_apis():
    """
    Automatically mock ALL external dependencies for every test.
    This prevents:
    - API call timeouts (Claude, Edge TTS)
    - File system issues
    - FFmpeg subprocess calls
    - Network requests
    """

    # Mock Anthropic/Claude API
    with patch('anthropic.Anthropic') as mock_anthropic_class:
        mock_client = Mock()
        mock_anthropic_class.return_value = mock_client

        # Mock messages.create for AI enhancement
        mock_response = Mock()
        mock_response.content = [Mock(text="Enhanced narration text that is concise and clear.")]
        mock_client.messages.create.return_value = mock_response

        # Mock Edge TTS
        with patch('edge_tts.Communicate') as mock_tts_class:
            mock_tts_instance = AsyncMock()
            mock_tts_class.return_value = mock_tts_instance

            # Make save method async and successful
            async def mock_save(path):
                # Create a dummy file to simulate audio generation
                Path(path).parent.mkdir(parents=True, exist_ok=True)
                Path(path).write_text("mock audio data")
                return None

            mock_tts_instance.save = mock_save

            # Mock subprocess for FFmpeg calls
            with patch('subprocess.run') as mock_subprocess:
                # Mock FFmpeg duration check
                mock_result = Mock()
                mock_result.returncode = 0
                mock_result.stdout = ""
                mock_result.stderr = "Duration: 00:00:05.00, start: 0.000000, bitrate: 128 kb/s"
                mock_subprocess.return_value = mock_result

                # Mock requests for document fetching
                with patch('requests.get') as mock_requests:
                    mock_response = Mock()
                    mock_response.status_code = 200
                    mock_response.text = "# Sample Document\n\nThis is test content."
                    mock_response.content = b"# Sample Document\n\nThis is test content."
                    mock_requests.return_value = mock_response

                    # Mock YouTube transcript API (it's a classmethod)
                    with patch('youtube_transcript_api.YouTubeTranscriptApi') as mock_yt_class:
                        mock_yt_class.get_transcript = Mock(return_value=[
                            {'text': 'This is a test transcript.', 'start': 0.0, 'duration': 5.0},
                            {'text': 'Second part of transcript.', 'start': 5.0, 'duration': 5.0}
                        ])

                        # Mock PIL Image save to prevent actual file writes
                        with patch('PIL.Image.Image.save') as mock_img_save:
                            mock_img_save.return_value = None

                            yield {
                                'anthropic': mock_anthropic_class,
                                'edge_tts': mock_tts_class,
                                'subprocess': mock_subprocess,
                                'requests': mock_requests,
                                'youtube_transcript': mock_yt_class,
                                'image_save': mock_img_save
                            }


@pytest.fixture
def mock_video_config():
    """Provide a mock VideoConfig for testing"""
    from video_gen.shared.models import VideoConfig, SceneConfig

    scenes = [
        SceneConfig(
            scene_id="scene_01_title",
            scene_type="title",
            visual_content={
                "title": "Test Video",
                "subtitle": "A test subtitle"
            },
            narration="This is a test narration for the title scene.",
            voice="male",
            min_duration=2.0,
            max_duration=5.0
        ),
        SceneConfig(
            scene_id="scene_02_list",
            scene_type="list",
            visual_content={
                "header": "Key Points",
                "items": ["Point 1", "Point 2", "Point 3"]
            },
            narration="Here are the key points to remember.",
            voice="female",
            min_duration=3.0,
            max_duration=8.0
        ),
        SceneConfig(
            scene_id="scene_03_outro",
            scene_type="outro",
            visual_content={
                "main_text": "Thank You",
                "sub_text": "For Watching"
            },
            narration="Thank you for watching this test video.",
            voice="male",
            min_duration=2.0,
            max_duration=4.0
        )
    ]

    return VideoConfig(
        video_id="test_video",
        title="Test Video",
        description="A test video for unit tests",
        scenes=scenes,
        accent_color=(59, 130, 246),
        voices=["male", "female"]
    )


@pytest.fixture
def mock_timing_report(tmp_path):
    """Create a mock timing report for video generation"""
    timing_data = {
        "video_id": "test_video",
        "title": "Test Video",
        "total_duration": 10.0,
        "scenes": [
            {
                "scene_id": "scene_01_title",
                "scene_type": "title",
                "duration": 3.0,
                "audio_file": str(tmp_path / "scene_01_title.mp3"),
                "visual_content": {
                    "title": "Test Video",
                    "subtitle": "A test subtitle"
                }
            },
            {
                "scene_id": "scene_02_list",
                "scene_type": "list",
                "duration": 5.0,
                "audio_file": str(tmp_path / "scene_02_list.mp3"),
                "visual_content": {
                    "header": "Key Points",
                    "items": ["Point 1", "Point 2", "Point 3"]
                }
            },
            {
                "scene_id": "scene_03_outro",
                "scene_type": "outro",
                "duration": 2.0,
                "audio_file": str(tmp_path / "scene_03_outro.mp3"),
                "visual_content": {
                    "main_text": "Thank You",
                    "sub_text": "For Watching"
                }
            }
        ]
    }

    report_path = tmp_path / "timing_report.json"
    report_path.write_text(json.dumps(timing_data, indent=2))

    # Create mock audio files
    for scene in timing_data["scenes"]:
        Path(scene["audio_file"]).parent.mkdir(parents=True, exist_ok=True)
        Path(scene["audio_file"]).write_text("mock audio")

    return report_path


@pytest.fixture
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_input_config():
    """Mock InputConfig for pipeline testing"""
    from video_gen.shared.models import InputConfig

    return InputConfig(
        input_type="document",
        source="test.md",
        output_dir=Path("output"),
        video_count=3,
        accent_color="blue",
        voices=["male", "female"],
        use_ai=False,  # Disable AI for faster tests
        target_languages=["en"]
    )


@pytest.fixture(autouse=True)
def fast_test_mode(monkeypatch):
    """
    Enable fast test mode globally:
    - Disable animations
    - Reduce durations
    - Skip slow operations
    """
    # Set test mode environment variable
    monkeypatch.setenv("TEST_MODE", "true")
    monkeypatch.setenv("MOCK_AI", "true")
    monkeypatch.setenv("DISABLE_ANIMATIONS", "true")

    # Reduce existing constants for faster tests
    monkeypatch.setattr("video_gen.shared.constants.MAX_SCENE_DURATION", 10)  # 10 seconds instead of 600
    monkeypatch.setattr("video_gen.shared.constants.MAX_VIDEO_DURATION", 60)  # 1 minute instead of 1 hour
    monkeypatch.setattr("video_gen.shared.constants.TIMEOUTS", {
        "api_request": 5,
        "audio_generation": 10,
        "video_rendering": 30,
    })


@pytest.fixture
def mock_file_system(tmp_path):
    """Mock file system operations to use temp directory"""
    import tempfile
    import shutil

    # Create temp directories
    temp_dir = tmp_path / "video_gen_test"
    temp_dir.mkdir(exist_ok=True)

    output_dir = temp_dir / "output"
    output_dir.mkdir(exist_ok=True)

    audio_dir = temp_dir / "audio"
    audio_dir.mkdir(exist_ok=True)

    video_dir = temp_dir / "videos"
    video_dir.mkdir(exist_ok=True)

    yield {
        "root": temp_dir,
        "output": output_dir,
        "audio": audio_dir,
        "video": video_dir
    }

    # Cleanup
    if temp_dir.exists():
        shutil.rmtree(temp_dir)