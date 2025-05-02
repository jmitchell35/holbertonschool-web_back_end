<a name="schema-design"></a>

<a name="mongodb-object-types"></a>
## 8. MongoDB Object Types

MongoDB stores data in BSON (Binary JSON) format, which extends the JSON model to provide additional data types and to be more efficient for encoding and decoding. Understanding these types is crucial for effective MongoDB development.

<a name="bson-types"></a>
### BSON Data Types Overview

Here's a reference table of the most common BSON data types used in MongoDB:

| Type | BSON Type Code | Description | Example |
|------|---------------|-------------|---------|
| Double | 1 | 64-bit IEEE 754 floating point | `3.14159` |
| String | 2 | UTF-8 string | `"Hello"` |
| Object | 3 | Embedded document | `{ "name": "John" }` |
| Array | 4 | Array of values | `[1, 2, 3]` |
| Binary data | 5 | Binary data | `BinData(0, "SGVsbG8=")` |
| ObjectId | 7 | 12-byte identifier | `ObjectId("5f8d48b88c8d83a657a02a9d")` |
| Boolean | 8 | Boolean value | `true`, `false` |
| Date | 9 | Milliseconds since Unix epoch | `ISODate("2023-01-15T14:30:00Z")` |
| Null | 10 | Null value | `null` |
| Regular Expression | 11 | Regular expression | `/pattern/i` |
| JavaScript | 13 | JavaScript code | `function() { return true; }` |
| Integer (32-bit) | 16 | 32-bit integer | `NumberInt("42")` |
| Timestamp | 17 | MongoDB internal timestamp | `Timestamp(1601234567, 1)` |
| Integer (64-bit) | 18 | 64-bit integer | `NumberLong("9223372036854775807")` |
| Decimal128 | 19 | 128-bit decimal-based floating-point | `NumberDecimal("9.99")` |

<a name="objectid"></a>
### Working with ObjectId

ObjectId is a 12-byte identifier used as the default value for the `_id` field in MongoDB documents if no value is provided.

**Structure of ObjectId**:
- 4 bytes: timestamp (seconds since the Unix epoch)
- 5 bytes: random value
- 3 bytes: incrementing counter

**In MongoDB Shell**:
```javascript
// Create a new ObjectId
const id = ObjectId();
print(id);

// Create ObjectId from string
const idFromString = ObjectId("5f8d48b88c8d83a657a02a9d");

// Get timestamp from ObjectId
const timestamp = idFromString.getTimestamp();
print(timestamp);

// Convert ObjectId to string
const idString = idFromString.toString();
print(idString);

// Compare ObjectIds
const id1 = ObjectId();
const id2 = ObjectId();
print(id1 < id2);  // Compares based on creation time

// Find document by ObjectId
db.users.findOne({ _id: ObjectId("5f8d48b88c8d83a657a02a9d") });
```

**In Python with PyMongo**:
```python
from bson.objectid import ObjectId
from datetime import datetime

# Create a new ObjectId
id = ObjectId()
print(id)

# Create ObjectId from string
id_from_string = ObjectId("5f8d48b88c8d83a657a02a9d")

# Get timestamp from Object# MongoDB: The Comprehensive Guide

## Table of Contents
1. [Introduction to NoSQL and MongoDB](#introduction)
   - [What is NoSQL?](#what-is-nosql)
   - [SQL vs NoSQL](#sql-vs-nosql)
   - [NoSQL Types](#nosql-types)
   - [Benefits of NoSQL Databases](#nosql-benefits)
2. [ACID Properties and CAP Theorem](#acid-and-cap)
3. [MongoDB Basics](#mongodb-basics)
   - [Document Storage in MongoDB](#document-storage)
   - [MongoDB Architecture](#mongodb-architecture)
   - [Key Components](#key-components)
4. [Getting Started with MongoDB](#getting-started)
   - [Installation](#installation)
   - [MongoDB Shell](#mongo-shell)
   - [MongoDB 4.4 Shell Specifics](#mongo-shell-4-4)
   - [MongoDB Shell Scripts with CLI Arguments](#mongo-shell-scripts)
   - [Basic Database Operations](#basic-db-operations)
5. [CRUD Operations](#crud-operations)
   - [Create](#create-operations)
   - [Read](#read-operations)
   - [Update](#update-operations)
   - [Delete](#delete-operations)
6. [Advanced MongoDB Operations](#advanced-operations)
   - [Indexing](#indexing)
   - [Aggregation Framework](#aggregation)
   - [Transactions](#transactions)
   - [Replication and Sharding](#replication-sharding)
7. [MongoDB with Python](#mongodb-python)
   - [Setting up PyMongo](#setup-pymongo)
   - [Python CRUD Operations](#python-crud)
   - [Advanced Python Operations](#python-advanced)
   - [MongoDB and Python Frameworks](#python-frameworks)
   - [Python MongoDB Best Practices](#python-best-practices)
8. [MongoDB Object Types](#mongodb-object-types)
   - [BSON Data Types Overview](#bson-types)
   - [Working with ObjectId](#objectid)
   - [Working with Dates and Timestamps](#dates)
   - [Arrays and Embedded Documents](#arrays-embedded)
   - [Numeric Types](#numeric-types)
   - [Special Types](#special-types)
9. [Schema Design and Best Practices](#schema-design)
   - [Data Modeling Patterns](#data-modeling)
   - [Performance Optimization](#performance)
   - [Security Best Practices](#security)
9. [Real-World Examples](#real-world-examples)
10. [MongoDB Decision Flowchart](#decision-flowchart)

<a name="introduction"></a>
## 1. Introduction to NoSQL and MongoDB

<a name="what-is-nosql"></a>
### What is NoSQL?

NoSQL stands for "Not Only SQL" and refers to non-relational database systems designed for distributed data stores with large-scale data storage needs. NoSQL databases are designed to overcome the limitations of relational databases for specific big data applications like real-time web apps and big data analytics.

<a name="sql-vs-nosql"></a>
### SQL vs NoSQL

| Feature | SQL | NoSQL |
|---------|-----|-------|
| **Data Structure** | Table-based | Document, key-value, wide-column, or graph |
| **Schema** | Fixed schema | Dynamic schema (schema-flexible) |
| **Scaling** | Vertical scaling (more powerful hardware) | Horizontal scaling (distributed systems) |
| **ACID Compliance** | Strong ACID compliance | Often sacrifices ACID for performance and scalability |
| **Query Language** | Structured Query Language (SQL) | Database-specific query languages |
| **Relationships** | Relational model with JOIN operations | Non-relational with embedded documents or references |
| **Use Cases** | Complex queries, transactions | High volume data, rapid development, flexible schema |

<a name="nosql-types"></a>
### NoSQL Types

1. **Document Databases** (MongoDB, CouchDB)
   - Store data in JSON-like documents
   - Documents can contain nested structures
   - Good for content management, mobile apps, catalogs

2. **Key-Value Stores** (Redis, DynamoDB)
   - Simplest NoSQL databases
   - Just keys and values, like a hash table
   - Great for caching, session management, user preferences

3. **Column-Family Stores** (Cassandra, HBase)
   - Store data in column families
   - Optimized for queries over large datasets
   - Ideal for time-series data, weather data, IoT applications

4. **Graph Databases** (Neo4j, ArangoDB)
   - Store data in nodes and edges
   - Optimize for data with complex relationships
   - Perfect for social networks, recommendation engines, network analysis

<a name="nosql-benefits"></a>
### Benefits of NoSQL Databases

- **Flexible Data Model**: Adapt to changing requirements without downtime
- **Horizontal Scalability**: Scale out across commodity servers
- **High Performance**: Optimized for specific data models and access patterns
- **High Availability**: Distributed architecture with no single point of failure
- **Developer Productivity**: Schema-less design allows rapid development

<a name="acid-and-cap"></a>
## 2. ACID Properties and CAP Theorem

### ACID Properties

ACID is an acronym that describes critical properties of transactional database systems:

- **Atomicity**: All operations in a transaction succeed or the entire transaction is rolled back
- **Consistency**: Database remains in a consistent state before and after transaction
- **Isolation**: Transactions occur independently without interference
- **Durability**: Once a transaction is committed, it remains so even in the event of power loss or crashes

MongoDB supports ACID transactions since version 4.0 for replica sets and version 4.2 for sharded clusters, although with some limitations compared to traditional relational databases.

### CAP Theorem

The CAP theorem states that distributed database systems can only provide two of the following three guarantees:

- **Consistency**: All nodes see the same data at the same time
- **Availability**: Every request receives a response (success or failure)
- **Partition Tolerance**: System continues to operate despite network partitions

MongoDB is typically classified as a CP system (Consistency and Partition Tolerance) in its default configuration, prioritizing data consistency over 100% availability during network partitions.

<a name="mongodb-basics"></a>
## 3. MongoDB Basics

<a name="document-storage"></a>
### Document Storage in MongoDB

MongoDB stores data in flexible, JSON-like documents called BSON (Binary JSON). Key features of document storage:

- Documents contain field-value pairs
- Fields can hold arrays and other documents
- Dynamic schema allows for polymorphism
- Binary format increases efficiency and adds data types not in JSON

Example of a MongoDB document:

```json
{
   "_id": ObjectId("5f8d48b88c8d83a657a02a9d"),
   "name": "John Doe",
   "age": 30,
   "email": "john.doe@example.com",
   "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zip": "12345"
   },
   "tags": ["developer", "mongodb", "nosql"]
}
```

<a name="mongodb-architecture"></a>
### MongoDB Architecture

MongoDB architecture consists of the following components:

```
┌─────────────────────────────────────────┐
│              Applications               │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│          MongoDB Query Language         │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│               Database                  │
└─────┬───────────────────────────┬───────┘
      │                           │
