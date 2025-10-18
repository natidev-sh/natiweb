'use client';

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import NumberFlow from '@number-flow/react';
import { cn } from '../../lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  buttonSubtext?: string;
  disabled?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Nati Free',
    price: '0',
    yearlyPrice: '0',
    period: 'per month',
    features: [
      'Local, open-source AI App Builder',
      'Downloadable for macOS & Windows',
      'No sign-up required',
      'Bring your own API key',
      'Community support',
    ],
    description: 'Perfect for getting started and building apps.',
    buttonText: 'Get Started',
    href: '/download',
    isPopular: false,
  },
  {
    name: 'Nati Pro',
    price: '30',
    yearlyPrice: '24',
    period: 'per month',
    features: [
      'Everything in Nati Free',
      'Exclusive AI Pro modes',
      '300 AI credits/month',
      'Create & manage teams',
      'Team collaboration & activity feed',
      'Share apps with team members',
      'Direct support & influence product roadmap',
    ],
    description: 'Unlock powerful AI modes, teams, and get direct support.',
    buttonText: 'Subscribe to Pro',
    href: '/signup',
    isPopular: true,
    buttonSubtext: "After signing up, you'll be redirected to checkout.",
  },
  {
    name: 'Nati Max',
    price: '79',
    yearlyPrice: '63',
    period: 'per month',
    features: [
      'Everything in Nati Pro plus...',
      '900 AI credits/month (3x more, 12% savings compared to Pro)',
      'Reload credits at any time (same price)',
      'Priority team support',
      'Advanced team analytics',
    ],
    description: 'For building large, complex apps with teams.',
    buttonText: 'Available as upgrade',
    href: '#',
    isPopular: false,
    disabled: true,
  },
];

export default function CongestedPricing() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const switchRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');

  async function handleSubscribe(plan: PricingPlan, isMonthly: boolean) {
    if (plan.disabled) return;
    if (plan.name !== 'Nati Pro') {
      navigate(plan.href);
      return;
    }

    if (!user) {
      navigate('/signup');
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          plan: isMonthly ? 'monthly' : 'yearly',
          couponCode: couponCode || undefined
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error: Could not initiate subscription. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const handleToggle = (toYearly: boolean) => {
    setIsMonthly(!toYearly);
    if (toYearly && switchRef.current) {
      const rect = (switchRef.current as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          'hsl(var(--primary))',
          'hsl(var(--accent))',
          'hsl(var(--secondary))',
          'hsl(var(--muted))',
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
      });
    }
  };

  return (
    <div className="py-20">
      <div className="mb-12 space-y-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing — simple and transparent
        </h2>
        <p className="text-lg opacity-80 whitespace-pre-line">
          Choose the plan that works for you. All plans include access to our blocks and example flows.
        </p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-3">
        <button
          ref={switchRef}
          onClick={() => handleToggle(!(!isMonthly))}
          aria-pressed={!isMonthly}
          className={cn(
            'relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition',
            'border-[var(--border)] hover:border-[var(--primary)]/40'
          )}
        >
          <span className={cn('text-sm', isMonthly ? 'text-[var(--primary)]' : 'opacity-70')}>Monthly</span>
          <span className="h-5 w-9 rounded-full bg-[var(--muted)] relative">
            <span className={cn('absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-[var(--foreground)] transition-transform', !isMonthly ? 'translate-x-4' : '')} />
          </span>
          <span className={cn('text-sm', !isMonthly ? 'text-[var(--primary)]' : 'opacity-70')}>Yearly</span>
          <span className="ml-2 text-xs text-[var(--primary)]">(Save 20%)</span>
        </button>
      </div>

      <div className="mx-auto max-w-xs mb-10">
        <div className="relative">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="HAVE A COUPON CODE?"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center text-sm tracking-widest focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan, index) => {
          const isThisPlanLoading = loadingPlan === plan.name;
          return (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 1 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -20 : 0,
                      opacity: 1,
                      x: index === 2 ? -30 : index === 0 ? 30 : 0,
                      scale: index === 0 || index === 2 ? 0.94 : 1.0,
                    }
                  : {}
              }
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                type: 'spring',
                stiffness: 100,
                damping: 30,
                delay: 0.4,
                opacity: { duration: 0.5 },
              }}
              className={cn(
                'relative rounded-2xl border-[1px] p-6 text-center lg:flex lg:flex-col lg:justify-center',
                plan.isPopular ? 'border-[var(--primary)] border-2 shadow-[0_10px_40px_-20px_var(--primary)]/60' : 'border-[var(--border)]',
                'flex flex-col',
                !plan.isPopular && 'mt-5',
                index === 0 || index === 2
                  ? 'z-0 translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg] transform'
                  : 'z-10',
                index === 0 && 'origin-right',
                index === 2 && 'origin-left',
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 flex items-center rounded-tr-xl rounded-bl-xl px-2 py-0.5 bg-[var(--primary)]">
                  <Star className="h-4 w-4 fill-current text-[var(--primary-foreground)]" />
                  <span className="ml-1 font-sans font-semibold text-[var(--primary-foreground)]">
                    RECOMMENDED
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <p className="text-base font-semibold opacity-80">
                  {plan.name}
                </p>
                <div className="mt-6 flex items-center justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {Number(plan.price) === 0 ? 'Free' : (
                      <NumberFlow
                        value={
                          isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                        }
                        format={{
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        transformTiming={{
                          duration: 500,
                          easing: 'ease-out',
                        }}
                        willChange
                        className="font-variant-numeric: tabular-nums"
                      />
                    )}
                  </span>
                  {Number(plan.price) > 0 && (
                    <span className="text-sm leading-6 font-semibold tracking-wide opacity-70">
                      / {plan.period}
                    </span>
                  )}
                </div>

                {Number(plan.price) > 0 && (
                  <p className="text-xs leading-5 opacity-70">
                    {isMonthly ? 'billed monthly' : 'billed annually'}
                  </p>
                )}

                <ul className="mt-5 flex flex-col gap-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                      <span className="text-left">{feature}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-4 w-full" />

                <button
                  onClick={() => handleSubscribe(plan, isMonthly)}
                  disabled={plan.disabled || isThisPlanLoading}
                  className={cn(
                    'group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter inline-flex items-center justify-center rounded-lg px-4 py-2 transition',
                    plan.isPopular
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90'
                      : 'border border-[var(--border)] hover:border-[var(--primary)]/40',
                    (plan.disabled || isThisPlanLoading) && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {isThisPlanLoading ? 'Redirecting...' : plan.buttonText}
                </button>
                {plan.buttonSubtext && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    {plan.buttonSubtext}
                  </p>
                )}
                <p className="text-muted-foreground mt-6 text-xs leading-5">
                  {plan.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}