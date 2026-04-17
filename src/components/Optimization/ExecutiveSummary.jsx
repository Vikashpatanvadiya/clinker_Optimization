import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Award,
  Target,
  Zap,
  DollarSign,
  Package
} from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const ExecutiveSummary = ({ optimizationResult, data, costMode = 'per_unit', calculatedCosts }) => {
  if (!optimizationResult) return null;

  const { summary, violations, production, fulfillment } = optimizationResult;
  
  // Use calculated costs based on cost mode, fallback to original summary costs
  const productionCost = calculatedCosts?.productionCost ?? summary.productionCost;
  const transportationCost = calculatedCosts?.transportationCost ?? summary.transportationCost;
  const inventoryCost = calculatedCosts?.inventoryCost ?? summary.inventoryCost ?? 0;
  const penaltyCost = calculatedCosts?.penaltyCost ?? summary.penaltyCost ?? 0;
  const totalCost = productionCost + transportationCost + inventoryCost + penaltyCost;

  // Calculate insights
  const insights = [];
  
  // Fulfillment insight
  if (summary.fulfillmentRate >= 90) {
    insights.push({
      type: 'success',
      icon: Award,
      title: 'Excellent Fulfillment',
      message: `Achieving ${summary.fulfillmentRate.toFixed(1)}% demand fulfillment.`
    });
  } else if (summary.fulfillmentRate >= 70) {
    insights.push({
      type: 'warning',
      icon: Target,
      title: 'Good Fulfillment',
      message: `${summary.fulfillmentRate.toFixed(1)}% fulfillment achieved.`
    });
  } else {
    insights.push({
      type: 'danger',
      icon: AlertTriangle,
      title: 'Low Fulfillment',
      message: `Only ${summary.fulfillmentRate.toFixed(1)}% demand fulfilled.`
    });
  }

  // Cost efficiency insight
  const avgCostPerUnit = totalCost / (summary.totalFulfilled || 1);
  insights.push({
    type: 'info',
    icon: Zap,
    title: 'Cost Efficiency',
    message: `Average cost: ₹${avgCostPerUnit.toFixed(4)}/unit. Production: ${((productionCost / totalCost) * 100).toFixed(0)}%, Transport: ${((transportationCost / totalCost) * 100).toFixed(0)}%`
  });

  // Violation insight
  if (violations.length === 0) {
    insights.push({
      type: 'success',
      icon: CheckCircle,
      title: 'All Constraints Met',
      message: 'No constraint violations.'
    });
  } else {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      title: `${violations.length} Soft Violations`,
      message: 'Some soft constraints could not be satisfied.'
    });
  }

  // Top producing plant
  const plantProduction = production.reduce((acc, p) => {
    acc[p.iuCode] = (acc[p.iuCode] || 0) + p.quantity;
    return acc;
  }, {});
  const topPlant = Object.entries(plantProduction).sort((a, b) => b[1] - a[1])[0];
  if (topPlant) {
    insights.push({
      type: 'info',
      icon: Lightbulb,
      title: 'Top Producer',
      message: `${topPlant[0]} leads with ${(topPlant[1]/1000).toFixed(0)}K units.`
    });
  }

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Optimization Results</h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
              costMode === 'per_unit' ? 'bg-blue-400/30' : 'bg-purple-400/30'
            }`}>
              {costMode === 'per_unit' ? <DollarSign className="h-3 w-3" /> : <Package className="h-3 w-3" />}
              {costMode === 'per_unit' ? 'Per Unit' : 'Batch'}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">
              ₹<AnimatedCounter value={totalCost / 100000} decimals={2} />L
            </p>
            <p className="text-blue-100 text-sm">Total Cost</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              <AnimatedCounter value={summary.fulfillmentRate} decimals={1} />%
            </p>
            <p className="text-blue-100 text-sm">Fulfillment</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              <AnimatedCounter value={summary.totalDemand / 1000000} decimals={1} />M
            </p>
            <p className="text-blue-100 text-sm">Total Demand</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              <AnimatedCounter value={violations.length} />
            </p>
            <p className="text-blue-100 text-sm">Violations</p>
          </div>
        </div>

        {/* Progress bar for fulfillment */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Demand Fulfillment</span>
            <span>{(summary.totalFulfilled/1000000)?.toFixed(2) || 0}M / {(summary.totalDemand/1000000).toFixed(2)}M</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${summary.fulfillmentRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white rounded-full h-3"
            />
          </div>
        </div>
      </motion.div>

      {/* Key Insights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Key Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${getTypeStyles(insight.type)}`}
              >
                <div className="flex items-start">
                  <Icon className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${getIconColor(insight.type)}`} />
                  <div>
                    <h4 className="font-semibold">{insight.title}</h4>
                    <p className="text-sm mt-1 opacity-90">{insight.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cost Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cost Distribution
          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
            costMode === 'per_unit' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {costMode === 'per_unit' ? 'Per Unit Mode' : 'Batch Mode'}
          </span>
        </h3>
        
        <div className="space-y-4">
          {[
            { label: 'Production', value: productionCost, color: 'bg-blue-500' },
            { label: 'Transportation', value: transportationCost, color: 'bg-green-500' },
            { label: 'Inventory', value: inventoryCost, color: 'bg-purple-500' },
            { label: 'Penalties', value: penaltyCost, color: 'bg-red-500' }
          ].map((item, index) => {
            const percentage = totalCost > 0 ? (item.value / totalCost) * 100 : 0;
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{item.value.toLocaleString(undefined, {maximumFractionDigits: 2})} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`${item.color} rounded-full h-2`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutiveSummary;
