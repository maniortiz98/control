// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ContactInfoPmComponent } from './contact-info-pm.component';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatInputModule } from '@angular/material/input';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ContactInfoComponent } from '../contact-info/contact-info.component';
// import { MailSectionComponent } from '../../../shared/components/sections/mail-section/mail-section.component';
// import { PhoneSectionComponent } from '../../../shared/components/sections/phone-section/phone-section.component';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { OtcService } from '../../../shared/services/otc.service';
// import { of, throwError } from 'rxjs';
// import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/form-messages';
// import { ContactInformationPm } from '../../models/identification-and-contact';
// import { IdentificationAndContactService } from '../../../shared/services/storage-services/identification-and-contact.service';

// describe('ContactInfoPmComponent', () => {
//   let component: ContactInfoPmComponent;
//   let fixture: ComponentFixture<ContactInfoPmComponent>;
//   let mockNotificationService: jasmine.SpyObj<NotificationsService>;
//   let mockCheckpointService: jasmine.SpyObj<CheckpointService>;
//   let mockPageStorageService: jasmine.SpyObj<IdentificationAndContactService>;

//   beforeEach(async () => {
//     mockNotificationService = jasmine.createSpyObj('NotificationsService', ['success', 'error']);
//     mockCheckpointService = jasmine.createSpyObj('CheckpointService', ['saveCheckpoint']);
//     mockPageStorageService = jasmine.createSpyObj('IdentificationAndContactService', ['getContactInfo', 'setContactInfoPm']);


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
//         BrowserAnimationsModule
//       ],
//       declarations: [
//         ContactInfoComponent,
//         MailSectionComponent,
//         PhoneSectionComponent
//       ],
//       providers: [
//         { provide: NotificationsService, useValue: mockNotificationService },
//         { provide: CheckpointService, useValue: mockCheckpointService },
//         { provide: CatalogsService, useValue: mockCatalogsService },
//         { provide: OtcService, useValue: mockOtcService},
//         { provide: IdentificationAndContactService, useValue: mockPageStorageService },
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(ContactInfoPmComponent);
//     component = fixture.componentInstance;

//     component.phoneSection = {
//       phoneList: () => [
//         { phoneType: '1', phoneCountry: 'MX', phoneCodeArea: '55', phone: '12345678', phoneExtension: '', phoneNotification: true }
//       ],
//       resetModified: () => {}
//     } as any;

//     component.mailSection = {
//       mailList: () => [
//         { mail: 'test@mail.com', mailNotification: true }
//       ],
//       resetModified: () => {}
//     } as any;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load initial data when pageStorageService returns data', () => {
//     const fakeData: ContactInformationPm = {
//       phones: [{ phoneType: '1' }] as any,
//       emails: [{ mail: 'test@mail.com' }] as any,
//     };

//     mockPageStorageService.getContactInfo.and.returnValue(fakeData);

//     component.ngOnInit();
//     expect(component.initialData).toEqual(fakeData);
//     expect(component.phoneSaved).toEqual(fakeData.phones);
//     expect(component.mailSaved).toEqual(fakeData.emails);
//   });

//   it('should save data successfully when all conditions are met', () => {
//     mockCheckpointService.saveCheckpoint.and.returnValue(of({ result: 'ok' }));
//     component.save();
//     expect(mockCheckpointService.saveCheckpoint).toHaveBeenCalledTimes(1);
//     expect(mockNotificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//   });

//   it('should show error if information is missing', () => {
//     component.phoneSection = {
//       phoneList: () => [],
//       resetModified: () => {}
//     } as any;
//     component.mailSection = {
//       mailList: () => [],
//       resetModified: () => {}
//     } as any;
//     component.save();
//     expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_CONTACT_INFO_PM_SECTION);
//   });

//   it('should handle error from checkpoint service', () => {
//     mockCheckpointService.saveCheckpoint.and.returnValue(of({ result: 'ok' }));
//     mockCheckpointService.saveCheckpoint.and.returnValue(throwError(() => new Error('fail')));
//     component.save();
//     expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//   });
// });
