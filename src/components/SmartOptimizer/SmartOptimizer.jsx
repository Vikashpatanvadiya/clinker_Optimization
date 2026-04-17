import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Package, Clock, Zap, Search, Building2, ChevronDown, Loader2,
  Trophy, Truck, Leaf, ChevronUp, Route, RefreshCw, Sparkles, Calculator, Info
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================================================
// PLANT DATABASE - All Adani Group Cement Plants with Coordinates
// ============================================================================
const PLANTS = {
  integratedUnits: [
    { id: 'iu_ap_boyareddypalli', name: 'Penna Boyareddypalli', state: 'Andhra Pradesh', city: 'Boyareddypalli', lat: 14.88, lng: 77.92, capacity: 2400, inventory: 1920, productionCost: 2275, brand: 'Penna' },
    { id: 'iu_ap_talaricheruvu', name: 'Penna Talaricheruvu', state: 'Andhra Pradesh', city: 'Talaricheruvu', lat: 14.92, lng: 78.02, capacity: 2200, inventory: 1760, productionCost: 2300, brand: 'Penna' },
    { id: 'iu_cg_jamul', name: 'ACC Jamul', state: 'Chhattisgarh', city: 'Jamul', lat: 21.19, lng: 81.40, capacity: 3500, inventory: 2800, productionCost: 2150, brand: 'ACC' },
    { id: 'iu_cg_bhatapara', name: 'Ambuja Bhatapara', state: 'Chhattisgarh', city: 'Bhatapara', lat: 21.73, lng: 81.93, capacity: 4500, inventory: 3600, productionCost: 2100, brand: 'Ambuja' },
    { id: 'iu_gj_sanghi', name: 'Sanghi Kutch', state: 'Gujarat', city: 'Kutch', lat: 23.25, lng: 69.67, capacity: 5000, inventory: 4000, productionCost: 2050, brand: 'Sanghi' },
    { id: 'iu_gj_ambujanagar', name: 'Ambuja Ambujanagar', state: 'Gujarat', city: 'Ambujanagar', lat: 20.95, lng: 70.75, capacity: 9000, inventory: 7200, productionCost: 2000, brand: 'Ambuja' },
    { id: 'iu_hp_gagal', name: 'ACC Gagal', state: 'Himachal Pradesh', city: 'Gagal', lat: 31.25, lng: 76.85, capacity: 3000, inventory: 2400, productionCost: 2400, brand: 'ACC' },
    { id: 'iu_hp_darlaghat', name: 'Ambuja Darlaghat', state: 'Himachal Pradesh', city: 'Darlaghat', lat: 31.24, lng: 76.95, capacity: 3500, inventory: 2800, productionCost: 2400, brand: 'Ambuja' },
    { id: 'iu_jh_chaibasa', name: 'ACC Chaibasa', state: 'Jharkhand', city: 'Chaibasa', lat: 22.55, lng: 85.81, capacity: 2800, inventory: 2240, productionCost: 2200, brand: 'ACC' },
    { id: 'iu_ka_kalaburagi', name: 'Orient Kalaburagi', state: 'Karnataka', city: 'Kalaburagi', lat: 17.33, lng: 76.83, capacity: 3200, inventory: 2560, productionCost: 2175, brand: 'Orient' },
    { id: 'iu_ka_wadi', name: 'ACC Wadi', state: 'Karnataka', city: 'Wadi', lat: 17.06, lng: 76.98, capacity: 4000, inventory: 3200, productionCost: 2150, brand: 'ACC' },
    { id: 'iu_mp_kymore', name: 'ACC Kymore', state: 'Madhya Pradesh', city: 'Kymore', lat: 24.03, lng: 80.58, capacity: 3800, inventory: 3040, productionCost: 2175, brand: 'ACC' },
    { id: 'iu_mp_ametha', name: 'ACC Ametha', state: 'Madhya Pradesh', city: 'Ametha', lat: 23.95, lng: 80.60, capacity: 2500, inventory: 2000, productionCost: 2250, brand: 'ACC' },
    { id: 'iu_mh_jalgaon', name: 'Orient Jalgaon', state: 'Maharashtra', city: 'Jalgaon', lat: 21.01, lng: 75.56, capacity: 2800, inventory: 2240, productionCost: 2200, brand: 'Orient' },
    { id: 'iu_mh_chanda', name: 'ACC Chanda', state: 'Maharashtra', city: 'Chanda', lat: 19.92, lng: 79.28, capacity: 3500, inventory: 2800, productionCost: 2175, brand: 'ACC' },
    { id: 'iu_mh_solapur', name: 'Ambuja Solapur', state: 'Maharashtra', city: 'Solapur', lat: 17.66, lng: 75.91, capacity: 4200, inventory: 3360, productionCost: 2125, brand: 'Ambuja' },
    { id: 'iu_od_bargarh', name: 'ACC Bargarh', state: 'Odisha', city: 'Bargarh', lat: 21.33, lng: 83.62, capacity: 3200, inventory: 2560, productionCost: 2150, brand: 'ACC' },
    { id: 'iu_rj_marwar', name: 'Ambuja Marwar', state: 'Rajasthan', city: 'Marwar Mundwa', lat: 26.91, lng: 73.85, capacity: 6000, inventory: 4800, productionCost: 2150, brand: 'Ambuja' },
    { id: 'iu_rj_rabriyawas', name: 'Ambuja Rabriyawas', state: 'Rajasthan', city: 'Rabriyawas', lat: 26.50, lng: 74.00, capacity: 4500, inventory: 3600, productionCost: 2200, brand: 'Ambuja' },
    { id: 'iu_rj_lakheri', name: 'ACC Lakheri', state: 'Rajasthan', city: 'Lakheri', lat: 25.67, lng: 76.17, capacity: 4000, inventory: 3200, productionCost: 2275, brand: 'ACC' },
    { id: 'iu_ts_mancherial', name: 'Penna Mancherial', state: 'Telangana', city: 'Mancherial', lat: 18.87, lng: 79.44, capacity: 3000, inventory: 2400, productionCost: 2225, brand: 'Penna' },
    { id: 'iu_ts_tandur', name: 'Penna Tandur', state: 'Telangana', city: 'Tandur', lat: 17.26, lng: 77.59, capacity: 2400, inventory: 1920, productionCost: 2300, brand: 'Penna' },
  ],
  grindingUnits: [
    { id: 'gu_ap_vizag', name: 'ACC Visakhapatnam', state: 'Andhra Pradesh', city: 'Visakhapatnam', lat: 17.69, lng: 83.22, capacity: 1900, demand: 1520, brand: 'ACC' },
    { id: 'gu_gj_dahej', name: 'ACIL Dahej', state: 'Gujarat', city: 'Dahej', lat: 21.70, lng: 72.58, capacity: 2000, demand: 1600, brand: 'ACIL' },
    { id: 'gu_gj_surat', name: 'Ambuja Surat', state: 'Gujarat', city: 'Surat', lat: 21.17, lng: 72.83, capacity: 2500, demand: 2000, brand: 'Ambuja' },
    { id: 'gu_hp_nalagarh', name: 'Ambuja Nalagarh', state: 'Himachal Pradesh', city: 'Nalagarh', lat: 31.04, lng: 76.71, capacity: 2000, demand: 1600, brand: 'Ambuja' },
    { id: 'gu_jh_dhanbad', name: 'ACC Dhanbad', state: 'Jharkhand', city: 'Dhanbad', lat: 23.80, lng: 86.43, capacity: 1600, demand: 1280, brand: 'ACC' },
    { id: 'gu_ka_bellary', name: 'ACC Bellary', state: 'Karnataka', city: 'Bellary', lat: 15.18, lng: 76.81, capacity: 1800, demand: 1440, brand: 'ACC' },
    { id: 'gu_ka_kolar', name: 'ACC Kolar', state: 'Karnataka', city: 'Kolar', lat: 13.51, lng: 77.42, capacity: 1500, demand: 1200, brand: 'ACC' },
    { id: 'gu_kl_kochi', name: 'Ambuja Kochi', state: 'Kerala', city: 'Kochi', lat: 9.93, lng: 76.27, capacity: 1600, demand: 1280, brand: 'Ambuja' },
    { id: 'gu_mh_kalamboli', name: 'ACC Kalamboli', state: 'Maharashtra', city: 'Kalamboli', lat: 19.03, lng: 73.10, capacity: 2000, demand: 1600, brand: 'ACC' },
    { id: 'gu_mh_panvel', name: 'Ambuja Panvel', state: 'Maharashtra', city: 'Panvel', lat: 18.99, lng: 73.12, capacity: 2200, demand: 1760, brand: 'Ambuja' },
    { id: 'gu_od_gopalpur', name: 'Penna Gopalpur', state: 'Odisha', city: 'Gopalpur', lat: 19.26, lng: 84.91, capacity: 1500, demand: 1200, brand: 'Penna' },
    { id: 'gu_pb_rajpura', name: 'ACC Rajpura', state: 'Punjab', city: 'Rajpura', lat: 30.48, lng: 76.59, capacity: 2000, demand: 1600, brand: 'ACC' },
    { id: 'gu_pb_ropar', name: 'Ambuja Ropar', state: 'Punjab', city: 'Ropar', lat: 30.97, lng: 76.53, capacity: 2200, demand: 1760, brand: 'Ambuja' },
    { id: 'gu_pb_bathinda', name: 'Ambuja Bathinda', state: 'Punjab', city: 'Bathinda', lat: 30.21, lng: 74.95, capacity: 1800, demand: 1440, brand: 'Ambuja' },
    { id: 'gu_tn_madukkarai', name: 'ACC Madukkarai', state: 'Tamil Nadu', city: 'Madukkarai', lat: 10.91, lng: 76.96, capacity: 1800, demand: 1440, brand: 'ACC' },
    { id: 'gu_tn_tuticorin', name: 'Ambuja Tuticorin', state: 'Tamil Nadu', city: 'Tuticorin', lat: 8.76, lng: 78.13, capacity: 2000, demand: 1600, brand: 'Ambuja' },
    { id: 'gu_up_dadri', name: 'Ambuja Dadri', state: 'Uttar Pradesh', city: 'Dadri', lat: 28.55, lng: 77.55, capacity: 2200, demand: 1760, brand: 'Ambuja' },
    { id: 'gu_up_tikaria', name: 'ACC Tikaria', state: 'Uttar Pradesh', city: 'Tikaria', lat: 26.24, lng: 81.33, capacity: 1800, demand: 1440, brand: 'ACC' },
    { id: 'gu_uk_roorkee', name: 'Ambuja Roorkee', state: 'Uttarakhand', city: 'Roorkee', lat: 29.85, lng: 77.88, capacity: 2000, demand: 1600, brand: 'Ambuja' },
    { id: 'gu_wb_farakka', name: 'Ambuja Farakka', state: 'West Bengal', city: 'Farakka', lat: 24.78, lng: 87.91, capacity: 2200, demand: 1760, brand: 'Ambuja' },
    { id: 'gu_wb_sankrail', name: 'Ambuja Sankrail', state: 'West Bengal', city: 'Sankrail', lat: 22.58, lng: 88.25, capacity: 2000, demand: 1600, brand: 'Ambuja' },
  ]
};

