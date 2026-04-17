import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Settings, 
  Factory, 
  Truck, 
  TrendingUp,
  Database,
  FileText,
  Download,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ activeView, setActiveView }) => {
  const { isPremium } = useTheme();

  const menuItems = [
    { id: 'optimizer', label: 'Smart Optimizer', icon: Zap },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'input', label: 'Configuration', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const dataItems = [
    { id: 'iu', label: 'Integrated Units', icon: Factory },
    { id: 'gu', label: 'Grinding Units', icon: Database },
    { id: 'transport', label: 'Transportation', icon: Truck },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40 ${
        isPremium
          ? 'bg-premium-dark/95 backdrop-blur-md border-r border-premium-neon/20'
          : 'bg-white border-r border-gray-200'
      } transition-all duration-300 overflow-y-auto`}
    >
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isPremium ? 'text-premium-neon/70' : 'text-gray-500'
          }`}>
            Navigation
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? isPremium
                        ? 'bg-premium-neon/20 text-premium-neon border border-premium-neon/30'
                        : 'bg-primary-50 text-primary-600 border border-primary-200'
                      : isPremium
                        ? 'text-gray-300 hover:bg-premium-neon/10 hover:text-premium-neon'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && isPremium && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-premium-neon"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Data Management */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isPremium ? 'text-premium-neon/70' : 'text-gray-500'
          }`}>
            Quick Access
          </h3>
          <nav className="space-y-1">
            <motion.button
              onClick={() => {
                setActiveView('input');
                // Could add logic to switch to IU tab
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                isPremium
                  ? 'text-gray-400 hover:bg-premium-neon/10 hover:text-premium-neon'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Factory size={16} />
              <span className="text-sm">Integrated Units</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                setActiveView('input');
                // Could add logic to switch to GU tab
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                isPremium
                  ? 'text-gray-400 hover:bg-premium-neon/10 hover:text-premium-neon'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Database size={16} />
              <span className="text-sm">Grinding Units</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                setActiveView('input');
                // Could add logic to switch to Transport tab
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                isPremium
                  ? 'text-gray-400 hover:bg-premium-neon/10 hover:text-premium-neon'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Truck size={16} />
              <span className="text-sm">Transportation</span>
            </motion.button>
          </nav>
        </div>

        {/* Export Section */}
        <div className={`p-4 rounded-lg ${
          isPremium
            ? 'glass-card border-premium-neon/30'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h4 className={`text-sm font-semibold mb-2 ${
            isPremium ? 'text-premium-neon' : 'text-gray-900'
          }`}>
            Export Dashboard
          </h4>
          <p className={`text-xs mb-3 ${
            isPremium ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Download current dashboard as PDF
          </p>
          <motion.button
            onClick={() => {
              // Simulate PDF export
              alert('Exporting dashboard as PDF... This feature will be available soon!');
            }}
            className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isPremium
                ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            <span>Export PDF</span>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;