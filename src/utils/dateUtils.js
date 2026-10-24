// Date utilities and preset date ranges for InsightIQ Analytics
import { subDays, startOfYear, startOfMonth, format, parseISO, isWithinInterval } from 'date-fns';

export const DATE_PRESETS = [
  { label: 'Last 7 Days', value: '7D', days: 7 },
  { label: 'Last 30 Days', value: '30D', days: 30 },
  { label: 'Last 90 Days', value: '90D', days: 90 },
  { label: 'Year to Date (YTD)', value: 'YTD', days: null },
  { label: 'Last 12 Months', value: '12M', days: 365 },
  { label: 'All Time', value: 'ALL', days: null }
];

export const getPresetInterval = (presetValue, referenceDate = new Date('2026-10-19')) => {
  const end = referenceDate;
  let start;

  switch (presetValue) {
    case '7D':
      start = subDays(end, 7);
      break;
    case '30D':
      start = subDays(end, 30);
      break;
    case '90D':
      start = subDays(end, 90);
      break;
    case 'YTD':
      start = startOfYear(end);
      break;
    case '12M':
      start = subDays(end, 365);
      break;
    case 'ALL':
    default:
      start = new Date('2025-10-01');
      break;
  }

  return { start, end };
};

export const isOrderInDateRange = (orderDateStr, presetValue, customStart, customEnd) => {
  if (presetValue === 'ALL') return true;

  try {
    const orderDate = typeof orderDateStr === 'string' ? parseISO(orderDateStr) : orderDateStr;

    if (presetValue === 'CUSTOM' && customStart && customEnd) {
      const start = parseISO(customStart);
      const end = parseISO(customEnd);
      return isWithinInterval(orderDate, { start, end });
    }

    const { start, end } = getPresetInterval(presetValue);
    return isWithinInterval(orderDate, { start, end });
  } catch (err) {
    return true;
  }
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'MMM dd, yyyy');
  } catch (err) {
    return dateStr;
  }
};
