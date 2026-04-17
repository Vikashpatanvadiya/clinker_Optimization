// Comprehensive road distance database for Adani Group plants (Adani Cement + Ambuja Cements)
// Distances are in kilometers via major highways and roads

export const roadDistanceDatabase = {
  // Gujarat - Adani Cement Mundra IU routes
  'iu_gujarat_mundra': {
    // To Gujarat GUs
    'gu_gujarat_ahmedabad': { distance: 380, route: 'NH8A → NH47', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_surat': { distance: 450, route: 'NH8A → NH8', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_rajkot': { distance: 240, route: 'NH8A → NH27', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_ambujanagar': { distance: 180, route: 'NH8A → SH6', tollRoads: false, terrain: 'highway' },
    'gu_gujarat_vadodara': { distance: 420, route: 'NH8A → NH8', tollRoads: true, terrain: 'highway' },
    
    // To other states
    'gu_rajasthan_jaipur': { distance: 580, route: 'NH8A → NH8 → NH48', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_mumbai': { distance: 720, route: 'NH8A → NH8', tollRoads: true, terrain: 'highway' },
    'gu_haryana_dadri': { distance: 980, route: 'NH8A → NH8 → NH48 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_punjab_bathinda': { distance: 780, route: 'NH8A → NH8 → NH48 → NH1', tollRoads: true, terrain: 'highway' }
  },

  // Gujarat - Ambuja Cement Kodinar IU routes
  'iu_gujarat_kodinar': {
    // To Gujarat GUs
    'gu_gujarat_ahmedabad': { distance: 420, route: 'SH6 → NH8A → NH47', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_surat': { distance: 380, route: 'SH6 → NH8', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_rajkot': { distance: 180, route: 'SH6 → NH27', tollRoads: false, terrain: 'highway' },
    'gu_gujarat_ambujanagar': { distance: 25, route: 'SH6', tollRoads: false, terrain: 'highway' },
    'gu_gujarat_vadodara': { distance: 450, route: 'SH6 → NH8', tollRoads: true, terrain: 'highway' },
    
    // To other states
    'gu_rajasthan_jaipur': { distance: 620, route: 'SH6 → NH8 → NH48', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_mumbai': { distance: 650, route: 'SH6 → NH8', tollRoads: true, terrain: 'highway' },
    'gu_haryana_dadri': { distance: 920, route: 'SH6 → NH8 → NH48 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_punjab_bathinda': { distance: 820, route: 'SH6 → NH8 → NH48 → NH1', tollRoads: true, terrain: 'highway' }
  },

  // Rajasthan - Adani Cement Lakheri IU routes
  'iu_rajasthan_lakheri': {
    // To Rajasthan GUs
    'gu_rajasthan_jaipur': { distance: 180, route: 'SH37 → NH21', tollRoads: false, terrain: 'highway' },
    'gu_rajasthan_jodhpur': { distance: 320, route: 'SH37 → NH48 → NH62', tollRoads: true, terrain: 'highway' },
    'gu_rajasthan_ropar': { distance: 650, route: 'SH37 → NH48 → NH1', tollRoads: true, terrain: 'highway' },
    
    // To Gujarat GUs
    'gu_gujarat_ahmedabad': { distance: 480, route: 'SH37 → NH48 → NH8', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_ambujanagar': { distance: 620, route: 'SH37 → NH48 → NH8 → SH6', tollRoads: true, terrain: 'highway' },
    
    // To other states
    'gu_maharashtra_mumbai': { distance: 780, route: 'SH37 → NH48 → NH8', tollRoads: true, terrain: 'highway' },
    'gu_haryana_dadri': { distance: 750, route: 'SH37 → NH48 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_punjab_bathinda': { distance: 580, route: 'SH37 → NH48 → NH1', tollRoads: true, terrain: 'highway' }
  },

  // Rajasthan - Ambuja Cement Marwar IU routes
  'iu_rajasthan_marwar': {
    // To Rajasthan GUs
    'gu_rajasthan_jaipur': { distance: 280, route: 'NH62 → NH48 → NH21', tollRoads: true, terrain: 'highway' },
    'gu_rajasthan_jodhpur': { distance: 120, route: 'NH62', tollRoads: false, terrain: 'highway' },
    'gu_rajasthan_ropar': { distance: 520, route: 'NH62 → NH48 → NH1', tollRoads: true, terrain: 'highway' },
    
    // To Gujarat GUs
    'gu_gujarat_ahmedabad': { distance: 380, route: 'NH62 → NH27 → NH8', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_rajkot': { distance: 220, route: 'NH62 → NH27', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_ambujanagar': { distance: 350, route: 'NH62 → NH27 → SH6', tollRoads: true, terrain: 'highway' },
    
    // To other states
    'gu_maharashtra_mumbai': { distance: 720, route: 'NH62 → NH27 → NH8', tollRoads: true, terrain: 'highway' },
    'gu_haryana_dadri': { distance: 650, route: 'NH62 → NH48 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_punjab_bathinda': { distance: 450, route: 'NH62 → NH48 → NH1', tollRoads: true, terrain: 'highway' }
  },

  // Chhattisgarh - Ambuja Cement Bhatapara IU routes
  'iu_chhattisgarh_bhatapara': {
    // To Chhattisgarh GUs
    'gu_chhattisgarh_bilaspur': { distance: 80, route: 'NH130', tollRoads: false, terrain: 'highway' },
    
    // To nearby states
    'gu_odisha_bhubaneswar': { distance: 420, route: 'NH130 → NH16', tollRoads: true, terrain: 'highway' },
    'gu_west_bengal_kolkata': { distance: 590, route: 'NH130 → NH16 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_nagpur': { distance: 220, route: 'NH130 → NH7', tollRoads: true, terrain: 'highway' },
    'gu_madhya_pradesh_bhopal': { distance: 460, route: 'NH130 → NH19 → NH46', tollRoads: true, terrain: 'highway' },
    'gu_telangana_hyderabad': { distance: 590, route: 'NH130 → NH44', tollRoads: true, terrain: 'highway' },
    'gu_haryana_dadri': { distance: 1220, route: 'NH130 → NH44 → NH48 → NH19', tollRoads: true, terrain: 'mixed' }
  },

  // Maharashtra - Ambuja Cement Chandrapur IU routes
  'iu_maharashtra_chandrapur': {
    // To Maharashtra GUs
    'gu_maharashtra_mumbai': { distance: 850, route: 'NH7 → NH44 → NH48', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_pune': { distance: 720, route: 'NH7 → NH44 → NH4', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_nagpur': { distance: 150, route: 'NH7', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_faizpur': { distance: 420, route: 'NH7 → NH52', tollRoads: true, terrain: 'highway' },
    
    // To nearby states
    'gu_chhattisgarh_bilaspur': { distance: 380, route: 'NH7 → NH130', tollRoads: true, terrain: 'highway' },
    'gu_telangana_hyderabad': { distance: 280, route: 'NH7 → NH44', tollRoads: true, terrain: 'highway' },
    'gu_karnataka_bangalore': { distance: 650, route: 'NH7 → NH44', tollRoads: true, terrain: 'highway' }
  },

  // Karnataka - Ambuja Cement Rabriyawas IU routes
  'iu_karnataka_rabriyawas': {
    // To Karnataka GUs
    'gu_karnataka_bangalore': { distance: 280, route: 'NH44', tollRoads: true, terrain: 'highway' },
    'gu_karnataka_mysore': { distance: 420, route: 'NH44 → NH275', tollRoads: true, terrain: 'highway' },
    
    // To nearby states
    'gu_telangana_hyderabad': { distance: 320, route: 'NH44', tollRoads: true, terrain: 'highway' },
    'gu_andhra_pradesh_vijayawada': { distance: 180, route: 'NH44', tollRoads: true, terrain: 'highway' },
    'gu_maharashtra_mumbai': { distance: 850, route: 'NH44 → NH48', tollRoads: true, terrain: 'highway' }
  },

  // Himachal Pradesh - Ambuja Cement Darlaghat IU routes
  'iu_himachal_pradesh_darlaghat': {
    // To North India GUs
    'gu_haryana_faridabad': { distance: 320, route: 'NH5 → NH1 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_haryana_gurgaon': { distance: 290, route: 'NH5 → NH1', tollRoads: true, terrain: 'highway' },
    'gu_haryana_dadri': { distance: 350, route: 'NH5 → NH1 → NH19', tollRoads: true, terrain: 'highway' },
    'gu_uttar_pradesh_lucknow': { distance: 650, route: 'NH5 → NH1 → NH27', tollRoads: true, terrain: 'highway' },
    'gu_punjab_bathinda': { distance: 280, route: 'NH5 → NH1', tollRoads: true, terrain: 'highway' },
    'gu_rajasthan_jaipur': { distance: 520, route: 'NH5 → NH1 → NH48', tollRoads: true, terrain: 'highway' },
    'gu_rajasthan_ropar': { distance: 180, route: 'NH5 → NH1', tollRoads: true, terrain: 'highway' }
  }
};

// Helper function to get road distance between two plants
export const getRoadDistance = (fromPlantId, toPlantId) => {
  // Check if route exists in database
  if (roadDistanceDatabase[fromPlantId] && roadDistanceDatabase[fromPlantId][toPlantId]) {
    return roadDistanceDatabase[fromPlantId][toPlantId];
  }
  
  // Check reverse route
  if (roadDistanceDatabase[toPlantId] && roadDistanceDatabase[toPlantId][fromPlantId]) {
    return roadDistanceDatabase[toPlantId][fromPlantId];
  }
  
  // Return null if route not found
  return null;
};

// Helper function to get all available routes from a plant
export const getAvailableRoutes = (fromPlantId) => {
  return roadDistanceDatabase[fromPlantId] || {};
};

// Helper function to check if a route exists
export const routeExists = (fromPlantId, toPlantId) => {
  return getRoadDistance(fromPlantId, toPlantId) !== null;
};