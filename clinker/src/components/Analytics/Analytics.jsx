import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  DollarSign,
  Truck,
  Factory,
  Target,
  Zap,
  Calendar,
  MapPin
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/currency';

const Analytics = () => {
  const { isPremium } = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        overview: {
          totalCost: 15420000,
          costChange: -8.2,
          totalShipments: 1247,
          shipmentsChange: 12.5,
          avgEfficiency: 5.8,
          efficiencyChange: 3.1,
          carbonEmissions: 2840,
          emissionsChange: -15.3
        },
        costBreakdown: {
          production: 9252000,
          transportation: 4326000,
          inventory: 1842000
        },
        routePerformance: [
          { route: 'Mundra → Bhubaneswar', volume: 2400, cost: 3200000, efficiency: 6.2 },
          { route: 'Lakheri → Jaipur', volume: 1800, cost: 1800000, efficiency: 5.9 },
          { route: 'Kodinar → Mumbai', volume: 3200, cost: 2100000, efficiency: 6.8 },
          { route: 'Sundargarh → Kolkata', volume: 1600, cost: 1900000, efficiency: 5.4 },
          { route: 'Raipur → Nagpur', volume: 2100, cost: 1400000, efficiency: 6.1 }
        ],
        vehicleUtilization: [
          { type: 'Heavy Commercial', count: 45, utilization: 87, avgCost: 42000 },
          { type: 'Multi-Axle Heavy', count: 28, utilization: 92, avgCost: 55000 },
          { type: 'Railway Transport', count: 12, utilization: 78, avgCost: 15000 },
          { type: 'Premium Heavy', count: 15, utilization: 85, avgCost: 75000 }
        ],
        monthlyTrends: [
          { month: 'Jan', cost: 14200000, volume: 1180, efficiency: 5.6 },
          { month: 'Feb', cost: 13800000, volume: 1220, efficiency: 5.7 },
          { month: 'Mar', cost: 15100000, volume: 1350, efficiency: 5.9 },
          { month: 'Apr', cost: 14600000, volume: 1280, efficiency: 5.8 },
          { month: 'May', cost: 15420000, volume: 1247, efficiency: 5.8 },
          { month: 'Jun', cost: 16200000, volume: 1420, efficiency: 6.0 }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, format = 'number' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 sm:p-6 rounded-xl ${
        isPremium
          ? 'glass-card'
          : 'bg-white shadow-sm border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isPremium ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${
            isPremium ? 'text-white' : 'text-gray-900'
          }`}>
            {format === 'currency' ? formatCurrency(value) : 
             format === 'percentage' ? `${value}%` :
             format === 'decimal' ? `${value} km/l` :
             value.toLocaleString()}
          </p>
          <div className="flex items-center mt-2">
            {change > 0 ? (
              <TrendingUp className="text-green-500" size={16} />
            ) : (
              <TrendingDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm ml-1 ${
              change > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(change)}%
            </span>
            <span className={`text-sm ml-1 ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              vs last period
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${
          isPremium
            ? 'bg-premium-neon/20'
            : 'bg-blue-50'
        }`}>
          <Icon className={isPremium ? 'text-premium-neon' : 'text-blue-600'} size={24} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-t-transparent rounded-full border-current"
        />
        <span className={`ml-3 ${isPremium ? 'text-white' : 'text-gray-900'}`}>
          Loading analytics...
        </span>
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
            Analytics Dashboard
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Performance insights and optimization metrics
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              isPremium
                ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
            }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total Cost"
          value={analyticsData.overview.totalCost}
          change={analyticsData.overview.costChange}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Total Shipments"
          value={analyticsData.overview.totalShipments}
          change={analyticsData.overview.shipmentsChange}
          icon={Truck}
        />
        <MetricCard
          title="Avg Efficiency"
          value={analyticsData.overview.avgEfficiency}
          change={analyticsData.overview.efficiencyChange}
          icon={Target}
          format="decimal"
        />
        <MetricCard
          title="Carbon Emissions (T)"
          value={analyticsData.overview.carbonEmissions}
          change={analyticsData.overview.emissionsChange}
          icon={Activity}
        />
      </div>

      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${
          isPremium
            ? 'glass-card'
            : 'bg-white shadow-sm border border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-6 ${
          isPremium ? 'text-white' : 'text-gray-900'
        }`}>
          Cost Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
              isPremium ? 'bg-premium-gold/20' : 'bg-blue-50'
            }`}>
              <Factory className={isPremium ? 'text-premium-gold' : 'text-blue-600'} size={24} />
            </div>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Production
            </p>
            <p className={`text-xl font-bold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {formatCurrency(analyticsData.costBreakdown.production)}
            </p>
            <p className={`text-sm ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              60% of total
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
              isPremium ? 'bg-premium-neon/20' : 'bg-green-50'
            }`}>
              <Truck className={isPremium ? 'text-premium-neon' : 'text-green-600'} size={24} />
            </div>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Transportation
            </p>
            <p className={`text-xl font-bold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {formatCurrency(analyticsData.costBreakdown.transportation)}
            </p>
            <p className={`text-sm ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              28% of total
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
              isPremium ? 'bg-purple-500/20' : 'bg-purple-50'
            }`}>
              <BarChart3 className={isPremium ? 'text-purple-400' : 'text-purple-600'} size={24} />
            </div>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Inventory
            </p>
            <p className={`text-xl font-bold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {formatCurrency(analyticsData.costBreakdown.inventory)}
            </p>
            <p className={`text-sm ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              12% of total
            </p>
          </div>
        </div>
      </motion.div>

      {/* Route Performance & Vehicle Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'glass-card'
              : 'bg-white shadow-sm border border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-6 ${
            isPremium ? 'text-white' : 'text-gray-900'
          }`}>
            Top Routes Performance
          </h3>
          
          <div className="space-y-4">
            {analyticsData.routePerformance.map((route, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className={isPremium ? 'text-premium-neon' : 'text-blue-600'} />
                    <p className={`font-medium ${
                      isPremium ? 'text-white' : 'text-gray-900'
                    }`}>
                      {route.route}
                    </p>
                  </div>
                  <p className={`text-sm ${
                    isPremium ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {route.volume}T • {route.efficiency} km/l
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    isPremium ? 'text-premium-gold' : 'text-green-600'
                  }`}>
                    {formatCurrency(route.cost)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vehicle Utilization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${
            isPremium
              ? 'glass-card'
              : 'bg-white shadow-sm border border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-semibold mb-6 ${
            isPremium ? 'text-white' : 'text-gray-900'
          }`}>
            Vehicle Utilization
          </h3>
          
          <div className="space-y-4">
            {analyticsData.vehicleUtilization.map((vehicle, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-medium ${
                    isPremium ? 'text-white' : 'text-gray-900'
                  }`}>
                    {vehicle.type}
                  </p>
                  <span className={`text-sm ${
                    isPremium ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {vehicle.utilization}%
                  </span>
                </div>
                <div className={`w-full bg-gray-200 rounded-full h-2 ${
                  isPremium ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-2 rounded-full ${
                      vehicle.utilization >= 90
                        ? 'bg-green-500'
                        : vehicle.utilization >= 80
                          ? isPremium ? 'bg-premium-neon' : 'bg-blue-500'
                          : 'bg-yellow-500'
                    }`}
                    style={{ width: `${vehicle.utilization}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  isPremium ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {vehicle.count} vehicles • Avg cost: {formatCurrency(vehicle.avgCost)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;