import {
  AUTENTICATION_TYPE_MAP,
  PERSON_TYPE_MAP,
  PROOF_OF_ADDRESS_TYPE_MAP,
  autenticationIdToDesc,
  cleanRFC,
  coerceString,
  mapAutenticationTypeIdQuick,
  mapAutenticationTypeIdQuickSafe,
  mapAutenticationTypeToDescSafe,
  mapPersonType,
  mapPersonTypeSafe,
  mapPersonTypeToDescSafe,
  mapProffOfAddressTypeIdQuick,
  mapProffOfAddressTypeIdQuickSafe,
  mapProffOfAddressTypeToDescSafe,
  normalizeBoolean,
  personTypeIdToDesc,
  proofOfAddressTypeIdToDesc,
  toDDMMYYYY,
} from './maper-helpers.autocertification';

describe('maper-helpers.autocertification', () => {
  describe('normalizeBoolean', () => {
    it('debe respetar true/false y variantes válidas', () => {
      expect(normalizeBoolean(true)).toBeTrue();
      expect(normalizeBoolean('true')).toBeTrue();
      expect(normalizeBoolean(1)).toBeTrue();
      expect(normalizeBoolean('1')).toBeTrue();

      expect(normalizeBoolean(false)).toBeFalse();
      expect(normalizeBoolean('false')).toBeFalse();
      expect(normalizeBoolean(0)).toBeFalse();
      expect(normalizeBoolean('0')).toBeFalse();
    });

    it('debe usar defaultValue para null/undefined/empty', () => {
      expect(normalizeBoolean(undefined, true)).toBeTrue();
      expect(normalizeBoolean(null, false)).toBeFalse();
      expect(normalizeBoolean('', true)).toBeTrue();
      expect(normalizeBoolean('', undefined)).toBeFalse();
    });
  });

  describe('toDDMMYYYY', () => {
    it('debe retornar vacío para valor vacío o inválido', () => {
      expect(toDDMMYYYY()).toBe('');
      expect(toDDMMYYYY('')).toBe('');
      expect(toDDMMYYYY('fecha-invalida')).toBe('');
    });

    it('debe devolver igual si ya viene en DD/MM/YYYY', () => {
      expect(toDDMMYYYY('15/05/2026')).toBe('15/05/2026');
    });

    it('debe transformar fechas parseables', () => {
      const date = new Date('2026-05-15');
      const expected = `${String(date.getDate()).padStart(2, '0')}/${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}/${date.getFullYear()}`;
      expect(toDDMMYYYY('2026-05-15')).toBe(expected);
    });
  });

  describe('mapPersonType / mapPersonTypeSafe', () => {
    it('mapPersonType debe mapear TITULAR/COTITULAR y usar fallback', () => {
      expect(mapPersonType('TITULAR')).toBe(1);
      expect(mapPersonType('cotitular')).toBe(2);
      expect(mapPersonType('otro')).toBe(1);
    });

    it('mapPersonTypeSafe debe soportar number/string/nullish', () => {
      expect(mapPersonTypeSafe(2)).toBe(2);
      expect(mapPersonTypeSafe(0)).toBe(1);
      expect(mapPersonTypeSafe('COTITULAR')).toBe(2);
      expect(mapPersonTypeSafe(undefined)).toBe(1);
      expect(mapPersonTypeSafe(null as any)).toBe(1);
    });
  });

  describe('proof of address mappers', () => {
    it('mapProffOfAddressTypeIdQuick debe mapear descripciones conocidas', () => {
      expect(mapProffOfAddressTypeIdQuick('CONSTANCIA DE RESIDENCIA FISCAL')).toBe('XX03');
      expect(mapProffOfAddressTypeIdQuick('id fiscal extranjero')).toBe('XX01');
    });

    it('mapProffOfAddressTypeIdQuickSafe debe soportar códigos y alias', () => {
      expect(mapProffOfAddressTypeIdQuickSafe('xx03')).toBe('XX03');
      expect(mapProffOfAddressTypeIdQuickSafe('1')).toBe('XX03');
      expect(mapProffOfAddressTypeIdQuickSafe('ID FISCAL EXTRANJERO')).toBe('XX01');
      expect(mapProffOfAddressTypeIdQuickSafe(undefined)).toBe('');
    });

    it('proofOfAddressTypeIdToDesc y mapProffOfAddressTypeToDescSafe deben resolver descripción', () => {
      expect(proofOfAddressTypeIdToDesc('xx03')).toBe('CONSTANCIA DE RESIDENCIA FISCAL');
      expect(mapProffOfAddressTypeToDescSafe('XX01')).toBe('ID FISCAL EXTRANJERO');
      expect(mapProffOfAddressTypeToDescSafe('unknown')).toBe('');
    });
  });

  describe('autentication mappers', () => {
    it('mapAutenticationTypeIdQuick debe mapear descripciones conocidas', () => {
      expect(mapAutenticationTypeIdQuick('ID FISCAL EXTRANJERO (NIF / TIN / NSS)')).toBe('US01');
      expect(mapAutenticationTypeIdQuick('escrito libre sin nss')).toBe('US03');
    });

    it('mapAutenticationTypeIdQuickSafe debe soportar código y FAT1', () => {
      expect(mapAutenticationTypeIdQuickSafe('us02')).toBe('US02');
      expect(mapAutenticationTypeIdQuickSafe('fat1')).toBe('US01');
      expect(mapAutenticationTypeIdQuickSafe(undefined)).toBe('');
    });

    it('autenticationIdToDesc y mapAutenticationTypeToDescSafe deben resolver descripción', () => {
      expect(autenticationIdToDesc('us01')).toBe('ID Fiscal Extranjero (NIF / TIN / NSS)');
      expect(mapAutenticationTypeToDescSafe('US03')).toBe('Escrito Libre sin NSS');
      expect(mapAutenticationTypeToDescSafe('FAT1')).toBe('ID Fiscal Extranjero (NIF / TIN / NSS)');
      expect(mapAutenticationTypeToDescSafe('unknown')).toBe('');
    });
  });

  describe('personType description helpers', () => {
    it('personTypeIdToDesc y mapPersonTypeToDescSafe deben resolver descripción', () => {
      expect(personTypeIdToDesc(1)).toBe('TITULAR');
      expect(personTypeIdToDesc('2')).toBe('COTITULAR');
      expect(mapPersonTypeToDescSafe('2')).toBe('COTITULAR');
      expect(mapPersonTypeToDescSafe('999')).toBe('TITULAR');
      expect(mapPersonTypeToDescSafe(undefined)).toBe('TITULAR');
    });
  });

  describe('misc utils', () => {
    it('cleanRFC debe limpiar caracteres especiales y mayúsculas', () => {
      expect(cleanRFC(' ab-c_123*xyz ')).toBe('ABC123XYZ');
      expect(cleanRFC(undefined)).toBe('');
    });

    it('coerceString debe retornar string trim o vacío para nullish', () => {
      expect(coerceString('  hola  ')).toBe('hola');
      expect(coerceString(123)).toBe('123');
      expect(coerceString(null)).toBe('');
      expect(coerceString(undefined)).toBe('');
    });

    it('const maps deben estar definidos con elementos esperados', () => {
      expect(PERSON_TYPE_MAP.length).toBeGreaterThan(0);
      expect(PROOF_OF_ADDRESS_TYPE_MAP.length).toBeGreaterThan(0);
      expect(AUTENTICATION_TYPE_MAP.length).toBeGreaterThan(0);
    });
  });
});
