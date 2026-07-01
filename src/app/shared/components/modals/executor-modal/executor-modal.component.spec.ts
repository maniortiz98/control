// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { of } from 'rxjs';
// import { signal } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// import { ExecutorModalComponent } from './executor-modal.component';

// // Servicios
// import { NotificationsService } from '../../../services/notifications.service';
// import { ModalSearchClientService } from '../../../services/modal-search-client.service';
// import { CatalogsService } from '../../../services/catalogs.service';
// import { SearchClientFlowService } from '../../../services/search-client-flow.service';
// import { CustomerInformationService } from '../../../services/customer.service';

// // Constantes
// import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

// // ======================================================
// // Mock ViewChild components
// // ======================================================
// class MockClientDataComponent {
//   profileForm = new FormGroup({
//     curp: new FormControl(''),
//     foreignerWithoutCurp: new FormControl(false),
//     countryOfBirth: new FormControl(''),
//     nationality: new FormControl(''),
//     rfc: new FormControl(''),
//     typeIden: new FormControl('1'),
//   });

//   data: any = null;

//   validadorFormComplet = jasmine.createSpy('validadorFormComplet').and.returnValue(false);
//   submitComplet = jasmine.createSpy('submitComplet').and.resolveTo({ client: 'ok' });
//   ngOnInit = jasmine.createSpy('ngOnInit');
// }

// class MockMiscellaneousSectionComponent {
//   form = new FormGroup({
//     relationship: new FormControl(''),
//     field1: new FormControl(''),
//   });

//   onSubmit = jasmine.createSpy('onSubmit').and.returnValue({ misc: 'ok' });
//   chargeInitialData = jasmine.createSpy('chargeInitialData');
// }

// class MockAddressSectionComponent {
//   profileForm = new FormGroup({
//     country: new FormControl('MX'),
//     street: new FormControl(''),
//   });

//   dataAddress: any = null;
//   ngOnInit = jasmine.createSpy('ngOnInit');
//   onSubmit = jasmine.createSpy('onSubmit').and.resolveTo({ address: 'ok' });
//   enableDisableFECityMun = jasmine.createSpy('enableDisableFECityMun');
// }

// class MockAutoCertificationSectionComponent {
//   form = new FormGroup({
//     country: new FormControl(''),
//     nationality: new FormControl(''),
//     rfc: new FormControl(''),
//     curp: new FormControl(''),
//   });

//   foreignerCURP = signal(false);
//   onSubmit = jasmine.createSpy('onSubmit').and.resolveTo({ auto: 'ok' });
// }

// class MockIdentificationSectionComponent {
//   form = new FormGroup({});
//   cantSave = false;
//   identificationList = signal<any[]>([]);
// }

// class MockMailSectionComponent {
//   form = new FormGroup({});
//   cantSave = false;
//   mailList = signal<any[]>([]);
// }

// class MockPhoneSectionComponent {
//   form = new FormGroup({});
//   cantSave = false;
//   phoneList = signal<any[]>([]);
// }

// class MockPpeSectionComponent {
//   form = new FormGroup({});
//   dataPPE: any = null;
//   ngOnInit = jasmine.createSpy('ngOnInit');
//   onSubmit = jasmine.createSpy('onSubmit').and.returnValue({ ppe: 'ok' });
// }

// // ======================================================
// // Mock services
// // ======================================================
// class MockNotificationsService {
//   error = jasmine.createSpy('error');
// }

// class MockModalSearchClientService {
//   searchClient = jasmine.createSpy('searchClient').and.resolveTo(null);
// }

// class MockCatalogsService {
//   getCountry = jasmine.createSpy('getCountry').and.returnValue(of([{ id: 'MX' }]));
//   getPhoneType = jasmine.createSpy('getPhoneType').and.returnValue(of([{ id: '1' }]));
//   getIdentificationType = jasmine.createSpy('getIdentificationType').and.returnValue(of([{ id: '1' }]));
// }

