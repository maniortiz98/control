import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { HomonymyApprovalModalComponent } from './homonymy-approval-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ApprovalHomoPfService } from '../../../services/approval-homo-pf';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { UserInfo } from '../../../../core/models/user-info';
import { signal } from '@angular/core';
import { WorkFlowClientHomoDet } from '../../../models/homoPf/detail-homo-pf';
import { of } from 'rxjs';

describe('HomonymyApprovalModalComponent', () => {
  let component: HomonymyApprovalModalComponent;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockNotificationModalService: jasmine.SpyObj<NotificationModalService>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;
  let mockTakeService: jasmine.SpyObj<TakeService>;
  let mockUpdateService: jasmine.SpyObj<UpdateService>;
  let mockApprovalHomoPfService: jasmine.SpyObj<ApprovalHomoPfService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

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
  const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
  dialogRefMock.afterClosed.and.returnValue(of({ value: true, message: 'Rechazo' }));


  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    mockNotificationModalService = jasmine.createSpyObj('NotificationModalService', ['error', 'success']);
    mockNotificationsService = jasmine.createSpyObj('NotificationsService', ['error']);
    mockTakeService = jasmine.createSpyObj('TakeService', ['take']);
    mockUpdateService = jasmine.createSpyObj('UpdateService', ['update']);
    mockApprovalHomoPfService = jasmine.createSpyObj('ApprovalHomoPfService', ['update']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    mockAuthService.getUserInfo.and.returnValue(mockUserInfo);
    mockTakeService.take.and.returnValue(of({ workflowId: 1, name: "1" }));
    mockUpdateService.update.and.returnValue(of({ workflowId: 1, name: "1", status: "1" }));
    mockApprovalHomoPfService.update.and.returnValue(of({ workflowId: 1, status: "1" }));

    TestBed.configureTestingModule({
      providers: [
        HomonymyApprovalModalComponent,
        { provide: MatDialog, useValue: mockDialog },
        { provide: NotificationModalService, useValue: mockNotificationModalService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: TakeService, useValue: mockTakeService },
        { provide: UpdateService, useValue: mockUpdateService },
        { provide: ApprovalHomoPfService, useValue: mockApprovalHomoPfService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MAT_DIALOG_DATA, useValue: { id: 123, data: [] } }
      ]
    });

    component = TestBed.inject(HomonymyApprovalModalComponent);
  });

  it('should deselect a cell and clear dataPerson field', () => {
    const element = { id: '1', firstName: 'John', middleName: 'Paul', firstSurname: 'Doe', secondSurname: 'Smith', curp: 'CURP123' };

    // Primero selecciona la celda
    component.toggleCell(element, 'firstName');
    expect(component.selectedCells.get('firstName')).toEqual({ id: '1', value: 'John' });
    expect(component.dataPerson.firstName).toBe('John');

    component.toggleCell(element, 'middleName');
    expect(component.selectedCells.get('middleName')).toEqual({ id: '1', value: 'Paul' });
    expect(component.dataPerson.middleName).toBe('Paul');

    component.toggleCell(element, 'firstSurname');
    expect(component.selectedCells.get('firstSurname')).toEqual({ id: '1', value: 'Doe' });
    expect(component.dataPerson.lastName).toBe('Doe');

    component.toggleCell(element, 'secondSurname');
    expect(component.selectedCells.get('secondSurname')).toEqual({ id: '1', value: 'Smith' });
    expect(component.dataPerson.secondLastName).toBe('Smith');

    component.toggleCell(element, 'curp');
    expect(component.selectedCells.get('curp')).toEqual({ id: '1', value: 'CURP123' });
    expect(component.dataPerson.curp).toBe('CURP123');

    // Luego deselecciona la celda
    component.toggleCell(element, 'firstName');
    expect(component.selectedCells.has('firstName')).toBeFalse();
    expect(component.dataPerson.firstName).toBe('');

    component.toggleCell(element, 'middleName');
    expect(component.selectedCells.has('middleName')).toBeFalse();
    expect(component.dataPerson.middleName).toBe('');

    component.toggleCell(element, 'firstSurname');
    expect(component.selectedCells.has('firstSurname')).toBeFalse();
    expect(component.dataPerson.lastName).toBe('');

    component.toggleCell(element, 'secondSurname');
    expect(component.selectedCells.has('secondSurname')).toBeFalse();
    expect(component.dataPerson.secondLastName).toBe('');

    component.toggleCell(element, 'curp');
    expect(component.selectedCells.has('curp')).toBeFalse();
    expect(component.dataPerson.curp).toBe('');
  });

  it('should close dialog', () => {
    component.close();
    expect(mockDialog.closeAll).toHaveBeenCalled();
  });

  it('should call takeService.take on construction', () => {
    expect(mockTakeService.take).toHaveBeenCalledWith({ domainUser: (mockUserInfo().employeeId), workflowId: 123 });
  });

  it('should map clients correctly', () => {
    const input: WorkFlowClientHomoDet[] = [{
      clientNumber: '1',
      firstName: 'A',
      middleName: 'A',
      lastName: 'A',
      secondLastName: 'A',
      typePerson: 1,
      curp: 'A',
      rfc: 'A',
      nif: 'A',
      tin: 'A',
      nss: 'A'
    }];
    const result = component.mapClients(input);
    expect(result).toEqual([{
      id: '1',
      typeOfPerson: 'FISICA',
      firstName: 'A',
      middleName: 'A',
      firstSurname: 'A',
      secondSurname: 'A',
      curp: 'A',
      rfc: 'A',
      nif: 'A',
      tin: 'A',
      nss: 'A',
    }]);
  });



  it('should approve request if dataPerson is valid', async () => {
    component.dataPerson.firstName = 'John';
    component.dataPerson.lastName = 'Doe';

    await component.approve();

    expect(mockApprovalHomoPfService.update).toHaveBeenCalled();
    expect(mockNotificationModalService.success).toHaveBeenCalled();
  });

  it('should show error if dataPerson is invalid on approve', () => {
    component.dataPerson.firstName = '';
    component.approve();

    expect(mockNotificationsService.error).toHaveBeenCalledWith("Primer Nombre y Primer Apellido son Obligatorios");
  });

  it('should toggle cell correctly', () => {
    const element = { id: '1', firstName: 'John' };
    component.toggleCell(element, 'firstName');
    expect(component.selectedCells.get('firstName')).toEqual({ id: '1', value: 'John' });

    component.toggleCell(element, 'firstName');
    expect(component.selectedCells.has('firstName')).toBeFalse();
  });

  it('should update selection correctly', () => {
    const element = { id: '1', rfc: 'RFC123' };
    component.updateSelection(element, 'rfc');
    expect(component.selectedCell).toEqual({ id: '1', column: 'rfc' });
    expect(component.dataPerson.rfc).toBe('RFC123');

    component.updateSelection(element, 'rfc');
    expect(component.selectedCell).toBeNull();
    expect(component.dataPerson.rfc).toBe('');
  });

  it('should reject request', async () => {
    mockDialog.open.and.returnValue(dialogRefMock);

    await component.reject();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockUpdateService.update).toHaveBeenCalledWith({ workflowId: 123, status: 4, reasonRejection: 'Rechazo' });
    expect(mockNotificationModalService.error).toHaveBeenCalled();
  });

  describe('toggleCell', () => {

    it('should select a cell and update dataPerson', () => {
      const element = { id: '1', firstName: 'John', middleName: 'Paul', firstSurname: 'Doe', secondSurname: 'Smith', curp: 'CURP123' };

      component.toggleCell(element, 'firstName');
      expect(component.selectedCells.get('firstName')).toEqual({ id: '1', value: 'John' });
      expect(component.dataPerson.firstName).toBe('John');

      component.toggleCell(element, 'middleName');
      expect(component.selectedCells.get('middleName')).toEqual({ id: '1', value: 'Paul' });
      expect(component.dataPerson.middleName).toBe('Paul');

      component.toggleCell(element, 'firstSurname');
      expect(component.selectedCells.get('firstSurname')).toEqual({ id: '1', value: 'Doe' });
      expect(component.dataPerson.lastName).toBe('Doe');

      component.toggleCell(element, 'secondSurname');
      expect(component.selectedCells.get('secondSurname')).toEqual({ id: '1', value: 'Smith' });
      expect(component.dataPerson.secondLastName).toBe('Smith');

      component.toggleCell(element, 'curp');
      expect(component.selectedCells.get('curp')).toEqual({ id: '1', value: 'CURP123' });
      expect(component.dataPerson.curp).toBe('CURP123');
    });



    it('should handle multiple selections correctly', () => {
      const element1 = { id: '1', firstName: 'John', middleName: 'Paul', firstSurname: 'Doe', secondSurname: 'Smith', curp: 'CURP123' };
      const element2 = { id: '2', firstName: 'John', middleName: 'Paul', firstSurname: 'Doe', secondSurname: 'Smith', curp: 'CURP123' };

      component.toggleCell(element1, 'firstName');
      expect(component.selectedCells.get('firstName')).toEqual({ id: '1', value: 'John' });
      expect(component.dataPerson.firstName).toBe('John');

      component.toggleCell(element2, 'firstName');
      expect(component.selectedCells.get('firstName')).toEqual({ id: '2', value: 'John' });
      expect(component.dataPerson.firstName).toBe('John');
    });
  });

  describe('updateSelection', () => {

    it('should select a cell and update dataPerson for RFC', () => {
      const element = { id: '1', rfc: 'RFC123' };

      component.updateSelection(element, 'rfc');
      expect(component.selectedCell).toEqual({ id: '1', column: 'rfc' });
      expect(component.dataPerson.rfc).toBe('RFC123');
      expect(component.dataPerson.nif).toBe('');
      expect(component.dataPerson.tin).toBe('');
      expect(component.dataPerson.nss).toBe('');
    });

    it('should deselect a cell and clear dataPerson field for RFC', () => {
      const element = { id: '1', rfc: 'RFC123' };

      // Primero selecciona la celda
      component.updateSelection(element, 'rfc');
      expect(component.selectedCell).toEqual({ id: '1', column: 'rfc' });
      expect(component.dataPerson.rfc).toBe('RFC123');

      // Luego deselecciona la celda
      component.updateSelection(element, 'rfc');
      expect(component.selectedCell).toBeNull();
      expect(component.dataPerson.rfc).toBe('');
    });

    it('should handle selection for NIF', () => {
      const element = { id: '2', nif: 'NIF456' };

      component.updateSelection(element, 'nif');
      expect(component.selectedCell).toEqual({ id: '2', column: 'nif' });
      expect(component.dataPerson.nif).toBe('NIF456');
      expect(component.dataPerson.rfc).toBe('');
      expect(component.dataPerson.tin).toBe('');
      expect(component.dataPerson.nss).toBe('');
    });

    it('should handle selection for TIN', () => {
      const element = { id: '3', tin: 'TIN789' };

      component.updateSelection(element, 'tin');
      expect(component.selectedCell).toEqual({ id: '3', column: 'tin' });
      expect(component.dataPerson.tin).toBe('TIN789');
      expect(component.dataPerson.rfc).toBe('');
      expect(component.dataPerson.nif).toBe('');
      expect(component.dataPerson.nss).toBe('');
    });

    it('should handle selection for NSS', () => {
      const element = { id: '4', nss: 'NSS012' };

      component.updateSelection(element, 'nss');
      expect(component.selectedCell).toEqual({ id: '4', column: 'nss' });
      expect(component.dataPerson.nss).toBe('NSS012');
      expect(component.dataPerson.rfc).toBe('');
      expect(component.dataPerson.nif).toBe('');
      expect(component.dataPerson.tin).toBe('');
    });
  });
});

