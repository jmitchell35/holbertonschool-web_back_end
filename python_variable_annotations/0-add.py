#!/usr/bin/env python3
"""
Simple arithmetic operations module.

This module provides basic mathematical operations like addition.
"""


def add(a: float, b: float) -> float:
    """
    Add two numbers together and return the result.

    Args:
        a (float): The first number to add
        b (float): The second number to add

    Returns:
        float: The sum of a and b

    Examples:
        >>> add(2.0, 3.0)
        5.0
        >>> add(-1.0, 1.0)
        0.0
    """
    return a + b
