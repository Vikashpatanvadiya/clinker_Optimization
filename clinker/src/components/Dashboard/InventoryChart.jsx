import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

const InventoryChart = ({ data }) => {
  const { isPremium } = useTheme();

  if (!data || !data.inventoryLevels) return null;

  // Get available inventory level keys and ensure they exist
  const inventoryKeys = Object.keys(data.inventoryLevels);
  if (inventoryKeys.length === 0) return null;

  // Transform data for chart with safe access
  const chartData = [];
  const maxPeriods = Math.max(...inventoryKeys.map(key => 
    data.inventoryLevels[key] ? data.inventoryLevels[key].length : 0
  ));

  for (let i = 0; i < maxPeriods; i++) {
    const periodData = { period: `Period ${i + 1}` };
    inventoryKeys.forEach(key => {
      const levels = data.inventoryLevels[key];
      periodData[key] = levels && levels[i] !== undefined ? levels[i] : 0;
    });
    chartData.push(periodData);
  }

  const colors = isPremium 
    ? ['#ffd700', '#00ffff', '#10b981']
    : ['#3b82f6', '#8b5cf6', '#10b981'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
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
          Inventory Levels Over Time
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isPremium
            ? 'bg-premium-neon/20 text-premium-neon'
            : 'bg-blue-50 text-blue-600'
        }`}>
          Trending
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isPremium ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="period" 
              stroke={isPremium ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <YAxis 
              stroke={isPremium ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isPremium ? '#1f2937' : '#ffffff',
                border: isPremium ? '1px solid #374151' : '1px solid #e5e7eb',
                borderRadius: '8px',
                color: isPremium ? '#ffffff' : '#000000'
              }}
            />
            <Legend />
            {inventoryKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InventoryChart;