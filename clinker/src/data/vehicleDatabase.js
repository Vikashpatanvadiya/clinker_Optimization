// Comprehensive vehicle database with efficiency metrics
export const vehicleDatabase = {
  road: [
    {
      id: 'tata_407',
      name: 'Tata 407',
      type: 'Light Commercial Vehicle',
      capacity_tons: 2.5,
      fuel_efficiency_kmpl: 12.5,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 800,
      maintenance_per_km: 2.5,
      insurance_per_day: 150,
      permit_cost_per_trip: 200,
      loading_time_hours: 0.5,
      unloading_time_hours: 0.5,
      average_speed_kmph: 45,
      suitable_for: ['short_distance', 'city_delivery', 'small_loads'],
      max_distance_km: 300,
      image: '/vehicles/tata_407.jpg'
    },
    {
      id: 'ashok_leyland_dost',
      name: 'Ashok Leyland Dost',
      type: 'Mini Truck',
      capacity_tons: 1.25,
      fuel_efficiency_kmpl: 15.2,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 700,
      maintenance_per_km: 2.0,
      insurance_per_day: 120,
      permit_cost_per_trip: 150,
      loading_time_hours: 0.3,
      unloading_time_hours: 0.3,
      average_speed_kmph: 50,
      suitable_for: ['last_mile', 'urban_delivery', 'small_loads'],
      max_distance_km: 200,
      image: '/vehicles/dost.jpg'
    },
    {
      id: 'tata_1109',
      name: 'Tata 1109',
      type: 'Medium Commercial Vehicle',
      capacity_tons: 7.5,
      fuel_efficiency_kmpl: 8.5,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 1000,
      maintenance_per_km: 4.0,
      insurance_per_day: 250,
      permit_cost_per_trip: 400,
      loading_time_hours: 1.0,
      unloading_time_hours: 1.0,
      average_speed_kmph: 55,
      suitable_for: ['medium_distance', 'bulk_transport', 'industrial'],
      max_distance_km: 800,
      image: '/vehicles/tata_1109.jpg'
    },
    {
      id: 'ashok_leyland_2518',
      name: 'Ashok Leyland 2518',
      type: 'Heavy Commercial Vehicle',
      capacity_tons: 16.2,
      fuel_efficiency_kmpl: 5.8,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 1200,
      maintenance_per_km: 6.0,
      insurance_per_day: 400,
      permit_cost_per_trip: 800,
      loading_time_hours: 1.5,
      unloading_time_hours: 1.5,
      average_speed_kmph: 50,
      suitable_for: ['long_distance', 'heavy_loads', 'industrial'],
      max_distance_km: 1500,
      image: '/vehicles/al_2518.jpg'
    },
    {
      id: 'tata_3118',
      name: 'Tata 3118',
      type: 'Heavy Commercial Vehicle',
      capacity_tons: 18.5,
      fuel_efficiency_kmpl: 5.2,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 1300,
      maintenance_per_km: 7.0,
      insurance_per_day: 450,
      permit_cost_per_trip: 900,
      loading_time_hours: 2.0,
      unloading_time_hours: 2.0,
      average_speed_kmph: 48,
      suitable_for: ['long_distance', 'heavy_loads', 'bulk_transport'],
      max_distance_km: 2000,
      image: '/vehicles/tata_3118.jpg'
    },
    {
      id: 'mahindra_blazo_x_35',
      name: 'Mahindra Blazo X 35',
      type: 'Multi-Axle Heavy Vehicle',
      capacity_tons: 25.0,
      fuel_efficiency_kmpl: 4.8,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 1500,
      maintenance_per_km: 8.5,
      insurance_per_day: 600,
      permit_cost_per_trip: 1200,
      loading_time_hours: 2.5,
      unloading_time_hours: 2.5,
      average_speed_kmph: 45,
      suitable_for: ['long_distance', 'very_heavy_loads', 'bulk_industrial'],
      max_distance_km: 2500,
      image: '/vehicles/blazo_x35.jpg'
    },
    {
      id: 'bharat_benz_2823r',
      name: 'BharatBenz 2823R',
      type: 'Heavy Duty Truck',
      capacity_tons: 20.5,
      fuel_efficiency_kmpl: 5.5,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 1400,
      maintenance_per_km: 7.5,
      insurance_per_day: 500,
      permit_cost_per_trip: 1000,
      loading_time_hours: 2.0,
      unloading_time_hours: 2.0,
      average_speed_kmph: 52,
      suitable_for: ['long_distance', 'heavy_loads', 'premium_transport'],
      max_distance_km: 2200,
      image: '/vehicles/bharatbenz_2823r.jpg'
    },
    {
      id: 'volvo_fm_400',
      name: 'Volvo FM 400',
      type: 'Premium Heavy Vehicle',
      capacity_tons: 28.0,
      fuel_efficiency_kmpl: 4.2,
      fuel_cost_per_liter: 73.70,
      driver_cost_per_day: 1800,
      maintenance_per_km: 10.0,
      insurance_per_day: 800,
      permit_cost_per_trip: 1500,
      loading_time_hours: 3.0,
      unloading_time_hours: 3.0,
      average_speed_kmph: 55,
      suitable_for: ['long_distance', 'premium_transport', 'time_critical'],
      max_distance_km: 3000,
      image: '/vehicles/volvo_fm400.jpg'
    }
  ]
};

