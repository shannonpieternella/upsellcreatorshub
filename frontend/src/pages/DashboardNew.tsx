import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MobileNav from '../components/MobileNav';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UsersIcon,
  PlusIcon,
  CameraIcon,
  ChartPieIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PhotoIcon,
  VideoCameraIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DashboardNew: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check URL parameters for Instagram connection status
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('instagram_connected') === 'true') {
      const username = urlParams.get('username');
      if (username) {
        setInstagramUsername(username);
      }
      window.history.replaceState({}, '', '/dashboard');
    }
    
    checkInstagramStatus();
  }, [location]);

  const checkInstagramStatus = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://upsellcreatorshub.upsellbusinessagency.com/api';
      const response = await fetch(`${apiUrl}/instagram/posts`);
      const data = await response.json();
      
      if (data.connected) {
        setInstagramConnected(true);
        setInstagramUsername(data.username);
        setInstagramPosts(data.posts || []);
      }
    } catch (error) {
      console.log('Failed to check Instagram status:', error);
    }
  };

  const stats = [
    { 
      name: 'Total Posts', 
      value: '24', 
      change: '+12%',
      trend: 'up',
      icon: CameraIcon, 
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20'
    },
    { 
      name: 'Scheduled', 
      value: '8', 
      change: '+5',
      trend: 'up',
      icon: CalendarIcon, 
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/20'
    },
    { 
      name: 'Accounts', 
      value: '4', 
      change: '+2',
      trend: 'up',
      icon: UsersIcon, 
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-500/20'
    },
    { 
      name: 'Engagement', 
      value: '12.5%', 
      change: '-0.8%',
      trend: 'down',
      icon: ChartPieIcon, 
      gradient: 'from-orange-500 to-red-500',
      shadow: 'shadow-orange-500/20'
    },
  ];

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/posts', label: 'Posts', icon: CameraIcon },
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { path: '/analytics', label: 'Analytics', icon: ChartPieIcon },
    { path: '/accounts', label: 'Accounts', icon: UsersIcon },
  ];

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
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.firstName}! 
                    <SparklesIcon className="inline w-8 h-8 ml-2 text-yellow-500" />
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Here's what's happening with your social media today
                  </p>
                </div>
                <Link
                  to="/create-post"
                  className="hidden sm:flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Post
                </Link>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className={`relative bg-white rounded-2xl p-6 shadow-xl ${stat.shadow} overflow-hidden transform hover:scale-105 transition-all duration-300`}
                  >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]} 0%, ${stat.gradient.split(' ')[3]} 100%)`
                      }}
                    />
                    <div className="relative">
                      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
                      <div className={`flex items-center mt-2 text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/create-post"
                  className="group relative bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <PhotoIcon className="w-8 h-8 mb-3" />
                  <p className="font-semibold">Create Post</p>
                  <p className="text-sm opacity-90">Share your content</p>
                </Link>
                
                <Link
                  to="/calendar"
                  className="group relative bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <ClockIcon className="w-8 h-8 mb-3" />
                  <p className="font-semibold">Schedule</p>
                  <p className="text-sm opacity-90">Plan ahead</p>
                </Link>
                
                <Link
                  to="/analytics"
                  className="group relative bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <ChartBarIcon className="w-8 h-8 mb-3" />
                  <p className="font-semibold">Analytics</p>
                  <p className="text-sm opacity-90">Track performance</p>
                </Link>
                
                <Link
                  to="/accounts"
                  className="group relative bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <UsersIcon className="w-8 h-8 mb-3" />
                  <p className="font-semibold">Accounts</p>
                  <p className="text-sm opacity-90">Manage connections</p>
                </Link>
              </div>
            </div>

            {/* Social Media Connections */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Connected Accounts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Instagram Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Instagram</h3>
                  {instagramConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 font-medium">@{instagramUsername}</span>
                      </div>
                      <div className="space-y-2">
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to disconnect your Instagram account?')) {
                              try {
                                const apiUrl = process.env.REACT_APP_API_URL || 'https://upsellcreatorshub.upsellbusinessagency.com/api';
                                const response = await fetch(`${apiUrl}/instagram/disconnect`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                });
                                if (response.ok) {
                                  setInstagramConnected(false);
                                  setInstagramUsername('');
                                  setInstagramPosts([]);
                                  alert('Instagram account disconnected successfully');
                                }
                              } catch (error) {
                                console.error('Failed to disconnect:', error);
                                alert('Failed to disconnect Instagram account');
                              }
                            }
                          }}
                          className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all font-medium"
                        >
                          Disconnect Account
                        </button>
                        <button 
                          onClick={() => {
                            const redirectUri = process.env.NODE_ENV === 'production' 
                              ? 'https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback'
                              : 'https://c27061647981.ngrok-free.app/api/auth/facebook/callback';
                            window.location.href = `https://www.instagram.com/oauth/authorize?client_id=1930105284202034&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
                          }}
                          className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all font-medium"
                        >
                          Reconnect Different Account
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        const redirectUri = process.env.NODE_ENV === 'production' 
                          ? 'https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback'
                          : 'https://c27061647981.ngrok-free.app/api/auth/facebook/callback';
                        window.location.href = `https://www.instagram.com/oauth/authorize?client_id=1930105284202034&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Connect Instagram
                    </button>
                  )}
                </div>

                {/* TikTok Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">TikTok</h3>
                  <p className="text-sm text-gray-600 mb-4">Reach Gen Z with viral content</p>
                  <button 
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Pinterest Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.085.346-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pinterest</h3>
                  <p className="text-sm text-gray-600 mb-4">Share inspiring visual content</p>
                  <button 
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              {/* Recent Posts Preview */}
              {instagramConnected && instagramPosts.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">Recent Instagram Posts</h4>
                    <Link to="/posts" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instagramPosts.slice(0, 3).map((post: any) => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                        {/* Thumbnail */}
                        <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 relative">
                          {post.media_url ? (
                            <img 
                              src={post.media_url} 
                              alt="Instagram post"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`${post.media_url ? 'hidden' : ''} w-full h-full flex flex-col items-center justify-center`}>
                            {post.media_type === 'VIDEO' ? (
                              <>
                                <VideoCameraIcon className="w-16 h-16 text-purple-400 mb-2" />
                                <span className="text-sm text-purple-600 font-medium">Video Post</span>
                              </>
                            ) : post.media_type === 'CAROUSEL_ALBUM' ? (
                              <>
                                <div className="relative">
                                  <PhotoIcon className="w-16 h-16 text-blue-400" />
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    +
                                  </div>
                                </div>
                                <span className="text-sm text-blue-600 font-medium mt-2">Multiple Photos</span>
                              </>
                            ) : (
                              <>
                                <PhotoIcon className="w-16 h-16 text-blue-400 mb-2" />
                                <span className="text-sm text-blue-600 font-medium">Photo Post</span>
                              </>
                            )}
                          </div>
                          {/* Post type badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                              {post.media_type === 'VIDEO' ? '🎥 Video' : 
                               post.media_type === 'CAROUSEL_ALBUM' ? '📸 Carousel' : '📷 Photo'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Post Details */}
                        <div className="p-4">
                          {/* Caption */}
                          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                            {post.caption || 'No caption'}
                          </p>
                          
                          {/* Engagement Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              ❤️ {post.like_count || 0}
                            </span>
                            <span className="flex items-center">
                              💬 {post.comments_count || 0}
                            </span>
                            <span className="flex items-center">
                              📊 {post.impressions || 'N/A'}
                            </span>
                          </div>
                          
                          {/* Date and Action */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(post.timestamp || post.created_time).toLocaleDateString()}
                            </span>
                            <a 
                              href={post.permalink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-all font-medium"
                            >
                              View on Instagram →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;