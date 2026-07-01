// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { CustomerMailSectionComponent } from './customer-mail-section.component';

// import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
// import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
// import { CustomerOtcService } from '../../../services/customer-otc.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTableModule } from '@angular/material/table';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { CustomerTokenVerificationServiceService } from '../../../services/customer-token-verification-service.service';
// import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

// describe('CustomerMailSectionComponent', () => {
//   let component: CustomerMailSectionComponent;
//   let fixture: ComponentFixture<CustomerMailSectionComponent>;

//   const mockMailStorageService = {
//     getMails: jasmine.createSpy('getMails').and.returnValue(()=>[])
//   };

//   const mockNotificationService = {
//     error: jasmine.createSpy('error'),
//     success: jasmine.createSpy('success')
//   };

//   const mockNotificationModalService = {
//     confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true }))
//   };

//   const mockOtcService = {
//     sendEmail: jasmine.createSpy('sendEmail')
//   }

//   const mockTokenVerificationService = {
//     showModal: jasmine.createSpy('showModal').and.returnValue(Promise.resolve(true))
//   }

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [CustomerMailSectionComponent],
//       imports: [
//         ReactiveFormsModule,
//         MatTableModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatCheckboxModule,
//         MatSelectModule,
//         BrowserAnimationsModule,],
//       providers: [
//         { provide: CustomerNotificationsService, useValue: mockNotificationService },
//         { provide: CustomerNotificationModalService, useValue: mockNotificationModalService },
//         { provide: CustomerOtcService, useValue: mockOtcService},
//         { provide: CustomerTokenVerificationServiceService, useValue: mockTokenVerificationService}
//       ]

//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(CustomerMailSectionComponent);
//     component = fixture.componentInstance;

//     fixture.componentRef.setInput('mailSaved', []);
//     fixture.componentRef.setInput('disabled', false);

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should init ', ()=>{
//     component.ngOnInit();
//   })

//   describe('onSubmit', ()=> {

//     beforeEach(()=>{
//       component.form.setValue({
//         mail: 'example@gmail.com',
//         mailNotification: false
//       });
//     });

//     it('Should show error if form invalid', async()=>{
//       component.form.get('mail')?.setValue('');
//       await component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
//     })

//     it('Should show error if mail is invalid', async()=>{
//       component.form.get('mail')?.setValue('abc@abc');
//       await component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_INVALID);
//     })

//     // it('Should show error if mail is duplicate', async()=>{
//     //   component.mailList.set([{id: '1', mail: 'example@gmail.com', mailNotification: false}]);
//     //   await component.onSubmit();
//     //   expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_ALREADY_EXIST);
//     // })

//     // it('Should show error if mail notification is duplicate create', async()=>{
//     //   component.form.get('mailNotification')?.setValue(true)
//     //   component.mailList.set([{id: '1', mail: 'example2@gmail.com', mailNotification: true}]);
//     //   await component.onSubmit();
//     //   expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_NOTIFICATION_ALREADY_EXIST);
//     // })

//     it('Should show error if form invalid', async()=>{
//       component.editingId = '1';
//       component.form.get('mail')?.setValue('');
//       await component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
//     })

//     it('Should show error if mail is invalid', async()=>{
//       component.editingId = '1';
//       component.form.get('mail')?.setValue('abc@abc');
//       await component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_INVALID);
//     })

//     // it('Should show error if mail is duplicate', async()=>{
//     //   component.editingId = '2';
//     //   component.mailList.set([{id: '1', mail: 'example@gmail.com', mailNotification: false}]);
//     //   await component.onSubmit();
//     //   expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_ALREADY_EXIST);
//     // })

//     // it('Should show error if mail notification is duplicate update', async()=>{
//     //   component.editingId = '2';
//     //   component.form.get('mailNotification')?.setValue(true)
//     //   component.mailList.set([{id: '1', mail: 'example2@gmail.com', mailNotification: true}]);
//     //   await component.onSubmit();
//     //   expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.MAIL_NOTIFICATION_ALREADY_EXIST);
//     // })

//     it('should add mail when valid form and modal ok', async () => {
//       await component.onSubmit();
//       expect(component.mailList().length).toBe(1);
//       expect(mockNotificationService.success).toHaveBeenCalled();
//     });

//     it('should update mail when valid form and modal ok', async () => {
//       component.editingId = '1';
//       await component.onSubmit();
//       expect(mockNotificationService.success).toHaveBeenCalled();
//     });
//   });

//   // it('should delete phone when confirmed', async () => {
//   //   component.mailList.set([{id: '1', mail: 'example@gmail.com', mailNotification: false}]);
//   //   await component.deleteMail({ row: {id: '1', mail: 'example@gmail.com', mailNotification: false}});
//   //   expect(component.mailList().length).toBe(0);
//   //   expect(mockNotificationService.success).toHaveBeenCalled();
//   // });

//   it('should set form values from item', () => {
//     const item = { row: {id: '1', mail: 'example@gmail.com', mailNotification: false}};
//     component.editMail(item);
//     expect(component.form.get('mail')?.value).toBe('example@gmail.com');
//     expect(component.editingId).toBe('1');
//   });

//   it('should call editMail when event type is edit', async () => {
//     const event = { type: 'edit', row: {id: '1', mail: 'example@gmail.com', mailNotification: false}};
//     spyOn(component as any, 'editMail').and.returnValue(Promise.resolve());
//     await component.eventRowMail(event);
//     expect((component as any).editMail).toHaveBeenCalledWith(event);
//   });

//   it('should call deleteMail when event type is delete', async () => {
//     const event = { type: 'delete', row: {id: '1', mail: 'example@gmail.com', mailNotification: false}};
//     spyOn(component as any, 'deleteMail').and.returnValue(Promise.resolve());
//     await component.eventRowMail(event);
//     expect((component as any).deleteMail).toHaveBeenCalledWith(event);
//   });

//   describe('resetModified', () => {
//     it('should set unsavedState to false', () => {
//       component.unsavedState.set(true);
//       expect(component.unsavedState()).toBeTrue();
//       component.resetModified();
//       expect(component.unsavedState()).toBeFalse();
//     });
//   });
// });








