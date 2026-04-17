import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Factory, Truck, Package } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCompactCurrency } from '../../utils/currency';

const CostSummary = ({ data }) => {
  const { isPremium } = useTheme();

  if (!data) return null;

  const costItems = [
    {
      title: 'Total Cost',
      value: data.totalCost,
      icon: DollarSign,
      color: isPremium ? 'premium-gold' : 'green-500',
      change: '+2.5%'
    },
    {
      title: 'Production Cost',
      value: data.productionCost,
      icon: Factory,
      color: isPremium ? 'premium-neon' : 'blue-500',
      change: '-1.2%'
    },
    {
      title: 'Transport Cost',
      value: data.transportCost,
      icon: Truck,
      color: isPremium ? 'premium-emerald' : 'purple-500',
      change: '+0.8%'
    },
    {
      title: 'Inventory Cost',
      value: data.inventoryCost,
      icon: Package,
      color: isPremium ? 'orange-400' : 'orange-500',
      change: '-3.1%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {costItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl transition-all duration-300 ${
              isPremium
                ? 'glass-card hover:bg-white/20'
                : 'bg-white shadow-sm hover:shadow-md border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${
                isPremium
                  ? `bg-${item.color}/20`
                  : `bg-${item.color}/10`
              }`}>
                <Icon 
                  size={24} 
                  className={isPremium ? `text-${item.color}` : `text-${item.color}`} 
                />
              </div>
              
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                item.change.startsWith('+')
                  ? isPremium
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-red-50 text-red-600'
                  : isPremium
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-50 text-green-600'
              }`}>
                {item.change}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className={`text-sm font-medium ${
                isPremium ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.title}
              </h3>
              <p className={`text-2xl font-bold mt-1 ${
                isPremium ? 'text-white' : 'text-gray-900'
              }`}>
                {formatCompactCurrency(item.value)}
              </p>
            </div>
            
            {isPremium && (
              <motion.div
                className="mt-4 h-1 bg-gradient-to-r from-transparent via-premium-neon to-transparent rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default CostSummary;