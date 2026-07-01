// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule, MatSelectChange } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { CustomerIdentificationSectionComponent } from './customer-identification-section.component';
// import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
// import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
// import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
// import { of } from 'rxjs';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

// describe('CustomerIdentificationSectionComponent', () => {
//   let component: CustomerIdentificationSectionComponent;
//   let fixture: ComponentFixture<CustomerIdentificationSectionComponent>;

//   const mockNotificationService = {
//     error: jasmine.createSpy('error'),
//     success: jasmine.createSpy('success')
//   };

//   const mockNotificationModalService = {
//     confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true }))
//   };

//   const mockCatalogsService = {
//     getCountry: jasmine.createSpy('getCatalog').and.callFake(() => of([])),
//     getIdentificationType: jasmine.createSpy('getCatalog').and.callFake(() => of([{ text: 'PASAPORTE', type: '00006' }, { text: 'CURP', type: '00003' }]))
//   };

//   const mockIdentificationStorageService = {
//     getItems: jasmine.createSpy('getItems').and.returnValue(() => [])
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [CustomerIdentificationSectionComponent],
//       imports: [
//         ReactiveFormsModule,
//         MatTableModule,
//         MatSelectModule,
//         BrowserAnimationsModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//       ],
//       providers: [
//         { provide: CustomerNotificationsService, useValue: mockNotificationService },
//         { provide: CustomerNotificationModalService, useValue: mockNotificationModalService },
//         { provide: CustomerCatalogsService, useValue: mockCatalogsService },
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerIdentificationSectionComponent);
//     component = fixture.componentInstance;

