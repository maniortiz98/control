import { fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VersionInitService } from './version-init.service';

describe('VersionInitService', () => {
  let service: VersionInitService;
  let httpMock: HttpTestingController;
  let reloadSpy: jasmine.Spy;

  const mockBuildInfo = {
    appVersion: '2.0.0',
    buildDate: '2025-01-01',
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    localStorage.setItem('msal.test', 'keep');

    if ((window as any).caches) {
      (window as any).caches.keys = () => Promise.resolve([]);
      (window as any).caches.delete = () => Promise.resolve(true);
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VersionInitService],
    });

    service = TestBed.inject(VersionInitService);
    httpMock = TestBed.inject(HttpTestingController);

    reloadSpy = spyOn(service as any, 'reload');
  });

  afterEach(() => {
    httpMock.verify();
    delete (window as any).caches;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request JSON with cache-bust param', () => {
    service.init();

    const req = httpMock.expectOne(
      (r) => r.url.includes('assets/build-info.json') && r.url.includes('v='),
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockBuildInfo);
  });

  it('should store buildInfo', async () => {
    const p = service.init();

    const req = httpMock.expectOne(() => true);
    req.flush(mockBuildInfo);

    await p;

    expect(service.getBuildInfo()).toEqual(mockBuildInfo);
  });

  it('should save version if not stored and not reload', async () => {
    const p = service.init();

    const req = httpMock.expectOne(() => true);
    req.flush(mockBuildInfo);

    await p;

    expect(localStorage.getItem('appVersion')).toBe('2.0.0');
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it('should preserve msal keys when version changes', fakeAsync(() => {
    localStorage.clear();
    sessionStorage.clear();

    localStorage.setItem('appVersion', '1.0.0');
    localStorage.setItem('msal.token', 'abc123');

    Object.defineProperty(window, 'caches', {
      value: {
        keys: () => Promise.resolve([]),
        delete: () => Promise.resolve(true),
      },
      configurable: true,
    });

    service.init();

    const req = httpMock.expectOne(() => true);
    req.flush(mockBuildInfo);

    flushMicrotasks();
    tick();

    expect(reloadSpy).not.toHaveBeenCalled();

    expect(localStorage.getItem('msal.token')).toBe('abc123');
    expect(localStorage.getItem('appVersion')).toBe('2.0.0');
    expect(sessionStorage.getItem('reloadedForVersion')).toBe('2.0.0');
  }));

  it('should not reload when version is the same', async () => {
    localStorage.setItem('appVersion', '2.0.0');

    const p = service.init();

    const req = httpMock.expectOne(() => true);
    req.flush(mockBuildInfo);

    await p;

    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it('should resolve on HTTP error', async () => {
    const p = service.init();

    const req = httpMock.expectOne(() => true);
    req.error(new ProgressEvent('error'));

    await p;

    expect(service.getBuildInfo()).toBeUndefined();
  });

  it('should resolve on timeout', async () => {
    jasmine.clock().install();

    const p = service.init();
    httpMock.expectOne(() => true);

    jasmine.clock().tick(3001);
    jasmine.clock().uninstall();

    await p;

    expect(service.getBuildInfo()).toBeUndefined();
  });
});
