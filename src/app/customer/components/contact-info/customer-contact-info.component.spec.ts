// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CustomerContactInfoComponent } from './customer-contact-info.component';
// import { CustomerIdentificationSectionComponent } from '../../../../../../../../../../../../components/sections/identification-section/customer-identification-section.component';
// import { CustomerMailSectionComponent } from '../../../../../../../../../../../../components/sections/mail-section/customer-mail-section.component';
// import { CustomerPhoneSectionComponent } from '../../../../../../../../../../../../components/sections/phone-section/customer-phone-section.component';
// import { CustomerNotificationsService } from '../../services/customer-notifications.service';
// import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
// import { of, throwError } from 'rxjs';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
// import { CustomerOtcService } from '../../services/customer-otc.service';
// import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/customer-form-messages';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatInputModule } from '@angular/material/input';
// import { CustomerIndentificationAndContactInformation } from '../../models/customer-identification-and-contact';
// import { CustomerIdentificationAndContactService } from '../../services/storage-services/customer-identification-and-contact.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { SharedModule } from '../../../shared/shared.module';
// import { CoreModule } from '../../../core/core.module';
// import { MsalService, MsalBroadcastService } from '@azure/msal-angular';

// describe('CustomerContactInfoComponent', () => {
//   let component: CustomerContactInfoComponent;
//   let fixture: ComponentFixture<CustomerContactInfoComponent>;
//   let mockNotificationService: jasmine.SpyObj<CustomerNotificationsService>;
//   let mockCheckpointService: jasmine.SpyObj<CustomerCheckpointService>;
//   let mockPageStorageService: jasmine.SpyObj<CustomerIdentificationAndContactService>;

//   beforeEach(async () => {
//     mockNotificationService = jasmine.createSpyObj('CustomerNotificationsService', ['success', 'error']);
//     mockCheckpointService = jasmine.createSpyObj('CustomerCheckpointService', ['saveCheckpoint']);
//     mockPageStorageService = jasmine.createSpyObj('CustomerIdentificationAndContactService', ['getIdentificationAndContactInfo', 'setIdentificationAndContactInfo']);


//     const mockCatalogsService = {
//       getCatalog: jasmine.createSpy('getCatalog').and.callFake(() => of([]))
//     };
//     const mockOtcService = {
//       otcOperation: jasmine.createSpy('otcOperation')
//     }

//     await TestBed.configureTestingModule({
//       imports: [
//         ReactiveFormsModule,
//         MatTableModule,
//         MatSelectModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatInputModule,
//         BrowserAnimationsModule,
//         HttpClientTestingModule,
//         SharedModule,
//         CoreModule
//       ],
//       declarations: [
//         CustomerContactInfoComponent,
//         CustomerIdentificationSectionComponent,
//         CustomerMailSectionComponent,
//         CustomerPhoneSectionComponent
//       ],
//       providers: [
//         { provide: CustomerNotificationsService, useValue: mockNotificationService },
//         { provide: CustomerCheckpointService, useValue: mockCheckpointService },
//         { provide: CustomerCatalogsService, useValue: mockCatalogsService },
//         { provide: CustomerOtcService, useValue: mockOtcService},
//         { provide: CustomerIdentificationAndContactService, useValue: mockPageStorageService },
//         { provide: MsalService, useValue: {} },
//         { provide: MsalBroadcastService, useValue: {} }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerContactInfoComponent);
//     component = fixture.componentInstance;

//     component.identificationSection = {
//       identificationList: () => [
//         { identificationType: 'CREDENCIAL PARA VOTAR', identificationCountry: 'MX', identificationNumber: '123', identificationExpDate: '2025-12-31' }
//       ],
//       resetModified: () => {}
//     } as unknown as CustomerIdentificationSectionComponent;

//     component.phoneSection = {
//       phoneList: () => [
//         { CustomerPhoneType: '1', phoneCountry: 'MX', phoneCodeArea: '55', phone: '12345678', phoneExtension: '', phoneNotification: true }
//       ],
//       resetModified: () => {}
//     } as unknown as CustomerPhoneSectionComponent;

//     component.mailSection = {
//       mailList: () => [
//         { mail: 'test@mail.com', mailNotification: true }
//       ],
//       resetModified: () => {}
//     } as unknown as CustomerMailSectionComponent;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load initial data when pageStorageService returns data', () => {
//     const fakeData: CustomerIndentificationAndContactInformation = {
//       identifications: [{ identificationType: 'CREDENCIAL PARA VOTAR' }] as any,
//       manifestLetter: true,
//       phones: [{ CustomerPhoneType: '1' }] as any,
//       emails: [{ mail: 'test@mail.com' }] as any,
//     };

