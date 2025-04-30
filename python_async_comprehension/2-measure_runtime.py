#!/usr/bin/env python3
"""
Module for measuring the runtime of concurrent async comprehensions.

This module demonstrates how to execute multiple asynchronous comprehensions
concurrently and measure the total execution time.
"""

import asyncio
import time
async_comprehension = __import__('1-async_comprehension').async_comprehension


async def measure_runtime() -> float:
    """
    Measure the runtime of executing four async_comprehension coroutines
    concurrently.

    This function creates 4 async_comprehension tasks and runs them
    concurrently using asyncio.gather. It measures and returns the total
    execution time. Since each async_comprehension takes approximately 10
    seconds to complete, but they run concurrently, the expected runtime is
    approximately 10 seconds rather than 40 seconds.

    Returns:
        float: The total runtime in seconds for executing four
                async_comprehension coroutines concurrently.

    Example:
        >>> runtime = await measure_runtime()
        >>> print(f"Completed in {runtime} seconds")  # Approximately 10s
    """
    tasks = [async_comprehension() for _ in range(4)]

    start_time = time.perf_counter()
    await asyncio.gather(* tasks)
    end_time = time.perf_counter()

    return end_time - start_time
