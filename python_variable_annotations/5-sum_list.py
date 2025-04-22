#!/usr/bin/env python3
"""
List processing module.

This module provides utility functions for performing mathematical operations
on lists of numeric values.
"""


def sum_list(input_list: list[float]) -> float:
    """
    Calculate the sum of all floating-point numbers in a list.

    This function takes a list of floating-point numbers and returns
    their sum as a float value. It uses Python's built-in sum function
    and ensures the result is returned as a float.

    Args:
        input_list (list[float]): A list of floating-point numbers to sum

    Returns:
        float: The sum of all numbers in the input list

    Examples:
        >>> sum_list([1.0, 2.0, 3.0])
        6.0
        >>> sum_list([0.1, 0.2, 0.3])
        0.6
        >>> sum_list([])
        0.0
    """
    return float(sum(input_list))
