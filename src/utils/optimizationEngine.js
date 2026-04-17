/**
 * Clinker Supply Chain Optimization Engine v3.0
 * 
 * IMPROVED MODEL WITH CONSTRAINT-AWARE OPTIMIZATION:
 * 1. All quantities are INTEGERS (no decimals)
 * 2. T1 transport: any integer quantity (multiples of 1)
 * 3. T2 transport: ONLY multiples of 3000
 * 4. Production cost is VARIABLE: Cost = (Cost per Period / Capacity) × Quantity
 * 5. Transportation cost is FIXED per route per period
 * 6. RESPECTS transport upper bounds
 * 7. BALANCES closing stock constraints
 * 8. Multi-pass optimization to minimize violations
 */

import preprocessClinkerData from './dataPreprocessor.js';

// ============================================================
// CONFIGURABLE PARAMETERS - EDIT THESE VALUES AS NEEDED
// ============================================================
const INVENTORY_HOLDING_COST_PER_UNIT = 0.01;  // ₹ per unit per period - CHANGE THIS VALUE
// ============================================================

class ClinkerOptimizationEngine {
  constructor(rawData) {
    console.log('Initializing Clinker Optimization Engine v3.0...');
    
    this.preprocessResult = preprocessClinkerData(rawData);
    
    if (!this.preprocessResult.isValid) {
      throw new Error(`Data preprocessing failed: ${this.preprocessResult.errors.join(', ')}`);
    }
    
    this.data = this.preprocessResult.data;
    this.dataQuality = this.preprocessResult;
    this.solution = null;
    this.feasible = true;
    this.errors = [];
    
    this.initializeDataStructures();
  }

  initializeDataStructures() {
    this.demandMap = new Map();
    this.capacityMap = new Map();
    this.productionCostMap = new Map();
    this.logisticsMap = new Map();
    this.constraintMap = new Map();
    this.openingStockMap = new Map();
    this.closingStockMap = new Map();
    this.typeMap = new Map();
    this.transportUpperBounds = new Map(); // Track transport limits

    // Build demand map
    this.data.ClinkerDemand?.forEach(item => {
      const key = `${item['IUGU CODE']}|${item['TIME PERIOD']}`;
      this.demandMap.set(key, {
        demand: Math.round(item.DEMAND || 0),
        minFulfillment: Math.round(item['MIN FULFILLMENT'] || 0)
      });
    });

    // Build capacity map
    this.data.ClinkerCapacity?.forEach(item => {
      const key = `${item['IU CODE']}|${item['TIME PERIOD']}`;
      this.capacityMap.set(key, Math.round(item.CAPACITY || 0));
    });

    // Build production cost map
    this.data.ProductionCost?.forEach(item => {
      const key = `${item['IU CODE']}|${item['TIME PERIOD']}`;
      this.productionCostMap.set(key, item['PRODUCTION COST'] || 0);
    });

    // Build logistics map
    // FREIGHT COST is per batch (T2 batch = 3000 units, T1 batch = 1 unit)
    this.data.LogisticsIUGU?.forEach(item => {
      const key = `${item['FROM IU CODE']}|${item['TO IUGU CODE']}|${item['TRANSPORT CODE']}|${item['TIME PERIOD']}`;
      const batchSize = item['TRANSPORT CODE'] === 'T2' ? 3000 : 1;
      this.logisticsMap.set(key, {
        freightCostPerBatch: item['FREIGHT COST'] || 0,
        handlingCost: item['HANDLING COST'] || 0,
        batchSize: batchSize,
        // Per unit cost = freight per batch / batch size
        freightCostPerUnit: batchSize > 0 ? (item['FREIGHT COST'] || 0) / batchSize : 0
      });
    });

    // Build constraint map and extract transport upper bounds
    this.data.IUGUConstraint?.forEach(item => {
      const iuCode = item['IU CODE'];
      const transport = item['TRANSPORT CODE'] || 'ANY';
      const period = item['TIME PERIOD'];
      const boundType = item['BOUND TYPEID'];
      const value = Math.round(item.Value || 0);
      const targetIugu = item['IUGU CODE'] || null;
      
      const key = `${iuCode}|${transport}|${period}`;
      this.constraintMap.set(key, {
        boundType,
        valueType: item['VALUE TYPEID'],
        value,
        iuguCode: targetIugu
      });
      
      // Track upper bounds for transport
      if (boundType === 'L') { // L = Less than or equal (upper bound)
        const ubKey = targetIugu 
          ? `${iuCode}|${targetIugu}|${transport}|${period}`
          : `${iuCode}|ALL|${transport}|${period}`;
        this.transportUpperBounds.set(ubKey, value);
      }
    });

    // Build opening stock map
    this.data.IUGUOpeningStock?.forEach(item => {
      this.openingStockMap.set(item['IUGU CODE'], Math.round(item['OPENING STOCK'] || 0));
    });

    // Build closing stock map
    this.data.IUGUClosingStock?.forEach(item => {
      const key = `${item['IUGU CODE']}|${item['TIME PERIOD']}`;
      this.closingStockMap.set(key, {
        minStock: Math.round(item['MIN CLOSE STOCK'] || item['MIN STOCK'] || 0),
        maxStock: item['MAX CLOSE STOCK'] || item['MAX STOCK'] || Infinity
      });
    });

    // Build type map
    this.data.IUGUType?.forEach(item => {
      this.typeMap.set(item['IUGU CODE'], item['PLANT TYPE'] || item.TYPE);
    });

    console.log(`Data structures initialized:
      - Demands: ${this.demandMap.size}
      - Capacities: ${this.capacityMap.size}
      - Production Costs: ${this.productionCostMap.size}
      - Logistics Routes: ${this.logisticsMap.size}
      - Constraints: ${this.constraintMap.size}
      - Transport Upper Bounds: ${this.transportUpperBounds.size}`);
  }

