/**
 * Data Preprocessing and Validation Utilities for Clinker Optimization
 * 
 * This module handles data cleaning, validation, and preprocessing to ensure
 * the optimization engine receives properly formatted and consistent data.
 */

/**
 * Comprehensive data validation and preprocessing
 */
export function preprocessClinkerData(rawData) {
  console.log('Starting data preprocessing...');
  
  const processedData = {
    ClinkerDemand: [],
    ClinkerCapacity: [],
    ProductionCost: [],
    LogisticsIUGU: [],
    IUGUConstraint: [],
    IUGUOpeningStock: [],
    IUGUClosingStock: [],
    IUGUType: [],
    HubOpeningStock: []
  };

  const errors = [];
  const warnings = [];

  try {
    // Process Clinker Demand
    if (rawData.ClinkerDemand && Array.isArray(rawData.ClinkerDemand)) {
      processedData.ClinkerDemand = rawData.ClinkerDemand
        .filter(item => item && item['IUGU CODE'] && item['TIME PERIOD'] !== undefined)
        .map(item => ({
          'IUGU CODE': String(item['IUGU CODE']).trim(),
          'TIME PERIOD': parseInt(item['TIME PERIOD']) || 1,
          'DEMAND': parseFloat(item['DEMAND']) || 0,
          'MIN FULFILLMENT': parseFloat(item['MIN FULFILLMENT']) || 0
        }))
        .filter(item => item.DEMAND > 0); // Only include items with positive demand

      console.log(`Processed ${processedData.ClinkerDemand.length} demand records`);
    } else {
      errors.push('ClinkerDemand data is missing or invalid');
    }

    // Process Clinker Capacity
    if (rawData.ClinkerCapacity && Array.isArray(rawData.ClinkerCapacity)) {
      processedData.ClinkerCapacity = rawData.ClinkerCapacity
        .filter(item => item && item['IU CODE'] && item['TIME PERIOD'] !== undefined)
        .map(item => ({
          'IU CODE': String(item['IU CODE']).trim(),
          'TIME PERIOD': parseInt(item['TIME PERIOD']) || 1,
          'CAPACITY': parseFloat(item['CAPACITY']) || 0
        }))
        .filter(item => item.CAPACITY > 0); // Only include items with positive capacity

      console.log(`Processed ${processedData.ClinkerCapacity.length} capacity records`);
    } else {
      errors.push('ClinkerCapacity data is missing or invalid');
    }

    // Process Production Cost
    if (rawData.ProductionCost && Array.isArray(rawData.ProductionCost)) {
      processedData.ProductionCost = rawData.ProductionCost
        .filter(item => item && item['IU CODE'] && item['TIME PERIOD'] !== undefined)
        .map(item => ({
          'IU CODE': String(item['IU CODE']).trim(),
          'TIME PERIOD': parseInt(item['TIME PERIOD']) || 1,
          'PRODUCTION COST': parseFloat(item['PRODUCTION COST']) || 0
        }));

      console.log(`Processed ${processedData.ProductionCost.length} production cost records`);
    } else {
      warnings.push('ProductionCost data is missing - using default costs');
      // Generate default production costs based on capacity
      processedData.ProductionCost = processedData.ClinkerCapacity.map(item => ({
        'IU CODE': item['IU CODE'],
        'TIME PERIOD': item['TIME PERIOD'],
        'PRODUCTION COST': 1000 // Default cost per unit
      }));
    }

    // Process Logistics
    if (rawData.LogisticsIUGU && Array.isArray(rawData.LogisticsIUGU)) {
      processedData.LogisticsIUGU = rawData.LogisticsIUGU
        .filter(item => item && item['FROM IU CODE'] && item['TO IUGU CODE'])
        .map(item => ({
          'FROM IU CODE': String(item['FROM IU CODE']).trim(),
          'TO IUGU CODE': String(item['TO IUGU CODE']).trim(),
          'TRANSPORT CODE': String(item['TRANSPORT CODE'] || 'T1').trim(),
          'TIME PERIOD': parseInt(item['TIME PERIOD']) || 1,
          'FREIGHT COST': parseFloat(item['FREIGHT COST']) || 0,
          'HANDLING COST': parseFloat(item['HANDLING COST']) || 0,
          'QUANTITY MULTIPLIER': parseFloat(item['QUANTITY MULTIPLIER']) || 1
        }));

      console.log(`Processed ${processedData.LogisticsIUGU.length} logistics records`);
    } else {
      errors.push('LogisticsIUGU data is missing or invalid');
    }

    // Process IUGU Constraints
    if (rawData.IUGUConstraint && Array.isArray(rawData.IUGUConstraint)) {
      processedData.IUGUConstraint = rawData.IUGUConstraint
        .filter(item => item && item['IU CODE'] && item['TIME PERIOD'] !== undefined)
        .map(item => ({
          'IU CODE': String(item['IU CODE']).trim(),
          'TRANSPORT CODE': item['TRANSPORT CODE'] ? String(item['TRANSPORT CODE']).trim() : null,
          'TIME PERIOD': parseInt(item['TIME PERIOD']) || 1,
          'BOUND TYPEID': String(item['BOUND TYPEID'] || 'L').trim().toUpperCase(),
          'VALUE TYPEID': String(item['VALUE TYPEID'] || 'C').trim().toUpperCase(),
          'Value': parseFloat(item['Value']) || 0,
          'IUGU CODE': item['IUGU CODE'] ? String(item['IUGU CODE']).trim() : null
        }))
        .filter(item => ['L', 'E', 'G'].includes(item['BOUND TYPEID'])); // Only valid bound types

      console.log(`Processed ${processedData.IUGUConstraint.length} constraint records`);
    } else {
      warnings.push('IUGUConstraint data is missing - optimization will run without constraints');
    }

    // Process Opening Stock
    if (rawData.IUGUOpeningStock && Array.isArray(rawData.IUGUOpeningStock)) {
      processedData.IUGUOpeningStock = rawData.IUGUOpeningStock
        .filter(item => item && item['IUGU CODE'])
        .map(item => ({
          'IUGU CODE': String(item['IUGU CODE']).trim(),
          'OPENING STOCK': parseFloat(item['OPENING STOCK']) || 0
        }));

      console.log(`Processed ${processedData.IUGUOpeningStock.length} opening stock records`);
    } else {
      warnings.push('IUGUOpeningStock data is missing - using zero opening stock');
      // Generate default opening stock for all demand units
      const uniqueIUGUs = [...new Set(processedData.ClinkerDemand.map(d => d['IUGU CODE']))];
      processedData.IUGUOpeningStock = uniqueIUGUs.map(iugu => ({
        'IUGU CODE': iugu,
        'OPENING STOCK': 0
      }));
    }

    // Process Closing Stock
    if (rawData.IUGUClosingStock && Array.isArray(rawData.IUGUClosingStock)) {
      processedData.IUGUClosingStock = rawData.IUGUClosingStock
        .filter(item => item && item['IUGU CODE'] && item['TIME PERIOD'] !== undefined)
        .map(item => ({
          'IUGU CODE': String(item['IUGU CODE']).trim(),
          'TIME PERIOD': parseInt(item['TIME PERIOD']) || 1,
          'MIN STOCK': parseFloat(item['MIN CLOSE STOCK'] || item['MIN STOCK']) || 0,
          'MAX STOCK': (item['MAX CLOSE STOCK'] !== undefined && item['MAX CLOSE STOCK'] !== null && item['MAX CLOSE STOCK'] !== '') ||
                       (item['MAX STOCK'] !== undefined && item['MAX STOCK'] !== null && item['MAX STOCK'] !== '')
            ? parseFloat(item['MAX CLOSE STOCK'] || item['MAX STOCK']) 
            : null // null means no maximum limit
        }));

      console.log(`Processed ${processedData.IUGUClosingStock.length} closing stock records`);
    } else {
      warnings.push('IUGUClosingStock data is missing - using default stock requirements');
    }

    // Process IUGU Type
    if (rawData.IUGUType && Array.isArray(rawData.IUGUType)) {
      processedData.IUGUType = rawData.IUGUType
        .filter(item => item && item['IUGU CODE'])
        .map(item => ({
          'IUGU CODE': String(item['IUGU CODE']).trim(),
          'PLANT TYPE': String(item['PLANT TYPE'] || item['TYPE'] || 'GU').trim().toUpperCase()
        }));

      console.log(`Processed ${processedData.IUGUType.length} type records`);
    } else {
      warnings.push('IUGUType data is missing - inferring types from codes');
      // Infer types from IUGU codes
      const allIUGUs = [...new Set([
        ...processedData.ClinkerDemand.map(d => d['IUGU CODE']),
        ...processedData.IUGUOpeningStock.map(s => s['IUGU CODE'])
      ])];
      
      processedData.IUGUType = allIUGUs.map(iugu => ({
        'IUGU CODE': iugu,
        'PLANT TYPE': iugu.startsWith('IU_') ? 'IU' : 'GU'
      }));
    }

    // Process Hub Opening Stock (if available)
    if (rawData.HubOpeningStock && Array.isArray(rawData.HubOpeningStock)) {
      processedData.HubOpeningStock = rawData.HubOpeningStock
        .filter(item => item && item['IU'])
        .map(item => ({
          'IU': String(item['IU']).trim(),
          'OPENING STOCK': parseFloat(item['OPENING STOCK']) || 0
        }));

      console.log(`Processed ${processedData.HubOpeningStock.length} hub opening stock records`);
    }

    // Validation checks
    const validationResults = validateProcessedData(processedData);
    errors.push(...validationResults.errors);
    warnings.push(...validationResults.warnings);

    console.log('Data preprocessing completed');
    console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);

    return {
      data: processedData,
      errors,
      warnings,
      isValid: errors.length === 0,
      summary: generateDataSummary(processedData)
    };

  } catch (error) {
    console.error('Data preprocessing failed:', error);
    return {
      data: null,
      errors: [`Data preprocessing failed: ${error.message}`],
      warnings,
      isValid: false,
      summary: null
    };
  }
}

