import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Settings, 
  TrendingUp,
  FileText,
  Download,
  Zap,
  Truck
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ activeView, setActiveView }) => {
  const { isPremium, appMode } = useTheme();

  // Different menu items based on app mode
  const menuItems = appMode === 'optimization' 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'optimization', label: 'Optimization', icon: Zap },
        { id: 'input', label: 'Configuration', icon: Settings },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'reports', label: 'Reports', icon: FileText },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'logistics', label: 'Smart Logistics', icon: Truck },
        { id: 'input', label: 'Configuration', icon: Settings },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'reports', label: 'Reports', icon: FileText },
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
        {/* Mode Indicator */}
        <div className={`px-3 py-2 rounded-lg text-center ${
          appMode === 'optimization'
            ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30'
            : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30'
        }`}>
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            appMode === 'optimization'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {appMode === 'optimization' ? '⚡ Optimization Mode' : '🚚 Logistics Mode'}
          </span>
        </div>

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

        {/* Quick Actions - only in optimization mode */}
        {appMode === 'optimization' && (
          <div className={`p-4 rounded-lg ${
            isPremium
              ? 'glass-card border-premium-neon/30'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`text-sm font-semibold mb-2 ${
              isPremium ? 'text-premium-neon' : 'text-gray-900'
            }`}>
              Quick Actions
            </h4>
            <p className={`text-xs mb-3 ${
              isPremium ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Run optimization and export results
            </p>
            <motion.button
              onClick={() => setActiveView('optimization')}
              className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isPremium
                  ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={16} />
              <span>Run Optimization</span>
            </motion.button>
          </div>
        )}

        {/* Logistics Mode Info */}
        {appMode === 'logistics' && (
          <div className={`p-4 rounded-lg ${
            isPremium
              ? 'glass-card border-emerald-500/30'
              : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <h4 className={`text-sm font-semibold mb-2 ${
              isPremium ? 'text-emerald-400' : 'text-emerald-800'
            }`}>
              Smart Logistics
            </h4>
            <p className={`text-xs ${
              isPremium ? 'text-gray-300' : 'text-emerald-700'
            }`}>
              Real-time route optimization with distance-based cost calculations and transport recommendations.
            </p>
            <motion.button
              onClick={() => setActiveView('logistics')}
              className={`w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isPremium
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Truck size={16} />
              <span>Open Optimizer</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;