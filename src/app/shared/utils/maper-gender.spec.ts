import { AllowedFullTextGenders, AllowedGenders, AllowedValuesGenders, compareAndReturnGender, compareGenderAndReturnValue, compareGenderFullText } from "./maper-gender";

describe('Gender utilities', () => {

  // ---------------------------------------------------------
  // compareAndReturnGender
  // ---------------------------------------------------------
  describe('compareAndReturnGender', () => {

    it('should return correct numeric value for H, M, X (uppercase)', () => {
      expect(compareAndReturnGender('H')).toBe(AllowedValuesGenders.H);
      expect(compareAndReturnGender('M')).toBe(AllowedValuesGenders.M);
      expect(compareAndReturnGender('X')).toBe(AllowedValuesGenders.X);
    });

    it('should return correct numeric value for lowercase values', () => {
      expect(compareAndReturnGender('h')).toBe(AllowedValuesGenders.H);
      expect(compareAndReturnGender('m')).toBe(AllowedValuesGenders.M);
      expect(compareAndReturnGender('x')).toBe(AllowedValuesGenders.X);
    });

    it('should return 0 for invalid values', () => {
      expect(compareAndReturnGender('Z')).toBe(0);
      expect(compareAndReturnGender('')).toBe(0);
      expect(compareAndReturnGender('123')).toBe(0);
    });
  });

  // ---------------------------------------------------------
  // compareGenderAndReturnValue
  // ---------------------------------------------------------
  describe('compareGenderAndReturnValue', () => {

    it('should return correct gender letter for numeric codes', () => {
      expect(compareGenderAndReturnValue(2)).toBe(AllowedGenders.H);
      expect(compareGenderAndReturnValue(1)).toBe(AllowedGenders.M);
      expect(compareGenderAndReturnValue(3)).toBe(AllowedGenders.X);
    });

    it('should return empty string for invalid numeric values', () => {
      expect(compareGenderAndReturnValue(0)).toBe('');
      expect(compareGenderAndReturnValue(99)).toBe('');
      expect(compareGenderAndReturnValue(-1)).toBe('');
    });
  });

  // ---------------------------------------------------------
  // compareGenderFullText
  // ---------------------------------------------------------
  describe('compareGenderFullText', () => {

    it('should return correct full text for gender codes', () => {
      expect(compareGenderFullText('2')).toBe(AllowedFullTextGenders.H);
      expect(compareGenderFullText('1')).toBe(AllowedFullTextGenders.M);
      expect(compareGenderFullText('3')).toBe(AllowedFullTextGenders.X);
    });

    it('should return empty string for invalid values', () => {
      expect(compareGenderFullText('0')).toBe('');
      expect(compareGenderFullText('999')).toBe('');
      expect(compareGenderFullText('A')).toBe('');
      expect(compareGenderFullText('')).toBe('');
    });

  });

});
``
