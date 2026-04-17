/**
 * XLSX Parser for Clinker Optimization
 * 
 * Converts Excel files to the JSON format used by the optimization engine.
 * Handles sheet detection, column mapping, data validation, and error handling.
 */

import * as XLSX from 'xlsx';

// Required sheets and their column mappings
const SHEET_CONFIG = {
  ClinkerDemand: {
    required: true,
    columns: {
      'IUGU CODE': ['IUGU CODE', 'IUGU_CODE', 'IUGUCODE', 'IUGU', 'PLANT CODE', 'PLANT_CODE'],
      'TIME PERIOD': ['TIME PERIOD', 'TIME_PERIOD', 'TIMEPERIOD', 'PERIOD', 'T'],
      'DEMAND': ['DEMAND', 'QTY', 'QUANTITY'],
      'MIN FULFILLMENT': ['MIN FULFILLMENT', 'MIN_FULFILLMENT', 'MINFULFILLMENT', 'MIN FULFILL', 'MIN_FULFILL']
    }
  },
  ClinkerCapacity: {
    required: true,
    columns: {
      'IU CODE': ['IU CODE', 'IU_CODE', 'IUCODE', 'IU', 'PLANT CODE', 'PLANT_CODE'],
      'TIME PERIOD': ['TIME PERIOD', 'TIME_PERIOD', 'TIMEPERIOD', 'PERIOD', 'T'],
      'CAPACITY': ['CAPACITY', 'CAP', 'MAX CAPACITY', 'MAX_CAPACITY']
    }
  },
  ProductionCost: {
    required: true,
    columns: {
      'IU CODE': ['IU CODE', 'IU_CODE', 'IUCODE', 'IU', 'PLANT CODE', 'PLANT_CODE'],
      'TIME PERIOD': ['TIME PERIOD', 'TIME_PERIOD', 'TIMEPERIOD', 'PERIOD', 'T'],
      'PRODUCTION COST': ['PRODUCTION COST', 'PRODUCTION_COST', 'PRODUCTIONCOST', 'COST', 'PROD COST', 'PROD_COST']
    }
  },
  LogisticsIUGU: {
    required: true,
    columns: {
      'FROM IU CODE': ['FROM IU CODE', 'FROM_IU_CODE', 'FROMIUCODE', 'FROM IU', 'FROM_IU', 'SOURCE', 'FROM'],
      'TO IUGU CODE': ['TO IUGU CODE', 'TO_IUGU_CODE', 'TOIUGUCODE', 'TO IUGU', 'TO_IUGU', 'DESTINATION', 'TO'],
      'TRANSPORT CODE': ['TRANSPORT CODE', 'TRANSPORT_CODE', 'TRANSPORTCODE', 'TRANSPORT', 'MODE', 'TRANSPORT MODE'],
      'TIME PERIOD': ['TIME PERIOD', 'TIME_PERIOD', 'TIMEPERIOD', 'PERIOD', 'T'],
      'FREIGHT COST': ['FREIGHT COST', 'FREIGHT_COST', 'FREIGHTCOST', 'FREIGHT'],
      'HANDLING COST': ['HANDLING COST', 'HANDLING_COST', 'HANDLINGCOST', 'HANDLING'],
      'QUANTITY MULTIPLIER': ['QUANTITY MULTIPLIER', 'QUANTITY_MULTIPLIER', 'QUANTITYMULTIPLIER', 'QTY MULTIPLIER', 'QTY_MULTIPLIER', 'MULTIPLIER']
    }
  },
  IUGUConstraint: {
    required: true,
    columns: {
      'IU CODE': ['IU CODE', 'IU_CODE', 'IUCODE', 'IU', 'FROM IU CODE', 'FROM_IU_CODE'],
      'IUGU CODE': ['IUGU CODE', 'IUGU_CODE', 'IUGUCODE', 'IUGU', 'TO IUGU CODE', 'TO_IUGU_CODE'],
      'TRANSPORT CODE': ['TRANSPORT CODE', 'TRANSPORT_CODE', 'TRANSPORTCODE', 'TRANSPORT'],
      'TIME PERIOD': ['TIME PERIOD', 'TIME_PERIOD', 'TIMEPERIOD', 'PERIOD', 'T'],
      'BOUND TYPEID': ['BOUND TYPEID', 'BOUND_TYPEID', 'BOUNDTYPEID', 'BOUND TYPE', 'BOUND_TYPE', 'BOUNDTYPE'],
      'VALUE TYPEID': ['VALUE TYPEID', 'VALUE_TYPEID', 'VALUETYPEID', 'VALUE TYPE', 'VALUE_TYPE'],
      'Value': ['Value', 'VALUE', 'VAL', 'CONSTRAINT VALUE', 'CONSTRAINT_VALUE']
    }
  },
  IUGUOpeningStock: {
    required: true,
    columns: {
      'IUGU CODE': ['IUGU CODE', 'IUGU_CODE', 'IUGUCODE', 'IUGU', 'PLANT CODE', 'PLANT_CODE', 'CODE'],
      'OPENING STOCK': ['OPENING STOCK', 'OPENING_STOCK', 'OPENINGSTOCK', 'OPEN STOCK', 'OPEN_STOCK', 'INITIAL STOCK']
    }
  },
  IUGUClosingStock: {
    required: true,
    columns: {
      'IUGU CODE': ['IUGU CODE', 'IUGU_CODE', 'IUGUCODE', 'IUGU', 'PLANT CODE', 'PLANT_CODE', 'CODE'],
      'TIME PERIOD': ['TIME PERIOD', 'TIME_PERIOD', 'TIMEPERIOD', 'PERIOD', 'T'],
      'MIN CLOSE STOCK': ['MIN CLOSE STOCK', 'MIN_CLOSE_STOCK', 'MINCLOSESTOCK', 'MIN STOCK', 'MIN_STOCK', 'MINSTOCK'],
      'MAX CLOSE STOCK': ['MAX CLOSE STOCK', 'MAX_CLOSE_STOCK', 'MAXCLOSESTOCK', 'MAX STOCK', 'MAX_STOCK', 'MAXSTOCK']
    }
  },
  IUGUType: {
    required: true,
    columns: {
      'IUGU CODE': ['IUGU CODE', 'IUGU_CODE', 'IUGUCODE', 'IUGU', 'PLANT CODE', 'PLANT_CODE', 'CODE'],
      'PLANT TYPE': ['PLANT TYPE', 'PLANT_TYPE', 'PLANTTYPE', 'TYPE']
    }
  },
  // Optional sheets
  HubOpeningStock: {
    required: false,
    columns: {
      'HUB CODE': ['HUB CODE', 'HUB_CODE', 'HUBCODE', 'HUB'],
      'OPENING STOCK': ['OPENING STOCK', 'OPENING_STOCK', 'OPENINGSTOCK']
    }
  }
};

