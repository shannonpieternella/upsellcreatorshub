import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  CameraIcon,
  ChartPieIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>({
    overview: {
      followers: 0,
      following: 0,
      posts: 0,
      engagement: 0
    },
    posts: []
  });
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/analytics/instagram?range=${timeRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.log('Failed to fetch analytics:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Reach',
      value: '24.5K',
      change: '+12.5%',
      trend: 'up',
      icon: EyeIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: '+0.8%',
      trend: 'up',
      icon: HeartIcon,
      color: 'from-pink-500 to-purple-600'
    },
    {
      title: 'Profile Visits',
      value: '1,284',
      change: '+23%',
      trend: 'up',
      icon: UsersIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Comments',
      value: '342',
      change: '-5%',
      trend: 'down',
      icon: ChatBubbleLeftIcon,
      color: 'from-orange-500 to-red-500'
    }
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
              <Link to="/dashboard" className="sidebar-item">
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
              <Link to="/analytics" className="sidebar-item sidebar-item-active">
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
            <div className="px-8 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <div className="flex space-x-4">
                  {/* Time Range Selector */}
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="input-field"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>
              </div>

              {/* Platform Tabs */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setSelectedPlatform('instagram')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedPlatform === 'instagram'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Instagram
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                >
                  TikTok (Coming Soon)
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                >
                  Pinterest (Coming Soon)
                </button>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <div
                  key={stat.title}
                  style={{ padding: '1.5rem' }}
                  className="card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center text-sm ${
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
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Engagement Chart */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Over Time</h3>
                <div className="h-64 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ChartBarIcon className="w-12 h-12 text-pink-500 mx-auto mb-2" />
                    <p className="text-gray-600">Chart visualization would go here</p>
                    <p className="text-sm text-gray-500 mt-2">Integrate with Chart.js or Recharts</p>
                  </div>
                </div>
              </div>

              {/* Top Posts */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((post) => (
                    <div key={post} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Post #{post}</p>
                        <p className="text-xs text-gray-500">2.5K likes • 342 comments</p>
                      </div>
                      <div className="text-sm text-green-600">
                        +45%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audience Insights */}
            <div className="card p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Top Locations</h4>
                  <div className="space-y-2">
                    {['United States', 'United Kingdom', 'Canada'].map((location, index) => (
                      <div key={location} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{location}</span>
                        <span className="text-sm font-medium text-gray-900">{35 - index * 10}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Age Groups</h4>
                  <div className="space-y-2">
                    {['18-24', '25-34', '35-44'].map((age, index) => (
                      <div key={age} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{age}</span>
                        <span className="text-sm font-medium text-gray-900">{40 - index * 15}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Best Posting Times</h4>
                  <div className="space-y-2">
                    {['9:00 AM', '12:00 PM', '6:00 PM'].map((time) => (
                      <div key={time} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{time}</span>
                        <span className="text-sm text-green-600">High engagement</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="card p-6 bg-gray-50 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">TikTok</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">TikTok Analytics</h3>
                  <p className="text-sm text-gray-600">Coming Soon</p>
                  <p className="text-xs text-gray-500 mt-2">Track views, likes, shares, and more</p>
                </div>
              </div>
              
              <div className="card p-6 bg-gray-50 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pinterest Analytics</h3>
                  <p className="text-sm text-gray-600">Coming Soon</p>
                  <p className="text-xs text-gray-500 mt-2">Monitor pins, boards, and impressions</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;