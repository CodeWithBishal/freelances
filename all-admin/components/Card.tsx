import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, noPadding = false }) => {
  return (
    <motion.div 
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={clsx(
            "bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl shadow-black/40 relative overflow-hidden group",
            !noPadding && "p-6",
            className
        )}
    >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent"></div>
        
        {children}
    </motion.div>
  );
};