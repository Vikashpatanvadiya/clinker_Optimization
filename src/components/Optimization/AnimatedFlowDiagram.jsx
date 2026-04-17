import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, Truck, Package, ArrowRight, Zap } from 'lucide-react';

const AnimatedFlowDiagram = ({ optimizationResult }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const flowData = useMemo(() => {
    if (!optimizationResult) return null;

    const { production, transportation, fulfillment } = optimizationResult;

    // Get top plants
    const plants = production.reduce((acc, p) => {
      if (!acc[p.iuCode]) {
        acc[p.iuCode] = { code: p.iuCode, totalProduction: 0, totalCost: 0 };
      }
      acc[p.iuCode].totalProduction += p.quantity;
      acc[p.iuCode].totalCost += p.cost;
      return acc;
    }, {});

    // Get top destinations
    const destinations = fulfillment.reduce((acc, f) => {
      if (!acc[f.iuguCode]) {
        acc[f.iuguCode] = { code: f.iuguCode, totalDemand: 0, totalFulfilled: 0 };
      }
      acc[f.iuguCode].totalDemand += f.demand;
      acc[f.iuguCode].totalFulfilled += f.fulfilled;
      return acc;
    }, {});

    // Get flows
    const flows = transportation.reduce((acc, t) => {
      const key = `${t.fromIU}-${t.toIugu}`;
      if (!acc[key]) {
        acc[key] = { from: t.fromIU, to: t.toIugu, quantity: 0, cost: 0, transport: t.transport };
      }
      acc[key].quantity += t.quantity;
      acc[key].cost += t.cost;
      return acc;
    }, {});

    const topPlants = Object.values(plants)
      .sort((a, b) => b.totalProduction - a.totalProduction)
      .slice(0, 6);

    const topDestinations = Object.values(destinations)
      .sort((a, b) => b.totalDemand - a.totalDemand)
      .slice(0, 6);

    const topFlows = Object.values(flows)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 12);

    return { topPlants, topDestinations, topFlows };
  }, [optimizationResult]);

  if (!flowData) return null;

  const { topPlants, topDestinations, topFlows } = flowData;
  const maxProduction = Math.max(...topPlants.map(p => p.totalProduction));
  const maxDemand = Math.max(...topDestinations.map(d => d.totalDemand));
  const maxFlow = Math.max(...topFlows.map(f => f.quantity));

  // Calculate positions
  const plantPositions = topPlants.map((_, i) => ({
    x: 50,
    y: 80 + i * 70
  }));

  const destPositions = topDestinations.map((_, i) => ({
    x: 550,
    y: 80 + i * 70
  }));

  // Create flow paths
  const flowPaths = topFlows.map(flow => {
    const fromIndex = topPlants.findIndex(p => p.code === flow.from);
    const toIndex = topDestinations.findIndex(d => d.code === flow.to);
    
    if (fromIndex === -1 || toIndex === -1) return null;

    const start = plantPositions[fromIndex];
    const end = destPositions[toIndex];
    
    return {
      ...flow,
      startX: start.x + 100,
      startY: start.y + 20,
      endX: end.x,
      endY: end.y + 20,
      thickness: Math.max(1, (flow.quantity / maxFlow) * 6)
    };
  }).filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mr-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Supply Chain Flow
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time visualization of material movement
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <svg width="100%" height="500" viewBox="0 0 650 500" className="overflow-visible">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700" />
            </pattern>
            
            {/* Gradient for flows */}
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Animated dash pattern */}
            <pattern id="animatedDash" width="20" height="4" patternUnits="userSpaceOnUse">
              <rect width="10" height="4" fill="#3B82F6" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Flow paths */}
          {flowPaths.map((flow, index) => {
            const midX = (flow.startX + flow.endX) / 2;
            const controlY1 = flow.startY;
            const controlY2 = flow.endY;
            const path = `M ${flow.startX} ${flow.startY} C ${midX} ${controlY1}, ${midX} ${controlY2}, ${flow.endX} ${flow.endY}`;
            
            return (
              <g key={`flow-${index}`}>
                {/* Base path */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={flow.transport === 'T1' ? '#8B5CF6' : '#F59E0B'}
                  strokeWidth={flow.thickness}
                  strokeOpacity={0.3}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                />
                
                {/* Animated particles */}
                {[0, 0.33, 0.66].map((offset, i) => (
                  <motion.circle
                    key={`particle-${index}-${i}`}
                    r={flow.thickness / 2 + 1}
                    fill={flow.transport === 'T1' ? '#8B5CF6' : '#F59E0B'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: offset * 2 + index * 0.2
                    }}
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${offset * 2 + index * 0.2}s`}
                      path={path}
                    />
                  </motion.circle>
                ))}
              </g>
            );
          })}

          {/* Production Plants */}
          {topPlants.map((plant, index) => {
            const pos = plantPositions[index];
            const size = 30 + (plant.totalProduction / maxProduction) * 30;
            const isSelected = selectedNode === plant.code;

            return (
              <g
                key={plant.code}
                onClick={() => setSelectedNode(isSelected ? null : plant.code)}
                className="cursor-pointer"
              >
                <motion.rect
                  x={pos.x}
                  y={pos.y}
                  width={100}
                  height={40}
                  rx={8}
                  fill={isSelected ? '#3B82F6' : '#EFF6FF'}
                  stroke="#3B82F6"
                  strokeWidth={isSelected ? 3 : 2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                />
                
                {/* Pulsing indicator for active production */}
                <motion.circle
                  cx={pos.x + 15}
                  cy={pos.y + 20}
                  r={6}
                  fill="#10B981"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
                
                <text
                  x={pos.x + 30}
                  y={pos.y + 18}
                  className="text-xs font-bold fill-blue-800 dark:fill-blue-200"
                >
                  {plant.code}
                </text>
                <text
                  x={pos.x + 30}
                  y={pos.y + 32}
                  className="text-xs fill-blue-600 dark:fill-blue-300"
                >
                  {(plant.totalProduction / 1000).toFixed(0)}K
                </text>
              </g>
            );
          })}

          {/* Destinations */}
          {topDestinations.map((dest, index) => {
            const pos = destPositions[index];
            const fulfillmentRate = dest.totalDemand > 0 
              ? (dest.totalFulfilled / dest.totalDemand) * 100 
              : 0;
            const color = fulfillmentRate >= 90 ? '#10B981' : fulfillmentRate >= 70 ? '#F59E0B' : '#EF4444';
            const isSelected = selectedNode === dest.code;

            return (
              <g
                key={dest.code}
                onClick={() => setSelectedNode(isSelected ? null : dest.code)}
                className="cursor-pointer"
              >
                <motion.rect
                  x={pos.x}
                  y={pos.y}
                  width={100}
                  height={40}
                  rx={8}
                  fill={isSelected ? color : `${color}20`}
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.05 }}
                />
                
                <text
                  x={pos.x + 10}
                  y={pos.y + 18}
                  className="text-xs font-bold"
                  fill={isSelected ? 'white' : color}
                >
                  {dest.code}
                </text>
                <text
                  x={pos.x + 10}
                  y={pos.y + 32}
                  className="text-xs"
                  fill={isSelected ? 'white' : color}
                >
                  {fulfillmentRate.toFixed(0)}% filled
                </text>
              </g>
            );
          })}

          {/* Labels */}
          <text x={50} y={50} className="text-sm font-bold fill-gray-700 dark:fill-gray-300">
            Production Plants (IU)
          </text>
          <text x={550} y={50} className="text-sm font-bold fill-gray-700 dark:fill-gray-300">
            Demand Centers (GU)
          </text>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
            <span className="text-gray-600 dark:text-gray-400">T1 (Road)</span>
          </div>
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
            <div className="w-3 h-3 bg-amber-500 rounded mr-2" />
            <span className="text-gray-600 dark:text-gray-400">T2 (Rail)</span>
          </div>
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full mr-2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-gray-600 dark:text-gray-400">Active Production</span>
          </div>
        </div>
      </div>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              {selectedNode} Details
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              Click on nodes to see detailed information about production or demand.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedFlowDiagram;
