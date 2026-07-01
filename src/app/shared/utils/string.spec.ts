import { concatFullName, getInitials, StrTempId } from "./string";


describe('string utils', () => {

  it('should generate a string', () => {
    const id = StrTempId();
    expect(typeof id).toBe('string');
  });

  it('should not return an empty string', () => {
    const id = StrTempId();
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate a UUID format string', () => {
    const id = StrTempId();

    // UUID v4 regex (general format)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(uuidRegex.test(id)).toBeTrue();
  () => {
    const id1 = StrTempId();
    const id2 = StrTempId();
    const id3 = StrTempId();

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  }
  });

  it('should return correct name, comb 1', () => {
    const fn  = '';
    const sfn = 'Juan';
    const ln  = 'Gonzalez';
    const sln = '';

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('Juan Gonzalez')
  });

  it('should return correct name, comb 2', () => {
    const fn  = 'Juan';
    const sfn = '';
    const ln  = '';
    const sln = 'Martinez';

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('Juan Martinez')
  });

  it('should return correct name, comb 3', () => {
    const fn  = 'Juan';
    const sfn = '';
    const ln  = 'Martinez';
    const sln = '';

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('Juan Martinez')
  });

  it('should return correct name, comb 4', () => {
    const fn  = '';
    const sfn = 'Juan';
    const ln  = '';
    const sln = 'Martinez';

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('Juan Martinez')
  });

  it('should return correct name, comb 5', () => {
    const fn  = 'Jose';
    const sfn = 'Juan';
    const ln  = 'Gonzalez';
    const sln = 'Martinez';

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('Jose Juan Gonzalez Martinez')
  });

  it('should return correct name, with one value undefined', () => {
    const fn  = 'Jose';
    const sfn = 'Juan';
    const ln  = undefined;
    const sln = 'Martinez';

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('Jose Juan Martinez')
  });

  it('should return correct name, with all values undefined', () => {
    const fn  = undefined;
    const sfn = undefined;
    const ln  = undefined;
    const sln = undefined;

    const name = concatFullName(fn, sfn, ln, sln);
    expect(name).toEqual('')
  });

  it('should return correct initials', () => {
    const name  = 'Jose Martinez';
    const initials = getInitials(name);
    expect(initials).toEqual('JM')
  });

  it('should return correct initials', () => {
    const name  = '';
    const initials = getInitials(name);
    expect(initials).toEqual('')
  });

});
