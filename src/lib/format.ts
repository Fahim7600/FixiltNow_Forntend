/**
 * Formats a currency value (number or Prisma Decimal string) into a formatted USD string ($45.00).
 */
export function formatCurrency(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') {
    return '$0.00';
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formats a rating value (number or Prisma Decimal string) into a 1-decimal string (4.8).
 */
export function formatRating(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') {
    return '0.0';
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    return '0.0';
  }
  return num.toFixed(1);
}