// ============================================================================
// VEHICLE DATABASE - Indian Trucking Industry Standard Rates
// Batch size = truck capacity, Freight cost per batch based on distance
// ============================================================================
const VEHICLES = [
  { id: 'tata_1109', name: 'Tata 1109 (9T)', type: 'MCV', capacity: 9, baseFreightPerKm: 4.5, speed: 40, co2PerKm: 0.35 },
  { id: 'tata_1618', name: 'Tata 1618 (16T)', type: 'HCV', capacity: 16, baseFreightPerKm: 5.2, speed: 38, co2PerKm: 0.48 },
  { id: 'ashok_2518', name: 'Ashok 2518 (18T)', type: 'HCV', capacity: 18, baseFreightPerKm: 5.5, speed: 36, co2PerKm: 0.52 },
  { id: 'tata_2518', name: 'Tata 2518 (25T)', type: 'HCV', capacity: 25, baseFreightPerKm: 6.0, speed: 35, co2PerKm: 0.58 },
  { id: 'bharatbenz_3123', name: 'BharatBenz 3123 (31T)', type: 'MAV', capacity: 31, baseFreightPerKm: 6.5, speed: 34, co2PerKm: 0.65 },
  { id: 'volvo_fm', name: 'Volvo FM (35T)', type: 'Premium', capacity: 35, baseFreightPerKm: 7.2, speed: 40, co2PerKm: 0.70 },
];

