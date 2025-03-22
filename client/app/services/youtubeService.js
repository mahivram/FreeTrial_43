import axios from 'axios';
import {
  getYouTubeSearchQuery,
  constructYouTubeSearchURL,
  getRecommendedChannels,
  skillTutorialsData
} from '../data/skillTutorials';
import ENV from '../config/env';

// Get API key from config
const YOUTUBE_API_KEY = ENV.YOUTUBE_API_KEY;

// Create axios instance with default config
const youtubeAPI = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: YOUTUBE_API_KEY,
  },
});

// Mock data for when API fails
const getMockTutorials = (skill) => {
  const mockData = [
    {
      id: 'mock1',
      title: `Learn ${skill} - Beginner's Guide`,
      thumbnail: 'https://via.placeholder.com/480x360',
      channelTitle: 'Tutorial Channel',
      description: `Comprehensive guide to learning ${skill} from scratch`,
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'mock2',
      title: `${skill} Advanced Techniques`,
      thumbnail: 'https://via.placeholder.com/480x360',
      channelTitle: 'Expert Channel',
      description: `Advanced techniques and tips for ${skill}`,
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'mock3',
      title: `${skill} Tips and Tricks`,
      thumbnail: 'https://via.placeholder.com/480x360',
      channelTitle: 'Tips Channel',
      description: `Essential tips and tricks for ${skill}`,
      publishedAt: new Date().toISOString(),
    }
  ];
  return mockData;
};

export const fetchTutorialsForSkill = async (skill, level = 'beginner') => {
  try {
    // Get the search query for the skill and level
    const searchQuery = getYouTubeSearchQuery(skill, level);
    if (!searchQuery) {
      console.error('No search query generated for:', skill, level);
      return getMockTutorials(skill);
    }

    console.log('Searching for skill:', skill, 'level:', level);
    console.log('Search query:', searchQuery);

    // Make the API request
    const response = await youtubeAPI.get('/search', {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        relevanceLanguage: 'hi',
        maxResults: 20,
        videoEmbeddable: true,
        videoDuration: 'long',
        order: 'relevance',
        regionCode: 'IN',
        safeSearch: 'moderate',
        videoCategoryId: 27,
        fields: 'items(id/videoId,snippet(title,description,thumbnails/high,channelTitle,publishedAt))',
      },
    });

    const data = response.data;

    if (!data.items || data.items.length === 0) {
      console.log('No videos found for:', skill, level);
      return getMockTutorials(skill);
    }

    console.log(`Found ${data.items.length} videos for ${skill}`);
    
    // Process and return the results
    const processedVideos = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    }));

    return processedVideos;
  } catch (error) {
    console.error('Error fetching tutorials:', error.response?.data || error.message);
    return getMockTutorials(skill);
  }
};

export const fetchRecommendedChannelVideos = async (skill) => {
  try {
    const channels = getRecommendedChannels(skill);
    const channelVideos = [];

    for (const channelId of channels) {
      try {
        const response = await youtubeAPI.get('/search', {
          params: {
            part: 'snippet',
            channelId,
            type: 'video',
            order: 'date',
            maxResults: 5,
          },
        });

        const data = response.data;
        
        if (data.items) {
          channelVideos.push(...data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
          })));
        }
      } catch (channelError) {
        console.error(`Error fetching videos for channel ${channelId}:`, channelError.message);
        continue;
      }
    }

    return channelVideos;
  } catch (error) {
    console.error('Error fetching channel videos:', error.response?.data || error.message);
    return [];
  }
};

// Cache the results to avoid excessive API calls
const tutorialCache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getCachedTutorials = async (skill, level = 'beginner') => {
  const cacheKey = `${skill}-${level}`;
  const cachedData = tutorialCache.get(cacheKey);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log('Returning cached tutorials for:', skill, level);
    return cachedData.data;
  }

  console.log('Fetching fresh tutorials for:', skill, level);
  const tutorials = await fetchTutorialsForSkill(skill, level);
  
  if (tutorials.length > 0) {
    tutorialCache.set(cacheKey, {
      data: tutorials,
      timestamp: Date.now(),
    });
  }

  return tutorials;
};

// Add default export
const youtubeService = {
  fetchTutorialsForSkill,
  fetchRecommendedChannelVideos,
  getCachedTutorials
};

export default youtubeService; 