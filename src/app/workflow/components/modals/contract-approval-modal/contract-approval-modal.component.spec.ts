import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ContractApprovalModalComponent } from './contract-approval-modal.component';
import { UserInfo } from '../../../../core/models/user-info';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('ContractApprovalModalComponent', () => {
  let component: ContractApprovalModalComponent;
  let fixture: ComponentFixture<ContractApprovalModalComponent>;
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
    takeServiceMock.take.and.returnValue(of({ workflowId: 1, name: '1' } as any));
    updateServiceMock.update.and.returnValue(of({ workflowId: 1, status: '1' } as any));
    notificationModalServiceMock.success.and.resolveTo({ value: true } as any);
    notificationModalServiceMock.error.and.resolveTo({ value: true } as any);

    await TestBed.configureTestingModule({
      declarations: [ContractApprovalModalComponent],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: NotificationModalService, useValue: notificationModalServiceMock },
        { provide: TakeService, useValue: takeServiceMock },
        { provide: UpdateService, useValue: updateServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: { data: { data: { id: 123 } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractApprovalModalComponent);
    component = fixture.componentInstance;
  });

  it('should create and call takeService on construction', () => {
    expect(component).toBeTruthy();
    expect(takeServiceMock.take).toHaveBeenCalledWith({ domainUser: '12345', workflowId: 123 });
  });

  it('should expose static table configs', () => {
    expect(component.configDataTable.showPag).toBeFalse();
    expect(component.phoneColumns.length).toBe(7);
    expect(component.mailColumns.length).toBe(4);
    expect(component.updatedPhones.length).toBe(3);
    expect(component.updatedMails.length).toBe(2);
  });

  it('should close dialog', () => {
    component.close();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should reject request after both confirmations', async () => {
    const firstDialogRef = { afterClosed: () => of({ value: true }) };
    const secondDialogRef = { afterClosed: () => of({ value: true, message: 'Rechazo' }) };
    dialogMock.open.and.returnValues(firstDialogRef as any, secondDialogRef as any);

    component.reject();
    await Promise.resolve();
    await Promise.resolve();

    expect(dialogMock.open).toHaveBeenCalledTimes(2);
    expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 4, reasonRejection: 'Rechazo' });
    expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
      title: 'Se ha Rechazado la Solicitud con ID 123',
      btnAccept: 'Terminar',
    });
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should stop reject flow when first confirmation is denied', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of({ value: false }) } as any);

    component.reject();

    expect(dialogMock.open).toHaveBeenCalledTimes(1);
    expect(updateServiceMock.update).not.toHaveBeenCalled();
  });

  it('should approve request', async () => {
    await component.approve();
    await Promise.resolve();

    expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 3 });
    expect(notificationModalServiceMock.success).toHaveBeenCalledWith({
      title: 'Se ha Aprobado la Solicitud con ID 123',
      btnAccept: 'Terminar'
    });
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });
});
