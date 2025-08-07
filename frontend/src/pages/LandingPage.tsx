import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  UsersIcon,
  BoltIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'AI-Powered Content',
      description: 'Generate engaging content with our advanced AI assistant',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <CalendarIcon className="w-8 h-8" />,
      title: 'Smart Scheduling',
      description: 'Schedule posts across all platforms at optimal times',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Track performance and optimize your social strategy',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: 'Multi-Account Management',
      description: 'Manage all your social accounts from one dashboard',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: 'Automation Tools',
      description: 'Automate repetitive tasks and save hours every week',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security for your data',
      gradient: 'from-gray-600 to-gray-800',
    },
  ];

  const plans = [
    {
      name: 'Free Trial',
      price: billingCycle === 'monthly' ? '$0' : '$0',
      originalPrice: null,
      period: '14 days',
      description: 'Perfect for testing',
      features: [
        '3 social accounts',
        '10 posts/month',
        'Basic analytics',
        'Email support',
        'Instagram integration',
      ],
      notIncluded: ['AI content generation', 'Priority support', 'Advanced analytics'],
      gradient: 'from-gray-500 to-gray-600',
      buttonText: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? '$49' : '$39',
      originalPrice: billingCycle === 'yearly' ? '$588' : null,
      period: billingCycle === 'monthly' ? '/month' : '/month',
      description: 'For growing businesses',
      features: [
        '15 social accounts',
        'Unlimited posts',
        'Advanced analytics',
        'Priority support',
        'AI content generation',
        'Instagram, TikTok, Pinterest',
        'Team collaboration',
      ],
      notIncluded: [],
      gradient: 'from-purple-600 to-pink-600',
      buttonText: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      originalPrice: null,
      period: '',
      description: 'For large teams',
      features: [
        'Unlimited accounts',
        'Custom features',
        'Dedicated support',
        'API access',
        'White-label options',
        'Custom integrations',
        'SLA guarantee',
      ],
      notIncluded: [],
      gradient: 'from-black to-gray-800',
      buttonText: 'Contact Sales',
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechStart Inc.',
      image: 'https://i.pravatar.cc/150?img=1',
      quote: 'UpsellCreatorsHub transformed our social media strategy. We saw a 300% increase in engagement within the first month!',
    },
    {
      name: 'Mike Chen',
      role: 'Influencer',
      company: '@mikelifestyle',
      image: 'https://i.pravatar.cc/150?img=3',
      quote: 'The AI content suggestions are incredible. It\'s like having a creative team working 24/7.',
    },
    {
      name: 'Emma Wilson',
      role: 'CEO',
      company: 'Fashion Forward',
      image: 'https://i.pravatar.cc/150?img=5',
      quote: 'Managing multiple brand accounts has never been easier. This tool is a game-changer!',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/25"></div>
              <div>
                <span className="text-2xl font-bold text-gray-900">UpsellCreators</span>
                <span className="text-2xl font-light text-gray-600">Hub</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all transform hover:scale-105">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
              <SparklesIcon className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-purple-700 font-medium">Now with AI-powered content generation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Grow Your Social Media
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                10x Faster
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The only platform you need to manage Instagram, TikTok, and Pinterest. 
              Schedule posts, analyze performance, and grow your audience with AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30 transition-all transform hover:scale-105">
                Start 14-Day Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition-all">
                <PlayCircleIcon className="w-6 h-6 mr-2" />
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-500">No credit card required • Cancel anytime</p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                      <div className="text-white/80 text-sm mb-1">Total Followers</div>
                      <div className="text-3xl font-bold text-white">124.5K</div>
                      <div className="text-green-300 text-sm mt-1">↑ 12.5%</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                      <div className="text-white/80 text-sm mb-1">Engagement Rate</div>
                      <div className="text-3xl font-bold text-white">8.7%</div>
                      <div className="text-green-300 text-sm mt-1">↑ 2.3%</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                      <div className="text-white/80 text-sm mb-1">Posts This Week</div>
                      <div className="text-3xl font-bold text-white">28</div>
                      <div className="text-white/60 text-sm mt-1">On schedule</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dominate Social Media
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to save you time and grow your audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start free, upgrade when you're ready
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-2xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 ${
                  plan.popular 
                    ? 'shadow-2xl border-2 border-purple-500 scale-105' 
                    : 'shadow-lg border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    )}
                  </div>
                  {plan.originalPrice && (
                    <p className="text-sm text-gray-500 line-through mt-2">
                      ${plan.originalPrice} per year
                    </p>
                  )}
                  {billingCycle === 'yearly' && plan.price !== 'Custom' && plan.price !== '$0' && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Save ${billingCycle === 'yearly' ? '120' : '0'} per year
                    </p>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start opacity-50">
                      <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-500 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 px-6 rounded-2xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful social media managers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-purple-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Social Media?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of creators and businesses growing their audience with UpsellCreatorsHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Your Free Trial
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="mailto:support@upsellcreatorshub.com"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur text-white rounded-2xl font-semibold text-lg border border-white/30 hover:bg-white/20 transition-all"
            >
              Contact Sales
            </a>
          </div>
          <p className="text-white/80 mt-6">
            ✓ 14-day free trial &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"></div>
                <div>
                  <span className="text-xl font-bold">UpsellCreators</span>
                  <span className="text-xl font-light text-gray-400">Hub</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Your all-in-one platform for Instagram, TikTok, and Pinterest management.
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.085.346-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/data-deletion" className="hover:text-white transition-colors">Data Deletion</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@upsellcreatorshub.com" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="https://status.upsellcreatorshub.com" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 UpsellCreatorsHub. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-4 md:mt-0">
                Part of <a href="https://upsellbusinessagency.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Upsell Business Agency</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;