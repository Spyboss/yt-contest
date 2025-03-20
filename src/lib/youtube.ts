import { google } from 'googleapis';

// Initialize the YouTube API client with service account
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.YOUTUBE_PROJECT_ID,
    private_key_id: process.env.YOUTUBE_PRIVATE_KEY_ID,
    private_key: process.env.YOUTUBE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.YOUTUBE_CLIENT_EMAIL,
    client_id: process.env.YOUTUBE_CLIENT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
});

const youtube = google.youtube({
  version: 'v3',
  auth,
});

interface VideoMetrics {
  views: number;
  likes: number;
  watchTimeMinutes: number;
}

export class YouTubeService {
  static async getVideoDetails(videoId: string) {
    try {
      const response = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) {
        throw new Error('Video not found');
      }

      return {
        title: video.snippet?.title,
        description: video.snippet?.description,
        channelId: video.snippet?.channelId,
        publishedAt: video.snippet?.publishedAt,
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  static async getVideoMetrics(videoId: string): Promise<VideoMetrics> {
    try {
      const response = await youtube.videos.list({
        part: ['statistics', 'contentDetails'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) {
        throw new Error('Video not found');
      }

      // Convert duration to minutes (approximate)
      const duration = video.contentDetails?.duration || 'PT0M';
      const watchTimeMinutes = this.parseDuration(duration);

      return {
        views: parseInt(video.statistics?.viewCount || '0', 10),
        likes: parseInt(video.statistics?.likeCount || '0', 10),
        watchTimeMinutes,
      };
    } catch (error) {
      console.error('Error fetching video metrics:', error);
      throw error;
    }
  }

  static async validateVideo(videoId: string): Promise<boolean> {
    try {
      const response = await youtube.videos.list({
        part: ['status'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) {
        return false;
      }

      // Check if video is public
      return video.status?.privacyStatus === 'public';
    } catch (error) {
      console.error('Error validating video:', error);
      return false;
    }
  }

  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private static parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 60 + minutes + seconds / 60;
  }

  static async getRateLimit(): Promise<{
    quotaCost: number;
    quotaLimit: number;
  }> {
    try {
      const response = await youtube.videos.list({
        part: ['snippet'],
        id: ['dQw4w9WgXcQ'], // Using a known video ID for the check
      });

      // YouTube API v3 quota information
      // Each video.list call with snippet costs 1 unit
      // Daily quota is typically 10,000 units
      return {
        quotaCost: 1,
        quotaLimit: 10000,
      };
    } catch (error) {
      console.error('Error checking quota:', error);
      throw error;
    }
  }
} 