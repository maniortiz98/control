import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';

import { GetSectionDataBankAccountResolver } from './get-section-data-bank-account.resolver';
import { OnboardingService } from '../services/onboarding.service';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { BankAccountCheckpointSignalService } from '../services/checkpoint/bank-account-signal.service';

describe('GetSectionDataBankAccountResolver', () => {
  let resolver: GetSectionDataBankAccountResolver;

  let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;
  let checkpointServiceSpy: jasmine.SpyObj<CheckpointService>;
  let signalServiceSpy: jasmine.SpyObj<BankAccountCheckpointSignalService>;

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  function createResolverWithCurrentInfo(currentInfo: any) {
    onboardingServiceSpy.getCurrentInfo.and.returnValue(currentInfo);
    resolver = TestBed.inject(GetSectionDataBankAccountResolver);
  }

  beforeEach(() => {
    onboardingServiceSpy = jasmine.createSpyObj<OnboardingService>('OnboardingService', ['getCurrentInfo']);
    checkpointServiceSpy = jasmine.createSpyObj<CheckpointService>('CheckpointService', [
      'getSection',
      'getMaintenanceSectionByPersonaFisica'
    ]);
    signalServiceSpy = jasmine.createSpyObj<BankAccountCheckpointSignalService>('BankAccountCheckpointSignalService', [
      'isDataRequested',
      'setData'
    ]);

    TestBed.configureTestingModule({
      providers: [
        GetSectionDataBankAccountResolver,
        { provide: OnboardingService, useValue: onboardingServiceSpy },
        { provide: CheckpointService, useValue: checkpointServiceSpy },
        { provide: BankAccountCheckpointSignalService, useValue: signalServiceSpy }
      ]
    });
  });

  it('debe devolver true y guardar data cuando el flujo de onboarding es exitoso', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-001' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    checkpointServiceSpy.getSection.and.returnValue(of({
      checkpoints: [
        {
          data: {
            bankAccounts: [
              {
                accountType: '1',
                currency: 'MXN',
                domiciledIn: '1',
                accountStatus: '1',
                isThirdParty: false,
                paymentMethodDocument: true,
                paymentMethodElectronic: false,
                maxAmount: '1000',
                bank: '1',
                alias: 'Cuenta principal',
                beneficiaries: [
                  {
                    beneficiaryName: 'Juan Perez',
                    curp: 'CURP123456HDFABC01',
                    rfc: 'XAXX010101000',
                    accountNumberIban: '1234567890',
                    clabe: '012345678901234567',
                    abaCode: 'ABA',
                    swiftCode: 'SWIFT'
                  }
                ],
                reference: 'REF-1',
                concept: 'Pago',
                intermediaryBank: 'Banco Intermediario',
                subaccountHolder: 'Titular',
                subaccountKey: 'SUB-1'
              }
            ]
          }
        }
      ]
    } as any));

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeTrue();
    expect(checkpointServiceSpy.getSection).toHaveBeenCalledWith(['bank-account']);
    expect(signalServiceSpy.setData).toHaveBeenCalled();

    const mappedData = signalServiceSpy.setData.calls.mostRecent().args[0];
    expect(Array.isArray(mappedData)).toBeTrue();
    expect(mappedData.length).toBe(1);
    expect(mappedData[0]).toEqual(jasmine.objectContaining({
      accountType: '1',
      currency: 'MXN',
      domiciled: '1',
      accountStatus: '1',
      checkThird: false,
      checkDocument: true,
      checkPayment: false,
      addressee: 'Juan Perez',
      addresseeAccount: '1234567890',
      addresseeClabe: '012345678901234567',
      abaCode: 'ABA',
      swiftCode: 'SWIFT',
      reference: 'REF-1',
      concept: 'Pago',
      intermediaryBank: 'Banco Intermediario',
      subAccount: 'Titular',
      subAccountId: 'SUB-1'
    }));
  });

  it('debe devolver null y no llamar getSection cuando falla la consulta de onboarding', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-002' });
    signalServiceSpy.isDataRequested.and.returnValue(false);
    checkpointServiceSpy.getSection.and.returnValue(throwError(() => new Error('section error')));

    spyOn(console, 'log');

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).toHaveBeenCalledWith(['bank-account']);
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
  });

  it('debe devolver null cuando no es onboarding', async () => {
    createResolverWithCurrentInfo({ isOnboarding: false, isMaintenance: false, requestId: 'REQ-003' });
    signalServiceSpy.isDataRequested.and.returnValue(false);

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).not.toHaveBeenCalled();
    expect(checkpointServiceSpy.getMaintenanceSectionByPersonaFisica).not.toHaveBeenCalled();
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
  });

  it('debe devolver null cuando ya se solicitó la data', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-004' });
    signalServiceSpy.isDataRequested.and.returnValue(true);

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).not.toHaveBeenCalled();
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
  });

  it('debe devolver null si getSection responde vacío o falla en mapeo de respuesta', async () => {
    createResolverWithCurrentInfo({ isOnboarding: true, isMaintenance: false, requestId: 'REQ-005' });
    signalServiceSpy.isDataRequested.and.returnValue(false);
    checkpointServiceSpy.getSection.and.returnValue(of({ checkpoints: [] } as any));

    spyOn(console, 'log');

    const result = await firstValueFrom(resolver.resolve(route, state));

    expect(result).toBeNull();
    expect(checkpointServiceSpy.getSection).toHaveBeenCalledWith(['bank-account']);
    expect(signalServiceSpy.setData).not.toHaveBeenCalled();
  });
});