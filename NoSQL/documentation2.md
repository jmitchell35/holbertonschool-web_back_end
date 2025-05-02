# Python MongoDB Query Operations - Comprehensive Guide

This section extends the MongoDB with Python documentation to provide a comprehensive guide on querying in PyMongo, with particular attention to filtering for various field types, including arrays and other complex objects.

<a name="python-query-ops"></a>
## Python Query Operations

### Basic Query Structure

In PyMongo, queries are expressed as Python dictionaries that mirror the MongoDB query language structure:

```python
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase']
collection = db['users']

# Basic find with no conditions - returns all documents
all_docs = collection.find()

# Find with a simple equality condition
users_named_john = collection.find({"name": "John"})

# Find by ObjectId
specific_doc = collection.find_one({"_id": ObjectId("5f8d48b88c8d83a657a02a9d")})
```

### Query Operators Reference Table

Below is a comprehensive reference table of MongoDB query operators and their Python implementation:

| Category | Operator | MongoDB Shell Syntax | PyMongo Syntax | Description |
|----------|----------|---------------------|----------------|-------------|
| **Comparison** | $eq | `{field: value}` | `{"field": value}` | Matches values equal to specified value |
| | $gt | `{field: {$gt: value}}` | `{"field": {"$gt": value}}` | Greater than |
| | $gte | `{field: {$gte: value}}` | `{"field": {"$gte": value}}` | Greater than or equal to |
| | $lt | `{field: {$lt: value}}` | `{"field": {"$lt": value}}` | Less than |
| | $lte | `{field: {$lte: value}}` | `{"field": {"$lte": value}}` | Less than or equal to |
| | $ne | `{field: {$ne: value}}` | `{"field": {"$ne": value}}` | Not equal to |
| | $in | `{field: {$in: [v1, v2]}}` | `{"field": {"$in": [v1, v2]}}` | Matches any value in array |
| | $nin | `{field: {$nin: [v1, v2]}}` | `{"field": {"$nin": [v1, v2]}}` | Doesn't match any value in array |
| **Logical** | $and | `{$and: [{...}, {...}]}` | `{"$and": [{...}, {...}]}` | Logical AND |
| | $or | `{$or: [{...}, {...}]}` | `{"$or": [{...}, {...}]}` | Logical OR |
| | $nor | `{$nor: [{...}, {...}]}` | `{"$nor": [{...}, {...}]}` | Logical NOR |
| | $not | `{field: {$not: {...}}}` | `{"field": {"$not": {...}}}` | Logical NOT |
| **Element** | $exists | `{field: {$exists: true}}` | `{"field": {"$exists": True}}` | Field exists |
| | $type | `{field: {$type: 2}}` | `{"field": {"$type": 2}}` | Field is of specified type |
| **Array** | $all | `{field: {$all: [v1, v2]}}` | `{"field": {"$all": [v1, v2]}}` | Array contains all specified elements |
| | $elemMatch | `{field: {$elemMatch: {...}}}` | `{"field": {"$elemMatch": {...}}}` | Element matches specified criteria |
| | $size | `{field: {$size: n}}` | `{"field": {"$size": n}}` | Array has specified size |
| **Evaluation** | $regex | `{field: {$regex: pattern}}` | `{"field": {"$regex": pattern}}` | Field matches regex pattern |
| | $text | `{$text: {$search: "text"}}` | `{"$text": {"$search": "text"}}` | Text search (requires text index) |
| | $expr | `{$expr: {...}}` | `{"$expr": {...}}` | Allows use of aggregation expressions |
| | $mod | `{field: {$mod: [divisor, remainder]}}` | `{"field": {"$mod": [divisor, remainder]}}` | Modulo operation |
| **Geospatial** | $near | `{field: {$near: {...}}}` | `{"field": {"$near": {...}}}` | Near a point |
| | $geoWithin | `{field: {$geoWithin: {...}}}` | `{"field": {"$geoWithin": {...}}}` | Within a geometry |
| | $geoIntersects | `{field: {$geoIntersects: {...}}}` | `{"field": {"$geoIntersects": {...}}}` | Intersects with a geometry |

### Comparison Operators

