import { TestBed } from '@angular/core/testing';

import { AuthorizedPersonSignalService } from './authorized-persona-signal.service';
import { AuthorizedPersonPageData } from '../../models/authorized-person-page-data';

describe('AuthorizedPersonSignalService', () => {
  let service: AuthorizedPersonSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizedPersonSignalService],
    });

    service = TestBed.inject(AuthorizedPersonSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con data vacia y isDataRequested en false', () => {
    expect(service.getData()).toEqual({
      data: [],
      table: [],
    });
    expect(service.isDataRequested()).toBeFalse();
  });

  it('setData debe guardar informacion y marcar isDataRequested en true', () => {
    const payload: AuthorizedPersonPageData = {
      data: [
        {
          id: 1,
          personId: 100,
          active: true,
          clientData: {} as any,
          addressData: {} as any,
          authorizedPerson: {
            signClass: 'A',
            management: 'SI',
            relationship: 'FAMILIAR',
            authorizedPerson: 'NOMBRE',
            economicActivity: 'ACT',
            occupation: 'OCC',
            profession: 'PROF',
            workCompany: 'COMP',
            jobTitle: 'PUESTO',
            isPpe: false,
            ppeType: null,
            ppeRol: null,
            ppeExpires: null,
            ppeHasFamily: false,
            email: 'test@correo.com',
            faculty: 'FAC',
            otherFaculty: '',
          },
        },
      ],
      table: [
        {
          clientNumber: '12345',
          id: 1,
          rfc: 'XAXX010101000',
          address: 'CDMX',
          telephone: '5555555555',
          privileges: 'FAC',
          active: true,
        },
      ],
    };

    service.setData(payload);

    expect(service.getData()).toEqual(payload);
    expect(service.authorizedPerson()).toEqual(payload);
    expect(service.isDataRequested()).toBeTrue();
  });

  it('clear debe limpiar informacion y marcar isDataRequested en false', () => {
    const payload: AuthorizedPersonPageData = {
      data: [
        {
          id: 2,
          personId: 200,
          active: true,
          clientData: {} as any,
          addressData: {} as any,
          authorizedPerson: {
            signClass: 'A',
            management: 'SI',
            relationship: 'AMIGO',
            authorizedPerson: 'OTRO',
            economicActivity: 'ACT',
            occupation: 'OCC',
            profession: 'PROF',
            workCompany: 'COMP',
            jobTitle: 'PUESTO',
            isPpe: true,
            ppeType: 'PPE',
            ppeRol: 'ROL',
            ppeExpires: 'NO',
            ppeHasFamily: false,
            email: 'otro@correo.com',
            faculty: 'FAC',
            otherFaculty: '',
          },
        },
      ],
      table: [
        {
          clientNumber: '67890',
          id: 2,
          rfc: 'ABCD010101AAA',
          address: 'MTY',
          telephone: '8181818181',
          privileges: 'FAC',
          active: true,
        },
      ],
    };

    service.setData(payload);
    expect(service.isDataRequested()).toBeTrue();

    service.clear();

    expect(service.getData()).toEqual({
      data: [],
      table: [],
    });
    expect(service.isDataRequested()).toBeFalse();
  });
});
