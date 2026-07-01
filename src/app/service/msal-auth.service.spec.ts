import {
  BrowserCacheLocation,
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { environment } from '../../environments/environment';
import {
  loggerCallback,
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from './msal-auth.service';

describe('msal-auth service factories', () => {
  function readMsalConfiguration(instance: any): any {
    if (typeof instance.getConfiguration === 'function') {
      return instance.getConfiguration();
    }

    if (instance.config) {
      return instance.config;
    }

    if (instance.controller?.config) {
      return instance.controller.config;
    }

    fail('Unable to read MSAL configuration from PublicClientApplication instance');
    return null;
  }

  it('loggerCallback should not throw', () => {
    expect(() => loggerCallback(LogLevel.Info, 'test message')).not.toThrow();
  });

  it('MSALInstanceFactory should create a PublicClientApplication with environment config', () => {
    const instance = MSALInstanceFactory();
    const config = readMsalConfiguration(instance);

    expect(instance instanceof PublicClientApplication).toBeTrue();
    expect(config.auth.clientId).toBe(environment.msalConfig.auth.clientId);
    expect(config.auth.authority).toBe(environment.msalConfig.auth.authority);
    expect(config.auth.redirectUri).toBe(environment.msalConfig.auth.redirectUri);
    expect(config.auth.postLogoutRedirectUri).toBe(environment.msalConfig.auth.redirectUri);
    expect(config.cache.cacheLocation).toBe(BrowserCacheLocation.LocalStorage);
    expect(config.system.allowPlatformBroker).toBeFalse();
    expect(config.system.loggerOptions.loggerCallback).toBe(loggerCallback);
    expect(config.system.loggerOptions.logLevel).toBe(LogLevel.Info);
    expect(config.system.loggerOptions.piiLoggingEnabled).toBeFalse();
  });

  it('MSALInterceptorConfigFactory should create redirect interceptor config with protected resources', () => {
    const config = MSALInterceptorConfigFactory();
    const scopes = config.protectedResourceMap.get(environment.apiConfig.uri);

    expect(config.interactionType).toBe(InteractionType.Redirect);
    expect(config.protectedResourceMap instanceof Map).toBeTrue();
    expect(scopes).toEqual(environment.apiConfig.scopes);
  });

  it('MSALGuardConfigFactory should create redirect guard config with copied scopes and logout route', () => {
    const config = MSALGuardConfigFactory();
    const authRequest = config.authRequest as { scopes: string[] };

    expect(config.interactionType).toBe(InteractionType.Redirect);
    expect(authRequest.scopes).toEqual(environment.apiConfig.scopes);
    expect(authRequest.scopes).not.toBe(environment.apiConfig.scopes);
    expect(config.loginFailedRoute).toBe('/logout');
  });
});
