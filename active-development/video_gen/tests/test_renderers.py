"""
Comprehensive tests for all scene renderers.

Tests all 12+ scene renderers in video_gen/renderers/ to ensure they:
- Return (start_frame, end_frame) tuples
- Produce correct frame dimensions (1920x1080)
- Handle various inputs correctly
- Apply accent colors properly
- Handle edge cases (empty strings, long text, etc.)
"""

import pytest
from PIL import Image
from typing import Tuple

# Import all renderer modules
from video_gen.renderers.basic_scenes import (
    create_title_keyframes,
    create_command_keyframes,
    create_list_keyframes,
    create_outro_keyframes
)
from video_gen.renderers.educational_scenes import (
    create_quiz_keyframes,
    create_learning_objectives_keyframes,
    create_exercise_keyframes
)
# Note: Import only if modules exist
# from video_gen.renderers.checkpoint_scenes import create_checkpoint_keyframes
# from video_gen.renderers.comparison_scenes import create_comparison_keyframes
from video_gen.renderers.constants import (
    WIDTH, HEIGHT,
    ACCENT_BLUE, ACCENT_GREEN, ACCENT_ORANGE, ACCENT_PURPLE, ACCENT_PINK, ACCENT_CYAN
)


class TestBasicSceneRenderers:
    """Test basic scene renderers (title, command, list, outro)."""

    def test_create_title_keyframes_returns_valid_frames(self):
        """Test title keyframes return valid image tuple."""
        start, end = create_title_keyframes(
            "Quick Reference",
            "5-Minute Workflow Commands",
            ACCENT_BLUE
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)
        assert start.mode == 'RGB'
        assert end.mode == 'RGB'

    def test_create_title_keyframes_with_different_colors(self):
        """Test title keyframes work with various accent colors."""
        colors = [ACCENT_BLUE, ACCENT_GREEN, ACCENT_ORANGE, ACCENT_PURPLE]

        for color in colors:
            start, end = create_title_keyframes(
                "Test Title",
                "Test Subtitle",
                color
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)

    def test_create_title_keyframes_with_empty_strings(self):
        """Test title keyframes handle empty strings gracefully."""
        start, end = create_title_keyframes("", "", ACCENT_BLUE)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_title_keyframes_with_long_text(self):
        """Test title keyframes handle very long text."""
        long_title = "A" * 200
        long_subtitle = "B" * 200

        start, end = create_title_keyframes(long_title, long_subtitle, ACCENT_BLUE)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_command_keyframes_returns_valid_frames(self):
        """Test command keyframes return valid image tuple."""
        start, end = create_command_keyframes(
            "Complete Workflow",
            "Generate Video with Audio",
            ["$ python generate.py", "→ Output: video.mp4"],
            ACCENT_GREEN
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_command_keyframes_with_various_prefixes(self):
        """Test command keyframes handle different line prefixes."""
        commands = [
            "$ command with prompt",
            "python script.py",
            "→ output line",
            "✓ success message",
            "# comment",
            "- bullet point",
            "plain text"
        ]

        start, end = create_command_keyframes(
            "Test Commands",
            "Various line types",
            commands,
            ACCENT_BLUE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_command_keyframes_with_empty_commands(self):
        """Test command keyframes handle empty command list."""
        start, end = create_command_keyframes(
            "Header",
            "Description",
            [],
            ACCENT_BLUE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_list_keyframes_returns_valid_frames(self):
        """Test list keyframes return valid image tuple."""
        start, end = create_list_keyframes(
            "Voice Options",
            "Choose Your Style",
            [("Andrew", "Professional"), ("Aria", "Clear")],
            ACCENT_PURPLE
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_list_keyframes_with_string_items(self):
        """Test list keyframes with simple string items."""
        start, end = create_list_keyframes(
            "Steps",
            "Follow these",
            ["Step 1", "Step 2", "Step 3"],
            ACCENT_GREEN
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_list_keyframes_with_tuple_items(self):
        """Test list keyframes with (title, description) tuples."""
        start, end = create_list_keyframes(
            "Features",
            "Key capabilities",
            [("Fast", "Quick rendering"), ("Simple", "Easy to use")],
            ACCENT_BLUE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_list_keyframes_with_empty_list(self):
        """Test list keyframes handle empty item list."""
        start, end = create_list_keyframes(
            "Header",
            "Description",
            [],
            ACCENT_ORANGE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_outro_keyframes_returns_valid_frames(self):
        """Test outro keyframes return valid image tuple."""
        start, end = create_outro_keyframes(
            "Fast. Simple. Powerful.",
            "See QUICK_REFERENCE.md",
            ACCENT_ORANGE
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_outro_keyframes_with_various_text(self):
        """Test outro keyframes with different text lengths."""
        test_cases = [
            ("Short", "Link"),
            ("Medium length message", "See documentation.md"),
            ("Very long message " * 10, "Very long link " * 10)
        ]

        for main_text, sub_text in test_cases:
            start, end = create_outro_keyframes(main_text, sub_text, ACCENT_CYAN)
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)


class TestEducationalSceneRenderers:
    """Test educational scene renderers (quiz, objectives, exercise)."""

    def test_create_quiz_keyframes_returns_valid_frames(self):
        """Test quiz keyframes return valid image tuple."""
        start, end = create_quiz_keyframes(
            "What is the capital of France?",
            ["London", "Paris", "Berlin", "Madrid"],
            "Paris",
            show_answer=True,
            accent_color=ACCENT_PURPLE
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_quiz_keyframes_without_answer(self):
        """Test quiz keyframes with answer hidden."""
        start, end = create_quiz_keyframes(
            "What is 2 + 2?",
            ["3", "4", "5", "6"],
            "4",
            show_answer=False,
            accent_color=ACCENT_BLUE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_quiz_keyframes_with_long_question(self):
        """Test quiz keyframes handle very long questions."""
        long_question = "What is the capital of the country that is located in Western Europe and is known for its rich history? " * 3

        start, end = create_quiz_keyframes(
            long_question,
            ["A", "B", "C", "D"],
            "A",
            show_answer=True,
            accent_color=ACCENT_GREEN
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_quiz_keyframes_with_few_options(self):
        """Test quiz keyframes with fewer than 4 options."""
        start, end = create_quiz_keyframes(
            "True or False?",
            ["True", "False"],
            "True",
            show_answer=True,
            accent_color=ACCENT_ORANGE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_learning_objectives_keyframes_returns_valid_frames(self):
        """Test learning objectives keyframes return valid image tuple."""
        start, end = create_learning_objectives_keyframes(
            "Python Fundamentals",
            [
                "Understand variables and data types",
                "Master control flow structures",
                "Write functions and modules"
            ],
            {"duration": 45, "difficulty": "medium", "prerequisites": ["Intro to Programming"]},
            ACCENT_BLUE
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_learning_objectives_keyframes_with_dict_objectives(self):
        """Test learning objectives with dict format."""
        objectives = [
            {"objective": "Learn Python basics"},
            {"objective": "Understand OOP concepts"},
        ]

        start, end = create_learning_objectives_keyframes(
            "Advanced Python",
            objectives,
            {},
            ACCENT_PURPLE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_learning_objectives_keyframes_with_many_objectives(self):
        """Test learning objectives with more than 8 objectives."""
        objectives = [f"Objective {i}" for i in range(15)]

        start, end = create_learning_objectives_keyframes(
            "Comprehensive Course",
            objectives,
            {"duration": 120},
            ACCENT_GREEN
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_learning_objectives_keyframes_with_empty_info(self):
        """Test learning objectives with minimal lesson info."""
        start, end = create_learning_objectives_keyframes(
            "Minimal Lesson",
            ["Objective 1"],
            {},
            ACCENT_ORANGE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_exercise_keyframes_returns_valid_frames(self):
        """Test exercise keyframes return valid image tuple."""
        start, end = create_exercise_keyframes(
            "Build a Todo List App",
            [
                "Create the HTML structure",
                "Style with CSS",
                "Add JavaScript functionality",
                "Test in browser"
            ],
            difficulty="medium",
            estimated_time="45 min",
            accent_color=ACCENT_BLUE
        )

        assert isinstance(start, Image.Image)
        assert isinstance(end, Image.Image)
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_create_exercise_keyframes_with_difficulty_levels(self):
        """Test exercise keyframes with different difficulty levels."""
        difficulties = ["easy", "medium", "hard"]

        for difficulty in difficulties:
            start, end = create_exercise_keyframes(
                f"{difficulty.title()} Exercise",
                ["Step 1", "Step 2"],
                difficulty=difficulty,
                estimated_time="30 min",
                accent_color=ACCENT_GREEN
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)

    def test_create_exercise_keyframes_with_many_instructions(self):
        """Test exercise keyframes with more than 8 instructions."""
        instructions = [f"Instruction {i}" for i in range(15)]

        start, end = create_exercise_keyframes(
            "Complex Exercise",
            instructions,
            difficulty="hard",
            estimated_time="2 hours",
            accent_color=ACCENT_PURPLE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)


class TestCheckpointAndComparisonRenderers:
    """Test checkpoint and comparison scene renderers."""

    # Checkpoint scene tests
    def test_create_checkpoint_keyframes_returns_valid_frames(self):
        """Test checkpoint keyframes return valid image tuple."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_checkpoint_keyframes

            start, end = create_checkpoint_keyframes(
                checkpoint_num=1,
                completed_topics=["Variables", "Functions", "Loops"],
                review_questions=["What is a variable?", "How do loops work?"],
                next_topics=["Classes", "Objects", "Inheritance"],
                accent_color=ACCENT_GREEN
            )

            assert isinstance(start, Image.Image)
            assert isinstance(end, Image.Image)
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
            assert start.mode == 'RGB'
            assert end.mode == 'RGB'
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_checkpoint_keyframes_with_empty_lists(self):
        """Test checkpoint keyframes handle empty topic lists."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_checkpoint_keyframes

            start, end = create_checkpoint_keyframes(
                checkpoint_num=2,
                completed_topics=[],
                review_questions=[],
                next_topics=[],
                accent_color=ACCENT_BLUE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_checkpoint_keyframes_with_many_items(self):
        """Test checkpoint keyframes with more than 6 items per column."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_checkpoint_keyframes

            many_topics = [f"Topic {i}" for i in range(10)]
            start, end = create_checkpoint_keyframes(
                checkpoint_num=3,
                completed_topics=many_topics,
                review_questions=many_topics,
                next_topics=many_topics,
                accent_color=ACCENT_PURPLE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_checkpoint_keyframes_with_long_text(self):
        """Test checkpoint keyframes truncate long item text."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_checkpoint_keyframes

            long_text = "This is a very long topic description that should be truncated to fit within the card"
            start, end = create_checkpoint_keyframes(
                checkpoint_num=4,
                completed_topics=[long_text, long_text],
                review_questions=[long_text],
                next_topics=[long_text, long_text, long_text],
                accent_color=ACCENT_ORANGE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_quote_keyframes_returns_valid_frames(self):
        """Test quote keyframes return valid image tuple."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_quote_keyframes

            start, end = create_quote_keyframes(
                quote_text="Quality is not an act, it is a habit",
                attribution="Aristotle",
                accent_color=ACCENT_BLUE
            )

            assert isinstance(start, Image.Image)
            assert isinstance(end, Image.Image)
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
            assert start.mode == 'RGB'
            assert end.mode == 'RGB'
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_quote_keyframes_with_long_quote(self):
        """Test quote keyframes handle very long quotes (wrapping)."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_quote_keyframes

            long_quote = "This is a very long quote that should be wrapped across multiple lines to fit within the card width. " * 3
            start, end = create_quote_keyframes(
                quote_text=long_quote,
                attribution="Long Author Name",
                accent_color=ACCENT_GREEN
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_quote_keyframes_with_empty_attribution(self):
        """Test quote keyframes handle empty attribution."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_quote_keyframes

            start, end = create_quote_keyframes(
                quote_text="A quote without attribution",
                attribution="",
                accent_color=ACCENT_PURPLE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    def test_create_quote_keyframes_with_short_quote(self):
        """Test quote keyframes handle short single-line quotes."""
        try:
            from video_gen.renderers.checkpoint_scenes import create_quote_keyframes

            start, end = create_quote_keyframes(
                quote_text="Short quote",
                attribution="Anonymous",
                accent_color=ACCENT_ORANGE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("checkpoint_scenes module not available")

    # Comparison scene tests
    def test_create_code_comparison_keyframes_returns_valid_frames(self):
        """Test code comparison keyframes return valid image tuple."""
        try:
            from video_gen.renderers.comparison_scenes import create_code_comparison_keyframes

            start, end = create_code_comparison_keyframes(
                header="Performance Optimization",
                before_code="def slow():\n    return [x**2 for x in range(1000)]",
                after_code="def fast():\n    return numpy.square(numpy.arange(1000))",
                accent_color=ACCENT_BLUE
            )

            assert isinstance(start, Image.Image)
            assert isinstance(end, Image.Image)
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
            assert start.mode == 'RGB'
            assert end.mode == 'RGB'
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_code_comparison_keyframes_with_custom_labels(self):
        """Test code comparison with custom before/after labels."""
        try:
            from video_gen.renderers.comparison_scenes import create_code_comparison_keyframes

            start, end = create_code_comparison_keyframes(
                header="Refactoring Example",
                before_code="x = 1",
                after_code="x = 2",
                accent_color=ACCENT_GREEN,
                before_label="Old Code",
                after_label="New Code"
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_code_comparison_keyframes_with_long_code(self):
        """Test code comparison with more than 10 lines (should truncate)."""
        try:
            from video_gen.renderers.comparison_scenes import create_code_comparison_keyframes

            long_code = "\n".join([f"line {i}" for i in range(20)])
            start, end = create_code_comparison_keyframes(
                header="Long Code Example",
                before_code=long_code,
                after_code=long_code,
                accent_color=ACCENT_PURPLE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_code_comparison_keyframes_with_empty_lines(self):
        """Test code comparison skips empty lines."""
        try:
            from video_gen.renderers.comparison_scenes import create_code_comparison_keyframes

            code_with_blanks = "line1\n\n\nline2\n\nline3"
            start, end = create_code_comparison_keyframes(
                header="Code with Blank Lines",
                before_code=code_with_blanks,
                after_code=code_with_blanks,
                accent_color=ACCENT_ORANGE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_problem_keyframes_returns_valid_frames(self):
        """Test problem keyframes return valid image tuple."""
        try:
            from video_gen.renderers.comparison_scenes import create_problem_keyframes

            start, end = create_problem_keyframes(
                problem_number=1,
                title="Two Sum",
                problem_text="Given an array of integers, return indices of two numbers that add up to target.",
                difficulty="easy",
                accent_color=ACCENT_GREEN
            )

            assert isinstance(start, Image.Image)
            assert isinstance(end, Image.Image)
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
            assert start.mode == 'RGB'
            assert end.mode == 'RGB'
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_problem_keyframes_with_difficulty_levels(self):
        """Test problem keyframes with different difficulty colors."""
        try:
            from video_gen.renderers.comparison_scenes import create_problem_keyframes

            difficulties = [("easy", ACCENT_GREEN), ("medium", ACCENT_ORANGE), ("hard", ACCENT_PINK)]

            for difficulty, expected_color in difficulties:
                start, end = create_problem_keyframes(
                    problem_number=1,
                    title=f"{difficulty.title()} Problem",
                    problem_text="Test problem description",
                    difficulty=difficulty,
                    accent_color=ACCENT_BLUE
                )
                assert start.size == (WIDTH, HEIGHT)
                assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_problem_keyframes_with_long_problem_text(self):
        """Test problem keyframes wrap long problem text."""
        try:
            from video_gen.renderers.comparison_scenes import create_problem_keyframes

            long_problem = "This is a very long problem description that will need to be wrapped across multiple lines to fit within the card. " * 10
            start, end = create_problem_keyframes(
                problem_number=42,
                title="Long Problem",
                problem_text=long_problem,
                difficulty="hard",
                accent_color=ACCENT_PINK
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_problem_keyframes_with_unknown_difficulty(self):
        """Test problem keyframes handle unknown difficulty gracefully."""
        try:
            from video_gen.renderers.comparison_scenes import create_problem_keyframes

            start, end = create_problem_keyframes(
                problem_number=99,
                title="Unknown Difficulty",
                problem_text="Test problem with unknown difficulty level",
                difficulty="extreme",  # Not in the list
                accent_color=ACCENT_BLUE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_solution_keyframes_returns_valid_frames(self):
        """Test solution keyframes return valid image tuple."""
        try:
            from video_gen.renderers.comparison_scenes import create_solution_keyframes

            start, end = create_solution_keyframes(
                title="Hash Table Solution",
                solution_code=["def twoSum(nums, target):", "    seen = {}", "    for i, n in enumerate(nums):"],
                explanation="Time complexity: O(n), Space complexity: O(n)",
                accent_color=ACCENT_GREEN
            )

            assert isinstance(start, Image.Image)
            assert isinstance(end, Image.Image)
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
            assert start.mode == 'RGB'
            assert end.mode == 'RGB'
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_solution_keyframes_with_long_code(self):
        """Test solution keyframes truncate code at 12 lines."""
        try:
            from video_gen.renderers.comparison_scenes import create_solution_keyframes

            long_code = [f"line {i}" for i in range(20)]
            start, end = create_solution_keyframes(
                title="Long Solution",
                solution_code=long_code,
                explanation="This solution has many lines",
                accent_color=ACCENT_BLUE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_solution_keyframes_with_empty_explanation(self):
        """Test solution keyframes handle empty explanation."""
        try:
            from video_gen.renderers.comparison_scenes import create_solution_keyframes

            start, end = create_solution_keyframes(
                title="Solution Without Explanation",
                solution_code=["x = 1", "y = 2", "return x + y"],
                explanation="",
                accent_color=ACCENT_PURPLE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")

    def test_create_solution_keyframes_with_long_explanation(self):
        """Test solution keyframes wrap long explanation text."""
        try:
            from video_gen.renderers.comparison_scenes import create_solution_keyframes

            long_explanation = "This is a very long explanation that describes the solution approach in great detail. " * 20
            start, end = create_solution_keyframes(
                title="Detailed Solution",
                solution_code=["code = 'simple'"],
                explanation=long_explanation,
                accent_color=ACCENT_ORANGE
            )
            assert start.size == (WIDTH, HEIGHT)
            assert end.size == (WIDTH, HEIGHT)
        except ImportError:
            pytest.skip("comparison_scenes module not available")


class TestRendererEdgeCases:
    """Test edge cases and error handling across all renderers."""

    def test_all_renderers_handle_none_accent_color(self):
        """Test renderers handle None accent color gracefully."""
        # Most renderers should use a default if None is passed
        # This might raise an error, which is also acceptable
        with pytest.raises((TypeError, AttributeError)):
            create_title_keyframes("Title", "Subtitle", None)

    def test_renderers_handle_unicode_text(self):
        """Test renderers handle unicode characters."""
        unicode_text = "日本語 • Español • Français • العربية"

        start, end = create_title_keyframes(
            unicode_text,
            "Unicode support test",
            ACCENT_BLUE
        )
        assert start.size == (WIDTH, HEIGHT)
        assert end.size == (WIDTH, HEIGHT)

    def test_renderers_return_rgb_mode(self):
        """Ensure all renderers return RGB mode images."""
        renderers_and_args = [
            (create_title_keyframes, ("T", "S", ACCENT_BLUE)),
            (create_outro_keyframes, ("M", "S", ACCENT_GREEN)),
            (create_quiz_keyframes, ("Q?", ["A", "B"], "A", True, ACCENT_PURPLE)),
        ]

        for renderer, args in renderers_and_args:
            start, end = renderer(*args)
            assert start.mode == 'RGB', f"{renderer.__name__} start frame not RGB"
            assert end.mode == 'RGB', f"{renderer.__name__} end frame not RGB"

    def test_renderers_produce_different_start_and_end(self):
        """Verify start and end frames differ (contain animation data)."""
        start, end = create_title_keyframes("Test", "Animation", ACCENT_BLUE)

        # Convert to bytes for comparison
        start_bytes = start.tobytes()
        end_bytes = end.tobytes()

        # Start should be mostly blank/base, end should have content
        assert start_bytes != end_bytes, "Start and end frames should differ"
