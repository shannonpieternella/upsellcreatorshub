import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  CameraIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayPosts = scheduledPosts.filter(post => {
        const postDate = new Date(post.scheduledFor);
        return postDate.getDate() === day && 
               postDate.getMonth() === currentDate.getMonth() &&
               postDate.getFullYear() === currentDate.getFullYear();
      });

      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-32 bg-white border border-gray-200 p-2 hover:bg-gray-50 transition-colors ${
            isToday ? 'ring-2 ring-primary-500' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {dayPosts.length > 0 && (
              <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                {dayPosts.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {dayPosts.slice(0, 2).map((post, index) => (
              <div
                key={index}
                className="text-xs p-1 bg-pink-50 text-pink-700 rounded truncate"
              >
                {post.content?.substring(0, 30)}...
              </div>
            ))}
            {dayPosts.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayPosts.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  useEffect(() => {
    // Fetch scheduled posts
    fetchScheduledPosts();
  }, [currentDate]);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts/scheduled');
      const data = await response.json();
      setScheduledPosts(data.posts || []);
    } catch (error) {
      console.log('Failed to fetch scheduled posts:', error);
    }
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
              <Link to="/posts" className="sidebar-item">
                <CameraIcon className="w-5 h-5 mr-3" />
                Posts
              </Link>
              <Link to="/calendar" className="sidebar-item sidebar-item-active">
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
              <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
              <Link to="/posts" className="btn-primary">
                <PlusIcon className="w-5 h-5 mr-2" />
                Schedule Post
              </Link>
            </div>
          </header>

          <main className="p-8">
            {/* Calendar Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Platform Filters */}
              <div className="flex space-x-3 mb-6">
                <button className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-lg">
                  Instagram
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                  TikTok (Soon)
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                  Pinterest (Soon)
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {renderCalendarDays()}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-pink-100 rounded"></div>
                  <span className="text-sm text-gray-600">Instagram Post</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 rounded"></div>
                  <span className="text-sm text-gray-600">TikTok (Coming Soon)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span className="text-sm text-gray-600">Pinterest (Coming Soon)</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;