// Sheet name variations mapping
const SHEET_NAME_VARIATIONS = {
  'clinkerdemand': 'ClinkerDemand',
  'clinker_demand': 'ClinkerDemand',
  'clinker demand': 'ClinkerDemand',
  'demand': 'ClinkerDemand',
  
  'clinkercapacity': 'ClinkerCapacity',
  'clinker_capacity': 'ClinkerCapacity',
  'clinker capacity': 'ClinkerCapacity',
  'capacity': 'ClinkerCapacity',
  
  'productioncost': 'ProductionCost',
  'production_cost': 'ProductionCost',
  'production cost': 'ProductionCost',
  'cost': 'ProductionCost',
  
  'logisticsiugu': 'LogisticsIUGU',
  'logistics_iugu': 'LogisticsIUGU',
  'logistics iugu': 'LogisticsIUGU',
  'logistics': 'LogisticsIUGU',
  'transport': 'LogisticsIUGU',
  'transportation': 'LogisticsIUGU',
  
  'iuguconstraint': 'IUGUConstraint',
  'iugu_constraint': 'IUGUConstraint',
  'iugu constraint': 'IUGUConstraint',
  'constraint': 'IUGUConstraint',
  'constraints': 'IUGUConstraint',
  
  'iuguopeningstock': 'IUGUOpeningStock',
  'iugu_opening_stock': 'IUGUOpeningStock',
  'iugu opening stock': 'IUGUOpeningStock',
  'opening stock': 'IUGUOpeningStock',
  'openingstock': 'IUGUOpeningStock',
  
  'iuguclosingstock': 'IUGUClosingStock',
  'iugu_closing_stock': 'IUGUClosingStock',
  'iugu closing stock': 'IUGUClosingStock',
  'closing stock': 'IUGUClosingStock',
  'closingstock': 'IUGUClosingStock',
  
  'iugutype': 'IUGUType',
  'iugu_type': 'IUGUType',
  'iugu type': 'IUGUType',
  'type': 'IUGUType',
  'plant type': 'IUGUType',
  'planttype': 'IUGUType',
  
  'hubopeningstock': 'HubOpeningStock',
  'hub_opening_stock': 'HubOpeningStock',
  'hub opening stock': 'HubOpeningStock'
};

