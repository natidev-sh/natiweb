'use client';

import React, { useState } from 'react'
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const footerColumns = [
  {
    title: 'Product',
    links: [
      { text: 'Desktop App', href: '/download' },
      { text: 'Upgrade to Pro', href: '/pro' },
      { text: 'Documentation', href: '/docs' },
      { text: 'API Reference', href: '/docs/api-reference' },
      { text: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'Documentation', href: '/docs' },
      { text: 'Guides & Tutorials', href: '/docs/getting-started' },
      { text: 'Blog', href: '/blog' },
      { text: 'Community', href: 'https://github.com/natidev-sh', external: true },
      { text: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'About Us', href: '/about' },
      { text: 'Careers', href: '/careers' },
      { text: 'Contact', href: '/contact' },
      { text: 'Security', href: '/security' },
      { text: 'Trust Center', href: '/trust' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Terms of Service', href: '/legal/terms' },
      { text: 'Privacy Policy', href: '/legal/privacy' },
      { text: 'Acceptable Use', href: '/legal/acceptable-use' },
      { text: 'AI Ethics', href: '/legal/ai-ethics' },
      { text: 'DPA', href: '/legal/dpa' },
    ],
  },
];

const legalLinks = [
  { text: 'Terms of Service', href: '/legal/terms' },
  { text: 'Privacy Policy', href: '/legal/privacy' },
  { text: 'Acceptable Use Policy', href: '/legal/acceptable-use' },
  { text: 'Cookie Policy', href: '/legal/cookies' },
];

const socialIcons = [
  { icon: <Instagram className="h-5 w-5" />, href: '#' },
  { icon: <Twitter className="h-5 w-5" />, href: '#' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  { icon: <Youtube className="h-5 w-5" />, href: '#' },
];

export default function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  async function handleSubscribe(e: any) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 900))
      setStatus('success')
      setMessage('Thanks for subscribing!')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }
  return (
    <footer className="relative w-full pt-20 pb-10 text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-[var(--primary)]/15 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 rounded-2xl border border-[var(--border)] bg-[color:color-mix(in_oklab,_var(--background)_85%,_transparent)] p-8 shadow-xl shadow-[var(--primary)]/10 backdrop-blur-md md:p-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', damping: 24 }}
        >
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/60 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                Stay ahead with nati.dev
              </h3>
              <p className="mb-6 opacity-80">
                Join builders who ship faster with delightful, performant UI.
              </p>
              <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="border-[var(--border)] bg-[var(--background)] focus:ring-[var(--primary)]/50 w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 sm:max-w-xs"
                  aria-invalid={status==='error'}
                  aria-describedby="newsletter-status"
                />
                <button
                  type="submit"
                  disabled={status==='loading'}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:shadow-[0_20px_50px_-20px_var(--primary)] disabled:opacity-60 rounded-lg px-6 py-3 font-medium transition"
                >
                  {status==='loading' ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>
              <motion.div
                id="newsletter-status"
                className={`mt-3 text-sm ${status==='error'?'text-rose-500':status==='success'?'text-green-500':'opacity-0'}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: message?1:0, y: message?0:4 }}
                role="status"
                aria-live="polite"
              >
                {message}
              </motion.div>
            </div>
            <motion.div
              className="hidden justify-end md:flex"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rotate-6 rounded-xl bg-[var(--primary)]/15" />
                <img
                  src="https://i.postimg.cc/KjvHrBH0/bg.webp"
                  alt="nati.dev UI preview"
                  className="relative w-80 rounded-xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="mb-6 flex items-center space-x-2"> {/* Updated link */}
              <div className="bg-[var(--primary)] flex h-10 w-10 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[var(--primary-foreground)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">nati.dev</span>
            </Link>
            <p className="mb-6 opacity-80">
              Beautiful building blocks for shipping fast with React & Tailwind.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="hover:bg-[var(--primary)]/10 glass-effect flex h-10 w-10 items-center justify-center rounded-full transition"
                  target={item.href.startsWith('http') ? '_blank' : '_self'} // Open external links in new tab
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          {footerColumns.map((col, idx) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.06 }}
            >
              <h4 className="mb-4 text-lg font-semibold">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.text}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-[var(--foreground)] opacity-70">
                        {link.text}
                      </a>
                    ) : (
                      <Link to={link.href} className="transition hover:text-[var(--foreground)] opacity-70">
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm opacity-70">© {new Date().getFullYear()} nati.dev. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-70">
              {legalLinks.map((link) => (
                <Link key={link.text} to={link.href} className="transition hover:opacity-100">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}