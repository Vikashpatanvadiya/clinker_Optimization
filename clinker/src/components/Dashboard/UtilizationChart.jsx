import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

const UtilizationChart = ({ data }) => {
  const { isPremium } = useTheme();

  if (!data || !data.capacityUtilization) return null;

  const { production = [], transportation = [] } = data.capacityUtilization;
  
  // Ensure we have data arrays
  if (production.length === 0 && transportation.length === 0) return null;

  // Transform data for chart with safe access
  const maxPeriods = Math.max(production.length, transportation.length);
  const chartData = [];
  
  for (let i = 0; i < maxPeriods; i++) {
    chartData.push({
      period: `Period ${i + 1}`,
      Production: production[i] || 0,
      Transportation: transportation[i] || 0
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
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
          Capacity Utilization
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isPremium
            ? 'bg-premium-emerald/20 text-premium-emerald'
            : 'bg-green-50 text-green-600'
        }`}>
          Optimal
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isPremium ? '#1f2937' : '#ffffff',
                border: isPremium ? '1px solid #374151' : '1px solid #e5e7eb',
                borderRadius: '8px',
                color: isPremium ? '#ffffff' : '#000000'
              }}
              formatter={(value) => [`${value}%`, '']}
            />
            <Legend />
            <Bar
              dataKey="Production"
              fill={isPremium ? '#ffd700' : '#3b82f6'}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Transportation"
              fill={isPremium ? '#00ffff' : '#8b5cf6'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UtilizationChart;