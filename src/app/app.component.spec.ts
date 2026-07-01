import { TestBed, ComponentFixture, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, throwError } from 'rxjs';

import { AppComponent } from './app.component';
import { LoadingService } from './shared/services/loading.service';
import { AuthService } from './core/services/auth.service';
import { PermissionRolService } from './core/services/rol.service';
import { RolResponse } from './core/models/rol';
import { UserInfo } from './core/models/user-info';
import { VersionInitService } from './core/services/version-init.service';
import { LogoutService } from './service/logout.service';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { EmployeesAdvisor } from './core/models/rol';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let router: Router;

  let loadingServiceStub: Partial<LoadingService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let permServiceSpy: jasmine.SpyObj<PermissionRolService>;
  let versionInitSpy: jasmine.SpyObj<VersionInitService>;
  let logoutServiceSpy: jasmine.SpyObj<LogoutService>;

  const userInfoSig = signal<UserInfo>({ name: 'John Doe' } as any);

  const advisorResponseOk: EmployeesAdvisor = {
    userName: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@contoso.com',
    phone: '555-1111',
    areaId: 1,
    statusId: 1,
    userStatus: 'ACTIVE',
    employeeId: 'E12345',
    employeePosition: 'Advisor',
    branchId: null,
    admissionDate: '2026-01-01',
    userRoles: [{ roleName: 'ROL_ANALISTA_DE_CONTRATOS' } as any],
    userAttributes: [],
  } as any;

  let inProgressSubject: Subject<InteractionStatus>;

  beforeEach(async () => {
    loadingServiceStub = {
      loading: signal(false) as any,
    };

    inProgressSubject = new Subject<InteractionStatus>();

    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'getUserInfo',
      'login',
      'getRoles',
      'updateUserInfo',
      'setUserInfo',
    ]);

    permServiceSpy = jasmine.createSpyObj<PermissionRolService>('PermissionRolService', [
      'validRole',
      'getPermissions',
      'getMenuButtonPermission',
    ]);

    versionInitSpy = jasmine.createSpyObj<VersionInitService>('VersionInitService', [
      'getBuildInfo',
    ]);

    logoutServiceSpy = jasmine.createSpyObj<LogoutService>('LogoutService', ['logout']);

    authServiceSpy.getUserInfo.and.returnValue(userInfoSig);
    authServiceSpy.login.and.returnValue(Promise.resolve());
    authServiceSpy.getRoles.and.returnValue(of(advisorResponseOk));

    permServiceSpy.validRole.and.returnValue(true);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: LoadingService, useValue: loadingServiceStub },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PermissionRolService, useValue: permServiceSpy },
        { provide: VersionInitService, useValue: versionInitSpy },
        { provide: LogoutService, useValue: logoutServiceSpy },
        {
          provide: MsalBroadcastService,
          useValue: {
            inProgress$: inProgressSubject.asObservable(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

  });

  function create(): void {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    create();
    expect(component).toBeTruthy();
  });

  it('should navigate to "" from constructor', () => {
    create();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should set letters from userInfo via effect', async () => {
    create();
    fixture.detectChanges();

    expect(component.letters).toBe('JD');

    userInfoSig.set({ name: 'Ana María López' } as any);
    fixture.detectChanges();

    expect(component.letters).toBe('AM');
  });

  it('should call updateUserInfo and navigate to "onboarding" when validRole is true', fakeAsync(() => {
    create();

    (router.navigate as jasmine.Spy).calls.reset();

    flushMicrotasks();

    expect(authServiceSpy.getRoles).toHaveBeenCalled();
    expect(authServiceSpy.updateUserInfo).toHaveBeenCalled();

    const args = authServiceSpy.updateUserInfo.calls.mostRecent().args[0];

    expect(args).toEqual(
      jasmine.objectContaining({
        roles: advisorResponseOk.userRoles,
        employeeId: advisorResponseOk.employeeId,
        rol: 'ROL_ANALISTA_DE_CONTRATOS',
      }),
    );

    expect(router.navigate).toHaveBeenCalledWith(['onboarding']);
  }));

  it('should navigate to "logout" when validRole is false', fakeAsync(() => {
    permServiceSpy.validRole.and.returnValue(false);

    create();
    (router.navigate as jasmine.Spy).calls.reset();
    flushMicrotasks();

    expect(authServiceSpy.updateUserInfo).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['logout']);
  }));

  it('should navigate to "logout" when getRoles emits error', fakeAsync(() => {
    authServiceSpy.getRoles.and.returnValue(throwError(() => new Error('roles error')));

    create();
    (router.navigate as jasmine.Spy).calls.reset();
    flushMicrotasks();

    expect(router.navigate).toHaveBeenCalledWith(['logout']);
  }));

  it('should not throw when login promise is rejected', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(Promise.reject(new Error('login error')));

    expect(() => create()).not.toThrow();
    flushMicrotasks();
  }));

  it('ngOnInit should set build info correctly', () => {
    versionInitSpy.getBuildInfo.and.returnValue({
      appVersion: '2.0.1',
      buildDate: '2025-04-10 10:00',
      bundleSizeMB: '3.2',
    } as any);

    create();
    fixture.detectChanges();

    expect(component.appVersion).toBe('2.0.1');
    expect(component.buildDate).toBe('2025-04-10 10:00');
    expect(component.buildSize).toBe('3.2 MB');
  });

  it('ngOnInit should set buildSize to "N/D" when missing', () => {
    versionInitSpy.getBuildInfo.and.returnValue({
      appVersion: '1.0.0',
      buildDate: '2025-06-01 09:30',
    } as any);

    create();
    fixture.detectChanges();

    expect(component.buildSize).toBe('N/D');
  });

  it('ngOnInit should keep defaults when build info is undefined', () => {
    versionInitSpy.getBuildInfo.and.returnValue(undefined as any);

    create();
    fixture.detectChanges();

    expect(component.appVersion).toBe('0.0.0');
    expect(component.buildDate).toBeUndefined();
    expect(component.buildSize).toBe('');
  });

  it('toggleMenu should open and close menu', () => {
    create();

    const renderer = (component as any).renderer;
    spyOn(renderer, 'listen').and.returnValues(
      () => {},
      () => {}
    );

    const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;

    component.toggleMenu(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.menuOpen).toBeTrue();

    component.toggleMenu(event);
    expect(component.menuOpen).toBeFalse();
  });

  it('toggleMenu should close when Escape key listener is triggered', () => {
    create();

    let keydownHandler: ((event: KeyboardEvent) => void) | undefined;
    const renderer = (component as any).renderer;
    spyOn(renderer, 'listen').and.callFake((target: string, eventName: string, cb: any) => {
      if (target === 'document' && eventName === 'keydown') {
        keydownHandler = cb;
      }
      return () => {};
    });

    const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
    component.toggleMenu(event);
    expect(component.menuOpen).toBeTrue();

    keydownHandler?.({ key: 'Escape' } as KeyboardEvent);
    expect(component.menuOpen).toBeFalse();
  });

  it('toggleMenu should close when click outside is triggered', () => {
    create();

    let clickHandler: ((event: Event) => void) | undefined;
    const renderer = (component as any).renderer;
    spyOn(renderer, 'listen').and.callFake((target: string, eventName: string, cb: any) => {
      if (target === 'document' && eventName === 'click') {
        clickHandler = cb;
      }
      return () => {};
    });

    (component as any).userMenu = {
      nativeElement: {
        contains: () => false,
      },
    };

    component.toggleMenu({ stopPropagation: () => {} } as any);
    expect(component.menuOpen).toBeTrue();

    clickHandler?.({ target: {} } as Event);
    expect(component.menuOpen).toBeFalse();
  });

  it('logout should delegate to LogoutService', () => {
    create();

    component.logout();

    expect(logoutServiceSpy.logout).toHaveBeenCalled();
  });

  it('copyBuildInfo should copy expected text', async () => {
    create();

    const writeText = jasmine.createSpy('writeText').and.returnValue(Promise.resolve());

    if (Object.getOwnPropertyDescriptor(navigator, 'clipboard')?.get) {
      spyOnProperty(navigator, 'clipboard', 'get').and.returnValue({
        writeText,
      } as any);
    } else {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      });
    }

    component.appVersion = '1.2.3';
    component.buildDate = '2026-01-01 12:00';

    await component.copyBuildInfo();

    expect(writeText).toHaveBeenCalledWith('App Version: 1.2.3 | Fecha: 2026-01-01 12:00');
  });

  it('ngOnDestroy should cleanup listeners safely', () => {
    create();
    const removeClick = jasmine.createSpy('removeClick');
    const removeKey = jasmine.createSpy('removeKey');

    (component as any).removeClickListener = removeClick;
    (component as any).removeKeyListener = removeKey;

    component.ngOnDestroy();

    expect(removeClick).toHaveBeenCalled();
    expect(removeKey).toHaveBeenCalled();
  });
});
