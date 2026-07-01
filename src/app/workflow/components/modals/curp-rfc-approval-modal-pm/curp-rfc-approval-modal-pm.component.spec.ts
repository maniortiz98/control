import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { CurpRfcApprovalModalPmComponent } from './curp-rfc-approval-modal-pm.component';
import { UserInfo } from '../../../../core/models/user-info';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('CurpRfcApprovalModalPmComponent', () => {
	let component: CurpRfcApprovalModalPmComponent;
	let fixture: ComponentFixture<CurpRfcApprovalModalPmComponent>;
	let dialogMock: jasmine.SpyObj<MatDialog>;
	let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
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
		takeServiceMock = jasmine.createSpyObj('TakeService', ['take']);
		updateServiceMock = jasmine.createSpyObj('UpdateService', ['update']);
		authServiceMock = jasmine.createSpyObj('AuthService', ['getUserInfo']);

		authServiceMock.getUserInfo.and.returnValue(mockUserInfo);
		takeServiceMock.take.and.returnValue(of({ workflowId: 1 } as any));
		updateServiceMock.update.and.returnValue(of({ workflowId: 1, status: '1' } as any));
		notificationModalServiceMock.success.and.resolveTo({ value: true } as any);
		notificationModalServiceMock.error.and.resolveTo({ value: true } as any);

		await TestBed.configureTestingModule({
			declarations: [CurpRfcApprovalModalPmComponent],
			imports: [ReactiveFormsModule],
			providers: [
				{ provide: MatDialog, useValue: dialogMock },
				{ provide: NotificationModalService, useValue: notificationModalServiceMock },
				{ provide: TakeService, useValue: takeServiceMock },
				{ provide: UpdateService, useValue: updateServiceMock },
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: CatalogsService, useValue: jasmine.createSpyObj('CatalogsService', ['getCountry']) },
				{ provide: MAT_DIALOG_DATA, useValue: { data: { id: 123 } } },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(CurpRfcApprovalModalPmComponent);
		component = fixture.componentInstance;
	});

	it('should create and call takeService on construction', () => {
		expect(component).toBeTruthy();
		expect(takeServiceMock.take).toHaveBeenCalledWith({ domainUser: '12345', workflowId: 123 });
	});

	it('should initialize form with empty values on ngOnInit', () => {
		component.profileForm.patchValue({ taskNumber: 'filled', previousRFC: 'filled' });

		component.ngOnInit();

		expect(component.profileForm.get('taskNumber')?.value).toBe('');
		expect(component.profileForm.get('previousRFC')?.value).toBe('');
	});

	it('should close dialog', () => {
		component.close();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should reject request after both confirmations', async () => {
		dialogMock.open.and.returnValues(
			{ afterClosed: () => of({ value: true }) } as any,
			{ afterClosed: () => of({ value: true, message: 'Rechazo PM' }) } as any,
		);

		component.reject();
		await Promise.resolve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 4, reasonRejection: 'Rechazo PM' });
		expect(notificationModalServiceMock.error).toHaveBeenCalled();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should approve request and close dialog after confirmation', async () => {
		component.profileForm.patchValue({ comment: 'Comentario PM' });

		await component.approve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 3, reasonRejection: 'Comentario PM' });
		expect(notificationModalServiceMock.success).toHaveBeenCalled();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});
});
