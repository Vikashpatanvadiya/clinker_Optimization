import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ShipmentTable = ({ data }) => {
  const { isPremium } = useTheme();
  const [sortBy, setSortBy] = useState('quantity');
  const [filterMode, setFilterMode] = useState('all');

  if (!data || !data.shipmentPlan) return null;

  const shipmentPlan = data.shipmentPlan || [];
  
  const filteredData = shipmentPlan.filter(item => 
    filterMode === 'all' || item.mode.toLowerCase().includes(filterMode.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'quantity') return (b.quantity || 0) - (a.quantity || 0);
    if (sortBy === 'trips') return (b.trips || 0) - (a.trips || 0);
    return (a[sortBy] || '').toString().localeCompare((b[sortBy] || '').toString());
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-xl overflow-hidden ${
        isPremium
          ? 'glass-card'
          : 'bg-white shadow-sm border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h3 className={`text-lg font-semibold ${
            isPremium ? 'text-white' : 'text-gray-900'
          }`}>
            Shipment Plan
          </h3>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Filter */}
            <div className="relative">
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className={`appearance-none px-4 py-2 pr-8 rounded-lg border focus:outline-none focus:ring-2 ${
                  isPremium
                    ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                }`}
              >
                <option value="all">All Modes</option>
                <option value="truck">Truck</option>
                <option value="rail">Rail</option>
                <option value="barge">Barge</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none px-4 py-2 pr-8 rounded-lg border focus:outline-none focus:ring-2 ${
                  isPremium
                    ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                }`}
              >
                <option value="quantity">Sort by Quantity</option>
                <option value="trips">Sort by Trips</option>
                <option value="mode">Sort by Mode</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPremium
                  ? 'bg-premium-neon/20 text-premium-neon hover:bg-premium-neon/30'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isPremium ? 'bg-premium-dark/50' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isPremium ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Route
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isPremium ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Mode
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isPremium ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Quantity
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isPremium ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Trips
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isPremium ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Period
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isPremium ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((shipment, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-gray-50 dark:hover:bg-premium-dark/30 transition-colors ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium">
                        {shipment.from} → {shipment.to}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    shipment.mode === 'Truck'
                      ? isPremium
                        ? 'bg-premium-neon/20 text-premium-neon'
                        : 'bg-blue-100 text-blue-800'
                      : shipment.mode === 'Rail'
                        ? isPremium
                          ? 'bg-premium-gold/20 text-premium-gold'
                          : 'bg-yellow-100 text-yellow-800'
                        : isPremium
                          ? 'bg-premium-emerald/20 text-premium-emerald'
                          : 'bg-green-100 text-green-800'
                  }`}>
                    {shipment.mode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {shipment.quantity.toLocaleString()} tons
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {shipment.trips}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  Period {shipment.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    isPremium
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Scheduled
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ShipmentTable;