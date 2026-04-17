# Plant Data Location Guide

## Overview
This guide explains where all plant information is stored in the Clinker Optimization System and how to access and modify plant data.

## 🏭 Plant Data Storage Locations

### 1. **Primary Plant Database** - `server/index.js`
**Location**: Lines 8-120 in `server/index.js`

#### **Integrated Units (IUs) - 11 Plants**
```javascript
const adaniGroupPlants = {
  integratedUnits: [
    // Adani Cement IUs - 5 plants (19,300T capacity)
    { id: 'iu_gujarat_mundra', name: 'Adani Cement Mundra IU', state: 'gujarat', city: 'Mundra', capacity: 6000, cost: 3800, inventory: 4800, safetyStock: 600, maxInventory: 7200 },
    { id: 'iu_rajasthan_lakheri', name: 'Adani Cement Lakheri IU', state: 'rajasthan', city: 'Lakheri', capacity: 4000, cost: 4200, inventory: 3200, safetyStock: 400, maxInventory: 4800 },
    { id: 'iu_odisha_sundargarh', name: 'Adani Cement Sundargarh IU', state: 'odisha', city: 'Sundargarh', capacity: 3500, cost: 3900, inventory: 2800, safetyStock: 350, maxInventory: 4200 },
    { id: 'iu_chhattisgarh_raipur', name: 'Adani Cement Raipur IU', state: 'chhattisgarh', city: 'Raipur', capacity: 3000, cost: 4100, inventory: 2400, safetyStock: 300, maxInventory: 3600 },
    { id: 'iu_madhya_pradesh_rewa', name: 'Adani Cement Rewa IU', state: 'madhya_pradesh', city: 'Rewa', capacity: 2800, cost: 4300, inventory: 2240, safetyStock: 280, maxInventory: 3360 },
    
    // Ambuja Cement IUs - 6 plants (28,700T capacity)
    { id: 'iu_gujarat_kodinar', name: 'Ambuja Cement Kodinar IU', state: 'gujarat', city: 'Kodinar', capacity: 9000, cost: 3600, inventory: 7200, safetyStock: 900, maxInventory: 10800 },
    { id: 'iu_rajasthan_marwar', name: 'Ambuja Cement Marwar IU', state: 'rajasthan', city: 'Marwar Mundwa', capacity: 6000, cost: 3950, inventory: 4800, safetyStock: 600, maxInventory: 7200 },
    { id: 'iu_chhattisgarh_bhatapara', name: 'Ambuja Cement Bhatapara IU', state: 'chhattisgarh', city: 'Bhatapara', capacity: 4500, cost: 3850, inventory: 3600, safetyStock: 450, maxInventory: 5400 },
    { id: 'iu_maharashtra_chandrapur', name: 'Ambuja Cement Chandrapur IU', state: 'maharashtra', city: 'Chandrapur', capacity: 3000, cost: 4150, inventory: 2400, safetyStock: 300, maxInventory: 3600 },
    { id: 'iu_himachal_pradesh_darlaghat', name: 'Ambuja Cement Darlaghat IU', state: 'himachal_pradesh', city: 'Darlaghat', capacity: 3500, cost: 4400, inventory: 2800, safetyStock: 350, maxInventory: 4200 },
    { id: 'iu_karnataka_rabriyawas', name: 'Ambuja Cement Rabriyawas IU', state: 'karnataka', city: 'Rabriyawas', capacity: 2700, cost: 4250, inventory: 2160, safetyStock: 270, maxInventory: 3240 }
  ]
}
```

#### **Grinding Units (GUs) - 31 Plants**
```javascript
grindingUnits: [
  // Gujarat GUs (5 plants)
  { id: 'gu_gujarat_ahmedabad', name: 'Adani Cement Ahmedabad GU', state: 'gujarat', city: 'Ahmedabad', capacity: 2000, demand: [1600, 1700, 1800, 1900], maxInventory: 2400 },
  { id: 'gu_gujarat_surat', name: 'Adani Cement Surat GU', state: 'gujarat', city: 'Surat', capacity: 1500, demand: [1200, 1300, 1400, 1500], maxInventory: 1800 },
  // ... and 29 more GUs across 12 states
]
```

