// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { PpeInfoComponent } from './ppe-info.component';
// import { TableResultsComponent } from '../../../shared/components/table-results/table-results.component';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { of } from 'rxjs';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { ModalFormService } from './../../../shared/services/modal-form.service';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { FamilyPPEService } from '../../../shared/services/storage-services/family-ppe.service';
// import { DepPPEService } from '../../../shared/services/storage-services/dep-ppe.service';
// import { SocAssoPPEService } from '../../../shared/services/storage-services/soc-asso-ppe.service';
// import { PpeService } from '../../../shared/services/storage-services/ppe.service';
// import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
// import { NotificationModalService } from '../../../shared/services/notification-modal.service';
// import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
// import { CommonModule } from '@angular/common';
// import { MatSelectModule } from '@angular/material/select';
// import { HttpClientModule } from '@angular/common/http';

// const mockModalFormService = {
//   formModalDataPPE: jasmine.createSpy().and.returnValue(of(null)),
//   formModalDataDepPPE: jasmine.createSpy().and.returnValue(of(null)),
//   formModalDataAsoPPE: jasmine.createSpy().and.returnValue(of(null)),
// };

// const mockNotificationsService = {
//   success: jasmine.createSpy(),
//   error: jasmine.createSpy(),
// };

// const mockCatalogsService = {
//   getCatalog: jasmine.createSpy().and.callFake((type: string) => {
//     switch (type) {
//       case 'occupations':
//         return of([{ occupationId: "1", occupation: "ABOGADO", shortDescription: "ABOGADO ESPECIALIZADO EN DERECHO CIVIL" }]);
//       case 'relationships':
//         return of([{ "idParent": "01", "kinShip": "PADRE" }]);
//       case 'economicActivity':
//         return of([{ "lineBusinessId": "0100008", "lineBusiness": "AGRICULTURA" }]);
//       default:
//         return of([]);
//     }
//   }),
// };

// const mockFamilyPPEService = {
//   clear: jasmine.createSpy(),
//   add: jasmine.createSpy(),
//   addList: jasmine.createSpy(),
//   update: jasmine.createSpy().and.returnValue(true),
//   delete: jasmine.createSpy().and.returnValue(true),
//   getAll: jasmine.createSpy().and.returnValue([]),
// };

// const mockDepPPEService = {
//   clear: jasmine.createSpy(),
//   add: jasmine.createSpy(),
//   addList: jasmine.createSpy(),
//   update: jasmine.createSpy().and.returnValue(true),
//   delete: jasmine.createSpy().and.returnValue(true),
//   getAll: jasmine.createSpy().and.returnValue([]),
// };

// const mockSocAssoPPEService = {
//   clear: jasmine.createSpy(),
//   add: jasmine.createSpy(),
//   addList: jasmine.createSpy(),
//   update: jasmine.createSpy().and.returnValue(true),
//   delete: jasmine.createSpy().and.returnValue(true),
//   getAll: jasmine.createSpy().and.returnValue([]),
// };

// const mockPpeService = {
//   get: jasmine.createSpy().and.returnValue(null),
//   set: jasmine.createSpy(),
// };

// const mockPpeServiceData = {
//   get: jasmine.createSpy().and.returnValue({
//     ppe: false,
//     fppe: true,
//     dppe: true,
//     sappe: true,
//     typePPE: "",
//     positionHeld: "string",
//     expirationDate: "string",
//     dataClientFamilyPPE: [{ rfc: 'deps990101' }, { rfc: 'depr880202' }],
//     dataClientDepPPE: [{ rfc: 'deps990101' }, { rfc: 'depr880202' }],
//     dataClientSocAndAssoPPE: [{ rfc: 'deps990101' }, { rfc: 'depr880202' }],
//   }),
//   set: jasmine.createSpy(),
// };

// const mockUnsavedChangesService = {
//   setUnsavedChanges: jasmine.createSpy(),
// };

// const mockNotificationModalService = {
//   confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve({ value: true })),
// };

// const mockFirstDataClientService = {
//   getItem: jasmine.createSpy().and.returnValue({ ppe: true, nationality: 'MX' }),
// };