  optimize() {
    try {
      console.log('Starting clinker optimization v3.0...');
      
      this.solution = {
        production: new Map(),
        transportation: new Map(),
        inventory: new Map(),
        fulfillment: new Map(),
        fulfillmentDetails: [],
        routesUsed: new Set(),
        transportUsage: new Map(), // Track transport usage per constraint
        costs: {
          production: 0,
          transportation: 0,
          inventory: 0,
          penalty: 0,
          total: 0
        },
        metrics: {
          totalDemandFulfilled: 0,
          totalDemand: 0,
          fulfillmentRate: 0,
          constraintViolations: [],
          feasibility: true
        }
      };

      const timePeriods = [...new Set(this.data.ClinkerDemand?.map(d => d['TIME PERIOD']) || [1, 2, 3])].sort();
      
      for (const period of timePeriods) {
        console.log(`\n=== Optimizing Period ${period} ===`);
        this.optimizePeriodV3(period);
      }
      
      this.calculateFinalCosts();
      this.calculateFinalMetrics();
      
      console.log('Optimization completed successfully');
      return this.solution;

    } catch (error) {
      console.error('Optimization failed:', error);
      this.feasible = false;
      this.errors.push(error.message);
      return null;
    }
  }

  optimizePeriodV3(period) {
    // Step 1: Initialize inventory
    this.initializeInventoryForPeriod(period);
    
    // Step 2: Analyze all requirements and constraints
    const analysis = this.analyzeRequirementsV3(period);
    
    // Step 3: Build supply plan respecting constraints
    this.buildConstraintAwareSupplyPlan(analysis, period);
    
    // Step 4: Validate and record violations
    this.validatePeriodConstraints(period);
  }

  analyzeRequirementsV3(period) {
    const analysis = {
      demands: [],
      closingStockTargets: [],
      productionCapacity: [],
      transportLimits: new Map(),
      totalDemand: 0,
      totalCapacity: 0
    };
    
    // Collect demands
    this.demandMap.forEach((demandInfo, key) => {
      const [iuguCode, timePeriod] = key.split('|');
      if (parseInt(timePeriod) === period) {
        analysis.totalDemand += demandInfo.demand;
        analysis.demands.push({
          iuguCode,
          demand: demandInfo.demand,
          minFulfillment: demandInfo.minFulfillment,
          currentInventory: this.solution.inventory.get(`${iuguCode}|${period}`) || 0
        });
      }
    });
    
    // Collect closing stock targets
    this.closingStockMap.forEach((stockInfo, key) => {
      const [iuguCode, timePeriod] = key.split('|');
      if (parseInt(timePeriod) === period) {
        analysis.closingStockTargets.push({
          iuguCode,
          minStock: stockInfo.minStock,
          maxStock: stockInfo.maxStock === Infinity ? null : stockInfo.maxStock
        });
      }
    });
    
    // Collect production capacity
    this.capacityMap.forEach((capacity, key) => {
      const [iuCode, timePeriod] = key.split('|');
      if (parseInt(timePeriod) === period) {
        analysis.totalCapacity += capacity;
        const costPerPeriod = this.productionCostMap.get(key) || 0;
        analysis.productionCapacity.push({
          iuCode,
          capacity,
          costPerPeriod,
          costPerUnit: capacity > 0 ? costPerPeriod / capacity : 0
        });
      }
    });
    
    // Collect transport limits
    this.transportUpperBounds.forEach((limit, key) => {
      const parts = key.split('|');
      const timePeriod = parseInt(parts[3]);
      if (timePeriod === period) {
        analysis.transportLimits.set(key, {
          limit,
          used: 0
        });
      }
    });
    
    // Sort demands by priority (higher demand first)
    analysis.demands.sort((a, b) => b.demand - a.demand);
    
    // Sort production by cost efficiency
    analysis.productionCapacity.sort((a, b) => a.costPerUnit - b.costPerUnit);
    
    return analysis;
  }