┌─────▼───────┐           ┌───────▼─────┐
│ Collections │           │   Indexes   │
└─────┬───────┘           └─────────────┘
      │
┌─────▼───────┐
│  Documents  │
└─────────────┘
```

<a name="key-components"></a>
### Key Components

- **Database**: Container for collections
- **Collection**: Group of MongoDB documents (similar to a table)
- **Document**: A record in MongoDB (similar to a row)
- **Field**: A key-value pair in a document (similar to a column)
- **MongoDB Server**: The mongod process that handles data requests
- **MongoDB Shell**: The mongo interactive JavaScript interface

<a name="getting-started"></a>
## 4. Getting Started with MongoDB

<a name="installation"></a>
### Installation

For detailed installation instructions for your specific operating system, please refer to the official MongoDB documentation:

[MongoDB Official Documentation](https://www.mongodb.com/docs/manual/)

<a name="mongo-shell"></a>
### MongoDB Shell

The MongoDB Shell (mongo) is an interactive JavaScript interface to MongoDB.

**Connecting to MongoDB**:
```javascript
// Connect to a local MongoDB instance
mongo

// Connect to a specific host and port
mongo --host 127.0.0.1 --port 27017

// Connect with authentication
mongo --username myuser --password mypassword --authenticationDatabase admin

// Connect to a specific database
mongo mydatabase
```

**Basic shell commands**:
```javascript
// Show all databases
show dbs

// Switch to a database (creates it if it doesn't exist)
use mydb

// Show collections in current database
show collections

// Display help
help

// Exit the shell
exit
```

<a name="mongo-shell-4-4"></a>
### MongoDB 4.4 Shell Specifics

MongoDB 4.4 introduced several important changes and enhancements to the mongo shell. This section covers the features and changes specific to version 4.4 of the shell.

**New Features in MongoDB 4.4 Shell**:

1. **Enhanced Usability**:
   - Syntax highlighting for better code readability
   - Command auto-completion for faster development
   - Improved error messages that are easier to understand

2. **Authentication Enhancements**:
   ```javascript
   // MongoDB 4.4 adds support for MONGODB-AWS authentication mechanism
   // for connecting to MongoDB Atlas clusters
   mongo "mongodb+srv://cluster0.example.mongodb.net/mydb" \
     --username myuser \
     --password mypassword \
     --authenticationMechanism MONGODB-AWS \
     --awsSessionToken "your-aws-session-token"
   ```

3. **TLS/SSL Improvements**:
   ```javascript
   // MongoDB 4.4 logs warnings for X.509 certificates nearing expiry (within 30 days)
   mongo --tls --tlsCertificateKeyFile client.pem --tlsCAFile ca.pem
   ```

4. **Projection Enhancements**:
   ```javascript
   // MongoDB 4.4 supports aggregation expressions in find projections
   db.inventory.find({}, {
     item: 1,
     discountPrice: { $multiply: ["$price", 0.8] }
   })
   
   // Support for $slice in both inclusion and exclusion projections
   db.inventory.find({}, {
     _id: 0,
     name: 1,
     "colors": { $slice: 2 }  // Only returns first 2 elements of the colors array
   })
   ```

5. **JavaScript Execution Control**:
   ```javascript
   // In MongoDB 4.4, the default behavior prevents immediate execution of
   // JavaScript functions in documents (protection against injection)
   // This example shows the default behavior:
   db.test.findOne({fn: function() { return 'Hello'; }})
   // Result: { "fn" : { "$code" : "function() { return 'Hello'; }" } }
   
   // To disable this protection (not recommended):
   mongo --disableJavaScriptProtection
   ```

**MongoDB 4.4 Command Reference**:

MongoDB 4.4 uses the `mongo` shell command (which was later replaced by `mongosh` in MongoDB 5.0). The commands are organized by category:

1. **Connection Commands**:
   ```javascript
   // Connect to MongoDB instance
   connect("mongodb://localhost:27017/mydb")
   
   // Authenticate within the shell
   db.auth("username", "password")
   ```

2. **Information Commands**:
   ```javascript
   // List all available database commands
   db.listCommands()
   
   // List all databases and their statistics
   db.listDatabases()
   // or
   show dbs
   
   // List collections in the current database
   db.listCollections()
   // or
   show collections
   
   // Return database statistics
   db.stats()
   ```

3. **CRUD Operations**:
   ```javascript
   // Create Operations
   db.collection.insertOne()     // Insert a single document
   db.collection.insertMany()    // Insert multiple documents
   db.collection.insert()        // Insert one or multiple documents
   
   // Read Operations
   db.collection.find()          // Retrieve documents
   db.collection.findOne()       // Retrieve a single document
   db.collection.count()         // Count documents
   db.collection.distinct()      // Return distinct values for a field
   
   // Update Operations
   db.collection.updateOne()     // Update a single document
   db.collection.updateMany()    // Update multiple documents
   db.collection.replaceOne()    // Replace a document entirely
   db.collection.findAndModify() // Update and return a document
   
   // Delete Operations
   db.collection.deleteOne()     // Delete a single document
   db.collection.deleteMany()    // Delete multiple documents
   db.collection.remove()        // Remove documents from a collection
   ```

4. **Index Commands**:
   ```javascript
   // Create an index
   db.collection.createIndex({ field: 1 })
   
   // List all indexes for a collection
   db.collection.getIndexes()
   
   // Remove a specific index
   db.collection.dropIndex("index_name")
   
   // Remove all indexes (except _id)
   db.collection.dropIndexes()
   
   // Get the plan cache for a collection
   db.collection.getPlanCache()
   ```

5. **Administration Commands**:
   ```javascript
   // Create a collection with options
   db.createCollection("users", { capped: true, size: 10000 })
   
   // Drop the current database
   db.dropDatabase()
   
   // Drop a collection
   db.collection.drop()
   
   // Create a new role
   db.createRole({
     role: "readWrite",
     privileges: [...],
     roles: [...]
   })
   ```

6. **Replication Commands**:
   ```javascript
   // Prevent a member from seeking election as primary
   db.adminCommand({ replSetFreeze: 60 })  // Freeze for 60 seconds
   
   // Return status of replica set
   db.adminCommand({ replSetGetStatus: 1 })
   // or
   rs.status()
   
   // Initialize a replica set
   db.adminCommand({ replSetInitiate: config })
   // or
   rs.initiate(config)
   
   // Reconfigure replica set
   db.adminCommand({ replSetReconfig: config })
   // or
   rs.reconfig(config)
   
   // Set the member to replicate from
   db.adminCommand({ replSetSyncFrom: "hostname:port" })
   // or
   rs.syncFrom("hostname:port")
   ```

7. **Aggregation Commands**:
   ```javascript
   // Perform aggregation operations
   db.collection.aggregate([
     { $match: { status: "active" } },
     { $group: { _id: "$category", total: { $sum: "$amount" } } }
   ])
   
   // Perform map-reduce operations
   db.collection.mapReduce(
     mapFunction,
     reduceFunction,
     { out: "results" }
   )
   
   // Group operations (deprecated in 4.4)
   // This command is available in 4.4 but was removed in 5.0
   db.collection.group({
     key: { category: 1 },
     reduce: function(obj, result) { result.count++; },
     initial: { count: 0 }
   })
   ```

8. **Bulk Operation Commands**:
   ```javascript
   // Create an ordered bulk operation object
   var bulk = db.collection.initializeOrderedBulkOp()
   bulk.insert({ item: "abc" })
   bulk.update({ item: "xyz" }, { $set: { price: 10.99 } })
   bulk.execute()
   
   // Create an unordered bulk operation object
   var bulk = db.collection.initializeUnorderedBulkOp()
   bulk.insert({ item: "def" })
   bulk.execute()
   ```

9. **Running Commands Directly**:
   ```javascript
   // List databases
   db.runCommand({ listDatabases: 1 })
   
   // Get collection stats
   db.runCommand({ collStats: "collection_name" })
   
   // Authenticate
   db.runCommand({ 
     authenticate: 1, 
     user: "username", 
     pwd: "password" 
   })
   ```

**Deprecated Features in MongoDB 4.4**:

1. **Deprecated Methods**:
   - `db.collection.group()` - Deprecated in MongoDB 4.4 and removed in 5.0, use aggregation with `$group` instead
   - `gperftools cpu profiler` - No longer supported in 4.4

2. **Command Operation Changes**:
   - `replSetGetStatus` and `rs.status()` remove several deprecated fields from output
   - `findAndModify` now errors if the specified query, sort, or projection is not a document
   - `listIndexes` and `db.collection.getIndexes()` no longer return the namespace `ns` field in index specifications

**Notable Changes and Deprecations**:

1. **Removed Fields in Responses**:
   ```javascript
   // The namespace (ns) field is no longer returned in index specifications
   // Before MongoDB 4.4:
   // { "v" : 2, "key" : { "_id" : 1 }, "name" : "_id_", "ns" : "test.users" }
   
   // In MongoDB 4.4:
   // { "v" : 2, "key" : { "_id" : 1 }, "name" : "_id_" }
   ```

2. **Environment Variables for Authentication**:
   ```javascript
   // MongoDB 4.4 supports setting credentials via environment variables
   // In bash:
   export MONGO_USERNAME="admin"
   export MONGO_PASSWORD="secret"
   export MONGO_AUTHSOURCE="admin"
   
   // Then connect without specifying credentials on command line
   mongo --host mongodb0.example.com:27017
   ```

3. **Compatibility Changes**:
   - MongoDB 4.4 adds more detailed logging of read and write concern provenance
   - Improved error messages and operational logs
   - New term field in replica set configuration for improved consensus mechanisms

**Scripting Enhancements**:

```javascript
// MongoDB 4.4 provides improved error handling in shell scripts
try {
  db.collection.updateOne(
    { _id: ObjectId("5f8d48b88c8d83a657a02a9d") },
    { $set: { status: "active" } }
  );
} catch (error) {
  print("Error occurred: " + error.message);
  // More detailed error information available in 4.4
  print("Error code: " + error.code);
  print("Error name: " + error.name);
}
```

**Best Practices for MongoDB 4.4 Shell**:

1. Use the enhanced shell features for more productive development
2. Take advantage of the improved projection capabilities
3. Pay attention to security warnings, especially for TLS certificate expiration
4. Consider using environment variables for credentials instead of command line
5. Keep scripts compatible with both 4.4 and older versions when necessary by avoiding 4.4-specific features in critical scripts

**Note**: MongoDB 4.4 shell (`mongo`) was the last version of the legacy shell. Starting with MongoDB 5.0, the new MongoDB Shell (`mongosh`) became the recommended shell interface. The `mongosh` provides an even more modern experience with additional features beyond what the 4.4 shell offers.

<a name="mongo-shell-scripts"></a>
### MongoDB Shell Scripts with CLI Arguments

When writing MongoDB shell scripts that accept command-line arguments, you can process data from the CLI in several ways:

**Basic Approach: Using Command Line Arguments**:
```javascript
// save as insert_doc.js
// The first two elements are "mongo" and the script name
// User arguments start from index 2
var name = process.argv[2];
var age = parseInt(process.argv[3]);
var email = process.argv[4];

