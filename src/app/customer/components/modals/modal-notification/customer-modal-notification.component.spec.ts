// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CustomerModalNotificationComponent } from './customer-modal-notification.component';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
// import { of } from 'rxjs';

// describe('CustomerModalNotificationComponent', () => {
//   let component: CustomerModalNotificationComponent;
//   let fixture: ComponentFixture<CustomerModalNotificationComponent>;
//   let mockDialogRef: jasmine.SpyObj<MatDialogRef<CustomerModalNotificationComponent>>;
//   let mockRouter: jasmine.SpyObj<Router>;
//   let mockActivatedRoute: Partial<ActivatedRoute>;

//   beforeEach(async () => {
//     mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
//     mockRouter = jasmine.createSpyObj('Router', ['navigate']);
//     mockActivatedRoute = { parent: {} as ActivatedRoute };

//     await TestBed.configureTestingModule({
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         { provide: Router, useValue: mockRouter },
//         { provide: ActivatedRoute, useValue: mockActivatedRoute },
//         {
//           provide: MAT_DIALOG_DATA,
//           useValue: {
//             type: 'info',
//             title: 'Test Title',
//             infoToCopy: '12345'
//           }
//         }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerModalNotificationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('isArray', () => {
//     it('should return true if value is an array', () => {
//       expect(component.isArray(['a', 'b'])).toBeTrue();
//     });

//     it('should return false if value is not an array', () => {
//       expect(component.isArray('not array')).toBeFalse();
//     });
//   });

//   describe('close', () => {
//     it('should close the dialog with value and message', () => {
//       component.close(true, 'test message');
//       expect(mockDialogRef.close).toHaveBeenCalledWith({ value: true, message: 'test message' });
//     });

//     it('should not navigate if type is other', () => {
//       (component as any).data.type = 'info';
//       component.close(false);
//       expect(mockRouter.navigate).not.toHaveBeenCalled();
//     });
//   });

//   it('should exit dialog when exit() is called', () => {
//     component.exit();
//     expect(mockDialogRef.close).toHaveBeenCalled();
//   });

//   describe('copyProspectNumber', () => {
//     let writeTextSpy: jasmine.Spy;

//     beforeEach(() => {
//       Object.defineProperty(navigator, 'clipboard', {
//         value: {
//           writeText: jasmine.createSpy().and.returnValue(Promise.resolve())
//         },
//         writable: true
//       });
//       writeTextSpy = navigator.clipboard.writeText as jasmine.Spy;
//     });

//     it('should copy infoToCopy to clipboard if available', async () => {
//       component.copyProspectNumber();
//       expect(writeTextSpy).toHaveBeenCalledWith('12345');
//     });

//     it('should not call clipboard if infoToCopy is undefined', async () => {
//       (component as any).data.infoToCopy = undefined;
//       component.copyProspectNumber();
//       expect(writeTextSpy).not.toHaveBeenCalled();
//     });
//   });
// })
