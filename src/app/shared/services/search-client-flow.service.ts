import { inject, Injectable } from '@angular/core';
import { WatchlistService } from './watchlist.service';
import { HomonymsService } from './homonyms.service';
import { CustomerWatchListBody, WatchList, WatchListReturn } from '../../onboarding/models/customer-watch-list';
import { HomonymsRequest, HomonymsResponse, HomonymsResponseData } from '../../onboarding/models/homonyms';
import { from, lastValueFrom, map, retry } from 'rxjs';
import { NotificationModalService } from './notification-modal.service';
import { ModalFormService } from './modal-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataClient } from '../../onboarding/models/client-data';
import { AllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from '../utils/map-rfc-nif-tin-nss';
import { NotificationsService } from './notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { searchPercentSimilarity } from '../utils/homonyms-search';
import { ModalHomonymsServiceService } from './modal-homonyms-service.service';
import { OnboardingStateServiceService } from '../../onboarding/services/onboarding-state-service.service';
import { toIsoUtc } from '../utils/datetime';

@Injectable({
  providedIn: 'root'
})
export class SearchClientFlowService {

  private readonly watchlistService = inject(WatchlistService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationsService);
  private readonly dialog = inject(MatDialog);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly modalHomonymsServiceService = inject(ModalHomonymsServiceService);
  private readonly modalService = inject(ModalFormService);
  private readonly onboardingService = inject(OnboardingStateServiceService);

  listData: WatchList | undefined;
  listHomonyms: HomonymsResponse[] | undefined;

  getListValues = (list?: WatchList) => [...new Set(list?.matchLists?.map(item => item.type) || [])];

  private closeAllDialogs(includeKeepOnHttpError = false): void {
    this.dialog.openDialogs.forEach((dialogRef) => {
      const keepOpen =
        (dialogRef.componentInstance as any)?.data?.keepOnHttpError === true;
      if (!keepOpen || includeKeepOnHttpError) {
        dialogRef.close();
      }
    });
  }

  // TODO document this method, including business logic and rules
  /**
   * Obtiene las listas en las que dio hit y genera los WF
   */
  async validInWatchList(data: DataClient, customerId: string | null = null): Promise<boolean> {
    const currentInfo = this.onboardingService.getCurrentInfo();
    let dataWatchList: CustomerWatchListBody = {
      personalInfo: {
        fullName: '',
        birthDate: toIsoUtc(data.dateOfBirth),
        rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
        curp: data.curp || '',
        nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
        clientNumber: '',
        ssn: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
        personType: '1',
        name: data.firstName,
        middleName: data.middleName || '',
        lastName: data.firstLastName || '',
        secondLastName: data.secondLastName || '',
        gender: data.gender || '',
        countryOfBirth: data.countryOfBirth,
        federalEntity: data.stateOfBirth,
      },
      ...(currentInfo.isMaintenance && customerId && currentInfo.accountId
        ? {
          customerId: customerId,
          accountId: currentInfo?.accountId?.toString(),
          bankingArea: currentInfo?.businessType
        }
        : {
          customerId: null,
          accountId: null,
          bankingArea: currentInfo?.businessType}),
    };

    try {
      this.listData = await lastValueFrom(
        this.watchlistService.postData(dataWatchList).pipe(
          retry({
            count: 3,
            delay: (error, retryCount) => {
              return from(
                this.notificationModalService.warning({
                  title: `Intento Fallido (${retryCount})`,
                  afterMessages: ['Intenta Nuevamente'],
                  btnAccept: 'OK',
                })
              );
            },
          })
        )
      );

      const watchListData = this.getListValues(this.listData);
      if (this.listData?.step === 1) {
        this.unsavedChangesService.setUnsavedChanges(false);
        this.closeAllDialogs(true);
        if (watchListData.length > 1) {
          this.unsavedChangesService.setUnsavedChanges(false);
          await this.notificationModalService.error({
            title: 'El solicitante se encuentra en la lista ',
            beforeMessages: watchListData,
            afterMessages: ['Consultar con el área de PLD'],
            btnAccept: 'Terminar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
          return false;
        } else if (watchListData.length === 0) {
          this.unsavedChangesService.setUnsavedChanges(false);
          await this.notificationModalService.error({
            title: 'El solicitante se encuentra en la lista ',
            afterMessages: ['Consultar con el área de PLD'],
            btnAccept: 'Terminar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
          return false;
        } else {
          this.unsavedChangesService.setUnsavedChanges(false);
          await this.notificationModalService.error({
            title: 'El solicitante se encuentra en la lista ' + watchListData[0],
            afterMessages: ['Consultar con el área de PLD'],
            btnAccept: 'Terminar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
        }
        return false;
      }
      if (this.listData?.step === 2) {
        this.unsavedChangesService.setUnsavedChanges(false);
        if (this.onboardingService.getCurrentInfo().isMaintenance) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            beforeMessages: watchListData,
            infoToCopy: this.listData?.workflowApplicationNumber?.toString() ?? '',
            afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
          });
          this.closeAllDialogs(true);
          this.router.navigate(['/'], { relativeTo: this.route.parent });
          return false;
        }
        if (this.onboardingService.getCurrentInfo().isOnboardingWL) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            beforeMessages: watchListData,
            afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
          });
          return true;
        }
      }
      if (this.listData?.step === 3) {
        return true;
      }
    } catch (error) {
      this.notificationService.error('Fallo al Validar en Listas de Restricción');
      return false
    }
    return false;
  }

  // TODO document this method, including business logic and rules
  /**
   *
   */
  async validInHomonyms(data: DataClient, thirdRelated: boolean = false): Promise<HomonymsResponseData> {
    const dataHomonymsList: HomonymsRequest = {
      channelId: "SPINE",
      applicationId: "0001",
      personType: 1,
      name: data.firstName,
      middleName: data.middleName ?? '',
      lastName: data.firstLastName ?? '',
      secondLastName: data.secondLastName ?? '',
      rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
      nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
      tin: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.TIN, data.typeIden),
      nss: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
      birthPlace: data.countryOfBirth ?? '',
      birthDate: toIsoUtc(data.dateOfBirth ?? ''),
      curp: data.curp ?? ''
    }
    try {
      this.listHomonyms = await lastValueFrom(
        this.dataHomonymService.postHomonyms(dataHomonymsList).pipe(
          retry({
            count: 3,
            delay: (error, retryCount) => {
              return from(
                this.notificationModalService.warning({
                  title: `Intento Fallido (${retryCount})`,
                  afterMessages: ['Intenta Nuevamente'],
                  btnAccept: 'OK',
                })
              );
            },
          })
        )
      );

      let homo = searchPercentSimilarity(this.listHomonyms);
      if (this.listHomonyms) {
        if (homo.code === 2 || homo.code === 3) {
          this.unsavedChangesService.setUnsavedChanges(false);
          this.dataHomonymService.setData(this.listHomonyms);
          await this.notificationModalService.success({
            title: '¡Se ha encontrado coincidencias!',
            afterMessages: ['Se ha encontrado homonimias del Cliente. '],
            btnAccept: 'Revisión',
          });
          const result = await this.modalHomonymsServiceService.formModalHomonyms();

          if (result === "continue") {
            if (thirdRelated && this.onboardingService.getCurrentInfo().isMaintenance) {
              await this.notificationModalService.warning({
                title: 'Cliente no Existente. Favor de dar de Alta en el Módulo Alta Persona.',
                btnAccept: 'Aceptar',
              });
            }
            return { passOnHomonyms: true, numberClient: null };
          } else {
            return { passOnHomonyms: false, numberClient: result };
          }
        }
        if (homo.code === 1) {
          this.unsavedChangesService.setUnsavedChanges(false);
          this.dataHomonymService.setData(this.listHomonyms);
          await this.notificationModalService.success({
            title: '¡Se ha encontrado una coincidencia!',
            afterMessages: ['Se ha encontrado una coincidencia exacta con', 'Número de Cliente', this.listHomonyms[0].clientNumber],
            btnAccept: 'Revisión',
          });
          const modalResult = await lastValueFrom(
            this.modalService.homonimiaModal([this.listHomonyms[homo.indices[0]]])
          );
          if (modalResult != null) {
            return { passOnHomonyms: false, numberClient: modalResult };
          }
          return { passOnHomonyms: false, numberClient: modalResult };
        }
      }
      if (thirdRelated && this.onboardingService.getCurrentInfo().isMaintenance) {
        await this.notificationModalService.warning({
          title: 'Cliente no Existente. Favor de dar de Alta en el Módulo Alta Persona.',
          btnAccept: 'Aceptar',
        });
      }
      return { passOnHomonyms: true, numberClient: null };
    } catch (error) {
      this.notificationService.error('Fallo al Validar en Búsqueda de Homónimos');
      return { passOnHomonyms: false, numberClient: null };
    }
  }

  // TODO document this method, including business logic and rules
  /**
   * Solo obtiene las listas en las que dio hit y las retorna
   */
  async getDataWatchList(data: DataClient): Promise<WatchListReturn> {
    const dataWatchList: CustomerWatchListBody = {
      personalInfo: {
        fullName: '',
        birthDate: toIsoUtc(data.dateOfBirth),
        rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
        curp: data.curp || '',
        nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
        clientNumber: '',
        ssn: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
        personType: '1',
        name: data.firstName,
        middleName: data.middleName || '',
        lastName: data.firstLastName || '',
        secondLastName: data.secondLastName || '',
        gender: data.gender || '',
        countryOfBirth: data.countryOfBirth,
        federalEntity: data.stateOfBirth,
      },
      customerId: null,
      accountId: null
    };
    try {
      const response = await lastValueFrom(
        this.watchlistService.postData(dataWatchList).pipe(
          map((res) => ({ passOnWatchlist: true, ...res })),
          retry({
            count: 5,
            delay: (error, retryCount) => {
              return from(
                this.notificationModalService.warning({
                  title: `Intento Fallido (${retryCount})`,
                  afterMessages: ['Intenta Nuevamente'],
                  btnAccept: 'OK',
                })
              );
            },
          })
        )
      );
      return response;
    } catch (error) {
      await this.notificationModalService.warning({
        title: 'Intento Final Fallido',
        afterMessages: ['Captura la Información del Cliente Manualmente'],
        btnAccept: 'OK',
      });
      return {
        passOnWatchlist: false,
        isOnWatchlist: false,
        step: 0,
        matchLists: []
      };
    }
  }

  // TODO document this method, including business logic and rules
  /**
   * Solo ejecuta los WF recibe las listas en las que dio hit
   */
  async getWatchListWF(listData: WatchListReturn, exceptions: string | undefined = undefined): Promise<boolean> {
    const watchListData = this.getListValues(listData);
    if (listData?.step === 1) {
      if (watchListData.length > 1) {
        this.unsavedChangesService.setUnsavedChanges(false);
        this.closeAllDialogs(true);
        await this.notificationModalService.error({
          title: 'El solicitante se encuentra en la lista ',
          beforeMessages: watchListData,
          afterMessages: ['Consultar con el área de PLD'],
          btnAccept: 'Terminar',
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return false;
      } else if (watchListData.length === 0) {
        this.unsavedChangesService.setUnsavedChanges(false);
        this.closeAllDialogs(true);
        await this.notificationModalService.error({
          title: 'El solicitante se encuentra en la lista ',
          afterMessages: ['Consultar con el área de PLD'],
          btnAccept: 'Terminar',
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return false;
      } else {
        this.unsavedChangesService.setUnsavedChanges(false);
        this.closeAllDialogs(true);
        await this.notificationModalService.error({
          title: 'El solicitante se encuentra en la lista ' + watchListData[0],
          afterMessages: ['Consultar con el área de PLD'],
          btnAccept: 'Terminar',
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return false;
      }
    }
    if (listData?.step === 2) {
      this.unsavedChangesService.setUnsavedChanges(false);
      this.closeAllDialogs(true);
      await this.notificationModalService.warning({
        title: '¡Atención!',
        beforeMessages: watchListData,
        infoToCopy: this.onboardingService.getCurrentInfo().requestId != '' ? this.onboardingService.getCurrentInfo().requestId : exceptions,
        afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
      });
      this.router.navigate(['/'], { relativeTo: this.route.parent });
      return false;
    }
    if (listData?.step === 3) {
      return true;
    }
    return false;
  }
}
