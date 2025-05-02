#!/usr/bin/env python3
"""
MongoDB utility module for updating school topics.

This module provides functions to update topic information for schools
stored in MongoDB collections.
"""


def update_topics(mongo_collection, name, topics):
    """
    Update the topics field for a school document in MongoDB.

    This function finds a school document by name and updates its
    topics field with the provided list of topics.

    Args:
        mongo_collection: A MongoDB collection object containing school
        documents name (str): The name of the school to update
        topics (list): A list of topics to associate with the school

    Returns:
        UpdateResult: The result of the update operation containing information
                      about whether the operation was successful and how many
                      documents were modified
    """
    result = mongo_collection.update_one(
        {'name': name},
        {'$set': {'topics': topics}}
    )
