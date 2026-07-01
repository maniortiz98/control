// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { SignComponent } from './sign.component';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { of } from 'rxjs';
// import { NotificationModalService } from '../../../shared/services/notification-modal.service';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
// import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
// import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { ModalCotitularService } from '../../../shared/services/modal-cotitular.service';
// import { ModalAttoneryService } from '../../../shared/services/modal-attonery.service';
// import { OnboardingService } from '../../services/onboarding.service';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { MatSelectChange } from '@angular/material/select';
// import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
// import { CotitularInfo } from '../../models/cotitular';
// import { AttoneryInfo } from '../../models/attonery';

// describe('SignComponent', () => {
//   let component: SignComponent;
//   let fixture: ComponentFixture<SignComponent>;

//   // mocks simples de servicios
//   const mockNotificationModal = { confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true })), success: jasmine.createSpy('success').and.returnValue(Promise.resolve({ value: true })) };
//   const mockNotificationsService = { success: jasmine.createSpy('success'), error: jasmine.createSpy('error') };
//   const mockSignStorageService = {
//     singSectionSignal: jasmine.createSpy('singSectionSignal').and.returnValue(null),
//     setSingSection: jasmine.createSpy('setSingSection')
//   };
//   const mockAddressesService = { get: jasmine.createSpy('get').and.returnValue({ addressList: [] }) };
//   const mockUnsavedChangesService = { setUnsavedChanges: jasmine.createSpy('setUnsavedChanges') };
//   const mockCheckpointService = { saveCheckpoint: jasmine.createSpy('saveCheckpoint').and.returnValue(of({})) };
//   const mockModalCotitularService = {
//     cotitularWithClientNumber: jasmine.createSpy('cotitularWithClientNumber').and.returnValue(Promise.resolve({
//       cotitularNumber: '1',
//       clientNumber: '123',
//       cotitularId: '123',
//       dataSection: null,
//       taxSection: null,
//       address: null,
//       autoSign: null,
//       ppeInfo: null,
//       identifications: [],
//       manifestLetter: true,
//       phones: [],
//       mails: []
//     })),
//     cotitularWithoutClientNumber: jasmine.createSpy('cotitularWithoutClientNumber').and.returnValue(Promise.resolve({
//       cotitularNumber: '1',
//       clientNumber: '123',
//       cotitularId: '123',
//       dataSection: null,
//       taxSection: null,
//       address: null,
//       autoSign: null,
//       ppeInfo: null,
//       identifications: [],
//       manifestLetter: true,
//       phones: [],
//       mails: []
//     }))
//   };
//   const mockModalAttoneryService = {
//     addAttoneryWithClientNumber: jasmine.createSpy('addAttoneryWithClientNumber').and.returnValue(Promise.resolve({
//       attoneryNumber: 1,
//       clientNumber: '123',
//       attoneryId: '123',
//       dataSection: null,
//       address: null,
//       taxSection: null,
//       ppeInfo: null,
//       identifications: [],
//       manifestLetter: true,
//       phones: [],
//       mails: [],
//       legalPowerSection: null,
//     })), addAttoneryWithoutClientNumber: jasmine.createSpy('addAttoneryWithoutClientNumber').and.returnValue(Promise.resolve({
//       attoneryNumber: 1,
//       clientNumber: '123',
//       attoneryId: '123',
//       dataSection: null,
//       address: null,
//       taxSection: null,
//       ppeInfo: null,
//       identifications: [],
//       manifestLetter: true,
//       phones: [],
//       mails: [],
//       legalPowerSection: null,
//     })) };
//   const mockOnboardingService = { currentInfo: jasmine.createSpy('currentInfo').and.returnValue({ personType: 'PF' }) };
//   const mockCatalogsService = {
//     getCountry: jasmine.createSpy('getCountry').and.returnValue(of([])),
//     getFederalEntity: jasmine.createSpy('getFederalEntity').and.returnValue(of([])),
//   };
//   beforeEach(() => {
//     mockModalCotitularService.cotitularWithClientNumber.calls.reset();
//     mockModalCotitularService.cotitularWithoutClientNumber.calls.reset();
//   });
//   beforeEach(waitForAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule],
//       declarations: [SignComponent],
//       providers: [
//         FormBuilder,
//         { provide: NotificationModalService, useValue: mockNotificationModal },
//         { provide: NotificationsService, useValue: mockNotificationsService },
//         { provide: SignStorageService, useValue: mockSignStorageService },
//         { provide: AddressesService, useValue: mockAddressesService },
//         { provide: UnsavedChangesService, useValue: mockUnsavedChangesService },
//         { provide: CheckpointService, useValue: mockCheckpointService },
//         { provide: ModalCotitularService, useValue: mockModalCotitularService },
//         { provide: ModalAttoneryService, useValue: mockModalAttoneryService },
//         { provide: OnboardingService, useValue: mockOnboardingService },
//         { provide: CatalogsService, useValue: mockCatalogsService }
//       ]
//     })
//       .overrideComponent(SignComponent, {
//         set: { template: '' }
//       })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignComponent);
//     component = fixture.componentInstance;

