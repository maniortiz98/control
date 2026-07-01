import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HttpClientService } from '../../core/services/http-client.service';
import { NotificationModalService } from './notification-modal.service';
import { NotificationsService } from './notifications.service';
import { CustomerInfo, CustomerInformation } from '../models/customer';
import { CustomerInformationService } from './customer.service';

describe('CustomerInformationService', () => {
  let service: CustomerInformationService;
  let httpSpy: jasmine.SpyObj<HttpClientService>;
  let notificationModalSpy: jasmine.SpyObj<NotificationModalService>;
  let notificationsSpy: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    const http = jasmine.createSpyObj('HttpClientService', ['post']);
    const modal = jasmine.createSpyObj('NotificationModalService', ['error']);
    const notifications = jasmine.createSpyObj('NotificationsService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        CustomerInformationService,
        { provide: HttpClientService, useValue: http },
        { provide: NotificationModalService, useValue: modal },
        { provide: NotificationsService, useValue: notifications },
      ],
    });

    service = TestBed.inject(CustomerInformationService);
    httpSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
    notificationModalSpy = TestBed.inject(NotificationModalService) as jasmine.SpyObj<NotificationModalService>;
    notificationsSpy = TestBed.inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http post with correct url and body', () => {
    httpSpy.post.and.returnValue(of({} as CustomerInfo));

    service.getCustomerInfo(123).subscribe();

    expect(httpSpy.post).toHaveBeenCalledWith(
      jasmine.any(String),
      { customerNumber: 123 }
    );
  });

  it('should return all default sections when sections is empty', (done) => {
    const customerMock: CustomerInfo = {
      initialData: {
        id: 1,
        curp: null,
        rfc: null,
        nif: null,
        tin: null,
        nss: null,
        firstName: 'Juan',
        middleName: null,
        firstLastName: 'Pérez',
        secondLastName: null,
        dateOfBirth: null,
        gender: null,
        nationality: null,
        countryOfBirth: null,
        stateOfBirth: null,
        cityOfBirth: null,
        ppe: false,
        foreignerWithoutCurp: false
      },
      generalInformation: {
        personType: 'PF',
        occupation: null,
        maritalStatus: null,
        marriageType: null,
        actinverEmployee: false,
        employeeNumber: null,
        related: false,
        institutionName: null,
        workDataId: null,
        profession: null,
        companyName: null,
        jobTitle: null,
        companyPhone: null,
        website: null,
        personClassification: null,
        economicActivity: null,
        sector: null,
        fiel: null,
        fielExpirationDate: null,
        codigoSwiftBic: null,
        mensajesMt940: false,
        address: null
      },
      identificationContact: {
        identifications: [{ id: 1 }],
        telephones: [
          {
            id: 1,
            type: 'MOBILE',
            country: 'MX',
            areaCode: '55',
            phone: '1234567890',
            extension: null,
            notificationPhone: true,
            active: true
          }
        ],
        emails: [
          {
            id: 1,
            type: 'HOME',
            emailAddress: 'test@test.com',
            notificationEmail: true,
            active: true
          }
        ]
      },
      addresses: [],
      fiscalResidences: [],
      factaObligation: {
        factaId: 1,
        authentication: null,
        nif: null,
        tin: null,
        nss: null
      },
      ppeInformation: {
        id: 1,
        ppeType: null,
        positionHeld: null,
        expirationDate: null,
        hasFamilyPpe: false,
        familyData: null,
        ppe: false
      }
    };

    httpSpy.post.and.returnValue(of(customerMock));

    service.getCustomerInfo(123).subscribe(result => {
      expect(result).toEqual({
        initialData: customerMock.initialData,
        generalInformation: customerMock.generalInformation,
        identifications: customerMock.identificationContact?.identifications,
        telephones: customerMock.identificationContact?.telephones,
        emails: customerMock.identificationContact?.emails,
        addresses: [],
        fiscalResidences: [],
        factaObligation: customerMock.factaObligation,
        ppeInformation: customerMock.ppeInformation
      } as CustomerInformation);
      done();
    });
  });

  it('should return only requested sections', (done) => {
    const customerMock: CustomerInfo = {
      generalInformation: {
        personType: 'PF',
        occupation: null,
        maritalStatus: null,
        marriageType: null,
        actinverEmployee: false,
        employeeNumber: null,
        related: false,
        institutionName: null,
        workDataId: null,
        profession: null,
        companyName: null,
        jobTitle: null,
        companyPhone: null,
        website: null,
        personClassification: null,
        economicActivity: null,
        sector: null,
        fiel: null,
        fielExpirationDate: null,
        codigoSwiftBic: null,
        mensajesMt940: false,
        address: null
      },
      identificationContact: {
        identifications: [{ id: 1 }],
        telephones: [],
        emails: []
      },
      addresses: []
    };

    httpSpy.post.and.returnValue(of(customerMock));

    service.getCustomerInfo(123, ['generalInformation', 'addresses', 'emails'] as any).subscribe(result => {
      expect(result).toEqual({
        generalInformation: customerMock.generalInformation,
        addresses: [],
        emails: []
      } as CustomerInformation);
      done();
    });
  });

  it('should call notificationService.error when backend returns 412', (done) => {
    const httpError = { status: 412 };

    httpSpy.post.and.returnValue(throwError(() => httpError));

    service.getCustomerInfo(123).subscribe({
      error: (err: any) => {
        expect(err).toEqual(httpError);
        expect(notificationsSpy.error).toHaveBeenCalledWith('Dato no Encontrado');
        done();
      }
    });
  });

  it('should call notificationModalService.error on retryable errors', (done) => {
    const httpError = { status: 500 };

    httpSpy.post.and.returnValue(throwError(() => httpError));
    notificationModalSpy.error.and.returnValue(
      Promise.resolve({ value: true })
    );

    service.getCustomerInfo(123).subscribe({
      error: (err: any) => {
        expect(err).toEqual(httpError);
        expect(notificationModalSpy.error).toHaveBeenCalled();
        done();
      }
    });
  });
});
