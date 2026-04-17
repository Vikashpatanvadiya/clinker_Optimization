import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Factory, TrendingUp, Package, Truck, AlertTriangle, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Dashboard = ({ data }) => {
  const { isPremium } = useTheme();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(1);

  // Process data for dashboard metrics
  const dashboardMetrics = useMemo(() => {
    if (!data) return null;

    // Calculate total demand by time period
    const demandByPeriod = (data.ClinkerDemand || []).reduce((acc, item) => {
      acc[item['TIME PERIOD']] = (acc[item['TIME PERIOD']] || 0) + (item.DEMAND || 0);
      return acc;
    }, {});

    // Calculate total capacity by time period
    const capacityByPeriod = (data.ClinkerCapacity || []).reduce((acc, item) => {
      acc[item['TIME PERIOD']] = (acc[item['TIME PERIOD']] || 0) + (item.CAPACITY || 0);
      return acc;
    }, {});

    // Calculate average production cost by time period
    const costByPeriod = (data.ProductionCost || []).reduce((acc, item) => {
      if (!acc[item['TIME PERIOD']]) {
        acc[item['TIME PERIOD']] = { total: 0, count: 0 };
      }
      acc[item['TIME PERIOD']].total += (item['PRODUCTION COST'] || 0);
      acc[item['TIME PERIOD']].count += 1;
      return acc;
    }, {});

    // Plant type distribution
    const plantTypes = (data.IUGUType || []).reduce((acc, item) => {
      acc[item['PLANT TYPE']] = (acc[item['PLANT TYPE']] || 0) + 1;
      return acc;
    }, {});

    // Top plants by opening stock
    const topPlantsByStock = (data.IUGUOpeningStock || [])
      .sort((a, b) => (b['OPENING STOCK'] || 0) - (a['OPENING STOCK'] || 0))
      .slice(0, 10);

    return {
      demandByPeriod,
      capacityByPeriod,
      costByPeriod,
      plantTypes,
      topPlantsByStock,
      totalPlants: (data.IUGUType || []).length,
      totalOpeningStock: (data.IUGUOpeningStock || []).reduce((sum, item) => sum + (item['OPENING STOCK'] || 0), 0)
    };
  }, [data]);

  if (!data || !dashboardMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const COLORS = isPremium 
    ? ['#FFD700', '#00FFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    : ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Prepare chart data
  const demandCapacityData = [1, 2, 3].map(period => ({
    period: `Period ${period}`,
    demand: dashboardMetrics.demandByPeriod[period] || 0,
    capacity: dashboardMetrics.capacityByPeriod[period] || 0,
    avgCost: dashboardMetrics.costByPeriod[period] 
      ? dashboardMetrics.costByPeriod[period].total / dashboardMetrics.costByPeriod[period].count 
      : 0
  }));

  const plantTypeData = Object.entries(dashboardMetrics.plantTypes || {}).map(([type, count]) => ({
    name: type === 'IU' ? 'Integrated Units' : type === 'GU' ? 'Grinding Units' : type,
    value: count,
    type
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${
            isPremium ? 'premium-text-gradient font-display' : 'text-gray-900 dark:text-white'
          }`}>
            Clinker Optimization Dashboard
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Comprehensive view of clinker demand, capacity, and logistics
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(Number(e.target.value))}
            className={`px-4 py-2 rounded-lg border ${
              isPremium
                ? 'bg-premium-dark border-premium-gold/30 text-premium-gold'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            <option value={1}>Period 1</option>
            <option value={2}>Period 2</option>
            <option value={3}>Period 3</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Total Plants
              </p>
              <p className={`text-2xl font-bold ${
                isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
              }`}>
                {dashboardMetrics.totalPlants}
              </p>
            </div>
            <Factory className={`w-8 h-8 ${
              isPremium ? 'text-premium-neon' : 'text-blue-500'
            }`} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Total Opening Stock
              </p>
              <p className={`text-2xl font-bold ${
                isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
              }`}>
                {Math.round(dashboardMetrics.totalOpeningStock).toLocaleString()}
              </p>
            </div>
            <Package className={`w-8 h-8 ${
              isPremium ? 'text-premium-neon' : 'text-green-500'
            }`} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Period {selectedTimePeriod} Demand
              </p>
              <p className={`text-2xl font-bold ${
                isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
              }`}>
                {(dashboardMetrics.demandByPeriod[selectedTimePeriod] || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${
              isPremium ? 'text-premium-neon' : 'text-orange-500'
            }`} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Period {selectedTimePeriod} Capacity
              </p>
              <p className={`text-2xl font-bold ${
                isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
              }`}>
                {(dashboardMetrics.capacityByPeriod[selectedTimePeriod] || 0).toLocaleString()}
              </p>
            </div>
            <Activity className={`w-8 h-8 ${
              isPremium ? 'text-premium-neon' : 'text-purple-500'
            }`} />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand vs Capacity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
          }`}>
            Demand vs Capacity by Period
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandCapacityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isPremium ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="period" 
                stroke={isPremium ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isPremium ? '#1F2937' : '#FFFFFF',
                  border: isPremium ? '1px solid #FFD700' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: isPremium ? '#FFD700' : '#1F2937'
                }}
              />
              <Bar dataKey="demand" fill={COLORS[0]} name="Demand" />
              <Bar dataKey="capacity" fill={COLORS[1]} name="Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plant Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
          }`}>
            Plant Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={plantTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {plantTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isPremium ? '#1F2937' : '#FFFFFF',
                  border: isPremium ? '1px solid #FFD700' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: isPremium ? '#FFD700' : '#1F2937'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Production Cost Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-xl ${
          isPremium
            ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
        }`}>
          Average Production Cost Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={demandCapacityData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isPremium ? '#374151' : '#E5E7EB'} />
            <XAxis 
              dataKey="period" 
              stroke={isPremium ? '#9CA3AF' : '#6B7280'}
            />
            <YAxis stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isPremium ? '#1F2937' : '#FFFFFF',
                border: isPremium ? '1px solid #FFD700' : '1px solid #E5E7EB',
                borderRadius: '8px',
                color: isPremium ? '#FFD700' : '#1F2937'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="avgCost" 
              stroke={COLORS[2]} 
              strokeWidth={3}
              name="Avg Production Cost"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Plants by Opening Stock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-xl ${
          isPremium
            ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-4 ${
          isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
        }`}>
          Top 10 Plants by Opening Stock
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isPremium ? 'border-premium-gold/20' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <th className={`text-left py-3 px-4 font-medium ${
                  isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Plant Code
                </th>
                <th className={`text-right py-3 px-4 font-medium ${
                  isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Opening Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardMetrics.topPlantsByStock.map((plant, index) => (
                <tr 
                  key={plant['IUGU CODE']}
                  className={`border-b ${
                    isPremium ? 'border-premium-gold/10' : 'border-gray-100 dark:border-gray-800'
                  }`}
                >
                  <td className={`py-3 px-4 font-medium ${
                    isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
                  }`}>
                    {plant['IUGU CODE']}
                  </td>
                  <td className={`py-3 px-4 text-right ${
                    isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {Math.round(plant['OPENING STOCK']).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;