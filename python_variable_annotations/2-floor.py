#!/usr/bin/env python3
"""
Number conversion module.

This module provides functions for converting between different numeric types
and performing basic mathematical operations like flooring.
"""


def floor(n: float) -> int:
    """
    Convert a floating-point number to an integer by truncating the decimal
    part.

    Note: This implementation truncates toward zero rather than always rounding
    down. For negative numbers, this differs from mathematical floor operation.

    Args:
        n (float): The floating-point number to convert

    Returns:
        int: The integer part of the number with decimal portion removed

    Examples:
        >>> floor(3.7)
        3
        >>> floor(2.0)
        2
        >>> floor(-1.5)
        -1  # Note: mathematical floor would be -2
    """
    return int(n)
