import React from 'react';
import { MailCheck } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageMeta from './components/PageMeta.jsx';

const getMailClientLink = (email) => {
  if (!email) return null;
  const domain = email.split('@')[1];
  switch (domain) {
    case 'gmail.com':
      return { name: 'Gmail', url: 'https://mail.google.com' };
    case 'outlook.com':
    case 'hotmail.com':
    case 'live.com':
      return { name: 'Outlook', url: 'https://outlook.live.com' };
    case 'yahoo.com':
      return { name: 'Yahoo Mail', url: 'https://mail.yahoo.com' };
    default:
      return null;
  }
};

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const mailClient = getMailClientLink(email);

  return (
    <>
      <PageMeta
        title="Confirm Your Email | Nati.dev"
        description="Please check your inbox to confirm your email address and complete your registration with Nati.dev."
      />
      <motion.div 
        className="flex flex-col items-center justify-center text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-[var(--primary)]/10 p-4 text-[var(--primary)]">
          <MailCheck className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Confirm your email</h1>
        <p className="max-w-md opacity-80 mb-8">
          We've sent a confirmation link to <strong className="text-[var(--foreground)]">{email || 'your email address'}</strong>. Please click the link to complete your registration.
        </p>
        {mailClient && (
          <a 
            href={mailClient.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-all duration-200 hover:bg-[var(--primary)]/90"
          >
            Open {mailClient.name}
          </a>
        )}
        <p className="text-sm opacity-70">
          Didn't receive the email? Check your spam folder or <Link to="/signup" className="text-[var(--primary)] hover:underline">try signing up again</Link>.
        </p>
      </motion.div>
    </>
  );
}