// class MockSearchClientFlowService {
//   validInHomonyms = jasmine.createSpy('validInHomonyms').and.resolveTo({ numberClient: null });
//   validInWatchList = jasmine.createSpy('validInWatchList').and.resolveTo(true);
// }

// class MockCustomerInformationService {
//   getCustomerInfo = jasmine.createSpy('getCustomerInfo').and.returnValue(of({ initialData: null }));
// }

// class MockMatDialogRef {
//   close = jasmine.createSpy('close');
// }

// describe('ExecutorModalComponent', () => {
//   let component: ExecutorModalComponent;
//   let fixture: ComponentFixture<ExecutorModalComponent>;

//   const baseDialogData: any = {
//     executorNumber: 10,
//     hasClientNumber: false,
//     signatureType: 'MANCOMUNADA',
//     executorAmount: 2,
//     isMaintenance: false,
//     readOnly: false,
//     content: null,
//     permises: null,
//     personId: 123,
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ExecutorModalComponent],
//       providers: [
//         FormBuilder,
//         { provide: MAT_DIALOG_DATA, useValue: baseDialogData },
//         { provide: MatDialogRef, useClass: MockMatDialogRef },
//         { provide: NotificationsService, useClass: MockNotificationsService },
//         { provide: ModalSearchClientService, useClass: MockModalSearchClientService },
//         { provide: CatalogsService, useClass: MockCatalogsService },
//         { provide: SearchClientFlowService, useClass: MockSearchClientFlowService },
//         { provide: CustomerInformationService, useClass: MockCustomerInformationService },
//       ],
//     })
//       .overrideComponent(ExecutorModalComponent, {
//         set: { template: '' },
//       })
//       .compileComponents();

//     fixture = TestBed.createComponent(ExecutorModalComponent);
//     component = fixture.componentInstance;

//     // ViewChild mocks
//     component.clientDataSection = new MockClientDataComponent() as any;
//     component.miscellaneousSection = new MockMiscellaneousSectionComponent() as any;
//     component.addressSection = new MockAddressSectionComponent() as any;
//     component.autoCertSection = new MockAutoCertificationSectionComponent() as any;
//     component.identificationSection = new MockIdentificationSectionComponent() as any;
//     component.mailSection = new MockMailSectionComponent() as any;
//     component.phoneSection = new MockPhoneSectionComponent() as any;
//     component.ppeSection = new MockPpeSectionComponent() as any;
//   });

//   describe('ngOnInit', () => {
//     it('debe setear signatureClass en true si signatureType es MANCOMUNADA', () => {
//       component.ngOnInit();

//       expect(component.signatureClass()).toBeTrue();
//       expect(component.executorNumber).toBe(10);
//       expect(component.executorAmount).toBe(2);
//     });

//     it('debe cargar catálogos y default autoCertification cuando no hay content', () => {
//       component.ngOnInit();

//       const catalogs = TestBed.inject(CatalogsService) as any;
//       expect(catalogs.getCountry).toHaveBeenCalled();
//       expect(catalogs.getPhoneType).toHaveBeenCalled();
//       expect(catalogs.getIdentificationType).toHaveBeenCalled();

//       expect(component.dataAutoCertification).toEqual({
//         mexicoResident: false,
//         curp: '',
//         foreignerWithoutCurp: false,
//         rfc: '',
//         name: '',
//         fiscalRegimeId: 0,
//         cfdiUsageId: '',
//         taxPostalCode: '',
//         nationality: '',
//         country: '',
//         fiscalResidenceAbroad: false,
//         facta: false,
//         crs: false,
//         fiscalResidences: [],
//       });
//     });

