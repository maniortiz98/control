import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { InvestmentProfileRestructuringComponent } from './investment-profile-restructuring.component';
import { UserInfo } from '../../../../core/models/user-info';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('InvestmentProfileRestructuringComponent', () => {
	let component: InvestmentProfileRestructuringComponent;
	let fixture: ComponentFixture<InvestmentProfileRestructuringComponent>;
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

	const dialogData = {
		data: {
			id: 123,
			contract: { bankingArea: '999', contractNumber: '789' },
			client: { clientNumber: '456', typePerson: '1' },
			financialCenter: 'Center',
			advisor: 'Advisor',
			statusId: 2,
			createdDate: '2023-10-01',
			createdHour: '12:00',
			data: { profile: 'CONSERVADOR', profileUpd: 'AGRESIVO' }
		}
	};

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
			declarations: [InvestmentProfileRestructuringComponent],
			imports: [ReactiveFormsModule],
			providers: [
				{ provide: MatDialog, useValue: dialogMock },
				{ provide: CatalogsService, useValue: jasmine.createSpyObj('CatalogsService', ['getCountry']) },
				{ provide: NotificationModalService, useValue: notificationModalServiceMock },
				{ provide: TakeService, useValue: takeServiceMock },
				{ provide: UpdateService, useValue: updateServiceMock },
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: MAT_DIALOG_DATA, useValue: dialogData },
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(InvestmentProfileRestructuringComponent);
		component = fixture.componentInstance;
	});

	it('should create and call takeService on construction', () => {
		expect(component).toBeTruthy();
		expect(takeServiceMock.take).toHaveBeenCalledWith({ domainUser: '12345', workflowId: 123 });
	});

	it('should initialize form values on ngOnInit', () => {
		component.ngOnInit();

		expect(component.profileForm.get('taskNumber')?.value).toBe(123);
		expect(component.profileForm.get('bankingArea')?.value).toBe('BANCO');
		expect(component.profileForm.get('typeOfPerson')?.value).toBe('FISICA');
		expect(component.profileForm.get('statusRequestWorkflow')?.value).toBe('EN TRATAMIENTO');
		expect(component.profileForm.get('previousProfile')?.value).toBe('CONSERVADOR');
		expect(component.profileForm.get('newProfile')?.value).toBe('AGRESIVO');
	});

	it('should close dialog', () => {
		component.close();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should reject request after both confirmations', async () => {
		dialogMock.open.and.returnValues(
			{ afterClosed: () => of({ value: true }) } as any,
			{ afterClosed: () => of({ value: true, message: 'Rechazo IP' }) } as any,
		);

		component.reject();
		await Promise.resolve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 4, reasonRejection: 'Rechazo IP' });
		expect(notificationModalServiceMock.error).toHaveBeenCalled();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});

	it('should approve request and close dialog', async () => {
		component.profileForm.patchValue({ comment: 'Aprobado IP' });

		await component.approve();
		await Promise.resolve();

		expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 3, reasonRejection: 'Aprobado IP' });
		expect(notificationModalServiceMock.success).toHaveBeenCalled();
		expect(dialogMock.closeAll).toHaveBeenCalled();
	});
});
