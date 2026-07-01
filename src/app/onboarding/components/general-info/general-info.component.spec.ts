// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { of, throwError } from 'rxjs';
// import { GeneralInfoComponent } from './general-info.component';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
// import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
// import { MatSelectChange } from '@angular/material/select';
// import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/form-messages';

// class MockCatalogsService {
//   getCountry = jasmine.createSpy().and.returnValue(of([{country: "MEXICO", countryId: "MX", countryCode: "52"},
//     {country: "ESTADOS UNIDOS", countryId: "US", countryCode: "1"}]));
//   getPersonType = jasmine.createSpy().and.returnValue(of());
//   getEconomicActivity = jasmine.createSpy().and.returnValue(of());
//   getOccupations = jasmine.createSpy().and.returnValue(of());
//   getMaritalStatus = jasmine.createSpy().and.returnValue(of());
//   getMarriageType = jasmine.createSpy().and.returnValue(of());
//   getRelationships = jasmine.createSpy().and.returnValue(of());
// }
// class MockNotificationsService {
//   success = jasmine.createSpy();
//   error = jasmine.createSpy();
// }
// class MockStorageService {
//   getGeneralInfoItem = jasmine.createSpy().and.returnValue({
//     personClassification: '',
//     economicActivity: 'string',
//     maritalStatus: 'CASADO/A',
//     marriageType: 'string',
//     sector: 'string',
//     actinverEmployee: true,
//     employeeNumber: 'string',
//     occupation: 'EMPLEADO',

//     profession: 'string',
//     companyName: 'string',
//     jobTitle: 'string',
//     companyPhone: 'string',
//     //companyWebPage: 'string',

//     domicilieType: 'string',
//     country: 'string',
//     postalCode: 'string',

//     federalEntity: 'string',
//     city: 'string',
//     municipality: 'string',
//     colony: 'string',

//     street: 'string',
//     externalNumber: 'string',
//     internalNumber: 'string',

//     website: 'string',

//     related: true,
//     relationship: 'string',
//     institutionName: 'string',
//     fiel: 'string',
//     fielExpirationDate: 'string',
//     operatesChanges: true,
//     banxicoAuthorization: 'string',
//     nonGuaranteedByIPAB: 1,
//     acting: true,
//     hasSupplier: true,
//   });
//   setGeneralInfoItem = jasmine.createSpy();
// }
// class MockUnsavedChangesService {
//   setUnsavedChanges = jasmine.createSpy();
// }
// class MockCheckpointService {
//   saveCheckpoint = jasmine.createSpy().and.returnValue(of({}));
// }
// class MockAddressSectionComponent {
//   onSubmit = jasmine.createSpy().and.returnValue(Promise.resolve({
//     addressType: 'DOMICILIO',
//     country: 'MX',
//     postalCode: '12345',
//     federalEntity: 'CDMX',
//     city: 'Ciudad de México',
//     municipality: 'Benito Juárez',
//     neighborhood: 'Centro',
//     street: 'Av. Reforma',
//     externalNumber: '100',
//     internalNumber: '101'
//   }));
// }

// describe('GeneralInfoComponent', () => {
//   let component: GeneralInfoComponent;
//   let fixture: ComponentFixture<GeneralInfoComponent>;
//   let notificationService: MockNotificationsService;
//   let storageService: MockStorageService;
//   let checkpointService: MockCheckpointService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [GeneralInfoComponent],
//       imports: [ReactiveFormsModule],
//       providers: [
//         { provide: CatalogsService, useClass: MockCatalogsService },
//         { provide: NotificationsService, useClass: MockNotificationsService },
//         { provide: GeneralInfoStorageService, useClass: MockStorageService },
//         { provide: UnsavedChangesService, useClass: MockUnsavedChangesService },
//         { provide: CheckpointService, useClass: MockCheckpointService }
//       ]
//     })
//       .overrideComponent(GeneralInfoComponent, {
//         set: { template: '' }
//       })
//       .compileComponents();

//     fixture = TestBed.createComponent(GeneralInfoComponent);
//     component = fixture.componentInstance;

//     component.addressSectionComponent = new MockAddressSectionComponent() as any;

//     notificationService = TestBed.inject(NotificationsService) as any;
//     storageService = TestBed.inject(GeneralInfoStorageService) as any;
//     checkpointService = TestBed.inject(CheckpointService) as any;

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should mark actinverEmployeeNumber required if actinverEmployee is "yes"', () => {
//     const actinverCtrl = component.form.get('actinverEmployee');
//     const numCtrl = component.form.get('actinverEmployeeNumber');

//     actinverCtrl?.setValue('yes');
//     expect(numCtrl?.validator).toBeTruthy();
//   });

//   it('should clear actinverEmployeeNumber if actinverEmployee is not "yes"', () => {
//     const actinverCtrl = component.form.get('actinverEmployee');
//     const numCtrl = component.form.get('actinverEmployeeNumber');

//     actinverCtrl?.setValue('no');
//     expect(numCtrl?.value).toBe('');
//   });

