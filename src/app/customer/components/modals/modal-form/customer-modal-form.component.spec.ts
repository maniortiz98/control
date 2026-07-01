// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { CustomerModalFormComponent } from './customer-modal-form.component';
// import { CustomerDataClient } from '../../../models/client-data';
// import { CustomerPositionHeld } from '../../../models/position-held';
// import { CustomerEconomicDependents } from '../../../models/economic-dependents';
// import { CustomerAddress } from '../../../models/customer-address';
// import { CustomerSocietiesAndAssociations } from '../../../models/societies-and-associations';

// describe('CustomerModalFormComponent (mock ViewChilds)', () => {
//   let component: CustomerModalFormComponent;
//   let fixture: ComponentFixture<CustomerModalFormComponent>;
//   let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CustomerModalFormComponent>>;

//   let submitPPESpy: jasmine.Spy;
//   let positionHeldSpy: jasmine.Spy;
//   let addressSubmitSpy: jasmine.Spy;
//   let societiesSpy: jasmine.Spy;
//   let dependentsSpy: jasmine.Spy;

//   beforeEach(async () => {
//     const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);

//     await TestBed.configureTestingModule({
//       declarations: [CustomerModalFormComponent],
//       providers: [
//         { provide: MatDialogRef, useValue: dialogRefSpyObj },
//         { provide: MAT_DIALOG_DATA, useValue: {} }
//       ],
//       schemas: [NO_ERRORS_SCHEMA] // Ignora tags de componentes hijos en el template si se hace detectChanges
//     }).compileComponents();

//     fixture = TestBed.createComponent(CustomerModalFormComponent);
//     component = fixture.componentInstance;
//     dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CustomerModalFormComponent>>;

//     // Mock de los @ViewChild (asignación directa de SpyObj)
//     component.clientDataComponent = jasmine.createSpyObj('CustomerClientDataComponent', ['submitPPE']) as any;
//     component.positionHeldComponent = jasmine.createSpyObj('CustomerPositionHeldComponent', ['sendInformation']) as any;
//     component.addressSectionComponent = jasmine.createSpyObj('CustomerAddressSectionComponent', ['onSubmit']) as any;
//     component.societiesAndAssociationsComponent = jasmine.createSpyObj('CustomerSocietiesAndAssociationsComponent', ['sendInformation']) as any;
//     component.economicDependentsComponent = jasmine.createSpyObj('CustomerEconomicDependentsComponent', ['sendInformation']) as any;

//     // Referencias a los spies (para configurar retornos en cada test)
//     submitPPESpy = (component.clientDataComponent as any).submitPPE;
//     positionHeldSpy = (component.positionHeldComponent as any).sendInformation;
//     addressSubmitSpy = (component.addressSectionComponent as any).onSubmit;
//     societiesSpy = (component.societiesAndAssociationsComponent as any).sendInformation;
//     dependentsSpy = (component.economicDependentsComponent as any).sendInformation;
//   });

//   afterEach(() => {
//     document.body.classList.remove('show-validation');
//     dialogRefSpy.close.calls.reset();
//   });

//   // const mockDataClient: CustomerDataClient = {
//   //   ppe: true,
//   //   bankAreaTypeId: '123',
//   //   contraTypeId: '456',
//   //   typeContractSubtypeId: '789',
//   //   curp: 'ABCD123456EFGHIJ01',
//   //   foreignerWithoutCurp: false,
//   //   rfc: 'XYZ123456789',
//   //   firstName: 'John',
//   //   middleName: 'Doe',
//   //   dateOfBirth: '1990-01-01',
//   //   firstLastName: 'Smith',
//   //   secondLastName: 'Johnson',
//   //   gender: 'Male',
//   //   maritalStatus: 'Single',
//   //   nationality: 'American',
//   //   countryOfBirth: 'USA',
//   //   stateOfBirth: 'California',
//   //   cityOfBirth: 'Los Angeles'
//   // };

//   const mockPositionHeld: CustomerPositionHeld = {
//     chargeDueDate: '2023-12-31',
//     relationship: 'Manager',
//     positionHeld: 'Chief Executive CustomerOfficer'
//   };

//   const mockEconomicDependents: CustomerEconomicDependents = {
//     relationship: 'CustomerSpouse',
//     occupation: 'Engineer',
//     businessTurnaround: 'Software Development',
//     phone: 1234567890
//   };

//   const mockAddress: CustomerAddress = {
//     addressRole: '1',
//     addressType: '1',
//     country: 'MX',
//     postalCode: '12345',
//     federalEntity: 'NL',
//     city: 'Monterrey',
//     municipality: 'Monterrey',
//     neighborhood: 'Centro',
//     street: 'Av. Juárez',
//     externalNumber: '123',
//     internalNumber: 'A',
//     confirmCp: 'yes',
//     timeLiveMexico: '5 years',
//     reasonsOpeningContractMexico: 'Employment',
//     proofOfAddressType: 'Utility Bill',
//     addressProofIssueDate: '2023-01-15',
//     expirationYear: '2025',
//     taxPostalCode: '12345',
//     geographicalArea: 'North',
//     deliveryCenter: 'Main Office'
//   };

//   const mockSocietiesAndAssociations: CustomerSocietiesAndAssociations = {
//     rfc: 'ABC123456789',
//     companyName: 'Tech Innovations Ltd.',
//     commercialBusiness: 'Technology Consulting',
//     administratorManagerAttorney: 'Jane Doe',
//     phone: '9876543210',
//     economicActivity: 'IT Services',
//     nationality: 'Mexican'
//   };

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should close the dialog on close()', () => {
//     component.close();
//     expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
//   });

