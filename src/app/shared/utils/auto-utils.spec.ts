import {
  buildCleanPayload,
  buildContext,
  normalizeCountry,
  omit,
  pruneEmpty,
  stripTempIdDeep,
} from './auto-utils';

describe('auto-utils', () => {
  describe('normalizeCountry', () => {
    it('debe regresar OTRO cuando no recibe valor', () => {
      expect(normalizeCountry(undefined)).toBe('OTRO');
      expect(normalizeCountry('')).toBe('OTRO');
      expect(normalizeCountry('   ')).toBe('OTRO');
    });

    it('debe normalizar MX y etiquetas equivalentes', () => {
      expect(normalizeCountry('mx')).toBe('MX');
      expect(normalizeCountry('Mexico')).toBe('MX');
      expect(normalizeCountry('MEXICO')).toBe('MX');
    });

    it('debe normalizar US y etiquetas equivalentes', () => {
      expect(normalizeCountry('us')).toBe('US');
      expect(normalizeCountry('USA')).toBe('US');
      expect(normalizeCountry('EEUU')).toBe('US');
      expect(normalizeCountry('Estados Unidos')).toBe('US');
      expect(normalizeCountry('United States')).toBe('US');
    });

    it('debe regresar ANY para etiquetas de cualquiera o ANY', () => {
      expect(normalizeCountry('CUALQUIERA')).toBe('ANY');
      expect(normalizeCountry('any')).toBe('ANY');
    });

    it('debe regresar OTRO para etiquetas de otro o diferente', () => {
      expect(normalizeCountry('OTRO')).toBe('OTRO');
      expect(normalizeCountry('DIFERENTE A MX')).toBe('OTRO');
    });

    it('debe mantener el valor - como caso especial', () => {
      expect(normalizeCountry('-')).toBe('-');
    });
  });

  describe('buildContext', () => {
    it('debe construir el contexto con normalizacion de paises', () => {
      const context = buildContext({
        countryId: 'mx',
        nationality: 'usa',
        taxCountry: 'diferente',
        doubleTaxCountry: 'cualquiera',
      } as any);

      expect(context).toEqual({
        countryId: 'MX',
        nationality: 'US',
        taxCountry: 'OTRO',
        doubleTaxCountry: 'ANY',
      });
    });

    it('debe aplicar defaults OTRO cuando faltan campos', () => {
      const context = buildContext({} as any);

      expect(context).toEqual({
        countryId: 'OTRO',
        nationality: 'OTRO',
        taxCountry: 'OTRO',
        doubleTaxCountry: 'OTRO',
      });
    });
  });

  describe('pruneEmpty', () => {
    it('debe eliminar null, undefined y strings vacios', () => {
      const input = {
        a: null,
        b: undefined,
        c: '',
        d: '   ',
        e: 'ok',
        f: 0,
        g: false,
      };

      expect(pruneEmpty(input) as any).toEqual({
        e: 'ok',
        f: 0,
        g: false,
      });
    });

    it('debe limpiar objetos y arreglos anidados recursivamente', () => {
      const input: any = {
        user: {
          name: 'Ana',
          middleName: ' ',
          meta: {
            note: '',
            age: 30,
          },
        },
        items: [
          { id: 1, label: 'A', extra: '' },
          { id: 2, label: ' ', child: { code: 'X', empty: undefined } },
        ],
      };

      expect(pruneEmpty(input) as any).toEqual({
        user: {
          name: 'Ana',
          meta: {
            age: 30,
          },
        },
        items: [
          { id: 1, label: 'A' },
          { id: 2, child: { code: 'X' } },
        ],
      });
    });
  });

  describe('buildCleanPayload', () => {
    it('debe eliminar certificationDate y declarationYear para constancia fiscal', () => {
      const raw = {
        proofOfAddressType: 'constancia de residencia fiscal',
        certificationDate: '2026-01-01',
        declarationYear: '2025',
        issueDate: '2026-02-01',
      };

      const result = buildCleanPayload(raw);

      expect(result).toEqual({
        proofOfAddressType: 'constancia de residencia fiscal',
        issueDate: '2026-02-01',
      });
    });

    it('debe eliminar issueDate, expirationStatus y expirationDate para id fiscal extranjero', () => {
      const raw = {
        proofOfAddressType: 'XX01',
        issueDate: '2026-02-01',
        expirationStatus: 'VIGENTE',
        expirationDate: '2030-01-01',
        declarationYear: '2025',
      };

      const result = buildCleanPayload(raw);

      expect(result).toEqual({
        proofOfAddressType: 'XX01',
        declarationYear: '2025',
      });
    });

    it('no debe modificar campos si proofOfAddressType no coincide', () => {
      const raw = {
        proofOfAddressType: 'OTRO',
        issueDate: '2026-02-01',
        certificationDate: '2026-01-01',
      };

      const result = buildCleanPayload(raw);

      expect(result).toEqual(raw);
    });
  });

  describe('omit', () => {
    it('debe omitir las llaves indicadas', () => {
      const input = { a: 1, b: 2, c: 3 };

      expect(omit(input, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('debe regresar copia completa si no hay llaves para omitir', () => {
      const input = { a: 1, b: 2 };

      expect(omit(input, [])).toEqual({ a: 1, b: 2 });
    });
  });

  describe('stripTempIdDeep', () => {
    it('debe remover tempId en objetos de forma recursiva', () => {
      const input = {
        tempId: 'root',
        name: 'root',
        nested: {
          tempId: 'child',
          value: 10,
        },
      };

      expect(stripTempIdDeep(input) as any).toEqual({
        name: 'root',
        nested: {
          value: 10,
        },
      });
    });

    it('debe remover tempId dentro de arreglos anidados', () => {
      const input = [
        { tempId: '1', name: 'A' },
        {
          tempId: '2',
          nested: [{ tempId: '3', code: 'X' }],
        },
      ];

      expect(stripTempIdDeep(input) as any).toEqual([
        { name: 'A' },
        {
          nested: [{ code: 'X' }],
        },
      ]);
    });

    it('debe retornar primitivos sin cambios', () => {
      expect(stripTempIdDeep('abc')).toBe('abc');
      expect(stripTempIdDeep(123)).toBe(123);
      expect(stripTempIdDeep(false)).toBeFalse();
      expect(stripTempIdDeep(null)).toBeNull();
    });
  });
});
