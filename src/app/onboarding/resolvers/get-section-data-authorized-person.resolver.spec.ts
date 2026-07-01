import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';

import { GetSectionDataAuthorizedPersonResolver } from './get-section-data-authorized-person.resolver';

import { OnboardingService } from '../services/onboarding.service';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { AuthorizedPersonSignalService } from '../services/checkpoint/authorized-persona-signal.service';

describe('GetSectionDataAuthorizedPersonResolver', () => {
  let resolver: GetSectionDataAuthorizedPersonResolver;

  let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;
  let checkpointServiceSpy: jasmine.SpyObj<CheckpointService>;
  let signalServiceSpy: jasmine.SpyObj<AuthorizedPersonSignalService>;

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function createResolverWithCurrentInfo(currentInfo: any) {
    onboardingServiceSpy.getCurrentInfo.and.returnValue(currentInfo);
    resolver = TestBed.inject(GetSectionDataAuthorizedPersonResolver);
  }

  beforeEach(() => {
    onboardingServiceSpy = jasmine.createSpyObj<OnboardingService>('OnboardingService', ['getCurrentInfo']);
    checkpointServiceSpy = jasmine.createSpyObj<CheckpointService>('CheckpointService', [
      'getSection',
      'getMaintenanceSectionByPersonaFisica'
    ]);
    signalServiceSpy = jasmine.createSpyObj<AuthorizedPersonSignalService>('AuthorizedPersonSignalService', [
      'isDataRequested',
      'setData'
    ]);

    TestBed.configureTestingModule({
      providers: [
        GetSectionDataAuthorizedPersonResolver,
        { provide: OnboardingService, useValue: onboardingServiceSpy },
        { provide: CheckpointService, useValue: checkpointServiceSpy },
        { provide: AuthorizedPersonSignalService, useValue: signalServiceSpy }
      ]
    });
  });

  it('debe devolver true y setear data en flujo exitoso de onboarding', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-321' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    checkpointServiceSpy.getSection.and.returnValue(of({
      checkpoints: [
        {
          data: {
            authorizedPerson: []
          }
        }
      ]
    } as any));

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeTrue();
    expect(checkpointServiceSpy.getSection).toHaveBeenCalledWith(['authorized-person']);
    expect(signalServiceSpy.setData).toHaveBeenCalled();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).not.toHaveBeenCalled();
  });

  it('debe devolver null cuando falla getSection en onboarding y no setear data', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-999' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    checkpointServiceSpy.getSection.and.returnValue(
      throwError(() => new Error('Section error onboarding'))
    );

    spyOn(console, 'log');

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).toHaveBeenCalledWith(['authorized-person']);
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).not.toHaveBeenCalled();
  });

  it('debe devolver true y setear data en flujo exitoso de mantenimiento', async () => {
    createResolverWithCurrentInfo({ isOnboarding: false, isMaintenance: true, requestId: 'REQ-777' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    checkpointServiceSpy.getMaintenanceSectionByPersonaFisica.and.returnValue(of({
      checkpoints: [
        {
          data: {
            authorizedPerson: []
          }
        }
      ]
    } as any));

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeTrue();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).toHaveBeenCalledWith(['authorized-person']);
    expect(signalServiceSpy.setData).toHaveBeenCalled();
    expect(checkpointServiceSpy.getSection).not.toHaveBeenCalled();
  });

  it('debe devolver null cuando falla sección de mantenimiento y no setear data', async () => {
    createResolverWithCurrentInfo({ isOnboarding: false, isMaintenance: true, requestId: 'REQ-778' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    checkpointServiceSpy.getMaintenanceSectionByPersonaFisica.and.returnValue(
      throwError(() => new Error('Section error maintenance'))
    );

    spyOn(console, 'log');

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).toHaveBeenCalledWith(['authorized-person']);
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
    expect(checkpointServiceSpy.getSection).not.toHaveBeenCalled();
  });

  it('debe devolver null y NO llamar servicios cuando no es onboarding ni maintenance', async () => {
    createResolverWithCurrentInfo({ isOnboarding: false, isMaintenance: false, requestId: 'REQ-000' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).not.toHaveBeenCalled();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).not.toHaveBeenCalled();
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
  });

  it('debe devolver null y NO llamar servicios cuando isDataRequested=true', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-111' });
    signalServiceSpy.isDataRequested.and.returnValue(true);

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).not.toHaveBeenCalled();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).not.toHaveBeenCalled();
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
  });
});