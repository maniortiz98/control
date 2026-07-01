import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { IdentificationCurpRfcService } from '../services/identification-curp-rfc.service';
import { NotificationModalService } from '../services/notification-modal.service';
import { NotificationsService } from '../services/notifications.service';
import { FlowCurpRfcService } from './flow-curp-rfc.service';
import { AuthService } from '../../core/services/auth.service';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { compareAndReturnGender } from '../utils/maper-gender';

describe('YourService', () => {
  let service: FlowCurpRfcService;

  let identificationCurpRfcServiceMock: jasmine.SpyObj<IdentificationCurpRfcService>;
  let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
  let routerMock: jasmine.SpyObj<Router>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;
  let unsavedChangesServiceMock: jasmine.SpyObj<UnsavedChangesService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const routeMock: Partial<ActivatedRoute> = {
    parent: {} as ActivatedRoute,
  };

  const dialogMock: Partial<MatDialog> = {
    openDialogs: [],
  };

  const mockUserInfo = jasmine.createSpy().and.returnValue({
    rol: 'ROL_ASESOR_FIN',
    employeeId: 'EMP001',
  });

  const mockAuthFn = jasmine.createSpy().and.returnValue({
    rol: 'ROL_ASESOR_FIN',
    employeeId: 'EMP001',
  });

  const baseData: any = {
    old: {
      curp: 'AAAA000000HDFXXX01',
      rfc: 'RFC_OLD',
    },
    new: {
      clientNumber: '123',
      firstName: 'Juan',
      lastName: 'Pérez',
      secondName: 'López',
      secondLastName: 'Gómez',
      gender: 'M',
      birthDate: '1990-01-01',
      birthState: '09',
      rfc: 'RFC_NEW',
      curp: 'BBBB111111HDFYYY02',
      typeIden: '1',
    },
  };

  beforeEach(() => {
    identificationCurpRfcServiceMock = jasmine.createSpyObj(
      'IdentificationCurpRfcService',
      ['postDataIdentificationCurpRfcService']
    );

    notificationModalServiceMock = jasmine.createSpyObj(
      'NotificationModalService',
      ['warning', 'error']
    );

    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    notificationsServiceMock = jasmine.createSpyObj('NotificationsService', ['error']);
    unsavedChangesServiceMock = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);

    authServiceMock = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    authServiceMock.getUserInfo.and.returnValue(mockUserInfo as any);

    TestBed.configureTestingModule({
      providers: [
        FlowCurpRfcService,
        { provide: IdentificationCurpRfcService, useValue: identificationCurpRfcServiceMock },
        { provide: NotificationModalService, useValue: notificationModalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: UnsavedChangesService, useValue: unsavedChangesServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(FlowCurpRfcService);
  });

  describe('validChangesInCURPandRFC', () => {

    it('debe retornar true si no hay cambios en CURP ni RFC', async () => {
      const baseData: any = {
        old: {
          curp: 'BBBB111111HDFYYY02',
          rfc: 'RFC_NEW',
        },
        new: {
          clientNumber: '123',
          firstName: 'Juan',
          lastName: 'Pérez',
          secondName: 'López',
          secondLastName: 'Gómez',
          gender: 'M',
          birthDate: '1990-01-01',
          birthState: '09',
          rfc: 'RFC_NEW',
          curp: 'BBBB111111HDFYYY02',
          typeIden: '1',
        },
      }

      const result = await service.validChangesInCURPandRFC(baseData);

      expect(result).toBeTrue();
      expect(identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService).not.toHaveBeenCalled();
    });

    it('debe hacer post, mostrar warning y navegar si response.status es distinto de 420', async () => {
      const responseMock = {
        status: 200,
        details: 'WF generado correctamente',
        message: 'OK',
      };

      identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService.and.returnValue(
        of(responseMock as any)
      );

      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.validChangesInCURPandRFC(baseData);

      expect(result).toBeFalse();
      expect(identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService).toHaveBeenCalled();
      expect(notificationModalServiceMock.warning).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¡Atención!',
          afterMessages: ['Se ha Generado el Siguiente Work Flow ']
        })
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], {
        relativeTo: routeMock.parent,
      });
    });

    it('debe hacer post, mostrar error y navegar si response.status es 420', async () => {
      const responseMock = {
        status: 412,
        message: 'Work Flow Identificación Pendiente',
        details: 'Pendiente',
      };

      identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService.and.returnValue(
        throwError(() => ({
          status: 412,
          error: {
            responseMock
          }
        }))
      );

      notificationModalServiceMock.error.and.resolveTo();

      const result = await service.validChangesInCURPandRFC(baseData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¡Atención!',
          afterMessages: ['Work Flow Identificación Pendiente'],
        })
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], {
        relativeTo: routeMock.parent,
      });
    });

    it('debe usar el mensaje por defecto si response.status es 420 y message viene vacío', async () => {
      const responseMock = {
        status: 412,
        details: 'Pendiente',
      };
      identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService.and.returnValue(
        throwError(() => ({
          status: 412,
          error: {
            responseMock
          }
        }))
      );

      notificationModalServiceMock.error.and.resolveTo();

      const result = await service.validChangesInCURPandRFC(baseData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith(
        jasmine.objectContaining({
          afterMessages: ['Work Flow Identificación Pendiente'],
        })
      );
    });

    it('debe retornar false y mostrar error si la petición falla', async () => {
      identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService.and.returnValue(
        throwError(() => new Error('HTTP error'))
      );

      const result = await service.validChangesInCURPandRFC(baseData);

      expect(result).toBeFalse();
      expect(notificationsServiceMock.error).toHaveBeenCalledWith('Fallo al Crear el WF');
    });

    it('debe enviar el body correcto al servicio', async () => {
      identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService.and.returnValue(
        of({
          status: 200,
          details: 'WF generado',
        } as any)
      );
      notificationModalServiceMock.warning.and.resolveTo();

      await service.validChangesInCURPandRFC(baseData);

      expect(identificationCurpRfcServiceMock.postDataIdentificationCurpRfcService).toHaveBeenCalledWith(
        jasmine.objectContaining({
          clientNumber: baseData.new.clientNumber,
          nameOrBusinessName: baseData.new.firstName,
          lastName: baseData.new.lastName,
          secondName: baseData.new.secondName,
          secondLastName: baseData.new.secondLastName,
          genderId: baseData.new.gender,
          birthDate: baseData.new.birthDate,
          birthStateId: baseData.new.birthState,
          rfc: baseData.new.rfc,
          curp: baseData.new.curp,
          user: 'EMP001',
        })
      );
    });
  });

});
