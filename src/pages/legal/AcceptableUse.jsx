import React from 'react'
import PageMeta from '@/components/PageMeta'
import { Link } from 'react-router-dom'
import { AlertTriangle, XCircle, CheckCircle, Shield } from 'lucide-react'

export default function AcceptableUse() {
  return (
    <>
      <PageMeta
        title="Acceptable Use Policy | Nati.dev"
        description="Guidelines for acceptable use of Nati.dev AI platform"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Acceptable Use Policy</h1>
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
            <div className="p-6 rounded-lg border border-red-500/20 bg-red-500/5 mb-8">
              <div className="flex gap-3">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-0">Violations May Result in Account Termination</h3>
                  <p className="text-sm mb-0">
                    Violation of this policy may result in immediate suspension or termination of your account without refund.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Purpose</h2>
            <p>
              This Acceptable Use Policy ("AUP") describes prohibited uses of Nati.dev. By using our Service, 
              you agree to comply with this AUP and our{' '}
              <Link to="/legal/terms" className="text-[var(--primary)] hover:underline">Terms of Service</Link>.
            </p>

            <h2>2. Prohibited Uses</h2>
            
            <h3>2.1 Illegal Activities</h3>
            <p>You may not use our Service to:</p>
            <ul>
              <li>Engage in or promote illegal activities</li>
              <li>Violate any local, state, national, or international law</li>
              <li>Facilitate criminal activity or terrorism</li>
              <li>Produce or distribute illegal content (child exploitation, etc.)</li>
              <li>Engage in money laundering or fraud</li>
            </ul>

            <h3>2.2 Harmful Content</h3>
            <p>You may not use AI models to generate:</p>
            <ul>
              <li><strong>Violence:</strong> Content promoting violence, self-harm, or physical harm to others</li>
              <li><strong>Hate Speech:</strong> Content that promotes hatred based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
              <li><strong>Harassment:</strong> Content intended to bully, threaten, or harass individuals</li>
              <li><strong>Sexual Content:</strong> Non-consensual sexual content, revenge porn, or sexual exploitation</li>
              <li><strong>Child Safety:</strong> Any content exploiting or endangering children</li>
            </ul>

            <h3>2.3 Misinformation and Deception</h3>
            <p>You may not:</p>
            <ul>
              <li>Generate deliberate misinformation or disinformation</li>
              <li>Create deepfakes without clear disclosure</li>
              <li>Impersonate individuals, organizations, or entities</li>
              <li>Generate fake reviews, testimonials, or social media content</li>
              <li>Manipulate elections or democratic processes</li>
              <li>Spread health misinformation that could cause harm</li>
            </ul>

            <h3>2.4 Intellectual Property Violations</h3>
            <p>You may not:</p>
            <ul>
              <li>Infringe on copyrights, trademarks, or other IP rights</li>
              <li>Use our Service to plagiarize or pass off others' work as your own</li>
              <li>Generate content that violates third-party licenses</li>
              <li>Reverse engineer or extract training data from AI models</li>
            </ul>

            <h3>2.5 Privacy Violations</h3>
            <p>You may not:</p>
            <ul>
              <li>Process personal data without proper consent or legal basis</li>
              <li>Dox individuals or publish private information</li>
              <li>Use our Service for unauthorized surveillance</li>
              <li>Scrape or collect personal data from third-party sources</li>
              <li>Violate GDPR, CCPA, or other privacy regulations</li>
            </ul>

            <h3>2.6 System Abuse</h3>
            <p>You may not:</p>
            <ul>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Disrupt, damage, or impair our Service</li>
              <li>Use automated tools to create fake accounts or spam</li>
              <li>Exceed rate limits or attempt to bypass usage restrictions</li>
              <li>Share API keys or account credentials</li>
              <li>Resell or redistribute our Service without authorization</li>
            </ul>

            <h3>2.7 AI-Specific Prohibitions</h3>
            <p>You may not use AI models to:</p>
            <ul>
              <li><strong>Autonomous Weapons:</strong> Develop weapons or autonomous systems causing harm</li>
              <li><strong>Discrimination:</strong> Make consequential decisions (hiring, lending, housing) without human review</li>
              <li><strong>Medical Advice:</strong> Provide medical diagnoses or treatment recommendations without disclaimer</li>
              <li><strong>Legal Advice:</strong> Provide legal advice without appropriate disclaimers</li>
              <li><strong>Financial Advice:</strong> Provide personalized financial or investment advice</li>
              <li><strong>Academic Dishonesty:</strong> Complete assignments or exams on behalf of students</li>
            </ul>

            <h2>3. Responsible AI Use</h2>
            
            <h3>3.1 Human Oversight</h3>
            <ul>
              <li>Always review AI-generated content before publishing or acting on it</li>
              <li>Do not fully automate high-stakes decisions without human review</li>
              <li>Maintain accountability for AI outputs</li>
            </ul>

            <h3>3.2 Transparency</h3>
            <ul>
              <li>Disclose when content is AI-generated where appropriate</li>
              <li>Do not misrepresent AI outputs as human-created</li>
              <li>Be clear about AI's capabilities and limitations</li>
            </ul>

            <h3>3.3 Bias and Fairness</h3>
            <ul>
              <li>Be aware that AI models may contain biases</li>
              <li>Test outputs for fairness across different demographics</li>
              <li>Avoid using AI in ways that perpetuate discrimination</li>
            </ul>

            <h2>4. Examples of Acceptable Use</h2>
            <div className="p-6 rounded-lg border border-green-500/20 bg-green-500/5 mb-8">
              <div className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-0">Encouraged Uses</h3>
                  <ul className="mb-0 space-y-1">
                    <li>Software development and code generation</li>
                    <li>Content creation with proper disclosure</li>
                    <li>Research and education</li>
                    <li>Business automation and productivity</li>
                    <li>Creative projects (art, music, writing)</li>
                    <li>Data analysis and insights</li>
                    <li>Customer support and chatbots (with disclosure)</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>5. Reporting Violations</h2>
            <p>
              If you become aware of violations of this AUP, please report them to:
            </p>
            <ul>
              <li><strong>Email:</strong> abuse@nati.dev</li>
              <li><strong>Report Form:</strong> <Link to="/contact" className="text-[var(--primary)] hover:underline">Contact Us</Link></li>
            </ul>

            <h2>6. Enforcement</h2>
            
            <h3>6.1 Investigation</h3>
            <p>
              We reserve the right to investigate suspected violations of this AUP.
            </p>

            <h3>6.2 Actions We May Take</h3>
            <ul>
              <li><strong>Warning:</strong> First-time minor violations</li>
              <li><strong>Temporary Suspension:</strong> Repeated or moderate violations</li>
              <li><strong>Account Termination:</strong> Serious or repeated violations</li>
              <li><strong>Legal Action:</strong> Illegal activities or serious harm</li>
              <li><strong>Law Enforcement:</strong> Reporting to authorities when required</li>
            </ul>

            <h3>6.3 No Refunds</h3>
            <p>
              Violations resulting in account termination are not eligible for refunds.
            </p>

            <h2>7. Third-Party AI Provider Policies</h2>
            <p>
              You must also comply with the acceptable use policies of underlying AI providers:
            </p>
            <ul>
              <li><a href="https://openai.com/policies/usage-policies" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">OpenAI Usage Policies</a></li>
              <li><a href="https://www.anthropic.com/legal/aup" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Anthropic Acceptable Use Policy</a></li>
              <li><a href="https://policies.google.com/terms/generative-ai/use-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Google Gen AI Use Policy</a></li>
            </ul>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this AUP as AI technology and regulations evolve. Continued use of our Service 
              constitutes acceptance of any changes.
            </p>

            <h2>9. Contact</h2>
            <p>
              Questions about this policy? Contact us at abuse@nati.dev
            </p>

            {/* Quick Links */}
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <Link
                to="/legal/ai-ethics"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <Shield className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold">AI Ethics Policy</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Our ethical commitments</div>
                </div>
              </Link>
              
              <Link
                to="/legal/terms"
                className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors no-underline"
              >
                <AlertTriangle className="h-6 w-6 text-[var(--primary)]" />
                <div>
                  <div className="font-semibold">Terms of Service</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Full terms and conditions</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
