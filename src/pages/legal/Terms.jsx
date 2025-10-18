import React from 'react'
import PageMeta from '@/components/PageMeta'
import { Link } from 'react-router-dom'
import { Shield, AlertCircle, FileText, Scale } from 'lucide-react'

export default function Terms() {
  return (
    <>
      <PageMeta
        title="Terms of Service | Nati.dev"
        description="Terms of Service for Nati.dev AI development platform"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-lg text-[var(--muted-foreground)]">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {/* Important Notice */}
            <div className="p-6 rounded-lg border border-amber-500/20 bg-amber-500/5 mb-8">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-0">Important Notice</h3>
                  <p className="text-sm mb-0">
                    By using Nati.dev, you agree to these Terms of Service. If you do not agree, please discontinue use immediately.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Nati.dev ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              These Terms apply to all users of the Service, including without limitation users who are developers, 
              businesses, or AI model consumers.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Nati.dev provides an AI-powered development platform that enables users to:
            </p>
            <ul>
              <li>Access and interact with various Large Language Models (LLMs)</li>
              <li>Build, deploy, and manage AI applications</li>
              <li>Integrate AI capabilities into their workflows</li>
              <li>Utilize our desktop application and web dashboard</li>
            </ul>

            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Immediately notify us of unauthorized use</li>
            </ul>

            <h3>3.2 Account Eligibility</h3>
            <p>
              You must be at least 18 years old to use this Service. By agreeing to these Terms, you represent that you are at least 18 years of age.
            </p>

            <h2>4. AI Usage and Limitations</h2>
            <h3>4.1 AI Model Access</h3>
            <p>
              We provide access to third-party AI models (including but not limited to GPT, Claude, Gemini). 
              Your use of these models is subject to:
            </p>
            <ul>
              <li>Our <Link to="/legal/acceptable-use" className="text-[var(--primary)] hover:underline">Acceptable Use Policy</Link></li>
              <li>Third-party provider terms and conditions</li>
              <li>Rate limits and usage quotas based on your subscription tier</li>
            </ul>

            <h3>4.2 AI Output Disclaimer</h3>
            <p>
              AI-generated content is provided "as is" without warranties. You acknowledge that:
            </p>
            <ul>
              <li>AI outputs may contain errors, biases, or inaccuracies</li>
              <li>You are solely responsible for reviewing and validating AI-generated content</li>
              <li>Nati.dev is not liable for decisions made based on AI outputs</li>
              <li>AI models may occasionally produce inappropriate or harmful content</li>
            </ul>

            <h2>5. Subscription and Payment</h2>
            <h3>5.1 Pricing</h3>
            <p>
              Certain features require a paid subscription. Current pricing is available at our{' '}
              <Link to="/onboarding/pricing" className="text-[var(--primary)] hover:underline">Pricing Page</Link>.
            </p>

            <h3>5.2 Billing</h3>
            <ul>
              <li>Subscriptions are billed in advance on a monthly or annual basis</li>
              <li>Fees are non-refundable except as required by law</li>
              <li>You authorize us to charge your payment method</li>
              <li>Failure to pay may result in service suspension or termination</li>
            </ul>

            <h3>5.3 Usage Limits</h3>
            <p>
              API calls, token usage, and other resources are subject to limits based on your plan. 
              Excessive usage may result in additional charges or temporary service restrictions.
            </p>

            <h2>6. Intellectual Property</h2>
            <h3>6.1 Service Ownership</h3>
            <p>
              The Service, including all software, designs, text, graphics, and other content, is owned by Nati.dev 
              and protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3>6.2 User Content</h3>
            <p>
              You retain ownership of content you submit to the Service. By submitting content, you grant us a 
              license to use, modify, and process it to provide the Service.
            </p>

            <h3>6.3 AI Training</h3>
            <p>
              Unless you opt-out, your interactions may be used to improve our Service. See our{' '}
              <Link to="/legal/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link> for details.
            </p>

            <h2>7. Prohibited Uses</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Generate spam, malware, or harmful content</li>
              <li>Impersonate others or provide false information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use for illegal surveillance or harassment</li>
              <li>Generate deepfakes or misleading synthetic media</li>
            </ul>

            <h2>8. Data Privacy and Security</h2>
            <p>
              Our collection and use of personal information is described in our{' '}
              <Link to="/legal/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link>. 
              We implement industry-standard security measures, but cannot guarantee absolute security.
            </p>

            <h2>9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul>
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Inactivity for an extended period</li>
            </ul>
            <p>
              You may terminate your account at any time through your account settings.
            </p>

            <h2>10. Disclaimers and Limitations of Liability</h2>
            <h3>10.1 Service Availability</h3>
            <p>
              The Service is provided "as is" and "as available." We do not guarantee:
            </p>
            <ul>
              <li>Uninterrupted or error-free operation</li>
              <li>Freedom from viruses or harmful components</li>
              <li>Accuracy or reliability of AI outputs</li>
              <li>Availability of third-party AI models</li>
            </ul>

            <h3>10.2 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Nati.dev shall not be liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages exceeding the amount you paid in the past 12 months</li>
            </ul>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold Nati.dev harmless from any claims arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit or generate</li>
            </ul>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting. 
              Continued use of the Service constitutes acceptance of modified Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
            </p>
            <ul>
              <li>Email: legal@nati.dev</li>
              <li>Address: [Your Business Address]</li>
            </ul>

            {/* Quick Links */}
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <Link
                to="/legal/privacy"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <Shield className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold">Privacy Policy</div>
                  <div className="text-sm text-[var(--muted-foreground)]">How we handle your data</div>
                </div>
              </Link>
              
              <Link
                to="/legal/acceptable-use"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <FileText className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold">Acceptable Use Policy</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Usage guidelines</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
