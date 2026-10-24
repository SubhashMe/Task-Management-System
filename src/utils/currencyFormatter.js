// Currency and number formatting utilities for InsightIQ Analytics

export const formatCurrency = (amount, currency = 'RS', compact = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return currency === 'RS' || currency === 'INR' ? '₹0' : `${currency} 0`;
  }

  const isRupee = currency === 'RS' || currency === 'INR';
  const prefix = isRupee ? '₹' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : '$'));

  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `${prefix}${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${prefix}${(amount / 1_000).toFixed(1)}K`;
    }
  }

  try {
    const validCurrency = isRupee ? 'INR' : currency;
    const locale = isRupee ? 'en-IN' : (currency === 'EUR' ? 'de-DE' : (currency === 'GBP' ? 'en-GB' : 'en-US'));

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    // Graceful fallback if custom currency string is provided
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
    return `${prefix}${formatted}`;
  }
};

export const formatNumber = (num, compact = false) => {
  if (num === undefined || num === null || isNaN(num)) return '0';

  if (compact) {
    if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (decimalOrPercent, isDecimal = false) => {
  if (decimalOrPercent === undefined || decimalOrPercent === null || isNaN(decimalOrPercent)) return '0.0%';
  const val = isDecimal ? decimalOrPercent * 100 : decimalOrPercent;
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
};
