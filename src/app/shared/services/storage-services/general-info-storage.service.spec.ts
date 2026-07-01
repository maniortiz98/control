// import { TestBed } from '@angular/core/testing';
// import { GeneralInfoStorageService } from './general-info-storage.service';
// import { GeneralInfoCheckpoint, GeneralInfoSection } from '../../../onboarding/models/checkpoints/general-info-checkpoint';

// describe('GeneralInfoStorageService', () => {
//   let service: GeneralInfoStorageService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(GeneralInfoStorageService);
//   });
//   /*
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should set and retrieve a GeneralInfoCheckpoint', () => {
//     const mockItem: GeneralInfoSection = {
//       personClassification: 'Individual',
//       economicActivity: 'IT',
//       maritalStatus: 'Single',
//       marriageType: undefined,
//       sector: 'Private',
//       actinverEmployee: true,
//       employeeNumber: '12345',
//       occupation: 'Developer',
//       profession: 'Engineer',
//       companyName: 'TechCorp',
//       jobTitle: 'Software Engineer',
//       companyPhone: '555-1234',
//       companyWebPage: 'https://techcorp.com',
//       domicilieType: 'Apartment',
//       country: 'Mexico',
//       postalCode: '01234',
//       federalEntity: 'CDMX',
//       city: 'Mexico City',
//       municipality: 'Benito Juárez',
//       colony: 'Del Valle',
//       street: 'Av. Insurgentes',
//       externalNumber: '123',
//       internalNumber: '4B',
//       website: 'https://personalpage.com',
//       related: false,
//       relationship: '',
//       institutionName: '',
//       fiel: '',
//       fielExpirationDate: '',
//       banxicoAuthorization: '',
//       operatesChanges: true,
//       nonGuaranteedByIPAB: 30,
//       acting: true,
//       hasSupplier: false,
//     };

//     service.setGeneralInfoItem(mockItem);
//     const result = service.getGeneralInfoItem();

//     expect(result).toEqual(mockItem);
//   });

//   it('should return null when cleared', () => {
//     const mockItem: GeneralInfoSection = {
//       personClassification: 'Company',
//       economicActivity: 'Finance',
//       maritalStatus: 'Married',
//       marriageType: 'Civil',
//       sector: 'Public',
//       actinverEmployee: false,
//       employeeNumber: undefined,
//       occupation: 'Analyst',
//       profession: 'Economist',
//       companyName: 'FinCorp',
//       jobTitle: 'Financial Analyst',
//       companyPhone: '555-5678',
//       companyWebPage: 'https://fincorp.com',
//       domicilieType: 'House',
//       country: 'Mexico',
//       postalCode: '56789',
//       federalEntity: 'Jalisco',
//       city: 'Guadalajara',
//       municipality: 'Zapopan',
//       colony: 'Centro',
//       street: 'Av. Vallarta',
//       externalNumber: '456',
//       internalNumber: '2A',
//       website: 'https://companypage.com',
//       related: true,
//       relationship: 'Partner',
//       institutionName: 'BankCorp',
//       fiel: '123456',
//       fielExpirationDate: '2026-12-31',
//       banxicoAuthorization: 'Auth123',
//       operatesChanges: true,
//       nonGuaranteedByIPAB: 30,
//       acting: false,
//       hasSupplier: true,
//     };

//     service.setGeneralInfoItem(mockItem);
//     service.clearGeneralInfoItem();

//     const result = service.getGeneralInfoItem();
//     expect(result).toBeNull();
//   });

//   it('should return readonly signal for generalInfoItem', () => {
//     const readonlySignal = service.generalInfoItem;
//     expect(readonlySignal).toBeTruthy();
//   });
//   */
// });
