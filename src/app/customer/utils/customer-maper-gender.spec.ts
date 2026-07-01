import {
  compareAndReturnGender,
  compareGenderAndReturnValue,
  compareGenderFullText
} from './customer-maper-gender';

describe('Gender Utils', () => {

  describe('compareAndReturnGender', () => {

    it('H', () => {
      expect(compareAndReturnGender('H')).toBe(2);
    });

    it('M', () => {
      expect(compareAndReturnGender('M')).toBe(1);
    });

    it('X', () => {
      expect(compareAndReturnGender('X')).toBe(3);
    });

    it('lowercase', () => {
      expect(compareAndReturnGender('h')).toBe(2);
    });

    it('default', () => {
      expect(compareAndReturnGender('Z')).toBe(0);
    });

  });

  describe('compareGenderAndReturnValue', () => {

    it('2 -> H', () => {
      expect(compareGenderAndReturnValue(2)).toBe('H');
    });

    it('1 -> M', () => {
      expect(compareGenderAndReturnValue(1)).toBe('M');
    });

    it('3 -> X', () => {
      expect(compareGenderAndReturnValue(3)).toBe('X');
    });

    it('default', () => {
      expect(compareGenderAndReturnValue(99)).toBe('');
    });

  });

  describe('compareGenderFullText', () => {

    it('2 -> Masculino', () => {
      expect(compareGenderFullText('2')).toBe('Masculino');
    });

    it('1 -> Femenino', () => {
      expect(compareGenderFullText('1')).toBe('Femenino');
    });

    it('3 -> No Binario', () => {
      expect(compareGenderFullText('3')).toBe('No Binario');
    });

    it('default', () => {
      expect(compareGenderFullText('0')).toBe('');
    });

  });

});