// ============================================================================
// DISTANCE CALCULATION - Haversine + Road Factor
// ============================================================================
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightLine = R * c;
  // Road factor accounts for actual road distance vs straight line
  let roadFactor = 1.25;
  if (straightLine < 100) roadFactor = 1.15;
  else if (straightLine < 300) roadFactor = 1.20;
  else if (straightLine < 600) roadFactor = 1.25;
  else if (straightLine < 1000) roadFactor = 1.30;
  else roadFactor = 1.35;
  return Math.round(straightLine * roadFactor);
}

// ============================================================================
// COST CALCULATION ENGINE - Realistic Indian Logistics Costs
// Based on: Production Cost + Transportation Cost (Freight per batch)
// ============================================================================
function calculateTransportCost(distance, tonnage, vehicle, source) {
  // Number of truck trips needed
  const trips = Math.ceil(tonnage / vehicle.capacity);
  
  // Freight cost calculation (one-way, trucks return empty in clinker transport)
  // Base freight = distance × rate per km × trips
  const freightPerTrip = distance * vehicle.baseFreightPerKm;
  const totalFreight = freightPerTrip * trips;
  
  // Per tonne freight cost
  const freightPerTonne = totalFreight / tonnage;
  
  // Production cost (from source plant)
  const productionCost = source.productionCost * tonnage;
  
  // Total cost = Production + Transport
  const totalCost = productionCost + totalFreight;
  const costPerTonne = Math.round(totalCost / tonnage);
  
  // Delivery time calculation
  const hoursPerTrip = (distance / vehicle.speed) + 2; // +2 hours for loading/unloading
  const tripsPerDay = Math.floor(10 / hoursPerTrip) || 1; // 10 working hours per day
  const deliveryDays = Math.ceil(trips / tripsPerDay);
  
  // CO2 emissions
  const co2Emissions = Math.round(distance * trips * vehicle.co2PerKm);
  
  return {
    totalCost: Math.round(totalCost),
    costPerTonne,
    productionCost: Math.round(productionCost),
    freightCost: Math.round(totalFreight),
    freightPerTonne: Math.round(freightPerTonne),
    freightPerTrip: Math.round(freightPerTrip),
    trips,
    deliveryDays: Math.max(1, deliveryDays),
    co2Emissions,
    breakdown: {
      production: { total: Math.round(productionCost), perTonne: source.productionCost },
      freight: { total: Math.round(totalFreight), perTonne: Math.round(freightPerTonne), perTrip: Math.round(freightPerTrip) }
    }
  };
}

