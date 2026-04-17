import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Truck, 
  Train, 
  Ship, 
  Route,
  MapPin,
  Weight,
  TrendingUp,
  Fuel,
  DollarSign,
  Award,
  AlertCircle,
  Factory,
  Building2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  stateDatabase, 
  getIntegratedUnits, 
  getGrindingUnits,
  getAllIntegratedUnits,
  getAllGrindingUnits,
  getPlantById,
  calculateDistance,
  getRouteDetails 
} from '../../data/stateDatabase';
import { getVehicleRecommendations } from '../../data/vehicleDatabase';
import { formatCurrency } from '../../utils/currency';

const TransportModeForm = () => {
  const { isPremium } = useTheme();
  const [activeSection, setActiveSection] = useState('smart-transport');
  const [modes, setModes] = useState([]);
  const [fleet, setFleet] = useState({ vehicles: [], totalVehicles: 0, availableTypes: [] });
  const [loadingFleet, setLoadingFleet] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState({ vehicleTypes: [], totalTypes: 0, customTypes: 0, builtInTypes: 0 });
  const [showAddVehicleType, setShowAddVehicleType] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState(null);
  const [editingFleetVehicle, setEditingFleetVehicle] = useState(null);
  const [showEditFleetVehicle, setShowEditFleetVehicle] = useState(false);
  const [editFleetVehicleData, setEditFleetVehicleData] = useState({
    count: 1
  });
  const [newVehicleType, setNewVehicleType] = useState({
    name: '',
    type: 'Heavy Commercial Vehicle',
    capacity_tons: '',
    cost_per_km: '',
    fixed_cost: '',
    fuel_efficiency_kmpl: '',
    speed_kmh: '',
    carbon_g_per_tkm: ''
  });
  
  // Smart Transport State - Enhanced for IU-to-IU support
  const [smartTransport, setSmartTransport] = useState({
    fromState: 'gujarat',
    fromPlant: '',
    fromPlantType: 'integrated_unit', // 'integrated_unit' or 'grinding_unit'
    toState: 'odisha', 
    toPlant: '',
    toPlantType: 'grinding_unit', // 'integrated_unit' or 'grinding_unit'
    tonnage: 100
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Search functionality for plants
  const [fromPlantSearch, setFromPlantSearch] = useState('');
  const [toPlantSearch, setToPlantSearch] = useState('');
  const [showFromPlantDropdown, setShowFromPlantDropdown] = useState(false);
  const [showToPlantDropdown, setShowToPlantDropdown] = useState(false);

  // Traditional Transport Mode State
  const [formData, setFormData] = useState({
    name: 'Road',
    costPerTrip: 8340,
    capacity: 50,
    minBatch: 25
  });

  const transportTypes = [
    { name: 'Road', icon: Truck, defaultCost: 8340, defaultCapacity: 50, defaultBatch: 25 },
    { name: 'Rail', icon: Train, defaultCost: 25020, defaultCapacity: 60, defaultBatch: 30 },
    { name: 'Barge', icon: Ship, defaultCost: 41700, defaultCapacity: 500, defaultBatch: 250 }
  ];

  useEffect(() => {
    fetchModes();
    fetchFleet();
    fetchVehicleTypes();
    // Note: No longer auto-selecting plants - user must choose manually
  }, [smartTransport.fromState, smartTransport.toState, smartTransport.fromPlantType, smartTransport.toPlantType]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.plant-search-dropdown')) {
        setShowFromPlantDropdown(false);
        setShowToPlantDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchModes = async () => {
    try {
      const response = await fetch('/api/transport-modes');
      const data = await response.json();
      setModes(data);
    } catch (error) {
      console.error('Error fetching modes:', error);
    }
  };

  const fetchFleet = async () => {
    try {
      const response = await fetch('/api/fleet');
      const data = await response.json();
      setFleet(data);
    } catch (error) {
      console.error('Error fetching fleet:', error);
    }
  };

  const handleAddVehicle = async (vehicleTypeId, count = 1) => {
    setLoadingFleet(true);
    try {
      const response = await fetch('/api/fleet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleTypeId, count })
      });
      
      if (response.ok) {
        await fetchFleet();
      } else {
        const error = await response.json();
        alert('Error adding vehicle: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    } finally {
      setLoadingFleet(false);
    }
  };

  const handleRemoveVehicle = async (vehicleId, count = 1) => {
    setLoadingFleet(true);
    try {
      const response = await fetch('/api/fleet/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, count })
      });
      
      if (response.ok) {
        await fetchFleet();
      } else {
        const error = await response.json();
        alert('Error removing vehicle: ' + error.error);
      }
    } catch (error) {
      console.error('Error removing vehicle:', error);
      alert('Failed to remove vehicle');
    } finally {
      setLoadingFleet(false);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      // Use fleet-specific endpoint that excludes railway transport
      const response = await fetch('/api/vehicle-types/fleet');
      const data = await response.json();
      setVehicleTypes(data);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
    }
  };

  const handleCreateVehicleType = async (e) => {
    e.preventDefault();
    setLoadingFleet(true);
    try {
      const response = await fetch('/api/vehicle-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicleType)
      });
      
      if (response.ok) {
        await fetchVehicleTypes();
        await fetchFleet();
        setShowAddVehicleType(false);
        setNewVehicleType({
          name: '',
          type: 'Heavy Commercial Vehicle',
          capacity_tons: '',
          cost_per_km: '',
          fixed_cost: '',
          fuel_efficiency_kmpl: '',
          speed_kmh: '',
          carbon_g_per_tkm: ''
        });
      } else {
        const error = await response.json();
        alert('Error creating vehicle type: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating vehicle type:', error);
      alert('Failed to create vehicle type');
    } finally {
      setLoadingFleet(false);
    }
  };

  const handleDeleteVehicleType = async (vehicleTypeId) => {
    if (!confirm('Are you sure you want to delete this vehicle type? This will also remove it from your fleet.')) {
      return;
    }
    
    setLoadingFleet(true);
    try {
      const response = await fetch(`/api/vehicle-types/${vehicleTypeId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchVehicleTypes();
        await fetchFleet();
      } else {
        const error = await response.json();
        alert('Error deleting vehicle type: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
      alert('Failed to delete vehicle type');
    } finally {
      setLoadingFleet(false);
    }
  };

  const handleEditVehicleType = (vehicleType) => {
    setEditingVehicleType(vehicleType);
    setNewVehicleType({
      name: vehicleType.name,
      type: vehicleType.type,
      capacity_tons: vehicleType.capacity_tons.toString(),
      cost_per_km: vehicleType.cost_per_km.toString(),
      fixed_cost: vehicleType.fixed_cost.toString(),
      fuel_efficiency_kmpl: vehicleType.fuel_efficiency_kmpl.toString(),
      speed_kmh: vehicleType.speed_kmh.toString(),
      carbon_g_per_tkm: vehicleType.carbon_g_per_tkm.toString()
    });
    setShowAddVehicleType(true);
    
    // Scroll to the form after a brief delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.querySelector('[data-vehicle-type-form]');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleUpdateVehicleType = async (e) => {
    e.preventDefault();
    setLoadingFleet(true);
    try {
      const response = await fetch(`/api/vehicle-types/${editingVehicleType.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicleType)
      });
      
      if (response.ok) {
        const result = await response.json();
        await fetchVehicleTypes();
        await fetchFleet();
        setShowAddVehicleType(false);
        setEditingVehicleType(null);
        setNewVehicleType({
          name: '',
          type: 'Heavy Commercial Vehicle',
          capacity_tons: '',
          cost_per_km: '',
          fixed_cost: '',
          fuel_efficiency_kmpl: '',
          speed_kmh: '',
          carbon_g_per_tkm: ''
        });
        
        // Show success message
        if (result.isNewCustomType) {
          alert(`✅ ${result.message}\n\nA new custom vehicle type has been created with your modifications. The original built-in type remains unchanged.`);
        } else {
          alert(`✅ ${result.message}`);
        }
      } else {
        const error = await response.json();
        alert('❌ Error updating vehicle type: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating vehicle type:', error);
      alert('❌ Failed to update vehicle type');
    } finally {
      setLoadingFleet(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingVehicleType(null);
    setShowAddVehicleType(false);
    setNewVehicleType({
      name: '',
      type: 'Heavy Commercial Vehicle',
      capacity_tons: '',
      cost_per_km: '',
      fixed_cost: '',
      fuel_efficiency_kmpl: '',
      speed_kmh: '',
      carbon_g_per_tkm: ''
    });
  };

  const handleEditFleetVehicle = (vehicle) => {
    setEditingFleetVehicle(vehicle);
    setEditFleetVehicleData({
      count: vehicle.count
    });
    setShowEditFleetVehicle(true);
  };

  const handleUpdateFleetVehicle = async (e) => {
    e.preventDefault();
    setLoadingFleet(true);
    try {
      const countDifference = editFleetVehicleData.count - editingFleetVehicle.count;
      
      if (countDifference > 0) {
        // Add vehicles
        await fetch('/api/fleet/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            vehicleTypeId: editingFleetVehicle.id, 
            count: countDifference 
          })
        });
      } else if (countDifference < 0) {
        // Remove vehicles
        await fetch('/api/fleet/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            vehicleId: editingFleetVehicle.id, 
            count: Math.abs(countDifference) 
          })
        });
      }
      
      await fetchFleet();
      setShowEditFleetVehicle(false);
      setEditingFleetVehicle(null);
      setEditFleetVehicleData({ count: 1 });
    } catch (error) {
      console.error('Error updating fleet vehicle:', error);
      alert('Failed to update fleet vehicle');
    } finally {
      setLoadingFleet(false);
    }
  };

  const handleCancelFleetEdit = () => {
    setEditingFleetVehicle(null);
    setShowEditFleetVehicle(false);
    setEditFleetVehicleData({ count: 1 });
  };

  // Helper functions for plant search
  const getFilteredFromPlants = () => {
    const plants = smartTransport.fromPlantType === 'integrated_unit' 
      ? getIntegratedUnits(smartTransport.fromState)
      : getGrindingUnits(smartTransport.fromState);
    
    // If search field is empty or contains only whitespace, show all plants
    if (!fromPlantSearch || fromPlantSearch.trim() === '') return plants;
    
    // If search field contains the exact text of the currently selected plant, show all plants
    if (smartTransport.fromPlant) {
      const currentPlant = plants.find(p => p.id === smartTransport.fromPlant);
      const currentPlantText = currentPlant ? `${currentPlant.name} - ${currentPlant.city}` : '';
      if (fromPlantSearch === currentPlantText) {
        return plants; // Show all plants when search matches current selection
      }
    }
    
    const searchTerm = fromPlantSearch.toLowerCase().trim();
    return plants.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm) ||
      plant.city.toLowerCase().includes(searchTerm) ||
      `${plant.name} - ${plant.city}`.toLowerCase().includes(searchTerm)
    );
  };

  const getFilteredToPlants = () => {
    const plants = smartTransport.toPlantType === 'integrated_unit'
      ? getIntegratedUnits(smartTransport.toState)
      : getGrindingUnits(smartTransport.toState);
    
    // If search field is empty or contains only whitespace, show all plants
    if (!toPlantSearch || toPlantSearch.trim() === '') return plants;
    
    // If search field contains the exact text of the currently selected plant, show all plants
    if (smartTransport.toPlant) {
      const currentPlant = plants.find(p => p.id === smartTransport.toPlant);
      const currentPlantText = currentPlant ? `${currentPlant.name} - ${currentPlant.city}` : '';
      if (toPlantSearch === currentPlantText) {
        return plants; // Show all plants when search matches current selection
      }
    }
    
    const searchTerm = toPlantSearch.toLowerCase().trim();
    return plants.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm) ||
      plant.city.toLowerCase().includes(searchTerm) ||
      `${plant.name} - ${plant.city}`.toLowerCase().includes(searchTerm)
    );
  };

  const handleFromPlantSelect = (plantId) => {
    setSmartTransport(prev => ({ ...prev, fromPlant: plantId }));
    const allFromPlants = smartTransport.fromPlantType === 'integrated_unit' 
      ? getIntegratedUnits(smartTransport.fromState)
      : getGrindingUnits(smartTransport.fromState);
    const selectedPlant = allFromPlants.find(p => p.id === plantId);
    setFromPlantSearch(selectedPlant ? `${selectedPlant.name} - ${selectedPlant.city}` : '');
    setShowFromPlantDropdown(false);
  };

  const handleToPlantSelect = (plantId) => {
    setSmartTransport(prev => ({ ...prev, toPlant: plantId }));
    const allToPlants = smartTransport.toPlantType === 'integrated_unit'
      ? getIntegratedUnits(smartTransport.toState)
      : getGrindingUnits(smartTransport.toState);
    const selectedPlant = allToPlants.find(p => p.id === plantId);
    setToPlantSearch(selectedPlant ? `${selectedPlant.name} - ${selectedPlant.city}` : '');
    setShowToPlantDropdown(false);
  };

  const handleFromSearchChange = (value) => {
    setFromPlantSearch(value);
    setShowFromPlantDropdown(true);
    // Clear selection if user is typing something different
    if (smartTransport.fromPlant) {
      const allFromPlants = smartTransport.fromPlantType === 'integrated_unit' 
        ? getIntegratedUnits(smartTransport.fromState)
        : getGrindingUnits(smartTransport.fromState);
      const currentPlant = allFromPlants.find(p => p.id === smartTransport.fromPlant);
      const currentPlantText = currentPlant ? `${currentPlant.name} - ${currentPlant.city}` : '';
      if (value !== currentPlantText && value.length > 0) {
        setSmartTransport(prev => ({ ...prev, fromPlant: '' }));
      }
    }
  };

  const handleToSearchChange = (value) => {
    setToPlantSearch(value);
    setShowToPlantDropdown(true);
    // Clear selection if user is typing something different
    if (smartTransport.toPlant) {
      const allToPlants = smartTransport.toPlantType === 'integrated_unit'
        ? getIntegratedUnits(smartTransport.toState)
        : getGrindingUnits(smartTransport.toState);
      const currentPlant = allToPlants.find(p => p.id === smartTransport.toPlant);
      const currentPlantText = currentPlant ? `${currentPlant.name} - ${currentPlant.city}` : '';
      if (value !== currentPlantText && value.length > 0) {
        setSmartTransport(prev => ({ ...prev, toPlant: '' }));
      }
    }
  };

  const clearFromSearch = () => {
    setFromPlantSearch('');
    setSmartTransport(prev => ({ ...prev, fromPlant: '' }));
    setShowFromPlantDropdown(true);
  };

  const clearToSearch = () => {
    setToPlantSearch('');
    setSmartTransport(prev => ({ ...prev, toPlant: '' }));
    setShowToPlantDropdown(true);
  };

  const handleToggleVehicle = async (vehicleId) => {
    setLoadingFleet(true);
    try {
      const response = await fetch(`/api/fleet/${vehicleId}/toggle`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        await fetchFleet();
      } else {
        const error = await response.json();
        alert('Error toggling vehicle: ' + error.error);
      }
    } catch (error) {
      console.error('Error toggling vehicle:', error);
      alert('Failed to toggle vehicle');
    } finally {
      setLoadingFleet(false);
    }
  };

  const vehicleTypeOptions = [
    'Heavy Commercial Vehicle',
    'Multi-Axle Heavy Vehicle',
    'Premium Heavy Vehicle',
    'Intermediate Commercial Vehicle',
    'Light Commercial Vehicle',
    'Mini Truck',
    'Pickup Truck'
  ];

  const handleSmartTransportChange = (field, value) => {
    setSmartTransport(prev => ({ ...prev, [field]: value }));
    
    // Clear plant selection when plant type changes (IU <-> GU switch)
    if (field === 'fromPlantType') {
      setSmartTransport(prev => ({ ...prev, fromPlant: '' }));
      setFromPlantSearch('');
    }
    if (field === 'toPlantType') {
      setSmartTransport(prev => ({ ...prev, toPlant: '' }));
      setToPlantSearch('');
    }
    
    // Reset plant selection when state changes
    if (field === 'fromState') {
      setSmartTransport(prev => ({ ...prev, fromPlant: '' }));
      setFromPlantSearch('');
    }
    if (field === 'toState') {
      setSmartTransport(prev => ({ ...prev, toPlant: '' }));
      setToPlantSearch('');
    }
  };

  const handleGetRecommendations = async () => {
    if (!smartTransport.fromPlant || !smartTransport.toPlant) {
      alert('Please select both source and destination plants');
      return;
    }

    setLoading(true);
    try {
      const fromPlant = getPlantById(smartTransport.fromPlant);
      const toPlant = getPlantById(smartTransport.toPlant);
      
      if (!fromPlant || !toPlant) {
        throw new Error('Invalid plant selection');
      }

      // Get detailed route information using road distance database
      const routeDetails = getRouteDetails(fromPlant, toPlant);
      
      // Create result with enhanced route information
      const result = {
        route: {
          from: fromPlant.name,
          to: toPlant.name,
          distance: routeDetails.distance,
          route: routeDetails.route,
          terrain: routeDetails.terrain,
          tollRoads: routeDetails.tollRoads,
          isRoadDistance: routeDetails.isRoadDistance
        },
        tonnage: smartTransport.tonnage,
        recommendations: []
      };

      // Calculate recommendations using the vehicle database
      const vehicleRecs = getVehicleRecommendations(
        smartTransport.fromPlant,
        smartTransport.toPlant,
        smartTransport.tonnage
      );

      if (vehicleRecs.error) {
        // Fallback to API if local calculation fails
        const response = await fetch('/api/vehicle-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromLocation: smartTransport.fromPlant,
            toLocation: smartTransport.toPlant,
            tonnage: smartTransport.tonnage,
            distance: routeDetails.distance,
            terrain: routeDetails.terrain
          })
        });
        
        if (response.ok) {
          const apiResult = await response.json();
          setRecommendations({ ...result, recommendations: apiResult.recommendations });
        } else {
          throw new Error('Failed to get recommendations');
        }
      } else {
        setRecommendations({ ...result, recommendations: vehicleRecs.recommendations });
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations({ error: 'Failed to get recommendations: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transport-modes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newMode = await response.json();
      setModes([...modes, newMode]);
      setFormData({
        name: 'Road',
        costPerTrip: 8340,
        capacity: 50,
        minBatch: 25
      });
    } catch (error) {
      console.error('Error creating mode:', error);
    }
  };

  const handleTypeChange = (type) => {
    const selectedType = transportTypes.find(t => t.name === type);
    setFormData({
      name: type,
      costPerTrip: selectedType.defaultCost,
      capacity: selectedType.defaultCapacity,
      minBatch: selectedType.defaultBatch
    });
  };

  const getIcon = (modeName) => {
    const type = transportTypes.find(t => t.name === modeName);
    return type ? type.icon : Truck;
  };

  const getEfficiencyBadge = (kmpl) => {
    if (kmpl >= 10) return { label: 'Excellent', color: 'green' };
    if (kmpl >= 7) return { label: 'Good', color: 'blue' };
    if (kmpl >= 5) return { label: 'Average', color: 'yellow' };
    return { label: 'Low', color: 'red' };
  };

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <div className={`flex rounded-lg p-1 ${
        isPremium ? 'bg-premium-dark/50' : 'bg-gray-100'
      }`}>
        <button
          onClick={() => setActiveSection('smart-transport')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeSection === 'smart-transport'
              ? isPremium
                ? 'bg-premium-neon/20 text-premium-neon'
                : 'bg-white text-primary-600 shadow-sm'
              : isPremium
                ? 'text-gray-400 hover:text-premium-neon'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Route size={18} />
          <span>Smart Transport Recommendation</span>
        </button>
        <button
          onClick={() => setActiveSection('transport-config')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeSection === 'transport-config'
              ? isPremium
                ? 'bg-premium-neon/20 text-premium-neon'
                : 'bg-white text-primary-600 shadow-sm'
              : isPremium
                ? 'text-gray-400 hover:text-premium-neon'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Ship size={18} />
          <span>Transport Mode Configuration</span>
        </button>
        <button
          onClick={() => setActiveSection('fleet-management')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
            activeSection === 'fleet-management'
              ? isPremium
                ? 'bg-premium-neon/20 text-premium-neon'
                : 'bg-white text-primary-600 shadow-sm'
              : isPremium
                ? 'text-gray-400 hover:text-premium-neon'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Truck size={18} />
          <span>Fleet Management</span>
        </button>
      </div>

      {/* Smart Transport Recommendation */}
      {activeSection === 'smart-transport' && (
        <div className="space-y-6">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              isPremium
                ? 'glass-card'
                : 'bg-white shadow-sm border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-lg ${
                isPremium
                  ? 'bg-premium-neon/20'
                  : 'bg-blue-50'
              }`}>
                <Route className={isPremium ? 'text-premium-neon' : 'text-blue-600'} size={24} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  Smart Transportation Recommendation
                </h3>
                <p className={`text-sm ${
                  isPremium ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Select states and plants to get optimal vehicle recommendations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Source Selection */}
              <div className="space-y-4">
                <h4 className={`font-medium flex items-center space-x-2 ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  <Factory size={18} />
                  <span>Source Location</span>
                </h4>
                
                {/* From State */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <MapPin size={16} className="inline mr-2" />
                    From State
                  </label>
                  <select
                    value={smartTransport.fromState}
                    onChange={(e) => handleSmartTransportChange('fromState', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                      isPremium
                        ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                    }`}
                  >
                    {stateDatabase.states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name} ({state.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* From Plant Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Plant Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSmartTransportChange('fromPlantType', 'integrated_unit')}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                        smartTransport.fromPlantType === 'integrated_unit'
                          ? isPremium
                            ? 'border-premium-neon bg-premium-neon/20 text-premium-neon'
                            : 'border-primary-500 bg-primary-50 text-primary-600'
                          : isPremium
                            ? 'border-gray-600 text-gray-400 hover:border-premium-neon/50'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Factory size={16} />
                      <span className="text-sm">IU</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSmartTransportChange('fromPlantType', 'grinding_unit')}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                        smartTransport.fromPlantType === 'grinding_unit'
                          ? isPremium
                            ? 'border-premium-neon bg-premium-neon/20 text-premium-neon'
                            : 'border-primary-500 bg-primary-50 text-primary-600'
                          : isPremium
                            ? 'border-gray-600 text-gray-400 hover:border-premium-neon/50'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Building2 size={16} />
                      <span className="text-sm">GU</span>
                    </button>
                  </div>
                </div>

                {/* From Plant */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {smartTransport.fromPlantType === 'integrated_unit' ? 'Integrated Unit' : 'Grinding Unit'}
                  </label>
                  <div className="relative plant-search-dropdown">
                    <input
                      type="text"
                      value={fromPlantSearch}
                      onChange={(e) => handleFromSearchChange(e.target.value)}
                      onFocus={() => setShowFromPlantDropdown(true)}
                      placeholder="Search plants..."
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 placeholder-gray-500'
                      }`}
                    />
                    {showFromPlantDropdown && (
                      <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30'
                          : 'bg-white border-gray-300'
                      }`}>
                        {getFilteredFromPlants().map(plant => (
                          <button
                            key={plant.id}
                            type="button"
                            onClick={() => handleFromPlantSelect(plant.id)}
                            className={`w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                              smartTransport.fromPlant === plant.id
                                ? isPremium
                                  ? 'bg-premium-neon/20 text-premium-neon'
                                  : 'bg-primary-50 text-primary-600'
                                : isPremium
                                  ? 'text-white'
                                  : 'text-gray-900'
                            }`}
                          >
                            <div className="font-medium">{plant.name}</div>
                            <div className={`text-xs ${
                              isPremium ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {plant.city} • {plant.capacity}T capacity
                            </div>
                          </button>
                        ))}
                        {getFilteredFromPlants().length === 0 && (
                          <div className={`px-4 py-2 text-center ${
                            isPremium ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            No plants found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Destination Selection */}
              <div className="space-y-4">
                <h4 className={`font-medium flex items-center space-x-2 ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  <Building2 size={18} />
                  <span>Destination Location</span>
                </h4>
                
                {/* To State */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <MapPin size={16} className="inline mr-2" />
                    To State
                  </label>
                  <select
                    value={smartTransport.toState}
                    onChange={(e) => handleSmartTransportChange('toState', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                      isPremium
                        ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                    }`}
                  >
                    {stateDatabase.states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name} ({state.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Plant Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Plant Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSmartTransportChange('toPlantType', 'integrated_unit')}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                        smartTransport.toPlantType === 'integrated_unit'
                          ? isPremium
                            ? 'border-premium-neon bg-premium-neon/20 text-premium-neon'
                            : 'border-primary-500 bg-primary-50 text-primary-600'
                          : isPremium
                            ? 'border-gray-600 text-gray-400 hover:border-premium-neon/50'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Factory size={16} />
                      <span className="text-sm">IU</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSmartTransportChange('toPlantType', 'grinding_unit')}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                        smartTransport.toPlantType === 'grinding_unit'
                          ? isPremium
                            ? 'border-premium-neon bg-premium-neon/20 text-premium-neon'
                            : 'border-primary-500 bg-primary-50 text-primary-600'
                          : isPremium
                            ? 'border-gray-600 text-gray-400 hover:border-premium-neon/50'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Building2 size={16} />
                      <span className="text-sm">GU</span>
                    </button>
                  </div>
                </div>

                {/* To Plant */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {smartTransport.toPlantType === 'integrated_unit' ? 'Integrated Unit' : 'Grinding Unit'}
                  </label>
                  <div className="relative plant-search-dropdown">
                    <input
                      type="text"
                      value={toPlantSearch}
                      onChange={(e) => handleToSearchChange(e.target.value)}
                      onFocus={() => setShowToPlantDropdown(true)}
                      placeholder="Search plants..."
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 placeholder-gray-500'
                      }`}
                    />
                    {showToPlantDropdown && (
                      <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg border shadow-lg ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30'
                          : 'bg-white border-gray-300'
                      }`}>
                        {getFilteredToPlants().map(plant => (
                          <button
                            key={plant.id}
                            type="button"
                            onClick={() => handleToPlantSelect(plant.id)}
                            className={`w-full px-4 py-2 text-left hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                              smartTransport.toPlant === plant.id
                                ? isPremium
                                  ? 'bg-premium-neon/20 text-premium-neon'
                                  : 'bg-primary-50 text-primary-600'
                                : isPremium
                                  ? 'text-white'
                                  : 'text-gray-900'
                            }`}
                          >
                            <div className="font-medium">{plant.name}</div>
                            <div className={`text-xs ${
                              isPremium ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {plant.city} • {plant.capacity}T capacity
                            </div>
                          </button>
                        ))}
                        {getFilteredToPlants().length === 0 && (
                          <div className={`px-4 py-2 text-center ${
                            isPremium ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            No plants found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tonnage */}
            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${
                isPremium ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Weight size={16} className="inline mr-2" />
                Load (tonnes)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={smartTransport.tonnage}
                  onChange={(e) => handleSmartTransportChange('tonnage', parseInt(e.target.value))}
                  className={`w-full ${
                    isPremium ? 'accent-premium-neon' : 'accent-primary-500'
                  }`}
                />
                <input
                  type="number"
                  value={smartTransport.tonnage}
                  onChange={(e) => handleSmartTransportChange('tonnage', parseInt(e.target.value))}
                  className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
                    isPremium
                      ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                  }`}
                />
              </div>
            </div>

            <motion.button
              onClick={handleGetRecommendations}
              disabled={loading}
              className={`mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : isPremium
                    ? 'bg-gradient-to-r from-premium-gold to-premium-neon text-premium-dark hover:shadow-lg hover:shadow-premium-neon/25'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-t-transparent rounded-full border-current"
                  />
                  <span>Analyzing Route...</span>
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  <span>Get Vehicle Recommendations</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Recommendations Display */}
          {recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {recommendations.error ? (
                <div className={`p-6 rounded-xl ${
                  isPremium
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className={`font-medium ${
                      isPremium ? 'text-red-400' : 'text-red-800'
                    }`}>
                      {recommendations.error}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Route Info */}
                  <div className={`p-4 rounded-xl ${
                    isPremium
                      ? 'glass-card'
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className={`text-sm ${
                        isPremium ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <strong>Route:</strong> {recommendations.route.from} → {recommendations.route.to}
                      </div>
                      <div className={`text-sm ${
                        isPremium ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <strong>Distance:</strong> {recommendations.route.distance} km
                      </div>
                      <div className={`text-sm ${
                        isPremium ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <strong>Load:</strong> {recommendations.tonnage} tonnes
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Recommendations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recommendations.recommendations.slice(0, 4).map((vehicle, index) => {
                      const efficiencyBadge = getEfficiencyBadge(vehicle.efficiency?.kmpl || vehicle.fuel_efficiency_kmpl || 5);
                      
                      return (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-xl ${
                            isPremium
                              ? 'glass-card hover:bg-white/20'
                              : 'bg-white shadow-sm hover:shadow-md border border-gray-200'
                          } transition-all duration-200`}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                index === 0
                                  ? isPremium
                                    ? 'bg-premium-gold/20'
                                    : 'bg-green-50'
                                  : isPremium
                                    ? 'bg-premium-neon/20'
                                    : 'bg-blue-50'
                              }`}>
                                <Truck 
                                  size={20} 
                                  className={
                                    index === 0
                                      ? isPremium ? 'text-premium-gold' : 'text-green-600'
                                      : isPremium ? 'text-premium-neon' : 'text-blue-600'
                                  } 
                                />
                              </div>
                              <div>
                                <h4 className={`font-semibold ${
                                  isPremium ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {vehicle.name}
                                </h4>
                                <p className={`text-sm ${
                                  isPremium ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {vehicle.type}
                                </p>
                              </div>
                            </div>
                            
                            {index === 0 && (
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                isPremium
                                  ? 'bg-premium-gold/20 text-premium-gold'
                                  : 'bg-green-50 text-green-700'
                              }`}>
                                <Award size={12} />
                                <span>Best Choice</span>
                              </div>
                            )}
                          </div>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${
                              isPremium ? 'bg-white/5' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center space-x-2 mb-1">
                                <DollarSign size={14} className={isPremium ? 'text-premium-gold' : 'text-green-600'} />
                                <span className={`text-xs font-medium ${
                                  isPremium ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  Cost per Tonne
                                </span>
                              </div>
                              <p className={`text-lg font-bold ${
                                isPremium ? 'text-white' : 'text-gray-900'
                              }`}>
                                {formatCurrency(vehicle.costPerTon || 3000)}
                              </p>
                            </div>

                            <div className={`p-3 rounded-lg ${
                              isPremium ? 'bg-white/5' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center space-x-2 mb-1">
                                <Fuel size={14} className={isPremium ? 'text-premium-neon' : 'text-blue-600'} />
                                <span className={`text-xs font-medium ${
                                  isPremium ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  Fuel Efficiency
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <p className={`text-lg font-bold ${
                                  isPremium ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {vehicle.efficiency?.kmpl || vehicle.fuel_efficiency_kmpl || 5.2} km/l
                                </p>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  efficiencyBadge.color === 'green'
                                    ? 'bg-green-100 text-green-800'
                                    : efficiencyBadge.color === 'blue'
                                      ? 'bg-blue-100 text-blue-800'
                                      : efficiencyBadge.color === 'yellow'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                  {efficiencyBadge.label}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                                Capacity:
                              </span>
                              <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                                {vehicle.capacity_tons || vehicle.capacity_t || 18.5} tonnes
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                                Trips Required:
                              </span>
                              <span className={isPremium ? 'text-white' : 'text-gray-900'}>
                                {vehicle.trips || Math.ceil(smartTransport.tonnage / (vehicle.capacity_tons || 18.5))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
                                Total Cost:
                              </span>
                              <span className={`font-semibold ${isPremium ? 'text-premium-gold' : 'text-green-600'}`}>
                                {formatCurrency(vehicle.totalCost || (vehicle.costPerTon || 3000) * smartTransport.tonnage)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Traditional Transport Mode Configuration */}
      {activeSection === 'transport-config' && (
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
              Add Transportation Mode
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transport Type Selection */}
              <div>
                <label className={`block text-sm font-medium mb-4 ${
                  isPremium ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Transportation Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {transportTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.name === type.name;
                    
                    return (
                      <motion.button
                        key={type.name}
                        type="button"
                        onClick={() => handleTypeChange(type.name)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? isPremium
                              ? 'border-premium-neon bg-premium-neon/20'
                              : 'border-primary-500 bg-primary-50'
                            : isPremium
                              ? 'border-gray-600 hover:border-premium-neon/50'
                              : 'border-gray-300 hover:border-primary-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon 
                          size={32} 
                          className={`mx-auto mb-2 ${
                            isSelected
                              ? isPremium ? 'text-premium-neon' : 'text-primary-600'
                              : isPremium ? 'text-gray-400' : 'text-gray-500'
                          }`} 
                        />
                        <p className={`font-medium ${
                          isSelected
                            ? isPremium ? 'text-premium-neon' : 'text-primary-600'
                            : isPremium ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {type.name}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cost per Trip */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Cost per Trip (₹)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="4170"
                      max="83400"
                      step="2085"
                      value={formData.costPerTrip}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPerTrip: parseInt(e.target.value) }))}
                      className={`w-full ${
                        isPremium ? 'accent-premium-gold' : 'accent-primary-500'
                      }`}
                    />
                    <input
                      type="number"
                      value={formData.costPerTrip}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPerTrip: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded border ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Capacity per Trip */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Capacity per Trip (tons)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="25"
                      max="750"
                      step="25"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      className={`w-full ${
                        isPremium ? 'accent-premium-neon' : 'accent-primary-500'
                      }`}
                    />
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded border ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Minimum Batch */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isPremium ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Minimum Batch (tons)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={formData.minBatch}
                      onChange={(e) => setFormData(prev => ({ ...prev, minBatch: parseInt(e.target.value) }))}
                      className={`w-full ${
                        isPremium ? 'accent-premium-emerald' : 'accent-primary-500'
                      }`}
                    />
                    <input
                      type="number"
                      value={formData.minBatch}
                      onChange={(e) => setFormData(prev => ({ ...prev, minBatch: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded border ${
                        isPremium
                          ? 'bg-premium-dark border-premium-neon/30 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
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
                <Plus size={20} />
                <span>Add Transport Mode</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Modes List */}
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
              Existing Transportation Modes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modes.map((mode, index) => {
                const Icon = getIcon(mode.name);
                
                return (
                  <motion.div
                    key={mode.id}
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
                      <div className="flex items-center space-x-3">
                        <Icon 
                          size={24} 
                          className={isPremium ? 'text-premium-neon' : 'text-primary-600'} 
                        />
                        <h4 className={`font-semibold ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {mode.name}
                        </h4>
                      </div>
                      <div className="flex space-x-2">
                        <button className={`p-1 rounded transition-colors ${
                          isPremium
                            ? 'hover:bg-premium-neon/20 text-premium-neon'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}>
                          <Edit size={16} />
                        </button>
                        <button className={`p-1 rounded transition-colors ${
                          isPremium
                            ? 'hover:bg-red-500/20 text-red-400'
                            : 'hover:bg-red-50 text-red-600'
                        }`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`space-y-2 text-sm ${
                      isPremium ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className="flex justify-between">
                        <span>Cost per Trip:</span>
                        <span className="font-medium">₹{mode.costPerTrip.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span className="font-medium">{mode.capacity} tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Batch:</span>
                        <span className="font-medium">{mode.minBatch} tons</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Fleet Management */}
      {activeSection === 'fleet-management' && (
        <div className="space-y-6">
          {/* Current Fleet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              isPremium
                ? 'glass-card'
                : 'bg-white shadow-sm border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isPremium
                    ? 'bg-premium-neon/20'
                    : 'bg-blue-50'
                }`}>
                  <Truck className={isPremium ? 'text-premium-neon' : 'text-blue-600'} size={24} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isPremium ? 'text-white' : 'text-gray-900'
                  }`}>
                    Vehicle Fleet Management
                  </h3>
                  <p className={`text-sm ${
                    isPremium ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Total Vehicles: {fleet.totalVehicles}
                  </p>
                </div>
              </div>
              
              {loadingFleet && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-t-transparent rounded-full border-current"
                />
              )}
            </div>

            {/* Current Fleet Vehicles */}
            {fleet.vehicles.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <h4 className={`font-medium ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Fleet ({fleet.vehicles.length} types, {fleet.totalVehicles} vehicles)
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (confirm('Enable all vehicles in fleet?')) {
                        fleet.vehicles.forEach(vehicle => {
                          if (!vehicle.available) {
                            handleToggleVehicle(vehicle.id);
                          }
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isPremium
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                    title="Enable all vehicles"
                  >
                    Enable All
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Disable all vehicles in fleet?')) {
                        fleet.vehicles.forEach(vehicle => {
                          if (vehicle.available) {
                            handleToggleVehicle(vehicle.id);
                          }
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isPremium
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                    title="Disable all vehicles"
                  >
                    Disable All
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {fleet.vehicles.length === 0 ? (
                <div className={`col-span-full text-center py-12 ${
                  isPremium ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Truck size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No vehicles in fleet</p>
                  <p className="text-sm">Add vehicles from the available types below to start building your fleet.</p>
                </div>
              ) : (
                fleet.vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    vehicle.available
                      ? isPremium
                        ? 'bg-premium-dark/50 border-premium-neon/30'
                        : 'bg-green-50 border-green-200'
                      : isPremium
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Truck 
                        size={20} 
                        className={
                          vehicle.available
                            ? isPremium ? 'text-premium-neon' : 'text-green-600'
                            : isPremium ? 'text-red-400' : 'text-red-600'
                        } 
                      />
                      <div>
                        <h4 className={`font-semibold text-sm ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicle.name}
                        </h4>
                        <p className={`text-xs ${
                          isPremium ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {vehicle.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditFleetVehicle(vehicle)}
                        className={`p-1 rounded transition-colors ${
                          isPremium
                            ? 'hover:bg-premium-gold/20 text-premium-gold'
                            : 'hover:bg-blue-50 text-blue-600'
                        }`}
                        title="Edit vehicle count"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleVehicle(vehicle.id)}
                        className={`p-1 rounded transition-colors ${
                          vehicle.available
                            ? isPremium
                              ? 'hover:bg-red-500/20 text-red-400'
                              : 'hover:bg-red-50 text-red-600'
                            : isPremium
                              ? 'hover:bg-green-500/20 text-green-400'
                              : 'hover:bg-green-50 text-green-600'
                        }`}
                        title={vehicle.available ? 'Disable vehicle' : 'Enable vehicle'}
                      >
                        {vehicle.available ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove 1 ${vehicle.name} from fleet?`)) {
                            handleRemoveVehicle(vehicle.id, 1);
                          }
                        }}
                        className={`p-1 rounded transition-colors ${
                          isPremium
                            ? 'hover:bg-red-500/20 text-red-400'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                        title="Remove 1 vehicle"
                      >
                        <Trash2 size={14} />
                      </button>
                      {vehicle.count > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ALL ${vehicle.count} ${vehicle.name}s from fleet?`)) {
                              handleRemoveVehicle(vehicle.id, vehicle.count);
                            }
                          }}
                          className={`p-1 rounded transition-colors text-xs px-2 py-1 ${
                            isPremium
                              ? 'hover:bg-red-500/20 text-red-400 bg-red-500/10'
                              : 'hover:bg-red-100 text-red-600 bg-red-50'
                          }`}
                          title="Remove all vehicles of this type"
                        >
                          All
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className={`space-y-1 text-xs ${
                    isPremium ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex justify-between">
                      <span>Count:</span>
                      <span className="font-medium">{vehicle.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{vehicle.capacity_tons}T</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency:</span>
                      <span className="font-medium">{vehicle.fuel_efficiency_kmpl} km/l</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost/km:</span>
                      <span className={`font-medium ${
                        isPremium ? 'text-premium-gold' : 'text-green-600'
                      }`}>
                        ₹{vehicle.cost_per_km}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        vehicle.available
                          ? isPremium ? 'text-green-400' : 'text-green-600'
                          : isPremium ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {vehicle.available ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    {vehicle.isCustom && (
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className={`font-medium text-xs px-2 py-1 rounded-full ${
                          isPremium
                            ? 'bg-premium-gold/20 text-premium-gold'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          Custom
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
              )}
            </div>

            {/* Edit Fleet Vehicle Modal */}
            {showEditFleetVehicle && editingFleetVehicle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-lg border ${
                  isPremium
                    ? 'bg-premium-dark/30 border-premium-gold/30'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <h4 className={`text-lg font-semibold mb-4 ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  Edit Fleet Vehicle: {editingFleetVehicle.name}
                </h4>
                
                <form onSubmit={handleUpdateFleetVehicle} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isPremium ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Vehicle Count *
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={editFleetVehicleData.count}
                        onChange={(e) => setEditFleetVehicleData(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                        className={`flex-1 ${
                          isPremium ? 'accent-premium-gold' : 'accent-blue-500'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={editFleetVehicleData.count}
                        onChange={(e) => setEditFleetVehicleData(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                        className={`w-20 px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                        }`}
                        required
                      />
                    </div>
                    <p className={`text-xs mt-1 ${
                      isPremium ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Current: {editingFleetVehicle.count} vehicles
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      type="submit"
                      disabled={loadingFleet}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        loadingFleet
                          ? 'opacity-50 cursor-not-allowed'
                          : isPremium
                            ? 'bg-premium-gold text-premium-dark hover:bg-premium-gold/90'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      whileHover={!loadingFleet ? { scale: 1.05 } : {}}
                      whileTap={!loadingFleet ? { scale: 0.95 } : {}}
                    >
                      <Edit size={16} />
                      <span>Update Vehicle Count</span>
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={handleCancelFleetEdit}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isPremium
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Add New Vehicles */}
            <div className={`border-t pt-6 ${
              isPremium ? 'border-premium-neon/30' : 'border-gray-200'
            }`}>
              <h4 className={`font-medium mb-4 ${
                isPremium ? 'text-white' : 'text-gray-900'
              }`}>
                Add Vehicles to Fleet
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fleet.availableTypes.map((vehicleType, index) => (
                  <motion.div
                    key={vehicleType.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      isPremium
                        ? 'bg-premium-dark/30 border-premium-neon/20 hover:border-premium-neon/50'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    } transition-all relative group`}
                  >
                    {/* Edit/Delete Buttons - Top Right Corner */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditVehicleType(vehicleType);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          isPremium
                            ? 'bg-premium-neon/20 text-premium-neon hover:bg-premium-neon/30'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                        title={vehicleType.isCustom ? 'Edit vehicle specifications' : 'Create custom version with modifications'}
                      >
                        <Edit size={14} />
                      </button>
                      
                      {vehicleType.isCustom && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete "${vehicleType.name}"? This will also remove it from your fleet.`)) {
                              handleDeleteVehicleType(vehicleType.id);
                            }
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            isPremium
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                          title="Delete custom vehicle type"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 mb-3">
                      <button
                        onClick={() => handleAddVehicle(vehicleType.id, 1)}
                        className={`p-2 rounded-lg transition-colors ${
                          isPremium
                            ? 'bg-premium-gold/20 text-premium-gold hover:bg-premium-gold/30'
                            : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                        }`}
                        title="Add to fleet"
                      >
                        <Plus size={16} />
                      </button>
                      <div>
                        <h5 className={`font-semibold text-sm ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicleType.name}
                        </h5>
                        <p className={`text-xs ${
                          isPremium ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {vehicleType.type}
                        </p>
                        {vehicleType.isCustom && (
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            isPremium
                              ? 'bg-premium-gold/20 text-premium-gold'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Custom
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`space-y-2 text-xs ${
                      isPremium ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span>Capacity:</span>
                        <span className={`font-medium ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicleType.capacity_tons}T
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Efficiency:</span>
                        <span className={`font-medium ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicleType.fuel_efficiency_kmpl} km/l
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cost/km:</span>
                        <span className={`font-medium ${
                          isPremium ? 'text-premium-gold' : 'text-green-600'
                        }`}>
                          ₹{vehicleType.cost_per_km}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Fixed Cost:</span>
                        <span className={`font-medium ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          ₹{vehicleType.fixed_cost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Speed:</span>
                        <span className={`font-medium ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicleType.speed_kmh} km/h
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditVehicleType(vehicleType);
                          }}
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isPremium
                              ? 'bg-premium-neon/20 text-premium-neon hover:bg-premium-neon/30'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                          title={vehicleType.isCustom ? 'Edit vehicle specifications' : 'Create custom version with modifications'}
                        >
                          <Edit size={12} />
                          <span>{vehicleType.isCustom ? 'Edit' : 'Customize'}</span>
                        </button>
                        
                        {vehicleType.isCustom && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete "${vehicleType.name}"? This will also remove it from your fleet.`)) {
                                handleDeleteVehicleType(vehicleType.id);
                              }
                            }}
                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isPremium
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                            title="Delete custom vehicle type"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddVehicle(vehicleType.id, 1)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isPremium
                            ? 'bg-premium-gold/20 text-premium-gold hover:bg-premium-gold/30'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <Plus size={12} />
                        <span>Add to Fleet</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vehicle Type Management */}
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isPremium
                    ? 'bg-premium-gold/20'
                    : 'bg-purple-50'
                }`}>
                  <Plus className={isPremium ? 'text-premium-gold' : 'text-purple-600'} size={24} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isPremium ? 'text-white' : 'text-gray-900'
                  }`}>
                    Vehicle Type Management
                  </h3>
                  <p className={`text-sm ${
                    isPremium ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Total Types: {vehicleTypes.totalTypes} | Custom: {vehicleTypes.customTypes} | Built-in: {vehicleTypes.builtInTypes}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={() => setShowAddVehicleType(!showAddVehicleType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isPremium
                    ? 'bg-premium-gold/20 text-premium-gold hover:bg-premium-gold/30'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                <span>Add Vehicle Type</span>
              </motion.button>
            </div>

            {/* Add/Edit Vehicle Type Form */}
            {showAddVehicleType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                data-vehicle-type-form
                className={`mb-6 p-4 rounded-lg border ${
                  isPremium
                    ? 'bg-premium-dark/30 border-premium-gold/30'
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <h4 className={`text-lg font-semibold mb-4 ${
                  isPremium ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingVehicleType ? (
                    <span className="flex items-center space-x-2">
                      <Edit size={20} />
                      <span>Edit Vehicle Type: {editingVehicleType.name}</span>
                      {!editingVehicleType.isCustom && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isPremium
                            ? 'bg-premium-gold/20 text-premium-gold'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          Will create custom copy
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Plus size={20} />
                      <span>Add New Vehicle Type</span>
                    </span>
                  )}
                </h4>
                
                <form onSubmit={editingVehicleType ? handleUpdateVehicleType : handleCreateVehicleType} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Vehicle Name *
                      </label>
                      <input
                        type="text"
                        value={newVehicleType.name}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Custom Truck 2024"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Vehicle Type *
                      </label>
                      <select
                        value={newVehicleType.type}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, type: e.target.value }))}
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      >
                        {vehicleTypeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Capacity (tonnes) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newVehicleType.capacity_tons}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, capacity_tons: e.target.value }))}
                        placeholder="18.5"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Cost per KM (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newVehicleType.cost_per_km}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, cost_per_km: e.target.value }))}
                        placeholder="42"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Fixed Cost (₹) *
                      </label>
                      <input
                        type="number"
                        value={newVehicleType.fixed_cost}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, fixed_cost: e.target.value }))}
                        placeholder="5000"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Fuel Efficiency (km/l) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newVehicleType.fuel_efficiency_kmpl}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, fuel_efficiency_kmpl: e.target.value }))}
                        placeholder="5.2"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Speed (km/h) *
                      </label>
                      <input
                        type="number"
                        value={newVehicleType.speed_kmh}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, speed_kmh: e.target.value }))}
                        placeholder="48"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isPremium ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Carbon Emissions (g/t-km) *
                      </label>
                      <input
                        type="number"
                        value={newVehicleType.carbon_g_per_tkm}
                        onChange={(e) => setNewVehicleType(prev => ({ ...prev, carbon_g_per_tkm: e.target.value }))}
                        placeholder="65"
                        className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                          isPremium
                            ? 'bg-premium-dark border-premium-neon/30 text-white focus:ring-premium-neon'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500'
                        }`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      type="submit"
                      disabled={loadingFleet}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        loadingFleet
                          ? 'opacity-50 cursor-not-allowed'
                          : isPremium
                            ? 'bg-premium-gold text-premium-dark hover:bg-premium-gold/90'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                      whileHover={!loadingFleet ? { scale: 1.05 } : {}}
                      whileTap={!loadingFleet ? { scale: 0.95 } : {}}
                    >
                      {editingVehicleType ? <Edit size={16} /> : <Plus size={16} />}
                      <span>
                        {editingVehicleType 
                          ? (editingVehicleType.isCustom ? 'Update Vehicle Type' : 'Create Custom Version')
                          : 'Create Vehicle Type'
                        }
                      </span>
                    </motion.button>
                    
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isPremium
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Vehicle Types List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleTypes.vehicleTypes.map((vehicleType, index) => (
                <motion.div
                  key={vehicleType.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    vehicleType.isCustom
                      ? isPremium
                        ? 'bg-premium-gold/10 border-premium-gold/30'
                        : 'bg-purple-50 border-purple-200'
                      : isPremium
                        ? 'bg-premium-dark/50 border-premium-neon/30'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Truck 
                        size={20} 
                        className={
                          vehicleType.isCustom
                            ? isPremium ? 'text-premium-gold' : 'text-purple-600'
                            : isPremium ? 'text-premium-neon' : 'text-blue-600'
                        } 
                      />
                      <div>
                        <h4 className={`font-semibold text-sm ${
                          isPremium ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vehicleType.name}
                        </h4>
                        <p className={`text-xs ${
                          isPremium ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {vehicleType.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {vehicleType.isCustom && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isPremium
                            ? 'bg-premium-gold/20 text-premium-gold'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          Custom
                        </span>
                      )}
                      {vehicleType.isCustom && (
                        <>
                          <button
                            onClick={() => handleEditVehicleType(vehicleType)}
                            className={`p-1 rounded transition-colors ${
                              isPremium
                                ? 'hover:bg-premium-gold/20 text-premium-gold'
                                : 'hover:bg-purple-50 text-purple-600'
                            }`}
                            title="Edit vehicle type"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicleType(vehicleType.id)}
                            className={`p-1 rounded transition-colors ${
                              isPremium
                                ? 'hover:bg-red-500/20 text-red-400'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                            title="Delete vehicle type"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className={`space-y-1 text-xs ${
                    isPremium ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="font-medium">{vehicleType.capacity_tons}T</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Efficiency:</span>
                      <span className="font-medium">{vehicleType.fuel_efficiency_kmpl} km/l</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost/km:</span>
                      <span className="font-medium">₹{vehicleType.cost_per_km}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TransportModeForm;