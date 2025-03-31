# YouTube Contest Platform - Technical Documentation

## Architecture Overview

The YouTube Contest Platform is built using a modern web stack with Next.js as the full-stack framework. It follows a feature-based architecture pattern where components, services, and utilities are organized by their functionality.

### Tech Stack

- **Frontend**: Next.js 14+ with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk for user management
- **External APIs**: YouTube Data API, Twilio API for WhatsApp
- **State Management**: React Context and React Query
- **UI Components**: Custom components with Radix UI primitives

### Project Structure

```
/
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── scripts/             # Utility scripts
├── src/
│   ├── app/             # Next.js App Router structure
│   │   ├── api/         # API routes
│   │   ├── admin/       # Admin panel pages
│   │   ├── dashboard/   # User dashboard pages
│   │   ├── onboarding/  # User onboarding flow
│   │   └── ...
│   ├── components/      # Reusable React components
│   │   ├── ui/          # UI primitives and elements
│   │   └── ...
│   ├── lib/             # Utility functions and services
│   │   ├── services/    # External API integrations
│   │   └── ...
│   └── middleware/      # Next.js middleware for auth & routing
└── ...
```

## Setup and Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL database
- YouTube Data API credentials
- Twilio account for WhatsApp integration
- Clerk account for authentication

### Local Development Setup

1. Clone the repository
2. Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yt_contest"
DIRECT_URL="postgresql://username:password@localhost:5432/yt_contest"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# YouTube API
YOUTUBE_API_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

3. Install dependencies:
```bash
npm install
```

4. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

## Database Schema

The database uses PostgreSQL with Prisma ORM. The main models are:

### User
Represents both contestants and administrators.
- Fields: id, email, name, whatsappNumber, role, createdAt, updatedAt
- Relations: one-to-many with Submission

### Submission
Represents a YouTube video submission by a contestant.
- Fields: id, userId, youtubeVideoId, title, description, status, verificationImage, verificationStatus, createdAt, updatedAt
- Relations: belongs-to User, one-to-one with VideoMetrics

### VideoMetrics
Stores the performance metrics of a video submission.
- Fields: id, submissionId, views, likes, watchHours, lastUpdated
- Relations: belongs-to Submission

## Key Components and Services

### YouTube Integration (`src/lib/youtube.ts`)
Handles all interactions with the YouTube Data API:
- Video validation
- Metrics fetching
- Playlist management

### Metrics Updater (`src/lib/metrics-updater.ts`)
Scheduled service for updating video metrics:
- Batch processing to optimize API quota
- Error handling and retry logic
- Metrics calculation

### Authentication and Authorization
- Uses Clerk for authentication
- Custom middleware for route protection
- Role-based access control (Admin vs Contestant)

### Video Submission Flow
1. User submits YouTube video via `VideoSubmissionForm.tsx`
2. Backend validates video ownership and eligibility
3. Submission is stored in the database with pending status
4. Admin can approve/reject submissions
5. Approved submissions are tracked for metrics

## API Routes

### `/api/submissions/`
- `POST`: Create a new submission
- `GET`: Retrieve submissions (filtered by user role)

### `/api/admin/`
- Various endpoints for admin-only operations like approving submissions

### `/api/cron/`
- Endpoints triggered by scheduled tasks for background processing
- Update metrics, send notifications, etc.

### `/api/rankings/`
- `GET`: Retrieve current leaderboard based on video metrics

## Authentication and Authorization

The application uses Clerk for authentication with custom middleware to protect routes:

- Public routes: Homepage, sign-in, sign-up
- Contestant routes: Dashboard, submission form
- Admin routes: Admin panel, verification pages

## YouTube API Quota Management

The YouTube API has strict quota limitations. Our strategy includes:

1. Batch processing of API requests in scheduled jobs
2. Caching frequently accessed data
3. Prioritizing metrics updates based on video age and contest phase
4. Fallback mechanisms when approaching quota limits

## Testing

The application supports several testing approaches:

1. Unit tests for utility functions
2. Component tests using React Testing Library
3. API route testing with mocked dependencies
4. E2E testing with Playwright

## Performance Considerations

- Server-side rendering for SEO and initial load performance
- Client-side data fetching with React Query for real-time updates
- Optimistic UI updates for form submissions
- Edge caching for public pages

## Error Handling and Logging

The application implements comprehensive error handling:

- API error responses with consistent format
- Frontend error boundaries
- Service-level error handling with retry logic
- Structured logging for debugging

## Deployment

The application is designed to be deployed to Vercel or similar platforms:

1. Set up a production PostgreSQL database
2. Configure environment variables in the deployment platform
3. Set up cron jobs for scheduled tasks (or use Vercel Cron)
4. Monitor API quota usage and adjust batch processing as needed

## Security Considerations

- All API routes are protected with appropriate authentication
- CSRF protection via Next.js defaults
- Sanitization of user inputs
- Secure credential management
- Rate limiting for public endpoints 