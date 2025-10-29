"""Base input adapter interface.

This module defines the abstract InputAdapter class that all input adapters
must implement for consistent content ingestion.
"""

from abc import ABC, abstractmethod
from typing import Any, Optional, Union
from pathlib import Path
from dataclasses import dataclass
import asyncio

from ..shared.models import VideoSet


@dataclass
class InputAdapterResult:
    """Result from an input adapter.

    Attributes:
        success: Whether adaptation succeeded
        video_set: Generated video set structure
        error: Error message if adaptation failed
        metadata: Additional adapter metadata
    """

    success: bool
    video_set: Optional[VideoSet] = None
    error: Optional[str] = None
    metadata: dict = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class InputAdapter(ABC):
    """Abstract base class for all input adapters.

    Input adapters convert various content sources (documents, YouTube videos,
    YAML files, etc.) into standardized VideoSet structures.

    Attributes:
        name: Adapter name
        description: Human-readable description
    """

    def __init__(self, name: str, description: str = ""):
        """Initialize the adapter.

        Args:
            name: Adapter name
            description: Adapter description
        """
        self.name = name
        self.description = description

    def parse(self, source: Union[str, Path], **kwargs) -> VideoSet:
        """
        Synchronous wrapper for adapt method.
        Provides backward compatibility with sync code.

        Args:
            source: Input source (file path, URL, etc.)
            **kwargs: Additional adapter-specific parameters

        Returns:
            VideoSet object ready for processing
        """
        # Get or create event loop
        try:
            loop = asyncio.get_running_loop()
            # If we're already in an async context, run in a new thread
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(asyncio.run, self.adapt(source, **kwargs))
                result = future.result()
        except RuntimeError:
            # No event loop running, we can create one
            result = asyncio.run(self.adapt(source, **kwargs))

        # Handle the result
        if isinstance(result, InputAdapterResult):
            if result.success and result.video_set:
                return result.video_set
            else:
                raise ValueError(f"Adapter failed: {result.error}")
        elif isinstance(result, VideoSet):
            return result
        else:
            raise TypeError(f"Unexpected result type: {type(result)}")

    @abstractmethod
    async def adapt(self, source: Any, **kwargs) -> InputAdapterResult:
        """Adapt input source to VideoSet structure.

        This method must be implemented by all concrete adapter classes.

        Args:
            source: Input source (path, URL, data, etc.)
            **kwargs: Additional adapter-specific parameters

        Returns:
            Adaptation result with VideoSet
        """

    async def validate_source(self, source: Any) -> bool:
        """Validate that the input source is compatible with this adapter.

        Override this method to perform custom validation.

        Args:
            source: Input source to validate

        Returns:
            True if valid, False otherwise
        """
        return True

    def supports_format(self, format_type: str) -> bool:
        """Check if this adapter supports a specific format.

        Override this method to specify supported formats.

        Args:
            format_type: Format type to check

        Returns:
            True if supported, False otherwise
        """
        return False

    def __repr__(self) -> str:
        """String representation of the adapter."""
        return f"{self.__class__.__name__}(name={self.name})"