/**
 * Validate processed data for consistency and completeness
 */
function validateProcessedData(data) {
  const errors = [];
  const warnings = [];

  // Check if all demand units have corresponding opening stock
  const demandUnits = new Set(data.ClinkerDemand.map(d => d['IUGU CODE']));
  const stockUnits = new Set(data.IUGUOpeningStock.map(s => s['IUGU CODE']));
  
  demandUnits.forEach(unit => {
    if (!stockUnits.has(unit)) {
      warnings.push(`No opening stock found for demand unit: ${unit}`);
    }
  });

  // Check if all production units have capacity data
  const productionUnits = new Set(data.ProductionCost.map(p => p['IU CODE']));
  const capacityUnits = new Set(data.ClinkerCapacity.map(c => c['IU CODE']));
  
  productionUnits.forEach(unit => {
    if (!capacityUnits.has(unit)) {
      errors.push(`No capacity data found for production unit: ${unit}`);
    }
  });

  // Check for time period consistency
  const demandPeriods = new Set(data.ClinkerDemand.map(d => d['TIME PERIOD']));
  const capacityPeriods = new Set(data.ClinkerCapacity.map(c => c['TIME PERIOD']));
  
  demandPeriods.forEach(period => {
    if (!capacityPeriods.has(period)) {
      warnings.push(`No capacity data found for time period: ${period}`);
    }
  });

  // Check logistics connectivity
  const fromUnits = new Set(data.LogisticsIUGU.map(l => l['FROM IU CODE']));
  const toUnits = new Set(data.LogisticsIUGU.map(l => l['TO IUGU CODE']));
  
  capacityUnits.forEach(unit => {
    if (!fromUnits.has(unit)) {
      warnings.push(`No outbound logistics found for production unit: ${unit}`);
    }
  });

  demandUnits.forEach(unit => {
    if (!toUnits.has(unit)) {
      warnings.push(`No inbound logistics found for demand unit: ${unit}`);
    }
  });

  // Check transport multipliers
  const invalidMultipliers = data.LogisticsIUGU.filter(l => 
    l['QUANTITY MULTIPLIER'] <= 0 || !isFinite(l['QUANTITY MULTIPLIER'])
  );
  
  if (invalidMultipliers.length > 0) {
    errors.push(`Found ${invalidMultipliers.length} logistics records with invalid quantity multipliers`);
  }

  return { errors, warnings };
}

