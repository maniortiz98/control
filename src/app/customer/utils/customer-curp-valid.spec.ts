import { validCurp, countSpaces } from './customer-curp-valid';

describe('String Utils', () => {

  describe('validCurp', () => {

    it('válido cuando longitud 18 y extCurp false', () => {
      const input = 'A'.repeat(18);
      expect(validCurp(input, false)).toBeTrue();
    });

    it('inválido cuando longitud 18 y extCurp true', () => {
      const input = 'A'.repeat(18);
      expect(validCurp(input, true)).toBeFalse();
    });

    it('válido cuando vacío y extCurp true', () => {
      expect(validCurp('', true)).toBeTrue();
    });

    it('inválido cuando vacío y extCurp false', () => {
      expect(validCurp('', false)).toBeFalse();
    });

    it('inválido cuando longitud distinta de 18', () => {
      expect(validCurp('ABC', false)).toBeFalse();
    });

  });

  describe('countSpaces', () => {

    it('sin espacios retorna 1', () => {
      expect(countSpaces('abc')).toBe(1);
    });

    it('un espacio retorna 2', () => {
      expect(countSpaces('a b')).toBe(2);
    });

    it('dos o más espacios retorna 3', () => {
      expect(countSpaces('a b c')).toBe(3);
      expect(countSpaces('a b c d')).toBe(3);
    });

  });

});