import { inject, Injectable, Injector } from '@angular/core';
import { CustomerWatchlistService } from './customer-watchlist.service';
import { CustomerHomonymsService } from './customer-homonyms.service';
import { WatchListBody } from '../models/customer-watch-list';

import { CustomerHomonymsRequest, CustomerHomonymsResponse, CustomerHomonymsResponseData } from '../models/customer-homonyms';

import { from, lastValueFrom, map, Observable, of, retry } from 'rxjs';
import { CustomerNotificationModalService } from './customer-notification-modal.service';
import { CustomerModalFormService } from './customer-modal-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataClient } from '../models/customer-client-data';

import { CustomerAllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from '../utils/customer-map-rfc-nif-tin-nss';
import { CustomerNotificationsService } from './customer-notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { searchPercentSimilarity } from '../utils/customer-homonyms-search';
import { CustomerModalHomonymsServiceService } from './customer-modal-homonyms-service.service';
import { CustomerOnboardingService } from './customer-onboarding.service';
import { toIsoUtc } from '../utils/customer-datetime';
import { CustomerFirstDataClientService } from './storage-services/customer-first-data-client.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerSearchClientFlowService {

  private readonly watchlistService = inject(CustomerWatchlistService);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly dataHomonymService = inject(CustomerHomonymsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly dialog = inject(MatDialog);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly modalHomonymsServiceService = inject(CustomerModalHomonymsServiceService);
  private readonly modalService = inject(CustomerModalFormService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly firstDataClientService = inject(CustomerFirstDataClientService);

  listData: any | undefined;
  listHomonyms: CustomerHomonymsResponse[] | undefined;

  getListValues = (list?: any): string[] => [...new Set<string>(list?.matchLists?.map((item: any) => item.type) || [])];


  private closeAllDialogs(includeKeepOnHttpError = false): void {
    this.dialog.openDialogs.forEach((dialogRef) => {
      const keepOpen =
        (dialogRef.componentInstance as any)?.data?.keepOnHttpError === true;
      if (!keepOpen || includeKeepOnHttpError) {
        dialogRef.close();
      }
    });
  }

  // Obtiene las listas en las que dio hit y genera los WF
  async validInWatchList(data: DataClient): Promise<boolean> {
    const dataWatchList: WatchListBody = {
      personalInfo: <any>{
        fullName: '',
        birthDate: toIsoUtc(data.dateOfBirth),
        rfc: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.RFC, data.typeIden),
        curp: data.curp || '',
        nif: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.NIF, data.typeIden),
        clientNumber: '',
        ssn: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.SSN, data.typeIden),
        personType: '1',
        name: data.firstName,
        middleName: data.middleName || '',
        lastName: data.firstLastName || '',
        secondLastName: data.secondLastName || '',
        gender: data.gender || '',
        countryOfBirth: data.countryOfBirth,
        federalEntity: data.stateOfBirth,
      }
    }
    try {
      this.listData = await lastValueFrom(
        (this.watchlistService as any).postData(dataWatchList).pipe(
          retry({
            count: 3,
            delay: (error, retryCount) => {
              return from(
                (this.notificationModalService as any).warning({
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
          await (this.notificationModalService as any).error({
            title: 'El solicitante se encuentra en la lista ',
            beforeMessages: watchListData,
            afterMessages: ['Consultar con el área de PLD'],
            btnAccept: 'Terminar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
          return false;
        } else if (watchListData.length === 0) {
          this.unsavedChangesService.setUnsavedChanges(false);
          await (this.notificationModalService as any).error({
            title: 'El solicitante se encuentra en la lista ',
            afterMessages: ['Consultar con el área de PLD'],
            btnAccept: 'Terminar',
          });
          this.router.navigate(['/'], { relativeTo: this.route.parent });
          return false;
        } else {
          this.unsavedChangesService.setUnsavedChanges(false);
          await (this.notificationModalService as any).error({
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
        this.closeAllDialogs(true);
        await (this.notificationModalService as any).warning({
          title: '¡Atención!',
          beforeMessages: watchListData,
          infoToCopy: (((this.onboardingService as any) as any).getCurrentInfo() as any).requestId,
          afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return false;
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


  async validInHomonyms(data: DataClient): Promise<CustomerHomonymsResponseData> {
    const dataHomonymsList: CustomerHomonymsRequest = {
      channelId: "SPINE",
      applicationId: "0001",
      personType: 1,
      name: data.firstName,
      middleName: data.middleName || '',
      lastName: data.firstLastName || '',
      secondLastName: data.secondLastName || '',
      rfc: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.RFC, data.typeIden),
      nif: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.NIF, data.typeIden),
      tin: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.TIN, data.typeIden),
      nss: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.SSN, data.typeIden),
      birthPlace: data.countryOfBirth ?? '',
      birthDate: toIsoUtc(data.dateOfBirth ?? ''),
      curp: data.curp || ''
    }
    try {
      this.listHomonyms = await lastValueFrom(
        (this.dataHomonymService as any).postHomonyms(dataHomonymsList).pipe(
          retry({
            count: 3,
            delay: (error, retryCount) => {
              return from(
                (this.notificationModalService as any).warning({
                  title: `Intento Fallido (${retryCount})`,
                  afterMessages: ['Intenta Nuevamente'],
                  btnAccept: 'OK',
                })
              );
            },
          })
        )
      );

      let homo = searchPercentSimilarity(this.listHomonyms as any);
      const dataOnb = this.onboardingService.getCurrentInfo()
      if (this.listHomonyms && !dataOnb.isMaintenance) {
        if (homo.code === 2 || homo.code === 3) {
          this.unsavedChangesService.setUnsavedChanges(false);
          (this.dataHomonymService as any).setData(this.listHomonyms);
          await (this.notificationModalService as any).success({
            title: '¡Se ha encontrado coincidencias!',
            afterMessages: ['Se ha encontrado homonimias del Cliente. '],
            btnAccept: 'Revisión',
          });
          const result = await (this.modalHomonymsServiceService as any).formModalHomonyms();

          if (result === "continue") {
            return <any>{ passOnHomonyms: true, numberClient: null };
          } else if (result === "cancel") {
            return <any>{ passOnHomonyms: false, numberClient: undefined };
          } else {
            return <any>{ passOnHomonyms: false, numberClient: result };
          }
        }
        if (homo.code === 1) {
          this.unsavedChangesService.setUnsavedChanges(false);
          (this.dataHomonymService as any).setData(this.listHomonyms);
          await (this.notificationModalService as any).success({
            title: '¡Se ha encontrado una coincidencia!',
            afterMessages: ['Se ha encontrado una coincidencia exacta con', 'Número de Cliente', this.listHomonyms[0].clientNumber],
            btnAccept: 'Revisión',
          });
          const modalResult = await lastValueFrom(
            (this.modalService as any).homonimiaModal([this.listHomonyms[homo.indices[0]]])
          );
          if (modalResult != null) {
            return <any>{ passOnHomonyms: false, numberClient: modalResult };
          }
          return <any>{ passOnHomonyms: false, numberClient: modalResult };
        }
      }
      if (this.listHomonyms && dataOnb.isMaintenance) {
        if (homo.code === 2 || homo.code === 3) {
          const index = this.listHomonyms.findIndex(item => item.clientNumber === dataOnb.clientId.toString());
          if (index !== -1) {
            (this.dataHomonymService as any).setData(this.listHomonyms)
          } else {
            const dataSave = this.firstDataClientService.getItem();
            (this.dataHomonymService as any).setData([...this.listHomonyms, {
              firstName: dataSave?.firstName || '',
              secondName: dataSave?.middleName || '',
              lastName: dataSave?.firstLastName || '',
              secondLastName: dataSave?.secondLastName || '',
              rfc: dataSave?.rfc || '',
              curp: dataSave?.curp || '',
              percentSimilarity: 1.0,
              clientNumber: dataOnb.clientId.toString(),
            }]);
          }

          if(index !== -1 && this.listHomonyms.length === 1){
            return <any>{ passOnHomonyms: true, numberClient: 0 };
          }
          await (this.notificationModalService as any).success({
            title: '¡Se ha encontrado coincidencias!',
            afterMessages: ['Se ha encontrado homonimias del Cliente. '],
            btnAccept: 'Revisión',
          });
          const result = await (this.modalHomonymsServiceService as any).formModalHomonyms();
          console.log(result)
          if (result === "continue") {
            return <any>{ passOnHomonyms: false, numberClient: null };
          } else if (result === "cancel") {
            return <any>{ passOnHomonyms: false, numberClient: null };
          } else if (result === "unificar" || result === undefined) {
            return <any>{ passOnHomonyms: false, numberClient: null };
          } else {
            return <any>{ passOnHomonyms: true, numberClient: result };
          }
        }
        if (homo.code === 1) {
          if (this.listHomonyms[0].clientNumber.trim() === dataOnb.clientId.toString()) {
            return <any>{ passOnHomonyms: true, numberClient: null };
          } else {
            const index = this.listHomonyms.findIndex(item => item.clientNumber === dataOnb.clientId.toString());
            if (index !== -1) {
              (this.dataHomonymService as any).setData(this.listHomonyms)
            } else {
              const dataSave = this.firstDataClientService.getItem();
              (this.dataHomonymService as any).setData([...this.listHomonyms, {
                firstName: dataSave?.firstName || '',
                secondName: dataSave?.middleName || '',
                lastName: dataSave?.firstLastName || '',
                secondLastName: dataSave?.secondLastName || '',
                rfc: dataSave?.rfc || '',
                curp: dataSave?.curp || '',
                percentSimilarity: 1.0,
                clientNumber: dataOnb.clientId.toString(),
              }]);
            }
            const result = await (this.modalHomonymsServiceService as any).formModalHomonyms();
            console.log(result)
            if (result === "continue") {
              return <any>{ passOnHomonyms: false, numberClient: null };
            } else if (result === "cancel") {
              return <any>{ passOnHomonyms: false, numberClient: null };
            } else if (result === "unificar" || result === undefined) {
              return <any>{ passOnHomonyms: false, numberClient: null };
            } else {
              return <any>{ passOnHomonyms: true, numberClient: result };
            }
          }
        }
      }
      return <any>{ passOnHomonyms: true, numberClient: null };
    } catch (error) {
      this.notificationService.error('Fallo al Validar en Búsqueda de Homónimos');
      return <any>{ passOnHomonyms: false, numberClient: null };
    }
  }

  // Solo obtiene las listas en las que dio hit y las retorna
  async getDataWatchList(data: DataClient): Promise<any> {
    const currentInfo = this.onboardingService.getCurrentInfo();
    const dataWatchList: WatchListBody = {
      personalInfo: <any>{
        fullName: '',
        birthDate: toIsoUtc(data.dateOfBirth),
        rfc: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.RFC, data.typeIden),
        curp: data.curp || '',
        nif: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.NIF, data.typeIden),
        clientNumber: '',
        ssn: compareAndReturnRfcNifTinNss(data.rfc, CustomerAllowedValuesRfcNifTinNss.SSN, data.typeIden),
        personType: '1',
        name: data.firstName,
        middleName: data.middleName || '',
        lastName: data.firstLastName || '',
        secondLastName: data.secondLastName || '',
        gender: data.gender || '',
        countryOfBirth: data.countryOfBirth,
        federalEntity: data.stateOfBirth,
      },
      ...(currentInfo.isMaintenance && currentInfo.clientId
        ? {
          customerId: currentInfo.clientId?.toString(),
          accountId: null
        }
        : {
          customerId: null,
          accountId: null
        })
    };
    try {
      const response = await lastValueFrom(
        (this.watchlistService as any).postData(dataWatchList).pipe(
          map((res) => ({ passOnWatchlist: true, ...(res as any) })),
          retry({
            count: 5,
            delay: (error, retryCount) => {
              return from(
                (this.notificationModalService as any).warning({
                  title: `Intento Fallido (${retryCount})`,
                  afterMessages: ['Intenta Nuevamente'],
                  btnAccept: 'OK',
                })
              );
            },
          })
        )
      );
      return response as any;
    } catch (error) {
      await (this.notificationModalService as any).warning({
        title: 'Intento Final Fallido',
        afterMessages: ['Captura la Información del Cliente Manualmente'],
        btnAccept: 'OK',
      });
      return <any>{
        passOnWatchlist: false,
        isOnWatchlist: false,
        step: 0,
        matchLists: []
      };
    }
  }

  // Solo ejecuta los WF recibe las listas en las que dio hit
  async getWatchListWF(listData: any): Promise<boolean> {
    const watchListData = this.getListValues(listData);
    if (listData?.step === 1) {
      if (watchListData.length > 1) {
        this.unsavedChangesService.setUnsavedChanges(false);
        this.closeAllDialogs(true);
        await (this.notificationModalService as any).error({
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
        await (this.notificationModalService as any).error({
          title: 'El solicitante se encuentra en la lista ',
          afterMessages: ['Consultar con el área de PLD'],
          btnAccept: 'Terminar',
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return false;
      } else {
        this.unsavedChangesService.setUnsavedChanges(false);
        this.closeAllDialogs(true);
        await (this.notificationModalService as any).error({
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
      await (this.notificationModalService as any).warning({
        title: '¡Atención!',
        beforeMessages: watchListData,
        infoToCopy: (((this.onboardingService as any) as any).getCurrentInfo() as any).requestId,
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




export type SearchClientFlowService = CustomerSearchClientFlowService;





