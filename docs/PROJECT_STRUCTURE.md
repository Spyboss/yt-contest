# YouTube Contest Platform - Project Structure

This document provides a detailed overview of the project directory structure and the purpose of each file and directory.

## Root Directory

```
/
├── .git/                 # Git repository
├── docs/                 # Documentation files
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema definition
│   └── schema.prisma.mongodb # Alternative MongoDB schema (not in use)
├── public/               # Static assets for the frontend
├── scripts/              # Utility scripts
│   └── make-admin.js     # Script to promote a user to admin
├── src/                  # Source code
├── .gitignore            # Git ignore file
├── components.json       # Shadcn/UI components configuration
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # NPM package definition
├── package-lock.json     # NPM package lock
├── postcss.config.mjs    # PostCSS configuration
├── README.md             # Project overview
└── tsconfig.json         # TypeScript configuration
```

## Source Directory (`src/`)

```
src/
├── app/                  # Next.js App Router pages and API routes
├── components/           # Reusable React components
├── lib/                  # Utility functions and services
├── middleware/           # Next.js middleware
└── middleware.ts         # Root middleware configuration
```

## App Directory (`src/app/`)

```
src/app/
├── admin/                # Admin panel pages
│   ├── contestants/      # Contestant management
│   ├── metrics/          # Metrics dashboard
│   ├── submissions/      # Submission management
│   └── page.tsx          # Admin home page
├── api/                  # API routes
│   ├── admin/            # Admin-only API endpoints
│   ├── cron/             # Scheduled task endpoints
│   ├── rankings/         # Leaderboard API
│   ├── submissions/      # Submission management API
│   ├── uploadthing/      # File upload API integration
│   └── webhooks/         # External service webhook handlers
├── dashboard/            # User dashboard pages
│   ├── leaderboard/      # User-facing leaderboard
│   ├── submissions/      # User submissions management
│   └── page.tsx          # Dashboard home
├── onboarding/           # User onboarding flow
│   └── page.tsx          # Onboarding page
├── sign-in/              # Authentication pages
│   └── [[...sign-in]]/   # Clerk sign-in pages
├── sign-up/              # Registration pages
│   └── [[...sign-up]]/   # Clerk sign-up pages
├── clerk.config.ts       # Clerk authentication configuration
├── favicon.ico           # Website favicon
├── globals.css           # Global CSS styles
├── layout.tsx            # Root layout component
└── page.tsx              # Home page
```

## Components Directory (`src/components/`)

```
src/components/
├── ui/                   # UI primitive components
│   ├── button.tsx        # Button component
│   ├── card.tsx          # Card component
│   ├── form.tsx          # Form components
│   ├── input.tsx         # Input component
│   ├── select.tsx        # Select component
│   ├── table.tsx         # Table components
│   └── ...               # Other UI components
├── Navigation.tsx        # Main navigation component
├── Providers.tsx         # React context providers wrapper
├── SubmissionsList.tsx   # List of video submissions component
└── VideoSubmissionForm.tsx # Form for submitting videos
```

## Library Directory (`src/lib/`)

```
src/lib/
├── services/             # External service integrations
│   ├── twilio.ts         # Twilio/WhatsApp integration
│   └── uploadthing.ts    # UploadThing file upload service
├── metrics-updater.ts    # Service for updating video metrics
├── prisma.ts             # Prisma client initialization
├── utils.ts              # General utility functions
└── youtube.ts            # YouTube API integration
```

## API Routes (`src/app/api/`)

```
src/app/api/
├── admin/                # Admin-only endpoints
│   ├── contestants/      # Contestant management
│   │   └── route.ts      # GET/POST handlers
│   ├── promote/          # User role promotion
│   │   └── route.ts      # POST handler
│   └── submissions/      # Submission approval/rejection
│       └── route.ts      # PATCH handler
├── cron/                 # Scheduled tasks
│   ├── metrics/          # Metrics update job
│   │   └── route.ts      # GET handler for cron
│   └── notifications/    # Notification sending job
│       └── route.ts      # GET handler for cron
├── rankings/             # Leaderboard data
│   └── route.ts          # GET handler
├── submissions/          # Submission management
│   ├── [id]/             # Single submission operations
│   │   └── route.ts      # GET/PATCH/DELETE handlers
│   └── route.ts          # GET/POST handlers for all submissions
├── uploadthing/          # File upload API
│   └── route.ts          # UploadThing API route
└── webhooks/             # External webhooks
    ├── clerk/            # Clerk auth webhooks
    │   └── route.ts      # POST handler
    └── twilio/           # Twilio webhooks
        └── route.ts      # POST handler
```

## Database Schema (`prisma/schema.prisma`)

The schema defines three main models:

1. **User** - Represents users in the system, with roles to distinguish between contestants and administrators
2. **Submission** - Represents YouTube video submissions made by contestants
3. **VideoMetrics** - Stores performance metrics for each video submission

The schema uses PostgreSQL as the database provider and includes relationships between these models.

## Middleware (`src/middleware/`)

```
src/middleware/
├── auth.ts               # Authentication middleware
└── routes.ts             # Route protection and redirection
```

## Key Files

- **metrics-updater.ts**: Core service for fetching and updating YouTube video metrics
- **youtube.ts**: Handles all interactions with the YouTube Data API
- **VideoSubmissionForm.tsx**: Frontend component for submitting YouTube videos
- **SubmissionsList.tsx**: Component for displaying video submissions with their metrics
- **prisma.ts**: Initializes and exports the Prisma client for database operations 