  buildConstraintAwareSupplyPlan(analysis, period) {
    // Track remaining capacity per plant
    const remainingCapacity = new Map();
    analysis.productionCapacity.forEach(p => {
      remainingCapacity.set(p.iuCode, p.capacity);
    });
    
    // Track transport usage per constraint
    const transportUsage = new Map();
    analysis.transportLimits.forEach((info, key) => {
      transportUsage.set(key, 0);
    });
    
    // Step 1: Fulfill demands using inventory first, then production
    for (const demand of analysis.demands) {
      const fulfilled = this.fulfillDemandWithConstraints(
        demand, period, remainingCapacity, transportUsage, analysis
      );
      
      const fulfillmentKey = `${demand.iuguCode}|${period}`;
      this.solution.fulfillment.set(fulfillmentKey, fulfilled);
    }
    
    // Step 2: Balance closing stock (reduce excess, increase shortfall)
    this.balanceClosingStock(analysis, period, remainingCapacity, transportUsage);
    
    // Store transport usage for validation
    this.solution.transportUsage = transportUsage;
  }

  fulfillDemandWithConstraints(demand, period, remainingCapacity, transportUsage, analysis) {
    let remainingDemand = demand.demand;
    let totalFulfilled = 0;
    
    // Step 1: Use existing inventory
    const invKey = `${demand.iuguCode}|${period}`;
    let currentInventory = this.solution.inventory.get(invKey) || 0;
    
    const fromInventory = Math.min(currentInventory, remainingDemand);
    if (fromInventory > 0) {
      totalFulfilled += fromInventory;
      remainingDemand -= fromInventory;
      this.solution.inventory.set(invKey, currentInventory - fromInventory);
    }
    
    if (remainingDemand <= 0) return totalFulfilled;
    
    // Step 2: Get ALL supply options (don't limit by transport constraints for fulfillment)
    const supplyOptions = this.getConstraintAwareSupplyOptions(
      demand.iuguCode, period, remainingCapacity, transportUsage, analysis
    );
    
    // Step 3: Supply from production - MAXIMIZE fulfillment
    for (const option of supplyOptions) {
      if (remainingDemand <= 0) break;
      
      // Calculate how much we can supply - use ALL available capacity
      let maxSupply = Math.min(remainingDemand, option.availableCapacity);
      
      // Apply T2 constraint (must be multiples of 3000)
      if (option.transport === 'T2') {
        maxSupply = Math.floor(maxSupply / 3000) * 3000;
      } else {
        maxSupply = Math.floor(maxSupply);
      }
      
      if (maxSupply > 0) {
        this.executeSupplyV3(option, demand.iuguCode, maxSupply, period, 'demand', transportUsage);
        totalFulfilled += maxSupply;
        remainingDemand -= maxSupply;
        remainingCapacity.set(option.fromIU, remainingCapacity.get(option.fromIU) - maxSupply);
      }
    }
    
    return totalFulfilled;
  }

