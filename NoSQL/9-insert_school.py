#!/usr/bin/env python3
"""
MongoDB utility module for inserting school documents into collections.

This module provides functions to insert school-related data into MongoDB
collections with flexible field support.
"""


def insert_school(mongo_collection, **kwargs):
    """
    Insert a new school document into the specified MongoDB collection.

    This function creates a new document in the provided MongoDB collection
    using the keyword arguments as fields in the document.

    Args:
        mongo_collection: A MongoDB collection object where the document will
        be inserted
        **kwargs: Variable keyword arguments representing the fields and values
                  to be stored in the school document

    Returns:
        ObjectId: The ID of the newly inserted document
    """
    result = mongo_collection.insert_one({**kwargs})

    return result.inserted_id
