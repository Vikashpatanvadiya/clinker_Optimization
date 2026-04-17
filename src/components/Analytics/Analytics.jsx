import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell,
  ComposedChart, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  DollarSign,
  Truck,
  Factory,
  Target,
  Zap,
  Calendar,
  MapPin,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Analytics = ({ data }) => {
  const { isPremium } = useTheme();
  const [selectedAnalysis, setSelectedAnalysis] = useState('demand-capacity');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('all');

  // Process data for analytics
  const analyticsData = useMemo(() => {
    if (!data) return null;

    // Demand vs Capacity Analysis
    const demandCapacityAnalysis = [1, 2, 3].map(period => {
      const periodDemand = (data.ClinkerDemand || [])
        .filter(item => item['TIME PERIOD'] === period)
        .reduce((sum, item) => sum + (item.DEMAND || 0), 0);
      
      const periodMinFulfillment = (data.ClinkerDemand || [])
        .filter(item => item['TIME PERIOD'] === period)
        .reduce((sum, item) => sum + (item['MIN FULFILLMENT'] || 0), 0);
      
      const periodCapacity = (data.ClinkerCapacity || [])
        .filter(item => item['TIME PERIOD'] === period)
        .reduce((sum, item) => sum + (item.CAPACITY || 0), 0);

      const utilizationRate = periodCapacity > 0 ? (periodDemand / periodCapacity) * 100 : 0;
      const fulfillmentRate = periodDemand > 0 ? (periodMinFulfillment / periodDemand) * 100 : 0;

      return {
        period: `Period ${period}`,
        demand: periodDemand,
        minFulfillment: periodMinFulfillment,
        capacity: periodCapacity,
        utilization: utilizationRate,
        fulfillmentRate: fulfillmentRate,
        gap: periodCapacity - periodDemand,
        fulfillmentGap: periodCapacity - periodMinFulfillment
      };
    });

    // Production Cost Analysis
    const costAnalysis = (data.ProductionCost || []).reduce((acc, item) => {
      const key = `${item['IU CODE']}_${item['TIME PERIOD']}`;
      acc[key] = {
        iuCode: item['IU CODE'],
        period: item['TIME PERIOD'],
        cost: item['PRODUCTION COST']
      };
      return acc;
    }, {});

    const costTrends = [1, 2, 3].map(period => {
      const periodCosts = (data.ProductionCost || [])
        .filter(item => item['TIME PERIOD'] === period)
        .map(item => item['PRODUCTION COST'])
        .filter(cost => cost != null);
      
      const avgCost = periodCosts.length > 0 
        ? periodCosts.reduce((sum, cost) => sum + cost, 0) / periodCosts.length 
        : 0;
      
      const minCost = periodCosts.length > 0 ? Math.min(...periodCosts) : 0;
      const maxCost = periodCosts.length > 0 ? Math.max(...periodCosts) : 0;

      return {
        period: `Period ${period}`,
        avgCost: Math.round(avgCost),
        minCost,
        maxCost,
        variance: maxCost - minCost
      };
    });

    // Logistics Cost Analysis
    const logisticsCosts = (data.LogisticsIUGU || []).map(item => ({
      route: `${item['FROM IU CODE']} → ${item['TO IUGU CODE']}`,
      fromCode: item['FROM IU CODE'],
      toCode: item['TO IUGU CODE'],
      period: item['TIME PERIOD'],
      freightCost: item['FREIGHT COST'] || 0,
      handlingCost: item['HANDLING COST'] || 0,
      totalCost: (item['FREIGHT COST'] || 0) + (item['HANDLING COST'] || 0),
      transportType: item['TRANSPORT CODE']
    }));

    // Top routes by cost
    const routeCostSummary = logisticsCosts.reduce((acc, item) => {
      const key = item.route;
      if (!acc[key]) {
        acc[key] = {
          route: item.route,
          totalCost: 0,
          avgCost: 0,
          count: 0,
          transportTypes: new Set()
        };
      }
      acc[key].totalCost += item.totalCost;
      acc[key].count += 1;
      acc[key].transportTypes.add(item.transportType);
      acc[key].avgCost = acc[key].totalCost / acc[key].count;
      return acc;
    }, {});

    const topRoutes = Object.values(routeCostSummary)
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10);

    // Plant efficiency analysis
    const plantEfficiency = (data.IUGUType || []).map(plant => {
      const openingStock = (data.IUGUOpeningStock || []).find(
        stock => stock['IUGU CODE'] === plant['IUGU CODE']
      )?.['OPENING STOCK'] || 0;

      const totalDemand = (data.ClinkerDemand || [])
        .filter(demand => demand['IUGU CODE'] === plant['IUGU CODE'])
        .reduce((sum, item) => sum + (item.DEMAND || 0), 0);

      const avgProductionCost = plant['PLANT TYPE'] === 'IU' 
        ? (data.ProductionCost || [])
            .filter(cost => cost['IU CODE'] === plant['IUGU CODE'])
            .reduce((sum, item, _, arr) => arr.length > 0 ? sum + (item['PRODUCTION COST'] || 0) / arr.length : 0, 0)
        : 0;

      return {
        code: plant['IUGU CODE'],
        type: plant['PLANT TYPE'],
        openingStock,
        totalDemand,
        avgProductionCost,
        efficiency: totalDemand > 0 ? openingStock / totalDemand : 0
      };
    });

    // Constraint analysis
    const constraintAnalysis = (data.IUGUConstraint || []).reduce((acc, constraint) => {
      const key = constraint['IU CODE'] || constraint['IUGU CODE'] || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          code: key,
          constraints: [],
          totalConstraints: 0
        };
      }
      acc[key].constraints.push({
        period: constraint['TIME PERIOD'],
        boundType: constraint['BOUND TYPEID'],
        valueType: constraint['VALUE TYPEID'],
        value: constraint.Value
      });
      acc[key].totalConstraints += 1;
      return acc;
    }, {});

    return {
      demandCapacityAnalysis,
      costTrends,
      topRoutes,
      plantEfficiency,
      constraintAnalysis: Object.values(constraintAnalysis),
      totalLogisticsCost: logisticsCosts.reduce((sum, item) => sum + item.totalCost, 0),
      totalPlants: (data.IUGUType || []).length,
      totalRoutes: Object.keys(routeCostSummary).length
    };
  }, [data, selectedTimePeriod]);

  if (!data || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  const COLORS = isPremium 
    ? ['#FFD700', '#00FFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    : ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number', subtitle }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-xl ${
        isPremium
          ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${
            isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
          }`}>
            {format === 'currency' ? `₹${value.toLocaleString()}` : 
             format === 'percentage' ? `${value.toFixed(1)}%` :
             value.toLocaleString()}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          isPremium ? 'bg-premium-neon/20' : 'bg-blue-50 dark:bg-blue-900/20'
        }`}>
          <Icon className={isPremium ? 'text-premium-neon' : 'text-blue-600 dark:text-blue-400'} size={24} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${
            isPremium ? 'premium-text-gradient font-display' : 'text-gray-900 dark:text-white'
          }`}>
            Advanced Analytics
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Deep insights into clinker optimization performance
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <select
            value={selectedAnalysis}
            onChange={(e) => setSelectedAnalysis(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              isPremium
                ? 'bg-premium-dark border-premium-gold/30 text-premium-gold'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            <option value="demand-capacity">Demand vs Capacity</option>
            <option value="cost-analysis">Cost Analysis</option>
            <option value="logistics">Logistics Performance</option>
            <option value="plant-efficiency">Plant Efficiency</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Plants"
          value={analyticsData.totalPlants}
          icon={Factory}
          subtitle="Integrated & Grinding Units"
        />
        <MetricCard
          title="Total Routes"
          value={analyticsData.totalRoutes}
          icon={Truck}
          subtitle="Active logistics routes"
        />
        <MetricCard
          title="Total Logistics Cost"
          value={analyticsData.totalLogisticsCost}
          icon={DollarSign}
          format="currency"
          subtitle="All periods combined"
        />
        <MetricCard
          title="Avg Utilization"
          value={analyticsData.demandCapacityAnalysis.reduce((sum, item) => sum + item.utilization, 0) / 3}
          icon={Target}
          format="percentage"
          subtitle="Capacity utilization rate"
        />
      </div>

      {/* Main Analysis Section */}
      {selectedAnalysis === 'demand-capacity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demand vs Capacity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              isPremium
                ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Demand, Min Fulfillment & Capacity Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analyticsData.demandCapacityAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke={isPremium ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="period" stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
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
                <Bar dataKey="minFulfillment" fill={COLORS[2]} name="Min Fulfillment" />
                <Bar dataKey="capacity" fill={COLORS[1]} name="Capacity" />
                <Line type="monotone" dataKey="utilization" stroke={COLORS[3]} strokeWidth={3} name="Utilization %" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Utilization Breakdown */}
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
            <h3 className={`text-lg font-semibold mb-4 ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Capacity & Fulfillment Analysis
            </h3>
            <div className="space-y-4">
              {analyticsData.demandCapacityAnalysis.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${
                      isPremium ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.period}
                    </span>
                    <div className="text-right">
                      <span className={`text-sm block ${
                        isPremium ? 'text-premium-gold' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        Utilization: {item.utilization.toFixed(1)}%
                      </span>
                      <span className={`text-xs ${
                        isPremium ? 'text-premium-neon' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        Fulfillment: {item.fulfillmentRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-1`}>
                    <div
                      className={`h-3 rounded-full ${
                        item.utilization >= 90 ? 'bg-red-500' :
                        item.utilization >= 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(item.utilization, 100)}%` }}
                    />
                  </div>
                  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min(item.fulfillmentRate, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={isPremium ? 'text-gray-400' : 'text-gray-500'}>
                      Demand: {item.demand.toLocaleString()}
                    </span>
                    <span className={isPremium ? 'text-gray-400' : 'text-gray-500'}>
                      Min Fulfillment: {item.minFulfillment.toLocaleString()}
                    </span>
                    <span className={isPremium ? 'text-gray-400' : 'text-gray-500'}>
                      Capacity: {item.capacity.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedAnalysis === 'cost-analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              isPremium
                ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Production Cost Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.costTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isPremium ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="period" stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isPremium ? '#1F2937' : '#FFFFFF',
                    border: isPremium ? '1px solid #FFD700' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: isPremium ? '#FFD700' : '#1F2937'
                  }}
                />
                <Line type="monotone" dataKey="avgCost" stroke={COLORS[0]} strokeWidth={3} name="Average Cost" />
                <Line type="monotone" dataKey="minCost" stroke={COLORS[1]} strokeWidth={2} name="Min Cost" />
                <Line type="monotone" dataKey="maxCost" stroke={COLORS[2]} strokeWidth={2} name="Max Cost" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cost Variance */}
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
            <h3 className={`text-lg font-semibold mb-4 ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Cost Variance Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.costTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke={isPremium ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="period" stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isPremium ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isPremium ? '#1F2937' : '#FFFFFF',
                    border: isPremium ? '1px solid #FFD700' : '1px solid #E5E7EB',
                    borderRadius: '8px',
                    color: isPremium ? '#FFD700' : '#1F2937'
                  }}
                />
                <Bar dataKey="variance" fill={COLORS[3]} name="Cost Variance" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {selectedAnalysis === 'logistics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
          }`}>
            Top 10 Routes by Total Cost
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
                    Route
                  </th>
                  <th className={`text-right py-3 px-4 font-medium ${
                    isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Total Cost
                  </th>
                  <th className={`text-right py-3 px-4 font-medium ${
                    isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Avg Cost
                  </th>
                  <th className={`text-center py-3 px-4 font-medium ${
                    isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Shipments
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topRoutes.map((route, index) => (
                  <tr 
                    key={index}
                    className={`border-b ${
                      isPremium ? 'border-premium-gold/10' : 'border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    <td className={`py-3 px-4 font-medium ${
                      isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
                    }`}>
                      {route.route}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      ₹{route.totalCost.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      ₹{Math.round(route.avgCost).toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-center ${
                      isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {route.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {selectedAnalysis === 'plant-efficiency' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${
            isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
          }`}>
            Plant Efficiency Analysis
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={analyticsData.plantEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke={isPremium ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="openingStock" 
                name="Opening Stock"
                stroke={isPremium ? '#9CA3AF' : '#6B7280'}
              />
              <YAxis 
                dataKey="totalDemand" 
                name="Total Demand"
                stroke={isPremium ? '#9CA3AF' : '#6B7280'}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: isPremium ? '#1F2937' : '#FFFFFF',
                  border: isPremium ? '1px solid #FFD700' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: isPremium ? '#FFD700' : '#1F2937'
                }}
                formatter={(value, name, props) => [
                  value.toLocaleString(),
                  name,
                  `Plant: ${props.payload.code}`
                ]}
              />
              <Scatter 
                dataKey="totalDemand" 
                fill={COLORS[0]}
                name="Plant Performance"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;