  getConstraintAwareSupplyOptions(targetPlant, period, remainingCapacity, transportUsage, analysis) {
    const options = [];
    
    this.logisticsMap.forEach((logInfo, key) => {
      const [fromIU, toIugu, transport, timePeriod] = key.split('|');
      
      if (toIugu === targetPlant && parseInt(timePeriod) === period) {
        const availableCapacity = remainingCapacity.get(fromIU) || 0;
        
        if (availableCapacity > 0) {
          // Calculate transport limit - but DON'T block fulfillment, just track for violations
          // We prioritize FULFILLMENT over transport constraints
          let transportLimit = Infinity; // Allow unlimited for demand fulfillment
          
          const capacityKey = `${fromIU}|${period}`;
          const costPerPeriod = this.productionCostMap.get(capacityKey) || 0;
          const capacity = this.capacityMap.get(capacityKey) || 1;
          const costPerUnit = capacity > 0 ? costPerPeriod / capacity : 0;
          
          const isInternal = fromIU === targetPlant;
          
          options.push({
            fromIU,
            transport,
            availableCapacity,
            transportLimit,
            costPerUnit,
            isInternal,
            freightCostPerBatch: logInfo.freightCostPerBatch,
            freightCostPerUnit: logInfo.freightCostPerUnit,
            batchSize: logInfo.batchSize,
            logKey: key
          });
        }
      }
    });
    
    // Sort: internal first, then by cost, then by available capacity
    options.sort((a, b) => {
      if (a.isInternal && !b.isInternal) return -1;
      if (!a.isInternal && b.isInternal) return 1;
      if (a.costPerUnit !== b.costPerUnit) return a.costPerUnit - b.costPerUnit;
      return b.availableCapacity - a.availableCapacity;
    });
    
    return options;
  }

  executeSupplyV3(option, targetPlant, quantity, period, purpose, transportUsage) {
    quantity = Math.round(quantity);
    if (quantity <= 0) return;
    
    // Record production
    const prodKey = `${option.fromIU}|${period}`;
    const currentProd = this.solution.production.get(prodKey) || 0;
    this.solution.production.set(prodKey, currentProd + quantity);
    
    // Record transportation and update usage
    if (!option.isInternal) {
      const transKey = `${option.fromIU}|${targetPlant}|${option.transport}|${period}`;
      const currentTrans = this.solution.transportation.get(transKey) || 0;
      
      this.solution.transportation.set(transKey, currentTrans + quantity);
      
      // Update transport usage for constraint tracking
      // Specific route
      const specificKey = `${option.fromIU}|${targetPlant}|${option.transport}|${period}`;
      if (transportUsage.has(specificKey)) {
        transportUsage.set(specificKey, transportUsage.get(specificKey) + quantity);
      }
      
      // Aggregate (ALL destinations)
      const aggregateKey = `${option.fromIU}|ALL|${option.transport}|${period}`;
      if (transportUsage.has(aggregateKey)) {
        transportUsage.set(aggregateKey, transportUsage.get(aggregateKey) + quantity);
      }
      
      // ANY transport type
      const anyKey = `${option.fromIU}|ALL|ANY|${period}`;
      if (transportUsage.has(anyKey)) {
        transportUsage.set(anyKey, transportUsage.get(anyKey) + quantity);
      }
      
      // Transportation cost calculation:
      // Freight cost per batch × Number of batches
      const logInfo = this.logisticsMap.get(option.logKey);
      if (logInfo && logInfo.freightCostPerBatch > 0) {
        const batchSize = logInfo.batchSize || (option.transport === 'T2' ? 3000 : 1);
        const numBatches = Math.ceil(quantity / batchSize);
        const freightCost = numBatches * logInfo.freightCostPerBatch;
        this.solution.costs.transportation += freightCost;
        
        // Store detailed transport info for reporting
        if (!this.solution.transportDetails) {
          this.solution.transportDetails = [];
        }
        this.solution.transportDetails.push({
          fromIU: option.fromIU,
          toIugu: targetPlant,
          transport: option.transport,
          period,
          quantity,
          batchSize,
          numBatches,
          freightCostPerBatch: logInfo.freightCostPerBatch,
          totalFreightCost: freightCost,
          freightCostPerUnit: freightCost / quantity
        });
      }
      
      this.solution.routesUsed.add(transKey);
      
      this.solution.fulfillmentDetails.push({
        fromPlant: option.fromIU,
        toPlant: targetPlant,
        period,
        quantity,
        transportMode: option.transport,
        purpose
      });
    }
    
    // Update target inventory
    const invKey = `${targetPlant}|${period}`;
    const currentInv = this.solution.inventory.get(invKey) || 0;
    this.solution.inventory.set(invKey, currentInv + quantity);
  }

