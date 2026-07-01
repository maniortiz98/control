export function normalizeBoolean(value: any) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

export function toDDMMYYYY(value?: string): string {
  if (!value) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function mapPersonType(value: string): number {
  const map: Record<string, number> = {
    TITULAR: 1,
    COTITULAR: 2,
  };
  return map[value.toUpperCase()] ?? 1;
}

export function mapPersonTypeSafe(value?: number | string): number {
  if (value === undefined || value === null) return 1;
  if (typeof value === 'number') return value || 1;
  return mapPersonType(value);
}

export function mapProffOfAddressTypeIdQuick(value: string): string {
  const map: Record<string, string> = {
    'CONSTANCIA DE RESIDENCIA FISCAL': 'XX03',
    'ID FISCAL EXTRANJERO': 'XX01',
  };
  return map[value.toUpperCase()];
}

export function mapProffOfAddressTypeIdQuickSafe(value?: string): string {
  if (!value) return '';
  if (/^XX\d{2}$/i.test(value)) return value.toUpperCase();
  if (value === '1') return 'XX03';
  return mapProffOfAddressTypeIdQuick(value) ?? value;
}

export function mapAutenticationTypeIdQuick(value: string): string {
  const map: Record<string, string> = {
    'ID FISCAL EXTRANJERO (NIF / TIN / NSS)': 'US01',
    'CERTIFICADO DE PÉRDIDA DE NACIONALIDAD': 'US02',
    'ESCRITO LIBRE SIN NSS': 'US03',
  };
  return map[value.toUpperCase()];
}

export function mapAutenticationTypeIdQuickSafe(value?: string): string {
  if (!value) return '';
  if (/^US\d{2}$/i.test(value)) return value.toUpperCase();
  if (value.toUpperCase() === 'FAT1') return 'US01';
  return mapAutenticationTypeIdQuick(value) ?? value;
}

export function cleanRFC(rfc?: string): string {
  return (rfc ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function coerceString(value: any): string {
  return value == null ? '' : String(value).trim();
}


export const PERSON_TYPE_MAP = [
  { desPersonType: 'TITULAR', personTypeId: '1' },
  { desPersonType: 'COTITULAR', personTypeId: '2' },
];

export const PROOF_OF_ADDRESS_TYPE_MAP = [
  { desProffOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL', proffOfAddressTypeId: 'XX03' },
  { desProffOfAddressType: 'ID FISCAL EXTRANJERO', proffOfAddressTypeId: 'XX01' },
];

export const AUTENTICATION_TYPE_MAP = [
  { desAutenticationType: 'ID FISCAL EXTRANJERO (NIF / TIN / NSS)', autenticationTypeId: 'US01' },
  { desAutenticationType: 'Certificado de Pérdida de Nacionalidad', autenticationTypeId: 'US02' },
  { desAutenticationType: 'Escrito Libre sin NSS', autenticationTypeId: 'US03' },
];

export function personTypeIdToDesc(id?: string | number): string {
  const v = String(id ?? '').trim();
  return PERSON_TYPE_MAP.find(x => x.personTypeId === v)?.desPersonType ?? '';
}

export function proofOfAddressTypeIdToDesc(id?: string): string {
  const v = String(id ?? '').trim().toUpperCase();
  return PROOF_OF_ADDRESS_TYPE_MAP.find(x => x.proffOfAddressTypeId === v)?.desProffOfAddressType ?? '';
}

export function autenticationIdToDesc(id?: string): string {
  const v = String(id ?? '').trim().toUpperCase();
  return AUTENTICATION_TYPE_MAP.find(x => x.autenticationTypeId === v)?.desAutenticationType ?? '';
}

export function mapPersonTypeToDescSafe(value?: number | string): string {
  if (value === undefined || value === null || value === '') return 'TITULAR';
  const n = Number(value);
  if (!isNaN(n)) return personTypeIdToDesc(n) || 'TITULAR';
  const back = personTypeIdToDesc(value as string);
  if (back) return back;
  return 'TITULAR';
}

export function mapProffOfAddressTypeToDescSafe(value?: string): string {
  if (!value) return '';
  const v = String(value).trim().toUpperCase();
  if (/^XX\d{2}$/.test(v)) return proofOfAddressTypeIdToDesc(v) || '';
  return proofOfAddressTypeIdToDesc(v) || '';
}

export function mapAutenticationTypeToDescSafe(value?: string): string {
  if (!value) return '';
  const v = String(value).trim().toUpperCase();
  if (/^US\d{2}$/.test(v)) return autenticationIdToDesc(v) || '';
  if (v === 'FAT1') return autenticationIdToDesc('US01') || '';
  return autenticationIdToDesc(v) || '';
}