/**
 * Normalize a sheet name to match our expected format
 */
function normalizeSheetName(sheetName) {
  const normalized = sheetName.toLowerCase().trim().replace(/[\s_-]+/g, '');
  
  // Direct match
  if (SHEET_CONFIG[sheetName]) {
    return sheetName;
  }
  
  // Check variations
  for (const [variation, standard] of Object.entries(SHEET_NAME_VARIATIONS)) {
    if (normalized === variation.replace(/[\s_-]+/g, '')) {
      return standard;
    }
  }
  
  // Partial match
  for (const standardName of Object.keys(SHEET_CONFIG)) {
    if (normalized.includes(standardName.toLowerCase())) {
      return standardName;
    }
  }
  
  return null;
}

/**
 * Find the matching column name from variations
 */
function findColumnMatch(actualColumns, expectedVariations) {
  const normalizedActual = actualColumns.map(col => ({
    original: col,
    normalized: col.toUpperCase().trim().replace(/[\s_-]+/g, ' ')
  }));
  
  for (const variation of expectedVariations) {
    const normalizedVariation = variation.toUpperCase().trim().replace(/[\s_-]+/g, ' ');
    const match = normalizedActual.find(col => col.normalized === normalizedVariation);
    if (match) {
      return match.original;
    }
  }
  
  // Partial match
  for (const variation of expectedVariations) {
    const normalizedVariation = variation.toUpperCase().trim().replace(/[\s_-]+/g, '');
    const match = normalizedActual.find(col => 
      col.normalized.replace(/\s/g, '').includes(normalizedVariation) ||
      normalizedVariation.includes(col.normalized.replace(/\s/g, ''))
    );
    if (match) {
      return match.original;
    }
  }
  
  return null;
}

/**
 * Parse a numeric value, handling various formats
 */
