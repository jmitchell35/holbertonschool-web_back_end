#!/usr/bin/env python3
from typing import Union
"""
Mixed type list processing module.

This module provides utility functions for performing mathematical operations
on lists containing mixed numeric types (integers and floats).
"""


def sum_mixed_list(mxd_list: list[Union[int, float]]) -> float:
    """
    Calculate the sum of a list containing both integers and floating-point
    numbers.

    This function takes a list that can contain a mix of integers and floats,
    computes their sum, and returns the result as a float value. It handles
    the type conversion automatically.

    Args:
        mxd_list (list[Union[int, float]]): A list containing integers and/or
                                            floating-point numbers to sum

    Returns:
        float: The sum of all numbers in the input list as a float

    Examples:
        >>> sum_mixed_list([1, 2.0, 3])
        6.0
        >>> sum_mixed_list([5, -1.5, 0, 2.5])
        6.0
        >>> sum_mixed_list([])
        0.0
    """
    return float(sum(mxd_list))
