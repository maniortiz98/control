import { countSpaces, validCurp } from "./curp-valid";

describe('validCurp', () => {

  it('debe retornar true si input tiene 18 caracteres y extCurp es false', () => {
    expect(validCurp('ABCDEFGHIJKLMNOPQR', false)).toBeTrue();
  });

  it('debe retornar false si input tiene 18 caracteres y extCurp es true', () => {
    expect(validCurp('ABCDEFGHIJKLMNOPQR', true)).toBeFalse();
  });

  it('debe retornar true si input está vacío y extCurp es true', () => {
    expect(validCurp('', true)).toBeTrue();
  });

  it('debe retornar false si input está vacío y extCurp es false', () => {
    expect(validCurp('', false)).toBeFalse();
  });

  it('debe retornar false si input tiene menos de 18 caracteres', () => {
    expect(validCurp('ABC', false)).toBeFalse();
    expect(validCurp('ABC', true)).toBeFalse();
  });

  it('debe retornar false si input tiene más de 18 caracteres', () => {
    expect(validCurp('ABCDEFGHIJKLMNOPQRST', false)).toBeFalse();
    expect(validCurp('ABCDEFGHIJKLMNOPQRST', true)).toBeFalse();
  });
});

describe('countSpaces', () => {
  it('should return 1 for no spaces', () => {
    expect(countSpaces('MANUEL')).toBe(1);
  });

  it('should return 2 for one space', () => {
    expect(countSpaces('MANUEL JOSE')).toBe(2);
  });

  it('should return 3 for two or more spaces', () => {
    expect(countSpaces('MANUEL JOSE FERNANDO')).toBe(3);
    expect(countSpaces('MANUEL JOSE FERNANDO ALBERTO')).toBe(3);
  });
});