import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Building2, 
  Truck, 
  Zap, 
  Package, 
  DollarSign, 
  Target,
  Plus,
  Edit,
  Save,
  X,
  AlertTriangle,
  TrendingUp,
  Upload
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import FileUpload from './FileUpload';

const InputForms = ({ data, setData }) => {
  const { isPremium } = useTheme();
  const [activeTab, setActiveTab] = useState('upload');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const tabs = [
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'demand', label: 'Clinker Demand', icon: TrendingUp },
    { id: 'capacity', label: 'Production Capacity', icon: Factory },
    { id: 'cost', label: 'Production Cost', icon: DollarSign },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'constraints', label: 'Constraints', icon: Target },
  ];

  // Handle data loaded from XLSX file
  const handleDataLoaded = useCallback((newData) => {
    // Store original data for reset functionality
    if (!originalData) {
      setOriginalData(data);
    }
    setData(newData);
  }, [data, originalData, setData]);

  // Reset to original demo data
  const handleReset = useCallback(async () => {
    try {
      const response = await fetch('/data.json');
      if (response.ok) {
        const demoData = await response.json();
        setData(demoData);
      } else if (originalData) {
        setData(originalData);
      }
    } catch (error) {
      console.error('Failed to reset data:', error);
      if (originalData) {
        setData(originalData);
      }
    }
  }, [originalData, setData]);

  const getDataForTab = (tabId) => {
    switch (tabId) {
      case 'demand': return (data?.ClinkerDemand || []).filter(item => item && item['IUGU CODE'] && item['TIME PERIOD'] !== undefined && item.DEMAND !== undefined);
      case 'capacity': return (data?.ClinkerCapacity || []).filter(item => item && item['IU CODE'] && item['TIME PERIOD'] !== undefined && item.CAPACITY !== undefined);
      case 'cost': return (data?.ProductionCost || []).filter(item => item && item['IU CODE'] && item['TIME PERIOD'] !== undefined && item['PRODUCTION COST'] !== undefined);
      case 'logistics': return (data?.LogisticsIUGU || []).filter(item => item && item['FROM IU CODE'] && item['TO IUGU CODE']);
      case 'inventory': return (data?.IUGUOpeningStock || []).filter(item => item && item['IUGU CODE'] && item['OPENING STOCK'] !== undefined);
      case 'constraints': return (data?.IUGUConstraint || []).filter(item => item && item['TIME PERIOD'] !== undefined);
      default: return [];
    }
  };

  const getFieldsForTab = (tabId) => {
    switch (tabId) {
      case 'demand':
        return [
          { key: 'IUGU CODE', label: 'IUGU Code', type: 'text', required: true },
          { key: 'TIME PERIOD', label: 'Time Period', type: 'number', required: true },
          { key: 'DEMAND', label: 'Demand', type: 'number', required: true }
        ];
      case 'capacity':
        return [
          { key: 'IU CODE', label: 'IU Code', type: 'text', required: true },
          { key: 'TIME PERIOD', label: 'Time Period', type: 'number', required: true },
          { key: 'CAPACITY', label: 'Capacity', type: 'number', required: true }
        ];
      case 'cost':
        return [
          { key: 'IU CODE', label: 'IU Code', type: 'text', required: true },
          { key: 'TIME PERIOD', label: 'Time Period', type: 'number', required: true },
          { key: 'PRODUCTION COST', label: 'Production Cost', type: 'number', required: true }
        ];
      case 'logistics':
        return [
          { key: 'FROM IU CODE', label: 'From IU Code', type: 'text', required: true },
          { key: 'TO IUGU CODE', label: 'To IUGU Code', type: 'text', required: true },
          { key: 'TRANSPORT CODE', label: 'Transport Code', type: 'text', required: true },
          { key: 'TIME PERIOD', label: 'Time Period', type: 'number', required: true },
          { key: 'FREIGHT COST', label: 'Freight Cost', type: 'number', required: true },
          { key: 'HANDLING COST', label: 'Handling Cost', type: 'number', required: true },
          { key: 'QUANTITY MULTIPLIER', label: 'Quantity Multiplier', type: 'number', required: true }
        ];
      case 'inventory':
        return [
          { key: 'IUGU CODE', label: 'IUGU Code', type: 'text', required: true },
          { key: 'OPENING STOCK', label: 'Opening Stock', type: 'number', required: true }
        ];
      case 'constraints':
        return [
          { key: 'IU CODE', label: 'IU Code', type: 'text' },
          { key: 'IUGU CODE', label: 'IUGU Code', type: 'text' },
          { key: 'TRANSPORT CODE', label: 'Transport Code', type: 'text' },
          { key: 'TIME PERIOD', label: 'Time Period', type: 'number', required: true },
          { key: 'BOUND TYPEID', label: 'Bound Type', type: 'text', required: true },
          { key: 'VALUE TYPEID', label: 'Value Type', type: 'text', required: true },
          { key: 'Value', label: 'Value', type: 'number', required: true }
        ];
      default: return [];
    }
  };

  const handleEdit = (item, index) => {
    setEditingItem({ ...item, _index: index });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const newData = { ...data };
    const tabData = getDataForTab(activeTab);
    const dataKey = getDataKeyForTab(activeTab);
    
    tabData[editingItem._index] = { ...editingItem };
    delete tabData[editingItem._index]._index;
    
    newData[dataKey] = tabData;
    setData(newData);
    setEditingItem(null);
  };

  const handleAdd = () => {
    if (!newItem || Object.keys(newItem).length === 0) return;

    const newData = { ...data };
    const dataKey = getDataKeyForTab(activeTab);
    
    if (!newData[dataKey]) {
      newData[dataKey] = [];
    }
    
    newData[dataKey].push({ ...newItem });
    setData(newData);
    setNewItem({});
    setShowAddForm(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const newData = { ...data };
      const tabData = getDataForTab(activeTab);
      const dataKey = getDataKeyForTab(activeTab);
      
      tabData.splice(index, 1);
      newData[dataKey] = tabData;
      setData(newData);
    }
  };

  const getDataKeyForTab = (tabId) => {
    switch (tabId) {
      case 'demand': return 'ClinkerDemand';
      case 'capacity': return 'ClinkerCapacity';
      case 'cost': return 'ProductionCost';
      case 'logistics': return 'LogisticsIUGU';
      case 'inventory': return 'IUGUOpeningStock';
      case 'constraints': return 'IUGUConstraint';
      default: return '';
    }
  };

  const renderFormField = (field, value, onChange) => (
    <div key={field.key} className="space-y-2">
      <label className={`block text-sm font-medium ${
        isPremium ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={field.type}
        value={value || ''}
        onChange={(e) => onChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          isPremium
            ? 'bg-premium-dark border-premium-gold/30 text-premium-gold focus:ring-premium-neon'
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-primary-500'
        }`}
        required={field.required}
      />
    </div>
  );

  const currentData = getDataForTab(activeTab);
  const fields = getFieldsForTab(activeTab);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`text-center ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No data available for editing</p>
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
            Data Management
          </h1>
          <p className={`mt-1 ${
            isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Edit and manage clinker optimization data
          </p>
        </div>
        
        <motion.button
          onClick={() => setShowAddForm(true)}
          disabled={activeTab === 'upload'}
          className={`mt-4 lg:mt-0 flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'upload'
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-200'
              : isPremium
                ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg'
                : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
          whileHover={activeTab !== 'upload' ? { scale: 1.05 } : {}}
          whileTap={activeTab !== 'upload' ? { scale: 0.95 } : {}}
        >
          <Plus size={18} />
          <span>Add New</span>
        </motion.button>
      </div>

      {/* Tab Navigation */}
      <div className={`border-b ${
        isPremium ? 'border-premium-gold/20' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? isPremium
                      ? 'border-premium-neon text-premium-neon'
                      : 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : isPremium
                      ? 'border-transparent text-gray-400 hover:text-premium-neon hover:border-premium-neon/50'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                whileHover={{ y: -2 }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
              isPremium
                ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${
                isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
              }`}>
                Add New {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-lg ${
                  isPremium ? 'hover:bg-premium-gold/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {fields.map(field => renderFormField(field, newItem[field.key], (key, value) => {
                setNewItem(prev => ({ ...prev, [key]: value }));
              }))}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleAdd}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isPremium
                    ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                <Save size={18} />
                <span>Add Item</span>
              </button>
              
              <button
                onClick={() => setShowAddForm(false)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isPremium
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upload Tab Content */}
      {activeTab === 'upload' && (
        <motion.div
          key="upload"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl p-6 ${
            isPremium
              ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="mb-6">
            <h2 className={`text-xl font-semibold ${
              isPremium ? 'text-premium-gold' : 'text-gray-900 dark:text-white'
            }`}>
              Upload Excel File
            </h2>
            <p className={`mt-1 text-sm ${
              isPremium ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Upload your Excel file with clinker optimization data. The system will automatically detect and parse all required sheets.
            </p>
          </div>
          <FileUpload onDataLoaded={handleDataLoaded} onReset={handleReset} />
        </motion.div>
      )}

      {/* Data Table */}
      {activeTab !== 'upload' && (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl overflow-hidden ${
          isPremium
            ? 'bg-gradient-to-br from-premium-dark to-premium-darker border border-premium-gold/20'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }`}
      >
        {/* Data Quality Info */}
        {currentData.length > 0 && (
          <div className={`px-4 py-2 text-sm ${
            isPremium ? 'bg-premium-gold/5 text-gray-300' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            Showing {currentData.length} records
            {currentData.some(item => !item || Object.values(item).some(val => val === '' || val === null || val === undefined)) && (
              <span className="ml-2 text-yellow-500">⚠ Some records may have missing data</span>
            )}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              isPremium ? 'bg-premium-gold/10' : 'bg-gray-50 dark:bg-gray-700'
            }`}>
              <tr>
                {fields.map(field => (
                  <th key={field.key} className={`px-4 py-3 text-left text-sm font-medium ${
                    isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {field.label}
                  </th>
                ))}
                <th className={`px-4 py-3 text-right text-sm font-medium ${
                  isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isPremium ? 'divide-premium-gold/10' : 'divide-gray-200 dark:divide-gray-700'
            }`}>
              {currentData.map((item, index) => {
                const hasEmptyFields = !item || fields.some(field => 
                  item[field.key] === '' || item[field.key] === null || item[field.key] === undefined
                );
                
                return (
                  <tr 
                    key={index} 
                    className={`hover:${
                      isPremium ? 'bg-premium-gold/5' : 'bg-gray-50 dark:bg-gray-700'
                    } ${hasEmptyFields ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400' : ''}`}
                  >
                  {fields.map(field => (
                    <td key={field.key} className={`px-4 py-3 text-sm ${
                      isPremium ? 'text-gray-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {editingItem && editingItem._index === index ? (
                        <input
                          type={field.type}
                          value={editingItem[field.key] || ''}
                          onChange={(e) => setEditingItem(prev => ({
                            ...prev,
                            [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                          }))}
                          className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 ${
                            isPremium
                              ? 'bg-premium-dark border-premium-gold/30 text-premium-gold focus:ring-premium-neon'
                              : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white focus:ring-primary-500'
                          }`}
                        />
                      ) : (
                        <span className={hasEmptyFields && (item[field.key] === '' || item[field.key] === null || item[field.key] === undefined) ? 'text-red-500 font-medium' : ''}>
                          {typeof item[field.key] === 'number' 
                            ? item[field.key].toLocaleString() 
                            : item[field.key] || (hasEmptyFields ? '⚠ EMPTY' : '-')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {hasEmptyFields && (
                        <span className="text-yellow-500 text-xs mr-2" title="This record has missing data">
                          ⚠
                        </span>
                      )}
                      {editingItem && editingItem._index === index ? (
                        <>
                          <button
                            onClick={handleSave}
                            className={`p-1 rounded ${
                              isPremium
                                ? 'text-green-400 hover:bg-green-500/20'
                                : 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20'
                            }`}
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className={`p-1 rounded ${
                              isPremium
                                ? 'text-gray-400 hover:bg-gray-500/20'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(item, index)}
                            className={`p-1 rounded ${
                              isPremium
                                ? 'text-blue-400 hover:bg-blue-500/20'
                                : 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className={`p-1 rounded ${
                              isPremium
                                ? 'text-red-400 hover:bg-red-500/20'
                                : 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20'
                            }`}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {currentData.length === 0 && (
          <div className="text-center py-12">
            <Package className={`mx-auto mb-4 ${
              isPremium ? 'text-gray-400' : 'text-gray-500'
            }`} size={48} />
            <p className={`text-lg font-medium ${
              isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              No data available
            </p>
            <p className={`${
              isPremium ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              Click "Add New" to create your first entry
            </p>
          </div>
        )}
      </motion.div>
      )}
    </div>
  );
};

export default InputForms;