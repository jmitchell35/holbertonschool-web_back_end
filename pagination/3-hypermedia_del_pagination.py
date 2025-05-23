#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Deletion-resilient hypermedia pagination

        Returns a page of the dataset that is resilient to deletions,
        meaning it will skip over deleted indices.

        Args:
            index (int, optional): Starting index. Defaults to None (0).
            page_size (int, optional): Number of items per page. Defaults to
            10.

        Returns:
            Dict: Dictionary containing index, data, page_size, and next_index.
        """
        indexed = self.indexed_dataset()
        if index is None:
            index = 0
        assert (index >= 0 and
                index < len(indexed)), "Index out of range"

        data = []
        counter = index
        while len(data) < page_size and counter < len(indexed):
            if indexed.get(counter):
                data.append(indexed.get(counter))

            counter += 1

        return {
            "index": index,
            "data": data,
            "page_size": page_size,
            "next_index": counter
        }
