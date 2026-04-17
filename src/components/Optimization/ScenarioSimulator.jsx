import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Zap,
  Factory,
  Truck,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ScenarioSimulator = ({ optimizationResult, data, onRunScenario }) => {
  const [scenarios, setScenarios] = useState({
    demandChange: 0,
    capacityChange: 0,
    productionCostChange: 0,
    transportCostChange: 0
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);

  const baseMetrics = useMemo(() => {
    if (!optimizationResult) return null;
    return {
      totalCost: optimizationResult.summary.totalCost,
      fulfillmentRate: optimizationResult.summary.fulfillmentRate,
      totalDemand: optimizationResult.summary.totalDemand,
      violations: optimizationResult.violations.length,
      productionCost: optimizationResult.summary.productionCost,
      transportCost: optimizationResult.summary.transportationCost
    };
  }, [optimizationResult]);

  const projectedMetrics = useMemo(() => {
    if (!baseMetrics) return null;

    // Simple projection model
    const demandMultiplier = 1 + (scenarios.demandChange / 100);
    const capacityMultiplier = 1 + (scenarios.capacityChange / 100);
    const prodCostMultiplier = 1 + (scenarios.productionCostChange / 100);
    const transCostMultiplier = 1 + (scenarios.transportCostChange / 100);

    const newDemand = baseMetrics.totalDemand * demandMultiplier;
    const effectiveCapacity = baseMetrics.totalDemand * (baseMetrics.fulfillmentRate / 100) * capacityMultiplier;
    
    // Calculate new fulfillment rate
    let newFulfillmentRate = (effectiveCapacity / newDemand) * 100;
    newFulfillmentRate = Math.min(100, Math.max(0, newFulfillmentRate));

    // Calculate new costs
    const newProductionCost = baseMetrics.productionCost * prodCostMultiplier * (capacityMultiplier > 1 ? capacityMultiplier : 1);
    const newTransportCost = baseMetrics.transportCost * transCostMultiplier * demandMultiplier;
    const newTotalCost = newProductionCost + newTransportCost;

    // Estimate violations change
    let violationChange = 0;
    if (scenarios.demandChange > 0 && scenarios.capacityChange <= 0) violationChange += Math.ceil(scenarios.demandChange / 5);
    if (scenarios.capacityChange > 0) violationChange -= Math.ceil(scenarios.capacityChange / 10);

    return {
      totalCost: newTotalCost,
      fulfillmentRate: newFulfillmentRate,
      totalDemand: newDemand,
      violations: Math.max(0, baseMetrics.violations + violationChange),
      productionCost: newProductionCost,
      transportCost: newTransportCost,
      costChange: ((newTotalCost - baseMetrics.totalCost) / baseMetrics.totalCost) * 100,
      fulfillmentChange: newFulfillmentRate - baseMetrics.fulfillmentRate
    };
  }, [baseMetrics, scenarios]);

  const handleSliderChange = (key, value) => {
    setScenarios(prev => ({ ...prev, [key]: value }));
  };

  const resetScenarios = () => {
    setScenarios({
      demandChange: 0,
      capacityChange: 0,
      productionCostChange: 0,
      transportCostChange: 0
    });
    setScenarioResult(null);
  };

  const runScenario = async () => {
    setIsSimulating(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScenarioResult(projectedMetrics);
    setIsSimulating(false);
  };

  const SliderControl = ({ label, icon: Icon, value, onChange, min = -50, max = 50, color }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className={`h-4 w-4 mr-2 ${color}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <span className={`text-sm font-bold ${
          value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {value > 0 ? '+' : ''}{value}%
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}%</span>
        <span>0%</span>
        <span>+{max}%</span>
      </div>
    </div>
  );

  const MetricComparison = ({ label, base, projected, format = 'number', icon: Icon }) => {
    const change = projected - base;
    const changePercent = base !== 0 ? (change / base) * 100 : 0;
    const isPositive = format === 'fulfillment' ? change > 0 : change < 0;

    const formatValue = (val) => {
      if (format === 'currency') return `₹${(val / 100000).toFixed(2)}L`;
      if (format === 'percent') return `${val.toFixed(1)}%`;
      if (format === 'fulfillment') return `${val.toFixed(1)}%`;
      return val.toLocaleString();
    };

    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Icon className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Current</p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {formatValue(base)}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
          <div className="text-right">
            <p className="text-xs text-gray-400">Projected</p>
            <p className={`text-lg font-bold ${
              isPositive ? 'text-green-600' : change === 0 ? 'text-gray-600' : 'text-red-600'
            }`}>
              {formatValue(projected)}
            </p>
          </div>
        </div>
        {change !== 0 && (
          <div className={`mt-2 flex items-center justify-end text-xs ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
          </div>
        )}
      </div>
    );
  };

  if (!optimizationResult) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
        <Sliders className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">
          Run optimization first to use the scenario simulator
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3">
            <Sliders className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              What-If Scenario Simulator
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adjust parameters to see projected impact
            </p>
          </div>
        </div>
        <button
          onClick={resetScenarios}
          className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <SliderControl
            label="Demand Change"
            icon={Package}
            value={scenarios.demandChange}
            onChange={(v) => handleSliderChange('demandChange', v)}
            color="text-purple-500"
          />
          <SliderControl
            label="Capacity Change"
            icon={Factory}
            value={scenarios.capacityChange}
            onChange={(v) => handleSliderChange('capacityChange', v)}
            color="text-blue-500"
          />
          <SliderControl
            label="Production Cost Change"
            icon={DollarSign}
            value={scenarios.productionCostChange}
            onChange={(v) => handleSliderChange('productionCostChange', v)}
            color="text-green-500"
          />
          <SliderControl
            label="Transport Cost Change"
            icon={Truck}
            value={scenarios.transportCostChange}
            onChange={(v) => handleSliderChange('transportCostChange', v)}
            color="text-orange-500"
          />

          <button
            onClick={runScenario}
            disabled={isSimulating}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            {isSimulating ? (
              <>
                <Zap className="h-5 w-5 mr-2 animate-pulse" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Run Scenario Analysis
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Projected Impact
          </h4>

          {projectedMetrics && (
            <div className="grid grid-cols-2 gap-3">
              <MetricComparison
                label="Total Cost"
                base={baseMetrics.totalCost}
                projected={projectedMetrics.totalCost}
                format="currency"
                icon={DollarSign}
              />
              <MetricComparison
                label="Fulfillment"
                base={baseMetrics.fulfillmentRate}
                projected={projectedMetrics.fulfillmentRate}
                format="fulfillment"
                icon={CheckCircle}
              />
              <MetricComparison
                label="Demand"
                base={baseMetrics.totalDemand}
                projected={projectedMetrics.totalDemand}
                format="number"
                icon={Package}
              />
              <MetricComparison
                label="Violations"
                base={baseMetrics.violations}
                projected={projectedMetrics.violations}
                format="number"
                icon={AlertTriangle}
              />
            </div>
          )}

          {/* Scenario Summary */}
          <AnimatePresence>
            {scenarioResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border ${
                  scenarioResult.costChange < 0 && scenarioResult.fulfillmentChange >= 0
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : scenarioResult.costChange > 10 || scenarioResult.fulfillmentChange < -5
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                }`}
              >
                <div className="flex items-start">
                  {scenarioResult.costChange < 0 && scenarioResult.fulfillmentChange >= 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      Scenario Analysis Complete
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {scenarioResult.costChange < 0 && scenarioResult.fulfillmentChange >= 0
                        ? `This scenario could save ₹${Math.abs(scenarioResult.costChange * baseMetrics.totalCost / 10000000).toFixed(2)}L while maintaining fulfillment.`
                        : scenarioResult.fulfillmentChange < -5
                        ? `Warning: Fulfillment would drop by ${Math.abs(scenarioResult.fulfillmentChange).toFixed(1)}%. Consider increasing capacity.`
                        : `Cost would ${scenarioResult.costChange > 0 ? 'increase' : 'decrease'} by ${Math.abs(scenarioResult.costChange).toFixed(1)}%.`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;