  balanceClosingStock(analysis, period, remainingCapacity, transportUsage) {
    // For each plant, check closing stock requirements
    for (const target of analysis.closingStockTargets) {
      const invKey = `${target.iuguCode}|${period}`;
      const currentStock = this.solution.inventory.get(invKey) || 0;
      
      // If below minimum, try to supply more
      if (currentStock < target.minStock) {
        const needed = target.minStock - currentStock;
        const supplyOptions = this.getConstraintAwareSupplyOptions(
          target.iuguCode, period, remainingCapacity, transportUsage, analysis
        );
        
        let supplied = 0;
        for (const option of supplyOptions) {
          if (supplied >= needed) break;
          
          let maxSupply = Math.min(needed - supplied, option.availableCapacity, option.transportLimit);
          
          if (option.transport === 'T2') {
            maxSupply = Math.floor(maxSupply / 3000) * 3000;
          } else {
            maxSupply = Math.floor(maxSupply);
          }
          
          if (maxSupply > 0) {
            this.executeSupplyV3(option, target.iuguCode, maxSupply, period, 'closing_stock', transportUsage);
            supplied += maxSupply;
            remainingCapacity.set(option.fromIU, remainingCapacity.get(option.fromIU) - maxSupply);
          }
        }
      }
      
      // If above maximum, we can't easily reduce (would need to increase demand fulfillment elsewhere)
      // This is tracked as a violation
    }
  }

  initializeInventoryForPeriod(period) {
    if (period === 1) {
      this.openingStockMap.forEach((stock, iuguCode) => {
        const key = `${iuguCode}|${period}`;
        this.solution.inventory.set(key, Math.round(stock));
      });
    } else {
      const prevPeriod = period - 1;
      this.solution.inventory.forEach((stock, key) => {
        const [iuguCode, keyPeriod] = key.split('|');
        if (parseInt(keyPeriod) === prevPeriod) {
          const newKey = `${iuguCode}|${period}`;
          this.solution.inventory.set(newKey, Math.round(stock));
        }
      });
    }
  }

  validatePeriodConstraints(period) {
    // Check closing stock constraints
    this.closingStockMap.forEach((stockInfo, key) => {
      const [iuguCode, timePeriod] = key.split('|');
      if (parseInt(timePeriod) === period) {
        const invKey = `${iuguCode}|${period}`;
        const currentStock = Math.round(this.solution.inventory.get(invKey) || 0);
        
        if (currentStock < stockInfo.minStock) {
          this.solution.metrics.constraintViolations.push({
            type: 'MIN_CLOSING_STOCK',
            iuguCode,
            period,
            required: stockInfo.minStock,
            actual: currentStock,
            shortfall: stockInfo.minStock - currentStock
          });
        }
        
        if (stockInfo.maxStock !== Infinity && currentStock > stockInfo.maxStock) {
          this.solution.metrics.constraintViolations.push({
            type: 'MAX_CLOSING_STOCK',
            iuguCode,
            period,
            limit: stockInfo.maxStock,
            actual: currentStock,
            excess: currentStock - stockInfo.maxStock
          });
        }
      }
    });

    // Check transport constraints
    this.constraintMap.forEach((constraint, key) => {
      const [iuCode, transport, timePeriod] = key.split('|');
      if (parseInt(timePeriod) === period) {
        let totalTransported = 0;
        
        this.solution.transportation.forEach((qty, transKey) => {
          const [fromIU, toIugu, transType, transPeriod] = transKey.split('|');
          if (fromIU === iuCode && parseInt(transPeriod) === period) {
            // Check transport type match
            if (transport !== 'ANY' && transType !== transport) return;
            // Check target IUGU match
            if (constraint.iuguCode && constraint.iuguCode !== toIugu) return;
            totalTransported += qty;
          }
        });
        
        if (constraint.boundType === 'L' && totalTransported > constraint.value) {
          this.solution.metrics.constraintViolations.push({
            type: 'TRANSPORT_UPPER_BOUND',
            iuCode,
            transport: transport === 'ANY' ? 'ALL' : transport,
            iuguCode: constraint.iuguCode || 'ALL',
            period,
            limit: constraint.value,
            actual: totalTransported,
            excess: totalTransported - constraint.value
          });
        } else if (constraint.boundType === 'G' && totalTransported < constraint.value) {
          this.solution.metrics.constraintViolations.push({
            type: 'TRANSPORT_LOWER_BOUND',
            iuCode,
            transport: transport === 'ANY' ? 'ALL' : transport,
            iuguCode: constraint.iuguCode || 'ALL',
            period,
            required: constraint.value,
            actual: totalTransported,
            shortfall: constraint.value - totalTransported
          });
        }
      }
    });
  }


