#!/usr/bin/env python3
"""
MongoDB utility module for retrieving documents from collections.

This module provides functions to interact with MongoDB collections
and retrieve documents in a standardized format.
"""


def list_all(mongo_collection):
    """
    Retrieve all documents from a MongoDB collection.

    This function queries a MongoDB collection and returns all documents
    as a list. If the collection is empty, an empty list is returned.

    Args:
        mongo_collection: A MongoDB collection object to query

    Returns:
        list: A list of all documents in the collection, or an empty list
              if the collection contains no documents
    """
    doc_list = list(mongo_collection.find())

    return [] if len(doc_list) == 0 else doc_list
