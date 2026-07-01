import {
  normalizeBoolean,
  toDDMMYYYY,
  mapPersonType,
  mapPersonTypeSafe,
  mapProffOfAddressTypeIdQuickSafe,
  mapAutenticationTypeIdQuickSafe,
  cleanRFC,
  coerceString,
  personTypeIdToDesc,
  proofOfAddressTypeIdToDesc,
  autenticationIdToDesc,
  mapPersonTypeToDescSafe,
  mapProffOfAddressTypeToDescSafe,
  mapAutenticationTypeToDescSafe
} from './customer-maper-helpers-autocertification';

describe('Utils Extended', () => {

  describe('normalizeBoolean', () => {
    it('true cases', () => {
      expect(normalizeBoolean(true)).toBeTrue();
      expect(normalizeBoolean('true')).toBeTrue();
      expect(normalizeBoolean(1)).toBeTrue();
      expect(normalizeBoolean('1')).toBeTrue();
    });

    it('false cases', () => {
      expect(normalizeBoolean(false)).toBeFalse();
      expect(normalizeBoolean(0)).toBeFalse();
      expect(normalizeBoolean('false')).toBeFalse();
    });
  });

  describe('toDDMMYYYY', () => {
    it('ya formateado', () => {
      expect(toDDMMYYYY('01/01/2024')).toBe('01/01/2024');
    });

    it('formato ISO', () => {
      expect(toDDMMYYYY('2024-01-01')).toBe('31/12/2023');
    });

    it('valor inválido', () => {
      expect(toDDMMYYYY('xxx')).toBe('');
    });

    it('sin valor', () => {
      expect(toDDMMYYYY()).toBe('');
    });
  });

  describe('mapPersonType', () => {
    it('mapea correctamente', () => {
      expect(mapPersonType('TITULAR')).toBe(1);
      expect(mapPersonType('COTITULAR')).toBe(2);
    });

    it('default', () => {
      expect(mapPersonType('X')).toBe(1);
    });
  });

  describe('mapPersonTypeSafe', () => {
    it('number', () => {
      expect(mapPersonTypeSafe(2)).toBe(2);
    });

    it('string', () => {
      expect(mapPersonTypeSafe('COTITULAR')).toBe(2);
    });

    it('default', () => {
      expect(mapPersonTypeSafe(undefined)).toBe(1);
    });
  });

  describe('mapProffOfAddressTypeIdQuickSafe', () => {
    it('code directo', () => {
      expect(mapProffOfAddressTypeIdQuickSafe('XX03')).toBe('XX03');
    });

    it('desde texto', () => {
      expect(
        mapProffOfAddressTypeIdQuickSafe('CONSTANCIA DE RESIDENCIA FISCAL')
      ).toBe('XX03');
    });

    it('fallback', () => {
      expect(mapProffOfAddressTypeIdQuickSafe('X')).toBe('X');
    });
  });

  describe('mapAutenticationTypeIdQuickSafe', () => {
    it('code directo', () => {
      expect(mapAutenticationTypeIdQuickSafe('US01')).toBe('US01');
    });

    it('alias FAT1', () => {
      expect(mapAutenticationTypeIdQuickSafe('FAT1')).toBe('US01');
    });

    it('por texto', () => {
      expect(
        mapAutenticationTypeIdQuickSafe('ESCRITO LIBRE SIN NSS')
      ).toBe('US03');
    });
  });

  describe('cleanRFC', () => {
    it('limpia caracteres', () => {
      expect(cleanRFC('abc-123')).toBe('ABC123');
    });

    it('maneja undefined', () => {
      expect(cleanRFC()).toBe('');
    });
  });

  describe('coerceString', () => {
    it('normal', () => {
      expect(coerceString(123)).toBe('123');
    });

    it('trim', () => {
      expect(coerceString('  test ')).toBe('test');
    });

    it('null/undefined', () => {
      expect(coerceString(null)).toBe('');
    });
  });

  describe('descriptions', () => {

    it('personTypeIdToDesc', () => {
      expect(personTypeIdToDesc('1')).toBe('TITULAR');
      expect(personTypeIdToDesc('2')).toBe('COTITULAR');
      expect(personTypeIdToDesc('X')).toBe('');
    });

    it('proofOfAddressTypeIdToDesc', () => {
      expect(proofOfAddressTypeIdToDesc('XX03')).toBe('CONSTANCIA DE RESIDENCIA FISCAL');
    });

    it('autenticationIdToDesc', () => {
      expect(autenticationIdToDesc('US01')).toContain('ID FISCAL');
    });

  });

  describe('mapPersonTypeToDescSafe', () => {
    it('number', () => {
      expect(mapPersonTypeToDescSafe(1)).toBe('TITULAR');
    });

    it('default', () => {
      expect(mapPersonTypeToDescSafe()).toBe('TITULAR');
    });
  });

  describe('mapProffOfAddressTypeToDescSafe', () => {
    it('code', () => {
      expect(mapProffOfAddressTypeToDescSafe('XX03')).toBe('CONSTANCIA DE RESIDENCIA FISCAL');
    });

    it('empty', () => {
      expect(mapProffOfAddressTypeToDescSafe()).toBe('');
    });
  });

  describe('mapAutenticationTypeToDescSafe', () => {
    it('code', () => {
      expect(mapAutenticationTypeToDescSafe('US01')).toContain('ID FISCAL');
    });

    it('FAT1', () => {
      expect(mapAutenticationTypeToDescSafe('FAT1')).toContain('ID FISCAL');
    });

    it('empty', () => {
      expect(mapAutenticationTypeToDescSafe()).toBe('');
    });
  });

});