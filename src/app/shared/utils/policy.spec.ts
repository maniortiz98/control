import { computePolicy, norm } from './policy';

describe('policy utils', () => {
  describe('norm', () => {
    it('normaliza variantes de MX', () => {
      expect(norm('MX')).toBe('MX');
      expect(norm('mexico')).toBe('MX');
      expect(norm(' MÉXICO ')).toBe('MX');
    });

    it('normaliza variantes de US', () => {
      expect(norm('US')).toBe('US');
      expect(norm('usa')).toBe('US');
      expect(norm('EEUU')).toBe('US');
      expect(norm('Estados Unidos')).toBe('US');
      expect(norm('United States')).toBe('US');
    });

    it('regresa OTRO para valores no mapeados', () => {
      expect(norm('CA')).toBe('OTRO');
      expect(norm('')).toBe('OTRO');
      expect(norm(undefined)).toBe('OTRO');
    });
  });

  describe('computePolicy - reglas globales', () => {
    it('cuando no hay filas activas deja CRS false y banderas fiscales false', () => {
      const res = computePolicy('MX', 'MX', []);

      expect(res.global).toEqual({
        fatca: false,
        crs: false,
        requireRFC: false,
        tributaMX: false,
        requireNIF: false,
      });
      expect(res.byRow).toEqual({});
    });

    it('si el unico pais fiscal activo es US entonces CRS es false', () => {
      const rows = [{ tempId: 'u1', country: 'US', active: true }];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.global.fatca).toBeTrue();
      expect(res.global.crs).toBeFalse();
      expect(res.global.requireRFC).toBeFalse();
      expect(res.global.tributaMX).toBeFalse();
      expect(res.global.requireNIF).toBeFalse();
    });

    it('activa RFC y tributaMX cuando hay residencia fiscal MX', () => {
      const rows = [{ tempId: 'm1', country: 'MEXICO', active: true }];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.global.tributaMX).toBeTrue();
      expect(res.global.requireRFC).toBeTrue();
      expect(res.global.crs).toBeTrue();
      expect(res.global.requireNIF).toBeFalse();
    });

    it('activa requireNIF global cuando existe residencia fiscal OTRO', () => {
      const rows = [{ tempId: 'o1', country: 'CA', active: true }];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.global.requireNIF).toBeTrue();
      expect(res.global.crs).toBeTrue();
    });

    it('ignora filas inactivas para el calculo global', () => {
      const rows = [
        { tempId: 'i1', country: 'US', active: false },
        { tempId: 'i2', country: 'MX', active: false },
      ];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.global).toEqual({
        fatca: false,
        crs: false,
        requireRFC: false,
        tributaMX: false,
        requireNIF: false,
      });
      expect(res.byRow).toEqual({});
    });
  });

  describe('computePolicy - reglas por fila', () => {
    it('fila US exige TIN/SSN y no habilita opcionals', () => {
      const rows = [{ tempId: 'u1', country: 'US', active: true }];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.byRow['u1']).toEqual({
        requireTinOrSsn: true,
        optionalTinOrSsn: false,
        enableFreeTextReason: false,
        enableLossCertificate: false,
        requireNIF: false,
      });
    });

    it('si no tributa US y nacio US habilita opcionals y certificado de perdida (si nacionalidad no US)', () => {
      const rows = [{ tempId: 'm1', country: 'MX', active: true }];

      const res = computePolicy('US', 'MX', rows);

      expect(res.byRow['m1']).toEqual({
        requireTinOrSsn: false,
        optionalTinOrSsn: true,
        enableFreeTextReason: true,
        enableLossCertificate: true,
        requireNIF: false,
      });
    });

    it('si nacionalidad es US y no tributa US habilita opcionals sin certificado de perdida', () => {
      const rows = [{ tempId: 'm2', country: 'MX', active: true }];

      const res = computePolicy('MX', 'US', rows);

      expect(res.byRow['m2']).toEqual({
        requireTinOrSsn: false,
        optionalTinOrSsn: true,
        enableFreeTextReason: true,
        enableLossCertificate: false,
        requireNIF: false,
      });
    });

    it('fila OTRO exige NIF por fila', () => {
      const rows = [{ tempId: 'o1', country: 'DE', active: true }];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.byRow['o1'].requireNIF).toBeTrue();
      expect(res.byRow['o1'].requireTinOrSsn).toBeFalse();
    });

    it('no agrega filas inactivas al resultado por fila', () => {
      const rows = [
        { tempId: 'a1', country: 'US', active: false },
        { tempId: 'a2', country: 'MX', active: true },
      ];

      const res = computePolicy('MX', 'MX', rows);

      expect(res.byRow['a1']).toBeUndefined();
      expect(res.byRow['a2']).toBeDefined();
    });
  });
});
