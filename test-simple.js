/**
 * Test script for the Clinker Optimization Engine v2.0
 */

import { readFileSync } from 'fs';
import ClinkerOptimizationEngine, { optimizeClinkerSupplyChain, getOptimizationVisualizationData } from './src/utils/optimizationEngine.js';

console.log('Testing Clinker Optimization Engine v2.0...\n');

// Load data
const rawData = JSON.parse(readFileSync('./public/data.json', 'utf8'));

// Run optimization
const engine = new ClinkerOptimizationEngine(rawData);
engine.optimize();
const result = engine.getResults();

console.log('\n✅ Optimization completed!\n');

// Display summary
console.log('='.repeat(60));
console.log('                    SUMMARY');
console.log('='.repeat(60));
console.log(`Total Cost: ₹${result.summary.totalCost.toFixed(2)}`);
console.log(`  - Production:     ₹${result.summary.productionCost.toFixed(2)}`);
console.log(`  - Transportation: ₹${result.summary.transportationCost.toFixed(2)}`);
console.log(`  - Inventory:      ₹${result.summary.inventoryCost.toFixed(2)}`);
console.log(`  - Penalty:        ₹${result.summary.penaltyCost.toFixed(2)}`);
console.log('');
console.log(`Fulfillment Rate: ${result.summary.fulfillmentRate.toFixed(2)}%`);
console.log(`Constraint Violations: ${result.summary.constraintViolations}`);
console.log('='.repeat(60));

// Verify integer quantities
console.log('\n📊 Verifying Integer Quantities...');
let hasDecimals = false;

result.solution.production.forEach((qty, key) => {
  if (qty !== Math.round(qty)) {
    console.log(`  ❌ Production ${key}: ${qty} (not integer)`);
    hasDecimals = true;
  }
});

result.solution.transportation.forEach((qty, key) => {
  if (qty !== Math.round(qty)) {
    console.log(`  ❌ Transportation ${key}: ${qty} (not integer)`);
    hasDecimals = true;
  }
  // Check T2 multiples of 3000
  const [fromIU, toIugu, transport, period] = key.split('|');
  if (transport === 'T2' && qty % 3000 !== 0) {
    console.log(`  ❌ T2 Transport ${key}: ${qty} (not multiple of 3000)`);
    hasDecimals = true;
  }
});

if (!hasDecimals) {
  console.log('  ✅ All quantities are integers');
  console.log('  ✅ All T2 transports are multiples of 3000');
}

// Show sample production costs
console.log('\n📊 Sample Production Cost Calculations:');
const vizData = getOptimizationVisualizationData(rawData);
vizData.production.slice(0, 5).forEach(p => {
  console.log(`  ${p.iuCode} T${p.period}: Produced ${p.quantity.toLocaleString()} / ${p.capacity.toLocaleString()} capacity`);
  console.log(`    Cost/Unit: ₹${p.costPerUnit.toFixed(6)}, Total Cost: ₹${p.cost.toFixed(2)}`);
});

// Show sample transportation
console.log('\n📊 Sample Transportation:');
vizData.transportation.slice(0, 5).forEach(t => {
  console.log(`  ${t.fromIU} → ${t.toIugu} via ${t.transport}: ${t.quantity.toLocaleString()} units`);
  if (t.transport === 'T2') {
    console.log(`    Trips: ${t.numTrips}, Cost: ₹${t.cost.toFixed(2)}`);
  } else {
    console.log(`    Cost: ₹${t.cost.toFixed(2)}`);
  }
});

console.log('\n✅ Test completed!');
