import { google } from 'googleapis';
import { z } from 'zod';

const youtube = google.youtube('v3');

// Schema for video details validation
const VideoDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

type VideoDetails = z.infer<typeof VideoDetailsSchema>;

// Schema for video metrics
const VideoMetricsSchema = z.object({
  views: z.number(),
  likes: z.number(),
  watchTimeMinutes: z.number(),
});

type VideoMetrics = z.infer<typeof VideoMetricsSchema>;

class YouTubeService {
  private auth;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.YOUTUBE_CLIENT_EMAIL,
        private_key: process.env.YOUTUBE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.upload',
      ],
    });
  }

  /**
   * Extract video ID from various YouTube URL formats
   */
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^[a-zA-Z0-9_-]{11}$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Validate and get video details
   */
  async getVideoDetails(videoId: string): Promise<VideoDetails> {
    try {
      const response = await youtube.videos.list({
        auth: this.auth,
        part: ['snippet', 'statistics'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) throw new Error('Video not found');

      return VideoDetailsSchema.parse({
        id: video.id,
        title: video.snippet?.title,
        description: video.snippet?.description,
        thumbnailUrl: video.snippet?.thumbnails?.standard?.url,
      });
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw new Error('Failed to fetch video details');
    }
  }

  /**
   * Get video metrics
   */
  async getVideoMetrics(videoId: string): Promise<VideoMetrics> {
    try {
      const response = await youtube.videos.list({
        auth: this.auth,
        part: ['statistics'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) throw new Error('Video not found');

      return VideoMetricsSchema.parse({
        views: parseInt(video.statistics?.viewCount || '0'),
        likes: parseInt(video.statistics?.likeCount || '0'),
        watchTimeMinutes: 0, // Note: Watch time requires YouTube Analytics API
      });
    } catch (error) {
      console.error('Error fetching video metrics:', error);
      throw new Error('Failed to fetch video metrics');
    }
  }

  /**
   * Upload a video to YouTube
   */
  async uploadVideo(file: Buffer, metadata: {
    title: string;
    description?: string;
    tags?: string[];
  }): Promise<string> {
    try {
      const response = await youtube.videos.insert({
        auth: this.auth,
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
          },
          status: {
            privacyStatus: 'public',
          },
        },
        media: {
          body: file,
        },
      });

      if (!response.data.id) throw new Error('Upload failed');
      return response.data.id;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Batch fetch metrics for multiple videos
   */
  async batchGetMetrics(videoIds: string[]): Promise<Record<string, VideoMetrics>> {
    try {
      const response = await youtube.videos.list({
        auth: this.auth,
        part: ['statistics'],
        id: videoIds,
      });

      const metrics: Record<string, VideoMetrics> = {};
      
      response.data.items?.forEach(video => {
        if (video.id) {
          metrics[video.id] = VideoMetricsSchema.parse({
            views: parseInt(video.statistics?.viewCount || '0'),
            likes: parseInt(video.statistics?.likeCount || '0'),
            watchTimeMinutes: 0,
          });
        }
      });

      return metrics;
    } catch (error) {
      console.error('Error batch fetching metrics:', error);
      throw new Error('Failed to batch fetch metrics');
    }
  }
}

export const youtubeService = new YouTubeService();
export { VideoDetails, VideoMetrics }; 