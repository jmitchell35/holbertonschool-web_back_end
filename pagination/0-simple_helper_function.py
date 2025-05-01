#!/usr/bin/env python3
"""
Pagination utility module.

This module provides utility functions for implementing pagination in
applications, helping to calculate the correct start and end indices for
retrieving items from a collection based on the requested page and page size.
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate the start and end indices for pagination.

    Args:
        page (int): The current page number (1-indexed).
        page_size (int): The number of items per page.

    Returns:
        Tuple[int, int]: A tuple containing the start index and end index for
                        the items to be displayed on the requested page.

    Example:
        >>> index_range(1, 10)
        (0, 10)
        >>> index_range(2, 10)
        (10, 20)
    """
    return ((page_size * page) - page_size, page_size * page)