```python
# Explicit equality
docs = collection.find({"age": {"$eq": 25}})  # Same as collection.find({"age": 25})

# Not equal
docs = collection.find({"status": {"$ne": "inactive"}})

# Greater than
docs = collection.find({"age": {"$gt": 25}})

# Greater than or equal
docs = collection.find({"age": {"$gte": 25}})

# Less than
docs = collection.find({"age": {"$lt": 30}})

# Less than or equal
docs = collection.find({"age": {"$lte": 30}})

# In array of values
docs = collection.find({"status": {"$in": ["active", "pending"]}})

# Not in array of values
docs = collection.find({"status": {"$nin": ["inactive", "deleted"]}})
```

### Logical Operators

```python
# AND - implicit when multiple conditions are specified
docs = collection.find({"age": {"$gt": 25}, "status": "active"})

# Explicit AND
docs = collection.find({
    "$and": [
        {"age": {"$gt": 25}},
        {"status": "active"}
    ]
})

# OR
docs = collection.find({
    "$or": [
        {"age": {"$lt": 18}},
        {"age": {"$gt": 65}}
    ]
})

# NOR - neither condition is true
docs = collection.find({
    "$nor": [
        {"status": "inactive"},
        {"age": {"$lt": 18}}
    ]
})

# NOT - inverts the specified expression
docs = collection.find({"age": {"$not": {"$gt": 30}}})

# Complex logical combination
docs = collection.find({
    "$or": [
        {"status": "premium"},
        {
            "$and": [
                {"age": {"$gte": 25}},
                {"subscription_years": {"$gte": 2}}
            ]
        }
    ]
})
```

### Element Operators

```python
# Field exists
docs = collection.find({"profile.bio": {"$exists": True}})

# Field does not exist
docs = collection.find({"profile.address": {"$exists": False}})

# Field is of specific type
# BSON type numbers: https://docs.mongodb.com/manual/reference/bson-types/
docs = collection.find({"age": {"$type": 16}})  # 16 is for int32
docs = collection.find({"name": {"$type": 2}})  # 2 is for string
docs = collection.find({"tags": {"$type": 4}})  # 4 is for array

# Alternatively, use the type name instead of the number
docs = collection.find({"age": {"$type": "int"}})
docs = collection.find({"name": {"$type": "string"}})
docs = collection.find({"tags": {"$type": "array"}})

# Field is one of multiple types
docs = collection.find({"value": {"$type": ["int", "double"]}})  # Numeric types
```

### Array Operators

```python
# Simple array match (contains element)
docs = collection.find({"tags": "python"})  # Documents where tags contains "python"

# Array contains all specified elements
docs = collection.find({"tags": {"$all": ["python", "mongodb"]}})

# Array has exact size
docs = collection.find({"tags": {"$size": 3}})  # Array with exactly 3 elements

# Position-based query
docs = collection.find({"tags.0": "python"})  # First element is "python"
docs = collection.find({"tags.1": "mongodb"})  # Second element is "mongodb"

# Array contains at least one element that matches multiple criteria
docs = collection.find({
    "scores": {
        "$elemMatch": {
            "subject": "math",
            "score": {"$gt": 80}
        }
    }
})

# Comparing array values without $elemMatch (applies to any element)
docs = collection.find({"scores.subject": "math", "scores.score": {"$gt": 80}})
# Note: Without $elemMatch, these conditions can match different elements

# Using array element range matching
docs = collection.find({"scores": {"$gt": 85, "$lt": 95}})
# Matches if any array element is between 85 and 95

# Matching single array element against multiple criteria
docs = collection.find({
    "addresses": {
        "$elemMatch": {
            "type": "shipping",
            "state": "CA",
            "verified": True
        }
    }
})
```

The `$elemMatch` operator is crucial when querying arrays of embedded documents, as it ensures all conditions apply to the same array element.

### Querying Embedded Documents

```python
# Exact match for embedded document (order and all fields must match exactly)
docs = collection.find({
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "12345"
    }
})

# Dot notation for field in embedded document
docs = collection.find({"address.city": "Anytown"})
docs = collection.find({"address.zip": {"$in": ["12345", "54321"]}})

# Multiple fields in embedded document
docs = collection.find({
    "address.city": "Anytown",
    "address.state": "CA"
})

# Nested embedded documents (multiple levels)
docs = collection.find({"profile.education.degree": "Ph.D."})

# Embedded documents in arrays
docs = collection.find({"past_addresses.city": "Anytown"})  # Any address with city Anytown

# Arrays of embedded documents with specific criteria
docs = collection.find({
    "past_addresses": {
        "$elemMatch": {
            "city": "Anytown",
            "state": "CA",
            "years": {"$gt": 2}
        }
    }
})
```

### Evaluation Operators

