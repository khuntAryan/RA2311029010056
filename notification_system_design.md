Notification System API Design

Base URL
http://localhost:3000/api

1. Get All Notifications
Endpoint
GET /notifications
Query Params (optional)
type → placement / result / event
limit → number of results
page → pagination

Response
{
  "notifications": [
    {
      "id": "uuid",
      "type": "Placement",
      "message": "Company hiring",
      "timestamp": "2026-05-01T10:00:00Z",
      "isRead": false
    }
  ]
}

2. Create Notification
Endpoint
POST /notifications
Request Body
{
  "type": "Placement",
  "message": "Google hiring"
}
Response
{
  "message": "Notification created",
  "notificationId": "uuid"
}

3. Mark Notification as Read
Endpoint
PATCH /notifications/:id/read
Response
{
  "message": "Notification marked as read"
}

4. Get Unread Notifications
Endpoint
GET /notifications/unread
Response
{
  "notifications": [ ... ]
}

5. Delete Notification
Endpoint
DELETE /notifications/:id
Response
{
  "message": "Notification deleted"
}

Real-Time Notification Strategy

Option 1: WebSockets (Recommended)
Persistent connection
Instant updates
Best for real-time apps

Option 2: Server-Sent Events (SSE)
Lightweight alternative
One-way communication

Option 3: Polling
Client requests every few seconds
Easy but inefficient

Design Decisions
RESTful structure
UUID for unique IDs
Pagination for scalability
isRead flag for filtering
Timestamp for sorting

Stage 1 Status

Complete API structure
Covers CRUD operations
Includes real-time approach

Stage 2 — Database Design
Chosen Database
PostgreSQL (Relational DB)

Schema Design
Table: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Indexing (Important for performance)
CREATE INDEX idx_user_read ON notifications(userId, isRead);
CREATE INDEX idx_created_at ON notifications(createdAt DESC);
CREATE INDEX idx_type ON notifications(type);

Problems as Data Grows
Millions of rows → slow queries
Sorting (ORDER BY createdAt) becomes expensive
Filtering unread notifications slows down
DB gets overloaded with frequent reads

Solutions
1. Index Optimization
Faster filtering on userId, isRead
Speeds up unread queries
2. Pagination
SELECT * FROM notifications
WHERE userId = 'xyz'
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;

Avoid loading all data at once

3. Caching (Redis)
Store recent notifications in cache
Reduce DB hits
4. Partitioning
Split table by userId or date
Improves query speed
5. Archiving Old Data
Move old notifications to separate table
Keep main table small

Why PostgreSQL?
Strong consistency
Structured data fits well
Supports indexing + scaling
Easy querying with SQL


Stage 2 Status

✔ Schema defined
✔ Indexing included
✔ Scaling issues identified
✔ Solutions proposed


Stage 3 — Query Optimization

SELECT * FROM notificationsWHERE studentID = 1042 AND isRead = falseORDER BY createdAt DESC;
Problem


Uses SELECT * → fetches unnecessary data
No proper indexing → full table scan
Sorting large dataset → slow
Not scalable for millions of records

Optimized Query
SELECT id, type, message, createdAtFROM notificationsWHERE studentID = 1042 AND isRead = falseORDER BY createdAt DESCLIMIT 20;

Index Optimization
CREATE INDEX idx_student_read_createdON notifications(studentID, isRead, createdAt DESC);
This makes:
Filtering fast
Sorting fast
Query scalable

Should we add indexes on every column?
No 

Why?
Slows down inserts/updates
Consumes extra storage
Not all columns are queried
Only index frequently queried fields

Is adding indexes everywhere effective?
No

Over-indexing hurts performance
Best practice: targeted indexing

New Query (Placement in last 7 days)
SELECT *FROM notificationsWHERE type = 'Placement'AND createdAt >= NOW() - INTERVAL '7 days'; 

Optimization for above query
CREATE INDEX idx_type_createdON notifications(type, createdAt DESC);

Improvements Achieved
Reduced data fetch size
Faster filtering using indexes
Faster sorting
Better scalability

Stage 3 Status
 Query analyzed
 Optimized version provided
 Index strategy explained
 Additional query handled


Stage 4 — Performance Optimization
Problem

Notifications are fetched on every page load for every student.

Issues:

High DB load
Increased latency
Poor user experience

Solutions
1. Caching (Redis)
Store recent notifications in cache
Serve from cache instead of DB
Flow:
First request → DB → store in cache
Next requests → directly from cache

Pros:
Very fast response
Reduces DB load
Cons:
Cache invalidation complexity
Slight data staleness

2. Pagination & Lazy Loading
Fetch limited notifications (e.g., 10–20)
Load more only when needed

Pros:
Less data transfer
Faster UI
Cons:
Multiple API calls

3. Real-Time Push (WebSockets)
Push notifications instead of fetching repeatedly

Pros:
No unnecessary API calls
Instant updates
Cons:
Complex implementation
Requires persistent connections

4. Background Processing (Queue)
Use message queue (Kafka / RabbitMQ)
Process notifications asynchronously

Pros:
Smooth system load
Scalable
Cons:
Adds system complexity

5. Read Replica Database
Use replica DB for read operations

Pros:
Reduces load on primary DB
Improves scalability
Cons:
Slight replication delay

6. Precomputed Feeds
Store pre-sorted notifications per user

Pros:
Faster reads
No heavy computation at runtime
Cons:
Extra storage
Update complexity

Recommended Approach

Use combination of:

Redis caching
Pagination
WebSockets (for real-time)

This gives:

Fast response
Low DB load
Real-time experience

Final Impact
Reduced DB queries
Faster response time
Better scalability
Improved user experience

Stage 4 Status

Problem identified
Multiple solutions proposed
Trade-offs explained
Final architecture suggested