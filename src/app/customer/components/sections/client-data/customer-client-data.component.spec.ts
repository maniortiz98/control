// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { CustomerClientDataComponent } from './client-data.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { SharedModule } from '../../../shared.module';
// import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
// import { CustomerHomonymsService } from '../../../services/customer-homonyms.service';
// import { CustomerModalFormService } from '../../../services/customer-modal-form.service';
// import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
// import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
// import { CustomerFirstDataClientService } from '../../../services/storage-services/customer-first-data-client.service';
// import { CustomerWatchlistService } from '../../../services/customer-watchlist.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientModule } from '@angular/common/http';
// import { of } from 'rxjs';
// import { CustomerSTRINGS } from '../../../../onboarding/constants/constants';
// import { CustomerWatchListResponse } from '../../../models/customer-watch-list';
// import { CustomerDataClient } from '../../../models/client-data';

// describe('CustomerClientDataComponent', () => {
//   let component: CustomerClientDataComponent;
//   let fixture: ComponentFixture<CustomerClientDataComponent>;
//   let catalogService: jasmine.SpyObj<CustomerCatalogsService>;
//   let notificationService: jasmine.SpyObj<CustomerNotificationsService>;


//   beforeEach(async () => {
//     const catalogServiceSpy = jasmine.createSpyObj('CustomerCatalogsService', ['getCatalog']);
//     const notificationServiceSpy = jasmine.createSpyObj('CustomerNotificationsService', ['error']);
//     await TestBed.configureTestingModule({
//       declarations: [CustomerClientDataComponent],
//       imports: [
//         ReactiveFormsModule,
//         SharedModule,
//         RouterTestingModule,
//         HttpClientModule
//       ],
//       providers: [
//         { provide: CustomerCatalogsService, useValue: catalogServiceSpy },
//         { provide: CustomerNotificationsService, useValue: notificationServiceSpy },
//         CustomerNotificationsService,
//         CustomerWatchlistService,
//         CustomerNotificationModalService,
//         CustomerFirstDataClientService,
//         CustomerHomonymsService,
//         CustomerModalFormService
//       ]
//     }).compileComponents();

//     catalogService = TestBed.inject(CustomerCatalogsService) as jasmine.SpyObj<CustomerCatalogsService>;
//     notificationService = TestBed.inject(CustomerNotificationsService) as jasmine.SpyObj<CustomerNotificationsService>;

//     catalogService.getCatalog.and.callFake((catalog: string) => {
//       switch (catalog) {
//         case CustomerSTRINGS.COUNTRY:
//           return of([{ "countryId": "MX", "countryName": "MEXICO", "countryCode": 52 }, { "countryId": "US", "countryName": "UNITED STATES", "countryCode": 1 }, { "countryId": "CA", "countryName": "CANADA", "countryCode": 1 }, { "countryId": "BR", "countryName": "BRAZIL", "countryCode": 55 }, { "countryId": "AR", "countryName": "ARGENTINA", "countryCode": 54 }, { "countryId": "CO", "countryName": "COLOMBIA", "countryCode": 57 }]);
//         case CustomerSTRINGS.NATIONALITY:
//           return of([{ "nationalityId": "MX", "nationality": "MEXICANA" }, { "nationalityId": "US", "nationality": "AMERICANA" }, { "nationalityId": "CA", "nationality": "CANADIENSE" }, { "nationalityId": "BR", "nationality": "BRASILEÑA" }, { "nationalityId": "AR", "nationality": "ARGENTINA" }, { "nationalityId": "CO", "nationality": "COLOMBIANA" }]);
//         case CustomerSTRINGS.ENTITY:
//           return of([{ "mandt": "200", "land1": "MX", "bland": "DF", "bezei": "CIUDAD DE MEXICO", "federalEntityId": 1 }]);
//         case 'maritalStatus':
//           return of([{ "client": "200", "maritalStatusId": "1", "maritalStatus": "SOLTERO/A" }, { "client": "200", "maritalStatusId": "2", "maritalStatus": "CASADO/A" }]);
//         default:
//           return of([]);
//       }
//     });