// Create document using CLI arguments
var document = {
    name: name,
    age: age,
    email: email,
    created_at: new Date()
};

// Print the document to verify
print("Inserting document:");
printjson(document);

// Insert into collection
db.users.insertOne(document);

print("Document inserted successfully!");
```

Run this script with:
```bash
mongo mydatabase insert_doc.js "John Doe" 30 "john@example.com"
```

**Working with JSON from CLI**:
```javascript
// save as insert_json.js
// Get the JSON string from command line
var jsonArg = process.argv[2];

try {
    // Parse the JSON string into an object
    var document = JSON.parse(jsonArg);
    
    // Add timestamp if needed
    document.created_at = new Date();
    
    // Print the document to verify
    print("Inserting document:");
    printjson(document);
    
    // Insert into collection
    db.users.insertOne(document);
    
    print("Document inserted successfully!");
} catch (e) {
    print("Error parsing JSON: " + e);
    quit(1);
}
```

Run it with a JSON string:
```bash
mongo mydatabase insert_json.js '{"name":"John Doe","age":30,"email":"john@example.com"}'
```

**Reading from a File**:
```javascript
// save as insert_from_file.js
// Get filename from command line
var filename = process.argv[2];

try {
    // Load the file content
    var fileContent = cat(filename);
    
    // Parse the JSON
    var documents = JSON.parse(fileContent);
    
    // Handle both single document and array of documents
    if (!Array.isArray(documents)) {
        documents = [documents];
    }
    
    // Print count
    print("Inserting " + documents.length + " documents");
    
    // Insert documents
    var result = db.users.insertMany(documents);
    
    print("Inserted " + result.insertedCount + " documents successfully!");
} catch (e) {
    print("Error: " + e);
    quit(1);
}
```

**Using MongoDB Shell Options**:
```bash
# Execute JavaScript directly from the command line
mongo mydatabase --eval "db.users.insertOne({name: 'John Doe', age: 30, created_at: new Date()})"
```

**Advanced Pattern: Command Line Options Parser**:
```javascript
// save as advanced_insert.js
// Parse command line options
var options = {};
for (var i = 2; i < process.argv.length; i++) {
    var arg = process.argv[i];
    
    // Handle options in --key=value format
    if (arg.startsWith("--")) {
        var parts = arg.substring(2).split("=");
        if (parts.length === 2) {
            var key = parts[0];
            var value = parts[1];
            
            // Try to parse numbers and booleans
            if (!isNaN(value)) {
                value = Number(value);
            } else if (value === "true" || value === "false") {
                value = (value === "true");
            }
            
            options[key] = value;
        }
    }
}

// Print parsed options
print("Options:");
printjson(options);

// Check for required fields
if (!options.collection) {
    print("Error: --collection option is required");
    print("Usage: mongo database script.js --collection=users --name=\"John Doe\" --age=30");
    quit(1);
}

// Create document from options, excluding certain keys
var document = {};
Object.keys(options).forEach(function(key) {
    if (key !== "collection" && key !== "database") {
        document[key] = options[key];
    }
});

// Add timestamp
document.created_at = new Date();

// Print the document
print("\nInserting document into " + options.collection + ":");
printjson(document);

// Insert the document
var result = db[options.collection].insertOne(document);
printjson(result);
```

Run with named parameters:
```bash
mongo mydatabase advanced_insert.js --collection=users --name="John Doe" --age=30 --active=true
```

**Best Practices for CLI Scripts**:
- Always validate input data before inserting into the database
- Use try-catch blocks to handle errors gracefully
- Provide meaningful error messages to identify issues
- Set appropriate exit codes when scripts fail
- Add proper documentation for script usage

<a name="basic-db-operations"></a>
### Basic Database Operations

```javascript
// Create a new database (implicitly created when you first store data)
use newdatabase

// Create a new collection (implicitly created when you first insert data)
db.newcollection.insertOne({ name: "First document" })

// List all collections
show collections

// Drop a collection
db.collection_name.drop()

// Drop the current database
db.dropDatabase()
```

<a name="crud-operations"></a>
## 5. CRUD Operations

<a name="create-operations"></a>
### Create Operations

**Insert a single document**:
```javascript
// Insert one document
db.users.insertOne({
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    created_at: new Date()
})

// The operation returns an object with the status and the _id of the inserted document
```

**Insert multiple documents**:
```javascript
// Insert multiple documents
db.users.insertMany([
    {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
        created_at: new Date()
    },
    {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
        created_at: new Date()
    }
])

// This returns an object with the status and an array of the inserted _ids
```

<a name="read-operations"></a>
### Read Operations

**Finding documents**:
```javascript
// Find all documents in a collection
db.users.find()

// Find with pretty formatting
db.users.find().pretty()

// Find the first document that matches
db.users.findOne({ name: "John Doe" })

// Find specific fields only
db.users.find({ age: { $gt: 25 } }, { name: 1, email: 1, _id: 0 })
// The second parameter specifies which fields to include (1) or exclude (0)
```

**Query operators**:
```javascript
// Comparison operators
db.users.find({ age: { $gt: 25 } })  // greater than
db.users.find({ age: { $gte: 25 } }) // greater than or equal
db.users.find({ age: { $lt: 30 } })  // less than
db.users.find({ age: { $lte: 30 } }) // less than or equal
db.users.find({ age: { $ne: 25 } })  // not equal
db.users.find({ age: { $in: [25, 30, 35] } }) // matches any value in array

// Logical operators
db.users.find({ $and: [{ age: { $gt: 25 } }, { name: "Bob Johnson" }] })
db.users.find({ $or: [{ age: { $lt: 30 } }, { name: "Bob Johnson" }] })
db.users.find({ age: { $not: { $gt: 30 } } })
db.users.find({ $nor: [{ age: 25 }, { name: "John Doe" }] })

// Element operators
db.users.find({ email: { $exists: true } }) // field exists
db.users.find({ age: { $type: "number" } }) // field is of type