// describe('PpeInfoComponent', () => {
//   let component: PpeInfoComponent;
//   let fixture: ComponentFixture<PpeInfoComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [PpeInfoComponent, TableResultsComponent],
//       imports: [
//         CommonModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatRadioModule,
//         MatTableModule,
//         MatPaginatorModule,
//         MatSelectModule,
//         HttpClientModule
//       ],
//       providers: [
//         { provide: ModalFormService, useValue: mockModalFormService },
//         { provide: NotificationsService, useValue: mockNotificationsService },
//         { provide: CatalogsService, useValue: mockCatalogsService },
//         { provide: FamilyPPEService, useValue: mockFamilyPPEService },
//         { provide: DepPPEService, useValue: mockDepPPEService },
//         { provide: SocAssoPPEService, useValue: mockSocAssoPPEService },
//         { provide: PpeService, useValue: mockPpeService },
//         { provide: UnsavedChangesService, useValue: mockUnsavedChangesService },
//         { provide: NotificationModalService, useValue: mockNotificationModalService },
//         { provide: FirstDataClientService, useValue: mockFirstDataClientService },
//         FormBuilder,
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(PpeInfoComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize with default values', () => {
//     expect(component.profileForm).toBeDefined();
//     expect(component.dataFamily.length).toBe(0);
//     expect(component.dataEconomicDependents.length).toBe(0);
//     expect(component.dataAssociations.length).toBe(0);
//   });

//   it('should handle row edit for family PPE', async () => {
//     mockModalFormService.formModalDataPPE.and.returnValue(of({ relationship: 'PADRE', rfc: 'asdf990101' }));

//     const event = { type: 'edit', row: { rfc: 'asdf990101', relationship: 'PADRE' } };
//     await component.eventRowFppe(event);

//     expect(mockModalFormService.formModalDataPPE).toHaveBeenCalled();
//     expect(mockFamilyPPEService.update).toHaveBeenCalledWith('asdf990101', jasmine.any(Object));
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//   });

//   it('should not delete last family PPE', async () => {
//     const event = { type: 'delete', row: { rfc: 'asdf990101' } };
//     mockFamilyPPEService.getAll.and.returnValue([{ rfc: 'asdf990101' }]);
//     await component.eventRowFppe(event);
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Error no se pueden borrar todos los familiares PPE');
//   });

//   it('should handle row edit for dep PPE', async () => {
//     mockModalFormService.formModalDataDepPPE.and.returnValue(of({ relationship: 'PADRE', rfc: 'asdf990101' }));

//     const event = { type: 'edit', row: { rfc: 'asdf990101', relationship: 'PADRE' } };
//     await component.eventRowDppe(event);

//     expect(mockModalFormService.formModalDataDepPPE).toHaveBeenCalled();
//     expect(mockDepPPEService.update).toHaveBeenCalledWith('asdf990101', jasmine.any(Object));
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//   });

//   it('should not delete last dep PPE', async () => {
//     const event = { type: 'delete', row: { rfc: 'asdf990101' } };
//     mockDepPPEService.getAll.and.returnValue([{ rfc: 'asdf990101' }]);
//     await component.eventRowDppe(event);
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Error no se pueden borrar todos los dependientes PPE');
//   });

//   it('should handle row edit for sanda PPE', async () => {
//     mockModalFormService.formModalDataAsoPPE.and.returnValue(of({ relationship: 'PADRE', rfc: 'asdf990101' }));

//     const event = { type: 'edit', row: { rfc: 'asdf990101' } };
//     await component.eventRowAppe(event);

//     expect(mockModalFormService.formModalDataAsoPPE).toHaveBeenCalled();
//     expect(mockSocAssoPPEService.update).toHaveBeenCalledWith('asdf990101', jasmine.any(Object));
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//   });

//   it('should not delete last sanda PPE', async () => {
//     const event = { type: 'delete', row: { rfc: 'asdf990101' } };
//     mockSocAssoPPEService.getAll.and.returnValue([{ rfc: 'asdf990101' }]);
//     await component.eventRowAppe(event);
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Error no se pueden borrar todas las sociedades y asosiaciones PPE');
//   });

//   it('should add family PPE and update dataFamily when result is not null', () => {
//     const mockResult = { relationship: 'PADRE', rfc: 'asdf123' };
//     mockModalFormService.formModalDataPPE.and.returnValue(of(mockResult));
//     mockFamilyPPEService.add.and.returnValue(true);
//     mockFamilyPPEService.getAll.and.returnValue([mockResult]);

//     component.fppe();

//     expect(mockFamilyPPEService.add).toHaveBeenCalledWith(mockResult);
//     expect(component.dataFamily.length).toBe(1);
//     expect(component.dataFamily[0].relationship).toBe('');
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//   });

//   it('should show error notification when adding family PPE fails', () => {
//     const mockResult = { relationship: 'Sibling', rfc: '123' };
//     mockModalFormService.formModalDataPPE.and.returnValue(of(mockResult));
//     mockFamilyPPEService.add.and.returnValue(false);

//     component.fppe();

//     expect(mockFamilyPPEService.add).toHaveBeenCalledWith(mockResult);
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Ya se encuentra una persona registrada con esa informacion');
//   });

//   it('should add economic dependent PPE and update dataEconomicDependents when result is not null', () => {
//     const mockResult = { rfc: '123', name: 'John Doe' };
//     mockModalFormService.formModalDataDepPPE.and.returnValue(of(mockResult));
//     mockDepPPEService.add.and.returnValue(true);
//     mockDepPPEService.getAll.and.returnValue([mockResult]);

//     component.dppe();

//     expect(mockDepPPEService.add).toHaveBeenCalledWith(mockResult);
//     expect(component.dataEconomicDependents.length).toBe(1);
//     expect(component.dataEconomicDependents[0].rfc).toBe('123');
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//   });

//   it('should show error notification when adding economic dependent PPE fails', () => {
//     const mockResult = { rfc: '123', name: 'John Doe' };
//     mockModalFormService.formModalDataDepPPE.and.returnValue(of(mockResult));
//     mockDepPPEService.add.and.returnValue(false);

//     component.dppe();

//     expect(mockDepPPEService.add).toHaveBeenCalledWith(mockResult);
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Ya se encuentra una persona registrada con esa informacion');
//   });

//   it('should add association PPE and update dataAssociations when result is not null', () => {
//     const mockResult = { rfc: '123', companyName: 'Company XYZ' };
//     mockModalFormService.formModalDataAsoPPE.and.returnValue(of(mockResult));
//     mockSocAssoPPEService.add.and.returnValue(true);
//     mockSocAssoPPEService.getAll.and.returnValue([mockResult]);

//     component.appe();

//     expect(mockSocAssoPPEService.add).toHaveBeenCalledWith(mockResult);
//     expect(component.dataAssociations.length).toBe(1);
//     expect(component.dataAssociations[0].rfc).toBe('123');
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//   });

//   it('should show error notification when adding association PPE fails', () => {
//     const mockResult = { rfc: '123', companyName: 'Company XYZ' };
//     mockModalFormService.formModalDataAsoPPE.and.returnValue(of(mockResult));
//     mockSocAssoPPEService.add.and.returnValue(false);

//     component.appe();

//     expect(mockSocAssoPPEService.add).toHaveBeenCalledWith(mockResult);
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Ya se encuentra una persona registrada con esa informacion');
//   });
// });

// describe('PpeInfoComponent Delete', () => {
//   let component: PpeInfoComponent;
//   let fixture: ComponentFixture<PpeInfoComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [PpeInfoComponent, TableResultsComponent],
//       imports: [
//         CommonModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatRadioModule,
//         MatTableModule,
//         MatPaginatorModule,
//         MatSelectModule,
//         HttpClientModule
//       ],
//       providers: [
//         { provide: ModalFormService, useValue: mockModalFormService },
//         { provide: NotificationsService, useValue: mockNotificationsService },
//         { provide: CatalogsService, useValue: mockCatalogsService },
//         { provide: FamilyPPEService, useValue: mockFamilyPPEService },
//         { provide: DepPPEService, useValue: mockDepPPEService },
//         { provide: SocAssoPPEService, useValue: mockSocAssoPPEService },
//         { provide: PpeService, useValue: mockPpeServiceData },
//         { provide: UnsavedChangesService, useValue: mockUnsavedChangesService },
//         { provide: NotificationModalService, useValue: mockNotificationModalService },
//         { provide: FirstDataClientService, useValue: mockFirstDataClientService },
//         FormBuilder,
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(PpeInfoComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//   it('should delete a dependent PPE if confirmed', async () => {
//     mockDepPPEService.getAll.and.returnValue([{ rfc: 'deps990101' }, { rfc: 'depr880202' }]);
//     const event = { type: 'delete', row: { rfc: 'deps990101' } };
//     mockNotificationModalService.confirm;
//     await component.eventRowDppe(event);
//     expect(mockDepPPEService.delete).toHaveBeenCalledWith('deps990101');
//     expect(mockNotificationsService.success).toHaveBeenCalledWith('Borrado con exito');
//   });

//   it('should delete a family PPE if confirmed', async () => {
//     mockFamilyPPEService.getAll.and.returnValue([{ rfc: 'deps990101' }, { rfc: 'depr880202' }]);
//     const event = { type: 'delete', row: { rfc: 'deps990101' } };
//     mockNotificationModalService.confirm;
//     await component.eventRowFppe(event);
//     expect(mockFamilyPPEService.delete).toHaveBeenCalledWith('deps990101');
//     expect(mockNotificationsService.success).toHaveBeenCalledWith('Borrado con exito');
//   });

//   it('should delete a sanda PPE if confirmed', async () => {
//     mockSocAssoPPEService.getAll.and.returnValue([{ rfc: 'deps990101' }, { rfc: 'depr880202' }]);
//     const event = { type: 'delete', row: { rfc: 'deps990101' } };
//     mockNotificationModalService.confirm;
//     await component.eventRowAppe(event);
//     expect(mockSocAssoPPEService.delete).toHaveBeenCalledWith('deps990101');
//     expect(mockNotificationsService.success).toHaveBeenCalledWith('Borrado con exito');
//   });

//   it('should set addFppe to true when fppe selection is yes', () => {
//     const event = { value: 'yes' } as MatRadioChange<any>;
//     component.onSelectionChangeFppe(event);
//     expect(component.addFppe()).toBe(true);
//   });

//   it('should set addFppe to false when fppe selection is no and dataFamily is empty', () => {
//     component.dataFamily = [];
//     const event = { value: 'no' } as MatRadioChange<any>;
//     component.onSelectionChangeFppe(event);
//     expect(component.addFppe()).toBe(false);
//   });

//   it('should patch fppe to yes when fppe selection is no and dataFamily is not empty', () => {
//     component.dataFamily = [{
//       rfc: '123',
//       curp: '',
//       foreignerWithoutCurp: false,
//       firstName: '',
//       middleName: '',
//       dateOfBirth: '',
//       firstLastName: '',
//       secondLastName: '',
//       nationality: '',
//       countryOfBirth: '',
//       stateOfBirth: '',
//       chargeDueDate: '',
//       relationship: '',
//       positionHeld: ''
//     }];
//     const event = { value: 'no' } as MatRadioChange<any>;
//     component.onSelectionChangeFppe(event);
//     expect(component.profileForm.get('fppe')?.value).toBe('yes');
//   });

//   it('should set addDppe to true when dppe selection is yes', () => {
//     const event = { value: 'yes' } as MatRadioChange<any>;
//     component.onSelectionChangeDppe(event);
//     expect(component.addDppe()).toBe(true);
//   });

//   it('should set addDppe to false when dppe selection is no and dataEconomicDependents is empty', () => {
//     component.dataEconomicDependents = [];
//     const event = { value: 'no' } as MatRadioChange<any>;
//     component.onSelectionChangeDppe(event);
//     expect(component.addDppe()).toBe(false);
//   });

//   it('should patch dppe to yes when dppe selection is no and dataEconomicDependents is not empty', () => {
//     component.dataEconomicDependents = [{
//       rfc: '123',
//       curp: '',
//       foreignerWithoutCurp: false,
//       firstName: '',
//       middleName: '',
//       dateOfBirth: '',
//       firstLastName: '',
//       secondLastName: '',
//       nationality: '',
//       countryOfBirth: '',
//       stateOfBirth: '',
//       relationship: '',
//       occupation: '',
//       businessTurnaround: '',
//       phone: 0,
//       addressType: '',
//       country: '',
//       postalCode: '',
//       federalEntity: '',
//       city: '',
//       municipality: '',
//       neighborhood: '',
//       street: '',
//       externalNumber: ''
//     }];
//     const event = { value: 'no' } as MatRadioChange<any>;
//     component.onSelectionChangeDppe(event);
//     expect(component.profileForm.get('deppe')?.value).toBe('yes');
//   });

//   it('should set addAppe to true when appe selection is yes', () => {
//     const event = { value: 'yes' } as MatRadioChange<any>;
//     component.onSelectionChangeAppe(event);
//     expect(component.addAppe()).toBe(true);
//   });

//   it('should set addAppe to false when appe selection is no and dataAssociations is empty', () => {
//     component.dataAssociations = [];
//     const event = { value: 'no' } as MatRadioChange<any>;
//     component.onSelectionChangeAppe(event);
//     expect(component.addAppe()).toBe(false);
//   });

//   it('should patch appe to yes when appe selection is no and dataAssociations is not empty', () => {
//     component.dataAssociations = [{
//       rfc: '123',
//       companyName: '',
//       commercialBusiness: '',
//       administratorManagerAttorney: '',
//       phone: '',
//       economicActivity: '',
//       nationality: '',
//       addressType: '',
//       country: '',
//       postalCode: '',
//       federalEntity: '',
//       city: '',
//       municipality: '',
//       neighborhood: '',
//       street: '',
//       externalNumber: ''
//     }];
//     const event = { value: 'no' } as MatRadioChange<any>;
//     component.onSelectionChangeAppe(event);
//     expect(component.profileForm.get('sappe')?.value).toBe('yes');
//   });
// });


// describe('PpeInfoComponent - onSubmit', () => {
//   let component: PpeInfoComponent;
//   let fixture: ComponentFixture<PpeInfoComponent>;
//   const onSubmit = {
//     get: jasmine.createSpy().and.returnValue({
//       ppe: 'yes',
//       dataClientFamilyPPE: {
//         rfc: '123',
//         curp: '',
//         foreignerWithoutCurp: false,
//         firstName: '',
//         middleName: '',
//         dateOfBirth: '',
//         firstLastName: '',
//         secondLastName: '',
//         nationality: '',
//         countryOfBirth: '',
//         stateOfBirth: '',
//         chargeDueDate: '',
//         relationship: '',
//         positionHeld: '',
//       },
//         dataClientDepPPE: {
//         rfc: '123',
//         curp: '',
//         foreignerWithoutCurp: false,
//         firstName: '',
//         middleName: '',
//         dateOfBirth: '',
//         firstLastName: '',
//         secondLastName: '',
//         nationality: '',
//         countryOfBirth: '',
//         stateOfBirth: '',
//         relationship: '',
//         occupation: '',
//         businessTurnaround: '',
//         phone: 0,
//         addressType: '',
//         country: '',
//         postalCode: '',
//         federalEntity: '',
//         city: '',
//         municipality: '',
//         neighborhood: '',
//         street: '',
//         externalNumber: ''
//       },
//       dataClientSocAndAssoPPE: {
//         rfc: '123',
//         companyName: '',
//         commercialBusiness: '',
//         administratorManagerAttorney: '',
//         phone: '',
//         economicActivity: '',
//         nationality: '',
//         addressType: '',
//         country: '',
//         postalCode: '',
//         federalEntity: '',
//         city: '',
//         municipality: '',
//         neighborhood: '',
//         street: '',
//         externalNumber: ''
//       }
//     }
//     ),
//     set: jasmine.createSpy(),
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [PpeInfoComponent, TableResultsComponent],
//       imports: [
//         CommonModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatRadioModule,
//         MatTableModule,
//         MatPaginatorModule,
//         MatSelectModule,
//         HttpClientModule
//       ],
//       providers: [
//         { provide: ModalFormService, useValue: mockModalFormService },
//         { provide: NotificationsService, useValue: mockNotificationsService },
//         { provide: CatalogsService, useValue: mockCatalogsService },
//         { provide: FamilyPPEService, useValue: mockFamilyPPEService },
//         { provide: DepPPEService, useValue: mockDepPPEService },
//         { provide: SocAssoPPEService, useValue: mockSocAssoPPEService },
//         { provide: PpeService, useValue: onSubmit },
//         { provide: UnsavedChangesService, useValue: mockUnsavedChangesService },
//         { provide: NotificationModalService, useValue: mockNotificationModalService },
//         { provide: FirstDataClientService, useValue: mockFirstDataClientService },
//         FormBuilder,
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(PpeInfoComponent);
//     component = fixture.componentInstance;

//     component.profileForm = component.fb.group({
//       ppe: ['yes', Validators.required],
//       positionHeld: ['Manager', Validators.required],
//       expirationDate: ['2023-12-31'],
//       fppe: ['yes'],
//       deppe: ['yes'],
//       sappe: ['yes'],
//     });

//     fixture.detectChanges();
//   });

//   it('should show error notification when form is invalid', () => {
//     component.profileForm.controls['ppe'].setValue('');
//     component.onSubmit();
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Faltan campos obligatorios por capturar');
//   });

//   it('should show error notification when no family PPE is registered but marked as yes', () => {
//     mockFamilyPPEService.getAll.and.returnValue([]);
//     component.onSubmit();
//     expect(mockNotificationsService.error).toHaveBeenCalledWith('Tiene algún familiar que sea Persona Políticamente Expuesta está marcado en SI pero no tiene registro.');
//   });

//   it('should save data and show success notification when form is valid and data is complete', () => {
//     const mockFamilyData = [{
//       rfc: '123',
//       curp: '',
//       foreignerWithoutCurp: false,
//       firstName: '',
//       middleName: '',
//       dateOfBirth: '',
//       firstLastName: '',
//       secondLastName: '',
//       nationality: '',
//       countryOfBirth: '',
//       stateOfBirth: '',
//       chargeDueDate: '',
//       relationship: '',
//       positionHeld: ''
//     }];
//     const mockDepData = [{
//       rfc: '123',
//       curp: '',
//       foreignerWithoutCurp: false,
//       firstName: '',
//       middleName: '',
//       dateOfBirth: '',
//       firstLastName: '',
//       secondLastName: '',
//       nationality: '',
//       countryOfBirth: '',
//       stateOfBirth: '',
//       relationship: '',
//       occupation: '',
//       businessTurnaround: '',
//       phone: 0,
//       addressType: '',
//       country: '',
//       postalCode: '',
//       federalEntity: '',
//       city: '',
//       municipality: '',
//       neighborhood: '',
//       street: '',
//       externalNumber: ''
//     }];
//     const mockSocAsoData = [{
//       rfc: '123',
//       companyName: '',
//       commercialBusiness: '',
//       administratorManagerAttorney: '',
//       phone: '',
//       economicActivity: '',
//       nationality: '',
//       addressType: '',
//       country: '',
//       postalCode: '',
//       federalEntity: '',
//       city: '',
//       municipality: '',
//       neighborhood: '',
//       street: '',
//       externalNumber: ''
//     }];

//     mockFamilyPPEService.getAll.and.returnValue(mockFamilyData);
//     mockDepPPEService.getAll.and.returnValue(mockDepData);
//     mockSocAssoPPEService.getAll.and.returnValue(mockSocAsoData);

//     component.onSubmit();

//     expect(mockPpeService.set).toHaveBeenCalledWith(jasmine.objectContaining({
//       ppe: 'yes',
//       dataClientFamilyPPE: mockFamilyData,
//       dataClientDepPPE: mockDepData,
//       dataClientSocAndAssoPPE: mockSocAsoData,
//     }));
//     expect(mockNotificationsService.success).toHaveBeenCalledWith('Guardado con éxito');
//     expect(mockUnsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(false);
//   });
// });