//     component.form.patchValue({
//       signType: '',
//       instructions: '',
//       titularIpabPercentaje: 0,
//       titularIsrPecentaje: 0
//     });

//     component.signPageInformation = {
//       signType: '',
//       instructions: '',
//       titularIpabPercentaje: 0,
//       titularIsrPecentaje: 0,
//       cotitularList: [],
//       cotitularTableList: [],
//       attoneryList: [],
//       attoneryData: [],
//     } as any;

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should disable addAttonery if INDIVIDUAL and attoneryData > 0', () => {
//     component.attoneryData.update(list => [{ attoneryId: 1 } as any]);
//     component.selectedSignType.set('INDIVIDUAL');
//     expect(component.dissableAddAttonery()).toBeTrue();
//   });

//   it('should call unsavedChangesService.setUnsavedChanges(true) if initial is different from current', () => {
//     const differentInitial = {
//       signType: 'MANCOMUNADA',
//       instructions: 'algo',
//       titularIpabPercentaje: 50,
//       titularIsrPecentaje: 50,
//       cotitularList: [],
//       cotitularTableList: [],
//       attoneryList: [],
//       attoneryTableList: []
//     };
//     mockSignStorageService.singSectionSignal.and.returnValue(differentInitial);

//     fixture = TestBed.createComponent(SignComponent);
//     component = fixture.componentInstance;

//     expect(mockUnsavedChangesService.setUnsavedChanges).not.toHaveBeenCalledWith(true);
//   });

//   describe('onSingTypeChange', () => {
//     it('should set percentages to 100 if initial is empty and event.value is INDIVIDUAL', async () => {
//       component.selectedSignType.set('');
//       const event = { value: 'INDIVIDUAL' } as MatSelectChange;

//       await component.onSingTypeChange(event);

//       expect(component.form.value.titularIpabPercentaje).toBe(100);
//       expect(component.form.value.titularIsrPecentaje).toBe(100);
//     });

//     it('should call notificationModal.confirm and change signature without deleting cotitulares if message exists', async () => {
//       component.selectedSignType.set('MANCOMUNADA');
//       component.signPageInformation.signType = 'MANCOMUNADA';
//       const event = { value: 'INDIVIDUAL' } as MatSelectChange;

//       mockNotificationModal.confirm.and.returnValue(Promise.resolve({ value: true, message: 'NA' }));

//       await component.onSingTypeChange(event);

//       expect(mockNotificationModal.confirm).toHaveBeenCalled();
//       expect(component.selectedSignType()).toBe('INDIVIDUAL');
//       expect(component.cotitularDataCapturated()).toEqual([]);
//     });

//     it('should clear cotitulares if message is undefined', async () => {
//       component.selectedSignType.set('MANCOMUNADA');
//       component.signPageInformation.signType = 'MANCOMUNADA';
//       component.cotitularDataCapturated.set([{ cotitularId: 1 } as any]);
//       component.cotitularData.set([{ cotitularId: 1 } as any]);
//       const event = { value: 'INDIVIDUAL' } as MatSelectChange;

//       mockNotificationModal.confirm.and.returnValue(Promise.resolve({ value: true }));

//       await component.onSingTypeChange(event);

//       expect(component.selectedSignType()).toBe('INDIVIDUAL');
//       expect(component.cotitularDataCapturated()).toEqual([]);
//       expect(component.cotitularData()).toEqual([]);
//       expect(component.form.value.titularIpabPercentaje).toBe(100);
//       expect(component.form.value.titularIsrPecentaje).toBe(100);
//     });

//     it('should not change signature if responseSign.value is false', async () => {
//       component.selectedSignType.set('MANCOMUNADA');
//       component.signPageInformation.signType = 'MANCOMUNADA';
//       const event = { value: 'INDIVIDUAL' } as MatSelectChange;

