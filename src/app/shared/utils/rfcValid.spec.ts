import { validateRFCDay, validateRFCMonth } from "./rfcValid";


describe('validateRFCMonth', () => {

  it('should return true for valid months (01–12)', () => {
    expect(validateRFCMonth('XXXXXX01XXXX')).toBeTrue();
    expect(validateRFCMonth('XXXXXX05XXXX')).toBeTrue();
    expect(validateRFCMonth('XXXXXX12XXXX')).toBeTrue();
  });

  it('should return false for invalid months', () => {
    expect(validateRFCMonth('XXXXXX00XXXX')).toBeFalse();
    expect(validateRFCMonth('XXXXXX13XXXX')).toBeFalse();
    expect(validateRFCMonth('XXXXXX99XXXX')).toBeFalse();
    expect(validateRFCMonth('XXXXXXAAXXXX')).toBeFalse();
  });

  it('should return false when month part is too short', () => {
    expect(validateRFCMonth('12345')).toBeFalse();
  });

});

describe('validateRFCDay', () => {

  it('should return true for valid days (01–31)', () => {
    expect(validateRFCDay('XXXXXX0101XX')).toBeTrue(); // Jan 1
    expect(validateRFCDay('XXXXXX0131XX')).toBeTrue(); // Jan 31
    expect(validateRFCDay('XXXXXX1231XX')).toBeTrue(); // Dec 31
  });

  it('should return false for invalid day formats', () => {
    expect(validateRFCDay('XXXXXX0100XX')).toBeFalse(); // 00 invalid
    expect(validateRFCDay('XXXXXX0132XX')).toBeFalse(); // >31 invalid
    expect(validateRFCDay('XXXXXX01AAXX')).toBeFalse(); // not digits
  });

  it('should validate February correctly (max 28 days)', () => {
    expect(validateRFCDay('XXXXXX0228XX')).toBeTrue();  // Feb 28
    expect(validateRFCDay('XXXXXX0229XX')).toBeFalse(); // Feb 29 (no leap logic in RFC format)
    expect(validateRFCDay('XXXXXX0230XX')).toBeFalse(); // Feb 30
  });

  it('should validate months with 30 days', () => {
    // April
    expect(validateRFCDay('XXXXXX0430XX')).toBeTrue();
    expect(validateRFCDay('XXXXXX0431XX')).toBeFalse();

    // June
    expect(validateRFCDay('XXXXXX0630XX')).toBeTrue();
    expect(validateRFCDay('XXXXXX0631XX')).toBeFalse();
  });

  it('should validate months with 31 days', () => {
    expect(validateRFCDay('XXXXXX0131XX')).toBeTrue(); // January
    expect(validateRFCDay('XXXXXX0731XX')).toBeTrue(); // July
    expect(validateRFCDay('XXXXXX1031XX')).toBeTrue(); // October has 31 days
  });

  it('should return false if month is invalid', () => {
    // Month = 15 (invalid)
    expect(validateRFCDay('XXXXXX1530XX')).toBeFalse();
  });

  it('should return false if RFC is too short', () => {
    expect(validateRFCDay('12345')).toBeFalse();
  });

});
