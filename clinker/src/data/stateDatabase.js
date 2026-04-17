// Comprehensive Adani Group Cement plants database (All Adani Group brands: ACC, Ambuja, Penna, Orient, Sanghi, ACIL)
import { getRoadDistance } from './roadDistanceDatabase.js';

export const stateDatabase = {
  states: [
    {
      id: 'gujarat',
      name: 'Gujarat', 
      code: 'GJ',
      region: 'West'
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      code: 'RJ', 
      region: 'North'
    },
    {
      id: 'odisha',
      name: 'Odisha',
      code: 'OD',
      region: 'East'
    },
    {
      id: 'chhattisgarh',
      name: 'Chhattisgarh',
      code: 'CG',
      region: 'Central'
    },
    {
      id: 'madhya_pradesh',
      name: 'Madhya Pradesh',
      code: 'MP',
      region: 'Central'
    },
    {
      id: 'maharashtra',
      name: 'Maharashtra',
      code: 'MH',
      region: 'West'
    },
    {
      id: 'karnataka',
      name: 'Karnataka',
      code: 'KA',
      region: 'South'
    },
    {
      id: 'andhra_pradesh',
      name: 'Andhra Pradesh',
      code: 'AP',
      region: 'South'
    },
    {
      id: 'telangana',
      name: 'Telangana',
      code: 'TS',
      region: 'South'
    },
    {
      id: 'haryana',
      name: 'Haryana',
      code: 'HR',
      region: 'North'
    },
    {
      id: 'uttar_pradesh',
      name: 'Uttar Pradesh',
      code: 'UP',
      region: 'North'
    },
    {
      id: 'west_bengal',
      name: 'West Bengal',
      code: 'WB',
      region: 'East'
    },
    {
      id: 'himachal_pradesh',
      name: 'Himachal Pradesh',
      code: 'HP',
      region: 'North'
    },
    {
      id: 'punjab',
      name: 'Punjab',
      code: 'PB',
      region: 'North'
    },
    {
      id: 'jharkhand',
      name: 'Jharkhand',
      code: 'JH',
      region: 'East'
    },
    {
      id: 'tamil_nadu',
      name: 'Tamil Nadu',
      code: 'TN',
      region: 'South'
    },
    {
      id: 'kerala',
      name: 'Kerala',
      code: 'KL',
      region: 'South'
    },
    {
      id: 'uttarakhand',
      name: 'Uttarakhand',
      code: 'UK',
      region: 'North'
    }
  ],

  plants: {
    // Gujarat - Adani Group Plants
    gujarat: [
      // Integrated Units
      {
        id: 'iu_gujarat_sanghi_kutch',
        name: 'Sanghi Kutch IU',
        type: 'integrated_unit',
        city: 'Kutch',
        capacity: 5000,
        brand: 'Sanghi',
        coordinates: { lat: 23.2504, lng: 69.6669 }
      },
      {
        id: 'iu_gujarat_ambujanagar',
        name: 'Ambuja Ambujanagar IU',
        type: 'integrated_unit',
        city: 'Ambujanagar',
        capacity: 9000,
        brand: 'Ambuja',
        coordinates: { lat: 20.95, lng: 70.75 }
      },
      // Grinding Units
      {
        id: 'gu_gujarat_dahej',
        name: 'ACIL Dahej GU',
        type: 'grinding_unit',
        city: 'Dahej',
        capacity: 2000,
        brand: 'ACIL',
        coordinates: { lat: 21.7, lng: 72.58 }
      },
      {
        id: 'gu_gujarat_surat',
        name: 'Ambuja Surat GU',
        type: 'grinding_unit',
        city: 'Surat',
        capacity: 2500,
        brand: 'Ambuja',
        coordinates: { lat: 21.17, lng: 72.83 }
      },
      // Bulk Cement Terminals
      {
        id: 'gu_gujarat_navlakhi',
        name: 'Sanghi Navlakhi BCT',
        type: 'grinding_unit',
        city: 'Navlakhi',
        capacity: 1500,
        brand: 'Sanghi',
        coordinates: { lat: 22.9667, lng: 70.45 }
      },
      {
        id: 'gu_gujarat_muldwarka',
        name: 'Ambuja Muldwarka BCT',
        type: 'grinding_unit',
        city: 'Muldwarka',
        capacity: 1800,
        brand: 'Ambuja',
        coordinates: { lat: 20.9, lng: 70.68 }
      }
    ],

    // Rajasthan - Adani Group Plants
    rajasthan: [
      // Integrated Units
      {
        id: 'iu_rajasthan_marwar',
        name: 'Ambuja Marwar Mundwa IU',
        type: 'integrated_unit',
        city: 'Marwar Mundwa',
        capacity: 6000,
        brand: 'Ambuja',
        coordinates: { lat: 26.91, lng: 73.85 }
      },
      {
        id: 'iu_rajasthan_rabriyawas',
        name: 'Ambuja Rabriyawas IU',
        type: 'integrated_unit',
        city: 'Rabriyawas',
        capacity: 4500,
        brand: 'Ambuja',
        coordinates: { lat: 26.5, lng: 74 }
      },
      {
        id: 'iu_rajasthan_jodhpur',
        name: 'Penna Jodhpur IU',
        type: 'integrated_unit',
        city: 'Jodhpur',
        capacity: 3500,
        brand: 'Penna',
        coordinates: { lat: 26.2389, lng: 73.0243 }
      },
      {
        id: 'iu_rajasthan_lakheri',
        name: 'ACC Lakheri IU',
        type: 'integrated_unit',
        city: 'Lakheri',
        capacity: 4000,
        brand: 'ACC',
        coordinates: { lat: 25.6667, lng: 76.1667 }
      }
    ],

    // Chhattisgarh - Adani Group Plants
    chhattisgarh: [
      // Integrated Units
      {
        id: 'iu_chhattisgarh_jamul',
        name: 'ACC Jamul IU',
        type: 'integrated_unit',
        city: 'Jamul',
        capacity: 3500,
        brand: 'ACC',
        coordinates: { lat: 21.19, lng: 81.4 }
      },
      {
        id: 'iu_chhattisgarh_bhatapara',
        name: 'Ambuja Bhatapara IU',
        type: 'integrated_unit',
        city: 'Bhatapara',
        capacity: 4500,
        brand: 'Ambuja',
        coordinates: { lat: 21.73, lng: 81.93 }
      }
    ],

    // Himachal Pradesh - Adani Group Plants
    himachal_pradesh: [
      // Integrated Units
      {
        id: 'iu_himachal_gagal',
        name: 'ACC Gagal IU',
        type: 'integrated_unit',
        city: 'Gagal',
        capacity: 3000,
        brand: 'ACC',
        coordinates: { lat: 31.25, lng: 76.85 }
      },
      {
        id: 'iu_himachal_darlaghat',
        name: 'Ambuja Darlaghat IU',
        type: 'integrated_unit',
        city: 'Darlaghat',
        capacity: 3500,
        brand: 'Ambuja',
        coordinates: { lat: 31.24, lng: 76.95 }
      },
      // Grinding Units
      {
        id: 'gu_himachal_nalagarh',
        name: 'Ambuja Nalagarh GU',
        type: 'grinding_unit',
        city: 'Nalagarh',
        capacity: 2000,
        brand: 'Ambuja',
        coordinates: { lat: 31.04, lng: 76.71 }
      },
      {
        id: 'gu_himachal_solan',
        name: 'ACC Solan GU',
        type: 'grinding_unit',
        city: 'Solan',
        capacity: 1800,
        brand: 'ACC',
        coordinates: { lat: 30.9045, lng: 77.0967 }
      }
    ],

    // Jharkhand - Adani Group Plants
    jharkhand: [
      // Integrated Units
      {
        id: 'iu_jharkhand_chaibasa',
        name: 'ACC Chaibasa IU',
        type: 'integrated_unit',
        city: 'Chaibasa',
        capacity: 2800,
        brand: 'ACC',
        coordinates: { lat: 22.55, lng: 85.81 }
      },
      // Grinding Units
      {
        id: 'gu_jharkhand_dhanbad',
        name: 'ACC Dhanbad GU',
        type: 'grinding_unit',
        city: 'Dhanbad',
        capacity: 1600,
        brand: 'ACC',
        coordinates: { lat: 23.7957, lng: 86.4304 }
      }
    ],

    // Karnataka - Adani Group Plants
    karnataka: [
      // Integrated Units
      {
        id: 'iu_karnataka_kalaburagi',
        name: 'Orient Kalaburagi IU',
        type: 'integrated_unit',
        city: 'Kalaburagi',
        capacity: 3200,
        brand: 'Orient',
        coordinates: { lat: 17.3297, lng: 76.8343 }
      },
      {
        id: 'iu_karnataka_wadi',
        name: 'ACC Wadi IU',
        type: 'integrated_unit',
        city: 'Wadi',
        capacity: 4000,
        brand: 'ACC',
        coordinates: { lat: 17.06, lng: 76.98 }
      },
      // Grinding Units
      {
        id: 'gu_karnataka_bellary',
        name: 'ACC Bellary GU',
        type: 'grinding_unit',
        city: 'Bellary',
        capacity: 1800,
        brand: 'ACC',
        coordinates: { lat: 15.18, lng: 76.81 }
      },
      {
        id: 'gu_karnataka_kolar',
        name: 'ACC Kolar GU',
        type: 'grinding_unit',
        city: 'Kolar',
        capacity: 1500,
        brand: 'ACC',
        coordinates: { lat: 13.51, lng: 77.42 }
      },
      {
        id: 'gu_karnataka_mangalore',
        name: 'Ambuja Mangalore BCT',
        type: 'grinding_unit',
        city: 'Mangalore',
        capacity: 1200,
        brand: 'Ambuja',
        coordinates: { lat: 12.9141, lng: 74.856 }
      }
    ],

    // Madhya Pradesh - Adani Group Plants
    madhya_pradesh: [
      // Integrated Units
      {
        id: 'iu_madhya_pradesh_kymore',
        name: 'ACC Kymore IU',
        type: 'integrated_unit',
        city: 'Kymore',
        capacity: 3800,
        brand: 'ACC',
        coordinates: { lat: 24.03, lng: 80.58 }
      },
      {
        id: 'iu_madhya_pradesh_ametha',
        name: 'ACC Ametha IU',
        type: 'integrated_unit',
        city: 'Ametha',
        capacity: 2500,
        brand: 'ACC',
        coordinates: { lat: 23.95, lng: 80.6 }
      }
    ],

    // Maharashtra - Adani Group Plants
    maharashtra: [
      // Integrated Units
      {
        id: 'iu_maharashtra_jalgaon',
        name: 'Orient Jalgaon IU',
        type: 'integrated_unit',
        city: 'Jalgaon',
        capacity: 2800,
        brand: 'Orient',
        coordinates: { lat: 21.0077, lng: 75.5626 }
      },
      {
        id: 'iu_maharashtra_chanda',
        name: 'ACC Chanda IU',
        type: 'integrated_unit',
        city: 'Chanda',
        capacity: 3500,
        brand: 'ACC',
        coordinates: { lat: 19.92, lng: 79.28 }
      },
      {
        id: 'iu_maharashtra_solapur',
        name: 'Ambuja Solapur IU',
        type: 'integrated_unit',
        city: 'Solapur',
        capacity: 4200,
        brand: 'Ambuja',
        coordinates: { lat: 17.6599, lng: 75.9064 }
      },
      {
        id: 'iu_maharashtra_patas',
        name: 'Penna Patas IU',
        type: 'integrated_unit',
        city: 'Patas',
        capacity: 2600,
        brand: 'Penna',
        coordinates: { lat: 18.4419, lng: 74.4508 }
      },
      // Bulk Cement Terminals
      {
        id: 'gu_maharashtra_kalamboli',
        name: 'ACC Kalamboli BCT',
        type: 'grinding_unit',
        city: 'Kalamboli',
        capacity: 2000,
        brand: 'ACC',
        coordinates: { lat: 19.0308, lng: 73.1022 }
      },
      {
        id: 'gu_maharashtra_panvel',
        name: 'Ambuja Panvel BCT',
        type: 'grinding_unit',
        city: 'Panvel',
        capacity: 2200,
        brand: 'Ambuja',
        coordinates: { lat: 18.9894, lng: 73.1175 }
      }
    ],

    // Odisha - Adani Group Plants
    odisha: [
      // Integrated Units
      {
        id: 'iu_odisha_bargarh',
        name: 'ACC Bargarh IU',
        type: 'integrated_unit',
        city: 'Bargarh',
        capacity: 3200,
        brand: 'ACC',
        coordinates: { lat: 21.3323, lng: 83.6214 }
      },
      // Bulk Cement Terminals
      {
        id: 'gu_odisha_gopalpur',
        name: 'Penna Gopalpur BCT',
        type: 'grinding_unit',
        city: 'Gopalpur',
        capacity: 1500,
        brand: 'Penna',
        coordinates: { lat: 19.2612, lng: 84.9126 }
      }
    ],

    // Andhra Pradesh - Adani Group Plants
    andhra_pradesh: [
      // Integrated Units
      {
        id: 'iu_andhra_pradesh_boyareddypalli',
        name: 'Penna Boyareddypalli IU',
        type: 'integrated_unit',
        city: 'Boyareddypalli',
        capacity: 2400,
        brand: 'Penna',
        coordinates: { lat: 14.88, lng: 77.92 }
      },
      {
        id: 'iu_andhra_pradesh_talaricheruvu',
        name: 'Penna Talaricheruvu IU',
        type: 'integrated_unit',
        city: 'Talaricheruvu',
        capacity: 2200,
        brand: 'Penna',
        coordinates: { lat: 14.92, lng: 78.02 }
      },
      // Grinding/Blending Units
      {
        id: 'gu_andhra_pradesh_visakhapatnam',
        name: 'ACC Visakhapatnam BU',
        type: 'grinding_unit',
        city: 'Visakhapatnam',
        capacity: 1900,
        brand: 'ACC',
        coordinates: { lat: 17.6868, lng: 83.2185 }
      },
      {
        id: 'gu_andhra_pradesh_krishnapatnam',
        name: 'Penna Krishnapatnam BCT',
        type: 'grinding_unit',
        city: 'Krishnapatnam',
        capacity: 1600,
        brand: 'Penna',
        coordinates: { lat: 14.25, lng: 80.1167 }
      }
    ],

    // Telangana - Adani Group Plants
    telangana: [
      // Integrated Units
      {
        id: 'iu_telangana_devapur',
        name: 'Orient Devapur IU',
        type: 'integrated_unit',
        city: 'Devapur',
        capacity: 2800,
        brand: 'Orient',
        coordinates: { lat: 19.03, lng: 79.17 }
      },
      {
        id: 'iu_telangana_ganeshpahad',
        name: 'Penna Ganeshpahad IU',
        type: 'integrated_unit',
        city: 'Ganeshpahad',
        capacity: 2600,
        brand: 'Penna',
        coordinates: { lat: 16.85, lng: 79.52 }
      },
      {
        id: 'iu_telangana_mancherial',
        name: 'Penna Mancherial IU',
        type: 'integrated_unit',
        city: 'Mancherial',
        capacity: 3000,
        brand: 'Penna',
        coordinates: { lat: 18.87, lng: 79.44 }
      },
      {
        id: 'iu_telangana_tandur',
        name: 'Penna Tandur IU',
        type: 'integrated_unit',
        city: 'Tandur',
        capacity: 2400,
        brand: 'Penna',
        coordinates: { lat: 17.26, lng: 77.59 }
      }
    ],

    // Punjab - Adani Group Plants
    punjab: [
      // Grinding Units
      {
        id: 'gu_punjab_rajpura',
        name: 'ACC Rajpura GU',
        type: 'grinding_unit',
        city: 'Rajpura',
        capacity: 2000,
        brand: 'ACC',
        coordinates: { lat: 30.4842, lng: 76.5941 }
      },
      {
        id: 'gu_punjab_ropar',
        name: 'Ambuja Ropar GU',
        type: 'grinding_unit',
        city: 'Ropar',
        capacity: 2200,
        brand: 'Ambuja',
        coordinates: { lat: 30.97, lng: 76.53 }
      },
      {
        id: 'gu_punjab_bathinda',
        name: 'Ambuja Bathinda GU',
        type: 'grinding_unit',
        city: 'Bathinda',
        capacity: 1800,
        brand: 'Ambuja',
        coordinates: { lat: 30.211, lng: 74.9455 }
      },
      {
        id: 'gu_punjab_darla',
        name: 'Penna Darla GU',
        type: 'grinding_unit',
        city: 'Darla',
        capacity: 1600,
        brand: 'Penna',
        coordinates: { lat: 31.24, lng: 76.95 }
      }
    ],

    // Tamil Nadu - Adani Group Plants
    tamil_nadu: [
      // Grinding Units
      {
        id: 'gu_tamil_nadu_madukkarai',
        name: 'ACC Madukkarai GU',
        type: 'grinding_unit',
        city: 'Madukkarai',
        capacity: 1800,
        brand: 'ACC',
        coordinates: { lat: 10.91, lng: 76.96 }
      },
      {
        id: 'gu_tamil_nadu_tuticorin',
        name: 'Ambuja Tuticorin GU',
        type: 'grinding_unit',
        city: 'Tuticorin',
        capacity: 2000,
        brand: 'Ambuja',
        coordinates: { lat: 8.7642, lng: 78.1348 }
      },
      {
        id: 'gu_tamil_nadu_karaikal',
        name: 'Penna Karaikal BCT',
        type: 'grinding_unit',
        city: 'Karaikal',
        capacity: 1400,
        brand: 'Penna',
        coordinates: { lat: 10.9254, lng: 79.838 }
      }
    ],

    // Kerala - Adani Group Plants
    kerala: [
      // Bulk Cement Terminals
      {
        id: 'gu_kerala_kochi_ambuja',
        name: 'Ambuja Kochi BCT',
        type: 'grinding_unit',
        city: 'Kochi',
        capacity: 1600,
        brand: 'Ambuja',
        coordinates: { lat: 9.9312, lng: 76.2673 }
      },
      {
        id: 'gu_kerala_kochi_penna',
        name: 'Penna Kochi BCT',
        type: 'grinding_unit',
        city: 'Kochi',
        capacity: 1400,
        brand: 'Penna',
        coordinates: { lat: 9.9312, lng: 76.2673 }
      }
    ],

    // Uttar Pradesh - Adani Group Plants
    uttar_pradesh: [
      // Grinding Units
      {
        id: 'gu_uttar_pradesh_dadri',
        name: 'Ambuja Dadri GU',
        type: 'grinding_unit',
        city: 'Dadri',
        capacity: 2200,
        brand: 'Ambuja',
        coordinates: { lat: 28.55, lng: 77.55 }
      },
      {
        id: 'gu_uttar_pradesh_tikaria',
        name: 'ACC Tikaria GU',
        type: 'grinding_unit',
        city: 'Tikaria',
        capacity: 1800,
        brand: 'ACC',
        coordinates: { lat: 26.24, lng: 81.33 }
      }
    ],

    // Uttarakhand - Adani Group Plants
    uttarakhand: [
      // Grinding Units
      {
        id: 'gu_uttarakhand_roorkee',
        name: 'Ambuja Roorkee GU',
        type: 'grinding_unit',
        city: 'Roorkee',
        capacity: 2000,
        brand: 'Ambuja',
        coordinates: { lat: 29.85, lng: 77.88 }
      }
    ],

    // West Bengal - Adani Group Plants
    west_bengal: [
      // Grinding Units
      {
        id: 'gu_west_bengal_farakka',
        name: 'Ambuja Farakka GU',
        type: 'grinding_unit',
        city: 'Farakka',
        capacity: 2200,
        brand: 'Ambuja',
        coordinates: { lat: 24.78, lng: 87.91 }
      },
      {
        id: 'gu_west_bengal_damodhar',
        name: 'ACC Damodhar GU',
        type: 'grinding_unit',
        city: 'Damodhar',
        capacity: 1800,
        brand: 'ACC',
        coordinates: { lat: 23.58, lng: 87.12 }
      },
      {
        id: 'gu_west_bengal_sankrail',
        name: 'Ambuja Sankrail GU',
        type: 'grinding_unit',
        city: 'Sankrail',
        capacity: 2000,
        brand: 'Ambuja',
        coordinates: { lat: 22.58, lng: 88.25 }
      },
      {
        id: 'gu_west_bengal_kolkata',
        name: 'Penna Kolkata BCT',
        type: 'grinding_unit',
        city: 'Kolkata',
        capacity: 1600,
        brand: 'Penna',
        coordinates: { lat: 22.5726, lng: 88.3639 }
      }
    ]
  }
};

