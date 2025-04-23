#!/usr/bin/env python3
"""Module that provides an asynchronous function to wait for n random delays."""
import asyncio
wait_random = __import__('0-basic_async_syntax').wait_random


async def wait_n(n: int, max_delay: int) -> list:
    """
    Spawns wait_random n times with the specified max_delay.
    
    Args:
        n: Number of times to spawn wait_random.
        max_delay: Maximum delay in seconds.
        
    Returns:
        List of all the delays in ascending order.
    """
    tasks = [wait_random(max_delay) for _ in range(n)]
    return [await coroutine for coroutine in asyncio.as_completed(tasks)]
