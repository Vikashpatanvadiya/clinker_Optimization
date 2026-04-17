import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Factory, Truck, Package, ArrowRight } from 'lucide-react';

const FlowDiagram = ({ optimizationResult }) => {
  if (!optimizationResult) return null;

  const flowData = useMemo(() => {
    const { production, transportation, fulfillment } = optimizationResult;

    // Aggregate production by plant
    const plants = production.reduce((acc, p) => {
      if (!acc[p.iuCode]) {
        acc[p.iuCode] = { code: p.iuCode, totalProduction: 0, totalCost: 0 };
      }
      acc[p.iuCode].totalProduction += p.quantity;
      acc[p.iuCode].totalCost += p.cost;
      return acc;
    }, {});

    // Aggregate transportation flows
    const flows = transportation.reduce((acc, t) => {
      const key = `${t.fromIU}-${t.toIugu}`;
      if (!acc[key]) {
        acc[key] = { from: t.fromIU, to: t.toIugu, quantity: 0, cost: 0, transport: t.transport };
      }
      acc[key].quantity += t.quantity;
      acc[key].cost += t.cost;
      return acc;
    }, {});

    // Aggregate demand by destination
    const destinations = fulfillment.reduce((acc, f) => {
      if (!acc[f.iuguCode]) {
        acc[f.iuguCode] = { code: f.iuguCode, totalDemand: 0, totalFulfilled: 0 };
      }
      acc[f.iuguCode].totalDemand += f.demand;
      acc[f.iuguCode].totalFulfilled += f.fulfilled;
      return acc;
    }, {});

    // Get top 5 plants by production
    const topPlants = Object.values(plants)
      .sort((a, b) => b.totalProduction - a.totalProduction)
      .slice(0, 5);

    // Get top 8 flows by quantity
    const topFlows = Object.values(flows)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);

    // Get top 5 destinations by demand
    const topDestinations = Object.values(destinations)
      .sort((a, b) => b.totalDemand - a.totalDemand)
      .slice(0, 5);

    return { topPlants, topFlows, topDestinations };
  }, [optimizationResult]);

  const { topPlants, topFlows, topDestinations } = flowData;

  const maxProduction = Math.max(...topPlants.map(p => p.totalProduction));
  const maxDemand = Math.max(...topDestinations.map(d => d.totalDemand));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Supply Chain Flow Visualization
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Production Plants */}
        <div>
          <div className="flex items-center mb-4">
            <Factory className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Production Plants</h4>
          </div>
          <div className="space-y-3">
            {topPlants.map((plant, index) => (
              <motion.div
                key={plant.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                      {plant.code}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {(plant.totalProduction / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${(plant.totalProduction / maxProduction) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transportation Flows */}
        <div>
          <div className="flex items-center mb-4">
            <Truck className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Top Routes</h4>
          </div>
          <div className="space-y-2">
            {topFlows.map((flow, index) => (
              <motion.div
                key={`${flow.from}-${flow.to}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center text-xs"
              >
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium truncate max-w-[60px]">
                  {flow.from}
                </span>
                <div className="flex-1 flex items-center justify-center px-1">
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                  <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
                </div>
                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded font-medium truncate max-w-[60px]">
                  {flow.to}
                </span>
                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                  flow.transport === 'T1' 
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                }`}>
                  {flow.transport}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demand Destinations */}
        <div>
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-purple-500 mr-2" />
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Demand Centers</h4>
          </div>
          <div className="space-y-3">
            {topDestinations.map((dest, index) => {
              const fulfillmentRate = dest.totalDemand > 0 
                ? (dest.totalFulfilled / dest.totalDemand) * 100 
                : 0;
              return (
                <motion.div
                  key={dest.code}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                        {dest.code}
                      </span>
                      <span className={`text-xs font-medium ${
                        fulfillmentRate >= 90 ? 'text-green-600' :
                        fulfillmentRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {fulfillmentRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 transition-all duration-500 ${
                          fulfillmentRate >= 90 ? 'bg-green-500' :
                          fulfillmentRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${fulfillmentRate}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                      {dest.totalFulfilled.toLocaleString()} / {dest.totalDemand.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span>Production (IU)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
            <span>T1 Transport (Road)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2" />
            <span>T2 Transport (Rail - 3000 unit multiples)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span>High Fulfillment (≥90%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2" />
            <span>Medium (70-90%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span>Low (&lt;70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowDiagram;