// Helper functions
export const getStateById = (stateId) => {
  return stateDatabase.states.find(state => state.id === stateId);
};

export const getPlantsByState = (stateId) => {
  return stateDatabase.plants[stateId] || [];
};

export const getPlantsByType = (stateId, type) => {
  const plants = getPlantsByState(stateId);
  return plants.filter(plant => plant.type === type);
};

export const getIntegratedUnits = (stateId) => {
  return getPlantsByType(stateId, 'integrated_unit');
};

export const getGrindingUnits = (stateId) => {
  return getPlantsByType(stateId, 'grinding_unit');
};

export const getAllIntegratedUnits = () => {
  const allUnits = [];
  Object.keys(stateDatabase.plants).forEach(stateId => {
    const units = getIntegratedUnits(stateId);
    allUnits.push(...units);
  });
  return allUnits;
};

export const getAllGrindingUnits = () => {
  const allUnits = [];
  Object.keys(stateDatabase.plants).forEach(stateId => {
    const units = getGrindingUnits(stateId);
    allUnits.push(...units);
  });
  return allUnits;
};

export const getPlantById = (plantId) => {
  for (const stateId in stateDatabase.plants) {
    const plant = stateDatabase.plants[stateId].find(p => p.id === plantId);
    if (plant) return plant;
  }
  return null;
};

