import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isPremium, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
        isPremium
          ? 'bg-gradient-to-r from-premium-gold to-premium-neon'
          : 'bg-gray-200'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-colors duration-300 ${
          isPremium ? 'bg-premium-dark' : 'bg-white'
        }`}
        animate={{
          x: isPremium ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isPremium ? (
          <Moon size={14} className="text-premium-neon" />
        ) : (
          <Sun size={14} className="text-yellow-500" />
        )}
      </motion.div>
      
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <span className={`text-xs font-medium ${
          isPremium ? 'text-premium-dark' : 'text-gray-600'
        }`}>
          {isPremium ? '' : 'Normal'}
        </span>
        <span className={`text-xs font-medium ${
          isPremium ? 'text-premium-dark' : 'text-gray-600'
        }`}>
          {isPremium ? 'Premium' : ''}
        </span>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;