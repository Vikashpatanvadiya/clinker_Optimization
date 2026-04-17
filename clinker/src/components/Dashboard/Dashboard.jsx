import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CostSummary from './CostSummary';
import ShipmentTable from './ShipmentTable';
import InventoryChart from './InventoryChart';
import UtilizationChart from './UtilizationChart';
import FlowDiagram from './FlowDiagram';
import { useTheme } from '../../contexts/ThemeContext';

const Dashboard = () => {
  const { isPremium } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptimizationResults();
  }, []);

  const fetchOptimizationResults = async () => {
    try {
      setError(null);
      const response = await fetch('/api/optimization-results');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const results = await response.json();
      setData(results);
    } catch (error) {
      console.error('Error fetching optimization results:', error);
      setError(error.message);
      // Set fallback data to prevent crashes
      setData({
        totalCost: 0,
        productionCost: 0,
        transportCost: 0,
        inventoryCost: 0,
        shipmentPlan: [],
        inventoryLevels: {},
        capacityUtilization: { production: [], transportation: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-8 h-8 border-2 border-t-transparent rounded-full ${
            isPremium ? 'border-premium-neon' : 'border-primary-500'
          }`}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center p-6 rounded-lg ${
          isPremium ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchOptimizationResults}
            className={`mt-4 px-4 py-2 rounded-lg ${
              isPremium
                ? 'bg-premium-neon/20 text-premium-neon hover:bg-premium-neon/30'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${
            isPremium ? 'premium-text-gradient font-display' : 'text-gray-900'
          }`}>
            Optimization Dashboard
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Real-time clinker allocation and transportation insights
          </p>
        </div>
        
        <motion.button
          onClick={fetchOptimizationResults}
          className={`mt-4 lg:mt-0 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            isPremium
              ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Refresh Data
        </motion.button>
      </div>

      {/* Cost Summary Cards */}
      <CostSummary data={data} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryChart data={data} />
        <UtilizationChart data={data} />
      </div>

      {/* Flow Diagram */}
      <FlowDiagram data={data} />

      {/* Shipment Table */}
      <ShipmentTable data={data} />
    </div>
  );
};

export default Dashboard;