//     it('debe cargar data cuando existe content', () => {
//       const content = {
//         clientNumber: '123',
//         isActiveExecutor: true,
//         address: { street: 'Calle 1' },
//         dataSection: { name: 'Cliente' },
//         taxSection: { relationship: 'Padre' },
//         identifications: [{ id: 1 }],
//         phones: [{ id: 2 }],
//         mails: [{ id: 3 }],
//         ppeInfo: { foo: 'ppe' },
//         autoSign: null,
//         isExistingClient: true,
//       };

//       TestBed.resetTestingModule();
//     });
//   });

//   describe('ngAfterViewInit', () => {
//     it('debe suscribirse a cambios y sincronizar autoCert cuando foreignerWithoutCurp cambia', () => {
//       component.ngOnInit();
//       component.ngAfterViewInit();

//       component.clientDataSection.profileForm.get('curp')?.setValue('CURP123');
//       expect(component.autoCertSection.form.get('curp')?.value).toBe('CURP123');

//       component.clientDataSection.profileForm.get('foreignerWithoutCurp')?.setValue(true);
//       expect(component.autoCertSection.foreignerCURP()).toBeTrue();
//       expect(component.autoCertSection.form.get('country')?.enabled).toBeTrue();
//       expect(component.autoCertSection.form.get('nationality')?.enabled).toBeTrue();

//       component.clientDataSection.profileForm.get('foreignerWithoutCurp')?.setValue(false);
//       expect(component.autoCertSection.foreignerCURP()).toBeFalse();
//       expect(component.autoCertSection.form.get('country')?.disabled).toBeTrue();
//       expect(component.autoCertSection.form.get('nationality')?.disabled).toBeTrue();
//     });

//     it('debe copiar RFC a autoCert cuando typeIden = 1', () => {
//       component.ngOnInit();
//       component.ngAfterViewInit();

//       component.clientDataSection.profileForm.get('typeIden')?.setValue('1');
//       component.clientDataSection.profileForm.get('rfc')?.setValue('RFC123');

//       expect(component.autoCertSection.form.get('rfc')?.value).toBe('RFC123');
//     });

//     it('debe deshabilitar todo al inicializar cuando no hay mantenimiento y aplicar permisos por defecto', () => {
//       component.ngOnInit();
//       component.ngAfterViewInit();

//       expect(component.form.disabled).toBeTrue();
//       expect(component.clientDataSection.profileForm.disabled).toBeTrue();
//       expect(component.identificationPermises).toEqual(component.disabledAll);
//       expect(component.phonePermises).toEqual(component.disabledAll);
//       expect(component.mailPermises).toEqual(component.disabledAll);
//     });
//   });

//   describe('disableAll / enableAll', () => {
//     it('debe deshabilitar todos los formularios', () => {
//       component.disableAll();

//       expect(component.form.disabled).toBeTrue();
//       expect(component.clientDataSection.profileForm.disabled).toBeTrue();
//       expect(component.miscellaneousSection.form.disabled).toBeTrue();
//       expect(component.addressSection.profileForm.disabled).toBeTrue();
//       expect(component.ppeSection.profileForm.disabled).toBeTrue();
//       expect(component.autoCertSection.form.disabled).toBeTrue();
//       expect(component.identificationSection.form.disabled).toBeTrue();
//       expect(component.phoneSection.form.disabled).toBeTrue();
//       expect(component.mailSection.form.disabled).toBeTrue();
//     });

//     it('debe habilitar todos los formularios', () => {
//       component.enableAll();

//       expect(component.form.enabled).toBeTrue();
//       expect(component.clientDataSection.profileForm.enabled).toBeTrue();
//       expect(component.miscellaneousSection.form.enabled).toBeTrue();
//       expect(component.addressSection.profileForm.enabled).toBeTrue();
//       expect(component.ppeSection.profileForm.enabled).toBeTrue();
//       expect(component.autoCertSection.form.enabled).toBeTrue();
//       expect(component.identificationSection.form.enabled).toBeTrue();
//       expect(component.phoneSection.form.enabled).toBeTrue();
//       expect(component.mailSection.form.enabled).toBeTrue();
//       expect(component.addressSection.enableDisableFECityMun).toHaveBeenCalledWith('MX');
//     });
//   });

