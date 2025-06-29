import React, { useEffect } from 'react';
import { Loader2, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { StoryCard } from '../story/StoryCard';
import { useStories } from '../../hooks/useStories';
import { useAuth } from '../../context/AuthContext';

export const StoriesFeed: React.FC = () => {
  const { stories, loading, error, hasMore, toggleLike, addComment, loadMore, refresh } = useStories();
  const { user } = useAuth();

  const handleLike = (storyId: string) => {
    if (user) {
      toggleLike(storyId, user.id);
    }
  };

  const handleComment = async (storyId: string, text: string) => {
    if (user) {
      try {
        await addComment(storyId, user.id, text);
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  if (loading && stories.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={refresh}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Stories Yet</h3>
        <p className="text-gray-600 mb-6">Be the first to share a story with the community!</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Error banner for partial failures */}
      {error && stories.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={refresh}
            className="ml-auto text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stories List */}
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Stories</span>
            )}
          </button>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && stories.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've reached the end of the feed!</p>
        </div>
      )}
    </div>
  );
};