### 2. **State-Based Plant Database** - `src/data/stateDatabase.js`
**Location**: Complete file with state-organized plant data

#### **State Structure**
```javascript
export const stateDatabase = {
  states: [
    {
      id: 'gujarat',
      name: 'Gujarat',
      code: 'GJ',
      integrated_units: [
        { id: 'iu_gujarat_mundra', name: 'Adani Cement Mundra IU', city: 'Mundra', capacity: 6000 },
        { id: 'iu_gujarat_kodinar', name: 'Ambuja Cement Kodinar IU', city: 'Kodinar', capacity: 9000 }
      ],
      grinding_units: [
        { id: 'gu_gujarat_ahmedabad', name: 'Adani Cement Ahmedabad GU', city: 'Ahmedabad', capacity: 2000 },
        // ... more GUs
      ]
    },
    // ... 13 more states
  ]
};
```

### 3. **Road Distance Database** - `src/data/roadDistanceDatabase.js`
**Location**: Complete file with route information between plants

#### **Route Structure**
```javascript
export const roadDistanceDatabase = {
  'iu_gujarat_mundra': {
    'gu_gujarat_ahmedabad': { distance: 380, route: 'NH8A → NH47', tollRoads: true, terrain: 'highway' },
    'gu_gujarat_surat': { distance: 450, route: 'NH8A → NH8', tollRoads: true, terrain: 'highway' },
    // ... routes to all other plants
  },
  // ... routes from all other plants
};
```

## 📍 Plant Coverage by State

### **States with Both IUs and GUs**
1. **Gujarat** - 2 IUs, 5 GUs
2. **Rajasthan** - 2 IUs, 3 GUs  
3. **Chhattisgarh** - 2 IUs, 1 GU
4. **Maharashtra** - 1 IU, 4 GUs
5. **Odisha** - 1 IU, 2 GUs
6. **Madhya Pradesh** - 1 IU, 2 GUs
7. **Karnataka** - 1 IU, 2 GUs

### **States with Only GUs**
8. **Andhra Pradesh** - 2 GUs
9. **Telangana** - 1 GU
10. **Haryana** - 3 GUs
11. **Uttar Pradesh** - 3 GUs
12. **West Bengal** - 2 GUs
13. **Punjab** - 1 GU
14. **Himachal Pradesh** - 1 IU

## 🔧 API Endpoints for Plant Data

### **Backend API Endpoints**
```javascript
// Get all plants (IUs and GUs)
GET /api/plants
// Returns: { integrated_units: [...], grinding_units: [...] }

// Get only integrated units
GET /api/integrated-units
// Returns: [{ id, name, state, city, capacity, cost, inventory, ... }]

// Get only grinding units  
GET /api/grinding-units
// Returns: [{ id, name, state, city, capacity, demand, maxInventory, ... }]

// Plant management endpoints
POST /api/integrated-units     // Create new IU
PUT /api/integrated-units/:id  // Update existing IU
DELETE /api/integrated-units/:id // Delete IU (custom only)

POST /api/grinding-units       // Create new GU
PUT /api/grinding-units/:id    // Update existing GU
DELETE /api/grinding-units/:id // Delete GU (custom only)
```

### **Frontend Helper Functions**
```javascript
// From src/data/stateDatabase.js
export const getIntegratedUnits = (stateId) => { ... }
export const getGrindingUnits = (stateId) => { ... }
export const getAllIntegratedUnits = () => { ... }
export const getAllGrindingUnits = () => { ... }
export const getPlantById = (plantId) => { ... }
export const calculateDistance = (fromPlantId, toPlantId) => { ... }
export const getRouteDetails = (fromPlant, toPlant) => { ... }
```

## 📊 Plant Data Structure

### **Integrated Unit (IU) Fields**
```javascript
{
  id: 'iu_state_city',           // Unique identifier
  name: 'Company Name City IU',   // Display name
  state: 'state_id',             // State identifier
  city: 'City Name',             // City name
  capacity: 6000,                // Production capacity (tonnes)
  cost: 3800,                    // Production cost per tonne (₹)
  inventory: 4800,               // Current inventory (tonnes)
  safetyStock: 600,              // Safety stock level (tonnes)
  maxInventory: 7200             // Maximum inventory capacity (tonnes)
}
```

