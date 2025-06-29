import React, { useState } from 'react';
import { Heart, MessageCircle, Send, User, MoreHorizontal } from 'lucide-react';
import { Story } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface StoryCardProps {
  story: Story;
  onLike: (storyId: string) => void;
  onComment: (storyId: string, text: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const isLiked = user ? story.likes.some(like => like.userId === user.id) : false;
  const likesCount = story.likes.length;
  const commentsCount = story.comments.length;

  const handleLike = () => {
    if (user) {
      onLike(story.id);
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && commentText.trim()) {
      onComment(story.id, commentText);
      setCommentText('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {story.user.avatar ? (
            <img
              src={story.user.avatar}
              alt={story.user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{story.user.name}</h3>
            <p className="text-sm text-gray-500">{formatTimeAgo(story.createdAt)}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={story.imageUrl}
          alt="Story"
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked
                  ? 'text-red-500 hover:scale-110'
                  : 'text-gray-600 hover:text-red-500 hover:scale-105'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
              />
              <span className="font-medium">{likesCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{commentsCount}</span>
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="mb-4">
          <p className="text-gray-900">
            <span className="font-semibold">{story.user.name}</span>{' '}
            <span className="text-gray-700">{story.caption}</span>
          </p>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-200 pt-4">
            {/* Comments List */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {story.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">{comment.user.name}</span>{' '}
                      <span className="text-gray-700">{comment.text}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleComment} className="flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full pr-10 py-2 border border-gray-300 rounded-full px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};