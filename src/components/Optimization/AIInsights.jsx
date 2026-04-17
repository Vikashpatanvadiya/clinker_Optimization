import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  Zap,
  Factory,
  Truck,
  Package,
  DollarSign,
  ArrowRight
} from 'lucide-react';

const AIInsights = ({ optimizationResult, data }) => {
  const insights = useMemo(() => {
    if (!optimizationResult) return [];

    const { summary, violations, production, transportation, fulfillment } = optimizationResult;
    const generatedInsights = [];

    // 1. Capacity Utilization Analysis
    const totalCapacity = data?.ClinkerCapacity?.reduce((sum, c) => sum + (c.CAPACITY || 0), 0) || 0;
    const totalProduction = production.reduce((sum, p) => sum + p.quantity, 0);
    const capacityUtilization = totalCapacity > 0 ? (totalProduction / totalCapacity) * 100 : 0;

    if (capacityUtilization > 95) {
      generatedInsights.push({
        type: 'warning',
        icon: Factory,
        title: 'Near Maximum Capacity',
        message: `Operating at ${capacityUtilization.toFixed(1)}% capacity utilization. Consider capacity expansion for future demand growth.`,
        priority: 1
      });
    } else if (capacityUtilization < 60) {
      generatedInsights.push({
        type: 'info',
        icon: Factory,
        title: 'Underutilized Capacity',
        message: `Only ${capacityUtilization.toFixed(1)}% of total capacity is being used. There's room for additional demand.`,
        priority: 3
      });
    }

    // 2. Bottleneck Detection
    const plantProduction = production.reduce((acc, p) => {
      acc[p.iuCode] = (acc[p.iuCode] || 0) + p.quantity;
      return acc;
    }, {});

    const plantCapacity = data?.ClinkerCapacity?.reduce((acc, c) => {
      acc[c['IU CODE']] = (acc[c['IU CODE']] || 0) + (c.CAPACITY || 0);
      return acc;
    }, {}) || {};

    const bottlenecks = Object.entries(plantProduction)
      .map(([plant, prod]) => ({
        plant,
        production: prod,
        capacity: plantCapacity[plant] || 0,
        utilization: plantCapacity[plant] ? (prod / plantCapacity[plant]) * 100 : 0
      }))
      .filter(p => p.utilization > 90)
      .sort((a, b) => b.utilization - a.utilization);

    if (bottlenecks.length > 0) {
      generatedInsights.push({
        type: 'danger',
        icon: AlertTriangle,
        title: `${bottlenecks.length} Bottleneck Plant${bottlenecks.length > 1 ? 's' : ''} Detected`,
        message: `${bottlenecks[0].plant} is at ${bottlenecks[0].utilization.toFixed(0)}% capacity. This limits overall supply chain throughput.`,
        priority: 1,
        details: bottlenecks.slice(0, 3).map(b => `${b.plant}: ${b.utilization.toFixed(0)}%`)
      });
    }

    // 3. Cost Efficiency Analysis
    const productionCostRatio = summary.totalCost > 0 ? (summary.productionCost / summary.totalCost) * 100 : 0;
    const transportCostRatio = summary.totalCost > 0 ? (summary.transportationCost / summary.totalCost) * 100 : 0;

    if (transportCostRatio > 40) {
      generatedInsights.push({
        type: 'warning',
        icon: Truck,
        title: 'High Transportation Costs',
        message: `Transportation accounts for ${transportCostRatio.toFixed(0)}% of total cost. Consider optimizing routes or using more T2 (rail) transport.`,
        priority: 2
      });
    }

    // 4. Fulfillment Gap Analysis
    const unfulfilled = summary.totalDemand - (summary.totalFulfilled || 0);
    if (unfulfilled > 0) {
      const unfulfilledPercent = (unfulfilled / summary.totalDemand) * 100;
      generatedInsights.push({
        type: unfulfilledPercent > 20 ? 'danger' : 'warning',
        icon: Package,
        title: 'Demand Gap Identified',
        message: `${(unfulfilled / 1000).toFixed(0)}K units (${unfulfilledPercent.toFixed(1)}%) of demand cannot be fulfilled. This is due to capacity constraints.`,
        priority: 1
      });
    }

    // 5. Violation Pattern Analysis
    const violationsByType = violations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {});

    const topViolationType = Object.entries(violationsByType)
      .sort((a, b) => b[1] - a[1])[0];

    if (topViolationType && topViolationType[1] > 5) {
      generatedInsights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `Recurring ${topViolationType[0].replace(/_/g, ' ')} Issues`,
        message: `${topViolationType[1]} violations of this type. Consider relaxing these constraints or adjusting inventory policies.`,
        priority: 2
      });
    }

    // 6. Transport Mode Optimization
    const t1Quantity = transportation.filter(t => t.transport === 'T1').reduce((s, t) => s + t.quantity, 0);
    const t2Quantity = transportation.filter(t => t.transport === 'T2').reduce((s, t) => s + t.quantity, 0);
    const totalTransport = t1Quantity + t2Quantity;

    if (totalTransport > 0 && t1Quantity / totalTransport > 0.7) {
      generatedInsights.push({
        type: 'info',
        icon: Truck,
        title: 'Road Transport Dominant',
        message: `${((t1Quantity / totalTransport) * 100).toFixed(0)}% of transport uses T1 (road). Shifting to T2 (rail) where possible could reduce costs.`,
        priority: 3
      });
    }

    // 7. Period-wise Analysis
    const periodFulfillment = fulfillment.reduce((acc, f) => {
      if (!acc[f.period]) acc[f.period] = { demand: 0, fulfilled: 0 };
      acc[f.period].demand += f.demand;
      acc[f.period].fulfilled += f.fulfilled;
      return acc;
    }, {});

    const worstPeriod = Object.entries(periodFulfillment)
      .map(([period, data]) => ({
        period,
        rate: data.demand > 0 ? (data.fulfilled / data.demand) * 100 : 100
      }))
      .sort((a, b) => a.rate - b.rate)[0];

    if (worstPeriod && worstPeriod.rate < 80) {
      generatedInsights.push({
        type: 'warning',
        icon: Target,
        title: `Period ${worstPeriod.period} Needs Attention`,
        message: `Only ${worstPeriod.rate.toFixed(0)}% fulfillment in this period. Consider building buffer stock in previous periods.`,
        priority: 2
      });
    }

    // 8. Cost per Unit Analysis
    const costPerUnit = summary.totalFulfilled > 0 ? summary.totalCost / summary.totalFulfilled : 0;
    generatedInsights.push({
      type: 'info',
      icon: DollarSign,
      title: 'Unit Economics',
      message: `Average cost per unit: ₹${costPerUnit.toFixed(4)}. Production: ₹${(summary.productionCost / (totalProduction || 1)).toFixed(4)}/unit.`,
      priority: 4
    });

    // 9. Success Insight
    if (summary.fulfillmentRate >= 85 && violations.length < 20) {
      generatedInsights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Strong Optimization Result',
        message: `Achieved ${summary.fulfillmentRate.toFixed(1)}% fulfillment with only ${violations.length} soft constraint violations. This is a well-balanced solution.`,
        priority: 0
      });
    }

    // Sort by priority
    return generatedInsights.sort((a, b) => a.priority - b.priority);
  }, [optimizationResult, data]);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: 'text-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-200',
          icon: 'text-amber-500'
        };
      case 'danger':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-500'
        };
    }
  };

  if (!optimizationResult) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mr-3">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI-Powered Insights
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intelligent analysis of your optimization results
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const styles = getTypeStyles(insight.type);
          const Icon = insight.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${styles.bg} mr-3`}>
                  <Icon className={`h-5 w-5 ${styles.icon}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${styles.text}`}>
                    {insight.title}
                  </h4>
                  <p className={`text-sm mt-1 ${styles.text} opacity-90`}>
                    {insight.message}
                  </p>
                  {insight.details && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {insight.details.map((detail, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Run optimization to generate insights</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
