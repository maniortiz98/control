import moment from 'moment';
import {
  formatDate,
  yearsAgo,
  yearsAgoLegacy,
  convertDate,
  convertDateBack,
  convertDateTwoDigitsToMomentForFiel,
  convertStringToDate,
  convertStringToDateOrEmpty,
  formatDateSimple,
  formatDateYYYYMMDD,
  convertDateToStr,
  convertDateTo,
  toDate,
  toIsoUtc
} from './customer-datetime';

describe('Date Utils', () => {

  describe('formatDate', () => {
    it('formatea fecha correctamente', () => {
      const date = new Date(2024, 0, 5);
      expect(formatDate(date)).toBe('05-01-2024');
    });
  });

  describe('yearsAgo', () => {
    it('calcula años atrás con primer día', () => {
      const result = yearsAgo(18, true);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it('calcula años atrás mismo día', () => {
      const result = yearsAgo(18, false);
      expect(result.getFullYear()).toBe(new Date().getFullYear() - 18);
    });
  });

  describe('yearsAgoLegacy', () => {
    it('primer día', () => {
      const result = yearsAgoLegacy(18, true);
      expect(result).toContain('-01-01');
    });

    it('misma fecha', () => {
      const result = yearsAgoLegacy(18, false);
      expect(result.length).toBe(10);
    });
  });

  describe('convertDate', () => {
    it('string válido', () => {
      expect(convertDate('2024-01-01')).toBe('01/01/2024');
    });

    it('Date', () => {
      expect(convertDate(new Date(2024, 0, 1))).toBe('01/01/2024');
    });

    it('moment', () => {
      expect(convertDate(moment('2024-01-01'))).toBe('01/01/2024');
    });

    it('string inválido', () => {
      expect(convertDate('xxx')).toBe('');
    });
  });

  describe('convertDateBack', () => {
    it('string válido', () => {
      const result = convertDateBack('01/01/2024');
      expect(moment.isMoment(result)).toBeTrue();
    });

    it('moment válido', () => {
      const m = moment();
      expect(convertDateBack(m)).toBe(m);
    });

    it('Date válido', () => {
      const d = new Date();
      expect(convertDateBack(d)).toBe(d);
    });

    it('entrada inválida', () => {
      expect(convertDateBack('xxx')).toBe('');
    });
  });

  describe('convertDateTwoDigitsToMomentForFiel', () => {
    it('convierte correctamente', () => {
      const result = convertDateTwoDigitsToMomentForFiel('01/01/24');
      expect(moment.isMoment(result)).toBeTrue();
      if (moment.isMoment(result)) {
        expect(result.year()).toBe(2024);
      }
    });

    it('inválido', () => {
      expect(convertDateTwoDigitsToMomentForFiel('xxx')).toBe('');
    });
  });

  describe('convertStringToDate', () => {
    it('válido', () => {
      const result = convertStringToDate('01/01/2024');
      expect(result instanceof Date).toBeTrue();
    });

    it('inválido', () => {
      expect(() => convertStringToDate('xxx')).toThrow();
    });
  });

  describe('convertStringToDateOrEmpty', () => {
    it('válido', () => {
      expect(convertStringToDateOrEmpty('01/01/2024') instanceof Date).toBeTrue();
    });

    it('inválido', () => {
      expect(convertStringToDateOrEmpty('xxx')).toBeUndefined();
    });
  });

  describe('formatDateSimple', () => {
    it('ya válido', () => {
      expect(formatDateSimple('01/01/2024')).toBe('01/01/2024');
    });

    it('convierte yyyy-mm-dd', () => {
      expect(formatDateSimple('2024-01-01')).toBe('01/01/2024');
    });
  });

  describe('formatDateYYYYMMDD', () => {
    it('convierte correctamente', () => {
      expect(formatDateYYYYMMDD('01/02/2024')).toBe('2024-02-01');
    });
  });

  describe('convertDateToStr', () => {
    it('válido', () => {
      const result = convertDateToStr(new Date());
      expect(typeof result).toBe('string');
    });
  });

  describe('convertDateTo', () => {
    it('formato yyyy-mm-dd', () => {
      const result = convertDateTo(new Date(), 'yyyy-mm-dd');
      expect(result.length).toBe(10);
    });

    it('formato no soportado', () => {
      const result = convertDateTo(new Date(), 'dd/mm/yyyy');
      expect(result).toBe('');
    });
  });

  describe('toDate', () => {
    it('string válido', () => {
      expect(toDate('01/01/2024') instanceof Date).toBeTrue();
    });

    it('moment válido', () => {
      const m = moment();
      expect(toDate(m) instanceof Date).toBeTrue();
    });

    it('Date válido', () => {
      const d = new Date();
      expect(toDate(d)).toBe(d);
    });

    it('inválido', () => {
      expect(toDate('xxx')).toBeNull();
    });
  });

  describe('toIsoUtc', () => {
    it('string DD/MM/YYYY', () => {
      const result = toIsoUtc('01/01/2024');
      expect(result).toContain('2024-01-01');
    });

    it('string YYYY-MM-DD', () => {
      const result = toIsoUtc('2024-01-01');
      expect(result).toContain('2024-01-01');
    });

    it('Date', () => {
      const result = toIsoUtc(new Date(2024, 0, 1));
      expect(result).toContain('2024-01-01');
    });

    it('moment', () => {
      const result = toIsoUtc(moment('2024-01-01'));
      expect(result).toContain('2024-01-01');
    });

    it('string inválido', () => {
      expect(() => toIsoUtc('abc')).toThrow();
    });
  });

});