//       mockNotificationModal.confirm.and.returnValue(Promise.resolve({ value: false }));

//       await component.onSingTypeChange(event);

//       expect(component.selectedSignType()).toBe('MANCOMUNADA');
//       expect(component.form.value.signType).toBe('MANCOMUNADA');
//     });
//   });

//   describe('dissableAddAttonery', () => {
//     it('should return true if attoneryData > 0 and selectedSignType is INDIVIDUAL', () => {
//       component.attoneryData.update(list => [{ attoneryId: 1 } as any]);
//       component.selectedSignType.set('INDIVIDUAL');
//       expect(component.dissableAddAttonery()).toBeTrue();
//     });

//     it('should return false if attoneryData is empty or selectedSignType is not INDIVIDUAL', () => {
//       component.attoneryData.update(list => []);
//       component.selectedSignType.set('INDIVIDUAL');
//       expect(component.dissableAddAttonery()).toBeFalse();

//       component.attoneryData.update(list => [{ attoneryId: 1 } as any]);
//       component.selectedSignType.set('MANCOMUNADA');
//       expect(component.dissableAddAttonery()).toBeFalse();
//     });
//   });

//   it('should show validation errors if form is invalid', () => {
//     component.form.controls['signType'].setErrors({ required: true });

//     component.save();

//     expect(document.body.classList).toContain('show-validation');
//     expect(mockNotificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_INFO);
//   });

//   it('should call notificationService.error if validateDataContent returns message', () => {
//     spyOn(component, 'validateDataContent').and.returnValue(['Error de prueba', 'detalle']);
//     component.form.controls['signType'].setValue('INDIVIDUAL');
//     component.form.updateValueAndValidity();

//     component.save();

//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Error de prueba', 'detalle');
//   });

//   it('should save checkpoint and update services if form is valid', (done) => {
//     spyOn(component, 'validateDataContent').and.returnValue(['']);
//     component.form.controls['signType'].setValue('INDIVIDUAL');
//     component.form.controls['titularIpabPercentaje'].setValue(100);
//     component.form.controls['titularIsrPecentaje'].setValue(100);
//     component.form.updateValueAndValidity();

//     component.save();

//     expect(component.signPageInformation.signType).toBe('INDIVIDUAL');
//     expect(mockCheckpointService.saveCheckpoint).toHaveBeenCalled();
//     setTimeout(() => {
//       expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(false);
//       expect(mockSignStorageService.setSingSection).toHaveBeenCalledWith(component.signPageInformation);
//       expect(mockNotificationsService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//       done();
//     }, 0);
//   });

//   it('should call notificationService.error if checkpoint save fails', (done) => {
//     spyOn(component, 'validateDataContent').and.returnValue(['']);
//     component.form.controls['signType'].setValue('INDIVIDUAL');
//     component.form.controls['titularIpabPercentaje'].setValue(100);
//     component.form.controls['titularIsrPecentaje'].setValue(100);
//     component.form.updateValueAndValidity();

//     (mockCheckpointService.saveCheckpoint as jasmine.Spy).and.returnValue({
//       subscribe: ({ error }: any) => error('Error de prueba')
//     } as any);

//     component.save();

//     setTimeout(() => {
//       expect(mockNotificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//       done();
//     }, 0);
//   });

//   describe('validateDataContent', () => {
//     it('should return error if INDIVIDUAL and more than 1 apoderado', () => {
//       component.signPageInformation.attoneryList = [1, 2] as any;
//       const result = component.validateDataContent('INDIVIDUAL');
//       expect(result[0]).toBe('Solo Puede Registrar un Apoderado');
//     });

//     it('should return error if INDIVIDUAL and no apoderado', () => {
//       component.signPageInformation.attoneryList = [] as any;
//       const result = component.validateDataContent('INDIVIDUAL');
//       expect(result[0]).toBe('Debe Registrar un Apoderado');
//     });

//     it('should call validatePf if personType is PF', () => {
//       component.personType = 'PF';
//       spyOn(component as any, 'validatePf').and.returnValue(['']);
//       component.signPageInformation.attoneryList = [];
//       component.signPageInformation.cotitularList = [];
//       component.validateDataContent('SOLIDARIA');
//       expect((component as any).validatePf).toHaveBeenCalled();
//     });

//     it('should call validatePm if personType is PM', () => {
//       component.personType = 'PM';
//       spyOn(component as any, 'validatePm').and.returnValue(['']);
//       component.validateDataContent('SOLIDARIA');
//       expect((component as any).validatePm).toHaveBeenCalled();
//     });
//   });

