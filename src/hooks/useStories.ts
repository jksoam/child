import { useState, useEffect } from 'react';
import { Story } from '../types';
import { storyService } from '../services/storyService';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchStories = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await storyService.getStories(pageNum, 10);
      
      if (reset) {
        setStories(response.data);
      } else {
        setStories(prev => [...prev, ...response.data]);
      }
      
      setHasMore(pageNum < response.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stories');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(1, true);
  }, []);

  const addStory = async (caption: string, imageFile: File): Promise<void> => {
    try {
      const newStory = await storyService.createStory({
        caption,
        image: imageFile
      });
      
      // Add new story to the beginning of the list
      setStories(prev => [newStory, ...prev]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create story';
      throw new Error(message);
    }
  };

  const toggleLike = async (storyId: string, userId: string): Promise<void> => {
    try {
      await storyService.toggleLike(storyId);
      
      // Optimistically update the UI
      setStories(prev => prev.map(story => {
        if (story.id === storyId) {
          const isLiked = story.likes.some(like => like.userId === userId);
          
          if (isLiked) {
            // Remove like
            return {
              ...story,
              likes: story.likes.filter(like => like.userId !== userId)
            };
          } else {
            // Add like
            const newLike = {
              id: Date.now().toString(),
              userId,
              storyId,
              user: story.user, // This will be updated from backend response
              createdAt: new Date().toISOString()
            };
            return {
              ...story,
              likes: [...story.likes, newLike]
            };
          }
        }
        return story;
      }));
    } catch (err: any) {
      console.error('Error toggling like:', err);
      // Optionally show error message to user
    }
  };

  const addComment = async (storyId: string, userId: string, text: string): Promise<void> => {
    try {
      await storyService.addComment(storyId, text);
      
      // Refresh the specific story to get updated comments
      // In a real app, you might want to optimistically update the UI
      await fetchStories(1, true);
    } catch (err: any) {
      console.error('Error adding comment:', err);
      throw new Error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchStories(page + 1, false);
    }
  };

  const refresh = () => {
    fetchStories(1, true);
  };

  return {
    stories,
    loading,
    error,
    hasMore,
    addStory,
    toggleLike,
    addComment,
    loadMore,
    refresh
  };
};