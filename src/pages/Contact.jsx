import React, { useState } from 'react'
import PageMeta from '@/components/PageMeta'
import FooterGlow from '@/components/FooterGlow'
import { 
  Send, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock,
  CheckCircle,
  Loader2,
  Github,
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <PageMeta
        title="Contact Us | Nati.dev"
        description="Get in touch with the Nati.dev team"
      />

      <div className="min-h-screen bg-[var(--background)]">
        {/* Header */}
        <div className="relative border-b border-[var(--border)] bg-gradient-to-b from-[var(--background)] to-[var(--background-darkest)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
          
          <div className="relative max-w-7xl mx-auto px-4 py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
                Have a question or want to work together? We'd love to hear from you.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-[var(--muted-foreground)] text-center max-w-md">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-6">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Email</div>
                      <a href="mailto:support@nati.dev" className="text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                        support@nati.dev
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Support</div>
                      <a href="/support" className="text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                        Visit Support Center
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Response Time</div>
                      <div className="text-sm text-[var(--muted-foreground)]">
                        Usually within 24 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-6">
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://github.com/natidev-sh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                  <a
                    href="https://twitter.com/natidev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="text-sm font-medium">Twitter</span>
                  </a>
                  <a
                    href="https://linkedin.com/company/natidev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="https://nati.dev/blog"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="text-sm font-medium">Blog</span>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] p-6">
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/docs" className="block text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                    → Documentation
                  </a>
                  <a href="/support" className="block text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                    → Support Center
                  </a>
                  <a href="/blog" className="block text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                    → Blog
                  </a>
                  <a href="/legal/terms" className="block text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                    → Terms of Service
                  </a>
                  <a href="/legal/privacy" className="block text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
                    → Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterGlow />
    </>
  )
}