// Array operators
db.users.find({ tags: { $all: ["mongodb", "nosql"] } }) // has all elements
db.users.find({ tags: { $size: 3 } }) // array has specific size
```

**Cursor methods**:
```javascript
// Limit the results
db.users.find().limit(2)

// Skip results (useful for pagination)
db.users.find().skip(1).limit(2)

// Sort results (1 for ascending, -1 for descending)
db.users.find().sort({ age: 1, name: -1 })

// Count results
db.users.find({ age: { $gt: 25 } }).count()

// Count all documents in collection
db.users.countDocuments()
```

**Comprehensive Query Guide**:

MongoDB offers powerful querying capabilities. Below is a comprehensive guide to querying documents in MongoDB 4.4 and beyond:

#### Basic Find Syntax

```javascript
db.collection.find(query, projection)
```

Where:
* `query`: The selection criteria (optional)
* `projection`: Fields to return (optional)

#### 1. Basic Equality Matching

```javascript
// Find all documents where name equals "John"
db.users.find({ name: "John" })

// Find all documents where age equals 30
db.users.find({ age: 30 })
```

#### 2. Comparison Operators

```javascript
// Greater than
db.users.find({ age: { $gt: 25 } })

// Less than
db.users.find({ age: { $lt: 30 } })

// Greater than or equal to
db.users.find({ age: { $gte: 25 } })

// Less than or equal to
db.users.find({ age: { $lte: 30 } })

// Not equal to
db.users.find({ status: { $ne: "inactive" } })

// In array of values
db.users.find({ status: { $in: ["active", "pending"] } })

// Not in array of values
db.users.find({ status: { $nin: ["deleted", "banned"] } })
```

#### 3. Logical Operators

```javascript
// AND - implicit when you provide multiple conditions
db.users.find({ age: { $gt: 25 }, status: "active" })

// Explicit AND
db.users.find({ 
  $and: [
    { age: { $gt: 25 } },
    { status: "active" }
  ]
})

// OR
db.users.find({ 
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
  ]
})

// NOT
db.users.find({ age: { $not: { $gt: 25 } } })

// NOR
db.users.find({
  $nor: [
    { status: "inactive" },
    { age: { $lt: 18 } }
  ]
})
```

#### 4. Element Operators

```javascript
// Field exists
db.users.find({ email: { $exists: true } })

// Field does not exist
db.users.find({ phone: { $exists: false } })

// Value is of specific type
db.users.find({ age: { $type: "number" } })
```

#### 5. Array Operators

```javascript
// Array contains element
db.users.find({ tags: "developer" })

// Array contains all elements
db.users.find({ tags: { $all: ["developer", "mongodb"] } })

// Array element matches criteria
db.users.find({ "scores.math": { $gt: 80 } })

// Array size
db.users.find({ tags: { $size: 3 } })

// Element matches with $elemMatch
db.users.find({
  scores: {
    $elemMatch: { subject: "math", score: { $gt: 80 } }
  }
})
```

#### 6. Text Search

```javascript
// Requires a text index to be created first
db.collection.createIndex({ description: "text" })
db.collection.find({ $text: { $search: "mongodb database" } })
```

#### 7. Projections (Returning Specific Fields)

```javascript
// Include only name and age fields (plus _id by default)
db.users.find({ status: "active" }, { name: 1, age: 1 })

// Exclude _id field
db.users.find({ status: "active" }, { name: 1, age: 1, _id: 0 })

// Exclude specific fields
db.users.find({ status: "active" }, { password: 0, secretNotes: 0 })
```

#### 8. Query Methods for Controlling Results

```javascript
// Limit results
db.users.find().limit(10)

// Skip results (for pagination)
db.users.find().skip(20).limit(10)

// Sort results (1 for ascending, -1 for descending)
db.users.find().sort({ age: -1, name: 1 })

// Count matching documents
db.users.find({ status: "active" }).count()

// Pretty-print results
db.users.find().pretty()
```

#### 9. Method Chaining

MongoDB supports method chaining, allowing you to combine multiple operations in a single statement. This is particularly useful for building complex queries step by step:

```javascript
// Find, limit, and sort in one chain
db.users.find({ status: "active" }).limit(5).sort({ name: 1 })

// Find and count
db.users.find({ age: { $gt: 30 } }).count()

// Find, skip, limit, and sort (for pagination)
db.users.find().skip(20).limit(10).sort({ created_at: -1 })

// Find, filter, and get specific fields
db.users.find({ status: "active" })
        .sort({ joined_date: -1 })
        .limit(5)
        .project({ name: 1, email: 1, _id: 0 })

// Finding specific ranges with chained comparison operators
db.users.find({ age: { $gt: 20, $lt: 30 } })

// Skip and limit for paginated results
const page = 2;
const pageSize = 10;
db.users.find().skip((page - 1) * pageSize).limit(pageSize)
```

Important notes about method chaining:

1. **Order matters**: Some methods like `sort()`, `skip()`, and `limit()` can produce different results when ordered differently.

2. **Terminal operations**: Some methods like `count()`, `toArray()`, and `forEach()` execute the query immediately and cannot be followed by other cursor methods.

3. **Non-terminal operations**: Methods like `sort()`, `limit()`, and `skip()` modify the cursor but don't execute it, allowing further chaining.

4. **Cursor exhaustion**: Once a cursor is "exhausted" (fully iterated), it cannot be reused.

5. **Memory considerations**: Methods like `toArray()` load all results into memory, which can be problematic for large result sets.

#### 10. Updated Cursor Methods in Modern MongoDB

In recent MongoDB versions (post 4.4), several cursor methods have been enhanced or added:

```javascript
// Convert cursor to array (useful for further processing)
db.users.find().toArray()

// Iterate a cursor with forEach
db.users.find().forEach(function(doc) {
  print("User: " + doc.name);
})

// Check if cursor has more documents
var cursor = db.users.find();
while(cursor.hasNext()) {
  var doc = cursor.next();
  print(doc.name);
}

// Add cursor flags
db.users.find().addCursorFlag("noCursorTimeout", true)

// Set batch size (how many documents to return in each batch)
db.users.find().batchSize(100)

// Explain query execution plan
db.users.find({ age: { $gt: 25 } }).explain("executionStats")

// Set max time MS (timeout for query execution)
db.users.find().maxTimeMS(1000)

// Allow disk use for large sort operations
db.users.find().sort({ name: 1 }).allowDiskUse(true)

// Get cursor information
var cursor = db.users.find();
cursor.objsLeftInBatch()  // Documents left in current batch

// Close a cursor explicitly (frees server resources)
var cursor = db.users.find();
cursor.close()
```

#### 10. MongoDB Shell vs. MongoDB Drivers

Note that cursor behavior varies slightly between the MongoDB shell and language-specific drivers. For example, in most drivers:

- Cursors implement an iterator interface
- Cursors may be used in for-loops directly
- Cursors typically close automatically when iteration is complete
- Some methods might have slightly different names

<a name="update-operations"></a>
### Update Operations

**Update a single document**:
```javascript
// Update one document
db.users.updateOne(
    { name: "John Doe" }, // filter
    { $set: { age: 31, updated_at: new Date() } } // update operations
)

// The operation returns an object with the status of the update
```

**Update multiple documents**:
```javascript
// Update many documents
db.users.updateMany(
    { age: { $lt: 30 } }, // filter
    { $inc: { age: 1 } } // increment age by 1
)
```

**Legacy Update Syntax (MongoDB 3.6 and earlier)**:
```javascript
// Update a single document (default behavior)
db.users.update(
    { name: "John Doe" },
    { $set: { age: 31 } }
)

// Update multiple documents with multi:true flag
db.users.update(
    { age: { $lt: 30 } },
    { $set: { status: "young" } },
    { multi: true }
)

// Upsert with the legacy syntax
db.users.update(
    { email: "newuser@example.com" },
    { $set: { name: "New User", status: "active" } },
    { upsert: true }
)

// Combined multi and upsert options
db.users.update(
    { status: "inactive" },
    { $set: { status: "archived" } },
    { multi: true, upsert: true }
)
```

**Update operators**:
```javascript
// $set - set field value
db.users.updateOne({ name: "John Doe" }, { $set: { email: "john.new@example.com" } })

// $inc - increment field value
db.users.updateOne({ name: "John Doe" }, { $inc: { age: 1 } })

// $mul - multiply field value
db.users.updateOne({ name: "John Doe" }, { $mul: { score: 1.1 } })

// $rename - rename field
db.users.updateOne({ name: "John Doe" }, { $rename: { "name": "full_name" } })

// $unset - remove field
db.users.updateOne({ name: "Jane Smith" }, { $unset: { age: "" } })

