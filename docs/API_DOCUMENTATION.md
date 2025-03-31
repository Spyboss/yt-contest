# API Documentation

This document provides detailed information about the API endpoints available in the YouTube Contest Platform.

## Base URL

All API routes are relative to the base URL of your deployment (e.g., `https://your-domain.com/api/`).

## Authentication

Most API endpoints require authentication. The application uses Clerk for authentication, and requests should include the necessary authentication headers:

- For server-side requests: Use Clerk's server-side authentication flow
- For client-side requests: Authentication is handled automatically by Clerk's frontend SDK

## API Endpoints

### Submissions

#### Get All Submissions

```
GET /submissions
```

Retrieves a list of submissions based on the user's role:
- For admins: Returns all submissions
- For contestants: Returns only the user's own submissions

Query Parameters:
- `status` (optional): Filter by submission status (`PENDING`, `APPROVED`, `REJECTED`)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

Response:
```json
{
  "submissions": [
    {
      "id": "string",
      "userId": "string",
      "youtubeVideoId": "string",
      "title": "string",
      "description": "string",
      "status": "PENDING | APPROVED | REJECTED",
      "verificationImage": "string",
      "verificationStatus": "PENDING | APPROVED | REJECTED",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "metrics": {
        "views": "number",
        "likes": "number",
        "watchHours": "number",
        "lastUpdated": "datetime"
      },
      "user": {
        "name": "string",
        "email": "string"
      }
    }
  ],
  "total": "number",
  "pages": "number",
  "currentPage": "number"
}
```

#### Create Submission

```
POST /submissions
```

Creates a new video submission.

Request Body:
```json
{
  "youtubeUrl": "string",
  "description": "string",
  "verificationImage": "string" (optional)
}
```

Response:
```json
{
  "id": "string",
  "youtubeVideoId": "string",
  "title": "string",
  "description": "string",
  "status": "PENDING",
  "verificationImage": "string",
  "verificationStatus": "PENDING",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### Get Submission by ID

```
GET /submissions/{id}
```

Retrieves a specific submission by ID.

Path Parameters:
- `id`: The ID of the submission to retrieve

Response:
```json
{
  "id": "string",
  "userId": "string",
  "youtubeVideoId": "string",
  "title": "string",
  "description": "string",
  "status": "PENDING | APPROVED | REJECTED",
  "verificationImage": "string",
  "verificationStatus": "PENDING | APPROVED | REJECTED",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "metrics": {
    "views": "number",
    "likes": "number",
    "watchHours": "number",
    "lastUpdated": "datetime"
  },
  "user": {
    "name": "string",
    "email": "string"
  }
}
```

#### Update Submission

```
PATCH /submissions/{id}
```

Updates a specific submission. Contestants can only update their own submissions in PENDING status.

Path Parameters:
- `id`: The ID of the submission to update

Request Body:
```json
{
  "description": "string" (optional),
  "verificationImage": "string" (optional)
}
```

Response:
```json
{
  "id": "string",
  "youtubeVideoId": "string",
  "title": "string",
  "description": "string",
  "status": "PENDING | APPROVED | REJECTED",
  "verificationImage": "string",
  "verificationStatus": "PENDING | APPROVED | REJECTED",
  "updatedAt": "datetime"
}
```

#### Delete Submission

```
DELETE /submissions/{id}
```

Deletes a specific submission. Contestants can only delete their own submissions in PENDING status.

Path Parameters:
- `id`: The ID of the submission to delete

Response:
```json
{
  "success": true,
  "message": "Submission deleted successfully"
}
```

### Admin Endpoints

#### Get All Contestants

```
GET /admin/contestants
```

Retrieves a list of all contestants. Admin only.

Query Parameters:
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `search` (optional): Search term for filtering by name or email

Response:
```json
{
  "contestants": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "whatsappNumber": "string",
      "createdAt": "datetime",
      "submissionCount": "number"
    }
  ],
  "total": "number",
  "pages": "number",
  "currentPage": "number"
}
```

#### Approve/Reject Submission

```
PATCH /admin/submissions/{id}
```

Updates the status of a submission. Admin only.

Path Parameters:
- `id`: The ID of the submission to update

Request Body:
```json
{
  "status": "APPROVED | REJECTED",
  "verificationStatus": "APPROVED | REJECTED" (optional)
}
```

Response:
```json
{
  "id": "string",
  "status": "APPROVED | REJECTED",
  "verificationStatus": "APPROVED | REJECTED",
  "updatedAt": "datetime"
}
```

#### Promote User to Admin

```
POST /admin/promote
```

Promotes a user to admin role. Admin only.

Request Body:
```json
{
  "email": "string"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "role": "ADMIN"
  }
}
```

### Rankings

#### Get Leaderboard

```
GET /rankings
```

Retrieves the current leaderboard based on video metrics.

Query Parameters:
- `timeFrame` (optional): Time frame for ranking (`ALL_TIME`, `LAST_WEEK`, `LAST_MONTH`)
- `sortBy` (optional): Metric to sort by (`VIEWS`, `LIKES`, `WATCH_HOURS`)
- `limit` (optional): Number of entries to return

Response:
```json
{
  "rankings": [
    {
      "submissionId": "string",
      "youtubeVideoId": "string",
      "title": "string",
      "userName": "string",
      "metrics": {
        "views": "number",
        "likes": "number",
        "watchHours": "number",
        "lastUpdated": "datetime"
      },
      "rank": "number"
    }
  ]
}
```

### Scheduled Tasks

#### Update Metrics

```
GET /cron/metrics
```

Initiates a batch update of video metrics. Intended to be called by a scheduled task.

Query Parameters:
- `key` (required): Secret key for authorization

Response:
```json
{
  "success": true,
  "updated": "number",
  "skipped": "number",
  "failed": "number"
}
```

#### Send Notifications

```
GET /cron/notifications
```

Sends scheduled notifications to contestants. Intended to be called by a scheduled task.

Query Parameters:
- `key` (required): Secret key for authorization
- `type` (optional): Notification type (`RANKING_UPDATE`, `SUBMISSION_REMINDER`)

Response:
```json
{
  "success": true,
  "sent": "number",
  "failed": "number"
}
```

### File Upload

#### Upload File

```
POST /uploadthing
```

Handles file uploads using the UploadThing service. This endpoint is primarily for uploading verification images.

Request and response formats follow the UploadThing API documentation.

### Webhooks

#### Clerk Auth Webhook

```
POST /webhooks/clerk
```

Handles Clerk authentication events.

#### Twilio Webhook

```
POST /webhooks/twilio
```

Handles incoming messages from Twilio for WhatsApp integration.

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": {
    "message": "string",
    "code": "string" (optional),
    "details": {} (optional)
  }
}
```

Common error codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

## Rate Limiting

API endpoints have rate limiting applied to prevent abuse:
- Public endpoints: 60 requests per minute
- Authenticated endpoints: 120 requests per minute
- Admin endpoints: 300 requests per minute

When a rate limit is exceeded, the API returns a `429 Too Many Requests` status code. 