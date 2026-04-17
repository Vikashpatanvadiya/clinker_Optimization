# Plant Data Quick Reference

## 🏭 Where to Find Plant Information

### **1. Complete Plant Database** 
📁 **File**: `server/index.js` (Lines 8-120)
- **11 Integrated Units (IUs)** - Total capacity: 48,000T
- **31 Grinding Units (GUs)** - Total capacity: 54,400T
- **Full Details**: capacity, cost, inventory, safety stock, demand forecasts

### **2. State-Organized Plant Data**
📁 **File**: `src/data/stateDatabase.js`
- **14 States** with plant listings
- **Frontend Helper Functions** for plant filtering
- **Search-Friendly Format** for UI components

### **3. Route Information**
📁 **File**: `src/data/roadDistanceDatabase.js`
- **100+ Pre-calculated Routes** between plants
- **Real Highway Information** (NH8, NH44, NH16, etc.)
- **Distance, Terrain, Toll Road Data**

## 🌍 Plant Distribution

### **States with Plants**
1. **Gujarat** - 2 IUs, 5 GUs (Mundra, Kodinar + Ahmedabad, Surat, Rajkot, Ambujanagar, Vadodara)
2. **Rajasthan** - 2 IUs, 3 GUs (Lakheri, Marwar + Jaipur, Jodhpur, Ropar)
3. **Maharashtra** - 1 IU, 4 GUs (Chandrapur + Mumbai, Pune, Nagpur, Faizpur)
4. **Chhattisgarh** - 2 IUs, 1 GU (Raipur, Bhatapara + Bilaspur)
5. **Odisha** - 1 IU, 2 GUs (Sundargarh + Bhubaneswar, Rourkela)
6. **Madhya Pradesh** - 1 IU, 2 GUs (Rewa + Bhopal, Indore)
7. **Karnataka** - 1 IU, 2 GUs (Rabriyawas + Bangalore, Mysore)
8. **Himachal Pradesh** - 1 IU (Darlaghat)
9. **Andhra Pradesh** - 2 GUs (Visakhapatnam, Vijayawada)
10. **Telangana** - 1 GU (Hyderabad)
11. **Haryana** - 3 GUs (Faridabad, Gurgaon, Dadri)
12. **Uttar Pradesh** - 3 GUs (Lucknow, Kanpur, Agra)
13. **West Bengal** - 2 GUs (Kolkata, Durgapur)
14. **Punjab** - 1 GU (Bathinda)

## 🔌 API Endpoints

### **Get All Plants**
```bash
GET /api/plants
# Returns: { integrated_units: [11 plants], grinding_units: [31 plants] }
```

### **Get Specific Plant Types**
```bash
GET /api/integrated-units  # 11 IUs
GET /api/grinding-units    # 31 GUs
```

### **Transport Modes (Now Includes Railway)**
```bash
GET /api/transport-modes
# Returns: [Road, Rail, Barge] with costs and capacities
```

## 🚂 Railway Transport Added

### **Transport Mode Configuration**
- ✅ **Road** - ₹8,340/trip, 50T capacity, 25T min batch
- ✅ **Rail** - ₹25,020/trip, 60T capacity, 30T min batch  
- ✅ **Barge** - ₹41,700/trip, 500T capacity, 250T min batch

### **Usage Context**
- **Transport Mode Configuration**: All 3 modes available (Road, Rail, Barge)
- **Fleet Management**: Only Road transport (Rail excluded from fleet)
- **Smart Recommendations**: Only Road transport (Rail excluded from recommendations)

## 📊 Quick Stats
- **Total Plants**: 42 (11 IUs + 31 GUs)
- **Total Capacity**: 102,400 tonnes
- **Geographic Coverage**: 14 Indian states
- **Companies**: Adani Cement + Ambuja Cements (Adani Group)
- **Route Database**: 100+ highway routes with real distances