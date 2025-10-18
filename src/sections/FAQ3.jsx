import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail } from 'lucide-react'

function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.15, ease: 'easeOut' }}
      className={`group rounded-lg border border-[var(--border)]/60 transition-all duration-200 ease-in-out ${isOpen ? 'bg-[var(--card)]/30 shadow-sm' : 'hover:bg-[var(--card)]/50'}`}
    >
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between gap-4 px-6 py-4">
        <h3 className={`text-left text-base font-medium transition-colors duration-200 ${isOpen ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/80'}`}>{question}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className={`shrink-0 rounded-full p-0.5 ${isOpen ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0.25, delay: 0.1 } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.25 } } }}
          >
            <div className="border-t border-[var(--border)]/40 px-6 pt-2 pb-4">
              <motion.p initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="text-sm leading-relaxed opacity-80">
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ3() {
  const faqs = [
    {
      question: 'What is Nati.dev?',
      answer: "Nati.dev is a local-first AI app builder that provides free, open-source React + Tailwind components and example flows. It's designed to help developers build and ship AI applications faster, with a focus on local development, customizability, and a great developer experience.",
    },
    {
      question: 'How is Nati.dev different from other AI app builders?',
      answer: "Nati.dev stands out by being local-first and open-source. Unlike cloud-dependent platforms, Nati allows you to build and iterate on AI apps directly on your desktop, offering instant feedback loops, zero cloud dependency, and full control over your code. It's a community-driven alternative to tools like v0, Lovable, Bolt, and Replit.",
    },
    {
      question: 'What technologies does Nati.dev use?',
      answer: "Nati.dev is built with a modern tech stack including React with Vite, TypeScript, Tailwind CSS for styling, shadcn/ui for base components, react-router-dom for routing, framer-motion for animations, and lucide-react for icons. The backend uses Node.js with Express and PostgreSQL, leveraging Supabase for authentication and database services.",
    },
    {
      question: 'Can I use Nati.dev for commercial projects?',
      answer: 'Absolutely! Nati.dev is MIT-licensed, making it free for both personal and commercial use. You have the freedom to use, modify, and distribute the components and framework in your projects without licensing fees.',
    },
    {
      question: 'How do I get started with Nati.dev?',
      answer: 'You can get started by downloading the native Nati desktop application for macOS or Windows. Once installed, you can browse the component library, copy the blocks you need, and begin building your AI app locally. Comprehensive documentation and examples are available to guide you.',
    },
    {
      question: 'Does Nati.dev support dark mode?',
      answer: 'Yes, all components and the overall design of Nati.dev are built with Tailwind CSS and are fully responsive and designed to work seamlessly with both light and dark modes.',
    },
  ]
  return (
    <section className="relative w-full overflow-hidden py-16">
      <div className="absolute top-20 -left-20 h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-block rounded-full border border-[var(--primary)] px-3 py-1 text-xs font-medium tracking-wider uppercase text-[var(--primary)]">FAQs</div>
          <h2 className="mb-3 bg-gradient-to-r from-[var(--primary)] to-rose-400 bg-clip-text text-3xl font-bold text-transparent">Frequently Asked Questions</h2>
          <p className="text-sm opacity-80">Everything you need to know about Nati.dev</p>
        </motion.div>
        <div className="mx-auto max-w-2xl space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mx-auto mt-12 max-w-md rounded-lg p-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
            <Mail className="h-4 w-4" />
          </div>
          <p className="mb-1 text-sm font-medium">Still have questions?</p>
          <p className="mb-4 text-xs opacity-80">We\'re here to help you</p>
          <button type="button" className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] transition-colors duration-200 hover:bg-[var(--primary)]/90">Contact Support</button>
        </motion.div>
      </div>
    </section>
  )
}