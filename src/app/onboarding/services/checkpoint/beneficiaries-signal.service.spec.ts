import { TestBed } from '@angular/core/testing';

import { BeneficiariesSignalService } from './beneficiaries-signal.service';
import { BeneficiariesPMPageData } from '../../models/checkpoints/beneficiaries-pm';

describe('BeneficiariesSignalService', () => {
  let service: BeneficiariesSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeneficiariesSignalService],
    });

    service = TestBed.inject(BeneficiariesSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con PF vacio, PM vacio e isRequested en false', () => {
    expect(service.getBeneficiaries()).toEqual([]);
    expect(service.beneficiaries()).toEqual([]);

    expect(service.getBeneficiariesPM()).toEqual({
      data: [],
      table: [],
    });
    expect(service.beneficiariesPM()).toEqual({
      data: [],
      table: [],
    });

    expect(service.isRequested()).toBeFalse();
  });

  it('setBeneficiaries/getBeneficiaries deben guardar data PF y activar isRequested', () => {
    const pfData = [
      {
        tempId: 'tmp-1',
        name: 'Juan Perez',
        percentage: '50',
      },
      {
        tempId: 'tmp-2',
        name: 'Ana Lopez',
        percentage: '50',
      },
    ];

    service.setBeneficiaries(pfData);

    expect(service.getBeneficiaries()).toEqual(pfData);
    expect(service.beneficiaries()).toEqual(pfData);
    expect(service.isRequested()).toBeTrue();
  });

  it('setBeneficiariesPM/getBeneficiariesPM deben guardar data PM', () => {
    const pmData: BeneficiariesPMPageData = {
      data: [
        {
          tempId: 'pm-1',
          companyName: 'Empresa Demo',
          id: 'XAXX010101000',
          typeId: 'MORAL',
          economicActivity: 'SERVICIOS',
          creationDate: '2020-01-01',
          percentage: '100',
          address: null,
        },
      ],
      table: [
        {
          tempId: 'pm-1',
          companyName: 'Empresa Demo',
          rfc: 'XAXX010101000',
          percentage: '100',
          zipcode: '01000',
        },
      ],
    };

    service.setBeneficiariesPM(pmData);

    expect(service.getBeneficiariesPM()).toEqual(pmData);
    expect(service.beneficiariesPM()).toEqual(pmData);
  });

  it('clear debe limpiar PF, PM y regresar isRequested a false', () => {
    service.setBeneficiaries([{ tempId: 'tmp-1' }]);
    service.setBeneficiariesPM({
      data: [
        {
          tempId: 'pm-1',
          companyName: 'Empresa Demo',
          id: 'XAXX010101000',
          typeId: 'MORAL',
          economicActivity: 'SERVICIOS',
          creationDate: '2020-01-01',
          percentage: '100',
          address: null,
        },
      ],
      table: [
        {
          tempId: 'pm-1',
          companyName: 'Empresa Demo',
          rfc: 'XAXX010101000',
          percentage: '100',
          zipcode: '01000',
        },
      ],
    });

    expect(service.isRequested()).toBeTrue();

    service.clear();

    expect(service.getBeneficiaries()).toEqual([]);
    expect(service.getBeneficiariesPM()).toEqual({
      data: [],
      table: [],
    });
    expect(service.isRequested()).toBeFalse();
  });
});