```python
# Regular expressions
docs = collection.find({"name": {"$regex": "^Jo"}})  # Names starting with "Jo"
docs = collection.find({"name": {"$regex": "ohn$", "$options": "i"}})  # Case-insensitive, ending with "ohn"

# Text search (requires a text index)
collection.create_index([("description", "text"), ("title", "text")])
docs = collection.find({"$text": {"$search": "mongodb database"}})
docs = collection.find({"$text": {"$search": "mongodb -sql"}})  # With exclusion
docs = collection.find(
    {"$text": {"$search": "mongodb database"}},
    {"score": {"$meta": "textScore"}}  # Include text score in results
).sort([("score", {"$meta": "textScore"})])  # Sort by relevance

# Expresssion operator ($expr)
# Compare fields within the same document
docs = collection.find({
    "$expr": {"$gt": ["$price", "$cost"]}  # Documents where price > cost
})

docs = collection.find({
    "$expr": {
        "$and": [
            {"$gt": ["$price", "$cost"]},
            {"$gte": [{"$subtract": ["$price", "$cost"]}, 10]}  # Profit margin >= 10
        ]
    }
})

# Using $mod for modulo operation
docs = collection.find({"quantity": {"$mod": [5, 0]}})  # quantity divisible by 5
```

### Geospatial Queries

```python
# First, create a 2dsphere index
collection.create_index([("location", "2dsphere")])

# Find places near a point
docs = collection.find({
    "location": {
        "$near": {
            "$geometry": {
                "type": "Point",
                "coordinates": [-73.9667, 40.78]  # [longitude, latitude]
            },
            "$maxDistance": 1000  # 1000 meters
        }
    }
})

# Find places within a polygon
docs = collection.find({
    "location": {
        "$geoWithin": {
            "$geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-73.9667, 40.78],  # First point
                    [-73.9667, 40.79],  # Second point
                    [-73.9567, 40.79],  # Third point
                    [-73.9567, 40.78],  # Fourth point
                    [-73.9667, 40.78]   # First point again (closed loop)
                ]]
            }
        }
    }
})

# Find places that intersect with a LineString
docs = collection.find({
    "route": {
        "$geoIntersects": {
            "$geometry": {
                "type": "LineString",
                "coordinates": [
                    [-73.9667, 40.78],
                    [-73.9567, 40.78]
                ]
            }
        }
    }
})
```

### Combining Query Types

```python
# Complex query example: Active premium users with Python skills and at least one CA address
docs = collection.find({
    "status": "active",              # Basic equality
    "subscription": "premium",       # Another basic equality
    "skills": "python",              # Array contains element
    "$or": [                         # Logical OR
        {"age": {"$gte": 25}},       # Comparison operator
        {"years_experience": {"$gte": 3}}  # Another comparison
    ],
    "addresses": {                   # Array with embedded documents
        "$elemMatch": {              # Element match operator
            "state": "CA",           # Embedded field equality
            "verified": True,        # Another embedded field
            "since": {"$gte": datetime.datetime(2020, 1, 1)}  # Date comparison
        }
    }
})
```

### Working with Query Results

```python
# Standard iteration
for doc in collection.find({"status": "active"}):
    print(doc["name"])

# Limit results
for doc in collection.find().limit(10):
    print(doc["name"])

# Skip and limit (for pagination)
page_size = 10
page_num = 3  # 3rd page (pages start at 0)
for doc in collection.find().skip(page_size * page_num).limit(page_size):
    print(doc["name"])

# Sort results
# 1 or pymongo.ASCENDING for ascending, -1 or pymongo.DESCENDING for descending
for doc in collection.find().sort("age", pymongo.ASCENDING):
    print(f"{doc['name']}: {doc['age']}")

# Sort by multiple fields
for doc in collection.find().sort([
    ("status", pymongo.ASCENDING),
    ("age", pymongo.DESCENDING)
]):
    print(f"{doc['name']}: {doc['status']}, {doc['age']}")

# Count documents
active_count = collection.count_documents({"status": "active"})
print(f"Active users: {active_count}")

# Distinct values
statuses = collection.distinct("status")
print(f"Available statuses: {statuses}")

# Convert cursor to list (use with caution for large result sets)
results = list(collection.find({"status": "active"}).limit(100))

# Process documents in batches
batch_size = 100
cursor = collection.find({"status": "active"})
cursor.batch_size(batch_size)  # Set server batch size

batch = []
for doc in cursor:
    batch.append(doc)
    if len(batch) >= batch_size:
        process_batch(batch)  # Function that processes the batch
        batch = []

# Process any remaining documents
if batch:
    process_batch(batch)

# Check if cursor has more results
cursor = collection.find({"status": "active"})
has_next = cursor.alive  # True if cursor has more documents

# Close a cursor (important for no_cursor_timeout=True)
cursor = collection.find({"status": "active"}, no_cursor_timeout=True)
try:
    for doc in cursor:
        # Process document
        pass
finally:
    cursor.close()  # Always close non-timing-out cursors
```

