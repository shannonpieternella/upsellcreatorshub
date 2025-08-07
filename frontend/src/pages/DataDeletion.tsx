import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DataDeletion: React.FC = () => {
  const [email, setEmail] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === 'DELETE MY DATA') {
      setSubmitted(true);
      // In production, this would send a request to your backend
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
              <TrashIcon className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Data Deletion Request</h1>
              <p className="text-gray-600 mt-2">Request permanent deletion of your data</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Deletion Policy</h2>
              <p className="text-gray-700 mb-4">
                In compliance with data protection regulations including GDPR, you have the right to request 
                the deletion of your personal data from our systems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Will Be Deleted</h2>
              <p className="text-gray-700 mb-4">When you request data deletion, we will permanently remove:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your account information (name, email, profile data)</li>
                <li>All connected social media account credentials and tokens</li>
                <li>Content you've created and scheduled through our platform</li>
                <li>Analytics and usage data associated with your account</li>
                <li>Payment information and subscription history</li>
                <li>Any other personal data we have collected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Information</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                  <div className="text-amber-800">
                    <p className="font-semibold mb-2">Before requesting deletion:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>This action is permanent and cannot be undone</li>
                      <li>You will lose access to your account immediately</li>
                      <li>All scheduled posts will be cancelled</li>
                      <li>We may retain certain data as required by law</li>
                      <li>The deletion process may take up to 30 days to complete</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention Exceptions</h2>
              <p className="text-gray-700 mb-4">
                We may retain certain information after deletion for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Legal obligations and compliance requirements</li>
                <li>Fraud prevention and security purposes</li>
                <li>Backup systems (deleted within 90 days)</li>
                <li>Anonymized data for analytics (no longer identifiable)</li>
              </ul>
            </section>

            {!submitted ? (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Submit Deletion Request</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your account email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                      Type "DELETE MY DATA" to confirm
                    </label>
                    <input
                      type="text"
                      id="confirm"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="DELETE MY DATA"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={confirmText !== 'DELETE MY DATA'}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                      confirmText === 'DELETE MY DATA'
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Deletion Request
                  </button>
                </form>
              </section>
            ) : (
              <section className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Request Submitted</h3>
                <p className="text-gray-700 mb-4">
                  Your data deletion request has been received. We will process your request and send a 
                  confirmation email to <strong>{email}</strong> within 48 hours.
                </p>
                <p className="text-sm text-gray-600">
                  Your data will be permanently deleted within 30 days.
                </p>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternative Options</h2>
              <p className="text-gray-700 mb-4">Instead of deleting your data, you can also:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Deactivate your account:</strong> Temporarily disable access while preserving your data</li>
                <li><strong>Export your data:</strong> Download a copy of all your information before deletion</li>
                <li><strong>Disconnect social accounts:</strong> Remove specific integrations without deleting everything</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about data deletion or need assistance, please contact us:
              </p>
              <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                <p className="text-gray-700">
                  <strong>Email:</strong> info@upsellbusinessagency.com<br />
                  <strong>Response time:</strong> Within 48 hours
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDeletion;