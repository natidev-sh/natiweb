'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password?: string;
}

const checkPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: '', color: '', textColor: '' };
  if (password.length < 8) return { score: 1, label: 'Too short', color: 'bg-rose-500', textColor: 'text-rose-500' };

  const checks = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  let strength = Object.values(checks).filter(Boolean).length;
  
  if (password.length >= 12 && strength >= 3) strength = 4;

  const labels = ['Weak', 'Medium', 'Strong', 'Very Strong'];
  const colors = ['bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const textColors = ['text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];

  return { score: strength, label: labels[strength-1] || 'Weak', color: colors[strength-1] || 'bg-orange-500', textColor: textColors[strength-1] || 'text-orange-500' };
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const { score, label, color, textColor } = checkPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1 pt-1">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`h-full w-1/4 ${i <= score ? color : ''} ${i > 1 ? 'border-l-2 border-[var(--background)]' : ''}`}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: i <= score ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        ))}
      </div>
      <p className={`text-xs text-right font-medium ${textColor}`}>{label}</p>
    </div>
  );
};

export default PasswordStrengthMeter;