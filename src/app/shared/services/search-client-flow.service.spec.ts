import { TestBed } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SearchClientFlowService } from './search-client-flow.service';

import { WatchlistService } from '../services/watchlist.service';
import { NotificationModalService } from '../services/notification-modal.service';
import { HomonymsService } from '../services/homonyms.service';
import { NotificationsService } from '../services/notifications.service';
import { ModalHomonymsServiceService } from '../services/modal-homonyms-service.service';
import { ModalFormService } from '../services/modal-form.service';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../shared.module';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { OnboardingStateServiceService } from '../../onboarding/services/onboarding-state-service.service';

describe('SearchClientFlowService', () => {
  let service: SearchClientFlowService;
  let watchlistServiceMock: jasmine.SpyObj<WatchlistService>;
  let notificationModalServiceMock: jasmine.SpyObj<NotificationModalService>;
  let homonymsServiceMock: jasmine.SpyObj<HomonymsService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeMock: Partial<ActivatedRoute>;
  let notificationsServiceMock: jasmine.SpyObj<NotificationsService>;
  let unsavedChangesServiceMock: jasmine.SpyObj<UnsavedChangesService>;
  let modalHomonymsServiceMock: jasmine.SpyObj<ModalHomonymsServiceService>;
  let modalFormServiceMock: jasmine.SpyObj<ModalFormService>;
  let onboardingStateServiceMock: jasmine.SpyObj<OnboardingStateServiceService>;
  let dialogMock: Partial<MatDialog>;

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
    watchlistServiceMock = jasmine.createSpyObj('WatchlistService', ['postData']);
    notificationModalServiceMock = jasmine.createSpyObj('NotificationModalService', [
      'warning',
      'error',
      'success',
    ]);
    homonymsServiceMock = jasmine.createSpyObj('HomonymsService', ['postHomonyms', 'setData']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    notificationsServiceMock = jasmine.createSpyObj('NotificationsService', ['error']);
    unsavedChangesServiceMock = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    modalHomonymsServiceMock = jasmine.createSpyObj('ModalHomonymsServiceService', [
      'formModalHomonyms',
    ]);
    modalFormServiceMock = jasmine.createSpyObj('ModalFormService', ['homonimiaModal']);
    onboardingStateServiceMock = jasmine.createSpyObj('OnboardingStateServiceService', [
      'getCurrentInfo',
    ]);
    onboardingStateServiceMock.getCurrentInfo.and.returnValue({
      requestId: 'REQ-123',
      personType: 'PF',
      name: '',
      contractType: '',
      contractSubtype: '',
      businessType: '',
      onboardingId: 0,
      isMaintenance: false,
      isCustomer: false,
      isOnboarding: false,
      clientId: 0,
      accountId: 0,
      accountData: null,
    });

    routeMock = {
      parent: {} as ActivatedRoute,
    };

    dialogMock = {
      openDialogs: [],
    };

    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        SharedModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        SearchClientFlowService,
        { provide: WatchlistService, useValue: watchlistServiceMock },
        { provide: NotificationModalService, useValue: notificationModalServiceMock },
        { provide: HomonymsService, useValue: homonymsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: UnsavedChangesService, useValue: unsavedChangesServiceMock },
        { provide: ModalHomonymsServiceService, useValue: modalHomonymsServiceMock },
        { provide: ModalFormService, useValue: modalFormServiceMock },
        { provide: OnboardingStateServiceService, useValue: onboardingStateServiceMock },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MsalService, useValue: {} },
        { provide: MsalBroadcastService, useValue: {} }
      ],
    });

    service = TestBed.inject(SearchClientFlowService);
  });

  describe('getListValues', () => {
    it('debe devolver array de tipos', () => {
      const list: any = {
        matchLists: [{ type: 'A' }, { type: 'B' }],
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
      notificationModalServiceMock.error.and.resolveTo();
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
      expect(notificationModalServiceMock.error).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], {
        relativeTo: routeMock.parent,
      });
    });

    it('debe retornar false y navegar cuando step=1 y no hay listas', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 1,
          matchLists: [],
        } as any)
      );
      notificationModalServiceMock.error.and.resolveTo();

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar false y navegar cuando step=1 y hay una lista', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 1,
          matchLists: [{ type: 'PEP' }],
        } as any)
      );
      notificationModalServiceMock.error.and.resolveTo();

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'El solicitante se encuentra en la lista PEP',
        })
      );
    });

    it('debe retornar false y warning cuando step=2', async () => {
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 2,
          matchLists: [{ type: 'LISTA 1' }],
        } as any)
      );
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
    });

    it('debe retornar false cuando step=2 y mantenimineto está activo', async () => {
      onboardingStateServiceMock.getCurrentInfo.and.returnValue({
        ...onboardingStateServiceMock.getCurrentInfo.calls.mostRecent()?.returnValue,
        requestId: 'REQ-123',
        personType: 'PF',
        name: '',
        contractType: '',
        contractSubtype: '',
        businessType: '',
        onboardingId: 0,
        isMaintenance: true,
        isCustomer: false,
        isOnboarding: false,
        isOnboardingWL: false,
        clientId: 0,
        accountId: 0,
        accountData: null,
      });
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 2,
          matchLists: [{ type: 'LISTA 1' }],
        } as any)
      );
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.warning).toHaveBeenCalled();
    });

    it('debe retornar true cuando step=2 y onboarding está activo', async () => {
      onboardingStateServiceMock.getCurrentInfo.and.returnValue({
        ...onboardingStateServiceMock.getCurrentInfo.calls.mostRecent()?.returnValue,
        requestId: 'REQ-123',
        personType: 'PF',
        name: '',
        contractType: '',
        contractSubtype: '',
        businessType: '',
        onboardingId: 0,
        isMaintenance: false,
        isCustomer: false,
        isOnboarding: true,
        isOnboardingWL: true,
        clientId: 0,
        accountId: 0,
        accountData: null,
      });
      watchlistServiceMock.postData.and.returnValue(
        of({
          step: 2,
          matchLists: [{ type: 'LISTA 1' }],
        } as any)
      );
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.validInWatchList(baseDataClient);

      expect(result).toBeTrue();
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
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([] as any)
      );

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: true, numberClient: null });
    });

    it('debe retornar continue cuando homo.code=3 y el modal devuelve "continue"', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([
          { clientNumber: 'ABC123', percentSimilarity: 0.75 },
        ] as any)
      );
      notificationModalServiceMock.success.and.resolveTo();
      modalHomonymsServiceMock.formModalHomonyms.and.resolveTo('continue');

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: true, numberClient: null });
    });

    it('debe retornar numberClient cuando homo.code=1 y el modal devuelve un valor', async () => {
      homonymsServiceMock.postHomonyms.and.returnValue(
        of([
          { clientNumber: 'ABC123', percentSimilarity: 1 },
        ] as any)
      );
      notificationModalServiceMock.success.and.resolveTo();
      modalFormServiceMock.homonimiaModal.and.returnValue(of(12345));

      const result = await service.validInHomonyms(baseDataClient);

      expect(result).toEqual({ passOnHomonyms: false, numberClient: 12345 });
    });

    it('debe retornar error controlado si falla la petición', async () => {
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

    it('debe devolver respuesta fallback si falla la petición', async () => {
      watchlistServiceMock.postData.and.returnValue(
        throwError(() => new Error('HTTP error'))
      );
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.getDataWatchList(baseDataClient);

      expect(result).toEqual({
        passOnWatchlist: false,
        isOnWatchlist: false,
        step: 0,
        matchLists: [],
      });
      expect(notificationModalServiceMock.warning).toHaveBeenCalledWith(
        jasmine.objectContaining({
          title: 'Intento Final Fallido',
        })
      );
    });
  });

  describe('getWatchListWF', () => {
    it('debe retornar false cuando step=1 con varias listas', async () => {
      const listData: any = {
        step: 1,
        matchLists: [{ type: 'A' }, { type: 'B' }],
      };
      notificationModalServiceMock.error.and.resolveTo();

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.error).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar false cuando step=2', async () => {
      const listData: any = {
        step: 2,
        matchLists: [{ type: 'A' }],
      };
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.getWatchListWF(listData);

      expect(result).toBeFalse();
      expect(notificationModalServiceMock.warning).toHaveBeenCalledWith(
        jasmine.objectContaining({
          infoToCopy: 'REQ-123',
        })
      );
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it('debe retornar true cuando this.listData.step=3', async () => {
      const listData: any = {
        step: 3,
        matchLists: [{ type: 'A' }],
      };
      notificationModalServiceMock.warning.and.resolveTo();

      const result = await service.getWatchListWF(listData);

      expect(result).toBeTrue();
    });
  });
});