// Array operators
db.users.updateOne({ name: "John Doe" }, { $push: { tags: "javascript" } }) // add to array
db.users.updateOne({ name: "John Doe" }, { $pull: { tags: "nosql" } }) // remove from array
db.users.updateOne({ name: "John Doe" }, { $addToSet: { tags: "mongodb" } }) // add if not exists
```

**Replace a document**:
```javascript
// Replace entire document (except _id)
db.users.replaceOne(
    { name: "Bob Johnson" },
    {
        name: "Robert Johnson",
        email: "robert@example.com",
        age: 36,
        updated_at: new Date()
    }
)
```

**Upsert (update or insert)**:
```javascript
// Update if exists, insert if not (upsert)
db.users.updateOne(
    { email: "sarah@example.com" },
    { $set: { name: "Sarah Williams", age: 28 } },
    { upsert: true }
)
```

<a name="delete-operations"></a>
### Delete Operations

**Delete a single document**:
```javascript
// Delete one document
db.users.deleteOne({ name: "John Doe" })

// The operation returns an object with the deletion status
```

**Delete multiple documents**:
```javascript
// Delete many documents
db.users.deleteMany({ age: { $lt: 30 } })

// Delete all documents in a collection
db.users.deleteMany({})
```

**Legacy Delete Syntax (MongoDB 3.6 and earlier)**:
```javascript
// Remove a single document
db.users.remove({ name: "John Doe" }, { justOne: true })

// Remove multiple documents
db.users.remove({ age: { $lt: 30 } })

// Remove all documents in a collection
db.users.remove({})

// For better performance when removing all documents,
// dropping the collection is recommended
db.users.drop()
```

<a name="advanced-operations"></a>
## 6. Advanced MongoDB Operations

<a name="indexing"></a>
### Indexing

Indexes improve query performance by allowing MongoDB to limit the number of documents it needs to inspect.

**Creating indexes**:
```javascript
// Create a single field index
db.users.createIndex({ email: 1 }) // 1 for ascending, -1 for descending

// Create a compound index
db.users.createIndex({ age: -1, name: 1 })

// Create a unique index
db.users.createIndex({ email: 1 }, { unique: true })

// Create a TTL (Time-To-Live) index
db.sessions.createIndex({ lastUpdated: 1 }, { expireAfterSeconds: 3600 })

// Create a text index for full-text search
db.articles.createIndex({ content: "text", title: "text" })

// Create a geospatial index
db.places.createIndex({ location: "2dsphere" })
```

**Viewing indexes**:
```javascript
// List all indexes on a collection
db.users.getIndexes()

// Get index information
db.users.getIndexSpecs()
```

**Dropping indexes**:
```javascript
// Drop a specific index
db.users.dropIndex("email_1")

// Drop all indexes except _id
db.users.dropIndexes()
```

**Index usage stats**:
```javascript
// See execution statistics for a query
db.users.find({ age: { $gt: 30 } }).explain("executionStats")
```

<a name="aggregation"></a>
### Aggregation Framework

The aggregation framework provides a way to process and transform documents in a collection.

**Basic aggregation pipeline**:
```javascript
// Simple aggregation example
db.orders.aggregate([
    // Stage 1: Filter documents
    { $match: { status: "completed" } },
    
    // Stage 2: Group and calculate
    { $group: { 
        _id: "$customer_id", 
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
    }},
    
    // Stage 3: Sort results
    { $sort: { totalAmount: -1 } },
    
    // Stage 4: Limit results
    { $limit: 5 }
])
```

**Common aggregation operators**:
```javascript
// $match - filter documents
{ $match: { age: { $gt: 25 } } }

// $group - group documents
{ $group: { _id: "$department", avgAge: { $avg: "$age" } } }

// $project - reshape documents
{ $project: { name: 1, firstLetter: { $substr: ["$name", 0, 1] } } }

// $sort - sort documents
{ $sort: { age: -1 } }

// $limit - limit documents
{ $limit: 10 }

// $skip - skip documents
{ $skip: 20 }

// $unwind - deconstruct array field
{ $unwind: "$tags" }

// $lookup - join with another collection (like SQL JOIN)
{ $lookup: {
    from: "orders",
    localField: "_id",
    foreignField: "customer_id",
    as: "customer_orders"
}}
```

**Advanced aggregation example**:
```javascript
// More complex aggregation example
db.sales.aggregate([
    // Match documents from 2023
    { $match: { date: { $gte: new Date("2023-01-01"), $lt: new Date("2024-01-01") } } },
    
    // Project only needed fields and calculate month
    { $project: {
        month: { $month: "$date" },
        product: 1,
        amount: 1
    }},
    
    // Group by month and product
    { $group: {
        _id: { month: "$month", product: "$product" },
        totalSales: { $sum: "$amount" }
    }},
    
    // Sort by month and total sales
    { $sort: { "_id.month": 1, "totalSales": -1 } },
    
    // Group again to get top product per month
    { $group: {
        _id: "$_id.month",
        topProduct: { $first: "$_id.product" },
        salesAmount: { $first: "$totalSales" }
    }},
    
    // Final sort by month
    { $sort: { "_id": 1 } }
])
```

<a name="transactions"></a>
### Transactions

MongoDB supports multi-document ACID transactions since version 4.0.

**Transaction example**:
```javascript
// Start a session
const session = db.getMongo().startSession()

// Start a transaction
session.startTransaction()

try {
    // Get collection references
    const accounts = session.getDatabase("finance").accounts
    const transfers = session.getDatabase("finance").transfers
    
    // Perform operations inside the transaction
    accounts.updateOne(
        { _id: "account1" },
        { $inc: { balance: -100 } },
        { session }
    )
    
    accounts.updateOne(
        { _id: "account2" },
        { $inc: { balance: 100 } },
        { session }
    )
    
    transfers.insertOne(
        {
            from: "account1",
            to: "account2",
            amount: 100,
            date: new Date()
        },
        { session }
    )
    
    // Commit the transaction
    session.commitTransaction()
    console.log("Transaction committed successfully")
} catch (error) {
    // Abort the transaction in case of error
    session.abortTransaction()
    console.error("Transaction aborted due to error:", error)
} finally {
    // End the session
    session.endSession()
}
```

<a name="replication-sharding"></a>
### Replication and Sharding

**Replication** provides redundancy and high availability:

```javascript
// Check replica set status
rs.status()

// Configure a new replica set
rs.initiate({
    _id: "myReplSet",
    members: [
        { _id: 0, host: "mongodb0.example.com:27017" },
        { _id: 1, host: "mongodb1.example.com:27017" },
        { _id: 2, host: "mongodb2.example.com:27017" }
    ]
})

// Add a member to replica set
rs.add("mongodb3.example.com:27017")

// Remove a member
rs.remove("mongodb2.example.com:27017")
```

**Sharding** distributes data across multiple machines:

```javascript
// Enable sharding for a database
sh.enableSharding("myDatabase")

// Shard a collection based on a key
sh.shardCollection("myDatabase.users", { "userId": "hashed" })

// Check sharding status
sh.status()
```

<a name="mongodb-python"></a>
## 7. MongoDB with Python

<a name="setup-pymongo"></a>
### Setting up PyMongo

```python
# Install PyMongo
# pip install pymongo

# Import PyMongo
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId

# Connect to MongoDB
# Basic connection to local MongoDB server
client = MongoClient('localhost', 27017)

# Alternative connection with connection string URI
# client = MongoClient('mongodb://username:password@localhost:27017/mydatabase')

# Access a database
db = client['mydatabase']  # or client.mydatabase

# Access a collection
collection = db['users']  # or db.users

# Check connection
try:
    # The ping command is lightweight and doesn't require auth
    client.admin.command('ping')
    print("Connected successfully!")
except Exception as e:
    print(f"Connection failed: {e}")
```

<a name="python-crud"></a>
### Python CRUD Operations

**Create operations**:
```python
# Insert one document
result = collection.insert_one({
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 30,
    'tags': ['python', 'mongodb', 'developer']
})
print(f"Inserted document ID: {result.inserted_id}")

# Insert multiple documents
documents = [
    {
        'name': 'Jane Smith',
        'email': 'jane@example.com',
        'age': 25,
        'tags': ['designer', 'mongodb']
    },
    {
        'name': 'Bob Johnson',
        'email': 'bob@example.com',
        'age': 35,
        'tags': ['manager', 'python']
    }
]
result = collection.insert_many(documents)
print(f"Inserted document IDs: {result.inserted_ids}")
```

**Read operations**:
```python
# Find one document
user = collection.find_one({'name': 'John Doe'})
print(user)

# Find by ObjectId
user = collection.find_one({'_id': ObjectId('5f8d48b88c8d83a657a02a9d')})

# Find all matching documents
users = collection.find({'age': {'$gt': 25}})
for user in users:
    print(user)

# Find with projection (only return specific fields)
users = collection.find(
    {'age': {'$gt': 25}},
    {'name': 1, 'email': 1, '_id': 0}  # 1 to include, 0 to exclude
)

# Count documents
count = collection.count_documents({'age': {'$gt': 25}})
print(f"Found {count} users older than 25")

