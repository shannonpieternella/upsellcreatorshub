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
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const CalendarPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  // Mock scheduled posts data
  const scheduledPosts = {
    '2025-01-15': [{ time: '10:00 AM', platform: 'instagram', content: 'New product launch!' }],
    '2025-01-20': [{ time: '2:00 PM', platform: 'instagram', content: 'Behind the scenes' }],
  };

  const getPostsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return scheduledPosts[dateStr as keyof typeof scheduledPosts] || [];
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
                  <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
                  <p className="mt-1 text-sm text-gray-600">Schedule and organize your social media posts</p>
                </div>
                <Link
                  to="/create-post"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Schedule Post
                </Link>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevMonth}
                        className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                      >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium text-gray-700"
                      >
                        Today
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                      >
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentDate).map((date, index) => {
                      const posts = date ? getPostsForDate(date) : [];
                      return (
                        <div
                          key={index}
                          onClick={() => date && setSelectedDate(date)}
                          className={`
                            aspect-square p-2 rounded-xl cursor-pointer transition-all
                            ${!date ? 'cursor-default' : ''}
                            ${isToday(date) ? 'bg-purple-100 border-2 border-purple-500' : ''}
                            ${isSelected(date) && !isToday(date) ? 'bg-gray-100 border-2 border-gray-300' : ''}
                            ${date && !isToday(date) && !isSelected(date) ? 'hover:bg-gray-50 border border-gray-200' : ''}
                            ${!date ? '' : 'border border-gray-200'}
                          `}
                        >
                          {date && (
                            <>
                              <div className={`text-sm font-medium ${isToday(date) ? 'text-purple-700' : 'text-gray-900'}`}>
                                {date.getDate()}
                              </div>
                              {posts.length > 0 && (
                                <div className="mt-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Scheduled Posts Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {selectedDate ? (
                      <>Scheduled for {selectedDate.toLocaleDateString()}</>
                    ) : (
                      <>Today's Schedule</>
                    )}
                  </h3>
                  
                  <div className="space-y-4">
                    {getPostsForDate(selectedDate || new Date()).length > 0 ? (
                      getPostsForDate(selectedDate || new Date()).map((post, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              <ClockIcon className="w-4 h-4 inline mr-1" />
                              {post.time}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {post.platform}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{post.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No posts scheduled</p>
                        <Link
                          to="/create-post"
                          className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-700 font-medium"
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Schedule a post
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">This Month</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Posts</span>
                      <span className="text-sm font-bold text-gray-900">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <span className="text-sm font-bold text-blue-600">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Published</span>
                      <span className="text-sm font-bold text-green-600">16</span>
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

export default CalendarPage;