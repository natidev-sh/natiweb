import React from 'react'
import PageMeta from '@/components/PageMeta'
import { Link } from 'react-router-dom'
import { Shield, Lock, Eye, Database, User, Globe } from 'lucide-react'

export default function Privacy() {
  return (
    <>
      <PageMeta
        title="Privacy Policy | Nati.dev"
        description="Privacy Policy for Nati.dev - How we collect, use, and protect your data"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-lg text-[var(--muted-foreground)]">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {/* Privacy Commitment */}
            <div className="p-6 rounded-lg border border-green-500/20 bg-green-500/5 mb-8">
              <div className="flex gap-3">
                <Lock className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-0">Our Privacy Commitment</h3>
                  <p className="text-sm mb-0">
                    We are committed to protecting your privacy and being transparent about how we collect, use, and safeguard your data.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Email address, name, password, profile photo</li>
              <li><strong>Payment Information:</strong> Billing address, payment method (processed by third-party payment processors)</li>
              <li><strong>Content:</strong> Prompts, API inputs, generated outputs, code, and project data</li>
              <li><strong>Support Communications:</strong> Messages you send to our support team</li>
            </ul>

            <h3>1.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Usage Data:</strong> Features used, API calls made, token consumption, response times</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Telemetry:</strong> Desktop app performance, error logs, crash reports</li>
              <li><strong>Cookies:</strong> See our <Link to="/legal/cookies" className="text-[var(--primary)] hover:underline">Cookie Policy</Link></li>
            </ul>

            <h3>1.3 AI Interaction Data</h3>
            <ul>
              <li><strong>Prompts and Responses:</strong> Your inputs to AI models and generated outputs</li>
              <li><strong>Model Usage:</strong> Which AI models you use and how frequently</li>
              <li><strong>Feedback:</strong> Ratings and feedback on AI outputs</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <h3>2.1 Service Provision</h3>
            <ul>
              <li>Process API requests and deliver AI-generated responses</li>
              <li>Manage your account and authenticate access</li>
              <li>Process payments and maintain billing records</li>
              <li>Provide customer support</li>
            </ul>

            <h3>2.2 Service Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve features</li>
              <li>Monitor and optimize system performance</li>
              <li>Develop new features and capabilities</li>
              <li>Train and improve our AI models (with opt-out available)</li>
            </ul>

            <h3>2.3 Communications</h3>
            <ul>
              <li>Send service updates and security alerts</li>
              <li>Respond to inquiries and requests</li>
              <li>Send marketing communications (with opt-out)</li>
              <li>Conduct surveys and research</li>
            </ul>

            <h3>2.4 Security and Compliance</h3>
            <ul>
              <li>Detect and prevent fraud or abuse</li>
              <li>Enforce our Terms of Service</li>
              <li>Comply with legal obligations</li>
              <li>Protect our rights and property</li>
            </ul>

            <h2>3. AI Model Training</h2>
            
            <h3>3.1 Data Usage for Training</h3>
            <p>
              By default, your prompts and interactions may be used to improve our AI models and services. We:
            </p>
            <ul>
              <li>Remove personally identifiable information before training</li>
              <li>Aggregate and anonymize data</li>
              <li>Use data to improve model accuracy and safety</li>
              <li>Share anonymized data with AI model providers (OpenAI, Anthropic, Google)</li>
            </ul>

            <h3>3.2 Opt-Out</h3>
            <p>
              You can opt out of AI training data usage:
            </p>
            <ul>
              <li>Navigate to Settings → Privacy → AI Training</li>
              <li>Toggle "Allow my data to improve AI models" to OFF</li>
              <li>Contact us at privacy@nati.dev to request historical data exclusion</li>
            </ul>

            <h2>4. Data Sharing and Disclosure</h2>
            
            <h3>4.1 Third-Party Service Providers</h3>
            <p>We share data with:</p>
            <ul>
              <li><strong>AI Model Providers:</strong> OpenAI, Anthropic, Google (to process your requests)</li>
              <li><strong>Cloud Infrastructure:</strong> AWS, Supabase (for hosting and databases)</li>
              <li><strong>Payment Processors:</strong> Stripe (for payment processing)</li>
              <li><strong>Analytics:</strong> Posthog, Sentry (for usage analytics and error tracking)</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose information when:</p>
            <ul>
              <li>Required by law or legal process</li>
              <li>Necessary to protect rights, property, or safety</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
              <li>With your explicit consent</li>
            </ul>

            <h3>4.3 No Sale of Personal Data</h3>
            <p>
              We do not sell your personal information to third parties for their marketing purposes.
            </p>

            <h2>5. Data Retention</h2>
            <ul>
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Usage Logs:</strong> 90 days for operational purposes, then aggregated</li>
              <li><strong>API Data:</strong> 30 days, unless required for compliance</li>
              <li><strong>Deleted Accounts:</strong> Data deleted within 30 days, except as legally required</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>We implement industry-standard security measures:</p>
            <ul>
              <li><strong>Encryption:</strong> Data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
              <li><strong>Audits:</strong> Regular security audits and penetration testing</li>
              <li><strong>Compliance:</strong> SOC 2 Type II, GDPR, CCPA (in progress)</li>
            </ul>

            <h2>7. Your Privacy Rights</h2>
            
            <h3>7.1 Access and Portability</h3>
            <ul>
              <li>Request a copy of your personal data</li>
              <li>Export your data in machine-readable format</li>
            </ul>

            <h3>7.2 Correction and Deletion</h3>
            <ul>
              <li>Update inaccurate information</li>
              <li>Request deletion of your account and data</li>
            </ul>

            <h3>7.3 Restriction and Objection</h3>
            <ul>
              <li>Opt out of marketing communications</li>
              <li>Restrict processing of your data</li>
              <li>Object to automated decision-making</li>
            </ul>

            <h3>7.4 Exercising Your Rights</h3>
            <p>
              To exercise these rights, contact us at privacy@nati.dev or use your account settings.
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              We operate globally and may transfer data to countries outside your residence. We ensure adequate protection through:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Data Processing Agreements (see our <Link to="/legal/dpa" className="text-[var(--primary)] hover:underline">DPA</Link>)</li>
              <li>Adequacy decisions where applicable</li>
            </ul>

            <h2>9. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 18. We do not knowingly collect data from children. 
              If you believe we have collected data from a child, contact us immediately.
            </p>

            <h2>10. California Privacy Rights (CCPA)</h2>
            <p>California residents have additional rights:</p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of sale (we do not sell data)</li>
              <li>Right to non-discrimination for exercising rights</li>
            </ul>

            <h2>11. European Privacy Rights (GDPR)</h2>
            <p>EU/EEA residents have rights under GDPR:</p>
            <ul>
              <li>Lawful basis for processing (consent, contract, legitimate interests)</li>
              <li>Right to lodge complaints with supervisory authorities</li>
              <li>Data Protection Officer contact: dpo@nati.dev</li>
            </ul>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes via:
            </p>
            <ul>
              <li>Email notification</li>
              <li>In-app notification</li>
              <li>Prominent notice on our website</li>
            </ul>

            <h2>13. Contact Us</h2>
            <p>For privacy-related questions or concerns:</p>
            <ul>
              <li><strong>Email:</strong> privacy@nati.dev</li>
              <li><strong>DPO:</strong> dpo@nati.dev</li>
              <li><strong>Address:</strong> [Your Business Address]</li>
            </ul>

            {/* Quick Links */}
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Link
                to="/legal/terms"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <Database className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-sm">Terms of Service</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Usage terms</div>
                </div>
              </Link>
              
              <Link
                to="/legal/cookies"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <Globe className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-sm">Cookie Policy</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Cookie usage</div>
                </div>
              </Link>

              <Link
                to="/legal/dpa"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <User className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold text-sm">DPA</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Data processing</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
