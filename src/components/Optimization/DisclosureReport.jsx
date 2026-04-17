import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Download,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Package
} from 'lucide-react';

const DisclosureReport = ({ disclosureData, costMode = 'per_unit', calculatedCosts }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    demandFulfillment: false,
    production: false,
    transportation: false
  });

  // Return early if no data
  if (!disclosureData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No disclosure data available. Please run optimization first.
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Safe getters
  const getValue = (val, defaultVal = 0) => {
    if (val === undefined || val === null || isNaN(val)) return defaultVal;
    return val;
  };

  const getArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr;
  };
  
  // Use calculated costs based on cost mode
  const productionCost = calculatedCosts?.productionCost ?? getValue(disclosureData.productionCost);
  const transportationCost = calculatedCosts?.transportationCost ?? getValue(disclosureData.transportationCost);
  const inventoryCost = calculatedCosts?.inventoryCost ?? getValue(disclosureData.inventoryCost);
  const penaltyCost = calculatedCosts?.penaltyCost ?? getValue(disclosureData.penaltyCost);
  const totalCost = productionCost + transportationCost + inventoryCost + penaltyCost;

  const exportToCSV = () => {
    try {
      let csv = 'Clinker Optimization Disclosure Report\n\n';
      csv += `Total Cost,${getValue(disclosureData.totalCost)}\n`;
      csv += `Fulfillment Rate,${getValue(disclosureData.fulfillmentRate).toFixed(2)}%\n`;
      csv += `Total Demand,${getValue(disclosureData.totalDemand)}\n`;
      csv += `Total Fulfilled,${getValue(disclosureData.totalFulfilled)}\n\n`;

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `disclosure_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const demandData = getArray(disclosureData.demandFulfillment);
  const productionData = getArray(disclosureData.productionDetails);
  const transportData = getArray(disclosureData.transportationDetails);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Disclosure Report
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
            Optimization solution details
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              costMode === 'per_unit' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {costMode === 'per_unit' ? 'Per Unit Mode' : 'Batch Mode'}
            </span>
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Feasibility Status */}
      <div className={`p-6 rounded-xl ${
        disclosureData.feasibility
          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500'
      }`}>
        <div className="flex items-center space-x-4">
          {disclosureData.feasibility ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <XCircle className="w-8 h-8 text-yellow-600" />
          )}
          <div>
            <h3 className={`text-xl font-bold ${
              disclosureData.feasibility ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'
            }`}>
              {disclosureData.feasibility ? 'FEASIBLE SOLUTION' : 'SOLUTION WITH SOFT VIOLATIONS'}
            </h3>
            <p className={`text-sm ${
              disclosureData.feasibility ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {disclosureData.feasibility 
                ? 'All constraints satisfied.'
                : `${getValue(disclosureData.constraintViolations)} soft constraint violations.`}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Summary</h3>
          {expandedSections.summary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSections.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ₹{totalCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Fulfillment</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {getValue(disclosureData.fulfillmentRate).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Demand</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {getValue(disclosureData.totalDemand).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Fulfilled</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {getValue(disclosureData.totalFulfilled).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Demand Fulfillment Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleSection('demandFulfillment')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Demand Fulfillment ({demandData.length})
          </h3>
          {expandedSections.demandFulfillment ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSections.demandFulfillment && (
          <div className="mt-4 overflow-x-auto">
            {demandData.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3">Plant</th>
                    <th className="text-left py-2 px-3">Period</th>
                    <th className="text-right py-2 px-3">Demand</th>
                    <th className="text-right py-2 px-3">Fulfilled</th>
                    <th className="text-right py-2 px-3">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {demandData.slice(0, 50).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3">{item.iuguCode || item.plant || '-'}</td>
                      <td className="py-2 px-3">T{item.period}</td>
                      <td className="py-2 px-3 text-right">{getValue(item.demand).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">{getValue(item.fulfilled).toLocaleString()}</td>
                      <td className={`py-2 px-3 text-right ${
                        getValue(item.fulfillmentRate) >= 80 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getValue(item.fulfillmentRate).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No data</p>
            )}
          </div>
        )}
      </div>

      {/* Production Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleSection('production')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Production ({productionData.length})
          </h3>
          {expandedSections.production ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSections.production && (
          <div className="mt-4 overflow-x-auto">
            {productionData.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3">Plant</th>
                    <th className="text-left py-2 px-3">Period</th>
                    <th className="text-right py-2 px-3">Capacity</th>
                    <th className="text-right py-2 px-3">Produced</th>
                    <th className="text-right py-2 px-3">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {productionData.slice(0, 50).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3">{item.iuCode || item.plant || '-'}</td>
                      <td className="py-2 px-3">T{item.period}</td>
                      <td className="py-2 px-3 text-right">{getValue(item.capacity).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">{getValue(item.quantity || item.produced).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">₹{getValue(item.cost || item.totalCost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No data</p>
            )}
          </div>
        )}
      </div>

      {/* Transportation Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toggleSection('transportation')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transportation ({transportData.length})
          </h3>
          {expandedSections.transportation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSections.transportation && (
          <div className="mt-4 overflow-x-auto">
            {transportData.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3">From</th>
                    <th className="text-left py-2 px-3">To</th>
                    <th className="text-left py-2 px-3">Mode</th>
                    <th className="text-left py-2 px-3">Period</th>
                    <th className="text-right py-2 px-3">Qty</th>
                    <th className="text-right py-2 px-3">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {transportData.slice(0, 50).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3">{item.fromIU || item.fromPlant || '-'}</td>
                      <td className="py-2 px-3">{item.toIugu || item.toPlant || '-'}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          (item.transport || item.transportMode) === 'T1' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.transport || item.transportMode || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-3">T{item.period}</td>
                      <td className="py-2 px-3 text-right">{getValue(item.quantity).toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">₹{getValue(item.cost || item.totalCost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No data</p>
            )}
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600">Production</p>
            <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
              ₹{productionCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600">Transportation</p>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">
              ₹{transportationCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-600">Inventory</p>
            <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
              ₹{inventoryCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-600">Penalty</p>
            <p className="text-xl font-bold text-red-800 dark:text-red-200">
              ₹{penaltyCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclosureReport;
