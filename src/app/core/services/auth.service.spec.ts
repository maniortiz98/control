import { TestBed } from '@angular/core/testing';
import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { EventMessage, InteractionRequiredAuthError } from '@azure/msal-browser';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthService } from './auth.service';
import { HttpClientService } from './http-client.service';
import { ConfigService } from './config.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpServiceSpy: jasmine.SpyObj<HttpClientService>;
  let msalServiceMock: any;
  let msalBroadcastSubject: Subject<EventMessage>;

  const baseUserInfo = {
    name: '',
    username: '',
    employeeId: '',
    homeAccountId: '',
    localAccountId: '',
    idToken: '',
    roles: [],
    rol: ''
  };

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj<HttpClientService>('HttpClientService', ['post', 'get']);

    msalBroadcastSubject = new Subject<EventMessage>();

    msalServiceMock = {
      instance: {
        initialize: jasmine.createSpy('initialize').and.resolveTo(undefined),
        setActiveAccount: jasmine.createSpy('setActiveAccount'),
        handleRedirectPromise: jasmine.createSpy('handleRedirectPromise').and.resolveTo(null),
        getActiveAccount: jasmine.createSpy('getActiveAccount').and.returnValue({
          name: 'John Doe',
          username: 'john@contoso.com',
          localAccountId: 'local-1',
          homeAccountId: 'home-1',
          idToken: 'id-token-1'
        }),
        getAllAccounts: jasmine.createSpy('getAllAccounts').and.returnValue([])
      },
      acquireTokenSilent: jasmine.createSpy('acquireTokenSilent').and.resolveTo({ accessToken: 'azure-token' }),
      loginRedirect: jasmine.createSpy('loginRedirect')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClientService, useValue: httpServiceSpy },
        { provide: MsalService, useValue: msalServiceMock },
        { provide: MsalBroadcastService, useValue: { msalSubject$: msalBroadcastSubject.asObservable() } },
        { provide: ConfigService, useValue: { config: { tkn_api: 'token-api', tkn_rol: 'token-rol' } } },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserInfo devuelve la signal readonly actual', () => {
    expect(service.getUserInfo()()).toEqual(baseUserInfo);
  });

  it('setUserInfo actualiza completamente el estado', () => {
    const payload = {
      name: 'Jane Doe',
      username: 'jane@contoso.com',
      employeeId: '12345',
      homeAccountId: 'home-2',
      localAccountId: 'local-2',
      idToken: 'id-token-2',
      roles: ['ROLE_X'],
      rol: 'ROLE_X'
    };

    service.setUserInfo(payload);

    expect(service.getUserInfo()()).toEqual(payload);
  });

  it('updateUserInfo aplica merge parcial sobre el estado actual', () => {
    service.setUserInfo({
      ...baseUserInfo,
      name: 'Initial Name',
      username: 'initial@contoso.com',
      employeeId: '7'
    });

    service.updateUserInfo({
      name: 'Updated Name',
      rol: 'ROL_PLD'
    });

    expect(service.getUserInfo()()).toEqual({
      ...baseUserInfo,
      name: 'Updated Name',
      username: 'initial@contoso.com',
      employeeId: '7',
      rol: 'ROL_PLD'
    });
  });

  it('refreshAccessToken realiza POST y regresa el token', async () => {
    const tokenResponse = { accessToken: 'api-access-token' } as any;
    httpServiceSpy.post.and.returnValue(of(tokenResponse));

    const response = await service.refreshAccessToken();

    expect(response).toEqual(tokenResponse);
    const secUrls = (service as any).secUrls;
    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      secUrls.accessToken,
      {},
      jasmine.objectContaining({
        headers: {
          Authorization: 'Basic token-api'
        },
        params: {
          'grant-type': 'client_credentials'
        }
      })
    );
  });

  it('login llena userInfo cuando existe cuenta activa con username', async () => {
    await service.login();

    expect(msalServiceMock.instance.initialize).toHaveBeenCalled();
    expect(service.getUserInfo()()).toEqual({
      ...baseUserInfo,
      name: 'John Doe',
      username: 'john@contoso.com',
      localAccountId: 'local-1',
      homeAccountId: 'home-1',
      idToken: 'id-token-1'
    });
    expect(msalServiceMock.loginRedirect).not.toHaveBeenCalled();
  });

  it('login llama loginRedirect cuando la cuenta no tiene username', async () => {
    msalServiceMock.instance.getActiveAccount.and.returnValue({
      name: 'No Username',
      username: '',
      localAccountId: 'local-3',
      homeAccountId: 'home-3',
      idToken: 'id-token-3'
    });

    await service.login();

    expect(msalServiceMock.loginRedirect).toHaveBeenCalled();
  });

  it('getRoles encadena pasos y normaliza employeeId a 5 digitos', async () => {
    spyOn(service, 'getAzureToken').and.returnValue(of({ accessToken: 'azure' }));
    spyOn(service, 'loginForRoles').and.returnValue(of({ accessToken: 'roles' }));
    spyOn(service, 'getUserRoles').and.returnValue(of({
      status: 'OK',
      messages: [],
      payload: {
        userName: 'john',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@contoso.com',
        phone: '0000',
        areaId: 1,
        statusId: 1,
        userStatus: 'ACTIVE',
        employeeId: '12',
        employeePosition: 'Advisor',
        branchId: null,
        admissionDate: '2026-01-01',
        userRoles: [],
        userAttributes: []
      }
    }));

    const response: any = await firstValueFrom(service.getRoles());

    expect(service.getAzureToken).toHaveBeenCalled();
    expect(service.loginForRoles).toHaveBeenCalledWith('azure');
    expect(service.getUserRoles).toHaveBeenCalledWith('roles');
    expect(response.employeeId).toBe('00012');
  });

  it('getRoles propaga errores del flujo', async () => {
    const error = new InteractionRequiredAuthError('interaction_required', 'Needs interaction');
    spyOn(service, 'getAzureToken').and.returnValue(throwError(() => error));

    await expectAsync(firstValueFrom(service.getRoles())).toBeRejectedWith(error);
  });

  it('getAzureToken hace loginRedirect y falla si no hay cuenta activa', async () => {
    msalServiceMock.instance.getActiveAccount.and.returnValue(null);

    await expectAsync(firstValueFrom(service.getAzureToken())).toBeRejectedWithError('No active MSAL account');
    expect(msalServiceMock.loginRedirect).toHaveBeenCalled();
  });

  it('getAzureToken usa acquireTokenSilent cuando hay cuenta activa', async () => {
    msalServiceMock.instance.getActiveAccount.and.returnValue({
      username: 'john@contoso.com',
      homeAccountId: 'home-1',
      localAccountId: 'local-1',
      environment: 'login.microsoftonline.com',
      tenantId: 'tenant-1'
    });

    const response = await firstValueFrom(service.getAzureToken());

    expect(msalServiceMock.acquireTokenSilent).toHaveBeenCalled();
    expect(response).toEqual({ accessToken: 'azure-token' });
  });

  it('loginForRoles ejecuta POST con token y headers correctos', async () => {
    httpServiceSpy.post.and.returnValue(of({ accessToken: 'roles-token' }));

    const response = await firstValueFrom(service.loginForRoles('azure-token'));

    expect(response).toEqual({ accessToken: 'roles-token' });
    const secUrls = (service as any).secUrls;
    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      secUrls.userLogin,
      { userToken: 'azure-token' },
      {
        headers: {
          authorization: 'Basic token-rol'
        }
      }
    );
  });

  it('getUserRoles ejecuta GET con bearer token', async () => {
    httpServiceSpy.get.and.returnValue(of({ payload: [] }));

    const response = await firstValueFrom(service.getUserRoles('access-token'));

    expect(response).toEqual({ payload: [] });
    const secUrls = (service as any).secUrls;
    expect(httpServiceSpy.get).toHaveBeenCalledWith(
      secUrls.userRoles,
      {
        headers: {
          Authorization: 'Bearer access-token'
        }
      }
    );
  });

  it('activeAccount devuelve la cuenta activa de msal', () => {
    const expected = {
      username: 'john@contoso.com'
    } as any;
    msalServiceMock.instance.getActiveAccount.and.returnValue(expected);

    expect(service.activeAccount).toBe(expected);
  });
});