//     fixture = TestBed.createComponent(CustomerClientDataComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should patch form values when data is provided', () => {
//     const mockData = {
//       curp: "GOLL800101HDFLRL04",
//       foreignerWithoutCurp: false,
//       rfc: "GOLL800101ASD",
//       firstName: "LUIS",
//       middleName: "",
//       dateOfBirth: "1980-01-01",
//       firstLastName: "GOMEZ",
//       secondLastName: "LOPEZ",
//       gender: "H",
//       maritalStatus: "",
//       nationality: "MX",
//       countryOfBirth: "MX",
//       stateOfBirth: "DF",
//     };

//     component.data = mockData;
//     component.ngOnInit();

//     expect(component.profileForm.get('curp')?.value).toBe(mockData.curp.toUpperCase());
//     expect(component.foreign()).toBe(false);
//     expect(component.profileForm.get('foreignerWithoutCurp')?.value).toBe(mockData.foreignerWithoutCurp);
//     expect(component.profileForm.get('rfc')?.value).toBe(mockData.rfc.toUpperCase());
//     expect(component.profileForm.get('firstName')?.value).toBe(mockData.firstName.toUpperCase());
//     expect(component.profileForm.get('middleName')?.value).toBe(mockData.middleName.toUpperCase());
//     expect(component.profileForm.get('dateOfBirth')?.value).toBe(mockData.dateOfBirth);
//     expect(component.profileForm.get('firstLastName')?.value).toBe(mockData.firstLastName.toUpperCase());
//     expect(component.profileForm.get('secondLastName')?.value).toBe(mockData.secondLastName.toUpperCase());
//     expect(component.profileForm.get('gender')?.value).toBe(mockData.gender);
//     expect(component.profileForm.get('maritalStatus')?.value).toBe(mockData.maritalStatus);
//     expect(component.profileForm.get('nationality')?.value).toBe(mockData.nationality.toUpperCase());
//     expect(component.profileForm.get('countryOfBirth')?.value).toBe(mockData.countryOfBirth.toUpperCase());
//     expect(component.profileForm.get('stateOfBirth')?.value).toBe(mockData.stateOfBirth.toUpperCase());
//   });

//   it('should patch form values when data is provided', () => {
//     const mockData : CustomerDataClient = {
//       curp: "GOLL800101HDFLRL04",
//       foreignerWithoutCurp: false,
//       rfc: "GOLL800101ASD",
//       firstName: "LUIS",
//       middleName: "",
//       dateOfBirth: "1980-01-01",
//       firstLastName: "GOMEZ",
//       secondLastName: "LOPEZ",
//       gender: "H",
//       maritalStatus: "",
//       nationality: "MX",
//       countryOfBirth: "MX",
//       stateOfBirth: "DF",
//       ppe: false,
//       bankAreaTypeId: '',
//       contraTypeId: '',
//       typeContractSubtypeId: ''
//     };

//     component.setClientData(mockData);
//     component.ngOnInit();

//     expect(component.profileForm.get('curp')?.value).toBe(mockData.curp.toUpperCase());
//     expect(component.foreign()).toBe(false);
//     expect(component.profileForm.get('foreignerWithoutCurp')?.value).toBe(mockData.foreignerWithoutCurp);
//     expect(component.profileForm.get('rfc')?.value).toBe(mockData.rfc.toUpperCase());
//     expect(component.profileForm.get('firstName')?.value).toBe(mockData.firstName.toUpperCase());
//     expect(component.profileForm.get('middleName')?.value).toBe(mockData.middleName.toUpperCase());
//     expect(component.profileForm.get('dateOfBirth')?.value).toBe(mockData.dateOfBirth);
//     expect(component.profileForm.get('firstLastName')?.value).toBe(mockData.firstLastName.toUpperCase());
//     expect(component.profileForm.get('secondLastName')?.value).toBe(mockData.secondLastName.toUpperCase());
//     expect(component.profileForm.get('gender')?.value).toBe(mockData.gender);
//     expect(component.profileForm.get('maritalStatus')?.value).toBe(mockData.maritalStatus);
//     expect(component.profileForm.get('nationality')?.value).toBe(mockData.nationality.toUpperCase());
//     expect(component.profileForm.get('countryOfBirth')?.value).toBe(mockData.countryOfBirth.toUpperCase());
//     expect(component.profileForm.get('stateOfBirth')?.value).toBe(mockData.stateOfBirth.toUpperCase());
//   });