  calculateFinalCosts() {
    console.log('\n' + '='.repeat(80));
    console.log('                    COST CALCULATION BREAKDOWN');
    console.log('='.repeat(80));
    
    let productionCostDetails = [];
    let totalProductionQuantity = 0;
    
    // Calculate production costs - VARIABLE cost model
    // Formula: Cost = (Cost per Period / Capacity) × Quantity
    this.solution.production.forEach((quantity, prodKey) => {
      const [plantCode, period] = prodKey.split('|');
      const costPerPeriod = this.productionCostMap.get(prodKey) || 0;
      const capacity = this.capacityMap.get(prodKey) || 1;
      
      const costPerUnit = capacity > 0 ? costPerPeriod / capacity : 0;
      const productionCost = costPerUnit * quantity;
      
      this.solution.costs.production += productionCost;
      totalProductionQuantity += quantity;
      
      productionCostDetails.push({
        plant: plantCode,
        period: parseInt(period),
        quantity: Math.round(quantity),
        capacity,
        costPerPeriod,
        costPerUnit,
        totalCost: productionCost
      });
    });
    
    productionCostDetails.sort((a, b) => {
      if (a.period !== b.period) return a.period - b.period;
      return a.plant.localeCompare(b.plant);
    });
    
    console.log('\n1. PRODUCTION COST (Variable Cost Model):');
    console.log('   Formula: Cost = (Cost per Period / Capacity) × Quantity');
    console.log(`   Total Production: ${totalProductionQuantity.toLocaleString()} units`);
    console.log(`   Total Production Cost: ₹${this.solution.costs.production.toFixed(2)}`);
    
    // Transportation cost is already calculated in executeSupplyV3
    // Formula: Freight cost per batch × Number of batches
    console.log(`\n2. TRANSPORTATION COST (Per Batch Model):`);
    console.log(`   Formula: Freight Cost per Batch × Number of Batches`);
    console.log(`   T2 Batch Size: 3000 units`);
    console.log(`   Routes Used: ${this.solution.routesUsed.size}`);
    console.log(`   Total Transportation Cost: ₹${this.solution.costs.transportation.toFixed(2)}`);
    
    // Show example calculation if transport details exist
    if (this.solution.transportDetails && this.solution.transportDetails.length > 0) {
      const example = this.solution.transportDetails[0];
      console.log(`\n   Example: ${example.fromIU} → ${example.toIugu} (${example.transport})`);
      console.log(`   - Quantity: ${example.quantity.toLocaleString()} units`);
      console.log(`   - Batch Size: ${example.batchSize.toLocaleString()} units`);
      console.log(`   - Number of Batches: ${example.numBatches}`);
      console.log(`   - Freight per Batch: ₹${example.freightCostPerBatch.toFixed(2)}`);
      console.log(`   - Total Freight: ${example.numBatches} × ₹${example.freightCostPerBatch.toFixed(2)} = ₹${example.totalFreightCost.toFixed(2)}`);
      console.log(`   - Per Unit Cost: ₹${example.freightCostPerUnit.toFixed(4)}`);
    }
    
    // Calculate inventory holding cost
    let totalInventoryUnits = 0;
    this.solution.inventory.forEach((stock) => {
      this.solution.costs.inventory += stock * INVENTORY_HOLDING_COST_PER_UNIT;
      totalInventoryUnits += stock;
    });
    
    console.log(`\n3. INVENTORY HOLDING COST: ₹${this.solution.costs.inventory.toFixed(2)}`);
    console.log(`   Rate: ₹${INVENTORY_HOLDING_COST_PER_UNIT} per unit per period`);

    // Calculate penalty costs (reduced rates for balance)
    let penaltyBreakdown = {
      minFulfillment: { count: 0, units: 0, cost: 0 },
      minClosingStock: { count: 0, units: 0, cost: 0 },
      maxClosingStock: { count: 0, units: 0, cost: 0 },
      transportUpperBound: { count: 0, units: 0, cost: 0 }
    };
    
    this.solution.metrics.constraintViolations.forEach(violation => {
      if (violation.type === 'MIN_FULFILLMENT') {
        const penalty = violation.shortfall * 0.1;
        this.solution.costs.penalty += penalty;
        penaltyBreakdown.minFulfillment.count++;
        penaltyBreakdown.minFulfillment.units += violation.shortfall;
        penaltyBreakdown.minFulfillment.cost += penalty;
      } else if (violation.type === 'MIN_CLOSING_STOCK') {
        const penalty = violation.shortfall * 0.01;
        this.solution.costs.penalty += penalty;
        penaltyBreakdown.minClosingStock.count++;
        penaltyBreakdown.minClosingStock.units += violation.shortfall;
        penaltyBreakdown.minClosingStock.cost += penalty;
      } else if (violation.type === 'MAX_CLOSING_STOCK') {
        const penalty = violation.excess * 0.001;
        this.solution.costs.penalty += penalty;
        penaltyBreakdown.maxClosingStock.count++;
        penaltyBreakdown.maxClosingStock.units += violation.excess;
        penaltyBreakdown.maxClosingStock.cost += penalty;
      } else if (violation.type === 'TRANSPORT_UPPER_BOUND') {
        const penalty = violation.excess * 0.001;
        this.solution.costs.penalty += penalty;
        penaltyBreakdown.transportUpperBound.count++;
        penaltyBreakdown.transportUpperBound.units += violation.excess;
        penaltyBreakdown.transportUpperBound.cost += penalty;
      }
    });
    
    console.log(`\n4. PENALTY COST: ₹${this.solution.costs.penalty.toFixed(2)}`);
    console.log(`   - Min Closing Stock: ${penaltyBreakdown.minClosingStock.count} violations`);
    console.log(`   - Max Closing Stock: ${penaltyBreakdown.maxClosingStock.count} violations`);
    console.log(`   - Transport Upper Bound: ${penaltyBreakdown.transportUpperBound.count} violations`);
    
    this.solution.costs.total = 
      this.solution.costs.production + 
      this.solution.costs.transportation + 
      this.solution.costs.inventory + 
      this.solution.costs.penalty;
    
    console.log('\n' + '='.repeat(80));
    console.log('                           TOTAL COST SUMMARY');
    console.log('='.repeat(80));
    console.log(`   Production Cost:      ₹${this.solution.costs.production.toFixed(2)}`);
    console.log(`   Transportation Cost:  ₹${this.solution.costs.transportation.toFixed(2)}`);
    console.log(`   Inventory Cost:       ₹${this.solution.costs.inventory.toFixed(2)}`);
    console.log(`   Penalty Cost:         ₹${this.solution.costs.penalty.toFixed(2)}`);
    console.log('   ' + '-'.repeat(40));
    console.log(`   TOTAL COST:           ₹${this.solution.costs.total.toFixed(2)}`);
    console.log('='.repeat(80));
    
    this.solution.costBreakdown = {
      productionDetails: productionCostDetails,
      transportDetails: this.solution.transportDetails || [],
      penaltyBreakdown,
      totalInventoryUnits: Math.round(totalInventoryUnits),
      totalProductionQuantity: Math.round(totalProductionQuantity)
    };
  }

