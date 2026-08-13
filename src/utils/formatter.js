/**
 * Formats a numeric value into Indonesian Rupiah (IDR) currency format.
 * If the value is already a string, it returns it as is.
 * 
 * @param {number|string} value - The price to format
 * @returns {string} Formatted price (e.g., "Rp 35.000")
 */
export function formatRupiah(value) {
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
