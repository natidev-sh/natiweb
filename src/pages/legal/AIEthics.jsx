import React from 'react'
import PageMeta from '@/components/PageMeta'
import { Link } from 'react-router-dom'
import { Heart, Users, Eye, Scale, Sparkles, Brain } from 'lucide-react'

export default function AIEthics() {
  return (
    <>
      <PageMeta
        title="AI Ethics Policy | Nati.dev"
        description="Nati.dev's commitment to ethical AI development and deployment"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">AI Ethics Policy</h1>
            </div>
            <p className="text-lg text-[var(--muted-foreground)]">
              Our commitment to responsible and ethical AI
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {/* Mission */}
            <div className="p-6 rounded-lg border border-purple-500/20 bg-purple-500/5 mb-8">
              <div className="flex gap-3">
                <Sparkles className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 mt-0">Our Mission</h3>
                  <p className="text-sm mb-0">
                    To democratize AI technology while ensuring it's developed and deployed responsibly, 
                    safely, and in service of humanity's best interests.
                  </p>
                </div>
              </div>
            </div>

            <h2>1. Core Ethical Principles</h2>
            
            <h3>1.1 Human-Centric AI</h3>
            <p>
              AI should augment and empower humans, not replace human judgment in critical decisions. We commit to:
            </p>
            <ul>
              <li>Designing AI that enhances human capabilities</li>
              <li>Requiring human oversight for high-stakes decisions</li>
              <li>Preserving human autonomy and agency</li>
              <li>Preventing AI from being used to manipulate or deceive</li>
            </ul>

            <h3>1.2 Fairness and Non-Discrimination</h3>
            <p>
              AI systems should treat all people fairly and avoid perpetuating bias. We commit to:
            </p>
            <ul>
              <li>Actively identifying and mitigating biases in AI models</li>
              <li>Testing models across diverse demographics</li>
              <li>Providing tools to help users detect bias in outputs</li>
              <li>Refusing to develop AI for discriminatory purposes</li>
            </ul>

            <h3>1.3 Transparency and Explainability</h3>
            <p>
              Users should understand how AI systems work and make decisions. We commit to:
            </p>
            <ul>
              <li>Clearly communicating when AI is being used</li>
              <li>Providing documentation on model capabilities and limitations</li>
              <li>Being transparent about data sources and training methods</li>
              <li>Explaining how AI-generated outputs are produced</li>
            </ul>

            <h3>1.4 Privacy and Data Protection</h3>
            <p>
              User privacy is fundamental to ethical AI. We commit to:
            </p>
            <ul>
              <li>Minimizing data collection to what's necessary</li>
              <li>Protecting user data with encryption and access controls</li>
              <li>Providing opt-out mechanisms for AI training</li>
              <li>Complying with privacy regulations (GDPR, CCPA, etc.)</li>
            </ul>

            <h3>1.5 Safety and Security</h3>
            <p>
              AI systems must be safe, secure, and reliable. We commit to:
            </p>
            <ul>
              <li>Implementing safeguards against misuse</li>
              <li>Monitoring for harmful outputs and improving filters</li>
              <li>Conducting security audits and penetration testing</li>
              <li>Rapidly responding to discovered vulnerabilities</li>
            </ul>

            <h3>1.6 Accountability</h3>
            <p>
              We take responsibility for our AI systems' impacts. We commit to:
            </p>
            <ul>
              <li>Maintaining clear accountability structures</li>
              <li>Investigating and addressing complaints</li>
              <li>Being transparent about system failures</li>
              <li>Providing mechanisms for redress when harm occurs</li>
            </ul>

            <h2>2. Responsible Development Practices</h2>
            
            <h3>2.1 Diverse and Inclusive Teams</h3>
            <ul>
              <li>Building diverse teams to reduce blind spots</li>
              <li>Including perspectives from different backgrounds and disciplines</li>
              <li>Consulting with affected communities</li>
              <li>Partnering with AI ethics researchers</li>
            </ul>

            <h3>2.2 Risk Assessment</h3>
            <ul>
              <li>Evaluating potential harms before deploying features</li>
              <li>Conducting impact assessments for high-risk applications</li>
              <li>Red-teaming to identify edge cases and misuse scenarios</li>
              <li>Implementing staged rollouts for new capabilities</li>
            </ul>

            <h3>2.3 Continuous Improvement</h3>
            <ul>
              <li>Monitoring AI systems for biases and failures</li>
              <li>Collecting user feedback on ethical concerns</li>
              <li>Regularly updating models to address issues</li>
              <li>Staying current with AI ethics research</li>
            </ul>

            <h2>3. Use Case Specific Commitments</h2>
            
            <h3>3.1 Content Generation</h3>
            <ul>
              <li>Detecting and blocking harmful content generation</li>
              <li>Watermarking AI-generated content where feasible</li>
              <li>Providing tools to detect AI-generated text</li>
              <li>Educating users about deepfakes and misinformation</li>
            </ul>

            <h3>3.2 Automated Decision-Making</h3>
            <ul>
              <li>Requiring human review for consequential decisions</li>
              <li>Providing explanations for AI recommendations</li>
              <li>Allowing users to challenge automated decisions</li>
              <li>Auditing decision-making systems for bias</li>
            </ul>

            <h3>3.3 Personal Data Processing</h3>
            <ul>
              <li>Obtaining explicit consent for sensitive data</li>
              <li>Anonymizing data before AI processing where possible</li>
              <li>Providing data deletion mechanisms</li>
              <li>Limiting retention of personal information</li>
            </ul>

            <h2>4. What We Don't Build</h2>
            
            <p>We refuse to develop AI for:</p>
            <ul>
              <li><strong>Weapons and Warfare:</strong> Autonomous weapons or military applications designed to harm</li>
              <li><strong>Mass Surveillance:</strong> Systems for unauthorized tracking or monitoring</li>
              <li><strong>Social Scoring:</strong> Systems that rate individuals' social or political behavior</li>
              <li><strong>Manipulation:</strong> Tools designed to deceive, manipulate, or exploit vulnerabilities</li>
              <li><strong>Discrimination:</strong> Systems that facilitate illegal discrimination</li>
            </ul>

            <h2>5. Governance and Oversight</h2>
            
            <h3>5.1 AI Ethics Committee</h3>
            <ul>
              <li>Internal ethics review board for high-risk features</li>
              <li>External advisors from academia and civil society</li>
              <li>Regular ethics training for all team members</li>
              <li>Clear escalation paths for ethical concerns</li>
            </ul>

            <h3>5.2 Compliance</h3>
            <ul>
              <li>Adhering to EU AI Act and emerging regulations</li>
              <li>Following industry best practices (IEEE, NIST frameworks)</li>
              <li>Participating in AI safety research initiatives</li>
              <li>Regular third-party audits</li>
            </ul>

            <h2>6. User Empowerment</h2>
            
            <h3>6.1 Education</h3>
            <ul>
              <li>Providing resources on responsible AI use</li>
              <li>Documenting model limitations and failure modes</li>
              <li>Offering best practices for different use cases</li>
              <li>Highlighting ethical considerations in documentation</li>
            </ul>

            <h3>6.2 Controls</h3>
            <ul>
              <li>Content filtering settings</li>
              <li>Opt-out mechanisms for data usage</li>
              <li>Export and deletion tools</li>
              <li>Transparency into AI model choices</li>
            </ul>

            <h2>7. Reporting and Accountability</h2>
            
            <h3>7.1 Transparency Reports</h3>
            <p>We publish annual reports covering:</p>
            <ul>
              <li>Content moderation statistics</li>
              <li>Bias mitigation efforts and results</li>
              <li>Security incidents and responses</li>
              <li>User complaints and resolutions</li>
            </ul>

            <h3>7.2 Incident Response</h3>
            <p>When harms occur, we commit to:</p>
            <ul>
              <li>Promptly investigating and addressing issues</li>
              <li>Communicating transparently with affected users</li>
              <li>Implementing corrective measures</li>
              <li>Sharing learnings to prevent recurrence</li>
            </ul>

            <h2>8. Feedback and Collaboration</h2>
            
            <p>
              We welcome input on our ethical AI practices:
            </p>
            <ul>
              <li><strong>Ethics Feedback:</strong> ethics@nati.dev</li>
              <li><strong>Research Partnerships:</strong> research@nati.dev</li>
              <li><strong>Report Concerns:</strong> <Link to="/contact" className="text-[var(--primary)] hover:underline">Contact Form</Link></li>
            </ul>

            <h2>9. Continuous Evolution</h2>
            
            <p>
              AI ethics is an evolving field. We commit to:
            </p>
            <ul>
              <li>Regularly reviewing and updating this policy</li>
              <li>Staying informed about emerging ethical challenges</li>
              <li>Engaging with the broader AI ethics community</li>
              <li>Adapting to new regulations and standards</li>
            </ul>

            {/* Principles Cards */}
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                <Users className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="font-semibold mb-2 mt-0">Human-Centric</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-0">
                  AI that augments and empowers people
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                <Eye className="h-8 w-8 text-green-500 mb-3" />
                <h3 className="font-semibold mb-2 mt-0">Transparent</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-0">
                  Clear about how AI works and decides
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
                <Scale className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="font-semibold mb-2 mt-0">Fair</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-0">
                  Committed to reducing bias and discrimination
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
