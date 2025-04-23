#!/usr/bin/env python3
"""Module that provides an asynchronous function to wait for n random delays.
"""
import asyncio
from typing import List

task_wait_random = __import__('3-tasks').task_wait_random


async def task_wait_n(n: int, max_delay: int) -> List[float]:
    """
    Spawns wait_random n times with the specified max_delay.

    Args:
        n: Number of times to spawn wait_random.
        max_delay: Maximum delay in seconds.

    Returns:
        List of all the delays in ascending order.
    """
    # List of scheduled tasks here, instead of unscheduled coroutines.
    tasks = [asyncio.create_task(
        task_wait_random(max_delay)) for _ in range(n)]

    delays = []
    # Await in comprehension can be problematic => hence below
    for future in asyncio.as_completed(tasks):
        result = await future
        delays.append(result)

    return delays