//   describe('disableAllButtons / enableAllButtons', () => {
//     it('debe deshabilitar botones y marcar cantSave en true', () => {
//       component.disableAllButtons();

//       expect(component.mailSection.cantSave).toBeTrue();
//       expect(component.identificationSection.cantSave).toBeTrue();
//       expect(component.phoneSection.cantSave).toBeTrue();
//     });

//     it('debe habilitar botones y marcar cantSave en false', () => {
//       component.enableAllButtons();

//       expect(component.mailSection.cantSave).toBeFalse();
//       expect(component.identificationSection.cantSave).toBeFalse();
//       expect(component.phoneSection.cantSave).toBeFalse();
//     });
//   });

//   describe('cancel', () => {
//     it('debe cerrar el diálogo', () => {
//       component.cancel();
//       expect(TestBed.inject(MatDialogRef)).toBeTruthy();
//       expect((TestBed.inject(MatDialogRef) as any).close).toHaveBeenCalled();
//     });
//   });

//   describe('applySectionPermissions', () => {
//     // it('debe habilitar campos específicos si fieldsEnabled tiene valores', () => {
//     //   const form = new FormGroup({
//     //     a: new FormControl(''),
//     //     b: new FormControl(''),
//     //   });

//     //   component.data = {
//     //     permises: {
//     //       testSection: {
//     //         allDisabled: false,
//     //         fieldsEnabled: ['a'],
//     //       },
//     //     },
//     //   } as any;

//     //   component.applySectionPermissions('testSection', form);

//     //   expect(form.get('a')?.enabled).toBeTrue();
//     //   expect(form.get('b')?.disabled).toBeTrue();
//     // });

//     // it('debe habilitar todo si allDisabled=false y fieldsEnabled vacío', () => {
//     //   const form = new FormGroup({
//     //     a: new FormControl(''),
//     //   });

//     //   component.data = {
//     //     permises: {
//     //       testSection: {
//     //         allDisabled: false,
//     //         fieldsEnabled: [],
//     //       },
//     //     },
//     //   } as any;

//     //   component.applySectionPermissions('testSection', form);

//     //   expect(form.enabled).toBeTrue();
//     // });
//   });

//   describe('applyPermisesSections', () => {
//     // it('debe aplicar permisos para cliente existente con data', () => {
//     //   spyOn(component.miscellaneousSection.form, 'disable').and.callThrough();
//     //   spyOn(component.addressSection.profileForm, 'disable').and.callThrough();
//     //   spyOn(component.ppeSection.profileForm, 'disable').and.callThrough();

//     //   component.data = {
//     //     permises: {},
//     //   } as any;

//     //   component.applyPermisesSections(true, true);

//     //   expect(component.miscellaneousSection.form.disabled).toBeTrue();
//     //   expect(component.addressSection.profileForm.disabled).toBeTrue();
//     //   expect(component.ppeSection.profileForm.disabled).toBeTrue();
//     //   expect(component.identificationSection.form.enabled).toBeTrue();
//     //   expect(component.phoneSection.form.enabled).toBeTrue();
//     //   expect(component.mailSection.form.enabled).toBeTrue();
//     // });

//     it('debe aplicar permisos de primera vez cuando no hay data', () => {
//       component.applyPermisesSections(false, false);

//       expect(component.clientDataSection.profileForm.enabled).toBeTrue();
//       expect(component.form.enabled).toBeTrue();
//       expect(component.identificationPermises).toEqual(component.disabledAll);
//       expect(component.phonePermises).toEqual(component.disabledAll);
//       expect(component.mailPermises).toEqual(component.disabledAll);
//     });
//   });

