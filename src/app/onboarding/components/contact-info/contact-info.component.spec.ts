// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ContactInfoComponent } from './contact-info.component';
// import { IdentificationSectionComponent } from '../../../shared/components/sections/identification-section/identification-section.component';
// import { MailSectionComponent } from '../../../shared/components/sections/mail-section/mail-section.component';
// import { PhoneSectionComponent } from '../../../shared/components/sections/phone-section/phone-section.component';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { of, throwError } from 'rxjs';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { OtcService } from '../../../shared/services/otc.service';
// import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatInputModule } from '@angular/material/input';
// import { IndentificationAndContactInformation } from '../../models/identification-and-contact';
// import { IdentificationAndContactService } from '../../../shared/services/storage-services/identification-and-contact.service';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { SharedModule } from '../../../shared/shared.module';
// import { CoreModule } from '../../../core/core.module';
// import { MsalService, MsalBroadcastService } from '@azure/msal-angular';

// describe('ContactInfoComponent', () => {
//   let component: ContactInfoComponent;
//   let fixture: ComponentFixture<ContactInfoComponent>;
//   let mockNotificationService: jasmine.SpyObj<NotificationsService>;
//   let mockCheckpointService: jasmine.SpyObj<CheckpointService>;
//   let mockPageStorageService: jasmine.SpyObj<IdentificationAndContactService>;

//   beforeEach(async () => {
//     mockNotificationService = jasmine.createSpyObj('NotificationsService', ['success', 'error']);
//     mockCheckpointService = jasmine.createSpyObj('CheckpointService', ['saveCheckpoint']);
//     mockPageStorageService = jasmine.createSpyObj('IdentificationAndContactService', ['getIdentificationAndContactInfo', 'setIdentificationAndContactInfo']);


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
//         ContactInfoComponent,
//         IdentificationSectionComponent,
//         MailSectionComponent,
//         PhoneSectionComponent
//       ],
//       providers: [
//         { provide: NotificationsService, useValue: mockNotificationService },
//         { provide: CheckpointService, useValue: mockCheckpointService },
//         { provide: CatalogsService, useValue: mockCatalogsService },
//         { provide: OtcService, useValue: mockOtcService},
//         { provide: IdentificationAndContactService, useValue: mockPageStorageService },
//         { provide: MsalService, useValue: {} },
//         { provide: MsalBroadcastService, useValue: {} }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(ContactInfoComponent);
//     component = fixture.componentInstance;

//     component.identificationSection = {
//       identificationList: () => [
//         { identificationType: 'CREDENCIAL PARA VOTAR', identificationCountry: 'MX', identificationNumber: '123', identificationExpDate: '2025-12-31' }
//       ],
//       resetModified: () => {}
//     } as unknown as IdentificationSectionComponent;

//     component.phoneSection = {
//       phoneList: () => [
//         { phoneType: '1', phoneCountry: 'MX', phoneCodeArea: '55', phone: '12345678', phoneExtension: '', phoneNotification: true }
//       ],
//       resetModified: () => {}
//     } as unknown as PhoneSectionComponent;

//     component.mailSection = {
//       mailList: () => [
//         { mail: 'test@mail.com', mailNotification: true }
//       ],
//       resetModified: () => {}
//     } as unknown as MailSectionComponent;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load initial data when pageStorageService returns data', () => {
//     const fakeData: IndentificationAndContactInformation = {
//       identifications: [{ identificationType: 'CREDENCIAL PARA VOTAR' }] as any,
//       manifestLetter: true,
//       phones: [{ phoneType: '1' }] as any,
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
//       phoneList: () => [{ phoneType: '1' }],
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

//   it('should handle error from checkpoint service', () => {
//     component.identificationSection = {
//       identificationList: () => [{ identificationType: 'CREDENCIAL PARA VOTAR' }],
//       resetModified: () => {}
//     } as any;
//     component.phoneSection = {
//       phoneList: () => [{ phoneType: '1' }],
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
//       } as unknown as IdentificationSectionComponent;

//       expect(component.checkDisableManifest()).toBeTrue();
//     });

//     it('should return true if there are less than 2 identifications', () => {
//       component.identificationSection = {
//         identificationList: () => [
//           { identificationType: 'PASAPORTE', identificationCountry: 'MX', identificationNumber: '456', identificationExpDate: '2026-01-01' }
//         ],
//         resetModified: () => {}
//       } as unknown as IdentificationSectionComponent;

//       expect(component.checkDisableManifest()).toBeTrue();
//     });

//     it('should return false if there are 2 or more identifications and none is CREDENCIAL PARA VOTAR', () => {
//       component.identificationSection = {
//         identificationList: () => [
//           { identificationType: 'PASAPORTE', identificationCountry: 'MX', identificationNumber: '456', identificationExpDate: '2026-01-01' },
//           { identificationType: 'LICENCIA DE CONDUCIR', identificationCountry: 'MX', identificationNumber: '789', identificationExpDate: '2025-12-31' }
//         ],
//         resetModified: () => {}
//       } as unknown as IdentificationSectionComponent;

//       expect(component.checkDisableManifest()).toBeFalse();
//     });
//   });
// });
