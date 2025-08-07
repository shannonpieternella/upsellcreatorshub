import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MobileNav from '../components/MobileNav';
import {
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  CameraIcon,
  ChartPieIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
  CalendarDaysIcon,
  HashtagIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const CreatePost: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  // Form states
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/posts', label: 'Posts', icon: CameraIcon },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { path: '/analytics', label: 'Analytics', icon: ChartPieIcon },
    { path: '/accounts', label: 'Accounts', icon: UsersIcon },
  ];

  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📸',
      available: true,
      color: 'from-pink-500 to-purple-600'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: '🎵',
      available: false,
      color: 'from-black to-gray-800'
    },
    { 
      id: 'pinterest', 
      name: 'Pinterest', 
      icon: '📌',
      available: false,
      color: 'from-red-500 to-red-600'
    },
  ];

  const aiContentSuggestions = [
    "🚀 Exciting news! We're launching something amazing this week...",
    "✨ Behind the scenes of our creative process",
    "💡 5 tips to boost your productivity today",
    "🎯 Setting goals and crushing them! Here's how we do it",
  ];

  const bestTimeSuggestions = [
    { time: '9:00 AM', engagement: 'High' },
    { time: '12:30 PM', engagement: 'Very High' },
    { time: '6:00 PM', engagement: 'Peak' },
    { time: '9:00 PM', engagement: 'High' },
  ];

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const postData = {
      content,
      platforms: selectedPlatforms,
      media: mediaFiles,
      scheduleType,
      scheduleDate: scheduleType === 'later' ? scheduleDate : null,
      scheduleTime: scheduleType === 'later' ? scheduleTime : null,
      hashtags,
    };
    
    console.log('Publishing post:', postData);
    alert(scheduleType === 'now' 
      ? 'Post published successfully!' 
      : `Post scheduled for ${scheduleDate} at ${scheduleTime}`
    );
    
    setIsPublishing(false);
    navigate('/posts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      {/* Mobile Navigation */}
      <MobileNav />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:bg-white/80 lg:backdrop-blur-xl lg:border-r lg:border-gray-200">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/25"></div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">UpsellCreators</span>
                  <span className="text-2xl font-light text-gray-600">Hub</span>
                </div>
              </div>
            </div>
            
            <nav className="mt-10 flex-1 px-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User Profile Section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.plan || 'Free'} Plan</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  useAuthStore.getState().logout();
                  window.location.href = '/';
                }}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${!isMobile ? 'lg:pl-72' : ''}`}>
          {/* Top Header */}
          <header className={`bg-white/60 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30 ${isMobile ? 'mt-16' : ''}`}>
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
                  <p className="mt-1 text-sm text-gray-600">Share your content across social platforms</p>
                </div>
                <button
                  onClick={() => navigate('/posts')}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Content Input */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Post Content</h3>
                      {aiSuggestions && (
                        <button className="flex items-center text-sm text-purple-600 hover:text-purple-700">
                          <SparklesIcon className="w-4 h-4 mr-1" />
                          AI Assist
                        </button>
                      )}
                    </div>
                    
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind? Share your thoughts..."
                      className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {content.length} / 2200 characters
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          😊
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          @
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          #
                        </button>
                      </div>
                    </div>
                    
                    {/* AI Suggestions */}
                    {aiSuggestions && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                        <p className="text-xs font-medium text-purple-700 mb-2">AI Content Suggestions</p>
                        <div className="space-y-2">
                          {aiContentSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setContent(suggestion)}
                              className="w-full text-left text-sm text-gray-700 p-2 hover:bg-white rounded-lg transition-all"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Media Upload */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Media</h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700">
                          Click to upload media
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF, MP4 up to 10MB
                        </p>
                      </label>
                    </div>
                    
                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Media ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeMedia(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hashtags */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Hashtags</h3>
                      <button className="text-sm text-purple-600 hover:text-purple-700">
                        <SparklesIcon className="w-4 h-4 inline mr-1" />
                        Suggest
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#marketing #socialmedia #content"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['#trending', '#viral', '#business', '#entrepreneur'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setHashtags(prev => prev + ' ' + tag)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Settings */}
                <div className="space-y-6">
                  {/* Platform Selection */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Platforms</h3>
                    <div className="space-y-3">
                      {platforms.map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => platform.available && togglePlatform(platform.id)}
                          disabled={!platform.available}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                            selectedPlatforms.includes(platform.id)
                              ? 'bg-gradient-to-r ' + platform.color + ' text-white'
                              : platform.available
                              ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{platform.icon}</span>
                            <span className="font-medium">{platform.name}</span>
                          </div>
                          {platform.available ? (
                            selectedPlatforms.includes(platform.id) && (
                              <CheckIcon className="w-5 h-5" />
                            )
                          ) : (
                            <span className="text-xs">Coming Soon</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Settings */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule</h3>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => setScheduleType('now')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          scheduleType === 'now'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <ClockIcon className="w-5 h-5 mr-3" />
                          <span className="font-medium">Post Now</span>
                        </div>
                        {scheduleType === 'now' && <CheckIcon className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={() => setScheduleType('later')}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          scheduleType === 'later'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <CalendarDaysIcon className="w-5 h-5 mr-3" />
                          <span className="font-medium">Schedule for Later</span>
                        </div>
                        {scheduleType === 'later' && <CheckIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {scheduleType === 'later' && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        
                        {/* Best Time Suggestions */}
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <p className="text-xs font-medium text-purple-700 mb-2">Best times to post</p>
                          <div className="space-y-1">
                            {bestTimeSuggestions.map((time, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  const [hours, minutes] = time.time.split(/[: ]/);
                                  const isPM = time.time.includes('PM');
                                  const hour24 = isPM && hours !== '12' 
                                    ? String(parseInt(hours) + 12).padStart(2, '0')
                                    : hours === '12' && !isPM 
                                    ? '00' 
                                    : hours.padStart(2, '0');
                                  setScheduleTime(`${hour24}:${minutes || '00'}`);
                                }}
                                className="w-full flex items-center justify-between text-xs p-2 hover:bg-white rounded-lg transition-all"
                              >
                                <span className="text-gray-700">{time.time}</span>
                                <span className={`px-2 py-0.5 rounded-full ${
                                  time.engagement === 'Peak' 
                                    ? 'bg-green-100 text-green-700'
                                    : time.engagement === 'Very High'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {time.engagement}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Publish Button */}
                  <button
                    onClick={handlePublish}
                    disabled={!content || selectedPlatforms.length === 0 || isPublishing}
                    className={`w-full py-4 rounded-2xl font-semibold shadow-lg transition-all transform hover:scale-105 ${
                      content && selectedPlatforms.length > 0
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isPublishing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      <>
                        {scheduleType === 'now' ? 'Publish Now' : 'Schedule Post'}
                        <ChevronRightIcon className="w-5 h-5 inline ml-2" />
                      </>
                    )}
                  </button>

                  {/* Preview Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          UC
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">UpsellCreatorsHub</p>
                          <p className="text-xs text-gray-500">
                            {scheduleType === 'now' ? 'Now' : `${scheduleDate} at ${scheduleTime}`}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {content || 'Your post content will appear here...'}
                      </p>
                      
                      {mediaPreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {mediaPreviews.slice(0, 4).map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      
                      {hashtags && (
                        <p className="text-xs text-blue-600">
                          {hashtags}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-gray-500">
                          <button className="hover:text-red-500">❤️</button>
                          <button className="hover:text-blue-500">💬</button>
                          <button className="hover:text-green-500">🔄</button>
                        </div>
                        <div className="flex -space-x-2">
                          {selectedPlatforms.map(platformId => {
                            const platform = platforms.find(p => p.id === platformId);
                            return platform ? (
                              <span
                                key={platformId}
                                className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs border border-gray-200"
                              >
                                {platform.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;