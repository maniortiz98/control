
import moment from 'moment';
import {
  formatDate,
  yearsAgo,
  toDate,
  yearsAgoLegacy,
  convertDate,
  convertDateBack,
  convertStringToDate,
  formatDateSimple,
  formatDateYYYYMMDD,
  convertDateToStr,
  convertDateTo
} from './datetime';

describe('date-utils', () => {
  // Fijamos la fecha "actual" para pruebas determinísticas
  // Usaremos 2025-02-15 10:20:30 UTC como fecha base.
  const FIXED_NOW = new Date('2025-02-15T10:20:30Z');

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(FIXED_NOW);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  // -------------------------------------------------------
  // formatDate
  // -------------------------------------------------------
  describe('formatDate', () => {
    it('should format a given Date as DD-MM-YYYY', () => {
      const d = new Date('2023-07-09T08:00:00Z'); // 09-07-2023
      const result = formatDate(d);
      expect(result).toBe('09-07-2023');
    });

    it('should default to "today" when no date is provided', () => {
      const result = formatDate();
      // FIXED_NOW = 2025-02-15
      expect(result).toBe('15-02-2025');
    });

    it('should pad single-digit day and month with zeros', () => {
      const d = new Date('2025-01-05T08:00:00Z'); // 05-01-2025
      const result = formatDate(d);
      expect(result).toBe('05-01-2025');
    });
  });

  // -------------------------------------------------------
  // yearsAgo 
  // -------------------------------------------------------
  describe('yearsAgo', () => {
    it('should return a Date instance', () => {
      const result = yearsAgo();
      expect(result instanceof Date).toBeTrue();
    });

    it('should return January 1st of the calculated year when firstDay is true (default)', () => {
      const result = yearsAgo();
      expect(result.getFullYear()).toBe(2007);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it('should preserve month and day when firstDay is false', () => {
      const result = yearsAgo(18, false);
      expect(result.getFullYear()).toBe(2007);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(15);
    });

    it('should respect a custom year offset', () => {
      const result = yearsAgo(5);
      expect(result.getFullYear()).toBe(2020);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });

  // -------------------------------------------------------
  // yearsAgoLegacy
  // -------------------------------------------------------
  describe('yearsAgoLegacy', () => {
    it('should return <year>-01-01 when firstDay is true (default)', () => {
      // now = 2025 -> 18 years ago = 2007
      const result = yearsAgoLegacy();
      expect(result).toBe('2007-01-01');
    });

    it('should return <year>-<month>-<day> when firstDay is false (using Date.getMonth() and getDate())', () => {
      // Atención: getMonth() es base 0 en JS.
      // FIXED_NOW = 2025-02-15 -> getMonth() = 1, getDate() = 15
      // 18 años atrás = 2007
      const result = yearsAgoLegacy(18, false);
      expect(result).toBe('2007-02-15'); // según la implementación (sin pad ni +1 al mes)
    });

    it('should respect custom years', () => {
      const result = yearsAgoLegacy(5, true);
      expect(result).toBe('2020-01-01');
    });
  });

  // -------------------------------------------------------
  // convertDate
  // -------------------------------------------------------
  describe('convertDate', () => {
    it('should accept string in DD/MM/YYYY and return formatted DD/MM/YYYY', () => {
      const result = convertDate('21/04/1998');
      expect(result).toBe('21/04/1998');
    });

    it('should accept string in YYYY-MM-DD and return formatted DD/MM/YYYY', () => {
      const result = convertDate('1998-04-21');
      expect(result).toBe('21/04/1998');
    });

    it('should return empty string for invalid string input', () => {
      const result = convertDate('1998/04/21'); // formato no esperado por el parseo estricto
      expect(result).toBe('');
    });

    it('should accept Date and return DD/MM/YYYY', () => {
      const date = new Date('1987-11-10T08:00:00Z');
      const result = convertDate(date);
      expect(result).toBe('10/11/1987');
    });

    it('should accept moment.Moment and return DD/MM/YYYY', () => {
      const m = moment('2001-01-02', 'YYYY-MM-DD', true);
      const result = convertDate(m);
      expect(result).toBe('02/01/2001');
    });

    it('should return empty string for unsupported input type', () => {
      const result = convertDate("12345");
      expect(result).toBe('');
    });
  });

  // -------------------------------------------------------
  // toDate
  // -------------------------------------------------------
  describe('toDate', () => {
    it('should return null for null or undefined input', () => {
      expect(toDate(null)).toBeNull();
      expect(toDate(undefined)).toBeNull();
    });

    it('should return Date for valid DD/MM/YYYY string', () => {
      const d = toDate('21/04/1998');
      expect(d instanceof Date).toBeTrue();
      expect(moment(d!).format('DD/MM/YYYY')).toBe('21/04/1998');
    });

    it('should return Date for valid YYYY-MM-DD string', () => {
      const d = toDate('1998-04-21');
      expect(d instanceof Date).toBeTrue();
      expect(moment(d!).format('DD/MM/YYYY')).toBe('21/04/1998');
    });

    it('should return null for invalid date string', () => {
      expect(toDate('40/01/2020')).toBeNull();
      expect(toDate('31/02/2020')).toBeNull();
      expect(toDate('not-a-date')).toBeNull();
    });

    it('should return same Date if input is Date', () => {
      const original = new Date('2020-01-02T00:00:00Z');
      const result = toDate(original);
      expect(result).toBe(original);
    });

    it('should convert valid moment to Date', () => {
      const m = moment('2020-01-02', 'YYYY-MM-DD', true);
      const result = toDate(m);
      expect(result instanceof Date).toBeTrue();
      expect(moment(result!).format('YYYY-MM-DD')).toBe('2020-01-02');
    });

    it('should return null for invalid moment', () => {
      const invalidMoment = moment('invalid', 'DD/MM/YYYY', true);
      expect(toDate(invalidMoment)).toBeNull();
    });
  });

  // -------------------------------------------------------
  // convertDateBack
  // -------------------------------------------------------
  describe('convertDateBack', () => {
    it('should convert a valid DD/MM/YYYY string to a moment object', () => {
      const result = convertDateBack('10/11/1987');
      expect(moment.isMoment(result)).toBeTrue();
      expect((result as moment.Moment).format('DD/MM/YYYY')).toBe('10/11/1987');
    });


    it('should handle invalid date string', () => {
      expect(convertDateBack('32/13/2020')).toBe('');
      expect(convertDateBack('2020-01-01')).toBe('');
      expect(convertDateBack('')).toBe('');
    });


  });

  // -------------------------------------------------------
  // convertStringToDate
  // -------------------------------------------------------
  describe('convertStringToDate', () => {
    it('should convert valid DD/MM/YYYY string to Date', () => {
      const d = convertStringToDate('21/04/1998');
      expect(d instanceof Date).toBeTrue();
      // formato esperado al formatear con moment
      expect(moment(d).format('DD/MM/YYYY')).toBe('21/04/1998');
    });

    it('should throw on invalid date', () => {
      expect(() => convertStringToDate('1998-04-21')).toThrowError('Fecha no válida. Debe estar en formato DD/MM/YYYY');
      expect(() => convertStringToDate('32/01/2020')).toThrowError('Fecha no válida. Debe estar en formato DD/MM/YYYY');
      expect(() => convertStringToDate('')).toThrowError('Fecha no válida. Debe estar en formato DD/MM/YYYY');
    });
  });

  // -------------------------------------------------------
  // formatDateSimple
  // -------------------------------------------------------
  describe('formatDateSimple', () => {
    it('should transform "YYYY-MM-DD" to "DD/MM/YYYY"', () => {
      expect(formatDateSimple('1998-04-21')).toBe('21/04/1998');
      expect(formatDateSimple('1987-11-10')).toBe('10/11/1987');
    });

    it('should not validate input, only rearrange parts', () => {
      expect(formatDateSimple('2020-99-40')).toBe('40/99/2020');
    });
  });

  // -------------------------------------------------------
  // formatDateYYYYMMDD
  // -------------------------------------------------------
  describe('formatDateYYYYMMDD', () => {
    it('should transform "DD/MM/YYYY" to "YYYY-MM-DD"', () => {
      expect(formatDateYYYYMMDD('21/04/1998')).toBe('1998-04-21');
      expect(formatDateYYYYMMDD('10/11/1987')).toBe('1987-11-10');
    });

    it('should not validate input, only rearrange parts', () => {
      expect(formatDateYYYYMMDD('40/99/2020')).toBe('2020-99-40');
    });
  });

  // -------------------------------------------------------
  // convertDateToStr
  // -------------------------------------------------------
  describe('convertDateToStr', () => {
    it('should return a non-empty string for valid Date input', () => {
      const date = new Date('2020-01-02T00:00:00Z');
      const result = convertDateToStr(date);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a non-empty string for valid moment input', () => {
      const m = moment('2020-01-02', 'YYYY-MM-DD', true);
      const result = convertDateToStr(m);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty string for invalid Moment/Date', () => {
      // Moment inválido
      const invalidMoment = moment('not-a-date', 'DD/MM/YYYY', true);
      const result = convertDateToStr(invalidMoment);
      expect(result).toBe('');
    });
  });

  // -------------------------------------------------------
  // convertDateTo
  // -------------------------------------------------------
  describe('convertDateTo', () => {
    it('should format to yyyy-mm-dd from Date', () => {
      const date = new Date('2020-01-02T12:34:56Z');
      const result = convertDateTo(date, 'yyyy-mm-dd');
      expect(result).toBe('2020-01-02');
    });

    it('should format to yyyy-mm-dd from moment', () => {
      const m = moment('1998-04-21', 'YYYY-MM-DD', true);
      const result = convertDateTo(m, 'yyyy-mm-dd');
      expect(result).toBe('1998-04-21');
    });

    it('should return empty string when format is dd/mm/yyyy (not implemented in code)', () => {
      const m = moment('1998-04-21', 'YYYY-MM-DD', true);
      const result = convertDateTo(m, 'dd/mm/yyyy');
      expect(result).toBe('');
    });

    it('should return empty string when moment is invalid', () => {
      const invalid = moment('not-a-date', 'YYYY-MM-DD', true);
      const result = convertDateTo(invalid, 'yyyy-mm-dd');
      expect(result).toBe('');
    });
  });
});
