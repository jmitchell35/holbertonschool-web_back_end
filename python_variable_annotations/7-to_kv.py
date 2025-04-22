#!/usr/bin/env python3
from typing import Union
"""
Key-value transformation module.

This module provides utility functions for creating and transforming key-value
pairs, with specific numeric operations applied to the values.
"""


def to_kv(k: str, v: Union[int, float]) -> tuple[str, float]:
    """
    Create a tuple with a string key and the square of a numeric value.

    This function takes a string key and a numeric value (either int or float),
    squares the numeric value, converts it to a float, and returns both the
    original key and the squared value as a tuple.

    Args:
        k (str): The string key for the tuple
        v (Union[int, float]): The numeric value to be squared

    Returns:
        tuple[str, float]: A tuple containing the original string key and
                          the square of the numeric value as a float

    Examples:
        >>> to_kv("key", 2)
        ('key', 4.0)
        >>> to_kv("number", 3.5)
        ('number', 12.25)
        >>> to_kv("negative", -1)
        ('negative', 1.0)
    """
    return (k, float(v**2))
