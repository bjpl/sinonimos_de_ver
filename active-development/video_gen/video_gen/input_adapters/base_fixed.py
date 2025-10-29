"""
Base adapter interface for all input adapters.
Fixed version with proper async/sync handling.
"""

import asyncio
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional, Union, Dict, Any
import logging

from ..shared.models import VideoSet, InputAdapterResult

logger = logging.getLogger(__name__)


class BaseAdapter(ABC):
    """
    Base class for all input adapters.
    Provides both sync and async interfaces with proper event loop handling.
    """

    def __init__(self, test_mode: bool = False):
        """
        Initialize base adapter.

        Args:
            test_mode: If True, use test-specific behavior (mocks, reduced durations, etc.)
        """
        self.test_mode = test_mode
        self.logger = logging.getLogger(self.__class__.__name__)

    def parse(self, source: Union[str, Path], **kwargs) -> VideoSet:
        """
        Synchronous wrapper for compatibility.
        Properly handles event loop creation and management.

        Args:
            source: Input source (file path, URL, etc.)
            **kwargs: Additional adapter-specific parameters

        Returns:
            VideoSet object ready for processing
        """
        # Try to get the current event loop
        try:
            loop = asyncio.get_running_loop()
            # If we're already in an async context, create a new thread
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(self._run_async_in_new_loop, source, **kwargs)
                return future.result()
        except RuntimeError:
            # No event loop running, we can create one
            return self._run_async_in_new_loop(source, **kwargs)

    def _run_async_in_new_loop(self, source: Union[str, Path], **kwargs) -> VideoSet:
        """
        Run async adapt method in a new event loop.
        """
        # Create new event loop for this thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            # Run the async adapt method
            result = loop.run_until_complete(self.adapt(source, **kwargs))

            # Extract VideoSet from result if needed
            if isinstance(result, InputAdapterResult):
                if result.success and result.video_set:
                    return result.video_set
                else:
                    raise ValueError(f"Adapter failed: {result.error}")
            elif isinstance(result, VideoSet):
                return result
            else:
                raise TypeError(f"Unexpected result type: {type(result)}")
        finally:
            # Clean up the event loop
            loop.close()

    async def adapt(
        self,
        source: Union[str, Path],
        **kwargs
    ) -> Union[InputAdapterResult, VideoSet]:
        """
        Asynchronous adaptation method.
        This is the main method that subclasses should implement.

        Args:
            source: Input source
            **kwargs: Additional parameters

        Returns:
            InputAdapterResult or VideoSet
        """
        try:
            # Validate source
            source = self._validate_source(source)

            # Perform adaptation (subclass implementation)
            video_set = await self._perform_adaptation(source, **kwargs)

            # Return result
            if self.test_mode:
                # In test mode, might return VideoSet directly for compatibility
                return video_set
            else:
                return InputAdapterResult(
                    success=True,
                    video_set=video_set,
                    metadata={"source": str(source)}
                )

        except Exception as e:
            self.logger.error(f"Adaptation failed: {e}", exc_info=True)
            if self.test_mode:
                # In test mode, might want to raise for debugging
                raise
            return InputAdapterResult(
                success=False,
                error=str(e),
                metadata={"source": str(source)}
            )

    def _validate_source(self, source: Union[str, Path]) -> Path:
        """
        Validate and normalize the input source.

        Args:
            source: Input source

        Returns:
            Normalized Path object

        Raises:
            ValueError: If source is invalid
        """
        if isinstance(source, str):
            source = Path(source)

        if not isinstance(source, Path):
            raise ValueError(f"Invalid source type: {type(source)}")

        # Check if file exists (for file-based adapters)
        if not source.exists() and not str(source).startswith(('http://', 'https://')):
            raise FileNotFoundError(f"Source file not found: {source}")

        return source

    @abstractmethod
    async def _perform_adaptation(
        self,
        source: Path,
        **kwargs
    ) -> VideoSet:
        """
        Perform the actual adaptation.
        Must be implemented by subclasses.

        Args:
            source: Validated source path
            **kwargs: Additional parameters

        Returns:
            VideoSet object
        """
        pass

    def __repr__(self):
        return f"{self.__class__.__name__}(test_mode={self.test_mode})"