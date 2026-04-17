import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// ============================================================================
// PLANT DATABASE - All Adani Group Cement Plants with Coordinates
// ============================================================================
const plants = {
  integratedUnits: [
    { id: 'iu_ap_boyareddypalli', name: 'Penna Boyareddypalli', state: 'Andhra Pradesh', city: 'Boyareddypalli', lat: 14.88, lng: 77.92, capacity: 2400, inventory: 1920, productionCost: 4200, brand: 'Penna' },
    { id: 'iu_ap_talaricheruvu', name: 'Penna Talaricheruvu', state: 'Andhra Pradesh', city: 'Talaricheruvu', lat: 14.92, lng: 78.02, capacity: 2200, inventory: 1760, productionCost: 4300, brand: 'Penna' },
    { id: 'iu_cg_jamul', name: 'ACC Jamul', state: 'Chhattisgarh', city: 'Jamul', lat: 21.19, lng: 81.40, capacity: 3500, inventory: 2800, productionCost: 3900, brand: 'ACC' },
    { id: 'iu_cg_bhatapara', name: 'Ambuja Bhatapara', state: 'Chhattisgarh', city: 'Bhatapara', lat: 21.73, lng: 81.93, capacity: 4500, inventory: 3600, productionCost: 3850, brand: 'Ambuja' },
    { id: 'iu_gj_sanghi', name: 'Sanghi Kutch', state: 'Gujarat', city: 'Kutch', lat: 23.25, lng: 69.67, capacity: 5000, inventory: 4000, productionCost: 3700, brand: 'Sanghi' },
    { id: 'iu_gj_ambujanagar', name: 'Ambuja Ambujanagar', state: 'Gujarat', city: 'Ambujanagar', lat: 20.95, lng: 70.75, capacity: 9000, inventory: 7200, productionCost: 3600, brand: 'Ambuja' },
    { id: 'iu_hp_gagal', name: 'ACC Gagal', state: 'Himachal Pradesh', city: 'Gagal', lat: 31.25, lng: 76.85, capacity: 3000, inventory: 2400, productionCost: 4400, brand: 'ACC' },
    { id: 'iu_hp_darlaghat', name: 'Ambuja Darlaghat', state: 'Himachal Pradesh', city: 'Darlaghat', lat: 31.24, lng: 76.95, capacity: 3500, inventory: 2800, productionCost: 4400, brand: 'Ambuja' },
    { id: 'iu_jh_chaibasa', name: 'ACC Chaibasa', state: 'Jharkhand', city: 'Chaibasa', lat: 22.55, lng: 85.81, capacity: 2800, inventory: 2240, productionCost: 4100, brand: 'ACC' },
    { id: 'iu_ka_kalaburagi', name: 'Orient Kalaburagi', state: 'Karnataka', city: 'Kalaburagi', lat: 17.33, lng: 76.83, capacity: 3200, inventory: 2560, productionCost: 4000, brand: 'Orient' },
    { id: 'iu_ka_wadi', name: 'ACC Wadi', state: 'Karnataka', city: 'Wadi', lat: 17.06, lng: 76.98, capacity: 4000, inventory: 3200, productionCost: 3950, brand: 'ACC' },
    { id: 'iu_mp_kymore', name: 'ACC Kymore', state: 'Madhya Pradesh', city: 'Kymore', lat: 24.03, lng: 80.58, capacity: 3800, inventory: 3040, productionCost: 4000, brand: 'ACC' },
    { id: 'iu_mp_ametha', name: 'ACC Ametha', state: 'Madhya Pradesh', city: 'Ametha', lat: 23.95, lng: 80.60, capacity: 2500, inventory: 2000, productionCost: 4200, brand: 'ACC' },
    { id: 'iu_mh_jalgaon', name: 'Orient Jalgaon', state: 'Maharashtra', city: 'Jalgaon', lat: 21.01, lng: 75.56, capacity: 2800, inventory: 2240, productionCost: 4100, brand: 'Orient' },
    { id: 'iu_mh_chanda', name: 'ACC Chanda', state: 'Maharashtra', city: 'Chanda', lat: 19.92, lng: 79.28, capacity: 3500, inventory: 2800, productionCost: 4000, brand: 'ACC' },
    { id: 'iu_mh_solapur', name: 'Ambuja Solapur', state: 'Maharashtra', city: 'Solapur', lat: 17.66, lng: 75.91, capacity: 4200, inventory: 3360, productionCost: 3900, brand: 'Ambuja' },
    { id: 'iu_od_bargarh', name: 'ACC Bargarh', state: 'Odisha', city: 'Bargarh', lat: 21.33, lng: 83.62, capacity: 3200, inventory: 2560, productionCost: 3950, brand: 'ACC' },
    { id: 'iu_rj_marwar', name: 'Ambuja Marwar', state: 'Rajasthan', city: 'Marwar Mundwa', lat: 26.91, lng: 73.85, capacity: 6000, inventory: 4800, productionCost: 3950, brand: 'Ambuja' },
    { id: 'iu_rj_rabriyawas', name: 'Ambuja Rabriyawas', state: 'Rajasthan', city: 'Rabriyawas', lat: 26.50, lng: 74.00, capacity: 4500, inventory: 3600, productionCost: 4050, brand: 'Ambuja' },
    { id: 'iu_rj_lakheri', name: 'ACC Lakheri', state: 'Rajasthan', city: 'Lakheri', lat: 25.67, lng: 76.17, capacity: 4000, inventory: 3200, productionCost: 4200, brand: 'ACC' },
    { id: 'iu_ts_mancherial', name: 'Penna Mancherial', state: 'Telangana', city: 'Mancherial', lat: 18.87, lng: 79.44, capacity: 3000, inventory: 2400, productionCost: 4150, brand: 'Penna' },
    { id: 'iu_ts_tandur', name: 'Penna Tandur', state: 'Telangana', city: 'Tandur', lat: 17.26, lng: 77.59, capacity: 2400, inventory: 1920, productionCost: 4250, brand: 'Penna' },
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
// VEHICLE DATABASE - Built-in vehicle types
// ============================================================================
const builtInVehicleTypes = [
  { id: 'tata_407', name: 'Tata 407', type: 'Light Commercial Vehicle', capacity_tons: 2.5, cost_per_km: 18, fixed_cost: 1500, fuel_efficiency_kmpl: 12.5, speed_kmh: 45, carbon_g_per_tkm: 85, isCustom: false },
  { id: 'tata_1109', name: 'Tata 1109', type: 'Intermediate Commercial Vehicle', capacity_tons: 7.5, cost_per_km: 28, fixed_cost: 2500, fuel_efficiency_kmpl: 8.5, speed_kmh: 50, carbon_g_per_tkm: 72, isCustom: false },
  { id: 'ashok_2518', name: 'Ashok Leyland 2518', type: 'Heavy Commercial Vehicle', capacity_tons: 16.2, cost_per_km: 38, fixed_cost: 4000, fuel_efficiency_kmpl: 5.8, speed_kmh: 48, carbon_g_per_tkm: 65, isCustom: false },
  { id: 'tata_3118', name: 'Tata 3118', type: 'Heavy Commercial Vehicle', capacity_tons: 18.5, cost_per_km: 42, fixed_cost: 4500, fuel_efficiency_kmpl: 5.2, speed_kmh: 46, carbon_g_per_tkm: 62, isCustom: false },
  { id: 'bharatbenz_2823', name: 'BharatBenz 2823R', type: 'Heavy Commercial Vehicle', capacity_tons: 20.5, cost_per_km: 45, fixed_cost: 5000, fuel_efficiency_kmpl: 5.5, speed_kmh: 50, carbon_g_per_tkm: 58, isCustom: false },
  { id: 'mahindra_blazo', name: 'Mahindra Blazo X35', type: 'Multi-Axle Heavy Vehicle', capacity_tons: 25.0, cost_per_km: 55, fixed_cost: 6000, fuel_efficiency_kmpl: 4.8, speed_kmh: 45, carbon_g_per_tkm: 55, isCustom: false },
  { id: 'volvo_fm400', name: 'Volvo FM 400', type: 'Premium Heavy Vehicle', capacity_tons: 28.0, cost_per_km: 65, fixed_cost: 8000, fuel_efficiency_kmpl: 4.2, speed_kmh: 55, carbon_g_per_tkm: 52, isCustom: false },
];

// In-memory storage for custom vehicle types and fleet
let customVehicleTypes = [];
let fleet = [];
let transportModes = [
  { id: 1, name: 'Road', costPerTrip: 8340, capacity: 50, minBatch: 25 },
  { id: 2, name: 'Rail', costPerTrip: 25020, capacity: 60, minBatch: 30 },
];
let nextModeId = 3;
let nextVehicleTypeId = 100;

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
  
  let roadFactor = 1.25;
  if (straightLine < 100) roadFactor = 1.15;
  else if (straightLine < 300) roadFactor = 1.20;
  else if (straightLine < 600) roadFactor = 1.25;
  else if (straightLine < 1000) roadFactor = 1.30;
  else roadFactor = 1.35;
  
  return Math.round(straightLine * roadFactor);
}

// ============================================================================
// GRAPHHOPPER INTEGRATION (with fallback)
// ============================================================================
async function getRouteDistance(origin, destination) {
  const GRAPHHOPPER_KEY = process.env.GRAPHHOPPER_API_KEY;
  
  if (GRAPHHOPPER_KEY) {
    try {
      const url = `https://graphhopper.com/api/1/route?point=${origin.lat},${origin.lng}&point=${destination.lat},${destination.lng}&vehicle=truck&locale=en&key=${GRAPHHOPPER_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.paths && data.paths[0]) {
        return {
          distance: Math.round(data.paths[0].distance / 1000),
          duration: Math.round(data.paths[0].time / 3600000 * 10) / 10,
          source: 'graphhopper'
        };
      }
    } catch (error) {
      console.log('GraphHopper fallback to calculation');
    }
  }
  
  const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  const duration = Math.round(distance / 45 * 10) / 10;
  
  return { distance, duration, source: 'calculated' };
}

// ============================================================================
// COST CALCULATION ENGINE
// ============================================================================
function calculateTransportCost(distance, tonnage, vehicle, costMode = 'per_unit') {
  const trips = Math.ceil(tonnage / vehicle.capacity_tons);
  const totalDistance = distance * 2 * trips;
  
  const baseCost = totalDistance * vehicle.cost_per_km;
  const fuelLiters = totalDistance / vehicle.fuel_efficiency_kmpl;
  const fuelCost = fuelLiters * 90;
  const drivingHours = totalDistance / vehicle.speed_kmh;
  const drivingDays = Math.ceil(drivingHours / 8);
  const driverCost = drivingDays * 1200 * trips;
  const tollCost = distance > 100 ? totalDistance * 1.5 : 0;
  const handlingCost = trips * 500;
  const fixedCost = vehicle.fixed_cost * trips;
  
  const totalCost = baseCost + fuelCost + driverCost + tollCost + handlingCost + fixedCost;
  
  // Cost mode: 'per_unit' returns cost per tonne, 'batch' returns full batch cost
  const costPerTonne = Math.round(totalCost / tonnage);
  const co2Emissions = Math.round(totalDistance * (vehicle.carbon_g_per_tkm || 65) * tonnage / 1000);
  
  return {
    totalCost: Math.round(totalCost),
    costPerTonne,
    trips,
    totalDistance,
    drivingHours: Math.round(drivingHours),
    co2Emissions,
    breakdown: {
      transport: Math.round(baseCost),
      fuel: Math.round(fuelCost),
      driver: Math.round(driverCost),
      toll: Math.round(tollCost),
      handling: handlingCost,
      fixed: fixedCost
    },
    costMode
  };
}


// ============================================================================
// SMART OPTIMIZATION ENGINE
// ============================================================================
async function smartOptimize(destinationId, quantity, urgency, costMode = 'per_unit') {
  const destination = [...plants.grindingUnits, ...plants.integratedUnits]
    .find(p => p.id === destinationId);
  
  if (!destination) {
    throw new Error('Destination not found');
  }
  
  const sources = plants.integratedUnits.filter(iu => iu.inventory >= 100);
  
  const routeOptions = await Promise.all(sources.map(async (source) => {
    const route = await getRouteDistance(
      { lat: source.lat, lng: source.lng },
      { lat: destination.lat, lng: destination.lng }
    );
    
    const allVehicleTypes = [...builtInVehicleTypes, ...customVehicleTypes];
    const vehicleOptions = allVehicleTypes.map(vehicle => {
      const cost = calculateTransportCost(route.distance, quantity, vehicle, costMode);
      return {
        vehicle,
        ...cost,
        deliveryDays: Math.ceil(cost.drivingHours / 8) + 1
      };
    });
    
    const bestVehicle = vehicleOptions.reduce((best, current) => 
      current.costPerTonne < best.costPerTonne ? current : best
    );
    
    return {
      source,
      route,
      bestVehicle,
      allVehicleOptions: vehicleOptions,
      availableInventory: source.inventory,
      canFulfill: source.inventory >= quantity
    };
  }));
  
  routeOptions.sort((a, b) => a.bestVehicle.costPerTonne - b.bestVehicle.costPerTonne);
  
  const recommendations = [];
  
  // Single source option
  const singleSource = routeOptions.find(r => r.canFulfill);
  if (singleSource) {
    recommendations.push({
      type: 'single_source',
      label: 'Recommended: Single Source',
      description: `All ${quantity}T from ${singleSource.source.name}`,
      sources: [{
        plant: singleSource.source,
        quantity,
        distance: singleSource.route.distance,
        vehicle: singleSource.bestVehicle.vehicle,
        cost: singleSource.bestVehicle.totalCost,
        trips: singleSource.bestVehicle.trips,
        deliveryDays: singleSource.bestVehicle.deliveryDays
      }],
      totalCost: singleSource.bestVehicle.totalCost,
      costPerTonne: singleSource.bestVehicle.costPerTonne,
      totalDistance: singleSource.route.distance,
      co2Emissions: singleSource.bestVehicle.co2Emissions,
      deliveryDays: singleSource.bestVehicle.deliveryDays
    });
  }

  // Split shipment option
  if (routeOptions.length >= 2) {
    const top2 = routeOptions.slice(0, 2);
    const split1 = Math.ceil(quantity * 0.6);
    const split2 = quantity - split1;
    
    const cost1 = calculateTransportCost(top2[0].route.distance, split1, top2[0].bestVehicle.vehicle, costMode);
    const cost2 = calculateTransportCost(top2[1].route.distance, split2, top2[1].bestVehicle.vehicle, costMode);
    
    recommendations.push({
      type: 'split_shipment',
      label: 'Alternative: Split Shipment',
      description: `${split1}T from ${top2[0].source.name}, ${split2}T from ${top2[1].source.name}`,
      sources: [
        {
          plant: top2[0].source,
          quantity: split1,
          distance: top2[0].route.distance,
          vehicle: top2[0].bestVehicle.vehicle,
          cost: cost1.totalCost,
          trips: cost1.trips,
          deliveryDays: Math.ceil(cost1.drivingHours / 8) + 1
        },
        {
          plant: top2[1].source,
          quantity: split2,
          distance: top2[1].route.distance,
          vehicle: top2[1].bestVehicle.vehicle,
          cost: cost2.totalCost,
          trips: cost2.trips,
          deliveryDays: Math.ceil(cost2.drivingHours / 8) + 1
        }
      ],
      totalCost: cost1.totalCost + cost2.totalCost,
      costPerTonne: Math.round((cost1.totalCost + cost2.totalCost) / quantity),
      totalDistance: top2[0].route.distance + top2[1].route.distance,
      co2Emissions: cost1.co2Emissions + cost2.co2Emissions,
      deliveryDays: Math.max(
        Math.ceil(cost1.drivingHours / 8) + 1,
        Math.ceil(cost2.drivingHours / 8) + 1
      )
    });
  }
  
  // Eco-friendly option
  const ecoOption = [...routeOptions].sort((a, b) => 
    a.bestVehicle.co2Emissions - b.bestVehicle.co2Emissions
  )[0];
  
  if (ecoOption && ecoOption.canFulfill) {
    const ecoVehicle = builtInVehicleTypes.find(v => v.id === 'bharatbenz_2823') || builtInVehicleTypes[4];
    const ecoCost = calculateTransportCost(ecoOption.route.distance, quantity, ecoVehicle, costMode);
    
    recommendations.push({
      type: 'eco_friendly',
      label: 'Eco-Friendly Option',
      description: `Lower carbon footprint from ${ecoOption.source.name}`,
      sources: [{
        plant: ecoOption.source,
        quantity,
        distance: ecoOption.route.distance,
        vehicle: ecoVehicle,
        cost: ecoCost.totalCost,
        trips: ecoCost.trips,
        deliveryDays: Math.ceil(ecoCost.drivingHours / 8) + 1
      }],
      totalCost: ecoCost.totalCost,
      costPerTonne: ecoCost.costPerTonne,
      totalDistance: ecoOption.route.distance,
      co2Emissions: ecoCost.co2Emissions,
      deliveryDays: Math.ceil(ecoCost.drivingHours / 8) + 1
    });
  }
  
  return {
    destination,
    quantity,
    urgency,
    costMode,
    recommendations,
    allRoutes: routeOptions.slice(0, 10),
    optimizedAt: new Date().toISOString()
  };
}

// ============================================================================
// API ENDPOINTS - Plants & Vehicles
// ============================================================================

// Get all plants
app.get('/api/plants', (req, res) => {
  res.json({
    integrated_units: plants.integratedUnits,
    grinding_units: plants.grindingUnits
  });
});

// Get all vehicles (for SmartOptimizer)
app.get('/api/vehicles', (req, res) => {
  res.json([...builtInVehicleTypes, ...customVehicleTypes]);
});

// ============================================================================
// API ENDPOINTS - Transport Modes
// ============================================================================

// Get all transport modes
app.get('/api/transport-modes', (req, res) => {
  res.json(transportModes);
});

// Create transport mode
app.post('/api/transport-modes', (req, res) => {
  const { name, costPerTrip, capacity, minBatch } = req.body;
  const newMode = {
    id: nextModeId++,
    name,
    costPerTrip: parseInt(costPerTrip),
    capacity: parseInt(capacity),
    minBatch: parseInt(minBatch)
  };
  transportModes.push(newMode);
  res.json(newMode);
});

// Update transport mode
app.put('/api/transport-modes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transportModes.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Transport mode not found' });
  }
  transportModes[index] = { ...transportModes[index], ...req.body };
  res.json(transportModes[index]);
});

// Delete transport mode
app.delete('/api/transport-modes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = transportModes.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Transport mode not found' });
  }
  transportModes.splice(index, 1);
  res.json({ success: true });
});

// ============================================================================
// API ENDPOINTS - Fleet Management
// ============================================================================

// Get fleet
app.get('/api/fleet', (req, res) => {
  const allVehicleTypes = [...builtInVehicleTypes, ...customVehicleTypes];
  res.json({
    vehicles: fleet,
    totalVehicles: fleet.reduce((sum, v) => sum + v.count, 0),
    availableTypes: allVehicleTypes
  });
});

// Add vehicle to fleet
app.post('/api/fleet/add', (req, res) => {
  const { vehicleTypeId, count = 1 } = req.body;
  const allVehicleTypes = [...builtInVehicleTypes, ...customVehicleTypes];
  const vehicleType = allVehicleTypes.find(v => v.id === vehicleTypeId);
  
  if (!vehicleType) {
    return res.status(404).json({ error: 'Vehicle type not found' });
  }
  
  const existingIndex = fleet.findIndex(v => v.id === vehicleTypeId);
  if (existingIndex >= 0) {
    fleet[existingIndex].count += count;
  } else {
    fleet.push({
      ...vehicleType,
      count,
      available: true
    });
  }
  
  res.json({ success: true, fleet });
});

// Remove vehicle from fleet
app.post('/api/fleet/remove', (req, res) => {
  const { vehicleId, count = 1 } = req.body;
  const index = fleet.findIndex(v => v.id === vehicleId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found in fleet' });
  }
  
  fleet[index].count -= count;
  if (fleet[index].count <= 0) {
    fleet.splice(index, 1);
  }
  
  res.json({ success: true, fleet });
});

// Toggle vehicle availability
app.put('/api/fleet/:id/toggle', (req, res) => {
  const vehicleId = req.params.id;
  const vehicle = fleet.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found in fleet' });
  }
  
  vehicle.available = !vehicle.available;
  res.json({ success: true, vehicle });
});


// ============================================================================
// API ENDPOINTS - Vehicle Types Management
// ============================================================================

// Get all vehicle types (for fleet management - excludes railway)
app.get('/api/vehicle-types/fleet', (req, res) => {
  const allTypes = [...builtInVehicleTypes, ...customVehicleTypes];
  res.json({
    vehicleTypes: allTypes,
    totalTypes: allTypes.length,
    customTypes: customVehicleTypes.length,
    builtInTypes: builtInVehicleTypes.length
  });
});

// Get all vehicle types
app.get('/api/vehicle-types', (req, res) => {
  const allTypes = [...builtInVehicleTypes, ...customVehicleTypes];
  res.json({
    vehicleTypes: allTypes,
    totalTypes: allTypes.length,
    customTypes: customVehicleTypes.length,
    builtInTypes: builtInVehicleTypes.length
  });
});

// Create custom vehicle type
app.post('/api/vehicle-types', (req, res) => {
  const { name, type, capacity_tons, cost_per_km, fixed_cost, fuel_efficiency_kmpl, speed_kmh, carbon_g_per_tkm } = req.body;
  
  const newVehicleType = {
    id: `custom_${nextVehicleTypeId++}`,
    name,
    type,
    capacity_tons: parseFloat(capacity_tons),
    cost_per_km: parseFloat(cost_per_km),
    fixed_cost: parseFloat(fixed_cost),
    fuel_efficiency_kmpl: parseFloat(fuel_efficiency_kmpl),
    speed_kmh: parseFloat(speed_kmh),
    carbon_g_per_tkm: parseFloat(carbon_g_per_tkm),
    isCustom: true
  };
  
  customVehicleTypes.push(newVehicleType);
  res.json(newVehicleType);
});

// Update vehicle type
app.put('/api/vehicle-types/:id', (req, res) => {
  const vehicleId = req.params.id;
  const { name, type, capacity_tons, cost_per_km, fixed_cost, fuel_efficiency_kmpl, speed_kmh, carbon_g_per_tkm } = req.body;
  
  // Check if it's a built-in type
  const builtInIndex = builtInVehicleTypes.findIndex(v => v.id === vehicleId);
  if (builtInIndex >= 0) {
    // Create a custom copy instead of modifying built-in
    const newVehicleType = {
      id: `custom_${nextVehicleTypeId++}`,
      name: name || builtInVehicleTypes[builtInIndex].name + ' (Custom)',
      type: type || builtInVehicleTypes[builtInIndex].type,
      capacity_tons: parseFloat(capacity_tons) || builtInVehicleTypes[builtInIndex].capacity_tons,
      cost_per_km: parseFloat(cost_per_km) || builtInVehicleTypes[builtInIndex].cost_per_km,
      fixed_cost: parseFloat(fixed_cost) || builtInVehicleTypes[builtInIndex].fixed_cost,
      fuel_efficiency_kmpl: parseFloat(fuel_efficiency_kmpl) || builtInVehicleTypes[builtInIndex].fuel_efficiency_kmpl,
      speed_kmh: parseFloat(speed_kmh) || builtInVehicleTypes[builtInIndex].speed_kmh,
      carbon_g_per_tkm: parseFloat(carbon_g_per_tkm) || builtInVehicleTypes[builtInIndex].carbon_g_per_tkm,
      isCustom: true
    };
    customVehicleTypes.push(newVehicleType);
    return res.json({ ...newVehicleType, isNewCustomType: true, message: 'Created custom version of built-in vehicle type' });
  }
  
  // Update custom type
  const customIndex = customVehicleTypes.findIndex(v => v.id === vehicleId);
  if (customIndex === -1) {
    return res.status(404).json({ error: 'Vehicle type not found' });
  }
  
  customVehicleTypes[customIndex] = {
    ...customVehicleTypes[customIndex],
    name: name || customVehicleTypes[customIndex].name,
    type: type || customVehicleTypes[customIndex].type,
    capacity_tons: parseFloat(capacity_tons) || customVehicleTypes[customIndex].capacity_tons,
    cost_per_km: parseFloat(cost_per_km) || customVehicleTypes[customIndex].cost_per_km,
    fixed_cost: parseFloat(fixed_cost) || customVehicleTypes[customIndex].fixed_cost,
    fuel_efficiency_kmpl: parseFloat(fuel_efficiency_kmpl) || customVehicleTypes[customIndex].fuel_efficiency_kmpl,
    speed_kmh: parseFloat(speed_kmh) || customVehicleTypes[customIndex].speed_kmh,
    carbon_g_per_tkm: parseFloat(carbon_g_per_tkm) || customVehicleTypes[customIndex].carbon_g_per_tkm
  };
  
  res.json({ ...customVehicleTypes[customIndex], message: 'Vehicle type updated successfully' });
});

// Delete vehicle type
app.delete('/api/vehicle-types/:id', (req, res) => {
  const vehicleId = req.params.id;
  
  // Can't delete built-in types
  if (builtInVehicleTypes.find(v => v.id === vehicleId)) {
    return res.status(400).json({ error: 'Cannot delete built-in vehicle types' });
  }
  
  const index = customVehicleTypes.findIndex(v => v.id === vehicleId);
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle type not found' });
  }
  
  // Also remove from fleet
  const fleetIndex = fleet.findIndex(v => v.id === vehicleId);
  if (fleetIndex >= 0) {
    fleet.splice(fleetIndex, 1);
  }
  
  customVehicleTypes.splice(index, 1);
  res.json({ success: true });
});

// ============================================================================
// API ENDPOINTS - Vehicle Recommendations
// ============================================================================

app.post('/api/vehicle-recommendations', (req, res) => {
  const { fromLocation, toLocation, tonnage, distance, terrain } = req.body;
  
  const allVehicleTypes = [...builtInVehicleTypes, ...customVehicleTypes];
  
  const recommendations = allVehicleTypes
    .filter(v => v.capacity_tons >= Math.min(tonnage * 0.1, 1))
    .map(vehicle => {
      const cost = calculateTransportCost(distance, tonnage, vehicle);
      return {
        ...vehicle,
        ...cost,
        suitabilityScore: calculateSuitabilityScore(vehicle, distance, tonnage, terrain)
      };
    })
    .sort((a, b) => a.costPerTonne - b.costPerTonne)
    .slice(0, 5);
  
  res.json({ recommendations });
});

function calculateSuitabilityScore(vehicle, distance, tonnage, terrain) {
  let score = 100;
  
  // Distance suitability
  const maxDistance = vehicle.type.includes('Light') ? 300 : 
                      vehicle.type.includes('Intermediate') ? 800 : 2000;
  if (distance > maxDistance * 0.8) score -= 20;
  if (distance < maxDistance * 0.3) score -= 10;
  
  // Load efficiency
  const loadEfficiency = Math.min(tonnage / vehicle.capacity_tons, 1);
  if (loadEfficiency < 0.5) score -= 15;
  if (loadEfficiency > 0.9) score += 10;
  
  // Fuel efficiency bonus
  if (vehicle.fuel_efficiency_kmpl > 8) score += 10;
  if (vehicle.fuel_efficiency_kmpl > 12) score += 5;
  
  // Terrain adjustment
  if (terrain === 'mountainous' && vehicle.type.includes('Heavy')) score -= 10;
  
  return Math.max(score, 0);
}

// ============================================================================
// API ENDPOINTS - Smart Optimization
// ============================================================================

app.post('/api/smart-optimize', async (req, res) => {
  try {
    const { destinationId, quantity, urgency, costMode } = req.body;
    const result = await smartOptimize(destinationId, quantity, urgency || 'week', costMode || 'per_unit');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate route between two points
app.post('/api/route', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const route = await getRouteDistance(origin, destination);
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate transport cost
app.post('/api/calculate-cost', (req, res) => {
  try {
    const { distance, tonnage, vehicleId, costMode } = req.body;
    const allVehicleTypes = [...builtInVehicleTypes, ...customVehicleTypes];
    const vehicle = allVehicleTypes.find(v => v.id === vehicleId) || builtInVehicleTypes[3];
    const cost = calculateTransportCost(distance, tonnage, vehicle, costMode || 'per_unit');
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get distance between two plants
app.get('/api/distance/:fromId/:toId', async (req, res) => {
  try {
    const { fromId, toId } = req.params;
    const allPlants = [...plants.integratedUnits, ...plants.grindingUnits];
    const from = allPlants.find(p => p.id === fromId);
    const to = allPlants.find(p => p.id === toId);
    
    if (!from || !to) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    const route = await getRouteDistance(
      { lat: from.lat, lng: from.lng },
      { lat: to.lat, lng: to.lng }
    );
    
    res.json({
      from: { id: from.id, name: from.name, city: from.city },
      to: { id: to.id, name: to.name, city: to.city },
      ...route
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy optimization results endpoint
app.get('/api/optimization-results', (req, res) => {
  res.json({
    totalCost: 15420000,
    productionCost: 8500000,
    transportCost: 5200000,
    inventoryCost: 1720000,
    shipmentPlan: [],
    inventoryLevels: {},
    capacityUtilization: { production: [], transportation: [] }
  });
});

// Optimization endpoint
app.post('/api/optimize', (req, res) => {
  // Placeholder for full optimization
  res.json({
    success: true,
    results: {
      totalCost: 15420000,
      productionCost: 8500000,
      transportCost: 5200000,
      inventoryCost: 1720000
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Clinker Optimizer Server running on port ${PORT}`);
});
