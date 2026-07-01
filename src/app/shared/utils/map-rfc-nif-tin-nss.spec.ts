
import {
  AllowedValuesRfcNifTinNss,
  compareAndReturnRfcNifTinNss,
  compareAndReturnIdRfcNifTinNss,
  compareAndReturnValueRfcNifTinNss,
  rfcNifTinNssValueByType
} from "./map-rfc-nif-tin-nss";

describe('RFC/NIF/TIN/NSS utilities', () => {

  // --------------------------------------------------------------------
  // compareAndReturnRfcNifTinNss
  // --------------------------------------------------------------------
  describe('compareAndReturnRfcNifTinNss', () => {

    it('should return returnValue when enums match', () => {
      const result = compareAndReturnRfcNifTinNss(
        'MATCHED',
        AllowedValuesRfcNifTinNss.RFC,
        AllowedValuesRfcNifTinNss.RFC
      );
      expect(result).toBe('MATCHED');
    });

    it('should return empty string when enums do not match', () => {
      const result = compareAndReturnRfcNifTinNss(
        'NO MATCH',
        AllowedValuesRfcNifTinNss.RFC,
        AllowedValuesRfcNifTinNss.NIF
      );
      expect(result).toBe('');
    });

  });

  // --------------------------------------------------------------------
  // compareAndReturnIdRfcNifTinNss
  // --------------------------------------------------------------------
  describe('compareAndReturnIdRfcNifTinNss', () => {

    it('should return RFC when rfc has value', () => {
      const result = compareAndReturnIdRfcNifTinNss('ABC', '', '', '');
      expect(result).toBe(AllowedValuesRfcNifTinNss.RFC);
    });

    it('should return NIF when rfc empty and nif has value', () => {
      const result = compareAndReturnIdRfcNifTinNss('', 'NIFVAL', '', '');
      expect(result).toBe(AllowedValuesRfcNifTinNss.NIF);
    });

    it('should return TIN when rfc/nif empty and tin has value', () => {
      const result = compareAndReturnIdRfcNifTinNss('', '', 'TINVAL', '');
      expect(result).toBe(AllowedValuesRfcNifTinNss.TIN);
    });

    it('should return SSN when only nss has value', () => {
      const result = compareAndReturnIdRfcNifTinNss('', '', '', 'NSSVAL');
      expect(result).toBe(AllowedValuesRfcNifTinNss.SSN);
    });

    it('should return empty string when all params are empty', () => {
      const result = compareAndReturnIdRfcNifTinNss('', '', '', '');
      expect(result).toBe('');
    });

  });

  // --------------------------------------------------------------------
  // compareAndReturnValueRfcNifTinNss
  // --------------------------------------------------------------------
  describe('compareAndReturnValueRfcNifTinNss', () => {

    it('should return rfc value when rfc is not empty', () => {
      const result = compareAndReturnValueRfcNifTinNss('RFC123', '', '', '');
      expect(result).toBe('RFC123');
    });

    it('should return nif value when rfc empty but nif present', () => {
      const result = compareAndReturnValueRfcNifTinNss('', 'NIF123', '', '');
      expect(result).toBe('NIF123');
    });

    it('should return tin value when only tin present', () => {
      const result = compareAndReturnValueRfcNifTinNss('', '', 'TIN123', '');
      expect(result).toBe('TIN123');
    });

    it('should return nss value when only nss present', () => {
      const result = compareAndReturnValueRfcNifTinNss('', '', '', 'NSS123');
      expect(result).toBe('NSS123');
    });

    it('should return empty string when all fields are empty', () => {
      const result = compareAndReturnValueRfcNifTinNss('', '', '', '');
      expect(result).toBe('');
    });

  });

  describe('rfcNifTinNssValueByType', () => {

    it('should return rfc value when rfc is not empty', () => {
      const result = rfcNifTinNssValueByType('RFC', '1', 'ABC');
      expect(result).toBe('ABC');
    });

    it('should return empty value', () => {
      const result = rfcNifTinNssValueByType('RFC', '2', 'ABC');
      expect(result).toBe('');
    });

    // it('should return nif value when rfc empty but nif present', () => {
    //   const result = compareAndReturnValueRfcNifTinNss('', 'NIF123', '', '');
    //   expect(result).toBe('NIF123');
    // });

    // it('should return tin value when only tin present', () => {
    //   const result = compareAndReturnValueRfcNifTinNss('', '', 'TIN123', '');
    //   expect(result).toBe('TIN123');
    // });

    // it('should return nss value when only nss present', () => {
    //   const result = compareAndReturnValueRfcNifTinNss('', '', '', 'NSS123');
    //   expect(result).toBe('NSS123');
    // });

    // it('should return empty string when all fields are empty', () => {
    //   const result = compareAndReturnValueRfcNifTinNss('', '', '', '');
    //   expect(result).toBe('');
    // });

  });

});
``
