import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { InboxComponent } from './inbox.component';
import { InboxService } from '../../services/inbox.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { AuthService } from '../../../core/services/auth.service';
import { DetailService } from '../../services/detail-contract-approval';
import { DetailServicePldPf } from '../../services/pld-detail-pf';
import { DetailServiceHomoPf } from '../../services/detail-homo-pf';
import { CurpRfcPfService } from '../../services/curp-rfc-pf.service';
import { ERROR_MESSAGES } from '../../../onboarding/constants/form-messages';
import { ContractApprovalModalComponent } from '../modals/contract-approval-modal/contract-approval-modal.component';
import { HomonymyApprovalModalComponent } from '../modals/homonymy-approval-modal/homonymy-approval-modal.component';
import { CurpRfcApprovalComponent } from '../modals/curp-rfc-approval-modal/curp-rfc-approval-modal.component';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let inboxService: jasmine.SpyObj<InboxService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let authService: jasmine.SpyObj<AuthService>;
  let detailService: jasmine.SpyObj<DetailService>;
  let detailServicePldPf: jasmine.SpyObj<DetailServicePldPf>;
  let detailServiceHomoPf: jasmine.SpyObj<DetailServiceHomoPf>;
  let curpRfcPfService: jasmine.SpyObj<CurpRfcPfService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const dialogRefMock = {
    afterClosed: () => of(true)
  };

  const taskList = [
    {
      id: 17,
      workflowStatus: { description: 'Pendiente' },
      requestDate: '2026-05-28',
      responseDate: '2026-05-29',
      createdBy: { firstName: 'Juan' },
      description: 'Validacion de contrato',
      personType: 1,
      workFlow: { id: 1 }
    }
  ];

  beforeEach(async () => {
    inboxService = jasmine.createSpyObj<InboxService>('InboxService', ['getTask']);
    notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error', 'info']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getUserInfo']);
    detailService = jasmine.createSpyObj<DetailService>('DetailService', ['getDetailWF']);
    detailServicePldPf = jasmine.createSpyObj<DetailServicePldPf>('DetailServicePldPf', ['getDetailWFPldPf']);
    detailServiceHomoPf = jasmine.createSpyObj<DetailServiceHomoPf>('DetailServiceHomoPf', ['getDetailWFHomoPf']);
    curpRfcPfService = jasmine.createSpyObj<CurpRfcPfService>('CurpRfcPfService', ['getDetailCurpAndRfc']);
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    inboxService.getTask.and.returnValue(of(taskList as any));
    authService.getUserInfo.and.returnValue(signal({
      name: 'User',
      username: 'user',
      employeeId: 'EMP001',
      localAccountId: '',
      homeAccountId: '',
      idToken: '',
      roles: [],
      rol: ''
    }));
    detailService.getDetailWF.and.returnValue(of({ id: 17 } as any));
    detailServicePldPf.getDetailWFPldPf.and.returnValue(of({ id: 17 } as any));
    detailServiceHomoPf.getDetailWFHomoPf.and.returnValue(of([{ id: 17 }] as any));
    curpRfcPfService.getDetailCurpAndRfc.and.returnValue(of({ curp: 'CURP', rfc: 'RFC' } as any));
    dialog.open.and.returnValue(dialogRefMock as any);

    await TestBed.configureTestingModule({
      declarations: [InboxComponent],
      providers: [
        { provide: InboxService, useValue: inboxService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: AuthService, useValue: authService },
        { provide: DetailService, useValue: detailService },
        { provide: DetailServicePldPf, useValue: detailServicePldPf },
        { provide: DetailServiceHomoPf, useValue: detailServiceHomoPf },
        { provide: CurpRfcPfService, useValue: curpRfcPfService },
        { provide: MatDialog, useValue: dialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and map inbox tasks on init', () => {
    expect(inboxService.getTask).toHaveBeenCalledWith({ domainUser: 'EMP001' });
    expect(component.resultTableData).toEqual([
      {
        id: 17,
        idName: 17,
        workflowStatus: 'Pendiente',
        requestDate: '2026-05-28',
        responseDate: '2026-05-29',
        createdBy: 'Juan',
        description: 'Validacion de contrato',
        personType: 'FISICA',
        personTypeID: 1,
        workFlowID: 1
      }
    ]);
  });

  it('should notify when there are no assigned tasks', () => {
    inboxService.getTask.and.returnValue(of([] as any));

    component.recarga();

    expect(component.resultTableData).toEqual([]);
    expect(notificationsService.info).toHaveBeenCalledWith('Sin Tareas Asignadas');
  });

  it('should reset selection on cancelEvent', () => {
    component.cancelEvent();

    expect(component.config.isSelected).toBeFalse();
    expect(component.config.showPag).toBeTrue();
    expect(component.config.idName).toBe('id');
  });

  it('should store the selected row and enable selection state', () => {
    const row = { id: 10, workFlowID: 1 };

    component.selectedRow({ row });

    expect(component.selectedRowData).toEqual(row);
    expect(component.config.isSelected).toBeTrue();
  });

  it('should update filterString trimming and normalizing the input', () => {
    const event = {
      target: { value: '  AbC  ' }
    } as unknown as Event;

    component.applyFilters(event);

    expect(component.filterString).toBe('abc');
  });

  it('should notify when consultar is called without a selected row', async () => {
    component.selectedRowData = null;

    await component.consultar();

    expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.NO_DATA_SELECTED);
    expect(dialog.open).not.toHaveBeenCalled();
  });

  it('should open contract approval modal and reload after close', async () => {
    const reloadSpy = spyOn(component, 'recarga');
    component.selectedRowData = { id: 17, workFlowID: 1 };

    await component.consultar();

    expect(detailService.getDetailWF).toHaveBeenCalledWith({ workFlowDetailId: 17 });
    expect(dialog.open).toHaveBeenCalledWith(ContractApprovalModalComponent, jasmine.objectContaining({
      data: {
        data: { data: { id: 17 } },
        edit: false
      }
    }));
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should open homonymy PF modal and reload after close', async () => {
    const reloadSpy = spyOn(component, 'recarga');
    component.selectedRowData = { id: 21, workFlowID: 3, personTypeID: 1 };
    detailServiceHomoPf.getDetailWFHomoPf.and.returnValue(of([{ id: 21, fullName: 'Cliente' }] as any));

    await component.consultar();

    expect(detailServiceHomoPf.getDetailWFHomoPf).toHaveBeenCalledWith({ workFlowDetailId: 21 });
    expect(dialog.open).toHaveBeenCalledWith(HomonymyApprovalModalComponent, jasmine.objectContaining({
      data: { data: [{ id: 21, fullName: 'Cliente' }], id: 21 }
    }));
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should open CURP/RFC PF modal with the workflow id merged into the payload', async () => {
    const reloadSpy = spyOn(component, 'recarga');
    component.selectedRowData = { id: 31, workFlowID: 5, personTypeID: 1 };
    curpRfcPfService.getDetailCurpAndRfc.and.returnValue(of({ curp: 'CURP123', rfc: 'RFC123' } as any));

    await component.consultar();

    expect(curpRfcPfService.getDetailCurpAndRfc).toHaveBeenCalledWith({ idWorkflowDetalle: 31 });
    expect(dialog.open).toHaveBeenCalledWith(CurpRfcApprovalComponent, jasmine.objectContaining({
      data: { data: { curp: 'CURP123', rfc: 'RFC123', id: 31 } }
    }));
    expect(reloadSpy).toHaveBeenCalled();
  });
});