// Route database with distances between major cities
export const routeDatabase = {
  'IU_Karnataka-GU_Odisha': { distance: 1240, terrain: 'mixed', toll_roads: true },
  'IU_Gujarat-GU_Maharashtra': { distance: 450, terrain: 'highway', toll_roads: true },
  'IU_Rajasthan-GU_Punjab': { distance: 680, terrain: 'highway', toll_roads: true },
  'IU_Karnataka-GU_Maharashtra': { distance: 850, terrain: 'mixed', toll_roads: true },
  'IU_Gujarat-GU_Odisha': { distance: 1100, terrain: 'mixed', toll_roads: true },
  'IU_Rajasthan-GU_Odisha': { distance: 1350, terrain: 'mixed', toll_roads: true },
  'IU_Karnataka-GU_Punjab': { distance: 1800, terrain: 'highway', toll_roads: true },
  'IU_Gujarat-GU_Punjab': { distance: 950, terrain: 'highway', toll_roads: true },
  'IU_Rajasthan-GU_Maharashtra': { distance: 720, terrain: 'highway', toll_roads: true }
};

// Calculate cost per ton for a vehicle on a specific route
export const calculateCostPerTon = (vehicle, route, tonnage) => {
  const distance = route.distance;
  const trips = Math.ceil(tonnage / vehicle.capacity_tons);
  
  // Fuel cost
  const fuelCost = (distance * 2 * vehicle.fuel_cost_per_liter) / vehicle.fuel_efficiency_kmpl; // Round trip
  
  // Driver cost (assuming 8 hours driving per day at average speed)
  const drivingHours = (distance * 2) / vehicle.average_speed_kmph;
  const drivingDays = Math.ceil(drivingHours / 8);
  const driverCost = drivingDays * vehicle.driver_cost_per_day;
  
  // Maintenance cost
  const maintenanceCost = distance * 2 * vehicle.maintenance_per_km;
  
  // Insurance cost
  const insuranceCost = drivingDays * vehicle.insurance_per_day;
  
  // Permit and toll costs
  const permitCost = vehicle.permit_cost_per_trip;
  const tollCost = route.toll_roads ? distance * 2 * 1.5 : 0; // ₹1.5 per km for toll roads
  
  // Total cost per trip
  const costPerTrip = fuelCost + driverCost + maintenanceCost + insuranceCost + permitCost + tollCost;
  
  // Total cost for all trips
  const totalCost = costPerTrip * trips;
  
  // Cost per ton
  const costPerTon = totalCost / tonnage;
  
  return {
    costPerTon: Math.round(costPerTon),
    costPerTrip: Math.round(costPerTrip),
    totalCost: Math.round(totalCost),
    trips,
    breakdown: {
      fuel: Math.round(fuelCost),
      driver: Math.round(driverCost),
      maintenance: Math.round(maintenanceCost),
      insurance: Math.round(insuranceCost),
      permit: permitCost,
      toll: Math.round(tollCost)
    },
    efficiency: {
      kmpl: vehicle.fuel_efficiency_kmpl,
      totalDistance: distance * 2 * trips,
      totalTime: Math.round(drivingHours * trips + (vehicle.loading_time_hours + vehicle.unloading_time_hours) * trips)
    }
  };
};

// Get vehicle recommendations based on route and tonnage
export const getVehicleRecommendations = (fromLocation, toLocation, tonnage) => {
  const routeKey = `${fromLocation}-${toLocation}`;
  const route = routeDatabase[routeKey];
  
  if (!route) {
    return { error: 'Route not found in database' };
  }
  
  const recommendations = vehicleDatabase.road
    .filter(vehicle => {
      // Filter based on capacity and distance suitability
      return vehicle.capacity_tons >= Math.min(tonnage * 0.1, 1) && // Can handle at least 10% of load or 1 ton
             vehicle.max_distance_km >= route.distance;
    })
    .map(vehicle => {
      const costAnalysis = calculateCostPerTon(vehicle, route, tonnage);
      return {
        ...vehicle,
        ...costAnalysis,
        suitabilityScore: calculateSuitabilityScore(vehicle, route, tonnage)
      };
    })
    .sort((a, b) => {
      // Sort by cost efficiency (lower cost per ton is better)
      return a.costPerTon - b.costPerTon;
    });
  
  return {
    route: {
      from: fromLocation,
      to: toLocation,
      distance: route.distance,
      terrain: route.terrain,
      tollRoads: route.toll_roads
    },
    tonnage,
    recommendations: recommendations.slice(0, 5) // Top 5 recommendations
  };
};

// Calculate suitability score based on various factors
const calculateSuitabilityScore = (vehicle, route, tonnage) => {
  let score = 100;
  
  // Distance suitability
  if (route.distance > vehicle.max_distance_km * 0.8) score -= 20;
  if (route.distance < vehicle.max_distance_km * 0.3) score -= 10;
  
  // Load efficiency
  const loadEfficiency = Math.min(tonnage / vehicle.capacity_tons, 1);
  if (loadEfficiency < 0.5) score -= 15; // Underutilized
  if (loadEfficiency > 0.9) score += 10; // Well utilized
  
  // Fuel efficiency bonus
  if (vehicle.fuel_efficiency_kmpl > 8) score += 10;
  if (vehicle.fuel_efficiency_kmpl > 12) score += 5;
  
  return Math.max(score, 0);
};