import { HttpContext, HttpContextToken } from '@angular/common/http';
import { NO_LOADING } from './http-contexts';

describe('HttpContext Tokens', () => {
  it('should have NO_LOADING default to false', () => {
    const context = new HttpContext();
    expect(context.get(NO_LOADING)).toBeFalse();
  });

  it('should allow setting NO_LOADING to true', () => {
    const context = new HttpContext().set(NO_LOADING, true);
    expect(context.get(NO_LOADING)).toBeTrue();
  });

  it('should allow setting NO_LOADING back to false', () => {
    const context = new HttpContext().set(NO_LOADING, true).set(NO_LOADING, false);
    expect(context.get(NO_LOADING)).toBeFalse();
  });
});