### **Grinding Unit (GU) Fields**
```javascript
{
  id: 'gu_state_city',           // Unique identifier
  name: 'Company Name City GU',   // Display name
  state: 'state_id',             // State identifier
  city: 'City Name',             // City name
  capacity: 2000,                // Processing capacity (tonnes)
  demand: [1600, 1700, 1800, 1900], // Quarterly demand forecast
  maxInventory: 2400             // Maximum inventory capacity (tonnes)
}
```

## 🗺️ Geographic Distribution

### **Total Network Capacity**
- **Integrated Units**: 48,000T total capacity across 11 plants
- **Grinding Units**: 54,400T total capacity across 31 plants
- **Combined Network**: 102,400T total capacity across 42 plants
- **Geographic Coverage**: 14 states across India

### **Company Distribution**
- **Adani Cement**: 5 IUs (19,300T) + 26 GUs (42,000T)
- **Ambuja Cements**: 6 IUs (28,700T) + 5 GUs (12,400T)
- **Total Adani Group**: 11 IUs + 31 GUs = 42 plants

## 🔄 Data Management

### **Adding New Plants**

#### **1. Backend (server/index.js)**
```javascript
// Add to adaniGroupPlants.integratedUnits or grindingUnits array
{
  id: 'iu_newstate_newcity',
  name: 'New Plant Name IU',
  state: 'newstate',
  city: 'New City',
  capacity: 5000,
  cost: 4000,
  inventory: 4000,
  safetyStock: 500,
  maxInventory: 6000
}
```

#### **2. Frontend (src/data/stateDatabase.js)**
```javascript
// Add to appropriate state's integrated_units or grinding_units array
{
  id: 'iu_newstate_newcity',
  name: 'New Plant Name IU',
  city: 'New City',
  capacity: 5000
}
```

#### **3. Routes (src/data/roadDistanceDatabase.js)**
```javascript
// Add routes from new plant to all existing plants
'iu_newstate_newcity': {
  'gu_gujarat_ahmedabad': { distance: 500, route: 'NH1 → NH8', tollRoads: true, terrain: 'highway' },
  // ... routes to all other plants
}
```

### **Plant Data Validation**
- **ID Format**: `{type}_{state}_{city}` (e.g., `iu_gujarat_mundra`)
- **Required Fields**: id, name, state, city, capacity
- **State Consistency**: State ID must exist in stateDatabase
- **Unique IDs**: No duplicate plant IDs allowed

## 🚀 Accessing Plant Data

### **In React Components**
```javascript
import { 
  getIntegratedUnits, 
  getGrindingUnits, 
  getPlantById 
} from '../data/stateDatabase';

// Get plants by state
const gujaratIUs = getIntegratedUnits('gujarat');
const gujaratGUs = getGrindingUnits('gujarat');

// Get specific plant
const plant = getPlantById('iu_gujarat_mundra');
```

### **Via API Calls**
```javascript
// Fetch all plants
const response = await fetch('/api/plants');
const { integrated_units, grinding_units } = await response.json();

// Fetch specific plant type
const ius = await fetch('/api/integrated-units').then(r => r.json());
const gus = await fetch('/api/grinding-units').then(r => r.json());
```

## 📝 Plant Data Summary

### **Quick Stats**
- **Total Plants**: 42 (11 IUs + 31 GUs)
- **States Covered**: 14 states
- **Companies**: Adani Cement + Ambuja Cements (Adani Group)
- **Total Capacity**: 102,400 tonnes
- **Route Database**: 100+ pre-calculated routes with real highway information

### **Data Files**
1. **server/index.js** - Complete plant database with all details
2. **src/data/stateDatabase.js** - State-organized plant data for frontend
3. **src/data/roadDistanceDatabase.js** - Route information between plants

All plant information is centrally managed and synchronized across these three locations to ensure consistency throughout the application.