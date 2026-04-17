// Data validation utilities

export const validateClinkerDemand = (data) => {
  if (!data || !Array.isArray(data)) return { valid: true, issues: [] };
  
  const issues = [];
  
  data.forEach((item, index) => {
    if (!item) {
      issues.push(`Record ${index}: Null or undefined record`);
      return;
    }
    
    if (!item['IUGU CODE']) {
      issues.push(`Record ${index}: Missing IUGU CODE`);
    }
    
    if (item['TIME PERIOD'] === undefined || item['TIME PERIOD'] === null) {
      issues.push(`Record ${index}: Missing TIME PERIOD`);
    }
    
    if (item.DEMAND === undefined || item.DEMAND === null || item.DEMAND === '') {
      issues.push(`Record ${index}: Missing or empty DEMAND value`);
    }
    
    // Check for unexpected fields
    const expectedFields = ['IUGU CODE', 'TIME PERIOD', 'DEMAND'];
    const actualFields = Object.keys(item);
    const unexpectedFields = actualFields.filter(field => !expectedFields.includes(field));
    
    if (unexpectedFields.length > 0) {
      issues.push(`Record ${index}: Unexpected fields: ${unexpectedFields.join(', ')}`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    totalRecords: data.length,
    validRecords: data.filter(item => 
      item && 
      item['IUGU CODE'] && 
      item['TIME PERIOD'] !== undefined && 
      item.DEMAND !== undefined
    ).length
  };
};

export const validateAllData = (data) => {
  const results = {};
  
  if (data.ClinkerDemand) {
    results.ClinkerDemand = validateClinkerDemand(data.ClinkerDemand);
  }
  
  // Add more validators as needed
  
  return results;
};

export const logDataIssues = (data) => {
  const validation = validateAllData(data);
  
  Object.entries(validation).forEach(([section, result]) => {
    if (!result.valid) {
      console.warn(`Data issues in ${section}:`, result.issues);
      console.log(`${section}: ${result.validRecords}/${result.totalRecords} valid records`);
    } else {
      console.log(`${section}: All ${result.totalRecords} records are valid`);
    }
  });
  
  return validation;
};