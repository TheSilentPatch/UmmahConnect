'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useRef } from 'react';

export function AnimationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        ref={nodeRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}