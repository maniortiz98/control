import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PmPldApprovalWorkflowComponent } from './pm-pld-approval-workflow.component';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('PmPldApprovalWorkflowComponent', () => {
	let component: PmPldApprovalWorkflowComponent;
	let fixture: ComponentFixture<PmPldApprovalWorkflowComponent>;
	let dialogMock: jasmine.SpyObj<MatDialog>;
	let catalogsServiceMock: jasmine.SpyObj<CatalogsService>;
	let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
	let updateServiceMock: jasmine.SpyObj<UpdateService>;

	const dialogData = {
		data: {
			id: 88,
		},
	};

	beforeEach(async () => {
		dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
		catalogsServiceMock = jasmine.createSpyObj('CatalogsService', [
			'getCountry',
			'getNationalities',
			'getFederalEntity',
		]);
		notificationModalServiceMock = jasmine.createSpyObj('NotificationModalService', ['success', 'error']);
		updateServiceMock = jasmine.createSpyObj('UpdateService', ['update']);

		catalogsServiceMock.getCountry.and.returnValue(of([{ id: 'MX', name: 'Mexico' }] as any));
		catalogsServiceMock.getNationalities.and.returnValue(of([{ nationalityId: 'MX', nationality: 'Mexicana' }] as any));
		catalogsServiceMock.getFederalEntity.and.returnValue(of([{ entityId: 'CMX', entity: 'Ciudad de Mexico' }] as any));
		notificationModalServiceMock.success.and.resolveTo({ value: true } as any);
		notificationModalServiceMock.error.and.resolveTo({ value: true } as any);
		updateServiceMock.update.and.returnValue(of({} as any));

		await TestBed.configureTestingModule({
			declarations: [PmPldApprovalWorkflowComponent],
			imports: [ReactiveFormsModule],
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: dialogData },
				{ provide: MatDialog, useValue: dialogMock },
				{ provide: CatalogsService, useValue: catalogsServiceMock },
				{ provide: NotificationModalService, useValue: notificationModalServiceMock },
				{ provide: UpdateService, useValue: updateServiceMock },
				{ provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['getUserInfo']) },
				{ provide: TakeService, useValue: jasmine.createSpyObj('TakeService', ['take']) },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(PmPldApprovalWorkflowComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load catalogs and configure columns on init', () => {
		component.ngOnInit();

		expect(catalogsServiceMock.getCountry).toHaveBeenCalledWith({ land: [] });
		expect(catalogsServiceMock.getNationalities).toHaveBeenCalledWith({ land: [] });
		expect(catalogsServiceMock.getFederalEntity).toHaveBeenCalledWith({ land1s: ['MX'] });
		expect(component.countries().length).toBe(1);
		expect(component.nationalities().length).toBe(1);
		expect(component.states().length).toBe(1);
		expect(component.columns.length).toBe(8);
		expect(component.columns[0]).toEqual(jasmine.objectContaining({ name: 'id', title: 'Id en lista' }));
	});

	it('should close all dialogs when close is called', () => {
		component.close();

		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should approve the workflow and close dialogs after success confirmation', async () => {
		component.profileForm.patchValue({ coment: 'APROBAR CAMBIO' });

		await component.approve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({
			workflowId: 88,
			status: 3,
			reasonRejection: 'APROBAR CAMBIO',
		});
		expect(notificationModalServiceMock.success).toHaveBeenCalledWith({
			title: 'Se ha Aprobado la Solicitud con ID88',
			btnAccept: 'Terminar'
		});
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should reject the workflow after both modal confirmations', async () => {
		const firstDialogRef = {
			afterClosed: () => of({ value: true }),
		};
		const secondDialogRef = {
			afterClosed: () => of({ value: true, message: 'MOTIVO DE RECHAZO' }),
		};
		dialogMock.open.and.returnValues(firstDialogRef as any, secondDialogRef as any);

		component.reject();
		await Promise.resolve();
		await Promise.resolve();

		expect(dialogMock.open).toHaveBeenCalledTimes(2);
		expect(updateServiceMock.update).toHaveBeenCalledWith({
			workflowId: 88,
			status: 4,
			reasonRejection: 'MOTIVO DE RECHAZO',
		});
		expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
			title: 'Se ha Rechazado la Solicitud con ID 88',
			btnAccept: 'Terminar',
		});
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should stop reject flow when first confirmation is denied', () => {
		const firstDialogRef = {
			afterClosed: () => of({ value: false }),
		};
		dialogMock.open.and.returnValue(firstDialogRef as any);

		component.reject();

		expect(dialogMock.open).toHaveBeenCalledTimes(1);
		expect(updateServiceMock.update).not.toHaveBeenCalled();
		expect(notificationModalServiceMock.error).not.toHaveBeenCalled();
	});

	it('should stop reject flow when reason dialog is cancelled', async () => {
		const firstDialogRef = {
			afterClosed: () => of({ value: true }),
		};
		const secondDialogRef = {
			afterClosed: () => of({ value: false, message: '' }),
		};
		dialogMock.open.and.returnValues(firstDialogRef as any, secondDialogRef as any);

		component.reject();
		await Promise.resolve();

		expect(dialogMock.open).toHaveBeenCalledTimes(2);
		expect(updateServiceMock.update).not.toHaveBeenCalled();
		expect(notificationModalServiceMock.error).not.toHaveBeenCalled();
	});
});

