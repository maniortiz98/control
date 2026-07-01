export type CustomerTriCountry = 'MX' | 'US' | 'OTRO';

export const norm = (v?: string): CustomerTriCountry => {
  const s = (v || '').toUpperCase().trim();
  if (['MX', 'MEXICO', 'MÉXICO'].includes(s)) return 'MX';
  if (['US', 'USA', 'EEUU', 'ESTADOS UNIDOS', 'UNITED STATES'].includes(s))
    return 'US';
  return 'OTRO';
};

const isActive = (r: any) => r && r.active !== false;
const taxUS = (rows: any[]) =>
  rows.some((r) => isActive(r) && norm(r.country) === 'US');
const taxMX = (rows: any[]) =>
  rows.some((r) => isActive(r) && norm(r.country) === 'MX');
const taxOTRO = (rows: any[]) =>
  rows.some((r) => isActive(r) && norm(r.country) === 'OTRO');
const activeCount = (rows: any[]) => rows.filter(isActive).length;

export interface CustomerPolicyGlobal {
  fatca: boolean; // (005/006)
  crs: boolean; // (007)
  requireRFC: boolean; // (008)
  tributaMX: boolean; // (008)
  requireNIF: boolean; // (009)
}

export interface CustomerPolicyPerRow {
  requireTinOrSsn: boolean; // (001) US tax
  optionalTinOrSsn: boolean; // (002) bornUS || natUS sin US tax
  enableFreeTextReason: boolean; // (003)
  enableLossCertificate: boolean; // (004)
  requireNIF: boolean; // (009) tax = OTRO
}

export interface CustomerPolicyResult {
  global: CustomerPolicyGlobal;
  byRow: Record<string, CustomerPolicyPerRow>;
}

/**
 * Restricciones Matriciales 001–009.
 * - Global (FATCA/CRS/RFC/NIF) = función de nacimiento, nacionalidad y residencias activas.
 * - Por fila (TIN/SSN, escrito libre, certificado pérdida, NIF) = función de esa fila + nacimiento/nacionalidad.
 */
export function computePolicy(
  birthCountry: string | undefined,
  nationality: string | undefined,
  rows: any[],
): CustomerPolicyResult {
  const bornUS = norm(birthCountry) === 'US';
  const natUS = norm(nationality) === 'US';
  const hasUS = taxUS(rows);
  const hasMX = taxMX(rows);
  const hasOTRO = taxOTRO(rows);
  const count = activeCount(rows);

  // (005) FATCA = true si nació en US o nacionalidad US o tributa en US
  // (006) En otro caso => FATCA = false
  const fatca = bornUS || natUS || hasUS;

  // (007) CRS = false si el único país de residencia fiscal es US; en otros casos, true
  const crs = count > 0 &&  !(count === 1 && hasUS && !hasMX && !hasOTRO);

  // (008) RFC/TributaMX
  const tributaMX = hasMX;
  const requireRFC = hasMX;

  // (009) NIF obligatorio si hay residencia fiscal distinta de MX/US
  const requireNIF = hasOTRO;

  const global: CustomerPolicyGlobal = {
    fatca,
    crs,
    requireRFC,
    tributaMX,
    requireNIF,
  };

  // Por fila (001, 002, 003, 004, 009)
  const byRow: Record<string, CustomerPolicyPerRow> = {};
  rows.forEach((r) => {
    if (!isActive(r)) return;
    const tempId = r.tempId;
    const rowUS = norm(r.country) === 'US';
    const rowOTRO = norm(r.country) === 'OTRO';

    // (001) US tax => TIN/SSN obligatorio
    const requireTinOrSsn = rowUS;

    // (002) si NO aplica (001) y (bornUS || natUS) => TIN/SSN opcional
    const optionalTinOrSsn = !requireTinOrSsn && (bornUS || natUS);

    // (003) Escrito Libre opcional con la misma condición de (002)
    const enableFreeTextReason = optionalTinOrSsn;

    // (004) Nació US + nacionalidad != US + tax != US => Cert. de Pérdida opcional
    const enableLossCertificate = bornUS && !natUS && !rowUS;

    // (009) NIF por fila si tax = OTRO
    const requireNIFRow = rowOTRO;

    byRow[tempId] = {
      requireTinOrSsn,
      optionalTinOrSsn,
      enableFreeTextReason,
      enableLossCertificate,
      requireNIF: requireNIFRow,
    };
  });

  return { global, byRow };
}

