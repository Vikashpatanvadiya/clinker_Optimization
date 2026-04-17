import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Weight, 
  Fuel, 
  DollarSign, 
  Clock, 
  Route,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getVehicleRecommendations } from '../../data/vehicleDatabase';
import { formatCurrency, formatNumber } from '../../utils/currency';

const TransportationRecommendation = () => {
  const { isPremium } = useTheme();
  const [formData, setFormData] = useState({
    fromLocation: 'IU_Karnataka',
    toLocation: 'GU_Odisha',
    tonnage: 100
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState({ integrated_units: [], grinding_units: [] });

  const locations = [
    { id: 'IU_Karnataka', name: 'IU Karnataka', type: 'integrated' },
    { id: 'IU_Gujarat', name: 'IU Gujarat', type: 'integrated' },
    { id: 'IU_Rajasthan', name: 'IU Rajasthan', type: 'integrated' },
    { id: 'GU_Odisha', name: 'GU Odisha', type: 'grinding' },
    { id: 'GU_Maharashtra', name: 'GU Maharashtra', type: 'grinding' },
    { id: 'GU_Punjab', name: 'GU Punjab', type: 'grinding' }
  ];

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants');
      const plantsData = await response.json();
      setPlants(plantsData);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      // Try local calculation first
      const result = getVehicleRecommendations(
        formData.fromLocation,
        formData.toLocation,
        formData.tonnage
      );
      
      // If local calculation fails, try API endpoint
      if (result.error) {
        const response = await fetch('/api/vehicle-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          const apiResult = await response.json();
          setRecommendations(apiResult);
        } else {
          setRecommendations({ error: 'Failed to get recommendations from API' });
        }
      } else {
        setRecommendations(result);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations({ error: 'Failed to get recommendations' });
    } finally {
      setLoading(false);
    }
  };

  const getEfficiencyBadge = (kmpl) => {
    if (kmpl >= 10) return { label: 'Excellent', color: 'green' };
    if (kmpl >= 7) return { label: 'Good', color: 'blue' };
    if (kmpl >= 5) return { label: 'Average', color: 'yellow' };
    return { label: 'Low', color: 'red' };
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${
          isPremium
            ? 'glass-card'
            : 'bg-white shadow-sm border border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-lg ${
            isPremium
              ? 'bg-premium-neon/20'
              : 'bg-blue-50'
          }`}>
            <Route className={isPremium ? 'text-premium-neon' : 'text-blue-600'} size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              Smart Transportation Recommendation
            </h3>
            <p className={`text-sm ${
              isPremium ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get the most efficient vehicles for your route and load
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* From Location */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <MapPin size={16} className="inline mr-2" />
              From Location
            </label>
            <select
              value={formData.fromLocation}
              onChange={(e) => handleInputChange('fromLocation', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
              }`}
            >
              {locations.filter(loc => loc.type === 'integrated').map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Location */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <MapPin size={16} className="inline mr-2" />
              To Location
            </label>
            <select
              value={formData.toLocation}
              onChange={(e) => handleInputChange('toLocation', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
              }`}
            >
              {locations.filter(loc => loc.type === 'grinding').map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tonnage */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Weight size={16} className="inline mr-2" />
              Load (tonnes)
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={formData.tonnage}
                onChange={(e) => handleInputChange('tonnage', parseInt(e.target.value))}
                className={`w-full ${
                  isPremium ? 'accent-premium-neon' : 'accent-primary-500'
                }`}
              />
              <input
                type="number"
                value={formData.tonnage}
                onChange={(e) => handleInputChange('tonnage', parseInt(e.target.value))}
                className={`w-full px-3 py-1 text-sm rounded border ${
                  isPremium
                    ? 'bg-premium-dark border-premium-neon/30 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleGetRecommendations}
          disabled={loading}
          className={`mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            loading
              ? 'opacity-50 cursor-not-allowed'
              : isPremium
                ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-t-transparent rounded-full border-current"
              />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp size={20} />
              <span>Get Vehicle Recommendations</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Recommendations */}
      {recommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {recommendations.error ? (
            <div className={`p-6 rounded-xl ${
              isPremium
                ? 'bg-red-500/10 border border-red-500/30'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className={`font-medium ${
                  isPremium ? 'text-red-400' : 'text-red-800'
                }`}>
                  {recommendations.error}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Route Info */}
              <div className={`p-4 rounded-xl ${
                isPremium
                  ? 'glass-card'
                  : 'bg-white shadow-sm border border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-sm ${
                      isPremium ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Route:</strong> {recommendations.route.from} → {recommendations.route.to}
                    </div>
                    <div className={`text-sm ${
                      isPremium ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Distance:</strong> {recommendations.route.distance} km
                    </div>
                    <div className={`text-sm ${
                      isPremium ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <strong>Load:</strong> {recommendations.tonnage} tonnes
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recommendations.recommendations.map((vehicle, index) => {
                  const efficiencyBadge = getEfficiencyBadge(vehicle.efficiency.kmpl);
                  
                  return (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl ${
                        isPremium
                          ? 'glass-card hover:bg-white/20'
                          : 'bg-white shadow-sm hover:shadow-md border border-gray-200'
                      } transition-all duration-200`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            index === 0
                              ? isPremium
                                ? 'bg-premium-gold/20'
                                : 'bg-green-50'
                              : isPremium
                                ? 'bg-premium-neon/20'
                                : 'bg-blue-50'
                          }`}>
                            <Truck 
                              size={20} 
                              className={
                                index === 0
                                  ? isPremium ? 'text-premium-gold' : 'text-green-600'
                                  : isPremium ? 'text-premium-neon' : 'text-blue-600'
                              } 
                            />
                          </div>
                          <div>
                            <h4 className={`font-semibold ${
                              isPremium ? 'text-white' : 'text-gray-900'
                            }`}>
                              {vehicle.name}
                            </h4>
                            <p className={`text-sm ${
                              isPremium ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {vehicle.type}
                            </p>
                          </div>
                        </div>
                        
                        {index === 0 && (
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            isPremium
                              ? 'bg-premium-gold/20 text-premium-gold'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            <Award size={12} />
                            <span>Best Choice</span>
                          </div>
                        )}
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${
                          isPremium ? 'bg-white/5' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <DollarSign size={14} className={isPremium ? 'text-premium-gold' : 'text-green-600'} />
                            <span className={`text-xs font-medium ${
                              isPremium ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Cost per Tonne
                            </span>
                          </div>
                          <p className={`text-lg font-bold ${
                            isPremium ? 'text-white' : 'text-gray-900'
                          }`}>
                            {formatCurrency(vehicle.costPerTon)}
                          </p>
                        </div>

                        <div className={`p-3 rounded-lg ${
                          isPremium ? 'bg-white/5' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <Fuel size={14} className={isPremium ? 'text-premium-neon' : 'text-blue-600'} />
                            <span className={`text-xs font-medium ${
                              isPremium ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              Fuel Efficiency
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className={`text-lg font-bold ${
                              isPremium ? 'text-white' : 'text-gray-900'
                            }`}>
                              {vehicle.efficiency.kmpl} km/l
                            </p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              efficiencyBadge.color === 'green'
                                ? 'bg-green-100 text-green-800'
                                : efficiencyBadge.color === 'blue'
                                  ? 'bg-blue-100 text-blue-800'
                                  : efficiencyBadge.color === 'yellow'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                              {efficiencyBadge.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                            Capacity:
                          </span>
                          <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                            {vehicle.capacity_tons} tonnes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                            Trips Required:
                          </span>
                          <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                            {vehicle.trips}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                            Total Distance:
                          </span>
                          <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                            {formatNumber(vehicle.efficiency.totalDistance)} km
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                            Total Time:
                          </span>
                          <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                            {vehicle.efficiency.totalTime} hours
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                            Total Cost:
                          </span>
                          <span className={`font-semibold ${isPremium ? 'text-premium-gold' : 'text-green-600'}`}>
                            {formatCurrency(vehicle.totalCost)}
                          </span>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-xs font-medium mb-2 ${
                          isPremium ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Cost Breakdown (per trip):
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className={isPremium ? 'text-gray-400' : 'text-gray-500'}>Fuel:</span>
                            <br />
                            <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                              {formatCurrency(vehicle.breakdown.fuel, { compact: true })}
                            </span>
                          </div>
                          <div>
                            <span className={isPremium ? 'text-gray-400' : 'text-gray-500'}>Driver:</span>
                            <br />
                            <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                              {formatCurrency(vehicle.breakdown.driver, { compact: true })}
                            </span>
                          </div>
                          <div>
                            <span className={isPremium ? 'text-gray-400' : 'text-gray-500'}>Other:</span>
                            <br />
                            <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                              {formatCurrency(vehicle.breakdown.maintenance + vehicle.breakdown.insurance + vehicle.breakdown.permit + vehicle.breakdown.toll, { compact: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TransportationRecommendation;