//     fixture.componentRef.setInput('identificationSaved', []);
//     fixture.componentRef.setInput('showInput', true);
//     fixture.componentRef.setInput('showTable', true);

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('ngOnInit', () => {
//     it('should set today and call catalogs', () => {
//       component.ngOnInit();
//       expect(component.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
//       expect(mockCatalogsService.getCountry).toHaveBeenCalled();
//     });
//   });

//   describe('onSubmit', () => {
//     beforeEach(() => {
//       component.form.setValue({
//         identificationCountry: 'MEX',
//         identificationType: 'PASAPORTE',
//         identificationNumber: '123',
//         identificationExpDate: new Date(2025, 10, 30)
//       });
//     });

//     it('should show error if form invalid', () => {
//       component.form.get('identificationCountry')?.setValue('');
//       component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_INFO);
//     });

//     it('should show error if expiration date invalid', () => {
//       component.form.get('identificationExpDate')?.setValue('30/11/2025');
//       component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalled();
//     });

//     it('should add new identification when valid', () => {
//       component.form.setValue({
//         identificationCountry: 'MEX',
//         identificationType: 'ABC',
//         identificationNumber: '123',
//         identificationExpDate: new Date(2025, 10, 30)
//       });
//       component.onSubmit();
//       expect(component.identificationList().length).toBe(1);
//       expect(mockNotificationService.success).toHaveBeenCalledWith(
//         '¡Identificación Capturada con Éxito!',
//         jasmine.any(String)
//       );
//     });

//     // it('should update identification when editing', () => {
//     //   const id = '1';
//     //   component.identificationList.set([{
//     //     id,
//     //     identificationCountry: 'MEX',
//     //     identificationType: 'PASAPORTE',
//     //     identificationNumber: '123',
//     //     identificationExpDate: '30/11/2025'
//     //   }]);

//     //   component.editingId = id;
//     //   component.onSubmit();
//     //   expect(mockNotificationService.success).toHaveBeenCalledWith(
//     //     '¡Identificación Actualizada con Éxito!',
//     //     jasmine.any(String)
//     //   );
//     // });
//   });

//   describe('deleteIdent', () => {
//     // it('should delete identification when modal confirms', async () => {
//     //   component.identificationList.set([{
//     //     id: '1',
//     //     identificationCountry: 'MEX',
//     //     identificationType: 'CURP',
//     //     identificationNumber: 'XYZ',
//     //     identificationExpDate: '01-01-2025'
//     //   }]);

//     //   await component.deleteIdent({ row: {
//     //     id: '1',
//     //     identificationCountry: 'USA',
//     //     identificationType: 'PASAPORTE',
//     //     identificationNumber: '987',
//     //     identificationExpDate: new Date()
//     //   }
//     //   });
//     //   expect(component.identificationList().length).toBe(0);
//     //   expect(mockNotificationService.success).toHaveBeenCalled();
//     // });
//   });

//   // describe('validateExpirationDate', () => {
//   //   it('should return true for non voter id', () => {
//   //     const result = component.validateExpirationDate({
//   //       identificationCountry: 'MEX',
//   //       identificationType: 'PASAPORTE',
//   //       identificationNumber: 'X1',
//   //       identificationExpDate: '30/11/2025',
//   //       id: '1'
//   //     });
//   //     expect(result).toBeTrue();
//   //   });

//   //   it('should return false for voter id with invalid exp date', () => {
//   //     const result = component.validateExpirationDate({
//   //       identificationCountry: 'MEX',
//   //       identificationType: 'CREDENCIAL PARA VOTAR',
//   //       identificationNumber: 'X2',
//   //       identificationExpDate: '01-01-2025',
//   //       id: '2'
//   //     });
//   //     expect(result).toBeFalse();
//   //   });

//   //   it('should return true for voter id with valid exp date', () => {
//   //     const result = component.validateExpirationDate({
//   //       identificationCountry: 'MEX',
//   //       identificationType: 'CREDENCIAL PARA VOTAR',
//   //       identificationNumber: 'X3',
//   //       identificationExpDate: '31/12/2025',
//   //       id: '3'
//   //     });
//   //     expect(result).toBeTrue();
//   //   });
//   // });

//   describe('editIdentification', () => {
//     it('should set form values and editingId', () => {
//       component.identificationTypes.set([{ text: 'PASAPORTE', type: '6' } as any]);
//       const item = { row: {
//         id: '5',
//         identificationCountry: 'USA',
//         identificationType: 'PASAPORTE',
//         identificationNumber: '987',
//         identificationExpDate: new Date()
//       }
//       };
//       component.editIdentification(item);
//       expect(component.editingId).toBe('5');
//       expect(component.form.value.identificationNumber).toBe('987');
//     });
//   });

//   it('should call editIdentification when event type is edit', async () => {
//     const event = { type: 'edit', row: {id: '1', mail: 'example@gmail.com', mailNotification: false}};
//     spyOn(component as any, 'editIdentification').and.returnValue(Promise.resolve());
//     await component.eventRowidentification(event);
//     expect((component as any).editIdentification).toHaveBeenCalledWith(event);
//   });

//   it('should call deleteIdent when event type is delete', async () => {
//     const event = { type: 'delete', row: {id: '1', mail: 'example@gmail.com', mailNotification: false}};
//     spyOn(component as any, 'deleteIdent').and.returnValue(Promise.resolve());
//     await component.eventRowidentification(event);
//     expect((component as any).deleteIdent).toHaveBeenCalledWith(event);
//   });

//   describe('onIdentificationTypeChange', () => {
//     it('should disable expDateControl if type not requires validation', () => {
//       component.identificationTypes.set([{ text: 'PASAPORTE', type: '000001' } as any]);
//       const event = { value: 'PASAPORTE' } as MatSelectChange;
//       component.onIdentificationTypeChange(event);
//       expect(component.form.get('identificationExpDate')?.disabled).toBeTrue();
//     });

//     it('should enable expDateControl if type requires validation', () => {
//       component.identificationTypes.set([{ text: 'PASAPORTE', type: '00006' } as any]);
//       const event = { value: '6' } as MatSelectChange;
//       component.onIdentificationTypeChange(event);
//       expect(component.form.get('identificationExpDate')?.enabled).toBeFalse();
//     });
//   });

//   describe('onlyAlfanumerics', () => {
//     it('should clean non-onlyAlfanumerics input', () => {
//       const input = { value: 'abc%123' } as HTMLInputElement;
//       component.onlyAlfanumerics({ target: input } as any);
//       expect(input.value).toBe('abc123');
//     });
//   });

//   describe('resetModified', () => {
//     it('should set unsavedState to false', () => {
//       component.unsavedState.set(true);
//       expect(component.unsavedState()).toBeTrue();
//       component.resetModified();
//       expect(component.unsavedState()).toBeFalse();
//     });
//   });
// })






