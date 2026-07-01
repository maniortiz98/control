// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ResourceProviderPmComponent } from './resource-provider-pm.component';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { of, throwError } from 'rxjs';
// import { MatSelectChange, MatSelectModule } from '@angular/material/select';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { ResourceProviderPmService } from '../../../shared/services/storage-services/pm/resource-provider-pm.service';
// import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/form-messages';
// import { MatTableModule } from '@angular/material/table';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatRadioModule } from '@angular/material/radio';
// import { Address } from '../../models/address';

// describe('ResourceProviderPmComponent', () => {
//   let component: ResourceProviderPmComponent;
//   let fixture: ComponentFixture<ResourceProviderPmComponent>;
//   let catalogsServiceSpy: jasmine.SpyObj<CatalogsService>;
//   let notificationServiceSpy: jasmine.SpyObj<NotificationsService>;
//   let unsavedChangesServiceSpy: jasmine.SpyObj<UnsavedChangesService>;
//   let checkpointSpy: jasmine.SpyObj<CheckpointService>;
//   let sectionStorageSpy: jasmine.SpyObj<ResourceProviderPmService>;

//   const mockData = {
//     content: {
//       clientNumber: '123',
//       address: { country: 'MX' } as Address,
//     }
//   };
//   beforeEach(async () => {
//     catalogsServiceSpy = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getNationalities']);
//     notificationServiceSpy = jasmine.createSpyObj('NotificationsService', ['error', 'success']);
//     unsavedChangesServiceSpy = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
//     checkpointSpy = jasmine.createSpyObj('CheckpointService', ['saveCheckpoint']);
//     sectionStorageSpy = jasmine.createSpyObj('ResourceProviderPmService', ['resourceProviderPm', 'setResourceProviderPm']);

//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule,
//         MatTableModule,
//         MatSelectModule,
//         BrowserAnimationsModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatRadioModule
//       ],
//       declarations: [ResourceProviderPmComponent],
//       providers: [
//         FormBuilder,
//         { provide: CatalogsService, useValue: catalogsServiceSpy },
//         { provide: NotificationsService, useValue: notificationServiceSpy },
//         { provide: UnsavedChangesService, useValue: unsavedChangesServiceSpy },
//         { provide: CheckpointService, useValue: checkpointSpy },
//         { provide: ResourceProviderPmService, useValue: sectionStorageSpy },
//       ]
//     })
//     .overrideComponent(ResourceProviderPmComponent, { set: { template: '' } })
//     .compileComponents();

//     fixture = TestBed.createComponent(ResourceProviderPmComponent);
//     component = fixture.componentInstance;
//     component.addressSection = { onSubmit: jasmine.createSpy('onSubmit') } as any;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize catalogs and disable controls', () => {
//     catalogsServiceSpy.getCountry.and.returnValue(of([{ country: 'MEXICO', countryId: 'MX', countryCode: '52' }]));
//     catalogsServiceSpy.getNationalities.and.returnValue(of([{ nationalityId: 'MX', nationality: 'ESTADOUNIDENSE' }]));
//     sectionStorageSpy.resourceProviderPm.and.returnValue(null);
//     component.ngOnInit();
//     expect(catalogsServiceSpy.getCountry).toHaveBeenCalled();
//     expect(catalogsServiceSpy.getNationalities).toHaveBeenCalled();
//     expect(component.form.get('identityType')?.disabled).toBeTrue();
//     expect(component.form.get('fiscalKeyCountry')?.disabled).toBeTrue();
//   });

//   it('should apply correct values when nationality is MX', () => {
//     component.applyNationalChange('MX');
//     expect(component.form.get('identityType')?.value).toBe('1');
//     expect(component.form.get('fiscalKeyCountry')?.value).toBe('MX');
//     expect(component.idLong).toBe(12);
//   });

//   it('should apply correct values when nationality is not MX', () => {
//     component.applyNationalChange('US');
//     expect(component.form.get('identityType')?.value).toBe('2');
//     expect(component.form.get('fiscalKeyCountry')?.value).toBe('US');
//     expect(component.idLong).toBe(300);
//   });

//   it('should call applyNationalChange when nationality changes', () => {
//     spyOn(component, 'applyNationalChange');
//     const event = { value: 'MX' } as MatSelectChange;
//     component.onNationalityChange(event);
//     expect(component.applyNationalChange).toHaveBeenCalledWith('MX');
//   });

//   it('should mark fields and show error when form is invalid', async () => {
//     component.form.patchValue({ socialReason: '' });
//     await component.save();
//     expect(notificationServiceSpy.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
//   });

//   it('should show error when RFC format is invalid for MX nationality', async () => {
//     component.form.patchValue({
//       socialReason: 'Empresa SA',
//       nacionatity: 'MX',
//       identityType: '1',
//       identityNumber: 'ABC123',
//       fiscalKeyCountry: 'MX',
//       fiscalKeyNumber: 'ABC',
//       businessType: 'COM',
//       mail: 'test@mail.com',
//       phone: '1234567890'
//     });
//     (component.addressSection.onSubmit as jasmine.Spy).and.returnValue(Promise.resolve({}));
//     await component.save();
//     expect(notificationServiceSpy.error).toHaveBeenCalledWith('El RFC no cumple con el formato requerido');
//   });

//   it('should save successfully when form is valid', async () => {
//     component.form.patchValue({
//       socialReason: 'Empresa SA',
//       nacionatity: 'US',
//       identityType: '2',
//       identityNumber: 'ABC123456XYZ',
//       fiscalKeyCountry: 'US',
//       fiscalKeyNumber: '123',
//       businessType: 'COM',
//       mail: 'mail@test.com',
//       phone: '1234567890'
//     });
//     (component.addressSection.onSubmit as jasmine.Spy).and.returnValue(Promise.resolve({ calle: 'Av Reforma' }));
//     checkpointSpy.saveCheckpoint.and.returnValue(of(true));
//     await component.save();
//     expect(checkpointSpy.saveCheckpoint).toHaveBeenCalled();
//     expect(sectionStorageSpy.setResourceProviderPm).toHaveBeenCalled();
//     expect(notificationServiceSpy.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//   });

//   it('should show error when saveCheckpoint fails', async () => {
//     component.form.patchValue({
//       socialReason: 'Empresa SA',
//       nacionatity: 'US',
//       identityType: '2',
//       identityNumber: 'ABC123456XYZ',
//       fiscalKeyCountry: 'US',
//       fiscalKeyNumber: '123',
//       businessType: 'COM',
//       mail: 'mail@test.com',
//       phone: '1234567890'
//     });
//     (component.addressSection.onSubmit as jasmine.Spy).and.returnValue(Promise.resolve({}));
//     checkpointSpy.saveCheckpoint.and.returnValue(throwError(() => new Error('Error')));
//     await component.save();
//     expect(notificationServiceSpy.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//   });

//   it('should remove non-numeric characters from input', () => {
//     const input = document.createElement('input');
//     input.value = '12ab34';
//     const event = { target: input } as unknown as Event;
//     component.onlyNumbers(event);
//     expect(input.value).toBe('1234');
//   });
// });
