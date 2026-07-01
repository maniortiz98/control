import { TestBed } from '@angular/core/testing';
import { PendingChangesGuard } from './pending-changes.guard';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesService } from '../services/unsaved-changes.service';
import { OnboardingService } from '../../onboarding/services/onboarding.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';

const ONBOARDING_URL  = '/onboarding/new-customer/bank-account';
const EXTERNAL_URL    = '/dashboard';

class FakeUnsavedChangesService {
  private _value = false;
  setUnsavedChanges(value: boolean) { this._value = value; }
  get hasUnsavedChanges() { return this._value; }
}

function makeState(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('PendingChangesGuard', () => {
  let guard: PendingChangesGuard;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let onboardingSpy: jasmine.SpyObj<OnboardingService>;
  let unsavedService: FakeUnsavedChangesService;

  const mockComponent: any = {};
  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    dialogSpy    = jasmine.createSpyObj('MatDialog', ['open']);
    onboardingSpy = jasmine.createSpyObj('OnboardingService', [
      'restoreTabPosition',
      'clearOnboardingInfo',
      'restoreInitialTabs',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PendingChangesGuard,
        { provide: MatDialog,           useValue: dialogSpy },
        { provide: UnsavedChangesService, useClass: FakeUnsavedChangesService },
        { provide: OnboardingService,   useValue: onboardingSpy },
      ]
    });

    guard         = TestBed.inject(PendingChangesGuard);
    unsavedService = TestBed.inject(UnsavedChangesService) as unknown as FakeUnsavedChangesService;
    spyOn(unsavedService, 'setUnsavedChanges').and.callThrough();
  });

  // ─── sin cambios pendientes ────────────────────────────────────────────────

  it('allows deactivation immediately when no unsaved changes', () => {
    unsavedService.setUnsavedChanges(false);
    const result = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    expect(result).toBeTrue();
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  // ─── abre el dialog ────────────────────────────────────────────────────────

  it('opens dialog when there are unsaved changes', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: false }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    (result$ as any).subscribe(() => {
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      done();
    });
  });

  // ─── usuario cancela ──────────────────────────────────────────────────────

  it('cancel: does NOT clear unsaved flag', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: false }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    (result$ as any).subscribe((res: boolean) => {
      expect(res).toBeFalse();
      expect(unsavedService.setUnsavedChanges).not.toHaveBeenCalledWith(false);
      done();
    });
  });

  it('cancel: restores tab when both URLs are onboarding', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: false }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(ONBOARDING_URL));

    (result$ as any).subscribe(() => {
      expect(onboardingSpy.restoreTabPosition).toHaveBeenCalled();
      done();
    });
  });

  it('cancel: does NOT restore tab when next URL is outside onboarding', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: false }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    (result$ as any).subscribe(() => {
      expect(onboardingSpy.restoreTabPosition).not.toHaveBeenCalled();
      done();
    });
  });

  // ─── usuario acepta ───────────────────────────────────────────────────────

  it('accept: clears unsaved flag and returns true', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: true }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    (result$ as any).subscribe((res: boolean) => {
      expect(res).toBeTrue();
      expect(unsavedService.setUnsavedChanges).toHaveBeenCalledWith(false);
      done();
    });
  });

  it('accept: clears onboarding info when leaving onboarding', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: true }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    (result$ as any).subscribe(() => {
      expect(onboardingSpy.clearOnboardingInfo).toHaveBeenCalled();
      expect(onboardingSpy.restoreInitialTabs).toHaveBeenCalled();
      done();
    });
  });

  it('accept: does NOT clear onboarding info when navigating within onboarding', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: true }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(ONBOARDING_URL));

    (result$ as any).subscribe(() => {
      expect(onboardingSpy.clearOnboardingInfo).not.toHaveBeenCalled();
      expect(onboardingSpy.restoreInitialTabs).not.toHaveBeenCalled();
      done();
    });
  });

  it('accept: does NOT call restoreTabPosition', (done) => {
    unsavedService.setUnsavedChanges(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => of({ value: true }) } as any);

    const result$ = guard.canDeactivate(mockComponent, mockRoute,
      makeState(ONBOARDING_URL), makeState(EXTERNAL_URL));

    (result$ as any).subscribe(() => {
      expect(onboardingSpy.restoreTabPosition).not.toHaveBeenCalled();
      done();
    });
  });
});