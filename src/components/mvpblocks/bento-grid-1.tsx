'use client';
import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Code, FileText, Layers, Palette, Zap } from 'lucide-react';

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: any;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  index?: number;
  [extra: string]: any;
}

const BentoGridItem = ({
  title,
  description,
  icon,
  className,
  size = 'small',
  index,
}: BentoGridItemProps) => {
  const variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, damping: 22, stiffness: 280, delay: i * 0.06 },
    }),
  };

  return (
    <motion.div
      custom={typeof index === 'number' ? index : 0}
      variants={variants}
      className={cn(
        'group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-6 pt-6 pb-10 transition-all duration-500',
        'border-[var(--primary)]/10 hover:border-[var(--primary)]/30 bg-[var(--background)]',
        className,
      )}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
    >
      <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,#3d16165e_1px,transparent_1px),linear-gradient(to_bottom,#3d16165e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

      <div className="absolute right-1 bottom-3 scale-[6] text-[var(--primary)]/10 transition-all duration-700 group-hover:scale-[6.2] group-hover:text-[var(--primary)]/20">
        {React.isValidElement(icon)
          ? React.cloneElement(icon as any, {
              className: cn('text-[var(--primary)]', (icon as any).props?.className),
              strokeWidth: (icon as any).props?.strokeWidth ?? 2,
            })
          : icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)] shadow transition-all duration-500 group-hover:bg-[var(--primary)]/25 group-hover:shadow-[0_10px_30px_-12px_var(--primary)]">
            {React.isValidElement(icon)
              ? React.cloneElement(icon as any, {
                  className: cn('text-[var(--primary)]', (icon as any).props?.className),
                  strokeWidth: (icon as any).props?.strokeWidth ?? 2,
                })
              : icon}
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
        <div className="mt-4 flex items-center text-sm text-[var(--primary)]">
          <span className="mr-1">Learn more</span>
          <ArrowRight className="size-4 transition-all duration-500 group-hover:translate-x-2" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/30 blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  );
};

const items = [
  {
    title: 'Developer Experience',
    description:
      'Built with developers in mind, making implementation a breeze.',
    icon: <Code className="size-6" />,
    size: 'large' as const,
  },
  {
    title: 'Accessibility',
    description:
      'Built with a11y best practices to ensure your app is usable by everyone.',
    icon: <Layers className="size-6" />,
    size: 'small' as const,
  },
  {
    title: 'Responsive Design',
    description: 'Create layouts that adapt to any screen size with ease.',
    icon: <Layers className="size-6" />,
    size: 'medium' as const,
  },
  {
    title: 'Customizable',
    description: "Tailor components to match your brand's unique style.",
    icon: <Palette className="size-6" />,
    size: 'medium' as const,
  },
  {
    title: 'Performance',
    description: 'Optimized for speed and efficiency across all devices.',
    icon: <Zap className="size-6" />,
    size: 'small' as const,
  },
  {
    title: 'Documentation',
    description:
      'Comprehensive guides and examples to help you get started quickly.',
    icon: <FileText className="size-6" />,
    size: 'large' as const,
  },
];

export default function BentoGrid1() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            size={item.size}
            index={i}
            className={cn(
              item.size === 'large'
                ? 'col-span-4'
                : item.size === 'medium'
                  ? 'col-span-3'
                  : 'col-span-2',
              'h-full',
            )}
          />
        ))}
      </motion.div>
    </div>
  );
}
