import { useState } from 'react';

/**
 * CalculationBreakdown Component
 * 
 * Displays a detailed step-by-step breakdown of how the optimization
 * model calculates costs and makes decisions.
 */
const CalculationBreakdown = ({ optimizationResult }) => {
  const [expandedSections, setExpandedSections] = useState({
    production: true,
    transportation: false,
    inventory: false,
    penalty: false,
    summary: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!optimizationResult || !optimizationResult.solution) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Step-by-Step Calculation Breakdown
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Run the optimization to see detailed calculations.
        </p>
      </div>
    );
  }

  const { solution, summary } = optimizationResult;
  const costBreakdown = solution.costBreakdown || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📊 Step-by-Step Calculation Breakdown
      </h2>

      {/* Model Overview */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          🎯 Optimization Model Overview
        </h3>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <p><strong>Objective:</strong> Minimize total cost while maximizing demand fulfillment</p>
          <p><strong>Formula:</strong> Total Cost = Production Cost + Transportation Cost + Inventory Cost + Penalty Cost</p>
          <p><strong>Strategy:</strong> Use existing inventory first, then produce from cheapest sources</p>
        </div>
      </div>

      {/* 1. Production Cost Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('production')}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            1️⃣ Production Cost Calculation (Variable Cost Model)
          </span>
          <span className="text-2xl">{expandedSections.production ? '−' : '+'}</span>
        </button>
        
        {expandedSections.production && (
          <div className="p-4 space-y-4">
            {/* Explanation */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                📝 How Production Cost Works:
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                <li>Production cost is <strong>VARIABLE</strong> based on quantity produced</li>
                <li>Cost per unit = Cost per Period ÷ Capacity</li>
                <li>Total Cost = Cost per Unit × Quantity Produced</li>
                <li>Example: Cost=2229, Capacity=379812 → Cost/Unit = ₹0.00587</li>
              </ul>
            </div>

            {/* Formula */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 font-mono text-sm">
              <p className="text-gray-800 dark:text-gray-200">
                Production Cost = (Cost per Period / Capacity) × Quantity
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Example: IU_003: (2229 / 379812) × 379812 = ₹2229.00
              </p>
            </div>

            {/* Production Details Table */}
            {costBreakdown.productionDetails && costBreakdown.productionDetails.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Plant</th>
                      <th className="px-3 py-2 text-left">Period</th>
                      <th className="px-3 py-2 text-right">Capacity</th>
                      <th className="px-3 py-2 text-right">Quantity</th>
                      <th className="px-3 py-2 text-right">Cost/Period</th>
                      <th className="px-3 py-2 text-right">Cost/Unit</th>
                      <th className="px-3 py-2 text-right">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {costBreakdown.productionDetails.slice(0, 10).map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-2 font-medium">{detail.plant}</td>
                        <td className="px-3 py-2">T{detail.period}</td>
                        <td className="px-3 py-2 text-right">{detail.capacity?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{detail.quantity?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">₹{detail.costPerPeriod?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">₹{detail.costPerUnit?.toFixed(6)}</td>
                        <td className="px-3 py-2 text-right">₹{detail.totalCost?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {costBreakdown.productionDetails.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing 10 of {costBreakdown.productionDetails.length} entries...
                  </p>
                )}
              </div>
            )}

            {/* Production Summary */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
              <p className="font-semibold text-green-800 dark:text-green-200">
                Total Production Cost: ₹{summary?.productionCost?.toLocaleString()}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Total Quantity Produced: {costBreakdown.totalProductionQuantity?.toLocaleString()} units
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Average Cost per Unit: ₹{costBreakdown.avgCostPerUnit?.toFixed(2) || (summary?.productionCost / costBreakdown.totalProductionQuantity)?.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Transportation Cost Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('transportation')}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            2️⃣ Transportation Cost Calculation (Per Batch Model)
          </span>
          <span className="text-2xl">{expandedSections.transportation ? '−' : '+'}</span>
        </button>
        
        {expandedSections.transportation && (
          <div className="p-4 space-y-4">
            {/* Explanation */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                📝 How Transportation Cost Works:
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                <li>Transportation cost is calculated <strong>per batch</strong></li>
                <li>T2 transport: Batch size = 3000 units</li>
                <li>Number of batches = Quantity ÷ Batch Size (rounded up)</li>
                <li>Total Freight = Freight per Batch × Number of Batches</li>
                <li>Per unit cost = Total Freight ÷ Quantity</li>
              </ul>
            </div>

            {/* Formula */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 font-mono text-sm">
              <p className="text-gray-800 dark:text-gray-200">
                Transportation Cost = Freight per Batch × Number of Batches
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Example: 30,000 units via T2 (batch=3000)
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Batches = 30,000 ÷ 3,000 = 10 batches
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                If freight/batch = ₹1,430.16 → Total = 10 × ₹1,430.16 = ₹14,301.60
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Per unit = ₹14,301.60 ÷ 30,000 = ₹0.477
              </p>
            </div>

            {/* Transportation Details Table */}
            {costBreakdown.transportDetails && costBreakdown.transportDetails.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Route</th>
                      <th className="px-3 py-2 text-left">Mode</th>
                      <th className="px-3 py-2 text-right">Quantity</th>
                      <th className="px-3 py-2 text-right">Batch Size</th>
                      <th className="px-3 py-2 text-right">Batches</th>
                      <th className="px-3 py-2 text-right">₹/Batch</th>
                      <th className="px-3 py-2 text-right">Total ₹</th>
                      <th className="px-3 py-2 text-right">₹/Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {costBreakdown.transportDetails.slice(0, 10).map((detail, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-3 py-2 font-medium">{detail.fromIU} → {detail.toIugu}</td>
                        <td className="px-3 py-2">{detail.transport}</td>
                        <td className="px-3 py-2 text-right">{detail.quantity?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{detail.batchSize?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{detail.numBatches}</td>
                        <td className="px-3 py-2 text-right">₹{detail.freightCostPerBatch?.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{detail.totalFreightCost?.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{detail.freightCostPerUnit?.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {costBreakdown.transportDetails.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing 10 of {costBreakdown.transportDetails.length} entries...
                  </p>
                )}
              </div>
            )}

            {/* Transportation Summary */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
              <p className="font-semibold text-green-800 dark:text-green-200">
                Total Transportation Cost: ₹{summary?.transportationCost?.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Inventory Cost Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('inventory')}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            3️⃣ Inventory Holding Cost Calculation
          </span>
          <span className="text-2xl">{expandedSections.inventory ? '−' : '+'}</span>
        </button>
        
        {expandedSections.inventory && (
          <div className="p-4 space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                📝 How Inventory Cost Works:
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Inventory Cost = Stock Level × ₹0.01 per unit per period
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
              <p className="font-semibold text-green-800 dark:text-green-200">
                Total Inventory Cost: ₹{summary?.inventoryCost?.toLocaleString()}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Total Inventory Units: {costBreakdown.totalInventoryUnits?.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Penalty Cost Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('penalty')}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            4️⃣ Penalty Cost Calculation
          </span>
          <span className="text-2xl">{expandedSections.penalty ? '−' : '+'}</span>
        </button>
        
        {expandedSections.penalty && (
          <div className="p-4 space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                📝 Penalty Rates:
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                <li>Min Fulfillment Shortfall: ₹10 per unit</li>
                <li>Min Closing Stock Shortfall: ₹1 per unit</li>
                <li>Transport Upper Bound Excess: ₹0.5 per unit</li>
              </ul>
            </div>

            {costBreakdown.penaltyBreakdown && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Violation Type</th>
                      <th className="px-3 py-2 text-right">Count</th>
                      <th className="px-3 py-2 text-right">Units</th>
                      <th className="px-3 py-2 text-right">Cost (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    <tr>
                      <td className="px-3 py-2">Min Fulfillment Shortfall</td>
                      <td className="px-3 py-2 text-right">{costBreakdown.penaltyBreakdown.minFulfillment?.count}</td>
                      <td className="px-3 py-2 text-right">{costBreakdown.penaltyBreakdown.minFulfillment?.units?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">₹{costBreakdown.penaltyBreakdown.minFulfillment?.cost?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Min Closing Stock Shortfall</td>
                      <td className="px-3 py-2 text-right">{costBreakdown.penaltyBreakdown.minClosingStock?.count}</td>
                      <td className="px-3 py-2 text-right">{costBreakdown.penaltyBreakdown.minClosingStock?.units?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">₹{costBreakdown.penaltyBreakdown.minClosingStock?.cost?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Transport Upper Bound Excess</td>
                      <td className="px-3 py-2 text-right">{costBreakdown.penaltyBreakdown.transportUpperBound?.count}</td>
                      <td className="px-3 py-2 text-right">{costBreakdown.penaltyBreakdown.transportUpperBound?.units?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">₹{costBreakdown.penaltyBreakdown.transportUpperBound?.cost?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="bg-red-50 dark:bg-red-900/20 rounded p-3">
              <p className="font-semibold text-red-800 dark:text-red-200">
                Total Penalty Cost: ₹{summary?.penaltyCost?.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. Total Cost Summary */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
        >
          <span className="font-semibold text-gray-900 dark:text-white">
            5️⃣ Total Cost Summary
          </span>
          <span className="text-2xl">{expandedSections.summary ? '−' : '+'}</span>
        </button>
        
        {expandedSections.summary && (
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 font-mono text-sm">
              <p className="text-gray-800 dark:text-gray-200 font-bold">
                Total Cost = Production + Transportation + Inventory + Penalty
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Cost Component</th>
                    <th className="px-3 py-2 text-right">Amount (₹)</th>
                    <th className="px-3 py-2 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  <tr>
                    <td className="px-3 py-2">Production Cost</td>
                    <td className="px-3 py-2 text-right">₹{summary?.productionCost?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{((summary?.productionCost / summary?.totalCost) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Transportation Cost</td>
                    <td className="px-3 py-2 text-right">₹{summary?.transportationCost?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{((summary?.transportationCost / summary?.totalCost) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Inventory Cost</td>
                    <td className="px-3 py-2 text-right">₹{summary?.inventoryCost?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{((summary?.inventoryCost / summary?.totalCost) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Penalty Cost</td>
                    <td className="px-3 py-2 text-right">₹{summary?.penaltyCost?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{((summary?.penaltyCost / summary?.totalCost) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold">
                    <td className="px-3 py-2">TOTAL COST</td>
                    <td className="px-3 py-2 text-right">₹{summary?.totalCost?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">100.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Cost (Lakhs)</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  ₹{(summary?.totalCost / 100000).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 text-center">
                <p className="text-sm text-green-600 dark:text-green-400">Total Cost (Crores)</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  ₹{(summary?.totalCost / 10000000).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
          📈 Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-purple-600 dark:text-purple-400">Fulfillment Rate</p>
            <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
              {summary?.fulfillmentRate?.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-600 dark:text-purple-400">Constraint Violations</p>
            <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
              {summary?.constraintViolations}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-600 dark:text-purple-400">Total Demand</p>
            <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
              {solution?.metrics?.totalDemand?.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-600 dark:text-purple-400">Total Fulfilled</p>
            <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
              {solution?.metrics?.totalDemandFulfilled?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationBreakdown;
