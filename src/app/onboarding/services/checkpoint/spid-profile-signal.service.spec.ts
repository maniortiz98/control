import { TestBed } from '@angular/core/testing';

import { SpidProfileSignalService } from './spid-profile-signal.service';
import { SpidProfilePageData } from '../../models/pm/spid-profile';

describe('SpidProfileSignalService', () => {
  let service: SpidProfileSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpidProfileSignalService],
    });

    service = TestBed.inject(SpidProfileSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con data vacia y table vacia', () => {
    expect(service.getData()).toEqual({
      data: {} as any,
      table: [],
    });
    expect(service.spidProfile()).toEqual({
      data: {} as any,
      table: [],
    });
  });

  it('setData debe guardar la informacion y getData debe retornarla', () => {
    const payload: SpidProfilePageData = {
      data: {
        accountPurpose: 'INVERSION',
        fundOrigin: 'AHORROS',
        fundDestination: 'PATRIMONIO',
        spidReceiveMonth: '50000',
        spidSendMonth: '40000',
        transactReceiveMonth: '70000',
        transactSendMonth: '30000',
        customerStock: 'NO',
        publicEntity: 'NO',
        creditInstitution: 'SI',
        counterparts: [
          {
            tempId: 'tmp-1',
            typeId: '1',
            id: 'XAXX010101000',
            companyName: 'EMPRESA DEMO',
            economicActivity: 'SERVICIOS',
            relationType: 'CLIENTE',
            bank: 'BANCO DEMO',
            clabe: '012345678901234567',
            frecuency: 'MENSUAL',
          },
        ],
      },
      table: [
        {
          name: 'EMPRESA DEMO',
          relation: 'CLIENTE',
          bank: 'BANCO DEMO',
        },
      ],
    };

    service.setData(payload);

    expect(service.getData()).toEqual(payload);
    expect(service.spidProfile()).toEqual(payload);
  });

  it('clear debe limpiar la signal a su valor inicial', () => {
    const payload: SpidProfilePageData = {
      data: {
        accountPurpose: 'INVERSION',
        fundOrigin: 'AHORROS',
        fundDestination: 'PATRIMONIO',
        spidReceiveMonth: '50000',
        spidSendMonth: '40000',
        transactReceiveMonth: '70000',
        transactSendMonth: '30000',
        customerStock: 'NO',
        publicEntity: 'NO',
        creditInstitution: 'SI',
        counterparts: [],
      },
      table: [{ row: 1 }],
    };

    service.setData(payload);
    expect(service.getData()).toEqual(payload);

    service.clear();

    expect(service.getData()).toEqual({
      data: {} as any,
      table: [],
    });
  });
});
