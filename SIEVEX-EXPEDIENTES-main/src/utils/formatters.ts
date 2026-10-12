/**
 * Funciones de formateo acordes con la convención venezolana
 */

export const formatBs = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return 'Bs. 0,00';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '.'));
  if (isNaN(num)) return 'Bs. 0,00';
  return 'Bs. ' + num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatUSD = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '$0.00';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '.'));
  if (isNaN(num)) return '$0.00';
  return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatTasaBCV = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '0,00 Bs/USD';
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, '.'));
  if (isNaN(num)) return '0,00 Bs/USD';
  return num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + ' Bs/USD';
};

export const formatDateVE = (isoString?: string): string => {
  if (!isoString) return '—';
  try {
    const parts = isoString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return new Date(isoString).toLocaleDateString('es-VE');
  } catch {
    return isoString;
  }
};
