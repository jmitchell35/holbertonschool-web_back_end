#!/usr/bin/env python3
"""
Module for demonstrating async comprehensions with generators.

This module builds on the async_generator function to provide higher-level
asynchronous collection operations.
"""

from typing import List
async_generator = __import__('0-async_generator').async_generator


async def async_comprehension() -> List[float]:
    """
    Collect values from an async generator using async comprehension.

    This coroutine collects all values yielded by the async_generator into
    a list using async comprehension syntax, which provides a concise way to
    process asynchronous iterables.

    Returns:
        list[float]: A list containing all 10 random float values from the
                     async_generator.

    Example:
        >>> result = await async_comprehension()
        >>> print(len(result))  # Always 10
        10
    """
    return [value async for value in async_generator()]
