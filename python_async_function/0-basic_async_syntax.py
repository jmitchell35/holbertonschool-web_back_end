#!/usr/bin/env python3
"""Module for asynchronous random delay generation."""

import random
import asyncio


async def wait_random(max_delay: int = 10) -> float:
    """Wait for a random delay between 0 and max_delay seconds.

    Args:
        max_delay (int, optional): The maximum delay in seconds. Defaults to
        10.

    Returns:
        float: The actual random delay that was used.
    """
    random_delay = 0 if max_delay < 1 else random.uniform(1, max_delay)
    await asyncio.sleep(random_delay)
    return float(random_delay)