# Sort documents
users = collection.find().sort('age', pymongo.ASCENDING)  # or pymongo.DESCENDING
```

**Update operations**:
```python
# Update one document
result = collection.update_one(
    {'name': 'John Doe'},  # filter
    {'$set': {'age': 31, 'updated_at': datetime.now()}}  # update
)
print(f"Modified {result.modified_count} document(s)")

# Update many documents
result = collection.update_many(
    {'age': {'$lt': 30}},  # filter
    {'$inc': {'age': 1}}  # increment age by 1
)
print(f"Modified {result.modified_count} document(s)")

# Update with upsert (insert if not exists)
result = collection.update_one(
    {'email': 'sarah@example.com'},
    {'$set': {'name': 'Sarah Williams', 'age': 28}},
    upsert=True
)
```

**Delete operations**:
```python
# Delete one document
result = collection.delete_one({'name': 'John Doe'})
print(f"Deleted {result.deleted_count} document(s)")

# Delete many documents
result = collection.delete_many({'age': {'$lt': 25}})
print(f"Deleted {result.deleted_count} document(s)")
```

<a name="python-frameworks"></a>
### MongoDB and Python Frameworks

Python offers several frameworks and libraries that integrate well with MongoDB, making development more efficient and structured.

#### 1. ODM Libraries (Object-Document Mappers)

**MongoEngine**:
```python
# Install: pip install mongoengine

from mongoengine import Document, StringField, IntField, connect

# Connect to database
connect('mydatabase')

# Define a model
class User(Document):
    name = StringField(required=True, max_length=100)
    email = StringField(required=True, unique=True)
    age = IntField(min_value=0)
    
    meta = {
        'collection': 'users',        # Collection name
        'indexes': ['email', 'name'],  # Fields to index
        'ordering': ['-age']          # Default sorting
    }

# Create a user
user = User(name="John Doe", email="john@example.com", age=30)
user.save()

# Find users
users = User.objects(age__gte=18)  # All users 18 or older
for user in users:
    print(f"{user.name}: {user.email}")
```

**PyMODM**:
```python
# Install: pip install pymodm

from pymodm import MongoModel, fields, connect

# Connect to database
connect('mongodb://localhost:27017/mydatabase')

# Define a model
class User(MongoModel):
    name = fields.CharField(required=True)
    email = fields.EmailField(required=True)
    age = fields.IntegerField(min_value=0)
    
    class Meta:
        collection_name = 'users'
        final = True

# Create a user
user = User('John Doe', 'john@example.com', 30)
user.save()

# Find users
from pymodm.queryset import QuerySet
users = QuerySet(User).raw({'age': {'$gte': 18}})
for user in users:
    print(f"{user.name}: {user.email}")
```

#### 2. Web Frameworks

**Flask with PyMongo**:
```python
# Install: pip install Flask flask-pymongo

from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
mongo = PyMongo(app)

@app.route('/users', methods=['GET'])
def get_users():
    users = list(mongo.db.users.find({}, {'_id': 0}))
    return jsonify(users)

@app.route('/users', methods=['POST'])
def add_user():
    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'age': request.json['age']
    }
    mongo.db.users.insert_one(user)
    return jsonify({'message': 'User added successfully'})

if __name__ == '__main__':
    app.run(debug=True)
```

**Django with Djongo**:
```python
# Install: pip install Django djongo

# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'mydatabase',
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
        }
    }
}

# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    age = models.IntegerField()
    
    def __str__(self):
        return self.name

# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .models import User

def get_users(request):
    users = list(User.objects.filter(age__gte=18).values())
    return JsonResponse({'users': users})
```

**FastAPI with Motor (Async MongoDB)**:
```python
# Install: pip install fastapi motor uvicorn

from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import asyncio

app = FastAPI()

# Model
class User(BaseModel):
    name: str
    email: str
    age: int

# Connect to MongoDB
@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient("mongodb://localhost:27017")
    app.mongodb = app.mongodb_client["mydatabase"]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

# Routes
@app.get("/users")
async def get_users():
    users = await app.mongodb["users"].find().to_list(length=100)
    return {"users": users}

@app.post("/users")
async def add_user(user: User):
    new_user = user.dict()
    await app.mongodb["users"].insert_one(new_user)
    return {"message": "User added successfully"}
```

#### 3. Asynchronous MongoDB with Python

**Motor (Async PyMongo)**:
```python
# Install: pip install motor

import motor.motor_asyncio
import asyncio

# Connect to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
db = client.mydatabase
collection = db.users

async def insert_user():
    result = await collection.insert_one({
        'name': 'John Doe',
        'email': 'john@example.com',
        'age': 30
    })
    return result.inserted_id

async def find_users():
    cursor = collection.find({'age': {'$gte': 18}})
    async for document in cursor:
        print(document)

async def main():
    # Insert a user
    user_id = await insert_user()
    print(f"Inserted user with ID: {user_id}")
    
    # Find users
    await find_users()

# Run the async function
asyncio.run(main())
```

<a name="python-best-practices"></a>
### Python MongoDB Best Practices

When working with MongoDB in Python, following these best practices will help you create efficient, maintainable, and secure applications:

#### 1. Connection Management

```python
# Create a connection pool
client = MongoClient(
    'mongodb://localhost:27017/',
    maxPoolSize=50,                # Maximum concurrent connections
    waitQueueTimeoutMS=2500,       # How long to wait for a connection
    connectTimeoutMS=2500,         # How long to wait for server connection
    serverSelectionTimeoutMS=2500  # How long to wait for server selection
)

# Properly close connections when done
def cleanup():
    client.close()

# Keep connections alive for long-running applications
client = MongoClient(
    'mongodb://localhost:27017/',
    socketTimeoutMS=None,  # Disable socket timeout
    connectTimeoutMS=30000  # 30 second connection timeout
)
```

#### 2. Error Handling and Retry Logic

```python
from pymongo.errors import ConnectionFailure, OperationFailure
import time

def execute_with_retry(func, max_retries=3, retry_delay=1):
    retries = 0
    while retries < max_retries:
        try:
            return func()
        except (ConnectionFailure, OperationFailure) as e:
            retries += 1
            if retries == max_retries:
                raise
            time.sleep(retry_delay)
            retry_delay *= 2  # Exponential backoff

# Usage
def insert_document():
    return db.users.insert_one({"name": "John"})

result = execute_with_retry(insert_document)
```

#### 3. Data Validation

```python
# Simple validation
def insert_user(user_data):
    required_fields = ['name', 'email', 'age']
    
    # Check for required fields
    for field in required_fields:
        if field not in user_data:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate field types
    if not isinstance(user_data['name'], str):
        raise TypeError("Name must be a string")
    
    if not isinstance(user_data['age'], int) or user_data['age'] < 0:
        raise ValueError("Age must be a positive integer")
    
    # Insert validated data
    return db.users.insert_one(user_data)

# Using Pydantic for validation
from pydantic import BaseModel, EmailStr, validator

class User(BaseModel):
    name: str
    email: EmailStr
    age: int
    
    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v

def insert_validated_user(user_data):
    # This will raise validation error if data is invalid
    valid_user = User(**user_data)
    return db.users.insert_one(valid_user.dict())
```

#### 4. Bulk Operations for Better Performance

```python
# Efficient bulk inserts
def bulk_insert_users(users_list):
    if not users_list:
        return
    
    # Create bulk operation
    result = db.users.insert_many(users_list)
    return result.inserted_ids

# Bulk updates
from pymongo import UpdateOne

def bulk_update_users(updates_list):
    if not updates_list:
        return
    
    # Create list of update operations
    operations = [
        UpdateOne(
            {'_id': update['user_id']},
            {'$set': update['new_data']}
        )
        for update in updates_list
    ]
    
    # Execute bulk update
    result = db.users.bulk_write(operations)
    return result
```

#### 5. Indexing Strategies

```python
# Create indexes for commonly queried fields
db.users.create_index([('email', 1)], unique=True)
db.users.create_index([('age', 1)])

# Compound index for queries on multiple fields
db.users.create_index([('age', 1), ('name', 1)])

# Text index for text search
db.articles.create_index([('content', 'text'), ('title', 'text')])

# TTL index for automatic document expiration
from datetime import datetime, timedelta
db.sessions.create_index([('created_at', 1)], expireAfterSeconds=3600)  # Expire after 1 hour
```

#### 6. Query Optimization

```python
# Use projection to retrieve only needed fields
users = db.users.find(
    {'age': {'$gte': 18}},
    {'name': 1, 'email': 1, '_id': 0}  # Only return name and email
)

# Use explain() to analyze query performance
explain_result = db.users.find({'age': {'$gt': 25}}).explain('executionStats')
print(f"Execution time: {explain_result['executionStats']['executionTimeMillis']}ms")
print(f"Documents examined: {explain_result['executionStats']['totalDocsExamined']}")

# Limit result set size
recent_users = db.users.find().sort('created_at', -1).limit(10)

