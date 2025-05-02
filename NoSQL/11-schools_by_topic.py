#!/usr/bin/env python3
"""
MongoDB Python module for finding schools by topic
This module provides a function to query MongoDB for schools
that have a specific topic in their curriculum.
"""


def schools_by_topic(mongo_collection, topic):
    """
    Returns a list of schools that have a specific topic.

    Args:
        mongo_collection: A pymongo collection object
        topic (str): The topic to search for in the schools

    Returns:
        list: A list of school documents that contain the specified topic
              in their 'topics' field
    """
    return list(mongo_collection.find({"topics": topic}))