//     it('should patch form values when data is provided', () => {
//     const mockData : CustomerDataClient = {
//       curp: "GOLL800101HNELRL04",
//       foreignerWithoutCurp: false,
//       rfc: "GOLL800101ASD",
//       firstName: "LUIS",
//       middleName: "",
//       dateOfBirth: "1980-01-01",
//       firstLastName: "GOMEZ",
//       secondLastName: "LOPEZ",
//       gender: "H",
//       maritalStatus: "",
//       nationality: "US",
//       countryOfBirth: "US",
//       stateOfBirth: "US",
//       ppe: false,
//       bankAreaTypeId: '',
//       contraTypeId: '',
//       typeContractSubtypeId: ''
//     };

//     component.setClientData(mockData);


//     expect(component.profileForm.get('curp')?.value).toBe(mockData.curp.toUpperCase());
//     expect(component.foreign()).toBe(true);
//     expect(component.profileForm.get('foreignerWithoutCurp')?.value).toBe(mockData.foreignerWithoutCurp);
//     expect(component.profileForm.get('rfc')?.value).toBe(mockData.rfc.toUpperCase());
//     expect(component.profileForm.get('firstName')?.value).toBe(mockData.firstName.toUpperCase());
//     expect(component.profileForm.get('middleName')?.value).toBe(mockData.middleName.toUpperCase());
//     expect(component.profileForm.get('dateOfBirth')?.value).toBe(mockData.dateOfBirth);
//     expect(component.profileForm.get('firstLastName')?.value).toBe(mockData.firstLastName.toUpperCase());
//     expect(component.profileForm.get('secondLastName')?.value).toBe(mockData.secondLastName.toUpperCase());
//     expect(component.profileForm.get('gender')?.value).toBe(mockData.gender);
//     expect(component.profileForm.get('maritalStatus')?.value).toBe(mockData.maritalStatus);
//     expect(component.profileForm.get('nationality')?.value).toBe(mockData.nationality.toUpperCase());
//     expect(component.profileForm.get('countryOfBirth')?.value).toBe(mockData.countryOfBirth.toUpperCase());
//     expect(component.profileForm.get('stateOfBirth')?.value).toBe(mockData.stateOfBirth.toUpperCase());
//   });


//    it('should patch form values when data is provided', () => {
//     const mockData : CustomerDataClient = {
//       curp: "",
//       foreignerWithoutCurp: true,
//       rfc: "GOLL800101ASD",
//       firstName: "LUIS",
//       middleName: "",
//       dateOfBirth: "1980-01-01",
//       firstLastName: "GOMEZ",
//       secondLastName: "LOPEZ",
//       gender: "H",
//       maritalStatus: "",
//       nationality: "US",
//       countryOfBirth: "US",
//       stateOfBirth: "WDC",
//       ppe: false,
//       bankAreaTypeId: '',
//       contraTypeId: '',
//       typeContractSubtypeId: ''
//     };

//     component.setClientData(mockData);


//     expect(component.profileForm.get('curp')?.value).toBe(mockData.curp.toUpperCase());
//     expect(component.foreign()).toBe(false);
//     expect(component.profileForm.get('foreignerWithoutCurp')?.value).toBe(mockData.foreignerWithoutCurp);
//     expect(component.profileForm.get('rfc')?.value).toBe(mockData.rfc.toUpperCase());
//     expect(component.profileForm.get('firstName')?.value).toBe(mockData.firstName.toUpperCase());
//     expect(component.profileForm.get('middleName')?.value).toBe(mockData.middleName.toUpperCase());
//     expect(component.profileForm.get('dateOfBirth')?.value).toBe(mockData.dateOfBirth);
//     expect(component.profileForm.get('firstLastName')?.value).toBe(mockData.firstLastName.toUpperCase());
//     expect(component.profileForm.get('secondLastName')?.value).toBe(mockData.secondLastName.toUpperCase());
//     expect(component.profileForm.get('gender')?.value).toBe(mockData.gender);
//     expect(component.profileForm.get('maritalStatus')?.value).toBe(mockData.maritalStatus);
//     expect(component.profileForm.get('nationality')?.value).toBe(mockData.nationality.toUpperCase());
//     expect(component.profileForm.get('countryOfBirth')?.value).toBe(mockData.countryOfBirth.toUpperCase());
//     expect(component.profileForm.get('stateOfBirth')?.value).toBe(mockData.stateOfBirth.toUpperCase());
//   });

//   it('should clear date if it is before 1900-01-01', () => {
//     const control = component.profileForm.get('dateOfBirth');
//     control?.setValue('1800-01-01');
//     expect(control?.value).toBe('');
//   });

