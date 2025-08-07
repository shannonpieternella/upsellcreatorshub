import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  PhotoIcon,
  VideoCameraIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChartBarIcon,
  UsersIcon,
  CameraIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [postContent, setPostContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.log('Failed to fetch posts:', error);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    const postData = {
      content: postContent,
      platforms: selectedPlatforms,
      scheduledFor: scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : null
    };

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setPostContent('');
        setMediaFile(null);
        setMediaPreview('');
        fetchPosts();
      }
    } catch (error) {
      console.log('Failed to create post:', error);
    }
  };

  const togglePlatform = (platform: string) => {
    if (platform === 'tiktok' || platform === 'pinterest') return; // Coming soon
    
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl"></div>
              <span className="text-xl font-bold text-gray-900">UpsellCreatorsHub</span>
            </div>
            
            <nav className="space-y-2">
              <Link to="/dashboard" className="sidebar-item">
                <ChartBarIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link to="/posts" className="sidebar-item sidebar-item-active">
                <CameraIcon className="w-5 h-5 mr-3" />
                Posts
              </Link>
              <Link to="/calendar" className="sidebar-item">
                <CalendarIcon className="w-5 h-5 mr-3" />
                Calendar
              </Link>
              <Link to="/analytics" className="sidebar-item">
                <ChartPieIcon className="w-5 h-5 mr-3" />
                Analytics
              </Link>
              <Link to="/accounts" className="sidebar-item">
                <UsersIcon className="w-5 h-5 mr-3" />
                Accounts
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white border-b border-gray-200">
            <div className="px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Post
              </button>
            </div>
          </header>

          <main className="p-8">
            {/* Platform Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg">
                  All Platforms
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Instagram
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                  TikTok (Coming Soon)
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                  Pinterest (Coming Soon)
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.length > 0 ? (
                posts.map((post: any) => (
                  <div
                    key={post.id}
                    className="card p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {post.platforms?.includes('instagram') && (
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    
                    {post.scheduledFor && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(post.scheduledFor).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Platform Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Platforms
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => togglePlatform('instagram')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedPlatforms.includes('instagram')
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>Instagram</span>
                    {selectedPlatforms.includes('instagram') && (
                      <CheckCircleIcon className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    disabled
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                    <span>TikTok</span>
                    <span className="text-xs">(Soon)</span>
                  </button>
                  
                  <button
                    disabled
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>Pinterest</span>
                    <span className="text-xs">(Soon)</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write your caption..."
                  className="input-field min-h-[120px]"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {postContent.length} / 2200 characters
                </div>
              </div>

              {/* Media Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {mediaPreview ? (
                    <div className="relative">
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setMediaFile(null);
                          setMediaPreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload image or video</p>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Post
                </label>
                <div className="flex space-x-3">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="input-field flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone} (Your local time)
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="btn-primary"
                  disabled={!postContent || selectedPlatforms.length === 0}
                >
                  {scheduledDate ? 'Schedule Post' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;