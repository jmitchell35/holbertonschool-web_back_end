#!/usr/bin/env python3
from typing import Sequence, List, Tuple
"""
Sequence analysis module.

This module provides utility functions for analyzing sequences (like lists,
strings, tuples) and extracting information about their structure and
properties.
"""


def element_length(lst: List[Sequence]) -> List[Tuple[Sequence, int]]:
    """
    Calculate the length of each sequence element in a list.

    This function takes a list of sequence objects (strings, lists, tuples,
    etc.), computes the length of each element, and returns a list of tuples
    where each tuple contains the original sequence and its length.

    Args:
        lst (List[Sequence]): A list containing sequence objects

    Returns:
        List[Tuple[Sequence, int]]: A list of tuples, each containing a
                                    sequence from the input list and its
                                    corresponding length

    Examples:
        >>> element_length(["hello", "world"])
        [('hello', 5), ('world', 5)]

        >>> element_length([[1, 2], [3, 4, 5]])
        [([1, 2], 2), ([3, 4, 5], 3)]

        >>> element_length([])
        []
    """
    return [(i, len(i)) for i in lst]
