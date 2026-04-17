import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, Building2, Truck, Zap } from 'lucide-react';
import IUForm from './IUForm';
import GUForm from './GUForm';
import TransportModeForm from './TransportModeForm';
import OptimizationForm from './OptimizationForm';
import { useTheme } from '../../contexts/ThemeContext';

const InputForms = () => {
  const { isPremium } = useTheme();
  const [activeTab, setActiveTab] = useState('transport');

  const tabs = [
    { id: 'transport', label: 'Transportation', icon: Truck },
    { id: 'optimize', label: 'Optimization', icon: Zap },
    { id: 'iu', label: 'Integrated Units', icon: Factory },
    { id: 'gu', label: 'Grinding Units', icon: Building2 },
  ];

  const handleOptimize = async (optimizationData) => {
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimizationData)
      });
      const result = await response.json();
      console.log('Optimization result:', result);
      
      // You could emit an event or use a context to update the dashboard
      // For now, we'll just log the result
      if (result.success) {
        alert(`Optimization completed! Total cost: ₹${result.results.totalCost.toLocaleString()}`);
      }
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Optimization failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${
            isPremium ? 'premium-text-gradient font-display' : 'text-gray-900'
          }`}>
            Transportation & Configuration
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Smart vehicle recommendations and system configuration
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`border-b ${
        isPremium ? 'border-premium-neon/20' : 'border-gray-200'
      }`}>
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? isPremium
                      ? 'border-premium-neon text-premium-neon'
                      : 'border-primary-500 text-primary-600'
                    : isPremium
                      ? 'border-transparent text-gray-400 hover:text-premium-neon hover:border-premium-neon/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ y: -2 }}
              >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === 'transport' ? 'Transport' : 
                   tab.id === 'optimize' ? 'Optimize' :
                   tab.id === 'iu' ? 'IU' : 'GU'}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'transport' && <TransportModeForm />}
        {activeTab === 'optimize' && <OptimizationForm onOptimize={handleOptimize} />}
        {activeTab === 'iu' && <IUForm />}
        {activeTab === 'gu' && <GUForm />}
      </motion.div>
    </div>
  );
};

export default InputForms;