//   describe('searchClient', () => {
//     it('debe buscar cliente y aplicar permisos si hay resultado y watchlist', fakeAsync(async () => {
//       const searchSvc = TestBed.inject(ModalSearchClientService) as any;
//       spyOn(component, 'searchNewClient').and.resolveTo(true);
//       spyOn(component, 'applyPermisesSections').and.callThrough();

//       searchSvc.searchClient.and.resolveTo({ clientNumber: 100 });

//       await component.searchClient();
//       tick();

//       expect(component.searchNewClient).toHaveBeenCalledWith(100);
//       expect(component.applyPermisesSections).toHaveBeenCalledWith(true, true);
//       expect(component.isExistingClient()).toBeTrue();
//     }));
//   });

//   describe('cancelValid', () => {
//     it('debe reactivar formulario principal y deshabilitar todo lo demás', () => {
//       spyOn<any>(window as any, 'console');
//       component.cancelValid();

//       expect(component.form.enabled).toBeTrue();
//       expect(component.clientDataSection.profileForm.enabled).toBeTrue();
//       expect(component.mailSection.cantSave).toBeTrue();
//     });
//   });

//   // describe('valid', () => {
//   //   it('debe buscar homónimos y aplicar permisos si watchlist es true', fakeAsync(async () => {
//   //     spyOn(component.clientDataSection, 'submitComplet').and.resolveTo({ client: 'ok' });
//   //     spyOn(component, 'searchNewClient').and.resolveTo(true);
//   //     spyOn(component, 'applyPermisesSections').and.callThrough();

//   //     const flowSvc = TestBed.inject(SearchClientFlowService) as any;
//   //     flowSvc.validInHomonyms.and.resolveTo({ numberClient: 999 });

//   //     await component.valid();
//   //     tick();

//   //     expect(component.searchNewClient).toHaveBeenCalledWith(999);
//   //     expect(component.isExistingClient()).toBeTrue();
//   //     expect(component.applyPermisesSections).toHaveBeenCalled();
//   //   }));

//   //   it('debe validar en watchlist si no hay homónimo', fakeAsync(async () => {
//   //     spyOn(component.clientDataSection, 'submitComplet').and.resolveTo({ client: 'ok' });
//   //     spyOn(component, 'searchNewClient').and.resolveTo(true);
//   //     spyOn(component, 'applyPermisesSections').and.callThrough();

//   //     const flowSvc = TestBed.inject(SearchClientFlowService) as any;
//   //     flowSvc.validInHomonyms.and.resolveTo({ numberClient: null });

//   //     await component.valid();
//   //     tick();

//   //     expect(flowSvc.validInWatchList).toHaveBeenCalled();
//   //     expect(component.isExistingClient()).toBeFalse();
//   //   }));
//   // });

//   describe('searchClientByNumber', () => {
//     it('no debe hacer nada si value está vacío', async () => {
//       spyOn(component, 'searchNewClient').and.resolveTo(true);
//       await component.searchClientByNumber({ target: { value: '' } });

//       expect(component.searchNewClient).not.toHaveBeenCalled();
//     });

//     // it('debe buscar cliente por número', fakeAsync(async () => {
//     //   spyOn(component, 'searchNewClient').and.resolveTo(true);
//     //   spyOn(component, 'applyPermisesSections').and.callThrough();

//     //   await component.searchClientByNumber({ target: { value: '1234' } });
//     //   tick();

//     //   expect(component.searchNewClient).toHaveBeenCalledWith('1234');
//     //   expect(component.isExistingClient()).toBeTrue();
//     //   expect(component.applyPermisesSections).toHaveBeenCalledWith(true, true);
//     // }));
//   });

//   describe('searchNewClient', () => {
//     it('debe devolver true y mapear información cuando watchlist valida', fakeAsync(async () => {
//       const customerSvc = TestBed.inject(CustomerInformationService) as any;
//       const flowSvc = TestBed.inject(SearchClientFlowService) as any;

