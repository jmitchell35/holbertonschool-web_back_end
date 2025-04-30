#!/usr/bin/env python3
"""
A module demonstrating asynchronous generators in Python.

This module provides utilities for generating asynchronous sequences of random
values.
"""

import asyncio
import random
from typing import Generator


async def async_generator() -> Generator[float, None, None]:  # type: ignore
    """
    Generate a sequence of random float values asynchronously.

    This coroutine function yields 10 random float values between 0 and 10,
    with a 1-second delay between each value.

    Returns:
        Generator[float, None, None]: An asynchronous generator yielding random
        floats.

    Example:
        >>> async for value in async_generator():
        ...     print(value)
    """
    for _ in range(10):
        await asyncio.sleep(1)
        yield random.uniform(0, 10)
