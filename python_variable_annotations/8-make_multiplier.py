#!/usr/bin/env python3
from typing import Callable
"""
Higher-order function module.

This module provides utilities for creating function factories,
particularly focusing on mathematical operations like multiplication.
"""


def make_multiplier(multiplier: float) -> Callable[[float], float]:
    """
    Create a function that multiplies its argument by a fixed multiplier.

    This is a higher-order function (function factory) that returns a new
    function. The returned function takes a float value and multiplies it by
    the fixed multiplier value that was provided when creating the function.

    This can be implemented either with a lambda function (as used here) or
    with a named inner function.

    Args:
        multiplier (float): The fixed multiplication factor

    Returns:
        Callable[[float], float]: A function that takes a float and returns
                                 the product of that float and the multiplier

    Examples:
        >>> double = make_multiplier(2.0)
        >>> double(5.0)
        10.0

        >>> halve = make_multiplier(0.5)
        >>> halve(8.0)
        4.0

    Alternative implementation:
        def multiply(value: float) -> float:
            return value * multiplier
        return multiply
    """
    return lambda value: value * multiplier