//   it('should keep date if it is after 1900-01-01', () => {
//     const control = component.profileForm.get('dateOfBirth');
//     control?.setValue('2000-01-01');
//     expect(control?.value).toBe('2000-01-01');
//   });

//   it('should convert control value to uppercase and replace vowels', () => {
//     const controlName = 'firstName';
//     const control = component.profileForm.get(controlName);
//     control?.setValue('Jóhn Dóe');
//     component.toUppercase(controlName);
//     expect(control?.value).toBe('JOHN DOE');
//   });

//   it('should not change value if control does not exist', () => {
//     const controlName = 'nonExistentControl';
//     component.toUppercase(controlName);
//     const control = component.profileForm.get(controlName);
//     expect(control).toBeNull();
//   });

//   it('should correctly combine CURP and RFC', () => {
//     const curp = 'GOLL800101HDFLRL04';
//     const rfc = 'GOLL800101';
//     const result = component.getRFC(rfc, curp);
//     expect(result).toBe('GOLL800101');
//   });

//   it('should handle RFC shorter than 13 characters', () => {
//     const curp = 'GOLL800101HDFLRL04';
//     const rfc = 'GOLL800101ASD';
//     const result = component.getRFC(rfc, curp);
//     expect(result).toBe('GOLL800101ASD');
//   });

//   it('should handle empty RFC and CURP', () => {
//     const curp = '';
//     const rfc = '';
//     const result = component.getRFC(rfc, curp);
//     expect(result).toBe('');
//   });

//   it('should allow alphanumeric keys', () => {
//     const allowedKeys = ['a', 'Z', '0', '9'];
//     allowedKeys.forEach(key => {
//       const event = new KeyboardEvent('keydown', { key });
//       spyOn(event, 'preventDefault');

//       component.allowAlphanumericOnly(event);

//       expect(event.preventDefault).not.toHaveBeenCalled();
//     });
//   });

//   it('should prevent non-alphanumeric keys', () => {
//     const disallowedKeys = ['!', '@', '#', ' '];
//     disallowedKeys.forEach(key => {
//       const event = new KeyboardEvent('keydown', { key });
//       spyOn(event, 'preventDefault');

//       component.allowAlphanumericOnly(event);

//       expect(event.preventDefault).toHaveBeenCalled();
//     });
//   });

//   it('should assign date 18 years ago when opening the calendar', () => {
//     const control = component.profileForm.get('dateOfBirth');
//     control?.setValue('');
//     const today = new Date();
//     const expectedYear = today.getFullYear() - 18;
//     const expectedDate = new Date(`${expectedYear}-01-01`);

//     expect(control?.value).toBe(expectedDate.toISOString().split('T')[0]);
//   });

//   it('should clear date if it is before 1900-01-01', () => {
//     const control = component.profileForm.get('dateOfBirth');
//     control?.setValue('1800-01-01');
//     expect(control?.value).toBe('');
//   });

//   it('should initialize form with default values', () => {
//     const profileForm = component.profileForm;
//     expect(profileForm).toBeTruthy();
//     expect(profileForm.get('curp')?.value).toBe('');
//     expect(profileForm.get('foreignerWithoutCurp')?.value).toBe(false);
//     expect(profileForm.get('rfc')?.value).toBe('');
//   });

//   it('should validate date of birth correctly', () => {
//     const control = component.profileForm.get('dateOfBirth');
//     control?.setValue('1800-01-01');
//     expect(control?.errors).toEqual({ dateVeryOld: true });
//     control?.setValue('2023-01-01');
//     expect(control?.errors).toEqual({ underage: true });
//     control?.setValue('2000-01-01');
//     expect(control?.errors).toBeNull();
//   });

//   it('should convert curp to uppercase', () => {
//     const control = component.profileForm.get('curp');
//     control?.setValue('abcd1234');
//     component.toUppercaseCURP('curp');
//     expect(control?.value).toBe('ABCD1234');
//   });

//   it('should disable curp field when foreignerWithoutCurp is true', () => {
//     component.profileForm.patchValue({ foreignerWithoutCurp: true });
//     expect(component.profileForm.get('curp')?.disabled).toBeFalse();
//   });

