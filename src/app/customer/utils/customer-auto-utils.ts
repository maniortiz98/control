import { CustomerFiscalValidationContext } from '../../customer/models/customer-fiscal-self-declaration-data';


export function normalizeCountry(
  code?: string,
): 'MX' | 'US' | 'OTRO' | '-' | 'ANY' {
  if (!code) return 'OTRO';
  const v = code.toString().trim().toUpperCase();

  if (v === '-' || v === 'ANY') return v as '-' | 'ANY';

  const mxLabels = new Set(['MX', 'MEXICO', 'MÉXICO']);
  const usLabels = new Set([
    'US',
    'USA',
    'EEUU',
    'EUA',
    'ESTADOS UNIDOS',
    'UNITED STATES',
  ]);
  const anyLabels = new Set(['CUALQUIERA']);

  if (mxLabels.has(v)) return 'MX';
  if (usLabels.has(v)) return 'US';
  if (anyLabels.has(v)) return 'ANY';
  if (v.includes('OTRO')) return 'OTRO';
  if (v.includes('DIFERENTE')) return 'OTRO';

  return 'OTRO';
}

export function buildContext(
  params: Partial<CustomerFiscalValidationContext>,
): CustomerFiscalValidationContext {
  return {
    countryId: normalizeCountry(params.countryId) as 'MX' | 'US' | 'OTRO',
    nationality: normalizeCountry(params.nationality) as 'MX' | 'US' | 'OTRO',
    taxCountry: normalizeCountry(params.taxCountry) as 'MX' | 'US' | 'OTRO',
    doubleTaxCountry: normalizeCountry(params.doubleTaxCountry),
  };
}

export function pruneEmpty<T extends Record<string, any>>(obj: T): T {
  const out: any = Array.isArray(obj) ? [] : {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (typeof v === 'string' && v.trim() === '') return;
    if (Array.isArray(v))
      out[k] = v.map((i) => pruneEmpty(i)).filter((i) => i !== undefined);
    else if (typeof v === 'object') out[k] = pruneEmpty(v);
    else out[k] = v;
  });
  return out;
}

export function buildCleanPayload(raw: any) {
  const payload = { ...raw };
  const v = (payload.proofOfAddressType || '').toUpperCase().trim();
  const isConstancia = v === 'CONSTANCIA DE RESIDENCIA FISCAL' || v === 'XX03';
  const isIdExtranjero = v === 'ID FISCAL EXTRANJERO' || v === 'XX01';

  if (isConstancia) {
    delete payload.certificationDate;
    delete payload.declarationYear;
  } else if (isIdExtranjero) {
    delete payload.issueDate;
    delete payload.expirationStatus;
    delete payload.expirationDate;
  }
  return payload;
}

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const out: any = {};
  Object.keys(obj || {}).forEach((k) => {
    if (!keys.includes(k as K)) out[k] = obj[k as K];
  });
  return out;
}

export function stripTempIdDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(stripTempIdDeep) as unknown as T;
  }
  if (input && typeof input === 'object') {
    const without = omit(input as Record<string, any>, ['tempId']);
    Object.keys(without).forEach((k) => {
      // @ts-ignore
      without[k] = stripTempIdDeep(without[k]);
    });
    return without as T;
  }
  return input;
}






