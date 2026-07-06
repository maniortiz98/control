import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { CreateWfHomoPfService } from '../../../shared/services/create-wf-homo-pf.service';
import { CustomerHomonymsComponent } from './customer-homonyms.component';
import { CustomerHomonymsService } from '../../services/customer-homonyms.service';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';

describe('CustomerHomonymsComponent', () => {
  let fixture: ComponentFixture<CustomerHomonymsComponent>;
  let component: CustomerHomonymsComponent;

  let homonymsService: jasmine.SpyObj<CustomerHomonymsService>;
  let authService: jasmine.SpyObj<AuthService>;
  let wfService: jasmine.SpyObj<CreateWfHomoPfService>;
  let notificationModalService: jasmine.SpyObj<CustomerNotificationModalService>;
  let onboardingService: jasmine.SpyObj<CustomerOnboardingService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CustomerHomonymsComponent>>;
  let routerMock: jasmine.SpyObj<Router>;
  let dialogMock: { openDialogs: any[] } & jasmine.SpyObj<MatDialog>;

  let currentData: any[];

  beforeEach(async () => {
    currentData = [
      {
        firstName: 'JUAN',
        secondName: 'CARLOS',
        lastName: 'PEREZ',
        secondLastName: 'LOPEZ',
        rfc: 'PELJ800101AA1',
        curp: 'PELJ800101HDFLRN01',
        percentSimilarity: 1,
        clientNumber: '1001',
      },
      {
        firstName: 'JUAN',
        secondName: '',
        lastName: 'PEREZ',
        secondLastName: '',
        rfc: 'PELJ800101AA2',
        curp: 'PELJ800101HDFLRN02',
        percentSimilarity: 0.8,
        clientNumber: '1002',
      },
    ];

    homonymsService = jasmine.createSpyObj('CustomerHomonymsService', ['getData']);
    authService = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    wfService = jasmine.createSpyObj('CreateWfHomoPfService', ['createWfPf']);
    notificationModalService = jasmine.createSpyObj('CustomerNotificationModalService', [
      'success',
      'warning',
    ]);
    onboardingService = jasmine.createSpyObj('CustomerOnboardingService', ['getCurrentInfo']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    dialogMock = Object.assign(jasmine.createSpyObj('MatDialog', ['open']), { openDialogs: [] });

    homonymsService.getData.and.callFake(() => currentData as any);
    authService.getUserInfo.and.returnValue(signal({ employeeId: 'EMP-01' } as any));
    wfService.createWfPf.and.returnValue(of({ idWorkflowDetalle: 456 } as any));
    notificationModalService.success.and.resolveTo({} as any);
    notificationModalService.warning.and.resolveTo({} as any);
    onboardingService.getCurrentInfo.and.returnValue({
      isMaintenance: false,
      clientId: 1001,
      requestId: 'REQ-123',
    } as any);
    routerMock.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      declarations: [CustomerHomonymsComponent],
      providers: [
        { provide: CustomerHomonymsService, useValue: homonymsService },
        { provide: AuthService, useValue: authService },
        { provide: CreateWfHomoPfService, useValue: wfService },
        { provide: CustomerNotificationModalService, useValue: notificationModalService },
        { provide: CustomerOnboardingService, useValue: onboardingService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MatDialog, useValue: dialogMock },
        { provide: ActivatedRoute, useValue: { parent: {} } },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(CustomerHomonymsComponent);
    component = fixture.componentInstance;
  }

  function initComponent(): void {
    component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();
  }

  it('should create and map homonyms data on init', () => {
    createComponent();
    initComponent();

    expect(component).toBeTruthy();
    expect(homonymsService.getData).toHaveBeenCalled();
    expect(component.dataClient[0].percentSimilarity).toBe('100%');
    expect(component.columnsData.length).toBe(8);
    expect(component.config.idName).toBe('clientNumber');
  });

  it('should set maintenance mode flags in ngOnInit', () => {
    onboardingService.getCurrentInfo.and.returnValue({
      isMaintenance: true,
      clientId: 1001,
      requestId: 'REQ-123',
    } as any);

    createComponent();
    initComponent();

    expect(component.showContinue).toBeFalse();
    expect(component.show).toBeTrue();
    expect(component.config.multipleSelection).toBeTrue();
  });

  it('should set butonNotClient false when there is a 100% match', () => {
    createComponent();
    initComponent();

    expect(component.butonNotClient).toBeFalse();
  });

  it('should set butonNotClient true when there is no 100% match', () => {
    currentData = [
      {
        firstName: 'JUAN',
        secondName: '',
        lastName: 'PEREZ',
        secondLastName: '',
        rfc: 'PELJ800101AA2',
        curp: 'PELJ800101HDFLRN02',
        percentSimilarity: 0.8,
        clientNumber: '2001',
      },
    ];

    createComponent();
    component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(component.butonNotClient).toBeTrue();
  });

  it('should update button state from single selection', () => {
    createComponent();
    initComponent();

    component.multipleRows([currentData[0]]);
    expect(component.butonContinue).toBeTrue();
    expect(component.butonUnifi).toBeFalse();
  });

  it('should update button state from multiple selection', () => {
    createComponent();
    initComponent();

    component.multipleRows(currentData);
    expect(component.butonContinue).toBeTrue();
    expect(component.butonUnifi).toBeFalse();
  });

  it('should reset button state when no rows selected', () => {
    createComponent();
    initComponent();

    component.multipleRows([]);
    expect(component.butonContinue).toBeTrue();
    expect(component.butonUnifi).toBeFalse();
  });

  it('should close with continue action when requested', () => {
    createComponent();
    initComponent();

    component.onButtonClickContinueDontSelect();

    expect(dialogRef.close).toHaveBeenCalledWith('continue');
  });

  it('should close with cancel action when requested', () => {
    createComponent();
    initComponent();

    component.onButtonClickCancel();

    expect(dialogRef.close).toHaveBeenCalledWith('cancel');
  });

  it('should close dialog when continuing with the selected current client', async () => {
    createComponent();
    initComponent();
    component.dataClientSelected = [currentData[0] as any];

    await component.onButtonContinueClient();

    expect(dialogRef.close).toHaveBeenCalledWith('');
    expect(notificationModalService.warning).not.toHaveBeenCalled();
  });

  it('should show warning when trying to continue with a different client', async () => {
    createComponent();
    initComponent();
    component.dataClientSelected = [currentData[1] as any];

    await component.onButtonContinueClient();

    expect(notificationModalService.warning).toHaveBeenCalledWith({
      title: '¡No Puedes Continuar con este Cliente!',
      afterMessages: ['Se Debe Unificar si así se Requiere'],
      btnAccept: 'Aceptar',
    });
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should create unification workflow and close dialogs on success', async () => {
    createComponent();
    initComponent();
    spyOn(console, 'log');

    const keepDialog = {
      componentInstance: { data: { keepOnHttpError: true } },
      close: jasmine.createSpy('closeKeep'),
    };
    const regularDialog = {
      componentInstance: { data: {} },
      close: jasmine.createSpy('closeRegular'),
    };
    (dialogMock as any).openDialogs = [keepDialog, regularDialog];

    component.dataClientSelected = currentData as any;

    await component.onButtonClickUnifi();

    expect(wfService.createWfPf).toHaveBeenCalledWith(
      jasmine.objectContaining({
        workflowDescription: 'UNIFICACION DE CLIENTES JUAN CARLOS PEREZ LOPEZ 1001, 1002',
        clientList: '1001, 1002',
        advisor: { advisorId: 'EMP-01' },
        unificationData: { personType: '1' },
      }),
    );
    expect(notificationModalService.success).toHaveBeenCalledWith({
      title: '¡Se ha Generado el Siguiente Workflow !',
      infoToCopy: '456',
      btnAccept: 'Aceptar',
    });
    expect(dialogRef.close).toHaveBeenCalledWith('unificar');
    expect(keepDialog.close).toHaveBeenCalled();
    expect(regularDialog.close).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/'], { relativeTo: jasmine.any(Object) });
    expect(console.log).toHaveBeenCalledWith('Unificar');
  });

  it('should show warning when unification is attempted without the current client selected', async () => {
    createComponent();
    initComponent();

    component.dataClientSelected = [currentData[1] as any];

    await component.onButtonClickUnifi();

    expect(notificationModalService.warning).toHaveBeenCalledWith({
      title: '¡Debe Seleccionar al Cliente para poder Continuar!',
      afterMessages: ['1001'],
      btnAccept: 'Aceptar',
    });
    expect(wfService.createWfPf).not.toHaveBeenCalled();
  });

  it('should close all dialogs including keepOnHttpError when includeKeepOnHttpError is true', () => {
    createComponent();
    initComponent();

    const keepDialog = {
      componentInstance: { data: { keepOnHttpError: true } },
      close: jasmine.createSpy('closeKeep'),
    };
    const regularDialog = {
      componentInstance: { data: {} },
      close: jasmine.createSpy('closeRegular'),
    };
    (dialogMock as any).openDialogs = [keepDialog, regularDialog];

    (component as any).closeAllDialogs(true);

    expect(keepDialog.close).toHaveBeenCalled();
    expect(regularDialog.close).toHaveBeenCalled();
  });

  it('should keep error dialogs open when closeAllDialogs excludes them', () => {
    createComponent();
    initComponent();

    const keepDialog = {
      componentInstance: { data: { keepOnHttpError: true } },
      close: jasmine.createSpy('closeKeep'),
    };
    const regularDialog = {
      componentInstance: { data: {} },
      close: jasmine.createSpy('closeRegular'),
    };
    (dialogMock as any).openDialogs = [keepDialog, regularDialog];

    (component as any).closeAllDialogs();

    expect(keepDialog.close).not.toHaveBeenCalled();
    expect(regularDialog.close).toHaveBeenCalled();
  });

  it('should execute passive table handlers without throwing', () => {
    createComponent();
    initComponent();

    expect(() => component.rowSelected({})).not.toThrow();
    expect(() => component.eventRow({})).not.toThrow();
    expect(() => component.eventPage({} as any)).not.toThrow();
  });
});
