import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Package, Clock, Zap, Search, Building2, ChevronDown, Loader2,
  Trophy, Truck, Leaf, IndianRupee, ChevronUp, Route, RefreshCw, Sparkles
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function SmartOptimizer() {
  const { isPremium } = useTheme();
  const [plants, setPlants] = useState({ integrated_units: [], grinding_units: [] });
  const [destination, setDestination] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [urgency, setUrgency] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedOption, setExpandedOption] = useState(0);
  const [costMode, setCostMode] = useState('per_unit'); // 'per_unit' or 'batch'

  useEffect(() => {
    fetch('/api/plants')
      .then(res => res.json())
      .then(data => setPlants(data))
      .catch(err => console.error('Error fetching plants:', err));
  }, []);

  const allDestinations = [...(plants.grinding_units || []), ...(plants.integrated_units || [])];
  
  const filteredDestinations = allDestinations.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPlant = allDestinations.find(p => p.id === destination);

  const handleOptimize = async () => {
    if (!destination || quantity < 10) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/smart-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationId: destination, quantity, urgency, costMode })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const urgencyOptions = [
    { id: 'immediate', label: 'Immediate', desc: '1-2 days' },
    { id: 'week', label: 'This Week', desc: '3-5 days' },
    { id: 'month', label: 'This Month', desc: '7-14 days' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl lg:text-3xl font-bold ${isPremium ? 'premium-text-gradient' : 'text-gray-900'}`}>
          Smart Logistics Optimizer
        </h1>
        <p className={`mt-1 ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
          Enter minimal details, get optimal transport recommendations
        </p>
      </div>

      {/* Input Section */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl overflow-hidden ${isPremium ? 'glass-card' : 'bg-white shadow-lg border border-gray-200'}`}
        >
          {/* Destination */}
          <div className={`p-6 border-b ${isPremium ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-premium-neon/20' : 'bg-blue-100'}`}>
                <MapPin className={`w-4 h-4 ${isPremium ? 'text-premium-neon' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>Where do you need clinker?</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Select destination plant</p>
              </div>
            </div>

            <div className="relative">
              <div className="relative cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search by plant name, city, or state..."
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border focus:outline-none focus:ring-2 ${
                    isPremium 
                      ? 'bg-premium-dark border-premium-neon/30 text-white placeholder-gray-500 focus:ring-premium-neon' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                  }`}
                />
                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute z-50 w-full mt-2 rounded-xl shadow-2xl max-h-64 overflow-y-auto ${
                    isPremium ? 'bg-premium-dark border border-premium-neon/30' : 'bg-white border border-gray-200'
                  }`}
                >
                  {filteredDestinations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No plants found</div>
                  ) : (
                    filteredDestinations.map((plant) => (
                      <button
                        key={plant.id}
                        onClick={() => { setDestination(plant.id); setSearchQuery(plant.name); setShowDropdown(false); }}
                        className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                          destination === plant.id 
                            ? isPremium ? 'bg-premium-neon/20' : 'bg-blue-50'
                            : isPremium ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div className="text-left flex-1">
                          <p className={`font-medium ${isPremium ? 'text-white' : 'text-gray-900'}`}>{plant.name}</p>
                          <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{plant.city}, {plant.state}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          plant.id.startsWith('gu_') 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400'
                        }`}>
                          {plant.id.startsWith('gu_') ? 'GU' : 'IU'}
                        </span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </div>

            {selectedPlant && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 p-4 rounded-xl ${isPremium ? 'bg-premium-neon/10' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${isPremium ? 'text-premium-neon' : 'text-blue-900'}`}>{selectedPlant.name}</p>
                    <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-blue-700'}`}>{selectedPlant.city}, {selectedPlant.state} • {selectedPlant.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-blue-600'}`}>
                      Capacity: {(selectedPlant.capacity || selectedPlant.demand || 0).toLocaleString()}T
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quantity */}
          <div className={`p-6 border-b ${isPremium ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Package className={`w-4 h-4 ${isPremium ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>How much do you need?</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Specify quantity in tonnes</p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className={`w-full ${isPremium ? 'accent-premium-neon' : 'accent-blue-500'}`}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 0))}
                    className={`w-32 px-4 py-2 rounded-lg border text-center font-semibold focus:outline-none focus:ring-2 ${
                      isPremium 
                        ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon' 
                        : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500'
                    }`}
                  />
                  <span className={`font-medium ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>tonnes</span>
                </div>
                
                <div className="flex space-x-2">
                  {[100, 500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setQuantity(val)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        quantity === val
                          ? isPremium ? 'bg-premium-neon text-premium-dark' : 'bg-blue-500 text-white'
                          : isPremium ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {val}T
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div className={`p-6 border-b ${isPremium ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                <Clock className={`w-4 h-4 ${isPremium ? 'text-amber-400' : 'text-amber-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>When do you need it?</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Select delivery urgency</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {urgencyOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setUrgency(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    urgency === option.id
                      ? isPremium ? 'border-premium-neon bg-premium-neon/10' : 'border-blue-500 bg-blue-50'
                      : isPremium ? 'border-white/10 hover:border-white/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold ${urgency === option.id ? (isPremium ? 'text-premium-neon' : 'text-blue-600') : (isPremium ? 'text-white' : 'text-gray-900')}`}>
                    {option.label}
                  </p>
                  <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cost Mode Toggle */}
          <div className={`p-6 border-b ${isPremium ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <IndianRupee className={`w-4 h-4 ${isPremium ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>Cost Display Mode</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Choose how costs are calculated</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isPremium ? 'border-white/10' : 'border-gray-200'}">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCostMode('per_unit')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    costMode === 'per_unit'
                      ? isPremium ? 'bg-premium-neon text-premium-dark' : 'bg-blue-500 text-white'
                      : isPremium ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Per Tonne
                </button>
                <button
                  onClick={() => setCostMode('batch')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    costMode === 'batch'
                      ? isPremium ? 'bg-premium-neon text-premium-dark' : 'bg-blue-500 text-white'
                      : isPremium ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Full Batch
                </button>
              </div>
              <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>
                {costMode === 'per_unit' ? 'Shows cost per tonne' : 'Shows total batch cost'}
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6">
            <motion.button
              onClick={handleOptimize}
              disabled={!destination || quantity < 10 || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all ${
                !destination || quantity < 10 || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isPremium 
                    ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Optimizing Routes...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Find Optimal Routes</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>Optimization Results</h2>
              <p className={`${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                {result.quantity} tonnes to {result.destination?.name}, {result.destination?.city}
              </p>
            </div>
            <button
              onClick={() => setResult(null)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPremium ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Search</span>
            </button>
          </div>

          {/* Destination Card */}
          <div className={`rounded-2xl p-6 ${isPremium ? 'bg-gradient-to-r from-premium-neon/20 to-premium-gold/20' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm ${isPremium ? 'text-gray-300' : 'text-blue-100'}`}>Destination</p>
                  <h2 className="text-xl font-bold">{result.destination?.name}</h2>
                  <p className={`${isPremium ? 'text-gray-300' : 'text-blue-100'}`}>{result.destination?.city}, {result.destination?.state}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isPremium ? 'text-gray-300' : 'text-blue-100'}`}>Required Quantity</p>
                <p className="text-3xl font-bold">{result.quantity?.toLocaleString()}T</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            {result.recommendations?.map((option, index) => {
              const isExpanded = expandedOption === index;
              const Icon = option.type === 'single_source' ? Trophy : option.type === 'eco_friendly' ? Leaf : Package;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl border-2 overflow-hidden ${
                    isPremium ? 'bg-premium-dark border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="p-6 cursor-pointer" onClick={() => setExpandedOption(isExpanded ? -1 : index)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                          option.type === 'eco_friendly' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                          'bg-gradient-to-br from-blue-400 to-indigo-500'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{option.label}</h3>
                            {index === 0 && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                                isPremium ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                              }`}>
                                <Sparkles className="w-3 h-3" />
                                <span>Best Value</span>
                              </span>
                            )}
                          </div>
                          <p className={`${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>{option.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(option.totalCost)}</p>
                          <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>₹{option.costPerTonne}/tonne</p>
                        </div>
                        <button className={`p-2 rounded-lg ${isPremium ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div className={`flex items-center space-x-6 mt-4 pt-4 border-t ${isPremium ? 'border-white/10' : 'border-gray-100'}`}>
                      <div className={`flex items-center space-x-2 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Route className="w-4 h-4" /><span>{option.totalDistance} km</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4" /><span>{option.deliveryDays} days</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Leaf className="w-4 h-4" /><span>{option.co2Emissions} kg CO₂</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Truck className="w-4 h-4" /><span>{option.sources?.reduce((sum, s) => sum + s.trips, 0)} trips</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`border-t ${isPremium ? 'border-white/10' : 'border-gray-200'}`}
                      >
                        <div className="p-6 space-y-4">
                          {option.sources?.map((source, sIndex) => (
                            <div key={sIndex} className={`rounded-xl p-4 ${isPremium ? 'bg-white/5' : 'bg-gray-50'}`}>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPremium ? 'bg-premium-neon/20' : 'bg-blue-100'}`}>
                                    <Building2 className={`w-5 h-5 ${isPremium ? 'text-premium-neon' : 'text-blue-600'}`} />
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.plant?.name}</h4>
                                    <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{source.plant?.city}, {source.plant?.state}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.quantity}T</p>
                                  <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(source.cost)}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className={`rounded-lg p-3 ${isPremium ? 'bg-premium-dark' : 'bg-white'}`}>
                                  <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Distance</p>
                                  <p className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.distance} km</p>
                                </div>
                                <div className={`rounded-lg p-3 ${isPremium ? 'bg-premium-dark' : 'bg-white'}`}>
                                  <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Vehicle</p>
                                  <p className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.vehicle?.name}</p>
                                </div>
                                <div className={`rounded-lg p-3 ${isPremium ? 'bg-premium-dark' : 'bg-white'}`}>
                                  <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Trips</p>
                                  <p className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.trips}</p>
                                </div>
                                <div className={`rounded-lg p-3 ${isPremium ? 'bg-premium-dark' : 'bg-white'}`}>
                                  <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Delivery</p>
                                  <p className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.deliveryDays} days</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* All Routes Table */}
          {result.allRoutes && result.allRoutes.length > 0 && (
            <div className={`rounded-2xl overflow-hidden ${isPremium ? 'bg-premium-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
              <div className={`p-6 border-b ${isPremium ? 'border-white/10' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>All Available Routes</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Ranked by cost efficiency</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isPremium ? 'bg-white/5' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Source Plant</th>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Distance</th>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Cost/Tonne</th>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Inventory</th>
                      <th className={`px-6 py-3 text-left text-xs font-semibold uppercase ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isPremium ? 'divide-white/10' : 'divide-gray-200'}`}>
                    {result.allRoutes.map((route, index) => (
                      <tr key={index} className={isPremium ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4">
                          <p className={`font-medium ${isPremium ? 'text-white' : 'text-gray-900'}`}>{route.source?.name}</p>
                          <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{route.source?.city}, {route.source?.state}</p>
                        </td>
                        <td className={`px-6 py-4 ${isPremium ? 'text-white' : 'text-gray-900'}`}>{route.route?.distance} km</td>
                        <td className={`px-6 py-4 font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>₹{route.bestVehicle?.costPerTonne}</td>
                        <td className={`px-6 py-4 ${isPremium ? 'text-white' : 'text-gray-900'}`}>{route.availableInventory?.toLocaleString()}T</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            route.canFulfill
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                          }`}>
                            {route.canFulfill ? 'Can Fulfill' : 'Partial'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Quick Stats */}
      {!result && (
        <div className="grid grid-cols-3 gap-4">
          <div className={`rounded-xl p-4 text-center ${isPremium ? 'bg-premium-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
            <p className={`text-2xl font-bold ${isPremium ? 'text-premium-neon' : 'text-blue-600'}`}>{plants.integrated_units?.length || 0}</p>
            <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Source Plants</p>
          </div>
          <div className={`rounded-xl p-4 text-center ${isPremium ? 'bg-premium-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
            <p className={`text-2xl font-bold ${isPremium ? 'text-green-400' : 'text-green-600'}`}>{plants.grinding_units?.length || 0}</p>
            <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Destinations</p>
          </div>
          <div className={`rounded-xl p-4 text-center ${isPremium ? 'bg-premium-dark border border-white/10' : 'bg-white border border-gray-200'}`}>
            <p className={`text-2xl font-bold ${isPremium ? 'text-purple-400' : 'text-purple-600'}`}>Real-time</p>
            <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Distance Calc</p>
          </div>
        </div>
      )}
    </div>
  );
}