function parseNumericValue(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  
  if (typeof value === 'string') {
    // Remove commas, spaces, currency symbols
    const cleaned = value.replace(/[,\s₹$]/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
}

/**
 * Parse a string value
 */
function parseStringValue(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

/**
 * Parse a single sheet into an array of objects
 */
function parseSheet(worksheet, sheetConfig, sheetName) {
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
  
  if (jsonData.length === 0) {
    return { data: [], warnings: [`Sheet "${sheetName}" is empty`] };
  }
  
  const actualColumns = Object.keys(jsonData[0]);
  const columnMapping = {};
  const warnings = [];
  
  // Map actual columns to expected columns
  for (const [expectedCol, variations] of Object.entries(sheetConfig.columns)) {
    const actualCol = findColumnMatch(actualColumns, variations);
    if (actualCol) {
      columnMapping[expectedCol] = actualCol;
    } else {
      warnings.push(`Column "${expectedCol}" not found in sheet "${sheetName}"`);
    }
  }
  
  // Transform data
  const transformedData = jsonData
    .filter(row => {
      // Skip completely empty rows
      const values = Object.values(row).filter(v => v !== null && v !== undefined && v !== '');
      return values.length > 0;
    })
    .map(row => {
      const newRow = {};
      
      for (const [expectedCol, actualCol] of Object.entries(columnMapping)) {
        const value = row[actualCol];
        
        // Determine if this should be numeric or string
        const numericColumns = [
          'TIME PERIOD', 'DEMAND', 'MIN FULFILLMENT', 'CAPACITY', 'PRODUCTION COST',
          'FREIGHT COST', 'HANDLING COST', 'Value', 'OPENING STOCK', 
          'MIN CLOSE STOCK', 'MAX CLOSE STOCK', 'QUANTITY MULTIPLIER'
        ];
        
        if (numericColumns.includes(expectedCol)) {
          newRow[expectedCol] = parseNumericValue(value);
        } else {
          newRow[expectedCol] = parseStringValue(value);
        }
      }
      
      return newRow;
    });
  
  return { data: transformedData, warnings };
}

/**
 * Main function to parse XLSX file
 */
export function parseXLSXFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result = {
          success: true,
          data: {},
          summary: {
            sheetsFound: [],
            sheetsUsed: [],
            sheetsIgnored: [],
            recordCounts: {},
            warnings: [],
            errors: []
          }
        };
        
        // Process each sheet
        for (const sheetName of workbook.SheetNames) {
          const normalizedName = normalizeSheetName(sheetName);
          result.summary.sheetsFound.push(sheetName);
          
          if (normalizedName && SHEET_CONFIG[normalizedName]) {
            const worksheet = workbook.Sheets[sheetName];
            const config = SHEET_CONFIG[normalizedName];
            const { data: sheetData, warnings } = parseSheet(worksheet, config, sheetName);
            
            result.data[normalizedName] = sheetData;
            result.summary.sheetsUsed.push({ original: sheetName, mapped: normalizedName });
            result.summary.recordCounts[normalizedName] = sheetData.length;
            result.summary.warnings.push(...warnings);
          } else {
            result.summary.sheetsIgnored.push(sheetName);
          }
        }
        
        // Check for required sheets
        for (const [sheetName, config] of Object.entries(SHEET_CONFIG)) {
          if (config.required && !result.data[sheetName]) {
            result.summary.errors.push(`Required sheet "${sheetName}" not found`);
          }
        }
        
        // Determine overall success
        result.success = result.summary.errors.length === 0;
        
        resolve(result);
        
      } catch (error) {
        reject({
          success: false,
          error: `Failed to parse Excel file: ${error.message}`,
          summary: { errors: [error.message] }
        });
      }
    };
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'Failed to read file',
        summary: { errors: ['Failed to read file'] }
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Validate the parsed data structure
 */
export function validateParsedData(data) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Check ClinkerDemand
  if (data.ClinkerDemand) {
    const invalidDemands = data.ClinkerDemand.filter(d => !d['IUGU CODE'] || d['TIME PERIOD'] === 0);
    if (invalidDemands.length > 0) {
      validation.warnings.push(`${invalidDemands.length} demand records have missing IUGU CODE or TIME PERIOD`);
    }
  }
  
  // Check ClinkerCapacity
  if (data.ClinkerCapacity) {
    const invalidCapacity = data.ClinkerCapacity.filter(c => !c['IU CODE'] || c['CAPACITY'] <= 0);
    if (invalidCapacity.length > 0) {
      validation.warnings.push(`${invalidCapacity.length} capacity records have missing IU CODE or zero capacity`);
    }
  }
  
  // Check LogisticsIUGU
  if (data.LogisticsIUGU) {
    const invalidLogistics = data.LogisticsIUGU.filter(l => !l['FROM IU CODE'] || !l['TO IUGU CODE']);
    if (invalidLogistics.length > 0) {
      validation.warnings.push(`${invalidLogistics.length} logistics records have missing FROM/TO codes`);
    }
  }
  
  return validation;
}

export default parseXLSXFile;
