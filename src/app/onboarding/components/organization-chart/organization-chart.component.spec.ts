
// import { OrganizationChartComponent } from './organization-chart.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NotificationsService } from '../../../shared/services/notifications.service';
// import { NotificationModalService } from '../../../shared/services/notification-modal.service';
// import { MatDialog } from '@angular/material/dialog';
// import { CheckpointService } from '../../../shared/services/checkpoint.service';
// import { OrganizationChartService } from '../../../shared/services/storage-services/pm/organization-chart.service';
// import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
// import { of, throwError } from 'rxjs';
// import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { TableResultsComponent } from '../../../shared/components/table-results/table-results.component';

// describe('OrganizationChartComponent', () => {
//   let component: OrganizationChartComponent;
//   let fixture: ComponentFixture<OrganizationChartComponent>;
//   let mockNotificationService: jasmine.SpyObj<NotificationsService>;
//   let mockNotificationModalService: jasmine.SpyObj<NotificationModalService>;
//   let mockDialog: jasmine.SpyObj<MatDialog>;
//   let mockCheckpoint: jasmine.SpyObj<CheckpointService>;
//   let mockStorageService: jasmine.SpyObj<OrganizationChartService>;
//   let mockUnsavedChanges: jasmine.SpyObj<UnsavedChangesService>;

//   beforeEach(async () => {
//     mockNotificationService = jasmine.createSpyObj('NotificationsService', ['error', 'success']);
//     mockNotificationModalService = jasmine.createSpyObj('NotificationModalService', ['confirm']);
//     mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
//     mockCheckpoint = jasmine.createSpyObj('CheckpointService', ['saveCheckpoint']);
//     mockStorageService = jasmine.createSpyObj('OrganizationChartService', [
//       'organizationChartSection',
//       'setOrganizationChartSection'
//     ]);
//     mockUnsavedChanges = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);

//     await TestBed.configureTestingModule({
//       declarations: [OrganizationChartComponent, TableResultsComponent],
//       imports: [ReactiveFormsModule, MatTableModule, MatSelectModule],
//       providers: [
//         { provide: NotificationsService, useValue: mockNotificationService },
//         { provide: NotificationModalService, useValue: mockNotificationModalService },
//         { provide: MatDialog, useValue: mockDialog },
//         { provide: CheckpointService, useValue: mockCheckpoint },
//         { provide: OrganizationChartService, useValue: mockStorageService },
//         { provide: UnsavedChangesService, useValue: mockUnsavedChanges },
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(OrganizationChartComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('ngOnInit', () => {
//     it('should set hieraticLevelColumns', () => {
//       expect(component.hieraticLevelColumns.length).toBeGreaterThan(0);
//     });

//     it('should load data from storageService if available', () => {
//       const mockSection = {
//         firstName: 'Juan',
//         secondName: 'Carlos',
//         firstLastName: 'Pérez',
//         secondLastName: 'Lopez',
//         hieraticLevelTable: [{ id: '1', firstName: 'Jonh', secondName: 'Doe', firstLastName: 'a', secondLastName: 'b', charge: 'Dev' }],
//       };
//       mockStorageService.organizationChartSection.and.returnValue(mockSection);

//       component.ngOnInit();

//       expect(component.form.value.firstName).toBe('Juan');
//       expect(component.hieraticLevelData().length).toBe(1);
//     });
//   });

//   describe('onSubmit', () => {
//     it('should show error if required fields are missing', () => {
//       component.form.patchValue({ firstName: '' });
//       component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
//     });

//     it('should show error if no last names provided', () => {
//       component.form.patchValue({ firstName: 'Juan', firstLastName: '', secondLastName: '' });
//       component.onSubmit();
//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.AT_LEAST_ONE_LAST_NAME);
//     });

//     it('should save successfully when form is valid', () => {
//       component.form.patchValue({
//         firstName: 'Juan',
//         firstLastName: 'Pérez',
//       });
//       mockCheckpoint.saveCheckpoint.and.returnValue(of({ ok: true }));

//       component.onSubmit();

//       expect(mockUnsavedChanges.setUnsavedChanges).toHaveBeenCalledWith(false);
//       expect(mockStorageService.setOrganizationChartSection).toHaveBeenCalled();
//       expect(mockNotificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
//     });

//     it('should handle error on saveCheckpoint', () => {
//       component.form.patchValue({
//         firstName: 'Juan',
//         firstLastName: 'Pérez',
//       });
//       mockCheckpoint.saveCheckpoint.and.returnValue(throwError(() => new Error('fail')));

//       component.onSubmit();

//       expect(mockNotificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
//     });
//   });

//   describe('hieraticLevelEventHandler', () => {
//     it('should call editHieraticLevel when type is edit', async () => {
//       spyOn(component, 'editHieraticLevel');
//       await component.hieraticLevelEventHandeler({ type: 'edit', row: {} });
//       expect(component.editHieraticLevel).toHaveBeenCalled();
//     });

//     it('should call deleteHieraticLevel when type is delete', async () => {
//       spyOn(component, 'deleteHieraticLevel');
//       await component.hieraticLevelEventHandeler({ type: 'delete', row: {} });
//       expect(component.deleteHieraticLevel).toHaveBeenCalled();
//     });
//   });

//   describe('showHieraticLevelModal', () => {
//     it('should add new item when modal returns data', async () => {
//       const dialogRef = { afterClosed: () => of({ id: 1, firstName: 'Pedro', charge: 'Dev' }) };
//       mockDialog.open.and.returnValue(dialogRef as any);

//       await component.showHieraticLevelModal();

//       expect(component.hieraticLevelData().length).toBe(1);
//       expect(mockNotificationService.success).toHaveBeenCalled();
//     });
//   });

//   describe('editHieraticLevel', () => {
//     it('should update item when modal returns edited data', async () => {
//       component.hieraticLevelData.set([{ id: '1', firstName: 'Jonh', secondName: 'Doe', firstLastName: 'a', secondLastName: 'b', charge: 'Dev' }]);
//       const dialogRef = { afterClosed: () => of({ id: '1', firstName: 'Juan', secondName: 'Doe', firstLastName: 'a', secondLastName: 'b', charge: 'Dev' }) };
//       mockDialog.open.and.returnValue(dialogRef as any);

//       await component.editHieraticLevel({ row: { id: 1 } });

//       expect(component.hieraticLevelData()[0].firstName).toBe('Juan');
//       expect(mockNotificationService.success).toHaveBeenCalled();
//     });
//   });

//   describe('deleteHieraticLevel', () => {
//     it('should delete item when confirm is true', async () => {
//       component.hieraticLevelData.set([{ id: '1', firstName: 'Jonh', secondName: 'Doe', firstLastName: 'a', secondLastName: 'b', charge: 'Dev' }]);
//       mockNotificationModalService.confirm.and.resolveTo({ value: true });

//       await component.deleteHieraticLevel({ row: { id: 1 } });

//       expect(component.hieraticLevelData().length).toBe(0);
//       expect(mockNotificationService.success).toHaveBeenCalled();
//     });

//     it('should not delete when confirm is false', async () => {
//       component.hieraticLevelData.set([{ id: '1', firstName: 'Jonh', secondName: 'Doe', firstLastName: 'a', secondLastName: 'b', charge: 'Dev' }]);
//       mockNotificationModalService.confirm.and.resolveTo({ value: false });

//       await component.deleteHieraticLevel({ row: { id: 1 } });

//       expect(component.hieraticLevelData().length).toBe(1);
//     });
//   });
// });
