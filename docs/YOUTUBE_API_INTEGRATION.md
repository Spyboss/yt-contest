# YouTube API Integration

This document provides a comprehensive guide to the YouTube API integration in the YouTube Contest Platform.

## Overview

The YouTube API integration is a core component of this platform. It's used for:

1. Validating YouTube video URLs
2. Fetching video metadata (title, description, etc.)
3. Retrieving video performance metrics (views, likes, watch time)
4. Managing contest playlists (optional)

## Files

The main files involved in the YouTube API integration are:

- `src/lib/youtube.ts` - Core functions for YouTube API interactions
- `src/lib/metrics-updater.ts` - Service for batch updating video metrics
- `src/app/api/cron/metrics/route.ts` - API route for scheduled metrics updates

## Authentication and Setup

### Prerequisites

1. A Google Cloud Platform account
2. YouTube Data API v3 enabled in your GCP project
3. API key generated for your project

### Environment Variables

The application requires the following environment variable:

```
YOUTUBE_API_KEY=your_api_key_here
```

### API Quota Considerations

The YouTube Data API has strict quota limitations (typically 10,000 units per day). Our implementation uses several strategies to optimize quota usage:

1. Batch processing videos in a single API call when possible
2. Caching responses to avoid redundant API calls
3. Prioritizing newer videos for more frequent updates
4. Strategic fallback when approaching quota limits

## Core Functions

### Video Validation

```typescript
// Validates a YouTube video URL and extracts the video ID
async function validateYouTubeUrl(url: string): Promise<{ 
  isValid: boolean; 
  videoId?: string; 
  error?: string 
}>
```

This function:
- Parses the URL to extract the video ID
- Verifies that the video exists using the YouTube API
- Returns the extracted video ID if valid

### Fetching Video Information

```typescript
// Fetches basic information about a YouTube video
async function getVideoInfo(videoId: string): Promise<{
  title: string;
  description: string;
  thumbnailUrl: string;
  channelId: string;
  channelTitle: string;
}>
```

This function uses the `videos.list` endpoint with the `snippet` part to retrieve basic information about a video.

### Fetching Video Metrics

```typescript
// Fetches metrics for a YouTube video
async function getVideoMetrics(videoId: string): Promise<{
  views: number;
  likes: number;
  comments: number;
}>
```

This function uses the `videos.list` endpoint with the `statistics` part to retrieve metrics about a video.

### Batch Processing

```typescript
// Fetches metrics for multiple videos in a single API call
async function batchGetVideoMetrics(videoIds: string[]): Promise<Record<string, {
  views: number;
  likes: number;
  comments: number;
}>>
```

This function optimizes API quota usage by fetching metrics for up to 50 videos in a single API call.

## Metrics Updater Service

The metrics updater service (`metrics-updater.ts`) implements a strategy for efficient updates:

1. Retrieves all approved video submissions from the database
2. Groups videos into batches of up to 50 videos
3. Makes batch API calls to retrieve metrics
4. Updates the database with the latest metrics
5. Calculates and stores derived metrics like watch time (if available)

### Update Frequency Strategy

Videos are updated with different frequencies based on:

1. **Age of the video**:
   - Newer videos (< 7 days): Updated more frequently
   - Older videos: Updated less frequently

2. **Contest phase**:
   - Early phase: All videos updated equally
   - Final phase: Higher-ranking videos prioritized

## Error Handling

The integration includes robust error handling:

1. **API Quota Errors**: When quota limits are approached, the system falls back to updating only the most critical videos
2. **Temporary API Failures**: Implements exponential backoff retry logic
3. **Invalid Videos**: Handles cases where videos become private or are deleted

## Usage in the Application

### Video Submission Flow

1. User enters a YouTube URL in the submission form
2. `validateYouTubeUrl` verifies the URL and extracts the video ID
3. `getVideoInfo` fetches the video title and description
4. The submission is stored in the database with initial metrics

### Scheduled Metrics Updates

1. A cron job triggers the `/api/cron/metrics` endpoint
2. The metrics updater service fetches updates for all approved videos
3. The database is updated with the latest metrics
4. Rankings are recalculated based on the updated metrics

## Security Considerations

1. The YouTube API key is stored as an environment variable and never exposed to clients
2. API calls are made server-side only
3. Request validation ensures that only valid YouTube URLs are processed
4. Rate limiting is implemented to prevent abuse

## Troubleshooting

Common issues and their solutions:

1. **API Quota Exceeded**: Review the update frequency strategy and consider applying for a quota increase
2. **Invalid API Key**: Verify the API key is correctly set and has YouTube Data API access
3. **Missing Metrics**: Some metrics may not be available for all videos, especially newer ones
4. **Private Videos**: Handle cases where videos become private after submission

## Future Enhancements

Potential improvements to the YouTube API integration:

1. Implement YouTube API's auth flow to access non-public metrics
2. Add support for YouTube Analytics API for more detailed metrics
3. Implement a quota monitoring dashboard for administrators
4. Add support for YouTube Live events 