//   // it('should add class and close dialog with data on saveFppe() null', async () => {
//   //   submitPPESpy.and.returnValue(Promise.resolve(null));
//   //   positionHeldSpy.and.returnValue(Promise.resolve(null));

//   //   await component.saveFppe();

//   //   expect(document.body.classList.contains('show-validation')).toBeTrue();
//   //   expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
//   // });

//   // it('should add class and close dialog with data on saveDppe() null', async () => {
//   //   submitPPESpy.and.returnValue(Promise.resolve(null));
//   //   dependentsSpy.and.returnValue(Promise.resolve(null));
//   //   addressSubmitSpy.and.returnValue(Promise.resolve(null));

//   //   await component.saveDppe();

//   //   expect(document.body.classList.contains('show-validation')).toBeTrue();
//   //   expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({ someData: 'value', dependentData: 'value', addressData: 'value' }));
//   // });

//   it('should not close dialog on saveAppe() when both results are null', async () => {
//     addressSubmitSpy.and.returnValue(Promise.resolve(null));
//     societiesSpy.and.returnValue(Promise.resolve(null));

//     await component.saveAppe();

//     expect(document.body.classList.contains('show-validation')).toBeTrue();
//     expect(dialogRefSpy.close).not.toHaveBeenCalled();
//   });

//   // it('should add class and close dialog with data on saveFppe() success', async () => {
//   //   submitPPESpy.and.returnValue(Promise.resolve(mockDataClient));
//   //   positionHeldSpy.and.returnValue(Promise.resolve(mockPositionHeld));

//   //   await component.saveFppe();

//   //   expect(document.body.classList.contains('show-validation')).toBeTrue();
//   //   expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining(({ ppe: true, bankAreaTypeId: '123', contraTypeId: '456', typeContractSubtypeId: '789', curp: 'ABCD123456EFGHIJ01', foreignerWithoutCurp: false, rfc: 'XYZ123456789', firstName: 'John', middleName: 'Doe', dateOfBirth: '1990-01-01', firstLastName: 'Smith', secondLastName: 'Johnson', gender: 'Male', maritalStatus: 'Single', nationality: 'American', countryOfBirth: 'USA', stateOfBirth: 'California', cityOfBirth: 'Los Angeles', chargeDueDate: '2023-12-31', relationship: 'Manager', positionHeld: 'Chief Executive CustomerOfficer' })));
//   // });

//   // it('should add class and close dialog with data on saveDppe() success', async () => {
//   //   submitPPESpy.and.returnValue(Promise.resolve(mockDataClient));
//   //   dependentsSpy.and.returnValue(Promise.resolve(mockEconomicDependents));
//   //   addressSubmitSpy.and.returnValue(Promise.resolve(mockAddress));

//   //   await component.saveDppe();

//   //   expect(document.body.classList.contains('show-validation')).toBeTrue();
//   //   expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({ someData: 'value', dependentData: 'value', addressData: 'value' }));
//   // });

//   it('should add class and close dialog with data on saveAppe() success', async () => {
//     addressSubmitSpy.and.returnValue(Promise.resolve(mockAddress));
//     societiesSpy.and.returnValue(Promise.resolve(mockSocietiesAndAssociations));

//     await component.saveAppe();

//     expect(document.body.classList.contains('show-validation')).toBeTrue();
//     expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining(({ rfc: 'ABC123456789', companyName: 'Tech Innovations Ltd.', commercialBusiness: 'Technology Consulting', administratorManagerAttorney: 'Jane Doe', phone: '9876543210', economicActivity: 'IT Services', nationality: 'Mexican', addressRole: '1', addressType: '1', country: 'MX', postalCode: '12345', federalEntity: 'NL', city: 'Monterrey', municipality: 'Monterrey', neighborhood: 'Centro', street: 'Av. Juárez', externalNumber: '123', internalNumber: 'A', confirmCp: 'yes', timeLiveMexico: '5 years', reasonsOpeningContractMexico: 'Employment', proofOfAddressType: 'Utility Bill', addressProofIssueDate: '2023-01-15', expirationYear: '2025', taxPostalCode: '12345', geographicalArea: 'North', deliveryCenter: 'Main Office' })));
//   });

//   it('should not close dialog on saveFppe() if any result is null', async () => {
//     submitPPESpy.and.returnValue(Promise.resolve(null));
//     positionHeldSpy.and.returnValue(Promise.resolve(mockPositionHeld));

//     await component.saveFppe();

//     expect(document.body.classList.contains('show-validation')).toBeTrue();
//     expect(dialogRefSpy.close).not.toHaveBeenCalled();
//   });

//   it('should not close dialog on saveDppe() if any result is null', async () => {
//     submitPPESpy.and.returnValue(Promise.resolve(null));
//     dependentsSpy.and.returnValue(Promise.resolve(mockEconomicDependents));
//     addressSubmitSpy.and.returnValue(Promise.resolve(mockAddress));

//     await component.saveDppe();

//     expect(document.body.classList.contains('show-validation')).toBeTrue();
//     expect(dialogRefSpy.close).not.toHaveBeenCalled();
//   });

//   it('should not close dialog on saveAppe() if any result is null', async () => {
//     addressSubmitSpy.and.returnValue(Promise.resolve(null));
//     societiesSpy.and.returnValue(Promise.resolve(mockSocietiesAndAssociations));

//     await component.saveAppe();

//     expect(document.body.classList.contains('show-validation')).toBeTrue();
//     expect(dialogRefSpy.close).not.toHaveBeenCalled();
//   });
// });





