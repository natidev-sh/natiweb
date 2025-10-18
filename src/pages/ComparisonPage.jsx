import React from 'react';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router-dom';
import { Download, Shield, Code, DollarSign, Users, ArrowRight } from 'lucide-react';
import FooterGlow from '@/components/FooterGlow';
import { motion } from 'framer-motion';
import DownloadNatiBanner from '@/components/DownloadNatiBanner';

const comparisonData = [
  {
    feature: 'Pricing Model',
    nati: 'Completely Free',
    others: 'Freemium / Subscription',
    natiDetail: 'Bring your own API key. No hidden costs.',
    othersDetail: 'Limited free tiers and credit systems.',
  },
  {
    feature: 'Architecture',
    nati: 'Local-First & Open-Source',
    others: 'Cloud-Based & Proprietary',
    natiDetail: 'Runs on your desktop, full control over code.',
    othersDetail: 'Web-based, code stored on their servers.',
  },
  {
    feature: 'Data Privacy',
    nati: '100% Private',
    others: 'Vendor-Controlled',
    natiDetail: 'Your projects and data never leave your machine.',
    othersDetail: 'Data is processed and stored on third-party servers.',
  },
  {
    feature: 'Customization',
    nati: 'Fully Customizable',
    others: 'Limited',
    natiDetail: 'Open-source means you can modify anything.',
    othersDetail: 'Limited to platform features and settings.',
  },
  {
    feature: 'Offline Access',
    nati: 'Full Offline Capability',
    others: 'Requires Internet',
    natiDetail: 'Build and iterate without an internet connection.',
    othersDetail: 'Dependent on provider uptime and connectivity.',
  },
  {
    feature: 'Community',
    nati: 'Community-Driven',
    others: 'Corporate-Driven',
    natiDetail: 'Directly influence the roadmap and contribute.',
    othersDetail: 'Roadmap is determined by the company.',
  },
];

const whyNati = [
    {
        icon: <Shield className="h-8 w-8 text-[var(--primary)]" />,
        title: "Demand Privacy & Ownership",
        description: "Keep your code, your data, and your projects on your own machine. No cloud uploads, no third-party access."
    },
    {
        icon: <DollarSign className="h-8 w-8 text-[var(--primary)]" />,
        title: "Build Economically",
        description: "Nati is free, forever. Your only cost is the API usage from your chosen provider, with no markups or subscriptions."
    },
    {
        icon: <Code className="h-8 w-8 text-[var(--primary)]" />,
        title: "Embrace Open-Source",
        description: "Gain ultimate flexibility. Modify, extend, and contribute to a tool that evolves with its community."
    },
    {
        icon: <Users className="h-8 w-8 text-[var(--primary)]" />,
        title: "Join a Thriving Community",
        description: "Have a direct impact on the future of Nati. Your feedback and contributions matter."
    }
]

export default function ComparisonPage() {
  return (
    <>
      <PageMeta
        title="Nati vs. The Cloud | A Local-First AI Builder Comparison"
        description="A direct comparison between Nati and cloud-based services like Bolt, v0.dev, and Lovable. See why Nati is the preferred free alternative."
      />
      <div className="py-12">
        <div className="max-w-5xl mx-auto">
          <motion.header 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
              Why Local-First <span className="text-[var(--primary)]">Changes Everything</span>
            </h1>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              See how Nati's desktop-first approach stacks up against cloud-based AI builders like v0.dev, Bolt, and Lovable.
            </p>
          </motion.header>

          <motion.div 
            className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--background-darkest)] shadow-xl shadow-[var(--primary)]/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="p-6 font-semibold text-lg">Feature</th>
                  <th className="p-6 font-semibold text-lg text-center bg-[var(--primary)]/10 text-[var(--primary)]">Nati</th>
                  <th className="p-6 font-semibold text-lg text-center">Cloud Builders</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={item.feature} className="border-b border-[var(--border)] last:border-b-0">
                    <td className="p-6 font-medium">{item.feature}</td>
                    <td className="p-6 text-center bg-[var(--primary)]/5">
                      <p className="font-semibold text-[var(--foreground)]">{item.nati}</p>
                      <p className="text-xs opacity-70 mt-1">{item.natiDetail}</p>
                    </td>
                    <td className="p-6 text-center">
                      <p className="font-semibold text-[var(--muted-foreground)]">{item.others}</p>
                      <p className="text-xs opacity-70 mt-1">{item.othersDetail}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.section 
            className="my-24 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              Choose Nati if You...
            </motion.h2>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {whyNati.map((item, index) => (
                    <motion.div 
                        key={item.title} 
                        className="p-6 rounded-xl border border-[var(--border)] bg-[var(--background-darkest)] text-center"
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-[var(--primary)]/10 mb-4">
                            {item.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm opacity-70">{item.description}</p>
                    </motion.div>
                ))}
            </div>
          </motion.section>

          <DownloadNatiBanner />

        </div>
      </div>
      <FooterGlow />
    </>
  );
}