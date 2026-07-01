// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { CustomerModalSearchClientComponent } from './customer-modal-search-client.component';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
// import { CustomerSearchClientFlowService } from '../../../services/customer-search-client-flow.service';
// import { of } from 'rxjs';
// import { CustomerTableResultsComponent } from '../../table-results/customer-table-results.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { CustomerSearchCustomerComponent } from '../../search-customer/customer-search-customer.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { MatRadioButton } from '@angular/material/radio';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { Component } from '@angular/core';
// import { By } from '@angular/platform-browser';

// @Component({ selector: 'app-customer-search-customer', template: '', standalone: false })
// class MockSearchCustomerComponent {
//   submit = jasmine.createSpy('submit').and.returnValue(Promise.resolve({
//     results: { prospectiveResponse: [{ clientNumber: '456' }] }
//   }));
// }

// describe('CustomerModalSearchClientComponent', () => {
//   let component: CustomerModalSearchClientComponent;
//   let fixture: ComponentFixture<CustomerModalSearchClientComponent>;

//   const mockDialogRef = {
//     close: jasmine.createSpy('close'),
//     updateSize: jasmine.createSpy('updateSize')
//   };

//   let mockNotificationService: jasmine.SpyObj<CustomerNotificationsService>;
//   let mockSearchClientFlowService: jasmine.SpyObj<CustomerSearchClientFlowService>;




//   beforeEach(async () => {

//     mockNotificationService = jasmine.createSpyObj('CustomerNotificationsService', ['error', 'success']);
//     mockSearchClientFlowService = jasmine.createSpyObj('CustomerSearchClientFlowService', ['searchClientWithValidations']);

//     await TestBed.configureTestingModule({
//       declarations: [CustomerModalSearchClientComponent, CustomerTableResultsComponent, MockSearchCustomerComponent],
//       imports: [ReactiveFormsModule, MatTableModule, MatSelectModule, MatRadioButton,
//         BrowserAnimationsModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//       ],
//       providers: [
//         { provide: MatDialogRef, useValue: mockDialogRef },
//         { provide: MAT_DIALOG_DATA, useValue: { typeId: 'MANCOMUNADA' } },
//         { provide: CustomerNotificationsService, useValue: mockNotificationService },
//         { provide: CustomerSearchClientFlowService, useValue: mockSearchClientFlowService }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerModalSearchClientComponent);
//     component = fixture.componentInstance;

//     //component.searchComponent = mockSearchComponent as any;

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call dialogRef.close on cancel', () => {
//     component.cancel();
//     expect(mockDialogRef.close).toHaveBeenCalled();
//   });

//   it('should update tableData and page on nextPage', () => {
//     const items = { results: { prospectiveResponse: [{ clientNumber: '123' }] } };
//     component.nextPage(items);
//     expect(component.tableData).toEqual([{ clientNumber: '123' }]);
//     expect(component.page()).toBe(2);
//   });

//   it('should call submit and nextPage on search', fakeAsync(async () => {
//     component.searchComponent = fixture.debugElement.query(
//       By.directive(MockSearchCustomerComponent)
//     ).componentInstance;

//     (component.searchComponent.submit as jasmine.Spy).and.returnValue(Promise.resolve({
//       results: { prospectiveResponse: [{ clientNumber: '456' }] }
//     }));

//     await component.search();
//     expect(component.tableData).toEqual([{ clientNumber: '456' }]);
//     expect(component.page()).toBe(2);
//   }));

//   it('should set response when selectItem is called', () => {
//     const event = { row: { clientNumber: '789' } };
//     component.selectItem(event);
//     expect(component.response).toEqual(event);
//   });

//   it('should show error if response is null on add', async () => {
//     component.response = null;
//     await component.add();
//     expect(mockNotificationService.error).toHaveBeenCalledWith(
//       'Debes Seleccionar un Cliente para Poder Agregarlo'
//     );
//     expect(mockSearchClientFlowService.searchClientWithValidations).not.toHaveBeenCalled();
//   });

//   it('should call searchClientWithValidations and close dialog on add with response', async () => {
//     const response = {
//       row: {
//         birthDate: '1990-01-01',
//         rfc: 'RFC123',
//         curp: 'CURP123',
//         clientNumber: '001',
//         ssn: 'SSN001',
//         personType: 'FISICA',
//         firstName: 'John',
//         middleName: 'M',
//         lastName: 'Doe',
//         secondLastName: 'Smith',
//         gender: 'M',
//         birthCountry: 'MX',
//         federalEntity: 'CDMX'
//       }
//     };
//     component.response = response;
//     mockSearchClientFlowService.searchClientWithValidations.and.returnValue(Promise.resolve('OK'));

//     await component.add();

//     expect(mockSearchClientFlowService.searchClientWithValidations).toHaveBeenCalledWith(
//       jasmine.objectContaining({
//         birthDate: '1990-01-01',
//         rfc: 'RFC123',
//         curp: 'CURP123',
//         clientNumber: '001',
//         nif: 'CURP123',
//         ssn: 'SSN001',
//         personType: 'FISICA',
//         name: 'John',
//         middleName: 'M',
//         lastName: 'Doe',
//         secondLastName: 'Smith',
//         gender: 'M',
//         countryOfBirth: 'MX',
//         federalEntity: 'CDMX'
//       }),
//       true
//     );
//     expect(mockDialogRef.close).toHaveBeenCalledWith(response);
//   });

//   it('should call dialogRef.updateSize according to page signal', fakeAsync(() => {
//     expect(mockDialogRef.updateSize).toHaveBeenCalledWith('38vw', '80vh');
//   }));

//   it('should call dialogRef.updateSize according to second page signal', fakeAsync(() => {
//     mockDialogRef.updateSize.calls.reset();
//     component.page.set(2);
//     fixture.detectChanges();
//     expect(mockDialogRef.updateSize).toHaveBeenCalledWith('80vw', '80vh');
//   }));
// });