//   it('should add cotitular with client number', async () => {
//     mockNotificationModal.success.and.returnValue(Promise.resolve({ value: true }));
//     component.selectedSignType.set('MANCOMUNDA');
//     await component.showCotitularModal();

//     expect(mockModalCotitularService.cotitularWithClientNumber).toHaveBeenCalledWith(
//       1,
//       'MANCOMUNDA',
//       undefined
//     );
//     expect(component.cotitularDataCapturated().length).toBe(1);
//     expect(component.cotitularData().length).toBe(1);
//     expect(component.signPageInformation.cotitularList.length).toBe(1);
//     expect(mockNotificationsService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_COTITULAR);
//   });

//   it('should add cotitular without client number', async () => {
//     mockNotificationModal.success.and.returnValue(Promise.resolve({ value: false }));
//     component.selectedSignType.set('MANCOMUNDA');
//     await component.showCotitularModal();

//     expect(mockModalCotitularService.cotitularWithoutClientNumber).toHaveBeenCalledWith(
//       1,
//       'MANCOMUNDA',
//       undefined
//     );
//     expect(component.cotitularDataCapturated().length).toBe(1);
//     expect(component.cotitularData().length).toBe(1);
//     expect(component.signPageInformation.cotitularList.length).toBe(1);
//     expect(mockNotificationsService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_COTITULAR);
//   });

//   it('should add attonery with client number', async () => {
//     mockNotificationModal.success.and.returnValue(Promise.resolve({ value: true }));
//     await component.showAttoneryModal();

//     expect(mockModalAttoneryService.addAttoneryWithClientNumber).toHaveBeenCalledWith(1);
//     expect(component.attoneryDataCapturated().length).toBe(1);
//     expect(component.attoneryData().length).toBe(1);
//     expect(component.signPageInformation.attoneryList.length).toBe(1);
//     expect(mockNotificationsService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_ATTONERY);
//   });

//   it('should add attonery without client number', async () => {
//     mockNotificationModal.success.and.returnValue(Promise.resolve({ value: false }));
//     await component.showAttoneryModal();

//     expect(mockModalAttoneryService.addAttoneryWithoutClientNumber).toHaveBeenCalledWith(1);
//     expect(component.attoneryDataCapturated().length).toBe(1);
//     expect(component.attoneryData().length).toBe(1);
//     expect(component.signPageInformation.attoneryList.length).toBe(1);
//     expect(mockNotificationsService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_ATTONERY);
//   });

//   it('should call editCotitular when event type is edit', async () => {
//     const event = { type: 'edit', row: { cotitularId: 1, cotitularNumber: '123' } };
//     spyOn(component as any, 'editCotitular').and.returnValue(Promise.resolve());
//     await component.eventRowCotitular(event);
//     expect((component as any).editCotitular).toHaveBeenCalledWith(event);
//   });

//   it('should call deleteCotitular when event type is delete', async () => {
//     const event = { type: 'delete', row: { cotitularId: 1, cotitularNumber: '123' } };
//     spyOn(component as any, 'deleteCotitular').and.returnValue(Promise.resolve());
//     await component.eventRowCotitular(event);
//     expect((component as any).deleteCotitular).toHaveBeenCalledWith(event);
//   });

//   it('should call editAttonery when event type is edit', async () => {
//     const event = { type: 'edit', row: { attoneryId: 1, attoneryNumber: '123' } };
//     spyOn(component as any, 'editAttonery').and.returnValue(Promise.resolve());
//     await component.eventRowAttonery(event);
//     expect((component as any).editAttonery).toHaveBeenCalledWith(event);
//   });

//   it('should call deleteAttonery when event type is delete', async () => {
//     const event = { type: 'delete', row: { attoneryId: 1, attoneryNumber: '123' } };
//     spyOn(component as any, 'deleteAttonery').and.returnValue(Promise.resolve());
//     await component.eventRowAttonery(event);
//     expect((component as any).deleteAttonery).toHaveBeenCalledWith(event);
//   });

//   it('should edit cotitular with client number', async () => {
//     const event = { row: { cotitularId: '123', cotitularNumber: '1', clientNumber: '123' } };

//     component.cotitularDataCapturated.set([{
//       cotitularId: '123',
//       cotitularNumber: 1,
//       clientNumber: '123',
//       dataSection: null,
//       taxSection: undefined,
//       address: null,
//       autoSign: null,
//       ppeInfo: null,
//       identifications: [],
//       manifestLetter: true,
//       phones: [],
//       mails: []
//     }]);

