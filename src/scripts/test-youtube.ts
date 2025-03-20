import { youtubeService } from '../lib/services/youtube';

async function testYouTubeAPI() {
  try {
    // Test with a known YouTube video ID
    const videoId = 'dQw4w9WgXcQ'; // Famous Rick Roll video
    console.log('Testing YouTube API connection...');
    
    const details = await youtubeService.getVideoDetails(videoId);
    console.log('Successfully fetched video details:', details);
    
    const metrics = await youtubeService.getVideoMetrics(videoId);
    console.log('Successfully fetched video metrics:', metrics);
    
    console.log('YouTube API connection test successful!');
  } catch (error) {
    console.error('YouTube API test failed:', error);
  }
}

testYouTubeAPI(); 