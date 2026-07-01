import { TestBed } from '@angular/core/testing';

import { BankAccountCheckpointSignalService } from './bank-account-signal.service';

describe('BankAccountCheckpointSignalService', () => {
  let service: BankAccountCheckpointSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankAccountCheckpointSignalService],
    });

    service = TestBed.inject(BankAccountCheckpointSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con arreglo vacio y isDataRequested en false', () => {
    expect(service.getData()).toEqual([]);
    expect(service.bankAccount()).toEqual([]);
    expect(service.isDataRequested()).toBeFalse();
  });

  it('setData debe guardar data y marcar isDataRequested en true', () => {
    const payload = [
      {
        accountNumber: '1234567890',
        bank: 'BANCO DEMO',
        accountType: 'CHEQUES',
        currency: 'MXN',
      },
      {
        accountNumber: '0000123456',
        bank: 'BANCO TEST',
        accountType: 'INVERSION',
        currency: 'USD',
      },
    ];

    service.setData(payload);

    expect(service.getData()).toEqual(payload);
    expect(service.bankAccount()).toEqual(payload);
    expect(service.isDataRequested()).toBeTrue();
  });

  it('clear debe resetear data e isDataRequested', () => {
    service.setData([{ accountNumber: '123' }]);
    expect(service.isDataRequested()).toBeTrue();

    service.clear();

    expect(service.getData()).toEqual([]);
    expect(service.bankAccount()).toEqual([]);
    expect(service.isDataRequested()).toBeFalse();
  });
});