//   it('should load curp data correctly', () => {
//     spyOn(component, 'loadCurpData').and.callThrough();
//     component.profileForm.patchValue({ curp: 'VALIDCURP12345678' });
//     component.loadCurpData();
//     expect(component.loadCurpData).toHaveBeenCalled();
//   });

//   it('should fill fields through valid CURP', () => {
//     const validCurp = 'GOLL800101HDFLRL04';
//     component.profileForm.patchValue({ curp: validCurp });
//     component.loadCurpData();
//     expect(component.profileForm.get('gender')?.value).toBe(validCurp.charAt(10));
//     expect(component.profileForm.get('stateOfBirth')?.value).toBe(validCurp.substring(11, 13));
//     expect(component.profileForm.get('dateOfBirth')?.value).toBe(component.getDateOfBirthFromCURP(validCurp));
//     expect(component.foreign()).toBe(false);
//     expect(component.profileForm.get('nationality')?.value).toBe(CustomerSTRINGS.MEXICAN);
//     expect(component.profileForm.get('countryOfBirth')?.value).toBe(CustomerSTRINGS.MEXICO);
//   });

//   it('should handle foreign CURP correctly', () => {
//     const foreignCurp = 'GOLL800101HNELRL04';
//     component.profileForm.patchValue({ curp: foreignCurp });
//     component.loadCurpData();
//     expect(component.foreign()).toBe(true);
//     expect(component.profileForm.get('nationality')?.value).toBe('');
//     expect(component.profileForm.get('countryOfBirth')?.value).toBe('');
//   });

//   it('should patch RFC if valid', () => {
//     const validCurp = 'GOLL800101HDFLRL04';
//     const validRfc = 'GOLL800101';
//     component.profileForm.patchValue({ curp: validCurp, rfc: validRfc });
//     component.loadCurpData();
//     expect(component.profileForm.get('rfc')?.value).toBe(component.getRFC(validRfc, validCurp));
//   });

//   it('should patch RFC from CURP if invalid', () => {
//     const validCurp = 'GOLL800101HDFLRL04';
//     const invalidRfc = 'INVALID';
//     component.profileForm.patchValue({ curp: validCurp, rfc: invalidRfc });
//     component.loadCurpData();
//     expect(component.profileForm.get('rfc')?.value).toBe(validCurp.substring(0, 10));
//   });

//   it('should not change form if CURP is invalid', () => {
//     const invalidCurp = 'INVALIDCURP';
//     component.profileForm.patchValue({ curp: invalidCurp });
//     component.loadCurpData();
//     expect(component.profileForm.get('gender')?.value).toBe('H');
//     expect(component.profileForm.get('stateOfBirth')?.value).toBe('');
//     expect(component.profileForm.get('dateOfBirth')?.value).toBe('');
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: '',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: '',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: ''
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: '',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: '',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'US',
//       countryOfBirth: 'US',
//       stateOfBirth: 'WDC'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'US',
//       countryOfBirth: 'US',
//       stateOfBirth: 'WDC'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD98042',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: '{{{',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD{{{{',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });


//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: '',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '{{{',
//       secondLastName: '',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: '{{{{',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });


//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD200101HDFLRLA4',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '2020-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//    it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1020-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validador()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'ZS'
//     });
//     expect(component.validador()).toBeTrue();
//   });


//     it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: '',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: '',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: ''
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: '',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: '',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'US',
//       countryOfBirth: 'US',
//       stateOfBirth: 'WDC'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'US',
//       countryOfBirth: 'US',
//       stateOfBirth: 'WDC'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD98042',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: '{{{',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD{{{{',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });


//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: '',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '{{{',
//       secondLastName: '',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: '{{{{',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });


//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD200101HDFLRLA4',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '2020-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//    it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1020-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'ZS'
//     });
//     expect(component.validadorPPE()).toBeTrue();
//   });


//     it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: '',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: '',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: ''
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: '',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: '',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'US',
//       countryOfBirth: 'US',
//       stateOfBirth: 'WDC'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'US',
//       countryOfBirth: 'US',
//       stateOfBirth: 'WDC'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       foreignerWithoutCurp: false,
//       curp: '',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD98042',
//       firstName: 'ASD',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: '{{{',
//       middleName: 'Doe',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD{{{{',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: 'ASD',
//       secondLastName: 'BAS',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });


//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: '',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '{{{',
//       secondLastName: '',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: '{{{{',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });


