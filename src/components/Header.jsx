import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Settings, Zap, Building2, Command } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import AppModeToggle from './AppModeToggle';

const Header = ({ sidebarOpen, setSidebarOpen, activeView, setActiveView }) => {
  const { isPremium, appMode } = useTheme();

  const handleSettingsClick = () => {
    setActiveView('input');
    setSidebarOpen(true);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 ${
        isPremium
          ? 'bg-premium-dark/90 backdrop-blur-md border-b border-premium-neon/20'
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 sm:h-16">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isPremium
                ? 'hover:bg-premium-neon/10 text-premium-neon'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isPremium ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-premium-gold to-premium-neon"
              >
                <Zap size={16} className="sm:w-5 sm:h-5 text-premium-dark" />
              </motion.div>
            ) : (
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary-500">
                <Building2 size={16} className="sm:w-5 sm:h-5 text-white" />
              </div>
            )}
            
            <div>
              <h1 className={`text-lg sm:text-xl font-bold ${
                isPremium
                  ? 'premium-text-gradient font-display'
                  : 'text-gray-900'
              }`}>
                <span className="hidden sm:inline">
                  {appMode === 'optimization' ? 'Clinker Optimization' : 'Clinker Logistics'}
                </span>
                <span className="sm:hidden">Clinker</span>
              </h1>
              <p className={`text-xs sm:text-sm ${
                isPremium ? 'text-premium-neon/70' : 'text-gray-500'
              }`}>
                <span className="hidden sm:inline">
                  {appMode === 'optimization' ? 'Supply Chain Optimizer' : 'Smart Route Planner'}
                </span>
                <span className="sm:hidden">Dashboard</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* App Mode Toggle */}
          <div className="hidden sm:block">
            <AppModeToggle />
          </div>
          
          {/* Command Palette Hint */}
          <div className={`hidden lg:flex items-center px-3 py-1.5 rounded-lg border ${
            isPremium
              ? 'border-premium-gold/30 bg-premium-dark/50 text-premium-gold/70'
              : 'border-gray-200 bg-gray-50 text-gray-500'
          }`}>
            <Command size={14} className="mr-1.5" />
            <span className="text-xs font-medium">K</span>
          </div>
          
          <ThemeToggle />
          
          <button 
            onClick={handleSettingsClick}
            className={`p-2 rounded-lg transition-colors ${
              isPremium
                ? 'hover:bg-premium-neon/10 text-premium-neon'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Open Settings"
          >
            <Settings size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;