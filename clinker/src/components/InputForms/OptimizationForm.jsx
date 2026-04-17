import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const OptimizationForm = ({ onOptimize }) => {
  const { isPremium } = useTheme();
  const [formData, setFormData] = useState({
    fromPlant: '',
    toPlant: '',
    demand: 1000,
    period: '2026-06',
    carbonTax: 0
  });
  const [plants, setPlants] = useState({ integrated_units: [], grinding_units: [] });
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants');
      const plantsData = await response.json();
      setPlants(plantsData);
      
      // Set default values
      if (plantsData.integrated_units.length > 0 && !formData.fromPlant) {
        setFormData(prev => ({ ...prev, fromPlant: plantsData.integrated_units[0].id }));
      }
      if (plantsData.grinding_units.length > 0 && !formData.toPlant) {
        setFormData(prev => ({ ...prev, toPlant: plantsData.grinding_units[0].id }));
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOptimizing(true);
    
    try {
      await onOptimize(formData);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setOptimizing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${
        isPremium
          ? 'glass-card'
          : 'bg-white shadow-sm border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${
          isPremium ? 'text-white' : 'text-gray-900'
        }`}>
          Optimization Parameters
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-green-500">
            <CheckCircle size={16} />
            <span className="text-sm">Node.js Solver Ready</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From Plant */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              From Plant (Integrated Unit)
            </label>
            <select
              value={formData.fromPlant}
              onChange={(e) => handleInputChange('fromPlant', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
              }`}
            >
              <option value="">Select Integrated Unit</option>
              {plants.integrated_units.map(plant => (
                <option key={plant.id} value={plant.id}>
                  {plant.name} - {plant.city} ({plant.capacity}T)
                </option>
              ))}
            </select>
          </div>

          {/* To Plant */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To Plant (Grinding Unit)
            </label>
            <select
              value={formData.toPlant}
              onChange={(e) => handleInputChange('toPlant', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
              }`}
            >
              <option value="">Select Grinding Unit</option>
              {plants.grinding_units.map(plant => (
                <option key={plant.id} value={plant.id}>
                  {plant.name} - {plant.city} ({plant.capacity}T)
                </option>
              ))}
            </select>
          </div>

          {/* Demand */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Demand (tonnes)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={formData.demand}
                onChange={(e) => handleInputChange('demand', parseInt(e.target.value))}
                className={`w-full ${
                  isPremium ? 'accent-premium-neon' : 'accent-primary-500'
                }`}
              />
              <input
                type="number"
                value={formData.demand}
                onChange={(e) => handleInputChange('demand', parseInt(e.target.value))}
                className={`w-full px-3 py-1 text-sm rounded border ${
                  isPremium
                    ? 'bg-premium-dark border-premium-neon/30 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Planning Period
            </label>
            <select
              value={formData.period}
              onChange={(e) => handleInputChange('period', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
              }`}
            >
              <option value="2026-01">January 2026</option>
              <option value="2026-02">February 2026</option>
              <option value="2026-03">March 2026</option>
              <option value="2026-04">April 2026</option>
              <option value="2026-05">May 2026</option>
              <option value="2026-06">June 2026 (Monsoon)</option>
              <option value="2026-07">July 2026 (Monsoon)</option>
              <option value="2026-08">August 2026 (Monsoon)</option>
              <option value="2026-09">September 2026 (Monsoon)</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-12">December 2026</option>
            </select>
          </div>

          {/* Carbon Tax */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Carbon Tax (₹ per tonne CO₂)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={formData.carbonTax}
                onChange={(e) => handleInputChange('carbonTax', parseInt(e.target.value))}
                className={`w-full ${
                  isPremium ? 'accent-premium-emerald' : 'accent-primary-500'
                }`}
              />
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={formData.carbonTax}
                  onChange={(e) => handleInputChange('carbonTax', parseInt(e.target.value))}
                  className={`flex-1 px-3 py-1 text-sm rounded border ${
                    isPremium
                      ? 'bg-premium-dark border-premium-neon/30 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <span className={`text-sm ${
                  isPremium ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {formData.carbonTax === 0 ? 'No carbon pricing' : `₹${formData.carbonTax}/tCO₂`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={optimizing}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            optimizing
              ? 'opacity-50 cursor-not-allowed'
              : isPremium
                ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
          whileHover={!optimizing ? { scale: 1.02 } : {}}
          whileTap={!optimizing ? { scale: 0.98 } : {}}
        >
          {optimizing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-t-transparent rounded-full border-current"
              />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Zap size={20} />
              <span>Run Optimization</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default OptimizationForm;