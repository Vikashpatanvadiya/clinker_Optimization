import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { formatCurrency } from '../../utils/currency';

const Reports = () => {
  const { isPremium } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchReports();
  }, [filterType, dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setReports([
        {
          id: 1,
          title: 'Monthly Cost Optimization Report',
          type: 'cost',
          description: 'Comprehensive analysis of cost savings and optimization opportunities',
          generatedDate: '2026-01-07',
          status: 'completed',
          size: '2.4 MB',
          pages: 24,
          insights: 12,
          savings: 1240000,
          icon: DollarSign,
          color: 'green'
        },
        {
          id: 2,
          title: 'Transportation Efficiency Analysis',
          type: 'transport',
          description: 'Vehicle utilization and route optimization performance metrics',
          generatedDate: '2026-01-06',
          status: 'completed',
          size: '1.8 MB',
          pages: 18,
          insights: 8,
          efficiency: 5.8,
          icon: Truck,
          color: 'blue'
        },
        {
          id: 3,
          title: 'Plant Production Summary',
          type: 'production',
          description: 'IU and GU performance analysis with capacity utilization',
          generatedDate: '2026-01-05',
          status: 'completed',
          size: '3.1 MB',
          pages: 32,
          insights: 15,
          utilization: 87,
          icon: Factory,
          color: 'purple'
        },
        {
          id: 4,
          title: 'Carbon Emissions Report',
          type: 'environment',
          description: 'Environmental impact analysis and sustainability metrics',
          generatedDate: '2026-01-04',
          status: 'processing',
          size: '1.2 MB',
          pages: 14,
          insights: 6,
          emissions: 2840,
          icon: TrendingUp,
          color: 'orange'
        },
        {
          id: 5,
          title: 'Fleet Management Overview',
          type: 'fleet',
          description: 'Vehicle fleet performance and maintenance scheduling',
          generatedDate: '2026-01-03',
          status: 'completed',
          size: '2.7 MB',
          pages: 28,
          insights: 11,
          vehicles: 142,
          icon: BarChart3,
          color: 'indigo'
        },
        {
          id: 6,
          title: 'Route Optimization Study',
          type: 'transport',
          description: 'Analysis of shipping routes and distance optimization',
          generatedDate: '2026-01-02',
          status: 'completed',
          size: '1.9 MB',
          pages: 21,
          insights: 9,
          routes: 45,
          icon: Truck,
          color: 'blue'
        }
      ]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const generateReport = async (type) => {
    // Simulate report generation
    alert(`Generating ${type} report... This will be available in a few minutes.`);
  };

  const downloadReport = (reportId) => {
    // Simulate download
    alert(`Downloading report ${reportId}...`);
  };

  const ReportCard = ({ report }) => {
    const Icon = report.icon;
    const colorClasses = {
      green: isPremium ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600',
      blue: isPremium ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
      purple: isPremium ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600',
      orange: isPremium ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600',
      indigo: isPremium ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`p-6 rounded-xl cursor-pointer transition-all duration-200 ${
          isPremium
            ? 'glass-card hover:bg-white/20'
            : 'bg-white shadow-sm hover:shadow-md border border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${colorClasses[report.color]}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className={`font-semibold ${
                isPremium ? 'text-white' : 'text-gray-900'
              }`}>
                {report.title}
              </h3>
              <p className={`text-sm ${
                isPremium ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {report.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {report.status === 'completed' ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <AlertCircle className="text-orange-500" size={20} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Generated
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {new Date(report.generatedDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Size
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {report.size}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Pages
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {report.pages}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Insights
            </p>
            <p className={`text-sm font-semibold ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}>
              {report.insights}
            </p>
          </div>
        </div>

        {/* Key Metric */}
        {report.savings && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-green-500/10' : 'bg-green-50'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-green-400' : 'text-green-700'
            }`}>
              Potential Savings: {formatCurrency(report.savings)}
            </p>
          </div>
        )}

        {report.efficiency && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-blue-500/10' : 'bg-blue-50'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-blue-400' : 'text-blue-700'
            }`}>
              Average Efficiency: {report.efficiency} km/l
            </p>
          </div>
        )}

        {report.utilization && (
          <div className={`p-3 rounded-lg mb-4 ${
            isPremium ? 'bg-purple-500/10' : 'bg-purple-50'
          }`}>
            <p className={`text-sm font-medium ${
              isPremium ? 'text-purple-400' : 'text-purple-700'
            }`}>
              Capacity Utilization: {report.utilization}%
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`text-xs px-2 py-1 rounded-full ${
            report.status === 'completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
              : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'
          }`}>
            {report.status === 'completed' ? 'Ready' : 'Processing'}
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                isPremium
                  ? 'hover:bg-premium-neon/20 text-premium-neon'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="View Report"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => downloadReport(report.id)}
              disabled={report.status !== 'completed'}
              className={`p-2 rounded-lg transition-colors ${
                report.status === 'completed'
                  ? isPremium
                    ? 'hover:bg-premium-gold/20 text-premium-gold'
                    : 'hover:bg-blue-100 text-blue-600'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              title="Download Report"
            >
              <Download size={16} />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isPremium
                  ? 'hover:bg-gray-600 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-t-transparent rounded-full border-current"
        />
        <span className={`ml-3 ${isPremium ? 'text-white' : 'text-gray-900'}`}>
          Loading reports...
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
            Reports & Analytics
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Generate and download comprehensive business reports
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <motion.button
            onClick={() => generateReport('custom')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isPremium
                ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText size={18} />
            <span>Generate Report</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl ${
        isPremium
          ? 'glass-card'
          : 'bg-white shadow-sm border border-gray-200'
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
                    ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 placeholder-gray-500'
                }`}
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                isPremium
                  ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
              }`}
            >
              <option value="all">All Types</option>
              <option value="cost">Cost Reports</option>
              <option value="transport">Transportation</option>
              <option value="production">Production</option>
              <option value="environment">Environmental</option>
              <option value="fleet">Fleet Management</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className={isPremium ? 'text-gray-400' : 'text-gray-500'} size={18} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
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
            isPremium ? 'text-white' : 'text-gray-900'
          }`}>
            No reports found
          </p>
          <p className={`${
            isPremium ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;