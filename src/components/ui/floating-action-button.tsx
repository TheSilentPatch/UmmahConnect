'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface FloatingActionButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          ref={ref}
          className={`rounded-full shadow-lg ${className}`}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';