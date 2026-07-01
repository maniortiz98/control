import {
  normalizeCountry,
  buildContext,
  pruneEmpty,
  buildCleanPayload,
  omit,
  stripTempIdDeep
} from './customer-auto-utils';

describe('Misc Utils', () => {

  describe('normalizeCountry', () => {

    it('MX', () => {
      expect(normalizeCountry('mx')).toBe('MX');
      expect(normalizeCountry('México')).toBe('MX');
    });

    it('US', () => {
      expect(normalizeCountry('usa')).toBe('US');
      expect(normalizeCountry('Estados Unidos')).toBe('US');
    });

    it('ANY y -', () => {
      expect(normalizeCountry('ANY')).toBe('ANY');
      expect(normalizeCountry('-')).toBe('-');
    });

    it('OTRO fallback', () => {
      expect(normalizeCountry('FR')).toBe('OTRO');
      expect(normalizeCountry()).toBe('OTRO');
    });

    it('detecta texto OTRO', () => {
      expect(normalizeCountry('otro país')).toBe('OTRO');
      expect(normalizeCountry('diferente')).toBe('OTRO');
    });

  });

  describe('buildContext', () => {

    it('normaliza campos', () => {
      const ctx = buildContext({
        countryId: 'mx',
        nationality: 'usa',
        taxCountry: 'FR',
        doubleTaxCountry: 'ANY'
      });

      expect(ctx.countryId).toBe('MX');
      expect(ctx.nationality).toBe('US');
      expect(ctx.taxCountry).toBe('OTRO');
      expect(ctx.doubleTaxCountry).toBe('ANY');
    });

  });

  describe('pruneEmpty', () => {

    it('elimina null, undefined y strings vacíos', () => {
      const input = {
        a: '',
        b: null,
        c: undefined,
        d: 'ok'
      };

      const result = pruneEmpty(input) as Record<string, any>;

      expect(result).toEqual(jasmine.objectContaining({ d: 'ok' }));
      expect('a' in result).toBeFalse();
      expect('b' in result).toBeFalse();
      expect('c' in result).toBeFalse();
    });

    it('procesa objetos anidados', () => {
      const input = {
        a: {
          b: '',
          c: 'ok'
        }
      };

      const result = pruneEmpty(input) as Record<string, any>;

      expect(result['a']).toEqual(jasmine.objectContaining({ c: 'ok' }));
      expect('b' in result['a']).toBeFalse();
    });

    it('procesa arrays', () => {
      const input = {
        arr: [
          { a: '', b: 'ok' },
          { c: '' }
        ]
      };

      const result = pruneEmpty(input) as Record<string, any>;

      expect(result['arr'][0]).toEqual(jasmine.objectContaining({ b: 'ok' }));
      expect('a' in result['arr'][0]).toBeFalse();
      expect(result['arr'][1]).toEqual({});
    });

  });

  describe('buildCleanPayload', () => {

    it('elimina campos para CONSTANCIA', () => {
      const payload = buildCleanPayload({
        proofOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
        certificationDate: 'x',
        declarationYear: 'y'
      });

      expect(payload.certificationDate).toBeUndefined();
      expect(payload.declarationYear).toBeUndefined();
    });

    it('elimina campos para ID FISCAL', () => {
      const payload = buildCleanPayload({
        proofOfAddressType: 'ID FISCAL EXTRANJERO',
        issueDate: 'x',
        expirationStatus: 'y',
        expirationDate: 'z'
      });

      expect(payload.issueDate).toBeUndefined();
      expect(payload.expirationStatus).toBeUndefined();
      expect(payload.expirationDate).toBeUndefined();
    });

    it('no elimina si no coincide', () => {
      const payload = buildCleanPayload({
        proofOfAddressType: 'otro',
        a: 1
      });

      expect(payload.a).toBe(1);
    });

  });

  describe('omit', () => {

    it('elimina propiedades', () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = omit(obj, ['b', 'c']);

      expect(result).toEqual({ a: 1 });
    });

  });

  describe('stripTempIdDeep', () => {

    it('elimina tempId de objeto', () => {
      const input = { tempId: '1', name: 'A' };

      const result = stripTempIdDeep(input) as Record<string, any>;

      expect(result).toEqual(jasmine.objectContaining({ name: 'A' }));
      expect('tempId' in result).toBeFalse();
    });

    it('elimina tempId en objetos anidados', () => {
      const input = {
        a: {
          tempId: '1',
          b: { tempId: '2', c: 1 }
        }
      };

      const result = stripTempIdDeep(input) as Record<string, any>;

      expect(result['a']['b']['c']).toBe(1);
      expect(result['a']['tempId']).toBeUndefined();
      expect(result['a']['b']['tempId']).toBeUndefined();
    });

    it('elimina tempId en arrays', () => {
      const input = [
        { tempId: '1', a: 1 },
        { tempId: '2', b: 2 }
      ];

      const result = stripTempIdDeep(input) as any[];

      expect(result[0].a).toBe(1);
      expect(result[1].b).toBe(2);

      expect(result[0].tempId).toBeUndefined();
      expect(result[1].tempId).toBeUndefined();
    });

  });

});