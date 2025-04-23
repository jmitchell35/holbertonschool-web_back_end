#!/usr/bin/env python3
"""Module that provides a function to create an asyncio Task."""
import asyncio
wait_random = __import__('0-basic_async_syntax').wait_random


def task_wait_random(max_delay: int) -> asyncio.Task:
    """
    Creates and returns an asyncio.Task for wait_random.
    
    Args:
        max_delay: Maximum delay in seconds.
        
    Returns:
        An asyncio.Task object.
    """
    return asyncio.create_task(wait_random(max_delay))