//   it('should require maritalType if civilStatus is CASADO/A', () => {
//     component.form.get('civilStatus')?.setValue('CASADO/A');
//     const maritalCtrl = component.form.get('maritalType');
//     expect(maritalCtrl?.validator).toBeTruthy();
//     expect(component.showExpiration).toBeTrue();
//   });

//   it('should require profession and webPage if ocupation is EMPLEADO', () => {
//     component.form.get('ocupation')?.setValue('EMPLEADO');
//     const profCtrl = component.form.get('profession');
//     const webCtrl = component.form.get('webPage');
//     expect(profCtrl?.validator).toBeTruthy();
//     expect(webCtrl?.validator).toBeTruthy();
//   });

//   it('should require expirationFiel if fiel has value', () => {
//     component.form.get('fiel')?.setValue('abc123');
//     const expCtrl = component.form.get('expirationFiel');
//     expect(expCtrl?.validator).toBeTruthy();
//     expect(component.showExpiration).toBeTrue();
//   });

//   it('should call checkpoint.saveCheckpoint on valid submit', async () => {

//     component.addressSectionComponent = {
//       onSubmit: jasmine.createSpy().and.returnValue(Promise.resolve({
//         addressType: 'DOMICILIO',
//         country: 'MX',
//         postalCode: '12345',
//         federalEntity: 'CDMX',
//         city: 'Ciudad de México',
//         municipality: 'Benito Juárez',
//         neighborhood: 'Centro',
//         street: 'Av. Reforma',
//         externalNumber: '100',
//         internalNumber: '101'
//       }))
//     } as Partial<AddressSectionComponent> as AddressSectionComponent;

//     component.form.patchValue({
//       personClasification: 'p',
//       economicActivity: 'e',
//       ocupation: 'o',
//       sector: 's',
//       actinverEmployee: 'no',
//       civilStatus: 'SOLTERO',
//       maritalType: '',
//       profession: 'prof',
//       isParentOfEmployee: 'no',
//       isOwnAccountAct: 'yes',
//       haveResourceProvider: 'no'
//     });

//     await component.onSubmit();

//     expect(component.addressSectionComponent.onSubmit).toHaveBeenCalled();
//     expect(checkpointService.saveCheckpoint).toHaveBeenCalled();
//     expect(notificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//     expect(storageService.setGeneralInfoItem).toHaveBeenCalled();
//   });

//   it('should show error with valid address submit', async () => {

//     component.addressSectionComponent = {
//       onSubmit: jasmine.createSpy().and.returnValue(Promise.resolve(null
//       ))
//     } as Partial<AddressSectionComponent> as AddressSectionComponent;

//     component.form.patchValue({
//       personClasification: 'p',
//       economicActivity: 'e',
//       ocupation: 'o',
//       sector: 's',
//       actinverEmployee: 'no',
//       civilStatus: 'SOLTERO',
//       maritalType: '',
//       profession: 'prof',
//       isParentOfEmployee: 'no',
//       isOwnAccountAct: 'yes',
//       haveResourceProvider: 'no'
//     });

//     await component.onSubmit();
//     expect(notificationService.error).not.toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//   });

//   it('should show error if checkpoint.saveCheckpoint fails', async () => {
//     checkpointService.saveCheckpoint.and.returnValue(throwError(() => new Error('fail')));
//     component.addressSectionComponent = {
//       onSubmit: jasmine.createSpy().and.returnValue(Promise.resolve({
//         addressType: 'DOMICILIO',
//         country: 'MX',
//         postalCode: '12345',
//         federalEntity: 'CDMX',
//         city: 'Ciudad de México',
//         municipality: 'Benito Juárez',
//         neighborhood: 'Centro',
//         street: 'Av. Reforma',
//         externalNumber: '100',
//         internalNumber: '101'
//       }))
//     } as Partial<AddressSectionComponent> as AddressSectionComponent;
//     component.form.patchValue({
//       personClasification: 'p',
//       economicActivity: 'e',
//       ocupation: 'o',
//       sector: 's',
//       actinverEmployee: 'no',
//       civilStatus: 'SOLTERO',
//       maritalType: '',
//       profession: 'prof',
//       isParentOfEmployee: 'no',
//       isOwnAccountAct: 'yes',
//       haveResourceProvider: 'no'
//     });

//     await component.onSubmit();

//     expect(notificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//   });

//   it('should show validation errors on invalid submit', async () => {
//     component.form.reset();
//     await component.onSubmit();
//     expect(notificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
//   });

//   it('should toggle isInMarriage signal on onMaritalStatusChange', () => {
//     component.onMaritalStatusChange({ value: 'CASADO/A' } as MatSelectChange);
//     expect(component.isInMarriage()).toBeTrue();

//     component.onMaritalStatusChange({ value: 'SOLTERO' } as MatSelectChange);
//     expect(component.isInMarriage()).toBeFalse();
//   });

//   it('should toggle isEmployee signal on onOcupationChange', () => {
//     component.onOcupationChange({ value: 'EMPLEADO' } as MatSelectChange);
//     expect(component.isEmployee()).toBeTrue();

//     component.onOcupationChange({ value: 'OTRO' } as MatSelectChange);
//     expect(component.isEmployee()).toBeFalse();
//   });
// });