# Use covered queries (where index contains all fields needed)
db.users.create_index([('email', 1), ('name', 1)])
covered_query = db.users.find(
    {'email': 'john@example.com'},
    {'email': 1, 'name': 1, '_id': 0}
)
```

#### 7. Security Considerations

```python
# Always use connection strings with authentication
client = MongoClient('mongodb://username:password@localhost:27017/mydatabase')

# Use environment variables for sensitive information
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file
client = MongoClient(os.environ.get('MONGO_URI'))

# Sanitize and validate user input before queries
def find_user_by_username(username):
    # Validate username format
    if not isinstance(username, str) or not username.isalnum():
        raise ValueError("Invalid username format")
    
    return db.users.find_one({'username': username})
```

#### 8. Migration and Schema Evolution

```python
# Simple migration script
def migrate_users_add_status():
    # Find all users without 'status' field
    users_to_update = db.users.find({'status': {'$exists': False}})
    
    # Add default status
    for user in users_to_update:
        db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'status': 'active'}}
        )
    
    print("Migration completed")

# Using pymongo-migrate for more complex migrations
# pip install pymongo-migrate
# Then create migrations:
# pymongo-migrate create add_user_status
```

#### 9. Testing with MongoDB

```python
# Using pytest with mongomock
# pip install pytest mongomock

import pytest
import mongomock

@pytest.fixture
def mock_mongo_client():
    return mongomock.MongoClient()

@pytest.fixture
def mock_db(mock_mongo_client):
    return mock_mongo_client.db

def test_user_insertion(mock_db):
    # Mock data
    user = {'name': 'Test User', 'email': 'test@example.com', 'age': 25}
    
    # Insert into mock DB
    result = mock_db.users.insert_one(user)
    assert result.acknowledged
    
    # Check if user was inserted
    found_user = mock_db.users.find_one({'_id': result.inserted_id})
    assert found_user['name'] == 'Test User'
    assert found_user['email'] == 'test@example.com'
```

<a name="schema-design"></a>
## 8. Schema Design and Best Practices

<a name="data-modeling"></a>
### Data Modeling Patterns

**Embedded Documents** (One-to-Few, One-to-Many relationships):
```javascript
// User document with embedded addresses
{
    "_id": ObjectId("5f8d48b88c8d83a657a02a9d"),
    "name": "John Doe",
    "email": "john@example.com",
    "addresses": [
        {
            "type": "home",
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip": "12345"
        },
        {
            "type": "work",
            "street": "456 Market St",
            "city": "Worktown",
            "state": "CA",
            "zip": "54321"
        }
    ]
}
```

**References** (One-to-Many, Many-to-Many relationships):
```javascript
// User document with references to orders
{
    "_id": ObjectId("5f8d48b88c8d83a657a02a9d"),
    "name": "John Doe",
    "email": "john@example.com"
}

// Order documents referencing user
{
    "_id": ObjectId("5f8f59c98c8d83a657a02aa1"),
    "user_id": ObjectId("5f8d48b88c8d83a657a02a9d"),
    "product": "MongoDB Book",
    "amount": 29.99
}
{
    "_id": ObjectId("5f8f59d98c8d83a657a02aa2"),
    "user_id": ObjectId("5f8d48b88c8d83a657a02a9d"),
    "product": "Laptop",
    "amount": 999.99
}
```

**Hybrid Approach**:
```javascript
// User document with embedded recent orders and references to all orders
{
    "_id": ObjectId("5f8d48b88c8d83a657a02a9d"),
    "name": "John Doe",
    "email": "john@example.com",
    "recent_orders": [
        {
            "order_id": ObjectId("5f8f59c98c8d83a657a02aa1"),
            "product": "MongoDB Book",
            "amount": 29.99,
            "date": ISODate("2023-01-15T14:30:00Z")
        }
    ],
    "all_orders": [
        ObjectId("5f8f59c98c8d83a657a02aa1"),
        ObjectId("5f8f59d98c8d83a657a02aa2")
    ]
}
```

**Schema Design Patterns**:

1. **Polymorphic Pattern**:
```javascript
// Different document structures in same collection
{
    "_id": ObjectId("..."),
    "type": "book",
    "title": "MongoDB: The Definitive Guide",
    "authors": ["Kristina Chodorow", "Michael Dirolf"],
    "isbn": "978-1449381561"
}
{
    "_id": ObjectId("..."),
    "type": "movie",
    "title": "The Social Network",
    "director": "David Fincher",
    "actors": ["Jesse Eisenberg", "Andrew Garfield"]
}
```

2. **Computed Pattern**:
```javascript
// Store computed values for faster retrieval
{
    "_id": ObjectId("..."),
    "name": "Online Store",
    "total_orders": 1250,
    "total_revenue": 48275.99,
    "avg_order_value": 38.62
}
```

3. **Bucket Pattern** (for time series data):
```javascript
// Group measurements into time-based buckets
{
    "_id": ObjectId("..."),
    "device_id": "thermostat-1",
    "date": ISODate("2023-01-01T00:00:00Z"),
    "measurements": [
        { "timestamp": ISODate("2023-01-01T00:05:00Z"), "temp": 22.5 },
        { "timestamp": ISODate("2023-01-01T00:10:00Z"), "temp": 22.7 },
        // More readings for the day
    ]
}
```

<a name="performance"></a>
### Performance Optimization

**Indexing Best Practices**:
- Create indexes for frequently queried fields
- Use compound indexes for queries with multiple fields
- Avoid creating unnecessary indexes (each index adds overhead)
- Consider the ESR (Equality, Sort, Range) rule for compound indexes
- Use covered queries (queries satisfied entirely by indexes)

**Query Optimization**:
- Use `.explain()` to analyze query performance
- Limit the number of documents returned
- Project only needed fields
- Use appropriate operators to match exactly what you need
- Avoid negation operators (`$ne`, `$nin`) when possible

**Handling Large Result Sets**:
```javascript
// Using cursor batch processing
var cursor = db.largeCollection.find();
while (cursor.hasNext()) {
    var batch = [];
    // Process documents in batches of 1000
    for (var i = 0; i < 1000 && cursor.hasNext(); i++) {
        batch.push(cursor.next());
    }
    // Process the batch
    processBatch(batch);
}
```

**Data Volume Best Practices**:
- Use proper data types (e.g., ISODate for dates)
- Consider field names (shorter names reduce document size)
- Use appropriate indexing for your access patterns
- Implement TTL indexes for temporal data
- Consider sharding for very large datasets

<a name="security"></a>
### Security Best Practices

**Authentication**:
```javascript
// Create a database user
db.createUser({
    user: "appUser",
    pwd: "securePassword",
    roles: [
        { role: "readWrite", db: "myApp" },
        { role: "read", db: "reporting" }
    ]
})

// Connect with authentication
mongo --username appUser --password securePassword --authenticationDatabase admin
```

**Authorization**:
```javascript
// Built-in roles include:
// - read, readWrite, dbAdmin, userAdmin, dbOwner
// - readAnyDatabase, readWriteAnyDatabase, userAdminAnyDatabase, dbAdminAnyDatabase
// - clusterAdmin, clusterManager, clusterMonitor, hostManager
// - backup, restore
// - root, __system

// Create a custom role
db.createRole({
    role: "analyticsUser",
    privileges: [
        {
            resource: { db: "reporting", collection: "" },
            actions: [ "find" ]
        },
        {
            resource: { db: "reporting", collection: "summaries" },
            actions: [ "insert", "update" ]
        }
    ],
    roles: []
})

// Grant role to a user
db.grantRolesToUser("analyst", ["analyticsUser"])
```

**Network Security**:
```
# In mongod.conf
net:
  bindIp: 127.0.0.1,192.168.1.10  # Only bind to specific IPs
  ssl:
    mode: requireSSL
    PEMKeyFile: /path/to/mongodb.pem
```

**Data Encryption**:
- At-rest encryption: Use MongoDB Enterprise's Encrypted Storage Engine
- In-transit encryption: Configure SSL/TLS for client connections
- Client-side field level encryption for sensitive data

<a name="real-world-examples"></a>
## 9. Real-World Examples

### Content Management System

A blog application with posts, comments, and tags:

```javascript
// Posts collection
db.posts.insertOne({
    _id: ObjectId(),
    title: "Getting Started with MongoDB",
    slug: "getting-started-with-mongodb",
    content: "MongoDB is a document database that offers high performance...",
    author: {
        _id: ObjectId("5f8d48b88c8d83a657a02a9d"),
        name: "John Doe",
        email: "john@example.com"
    },
    tags: ["mongodb", "nosql", "databases"],
    status: "published",
    comments_count: 2,
    views: 1250,
    created_at: ISODate("2023-01-15T10:00:00Z"),
    updated_at: ISODate("2023-01-16T15:30:00Z")
})

