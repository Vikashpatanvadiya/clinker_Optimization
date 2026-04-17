import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Factory, 
  Truck, 
  Package,
  Target,
  DollarSign,
  BarChart3,
  Activity,
  FileText,
  Calculator,
  Sparkles,
  GitBranch,
  Sliders
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { getOptimizationVisualizationData } from '../../utils/optimizationEngine';
import DisclosureReport from './DisclosureReport';
import CalculationBreakdown from '../Reports/CalculationBreakdown';
import ExecutiveSummary from './ExecutiveSummary';
import FlowDiagram from './FlowDiagram';
import ScenarioSimulator from './ScenarioSimulator';

const OptimizationDashboard = ({ data }) => {
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [costMode, setCostMode] = useState('per_unit'); // 'per_unit' or 'batch'

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = getOptimizationVisualizationData(data);
      setOptimizationResult(result);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      runOptimization();
    }
  }, [data]);

  const chartData = useMemo(() => {
    if (!optimizationResult) return null;
    
    // Per Unit Mode (scales with quantity - results in crores):
    //   Production: Cost per Period × Quantity
    //   Transport: Freight per Batch × Number of Batches
    // 
    // Batch Mode (original data costs - results in ~3 lacs):
    //   Production: Cost per Period (fixed, as given in data)
    //   Transport: Freight Cost + Handling Cost (original route cost, NO multiply by batches)
    
    const productionByPeriod = optimizationResult.production.reduce((acc, item) => {
      const existing = acc.find(p => p.period === item.period);
      
      let displayCost;
      if (costMode === 'batch') {
        // Batch mode: Just the original fixed cost per period from data
        displayCost = item.costPerPeriod || 0;
      } else {
        // Per unit mode: Cost per Period × Quantity (scales up)
        displayCost = (item.costPerPeriod || 0) * item.quantity;
      }
      
      if (existing) { 
        existing.quantity += item.quantity; 
        existing.cost += displayCost;
        existing.costPerUnit = existing.quantity > 0 ? existing.cost / existing.quantity : 0;
      }
      else { 
        acc.push({ 
          period: `T${item.period}`, 
          quantity: item.quantity, 
          cost: displayCost,
          costPerUnit: item.quantity > 0 ? displayCost / item.quantity : 0
        }); 
      }
      return acc;
    }, []);
    
    const transportationByPeriod = optimizationResult.transportation.reduce((acc, item) => {
      const existing = acc.find(t => t.period === item.period);
      
      let displayCost;
      if (costMode === 'batch') {
        // Batch mode: Just the original route cost from data (Freight + Handling), NO multiply by batches
        const freightCost = item.freightCostPerBatch || 0; // Original freight cost for the route
        const handlingCost = item.handlingCost || 0;
        displayCost = freightCost + handlingCost;
      } else {
        // Per unit mode: Freight per Batch × Number of Batches (scales up)
        displayCost = (item.freightCostPerBatch || 0) * (item.numBatches || 1);
      }
      
      if (existing) { 
        existing.quantity += item.quantity; 
        existing.cost += displayCost;
      }
      else { 
        acc.push({ 
          period: `T${item.period}`, 
          quantity: item.quantity, 
          cost: displayCost 
        }); 
      }
      return acc;
    }, []);
    
    const fulfillmentByPeriod = optimizationResult.fulfillment.reduce((acc, item) => {
      const existing = acc.find(f => f.period === item.period);
      if (existing) { existing.demand += item.demand; existing.fulfilled += item.fulfilled; }
      else { acc.push({ period: `T${item.period}`, demand: item.demand, fulfilled: item.fulfilled }); }
      return acc;
    }, []);
    
    // Recalculate total costs based on mode
    const totalProductionCost = productionByPeriod.reduce((sum, p) => sum + p.cost, 0);
    const totalTransportCost = transportationByPeriod.reduce((sum, t) => sum + t.cost, 0);
    
    const costBreakdown = [
      { name: 'Production', value: totalProductionCost, color: '#3B82F6' },
      { name: 'Transportation', value: totalTransportCost, color: '#10B981' }
    ];
    return { productionByPeriod, transportationByPeriod, fulfillmentByPeriod, costBreakdown, totalProductionCost, totalTransportCost };
  }, [optimizationResult, costMode]);

  // Fixed Metric Card - no dynamic Tailwind classes
  const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-5 shadow-lg ${colorClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <p className="text-sm font-medium text-white/80 truncate">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 truncate">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ViolationCard = ({ violation }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 truncate">
            {violation.type.replace(/_/g, ' ')}
          </h4>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            {violation.iuguCode || violation.iuCode} - Period {violation.period}
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {violation.shortfall && `Shortfall: ${violation.shortfall.toLocaleString()}`}
            {violation.excess && `Excess: ${violation.excess.toLocaleString()}`}
          </p>
        </div>
      </div>
    </div>
  );

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No data available for optimization</p>
        </div>
      </div>
    );
  }

  // Tabs - removed AI Insights, Live Flow, moved What-If to end
  const tabs = [
    { id: 'summary', name: 'Summary', icon: Sparkles },
    { id: 'overview', name: 'Charts', icon: BarChart3 },
    { id: 'flow', name: 'Flow', icon: GitBranch },
    { id: 'production', name: 'Production', icon: Factory },
    { id: 'transportation', name: 'Transport', icon: Truck },
    { id: 'calculations', name: 'Calculations', icon: Calculator },
    { id: 'violations', name: 'Violations', icon: AlertTriangle },
    { id: 'disclosure', name: 'Disclosure', icon: FileText },
    { id: 'scenario', name: 'What-If', icon: Sliders }
  ];

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Clinker Supply Chain Optimization
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Advanced optimization engine for production and transportation
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Cost Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setCostMode('per_unit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                costMode === 'per_unit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              Per Unit
            </button>
            <button
              onClick={() => setCostMode('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                costMode === 'batch'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              Batch
            </button>
          </div>
          <button
            onClick={runOptimization}
            disabled={isOptimizing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            {isOptimizing ? <Activity className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            {isOptimizing ? 'Optimizing...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Cost Mode Info Banner */}
      {optimizationResult && (
        <div className={`rounded-lg p-3 flex items-center gap-3 ${
          costMode === 'per_unit' 
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
            : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
        }`}>
          <div className={`p-2 rounded-lg ${costMode === 'per_unit' ? 'bg-blue-100 dark:bg-blue-800' : 'bg-purple-100 dark:bg-purple-800'}`}>
            {costMode === 'per_unit' ? <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${costMode === 'per_unit' ? 'text-blue-900 dark:text-blue-100' : 'text-purple-900 dark:text-purple-100'}`}>
              {costMode === 'per_unit' ? 'Per Unit Cost Mode' : 'Batch Cost Mode'}
            </p>
            <p className={`text-xs ${costMode === 'per_unit' ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300'}`}>
              {costMode === 'per_unit' 
                ? 'Production: Cost per Period × Quantity | Transport: Freight per Batch × Batches'
                : 'Production: Original Cost per Period | Transport: Freight + Handling (original route cost)'}
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isOptimizing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 animate-spin mr-3" />
            <span className="text-blue-800 dark:text-blue-200">Analyzing constraints...</span>
          </div>
        </div>
      )}

      {optimizationResult && (
        <>
          {/* KPI Cards - Fixed with explicit color classes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard
              title={costMode === 'per_unit' ? 'Total Cost (Per Unit)' : 'Total Cost (Batch)'}
              value={`₹${(((chartData?.totalProductionCost || 0) + (chartData?.totalTransportCost || 0) + (optimizationResult.summary.inventoryCost || 0) + (optimizationResult.summary.penaltyCost || 0)) / 100000).toFixed(2)}L`}
              icon={DollarSign}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
            />
            <MetricCard
              title="Fulfillment"
              value={`${optimizationResult.summary.fulfillmentRate.toFixed(1)}%`}
              icon={Target}
              colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <MetricCard
              title="Demand"
              value={`${(optimizationResult.summary.totalDemand / 1000000).toFixed(1)}M`}
              icon={Package}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <MetricCard
              title="Violations"
              value={optimizationResult.violations.length}
              icon={optimizationResult.violations.length > 0 ? AlertTriangle : CheckCircle}
              colorClass={optimizationResult.violations.length > 0 ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-green-500 to-green-600"}
            />
          </div>

          {/* Tabs - scrollable on mobile */}
          <div className="border-b border-gray-200 dark:border-gray-700 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <nav className="flex gap-1 overflow-x-auto pb-px scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-1.5" />
                  {tab.name}
                  {tab.id === 'violations' && optimizationResult.violations.length > 0 && (
                    <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {optimizationResult.violations.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'summary' && <ExecutiveSummary optimizationResult={optimizationResult} data={data} costMode={costMode} calculatedCosts={chartData ? { productionCost: chartData.totalProductionCost, transportationCost: chartData.totalTransportCost, inventoryCost: optimizationResult.summary.inventoryCost || 0, penaltyCost: optimizationResult.summary.penaltyCost || 0 } : null} />}
            
            {activeTab === 'scenario' && <ScenarioSimulator optimizationResult={optimizationResult} data={data} />}
            
            {activeTab === 'flow' && <FlowDiagram optimizationResult={optimizationResult} />}

            {activeTab === 'overview' && chartData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost Breakdown</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RechartsPieChart>
                      <Pie data={chartData.costBreakdown} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {chartData.costBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Demand Fulfillment</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData.fulfillmentByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                      <Legend />
                      <Bar dataKey="demand" fill="#EF4444" name="Demand" />
                      <Bar dataKey="fulfilled" fill="#10B981" name="Fulfilled" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Production Trend</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData.productionByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                      <Area type="monotone" dataKey="quantity" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transportation Trend</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData.transportationByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                      <Line type="monotone" dataKey="quantity" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'production' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Production Schedule</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    costMode === 'per_unit' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {costMode === 'per_unit' ? 'Per Unit Costs' : 'Batch Costs'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {['IU Code', 'Period', 'Quantity', 'Capacity', costMode === 'per_unit' ? 'Cost/Period' : 'Cost/Period', 'Total Cost'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {optimizationResult.production.slice(0, 50).map((item, index) => {
                        // Per Unit Mode: Total Cost = costPerPeriod × quantity
                        // Batch Mode: Total Cost = costPerPeriod (fixed cost regardless of quantity)
                        const costPerPeriod = item.costPerPeriod || 0;
                        const displayTotalCost = costMode === 'batch' 
                          ? costPerPeriod
                          : costPerPeriod * item.quantity;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.iuCode}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">T{item.period}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{item.quantity.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{(item.capacity || 0).toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                              ₹{costPerPeriod.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              ₹{displayTotalCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
                              {costMode === 'per_unit' && <span className="text-xs text-gray-400 ml-1">({costPerPeriod} × {item.quantity.toLocaleString()})</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'transportation' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transportation Schedule</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    costMode === 'per_unit' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {costMode === 'per_unit' ? 'Per Unit Costs' : 'Batch Costs'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {costMode === 'per_unit' 
                          ? ['From', 'To', 'Mode', 'Period', 'Qty', 'Batches', 'Freight/Batch', 'Total Cost'].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                            ))
                          : ['From', 'To', 'Mode', 'Period', 'Qty', 'Freight', 'Handling', 'Total Cost'].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">{h}</th>
                            ))
                        }
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {optimizationResult.transportation.slice(0, 50).map((item, index) => {
                        const freightPerBatch = item.freightCostPerBatch || 0;
                        const handlingCost = item.handlingCost || 0;
                        const numBatches = item.numBatches || 1;
                        
                        // Per Unit Mode: Freight per Batch × Number of Batches (scales up)
                        // Batch Mode: Freight + Handling (original route cost, no multiply)
                        const displayTotalCost = costMode === 'batch'
                          ? freightPerBatch + handlingCost
                          : freightPerBatch * numBatches;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.fromIU}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{item.toIugu}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.transport === 'T1' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                                {item.transport}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">T{item.period}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{item.quantity.toLocaleString()}</td>
                            {costMode === 'per_unit' ? (
                              <>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">{numBatches}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">₹{freightPerBatch.toFixed(2)}</td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">₹{freightPerBatch.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">₹{handlingCost.toLocaleString()}</td>
                              </>
                            )}
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                              ₹{displayTotalCost.toLocaleString(undefined, {maximumFractionDigits: 2})}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'calculations' && (
              <CalculationBreakdown 
                optimizationResult={{
                  solution: {
                    costBreakdown: optimizationResult.costBreakdown || { productionDetails: [], transportationDetails: [], penaltyBreakdown: { minFulfillment: { count: 0, units: 0, cost: 0 }, minClosingStock: { count: 0, units: 0, cost: 0 }, transportUpperBound: { count: 0, units: 0, cost: 0 } }, totalInventoryUnits: 0, totalProductionQuantity: 0 },
                    metrics: { totalDemand: optimizationResult.summary?.totalDemand || 0, totalDemandFulfilled: optimizationResult.summary?.totalFulfilled || 0 }
                  },
                  summary: { totalCost: optimizationResult.summary?.totalCost || 0, productionCost: optimizationResult.summary?.productionCost || 0, transportationCost: optimizationResult.summary?.transportationCost || 0, inventoryCost: optimizationResult.summary?.inventoryCost || 0, penaltyCost: optimizationResult.summary?.penaltyCost || 0, fulfillmentRate: optimizationResult.summary?.fulfillmentRate || 0, constraintViolations: optimizationResult.violations?.length || 0 }
                }}
              />
            )}

            {activeTab === 'violations' && (
              <div className="space-y-4">
                {optimizationResult.violations.length === 0 ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">No Violations</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">All constraints satisfied.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <h3 className="font-semibold text-red-900 dark:text-red-100">Violations ({optimizationResult.violations.length})</h3>
                      <p className="text-red-700 dark:text-red-300 text-sm">Soft constraints that could not be satisfied:</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {optimizationResult.violations.slice(0, 30).map((violation, index) => (
                        <ViolationCard key={index} violation={violation} />
                      ))}
                    </div>
                    {optimizationResult.violations.length > 30 && (
                      <p className="text-center text-gray-500 text-sm">...and {optimizationResult.violations.length - 30} more</p>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'disclosure' && (
              optimizationResult.disclosure ? (
                <DisclosureReport disclosureData={optimizationResult.disclosure} costMode={costMode} calculatedCosts={chartData ? { productionCost: chartData.totalProductionCost, transportationCost: chartData.totalTransportCost, inventoryCost: optimizationResult.summary.inventoryCost || 0, penaltyCost: optimizationResult.summary.penaltyCost || 0 } : null} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                  <p className="text-gray-500">Generating disclosure data...</p>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizationDashboard;
