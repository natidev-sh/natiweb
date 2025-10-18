import React from 'react'
import PageMeta from '@/components/PageMeta'
import { Link } from 'react-router-dom'
import { FileText, Shield, Building, Lock } from 'lucide-react'

export default function DPA() {
  return (
    <>
      <PageMeta
        title="Data Processing Agreement | Nati.dev"
        description="Data Processing Agreement for enterprise customers using Nati.dev"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Data Processing Agreement</h1>
            </div>
            <p className="text-lg text-[var(--muted-foreground)]">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {/* Enterprise Notice */}
            <div className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/5 mb-8">
              <div className="flex gap-3">
                <Building className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-0">Enterprise Customers</h3>
                  <p className="text-sm mb-0">
                    This Data Processing Agreement (DPA) applies to customers who process personal data using Nati.dev. 
                    For enterprise or custom DPAs, contact enterprise@nati.dev
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Definitions</h2>
            <p>In this DPA:</p>
            <ul>
              <li><strong>"Data Protection Laws"</strong> means GDPR, CCPA, and other applicable data protection regulations</li>
              <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person</li>
              <li><strong>"Processing"</strong> means any operation performed on Personal Data</li>
              <li><strong>"Controller"</strong> means the entity that determines the purposes and means of Processing</li>
              <li><strong>"Processor"</strong> means the entity that Processes Personal Data on behalf of the Controller</li>
              <li><strong>"Sub-processor"</strong> means any Processor engaged by Nati.dev</li>
              <li><strong>"Data Subject"</strong> means the individual to whom Personal Data relates</li>
            </ul>

            <h2>2. Scope and Roles</h2>
            
            <h3>2.1 Application</h3>
            <p>
              This DPA applies when you use Nati.dev to Process Personal Data. The scope of Processing is described in 
              Appendix A below.
            </p>

            <h3>2.2 Roles</h3>
            <ul>
              <li><strong>You (Customer)</strong> act as the Controller or Processor of Personal Data</li>
              <li><strong>Nati.dev</strong> acts as your Processor or Sub-processor</li>
              <li>Each party shall comply with its obligations under Data Protection Laws</li>
            </ul>

            <h2>3. Nati.dev's Obligations as Processor</h2>
            
            <h3>3.1 Processing Instructions</h3>
            <p>Nati.dev shall:</p>
            <ul>
              <li>Process Personal Data only on your documented instructions</li>
              <li>Not Process Personal Data for its own purposes</li>
              <li>Inform you if instructions violate Data Protection Laws</li>
              <li>Ensure authorized personnel are bound by confidentiality</li>
            </ul>

            <h3>3.2 Security Measures</h3>
            <p>Nati.dev implements appropriate technical and organizational measures including:</p>
            <ul>
              <li><strong>Encryption:</strong> AES-256 at rest, TLS 1.3 in transit</li>
              <li><strong>Access Controls:</strong> Role-based access, MFA for administrators</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and logging</li>
              <li><strong>Incident Response:</strong> Documented procedures for data breaches</li>
              <li><strong>Audits:</strong> Regular security assessments and penetration testing</li>
              <li><strong>Compliance:</strong> SOC 2 Type II certification (in progress)</li>
            </ul>

            <h3>3.3 Sub-processors</h3>
            <p>
              You authorize Nati.dev to engage Sub-processors listed in Appendix B. Nati.dev shall:
            </p>
            <ul>
              <li>Impose data protection obligations equivalent to this DPA</li>
              <li>Remain liable for Sub-processor performance</li>
              <li>Notify you of any changes to Sub-processors</li>
              <li>Allow you to object to new Sub-processors</li>
            </ul>

            <h3>3.4 Data Subject Rights</h3>
            <p>Nati.dev shall:</p>
            <ul>
              <li>Assist you in responding to Data Subject requests</li>
              <li>Provide tools for access, correction, and deletion</li>
              <li>Notify you of direct requests from Data Subjects</li>
              <li>Cooperate in compliance with your obligations</li>
            </ul>

            <h3>3.5 Data Breach Notification</h3>
            <p>
              In the event of a Personal Data breach, Nati.dev shall:
            </p>
            <ul>
              <li>Notify you without undue delay (within 72 hours where feasible)</li>
              <li>Provide details of the breach and affected data</li>
              <li>Describe measures taken to address the breach</li>
              <li>Cooperate in breach investigation and mitigation</li>
            </ul>

            <h3>3.6 Data Protection Impact Assessment</h3>
            <p>
              Nati.dev shall assist you in conducting Data Protection Impact Assessments (DPIAs) 
              when required by Data Protection Laws.
            </p>

            <h2>4. Your Obligations as Controller</h2>
            
            <p>You shall:</p>
            <ul>
              <li>Ensure you have a lawful basis for Processing</li>
              <li>Provide clear instructions for Processing</li>
              <li>Comply with Data Subject rights requests</li>
              <li>Maintain records of Processing activities</li>
              <li>Notify Nati.dev of any Processing restrictions</li>
            </ul>

            <h2>5. International Data Transfers</h2>
            
            <h3>5.1 Transfer Mechanisms</h3>
            <p>
              When Personal Data is transferred outside the EEA, Nati.dev relies on:
            </p>
            <ul>
              <li><strong>Standard Contractual Clauses (SCCs):</strong> EU Commission approved SCCs</li>
              <li><strong>Adequacy Decisions:</strong> Where available (e.g., UK, Switzerland)</li>
              <li><strong>Additional Safeguards:</strong> Supplementary measures as required</li>
            </ul>

            <h3>5.2 Data Locations</h3>
            <p>
              Personal Data may be stored and Processed in:
            </p>
            <ul>
              <li>United States (AWS us-east-1, us-west-2)</li>
              <li>European Union (AWS eu-west-1)</li>
              <li>Other regions as specified in your service configuration</li>
            </ul>

            <h2>6. Data Retention and Deletion</h2>
            
            <h3>6.1 Retention</h3>
            <p>Nati.dev shall:</p>
            <ul>
              <li>Retain Personal Data only as long as necessary for the services</li>
              <li>Delete or return data upon termination of services</li>
              <li>Comply with your retention instructions</li>
            </ul>

            <h3>6.2 Deletion</h3>
            <p>Upon termination or your request, Nati.dev shall:</p>
            <ul>
              <li>Delete all Personal Data within 30 days</li>
              <li>Provide certification of deletion upon request</li>
              <li>Retain data only as required by law</li>
            </ul>

            <h2>7. Audits and Compliance</h2>
            
            <h3>7.1 Audit Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Audit Nati.dev's compliance with this DPA</li>
              <li>Request information about Processing activities</li>
              <li>Review security documentation and certifications</li>
              <li>Conduct on-site audits (with reasonable notice)</li>
            </ul>

            <h3>7.2 Audit Reports</h3>
            <p>
              Nati.dev provides:
            </p>
            <ul>
              <li>Annual SOC 2 Type II reports</li>
              <li>Security documentation upon request</li>
              <li>Compliance certifications</li>
            </ul>

            <h2>8. Liability and Indemnification</h2>
            
            <h3>8.1 Limitation of Liability</h3>
            <p>
              Each party's liability under this DPA is subject to the limitations in the Terms of Service.
            </p>

            <h3>8.2 Indemnification</h3>
            <p>
              Nati.dev shall indemnify you for claims arising from Nati.dev's breach of this DPA, 
              subject to limitations in the Terms of Service.
            </p>

            <h2>9. Term and Termination</h2>
            
            <p>This DPA:</p>
            <ul>
              <li>Takes effect when you accept the Terms of Service</li>
              <li>Remains in effect while you use the Service</li>
              <li>Survives termination for obligations related to data deletion and confidentiality</li>
            </ul>

            <h2>10. Changes to This DPA</h2>
            
            <p>
              Nati.dev may update this DPA to comply with Data Protection Laws. Material changes 
              will be communicated 30 days in advance.
            </p>

            <h2>Appendix A: Details of Processing</h2>
            
            <h3>Nature and Purpose of Processing</h3>
            <ul>
              <li>Providing AI model access and API services</li>
              <li>Storing and managing user-generated content</li>
              <li>Processing API requests and responses</li>
              <li>Account and subscription management</li>
            </ul>

            <h3>Types of Personal Data</h3>
            <ul>
              <li>Account information (name, email, company)</li>
              <li>Usage data (API calls, prompts, responses)</li>
              <li>Payment information (processed by Stripe)</li>
              <li>Technical data (IP addresses, device info)</li>
            </ul>

            <h3>Categories of Data Subjects</h3>
            <ul>
              <li>Customers and their authorized users</li>
              <li>End users of customer applications</li>
              <li>Business contacts</li>
            </ul>

            <h3>Duration of Processing</h3>
            <ul>
              <li>Duration of the service agreement</li>
              <li>Plus retention period as specified</li>
            </ul>

            <h2>Appendix B: Sub-processors</h2>
            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[var(--border)] p-3 text-left">Sub-processor</th>
                  <th className="border border-[var(--border)] p-3 text-left">Service</th>
                  <th className="border border-[var(--border)] p-3 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--border)] p-3">Amazon Web Services</td>
                  <td className="border border-[var(--border)] p-3">Cloud infrastructure</td>
                  <td className="border border-[var(--border)] p-3">USA, EU</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-3">Supabase Inc.</td>
                  <td className="border border-[var(--border)] p-3">Database hosting</td>
                  <td className="border border-[var(--border)] p-3">USA, EU</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-3">OpenAI, L.L.C.</td>
                  <td className="border border-[var(--border)] p-3">AI model provider</td>
                  <td className="border border-[var(--border)] p-3">USA</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-3">Anthropic PBC</td>
                  <td className="border border-[var(--border)] p-3">AI model provider</td>
                  <td className="border border-[var(--border)] p-3">USA</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-3">Google LLC</td>
                  <td className="border border-[var(--border)] p-3">AI model provider</td>
                  <td className="border border-[var(--border)] p-3">USA, EU</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-3">Stripe, Inc.</td>
                  <td className="border border-[var(--border)] p-3">Payment processing</td>
                  <td className="border border-[var(--border)] p-3">USA, EU</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Updated list available at: <a href="https://nati.dev/legal/subprocessors" className="text-[var(--primary)] hover:underline">nati.dev/legal/subprocessors</a>
            </p>

            <h2>Contact Information</h2>
            
            <p>For DPA-related inquiries:</p>
            <ul>
              <li><strong>Email:</strong> dpo@nati.dev</li>
              <li><strong>Data Protection Officer:</strong> [Name]</li>
              <li><strong>Address:</strong> [Your Business Address]</li>
            </ul>

            {/* Download DPA */}
            <div className="mt-12 p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Download Signed DPA</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Enterprise customers can request a signed DPA
                  </p>
                </div>
                <a
                  href="mailto:enterprise@nati.dev?subject=DPA Request"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm font-medium"
                >
                  Request DPA
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Link
                to="/legal/privacy"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <Shield className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold">Privacy Policy</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Data handling practices</div>
                </div>
              </Link>
              
              <Link
                to="/legal/terms"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <Lock className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold">Terms of Service</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Service agreement</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