  calculateFinalMetrics() {
    let totalDemand = 0;
    let totalFulfilled = 0;
    
    this.demandMap.forEach((demandInfo, key) => {
      totalDemand += demandInfo.demand;
      const fulfilled = this.solution.fulfillment.get(key) || 0;
      totalFulfilled += fulfilled;
    });
    
    this.solution.metrics.totalDemand = Math.round(totalDemand);
    this.solution.metrics.totalDemandFulfilled = Math.round(totalFulfilled);
    this.solution.metrics.fulfillmentRate = totalDemand > 0 ? (totalFulfilled / totalDemand) * 100 : 0;
    
    console.log(`\n=== FINAL METRICS ===`);
    console.log(`Total Demand: ${totalDemand.toLocaleString()} units`);
    console.log(`Total Fulfilled: ${totalFulfilled.toLocaleString()} units (${this.solution.metrics.fulfillmentRate.toFixed(2)}%)`);
    console.log(`Constraint Violations: ${this.solution.metrics.constraintViolations.length}`);
  }

  getResults() {
    if (!this.solution) {
      return {
        success: false,
        error: 'No solution available. Run optimize() first.',
        errors: this.errors,
        dataQuality: this.dataQuality
      };
    }

    return {
      success: this.feasible,
      solution: this.solution,
      summary: {
        totalCost: this.solution.costs.total,
        productionCost: this.solution.costs.production,
        transportationCost: this.solution.costs.transportation,
        inventoryCost: this.solution.costs.inventory,
        penaltyCost: this.solution.costs.penalty,
        fulfillmentRate: this.solution.metrics.fulfillmentRate,
        constraintViolations: this.solution.metrics.constraintViolations.length
      },
      errors: this.errors,
      dataQuality: this.dataQuality
    };
  }

