import {
  compareAndReturnRfcNifTinNss,
  compareAndReturnIdRfcNifTinNss,
  compareAndReturnValueRfcNifTinNss,
  rfcNifTinNssValueByType,
  CustomerAllowedValuesRfcNifTinNss
} from './customer-map-rfc-nif-tin-nss';

describe('RFC/NIF/TIN/NSS Utils', () => {

  describe('compareAndReturnRfcNifTinNss', () => {
    it('retorna valor si coincide', () => {
      const result = compareAndReturnRfcNifTinNss(
        'VALUE',
        CustomerAllowedValuesRfcNifTinNss.RFC,
        '1'
      );
      expect(result).toBe('VALUE');
    });

    it('retorna vacío si no coincide', () => {
      const result = compareAndReturnRfcNifTinNss(
        'VALUE',
        CustomerAllowedValuesRfcNifTinNss.RFC,
        '2'
      );
      expect(result).toBe('');
    });
  });

  describe('compareAndReturnIdRfcNifTinNss', () => {

    it('prioriza RFC', () => {
      const result = compareAndReturnIdRfcNifTinNss('ABC', 'X', 'Y', 'Z');
      expect(result).toBe(CustomerAllowedValuesRfcNifTinNss.RFC);
    });

    it('usa NIF si RFC vacío', () => {
      const result = compareAndReturnIdRfcNifTinNss('', 'NIF', 'TIN', 'SSN');
      expect(result).toBe(CustomerAllowedValuesRfcNifTinNss.NIF);
    });

    it('usa TIN si RFC y NIF vacíos', () => {
      const result = compareAndReturnIdRfcNifTinNss('', '', 'TIN', 'SSN');
      expect(result).toBe(CustomerAllowedValuesRfcNifTinNss.TIN);
    });

    it('usa NSS si solo ese tiene valor', () => {
      const result = compareAndReturnIdRfcNifTinNss('', '', '', 'SSN');
      expect(result).toBe(CustomerAllowedValuesRfcNifTinNss.SSN);
    });

    it('retorna vacío si todos están vacíos', () => {
      const result = compareAndReturnIdRfcNifTinNss('', '', '', '');
      expect(result).toBe('');
    });

  });

  describe('compareAndReturnValueRfcNifTinNss', () => {

    it('retorna RFC si existe', () => {
      expect(
        compareAndReturnValueRfcNifTinNss('RFC', 'NIF', 'TIN', 'SSN')
      ).toBe('RFC');
    });

    it('retorna NIF si RFC vacío', () => {
      expect(
        compareAndReturnValueRfcNifTinNss('', 'NIF', 'TIN', 'SSN')
      ).toBe('NIF');
    });

    it('retorna TIN si anteriores vacíos', () => {
      expect(
        compareAndReturnValueRfcNifTinNss('', '', 'TIN', 'SSN')
      ).toBe('TIN');
    });

    it('retorna NSS si es el único', () => {
      expect(
        compareAndReturnValueRfcNifTinNss('', '', '', 'SSN')
      ).toBe('SSN');
    });

    it('retorna vacío si todos vacíos', () => {
      expect(
        compareAndReturnValueRfcNifTinNss('', '', '', '')
      ).toBe('');
    });

  });

  describe('rfcNifTinNssValueByType', () => {

    it('retorna valor si coincide tipo', () => {
      const result = rfcNifTinNssValueByType(
        'RFC',
        '1',
        'ABC123'
      );
      expect(result).toBe('ABC123');
    });

    it('retorna vacío si no coincide', () => {
      const result = rfcNifTinNssValueByType(
        'RFC',
        '2',
        'ABC123'
      );
      expect(result).toBe('');
    });

  });

});