import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using UpsellCreatorsHub, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                UpsellCreatorsHub provides a social media management platform that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Connect and manage multiple social media accounts</li>
                <li>Schedule and publish content across platforms</li>
                <li>Analyze social media performance and engagement</li>
                <li>Collaborate with team members on content creation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use our service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violate any laws or regulations</li>
                <li>Post content that infringes on intellectual property rights</li>
                <li>Distribute spam, malware, or harmful content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use our service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content Ownership</h2>
              <p className="text-gray-700">
                You retain ownership of all content you create and publish through our platform. By using our service, 
                you grant us a limited license to store, process, and display your content as necessary to provide 
                our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700">
                Our service integrates with third-party social media platforms (Instagram, TikTok, Pinterest). 
                Your use of these platforms is governed by their respective terms of service and privacy policies. 
                We are not responsible for the practices or policies of these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Subscription and Payments</h2>
              <p className="text-gray-700 mb-4">
                Some features of our service require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Pay all applicable fees according to your chosen plan</li>
                <li>Provide accurate billing information</li>
                <li>Authorize automatic renewal unless canceled</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You may cancel your subscription at any time. Refunds are provided according to our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, UpsellCreatorsHub shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from your use or inability to 
                use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless UpsellCreatorsHub from any claims, losses, liabilities, 
                damages, costs, or expenses arising from your use of our service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at any time for violation of these terms 
                or for any other reason at our sole discretion. You may also terminate your account at any time 
                through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modifications to Terms</h2>
              <p className="text-gray-700">
                We may modify these Terms of Service at any time. We will notify users of material changes via 
                email or through our platform. Continued use of our service after changes constitutes acceptance 
                of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700">
                These Terms of Service are governed by the laws of the Netherlands, without regard to its conflict 
                of law provisions. Any disputes shall be resolved in the courts of the Netherlands.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                <p className="text-gray-700">
                  <strong>Email:</strong> info@upsellbusinessagency.com<br />
                  <strong>Website:</strong> https://upsellcreatorshub.upsellbusinessagency.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;