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

