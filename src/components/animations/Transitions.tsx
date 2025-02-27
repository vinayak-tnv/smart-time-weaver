
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type FadeProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
};

export const FadeIn: React.FC<FadeProps> = ({ 
  children, 
  className,
  duration = 0.5,
  delay = 0
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideUp: React.FC<FadeProps> = ({ 
  children, 
  className,
  duration = 0.5,
  delay = 0
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideIn: React.FC<FadeProps & { direction?: 'left' | 'right' }> = ({ 
  children, 
  className,
  duration = 0.5,
  delay = 0,
  direction = 'right'
}) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction === 'right' ? 20 : -20 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<FadeProps> = ({ 
  children, 
  className,
  duration = 0.4,
  delay = 0
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
};

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className,
  staggerChildren = 0.1,
  delayChildren = 0
}) => (
  <motion.div
    initial="hidden"
    animate="show"
    exit="hidden"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren,
          delayChildren
        }
      }
    }}
    className={cn('flex flex-col', className)}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { 
        opacity: 1, 
        y: 0,
        transition: {
          ease: [0.22, 1, 0.36, 1]
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const CardHoverEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <motion.div
    whileHover={{ 
      y: -5, 
      transition: { duration: 0.2 }
    }}
    whileTap={{ 
      scale: 0.98, 
      transition: { duration: 0.1 }
    }}
    className={cn('cursor-pointer', className)}
  >
    {children}
  </motion.div>
);

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
