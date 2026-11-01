/**
 * ModalTransition Component
 * 
 * Handles entrance and exit animations for modals and overlays.
 * Includes both overlay fade and content scale+fade.
 */

'use client';

import { motion, AnimatePresence, MotionProps } from 'motion/react';
import { modalTransition, prefersReducedMotion } from '../tokens/motion';

interface ModalTransitionProps extends MotionProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export function ModalTransition({ 
  isOpen, 
  children, 
  onClose,
  ...props 
}: ModalTransitionProps) {
  const reducedMotion = prefersReducedMotion();

  const overlayProps = reducedMotion ? { 
    initial: { opacity: 0 }, 
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.01 }
  } : modalTransition.overlay;

  const contentProps = reducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.01 }
  } : modalTransition.content;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...overlayProps}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            {...contentProps}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            {...props}
          >
            <div className="pointer-events-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
