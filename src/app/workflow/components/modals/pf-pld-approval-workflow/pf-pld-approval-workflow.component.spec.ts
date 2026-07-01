import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PfPldApprovalWorkflowComponent } from './pf-pld-approval-workflow.component';
import { UserInfo } from '../../../../core/models/user-info';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

describe('PfPldApprovalWorkflowComponent', () => {
  let component: PfPldApprovalWorkflowComponent;
  let fixture: ComponentFixture<PfPldApprovalWorkflowComponent>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
  let takeServiceMock: jasmine.SpyObj<TakeService>;
  let updateServiceMock: jasmine.SpyObj<UpdateService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let catalogServiceMock: jasmine.SpyObj<CatalogsService>;

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
      client: {
        typePerson: 1,
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Paul',
        secondLastName: 'Smith',
        genre: '1',
        nacionality: 'MX',
        clientNumber: '456',
        birthdate: '01/01/1990',
        rol: 'Representante'
      },
      identification: { rfc: 'ABCD010101AAA', nif: '', tin: '', nss: '' },
      curp: 'ABCD010101HDFLLL01',
      financialCenter: 'Center',
      advisor: 'Advisor',
      typeOperation: 'Operation',
      contract: { bankingArea: '999', contractNumber: '789' },
      statusId: 'Active',
      workFlowAssignmentId: 'WF-123',
      createdDate: '2023-10-01',
      createdHour: '12:00',
      repeat: [
        {
          id: '1',
          clientNumber: '456',
          firstName: 'John',
          middleName: 'Paul',
          lastName: 'Doe',
          secondLastName: 'Smith',
          status: 'Active',
          listName: 'List',
          stream: 'Stream'
        }
      ]
    }
  };

  beforeEach(async () => {
    dialogMock = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    notificationModalServiceMock = jasmine.createSpyObj('NotificationModalService', ['error', 'success']);
    takeServiceMock = jasmine.createSpyObj('TakeService', ['take']);
    updateServiceMock = jasmine.createSpyObj('UpdateService', ['update']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    catalogServiceMock = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getNationalities', 'getFederalEntity']);

    authServiceMock.getUserInfo.and.returnValue(mockUserInfo);
    takeServiceMock.take.and.returnValue(of({ workflowId: 1, name: '1' } as any));
    updateServiceMock.update.and.returnValue(of({ workflowId: 1, status: '1' } as any));
    catalogServiceMock.getCountry.and.returnValue(of([{ id: 'MX', name: 'Mexico' }] as any));
    catalogServiceMock.getNationalities.and.returnValue(of([{ nationalityId: 'MX', nationality: 'Mexicana' }] as any));
    catalogServiceMock.getFederalEntity.and.returnValue(of([{ entityId: 'DF', entity: 'Ciudad de Mexico' }] as any));
    notificationModalServiceMock.success.and.resolveTo({ value: true } as any);
    notificationModalServiceMock.error.and.resolveTo({ value: true } as any);

    await TestBed.configureTestingModule({
      declarations: [PfPldApprovalWorkflowComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: NotificationModalService, useValue: notificationModalServiceMock },
        { provide: TakeService, useValue: takeServiceMock },
        { provide: UpdateService, useValue: updateServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CatalogsService, useValue: catalogServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PfPldApprovalWorkflowComponent);
    component = fixture.componentInstance;
  });

  it('should create and call takeService on construction', () => {
    expect(component).toBeTruthy();
    expect(takeServiceMock.take).toHaveBeenCalledWith({
      domainUser: '12345',
      workflowId: 123,
    });
  });

  it('should initialize catalogs, form values and repeated entries on ngOnInit', () => {
    component.ngOnInit();

    expect(catalogServiceMock.getCountry).toHaveBeenCalledWith({ land: [] });
    expect(catalogServiceMock.getNationalities).toHaveBeenCalledWith({ land: [] });
    expect(catalogServiceMock.getFederalEntity).toHaveBeenCalledWith({ land1s: ['MX'] });
    expect(component.countries().length).toBe(1);
    expect(component.nationalities().length).toBe(1);
    expect(component.states().length).toBe(1);
    expect(component.columns.length).toBe(9);
    expect(component.profileForm.get('noTaskS')?.value).toBe(123);
    expect(component.profileForm.get('typePerson')?.value).toBe('FISICA');
    expect(component.profileForm.get('rfc')?.value).toBe('ABCD010101AAA');
    expect(component.profileForm.get('bankArea')?.value).toBe('BANCO');
    expect(component.dataTable).toEqual([
      jasmine.objectContaining({
        id: '1',
        Idclient: '456',
        name: 'John',
        operative: 'Stream',
      })
    ]);
  });

  it('should close dialog', () => {
    component.close();

    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should approve request and close dialog after success confirmation', async () => {
    component.profileForm.patchValue({ coment: 'APROBADO POR PLD' });

    await component.approve();
    await Promise.resolve();

    expect(updateServiceMock.update).toHaveBeenCalledWith({
      workflowId: 123,
      status: 3,
      reasonRejection: 'APROBADO POR PLD'
    });
    expect(notificationModalServiceMock.success).toHaveBeenCalledWith({
      title: 'Se ha Aprobado la Solicitud con ID123',
      btnAccept: 'Terminar'
    });
    expect(dialogMock.closeAll).toHaveBeenCalled();
  });

  it('should reject request after both confirmations', async () => {
    const firstDialogRef = {
      afterClosed: () => of({ value: true }),
    };
    const secondDialogRef = {
      afterClosed: () => of({ value: true, message: 'RECHAZO PLD' }),
    };
    dialogMock.open.and.returnValues(firstDialogRef as any, secondDialogRef as any);

    component.reject();
    await Promise.resolve();
    await Promise.resolve();

    expect(dialogMock.open).toHaveBeenCalledTimes(2);
    expect(updateServiceMock.update).toHaveBeenCalledWith({
      workflowId: 123,
      status: 4,
      reasonRejection: 'RECHAZO PLD'
    });
    expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
      title: 'Se ha Rechazado la Solicitud con ID 123',
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