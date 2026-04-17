import { motion } from 'framer-motion';
import { Zap, Truck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AppModeToggle = () => {
  const { appMode, toggleAppMode, isPremium } = useTheme();
  
  const isOptimization = appMode === 'optimization';

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-medium ${
        !isOptimization 
          ? isPremium ? 'text-emerald-400' : 'text-emerald-600'
          : isPremium ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Logistics
      </span>
      
      <button
        onClick={toggleAppMode}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          isOptimization
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
        }`}
        title={`Switch to ${isOptimization ? 'Logistics' : 'Optimization'} Mode`}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white"
          animate={{ x: isOptimization ? 32 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {isOptimization ? (
            <Zap className="h-3 w-3 text-indigo-600" />
          ) : (
            <Truck className="h-3 w-3 text-emerald-600" />
          )}
        </motion.div>
      </button>
      
      <span className={`text-xs font-medium ${
        isOptimization 
          ? isPremium ? 'text-blue-400' : 'text-blue-600'
          : isPremium ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Optimize
      </span>
    </div>
  );
};

export default AppModeToggle;
