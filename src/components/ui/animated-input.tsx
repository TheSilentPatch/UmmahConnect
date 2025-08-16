'use client';

import { Input } from '@/components/ui/input';
import type { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
export const AnimatedInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        className="w-full"
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Input 
          ref={ref}
          className={className}
          {...props}
        />
      </motion.div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';