### Projection - Selecting Fields

```python
# Include only specific fields
docs = collection.find(
    {"status": "active"},
    {"name": 1, "email": 1}  # Include only name, email, and _id (default)
)

# Exclude specific fields
docs = collection.find(
    {"status": "active"},
    {"password": 0, "secret_notes": 0}  # Exclude password and secret_notes
)

# Exclude _id field (must be explicitly excluded)
docs = collection.find(
    {"status": "active"},
    {"name": 1, "email": 1, "_id": 0}  # Include name and email, exclude _id
)

# Projection with embedded documents
docs = collection.find(
    {"status": "active"},
    {"name": 1, "address.city": 1, "address.state": 1}  # Include specific nested fields
)

# Projection with arrays
docs = collection.find(
    {"status": "active"},
    {"name": 1, "tags": {"$slice": 2}}  # Include only first 2 elements of tags array
)

# Complex array projections
docs = collection.find(
    {"status": "active"},
    {"name": 1, "tags": {"$slice": [1, 2]}}  # Skip 1, return 2 elements
)

# Projection with array elemMatch
docs = collection.find(
    {"status": "active"},
    {"name": 1, "addresses": {"$elemMatch": {"state": "CA"}}}  # Only CA addresses
)
```

### Query Optimization

```python
# Analyze query performance
explain_result = collection.find({"age": {"$gt": 25}}).explain("executionStats")
print(f"Query execution time: {explain_result['executionStats']['executionTimeMillis']} ms")
print(f"Documents examined: {explain_result['executionStats']['totalDocsExamined']}")
print(f"Index used: {explain_result.get('queryPlanner', {}).get('winningPlan', {}).get('inputStage', {}).get('indexName', 'None')}")

# Create appropriate indexes
collection.create_index([("email", pymongo.ASCENDING)], unique=True)
collection.create_index([("age", pymongo.ASCENDING)])
collection.create_index([("status", pymongo.ASCENDING), ("created_at", pymongo.DESCENDING)])

# Compound index following ESR rule (Equality, Sort, Range)
collection.create_index([
    ("status", pymongo.ASCENDING),  # Equality (status)
    ("created_at", pymongo.DESCENDING),  # Sort
    ("age", pymongo.ASCENDING)  # Range (age)
])

# List all indexes
indexes = collection.index_information()
for index_name, index_info in indexes.items():
    print(f"Index: {index_name}, Keys: {index_info['key']}")
```

## MongoDB Querying Decision Flow

To help determine the appropriate query structure, below is a decision flowchart for Python MongoDB queries:

```
┌───────────────────┐
│ What are you      │
│ querying for?     │
└─────────┬─────────┘
          │
          ├───────Basic Value Match───────┐
          │                               │
          │                               ▼
          │                       ┌───────────────────┐
          │                       │ collection.find({ │
          │                       │   "field": value  │
          │                       │ })                │
          │                       └───────────────────┘
          │
          ├───────Comparison───────────┐
          │                            │
          │                            ▼
          │                    ┌───────────────────┐
          │                    │ collection.find({ │
          │                    │   "field": {      │
          │                    │     "$gt": value  │
          │                    │   }               │
          │                    │ })                │
          │                    └───────────────────┘
          │
          ├───────Multiple Conditions─────┐
          │                               │
          │                               ▼
          │                       ┌───────────────────┐
          │                       │ collection.find({ │
          │                       │   "$and": [       │
          │                       │     { ... },      │
          │                       │     { ... }       │
          │                       │   ]               │
          │                       │ })                │
          │                       └───────────────────┘
          │
          ├───────Array Element───────────┐
          │                               │
          │                               ▼
          │                       ┌───────────────────┐
          │                       │ collection.find({ │
          │                       │   "array_field":  │
          │                       │     "value"       │
          │                       │ })                │
          │                       └───────────────────┘
          │
          ├───Array with Multiple Criteria─┐
          │                                │
          │                                ▼
          │                       ┌───────────────────┐
          │                       │ collection.find({ │
          │                       │  "array_field": { │
          │                       │    "$elemMatch": {│
          │                       │      "x": "value",│
          │                       │      "y": {       │
          │                       │        "$gt": 10  │
          │                       │      }            │
          │                       │    }              │
          │                       │  }                │
          │                       │ })                │
          │                       └───────────────────┘
          │
          └───────Embedded Document───────┐
                                          │
                                          ▼
                                 ┌───────────────────┐
                                 │ collection.find({ │
                                 │   "doc.field":    │
                                 │     value         │
                                 │ })                │
                                 └───────────────────┘
```

