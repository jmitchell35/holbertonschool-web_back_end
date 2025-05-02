#!/usr/bin/env python3


def list_all(mongo_collection):
    doc_list = list(mongo_collection.find())
    
    return [] if len(doc_list) == 0 else doc_list
