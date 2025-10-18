import React, { useState } from 'react'
import PageMeta from '@/components/PageMeta'
import { Link } from 'react-router-dom'
import { Cookie, Settings, CheckCircle, XCircle } from 'lucide-react'

export default function Cookies() {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    advertising: false
  })

  const handleSavePreferences = () => {
    localStorage.setItem('nati_cookie_preferences', JSON.stringify(cookieSettings))
    alert('Cookie preferences saved!')
  }

  return (
    <>
      <PageMeta
        title="Cookie Policy | Nati.dev"
        description="Information about how Nati.dev uses cookies and similar technologies"
      />
      
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)]">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-lg text-[var(--muted-foreground)]">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help websites remember 
              your preferences and understand how you use the site.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              Nati.dev uses cookies and similar technologies to:
            </p>
            <ul>
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our Service</li>
              <li>Improve our Service and user experience</li>
              <li>Provide personalized content and recommendations</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>

            <h3>3.1 Strictly Necessary Cookies (Required)</h3>
            <p>
              These cookies are essential for the Service to function. You cannot opt out of these cookies.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[var(--border)] p-2 text-left">Cookie Name</th>
                  <th className="border border-[var(--border)] p-2 text-left">Purpose</th>
                  <th className="border border-[var(--border)] p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--border)] p-2"><code>sb-access-token</code></td>
                  <td className="border border-[var(--border)] p-2">Authentication token</td>
                  <td className="border border-[var(--border)] p-2">1 hour</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2"><code>sb-refresh-token</code></td>
                  <td className="border border-[var(--border)] p-2">Session refresh</td>
                  <td className="border border-[var(--border)] p-2">30 days</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2"><code>csrf_token</code></td>
                  <td className="border border-[var(--border)] p-2">Security protection</td>
                  <td className="border border-[var(--border)] p-2">Session</td>
                </tr>
              </tbody>
            </table>

            <h3>3.2 Functional Cookies (Optional)</h3>
            <p>
              These cookies enable enhanced functionality and personalization.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[var(--border)] p-2 text-left">Cookie Name</th>
                  <th className="border border-[var(--border)] p-2 text-left">Purpose</th>
                  <th className="border border-[var(--border)] p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--border)] p-2"><code>theme_preference</code></td>
                  <td className="border border-[var(--border)] p-2">Dark/light mode setting</td>
                  <td className="border border-[var(--border)] p-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2"><code>language</code></td>
                  <td className="border border-[var(--border)] p-2">Language preference</td>
                  <td className="border border-[var(--border)] p-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2"><code>sidebar_collapsed</code></td>
                  <td className="border border-[var(--border)] p-2">UI preferences</td>
                  <td className="border border-[var(--border)] p-2">1 year</td>
                </tr>
              </tbody>
            </table>

            <h3>3.3 Analytics Cookies (Optional)</h3>
            <p>
              These cookies help us understand how visitors interact with our Service.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-[var(--border)] p-2 text-left">Service</th>
                  <th className="border border-[var(--border)] p-2 text-left">Purpose</th>
                  <th className="border border-[var(--border)] p-2 text-left">Privacy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[var(--border)] p-2">PostHog</td>
                  <td className="border border-[var(--border)] p-2">Product analytics</td>
                  <td className="border border-[var(--border)] p-2">
                    <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                      Privacy Policy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="border border-[var(--border)] p-2">Sentry</td>
                  <td className="border border-[var(--border)] p-2">Error tracking</td>
                  <td className="border border-[var(--border)] p-2">
                    <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                      Privacy Policy
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>3.4 Advertising Cookies (Optional)</h3>
            <p>
              These cookies track your activity to show relevant advertisements.
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              We currently do not use advertising cookies. This may change in the future.
            </p>

            <h2>4. Third-Party Cookies</h2>
            <p>
              Some third-party services we use may set their own cookies:
            </p>
            <ul>
              <li><strong>Google Fonts:</strong> Font delivery</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Supabase:</strong> Backend infrastructure</li>
            </ul>

            <h2>5. Local Storage and Session Storage</h2>
            <p>
              We also use browser storage mechanisms including:
            </p>
            <ul>
              <li><strong>LocalStorage:</strong> For persistent user preferences</li>
              <li><strong>SessionStorage:</strong> For temporary session data</li>
              <li><strong>IndexedDB:</strong> For offline app functionality</li>
            </ul>

            <h2>6. Managing Your Cookie Preferences</h2>

            {/* Cookie Settings Panel */}
            <div className="not-prose p-6 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] my-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-[var(--primary)]" />
                <h3 className="text-lg font-semibold">Cookie Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div className="flex-1">
                    <div className="font-medium">Strictly Necessary Cookies</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      Required for the website to function
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-[var(--muted-foreground)]">Always On</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div className="flex-1">
                    <div className="font-medium">Functional Cookies</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      Remember your preferences and settings
                    </div>
                  </div>
                  <button
                    onClick={() => setCookieSettings({...cookieSettings, functional: !cookieSettings.functional})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.functional ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.functional ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div className="flex-1">
                    <div className="font-medium">Analytics Cookies</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      Help us understand how you use our service
                    </div>
                  </div>
                  <button
                    onClick={() => setCookieSettings({...cookieSettings, analytics: !cookieSettings.analytics})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.analytics ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)]">
                  <div className="flex-1">
                    <div className="font-medium">Advertising Cookies</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      Show you relevant advertisements
                    </div>
                  </div>
                  <button
                    onClick={() => setCookieSettings({...cookieSettings, advertising: !cookieSettings.advertising})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      cookieSettings.advertising ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cookieSettings.advertising ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Save Preferences
              </button>
            </div>

            <h3>6.1 Browser Settings</h3>
            <p>
              You can also manage cookies through your browser settings:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Edge</a></li>
            </ul>

            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ Note: Disabling necessary cookies will prevent you from using certain features of our Service.
            </p>

            <h2>7. Do Not Track Signals</h2>
            <p>
              We respect "Do Not Track" browser settings. When enabled, we will:
            </p>
            <ul>
              <li>Disable analytics cookies</li>
              <li>Limit data collection to essential functions</li>
              <li>Not share data with third-party advertisers</li>
            </ul>

            <h2>8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy as we add new features or as regulations change. 
              Check the "Last updated" date at the top for the most recent version.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              Questions about cookies? Contact us at:
            </p>
            <ul>
              <li>Email: privacy@nati.dev</li>
              <li>See our <Link to="/legal/privacy" className="text-[var(--primary)] hover:underline">Privacy Policy</Link> for more information</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
