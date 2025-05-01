#!/usr/bin/env python3
"""
Baby Names Pagination Module.

This module implements pagination for a dataset of popular baby names,
providing functionality to access the data in manageable chunks.
"""
from typing import Tuple, List, Dict
import csv
import math


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieve a specific page of data from the dataset.

        Args:
            page (int, optional): The page number to retrieve (1-indexed).
            Defaults to 1.
            page_size (int, optional): Number of records per page. Defaults to
            10.

        Returns:
            List[List]: A list of rows for the specified page,
                       or an empty list if the page is out of range.

        Raises:
            AssertionError: If page or page_size is not a positive integer.
        """
        assert (isinstance(page, int) and
                isinstance(page_size, int) and
                page > 0 and
                page_size > 0)

        reading_range = index_range(page, page_size)

        dataset = self.dataset()
        try:
            return dataset[reading_range[0]:reading_range[1]]
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """
        Return a dictionary with pagination metadata and the requested page
        data.

        This method enhances the get_page functionality by returning additional
        pagination information such as next page, previous page, and total
        pages.

        Args:
            page (int, optional): The page number to retrieve (1-indexed).
                                 Defaults to 1.
            page_size (int, optional): Number of records per page.
                                      Defaults to 10.

        Returns:
            Dict: A dictionary containing:
                - page_size: Number of items on the page
                - page: Current page number
                - data: Page data (list of rows)
                - next_page: Next page number or None if this is the last page
                - prev_page: Previous page number or None if this is the first
                             page
                - total_pages: Total number of pages
        """
        data = self.get_page(page, page_size)
        full_dataset = self.dataset()
        length = len(full_dataset)
        total_pages = math.ceil(length / page_size)

        return {
            "page_size": page_size,
            "page": page,
            "data": data,
            "next_page": page + 1 if page + 1 <= total_pages else None,
            "prev_page": page - 1 if page > 1 else None,
            "total_pages": total_pages
        }


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