//       customerSvc.getCustomerInfo.and.returnValue(of({
//         initialData: { id: 1 },
//         generalInformation: { g: 2 },
//         addresses: { a: 3 },
//         identifications: [{ id: 1 }],
//         ppeInformation: { p: 4 },
//         emails: [{ id: 2 }],
//         telephones: [{ id: 3 }],
//         fiscalResidences: [],
//       }));

//       flowSvc.validInWatchList.and.resolveTo(true);
//       spyOn(component, 'mapInfoToForm').and.callThrough();

//       const result = await component.searchNewClient(111);
//       tick();

//       expect(result).toBeTrue();
//       expect(component.mapInfoToForm).toHaveBeenCalled();
//     }));

//     it('debe devolver false si watchlist no valida', fakeAsync(async () => {
//       const customerSvc = TestBed.inject(CustomerInformationService) as any;
//       const flowSvc = TestBed.inject(SearchClientFlowService) as any;

//       customerSvc.getCustomerInfo.and.returnValue(of({
//         initialData: { id: 1 },
//       }));

//       flowSvc.validInWatchList.and.resolveTo(false);
//       spyOn(component, 'mapInfoToForm').and.callThrough();

//       const result = await component.searchNewClient(111);
//       tick();

//       expect(result).toBeFalse();
//       expect(component.mapInfoToForm).not.toHaveBeenCalled();
//     }));
//   });

//   describe('mapInfoToForm', () => {
//     // it('debe mapear toda la info a las secciones hijas', () => {
//     //   const searchedClient: any = {
//     //     initialData: { x: 1 },
//     //     generalInformation: { y: 2 },
//     //     addresses: { z: 3 },
//     //     identifications: [{ id: 1 }],
//     //     ppeInformation: { p: 4 },
//     //     emails: [{ id: 2 }],
//     //     telephones: [{ id: 3 }],
//     //     fiscalResidences: [],
//     //   };

//     //   spyOn<any>(component, 'dataSection', 'set');
//     //   component.mapInfoToForm(searchedClient);

//     //   expect(component.clientDataSection.data).toBeTruthy();
//     //   expect(component.clientDataSection.ngOnInit).toHaveBeenCalled();
//     //   expect(component.miscellaneousSection.chargeInitialData).toHaveBeenCalled();
//     //   expect(component.addressSection.dataAddress).toBeTruthy();
//     //   expect(component.addressSection.ngOnInit).toHaveBeenCalled();
//     //   expect(component.identificationSection.identificationList().length).toBe(1);
//     //   expect(component.ppeSection.dataPPE).toBeTruthy();
//     //   expect(component.ppeSection.ngOnInit).toHaveBeenCalled();
//     //   expect(component.mailSection.mailList().length).toBe(1);
//     //   expect(component.phoneSection.phoneList().length).toBe(1);
//     // });
//   });

//   describe('saveExecutor', () => {
//     // it('debe mostrar error si faltan identificaciones', fakeAsync(async () => {
//     //   component.clientDataSection.validadorFormComplet.and.returnValue(false);
//     //   component.identificationSection.identificationList.set([]);
//     //   component.phoneSection.phoneList.set([
//     //     { active: true, phoneTypeId: '1', phoneNotification: true },
//     //   ] as any);
//     //   component.mailSection.mailList.set([
//     //     { active: true, mailNotification: true },
//     //   ] as any);

//     //   await component.saveExecutor();
//     //   tick();

//     //   const notification = TestBed.inject(NotificationsService) as any;
//     //   expect(notification.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_IDENTIFICATION);
//     // }));

//     // it('debe mostrar error si faltan datos de contacto', fakeAsync(async () => {
//     //   component.clientDataSection.validadorFormComplet.and.returnValue(false);
//     //   component.identificationSection.identificationList.set([
//     //     { active: true },
//     //   ] as any);
//     //   component.phoneSection.phoneList.set([
//     //     { active: true, phoneTypeId: '2', phoneNotification: true },
//     //   ] as any);
//     //   component.mailSection.mailList.set([
//     //     { active: true, mailNotification: false },
//     //   ] as any);

