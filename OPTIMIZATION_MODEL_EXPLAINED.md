# Clinker Supply Chain Optimization Model v2.0

## 📋 MODEL OVERVIEW

This document explains the clinker supply chain optimization model with all calculations and decision logic.

## 🔑 KEY MODEL RULES

### 1. Quantity Constraints
- **All quantities must be INTEGERS** (no decimal values)
- **T1 Transport**: Can transport any integer quantity (multiples of 1)
- **T2 Transport**: Can ONLY transport in multiples of 3000 units

### 2. Cost Model (CORRECTED)
- **Production Cost**: VARIABLE cost based on quantity produced
  - Cost per unit = Cost per Period ÷ Capacity
  - Total Cost = Cost per Unit × Quantity Produced
  - Example: IU_003 has cost=2229, capacity=379812
    - Cost per unit = 2229 / 379812 = ₹0.00587
    - If producing 379812 units: 379812 × 0.00587 = ₹2229.00

- **Transportation Cost**:
  - T1: Cost per unit (freight cost / 1000 scaling factor)
  - T2: Cost per trip × Number of trips (3000 units per trip)
  - Internal transfers: Zero cost

### 3. Optimization Objective
Minimize: Total Cost = Production + Transportation + Inventory + Penalty
Subject to: Capacity constraints, transport multiplier constraints, closing stock requirements

## 📊 COST CALCULATION FORMULAS

### Production Cost
```
Cost_per_unit = Cost_per_period / Capacity
Production_Cost = Σ(Cost_per_unit × Quantity_produced)

Example:
  Plant: IU_003, Period: T1
  Cost per period: ₹2229
  Capacity: 379,812 units
  Quantity produced: 379,812 units
  
  Cost per unit = 2229 / 379812 = ₹0.005869
  Production cost = 0.005869 × 379812 = ₹2229.00
```

### Transportation Cost
```
Transportation cost is FIXED per route per period.
If you use a route (transport any quantity > 0), you pay the full freight cost.

Cost = Freight_Cost + Handling_Cost (for each route used)

Example:
  Route: IU_003 → GU_002 via T2, Period 1
  Freight Cost: ₹628.03
  Handling Cost: ₹0
  
  If we transport 132,000 units on this route:
  Transportation Cost = ₹628.03 (fixed, regardless of quantity)
  
Internal Transfer:
  Cost = 0 (same plant, no transportation needed)
```

### Inventory Holding Cost
```
Inventory_Cost = Σ(Stock_level × 0.01)
```

### Penalty Cost
```
Min Fulfillment Shortfall: ₹10 per unit
Min Closing Stock Shortfall: ₹1 per unit
Transport Upper Bound Excess: ₹0.5 per unit
```

## 🔄 OPTIMIZATION PROCESS

### Step 1: Initialize Inventory
- Period 1: Use opening stock values
- Period 2+: Carry forward from previous period

### Step 2: Fulfill Demands (Priority 1)
1. Use existing inventory first (zero cost)
2. Supply from production sources sorted by total cost per unit
3. Internal transfers prioritized (zero transport cost)
4. Apply transport constraints (T2 must be multiples of 3000)

### Step 3: Fulfill Closing Stock Requirements (Priority 2)
1. Calculate shortfall from minimum closing stock
2. Supply using remaining capacity
3. Apply same transport constraints

### Step 4: Validate Constraints
- Check closing stock min/max bounds
- Check transport upper/lower bounds
- Record violations for penalty calculation

## 📈 PERFORMANCE METRICS

- **Fulfillment Rate**: Total Fulfilled / Total Demand × 100%
- **Constraint Violations**: Count of all violated constraints
- **Feasibility**: FEASIBLE if no critical violations AND fulfillment ≥ 95%

## 💰 EXPECTED COST RANGES

For this supply chain:
- Production Cost: ₹80,000 - ₹100,000
- Transportation Cost: ₹1-2 lakhs (fixed route costs)
- Total Cost: ₹20-25 lakhs (₹0.2-0.25 crores)