// ============================================================================
// SMART OPTIMIZATION ENGINE
// Finds best routes considering: Total Cost, Delivery Time, CO2, Risk
// ============================================================================
function smartOptimize(destinationId, quantity) {
  const allPlants = [...PLANTS.grindingUnits, ...PLANTS.integratedUnits];
  const destination = allPlants.find(p => p.id === destinationId);
  if (!destination) return null;
  
  const sources = PLANTS.integratedUnits.filter(iu => iu.inventory >= 100);
  
  // Calculate all route options
  const routeOptions = sources.map(source => {
    const distance = calculateDistance(source.lat, source.lng, destination.lat, destination.lng);
    
    // Find best vehicle for this route (lowest cost per tonne)
    const vehicleOptions = VEHICLES.map(vehicle => {
      const cost = calculateTransportCost(distance, quantity, vehicle, source);
      return { vehicle, ...cost };
    });
    
    // Best vehicle = lowest total cost per tonne
    const bestVehicle = vehicleOptions.reduce((best, current) => 
      current.costPerTonne < best.costPerTonne ? current : best
    );
    
    return {
      source,
      distance,
      bestVehicle,
      allVehicleOptions: vehicleOptions,
      availableInventory: source.inventory,
      canFulfill: source.inventory >= quantity
    };
  });
  
  // Sort by total cost per tonne (lowest first = best value)
  routeOptions.sort((a, b) => a.bestVehicle.costPerTonne - b.bestVehicle.costPerTonne);
  
  const recommendations = [];
  
  // OPTION 1: Best Value (Lowest Total Cost) - This IS the best option
  const bestOption = routeOptions.find(r => r.canFulfill);
  if (bestOption) {
    recommendations.push({
      type: 'best_value',
      label: '✓ Best Value (Recommended)',
      description: `Lowest total cost from ${bestOption.source.name}`,
      whyBest: 'Lowest cost per tonne considering both production and transport',
      sources: [{
        plant: bestOption.source,
        quantity,
        distance: bestOption.distance,
        vehicle: bestOption.bestVehicle.vehicle,
        ...bestOption.bestVehicle
      }],
      totalCost: bestOption.bestVehicle.totalCost,
      costPerTonne: bestOption.bestVehicle.costPerTonne,
      totalDistance: bestOption.distance,
      co2Emissions: bestOption.bestVehicle.co2Emissions,
      deliveryDays: bestOption.bestVehicle.deliveryDays,
      breakdown: bestOption.bestVehicle.breakdown
    });
  }

  // OPTION 2: Fastest Delivery (may cost more but delivers quicker)
  const fastestOption = [...routeOptions]
    .filter(r => r.canFulfill)
    .sort((a, b) => a.bestVehicle.deliveryDays - b.bestVehicle.deliveryDays)[0];
  
  if (fastestOption && fastestOption.source.id !== bestOption?.source.id) {
    recommendations.push({
      type: 'fastest',
      label: '⚡ Fastest Delivery',
      description: `Quickest delivery from ${fastestOption.source.name}`,
      whyBest: 'Shortest delivery time - useful for urgent requirements',
      sources: [{
        plant: fastestOption.source,
        quantity,
        distance: fastestOption.distance,
        vehicle: fastestOption.bestVehicle.vehicle,
        ...fastestOption.bestVehicle
      }],
      totalCost: fastestOption.bestVehicle.totalCost,
      costPerTonne: fastestOption.bestVehicle.costPerTonne,
      totalDistance: fastestOption.distance,
      co2Emissions: fastestOption.bestVehicle.co2Emissions,
      deliveryDays: fastestOption.bestVehicle.deliveryDays,
      breakdown: fastestOption.bestVehicle.breakdown
    });
  }

  // OPTION 3: Split Shipment (Risk Diversification)
  if (routeOptions.length >= 2 && quantity > 200) {
    const top2 = routeOptions.filter(r => r.canFulfill || r.availableInventory >= quantity * 0.3).slice(0, 2);
    if (top2.length >= 2) {
      const split1 = Math.ceil(quantity * 0.6);
      const split2 = quantity - split1;
      const cost1 = calculateTransportCost(top2[0].distance, split1, top2[0].bestVehicle.vehicle, top2[0].source);
      const cost2 = calculateTransportCost(top2[1].distance, split2, top2[1].bestVehicle.vehicle, top2[1].source);
      
      recommendations.push({
        type: 'split_shipment',
        label: '🔀 Split Shipment',
        description: `${split1}T from ${top2[0].source.name}, ${split2}T from ${top2[1].source.name}`,
        whyBest: 'Reduces supply risk by using multiple sources',
        sources: [
          { plant: top2[0].source, quantity: split1, distance: top2[0].distance, vehicle: top2[0].bestVehicle.vehicle, ...cost1 },
          { plant: top2[1].source, quantity: split2, distance: top2[1].distance, vehicle: top2[1].bestVehicle.vehicle, ...cost2 }
        ],
        totalCost: cost1.totalCost + cost2.totalCost,
        costPerTonne: Math.round((cost1.totalCost + cost2.totalCost) / quantity),
        totalDistance: top2[0].distance + top2[1].distance,
        co2Emissions: cost1.co2Emissions + cost2.co2Emissions,
        deliveryDays: Math.max(cost1.deliveryDays, cost2.deliveryDays),
        breakdown: {
          production: { total: cost1.breakdown.production.total + cost2.breakdown.production.total },
          freight: { total: cost1.breakdown.freight.total + cost2.breakdown.freight.total }
        }
      });
    }
  }
  
  // OPTION 4: Eco-Friendly (Lowest CO2)
  const ecoOption = [...routeOptions]
    .filter(r => r.canFulfill)
    .sort((a, b) => a.bestVehicle.co2Emissions - b.bestVehicle.co2Emissions)[0];
  
  if (ecoOption && ecoOption.source.id !== bestOption?.source.id) {
    recommendations.push({
      type: 'eco_friendly',
      label: '🌱 Eco-Friendly',
      description: `Lowest carbon footprint from ${ecoOption.source.name}`,
      whyBest: 'Minimizes environmental impact - good for sustainability goals',
      sources: [{
        plant: ecoOption.source,
        quantity,
        distance: ecoOption.distance,
        vehicle: ecoOption.bestVehicle.vehicle,
        ...ecoOption.bestVehicle
      }],
      totalCost: ecoOption.bestVehicle.totalCost,
      costPerTonne: ecoOption.bestVehicle.costPerTonne,
      totalDistance: ecoOption.distance,
      co2Emissions: ecoOption.bestVehicle.co2Emissions,
      deliveryDays: ecoOption.bestVehicle.deliveryDays,
      breakdown: ecoOption.bestVehicle.breakdown
    });
  }
  
  return { destination, quantity, recommendations, allRoutes: routeOptions.slice(0, 10) };
}