/**
 * Generate data summary for reporting
 */
function generateDataSummary(data) {
  const summary = {
    totalDemandUnits: new Set(data.ClinkerDemand.map(d => d['IUGU CODE'])).size,
    totalProductionUnits: new Set(data.ClinkerCapacity.map(c => c['IU CODE'])).size,
    totalDemand: data.ClinkerDemand.reduce((sum, d) => sum + d.DEMAND, 0),
    totalCapacity: data.ClinkerCapacity.reduce((sum, c) => sum + c.CAPACITY, 0),
    timePeriods: [...new Set(data.ClinkerDemand.map(d => d['TIME PERIOD']))].sort(),
    transportTypes: [...new Set(data.LogisticsIUGU.map(l => l['TRANSPORT CODE']))].sort(),
    logisticsRoutes: data.LogisticsIUGU.length,
    constraints: data.IUGUConstraint.length,
    averageProductionCost: data.ProductionCost.length > 0 
      ? data.ProductionCost.reduce((sum, p) => sum + p['PRODUCTION COST'], 0) / data.ProductionCost.length 
      : 0,
    totalOpeningStock: data.IUGUOpeningStock.reduce((sum, s) => sum + s['OPENING STOCK'], 0)
  };

  // Calculate capacity utilization potential
  summary.capacityUtilizationPotential = summary.totalCapacity > 0 
    ? (summary.totalDemand / summary.totalCapacity) * 100 
    : 0;

  // Calculate demand fulfillment potential
  summary.demandFulfillmentPotential = Math.min(100, summary.capacityUtilizationPotential);

  return summary;
}

