#!/usr/bin/env python3
"""Module that measures the runtime of the wait_n coroutine."""
import time
import asyncio
wait_n = __import__('1-concurrent_coroutines').wait_n


def measure_time(n: int, max_delay: int) -> float:
    """
    Measures the total execution time for wait_n(n, max_delay) and returns
    the average time per operation.

    Args:
        n: Number of times to spawn wait_random.
        max_delay: Maximum delay in seconds.

    Returns:
        Average time per operation.
    """
    start_time = time.perf_counter()
    asyncio.run(wait_n(n, max_delay))
    end_time = time.perf_counter()
    return (end_time - start_time) / n