// ============================================================================
// REACT COMPONENT
// ============================================================================
export default function SmartOptimizer() {
  const { isPremium } = useTheme();
  const [destination, setDestination] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [urgency, setUrgency] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedOption, setExpandedOption] = useState(0);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);

  const allDestinations = [...PLANTS.grindingUnits, ...PLANTS.integratedUnits];
  const filteredDestinations = allDestinations.filter(plant =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.state.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedPlant = allDestinations.find(p => p.id === destination);

  const handleOptimize = async () => {
    if (!destination || quantity < 10) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const data = smartOptimize(destination, quantity);
    setResult(data);
    setIsLoading(false);
    setExpandedOption(0);
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  const urgencyOptions = [
    { id: 'immediate', label: 'Immediate', desc: '1-2 days' },
    { id: 'week', label: 'This Week', desc: '3-5 days' },
    { id: 'month', label: 'This Month', desc: '7-14 days' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl lg:text-3xl font-bold ${isPremium ? 'premium-text-gradient' : 'text-gray-900'}`}>
          Smart Logistics Optimizer
        </h1>
        <p className={`mt-1 ${isPremium ? 'text-gray-300' : 'text-gray-600'}`}>
          Real-time route optimization with accurate cost calculations
        </p>
      </div>

      {/* Input Form */}
      {!result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl overflow-hidden ${isPremium ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'}`}>
          
          {/* Destination */}
          <div className={`p-6 border-b ${isPremium ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <MapPin className={`w-4 h-4 ${isPremium ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>Destination</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Where do you need clinker?</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search plant, city, or state..."
                className={`w-full pl-12 pr-12 py-4 rounded-xl border focus:outline-none focus:ring-2 ${
                  isPremium ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500'
                }`} />
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />

              {showDropdown && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className={`absolute z-50 w-full mt-2 rounded-xl shadow-2xl max-h-64 overflow-y-auto ${
                    isPremium ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                  {filteredDestinations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No plants found</div>
                  ) : filteredDestinations.map((plant) => (
                    <button key={plant.id}
                      onClick={() => { setDestination(plant.id); setSearchQuery(plant.name); setShowDropdown(false); }}
                      className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                        destination === plant.id ? isPremium ? 'bg-blue-500/20' : 'bg-blue-50'
                        : isPremium ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}>
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div className="text-left flex-1">
                        <p className={`font-medium ${isPremium ? 'text-white' : 'text-gray-900'}`}>{plant.name}</p>
                        <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{plant.city}, {plant.state}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        plant.id.startsWith('gu_') ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400'
                      }`}>{plant.id.startsWith('gu_') ? 'GU' : 'IU'}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {selectedPlant && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className={`mt-4 p-4 rounded-xl ${isPremium ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50'}`}>
                <p className={`font-medium ${isPremium ? 'text-blue-400' : 'text-blue-900'}`}>{selectedPlant.name}</p>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-blue-700'}`}>{selectedPlant.city}, {selectedPlant.state}</p>
              </motion.div>
            )}
          </div>

          {/* Quantity */}
          <div className={`p-6 border-b ${isPremium ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Package className={`w-4 h-4 ${isPremium ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>Quantity</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>How many tonnes?</p>
              </div>
            </div>
            <div className="space-y-4">
              <input type="range" min="50" max="5000" step="50" value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-blue-500" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="number" value={quantity}
                    onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 0))}
                    className={`w-28 px-3 py-2 rounded-lg border text-center font-semibold ${
                      isPremium ? 'bg-gray-900 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                    }`} />
                  <span className={isPremium ? 'text-gray-400' : 'text-gray-600'}>tonnes</span>
                </div>
                <div className="flex space-x-2">
                  {[100, 500, 1000, 2000].map((val) => (
                    <button key={val} onClick={() => setQuantity(val)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        quantity === val ? 'bg-blue-500 text-white' : isPremium ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>{val}T</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6">
            <motion.button onClick={handleOptimize} disabled={!destination || quantity < 10 || isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 ${
                !destination || quantity < 10 || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
              }`}>
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Calculating...</span></>)
                : (<><Zap className="w-5 h-5" /><span>Find Optimal Routes</span></>)}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>Optimization Results</h2>
              <p className={isPremium ? 'text-gray-400' : 'text-gray-600'}>
                {result.quantity}T to {result.destination?.name}
              </p>
            </div>
            <button onClick={() => setResult(null)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isPremium ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <RefreshCw className="w-4 h-4" /><span>New Search</span>
            </button>
          </div>

          {/* Destination Summary */}
          <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Destination</p>
                  <h2 className="text-xl font-bold">{result.destination?.name}</h2>
                  <p className="text-blue-100">{result.destination?.city}, {result.destination?.state}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Quantity</p>
                <p className="text-3xl font-bold">{result.quantity?.toLocaleString()}T</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            {result.recommendations?.map((option, index) => {
              const isExpanded = expandedOption === index;
              const Icon = option.type === 'best_value' ? Trophy : option.type === 'fastest' ? Zap : option.type === 'eco_friendly' ? Leaf : Package;
              const isBest = option.type === 'best_value';
              
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl border-2 overflow-hidden ${
                    isBest 
                      ? isPremium ? 'bg-green-900/20 border-green-500/50' : 'bg-green-50 border-green-300'
                      : isPremium ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                  <div className="p-6 cursor-pointer" onClick={() => setExpandedOption(isExpanded ? -1 : index)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isBest ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                          option.type === 'fastest' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                          option.type === 'eco_friendly' ? 'bg-gradient-to-br from-teal-400 to-cyan-500' :
                          'bg-gradient-to-br from-blue-400 to-indigo-500'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{option.label}</h3>
                            {isBest && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" /><span>Lowest Cost</span>
                              </span>
                            )}
                          </div>
                          <p className={isPremium ? 'text-gray-400' : 'text-gray-600'}>{option.description}</p>
                          <p className={`text-xs mt-1 ${isPremium ? 'text-gray-500' : 'text-gray-500'}`}>{option.whyBest}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${isBest ? 'text-green-500' : isPremium ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(option.totalCost)}
                          </p>
                          <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>₹{option.costPerTonne}/tonne</p>
                        </div>
                        <button className={`p-2 rounded-lg ${isPremium ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className={`flex items-center space-x-6 mt-4 pt-4 border-t ${isPremium ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className={`flex items-center space-x-2 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Route className="w-4 h-4" /><span>{option.totalDistance} km</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${isPremium ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Truck className="w-4 h-4" /><span>{option.sources?.reduce((sum, s) => sum + s.trips, 0)} trips</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className={`border-t ${isPremium ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="p-6 space-y-4">
                          {/* Cost Breakdown */}
                          <div className={`rounded-xl p-4 ${isPremium ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            <h4 className={`font-semibold mb-3 flex items-center space-x-2 ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                              <Calculator className="w-4 h-4" /><span>Cost Breakdown</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className={`p-3 rounded-lg ${isPremium ? 'bg-gray-800' : 'bg-white'}`}>
                                <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'}`}>Production Cost</p>
                                <p className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                                  {formatCurrency(option.breakdown?.production?.total || 0)}
                                </p>
                                <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'}`}>
                                  ₹{option.sources?.[0]?.breakdown?.production?.perTonne || option.breakdown?.production?.perTonne}/T × {result.quantity}T
                                </p>
                              </div>
                              <div className={`p-3 rounded-lg ${isPremium ? 'bg-gray-800' : 'bg-white'}`}>
                                <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'}`}>Freight Cost</p>
                                <p className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>
                                  {formatCurrency(option.breakdown?.freight?.total || 0)}
                                </p>
                                <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'}`}>
                                  ₹{option.sources?.[0]?.freightPerTonne || Math.round((option.breakdown?.freight?.total || 0) / result.quantity)}/T freight
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Source Details */}
                          {option.sources?.map((source, sIndex) => (
                            <div key={sIndex} className={`rounded-xl p-4 ${isPremium ? 'bg-gray-900' : 'bg-gray-50'}`}>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPremium ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                    <Building2 className={`w-5 h-5 ${isPremium ? 'text-blue-400' : 'text-blue-600'}`} />
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.plant?.name}</h4>
                                    <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{source.plant?.city}, {source.plant?.state}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>{source.quantity}T</p>
                                  <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(source.totalCost)}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                  { label: 'Distance', value: `${source.distance} km` },
                                  { label: 'Vehicle', value: source.vehicle?.name?.split(' ')[0] + ' ' + source.vehicle?.name?.split(' ')[1] },
                                  { label: 'Trips', value: source.trips }
                                ].map((item, i) => (
                                  <div key={i} className={`rounded-lg p-2 ${isPremium ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-xs ${isPremium ? 'text-gray-500' : 'text-gray-500'}`}>{item.label}</p>
                                    <p className={`font-semibold text-sm ${isPremium ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* All Routes Table */}
          {result.allRoutes && result.allRoutes.length > 0 && (
            <div className={`rounded-2xl overflow-hidden ${isPremium ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className={`p-6 border-b ${isPremium ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-900'}`}>All Available Routes</h3>
                <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>Ranked by total cost (lowest = best)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isPremium ? 'bg-gray-900' : 'bg-gray-50'}>
                    <tr>
                      {['#', 'Source Plant', 'Distance', 'Production', 'Freight', 'Total/T', 'Status'].map(h => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isPremium ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {result.allRoutes.map((route, index) => (
                      <tr key={index} className={`${index === 0 ? isPremium ? 'bg-green-900/20' : 'bg-green-50' : ''} ${isPremium ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                        <td className={`px-4 py-3 ${index === 0 ? 'text-green-500 font-bold' : isPremium ? 'text-gray-400' : 'text-gray-500'}`}>
                          {index === 0 ? '★' : index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <p className={`font-medium ${isPremium ? 'text-white' : 'text-gray-900'}`}>{route.source?.name}</p>
                          <p className={`text-xs ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{route.source?.city}</p>
                        </td>
                        <td className={`px-4 py-3 ${isPremium ? 'text-white' : 'text-gray-900'}`}>{route.distance} km</td>
                        <td className={`px-4 py-3 ${isPremium ? 'text-white' : 'text-gray-900'}`}>₹{route.source?.productionCost}/T</td>
                        <td className={`px-4 py-3 ${isPremium ? 'text-white' : 'text-gray-900'}`}>₹{route.bestVehicle?.freightPerTonne}/T</td>
                        <td className={`px-4 py-3 font-bold ${index === 0 ? 'text-green-500' : isPremium ? 'text-white' : 'text-gray-900'}`}>
                          ₹{route.bestVehicle?.costPerTonne}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            route.canFulfill ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                          }`}>{route.canFulfill ? 'Available' : 'Partial'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Quick Stats */}
      {!result && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: PLANTS.integratedUnits.length, label: 'Source Plants', color: 'blue' },
            { value: PLANTS.grindingUnits.length, label: 'Destinations', color: 'green' },
            { value: VEHICLES.length, label: 'Vehicle Types', color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className={`rounded-xl p-4 text-center ${isPremium ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <p className={`text-2xl font-bold text-${stat.color}-500`}>{stat.value}</p>
              <p className={`text-sm ${isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
