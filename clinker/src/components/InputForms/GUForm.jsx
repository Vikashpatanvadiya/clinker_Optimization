import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const GUForm = () => {
  const { isPremium } = useTheme();
  const [units, setUnits] = useState([]);
  const [editingUnit, setEditingUnit] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    demand: [500, 600, 550, 700],
    maxInventory: 800
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/grinding-units');
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/grinding-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newUnit = await response.json();
      setUnits([...units, newUnit]);
      setFormData({
        name: '',
        demand: [500, 600, 550, 700],
        maxInventory: 800
      });
    } catch (error) {
      console.error('Error creating unit:', error);
    }
  };

  const handleDemandChange = (period, value) => {
    const newDemand = [...formData.demand];
    newDemand[period] = parseInt(value);
    setFormData(prev => ({ ...prev, demand: newDemand }));
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      demand: [...unit.demand],
      maxInventory: unit.maxInventory
    });
    setShowEditForm(true);
  };

  const handleUpdateUnit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/grinding-units/${editingUnit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchUnits();
        setShowEditForm(false);
        setEditingUnit(null);
        setFormData({
          name: '',
          demand: [500, 600, 550, 700],
          maxInventory: 800
        });
      } else {
        alert('Failed to update unit');
      }
    } catch (error) {
      console.error('Error updating unit:', error);
      alert('Failed to update unit');
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!confirm('Are you sure you want to delete this grinding unit?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/grinding-units/${unitId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchUnits();
      } else {
        alert('Failed to delete unit');
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Failed to delete unit');
    }
  };

  const handleCancelEdit = () => {
    setEditingUnit(null);
    setShowEditForm(false);
    setFormData({
      name: '',
      demand: [500, 600, 550, 700],
      maxInventory: 800
    });
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${
          isPremium
            ? 'glass-card'
            : 'bg-white shadow-sm border border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-6 ${
          isPremium ? 'text-white' : 'text-gray-900'
        }`}>
          {editingUnit ? 'Edit Grinding Unit' : 'Add Grinding Unit'}
        </h3>

        <form onSubmit={editingUnit ? handleUpdateUnit : handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unit Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isPremium ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Unit Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                  isPremium
                    ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 placeholder-gray-500'
                }`}
                placeholder="e.g., GU-001"
                required
              />
            </div>

            {/* Max Inventory */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isPremium ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Max Inventory (tons)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="400"
                  max="1200"
                  step="50"
                  value={formData.maxInventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxInventory: parseInt(e.target.value) }))}
                  className={`w-full ${
                    isPremium ? 'accent-premium-neon' : 'accent-primary-500'
                  }`}
                />
                <input
                  type="number"
                  value={formData.maxInventory}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxInventory: parseInt(e.target.value) }))}
                  className={`w-full px-3 py-1 text-sm rounded border ${
                    isPremium
                      ? 'bg-premium-dark border-premium-neon/30 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Demand per Period */}
          <div>
            <label className={`block text-sm font-medium mb-4 ${
              isPremium ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Demand per Period (tons)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {formData.demand.map((demand, index) => (
                <div key={index}>
                  <label className={`block text-xs font-medium mb-2 ${
                    isPremium ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Period {index + 1}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="200"
                      max="800"
                      step="25"
                      value={demand}
                      onChange={(e) => handleDemandChange(index, e.target.value)}
                      className={`w-full ${
                        isPremium ? 'accent-premium-gold' : 'accent-primary-500'
                      }`}
                    />
                    <input
                      type="number"
                      value={demand}
                      onChange={(e) => handleDemandChange(index, e.target.value)}
                      className={`w-full px-3 py-1 text-sm rounded border ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isPremium
                ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editingUnit ? <Edit size={20} /> : <Plus size={20} />}
            <span>{editingUnit ? 'Update Unit' : 'Add Unit'}</span>
          </motion.button>
          
          {editingUnit && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className={`ml-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isPremium
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          )}
        </form>
      </motion.div>

      {/* Units List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl ${
          isPremium
            ? 'glass-card'
            : 'bg-white shadow-sm border border-gray-200'
        }`}
      >
        <h3 className={`text-lg font-semibold mb-6 ${
          isPremium ? 'text-white' : 'text-gray-900'
        }`}>
          Existing Grinding Units
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${
                isPremium
                  ? 'bg-premium-dark/50 border-premium-neon/30'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  {unit.name}
                </h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditUnit(unit)}
                    className={`p-1 rounded transition-colors ${
                      isPremium
                        ? 'hover:bg-premium-neon/20 text-premium-neon'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUnit(unit.id)}
                    className={`p-1 rounded transition-colors ${
                      isPremium
                        ? 'hover:bg-red-500/20 text-red-400'
                        : 'hover:bg-red-50 text-red-600'
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className={`space-y-2 text-sm ${
                isPremium ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <div className="flex justify-between">
                  <span>Max Inventory:</span>
                  <span className="font-medium">{unit.maxInventory} tons</span>
                </div>
                <div>
                  <span className="block mb-1">Demand Schedule:</span>
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    {unit.demand.map((d, i) => (
                      <div key={i} className={`text-center p-1 rounded ${
                        isPremium ? 'bg-premium-neon/20' : 'bg-primary-50'
                      }`}>
                        {d}t
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GUForm;