## Choosing the Right Operator

Here's a flowchart to help decide which operator to use for different query scenarios:

```
┌───────────────────┐
│ What type of      │
│ query do you need?│
└─────────┬─────────┘
          │
          ├───────Simple Value Matching───────┐
          │                                   │
          │                                   ▼
          │                           ┌───────────────────┐
          │                           │ Use equality:     │
          │                           │ {"field": value}  │
          │                           └───────────────────┘
          │
          ├───────Value Comparisons───────────┐
          │                                   │
          │                                   ▼
          │                           ┌───────────────────┐
          │                           │ Use $gt, $lt, $in │
          │                           │ {"field": {       │
          │                           │   "$gt": value    │
          │                           │ }}                │
          │                           └───────────────────┘
          │
          ├───────Combining Conditions─────────┐
          │                                    │
          │                                    ▼
          │                            ┌───────────────────┐
          │                            │ Need all true?    │
          │                            │ Use $and.         │
          │                            │ Need any true?    │
          │                            │ Use $or.          │
          │                            │ Need all false?   │
          │                            │ Use $nor.         │
          │                            └───────────────────┘
          │
          ├───────Array Queries──────────────┐
          │                                  │
          │                                  ▼
          │                          ┌───────────────────┐
          │                          │ Contains element? │
          │                          │ {"array": value}  │
          │                          │ Contains all?     │
          │                          │ {"array": {       │
          │                          │   "$all": [...]   │
          │                          │ }}                │
          │                          └───────────────────┘
          │
          └───────Special Searches────────────┐
                                              │
                                              ▼
                                      ┌───────────────────┐
                                      │ Regex: "$regex"   │
                                      │ Text: "$text"     │
                                      │ Exists: "$exists" │
                                      │ Type: "$type"     │
                                      │ Location: "$near" │
                                      └───────────────────┘
```

## Best Practices for Python MongoDB Queries

1. **Use appropriate indexes**
   ```python
   # Create indexes for frequently queried fields
   collection.create_index([("email", pymongo.ASCENDING)], unique=True)
   collection.create_index([("status", pymongo.ASCENDING), ("created_at", pymongo.DESCENDING)])
   ```

2. **Project only needed fields**
   ```python
   # Only request the fields you need
   docs = collection.find({"status": "active"}, {"name": 1, "email": 1, "_id": 0})
   ```

3. **Use $elemMatch for array of documents queries**
   ```python
   # This ensures conditions apply to the same element
   docs = collection.find({
       "scores": {
           "$elemMatch": {
               "subject": "math",
               "score": {"$gt": 80}
           }
       }
   })
   ```

4. **Batch operations for performance**
   ```python
   # Process cursor in batches
   cursor = collection.find({"status": "active"}).batch_size(1000)
   ```

5. **Analyze query performance**
   ```python
   # Check how your query performs
   explain_result = collection.find({"status": "active"}).explain("executionStats")
   ```

6. **Use covered queries when possible**
   ```python
   # Create an index that covers all fields in query and projection
   collection.create_index([("status", pymongo.ASCENDING), ("name", pymongo.ASCENDING)])
   # Now this query can use only the index
   docs = collection.find({"status": "active"}, {"name": 1, "_id": 0})
   ```

7. **Handle empty results gracefully**
   ```python
   # Check if any results exist
   if collection.count_documents({"email": "search@example.com"}) == 0:
       print("No matching documents found")
   ```

8. **Close cursors when done with no_cursor_timeout**
   ```python
   cursor = collection.find({"status": "active"}, no_cursor_timeout=True)
   try:
       for doc in cursor:
           # Process document
           pass
   finally:
       cursor.close()  # Important!
   ```

This comprehensive guide covers most query scenarios you'll encounter when working with MongoDB in Python, including working with arrays, embedded documents, and complex query conditions.