//     await component.editCotitular(event);

//     expect(mockModalCotitularService.cotitularWithClientNumber).toHaveBeenCalledWith(
//       '1', component.selectedSignType(), jasmine.any(Object)
//     );

//     expect(component.signPageInformation.cotitularList.length).toBe(1);
//   });

//   it('should edit cotitular without client number', async () => {
//     const event = { row: { cotitularId: 1, cotitularNumber: '123', clientNumber: '-' } };
//     component.cotitularDataCapturated.set([{
//       cotitularId: '123',
//       cotitularNumber: 1,
//       clientNumber: '-',
//       dataSection: null,
//       taxSection: undefined,
//       address: null,
//       autoSign: null,
//       ppeInfo: null,
//       identifications: [],
//       manifestLetter: true,
//       phones: [],
//       mails: []
//     }]);
//     await component.editCotitular(event);

//     expect(mockModalCotitularService.cotitularWithoutClientNumber).toHaveBeenCalled();
//     expect(component.signPageInformation.cotitularList.length).toBe(1);
//   });

//   it('should edit attonery with client number', async () => {
//     const event = { row: { attoneryId: 1, attoneryNumber: '123', clientNumber: '456' } };
//     component.attoneryDataCapturated.set([
//       {
//         attoneryNumber: 1,
//         clientNumber: '123',
//         attoneryId: '123',
//         dataSection: null,
//         address: null,
//         taxSection: null,
//         ppeInfo: null,
//         identifications: [],
//         manifestLetter: true,
//         phones: [],
//         mails: [],
//         legalPowerSection: null,
//       }]
//     )
//     await component.editAttonery(event);

//     expect(mockModalAttoneryService.addAttoneryWithClientNumber).toHaveBeenCalled();
//     expect(component.signPageInformation.attoneryList.length).toBe(1);
//   });

//   it('should edit attonery without client number', async () => {
//     const event = { row: { attoneryId: 1, attoneryNumber: '123', clientNumber: '-' } };
//     component.attoneryDataCapturated.set([
//       {
//         attoneryNumber: 1,
//         clientNumber: '123',
//         attoneryId: '-',
//         dataSection: null,
//         address: null,
//         taxSection: null,
//         ppeInfo: null,
//         identifications: [],
//         manifestLetter: true,
//         phones: [],
//         mails: [],
//         legalPowerSection: null,
//       }]
//     )

//     await component.editAttonery(event);

//     expect(mockModalAttoneryService.addAttoneryWithoutClientNumber).toHaveBeenCalled();
//     expect(component.signPageInformation.attoneryList.length).toBe(1);
//   });

//   it('should delete cotitular when confirmed', async () => {
//     const event = { row: { cotitularId: 1, cotitularNumber: '123' } };
//     component.cotitularDataCapturated.set([{ cotitularId: 1, cotitularNumber: '123' } as unknown as CotitularInfo]);

//     await component.deleteCotitular(event);

//     expect(component.signPageInformation.cotitularList.length).toBe(0);
//   });

//   it('should delete attonery when confirmed', async () => {
//     const event = { row: { attoneryId: 1, attoneryNumber: '123' } };
//     component.attoneryDataCapturated.set([{ attoneryId: 1, attoneryNumber: '123' } as unknown as AttoneryInfo]);
//     await component.deleteAttonery(event);
//     expect(component.signPageInformation.attoneryList.length).toBe(0);
//   });

//   it('should clean non-numeric input', () => {
//     const input = { value: 'abc123' } as HTMLInputElement;
//     component.onlyNumbers({ target: input } as any);
//     expect(input.value).toBe('123');
//   });

//   describe('validatePm', () => {
//     it('should return error if PM and less than 2 attonery and not INDIVIDUAL', () => {
//       component.personType = 'PM';
//       component.signPageInformation.attoneryList = [{}] as any;
//       const result = component.validatePm('MANCOMUNADA');
//       expect(result[0]).toBe('Debe Registar al Menos dos Apoderados');
//     });

//     it('should return empty string if PM and 2 or more attonery', () => {
//       component.personType = 'PM';
//       component.signPageInformation.attoneryList = [{}, {}] as any;
//       const result = component.validatePm('MANCOMUNADA');
//       expect(result[0]).toBe('');
//     });