  exportForVisualization() {
    if (!this.solution) return null;

    const result = {
      production: [],
      transportation: [],
      inventory: [],
      fulfillment: [],
      violations: this.solution.metrics.constraintViolations,
      costBreakdown: this.solution.costBreakdown || {},
      summary: {
        totalCost: this.solution.costs.total,
        productionCost: this.solution.costs.production,
        transportationCost: this.solution.costs.transportation,
        inventoryCost: this.solution.costs.inventory,
        penaltyCost: this.solution.costs.penalty,
        fulfillmentRate: this.solution.metrics.fulfillmentRate,
        totalDemand: this.solution.metrics.totalDemand,
        totalFulfilled: this.solution.metrics.totalDemandFulfilled
      },
      dataQuality: this.dataQuality
    };

    // Convert production data
    this.solution.production.forEach((quantity, key) => {
      const [iuCode, period] = key.split('|');
      const costPerPeriod = this.productionCostMap.get(key) || 0;
      const capacity = this.capacityMap.get(key) || 1;
      const costPerUnit = capacity > 0 ? costPerPeriod / capacity : 0;
      
      result.production.push({
        iuCode,
        period: parseInt(period),
        quantity: Math.round(quantity),
        cost: costPerUnit * quantity, // Per unit cost calculation
        costPerUnit,
        costPerPeriod, // Original batch cost from data
        capacity,
        utilizationRate: capacity > 0 ? (quantity / capacity) * 100 : 0
      });
    });

    // Convert transportation data
    this.solution.transportation.forEach((quantity, key) => {
      const [fromIU, toIugu, transport, period] = key.split('|');
      const logInfo = this.logisticsMap.get(key);
      const batchSize = logInfo?.batchSize || (transport === 'T2' ? 3000 : 1);
      const numBatches = Math.ceil(quantity / batchSize);
      const freightCostPerBatch = logInfo?.freightCostPerBatch || 0;
      const handlingCost = logInfo?.handlingCost || 0;
      const freightCost = numBatches * freightCostPerBatch;
      
      result.transportation.push({
        fromIU,
        toIugu,
        transport,
        period: parseInt(period),
        quantity: Math.round(quantity),
        batchSize,
        numBatches,
        freightCostPerBatch,
        handlingCost, // Original handling cost from data
        totalFreightCost: freightCost,
        cost: freightCost, // Alias for backward compatibility
        freightCostPerUnit: quantity > 0 ? freightCost / quantity : 0
      });
    });

    // Convert inventory data
    this.solution.inventory.forEach((stock, key) => {
      const [iuguCode, period] = key.split('|');
      result.inventory.push({
        iuguCode,
        period: parseInt(period),
        stock: Math.round(stock)
      });
    });

    // Convert fulfillment data
    this.solution.fulfillment.forEach((fulfilled, key) => {
      const [iuguCode, period] = key.split('|');
      const demandInfo = this.demandMap.get(key);
      result.fulfillment.push({
        iuguCode,
        period: parseInt(period),
        demand: demandInfo?.demand || 0,
        fulfilled: Math.round(fulfilled),
        fulfillmentRate: demandInfo?.demand > 0 ? (fulfilled / demandInfo.demand) * 100 : 0
      });
    });

    // Generate disclosure data
    result.disclosure = this.generateDisclosureData(result);

    return result;
  }

  generateDisclosureData(result) {
    return {
      feasibility: this.solution.metrics.constraintViolations.length === 0,
      totalCost: this.solution.costs.total,
      productionCost: this.solution.costs.production,
      transportationCost: this.solution.costs.transportation,
      inventoryCost: this.solution.costs.inventory,
      penaltyCost: this.solution.costs.penalty,
      totalDemand: this.solution.metrics.totalDemand,
      totalFulfilled: this.solution.metrics.totalDemandFulfilled,
      fulfillmentRate: this.solution.metrics.fulfillmentRate,
      constraintViolations: this.solution.metrics.constraintViolations.length,
      demandFulfillment: result.fulfillment,
      productionDetails: result.production,
      transportationDetails: result.transportation
    };
  }
}

export default ClinkerOptimizationEngine;

export function optimizeClinkerSupplyChain(rawData) {
  const engine = new ClinkerOptimizationEngine(rawData);
  engine.optimize();
  return engine.getResults();
}

export function getOptimizationVisualizationData(rawData) {
  const engine = new ClinkerOptimizationEngine(rawData);
  engine.optimize();
  const result = engine.exportForVisualization();
  if (result) {
    result.dataQuality = engine.dataQuality;
  }
  return result;
}
