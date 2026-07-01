// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CustomerModalTokenVerificationComponent } from './customer-modal-token-verification.component';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { CustomerOtcService } from '../../../services/customer-otc.service';
// import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
// import { of, throwError } from 'rxjs';

// describe('CustomerModalTokenVerificationComponent', () => {
//   let component: CustomerModalTokenVerificationComponent;
//   let fixture: ComponentFixture<CustomerModalTokenVerificationComponent>;
//   let mockDialogRef: any;
//   let mockOtcService: any;
//   let mockNotificationModalService: any;
//   let dialogData: any;

//   beforeEach(async () => {
//     mockDialogRef = { close: jasmine.createSpy('close') };
//     mockOtcService = {
//       validateEmail: jasmine.createSpy('validateEmail'),
//       validateSms: jasmine.createSpy('validateSms'),
//       sendEmail: jasmine.createSpy('sendEmail'),
//       sendSms: jasmine.createSpy('sendSms')
//     };
//     mockNotificationModalService = {
//       confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true }))
//     };
//     dialogData = {
//       notificationType: 'mail',
//       message: 'usuario@test.com',
//       inputLength: 4
//     };

//     await TestBed.configureTestingModule({
//       declarations: [],
//       imports: [CustomerModalTokenVerificationComponent],
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         { provide: MAT_DIALOG_DATA, useValue: dialogData },
//         { provide: CustomerOtcService, useValue: mockOtcService },
//         { provide: CustomerNotificationModalService, useValue: mockNotificationModalService }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerModalTokenVerificationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create component', () => {
//     expect(component).toBeTruthy();
//     expect(component.inputsArray.length).toBe(dialogData.inputLength);
//   });

//   it('should compute ofuscatedData for mail', () => {
//     const result = component.ofuscatedData();
//     expect(result).toContain('@test.com');
//     expect(result).toMatch(/\*+io@test\.com/);
//   });

//   it('should close dialog on success verify', () => {
//     const mockResponse = { payload: { result: 'CustomerSUCCESS' }};
//     mockOtcService.validateEmail.and.returnValue(of(mockResponse));
//     component.inputs = { map: () => [{ nativeElement: { value: '1' } }] } as any;
//     component.verify();
//     expect(mockOtcService.validateEmail).toHaveBeenCalled();
//     expect(mockDialogRef.close).toHaveBeenCalled();
//   });

//   it('should set error on failed verify', () => {
//     const mockResponse = { payload: { result: 'FAILURE' }};
//     mockOtcService.validateEmail.and.returnValue(of(mockResponse));
//     component.inputs = { map: () => [{ nativeElement: { value: '1' } }] } as any;
//     component.verify();
//     expect(component.otcError()).toBeTrue();
//   });

//   // it('should open modal and close dialog after too many intents', async () => {
//   //   const mockResponse = { result: 'FAILURE', intents: 4 };
//   //   mockOtcService.validateEmail.and.returnValue(of(mockResponse));
//   //   component.inputs = { map: () => [{ nativeElement: { value: '1' } }] } as any;
//   //   await component.verify();
//   //   expect(mockNotificationModalService.confirm).toHaveBeenCalled();
//   //   expect(mockDialogRef.close).toHaveBeenCalled();
//   // });

//   it('should set error on otc service error', () => {
//     mockOtcService.validateEmail.and.returnValue(throwError(() => new Error('fail')));
//     component.inputs = { map: () => [{ nativeElement: { value: '1' } }] } as any;
//     component.verify();
//     expect(component.otcError()).toBeTrue();
//   });

//   // it('should set error when verify fails but intents <= 3', () => {
//   //   const mockResponse = { result: 'FAILURE', intents: 2 };
//   //   mockOtcService.validateEmail.and.returnValue(of(mockResponse));
//   //   component.inputs = { map: (cb: any) => ['1'].map(v => cb({ nativeElement: { value: v } })) } as any;
//   //   component.verify();
//   //   expect(component.otcError()).toBeTrue();
//   //   expect(mockNotificationModalService.confirm).not.toHaveBeenCalled();
//   // });

//   it('should create OTC request with type SMS when notificationType is phone', () => {
//     component.data.notificationType = 'phone';
//     component.data.message = '1234567890';
//     component.inputs = { map: () => [{ nativeElement: { value: '1' } }, { nativeElement: { value: '2' } }] } as any;
//     mockOtcService.validateSms.and.returnValue(of({ payload: { result: 'CustomerSUCCESS' }}));
//     component.verify();
//     expect(mockOtcService.validateSms).toHaveBeenCalled();
//     expect(mockDialogRef.close).toHaveBeenCalled();
//   });

//   it('should resend mail when notificationType is mail', () => {
//     component.data.notificationType = 'mail';
//     mockOtcService.sendEmail.and.returnValue(of({}));
//     component.reSend();
//     expect(mockOtcService.sendEmail).toHaveBeenCalledWith({ email: 'usuario@test.com'});
//   });

//   it('should close dialog when close() is called', () => {
//     component.close();
//     expect(mockDialogRef.close).toHaveBeenCalled();
//   });

//   describe('onInput', () => {
//     it('should move focus to next input if one character is entered', () => {
//       const mockCurrentInput = { nativeElement: { focus: jasmine.createSpy(), value: '1' } };
//       const mockNextInput = { nativeElement: { focus: jasmine.createSpy() } };
//       component.inputs = { length: 2, get: (i: number) => (i === 1 ? mockNextInput : mockCurrentInput) } as any;
//       const event = { target: mockCurrentInput.nativeElement } as unknown as Event;
//       component.onInput(event, 0);
//       expect(mockNextInput.nativeElement.focus).toHaveBeenCalled();
//     });

