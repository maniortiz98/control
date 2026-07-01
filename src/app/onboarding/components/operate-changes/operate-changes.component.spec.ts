// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { OperateChangesComponent } from './operate-changes.component';
// import { of, throwError } from 'rxjs';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CatalogsService } from '../../../shared/services/catalogs.service';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { OperateChangesStorageService } from '../../../shared/services/storage-services/operate-changes-storage.service';
// import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';

// class MockCatalogsService {
//   getCountry = jasmine.createSpy().and.returnValue(of([{country: 'MEXICO', countryId: 'MX', countryCode: '52'}]));
// }
// class MockNotificationsService {
//   success = jasmine.createSpy();
//   error = jasmine.createSpy();
// }
// class MockUnsavedChangesService {
//   setUnsavedChanges = jasmine.createSpy();
// }
// class MockCheckpointService {
//   saveCheckpoint = jasmine.createSpy().and.returnValue(of({}));
// }
// class MockStorageService {
//   operateChanges = jasmine.createSpy().and.returnValue(null);
//   setoperateChanges = jasmine.createSpy();
// }

// describe('OperateChangesComponent', () => {
//   let component: OperateChangesComponent;
//   let fixture: ComponentFixture<OperateChangesComponent>;
//   let notificationService: MockNotificationsService;
//   let checkpointService: MockCheckpointService;
//   let storageService: MockStorageService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [OperateChangesComponent, ],
//       imports: [ReactiveFormsModule],
//       providers: [
//         { provide: CatalogsService, useClass: MockCatalogsService },
//         { provide: NotificationsService, useClass: MockNotificationsService },
//         { provide: UnsavedChangesService, useClass: MockUnsavedChangesService },
//         { provide: CheckpointService, useClass: MockCheckpointService },
//         { provide: OperateChangesStorageService, useClass: MockStorageService }
//       ]
//     })
//     .overrideComponent(OperateChangesComponent, { set: { template: '' } })
//     .compileComponents();

//     fixture = TestBed.createComponent(OperateChangesComponent);
//     component = fixture.componentInstance;
//     notificationService = TestBed.inject(NotificationsService) as any;
//     checkpointService = TestBed.inject(CheckpointService) as any;
//     storageService = TestBed.inject(OperateChangesStorageService) as any;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call getCountry and set countries on ngOnInit', () => {
//     const spy = TestBed.inject(CatalogsService) as any;
//     component.ngOnInit();
//     expect(spy.getCountry).toHaveBeenCalled();
//     expect(component.countries().length).toBe(1);
//   });

//   it('should call unsavedChangesService when form value changes', () => {
//     const unsavedSpy = TestBed.inject(UnsavedChangesService) as any;
//     component.form.get('cash')?.setValue(true);
//     expect(unsavedSpy.setUnsavedChanges).toHaveBeenCalled();
//   });

//   it('should validateRules return correct messages when invalid', () => {
//     const result = component.validateRules();
//     expect(result[0]).toContain('Es Obligatorio Seleccionar');
//   });

//   it('should validateRules return empty when valid', () => {
//     component.form.patchValue({
//       metalChangeInversion: true,
//       cash: true
//     });
//     const result = component.validateRules();
//     expect(result[0]).toBe('');
//   });

//   it('should call notificationService.error when rules invalid', () => {
//     spyOn(component, 'validateRules').and.returnValue(['Error', 'Detalle']);
//     component.onSubmit();
//     expect(notificationService.error).toHaveBeenCalledWith('Error', 'Detalle');
//   });

//   it('should call checkpointService.saveCheckpoint and success when form valid', () => {
//     component.form.patchValue({
//       metalChangeInversion: true,
//       cash: true,
//       cashOperationNumber: '1-10',
//       cashOperationAmount: 'De $1 a $4,000 USCY'
//     });
//     component.onSubmit();
//     expect(checkpointService.saveCheckpoint).toHaveBeenCalled();
//     expect(notificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//   });

//   it('should show error when checkpointService.saveCheckpoint fails', () => {
//     checkpointService.saveCheckpoint.and.returnValue(throwError(() => new Error('Error')));
//     component.form.patchValue({
//       metalChangeInversion: true,
//       cash: true,
//       cashOperationNumber: '1-10',
//       cashOperationAmount: 'De $1 a $4,000 USCY'
//     });
//     component.onSubmit();
//     expect(notificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//   });

//   it('should show validation error when form invalid', () => {
//     component.form.patchValue({ metalChangeInversion: true });
//     component.form.markAsDirty();
//     component.onSubmit();
//     expect(notificationService.error).toHaveBeenCalledWith('Es Obligatorio Seleccionar dentro de la Sección “Tipo de transacción a realizar” ', 'Por favor Seleccione una Opción');
//   });

//   it('should update otherTypeSelected signal', () => {
//     component.form.patchValue({ otherType: 'Gold' });
//     component.setOtherType();
//     expect(component.otherTypeSelected()).toBe('Gold');
//   });

//   it('should charge initial values correctly', () => {
//     const content: any = {
//       metalChangeInversion: true,
//       currencySellAndBuy: true,
//       importAndExport: true,
//       countrySender: 'MX',
//       countryReciber: 'US',
//       resourceReception: true,
//       resourceCountrySender: 'MX',
//       cash: true,
//       cashOperationNumber: '1',
//       cashOperationAmount: '100',
//       transfer: true,
//       transferOperationNumber: '2',
//       transferOperationAmount: '200',
//       document: true,
//       documentOperationNumber: '3',
//       documentOperationAmount: '300',
//       travelerCheck: true,
//       travelerCheckOperationNumber: '4',
//       travelerCheckOperationAmount: '400',
//       gold: true,
//       goldOperationNumber: '5',
//       goldOperationAmount: '500',
//       silver: true,
//       silverOperationNumber: '6',
//       silverOperationAmount: '600',
//       other: true,
//       otherType: 'Other',
//       otherOperationNumber: '7',
//       otherOperationAmount: '700'
//     };
//     component.chargeInitialValues(content);
//     expect(component.form.value.countrySender).toBe('MX');
//     expect(component.form.value.otherType).toBe('Other');
//   });
// });