/**
 * Export data in different formats
 */
export function exportProcessedData(processedData, format = 'json') {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(processedData, null, 2);
    
    case 'csv': {
      // Export each data type as separate CSV sections
      let csvContent = '';
      
      Object.entries(processedData.data).forEach(([section, records]) => {
        if (records && records.length > 0) {
          csvContent += `\n\n=== ${section} ===\n`;
          const headers = Object.keys(records[0]);
          csvContent += headers.join(',') + '\n';
          
          records.forEach(record => {
            const values = headers.map(header => {
              const value = record[header];
              return typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value;
            });
            csvContent += values.join(',') + '\n';
          });
        }
      });
      
      return csvContent;
    }
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Helper function to get data quality score
 */
export function getDataQualityScore(preprocessResult) {
  if (!preprocessResult.isValid) return 0;
  
  const { data, warnings } = preprocessResult;
  let score = 100;
  
  // Deduct points for warnings
  score -= warnings.length * 5;
  
  // Deduct points for missing optional data
  if (!data.IUGUConstraint || data.IUGUConstraint.length === 0) score -= 10;
  if (!data.IUGUClosingStock || data.IUGUClosingStock.length === 0) score -= 10;
  if (!data.HubOpeningStock || data.HubOpeningStock.length === 0) score -= 5;
  
  // Bonus points for complete data
  if (data.IUGUConstraint && data.IUGUConstraint.length > 0) score += 5;
  if (data.IUGUClosingStock && data.IUGUClosingStock.length > 0) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

export default preprocessClinkerData;