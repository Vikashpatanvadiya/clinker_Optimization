import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Search,
  Eye,
  Share2,
  BarChart3,
  TrendingUp,
  DollarSign,
  Truck,
  Factory,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  MapPin,
  Target,
  Activity
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Reports = ({ data }) => {
  const { isPremium } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  // Generate reports based on actual data
  const reports = useMemo(() => {
    if (!data) return [];

    const totalDemand = data.ClinkerDemand.reduce((sum, item) => sum + item.DEMAND, 0);
    const totalMinFulfillment = data.ClinkerDemand.reduce((sum, item) => sum + item['MIN FULFILLMENT'], 0);
    const totalCapacity = data.ClinkerCapacity.reduce((sum, item) => sum + item.CAPACITY, 0);
    const avgProductionCost = data.ProductionCost.reduce((sum, item, _, arr) => sum + item['PRODUCTION COST'] / arr.length, 0);
    const totalLogisticsCost = data.LogisticsIUGU.reduce((sum, item) => sum + item['FREIGHT COST'] + item['HANDLING COST'], 0);
    const totalOpeningStock = data.IUGUOpeningStock.reduce((sum, item) => sum + item['OPENING STOCK'], 0);

    return [
      {
        id: 1,
        title: 'Clinker Demand Analysis Report',
        type: 'demand',
        description: 'Comprehensive analysis of clinker demand and minimum fulfillment requirements across all IUGU codes and time periods',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '2.8 MB',
        pages: Math.ceil(data.ClinkerDemand.length / 20),
        insights: 15,
        totalDemand: totalDemand,
        totalMinFulfillment: totalMinFulfillment,
        fulfillmentRate: ((totalMinFulfillment / totalDemand) * 100).toFixed(1),
        icon: TrendingUp,
        color: 'blue',
        data: data.ClinkerDemand
      },
      {
        id: 2,
        title: 'Production Capacity Utilization Report',
        type: 'capacity',
        description: 'IU production capacity analysis with utilization rates and efficiency metrics',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '2.1 MB',
        pages: Math.ceil(data.ClinkerCapacity.length / 15),
        insights: 12,
        totalCapacity: totalCapacity,
        utilizationRate: (totalDemand / totalCapacity * 100).toFixed(1),
        icon: Factory,
        color: 'purple',
        data: data.ClinkerCapacity
      },
      {
        id: 3,
        title: 'Production Cost Analysis Report',
        type: 'cost',
        description: 'Detailed breakdown of production costs across all IU plants and time periods',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '1.9 MB',
        pages: Math.ceil(data.ProductionCost.length / 25),
        insights: 10,
        avgCost: avgProductionCost.toFixed(0),
        totalCostEntries: data.ProductionCost.length,
        icon: DollarSign,
        color: 'green',
        data: data.ProductionCost
      },
      {
        id: 4,
        title: 'Logistics & Transportation Report',
        type: 'logistics',
        description: 'Transportation cost analysis and route optimization insights',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '3.4 MB',
        pages: Math.ceil(data.LogisticsIUGU.length / 30),
        insights: 18,
        totalLogisticsCost: totalLogisticsCost.toFixed(0),
        totalRoutes: data.LogisticsIUGU.length,
        icon: Truck,
        color: 'orange',
        data: data.LogisticsIUGU
      },
      {
        id: 5,
        title: 'Inventory Management Report',
        type: 'inventory',
        description: 'Opening stock levels and inventory optimization recommendations',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '1.6 MB',
        pages: Math.ceil(data.IUGUOpeningStock.length / 20),
        insights: 8,
        totalOpeningStock: totalOpeningStock.toFixed(0),
        plantCount: data.IUGUOpeningStock.length,
        icon: Package,
        color: 'indigo',
        data: data.IUGUOpeningStock
      },
      {
        id: 6,
        title: 'Plant Performance Summary',
        type: 'performance',
        description: 'Comprehensive performance analysis of all IU and GU plants',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '2.7 MB',
        pages: Math.ceil((data.IUGUType || []).length / 10),
        insights: 14,
        totalPlants: (data.IUGUType || []).length,
        iuCount: (data.IUGUType || []).filter(p => p['PLANT TYPE'] === 'IU').length,
        guCount: (data.IUGUType || []).filter(p => p['PLANT TYPE'] === 'GU').length,
        icon: Activity,
        color: 'green',
        data: data.IUGUType || []
      },
      {
        id: 7,
        title: 'Constraints & Optimization Report',
        type: 'constraints',
        description: 'Analysis of operational constraints and optimization opportunities',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        size: '2.2 MB',
        pages: Math.ceil(data.IUGUConstraint.length / 25),
        insights: 11,
        totalConstraints: data.IUGUConstraint.length,
        constraintTypes: [...new Set(data.IUGUConstraint.map(c => c['BOUND TYPEID']))].length,
        icon: Target,
        color: 'purple',
        data: data.IUGUConstraint
      }
    ];
  }, [data]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const generateDetailedReport = (report) => {
    setSelectedReport(report);
  };

  const downloadReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // Create a simple CSV export
      const csvContent = generateCSVContent(report);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const generateCSVContent = (report) => {
    if (!report.data || !Array.isArray(report.data)) return '';
    
    const headers = Object.keys(report.data[0] || {});
    const csvRows = [
      headers.join(','),
      ...report.data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const ReportCard = ({ report }) => {
    const Icon = report.icon;
    const colorClasses = {
      green: isPremium ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      blue: isPremium ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      purple: isPremium ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      orange: isPremium ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      indigo: isPremium ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`p-6 rounded-xl cursor-pointer transition-all duration-200 ${
          isPremium
            ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20 hover:border-premium-gold/40'
            : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${colorClasses[report.color]}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className={`font-semibold ${
                isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
              }`}>
                {report.title}
              </h3>
              <p className={`text-sm ${
                isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {report.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Generated
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {new Date(report.generatedDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Size
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {report.size}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Pages
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {report.pages}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Insights
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {report.insights}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        {report.totalDemand && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-blue-500/10' : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-blue-400' : 'text-blue-700 dark:text-blue-400'
            }`}>
              Total Demand: {Math.round(report.totalDemand).toLocaleString()} units
              {report.totalMinFulfillment && (
                <span className="block mt-1">
                  Min Fulfillment: {Math.round(report.totalMinFulfillment).toLocaleString()} units ({report.fulfillmentRate}%)
                </span>
              )}
            </p>
          </div>
        )}

        {report.totalCapacity && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-purple-500/10' : 'bg-purple-50 dark:bg-purple-900/20'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-purple-400' : 'text-purple-700 dark:text-purple-400'
            }`}>
              Total Capacity: {Math.round(report.totalCapacity).toLocaleString()} units
              {report.utilizationRate && ` (${report.utilizationRate}% utilized)`}
            </p>
          </div>
        )}

        {report.avgCost && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-green-500/10' : 'bg-green-50 dark:bg-green-900/20'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-green-400' : 'text-green-700 dark:text-green-400'
            }`}>
              Average Production Cost: ${Math.round(report.avgCost).toLocaleString()}
            </p>
          </div>
        )}

        {report.totalLogisticsCost && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-orange-500/10' : 'bg-orange-50 dark:bg-orange-900/20'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-orange-400' : 'text-orange-700 dark:text-orange-400'
            }`}>
              Total Logistics Cost: ${Math.round(report.totalLogisticsCost).toLocaleString()}
            </p>
          </div>
        )}

        {report.totalPlants && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-green-500/10' : 'bg-green-50 dark:bg-green-900/20'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-green-400' : 'text-green-700 dark:text-green-400'
            }`}>
              Total Plants: {report.totalPlants} ({report.iuCount} IU, {report.guCount} GU)
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400`}>
            Ready
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => generateDetailedReport(report)}
              className={`p-2 rounded-lg transition-colors ${
                isPremium
                  ? 'hover:bg-premium-neon/20 text-premium-neon'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title="View Report Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => downloadReport(report.id)}
              className={`p-2 rounded-lg transition-colors ${
                isPremium
                  ? 'hover:bg-premium-gold/20 text-premium-gold'
                  : 'hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              }`}
              title="Download Report (CSV)"
            >
              <Download size={16} />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isPremium
                  ? 'hover:bg-gray-600 text-gray-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title="Share Report"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No data available for reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${
            isPremium ? 'premium-text-gradient font-display' : 'text-gray-900 dark:text-white'
          }`}>
            Reports & Analytics
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Comprehensive clinker optimization reports and data exports
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl ${
        isPremium
          ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
          : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isPremium ? 'text-gray-400' : 'text-gray-500'
              }`} size={18} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                  isPremium
                    ? 'bg-premium-dark border-premium-gold/30 text-premium-gold focus:ring-premium-neon placeholder-gray-400'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-primary-500 placeholder-gray-500'
                }`}
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-gold/30 text-premium-gold focus:ring-premium-neon'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-primary-500'
              }`}
            >
              <option value="all">All Types</option>
              <option value="demand">Demand Reports</option>
              <option value="capacity">Capacity Reports</option>
              <option value="cost">Cost Reports</option>
              <option value="logistics">Logistics Reports</option>
              <option value="inventory">Inventory Reports</option>
              <option value="performance">Performance Reports</option>
              <option value="constraints">Constraint Reports</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className={`mx-auto mb-4 ${
            isPremium ? 'text-gray-400' : 'text-gray-500'
          }`} size={48} />
          <p className={`text-lg font-medium ${
            isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            No reports found
          </p>
          <p className={`${
            isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
          }`}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${
              isPremium
                ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${
                  isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
                }`}>
                  {selectedReport.title}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className={`p-2 rounded-lg ${
                    isPremium ? 'hover:bg-premium-gold/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <p className={`${
                  isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {selectedReport.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${
                    isPremium ? 'bg-premium-gold/10' : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Data Points
                    </p>
                    <p className={`text-lg font-bold ${
                      isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
                    }`}>
                      {selectedReport.data?.length || 0}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    isPremium ? 'bg-premium-neon/10' : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Pages
                    </p>
                    <p className={`text-lg font-bold ${
                      isPremium ? 'text-premium-neon' : 'text-gray-900 dark:text-white'
                    }`}>
                      {selectedReport.pages}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    isPremium ? 'bg-green-500/10' : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Insights
                    </p>
                    <p className={`text-lg font-bold ${
                      isPremium ? 'text-green-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {selectedReport.insights}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    isPremium ? 'bg-blue-500/10' : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <p className={`text-sm font-medium ${
                      isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      File Size
                    </p>
                    <p className={`text-lg font-bold ${
                      isPremium ? 'text-blue-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {selectedReport.size}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => downloadReport(selectedReport.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      isPremium
                        ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    <Download size={18} />
                    <span>Download CSV</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedReport(null)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      isPremium
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;