//     mockPageStorageService.getIdentificationAndContactInfo.and.returnValue(fakeData);

//     component.ngOnInit();

//     expect(component.initialData).toEqual(fakeData);
//     expect(component.identificationSaved).toEqual(fakeData.identifications);
//     expect(component.phoneSaved).toEqual(fakeData.phones);
//     expect(component.mailSaved).toEqual(fakeData.emails);
//     expect(component.manifestLetter()).toBeTrue();
//   });

//   it('should call notification when manifest letter is checked', () => {
//     const event = { target: { checked: true } } as unknown as Event;
//     component.checkManifestLetter(event);
//     expect(component.manifestLetter()).toBeTrue();
//     expect(mockNotificationService.success).toHaveBeenCalled();
//   });

//   it('should save data successfully when all conditions are met', () => {
//     component.identificationSection = {
//       identificationList: () => [{ identificationType: 'CREDENCIAL PARA VOTAR' }],
//       resetModified: () => {}
//     } as any;
//     component.phoneSection = {
//       phoneList: () => [{ CustomerPhoneType: '1' }],
//       resetModified: () => {}
//     } as any;
//     component.mailSection = {
//       mailList: () => [{ mail: 'test@mail.com', mailNotification: true }],
//       resetModified: () => {}
//     } as any;

//     mockCheckpointService.saveCheckpoint.and.returnValue(of({ result: 'ok' }));

//     component.save();
//     expect(mockCheckpointService.saveCheckpoint).toHaveBeenCalledTimes(1);
//     expect(mockNotificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//   });

//   it('should show error if information is missing', () => {
//     component.identificationSection = {
//       identificationList: () => [{ identificationType: 'CREDENCIAL PARA VOTAR' }],
//       resetModified: () => {}
//     } as any;
//     component.phoneSection = {
//       phoneList: () => [],
//       resetModified: () => {}
//     } as any;
//     component.mailSection = {
//       mailList: () => [],
//       resetModified: () => {}
//     } as any;
//     component.manifestLetter.set(false);
//     component.save();
//     expect(mockNotificationService.error).toHaveBeenCalledWith('Se debe Proporcionar al Menos un Teléfono y/o un Correo Electrónico en Caso Contrario, Marcar el Check Carta Manifiesto');
//   });

//   it('should handle error from customer-checkpoint-core.service', () => {
//     component.identificationSection = {
//       identificationList: () => [{ identificationType: 'CREDENCIAL PARA VOTAR' }],
//       resetModified: () => {}
//     } as any;
//     component.phoneSection = {
//       phoneList: () => [{ CustomerPhoneType: '1' }],
//       resetModified: () => {}
//     } as any;
//     component.mailSection = {
//       mailList: () => [{ mail: 'test@mail.com', mailNotification: true }],
//       resetModified: () => {}
//     } as any;

//     mockCheckpointService.saveCheckpoint.and.returnValue(of({ result: 'ok' }));
//     mockCheckpointService.saveCheckpoint.and.returnValue(throwError(() => new Error('fail')));
//     component.manifestLetter.set(false);
//     component.save();
//     expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//   });

//   describe('checkDisableManifest', () => {
//     it('should return true if any identification is CREDENCIAL PARA VOTAR', () => {
//       component.identificationSection = {
//         identificationList: () => [
//           { identificationType: 'CREDENCIAL PARA VOTAR', identificationCountry: 'MX', identificationNumber: '123', identificationExpDate: '2025-12-31' }
//         ],
//         resetModified: () => {}
//       } as unknown as CustomerIdentificationSectionComponent;

//       expect(component.checkDisableManifest()).toBeTrue();
//     });

//     it('should return true if there are less than 2 identifications', () => {
//       component.identificationSection = {
//         identificationList: () => [
//           { identificationType: 'PASAPORTE', identificationCountry: 'MX', identificationNumber: '456', identificationExpDate: '2026-01-01' }
//         ],
//         resetModified: () => {}
//       } as unknown as CustomerIdentificationSectionComponent;

//       expect(component.checkDisableManifest()).toBeTrue();
//     });

//     it('should return false if there are 2 or more identifications and none is CREDENCIAL PARA VOTAR', () => {
//       component.identificationSection = {
//         identificationList: () => [
//           { identificationType: 'PASAPORTE', identificationCountry: 'MX', identificationNumber: '456', identificationExpDate: '2026-01-01' },
//           { identificationType: 'LICENCIA DE CONDUCIR', identificationCountry: 'MX', identificationNumber: '789', identificationExpDate: '2025-12-31' }
//         ],
//         resetModified: () => {}
//       } as unknown as CustomerIdentificationSectionComponent;

//       expect(component.checkDisableManifest()).toBeFalse();
//     });
//   });
// });







