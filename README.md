# YouTube Contest Platform

A streamlined platform for managing YouTube talent contests with automated metrics tracking and contestant management.

## Features

- 🎥 Automated YouTube video submission and metrics tracking
- 📱 WhatsApp integration for contestant communication
- 📊 Real-time leaderboard with engagement metrics
- ✅ Subscriber verification system
- 🎯 Admin dashboard for contest management

## Documentation

Comprehensive documentation is available in the [docs/](./docs/) directory:

- [Technical Documentation](./docs/TECHNICAL_DOCUMENTATION.md) - Detailed technical overview
- [Project Structure](./docs/PROJECT_STRUCTURE.md) - Codebase organization
- [API Documentation](./docs/API_DOCUMENTATION.md) - All API endpoints
- [YouTube API Integration](./docs/YOUTUBE_API_INTEGRATION.md) - YouTube integration details
- [User Guide](./docs/USER_GUIDE.md) - Guide for contestants and administrators
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Deployment instructions

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **APIs**: YouTube Data API, Twilio API
- **Deployment**: Vercel/Cloudflare Pages (recommended)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture Overview

### Core Components

- **Authentication**: Clerk handles user authentication and management
- **Database**: PostgreSQL stores user data, submissions, and metrics
- **API Integration**:
  - YouTube API for video metrics and playlist management
  - Twilio for WhatsApp communication
- **Automation**:
  - Scheduled tasks for metrics updates
  - Automated contestant notifications
  - Batch processing for API quota management

### Security & Performance

- Rate limiting on API routes
- Caching for YouTube metrics
- Secure credential management
- API quota optimization

## API Quota Management

The system implements several strategies to manage YouTube API quotas:

1. Batch processing of metrics updates
2. Caching frequently accessed data
3. Prioritized API calls based on contest phases
4. Fallback mechanisms for quota limits

## Deployment

For quick deployment:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Deploy to Vercel/Cloudflare Pages
4. Set up cron jobs for automated tasks

For detailed deployment instructions, see the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md).

## Contributing

This is a solo project but structured for maintainability and future scaling.