//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD200101HDFLRLA4',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '2020-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//    it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1020-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   it('should validate form inputs', () => {
//     component.profileForm.patchValue({
//       curp: 'AABD980101HDFLRL04',
//       rfc: 'AABD980421',
//       firstName: 'ASD',
//       middleName: 'ASD',
//       dateOfBirth: '1998-01-01',
//       firstLastName: '',
//       secondLastName: 'ASD',
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'ZS'
//     });
//     expect(component.validadorFormComplet()).toBeTrue();
//   });

//   //functions
//   describe('removeExtraSpaces', () => {
//     it('should remove extra spaces from text', () => {
//       const text = 'This  is   a  test';
//       const result = component.removeExtraSpaces(text);

//       expect(result).toBe('This is a test');
//     });

//     it('should handle text with no extra spaces', () => {
//       const text = 'This is a test';
//       const result = component.removeExtraSpaces(text);

//       expect(result).toBe('This is a test');
//     });

//     it('should handle empty text', () => {
//       const text = '';
//       const result = component.removeExtraSpaces(text);

//       expect(result).toBe('');
//     });
//   });

//   describe('findValueIn', () => {
//     it('should return true if PPE is found in matchLists', () => {
//       const list: CustomerWatchListResponse = {
//         matchLists: [{
//           type: 'PPE',
//           companyName: '',
//           name: '',
//           lastname: '',
//           secondLastName: '',
//           tin: 0,
//           curp: '',
//           matchPercentage: 0,
//           personStatus: 0
//         }, {
//           type: 'OTHER',
//           companyName: '',
//           name: '',
//           lastname: '',
//           secondLastName: '',
//           tin: 0,
//           curp: '',
//           matchPercentage: 0,
//           personStatus: 0
//         }],
//         isOnWatchlist: false,
//         step: 0
//       };
//       const result = component.findValueIn(list);

//       expect(result).toBe(true);
//     });

//     it('should return false if PPE is not found in matchLists', () => {
//       const list: CustomerWatchListResponse = {
//         matchLists: [{
//           type: 'OTHER',
//           companyName: '',
//           name: '',
//           lastname: '',
//           secondLastName: '',
//           tin: 0,
//           curp: '',
//           matchPercentage: 0,
//           personStatus: 0
//         }],
//         isOnWatchlist: false,
//         step: 0
//       };
//       const result = component.findValueIn(list);

//       expect(result).toBe(false);
//     });

//     it('should return false if matchLists is empty', () => {
//       const list: CustomerWatchListResponse = {
//         matchLists: [],
//         isOnWatchlist: false,
//         step: 0
//       };
//       const result = component.findValueIn(list);

//       expect(result).toBe(false);
//     });
//   });

//   describe('client', () => {
//     it('should return form raw value as CustomerDataClient', () => {
//       component.profileForm.patchValue({
//         curp: "GOLL800101HDFLRL04",
//         foreignerWithoutCurp: false,
//         rfc: "GOLL800101ASD",
//         firstName: "LUIS",
//         middleName: "",
//         dateOfBirth: "1980-01-01",
//         firstLastName: "GOMEZ",
//         secondLastName: "LOPEZ",
//         gender: "H",
//         maritalStatus: "",
//         nationality: "MX",
//         countryOfBirth: "MX",
//         stateOfBirth: "DF",
//       });

//       const result = component.client();

//       expect(result.curp).toBe('GOLL800101HDFLRL04');
//       expect(result.rfc).toBe('GOLL800101ASD');
//       expect(result.firstName).toBe('LUIS');
//       expect(result.dateOfBirth).toBe('1980-01-01');
//       expect(result.firstLastName).toBe('GOMEZ');
//       expect(result.secondLastName).toBe('LOPEZ');
//       expect(result.gender).toBe('H');
//       expect(result.maritalStatus).toBe('');
//       expect(result.nationality).toBe('MX');
//       expect(result.countryOfBirth).toBe('MX');
//       expect(result.stateOfBirth).toBe('DF');
//     });
//   });




//   it('error in form data 1', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'VALIDCURP12345678',
//       rfc: 'VALIDRFC123',
//       firstName: 'John',
//       middleName: 'Doe',
//       dateOfBirth: '2000-01-01',
//       firstLastName: 'Smith',
//       gender: 'M',
//       maritalStatus: 'Single',
//       nationality: 'Mexican',
//       countryOfBirth: 'Mexico',
//       stateOfBirth: 'State'
//     });
//     const result = await component.submit();
//     expect(result).toBeNull();
//   });