//     //   await component.saveExecutor();
//     //   tick();

//     //   const notification = TestBed.inject(NotificationsService) as any;
//     //   expect(notification.error).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
//     // }));

//     // it('debe cerrar el diálogo con payload correcto si todo es válido', fakeAsync(async () => {
//     //   component.clientDataSection.validadorFormComplet.and.returnValue(false);
//     //   component.clientDataSection.submitComplet.and.resolveTo({ client: 'ok' });

//     //   component.miscellaneousSection.onSubmit.and.returnValue({ misc: 'ok' });
//     //   component.ppeSection.onSubmit.and.returnValue({ ppe: 'ok' });
//     //   component.addressSection.onSubmit.and.resolveTo({ address: 'ok' });
//     //   component.autoCertSection.onSubmit.and.resolveTo({ auto: 'ok' });

//     //   component.identificationSection.identificationList.set([
//     //     { active: true, identification: 'id1' },
//     //   ] as any);

//     //   component.phoneSection.phoneList.set([
//     //     { active: true, phoneTypeId: '1', phoneNotification: true },
//     //   ] as any);

//     //   component.mailSection.mailList.set([
//     //     { active: true, mailNotification: true },
//     //   ] as any);

//     //   component.form.patchValue({
//     //     clientNumber: '100',
//     //     isActiveExecutor: true,
//     //   });

//     //   await component.saveExecutor();
//     //   tick();

//     //   const dialogRef = TestBed.inject(MatDialogRef) as any;
//     //   expect(dialogRef.close).toHaveBeenCalled();

//     //   const payload = dialogRef.close.calls.mostRecent().args[0];
//     //   expect(payload.executorNumber).toBe(10);
//     //   expect(payload.clientNumber).toBe('100');
//     //   expect(payload.isActiveExecutor).toBeTrue();
//     //   expect(payload.active).toBeTrue();
//     //   expect(payload.identifications.length).toBe(1);
//     //   expect(payload.phones.length).toBe(1);
//     //   expect(payload.mails.length).toBe(1);
//     // }));
//   });

//   // describe('applyMaintenancePermises', () => {
//   //   it('debe aplicar permisos de mantenimiento cuando hay permises y readOnly=false', () => {
//   //     component.data = {
//   //       isMaintenance: true,
//   //       readOnly: false,
//   //       permises: {
//   //         main: false,
//   //         autoCertSection: false,
//   //         ppeSection: false,
//   //         identificationSection: { allDisabled: false, fieldsEnabled: [] },
//   //         phoneSection: { allDisabled: false, fieldsEnabled: [] },
//   //         mailSection: { allDisabled: false, fieldsEnabled: [] },
//   //       },
//   //     } as any;

//   //     spyOn(component, 'applySectionPermissions').and.callThrough();
//   //     component.applyMaintenancePermises();

//   //     expect(component.applySectionPermissions).toHaveBeenCalled();
//   //     expect(component.form.disabled).toBeTrue();
//   //     expect(component.identificationPermises).toBeTruthy();
//   //     expect(component.phonePermises).toBeTruthy();
//   //     expect(component.mailPermises).toBeTruthy();
//   //   });

//   //   it('debe deshabilitar todo si no hay permisos', () => {
//   //     component.data = {
//   //       isMaintenance: true,
//   //       readOnly: false,
//   //       permises: null,
//   //     } as any;

//   //     component.applyMaintenancePermises();

//   //     expect(component.form.disabled).toBeTrue();
//   //     expect(component.clientDataSection.profileForm.disabled).toBeTrue();
//   //     expect(component.identificationPermises).toEqual(component.disabledAll);
//   //   });
//   // });
// });
