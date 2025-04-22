#!/usr/bin/env python3
"""
String manipulation module.

This module provides utilities for string operations such as concatenation.
"""


def concat(str1: str, str2: str) -> str:
    """
    Concatenate two strings together.

    Args:
        str1 (str): The first string
        str2 (str): The second string to append to the first

    Returns:
        str: A new string formed by combining str1 and str2

    Examples:
        >>> concat("Hello, ", "World!")
        'Hello, World!'
        >>> concat("Python", "3")
        'Python3'
    """
    return f'{str1}{str2}'