// Comments collection
db.comments.insertMany([
    {
        _id: ObjectId(),
        post_id: ObjectId("..."),
        author: {
            name: "Jane Smith",
            email: "jane@example.com"
        },
        content: "Great article! Very helpful for beginners.",
        approved: true,
        created_at: ISODate("2023-01-15T14:30:00Z")
    },
    {
        _id: ObjectId(),
        post_id: ObjectId("..."),
        author: {
            name: "Bob Johnson",
            email: "bob@example.com" 
        },
        content: "I have a question about indexing...",
        approved: true,
        created_at: ISODate("2023-01-16T09:15:00Z")
    }
])

// Find all published posts with a specific tag
db.posts.find({
    status: "published",
    tags: "mongodb"
})

// Get the most viewed posts
db.posts.find({ status: "published" })
        .sort({ views: -1 })
        .limit(5)

// Get posts with their comments
db.posts.aggregate([
    { $match: { status: "published" } },
    { $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post_id",
        as: "comments"
    }},
    { $project: {
        title: 1,
        content: 1,
        author: 1,
        comments: {
            $filter: {
                input: "$comments",
                as: "comment",
                cond: { $eq: ["$$comment.approved", true] }
            }
        }
    }}
])
```

### E-commerce Application

```javascript
// Products collection
db.products.insertOne({
    _id: ObjectId(),
    name: "Wireless Headphones",
    sku: "WH-1234",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 149.99,
    categories: ["electronics", "audio"],
    attributes: {
        color: "black",
        weight: "250g",
        bluetooth: "5.0"
    },
    inventory: {
        warehouse_A: 25,
        warehouse_B: 10
    },
    images: [
        "headphones_main.jpg",
        "headphones_side.jpg",
        "headphones_case.jpg"
    ],
    created_at: ISODate("2023-01-01T00:00:00Z")
})

// Orders collection
db.orders.insertOne({
    _id: ObjectId(),
    order_number: "ORD-12345",
    user_id: ObjectId("5f8d48b88c8d83a657a02a9d"),
    status: "shipped",
    shipping_address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA"
    },
    payment: {
        method: "credit_card",
        transaction_id: "txn_1234567890",
        amount: 173.98
    },
    items: [
        {
            product_id: ObjectId("..."),
            name: "Wireless Headphones",
            sku: "WH-1234",
            price: 149.99,
            quantity: 1
        },
        {
            product_id: ObjectId("..."),
            name: "Headphone Case",
            sku: "HC-5678",
            price: 23.99,
            quantity: 1
        }
    ],
    subtotal: 173.98,
    tax: 14.32,
    shipping: 5.99,
    total: 194.29,
    created_at: ISODate("2023-01-15T14:30:00Z"),
    updated_at: ISODate("2023-01-16T09:15:00Z")
})

// Find products in a specific category with inventory
db.products.find({
    categories: "electronics",
    "inventory.warehouse_A": { $gt: 0 }
})

// Get order history for a user
db.orders.find({
    user_id: ObjectId("5f8d48b88c8d83a657a02a9d")
}).sort({ created_at: -1 })

// Calculate sales by product
db.orders.aggregate([
    { $unwind: "$items" },
    { $group: {
        _id: "$items.product_id",
        total_sold: { $sum: "$items.quantity" },
        total_revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }},
    { $sort: { total_revenue: -1 } }
])
```

<a name="decision-flowchart"></a>
## 10. MongoDB Decision Flowchart

```
┌───────────────────┐
│ Should I use      │
│ MongoDB?          │──No──┐
└─────────┬─────────┘      │
          │                │
          │ Yes            ▼
          │          ┌──────────────────┐
          ▼          │ Consider SQL or  │
┌───────────────────┐ │ other database  │
│ Is schema flexible│ │ types           │
│ or evolving?      │─No─┘              │
└─────────┬─────────┘                   │
          │                             │
          │ Yes                         │
          ▼                             │
┌───────────────────┐                   │
│ Frequent writes   │                   │
│ or large volumes  │──No───┐           │
│ of data?          │       │           │
└─────────┬─────────┘       │           │
          │                 │           │
          │ Yes             │           │
          ▼                 ▼           │
┌───────────────────┐  ┌──────────────┐ │
│ Need multi-       │  │ MongoDB      │ │
│ document ACID     │  │ is likely    │ │
│ transactions?     │  │ suitable     │ │
└─────────┬─────────┘  └──────────────┘ │
          │                             │
          │ Yes                         │
          ▼                             │
┌───────────────────┐                   │
│ Using MongoDB 4.0+│──No───────────────┘
│ with replica sets │
│ or 4.2+ with      │
│ sharded clusters? │
└─────────┬─────────┘
          │
          │ Yes
          ▼
┌───────────────────┐
│ MongoDB is        │
│ a good choice     │
└───────────────────┘
```

### Should I embed or reference?

```
┌───────────────────┐
│ Relationship      │
│ type?             │
└─────────┬─────────┘
          │
          ├───────One-to-One───────┐
          │                        │
          │                        ▼
          │                ┌───────────────────┐
          │                │ Embed the related │
          │                │ document          │
          │                └───────────────────┘
          │
          ├───────One-to-Few───────┐
          │                        │
          │                        ▼
          │                ┌───────────────────┐
          │                │ Embed array of    │
          │                │ related documents │
          │                └───────────────────┘
          │
          ├───────One-to-Many──────┐
          │                        │
          │                        ▼
          │                ┌───────────────────┐
          │                │ Do you query the  │
          │                │ "many" objects    │──Yes─┐
          │                │ independently?    │      │
          │                └─────────┬─────────┘      │
          │                          │                │
          │                          │ No             │
          │                          ▼                ▼
          │                ┌───────────────────┐  ┌──────────────────┐
          │                │ Embed if array    │  │ Use references   │
          │                │ won't grow too    │  │ (store object IDs│
          │                │ large (< 1000)    │  │ in an array)     │
          │                └───────────────────┘  └──────────────────┘
          │
          └───────Many-to-Many─────┐
                                   │
                                   ▼
                           ┌───────────────────┐
                           │ Use references    │
                           │ with arrays of IDs│
                           │ on both sides or  │
                           │ a linking         │
                           │ collection        │
                           └───────────────────┘
```

### MongoDB Use Cases Decision Tree

```
┌───────────────────┐
│ What's your       │
│ primary use case? │
└─────────┬─────────┘
          │
          ├─────Content Management───────────┐
          │                                  │
          │                                  ▼
          │                          ┌───────────────────┐
          │                          │ MongoDB works well│
          │                          │ for CMS, catalogs,│
          │                          │ and content-heavy │
          │                          │ applications      │
          │                          └───────────────────┘
          │
          ├─────Real-time Analytics───────────┐
          │                                   │
          │                                   ▼
          │                           ┌───────────────────┐
          │                           │ MongoDB's         │
          │                           │ aggregation       │
          │                           │ framework is great│
          │                           │ for analytics     │
          │                           └───────────────────┘
          │
          ├─────Mobile App Backend────────────┐
          │                                   │
          │                                   ▼
          │                           ┌───────────────────┐
          │                           │ MongoDB works well│
          │                           │ for mobile with   │
          │                           │ flexible schema   │
          │                           │ and offline sync  │
          │                           └───────────────────┘
          │
          ├─────IoT Data Storage──────────────┐
          │                                   │
          │                                   ▼
          │                           ┌───────────────────┐
          │                           │ MongoDB can handle│
          │                           │ time-series data  │
          │                           │ and large volumes │
          │                           │ of IoT data       │
          │                           └───────────────────┘
          │
          └─────Financial Transactions─────────┐
                                              │
                                              ▼
                                      ┌───────────────────┐
                                      │ Need ACID         │
                                      │ transactions?     │
                                      └─────────┬─────────┘
                                                │
                                                ├──Yes─┐
                                                │      │
                                                │      ▼
                                                │ ┌──────────────────┐
                                                │ │ Use MongoDB 4.0+ │
                                                │ │ with transactions│
                                                │ │ or consider SQL  │
                                                │ │ for critical     │
                                                │ │ financial data   │
                                                │ └──────────────────┘
                                                │
                                                └──No──┐
                                                       │
                                                       ▼
                                               ┌───────────────────┐
                                               │ MongoDB works for │
                                               │ non-critical      │
                                               │ financial data and│
                                               │ analytics         │
                                               └───────────────────┘
```

## Summary

MongoDB is a powerful, flexible document database that excels at handling semi-structured data with evolving schemas. Its document-based approach aligns well with modern programming paradigms, making it a popular choice for web and mobile applications. Key features include high performance for read/write operations, horizontal scalability through sharding, and robust query capabilities with the aggregation framework.

While MongoDB trades some traditional RDBMS features for performance and flexibility, recent versions have added support for multi-document ACID transactions and other enterprise features. Understanding when to use MongoDB—and how to design effective schemas—is crucial for success.

This guide covered MongoDB from basic concepts to advanced operations, providing practical examples for both the MongoDB shell and Python applications. By following the best practices outlined here, you can build efficient, scalable, and maintainable applications using MongoDB.
