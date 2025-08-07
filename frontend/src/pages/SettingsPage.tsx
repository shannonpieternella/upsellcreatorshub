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
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  MoonIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeSection, setActiveSection] = useState('profile');
  
  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoPost, setAutoPost] = useState(false);
  const [timezone, setTimezone] = useState('America/New_York');

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

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'preferences', label: 'Preferences', icon: GlobeAltIcon },
    { id: 'help', label: 'Help & Support', icon: QuestionMarkCircleIcon },
  ];

  const handleSaveProfile = () => {
    alert('Profile settings saved successfully!');
  };

  const handleChangePassword = () => {
    alert('Password change email sent!');
  };

  const handleUpgradePlan = () => {
    window.location.href = '/pricing';
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
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="mt-1 text-sm text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-4">
                    <nav className="space-y-1">
                      {settingsSections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        
                        return (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            {section.label}
                            {isActive && <ChevronRightIcon className="ml-auto h-4 w-4" />}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                  {/* Profile Section */}
                  {activeSection === 'profile' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                      
                      <div className="space-y-6">
                        {/* Avatar */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {firstName[0]}{lastName[0]}
                            </div>
                            <div>
                              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all font-medium">
                                Change Photo
                              </button>
                              <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB</p>
                            </div>
                          </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            placeholder="Tell us about yourself..."
                            className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          />
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={handleSaveProfile}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notifications Section */}
                  {activeSection === 'notifications' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                      
                      <div className="space-y-6">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
                          </div>
                          <button
                            onClick={() => setEmailNotifications(!emailNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              emailNotifications ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        {/* Push Notifications */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">Push Notifications</h4>
                            <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                          </div>
                          <button
                            onClick={() => setPushNotifications(!pushNotifications)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              pushNotifications ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              pushNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        {/* Notification Types */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Notify me about:</h4>
                          {['New followers', 'Comments on posts', 'Post performance', 'System updates'].map(type => (
                            <label key={type} className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                              <span className="text-sm text-gray-700">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Section */}
                  {activeSection === 'security' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                      
                      <div className="space-y-6">
                        {/* Password */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Password</h4>
                          <p className="text-sm text-gray-600 mb-4">Last changed 3 months ago</p>
                          <button
                            onClick={handleChangePassword}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all font-medium"
                          >
                            Change Password
                          </button>
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Recommended
                            </span>
                          </div>
                          <button className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all font-medium">
                            Enable 2FA
                          </button>
                        </div>

                        {/* Active Sessions */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Active Sessions</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">MacBook Pro</p>
                                  <p className="text-xs text-gray-500">Current session</p>
                                </div>
                              </div>
                              <span className="text-xs text-green-600">Active now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing Section */}
                  {activeSection === 'billing' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
                      
                      <div className="space-y-6">
                        {/* Current Plan */}
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">Free Plan</h4>
                              <p className="text-sm text-gray-600">Basic features for individuals</p>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">$0/mo</span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-700">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>1 social account</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>10 posts per month</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                              <span>Basic analytics</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleUpgradePlan}
                            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
                          >
                            Upgrade to Pro
                          </button>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                          <p className="text-sm text-gray-600">No payment method on file</p>
                          <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium">
                            Add Payment Method
                          </button>
                        </div>

                        {/* Billing History */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Billing History</h4>
                          <p className="text-sm text-gray-600">No billing history available</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Section */}
                  {activeSection === 'preferences' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
                      
                      <div className="space-y-6">
                        {/* Language */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>English (US)</option>
                            <option>Nederlands</option>
                            <option>Deutsch</option>
                            <option>Français</option>
                          </select>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                          <select 
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/Amsterdam">Amsterdam (CET)</option>
                          </select>
                        </div>

                        {/* Dark Mode */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <MoonIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <h4 className="font-medium text-gray-900">Dark Mode</h4>
                              <p className="text-sm text-gray-600">Easier on the eyes at night</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              darkMode ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>

                        {/* Auto-post */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">Auto-post at optimal times</h4>
                            <p className="text-sm text-gray-600">Let AI schedule your posts</p>
                          </div>
                          <button
                            onClick={() => setAutoPost(!autoPost)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              autoPost ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              autoPost ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Help Section */}
                  {activeSection === 'help' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Help & Support</h2>
                      
                      <div className="space-y-6">
                        {/* Quick Links */}
                        <div className="grid grid-cols-2 gap-4">
                          <a href="#" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                            <DocumentTextIcon className="w-8 h-8 text-purple-600 mb-2" />
                            <h4 className="font-medium text-gray-900">Documentation</h4>
                            <p className="text-sm text-gray-600">Browse guides and tutorials</p>
                          </a>
                          
                          <a href="#" className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                            <QuestionMarkCircleIcon className="w-8 h-8 text-purple-600 mb-2" />
                            <h4 className="font-medium text-gray-900">FAQs</h4>
                            <p className="text-sm text-gray-600">Find quick answers</p>
                          </a>
                        </div>

                        {/* Contact Support */}
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                          <h4 className="font-medium text-gray-900 mb-2">Need more help?</h4>
                          <p className="text-sm text-gray-600 mb-4">Our support team is here to help you 24/7</p>
                          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium">
                            Contact Support
                          </button>
                        </div>

                        {/* App Version */}
                        <div className="text-center text-sm text-gray-500">
                          <p>UpsellCreatorsHub v1.0.0</p>
                          <p>© 2024 Upsell Business Agency</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;