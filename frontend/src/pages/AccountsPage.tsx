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
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AccountsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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

  // Mock connected accounts data
  const connectedAccounts = [
    {
      id: 1,
      platform: 'Instagram',
      username: '@johndoe',
      connected: true,
      followers: 12500,
      color: 'from-pink-500 to-purple-600',
      icon: '📷'
    }
  ];

  const availableAccounts = [
    {
      platform: 'TikTok',
      description: 'Connect your TikTok account to schedule and post videos',
      color: 'from-black to-gray-800',
      icon: '🎵',
      comingSoon: true
    },
    {
      platform: 'Pinterest',
      description: 'Connect your Pinterest account to manage pins and boards',
      color: 'from-red-500 to-red-600',
      icon: '📌',
      comingSoon: true
    }
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
                  <h1 className="text-3xl font-bold text-gray-900">Connected Accounts</h1>
                  <p className="mt-1 text-sm text-gray-600">Manage your social media accounts</p>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Connected Accounts */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Connected Accounts</h2>
              {connectedAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connectedAccounts.map((account) => (
                    <div key={account.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${account.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                            {account.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{account.platform}</h3>
                            <p className="text-sm text-gray-600">{account.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircleIcon className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Connected</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Followers</span>
                          <span className="font-bold text-gray-900">{account.followers.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                          <LinkIcon className="w-4 h-4 inline mr-1" />
                          Manage
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UsersIcon className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No accounts connected yet</h3>
                  <p className="text-gray-600 mb-6">Connect your social media accounts to start managing your content</p>
                </div>
              )}
            </div>

            {/* Available Platforms */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Platforms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableAccounts.map((platform) => (
                  <div key={platform.platform} className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${platform.comingSoon ? 'border-2 border-dashed border-gray-200' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{platform.platform}</h3>
                          {platform.comingSoon && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-6">{platform.description}</p>

                    <button 
                      disabled={platform.comingSoon}
                      className={`w-full py-3 px-4 rounded-2xl font-medium transition-all ${
                        platform.comingSoon 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      <PlusIcon className="w-5 h-5 inline mr-2" />
                      {platform.comingSoon ? 'Coming Soon' : `Connect ${platform.platform}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Management Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Management Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Security</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use strong, unique passwords</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Review connected apps regularly</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Best Practices</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Keep your profile information updated</li>
                    <li>• Monitor account analytics regularly</li>
                    <li>• Maintain consistent branding across platforms</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;