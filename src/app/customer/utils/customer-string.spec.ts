import { StrTempId, getInitials, concatFullName } from './customer-string';

describe('Utils', () => {

  describe('StrTempId', () => {

    it('debe retornar string no vacío', () => {
      const result = StrTempId();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('debe generar valores únicos', () => {
      const a = StrTempId();
      const b = StrTempId();
      expect(a).not.toEqual(b);
    });

  });

  describe('getInitials', () => {

    it('retorna vacío si no hay nombre', () => {
      expect(getInitials('')).toBe('');
    });

    it('retorna una inicial', () => {
      expect(getInitials('juan')).toBe('J');
    });

    it('retorna dos iniciales', () => {
      expect(getInitials('juan perez')).toBe('JP');
    });

    it('ignora espacios extra', () => {
      expect(getInitials('   juan    perez   ')).toBe('JP');
    });

    it('solo toma dos palabras', () => {
      expect(getInitials('juan carlos perez lopez')).toBe('JC');
    });

  });

  describe('concatFullName', () => {

    it('concatena todos los nombres', () => {
      const result = concatFullName('Juan', 'Carlos', 'Perez', 'Lopez');
      expect(result).toBe('Juan Carlos Perez Lopez');
    });

    it('omite valores vacíos', () => {
      const result = concatFullName('Juan', '', 'Perez', '');
      expect(result).toBe('Juan Perez');
    });

    it('maneja undefined', () => {
      const result = concatFullName('Juan', undefined, 'Perez', undefined);
      expect(result).toBe('Juan Perez');
    });

    it('retorna string limpio sin espacios extras', () => {
      const result = concatFullName('', 'Carlos', '', 'Lopez');
      expect(result).toBe('Carlos Lopez');
    });

    it('retorna cadena vacía si no hay datos', () => {
      const result = concatFullName();
      expect(result).toBe('');
    });

  });

});