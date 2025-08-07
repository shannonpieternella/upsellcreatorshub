import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UsersIcon,
  PlusIcon,
  CameraIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramPosts, setInstagramPosts] = useState([]);

  useEffect(() => {
    // Check URL parameters for Instagram connection status
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('instagram_connected') === 'true') {
      const username = urlParams.get('username');
      if (username) {
        setInstagramUsername(username);
      }
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
    
    // Check Instagram connection status from API
    checkInstagramStatus();
  }, [location]);

  const checkInstagramStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instagram/posts');
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
    { name: 'Total Posts', value: '24', icon: CameraIcon, color: 'from-blue-500 to-cyan-500' },
    { name: 'Scheduled', value: '8', icon: CalendarIcon, color: 'from-purple-500 to-pink-500' },
    { name: 'Accounts', value: '4', icon: UsersIcon, color: 'from-green-500 to-emerald-500' },
    { name: 'Engagement', value: '12.5%', icon: ChartPieIcon, color: 'from-orange-500 to-red-500' },
  ];

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
              <Link to="/dashboard" className="sidebar-item sidebar-item-active">
                <ChartBarIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link to="/posts" className="sidebar-item">
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <Link to="/create-post" className="btn-primary">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Post
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"></div>
                  <button 
                    onClick={() => {
                      useAuthStore.getState().logout();
                      window.location.href = '/';
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 ml-4"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8">
            <div
              style={{ marginBottom: '2rem' }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.name}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Social Accounts */}
            <div
              style={{ marginBottom: '2rem' }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect Social Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instagram Business</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {instagramConnected 
                      ? `Connected: @${instagramUsername || 'Your Account'}` 
                      : 'Connect your Instagram Business account'
                    }
                  </p>
                  {instagramConnected ? (
                    <div className="space-y-2">
                      <button 
                        className="w-full btn-secondary cursor-default"
                        disabled
                      >
                        ✓ Connected
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            await fetch('http://localhost:5000/api/instagram/disconnect', { 
                              method: 'POST' 
                            });
                            setInstagramConnected(false);
                            setInstagramUsername('');
                            setInstagramPosts([]);
                          } catch (error) {
                            console.log('Failed to disconnect');
                          }
                        }}
                        className="w-full text-xs text-red-600 hover:text-red-700"
                      >
                        Disconnect & Reconnect
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        window.location.href = "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1930105284202034&redirect_uri=https://c27061647981.ngrok-free.app/api/auth/facebook/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";
                      }}
                      className="w-full btn-primary"
                    >
                      Connect Instagram
                    </button>
                  )}
                </div>

                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Twitter</h3>
                  <p className="text-sm text-gray-600 mb-4">Connect your Twitter account</p>
                  <button className="btn-secondary w-full" disabled>
                    Coming Soon
                  </button>
                </div>

                <div className="card p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.085.346-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pinterest</h3>
                  <p className="text-sm text-gray-600 mb-4">Connect your Pinterest account</p>
                  <button className="btn-secondary w-full" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {instagramConnected ? `Instagram Posts (@${instagramUsername})` : 'Recent Posts'}
                </h3>
                <div className="space-y-4">
                  {instagramConnected && instagramPosts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {instagramPosts.slice(0, 3).map((post: any) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {post.media_type === 'VIDEO' ? (
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              ) : post.media_type === 'IMAGE' ? (
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {post.media_type === 'VIDEO' ? '🎥 Video' : 
                                   post.media_type === 'IMAGE' ? '📸 Photo' : '📱 Carousel'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(post.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                                {post.caption ? post.caption.substring(0, 120) + (post.caption.length > 120 ? '...' : '') : 'No caption'}
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                <a 
                                  href={post.permalink || `https://www.instagram.com/p/${post.id}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full hover:bg-pink-200 transition-colors"
                                >
                                  View on Instagram
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : instagramConnected ? (
                    <p className="text-gray-500 text-center py-8">No Instagram posts found</p>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Connect Instagram to see your posts!</p>
                  )}
                </div>
              </div>

              <div
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Schedule</h3>
                <div className="space-y-4">
                  <p className="text-gray-500 text-center py-8">No scheduled posts</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;