//   it('should handle submit bad', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'VALIDCURP12345678',
//       rfc: 'VALIDRFC123',
//       firstName: 'John',
//       middleName: 'Doe',
//       dateOfBirth: '2000-01-01',
//       firstLastName: 'Smith',
//       gender: 'M',
//       maritalStatus: 'Single',
//       nationality: 'Mexican',
//       countryOfBirth: 'Mexico',
//       stateOfBirth: ''
//     });
//     const result = await component.submit();
//     expect(result).toBeNull();
//   });

//   it('error in form data 2', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL0',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   //Form
//   it('error in form data 3', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL0',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 4', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'ZS'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 5', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101AS',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   // it('error in form data 6', async () => {
//   //   spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//   //   spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//   //   component.profileForm.patchValue({
//   //     curp: 'GOLL800101HDFLRL04',
//   //     rfc: 'GOLL800101ASD',
//   //     firstName: 'UIS',
//   //     middleName: '',
//   //     dateOfBirth: '1980-01-01',
//   //     firstLastName: 'GOMEZ',
//   //     secondLastName: "LOPEZ",
//   //     gender: 'H',
//   //     maritalStatus: '',
//   //     nationality: 'MX',
//   //     countryOfBirth: 'MX',
//   //     stateOfBirth: 'DF'
//   //   });
//   //   const result = await component.submit();

//   //   expect(result).toBeNull();
//   // });

//   it('error in form data 7', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 8', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: '',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 9', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });


//   it('error in form data 10', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: '',
//       secondLastName: "",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 11', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 12', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: ''
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 13', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'NE'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 14', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS{{',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 15', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '{{',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 16', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',
//       secondLastName: "GOMEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 17', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });

//   it('error in form data 18', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL200101HDFLRLA4',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1220-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submit();

//     expect(result).toBeNull();
//   });


//   //PPE
//   it('error in form data 19', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'VALIDCURP12345678',
//       rfc: 'VALIDRFC123',
//       firstName: 'John',
//       middleName: 'Doe',
//       dateOfBirth: '2000-01-01',
//       firstLastName: 'Smith',
//       gender: 'M',
//       maritalStatus: 'Single',
//       nationality: 'Mexican',
//       countryOfBirth: 'Mexico',
//       stateOfBirth: 'State'
//     });
//     const result = await component.submitPPE();
//     expect(result).toBeNull();
//   });

//   it('should handle submitPPE bad', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'VALIDCURP12345678',
//       rfc: 'VALIDRFC123',
//       firstName: 'John',
//       middleName: 'Doe',
//       dateOfBirth: '2000-01-01',
//       firstLastName: 'Smith',
//       gender: 'M',
//       maritalStatus: 'Single',
//       nationality: 'Mexican',
//       countryOfBirth: 'Mexico',
//       stateOfBirth: ''
//     });
//     const result = await component.submitPPE();
//     expect(result).toBeNull();
//   });

//   it('error in form data 20', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL0',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 21', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL0',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 22', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101AS',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 23', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'UIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 24', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 25', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: '',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 26', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });


//   it('error in form data 27', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: '',
//       secondLastName: "",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 28', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 29', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: ''
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 30', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1981-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'NE'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 31', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS{{',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 32', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '{{',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 33', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',
//       secondLastName: "GOMEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 34', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL800101HDFLRL04',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1980-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();

//     expect(result).toBeNull();
//   });

//   it('error in form data 35', async () => {
//     spyOn(component['dataWatchlistService'], 'postData').and.returnValue(of({ step: 0 }));
//     spyOn(component['notificationModalService'], 'error').and.returnValue(Promise.resolve({ value: true, message: 'Error handled' }));
//     component.profileForm.patchValue({
//       curp: 'GOLL200101HDFLRLA4',
//       rfc: 'GOLL800101ASD',
//       firstName: 'LUIS',
//       middleName: '',
//       dateOfBirth: '1220-01-01',
//       firstLastName: 'GOMEZ',
//       secondLastName: "LOPEZ",
//       gender: 'H',
//       maritalStatus: '',
//       nationality: 'MX',
//       countryOfBirth: 'MX',
//       stateOfBirth: 'DF'
//     });
//     const result = await component.submitPPE();
//     expect(result).toBeNull();
//   });
// });









