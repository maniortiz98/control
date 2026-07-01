import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { CurpRfcApprovalComponent } from './curp-rfc-approval-modal.component';
import { UserInfo } from '../../../../core/models/user-info';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('CurpRfcApprovalComponent', () => {
  let component: CurpRfcApprovalComponent;
  let fixture: ComponentFixture<CurpRfcApprovalComponent>;
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
      taskNumber: 'TSK-01',
      bankingArea: '999',
      clientNumber: '456',
      personType: '1',
      role: 'Titular',
      financialCenter: 'Center',
      advisor: 'Advisor',
      workflowRequestStatus: 'Active',
      workflowRequestDate: '2023-10-01',
      workflowRequestTime: '12:00',
      firstName: 'John',
      secondName: 'Paul',
      lastName: 'Doe',
      secondLastName: 'Smith',
      curp: 'CURP123',
      updatedCurp: 'CURP999',
      rfc: 'RFC123',
      updatedRfc: 'RFC999'
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
      declarations: [CurpRfcApprovalComponent],
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

    fixture = TestBed.createComponent(CurpRfcApprovalComponent);
    component = fixture.componentInstance;
  });

  it('should create and call takeService on construction', () => {
    expect(component).toBeTruthy();
    expect(takeServiceMock.take).toHaveBeenCalledWith({ domainUser: '12345', workflowId: 123 });
  });

  it('should initialize form values on ngOnInit', () => {
    component.ngOnInit();

    expect(component.profileForm.get('taskNumber')?.value).toBe('TSK-01');
    expect(component.profileForm.get('bankingArea')?.value).toBe('BANCO');
    expect(component.profileForm.get('typeOfPerson')?.value).toBe('PERSONA FISICA');
    expect(component.profileForm.get('previousCurp')?.value).toBe('CURP123');
    expect(component.profileForm.get('newRFC')?.value).toBe('RFC999');
  });

  it('should close dialog', () => {
    component.close();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should reject request after both confirmations', async () => {
    dialogMock.open.and.returnValues(
      { afterClosed: () => of({ value: true }) } as any,
      { afterClosed: () => of({ value: true, message: 'Rechazo CURP RFC' }) } as any,
    );

    component.reject();
    await Promise.resolve();
    await Promise.resolve();

    expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 4, reasonRejection: 'Rechazo CURP RFC' });
    expect(notificationModalServiceMock.error).toHaveBeenCalled();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should approve request and close dialog', async () => {
    component.profileForm.patchValue({ comment: 'Aprobado CURP RFC' });

    await component.approve();
    await Promise.resolve();

    expect(updateServiceMock.update).toHaveBeenCalledWith({ workflowId: 123, status: 3, reasonRejection: 'Aprobado CURP RFC' });
    expect(notificationModalServiceMock.success).toHaveBeenCalled();
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });
});
