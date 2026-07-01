import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { TrustsApprovalModalWorkflowComponent } from './trusts-approval-modal-workflow.component';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { AuthService } from '../../../../core/services/auth.service';

describe('TrustsApprovalModalWorkflowComponent', () => {
	let component: TrustsApprovalModalWorkflowComponent;
	let fixture: ComponentFixture<TrustsApprovalModalWorkflowComponent>;
	let dialogMock: jasmine.SpyObj<MatDialog>;
	let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
	let takeServiceMock: jasmine.SpyObj<TakeService>;
	let updateServiceMock: jasmine.SpyObj<UpdateService>;
	let authServiceMock: jasmine.SpyObj<AuthService>;

	const userInfo = {
		name: 'Usuario',
		username: 'usuario',
		employeeId: 'EMP001',
		homeAccountId: '',
		localAccountId: '',
		idToken: '',
		roles: [],
		rol: '',
	};

	const dialogData = {
		data: {
			id: 77,
		},
	};

	beforeEach(async () => {
		dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
		notificationModalServiceMock = jasmine.createSpyObj('NotificationModalService', ['success', 'error']);
		takeServiceMock = jasmine.createSpyObj('TakeService', ['take']);
		updateServiceMock = jasmine.createSpyObj('UpdateService', ['update']);
		authServiceMock = jasmine.createSpyObj('AuthService', ['getUserInfo']);

		const userSignal = jasmine.createSpy('userSignal').and.returnValue(userInfo);
		authServiceMock.getUserInfo.and.returnValue(userSignal as any);
		takeServiceMock.take.and.returnValue(of({} as any));
		updateServiceMock.update.and.returnValue(of({} as any));
		notificationModalServiceMock.success.and.resolveTo({ value: true } as any);
		notificationModalServiceMock.error.and.resolveTo({ value: true } as any);

		await TestBed.configureTestingModule({
			declarations: [TrustsApprovalModalWorkflowComponent],
			imports: [ReactiveFormsModule],
			providers: [
				{ provide: MAT_DIALOG_DATA, useValue: dialogData },
				{ provide: MatDialog, useValue: dialogMock },
				{ provide: NotificationModalService, useValue: notificationModalServiceMock },
				{ provide: TakeService, useValue: takeServiceMock },
				{ provide: UpdateService, useValue: updateServiceMock },
				{ provide: AuthService, useValue: authServiceMock },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(TrustsApprovalModalWorkflowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create and take the workflow on construction', () => {
		expect(component).toBeTruthy();
		expect(takeServiceMock.take).toHaveBeenCalledWith({
			domainUser: 'EMP001',
			workflowId: 77,
		});
	});

	it('should close all dialogs when close is called', () => {
		component.close();

		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should approve the workflow and close dialogs after confirmation', async () => {
		component.profileForm.patchValue({ comment: 'APROBAR CAMBIO' });

		await component.approve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({
			workflowId: 77,
			status: 3,
			reasonRejection: 'APROBAR CAMBIO',
		});
		expect(notificationModalServiceMock.success).toHaveBeenCalledWith({
			title: 'Se ha Aprobado la Solicitud con ID77',
			btnAccept: 'Terminar'
		});
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should reject the workflow after both dialog confirmations', async () => {
		const firstDialogRef = {
			afterClosed: () => of({ value: true }),
		};
		const secondDialogRef = {
			afterClosed: () => of({ value: true, message: 'DATOS INCOMPLETOS' }),
		};
		dialogMock.open.and.returnValues(firstDialogRef as any, secondDialogRef as any);

		component.reject();
		await Promise.resolve();
		await Promise.resolve();

		expect(dialogMock.open).toHaveBeenCalledTimes(2);
		expect(updateServiceMock.update).toHaveBeenCalledWith({
			workflowId: 77,
			status: 4,
			reasonRejection: 'DATOS INCOMPLETOS',
		});
		expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
			title: 'Se ha Rechazado la Solicitud con ID 77',
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

	it('should stop reject flow when rejection reason dialog is cancelled', async () => {
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