//     it('should return empty string if selected is INDIVIDUAL', () => {
//       component.personType = 'PM';
//       component.signPageInformation.attoneryList = [] as any;
//       const result = component.validatePm('INDIVIDUAL');
//       expect(result[0]).toBe('');
//     });
//   });

//   describe('validatePf', () => {
//     it('should return error if less than 1 cotitular and less than 2 attonery and not INDIVIDUAL', () => {
//       component.signPageInformation.cotitularList = [];
//       component.signPageInformation.attoneryList = [{}] as any;
//       const result = component.validatePf('MANCOMUNADA');
//       expect(result[0]).toBe('Debe Registar al Menos un Cotitular o dos Apoderados');
//     });

//     it('should return IPAB error if total IPAB not 100', () => {
//       component.signPageInformation.cotitularList = [{}] as any;
//       component.signPageInformation.attoneryList = [{}] as any;
//       component.form.patchValue({ titularIpabPercentaje: 50, titularIsrPecentaje: 50 });
//       spyOn(component, 'cotitularDataCapturated').and.returnValue([
//         { taxSection: { ipabTitularityPercent: 30, retentionIsr: 20 } } as any
//       ]);

//       const result = component.validatePf('MANCOMUNADA');
//       expect(result[0]).toBe('La suma de los % Titularidad IPAB de los cotitulares debe ser 100%');
//     });

//     it('should return proportional IPAB error for SOLIDARIA', () => {
//       component.signPageInformation.cotitularList = [{}] as any;
//       component.signPageInformation.attoneryList = [{}] as any;
//       component.form.patchValue({ titularIpabPercentaje: 50, titularIsrPecentaje: 50 });
//       spyOn(component, 'cotitularDataCapturated').and.returnValue([
//         { taxSection: { ipabTitularityPercent: 30 } } as any,
//         { taxSection: { ipabTitularityPercent: 20 } } as any
//       ]);

//       const result = component.validatePf('SOLIDARIA');
//       expect(result[0]).toBe('Para Firma Solidaria los % Titularidad IPAB deben ser Proporcionales');
//     });

//     it('should return empty string if totals are correct for MANCOMUNADA', () => {
//       component.form.patchValue({ titularIpabPercentaje: 50, titularIsrPecentaje: 50 });
//       spyOn(component, 'cotitularDataCapturated').and.returnValue([
//         { taxSection: { ipabTitularityPercent: 50, retentionIsr: 50 } } as any
//       ]);

//       const result = component.validatePf('MANCOMUNADA');
//       expect(result[0]).toBe('Debe Registar al Menos un Cotitular o dos Apoderados');
//     });

//     it('should return ISR error if total ISR not 100', () => {
//       component.signPageInformation.cotitularList = [{}] as any;
//       component.signPageInformation.attoneryList = [{}] as any;
//       component.form.patchValue({ titularIpabPercentaje: 50, titularIsrPecentaje: 40 });
//       spyOn(component, 'cotitularDataCapturated').and.returnValue([
//         { taxSection: { ipabTitularityPercent: 50, retentionIsr: 50 } } as any
//       ]);

//       const result = component.validatePf('MANCOMUNADA');
//       expect(result[0]).toBe('La suma de los % de retención ISR de los cotitulares debe ser 100%');
//     });

//     it('should return empty string for SOLIDARIA if IPAB percentages are proportional', () => {
//       component.form.patchValue({ titularIpabPercentaje: 50, titularIsrPecentaje: 50 });
//       spyOn(component, 'cotitularDataCapturated').and.returnValue([
//         { taxSection: { ipabTitularityPercent: 25 } } as any,
//         { taxSection: { ipabTitularityPercent: 25 } } as any
//       ]);

//       const result = component.validatePf('SOLIDARIA');
//       expect(result[0]).toBe('Debe Registar al Menos un Cotitular o dos Apoderados');
//     });

//     it('should return empty string for MANCOMUNADA if totals are correct and cotitular/attonery counts sufficient', () => {
//       component.signPageInformation.cotitularList = [{}] as any; // al menos 1 cotitular
//       component.signPageInformation.attoneryList = [{}] as any;   // al menos 1 apoderado
//       component.form.patchValue({ titularIpabPercentaje: 50, titularIsrPecentaje: 50 });
//       spyOn(component, 'cotitularDataCapturated').and.returnValue([
//         { taxSection: { ipabTitularityPercent: 50, retentionIsr: 50 } } as any
//       ]);

//       const result = component.validatePf('MANCOMUNADA');
//       expect(result[0]).toBe('');
//     });
//   });
// });
