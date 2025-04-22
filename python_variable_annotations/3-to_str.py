#!/usr/bin/env python3
"""
Type conversion module.

This module provides utility functions for converting between different data
types, particularly focusing on numeric to string conversions.
"""


def to_str(n: float) -> str:
    """
    Convert a floating-point number to its string representation.

    This function transforms a floating-point number into a string using
    Python's built-in string conversion, which follows standard formatting
    rules.

    Args:
        n (float): The floating-point number to convert to a string

    Returns:
        str: String representation of the input number

    Examples:
        >>> to_str(3.14)
        '3.14'
        >>> to_str(1000.0)
        '1000.0'
        >>> to_str(-0.5)
        '-0.5'
    """
    return str(n)
