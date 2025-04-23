#!/usr/bin/env python3
"""Module that provides an asynchronous function using Tasks."""
import asyncio
task_wait_random = __import__('3-tasks').task_wait_random


async def task_wait_n(n: int, max_delay: int) -> list:
    """
    Spawns task_wait_random n times with the specified max_delay.
    
    Args:
        n: Number of times to spawn task_wait_random.
        max_delay: Maximum delay in seconds.
        
    Returns:
        List of all the delays in ascending order.
    """
    tasks = [task_wait_random(max_delay) for _ in range(n)]
    return [await coroutine for coroutine in asyncio.as_completed(tasks)]
