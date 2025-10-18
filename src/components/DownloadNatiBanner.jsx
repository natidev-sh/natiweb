import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DownloadNatiBanner() {
  return (
    <motion.div 
      className="relative my-16 overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--background-darkest)] to-[var(--background)] p-8 text-center shadow-2xl shadow-[var(--primary)]/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <h2 className="text-3xl font-bold mb-3">Ready to Build with Freedom?</h2>
      <p className="max-w-2xl mx-auto opacity-80 mb-6">
        Embrace a more empowering and cost-effective way to build with AI. Download Nati today and join a growing community of builders.
      </p>
      <Link to="/download" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-8 py-4 font-medium text-[var(--primary-foreground)] transition-all duration-300 hover:bg-[var(--primary)]/90 hover:shadow-[0_10px_30px_-15px_var(--primary)]">
        <Download className="h-5 w-5" />
        Download Nati for Free
      </Link>
      <p className="text-xs opacity-70 mt-3">No sign-up required to get started.</p>
    </motion.div>
  );
}