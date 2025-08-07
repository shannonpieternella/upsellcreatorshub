import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MobileNav from '../components/MobileNav';
import {
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  CameraIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AnalyticsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

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

  const periods = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
    { id: 'year', label: 'This Year' },
  ];

  const metrics = [
    {
      name: 'Total Reach',
      value: '124.5K',
      change: '+12.5%',
      trend: 'up',
      icon: EyeIcon,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Engagement Rate',
      value: '8.7%',
      change: '+2.3%',
      trend: 'up',
      icon: HeartIcon,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Total Comments',
      value: '3,421',
      change: '-5.2%',
      trend: 'down',
      icon: ChatBubbleLeftIcon,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Shares',
      value: '892',
      change: '+18.7%',
      trend: 'up',
      icon: ArrowPathIcon,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const topPosts = [
    {
      id: 1,
      content: 'New product launch announcement! 🚀',
      platform: 'instagram',
      engagement: { likes: 5432, comments: 234, shares: 89 },
      date: '2 days ago',
    },
    {
      id: 2,
      content: 'Behind the scenes of our latest photoshoot',
      platform: 'instagram',
      engagement: { likes: 3221, comments: 156, shares: 45 },
      date: '5 days ago',
    },
    {
      id: 3,
      content: 'Customer success story featuring @client',
      platform: 'instagram',
      engagement: { likes: 2890, comments: 98, shares: 67 },
      date: '1 week ago',
    },
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
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="mt-1 text-sm text-gray-600">Track your social media performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  {periods.map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedPeriod === period.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.name} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${metric.gradient} rounded-xl flex items-center justify-center text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{metric.name}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Engagement Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Engagement Over Time</h3>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>

              {/* Platform Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Instagram</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-black rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">TikTok</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Pinterest</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Posts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Posts</h3>
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-medium text-gray-900 flex-1 mr-4">{post.content}</p>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center">
                        <HeartIcon className="w-4 h-4 mr-1 text-red-500" />
                        {post.engagement.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <ChatBubbleLeftIcon className="w-4 h-4 mr-1 text-blue-500" />
                        {post.engagement.comments}
                      </span>
                      <span className="flex items-center">
                        <ArrowPathIcon className="w-4 h-4 mr-1 text-green-500" />
                        {post.engagement.shares}
                      </span>
                      <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {post.platform}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;