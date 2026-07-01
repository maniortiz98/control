import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { CustomerSearchClientFlowService } from './customer-search-client-flow.service';

import { CustomerWatchlistService } from '../services/customer-watchlist.service';
import { CustomerNotificationModalService } from '../services/customer-notification-modal.service';
import { CustomerHomonymsService } from '../services/customer-homonyms.service';
import { CustomerNotificationsService } from '../services/customer-notifications.service';
import { CustomerModalHomonymsServiceService } from '../services/customer-modal-homonyms-service.service';
import { CustomerModalFormService } from '../services/customer-modal-form.service';
import { CustomerOnboardingService } from '../services/customer-onboarding.service';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { CustomerFirstDataClientService } from './storage-services/customer-first-data-client.service';

describe('CustomerSearchClientFlowService', () => {
  let service: CustomerSearchClientFlowService;

  let watchlistServiceMock: jasmine.SpyObj<CustomerWatchlistService>;
  let notificationModalServiceMock: jasmine.SpyObj<CustomerNotificationModalService>;
  let homonymsServiceMock: jasmine.SpyObj<CustomerHomonymsService>;
  let routerMock: jasmine.SpyObj<Router>;
  let notificationsServiceMock: jasmine.SpyObj<CustomerNotificationsService>;
  let unsavedChangesServiceMock: jasmine.SpyObj<UnsavedChangesService>;
  let modalHomonymsServiceMock: jasmine.SpyObj<CustomerModalHomonymsServiceService>;
  let modalFormServiceMock: jasmine.SpyObj<CustomerModalFormService>;
  let onboardingServiceMock: jasmine.SpyObj<CustomerOnboardingService>;
  let firstDataClientServiceMock: jasmine.SpyObj<CustomerFirstDataClientService>;
  let dialogMock: { openDialogs: any[] } & jasmine.SpyObj<MatDialog>;

  const baseDataClient: any = {
    dateOfBirth: '1990-01-01',
    rfc: 'XAXX010101000',
    curp: 'CURP123',
    typeIden: 'RFC',
    firstName: 'Juan',
    middleName: 'P',
    firstLastName: 'Pérez',
    secondLastName: 'López',
    gender: '1',
    countryOfBirth: 'MX',
    stateOfBirth: 'CMX',
  };

  beforeEach(() => {
    watchlistServiceMock = jasmine.createSpyObj('CustomerWatchlistService', ['postData']);
    notificationModalServiceMock = jasmine.createSpyObj('CustomerNotificationModalService', [
      'warning',
      'error',
      'success',
    ]);
    homonymsServiceMock = jasmine.createSpyObj('CustomerHomonymsService', ['postHomonyms', 'setData']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    notificationsServiceMock = jasmine.createSpyObj('CustomerNotificationsService', ['error']);
    unsavedChangesServiceMock = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    modalHomonymsServiceMock = jasmine.createSpyObj('CustomerModalHomonymsServiceService', [
      'formModalHomonyms',
    ]);
    modalFormServiceMock = jasmine.createSpyObj('CustomerModalFormService', ['homonimiaModal']);
    onboardingServiceMock = jasmine.createSpyObj('CustomerOnboardingService', ['getCurrentInfo']);
    firstDataClientServiceMock = jasmine.createSpyObj('CustomerFirstDataClientService', ['getItem']);
    dialogMock = Object.assign(jasmine.createSpyObj('MatDialog', ['open']), { openDialogs: [] });

    onboardingServiceMock.getCurrentInfo.and.returnValue({
      requestId: 'REQ-123',
      isMaintenance: false,
      clientId: 1001,
    } as any);

    firstDataClientServiceMock.getItem.and.returnValue({
      firstName: 'JUAN',
      middleName: 'CARLOS',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      rfc: 'XAXX010101000',
      curp: 'CURP123',
    } as any);

    routerMock.navigate.and.returnValue(Promise.resolve(true));
    notificationModalServiceMock.warning.and.resolveTo({} as any);
    notificationModalServiceMock.error.and.resolveTo({} as any);
    notificationModalServiceMock.success.and.resolveTo({} as any);
    modalHomonymsServiceMock.formModalHomonyms.and.resolveTo('continue');
    modalFormServiceMock.homonimiaModal.and.returnValue(of(null));

    TestBed.configureTestingModule({
      providers: [
        CustomerSearchClientFlowService,
        { provide: CustomerWatchlistService, useValue: watchlistServiceMock },
        { provide: CustomerNotificationModalService, useValue: notificationModalServiceMock },
        { provide: CustomerHomonymsService, useValue: homonymsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { parent: {} } },
        { provide: CustomerNotificationsService, useValue: notificationsServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: UnsavedChangesService, useValue: unsavedChangesServiceMock },
        { provide: CustomerModalHomonymsServiceService, useValue: modalHomonymsServiceMock },
        { provide: CustomerModalFormService, useValue: modalFormServiceMock },
        { provide: CustomerOnboardingService, useValue: onboardingServiceMock },
        { provide: CustomerFirstDataClientService, useValue: firstDataClientServiceMock },
      ],
    });

    service = TestBed.inject(CustomerSearchClientFlowService);
  });

  describe('getListValues', () => {
    it('debe devolver array de tipos únicos', () => {
      const list: any = {
        matchLists: [{ type: 'A' }, { type: 'B' }, { type: 'A' }],
      };

      expect(service.getListValues(list)).toEqual(['A', 'B']);
    });

    it('debe devolver array vacío si no hay lista', () => {
      expect(service.getListValues(undefined)).toEqual([]);
    });
  });

  describe('validInWatchList', () => {
    it('debe retornar false y navegar cuando step=1 y hay más de una lista', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 1,
          matchLists: [{ type: 'LISTA 1' }, { type: 'LISTA 2' }],
        } as any)
      );

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
        title: 'El solicitante se encuentra en la lista ',
        beforeMessages: ['LISTA 1', 'LISTA 2'],
        afterMessages: ['Consultar con el área de PLD'],
        btnAccept: 'Terminar',
      });
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar false cuando step=1 y no hay listas', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 1,
          matchLists: [],
        } as any)
      );

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
        title: 'El solicitante se encuentra en la lista ',
        afterMessages: ['Consultar con el área de PLD'],
        btnAccept: 'Terminar',
      });
    });

    it('debe retornar false cuando step=1 y hay una lista', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 1,
          matchLists: [{ type: 'PEP' }],
        } as any)
      );

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
        title: 'El solicitante se encuentra en la lista PEP',
        afterMessages: ['Consultar con el área de PLD'],
        btnAccept: 'Terminar',
      });
    });

    it('debe retornar false y warning cuando step=2', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 2,
          matchLists: [{ type: 'LISTA 1' }],
        } as any)
      );

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.warning).toHaveBeenCalledWith({
        title: '¡Atención!',
        beforeMessages: ['LISTA 1'],
        infoToCopy: 'REQ-123',
        afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
      });
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar true cuando step=3', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 3,
          matchLists: [],
        } as any)
      );

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeTrue();
    });

    it('debe retornar false y notificar error si falla la petición', async () => {
      watchlistServiceMock.postData.and.returnValue(
        throwError(() => new Error('HTTP error'))
      );

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationsServiceMock.error).toHaveBeenCalledWith(
        'Fallo al Validar en Listas de Restricción'
      );
    });
  });

  describe('validInHomonyms', () => {
    it('debe retornar passOnHomonyms=true cuando no hay homónimos', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(of([] as any));

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: true, numberClient: null });
    });

    it('debe retornar continue cuando hay homónimos y el modal devuelve "continue"', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: 'ABC123', percentSimilarity: 0.75 }] as any)
      );
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo('continue');

      const result = await service.validInHomonyms(baseDataClient);

      expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
      expect(homonymsServiceMock.setData).toHaveBeenCalled();
      expect(notificationModalServiceMock.success).toHaveBeenCalled();
      expect(modalHomonymsServiceMock.formModalHomonyms).toHaveBeenCalled();
      expect(result).toEqual({ passOnHomonyms: true, numberClient: null });
    });

    it('debe retornar false cuando homo.code=2/3 y el modal devuelve cancel', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: 'ABC123', percentSimilarity: 0.75 }] as any)
      );
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo('cancel');

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: false, numberClient: undefined });
    });

    it('debe retornar numberClient cuando homo.code=2/3 y el modal devuelve otro valor', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: 'ABC123', percentSimilarity: 0.75 }] as any)
      );
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo(12345 as any);

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: false, numberClient: 12345 });
    });

    it('debe retornar numberClient cuando homo.code=1 y el modal devuelve un valor', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );
      modalFormServiceMock.homonimiaModal.and.returnValue(of(8888 as any));

      const result = await service.validInHomonyms(baseDataClient);

      expect(notificationModalServiceMock.success).toHaveBeenCalled();
      expect(modalFormServiceMock.homonimiaModal).toHaveBeenCalled();
      expect(result).toEqual({ passOnHomonyms: false, numberClient: 8888 });
    });

    it('debe retornar null cuando homo.code=1 y el modal devuelve null', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );
      modalFormServiceMock.homonimiaModal.and.returnValue(of(null));

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: false, numberClient: null });
    });

    it('debe manejar modo mantenimiento con coincidencia exacta del mismo cliente', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: true,
        clientId: 777,
      } as any);

      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: true, numberClient: null });
    });

    it('debe manejar modo mantenimiento con coincidencias y cliente distinto', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: true,
        clientId: 1001,
      } as any);

      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo('continue');

      const result = await service.validInHomonyms(baseDataClient);

      expect(homonymsServiceMock.setData).toHaveBeenCalled();
      expect(modalHomonymsServiceMock.formModalHomonyms).toHaveBeenCalled();
      expect(result).toEqual({ passOnHomonyms: false, numberClient: null });
    });

    it('debe manejar modo mantenimiento con coincidencias y retorno diferente a continue/cancel', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: true,
        clientId: 1001,
      } as any);

      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo(9999 as any);

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: true, numberClient: 9999 });
    });

    it('debe manejar modo mantenimiento con homo.code=1 y mismo cliente', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: true,
        clientId: 777,
      } as any);

      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: true, numberClient: null });
    });

    it('debe manejar modo mantenimiento con homo.code=1 y cliente distinto', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: true,
        clientId: 1001,
      } as any);

      homonymsServiceMock.postHomonyms.and.returnValue(
        of([{ clientNumber: '777', percentSimilarity: 1 }] as any)
      );
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo('continue');

      const result = await service.validInHomonyms(baseDataClient);

      expect(homonymsServiceMock.setData).toHaveBeenCalled();
      expect(modalHomonymsServiceMock.formModalHomonyms).toHaveBeenCalled();
      expect(result).toEqual({ passOnHomonyms: false, numberClient: null });
    });

    it('debe retornar false y notificar error si falla la petición', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        throwError(() => new Error('HTTP error'))
      );

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: false, numberClient: null });
      expect(notificationsServiceMock.error).toHaveBeenCalledWith(
        'Fallo al Validar en Búsqueda de Homónimos'
      );
    });
  });

  describe('getDataWatchList', () => {
    it('debe devolver respuesta con passOnWatchlist=true', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 3,
          isOnWatchlist: false,
          matchLists: [],
        } as any)
      );

      const result = await service.getDataWatchList(baseDataClient);

      expect(result.passOnWatchlist).toBeTrue();
      expect(result.step).toBe(3);
    });

    it('debe incluir customerId cuando está en mantenimiento y existe clientId', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: true,
        clientId: 555,
      } as any);

      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 0,
          isOnWatchlist: false,
          matchLists: [],
        } as any)
      );

      await service.getDataWatchList(baseDataClient);

      expect(watchlistServiceMock.postData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          customerId: '555',
          accountId: null,
        })
      );
    });

    it('debe incluir customerId null cuando no está en mantenimiento', async () => {
      onboardingServiceMock.getCurrentInfo.and.returnValue({
        requestId: 'REQ-123',
        isMaintenance: false,
        clientId: null,
      } as any);

      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 0,
          isOnWatchlist: false,
          matchLists: [],
        } as any)
      );

      await service.getDataWatchList(baseDataClient);

      expect(watchlistServiceMock.postData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          customerId: null,
          accountId: null,
        })
      );
    });

    it('debe devolver fallback si falla la petición', async () => {
      watchlistServiceMock.postData.and.returnValue(
        throwError(() => new Error('HTTP error'))
      );

      const result = await service.getDataWatchList(baseDataClient);

      expect(notificationModalServiceMock.warning).toHaveBeenCalledWith({
        title: 'Intento Final Fallido',
        afterMessages: ['Captura la Información del Cliente Manualmente'],
        btnAccept: 'OK',
      });

      expect(result).toEqual({
        passOnWatchlist: false,
        isOnWatchlist: false,
        step: 0,
        matchLists: [],
      });
    });
  });

  describe('getWatchListWF', () => {
    it('debe retornar false cuando step=1 con varias listas', async () => {
      const listData: any = {
        step: 1,
        matchLists: [{ type: 'A' }, { type: 'B' }],
      };

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar false cuando step=1 con una lista', async () => {
      const listData: any = {
        step: 1,
        matchLists: [{ type: 'PEP' }],
      };

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
        title: 'El solicitante se encuentra en la lista PEP',
        afterMessages: ['Consultar con el área de PLD'],
        btnAccept: 'Terminar',
      });
    });

    it('debe retornar false cuando step=1 sin listas', async () => {
      const listData: any = {
        step: 1,
        matchLists: [],
      };

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith({
        title: 'El solicitante se encuentra en la lista ',
        afterMessages: ['Consultar con el área de PLD'],
        btnAccept: 'Terminar',
      });
    });

    it('debe retornar false cuando step=2', async () => {
      const listData: any = {
        step: 2,
        matchLists: [{ type: 'A' }],
      };

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.warning).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: '¡Atención!',
          infoToCopy: 'REQ-123',
        })
      );
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar true cuando step=3', async () => {
      const listData: any = {
        step: 3,
        matchLists: [{ type: 'A' }],
      };

      const result = await service.getWatchListWF(listData);

      expect(result).toBeTrue();
    });

    it('debe retornar false cuando step no coincide', async () => {
      const listData: any = {
        step: 0,
        matchLists: [],
      };

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
    });
  });
});
