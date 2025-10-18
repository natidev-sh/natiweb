import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export default function UpgradeProBanner() {
  return (
    <motion.div
      className="relative my-12 overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--background-darkest)] to-[var(--background)] p-8 shadow-2xl shadow-[var(--primary)]/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--primary)]">
          <Star className="h-6 w-6" />
          <span>Unlock Pro Features</span>
        </div>
        <h3 className="mb-3 text-2xl font-semibold">Take Your AI Apps to the Next Level</h3>
        <p className="mb-6 max-w-2xl opacity-80">
          Upgrade to Nati Pro to get exclusive AI modes, more credits, direct support, and influence our product roadmap. Start building more powerful applications today.
        </p>
        <Link
          to="/download#pro-pricing"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] transition-all duration-300 hover:bg-[var(--primary)]/90 hover:shadow-[0_10px_30px_-15px_var(--primary)]"
        >
          <span>Upgrade to Pro</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </motion.div>
  );
}