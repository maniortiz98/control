import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { HomonymyPmApprovalModalComponent } from './homonymy-pm-approval-modal.component';
import { UserInfo } from '../../../../core/models/user-info';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('HomonymyPmApprovalModalComponent', () => {
	let component: HomonymyPmApprovalModalComponent;
	let fixture: ComponentFixture<HomonymyPmApprovalModalComponent>;
	let dialogMock: jasmine.SpyObj<MatDialog>;
	let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
	let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;
	let takeServiceMock: jasmine.SpyObj<TakeService>;
	let updateServiceMock: jasmine.SpyObj<UpdateService>;
	let authServiceMock: jasmine.SpyObj<AuthService>;

	const mockUserInfo = signal<UserInfo>({
		name: 'John Doe',
		username: 'johndoe',
		employeeId: '12345',
		homeAccountId: 'home-67890',
		localAccountId: 'local-67890',
		idToken: 'token-abc123',
		roles: ['admin', 'user'],
		rol: 'admin'
	});

	beforeEach(async () => {
		dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
		notificationModalServiceMock = jasmine.createSpyObj('NotificationModalService', ['error', 'success']);
		notificationsServiceMock = jasmine.createSpyObj('NotificationsService', ['error']);
		takeServiceMock = jasmine.createSpyObj('TakeService', ['take']);
		updateServiceMock = jasmine.createSpyObj('UpdateService', ['update']);
		authServiceMock = jasmine.createSpyObj('AuthService', ['getUserInfo']);

		authServiceMock.getUserInfo.and.returnValue(mockUserInfo);
		takeServiceMock.take.and.returnValue(of({ workflowId: 1 } as any));
		updateServiceMock.update.and.returnValue(of({ workflowId: 1, status: '1' } as any));
		notificationModalServiceMock.success.and.resolveTo({ value: true } as any);
		notificationModalServiceMock.error.and.resolveTo({ value: true } as any);

		await TestBed.configureTestingModule({
			declarations: [HomonymyPmApprovalModalComponent],
			providers: [
				{ provide: MatDialog, useValue: dialogMock },
				{ provide: NotificationModalService, useValue: notificationModalServiceMock },
				{ provide: NotificationsService, useValue: notificationsServiceMock },
				{ provide: TakeService, useValue: takeServiceMock },
				{ provide: UpdateService, useValue: updateServiceMock },
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: MAT_DIALOG_DATA, useValue: { data: { id: 123 } } },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(HomonymyPmApprovalModalComponent);
		component = fixture.componentInstance;
	});

	it('should create and call takeService on construction', () => {
		expect(component).toBeTruthy();
		expect(takeServiceMock.take).toHaveBeenCalledWith({ domainUser: '12345', workflowId: 123 });
	});

	it('should close dialog', () => {
		component.close();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should toggle cell selection by column and id', () => {
		const element = { id: '1', companyName: 'Empresa' };

		component.toggleCell(element, 'companyName');
		expect(component.selectedCells.get('companyName')).toEqual({ id: '1', value: 'Empresa' });
		expect(component.isCellSelected(element, 'companyName')).toBeTrue();

		component.toggleCell(element, 'companyName');
		expect(component.selectedCells.has('companyName')).toBeFalse();
		expect(component.isCellSelected(element, 'companyName')).toBeFalse();
	});

	it('should update active single selection', () => {
		const element = { id: '2', rfc: 'RFC123' };

		component.updateSelection(element, 'rfc');
		expect(component.selectedCell).toEqual({ id: '2', column: 'rfc' });
		expect(component.isCellActive(element, 'rfc')).toBeTrue();

		component.updateSelection(element, 'rfc');
		expect(component.selectedCell).toBeNull();
		expect(component.isCellActive(element, 'rfc')).toBeNull();
	});

	it('should reject request after both confirmations', async () => {
		dialogMock.open.and.returnValues(
			{ afterClosed: () => of({ value: true }) } as any,
			{ afterClosed: () => of({ value: true, message: 'Rechazo Homo PM' }) } as any,
		);

		component.reject();
		await Promise.resolve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 4, reasonRejection: 'Rechazo Homo PM' });
		expect(notificationModalServiceMock.error).toHaveBeenCalled();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should approve request', async () => {
		await component.approve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 3 });
		expect(notificationModalServiceMock.success).toHaveBeenCalled();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});
});
