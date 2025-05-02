#!/usr/bin/env python3
"""
MongoDB script that provides stats about Nginx logs
This script connects to a MongoDB database and displays statistics
about Nginx logs including total logs, methods counts, and status checks.
"""
from pymongo import MongoClient


def log_stats():
    """
    Analyzes Nginx logs stored in MongoDB and displays statistics.

    The function connects to the 'logs' database and the 'nginx' collection,
    then counts documents by various criteria and displays the results in
    the required format.
    """
    # Connect to MongoDB
    client = MongoClient('mongodb://127.0.0.1:27017')

    # Access the logs database and nginx collection
    logs_collection = client.logs.nginx

    # Count total logs
    total_logs = logs_collection.count_documents({})
    print(f"{total_logs} logs")

    # Display methods statistics
    print("Methods:")
    methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
    for method in methods:
        count = logs_collection.count_documents({"method": method})
        print(f"    method {method}: {count}")

    # Count status checks (GET requests to /status)
    status_checks = logs_collection.count_documents({
        "method": "GET",
        "path": "/status"
    })
    print(f"{status_checks} status check")


if __name__ == "__main__":
    log_stats()
