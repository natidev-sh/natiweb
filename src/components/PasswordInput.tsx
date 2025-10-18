'use client';
import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onGenerate?: () => string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, onGenerate, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleGenerateClick = () => {
      if (onGenerate && ref && 'current' in ref && ref.current) {
        const newPassword = onGenerate();
        // This is a way to programmatically update the input value and trigger React's state update
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(ref.current, newPassword);
        const event = new Event('input', { bubbles: true });
        ref.current.dispatchEvent(event);
      }
    };

    return (
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'glass-input w-full rounded-lg border bg-white/20 border-gray-300/50 px-3 py-2 pr-20 text-gray-900 placeholder:text-gray-500 caret-[var(--primary)] outline-none transition dark:bg-black/30 dark:border-white/10 dark:text-white dark:placeholder:text-white/60 dark:caret-white focus:border-[var(--primary)]/60 focus:ring-2 focus:ring-[var(--primary)]/30',
            className
          )}
          ref={ref}
          onChange={onChange}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          {onGenerate && (
            <button
              type="button"
              onClick={handleGenerateClick}
              className="p-1 hover:text-[var(--primary)]"
              title="Generate Password"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:text-[var(--primary)]"
            title={showPassword ? 'Hide Password' : 'Show Password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;