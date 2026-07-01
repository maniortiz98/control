import { validateRFCMonth, validateRFCDay } from './customer-rfc-valid';

describe('RFC Validators', () => {

  describe('validateRFCMonth', () => {

    it('mes válido', () => {
      expect(validateRFCMonth('XXXXXX01XX')) .toBeTrue();
      expect(validateRFCMonth('XXXXXX12XX')) .toBeTrue();
    });

    it('mes inválido', () => {
      expect(validateRFCMonth('XXXXXX00XX')).toBeFalse();
      expect(validateRFCMonth('XXXXXX13XX')).toBeFalse();
    });

    it('formato incorrecto', () => {
      expect(validateRFCMonth('XXXXXXAAXX')).toBeFalse();
    });

  });

  describe('validateRFCDay', () => {

    it('día válido en mes válido', () => {
      expect(validateRFCDay('XXXXXX0101')).toBeTrue();
      expect(validateRFCDay('XXXXXX1231')).toBeTrue();
    });

    it('día inválido por formato', () => {
      expect(validateRFCDay('XXXXXX0100')).toBeFalse();
      expect(validateRFCDay('XXXXXX0132')).toBeFalse();
      expect(validateRFCDay('XXXXXX01AA')).toBeFalse();
    });

    it('día excede días del mes', () => {
      expect(validateRFCDay('XXXXXX0431')).toBeFalse(); 
      expect(validateRFCDay('XXXXXX0230')).toBeFalse(); 
    });

    it('día válido dentro del límite del mes', () => {
      expect(validateRFCDay('XXXXXX0430')).toBeTrue(); 
      expect(validateRFCDay('XXXXXX0228')).toBeTrue(); 
    });

  });

});