import { TestBed } from '@angular/core/testing';

import { GeneralInfoPmService } from './general-info-pm.service';

describe('GeneralInfoPmService', () => {
  let service: GeneralInfoPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralInfoPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the default signal values', () => {
    expect(service.initialGeneralInfoPmData).toEqual({});
    expect(service.generalInfoPmData()).toEqual({});
    expect(service.documents()).toEqual([]);
    expect(service.isMaintenance()).toBeFalse();
    expect(service.isEditable()).toBeTrue();
  });

  it('should allow updating the data and documents signals', () => {
    const generalInfo = {
      companyName: 'Actinver',
      rfc: 'XAXX010101000',
    } as any;

    const documents = [
      {
        documentType: 'test',
        deedNumber: '001',
        deedDate: '2026-05-19',
        notaryNumber: '10',
        notaryName: 'Notary',
        protocolSquare: 'A',
        inscriptionDate: '2026-05-19',
        govermentContract: 'GC-1',
        publicFolio: 'PF-1',
      },
    ] as any;

    service.generalInfoPmData.set(generalInfo);
    service.documents.set(documents);

    expect(service.generalInfoPmData()).toEqual(generalInfo);
    expect(service.documents()).toEqual(documents);
  });

  it('should keep columns metadata as configured', () => {
    expect(service.columns).toEqual([
      { name: 'notaryName', title: 'Nombre de Notario', type: 'string', show: true },
      { name: 'documentType', title: 'Tipo de Documento', type: 'string', show: true },
      { name: 'deedNumber', title: 'Numero de Escritura', type: 'string', show: true },
      { name: 'deedDate', title: 'Fecha de Escritura', type: 'string', show: true },
    ]);
  });
});