// Calculate distance between two plants using road distance database first, fallback to GPS
export const calculateDistance = (plant1, plant2) => {
  // Try to get road distance first
  const roadDistance = getRoadDistance(plant1.id, plant2.id);
  
  if (roadDistance) {
    return roadDistance.distance;
  }
  
  // Use actual coordinates for accurate distance calculation
  let coords1 = plant1.coordinates;
  let coords2 = plant2.coordinates;
  
  if (coords1 && coords2) {
    // Calculate accurate road distance using Haversine formula with realistic road multipliers
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLng = (coords2.lng - coords1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const straightLineDistance = R * c;
    
    // Apply realistic road distance multipliers based on actual Indian highway network
    let roadMultiplier = 1.25; // Base 25% increase for road vs straight line
    
    // Distance-based multipliers (longer distances have more efficient highways)
    if (straightLineDistance < 50) {
      roadMultiplier = 1.15; // 15% increase for very short distances (local roads)
    } else if (straightLineDistance < 150) {
      roadMultiplier = 1.20; // 20% increase for short distances (state highways)
    } else if (straightLineDistance < 400) {
      roadMultiplier = 1.25; // 25% increase for medium distances (national highways)
    } else if (straightLineDistance < 800) {
      roadMultiplier = 1.30; // 30% increase for long distances (expressways)
    } else {
      roadMultiplier = 1.35; // 35% increase for very long distances (major corridors)
    }
    
    // State-based adjustments for terrain and infrastructure
    const fromState = plant1.id.split('_')[1];
    const toState = plant2.id.split('_')[1];
    
    // Mountainous regions have higher multipliers
    const mountainousStates = ['himachal_pradesh', 'uttarakhand'];
    if (mountainousStates.includes(fromState) || mountainousStates.includes(toState)) {
      roadMultiplier += 0.10; // Add 10% for mountainous terrain
    }
    
    // Interstate travel typically requires detours
    if (fromState !== toState) {
      roadMultiplier += 0.05; // Add 5% for interstate travel
    }
    
    // Major corridor adjustments (well-developed highway networks)
    const majorCorridors = [
      ['gujarat', 'rajasthan'], ['gujarat', 'maharashtra'], ['maharashtra', 'karnataka'],
      ['karnataka', 'andhra_pradesh'], ['andhra_pradesh', 'telangana']
    ];
    
    const isOnMajorCorridor = majorCorridors.some(corridor => 
      (corridor.includes(fromState) && corridor.includes(toState))
    );
    
    if (isOnMajorCorridor && straightLineDistance > 300) {
      roadMultiplier -= 0.05; // Reduce 5% for major corridors (better highways)
    }
    
    const roadDistance = Math.round(straightLineDistance * roadMultiplier);
    
    // Validate distance is reasonable (between 10km and 3000km)
    if (roadDistance >= 10 && roadDistance <= 3000) {
      return roadDistance;
    }
  }
  
  // Fallback to improved state-based distance matrix
  const city1 = plant1.city;
  const city2 = plant2.city;
  const fromState = plant1.id.split('_')[1];
  const toState = plant2.id.split('_')[1];
  
  // Realistic state-based distance matrix
  const stateDistances = {
    // Same state distances (realistic intrastate averages)
    'gujarat-gujarat': 280,
    'rajasthan-rajasthan': 350,
    'maharashtra-maharashtra': 380,
    'karnataka-karnataka': 320,
    'andhra_pradesh-andhra_pradesh': 350,
    'telangana-telangana': 200,
    'odisha-odisha': 280,
    'chhattisgarh-chhattisgarh': 220,
    'madhya_pradesh-madhya_pradesh': 380,
    'haryana-haryana': 180,
    'punjab-punjab': 250,
    'uttar_pradesh-uttar_pradesh': 320,
    'west_bengal-west_bengal': 280,
    'himachal_pradesh-himachal_pradesh': 180,
    'jharkhand-jharkhand': 220,
    'tamil_nadu-tamil_nadu': 350,
    'kerala-kerala': 180,
    'uttarakhand-uttarakhand': 120,
    
    // Interstate distances (based on major highway routes)
    'gujarat-rajasthan': 520, 'rajasthan-gujarat': 520,
    'gujarat-maharashtra': 650, 'maharashtra-gujarat': 650,
    'gujarat-madhya_pradesh': 780, 'madhya_pradesh-gujarat': 780,
    'gujarat-haryana': 850, 'haryana-gujarat': 850,
    'gujarat-punjab': 750, 'punjab-gujarat': 750,
    'gujarat-uttar_pradesh': 920, 'uttar_pradesh-gujarat': 920,
    'rajasthan-haryana': 380, 'haryana-rajasthan': 380,
    'rajasthan-punjab': 450, 'punjab-rajasthan': 450,
    'rajasthan-uttar_pradesh': 580, 'uttar_pradesh-rajasthan': 580,
    'rajasthan-madhya_pradesh': 520, 'madhya_pradesh-rajasthan': 520,
    'maharashtra-karnataka': 520, 'karnataka-maharashtra': 520,
    'maharashtra-telangana': 380, 'telangana-maharashtra': 380,
    'maharashtra-andhra_pradesh': 450, 'andhra_pradesh-maharashtra': 450,
    'maharashtra-madhya_pradesh': 420, 'madhya_pradesh-maharashtra': 420,
    'karnataka-andhra_pradesh': 280, 'andhra_pradesh-karnataka': 280,
    'karnataka-telangana': 320, 'telangana-karnataka': 320,
    'karnataka-tamil_nadu': 350, 'tamil_nadu-karnataka': 350,
    'karnataka-kerala': 220, 'kerala-karnataka': 220,
    'andhra_pradesh-telangana': 180, 'telangana-andhra_pradesh': 180,
    'andhra_pradesh-tamil_nadu': 420, 'tamil_nadu-andhra_pradesh': 420,
    'telangana-odisha': 650, 'odisha-telangana': 650,
    'telangana-chhattisgarh': 480, 'chhattisgarh-telangana': 480,
    'odisha-west_bengal': 420, 'west_bengal-odisha': 420,
    'odisha-chhattisgarh': 320, 'chhattisgarh-odisha': 320,
    'odisha-jharkhand': 280, 'jharkhand-odisha': 280,
    'chhattisgarh-madhya_pradesh': 280, 'madhya_pradesh-chhattisgarh': 280,
    'madhya_pradesh-uttar_pradesh': 420, 'uttar_pradesh-madhya_pradesh': 420,
    'haryana-uttar_pradesh': 280, 'uttar_pradesh-haryana': 280,
    'haryana-punjab': 180, 'punjab-haryana': 180,
    'haryana-himachal_pradesh': 220, 'himachal_pradesh-haryana': 220,
    'punjab-himachal_pradesh': 150, 'himachal_pradesh-punjab': 150,
    'uttarakhand-uttar_pradesh': 180, 'uttar_pradesh-uttarakhand': 180,
    'uttarakhand-haryana': 280, 'haryana-uttarakhand': 280,
    'west_bengal-jharkhand': 220, 'jharkhand-west_bengal': 220,
    'tamil_nadu-kerala': 250, 'kerala-tamil_nadu': 250,
    
    // Long distance routes (major expressways and corridors)
    'gujarat-odisha': 1180, 'odisha-gujarat': 1180,
    'gujarat-west_bengal': 1420, 'west_bengal-gujarat': 1420,
    'gujarat-tamil_nadu': 1250, 'tamil_nadu-gujarat': 1250,
    'gujarat-kerala': 1320, 'kerala-gujarat': 1320,
    'rajasthan-west_bengal': 1050, 'west_bengal-rajasthan': 1050,
    'rajasthan-odisha': 980, 'odisha-rajasthan': 980,
    'maharashtra-west_bengal': 920, 'west_bengal-maharashtra': 920,
    'maharashtra-tamil_nadu': 780, 'tamil_nadu-maharashtra': 780,
    'maharashtra-kerala': 850, 'kerala-maharashtra': 850,
    'haryana-west_bengal': 1120, 'west_bengal-haryana': 1120,
    'punjab-west_bengal': 1180, 'west_bengal-punjab': 1180
  };
  
  const routeKey = `${fromState}-${toState}`;
  const distance = stateDistances[routeKey];
  
  if (distance) {
    return distance;
  }
  
  return 450; // Reasonable default distance if no route found
};

// Get detailed route information including highway routes and terrain
export const getRouteDetails = (plant1, plant2) => {
  const roadDistance = getRoadDistance(plant1.id, plant2.id);
  
  if (roadDistance) {
    return {
      distance: roadDistance.distance,
      route: roadDistance.route,
      tollRoads: roadDistance.tollRoads,
      terrain: roadDistance.terrain,
      isRoadDistance: true
    };
  }
  
  // Fallback to GPS calculation with improved route estimation
  const distance = calculateDistance(plant1, plant2);
  const fromState = plant1.id.split('_')[1];
  const toState = plant2.id.split('_')[1];
  
  // Determine likely route type based on distance and states
  let routeDescription = 'Highway route';
  let terrain = 'highway';
  let tollRoads = false;
  
  if (distance > 500) {
    routeDescription = 'Major highway route (NH)';
    terrain = 'highway';
    tollRoads = true;
  } else if (distance > 200) {
    routeDescription = 'State highway route (SH)';
    terrain = 'highway';
    tollRoads = distance > 300;
  } else {
    routeDescription = 'Regional road route';
    terrain = 'mixed';
    tollRoads = false;
  }
  
  // Add interstate indicator
  if (fromState !== toState) {
    routeDescription += ' (Interstate)';
    tollRoads = true;
  }
  
  return {
    distance: distance,
    route: routeDescription,
    tollRoads: tollRoads,
    terrain: terrain,
    isRoadDistance: false
  };
};