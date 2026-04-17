// Currency formatting utilities for Indian Rupees

export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    showDecimals = false,
    compact = false
  } = options;

  if (amount === null || amount === undefined) return '₹0';

  const numAmount = parseFloat(amount);
  
  if (compact) {
    return formatCompactCurrency(numAmount, showSymbol);
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  let formatted = formatter.format(numAmount);
  
  if (!showSymbol) {
    formatted = formatted.replace('₹', '').trim();
  }

  return formatted;
};

export const formatCompactCurrency = (amount, showSymbol = true) => {
  const numAmount = parseFloat(amount);
  const symbol = showSymbol ? '₹' : '';
  
  if (numAmount >= 10000000) { // 1 crore
    return `${symbol}${(numAmount / 10000000).toFixed(1)}Cr`;
  } else if (numAmount >= 100000) { // 1 lakh
    return `${symbol}${(numAmount / 100000).toFixed(1)}L`;
  } else if (numAmount >= 1000) { // 1 thousand
    return `${symbol}${(numAmount / 1000).toFixed(1)}K`;
  } else {
    return `${symbol}${numAmount.toLocaleString('en-IN')}`;
  }
};

export const formatNumber = (number, options = {}) => {
  const {
    decimals = 0,
    compact = false
  } = options;

  if (number === null || number === undefined) return '0';

  const numValue = parseFloat(number);
  
  if (compact) {
    if (numValue >= 10000000) {
      return `${(numValue / 10000000).toFixed(1)}Cr`;
    } else if (numValue >= 100000) {
      return `${(numValue / 100000).toFixed(1)}L`;
    } else if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
  }

  return numValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Convert USD to INR (for any remaining conversions)
export const usdToInr = (usdAmount, exchangeRate = 83.4) => {
  return parseFloat(usdAmount) * exchangeRate;
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};