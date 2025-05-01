# API Pagination in Python: Comprehensive Guide

## Table of Contents
- [Introduction](#introduction)
- [Pagination Strategies](#pagination-strategies)
  - [Offset-Based Pagination](#offset-based-pagination)
  - [Cursor-Based Pagination](#cursor-based-pagination)
  - [Page-Based Pagination](#page-based-pagination)
  - [Keyset Pagination](#keyset-pagination)
  - [Time-Based Pagination](#time-based-pagination)
- [Implementation with Python Frameworks](#implementation-with-python-frameworks)
  - [Flask Implementation](#flask-implementation)
  - [FastAPI Implementation](#fastapi-implementation)
  - [Django REST Framework](#django-rest-framework)
- [Response Formats](#response-formats)
- [Client-Side Handling](#client-side-handling)
- [Performance Considerations](#performance-considerations)
- [Best Practices](#best-practices)
- [Advanced Topics](#advanced-topics)
- [Summary](#summary)

## Introduction

Pagination is a technique used in API design to divide large result sets into smaller, more manageable chunks (pages). Instead of returning all results at once, which could overwhelm both the server and client, pagination allows for incremental data retrieval.

### Why Pagination Matters

1. **Performance**: Reduces server load and response time
2. **Bandwidth**: Minimizes data transfer between server and client
3. **User Experience**: Makes large datasets more manageable
4. **Resource Management**: Prevents memory overflow with large datasets

### Key Pagination Concepts

| Concept | Description |
|---------|-------------|
| Page Size | Number of items in a single page (limit) |
| Page Number | Current page being accessed (for page-based) |
| Offset | Number of items to skip (for offset-based) |
| Cursor | Pointer to a specific item (for cursor-based) |
| Links | Navigation references to prev/next/first/last pages |
| Total Count | Total number of items across all pages |

## Pagination Strategies

### Offset-Based Pagination

Offset-based pagination uses `limit` and `offset` parameters to navigate through results.

```python
# Offset-based pagination with SQLAlchemy
# Import required libraries
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
db = SQLAlchemy(app)

# Define a simple model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

@app.route('/products', methods=['GET'])
def get_products():
    # Get pagination parameters from query string with defaults
    limit = request.args.get('limit', default=10, type=int)  # Number of items per page
    offset = request.args.get('offset', default=0, type=int)  # Number of items to skip
    
    # Validate and cap the limit to prevent excessive queries
    if limit > 100:
        limit = 100
    
    # Query products with pagination
    products = Product.query.order_by(Product.id).limit(limit).offset(offset).all()
    
    # Get total count for metadata
    total_count = Product.query.count()
    
    # Transform to dictionary
    result = [{
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'created_at': product.created_at.isoformat()
    } for product in products]
    
    # Create response with metadata
    response = {
        'data': result,
        'metadata': {
            'limit': limit,
            'offset': offset,
            'total_count': total_count,
            'has_more': (offset + limit) < total_count
        }
    }
    
    # Add navigation links
    if offset > 0:
        response['metadata']['prev'] = f"/products?limit={limit}&offset={max(0, offset-limit)}"
    
    if (offset + limit) < total_count:
        response['metadata']['next'] = f"/products?limit={limit}&offset={offset+limit}"
    
    return jsonify(response)
```

**Advantages:**
- Simple to implement
- Works well with most databases
- Allows jumping to specific pages

**Disadvantages:**
- Performance degrades with large offsets
- Risk of missing or duplicating items if data changes between requests

### Cursor-Based Pagination

Cursor-based pagination uses a pointer (cursor) to navigate through results.

```python
# Cursor-based pagination with Flask and SQLAlchemy
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import base64
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

@app.route('/users', methods=['GET'])
def get_users():
    # Get limit from query string with default
    limit = request.args.get('limit', default=10, type=int)
    
    # Get cursor from query string
    cursor = request.args.get('cursor', default=None)
    
    # Cap limit to avoid excessive queries
    if limit > 100:
        limit = 100
    
    # Base query - order by created_at and then id for stability
    query = User.query.order_by(User.created_at.desc(), User.id.desc())
    
    # Apply cursor if provided
    if cursor:
        try:
            # Decode cursor to get the reference point
            cursor_data = json.loads(base64.b64decode(cursor.encode()).decode())
            created_at = cursor_data.get('created_at')
            last_id = cursor_data.get('id')
            
            # Filter results to start after the cursor
            if created_at and last_id:
                query = query.filter(
                    (User.created_at < created_at) | 
                    ((User.created_at == created_at) & (User.id < last_id))
                )
        except Exception as e:
            # Handle invalid cursor
            return jsonify({'error': 'Invalid cursor'}), 400
    
    # Execute query with limit
    users = query.limit(limit + 1).all()  # Fetch one extra to check if more results exist
    
    # Check if there are more results
    has_more = len(users) > limit
    if has_more:
        users = users[:limit]  # Trim the extra item
    
    # Transform to dictionary
    result = [{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'created_at': user.created_at.isoformat()
    } for user in users]
    
    # Prepare response
    response = {
        'data': result,
        'metadata': {
            'limit': limit,
            'has_more': has_more
        }
    }
    
    # Generate next cursor if there are more results
    if has_more and users:
        last_user = users[-1]
        cursor_data = {
            'created_at': last_user.created_at.isoformat(),
            'id': last_user.id
        }
        # Encode the cursor
        next_cursor = base64.b64encode(json.dumps(cursor_data).encode()).decode()
        response['metadata']['next_cursor'] = next_cursor
    
    return jsonify(response)
```

**Advantages:**
- Consistent performance regardless of dataset size
- No risk of duplicates or missed items when data changes
- Better for real-time data

**Disadvantages:**
- More complex to implement
- Can't jump to arbitrary positions in the dataset
- Requires stable sort keys

### Page-Based Pagination

Page-based pagination uses a page number and page size.

```python
# Page-based pagination with Flask and SQLAlchemy
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import math

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
db = SQLAlchemy(app)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    published_at = db.Column(db.DateTime, default=db.func.current_timestamp())

@app.route('/articles', methods=['GET'])
def get_articles():
    # Get pagination parameters from query string
    page = request.args.get('page', default=1, type=int)  # Current page number
    per_page = request.args.get('per_page', default=10, type=int)  # Items per page
    
    # Ensure page and per_page are positive
    if page < 1:
        page = 1
    if per_page < 1:
        per_page = 10
    
    # Cap per_page to avoid excessive queries
    if per_page > 100:
        per_page = 100
    
    # Calculate offset from page number
    offset = (page - 1) * per_page
    
    # Query articles with pagination
    articles = Article.query.order_by(Article.published_at.desc()).offset(offset).limit(per_page).all()
    
    # Get total count for metadata
    total_count = Article.query.count()
    
    # Calculate total pages
    total_pages = math.ceil(total_count / per_page)
    
    # Transform to dictionary
    result = [{
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'published_at': article.published_at.isoformat()
    } for article in articles]
    
    # Create response with pagination metadata
    response = {
        'data': result,
        'metadata': {
            'page': page,
            'per_page': per_page,
            'total_count': total_count,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }
    
    # Add navigation links
    base_url = '/articles?per_page=' + str(per_page)
    
    if page > 1:
        response['metadata']['prev'] = f"{base_url}&page={page-1}"
    if page < total_pages:
        response['metadata']['next'] = f"{base_url}&page={page+1}"
    
    response['metadata']['first'] = f"{base_url}&page=1"
    response['metadata']['last'] = f"{base_url}&page={total_pages}"
    
    return jsonify(response)
```

**Advantages:**
- Familiar to users (like book pages)
- Easy to implement in UIs with page numbers
- Good for fixed content that doesn't change often

**Disadvantages:**
- Same performance issues as offset-based with large datasets
- Risk of inconsistency if data changes between requests

### Keyset Pagination

Keyset pagination (also known as seek pagination) uses the values of the last seen record to determine the starting point for the next page.

```python
# Keyset pagination with SQLAlchemy
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
db = SQLAlchemy(app)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    department = db.Column(db.String(100), nullable=False)

@app.route('/employees', methods=['GET'])
def get_employees():
    # Get pagination parameters
    limit = request.args.get('limit', default=10, type=int)
    
    # Get last seen values (the "keyset")
    last_id = request.args.get('last_id', type=int)
    last_salary = request.args.get('last_salary', type=float)
    
    # Cap limit
    if limit > 100:
        limit = 100
    
    # Start building the query
    query = Employee.query.order_by(Employee.salary.desc(), Employee.id.asc())
    
    # Apply keyset filtering if provided
    if last_salary is not None and last_id is not None:
        query = query.filter(
            # Either salary is less than last salary
            (Employee.salary < last_salary) | 
            # Or salary is equal but ID is greater (for stability)
            ((Employee.salary == last_salary) & (Employee.id > last_id))
        )
    
    # Execute the query with limit
    employees = query.limit(limit).all()
    
    # Transform to dictionary
    result = [{
        'id': emp.id,
        'name': emp.name,
        'salary': emp.salary,
        'department': emp.department
    } for emp in employees]
    
    # Create response
    response = {
        'data': result,
        'metadata': {
            'limit': limit
        }
    }
    
    # Generate next page link if we have results
    if employees:
        last_employee = employees[-1]
        response['metadata']['next'] = (
            f"/employees?limit={limit}&last_id={last_employee.id}"
            f"&last_salary={last_employee.salary}"
        )
    
    return jsonify(response)
```

**Advantages:**
- Better performance than offset-based for large datasets
- No risk of missed or duplicated items when data changes
- More efficient database queries (can use indexes effectively)

**Disadvantages:**
- More complex to implement
- Requires careful selection of keyset columns
- More complex to navigate to arbitrary positions

### Time-Based Pagination

Time-based pagination uses timestamps as cursors for time-ordered data.

```python
# Time-based pagination with Flask and SQLAlchemy
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
db = SQLAlchemy(app)

class LogEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(500), nullable=False)
    level = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

@app.route('/logs', methods=['GET'])
def get_logs():
    # Get pagination parameters
    limit = request.args.get('limit', default=50, type=int)
    
    # Get timestamp parameter
    before_time = request.args.get('before', default=None)
    
    # Cap limit
    if limit > 1000:
        limit = 1000
    
    # Start building the query
    query = LogEntry.query.order_by(LogEntry.timestamp.desc())
    
    # Apply time filter if provided
    if before_time:
        try:
            # Parse timestamp string to datetime
            before_datetime = datetime.fromisoformat(before_time)
            query = query.filter(LogEntry.timestamp < before_datetime)
        except ValueError:
            return jsonify({'error': 'Invalid timestamp format'}), 400
    
    # Execute query with limit
    logs = query.limit(limit + 1).all()  # Fetch one extra to check if more results exist
    
    # Check if there are more results
    has_more = len(logs) > limit
    if has_more:
        logs = logs[:limit]  # Trim the extra item
    
    # Transform to dictionary
    result = [{
        'id': log.id,
        'message': log.message,
        'level': log.level,
        'timestamp': log.timestamp.isoformat()
    } for log in logs]
    
    # Prepare response
    response = {
        'data': result,
        'metadata': {
            'limit': limit,
            'has_more': has_more
        }
    }
    
    # Generate next link if there are more results
    if has_more and logs:
        last_log = logs[-1]
        response['metadata']['next'] = f"/logs?limit={limit}&before={last_log.timestamp.isoformat()}"
    
    return jsonify(response)
```

**Advantages:**
- Natural for time-series data like logs, activities, news feeds
- Simple to implement and understand
- Efficient for continuously updating data

**Disadvantages:**
- Only works well for time-ordered data
- Potential for missed items if multiple items have identical timestamps

## Implementation with Python Frameworks

### Flask Implementation

Here's a more complete Flask implementation with SQLAlchemy using cursor-based pagination:

```python
# Flask implementation with cursor-based pagination
from flask import Flask, request, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
import base64
import json
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pagination_example.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the model
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat()
        }

# Create the database and tables
@app.before_first_request
def create_tables():
    db.create_all()

# Helper functions for cursor pagination
def encode_cursor(post):
    # Create a cursor from a post object
    cursor_data = {
        'id': post.id,
        'created_at': post.created_at.isoformat()
    }
    # Encode to base64 for URL-friendly cursor
    return base64.b64encode(json.dumps(cursor_data).encode()).decode()

def decode_cursor(cursor):
    # Decode cursor from base64
    try:
        cursor_data = json.loads(base64.b64decode(cursor.encode()).decode())
        created_at = datetime.fromisoformat(cursor_data.get('created_at'))
        post_id = cursor_data.get('id')
        return created_at, post_id
    except Exception as e:
        # Handle invalid cursor
        return None, None

# Route to get paginated posts
@app.route('/api/posts', methods=['GET'])
def get_posts():
    # Get pagination parameters
    limit = min(int(request.args.get('limit', 10)), 100)  # Max 100 items
    cursor = request.args.get('cursor')
    
    # Start building the query - order by created_at (desc) and then id
    query = Post.query.order_by(Post.created_at.desc(), Post.id.desc())
    
    # Apply cursor filtering if cursor is provided
    if cursor:
        created_at, post_id = decode_cursor(cursor)
        if created_at and post_id:
            # Filter results that come after the cursor
            query = query.filter(
                (Post.created_at < created_at) | 
                ((Post.created_at == created_at) & (Post.id < post_id))
            )
        else:
            return jsonify({'error': 'Invalid cursor'}), 400
    
    # Execute query
    posts = query.limit(limit + 1).all()  # Get one extra to check for next page
    
    # Check if there's a next page
    has_next = len(posts) > limit
    if has_next:
        posts = posts[:limit]  # Remove the extra item
    
    # Build response
    results = [post.to_dict() for post in posts]
    
    # Create response object with pagination metadata
    response = {
        'data': results,
        'pagination': {
            'limit': limit,
            'has_next': has_next,
        }
    }
    
    # Add next cursor if there's more data
    if has_next and posts:
        next_cursor = encode_cursor(posts[-1])
        response['pagination']['next_cursor'] = next_cursor
        response['pagination']['next_url'] = url_for(
            'get_posts', 
            limit=limit, 
            cursor=next_cursor, 
            _external=True
        )
    
    return jsonify(response)

# Route to create sample posts (for testing)
@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'error': 'Missing title or content'}), 400
    
    post = Post(title=data['title'], content=data['content'])
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True)
```

### FastAPI Implementation

FastAPI is a modern, high-performance web framework for building APIs with Python 3.6+. Here's how to implement cursor-based pagination:

```python
# FastAPI implementation with cursor-based pagination
from fastapi import FastAPI, Query, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import base64
import json

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./pagination_example.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model
class PostDB(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models for request/response
class PostCreate(BaseModel):
    title: str
    content: str

class Post(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class PaginatedResponse(BaseModel):
    data: List[Post]
    pagination: dict

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions for cursor pagination
def encode_cursor(post: PostDB) -> str:
    cursor_data = {
        'id': post.id,
        'created_at': post.created_at.isoformat()
    }
    return base64.b64encode(json.dumps(cursor_data).encode()).decode()

def decode_cursor(cursor: str):
    try:
        cursor_data = json.loads(base64.b64decode(cursor.encode()).decode())
        created_at = datetime.fromisoformat(cursor_data.get('created_at'))
        post_id = cursor_data.get('id')
        return created_at, post_id
    except Exception:
        return None, None

app = FastAPI(title="Pagination Example API")

# Route to get paginated posts
@app.get("/posts", response_model=PaginatedResponse)
def read_posts(
    cursor: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Start building the query
    query = db.query(PostDB).order_by(desc(PostDB.created_at), desc(PostDB.id))
    
    # Apply cursor if provided
    if cursor:
        created_at, post_id = decode_cursor(cursor)
        if created_at and post_id:
            query = query.filter(
                (PostDB.created_at < created_at) | 
                ((PostDB.created_at == created_at) & (PostDB.id < post_id))
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid cursor")
    
    # Execute query with limit + 1
    posts = query.limit(limit + 1).all()
    
    # Check if there's a next page
    has_next = len(posts) > limit
    if has_next:
        posts = posts[:limit]
    
    # Build the response
    pagination = {
        "limit": limit,
        "has_next": has_next
    }
    
    # Add next cursor if there's more data
    if has_next and posts:
        next_cursor = encode_cursor(posts[-1])
        pagination["next_cursor"] = next_cursor
        pagination["next_url"] = f"/posts?cursor={next_cursor}&limit={limit}"
    
    return {
        "data": posts,
        "pagination": pagination
    }

# Route to create a post
@app.post("/posts", response_model=Post, status_code=201)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = PostDB(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
```

### Django REST Framework

Django REST Framework provides built-in pagination classes:

```python
# Django REST Framework pagination example
# In settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10,
}

# Or define custom pagination class in your app
# In your_app/pagination.py
from rest_framework.pagination import CursorPagination
from rest_framework.response import Response

class CustomCursorPagination(CursorPagination):
    page_size = 10
    max_page_size = 100
    page_size_query_param = 'page_size'
    cursor_query_param = 'cursor'
    ordering = '-created_at'
    
    def get_paginated_response(self, data):
        return Response({
            'data': data,
            'pagination': {
                'next_cursor': self.get_next_link().split('cursor=')[1] if self.get_next_link() else None,
                'previous_cursor': self.get_previous_link().split('cursor=')[1] if self.get_previous_link() else None,
                'has_next': self.get_next_link() is not None,
                'has_previous': self.get_previous_link() is not None,
                'page_size': self.page_size
            }
        })

# In views.py
from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer
from .pagination import CustomCursorPagination

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
    pagination_class = CustomCursorPagination
```

## Response Formats

### Standardized Response Structure

A well-designed paginated API response should include:

```
{
  "data": [...],           // The actual data items
  "pagination": {          // Metadata about pagination
    "page_size": 10,       // Items per page
    "total_items": 238,    // Total items (optional)
    "total_pages": 24,     // Total pages (optional)
    "current_page": 3,     // Current page number (for page-based)
    "has_next": true,      // Whether there are more pages
    "has_previous": true,  // Whether there are previous pages
    "next": "...",         // Link to next page
    "previous": "..."      // Link to previous page
  }
}
```

### HATEOAS-Compliant Format

For REST APIs following HATEOAS (Hypermedia as the Engine of Application State):

```
{
  "data": [...],
  "_links": {
    "self": {"href": "/api/resources?page=3&per_page=10"},
    "first": {"href": "/api/resources?page=1&per_page=10"},
    "prev": {"href": "/api/resources?page=2&per_page=10"},
    "next": {"href": "/api/resources?page=4&per_page=10"},
    "last": {"href": "/api/resources?page=24&per_page=10"}
  },
  "_meta": {
    "page": 3,
    "per_page": 10,
    "total_pages": 24,
    "total_items": 238
  }
}
```

## Client-Side Handling

### Python Client Example

Here's how a client might handle pagination:

```python
# Client-side handling of paginated API
import requests

def fetch_all_pages(base_url, params=None):
    """Fetches all pages from a paginated API using cursor-based pagination"""
    if params is None:
        params = {}
    
    all_results = []
    next_cursor = None
    
    while True:
        # Add cursor to params if we have one
        if next_cursor:
            params['cursor'] = next_cursor
        
        # Make the request
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Parse the response
        data = response.json()
        
        # Add the current page's data to our results
        all_results.extend(data['data'])
        
        # Check if there's a next page
        if data['pagination'].get('has_next') and data['pagination'].get('next_cursor'):
            next_cursor = data['pagination']['next_cursor']
        else:
            # No more pages, exit loop
            break
    
    return all_results

# Example usage
all_posts = fetch_all_pages('https://api.example.com/posts', {'limit': 50})
print(f"Fetched {len(all_posts)} posts in total")
```

### Async Client Example (Python 3.7+)

For better performance with large datasets:

```python
# Async client for pagination
import asyncio
import aiohttp

async def fetch_all_pages_async(base_url, params=None):
    """Fetches all pages from a paginated API asynchronously"""
    if params is None:
        params = {}
    
    all_results = []
    next_cursor = None
    
    async with aiohttp.ClientSession() as session:
        while True:
            # Add cursor to params if we have one
            request_params = params.copy()
            if next_cursor:
                request_params['cursor'] = next_cursor
            
            # Make the request
            async with session.get(base_url, params=request_params) as response:
                if response.status != 200:
                    text = await response.text()
                    raise Exception(f"API error: {response.status} - {text}")
                
                # Parse the response
                data = await response.json()
                
                # Add the current page's data to our results
                all_results.extend(data['data'])
                
                # Check if there's a next page
                if data['pagination'].get('has_next') and data['pagination'].get('next_cursor'):
                    next_cursor = data['pagination']['next_cursor']
                else:
                    # No more pages, exit loop
                    break
    
    return all_results

# Example usage
async def main():
    all_posts = await fetch_all_pages_async('https://api.example.com/posts', {'limit': 50})
    print(f"Fetched {len(all_posts)} posts in total")

# Run the async function
asyncio.run(main())  # Python 3.7+
```

## Performance Considerations

### Optimizing Database Queries

```python
# Example of optimizing a paginated query in SQLAlchemy
from sqlalchemy import func

@app.route('/optimized-products', methods=['GET'])
def get_optimized_products():
    limit = min(int(request.args.get('limit', 10)), 100)
    offset = int(request.args.get('offset', 0))
    
    # Use a subquery to get just the IDs first (much faster)
    subquery = (
        db.session.query(Product.id)
        .order_by(Product.id)
        .offset(offset)
        .limit(limit)
        .subquery()
    )
    
    # Then join to get the full rows for just those IDs
    products = (
        db.session.query(Product)
        .join(subquery, Product.id == subquery.c.id)
        .all()
    )
    
    # Count total in a separate query with optimization
    total_count = db.session.query(func.count(Product.id)).scalar()
    
    # Rest of the function as before...
```

### Caching Strategies

```python
# Example using simple in-memory caching for counts
import functools
from datetime import datetime, timedelta

# Cache for total counts (expires after 10 minutes)
count_cache = {}

def cached_count(model):
    """Caches and returns the count of a model"""
    cache_key = model.__tablename__
    
    # Check if we have a valid cache entry
    if cache_key in count_cache:
        timestamp, count = count_cache[cache_key]
        if datetime.now() - timestamp < timedelta(minutes=10):
            return count
    
    # No valid cache, get fresh count
    count = db.session.query(func.count(model.id)).scalar()
    
    # Update cache
    count_cache[cache_key] = (datetime.now(), count)
    
    return count

@app.route('/cached-products', methods=['GET'])
def get_cached_products():
    # Rest of function as before but use cached_count
    total_count = cached_count(Product)
    # ...
```

## Best Practices

### Summary of Pagination Best Practices

| Practice | Description |
|----------|-------------|
| Document Your Pagination | Clearly document how pagination works in your API |
| Consistent Response Format | Use a consistent format across all paginated endpoints |
| Appropriate Strategy | Choose pagination strategy based on data and use case |
| Default Values | Always provide sensible defaults for page size and page number |
| Maximum Page Size | Set a maximum page size to prevent server overload |
| Include Metadata | Provide pagination metadata in responses |
| HATEOAS Links | Include navigation links in responses |
| Handle Edge Cases | Properly handle first/last pages and error conditions |
| Efficient Queries | Optimize database queries for performance |
| Consider Caching | Cache counts and common page results |
| Proper HTTP Status Codes | Use 400 for invalid pagination params, not 404 |

### Common Pitfalls to Avoid

1. **Inconsistent parameter names**: Use consistent naming across endpoints
2. **Missing validation**: Always validate pagination parameters
3. **No maximum limit**: Always set a maximum page size
4. **Inefficient count queries**: Optimize or cache count queries
5. **Returning 404 for empty pages**: Return empty arrays, not 404
6. **Forgetting about indexing**: Ensure database indexes for sorted/filtered fields
7. **Not handling data changes**: Be aware of data changing between requests

## Lucene Syntax for API Queries

Lucene query syntax provides a powerful way to filter data before pagination is applied. This is especially useful when working with search-heavy applications or when you need to offer users advanced filtering capabilities.

### Introduction to Lucene Syntax

Lucene syntax is a query language that allows for complex searches with features like:

- Boolean operators (`AND`, `OR`, `NOT`)
- Field-specific searches (`field:value`)
- Phrase searches (`"exact phrase"`)
- Wildcard searches (`te?t`, `test*`)
- Fuzzy searches (`word~`)
- Range queries (`price:[100 TO 200]`)
- Proximity searches (`"word1 word2"~10`)
- Boosting terms (`important^10`)

### Implementing Lucene-Style Queries with Pagination

```python
# Flask implementation with Lucene-style query parsing and pagination
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, and_
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///search_example.db'
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    in_stock = db.Column(db.Boolean, default=True)

# Simple Lucene-style query parser
def parse_lucene_query(query_string, model):
    # If empty query, return None (no filter)
    if not query_string or query_string.strip() == '':
        return None
    
    # Split the query on whitespace but respect quoted phrases
    def split_with_quotes(text):
        pattern = r'([^\s"]+)|"([^"]*)"'
        return [match[0] or match[1] for match in re.findall(pattern, text)]
    
    terms = split_with_quotes(query_string)
    filters = []
    
    for term in terms:
        # Check if the term is a field search (field:value)
        if ':' in term:
            field, value = term.split(':', 1)
            
            # Handle field exists in the model
            if hasattr(model, field):
                model_field = getattr(model, field)
                
                # Handle range queries [min TO max]
                if value.startswith('[') and ' TO ' in value and value.endswith(']'):
                    min_val, max_val = value[1:-1].split(' TO ')
                    
                    # Handle numeric ranges
                    if field == 'price':
                        try:
                            filters.append(model_field.between(float(min_val), float(max_val)))
                        except ValueError:
                            # If conversion fails, do a simple LIKE
                            filters.append(model_field.like(f'%{value}%'))
                    else:
                        filters.append(model_field.between(min_val, max_val))
                
                # Handle special boolean fields
                elif field == 'in_stock' and value.lower() in ('true', 'false'):
                    filters.append(model_field == (value.lower() == 'true'))
                
                # Handle wildcard searches
                elif '*' in value or '?' in value:
                    # Replace Lucene wildcards with SQL wildcards
                    sql_pattern = value.replace('*', '%').replace('?', '_')
                    filters.append(model_field.like(sql_pattern))
                
                # Handle fuzzy searches with ~
                elif value.endswith('~'):
                    fuzzy_value = value[:-1]
                    # Simple implementation: just use LIKE with %value%
                    filters.append(model_field.like(f'%{fuzzy_value}%'))
                
                # Default: exact match
                else:
                    filters.append(model_field == value)
        
        # Handle AND, OR, NOT
        elif term.upper() in ('AND', 'OR', 'NOT'):
            # These would be handled in a more sophisticated parser
            # For this simple example, we'll ignore them
            continue
        
        # Default: search all text fields
        else:
            # Check if term is a quoted phrase
            if term.startswith('"') and term.endswith('"'):
                term = term[1:-1]  # Remove quotes
                
                # Search for exact phrase in text fields
                text_search = []
                for field_name in ['name', 'description', 'category']:
                    if hasattr(model, field_name):
                        text_search.append(getattr(model, field_name) == term)
                
                if text_search:
                    filters.append(or_(*text_search))
            else:
                # Search for term in text fields
                text_search = []
                for field_name in ['name', 'description', 'category']:
                    if hasattr(model, field_name):
                        text_search.append(getattr(model, field_name).like(f'%{term}%'))
                
                if text_search:
                    filters.append(or_(*text_search))
    
    # Combine all filters with AND
    if filters:
        return and_(*filters)
    return None

@app.route('/api/search', methods=['GET'])
def search_products():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    # Get search query
    q = request.args.get('q', '')
    
    # Build base query
    query = Product.query
    
    # Apply Lucene-style search filter
    search_filter = parse_lucene_query(q, Product)
    if search_filter is not None:
        query = query.filter(search_filter)
    
    # Get total count for this search
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    products = query.order_by(Product.id).offset(offset).limit(per_page).all()
    
    # Calculate total pages
    total_pages = (total_count + per_page - 1) // per_page
    
    # Prepare results
    results = [{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'category': p.category,
        'in_stock': p.in_stock
    } for p in products]
    
    # Build response with pagination metadata
    response = {
        'data': results,
        'metadata': {
            'page': page,
            'per_page': per_page,
            'total_count': total_count,
            'total_pages': total_pages,
            'query': q,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }
    
    # Add navigation links
    base_url = f'/api/search?q={q}&per_page={per_page}'
    if page > 1:
        response['metadata']['prev'] = f"{base_url}&page={page-1}"
    if page < total_pages:
        response['metadata']['next'] = f"{base_url}&page={page+1}"
    
    return jsonify(response)
```

### Elasticsearch Integration Example

For more powerful search capabilities, you can integrate Elasticsearch with your Python API:

```python
# Flask with Elasticsearch and pagination
from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
import math

app = Flask(__name__)
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

@app.route('/api/search', methods=['GET'])
def search():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    size = min(request.args.get('size', 10, type=int), 100)
    
    # Get search query (raw Lucene syntax)
    query_string = request.args.get('q', '')
    
    # Calculate from for pagination
    from_value = (page - 1) * size
    
    # Build Elasticsearch query
    if query_string:
        body = {
            'query': {
                'query_string': {
                    'query': query_string,
                    'fields': ['title', 'content', 'tags'],
                    'default_operator': 'AND'
                }
            },
            'from': from_value,
            'size': size,
            'sort': [
                {'_score': {'order': 'desc'}},
                {'created_at': {'order': 'desc'}}
            ]
        }
    else:
        # No query, just return recent items
        body = {
            'query': {'match_all': {}},
            'from': from_value,
            'size': size,
            'sort': [{'created_at': {'order': 'desc'}}]
        }
    
    # Execute search
    results = es.search(index='documents', body=body)
    
    # Extract search results
    hits = results['hits']['hits']
    total = results['hits']['total']['value']
    
    # Transform results
    documents = [{
        'id': hit['_id'],
        'title': hit['_source'].get('title', ''),
        'content': hit['_source'].get('content', ''),
        'tags': hit['_source'].get('tags', []),
        'created_at': hit['_source'].get('created_at', ''),
        'score': hit['_score']
    } for hit in hits]
    
    # Calculate total pages
    total_pages = math.ceil(total / size)
    
    # Prepare response with pagination metadata
    response = {
        'data': documents,
        'metadata': {
            'page': page,
            'size': size,
            'total': total,
            'total_pages': total_pages,
            'query': query_string,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }
    
    # Add navigation links
    base_url = f'/api/search?q={query_string}&size={size}'
    if page > 1:
        response['metadata']['prev'] = f"{base_url}&page={page-1}"
    if page < total_pages:
        response['metadata']['next'] = f"{base_url}&page={page+1}"
    
    return jsonify(response)
```

### Combining Filtering, Sorting, and Pagination

For a complete API, combine Lucene syntax with sorting and pagination:

```python
# FastAPI example with filtering, sorting, and pagination
from fastapi import FastAPI, Query, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, Boolean, desc, asc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from pydantic import BaseModel
import re

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./search_example.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model
class ProductDB(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    price = Column(Float, nullable=False, index=True)
    category = Column(String(50), index=True)
    in_stock = Column(Boolean, default=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class Product(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    in_stock: bool = True
    
    class Config:
        orm_mode = True

class PaginatedResponse(BaseModel):
    data: List[Product]
    metadata: dict

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Your Lucene parser function would go here
# (Same as in the Flask example above)

app = FastAPI(title="Search API Example")

@app.get("/products", response_model=PaginatedResponse)
def search_products(
    q: Optional[str] = None,
    sort_by: Optional[str] = "id",
    sort_dir: Optional[str] = "asc",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Start building the query
    query = db.query(ProductDB)
    
    # Apply search filter if provided
    if q:
        search_filter = parse_lucene_query(q, ProductDB)
        if search_filter is not None:
            query = query.filter(search_filter)
    
    # Get total count
    total_count = query.count()
    
    # Apply sorting
    # Validate sort_by field exists in model
    if not hasattr(ProductDB, sort_by):
        sort_by = "id"  # Default if invalid field
    
    # Get the model field to sort by
    sort_field = getattr(ProductDB, sort_by)
    
    # Apply sort direction
    if sort_dir.lower() == "desc":
        query = query.order_by(desc(sort_field))
    else:
        query = query.order_by(asc(sort_field))
    
    # Apply pagination
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    
    # Calculate total pages
    total_pages = (total_count + page_size - 1) // page_size
    
    # Build response
    response = {
        "data": items,
        "metadata": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
            "query": q if q else "",
            "sort_by": sort_by,
            "sort_dir": sort_dir
        }
    }
    
    # Add navigation links
    base_url = f"/products?sort_by={sort_by}&sort_dir={sort_dir}&page_size={page_size}"
    if q:
        base_url += f"&q={q}"
    
    if page > 1:
        response["metadata"]["prev"] = f"{base_url}&page={page-1}"
    if page < total_pages:
        response["metadata"]["next"] = f"{base_url}&page={page+1}"
    
    return response
```

### Best Practices for Combining Search and Pagination

1. **Index Your Database Fields**: Ensure fields used in search queries and sorting are properly indexed
2. **Validate Search Parameters**: Always validate and sanitize Lucene queries to prevent injection attacks
3. **Consider Performance**: Complex search queries + pagination can be expensive; consider caching results
4. **Consistent Response Format**: Keep the same pagination structure for both search and regular endpoints
5. **Document Query Syntax**: Clearly document the supported Lucene syntax for your API users
6. **Handle Parsing Errors**: Gracefully handle malformed queries with clear error messages
7. **Limit Query Complexity**: Consider setting limits on query complexity for public APIs
8. **Provide Sorting Options**: Allow users to sort search results before pagination is applied
9. **Consider Search Pagination Trade-offs**:
   - Offset pagination is simpler but less efficient for deep pages
   - Cursor-based pagination is more efficient but harder to implement with complex search

### Full-Text Search Engines

For serious search capabilities, consider using dedicated search engines:

| Engine | Python Library | Features | Best For |
|--------|---------------|----------|----------|
| Elasticsearch | elasticsearch-py | Full Lucene syntax, distributed, scalable | Enterprise applications, complex search |
| Solr | pysolr | Full Lucene syntax, mature, rich features | Document-heavy applications |
| MeiliSearch | meilisearch-python | Typo-tolerant, fast, simple | User-facing search, developer-friendly |
| Typesense | typesense-python | Typo tolerance, geo search, fast | Developer-friendly alternative to Elasticsearch |
| PostgreSQL FTS | psycopg2 + SQLAlchemy | Integrated with database, tsvector | Applications already using PostgreSQL |

## Filtering Approaches

Beyond Lucene syntax, there are several common patterns for implementing filtering in REST APIs that work well with pagination.

### URL Parameter Basic Filtering

The simplest approach is to use URL parameters directly as filters:

```python
# Basic URL parameter filtering with Flask
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///filter_example.db'
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    state = db.Column(db.String(20), default='active')
    seller_id = db.Column(db.Integer)

@app.route('/products', methods=['GET'])
def get_products():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    # Start building the query
    query = Product.query
    
    # Apply exact match filters from URL parameters
    if 'state' in request.args:
        query = query.filter(Product.state == request.args.get('state'))
    
    if 'seller_id' in request.args:
        query = query.filter(Product.seller_id == request.args.get('seller_id'))
    
    if 'category' in request.args:
        query = query.filter(Product.category == request.args.get('category'))
    
    # Get total count for this filtered query
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    products = query.order_by(Product.id).offset(offset).limit(per_page).all()
    
    # Transform to dictionaries
    result = [{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'category': p.category,
        'state': p.state,
        'seller_id': p.seller_id
    } for p in products]
    
    # Build response with metadata
    response = {
        'data': result,
        'metadata': {
            'page': page,
            'per_page': per_page,
            'total_count': total_count,
            'total_pages': (total_count + per_page - 1) // per_page
        }
    }
    
    return jsonify(response)
```

This approach works well for simple exact-match filters but doesn't handle operators like greater than, less than, etc.

### LHS Brackets Pattern

The LHS (Left-Hand Side) Brackets pattern uses square brackets to encode operators in the parameter name:

```python
# LHS Brackets filtering with Flask
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///filter_example.db'
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

@app.route('/products', methods=['GET'])
def get_products():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    # Start building the query
    query = Product.query
    
    # Process all query parameters for filters with LHS brackets
    for param, value in request.args.items():
        # Check if parameter has LHS bracket format: field[operator]
        bracket_match = re.match(r'([a-zA-Z_]+)\[([a-zA-Z_]+)\]', param)
        if bracket_match:
            field_name, operator = bracket_match.groups()
            
            # Check if field exists in model
            if hasattr(Product, field_name):
                model_field = getattr(Product, field_name)
                
                # Apply different operators
                if operator == 'eq':
                    query = query.filter(model_field == value)
                elif operator == 'ne':
                    query = query.filter(model_field != value)
                elif operator == 'gt':
                    query = query.filter(model_field > float(value))
                elif operator == 'gte':
                    query = query.filter(model_field >= float(value))
                elif operator == 'lt':
                    query = query.filter(model_field < float(value))
                elif operator == 'lte':
                    query = query.filter(model_field <= float(value))
                elif operator == 'like':
                    query = query.filter(model_field.like(f'%{value}%'))
                elif operator == 'in':
                    values = value.split(',')
                    query = query.filter(model_field.in_(values))
                # Add more operators as needed
    
    # Apply non-bracket exact match filters (for fields without operators)
    for param, value in request.args.items():
        if not re.match(r'.*\[.*\]', param) and param not in ['page', 'per_page']:
            if hasattr(Product, param):
                model_field = getattr(Product, param)
                query = query.filter(model_field == value)
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    products = query.order_by(Product.id).offset(offset).limit(per_page).all()
    
    # Transform to dictionaries
    result = [{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'created_at': p.created_at.isoformat() if p.created_at else None
    } for p in products]
    
    # Build response with metadata
    response = {
        'data': result,
        'metadata': {
            'page': page,
            'per_page': per_page,
            'total_count': total_count,
            'total_pages': (total_count + per_page - 1) // per_page
        }
    }
    
    return jsonify(response)
```

Example URLs using LHS Brackets:
- `/products?price[gte]=10&price[lte]=100` - Products with price between 10 and 100
- `/products?name[like]=chair&category=furniture` - Furniture with "chair" in the name
- `/products?created_at[gt]=2023-01-01` - Products created after January 1, 2023

### RHS Colon Pattern

The RHS (Right-Hand Side) Colon pattern places the operator after the field name with a colon separator:

```python
# RHS Colon filtering with FastAPI
from fastapi import FastAPI, Query, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import re

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./filter_example.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProductDB(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class Product(BaseModel):
    id: int
    name: str
    price: float
    category: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class PaginatedResponse(BaseModel):
    data: List[Product]
    metadata: dict

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to parse RHS Colon parameters
def parse_rhs_colon_params(params, query, model):
    for param_name, param_values in params.items():
        # Skip pagination params
        if param_name in ['page', 'per_page']:
            continue
        
        # Handle multiple values for the same parameter
        if not isinstance(param_values, list):
            param_values = [param_values]
        
        for param_value in param_values:
            # Check if parameter has RHS colon format: field=operator:value
            colon_match = re.match(r'([a-zA-Z_]+):(.+)', param_value)
            
            if colon_match:
                operator, value = colon_match.groups()
                
                # Check if field exists in model
                if hasattr(model, param_name):
                    model_field = getattr(model, param_name)
                    
                    # Apply different operators
                    if operator == 'eq':
                        query = query.filter(model_field == value)
                    elif operator == 'ne':
                        query = query.filter(model_field != value)
                    elif operator == 'gt':
                        query = query.filter(model_field > float(value))
                    elif operator == 'gte':
                        query = query.filter(model_field >= float(value))
                    elif operator == 'lt':
                        query = query.filter(model_field < float(value))
                    elif operator == 'lte':
                        query = query.filter(model_field <= float(value))
                    elif operator == 'like':
                        query = query.filter(model_field.like(f'%{value}%'))
                    elif operator == 'in':
                        values = value.split(',')
                        query = query.filter(model_field.in_(values))
                    # Add more operators as needed
            else:
                # No operator, treat as exact match
                if hasattr(model, param_name):
                    model_field = getattr(model, param_name)
                    query = query.filter(model_field == param_value)
    
    return query

app = FastAPI()

@app.get("/products", response_model=PaginatedResponse)
def get_products(
    request_params: dict = Depends(lambda: dict(request.query_params)),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Start building the query
    query = db.query(ProductDB)
    
    # Apply RHS Colon filters
    query = parse_rhs_colon_params(request_params, query, ProductDB)
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    products = query.order_by(ProductDB.id).offset(offset).limit(per_page).all()
    
    # Build response
    response = {
        "data": products,
        "metadata": {
            "page": page,
            "per_page": per_page,
            "total_count": total_count,
            "total_pages": (total_count + per_page - 1) // per_page
        }
    }
    
    return response
```

Example URLs using RHS Colon:
- `/products?price=gte:10&price=lte:100` - Products with price between 10 and 100
- `/products?name=like:chair&category=furniture` - Furniture with "chair" in the name
- `/products?created_at=gt:2023-01-01T00:00:00` - Products created after January 1, 2023

### Filter Pattern Comparison

| Pattern | URL Example | Pros | Cons |
|---------|-------------|------|------|
| Basic Parameters | `/items?state=active` | Simplest to implement, familiar to developers | Only supports exact matching |
| LHS Brackets | `/items?price[gte]=10` | Clean separation of field and operator, nested object parsing in many libraries | More complex to parse server-side |
| RHS Colon | `/items?price=gte:10` | Easier to parse on server side, works with arrays of parameters | Potential conflicts with literal values |
| Lucene/Query Param | `/items?q=price:[10 TO 100]` | Most powerful, directly maps to search engine syntax | Harder to learn, requires URL encoding |

## Sorting Implementations

Sorting is a critical companion to pagination, influencing how data is ordered before it's sliced into pages.

### Basic Sorting Implementation

A simple implementation using a `sort_by` parameter:

```python
# Basic sorting with Flask
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sort_example.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    last_login = db.Column(db.DateTime)

@app.route('/users', methods=['GET'])
def get_users():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    # Get sorting parameter
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Validate sort field exists
    if not hasattr(User, sort_by):
        return jsonify({'error': f'Invalid sort field: {sort_by}'}), 400
    
    # Get the model attribute to sort by
    sort_field = getattr(User, sort_by)
    
    # Build the query
    query = User.query
    
    # Apply sorting
    if order.lower() == 'desc':
        query = query.order_by(sort_field.desc())
    else:
        query = query.order_by(sort_field.asc())
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    users = query.offset(offset).limit(per_page).all()
    
    # Transform to dictionaries
    result = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'created_at': u.created_at.isoformat() if u.created_at else None,
        'last_login': u.last_login.isoformat() if u.last_login else None
    } for u in users]
    
    # Build response with metadata
    response = {
        'data': result,
        'metadata': {
            'page': page,
            'per_page': per_page,
            'total_count': total_count,
            'total_pages': (total_count + per_page - 1) // per_page,
            'sort_by': sort_by,
            'order': order
        }
    }
    
    return jsonify(response)
```

### Advanced Sorting with Direction in Parameter

A more elegant approach is to include the sort direction within the `sort_by` parameter:

```python
# Advanced sorting with direction in parameter
@app.route('/users/v2', methods=['GET'])
def get_users_v2():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    # Get sorting parameter with various formats
    sort_param = request.args.get('sort_by', 'id')
    
    # Define valid model fields for sorting
    valid_fields = [column.key for column in User.__table__.columns]
    
    # Build the query
    query = User.query
    
    # Parse the sort parameter and apply sorting
    if sort_param:
        # Format 1: field.asc or field.desc
        if '.' in sort_param:
            field, direction = sort_param.split('.', 1)
            if field in valid_fields:
                sort_field = getattr(User, field)
                if direction.lower() == 'desc':
                    query = query.order_by(sort_field.desc())
                else:
                    query = query.order_by(sort_field.asc())
        
        # Format 2: asc(field) or desc(field)
        elif '(' in sort_param and ')' in sort_param:
            direction, field = sort_param.split('(', 1)
            field = field.rstrip(')')
            if field in valid_fields:
                sort_field = getattr(User, field)
                if direction.lower() == 'desc':
                    query = query.order_by(sort_field.desc())
                else:
                    query = query.order_by(sort_field.asc())
        
        # Format 3: +field or -field
        elif sort_param.startswith('+') or sort_param.startswith('-'):
            direction = 'desc' if sort_param.startswith('-') else 'asc'
            field = sort_param[1:]
            if field in valid_fields:
                sort_field = getattr(User, field)
                if direction == 'desc':
                    query = query.order_by(sort_field.desc())
                else:
                    query = query.order_by(sort_field.asc())
        
        # Default: just field name, assume ascending
        else:
            if sort_param in valid_fields:
                sort_field = getattr(User, sort_param)
                query = query.order_by(sort_field.asc())
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    users = query.offset(offset).limit(per_page).all()
    
    # Build response as before
    # ...
    
    return jsonify(response)
```

### Multi-Column Sorting

Implementing multi-column sorting:

```python
# Multi-column sorting with Flask
@app.route('/users/v3', methods=['GET'])
def get_users_v3():
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    
    # Get sorting parameter as comma-separated list
    sort_param = request.args.get('sort_by', 'id')
    
    # Split by comma to get multiple sort fields
    sort_fields = sort_param.split(',')
    
    # Define valid model fields for sorting
    valid_fields = [column.key for column in User.__table__.columns]
    
    # Build the query
    query = User.query
    
    # Parse each sort field and build the order_by clause
    order_by_clauses = []
    
    for sort_spec in sort_fields:
        sort_spec = sort_spec.strip()
        
        # Format 1: field.asc or field.desc
        if '.' in sort_spec:
            field, direction = sort_spec.split('.', 1)
            if field in valid_fields:
                sort_field = getattr(User, field)
                if direction.lower() == 'desc':
                    order_by_clauses.append(sort_field.desc())
                else:
                    order_by_clauses.append(sort_field.asc())
        
        # Format 2: asc(field) or desc(field)
        elif '(' in sort_spec and ')' in sort_spec:
            direction, field = sort_spec.split('(', 1)
            field = field.rstrip(')')
            if field in valid_fields:
                sort_field = getattr(User, field)
                if direction.lower() == 'desc':
                    order_by_clauses.append(sort_field.desc())
                else:
                    order_by_clauses.append(sort_field.asc())
        
        # Format 3: +field or -field
        elif sort_spec.startswith('+') or sort_spec.startswith('-'):
            direction = 'desc' if sort_spec.startswith('-') else 'asc'
            field = sort_spec[1:]
            if field in valid_fields:
                sort_field = getattr(User, field)
                if direction == 'desc':
                    order_by_clauses.append(sort_field.desc())
                else:
                    order_by_clauses.append(sort_field.asc())
        
        # Default: just field name, assume ascending
        else:
            if sort_spec in valid_fields:
                sort_field = getattr(User, sort_spec)
                order_by_clauses.append(sort_field.asc())
    
    # Apply all order_by clauses
    if order_by_clauses:
        query = query.order_by(*order_by_clauses)
    else:
        # Default sorting by id if no valid sort fields
        query = query.order_by(User.id.asc())
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    users = query.offset(offset).limit(per_page).all()
    
    # Build response as before
    # ...
    
    return jsonify(response)
```

### Sorting Format Comparison

| Format | Example | Pros | Cons |
|--------|---------|------|------|
| Separate Parameters | `sort_by=email&order=desc` | Simple to implement | Doesn't work well for multi-column sorting |
| Field.Direction | `sort_by=email.desc` | Clear and readable | May conflict with field names containing periods |
| Direction(Field) | `sort_by=desc(email)` | Explicit and readable | Requires parsing parentheses |
| Sign Prefix | `sort_by=-email` | Concise | Less obvious syntax |
| Comma-separated | `sort_by=-created_at,+email` | Supports multiple fields | More complex to parse |

### Sorting and Pagination Strategy Interactions

Different pagination strategies interact with sorting in important ways:

1. **Offset Pagination + Sorting**: Generally works well together, but performance issues remain with large offsets regardless of sorting.

2. **Keyset Pagination + Sorting**: Requires careful design as the keyset must include all sort fields.

```python
# Keyset pagination with sorting
@app.route('/users/keyset', methods=['GET'])
def get_users_keyset():
    # Get pagination parameters
    limit = min(request.args.get('limit', 10, type=int), 100)
    
    # Get cursor parameters (last seen values)
    after_id = request.args.get('after_id', type=int)
    after_email = request.args.get('after_email')
    
    # Get sort parameter
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Validate sort field exists
    if not hasattr(User, sort_by):
        return jsonify({'error': f'Invalid sort field: {sort_by}'}), 400
    
    # Get the model attribute to sort by
    sort_field = getattr(User, sort_by)
    
    # Build the query with sorting
    if order.lower() == 'desc':
        query = User.query.order_by(sort_field.desc(), User.id.desc())  # Always include ID for stable sort
    else:
        query = User.query.order_by(sort_field.asc(), User.id.asc())
    
    # Apply keyset filtering based on the sort field
    if after_id is not None:
        if sort_by == 'id':
            # Simple case: sorting by ID
            if order.lower() == 'desc':
                query = query.filter(User.id < after_id)
            else:
                query = query.filter(User.id > after_id)
        elif sort_by == 'email' and after_email is not None:
            # Sorting by email with a cursor
            if order.lower() == 'desc':
                query = query.filter(
                    (User.email < after_email) | 
                    ((User.email == after_email) & (User.id < after_id))
                )
            else:
                query = query.filter(
                    (User.email > after_email) | 
                    ((User.email == after_email) & (User.id > after_id))
                )
        # Add more conditions for other sort fields
    
    # Execute query with limit
    users = query.limit(limit + 1).all()
    
    # Check if there are more results
    has_more = len(users) > limit
    if has_more:
        users = users[:limit]
    
    # Transform to dictionaries
    result = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'created_at': u.created_at.isoformat() if u.created_at else None,
        'last_login': u.last_login.isoformat() if u.last_login else None
    } for u in users]
    
    # Build response with cursor for next page
    response = {
        'data': result,
        'metadata': {
            'limit': limit,
            'has_more': has_more,
            'sort_by': sort_by,
            'order': order
        }
    }
    
    # Add cursor for next page if there are more results
    if has_more and users:
        last_user = users[-1]
        response['metadata']['next_cursor'] = {
            'after_id': last_user.id
        }
        # Add the current sort field value to the cursor
        if sort_by == 'email':
            response['metadata']['next_cursor']['after_email'] = last_user.email
        # Add other sort fields as needed
    
    return jsonify(response)
```

3. **Cursor-Based Pagination + Sorting**: Most flexible but requires encoding all sort fields in the cursor.

```python
# Cursor-based pagination with dynamic sorting
@app.route('/users/cursor', methods=['GET'])
def get_users_cursor():
    # Get pagination parameters
    limit = min(request.args.get('limit', 10, type=int), 100)
    cursor = request.args.get('cursor')
    
    # Get sort parameter
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Validate sort field exists
    if not hasattr(User, sort_by):
        return jsonify({'error': f'Invalid sort field: {sort_by}'}), 400
    
    # Get the model attribute to sort by
    sort_field = getattr(User, sort_by)
    
    # Build the query with sorting
    if order.lower() == 'desc':
        query = User.query.order_by(sort_field.desc(), User.id.desc())
    else:
        query = User.query.order_by(sort_field.asc(), User.id.asc())
    
    # Apply cursor filtering if provided
    if cursor:
        cursor_data = decode_cursor(cursor)
        if cursor_data and 'id' in cursor_data:
            after_id = cursor_data['id']
            
            # Get the value of the sort field from cursor
            after_value = cursor_data.get(sort_by)
            
            if after_value is not None:
                # Apply filter based on sort direction
                if order.lower() == 'desc':
                    query = query.filter(
                        (sort_field < after_value) | 
                        ((sort_field == after_value) & (User.id < after_id))
                    )
                else:
                    query = query.filter(
                        (sort_field > after_value) | 
                        ((sort_field == after_value) & (User.id > after_id))
                    )
    
    # Execute query with limit
    users = query.limit(limit + 1).all()
    
    # Check if there are more results
    has_more = len(users) > limit
    if has_more:
        users = users[:limit]
    
    # Transform to dictionaries
    result = [{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'created_at': u.created_at.isoformat() if u.created_at else None,
        'last_login': u.last_login.isoformat() if u.last_login else None
    } for u in users]
    
    # Build response with cursor for next page
    response = {
        'data': result,
        'metadata': {
            'limit': limit,
            'has_more': has_more,
            'sort_by': sort_by,
            'order': order
        }
    }
    
    # Add cursor for next page if there are more results
    if has_more and users:
        last_user = users[-1]
        
        # Build cursor data with all necessary sort fields
        cursor_data = {
            'id': last_user.id,
        }
        
        # Add the current sort field value to the cursor
        if sort_by == 'email':
            cursor_data['email'] = last_user.email
        elif sort_by == 'username':
            cursor_data['username'] = last_user.username
        elif sort_by == 'created_at' and last_user.created_at:
            cursor_data['created_at'] = last_user.created_at.isoformat()
        # Add other sort fields as needed
        
        # Encode the cursor
        next_cursor = encode_cursor(cursor_data)
        response['metadata']['next_cursor'] = next_cursor
    
    return jsonify(response)

def encode_cursor(data):
    """Encode cursor data to base64 string"""
    import base64
    import json
    return base64.b64encode(json.dumps(data).encode()).decode()

def decode_cursor(cursor):
    """Decode cursor from base64 string"""
    import base64
    import json
    try:
        return json.loads(base64.b64decode(cursor.encode()).decode())
    except:
        return None
```

## Integrating Filtering, Sorting, and Pagination

Here's a comprehensive example combining all three concepts:

```python
# Comprehensive API with filtering, sorting, and pagination
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import re
import base64
import json
from datetime import datetime
from sqlalchemy import or_, and_, desc, asc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///complete_example.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    inventory = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create the database and tables
@app.before_first_request
def create_tables():
    db.create_all()

# Helper function to parse LHS bracket filters
def parse_lhs_bracket_filters(args, query, model):
    for param, value in args.items():
        # Check if parameter has bracket format
        bracket_match = re.match(r'([a-zA-Z_]+)\[([a-zA-Z_]+)\]', param)
        if bracket_match:
            field_name, operator = bracket_match.groups()
            
            # Check if field exists in model
            if hasattr(model, field_name):
                model_field = getattr(model, field_name)
                
                # Apply different operators
                if operator == 'eq':
                    query = query.filter(model_field == value)
                elif operator == 'ne':
                    query = query.filter(model_field != value)
                elif operator == 'gt':
                    query = query.filter(model_field > float(value))
                elif operator == 'gte':
                    query = query.filter(model_field >= float(value))
                elif operator == 'lt':
                    query = query.filter(model_field < float(value))
                elif operator == 'lte':
                    query = query.filter(model_field <= float(value))
                elif operator == 'like':
                    query = query.filter(model_field.like(f'%{value}%'))
                elif operator == 'in':
                    values = value.split(',')
                    query = query.filter(model_field.in_(values))
    return query

# Helper function to parse sort parameters
def apply_sorting(sort_param, order_param, query, model):
    # Get all valid fields
    valid_fields = [column.key for column in model.__table__.columns]
    
    # Default sort by ID if no sort parameter
    if not sort_param or sort_param not in valid_fields:
        return query.order_by(model.id.asc())
    
    # Get the model field to sort by
    sort_field = getattr(model, sort_param)
    
    # Apply sorting
    if order_param and order_param.lower() == 'desc':
        return query.order_by(sort_field.desc(), model.id.desc())  # Include ID for stable sort
    else:
        return query.order_by(sort_field.asc(), model.id.asc())

# Main API endpoint with all features
@app.route('/api/products', methods=['GET'])
def get_products():
    # Get pagination type and parameters
    pagination_type = request.args.get('pagination', 'offset')
    
    # Start building the query
    query = Product.query
    
    # Apply filtering (LHS Brackets)
    query = parse_lhs_bracket_filters(request.args, query, Product)
    
    # Apply exact match filters for non-bracket parameters
    for param, value in request.args.items():
        if not re.match(r'.*[\[\]].*', param) and param not in [
            'pagination', 'page', 'limit', 'per_page', 'cursor', 
            'after_id', 'sort_by', 'order', 'offset'
        ]:
            if hasattr(Product, param):
                model_field = getattr(Product, param)
                query = query.filter(model_field == value)
    
    # Apply sorting
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    query = apply_sorting(sort_by, order, query, Product)
    
    # Apply pagination based on type
    if pagination_type == 'cursor':
        # Cursor-based pagination
        limit = min(int(request.args.get('limit', 10)), 100)
        cursor = request.args.get('cursor')
        
        # Apply cursor filtering if provided
        if cursor:
            try:
                cursor_data = json.loads(base64.b64decode(cursor.encode()).decode())
                after_id = cursor_data.get('id')
                
                # Get the sort field value from cursor
                if sort_by in cursor_data:
                    after_value = cursor_data[sort_by]
                    
                    # Convert string date to datetime if needed
                    if sort_by in ['created_at', 'updated_at'] and after_value:
                        after_value = datetime.fromisoformat(after_value)
                    
                    # Apply filter based on sort direction
                    if order.lower() == 'desc':
                        query = query.filter(
                            (getattr(Product, sort_by) < after_value) | 
                            ((getattr(Product, sort_by) == after_value) & (Product.id < after_id))
                        )
                    else:
                        query = query.filter(
                            (getattr(Product, sort_by) > after_value) | 
                            ((getattr(Product, sort_by) == after_value) & (Product.id > after_id))
                        )
            except Exception as e:
                return jsonify({'error': f'Invalid cursor: {str(e)}'}), 400
        
        # Execute query with limit + 1 to check for more results
        products = query.limit(limit + 1).all()
        
        # Check if there are more results
        has_more = len(products) > limit
        if has_more:
            products = products[:limit]
        
        # Build response with cursor for next page
        response = {
            'data': [product_to_dict(p) for p in products],
            'metadata': {
                'pagination_type': 'cursor',
                'limit': limit,
                'has_more': has_more,
                'sort_by': sort_by,
                'order': order
            }
        }
        
        # Add cursor for next page if there are more results
        if has_more and products:
            last_product = products[-1]
            
            # Build cursor data with necessary fields
            cursor_data = {
                'id': last_product.id,
            }
            
            # Add the current sort field value to the cursor
            if sort_by != 'id':
                value = getattr(last_product, sort_by)
                if isinstance(value, datetime):
                    value = value.isoformat()
                cursor_data[sort_by] = value
            
            # Encode the cursor
            next_cursor = base64.b64encode(json.dumps(cursor_data).encode()).decode()
            response['metadata']['next_cursor'] = next_cursor
    
    elif pagination_type == 'keyset':
        # Keyset pagination
        limit = min(int(request.args.get('limit', 10)), 100)
        after_id = request.args.get('after_id', type=int)
        
        # Apply keyset filtering if after_id is provided
        if after_id is not None:
            # For simple id-based continuation
            if sort_by == 'id':
                if order.lower() == 'desc':
                    query = query.filter(Product.id < after_id)
                else:
                    query = query.filter(Product.id > after_id)
            else:
                # For keyset with custom sort field, we need the value
                # This is a simplified version - in practice, you'd need to pass the value
                # of the sort field for the last item seen
                after_value = request.args.get(f'after_{sort_by}')
                if after_value:
                    # Convert to proper type if needed
                    if sort_by in ['price', 'rating', 'inventory']:
                        after_value = float(after_value)
                    elif sort_by in ['created_at', 'updated_at']:
                        after_value = datetime.fromisoformat(after_value)
                    
                    # Apply filter
                    if order.lower() == 'desc':
                        query = query.filter(
                            (getattr(Product, sort_by) < after_value) | 
                            ((getattr(Product, sort_by) == after_value) & (Product.id < after_id))
                        )
                    else:
                        query = query.filter(
                            (getattr(Product, sort_by) > after_value) | 
                            ((getattr(Product, sort_by) == after_value) & (Product.id > after_id))
                        )
        
        # Execute query with limit + 1
        products = query.limit(limit + 1).all()
        
        # Check if there are more results
        has_more = len(products) > limit
        if has_more:
            products = products[:limit]
        
        # Build response
        response = {
            'data': [product_to_dict(p) for p in products],
            'metadata': {
                'pagination_type': 'keyset',
                'limit': limit,
                'has_more': has_more,
                'sort_by': sort_by,
                'order': order
            }
        }
        
        # Add next link if there are more results
        if has_more and products:
            last_product = products[-1]
            next_params = {
                'after_id': last_product.id,
                'limit': limit,
                'sort_by': sort_by,
                'order': order,
                'pagination': 'keyset'
            }
            
            # Add the value of the sort field if needed
            if sort_by != 'id':
                value = getattr(last_product, sort_by)
                if isinstance(value, datetime):
                    value = value.isoformat()
                next_params[f'after_{sort_by}'] = value
            
            # Build next URL (simplified)
            next_url = '/api/products?' + '&'.join([f'{k}={v}' for k, v in next_params.items()])
            response['metadata']['next'] = next_url
    
    else:
        # Default: offset pagination
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 10)), 100)
        
        # Get total count
        total_count = query.count()
        
        # Apply pagination
        offset = (page - 1) * per_page
        products = query.offset(offset).limit(per_page).all()
        
        # Calculate total pages
        total_pages = (total_count + per_page - 1) // per_page if total_count > 0 else 0
        
        # Build response
        response = {
            'data': [product_to_dict(p) for p in products],
            'metadata': {
                'pagination_type': 'offset',
                'page': page,
                'per_page': per_page,
                'total_count': total_count,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_prev': page > 1,
                'sort_by': sort_by,
                'order': order
            }
        }
        
        # Add navigation links
        base_url = f'/api/products?per_page={per_page}&sort_by={sort_by}&order={order}&pagination=offset'
        
        if page > 1:
            response['metadata']['prev'] = f"{base_url}&page={page-1}"
        if page < total_pages:
            response['metadata']['next'] = f"{base_url}&page={page+1}"
        
        response['metadata']['first'] = f"{base_url}&page=1"
        if total_pages > 0:
            response['metadata']['last'] = f"{base_url}&page={total_pages}"
    
    return jsonify(response)

def product_to_dict(product):
    """Convert a Product model instance to dictionary"""
    return {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'category': product.category,
        'inventory': product.inventory,
        'rating': product.rating,
        'created_at': product.created_at.isoformat() if product.created_at else None,
        'updated_at': product.updated_at.isoformat() if product.updated_at else None
    }

if __name__ == '__main__':
    app.run(debug=True)
```

### Performance Considerations for Combined Features

1. **Database Indexes**: Ensure all fields used in filtering and sorting have proper indexes.

```python
# Example of creating indexes in SQLAlchemy models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)  # Add index
    price = db.Column(db.Float, nullable=False, index=True)  # Add index
    category = db.Column(db.String(50), index=True)  # Add index
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)  # Add index
    
    # Composite index for commonly combined fields
    __table_args__ = (
        db.Index('idx_category_price', 'category', 'price'),
    )
```

2. **Query Optimization**: Consider using subqueries for count operations.

```python
# Optimized count query
from sqlalchemy import func

def get_optimized_count(query):
    # Extract the where clause from the query without the ORDER BY
    count_query = query.statement.with_only_columns([func.count()]).order_by(None)
    return query.session.execute(count_query).scalar()
```

3. **Caching**: Implement caching for expensive operations.

```python
# Simple caching example
from functools import lru_cache
from datetime import datetime

# Cache expensive counts for 1 minute
@lru_cache(maxsize=128)
def get_cached_count(query_hash, timestamp_minute):
    # The timestamp_minute parameter ensures cache invalidation every minute
    # query_hash should be a hash of the query's filter conditions
    count = expensive_count_operation()
    return count

# Usage
now = datetime.utcnow()
timestamp_minute = f"{now.year}-{now.month}-{now.day}-{now.hour}-{now.minute}"
query_hash = hash(str(query.statement.compile()))
count = get_cached_count(query_hash, timestamp_minute)
```

4. **Batched Operations**: Consider using batched operations for improved performance.

```python
# Batched loading example
def get_products_in_batches(query, batch_size=1000):
    """Load large result sets in batches to avoid memory issues"""
    offset = 0
    while True:
        batch = query.limit(batch_size).offset(offset).all()
        if not batch:
            break
        for item in batch:
            yield item
        offset += batch_size
```

### Best Practices for API Design

1. **Consistent Parameter Naming**: Use consistent parameter names across all endpoints.

2. **Comprehensive Documentation**: Document all supported operators, sort formats, and pagination methods.

3. **Defaults for Everything**: Provide sensible defaults for all parameters.

4. **Validation and Error Handling**: Validate all parameters and return clear error messages.

5. **Consistent Response Format**: Use a consistent response structure for all endpoints.

6. **Stateless Design**: Keep the API stateless to enable easy scaling.

7. **Use HTTP Headers**: Consider using HTTP headers for pagination metadata.

```python
@app.route('/api/products/header-pagination', methods=['GET'])
def get_products_with_header_metadata():
    # Process query as before
    # ...
    
    # Add pagination metadata to headers
    response = jsonify({'data': result})
    response.headers['X-Total-Count'] = total_count
    response.headers['X-Page'] = page
    response.headers['X-Per-Page'] = per_page
    response.headers['X-Total-Pages'] = total_pages
    response.headers['Link'] = build_link_header(page, total_pages, request.base_url, request.args)
    
    return response

def build_link_header(page, total_pages, base_url, args):
    """Build a Link header for pagination according to RFC 5988"""
    links = []
    args_dict = args.to_dict(flat=True)
    
    # First page
    args_dict['page'] = 1
    links.append(f'<{base_url}?{urlencode(args_dict)}>; rel="first"')
    
    # Previous page
    if page > 1:
        args_dict['page'] = page - 1
        links.append(f'<{base_url}?{urlencode(args_dict)}>; rel="prev"')
    
    # Next page
    if page < total_pages:
        args_dict['page'] = page + 1
        links.append(f'<{base_url}?{urlencode(args_dict)}>; rel="next"')
    
    # Last page
    args_dict['page'] = total_pages
    links.append(f'<{base_url}?{urlencode(args_dict)}>; rel="last"')
    
    return ', '.join(links)
```

8. **Versioning**: Consider API versioning for major changes.

```python
@app.route('/api/v1/products', methods=['GET'])
def get_products_v1():
    # Version 1 implementation
    pass

@app.route('/api/v2/products', methods=['GET'])
def get_products_v2():
    # Version 2 implementation with improved features
    pass
```

## Advanced Topics

### Conditional Pagination

Conditionally applying different pagination strategies:

```python
@app.route('/smart-pagination', methods=['GET'])
def smart_pagination():
    # Get pagination parameters
    page_type = request.args.get('type', 'offset')
    
    if page_type == 'cursor':
        # Use cursor-based pagination
        cursor = request.args.get('cursor')
        # ...
    elif page_type == 'page':
        # Use page-based pagination
        page = int(request.args.get('page', 1))
        # ...
    else:
        # Default to offset-based
        offset = int(request.args.get('offset', 0))
        # ...
```

### Custom Pagination for Different Resource Types

```python
# Factory for pagination strategies
def get_pagination_strategy(resource_type):
    strategies = {
        'posts': CursorPagination('-created_at'),
        'users': OffsetPagination('username'),
        'products': PagePagination('id'),
        'logs': TimePagination('-timestamp')
    }
    return strategies.get(resource_type, OffsetPagination('id'))

@app.route('/<resource_type>', methods=['GET'])
def get_resources(resource_type):
    # Get the appropriate pagination strategy
    paginator = get_pagination_strategy(resource_type)
    
    # Use the strategy to paginate results
    results, metadata = paginator.paginate(request.args)
    
    return jsonify({
        'data': results,
        'pagination': metadata
    })
```

### Real-time Updates with Cursor Pagination

```python
# Handling real-time updates with cursor pagination
@app.route('/feed', methods=['GET'])
def get_feed():
    cursor = request.args.get('cursor')
    limit = min(int(request.args.get('limit', 10)), 100)
    
    # For real-time, after marker means newer than the cursor
    after = request.args.get('after', 'false').lower() == 'true'
    
    if cursor:
        created_at, item_id = decode_cursor(cursor)
        
        if after:
            # Get items newer than cursor (for real-time updates)
            query = FeedItem.query.filter(
                (FeedItem.created_at > created_at) | 
                ((FeedItem.created_at == created_at) & (FeedItem.id > item_id))
            ).order_by(FeedItem.created_at.asc(), FeedItem.id.asc())
        else:
            # Get items older than cursor (for pagination)
            query = FeedItem.query.filter(
                (FeedItem.created_at < created_at) | 
                ((FeedItem.created_at == created_at) & (FeedItem.id < item_id))
            ).order_by(FeedItem.created_at.desc(), FeedItem.id.desc())
    else:
        # No cursor, get most recent items
        query = FeedItem.query.order_by(FeedItem.created_at.desc(), FeedItem.id.desc())
    
    # Execute query
    items = query.limit(limit + 1).all()
    
    # Check for more pages
    has_more = len(items) > limit
    if has_more:
        items = items[:limit]
    
    # Format response
    # ...
```

## Summary

### Pagination Strategy Comparison

| Strategy | Best For | Performance | Consistency | Implementation |
|----------|----------|-------------|-------------|----------------|
| Offset-based | Stable data, jumping to specific positions | Poor with large offsets | Poor with changing data | Simple |
| Cursor-based | Real-time data, large datasets | Excellent | Excellent | Complex |
| Page-based | Traditional UIs, stable data | Poor with large page numbers | Poor with changing data | Simple |
| Keyset | Large sorted datasets | Excellent | Good | Moderate |
| Time-based | Time-ordered data, logs, feeds | Good | Good | Simple |

### Decision Flow Chart

1. **Is your data primarily time-ordered (logs, feeds, etc.)?**
   - Yes → Consider Time-based pagination
   - No → Continue

2. **Is your dataset large (100,000+ records) or growing rapidly?**
   - Yes → Continue
   - No → Offset-based or Page-based may be sufficient

3. **Does your UI need page numbers or random access to pages?**
   - Yes → Consider Offset-based or Page-based, but with caching
   - No → Continue

4. **Is consistency critical when data is changing?**
   - Yes → Use Cursor-based or Keyset pagination
   - No → Any method may work

5. **Do you need optimal database performance?**
   - Yes → Use Cursor-based or Keyset pagination
   - No → Any method may work based on other requirements

### Final Tips for Python Implementation

1. Use appropriate database indexes for fields used in pagination
2. Set reasonable default and maximum values for page sizes
3. Implement proper error handling for invalid pagination parameters
4. Use standardized response formats across all paginated endpoints
5. Consider the client experience when designing your pagination API
6. Test pagination with large datasets to ensure performance
7. Document your pagination strategy clearly in your API documentation
