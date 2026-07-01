import { computePolicy, norm } from './customer-policy';

describe('computePolicy', () => {

  const baseRow = (overrides?: any) => ({
    tempId: '1',
    country: 'MX',
    active: true,
    ...overrides
  });

  describe('norm', () => {

    it('normaliza MX', () => {
      expect(norm('mx')).toBe('MX');
      expect(norm('México')).toBe('MX');
      expect(norm('mexico')).toBe('MX');
    });

    it('normaliza US', () => {
      expect(norm('us')).toBe('US');
      expect(norm('USA')).toBe('US');
      expect(norm('Estados Unidos')).toBe('US');
    });

    it('default OTRO', () => {
      expect(norm('FR')).toBe('OTRO');
      expect(norm(undefined)).toBe('OTRO');
    });

  });

  it('FATCA true por nacimiento US', () => {
    const result = computePolicy('US', 'MX', []);
    expect(result.global.fatca).toBeTrue();
  });

  it('FATCA true por nacionalidad US', () => {
    const result = computePolicy('MX', 'US', []);
    expect(result.global.fatca).toBeTrue();
  });

  it('FATCA true por residencia US', () => {
    const rows = [baseRow({ country: 'US' })];
    const result = computePolicy('MX', 'MX', rows);

    expect(result.global.fatca).toBeTrue();
  });

  it('CRS false si solo hay US', () => {
    const rows = [baseRow({ country: 'US' })];
    const result = computePolicy('MX', 'MX', rows);

    expect(result.global.crs).toBeFalse();
  });

  it('CRS true si hay más de un país', () => {
    const rows = [
      baseRow({ country: 'US', tempId: '1' }),
      baseRow({ country: 'MX', tempId: '2' })
    ];

    const result = computePolicy('MX', 'MX', rows);

    expect(result.global.crs).toBeTrue();
  });

  it('RFC requerido si hay MX', () => {
    const rows = [baseRow({ country: 'MX' })];

    const result = computePolicy('MX', 'MX', rows);

    expect(result.global.requireRFC).toBeTrue();
    expect(result.global.tributaMX).toBeTrue();
  });

  it('NIF requerido si hay OTRO', () => {
    const rows = [baseRow({ country: 'FR' })];

    const result = computePolicy('MX', 'MX', rows);

    expect(result.global.requireNIF).toBeTrue();
  });

  it('por fila requireTinOrSsn en US', () => {
    const rows = [baseRow({ country: 'US', tempId: '1' })];

    const result = computePolicy('MX', 'MX', rows);

    expect(result.byRow['1'].requireTinOrSsn).toBeTrue();
  });

  it('optionalTinOrSsn cuando bornUS sin taxUS', () => {
    const rows = [baseRow({ country: 'MX', tempId: '1' })];

    const result = computePolicy('US', 'MX', rows);

    expect(result.byRow['1'].optionalTinOrSsn).toBeTrue();
  });

  it('enableFreeTextReason sigue optionalTinOrSsn', () => {
    const rows = [baseRow({ country: 'MX', tempId: '1' })];

    const result = computePolicy('US', 'MX', rows);

    expect(result.byRow['1'].enableFreeTextReason).toBeTrue();
  });

  it('enableLossCertificate cuando bornUS y no natUS ni taxUS', () => {
    const rows = [baseRow({ country: 'MX', tempId: '1' })];

    const result = computePolicy('US', 'MX', rows);

    expect(result.byRow['1'].enableLossCertificate).toBeTrue();
  });

  it('requireNIF por fila cuando OTRO', () => {
    const rows = [baseRow({ country: 'DE', tempId: '1' })];

    const result = computePolicy('MX', 'MX', rows);

    expect(result.byRow['1'].requireNIF).toBeTrue();
  });

  it('ignora filas inactivas', () => {
    const rows = [
      baseRow({ country: 'US', tempId: '1', active: false })
    ];

    const result = computePolicy('MX', 'MX', rows);

    expect(result.byRow['1']).toBeUndefined();
  });

  it('maneja múltiples filas correctamente', () => {
    const rows = [
      baseRow({ country: 'US', tempId: '1' }),
      baseRow({ country: 'MX', tempId: '2' }),
      baseRow({ country: 'FR', tempId: '3' })
    ];

    const result = computePolicy('US', 'MX', rows);

    expect(result.byRow['1'].requireTinOrSsn).toBeTrue();
    expect(result.byRow['2'].optionalTinOrSsn).toBeTrue();
    expect(result.byRow['3'].requireNIF).toBeTrue();
  });

});