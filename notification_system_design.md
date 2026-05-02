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

🚀 Done