//     it('should not move focus if value length is not 1', () => {
//       const mockCurrentInput = { nativeElement: { focus: jasmine.createSpy(), value: '' } };
//       const mockNextInput = { nativeElement: { focus: jasmine.createSpy() } };
//       component.inputs = { length: 2, get: (i: number) => (i === 1 ? mockNextInput : mockCurrentInput) } as any;
//       const event = { target: mockCurrentInput.nativeElement } as unknown as Event;
//       component.onInput(event, 0);
//       expect(mockNextInput.nativeElement.focus).not.toHaveBeenCalled();
//     });
//   });

//   describe('onKeyDown', () => {
//     it('should focus previous input and clear it on Backspace if current is empty', () => {
//       const mockPrevInput = { nativeElement: { focus: jasmine.createSpy(), value: 'X' } };
//       const mockCurrentInput = { nativeElement: { value: '' } };
//       component.inputs = { get: (i: number) => (i === 0 ? mockPrevInput : mockCurrentInput) } as any;
//       const event = new KeyboardEvent('keydown', { key: 'Backspace' });
//       spyOn(event, 'preventDefault');
//       component.onKeyDown(event, 1);
//       expect(mockPrevInput.nativeElement.focus).toHaveBeenCalled();
//       expect(mockPrevInput.nativeElement.value).toBe('');
//       expect(event.preventDefault).toHaveBeenCalled();
//     });

//     it('should not move focus if current input has value', () => {
//       const mockPrevInput = { nativeElement: { focus: jasmine.createSpy(), value: 'X' } };
//       const mockCurrentInput = { nativeElement: { value: '1' } };
//       component.inputs = { get: (i: number) => (i === 0 ? mockPrevInput : mockCurrentInput) } as any;
//       const event = new KeyboardEvent('keydown', { key: 'Backspace' });
//       spyOn(event, 'preventDefault');
//       component.onKeyDown(event, 1);
//       expect(mockPrevInput.nativeElement.focus).not.toHaveBeenCalled();
//       expect(event.preventDefault).not.toHaveBeenCalled();
//     });

//     it('should do nothing if key is not Backspace', () => {
//       const mockPrevInput = { nativeElement: { focus: jasmine.createSpy(), value: 'X' } };
//       const mockCurrentInput = { nativeElement: { value: '' } };
//       component.inputs = { get: (i: number) => (i === 0 ? mockPrevInput : mockCurrentInput) } as any;
//       const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
//       spyOn(event, 'preventDefault');
//       component.onKeyDown(event, 1);
//       expect(mockPrevInput.nativeElement.focus).not.toHaveBeenCalled();
//       expect(event.preventDefault).not.toHaveBeenCalled();
//     });
//   });
// });

// describe('CustomerModalTokenVerificationComponent - ofuscatedData (phone)', () => {
//   let component: CustomerModalTokenVerificationComponent;
//   let fixture: ComponentFixture<CustomerModalTokenVerificationComponent>;
//   let mockDialogRef: any;
//   let mockOtcService: any;
//   let mockNotificationModalService: any;
//   let dialogData: any;

//   beforeEach(async () => {
//     mockDialogRef = { close: jasmine.createSpy('close') };
//     mockOtcService = { sendSms: jasmine.createSpy('sendSms'), sendEmail: jasmine.createSpy('sendEmail') };
//     mockNotificationModalService = {
//       confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true }))
//     };
//     dialogData = { notificationType: 'phone', message: '1234567890', inputLength: 4 };

//     await TestBed.configureTestingModule({
//       declarations: [],
//       imports: [CustomerModalTokenVerificationComponent],
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         { provide: MAT_DIALOG_DATA, useValue: dialogData },
//         { provide: CustomerOtcService, useValue: mockOtcService },
//         { provide: CustomerNotificationModalService, useValue: mockNotificationModalService }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerModalTokenVerificationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should ofuscate a phone number showing only the last 2 digits', () => {
//     const result = component.ofuscatedData();
//     expect(result).toMatch(/^\*+90$/);
//     expect(result.length).toBe(10);
//   });

//   it('should resend sms when notificationType is phone', () => {
//     mockOtcService.sendSms.and.returnValue(of({}));
//     component.reSend();
//     expect(mockOtcService.sendSms).toHaveBeenCalledWith({
//       code: '',
//       phoneNumber: '1234567890',
//       onboarding: ''
//     });
//   });
// });

// describe('CustomerModalTokenVerificationComponent-inputLength', () => {
//   let component: CustomerModalTokenVerificationComponent;
//   let fixture: ComponentFixture<CustomerModalTokenVerificationComponent>;
//   let mockDialogRef: any;
//   let mockOtcService: any;
//   let mockNotificationModalService: any;
//   let dialogData: any;

//   beforeEach(async () => {
//     mockDialogRef = { close: jasmine.createSpy('close') };
//     mockOtcService = { otcOperation: jasmine.createSpy('otcOperation') };
//     mockNotificationModalService = {
//       confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true }))
//     };
//     dialogData = { notificationType: 'mail', message: 'usuario@test.com' };

//     await TestBed.configureTestingModule({
//       declarations: [],
//       imports: [CustomerModalTokenVerificationComponent],
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         { provide: MAT_DIALOG_DATA, useValue: dialogData },
//         { provide: CustomerOtcService, useValue: mockOtcService },
//         { provide: CustomerNotificationModalService, useValue: mockNotificationModalService }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerModalTokenVerificationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create component', () => {
//     expect(component).toBeTruthy();
//     expect(component.inputsArray.length).toBe(6);
//   });
// });

